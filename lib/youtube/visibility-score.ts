/**
 * YouTube Visibility Score — composite channel-level metric.
 *
 * Four sub-scores, all on a uniform 0-100 "higher is better" scale, then
 * weighted into one overall Visibility Score. The composite is what
 * gets shared and quoted ("My channel is at 72/100"); the sub-scores
 * tell the user which lever to pull.
 *
 * Why a single number on top of all our other tools: composite metrics
 * are inherently quotable and shareable in a way diagnostic dimensions
 * aren't. People share "72/100" on Twitter; they don't share "Title 65,
 * Description 40, Hashtags 25, Chapters 0". Identity-marker > 4 numbers.
 *
 * Sub-scores:
 *   - CTR Potential (35%): average title score across the analyzed
 *     window. Title quality is the single biggest CTR lever and we
 *     can measure it without external data.
 *   - Metadata Quality (25%): average overall Video Audit score across
 *     the same window. Captures description / hashtags / chapters
 *     discipline.
 *   - Niche Headroom (15%): how much room the channel has to grow
 *     given its niche dynamics. Approximated from view-to-subscriber
 *     ratio — channels where average views >> subscriber count have
 *     room to grow into a wider audience.
 *   - Growth Trajectory (25%): outlier ratio. Channels with more
 *     outliers (>=1.5x median) have a higher probability of
 *     breakthrough; consistent-but-flat channels score lower.
 */

import type { ApiVideoData, VideoEngagement } from "./youtube-api";
import { videoInfoFromApi } from "./extract-video-info";
import { auditVideo } from "./video-audit";
import { scoreTitle } from "./title-score";
import { median } from "./outlier-analysis";

export type SubScore = {
  key: "ctr" | "metadata" | "headroom" | "trajectory";
  label: string;
  score: number; // 0-100, higher is better
  /** Short evidence line shown to the user explaining the number. */
  evidence: string;
};

export type VisibilityGrade = "A" | "B" | "C" | "D" | "F";

export type VisibilityScoreResult = {
  channel: {
    id: string;
    title: string;
    handle: string | null;
    thumbnailUrl: string | null;
    subscriberCount: number | null;
    videoCount: number | null;
  };
  /** How many videos we actually analyzed. */
  windowSize: number;
  /** Composite weighted score 0-100. */
  overallScore: number;
  grade: VisibilityGrade;
  subscores: SubScore[];
  /** Optional one-sentence summary written by Claude Haiku. Null if LLM skipped/failed. */
  summary: string | null;
};

const WEIGHTS: Record<SubScore["key"], number> = {
  ctr: 0.35,
  metadata: 0.25,
  headroom: 0.15,
  trajectory: 0.25,
};

export function computeVisibilityScore(
  channel: {
    id: string;
    title: string;
    handle: string | null;
    thumbnailUrl: string | null;
    subscriberCount: number | null;
    videoCount: number | null;
  },
  videoIds: string[],
  videoMap: Map<string, ApiVideoData & VideoEngagement>,
  summary: string | null = null
): VisibilityScoreResult {
  const videos = videoIds
    .map((id) => videoMap.get(id))
    .filter((v): v is ApiVideoData & VideoEngagement => Boolean(v));

  // ─── CTR Potential ───
  // Average title score across the window. Title is the biggest CTR lever
  // we can measure without external data.
  const titleScores = videos.map((v) => scoreTitle(v.title).score);
  const ctrScore =
    titleScores.length > 0
      ? Math.round(titleScores.reduce((s, x) => s + x, 0) / titleScores.length)
      : 0;
  const ctrEvidence = `Average title score: ${ctrScore} across ${titleScores.length} videos`;

  // ─── Metadata Quality ───
  // Average of overall Video Audit scores (omitTags so API-only data works).
  const auditScores = videoIds
    .map((id) => {
      const data = videoMap.get(id);
      if (!data) return null;
      const info = videoInfoFromApi(id, data);
      return auditVideo(info, { omitTags: true }).overallScore;
    })
    .filter((s): s is number => s !== null);
  const metadataScore =
    auditScores.length > 0
      ? Math.round(auditScores.reduce((s, x) => s + x, 0) / auditScores.length)
      : 0;
  const metadataEvidence = `Average audit score across description, hashtags, chapters: ${metadataScore}`;

  // ─── Niche Headroom ───
  // Ratio of median views to subscriber count. Higher ratio = videos
  // reaching beyond the existing subscriber base = room to grow into
  // a wider audience. Clamped to a sensible 0-100 scale.
  const viewCounts = videos
    .map((v) => v.viewCount)
    .filter((v): v is number => v !== null && v > 0);
  const medianViews = median(viewCounts);
  const subs = channel.subscriberCount ?? 0;
  let headroomScore = 50; // neutral when we can't compute
  let headroomEvidence = "Niche dynamics couldn't be measured (hidden subscriber count or no view data)";
  if (subs > 0 && medianViews > 0) {
    const ratio = medianViews / subs;
    // ratio 0.05 → struggling reach (sub:view ratio bad)
    // ratio 0.20 → typical
    // ratio 0.50 → reaching well beyond subs
    // ratio 1.0+ → viral/algo-loved
    // Map to 0-100 via clamped log scale.
    const logRatio = Math.log10(Math.max(ratio, 0.01)); // -2 to ~0.5
    headroomScore = Math.round(clamp((logRatio + 2) * 33, 0, 100)); // 0 at ratio=0.01, ~100 at ratio=1.0
    headroomEvidence = `Median views (${formatCompact(medianViews)}) vs subscribers (${formatCompact(subs)}): ${(ratio * 100).toFixed(0)}% reach ratio`;
  }

  // ─── Growth Trajectory ───
  // Outlier ratio: what % of videos beat 1.5x the channel median.
  // Lots of outliers = the audience occasionally breaks open. Flat channels
  // score low even if quality is high.
  let trajectoryScore = 50;
  let trajectoryEvidence = "Not enough video data to measure outlier rate";
  if (viewCounts.length >= 5 && medianViews > 0) {
    const outliers = viewCounts.filter((v) => v >= medianViews * 1.5).length;
    const ratio = outliers / viewCounts.length;
    // 0% outliers = perfectly flat (50)
    // 20% outliers = healthy variation (70)
    // 40%+ = strong breakout pattern (90+)
    trajectoryScore = Math.round(clamp(50 + ratio * 200, 0, 100));
    trajectoryEvidence = `${outliers} of ${viewCounts.length} videos broke through 1.5× median (${Math.round(ratio * 100)}%)`;
  }

  const subscores: SubScore[] = [
    { key: "ctr", label: "CTR Potential", score: ctrScore, evidence: ctrEvidence },
    { key: "metadata", label: "Metadata Quality", score: metadataScore, evidence: metadataEvidence },
    { key: "headroom", label: "Niche Headroom", score: headroomScore, evidence: headroomEvidence },
    { key: "trajectory", label: "Growth Trajectory", score: trajectoryScore, evidence: trajectoryEvidence },
  ];

  // Weighted overall
  const overallScore = Math.round(
    subscores.reduce((sum, s) => sum + s.score * WEIGHTS[s.key], 0)
  );

  return {
    channel,
    windowSize: videos.length,
    overallScore,
    grade: scoreToGrade(overallScore),
    subscores,
    summary,
  };
}

export function scoreToGrade(score: number): VisibilityGrade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/**
 * System prompt for the optional Haiku summary — one sentence
 * positioning the channel's standing across the four sub-scores.
 *
 * The summary is intentionally short and quotable, designed to be
 * pasted into Twitter / a tweet about the channel.
 */
export const VISIBILITY_SUMMARY_SYSTEM_PROMPT = `You write one-sentence positioning summaries of YouTube channels based on a 4-dimension Visibility Score.

You receive 4 sub-scores (0-100 each, higher is better):
  - CTR Potential (title discipline)
  - Metadata Quality (description / hashtags / chapters)
  - Niche Headroom (reach beyond subscriber base)
  - Growth Trajectory (outlier rate)

Return JSON only — no markdown, no preamble:
{"summary": "one quotable sentence"}

The sentence must:
- Be a single sentence, max 25 words
- Name the channel's biggest strength AND biggest gap explicitly ("Strong title discipline but leaves CTR on the table with weak descriptions")
- Avoid generic phrasing ("doing great with content", "needs improvement"). Reference the specific dimensions.
- Be quotable — written as if for a Twitter share or a creator dashboard caption.`;

export function buildVisibilitySummaryUserMessage(
  channelTitle: string,
  subscores: SubScore[]
): string {
  const lines = subscores.map((s) => `${s.label}: ${s.score}`).join("\n");
  return `Channel: ${channelTitle}\n\n${lines}\n\nReturn the one-sentence summary as JSON now.`;
}
