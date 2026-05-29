import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { listTrackedChannels, appendHistory } from "@/lib/tracking/tracked-channels";
import {
  fetchChannel,
  fetchVideoIdsFromPlaylist,
  fetchVideoBatchPaginated,
} from "@/lib/youtube/youtube-api";
import { computeVisibilityScore } from "@/lib/youtube/visibility-score";

export const runtime = "edge";
// Vercel's max cron duration for hobby/pro accounts — keep ≤300s by
// bounding the channel count and tightening the per-channel work.
export const maxDuration = 300;

/**
 * Weekly background cron — refreshes Visibility Scores for every
 * currently-tracked channel and appends each to its history list.
 *
 * Schedule (vercel.json): every Monday 09:00 UTC. See:
 *   https://vercel.com/docs/cron-jobs
 *
 * Quota math:
 *   - 3 YouTube units per channel (1 channels.list + 1 playlistItems.list
 *     + 1 videos.list batch)
 *   - Up to 200 tracked channels at MAX_TRACKED cap = 600 units/week
 *   - No LLM calls (history doesn't need summaries)
 *
 * Authentication: Vercel forwards the cron with a CRON_SECRET header
 * (set in the project env as CRON_SECRET) — we verify it so this
 * endpoint can't be invoked by random visitors.
 */

export async function GET(req: NextRequest) {
  // Verify the request is from Vercel cron infrastructure.
  // Vercel sets `Authorization: Bearer <CRON_SECRET>` on scheduled invocations.
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

      const ids = await fetchVideoIdsFromPlaylist(channel.uploadsPlaylistId, 30, apiKey);
      if (ids.length < 5) {
        failed++;
        errors.push({ channelId, error: "not-enough-videos" });
        continue;
      }

      const videoMap = await fetchVideoBatchPaginated(ids, apiKey);
      const result = computeVisibilityScore(
        {
          id: channel.id,
          title: channel.title,
          handle: channel.handle,
          thumbnailUrl: channel.thumbnailUrl,
          subscriberCount: channel.subscriberCount,
          videoCount: channel.videoCount,
        },
        ids,
        videoMap,
        null // no LLM summary in cron — history doesn't need it
      );

      await appendHistory(channel.id, {
        ts,
        visibility: result.overallScore,
        ctr: result.subscores[0].score,
        metadata: result.subscores[1].score,
        headroom: result.subscores[2].score,
        trajectory: result.subscores[3].score,
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
    // Only log first few errors to keep response size sane.
    errors: errors.slice(0, 10),
  });
}
