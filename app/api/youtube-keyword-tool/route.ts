import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/ai/get-client-ip";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getCachedOutput, setCachedOutput } from "@/lib/ai/cache";
import {
  fetchBaseSuggestions,
  fetchExpandedSuggestions,
  getRegion,
} from "@/lib/youtube/keyword-suggest";

export const runtime = "edge";

/**
 * Keyword suggestion endpoint.
 *
 * Two modes:
 *   { seed, regionId, expand: false } — single fetch (~10-15 results)
 *   { seed, regionId, expand: true }  — A-Z parallel fan-out (~100+ results)
 *
 * The expanded mode hits YouTube's suggest endpoint 27 times in parallel
 * (base + each letter). We count both modes as one user action against the
 * rate limit, since the expansion is the headline value of the tool.
 */

const DAILY_LIMIT = 50;
const RATE_LIMIT_KEY = "youtube-keyword-tool";

type Body = {
  seed?: string;
  regionId?: string;
  expand?: boolean;
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return jsonError("invalid-input", "Request body is not valid JSON.", 400);
  }

  const seed = body.seed?.trim();
  if (!seed) {
    return jsonError("invalid-input", "Provide a `seed` keyword.", 400);
  }
  if (seed.length > 80) {
    return jsonError("invalid-input", "Seed keyword is too long (max 80 chars).", 400);
  }

  const region = getRegion(body.regionId ?? "us");
  const expand = body.expand === true;

  // Rate limit
  const ip = getClientIp(req);
  const rl = await checkRateLimit(RATE_LIMIT_KEY, ip, DAILY_LIMIT);
  if (!rl.allowed) {
    return jsonError(
      "rate-limited",
      `You've used your daily ${DAILY_LIMIT} lookups for this tool. Resets at UTC midnight.`,
      429,
      { resetAt: rl.resetAt, limit: DAILY_LIMIT }
    );
  }

  // Cache key includes seed + region + expand mode
  const cacheKey = `${region.id}:${expand ? "x" : "b"}:${seed.toLowerCase()}`;
  const cached = await getCachedOutput<string[]>(RATE_LIMIT_KEY, cacheKey);
  if (cached) {
    return NextResponse.json({
      suggestions: cached,
      cached: true,
      seed,
      region: region.id,
      expanded: expand,
    });
  }

  // Fetch from YouTube
  let suggestions: string[];
  try {
    suggestions = expand
      ? await fetchExpandedSuggestions(seed, region)
      : await fetchBaseSuggestions(seed, region);
  } catch {
    return jsonError(
      "fetch-failed",
      "Couldn't reach YouTube suggest. Try again in a moment.",
      502
    );
  }

  // Cache (even empty results — that's a valid answer for obscure seeds)
  await setCachedOutput(RATE_LIMIT_KEY, cacheKey, suggestions).catch(() => {});

  return NextResponse.json({
    suggestions,
    cached: false,
    seed,
    region: region.id,
    expanded: expand,
    remaining: rl.remaining,
  });
}

function jsonError(
  code: string,
  message: string,
  status: number,
  extra: Record<string, unknown> = {}
): Response {
  return NextResponse.json({ error: message, code, ...extra }, { status });
}
