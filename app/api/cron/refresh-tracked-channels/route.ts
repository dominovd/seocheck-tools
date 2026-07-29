import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { listTrackedChannels, appendHistory } from "@/lib/tracking/tracked-channels";
import {
  fetchChannel,
  fetchVideoIdsFromPlaylist,
  fetchVideoBatchPaginated,
} from "@/lib/youtube/youtube-api";

export const runtime = "edge";
// Vercel's max cron duration for hobby/pro accounts — keep ≤300s by
// bounding the channel count and tightening the per-channel work.
export const maxDuration = 300;

/**
 * Weekly background cron — refreshes raw YouTube metrics for every
 * currently-tracked channel and appends each to its history list.
 *
 * IMPORTANT: We store ONLY raw YouTube-provided metrics and factual
 * aggregations (subscriber count, video count, median/mean views over
 * the window). We do NOT compute or store any composite score, grade,
 * or derived metric — that would violate YouTube API Services policy
 * III.E.4h.
 *
 * Schedule (vercel.json): every Monday 09:00 UTC.
 *
 * Quota math:
 *   - 3 YouTube units per channel (1 channels.list + 1 playlistItems.list
 *     + 1 videos.list batch)
 *   - Up to 200 tracked channels at MAX_TRACKED cap = 600 units/week
 *
 * Authentication: Vercel forwards the cron with a CRON_SECRET header.
 */

const WINDOW_SIZE = 30;
const MIN_VIDEOS = 5;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "YOUTUBE_API_KEY not configured" },
      { status: 500 }
    );
  }

  const channelIds = await listTrackedChannels();
  const ts = new Date().toISOString().slice(0, 10);

  let succeeded = 0;
  let failed = 0;
  const errors: Array<{ channelId: string; error: string }> = [];

  for (const channelId of channelIds) {
    try {
      const channel = await fetchChannel({ type: "id", value: channelId }, apiKey);
      if (!channel || !channel.uploadsPlaylistId) {
        failed++;
        errors.push({ channelId, error: "channel-not-found-or-no-uploads" });
        continue;
      }

      const ids = await fetchVideoIdsFromPlaylist(
        channel.uploadsPlaylistId,
        WINDOW_SIZE,
        apiKey
      );
      if (ids.length < MIN_VIDEOS) {
        failed++;
        errors.push({ channelId, error: "not-enough-videos" });
        continue;
      }

      const videoMap = await fetchVideoBatchPaginated(ids, apiKey);
      const viewCounts = ids
        .map((id) => videoMap.get(id)?.viewCount)
        .filter((v): v is number => typeof v === "number" && v >= 0);

      const totalViewsInWindow = viewCounts.reduce((s, v) => s + v, 0);
      const meanViews =
        viewCounts.length > 0 ? Math.round(totalViewsInWindow / viewCounts.length) : 0;
      const sorted = [...viewCounts].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const medianViews =
        sorted.length === 0
          ? 0
          : sorted.length % 2 === 0
          ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
          : sorted[mid];

      await appendHistory(channel.id, {
        ts,
        subscriberCount: channel.subscriberCount,
        videoCount: channel.videoCount,
        windowSize: viewCounts.length,
        medianViews,
        meanViews,
        totalViewsInWindow,
      });

      succeeded++;
    } catch (err) {
      failed++;
      errors.push({
        channelId,
        error: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  return NextResponse.json({
    ok: true,
    ts,
    processed: channelIds.length,
    succeeded,
    failed,
    errors: errors.slice(0, 10),
  });
}
