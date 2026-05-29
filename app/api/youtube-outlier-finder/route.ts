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
import { scoreTitle } from "@/lib/youtube/title-score";
import {
  median,
  mean,
  OUTLIER_SYSTEM_PROMPT,
  buildOutlierUserMessage,
  type OutlierAnalysis,
  type OutlierVideo,
} from "@/lib/youtube/outlier-analysis";
import { logAudit } from "@/lib/analytics/audit-log";

export const runtime = "edge";

/**
 * Outlier Finder API.
 *
 * Pipeline orchestrated inside callModel so protectAI cache/rate-limit/
 * budget covers the whole YouTube-API + LLM step as one billable unit.
 *
 * YouTube quota per non-cached call:
 *   - channels.list (1 unit)            resolve channel + uploads playlist
 *   - playlistItems.list × 2 (2 units)  fetch 100 latest video IDs
 *   - videos.list × 2 (2 units)         batched stats for the 100 IDs
 *   Total: 5 units. Much cheaper than Competitor Analyzer (102 units)
 *   because we don't need search.list with order=viewCount.
 *
 * Daily limit per IP: 5 (room for self-experimentation + analyzing
 * a few competitor channels — still keeps the project quota safe
 * against abuse).
 */

type Input = { channel: string };

const TOOL_SLUG = "youtube-outlier-finder";
const DAILY_LIMIT = 5;
const WINDOW_SIZE = 100;
const OUTLIER_MULTIPLIER = 3;
const MEGA_OUTLIER_MULTIPLIER = 10;
const MIN_VIDEOS_FOR_ANALYSIS = 10;

export async function POST(req: NextRequest) {
  return protectAI<Input, OutlierAnalysis>(req, {
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
          "YOUTUBE_API_KEY is not configured — the Outlier Finder needs it. Ask the operator to set it in Vercel env."
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

      // Step 2 — get latest N video IDs
      const ids = await fetchVideoIdsFromPlaylist(channel.uploadsPlaylistId, WINDOW_SIZE, apiKey);
      if (ids.length < MIN_VIDEOS_FOR_ANALYSIS) {
        throw new Error(
          `This channel only has ${ids.length} public videos — too small a sample to identify outliers (we need at least ${MIN_VIDEOS_FOR_ANALYSIS}).`
        );
      }

      // Step 3 — batched stats for all of them
      const videoMap = await fetchVideoBatchPaginated(ids, apiKey);

      // Step 4 — compute median + multipliers
      const viewCounts = ids
        .map((id) => videoMap.get(id)?.viewCount ?? null)
        .filter((v): v is number => v !== null && v > 0);
      if (viewCounts.length < MIN_VIDEOS_FOR_ANALYSIS) {
        throw new Error(
          "Couldn't retrieve view counts for enough videos. The channel may have many private or removed uploads."
        );
      }
      const medianViews = median(viewCounts);
      const meanViews = Math.round(mean(viewCounts));

      // Build full enriched list with multipliers
      type EnrichedVideo = OutlierVideo & { isOutlier: boolean; isAverage: boolean };
      const enriched: EnrichedVideo[] = ids
        .map((id) => {
          const data = videoMap.get(id);
          if (!data || data.viewCount === null) return null;
          const multiplier = medianViews > 0 ? data.viewCount / medianViews : 0;
          return {
            videoId: id,
            videoUrl: `https://www.youtube.com/watch?v=${id}`,
            title: data.title,
            thumbnailUrl: data.thumbnailUrl,
            publishDate: data.publishDate,
            lengthSeconds: data.lengthSeconds,
            viewCount: data.viewCount,
            likeCount: data.likeCount,
            commentCount: data.commentCount,
            multiplier,
            titleScore: scoreTitle(data.title),
            isOutlier: multiplier >= OUTLIER_MULTIPLIER,
            isAverage: multiplier >= 0.7 && multiplier <= 1.3,
          };
        })
        .filter((v): v is EnrichedVideo => v !== null);

      const outliers = enriched
        .filter((v) => v.isOutlier)
        .sort((a, b) => b.multiplier - a.multiplier)
        .slice(0, 20);
      const megaOutliers = outliers.filter((v) => v.multiplier >= MEGA_OUTLIER_MULTIPLIER);

      // Sample for LLM: top 8 outliers + 8 average-band for contrast
      const llmOutliers = outliers.slice(0, 8);
      const llmAverages = enriched
        .filter((v) => v.isAverage)
        .slice(0, 8)
        .map((v) => ({ title: v.title, viewCount: v.viewCount }));

      // Step 5 — LLM pattern extraction (best-effort, returns empty patterns on failure)
      let patterns: string[] = [];
      let analysisFailed = false;
      let llmCostUsd = 0;

      if (llmOutliers.length >= 2 && llmAverages.length >= 2) {
        try {
          const llmResult = await callClaude<{ patterns: string[] }>({
            system: OUTLIER_SYSTEM_PROMPT,
            user: buildOutlierUserMessage(
              channel.title,
              llmOutliers.map((v) => ({
                title: v.title,
                multiplier: v.multiplier,
                viewCount: v.viewCount,
              })),
              llmAverages
            ),
            maxTokens: 500,
            temperature: 0.6,
            parse: (raw) => {
              const data = parseJsonOutput<{ patterns: string[] }>(raw);
              if (!data || !Array.isArray(data.patterns)) {
                throw new Error("Outlier analysis returned unexpected shape.");
              }
              return {
                patterns: data.patterns
                  .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
                  .map((p) => p.trim())
                  .slice(0, 3),
              };
            },
          });
          patterns = llmResult.parsed.patterns;
          llmCostUsd = llmResult.costUsd;
        } catch (err) {
          console.error("[outlier-finder] pattern analysis failed", err);
          analysisFailed = true;
        }
      }

      // Strip the internal flags before returning
      const stripFlags = ({
        isOutlier: _o,
        isAverage: _a,
        ...rest
      }: EnrichedVideo): OutlierVideo => rest;

      const analysis: OutlierAnalysis = {
        channel: {
          id: channel.id,
          title: channel.title,
          handle: channel.handle,
          thumbnailUrl: channel.thumbnailUrl,
          subscriberCount: channel.subscriberCount,
          videoCount: channel.videoCount,
        },
        windowSize: ids.length,
        medianViews: Math.round(medianViews),
        meanViews,
        outliers: outliers.map(stripFlags),
        megaOutliers: megaOutliers.map(stripFlags),
        patterns,
        analysisFailed,
      };

      // Anonymous audit logging — foundation for YouTube Studies.
      await logAudit("outlier-finder", channel.id, {
        windowSize: ids.length,
        medianViews: Math.round(medianViews),
        outlierCount: outliers.length,
        megaOutlierCount: megaOutliers.length,
      }).catch(() => {});

      return { output: analysis, costUsd: llmCostUsd };
    },
  });
}
