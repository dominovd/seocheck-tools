/**
 * Competitor Channel Analyzer — orchestrator types + LLM prompt.
 *
 * Pipeline (called from the API route):
 *  1. Resolve user input → channel ID (channels.list, 1 unit)
 *  2. Top 10 video IDs by view count (search.list, 100 units)
 *  3. Full metadata batched (videos.list, 1 unit for all 10)
 *  4. Apply scoreTitle() locally to every title
 *  5. Compose a tight summary of the 10 videos and ask Claude Haiku for
 *     three concrete patterns the user can borrow.
 *
 * Total YouTube quota per analysis: ~102 units.
 * LLM cost per analysis: ~200 input + 200 output tokens ≈ $0.001.
 * Cache by channel ID for 24h — same channel re-analysed = zero cost.
 */

import type { PublicTitleAnalysis, TitleScoreResult } from "./title-score";
import { analyzeTitle } from "./title-score";

export type CompetitorVideo = {
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string | null;
  publishDate: string | null;
  lengthSeconds: number | null;
  viewCount: number | null;
  likeCount: number | null;
  commentCount: number | null;
  /** Title Score applied to the title — score, band, signals. */
  titleScore: TitleScoreResult;
};

export type CompetitorChannel = {
  id: string;
  title: string;
  handle: string | null;
  thumbnailUrl: string | null;
  subscriberCount: number | null;
  videoCount: number | null;
  viewCount: number | null;
};

export type CompetitorAnalysis = {
  channel: CompetitorChannel;
  /** Top 10 by view count — historical winners. */
  topVideos: CompetitorVideo[];
  /** Latest 10 by upload date — current trajectory. */
  latestVideos: CompetitorVideo[];
  /** Three concrete patterns from the top 10, from Claude Haiku. */
  patterns: string[];
  /** Three observations on how the latest 10 differ from the top 10 — channel direction. */
  direction: string[];
  /** Set when LLM analysis failed but channel + video data is fine. */
  analysisFailed?: boolean;
};

/**
 * Public-facing video shape returned by the API. Replaces the internal
 * TitleScoreResult (which contains a 0-100 score and Strong/Weak band)
 * with the sanitized PublicTitleAnalysis (textual signals + categorical
 * angle only). Complies with YouTube API Services policy III.E.4h.
 */
export type PublicCompetitorVideo = Omit<CompetitorVideo, "titleScore"> & {
  titleAnalysis: PublicTitleAnalysis;
};

export type PublicCompetitorAnalysis = Omit<CompetitorAnalysis, "topVideos" | "latestVideos"> & {
  topVideos: PublicCompetitorVideo[];
  latestVideos: PublicCompetitorVideo[];
};

function toPublicCompetitorVideo(v: CompetitorVideo): PublicCompetitorVideo {
  // Recompute title analysis from raw title text so no internal score leaks.
  return {
    videoId: v.videoId,
    videoUrl: v.videoUrl,
    title: v.title,
    thumbnailUrl: v.thumbnailUrl,
    publishDate: v.publishDate,
    lengthSeconds: v.lengthSeconds,
    viewCount: v.viewCount,
    likeCount: v.likeCount,
    commentCount: v.commentCount,
    titleAnalysis: analyzeTitle(v.title),
  };
}

export function toPublicCompetitorAnalysis(a: CompetitorAnalysis): PublicCompetitorAnalysis {
  return {
    channel: a.channel,
    topVideos: a.topVideos.map(toPublicCompetitorVideo),
    latestVideos: a.latestVideos.map(toPublicCompetitorVideo),
    patterns: a.patterns,
    direction: a.direction,
    analysisFailed: a.analysisFailed,
  };
}

/**
 * System prompt for the combined pattern + direction summary.
 *
 * The Haiku model receives BOTH lists at once — top 10 by views
 * (historical performance) and latest 10 by upload date (current
 * trajectory). One call returns:
 *  - `patterns`: 3 specific structural choices visible in the top 10
 *  - `direction`: 3 observations on how the latest 10 differ from
 *    the top 10 (or where the latest 10 doubles down on top patterns)
 *
 * Constraints make this hard to game with platitudes — the model
 * must reference what's actually in the lists.
 */
export const PATTERN_SYSTEM_PROMPT = `You analyze YouTube channel data to spot the patterns that make a channel's top videos work AND how the channel's direction is evolving.

You receive a channel's TOP 10 videos by view count (historical winners) and LATEST 10 videos by upload date (current trajectory).

Return JSON only — no markdown fences, no preamble:
{
  "patterns": ["pattern 1", "pattern 2", "pattern 3"],
  "direction": ["observation 1", "observation 2", "observation 3"]
}

For "patterns":
- Each is a SPECIFIC structural choice visible in the top 10 (title template, content angle, format choice)
- 1-2 sentences, action-oriented ("Lead with a question that names the audience's anxiety", not "be relatable")
- Reference what you actually see in the top 10, not generic advice

For "direction":
- Each notes how the latest 10 differ from the top 10, OR where the latest 10 doubles down on a top pattern
- Be specific about the SHIFT: new topic cluster, new format, longer/shorter titles, fewer numbers, different audience signal
- If the latest 10 looks like more of the same, say "doubling down on X" and name X with evidence
- Don't invent change that isn't visible in the data

For both: avoid platitudes ("post consistently", "be authentic", "have great thumbnails", "engage with comments").`;

export function buildPatternUserMessage(
  channelTitle: string,
  topVideos: Array<{ title: string; viewCount: number | null; publishDate: string | null }>,
  latestVideos: Array<{ title: string; viewCount: number | null; publishDate: string | null }>
): string {
  const formatList = (list: typeof topVideos) =>
    list
      .map((v, i) => {
        const views = v.viewCount !== null ? `${formatViewCount(v.viewCount)} views` : "views n/a";
        const age = v.publishDate ?? "date n/a";
        return `${i + 1}. "${v.title}" — ${views} (${age})`;
      })
      .join("\n");

  return (
    `Channel: ${channelTitle}\n\n` +
    `TOP 10 by views (historical):\n${formatList(topVideos)}\n\n` +
    `LATEST 10 by upload date (current direction):\n${formatList(latestVideos)}\n\n` +
    `Return the JSON now.`
  );
}

function formatViewCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
