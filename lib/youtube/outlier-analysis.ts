/**
 * Outlier Finder — types + statistical helpers + LLM prompt.
 *
 * "Outlier" = a video whose view count is ≥3x the channel's median over
 * the most recent 100 uploads. We use MEDIAN, not mean, because one
 * viral mega-hit would otherwise dominate the mean and mask everything
 * else. Median is robust to that.
 *
 * Pipeline (called from the API route):
 *  1. Resolve channel ID + uploadsPlaylistId (1 unit)
 *  2. fetchVideoIdsFromPlaylist for 100 videos (~2 units)
 *  3. fetchVideoBatchPaginated for stats (~2 units)
 *  4. Calculate median views, mark each video's multiplier
 *  5. Pick outliers (≥3x median) and an average-band sample (within
 *     0.7x–1.3x median) for the LLM to contrast against
 *  6. Single Claude Haiku call: what patterns are present in outliers
 *     and absent in average videos?
 *
 * Total YouTube quota: ~5 units. LLM: ~$0.001. Cache 24h by channel ID.
 */

import type { PublicTitleAnalysis, TitleScoreResult } from "./title-score";
import { analyzeTitle } from "./title-score";

export type OutlierVideo = {
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string | null;
  publishDate: string | null;
  lengthSeconds: number | null;
  viewCount: number;
  likeCount: number | null;
  commentCount: number | null;
  /** Multiplier vs the channel's median views over the analyzed window. */
  multiplier: number;
  titleScore: TitleScoreResult;
};

export type OutlierChannel = {
  id: string;
  title: string;
  handle: string | null;
  thumbnailUrl: string | null;
  subscriberCount: number | null;
  videoCount: number | null;
};

export type OutlierAnalysis = {
  channel: OutlierChannel;
  /** How many videos we actually analyzed (may be <100 for small channels). */
  windowSize: number;
  /** Median views across the analyzed window — the reference baseline. */
  medianViews: number;
  /** Mean views across the window — shown alongside median for comparison. */
  meanViews: number;
  /** Outliers (≥3x median) sorted by multiplier descending. */
  outliers: OutlierVideo[];
  /** Mega-outliers (≥10x median) — subset of outliers, also listed separately. */
  megaOutliers: OutlierVideo[];
  /** 3 patterns the LLM identified from contrasting outliers vs average videos. */
  patterns: string[];
  /** Set when LLM analysis failed but stat data is fine. */
  analysisFailed?: boolean;
};

/**
 * Public-facing shape returned by the API. Strips the derived
 * multiplier and title composite score/band to comply with YouTube
 * API Services policy III.E.4h. The user still sees raw view counts
 * alongside the channel's median so they can visually compare, and
 * per-video textual title signals for editorial guidance.
 */
export type PublicOutlierVideo = {
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string | null;
  publishDate: string | null;
  lengthSeconds: number | null;
  viewCount: number;
  likeCount: number | null;
  commentCount: number | null;
  titleAnalysis: PublicTitleAnalysis;
};

export type PublicOutlierAnalysis = {
  channel: OutlierChannel;
  windowSize: number;
  medianViews: number;
  meanViews: number;
  outliers: PublicOutlierVideo[];
  megaOutliers: PublicOutlierVideo[];
  patterns: string[];
  analysisFailed?: boolean;
};

function toPublicOutlierVideo(v: OutlierVideo): PublicOutlierVideo {
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

export function toPublicOutlierAnalysis(a: OutlierAnalysis): PublicOutlierAnalysis {
  return {
    channel: a.channel,
    windowSize: a.windowSize,
    medianViews: a.medianViews,
    meanViews: a.meanViews,
    outliers: a.outliers.map(toPublicOutlierVideo),
    megaOutliers: a.megaOutliers.map(toPublicOutlierVideo),
    patterns: a.patterns,
    analysisFailed: a.analysisFailed,
  };
}

/**
 * Compute the median of a list of numbers. Returns 0 for empty list.
 * Defined as the middle value when sorted; for even length, average of
 * the two middle values.
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * System prompt for outlier pattern extraction.
 *
 * The model receives two contrasting lists from the SAME channel:
 *   - outliers: videos with ≥3x median views
 *   - averages: videos within 0.7-1.3x median views (typical performance)
 *
 * It's asked to find 3 specific structural choices PRESENT in outliers
 * and ABSENT in averages. The constraint that the patterns must be
 * differential — not generic best practice — is what makes this useful.
 */
export const OUTLIER_SYSTEM_PROMPT = `You analyze YouTube channel data to identify what makes outlier videos succeed where average videos don't.

You receive two lists from the SAME channel:
  - OUTLIERS: titles of videos with ≥3x the channel's median view count
  - AVERAGES: titles of videos performing at typical channel level (0.7–1.3x median)

Return JSON only — no markdown fences, no preamble:
{"patterns": ["pattern 1", "pattern 2", "pattern 3"]}

Each pattern must:
- Identify a SPECIFIC structural choice (title template, content angle, format hook) that appears in OUTLIERS but is ABSENT from AVERAGES
- Be 1-2 sentences, action-oriented
- Reference what you actually see in the outlier titles — name the pattern with evidence
- Avoid generic best practices ("be authentic", "engaging title", "good thumbnail") — those are true for everyone
- If outliers and averages look similar (channel performance is consistent), explicitly say "outlier pattern: [name]" or return fewer than 3 — do not invent contrast that isn't there`;

export function buildOutlierUserMessage(
  channelTitle: string,
  outliers: Array<{ title: string; multiplier: number; viewCount: number }>,
  averages: Array<{ title: string; viewCount: number }>
): string {
  const formatOutliers = outliers
    .map((v, i) => `${i + 1}. "${v.title}" — ${v.multiplier.toFixed(1)}x median (${formatViewCount(v.viewCount)} views)`)
    .join("\n");
  const formatAverages = averages
    .map((v, i) => `${i + 1}. "${v.title}" — ${formatViewCount(v.viewCount)} views`)
    .join("\n");

  return (
    `Channel: ${channelTitle}\n\n` +
    `OUTLIERS (≥3x median):\n${formatOutliers}\n\n` +
    `AVERAGES (typical performance):\n${formatAverages}\n\n` +
    `Return the JSON now.`
  );
}

function formatViewCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
