import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/ai/get-client-ip";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { getCachedOutput, setCachedOutput } from "@/lib/ai/cache";
import { extractVideoId, isValidVideoId } from "@/lib/youtube/extract-video-id";
import { extractVideoInfo } from "@/lib/youtube/extract-video-info";
import { auditVideo, type VideoAuditResult } from "@/lib/youtube/video-audit";

export const runtime = "edge";

/**
 * Video Audit endpoint.
 *
 * Client sends { url: string }. We extract the video ID, fetch the watch
 * page HTML once, pull every metadata field we can, then run the
 * pure-function audit engine and return the full multi-dimension result.
 *
 * Protected by:
 *  - Per-IP daily rate limit (30/day — single HTTP fetch + CPU only)
 *  - 12-hour result cache keyed by video ID (metadata rarely changes)
 *
 * No Anthropic call, no LLM cost — purely heuristic.
 */

const DAILY_LIMIT = 30;
// v2 — bumped after fixing title/channel extraction; invalidates the
// stale cache entries from v1 that had Untitled video / null channel.
const RATE_LIMIT_KEY = "youtube-video-audit-v2";

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

  // Fetch the video page.
  // CONSENT cookie pre-accepts EU cookie consent so YouTube serves the
  // real page directly instead of redirecting to consent.youtube.com
  // (which has different markup and breaks our title/desc extractors).
  let html: string;
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9",
        Cookie: "CONSENT=YES+cb; SOCS=CAESEwgDEgk0ODE0OTI4OTkaAmVuIAEaBgiA_LyaBg",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return jsonError(
        "fetch-failed",
        res.status === 404
          ? "Video not found — it may be private, deleted, or region-restricted."
          : `YouTube returned ${res.status} for that video.`,
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

  const info = extractVideoInfo(html, videoId);
  const audit = auditVideo(info);

  await setCachedOutput(RATE_LIMIT_KEY, videoId, audit).catch(() => {});

  return NextResponse.json({
    result: audit,
    cached: false,
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
