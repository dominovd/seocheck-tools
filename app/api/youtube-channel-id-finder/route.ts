import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/ai/get-client-ip";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getCachedOutput, setCachedOutput } from "@/lib/ai/cache";
import {
  classifyChannelInput,
  extractChannelIdFromHtml,
} from "@/lib/youtube/parse-channel-url";

export const runtime = "edge";

/**
 * Channel ID lookup endpoint.
 *
 * Client sends { url: string }. We classify and either:
 *  - Return the channel ID immediately for `/channel/UC...` URLs (no fetch)
 *  - Fetch the YouTube page and parse out the channel ID + metadata
 *
 * Protected by:
 *  - Per-IP daily rate limit (50/day — generous; this is a cheap lookup)
 *  - 6-hour result cache keyed by normalized URL (channel IDs rarely change)
 *
 * No Anthropic, no AI — this is purely a fetch + regex extraction.
 */

const DAILY_LIMIT = 50;
const RATE_LIMIT_KEY = "youtube-channel-id-finder";

type Body = { url?: string };

type LookupResult = {
  channelId: string;
  handle?: string;
  name?: string;
  avatarUrl?: string;
  inputKind: "direct" | "handle" | "custom" | "user" | "video";
};

export async function POST(req: NextRequest) {
  // Parse body
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return jsonError("invalid-input", "Request body is not valid JSON.", 400);
  }

  if (!body.url || typeof body.url !== "string") {
    return jsonError("invalid-input", "Provide a `url` string.", 400);
  }

  const classification = classifyChannelInput(body.url);
  if (classification.kind === "invalid") {
    return jsonError(
      "invalid-input",
      "Couldn't recognise that as a YouTube URL, handle, or channel ID.",
      400
    );
  }

  // Fast path: direct channel ID — no fetch needed
  if (classification.kind === "direct") {
    const result: LookupResult = {
      channelId: classification.channelId,
      inputKind: "direct",
    };
    return NextResponse.json({ result, cached: false });
  }

  // Rate limit (per IP per day, generous)
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

  // Cache check
  const cacheKey = classification.normalizedUrl;
  const cached = await getCachedOutput<LookupResult>(RATE_LIMIT_KEY, cacheKey);
  if (cached) {
    return NextResponse.json({ result: cached, cached: true });
  }

  // Fetch the YouTube page
  let html: string;
  try {
    const res = await fetch(classification.normalizedUrl, {
      headers: {
        // Real Chrome UA — YouTube serves a fuller page to recognisable browsers
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return jsonError(
        "fetch-failed",
        `YouTube returned ${res.status} for that URL — the channel may not exist.`,
        res.status === 404 ? 404 : 502
      );
    }
    html = await res.text();
  } catch {
    return jsonError(
      "fetch-failed",
      "Couldn't reach YouTube. Try again in a moment.",
      502
    );
  }

  // Parse channel ID + metadata from the HTML
  const parsed = extractChannelIdFromHtml(html);
  if (!parsed.channelId) {
    return jsonError(
      "not-found",
      "Found the page but couldn't extract a channel ID. The URL may be a playlist, a deleted channel, or a YouTube-flagged page.",
      404
    );
  }

  const result: LookupResult = {
    channelId: parsed.channelId,
    handle: parsed.handle ?? undefined,
    name: parsed.name ?? undefined,
    avatarUrl: parsed.avatarUrl ?? undefined,
    inputKind: classification.kind,
  };

  // Cache aggressively — channel IDs are basically immutable
  await setCachedOutput(RATE_LIMIT_KEY, cacheKey, result).catch(() => {});

  return NextResponse.json({ result, cached: false, remaining: rl.remaining });
}

function jsonError(
  code: string,
  message: string,
  status: number,
  extra: Record<string, unknown> = {}
): Response {
  return NextResponse.json({ error: message, code, ...extra }, { status });
}
