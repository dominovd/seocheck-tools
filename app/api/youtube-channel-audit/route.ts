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
  tallyBands,
  buildChannelAuditSummaryMessage,
  buildChannelAuditUserMessage,
  CHANNEL_AUDIT_SUMMARY_SYSTEM_PROMPT,
  CHANNEL_AUDIT_SYSTEM_PROMPT,
  computeChannelAudit,
  rankIssueCandidates,
  type ChannelAuditResult,
} from "@/lib/youtube/channel-audit";
import { videoInfoFromApi } from "@/lib/youtube/extract-video-info";
import { auditVideo } from "@/lib/youtube/video-audit";
import { logAudit } from "@/lib/analytics/audit-log";

export const runtime = "edge";

/**
 * Channel Audit API — unified channel dashboard.
 *
 * YouTube quota per non-cached call:
 *   - channels.list (1 unit)         resolve channel + uploads + topicDetails
 *   - playlistItems.list (1 unit)    latest 30 video IDs (single page, 30 <= 50)
 *   - videos.list (1 unit)           batched stats + snippet for the 30
 *   Total: 3 units. LLM: 2 Haiku calls (issues + summary), each ~300 tokens.
 *
 * Daily limit: 5 per IP. Both LLM calls are best-effort — fall back to
 * deterministic candidates + null summary if either errors.
 */

type Input = { channel: string };

const TOOL_SLUG = "youtube-channel-audit";
const DAILY_LIMIT = 5;
const WINDOW_SIZE = 30;
const MIN_VIDEOS = 5;

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

      // Step 1 — resolve channel + topicCategories
      const channel = await fetchChannel(lookup, apiKey);
      if (!channel) {
        throw new Error("Couldn't find that channel. Double-check the handle, URL, or ID.");
      }
      if (!channel.uploadsPlaylistId) {
        throw new Error("Channel has no uploads playlist (no public videos).");
      }

      // Step 2 — latest 30 IDs (single page, since 30 ≤ 50)
      const ids = await fetchVideoIdsFromPlaylist(
        channel.uploadsPlaylistId,
        WINDOW_SIZE,
        apiKey
      );
      if (ids.length < MIN_VIDEOS) {
        throw new Error(
          `This channel only has ${ids.length} public uploads — too small a sample for a meaningful channel audit (we need at least ${MIN_VIDEOS}).`
        );
      }

      // Step 3 — batched videos.list
      const videoMap = await fetchVideoBatchPaginated(ids, apiKey);
      if (videoMap.size === 0) {
        throw new Error("Couldn't retrieve enough video details to audit.");
      }

      // Pre-compute dimension stats so we can build issue candidates for the LLM.
      // (computeChannelAudit re-audits internally, but cheap — these are pure functions.)
      const audited = ids
        .map((id) => {
          const data = videoMap.get(id);
          if (!data) return null;
          const info = videoInfoFromApi(id, data);
          return { id, audit: auditVideo(info, { omitTags: true }) };
        })
        .filter((v): v is { id: string; audit: ReturnType<typeof auditVideo> } => v !== null);

      // Band tallies stay server-side. Only the qualitative scale derived
      // from them reaches the client (policy III.E.4h).
      const tallies = tallyBands(audited);
      const candidates = rankIssueCandidates(tallies, audited.length);

      // Step 4a — LLM rewrites issue text (best-effort)
      let llmIssues: Array<{ dimensionKey: string; text: string }> = [];
      let analysisFailed = false;
      let llmCostUsd = 0;
      if (candidates.length > 0) {
        try {
          const result = await callClaude<{ issues: Array<{ dimensionKey: string; text: string }> }>({
            system: CHANNEL_AUDIT_SYSTEM_PROMPT,
            user: buildChannelAuditUserMessage(channel.title, candidates, audited.length),
            maxTokens: 500,
            temperature: 0.4,
            parse: (raw) => {
              const data = parseJsonOutput<{ issues: Array<{ dimensionKey: string; text: string }> }>(raw);
              if (!data || !Array.isArray(data.issues)) {
                throw new Error("Channel audit issues returned an unexpected shape.");
              }
              return {
                issues: data.issues
                  .filter(
                    (i): i is { dimensionKey: string; text: string } =>
                      !!i &&
                      typeof i.dimensionKey === "string" &&
                      typeof i.text === "string" &&
                      i.text.trim().length > 0
                  )
                  .map((i) => ({ dimensionKey: i.dimensionKey, text: i.text.trim() })),
              };
            },
          });
          llmIssues = result.parsed.issues;
          llmCostUsd += result.costUsd;
        } catch (err) {
          console.error("[channel-audit] issue rewrite failed", err);
          analysisFailed = true;
        }
      }

      // Build the unified result so we can ask the LLM for a summary
      // grounded in the actual subscores.
      const partialResult = computeChannelAudit({
        channel,
        videoIds: ids,
        videoMap,
        llmIssues,
        analysisFailed,
      });

      // Step 4b — one-sentence editorial summary (best-effort, textual only)
      let summary: string | null = null;
      try {
        const result = await callClaude<{ summary: string }>({
          system: CHANNEL_AUDIT_SUMMARY_SYSTEM_PROMPT,
          user: buildChannelAuditSummaryMessage(
            channel.title,
            partialResult.dimensions,
            partialResult.windowSize,
            partialResult.aggregations.publishingCadence
          ),
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
        summary = result.parsed.summary;
        llmCostUsd += result.costUsd;
      } catch (err) {
        console.error("[channel-audit] summary failed", err);
      }

      const finalResult: ChannelAuditResult = { ...partialResult, summary };

      // Anonymous logging. Only our own editorial counts are stored —
      // never a YouTube-provided statistic (policy III.E.4a-g).
      await logAudit("channel-audit", channel.id, {
        windowSize: finalResult.windowSize,
        issueCount: finalResult.recurringIssues.filter((i) => i.severity !== "good")
          .length,
        dimensionsFlagged: finalResult.dimensions.filter((d) => d.isWorst).length,
      }).catch(() => {});

      return { output: finalResult, costUsd: llmCostUsd };
    },
  });
}
