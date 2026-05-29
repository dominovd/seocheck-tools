import type { NextRequest } from "next/server";
import { protectAI } from "@/lib/ai/protect";
import { callClaude } from "@/lib/anthropic-client";
import { parseJsonOutput } from "@/lib/ai/parse-json";
import { resolveChannelInput, lookupCacheKey } from "@/lib/youtube/channel-resolver";
import {
  fetchChannel,
  fetchTopVideoIdsByChannel,
  fetchVideoBatchWithEngagement,
} from "@/lib/youtube/youtube-api";
import { scoreTitle } from "@/lib/youtube/title-score";
import {
  PATTERN_SYSTEM_PROMPT,
  buildPatternUserMessage,
  type CompetitorAnalysis,
  type CompetitorVideo,
} from "@/lib/youtube/competitor-analysis";

export const runtime = "edge";

/**
 * Competitor Channel Analyzer.
 *
 * Pipeline orchestrated inside `callModel` so the protectAI cache /
 * rate-limit / budget infrastructure wraps the entire YouTube-API +
 * LLM pipeline as a single billable unit.
 *
 * Quota math per non-cached call:
 *  - channels.list (1 unit)        — channel resolution
 *  - search.list   (100 units)     — top 10 by viewCount
 *  - videos.list   (1 unit)        — batched stats + duration
 *  - Total: 102 YouTube units
 *  - LLM:   ~$0.001 (Claude Haiku, small payload)
 *
 * Daily limit per IP: 3. Stricter than other AI tools because each call
 * burns 102 API units toward the 10K daily project quota.
 */

type Input = { channel: string };

const TOOL_SLUG = "youtube-competitor-analyzer";
const DAILY_LIMIT = 3;
const TOP_N = 10;

export async function POST(req: NextRequest) {
  return protectAI<Input, CompetitorAnalysis>(req, {
    tool: TOOL_SLUG,
    dailyLimit: DAILY_LIMIT,
    parseInput: (body) => {
      const b = (body ?? {}) as Partial<Input>;
      if (!b.channel || typeof b.channel !== "string") {
        throw new Error("Provide a `channel` string (handle, URL, or ID).");
      }
      const channel = b.channel.trim();
      if (channel.length === 0) throw new Error("Channel input is empty.");
      if (channel.length > 200) throw new Error("Channel input is too long.");
      // Normalize via the resolver inside parseInput so the cache key
      // dedups equivalent inputs (e.g. "@MrBeast" and
      // "youtube.com/@MrBeast" become the same cache entry)
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
          "YOUTUBE_API_KEY is not configured — the competitor analyzer needs it. Ask the operator to set it in Vercel env."
        );
      }

      // cacheKey is `type:value` from lookupCacheKey — split it back
      const [type, value] = cacheKey.split(":");
      const lookup =
        type === "id"
          ? ({ type: "id", value } as const)
          : type === "handle"
          ? ({ type: "handle", value } as const)
          : ({ type: "legacy", value } as const);

      // Step 1 — resolve channel (1 unit)
      const channel = await fetchChannel(lookup, apiKey);
      if (!channel) {
        throw new Error(
          "Couldn't find that channel. Double-check the handle, URL, or ID."
        );
      }

      // Step 2 — top N video IDs by viewCount (100 units)
      const topIds = await fetchTopVideoIdsByChannel(channel.id, TOP_N, apiKey);
      if (topIds.length === 0) {
        throw new Error(
          "The channel exists but we couldn't fetch its top videos. It may have no public uploads or YouTube returned an empty result."
        );
      }

      // Step 3 — batched metadata + engagement (1 unit)
      const videoMap = await fetchVideoBatchWithEngagement(topIds, apiKey);
      const topVideos: CompetitorVideo[] = topIds
        .map((id) => {
          const data = videoMap.get(id);
          if (!data) return null;
          const titleScore = scoreTitle(data.title);
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
            titleScore,
          } satisfies CompetitorVideo;
        })
        .filter((v): v is CompetitorVideo => v !== null);

      if (topVideos.length === 0) {
        throw new Error(
          "Couldn't retrieve video details — the channel may have private/deleted top videos."
        );
      }

      // Step 4 — LLM pattern summary (best-effort, returns empty patterns on failure)
      let patterns: string[] = [];
      let patternsFailed = false;
      let llmCostUsd = 0;
      try {
        const llmResult = await callClaude<{ patterns: string[] }>({
          system: PATTERN_SYSTEM_PROMPT,
          user: buildPatternUserMessage(
            channel.title,
            topVideos.map((v) => ({
              title: v.title,
              viewCount: v.viewCount,
              publishDate: v.publishDate,
            }))
          ),
          maxTokens: 400,
          temperature: 0.6,
          parse: (raw) => {
            const data = parseJsonOutput<{ patterns: string[] }>(raw);
            if (!data || !Array.isArray(data.patterns)) {
              throw new Error("Pattern summary returned an unexpected shape.");
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
        console.error("[competitor-analyzer] pattern summary failed", err);
        patternsFailed = true;
      }

      const analysis: CompetitorAnalysis = {
        channel: {
          id: channel.id,
          title: channel.title,
          handle: channel.handle,
          thumbnailUrl: channel.thumbnailUrl,
          subscriberCount: channel.subscriberCount,
          videoCount: channel.videoCount,
          viewCount: channel.viewCount,
        },
        topVideos,
        patterns,
        patternsFailed,
      };

      return { output: analysis, costUsd: llmCostUsd };
    },
  });
}
