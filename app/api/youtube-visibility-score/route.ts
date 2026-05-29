import type { NextRequest } from "next/server";
import { protectAI } from "@/lib/ai/protect";
import { callClaude } from "@/lib/anthropic-client";
import { parseJsonOutput } from "@/lib/ai/parse-json";
import { resolveChannelInput, lookupCacheKey } from "@/lib/youtube/channel-resolver";
import {
  fetchChannel,
  fetchVideoIdsFromPlaylist,
  fetchVideoBatchPaginated,
} from "@/lib/youtube/youtube-api";
import {
  computeVisibilityScore,
  VISIBILITY_SUMMARY_SYSTEM_PROMPT,
  buildVisibilitySummaryUserMessage,
  type VisibilityScoreResult,
} from "@/lib/youtube/visibility-score";
import { logAudit } from "@/lib/analytics/audit-log";

export const runtime = "edge";

/**
 * YouTube Visibility Score API.
 *
 * Quota per non-cached call:
 *   - channels.list (1 unit)             resolve channel + uploads playlist
 *   - playlistItems.list × 1 (1 unit)    fetch latest 30 video IDs
 *   - videos.list × 1 (1 unit)           batched stats for those 30
 *   Total: 3 YouTube units + 1 Haiku call for the summary.
 */

type Input = { channel: string };

const TOOL_SLUG = "youtube-visibility-score";
const DAILY_LIMIT = 5;
const WINDOW_SIZE = 30;
const MIN_VIDEOS = 5;

export async function POST(req: NextRequest) {
  return protectAI<Input, VisibilityScoreResult>(req, {
    tool: TOOL_SLUG,
    dailyLimit: DAILY_LIMIT,
    parseInput: (body) => {
      const b = (body ?? {}) as Partial<Input>;
      if (!b.channel || typeof b.channel !== "string") {
        throw new Error("Provide a `channel` string (handle, URL, or ID).");
      }
      const channel = b.channel.trim();
      if (!channel) throw new Error("Channel input is empty.");
      if (channel.length > 200) throw new Error("Channel input is too long.");
      const lookup = resolveChannelInput(channel);
      if (!lookup) {
        throw new Error(
          "Couldn't recognise that channel format. Try @handle, a youtube.com/@handle URL, or a UC… channel ID."
        );
      }
      return { channel: lookupCacheKey(lookup) };
    },
    callModel: async ({ channel: cacheKey }) => {
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        throw new Error("YOUTUBE_API_KEY is not configured.");
      }

      const [type, value] = cacheKey.split(":");
      const lookup =
        type === "id"
          ? ({ type: "id", value } as const)
          : type === "handle"
          ? ({ type: "handle", value } as const)
          : ({ type: "legacy", value } as const);

      // Resolve channel + get uploads playlist
      const channel = await fetchChannel(lookup, apiKey);
      if (!channel) throw new Error("Couldn't find that channel.");
      if (!channel.uploadsPlaylistId) {
        throw new Error("Channel has no uploads playlist.");
      }

      // Latest N video IDs + batched stats
      const ids = await fetchVideoIdsFromPlaylist(channel.uploadsPlaylistId, WINDOW_SIZE, apiKey);
      if (ids.length < MIN_VIDEOS) {
        throw new Error(
          `Channel only has ${ids.length} public videos — need at least ${MIN_VIDEOS} for a meaningful Visibility Score.`
        );
      }
      const videoMap = await fetchVideoBatchPaginated(ids, apiKey);

      // Compute the four sub-scores + composite (pure function, deterministic)
      const channelData = {
        id: channel.id,
        title: channel.title,
        handle: channel.handle,
        thumbnailUrl: channel.thumbnailUrl,
        subscriberCount: channel.subscriberCount,
        videoCount: channel.videoCount,
      };
      const baseResult = computeVisibilityScore(channelData, ids, videoMap);

      // LLM summary (best-effort, baseResult is the source of truth either way)
      let summary: string | null = null;
      let llmCostUsd = 0;
      try {
        const llmResult = await callClaude<{ summary: string }>({
          system: VISIBILITY_SUMMARY_SYSTEM_PROMPT,
          user: buildVisibilitySummaryUserMessage(channel.title, baseResult.subscores),
          maxTokens: 120,
          temperature: 0.5,
          parse: (raw) => {
            const data = parseJsonOutput<{ summary: string }>(raw);
            if (!data || typeof data.summary !== "string") {
              throw new Error("Summary returned an unexpected shape.");
            }
            return { summary: data.summary.trim() };
          },
        });
        summary = llmResult.parsed.summary;
        llmCostUsd = llmResult.costUsd;
      } catch (err) {
        console.error("[visibility-score] summary failed", err);
      }

      const result: VisibilityScoreResult = { ...baseResult, summary };

      // Anonymous logging
      await logAudit("channel-audit", channel.id, {
        visibility: result.overallScore,
        ctr: result.subscores[0].score,
        metadata: result.subscores[1].score,
        headroom: result.subscores[2].score,
        trajectory: result.subscores[3].score,
      }).catch(() => {});

      return { output: result, costUsd: llmCostUsd };
    },
  });
}
