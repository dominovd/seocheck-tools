import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/ai/get-client-ip";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getCachedOutput, setCachedOutput } from "@/lib/ai/cache";
import { extractVideoId, isValidVideoId } from "@/lib/youtube/extract-video-id";
import { extractVideoInfo, videoInfoFromApi } from "@/lib/youtube/extract-video-info";
import { auditVideo, type VideoAuditResult } from "@/lib/youtube/video-audit";
import { fetchOembed, type OembedInfo } from "@/lib/youtube/oembed";
import { fetchVideoFromApi } from "@/lib/youtube/youtube-api";
import { scoreTitle } from "@/lib/youtube/title-score";
import { logAudit } from "@/lib/analytics/audit-log";

/**
 * Video Audit endpoint.
 *
 * Runtime is Node (not Edge) on purpose. Edge runtime uses Cloudflare
 * Workers IP pool, which YouTube aggressively rate-limits because that
 * pool serves enormous cross-tenant traffic. Node runtime uses AWS Lambda
 * IPs that rotate per cold start and are much less likely to be 429'd.
 *
 * Layered fetch strategy:
 *  1. oEmbed (https://www.youtube.com/oembed) — public, no rate-limit.
 *     Gives title + channel + thumbnail reliably.
 *  2. /watch HTML scrape with retry — full data (tags, description,
 *     chapters, hashtags). Best-effort.
 *  3. If /watch fails after retry, we return a PARTIAL audit using
 *     oEmbed data so the user sees something useful instead of a hard
 *     error.
 *
 * Protected by:
 *  - Per-IP daily rate limit (30/day)
 *  - 12-hour result cache keyed by video ID
 *
 * No Anthropic call, no LLM cost.
 */

export const runtime = "nodejs";
export const maxDuration = 20;

const DAILY_LIMIT = 30;
// v4 — bumped when YouTube Data API fallback was added
const RATE_LIMIT_KEY = "youtube-video-audit-v4";

type Body = { url?: string };

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return jsonError("invalid-input", "Request body is not valid JSON.", 400);
  }

  if (!body.url || typeof body.url !== "string") {
    return jsonError("invalid-input", "Provide a `url` string.", 400);
  }

  const videoId = extractVideoId(body.url);
  if (!isValidVideoId(videoId)) {
    return jsonError(
      "invalid-input",
      "Couldn't find a YouTube video ID in that URL. Try a /watch?v= or /shorts/ link.",
      400
    );
  }

  // Rate limit
  const ip = getClientIp(req);
  const rl = await checkRateLimit(RATE_LIMIT_KEY, ip, DAILY_LIMIT);
  if (!rl.allowed) {
    return jsonError(
      "rate-limited",
      `You've used your daily ${DAILY_LIMIT} audits. Resets at UTC midnight.`,
      429,
      { resetAt: rl.resetAt, limit: DAILY_LIMIT }
    );
  }

  // Cache check
  const cached = await getCachedOutput<VideoAuditResult>(RATE_LIMIT_KEY, videoId);
  if (cached) {
    return NextResponse.json({ result: cached, cached: true });
  }

  // Layer 1 — oEmbed (always try first, reliable, used to fill gaps)
  const oembed = await fetchOembed(videoId);

  // Layer 2 — /watch HTML scrape with one retry (gives tags + full data)
  const html = await fetchWatchHtml(videoId);

  // Layer 3 — YouTube Data API (only used if /watch failed AND key is set)
  // Gracefully skipped when YOUTUBE_API_KEY is not configured.
  const apiKey = process.env.YOUTUBE_API_KEY;
  const apiData = !html && apiKey ? await fetchVideoFromApi(videoId, apiKey) : null;

  if (!html && !apiData && !oembed) {
    return jsonError(
      "fetch-failed",
      "Couldn't reach YouTube for this video. It may be private, deleted, region-restricted, or YouTube is temporarily rate-limiting our servers.",
      502
    );
  }

  // Three response states:
  //   "full"    — /watch worked, every dimension scored, no banner
  //   "noTags"  — API rescued us; everything but tags scored, soft banner
  //   "partial" — only oEmbed worked; only title scored, urgent banner
  let audit: VideoAuditResult;
  let mode: "full" | "noTags" | "partial" = "full";

  if (html) {
    const info = extractVideoInfo(html, videoId);
    if (oembed) {
      if (!info.title && oembed.title) info.title = oembed.title;
      if (!info.channel && oembed.channel) info.channel = oembed.channel;
      if (!info.thumbnailUrl && oembed.thumbnailUrl) info.thumbnailUrl = oembed.thumbnailUrl;
    }
    audit = auditVideo(info);
  } else if (apiData) {
    mode = "noTags";
    const info = videoInfoFromApi(videoId, apiData);
    if (oembed && !info.thumbnailUrl && oembed.thumbnailUrl) {
      info.thumbnailUrl = oembed.thumbnailUrl;
    }
    audit = auditVideo(info, { omitTags: true });
  } else {
    mode = "partial";
    audit = buildPartialAudit(videoId, oembed!);
  }

  // Only cache full audits. noTags and partial are degraded states that
  // should re-attempt fresh on the next request once YouTube recovers.
  if (mode === "full") {
    await setCachedOutput(RATE_LIMIT_KEY, videoId, audit).catch(() => {});
  }

  // Anonymous audit logging — foundation for future YouTube Studies pages.
  // Only logs full audits (degraded modes have incomplete data).
  if (mode === "full") {
    const dimScores: Record<string, number | null> = { overall: audit.overallScore };
    for (const d of audit.dimensions) dimScores[d.key] = d.score;
    await logAudit("video-audit", videoId, dimScores).catch(() => {});
  }

  return NextResponse.json({
    result: audit,
    cached: false,
    mode,
    remaining: rl.remaining,
  });
}

/**
 * Fetch the /watch HTML with browser-like headers and one retry.
 * Returns null if both attempts fail (any non-200 status or thrown error).
 */
async function fetchWatchHtml(videoId: string): Promise<string | null> {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "max-age=0",
    "Sec-Ch-Ua": '"Not.A/Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"macOS"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    Cookie: "CONSENT=YES+cb; SOCS=CAESEwgDEgk0ODE0OTI4OTkaAmVuIAEaBgiA_LyaBg",
  };

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { headers, cache: "no-store" });
      if (res.ok) {
        return await res.text();
      }
      // Don't retry hard errors that won't change
      if (res.status === 404 || res.status === 410) return null;
      // For 429 / 5xx, backoff briefly and retry once
      if (attempt === 0) {
        await sleep(800 + Math.random() * 600);
        continue;
      }
      return null;
    } catch {
      if (attempt === 0) {
        await sleep(500);
        continue;
      }
      return null;
    }
  }
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Build a partial audit when /watch failed but oEmbed succeeded.
 * Returns just the title dimension (which we CAN score from oEmbed
 * data) plus the video meta — the client renders a clear "partial"
 * banner explaining the rate-limit so the empty space below the title
 * card isn't confusing.
 */
function buildPartialAudit(videoId: string, oembed: OembedInfo): VideoAuditResult {
  const titleResult = oembed.title ? scoreTitle(oembed.title) : null;

  return {
    videoId,
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    meta: {
      title: oembed.title,
      channel: oembed.channel,
      thumbnailUrl: oembed.thumbnailUrl,
      viewCount: null,
      publishDate: null,
      lengthSeconds: null,
    },
    overallScore: titleResult?.score ?? 0,
    overallBand: titleResult?.band ?? "weak",
    dimensions: titleResult
      ? [
          {
            key: "title",
            label: "Title",
            score: titleResult.score,
            band: titleResult.band,
            signals: titleResult.signals,
            ctaTool: { slug: "youtube-title-generator", label: "Generate titles with AI" },
          },
        ]
      : [],
  };
}

function jsonError(
  code: string,
  message: string,
  status: number,
  extra: Record<string, unknown> = {}
): Response {
  return NextResponse.json({ error: message, code, ...extra }, { status });
}
