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

import type { TitleScoreResult } from "./title-score";

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
  topVideos: CompetitorVideo[];
  /** Three concrete patterns the user can borrow, from Claude Haiku. */
  patterns: string[];
  /** Set when LLM pattern summary failed but channel + video data is fine. */
  patternsFailed?: boolean;
};

/**
 * System prompt for the pattern summary.
 *
 * The Haiku model gets a compact summary of the top-10 — just title +
 * view count + age — and is asked to spot three concrete, copy-able
 * patterns. Constraints:
 *  - No platitudes ("be authentic", "post consistently")
 *  - Each pattern names a SPECIFIC pattern visible in the data
 *    (title structure, content angle, format choice)
 *  - 1-2 sentences each
 */
export const PATTERN_SYSTEM_PROMPT = `You analyze YouTube channel data to spot the patterns that make a channel's top videos work.

You receive a compact list of one channel's top 10 videos by view count: title, view count, age.

Return exactly 3 concrete, copy-able patterns. Output JSON only — no markdown fences, no preamble:
{"patterns": ["pattern 1", "pattern 2", "pattern 3"]}

Each pattern must:
- Name a SPECIFIC structural choice visible in the data (title template, content angle, format choice)
- Be 1-2 sentences, action-oriented ("Lead with a question that names the audience's anxiety", not "be relatable")
- Avoid platitudes ("post consistently", "be authentic", "have great thumbnails")
- Reference what you actually see, not generic advice`;

export function buildPatternUserMessage(
  channelTitle: string,
  videos: Array<{ title: string; viewCount: number | null; publishDate: string | null }>
): string {
  const lines = videos.map((v, i) => {
    const views = v.viewCount !== null ? `${formatViewCount(v.viewCount)} views` : "views n/a";
    const age = v.publishDate ?? "date n/a";
    return `${i + 1}. "${v.title}" — ${views} (${age})`;
  });
  return `Channel: ${channelTitle}\n\nTop 10 by views:\n${lines.join("\n")}\n\nReturn the 3 patterns as JSON now.`;
}

function formatViewCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
