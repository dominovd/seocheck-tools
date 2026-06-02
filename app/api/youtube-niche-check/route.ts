import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/ai/get-client-ip";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getCachedOutput, setCachedOutput } from "@/lib/ai/cache";
import {
  searchByKeyword,
  fetchVideosForNicheCheck,
  fetchChannelsBatch,
} from "@/lib/youtube/youtube-api";
import { fetchBaseSuggestions, DEFAULT_REGION } from "@/lib/youtube/keyword-suggest";
import {
  enrichNicheVideos,
  computeVerdict,
  type NicheCheckResult,
} from "@/lib/youtube/niche-check";

export const runtime = "edge";

/**
 * Niche Check endpoint.
 *
 * Quota per non-cached call:
 *   - search.list with query (100 units) — most expensive call
 *   - videos.list batched (1 unit) — full metadata for top 20
 *   - channels.list batched (1 unit) — subscriber counts for ~20 channels
 *   Total: 102 YouTube units. Plus 1 free YouTube suggest call.
 *
 * Daily limit: 5 per IP. search.list at 100 units = ~98 unique queries
 * per project per day on the default 10K quota. 5/IP keeps headroom.
 * 24h cache by normalized query string — repeat lookups cost 0.
 *
 * No LLM call. The verdict is deterministic — same input always returns
 * the same output, which is what creators need from a decision tool.
 */

const DAILY_LIMIT = 5;
const RATE_LIMIT_KEY = "youtube-niche-check";
const WINDOW_SIZE = 20;

type Body = { query?: string };

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return jsonError("invalid-input", "Request body is not valid JSON.", 400);
  }

  const raw = (body.query ?? "").trim();
  if (!raw) {
    return jsonError("invalid-input", "Provide a `query` string (topic or keyword).", 400);
  }
  if (raw.length < 2 || raw.length > 100) {
    return jsonError("invalid-input", "Query must be between 2 and 100 characters.", 400);
  }

  // Normalize for cache: lowercase + collapse whitespace.
  const query = raw.toLowerCase().replace(/\s+/g, " ");

  // Rate limit
  const ip = getClientIp(req);
  const rl = await checkRateLimit(RATE_LIMIT_KEY, ip, DAILY_LIMIT);
  if (!rl.allowed) {
    return jsonError(
      "rate-limited",
      `You've used your daily ${DAILY_LIMIT} niche checks. Resets at UTC midnight.`,
      429,
      { resetAt: rl.resetAt, limit: DAILY_LIMIT }
    );
  }

  // Cache
  const cached = await getCachedOutput<NicheCheckResult>(RATE_LIMIT_KEY, query);
  if (cached) {
    return NextResponse.json({ result: cached, cached: true, remaining: rl.remaining });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return jsonError(
      "config-error",
      "YouTube API not configured server-side. Try again later.",
      500
    );
  }

  // 1. YouTube suggest (free, no quota) — runs in parallel with the search call
  const suggestionsPromise = fetchBaseSuggestions(query, DEFAULT_REGION).catch(() => [] as string[]);

  // 2. search.list — 100 units, get top 20 video IDs by relevance
  const searchResult = await searchByKeyword(query, WINDOW_SIZE, apiKey);
  if (searchResult.videoIds.length === 0) {
    return jsonError(
      "no-results",
      "YouTube returned no usable results for that query. Try a more specific keyword.",
      404
    );
  }

  // 3. videos.list — 1 unit, full data for those 20
  const videos = await fetchVideosForNicheCheck(searchResult.videoIds, apiKey);

  // 4. channels.list — 1 unit, deduplicate channel IDs
  const uniqueChannelIds = Array.from(new Set(videos.map((v) => v.channelId).filter(Boolean)));
  const channelMap = await fetchChannelsBatch(uniqueChannelIds, apiKey);

  // 5. Wait for suggestions, then compute verdict
  const suggestions = (await suggestionsPromise) ?? [];
  const relatedKeywords = suggestions
    .filter((s) => s.toLowerCase() !== query)
    .slice(0, 8);

  const enriched = enrichNicheVideos(
    videos,
    new Map(Array.from(channelMap, ([k, v]) => [k, { title: v.title, subscriberCount: v.subscriberCount }]))
  );
  const result = computeVerdict(enriched, searchResult.totalResults, query, relatedKeywords);

  // Cache the verdict for 24h
  await setCachedOutput(RATE_LIMIT_KEY, query, result).catch(() => {});

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
