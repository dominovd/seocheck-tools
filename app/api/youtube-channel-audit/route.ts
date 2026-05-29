import type { NextRequest } from "next/server";
import { protectAI } from "@/lib/ai/protect";
import { callClaude } from "@/lib/anthropic-client";
import { parseJsonOutput } from "@/lib/ai/parse-json";
import { resolveChannelInput, lookupCacheKey } from "@/lib/youtube/channel-resolver";
import {
  fetchChannel,
  fetchLatestVideoIds,
  fetchVideoBatchPaginated,
} from "@/lib/youtube/youtube-api";
import { videoInfoFromApi } from "@/lib/youtube/extract-video-info";
import { auditVideo, type AuditBand } from "@/lib/youtube/video-audit";
import {
  computeGrade,
  CHANNEL_AUDIT_SYSTEM_PROMPT,
  buildChannelAuditUserMessage,
  type ChannelAuditResult,
  type ChannelAuditVideo,
  type DimensionStats,
} from "@/lib/youtube/channel-audit";
import { logAudit } from "@/lib/analytics/audit-log";

export const runtime = "edge";

/**
 * Channel Audit API.
 *
 * YouTube quota per non-cached call:
 *   - channels.list (1 unit)         resolve channel + uploads playlist
 *   - playlistItems.list (1 unit)    latest 10 video IDs
 *   - videos.list (1 unit)           batched stats + snippet for the 10
 *   Total: 3 units. Cheapest of our YouTube-API tools.
 *
 * Daily limit: 5 per IP. LLM call optional — falls back to empty
 * recurringIssues with analysisFailed=true if Haiku errors.
 */

type Input = { channel: string };

const TOOL_SLUG = "youtube-channel-audit";
const DAILY_LIMIT = 5;
const VIDEO_COUNT = 10;
const MIN_VIDEOS = 3;

const DIM_LABELS: Record<string, string> = {
  title: "Title",
  description: "Description",
  hashtags: "Hashtags",
  chapters: "Chapters",
};

export async function POST(req: NextRequest) {
  return protectAI<Input, ChannelAuditResult>(req, {
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
        throw new Error(
          "YOUTUBE_API_KEY is not configured — the Channel Audit needs it."
        );
      }

      const [type, value] = cacheKey.split(":");
      const lookup =
        type === "id"
          ? ({ type: "id", value } as const)
          : type === "handle"
          ? ({ type: "handle", value } as const)
          : ({ type: "legacy", value } as const);

      // Step 1 — resolve channel
      const channel = await fetchChannel(lookup, apiKey);
      if (!channel) {
        throw new Error("Couldn't find that channel. Double-check the handle, URL, or ID.");
      }
      if (!channel.uploadsPlaylistId) {
        throw new Error("Channel has no uploads playlist (no public videos).");
      }

      // Step 2 — latest 10 IDs
      const ids = await fetchLatestVideoIds(channel.uploadsPlaylistId, VIDEO_COUNT, apiKey);
      if (ids.length < MIN_VIDEOS) {
        throw new Error(
          `This channel only has ${ids.length} public uploads — too small a sample for a meaningful channel-level audit (we need at least ${MIN_VIDEOS}).`
        );
      }

      // Step 3 — batched videos.list
      const videoMap = await fetchVideoBatchPaginated(ids, apiKey);

      // Step 4 — audit each video (omitTags since API doesn't return tags for non-owners)
      const audited: ChannelAuditVideo[] = ids
        .map((id) => {
          const data = videoMap.get(id);
          if (!data) return null;
          const info = videoInfoFromApi(id, data);
          const audit = auditVideo(info, { omitTags: true });
          return {
            videoId: id,
            videoUrl: `https://www.youtube.com/watch?v=${id}`,
            title: data.title,
            thumbnailUrl: data.thumbnailUrl,
            publishDate: data.publishDate,
            viewCount: data.viewCount,
            audit,
          } satisfies ChannelAuditVideo;
        })
        .filter((v): v is ChannelAuditVideo => v !== null);

      if (audited.length === 0) {
        throw new Error("Couldn't retrieve enough video details to audit.");
      }

      // Step 5 — aggregate per dimension
      const dimKeys = audited[0].audit.dimensions.map((d) => d.key);
      const dimensions: DimensionStats[] = dimKeys.map((key) => {
        const scores: number[] = [];
        const bandCounts: Record<AuditBand, number> = {
          strong: 0,
          good: 0,
          fair: 0,
          weak: 0,
        };
        for (const v of audited) {
          const d = v.audit.dimensions.find((dd) => dd.key === key);
          if (!d) continue;
          scores.push(d.score);
          bandCounts[d.band] += 1;
        }
        const averageScore =
          scores.length > 0
            ? Math.round(scores.reduce((s, x) => s + x, 0) / scores.length)
            : 0;
        return {
          key,
          label: DIM_LABELS[key] ?? key,
          averageScore,
          bandCounts,
          isWorst: false, // marked below
        };
      });

      // Mark worst dimension (lowest averageScore)
      if (dimensions.length > 0) {
        const minAvg = Math.min(...dimensions.map((d) => d.averageScore));
        for (const d of dimensions) {
          if (d.averageScore === minAvg) d.isWorst = true;
        }
      }

      // Overall channel score = average of per-video overall scores
      const averageScore = Math.round(
        audited.reduce((s, v) => s + v.audit.overallScore, 0) / audited.length
      );
      const grade = computeGrade(averageScore);

      // Step 6 — LLM recurring issues
      let recurringIssues: string[] = [];
      let analysisFailed = false;
      let llmCostUsd = 0;
      try {
        const llmResult = await callClaude<{ issues: string[] }>({
          system: CHANNEL_AUDIT_SYSTEM_PROMPT,
          user: buildChannelAuditUserMessage(channel.title, dimensions, audited),
          maxTokens: 500,
          temperature: 0.5,
          parse: (raw) => {
            const data = parseJsonOutput<{ issues: string[] }>(raw);
            if (!data || !Array.isArray(data.issues)) {
              throw new Error("Channel audit returned an unexpected shape.");
            }
            return {
              issues: data.issues
                .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
                .map((p) => p.trim())
                .slice(0, 3),
            };
          },
        });
        recurringIssues = llmResult.parsed.issues;
        llmCostUsd = llmResult.costUsd;
      } catch (err) {
        console.error("[channel-audit] LLM analysis failed", err);
        analysisFailed = true;
      }

      const result: ChannelAuditResult = {
        channel: {
          id: channel.id,
          title: channel.title,
          handle: channel.handle,
          thumbnailUrl: channel.thumbnailUrl,
          subscriberCount: channel.subscriberCount,
          videoCount: channel.videoCount,
        },
        videoCount: audited.length,
        averageScore,
        grade,
        dimensions,
        videos: audited,
        recurringIssues,
        analysisFailed,
      };

      // Anonymous audit logging — foundation for YouTube Studies.
      const dimScores: Record<string, number | null> = { overall: averageScore };
      for (const d of dimensions) dimScores[d.key] = d.averageScore;
      await logAudit("channel-audit", channel.id, dimScores).catch(() => {});

      return { output: result, costUsd: llmCostUsd };
    },
  });
}
