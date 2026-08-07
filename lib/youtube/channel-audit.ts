/**
 * Channel Audit — unified channel dashboard (2026-08 revision).
 *
 * This module returns:
 *   - Raw YouTube-provided fields (channel snapshot, per-video metadata)
 *   - Factual aggregations over the last N uploads (counts, medians,
 *     publishing cadence pattern)
 *   - Textual editorial suggestions (recurring issue callouts, per-video
 *     issue lists)
 *
 * It intentionally does NOT return any derived composite score, grade,
 * or 0-100 dimension score to comply with YouTube API Services policy
 * III.E.4h (no independently calculated metrics that replace or
 * augment YouTube API data). The previous "Visibility Score" surface
 * was removed 2026-07 as part of the compliance remediation.
 *
 * Pipeline (called from the API route):
 *  1. Resolve channel + uploadsPlaylistId + topicCategories (1 unit)
 *  2. Latest 30 video IDs via playlistItems.list (1 unit)
 *  3. Batched videos.list for stats + snippet (1 unit)
 *  4. Audit each video (omitTags — API doesn't return tags for non-owners)
 *  5. Aggregate per-dimension band counts
 *  6. Compute deterministic recurring-issue candidates
 *  7. LLM (Haiku) rewrites issue text + optional one-sentence summary
 */

import type { ApiVideoData, VideoEngagement } from "./youtube-api";
import { videoInfoFromApi } from "./extract-video-info";
import { auditVideo, type AuditBand } from "./video-audit";

export type IssueSeverity = "high" | "medium" | "low" | "good";

/**
 * Qualitative scale describing how widespread an editorial pattern is.
 *
 * COMPLIANCE (policy III.E.4h): we must not publish counts we compute
 * ourselves from YouTube data. Instead of "24 of 30 videos", the UI
 * says "most uploads". The underlying count stays server-side.
 */
export type AffectedScale = "all" | "most" | "several" | "few";

export const AFFECTED_SCALE_LABEL: Record<AffectedScale, string> = {
  all: "Across every upload",
  most: "Across most uploads",
  several: "Across several uploads",
  few: "Across a few uploads",
};

/** Map an internal ratio to the public qualitative scale. */
export function toAffectedScale(affected: number, total: number): AffectedScale {
  if (total <= 0) return "few";
  const ratio = affected / total;
  if (ratio >= 0.95) return "all";
  if (ratio >= 0.6) return "most";
  if (ratio >= 0.3) return "several";
  return "few";
}

export type DimensionStats = {
  key: string;
  label: string;
  /**
   * Relative share of the analyzed window in each editorial band, 0 to 1.
   * Used only to size the proportional bar. No count or percentage is
   * rendered as text (policy III.E.4h).
   */
  bandShares: Record<AuditBand, number>;
  /** Qualitative summary of the dominant band, for the text label. */
  summary: string;
  /** Marked when this dimension has the widest weak/fair spread. Editorial callout. */
  isWorst: boolean;
};

/** Per-video row surfaced in the "Audited videos" list. Only raw metadata + textual issues. */
export type ChannelAuditVideo = {
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string | null;
  publishDate: string | null;
  viewCount: number | null;
  likeCount: number | null;
  commentCount: number | null;
  durationSec: number | null;
  /** Textual editorial issues found by the per-video auditor. No numeric score. */
  issues: string[];
};

export type RecurringIssue = {
  /** Creator-friendly action sentence. Written by Haiku in the happy path, deterministic fallback otherwise. */
  text: string;
  /** Editorial priority label. Not a numeric metric. */
  severity: IssueSeverity;
  /** Qualitative spread of the pattern. Replaces the previous numeric count. */
  affectedScale: AffectedScale;
  /** Dimension this issue is tied to ("title" | "description" | ...). */
  dimensionKey: string | null;
};

/** Factual aggregations over raw YouTube API data. No composites. */
export type ChannelAggregations = {
  /** Total views summed across the analyzed window. Raw sum, not derived. */
  totalViews: number;
  medianViews: number;
  meanViews: number;
  /** Median video length in seconds. */
  medianDurationSec: number | null;
  /** Descriptive publishing cadence label ("2 uploads per week", "monthly"). */
  publishingCadence: string;
  /** Earliest and latest publish dates in the window. */
  dateRange: { earliest: string | null; latest: string | null };
};

export type ChannelAuditResult = {
  channel: {
    id: string;
    title: string;
    handle: string | null;
    thumbnailUrl: string | null;
    subscriberCount: number | null;
    videoCount: number | null;
    /** ISO YYYY-MM-DD of channel creation. */
    publishedAt: string | null;
    /** Friendly niche label derived from YouTube topicCategories. Null if not classifiable. */
    primaryNiche: string | null;
  };
  /** How many videos we actually analyzed (≤30, may be smaller for tiny channels). */
  windowSize: number;
  /** Factual aggregations over raw YouTube data. Replaces the removed composite score surface. */
  aggregations: ChannelAggregations;
  /** Per-dimension band counts (Strong / Good / Fair / Weak). Factual counts. */
  dimensions: DimensionStats[];
  /** Recommended fixes with deterministic severity + affected count. Textual. */
  recurringIssues: RecurringIssue[];
  /** Each video's raw metadata + textual issue list. */
  videos: ChannelAuditVideo[];
  /** Optional one-sentence editorial summary from Haiku (textual, no numbers). */
  summary: string | null;
  /** True iff the LLM step failed — UI degrades gracefully. */
  analysisFailed?: boolean;
};

const DIM_LABELS: Record<string, string> = {
  title: "Title",
  description: "Description",
  hashtags: "Hashtags",
  chapters: "Chapters",
};

/**
 * Map a Wikipedia topic URL from YouTube topicCategories to a friendly niche label.
 *
 * The API returns things like "https://en.wikipedia.org/wiki/Lifestyle_(sociology)".
 * We take the last path segment, decode it, strip parenthesised qualifiers,
 * and use that as the primary niche.
 */
export function topicCategoriesToNiche(topicCategories: string[]): string | null {
  if (!Array.isArray(topicCategories) || topicCategories.length === 0) return null;
  for (const url of topicCategories) {
    if (typeof url !== "string") continue;
    const m = url.match(/\/wiki\/([^/?#]+)/);
    if (!m) continue;
    let slug = decodeURIComponent(m[1]).replace(/_/g, " ");
    // Strip parenthesised qualifiers: "Lifestyle (sociology)" -> "Lifestyle"
    slug = slug.replace(/\s*\([^)]*\)\s*$/, "").trim();
    if (slug) return slug;
  }
  return null;
}

/** Internal-only band tallies. Never returned to the client. */
export type InternalBandCounts = Record<AuditBand, number>;

/**
 * Tally editorial bands per dimension. Server-side only — the counts
 * drive severity ranking and bar proportions but are never published
 * (policy III.E.4h).
 */
export function tallyBands(
  audited: Array<{ audit: ReturnType<typeof auditVideo> }>
): Array<{ key: string; counts: InternalBandCounts }> {
  if (audited.length === 0) return [];
  const dimKeys = audited[0].audit.dimensions.map((d) => d.key);
  return dimKeys.map((key) => {
    const counts: InternalBandCounts = { strong: 0, good: 0, fair: 0, weak: 0 };
    for (const v of audited) {
      const d = v.audit.dimensions.find((dd) => dd.key === key);
      if (!d) continue;
      counts[d.band] += 1;
    }
    return { key, counts };
  });
}

/** Qualitative one-liner describing where a dimension mostly sits. */
function describeBandSpread(counts: InternalBandCounts, total: number): string {
  if (total <= 0) return "Not enough uploads to assess";
  const solid = counts.strong + counts.good;
  const shaky = counts.fair + counts.weak;
  const solidRatio = solid / total;
  const weakRatio = counts.weak / total;

  if (weakRatio >= 0.95) return "Weak across every upload";
  if (solidRatio >= 0.95) return "Strong across every upload";
  if (solidRatio >= 0.6) return "Solid on most uploads";
  if (shaky >= solid && weakRatio >= 0.5) return "Weak on most uploads";
  if (shaky > solid) return "Needs work on most uploads";
  return "Mixed across the channel";
}

/**
 * Aggregate per-dimension stats for public display. Returns proportional
 * band shares (used only to size the bar) plus a qualitative summary.
 * No count or percentage is exposed as text.
 */
export function aggregateDimensions(
  audited: Array<{ audit: ReturnType<typeof auditVideo> }>
): DimensionStats[] {
  if (audited.length === 0) return [];
  const total = audited.length;
  const tallies = tallyBands(audited);

  const dimensions: DimensionStats[] = tallies.map(({ key, counts }) => ({
    key,
    label: DIM_LABELS[key] ?? key,
    bandShares: {
      strong: counts.strong / total,
      good: counts.good / total,
      fair: counts.fair / total,
      weak: counts.weak / total,
    },
    summary: describeBandSpread(counts, total),
    isWorst: false,
  }));

  // Mark the dimension with the widest weak+fair spread for the editorial callout.
  const badShares = tallies.map(
    ({ counts }) => (counts.weak + counts.fair) / total
  );
  const maxBad = Math.max(...badShares);
  if (maxBad > 0) {
    dimensions.forEach((d, i) => {
      if (badShares[i] === maxBad) d.isWorst = true;
    });
  }
  return dimensions;
}

/**
 * Compute publishing cadence description from a list of publish dates.
 * Returns a human phrase like "2 uploads per week" or "roughly monthly".
 */
export function describeCadence(publishDates: string[]): string {
  const dates = publishDates
    .filter((d): d is string => typeof d === "string" && d.length >= 10)
    .map((d) => new Date(d).getTime())
    .filter((t) => Number.isFinite(t))
    .sort((a, b) => b - a);
  if (dates.length < 2) return "not enough data to estimate cadence";

  const spanMs = dates[0] - dates[dates.length - 1];
  if (spanMs <= 0) return "not enough data to estimate cadence";

  const spanDays = spanMs / (1000 * 60 * 60 * 24);
  const uploadsPerWeek = ((dates.length - 1) / spanDays) * 7;

  if (uploadsPerWeek >= 10) return `${Math.round(uploadsPerWeek)} uploads per week (very high volume)`;
  if (uploadsPerWeek >= 3) return `${Math.round(uploadsPerWeek)} uploads per week`;
  if (uploadsPerWeek >= 1.2) return "about twice per week";
  if (uploadsPerWeek >= 0.85) return "roughly weekly";
  if (uploadsPerWeek >= 0.4) return "roughly bi-weekly";
  if (uploadsPerWeek >= 0.18) return "roughly monthly";
  return "less than monthly";
}

/**
 * Median of a numeric list. Returns 0 for empty input.
 */
export function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

/**
 * Compute channel-level aggregations from the audited videos. All fields
 * are factual — sums, medians, means, cadence patterns, date ranges.
 */
export function computeAggregations(videos: ChannelAuditVideo[]): ChannelAggregations {
  const views = videos.map((v) => v.viewCount).filter((v): v is number => typeof v === "number" && v >= 0);
  const durations = videos
    .map((v) => v.durationSec)
    .filter((v): v is number => typeof v === "number" && v > 0);
  const dates = videos.map((v) => v.publishDate).filter((v): v is string => typeof v === "string");
  const sortedDates = [...dates].sort();

  const totalViews = views.reduce((s, v) => s + v, 0);
  const meanViews = views.length > 0 ? Math.round(totalViews / views.length) : 0;
  const medianViews = median(views);
  const medianDurationSec = durations.length > 0 ? median(durations) : null;
  const publishingCadence = describeCadence(dates);

  return {
    totalViews,
    medianViews,
    meanViews,
    medianDurationSec,
    publishingCadence,
    dateRange: {
      earliest: sortedDates[0] ?? null,
      latest: sortedDates[sortedDates.length - 1] ?? null,
    },
  };
}

/**
 * Deterministically rank dimensions by how "broken" they are, returning
 * a candidate set of issues with severity + affectedCount. The LLM then
 * rewrites each candidate's text into a creator-actionable sentence.
 *
 * Severity comes from the raw band counts — never invented. Severity is
 * an editorial priority label, not a metric.
 */
export type IssueCandidate = {
  dimensionKey: string;
  dimensionLabel: string;
  /** Internal only. Drives ranking and the qualitative scale, never published. */
  affectedCount: number;
  affectedScale: AffectedScale;
  severity: IssueSeverity;
  /** Default text used as fallback when the LLM doesn't rewrite it. Contains no counts. */
  fallbackText: string;
};

export function rankIssueCandidates(
  tallies: Array<{ key: string; counts: InternalBandCounts }>,
  windowSize: number
): IssueCandidate[] {
  if (windowSize === 0) return [];

  const candidates: IssueCandidate[] = [];
  for (const { key, counts } of tallies) {
    const affected = counts.weak + counts.fair;
    const ratio = affected / windowSize;
    const weakRatio = counts.weak / windowSize;
    const label = DIM_LABELS[key] ?? key;

    let severity: IssueSeverity | null = null;
    if (weakRatio >= 0.4 || ratio >= 0.6) severity = "high";
    else if (ratio >= 0.4) severity = "medium";
    else if (ratio >= 0.2) severity = "low";

    if (severity) {
      const scale = toAffectedScale(affected, windowSize);
      const spread =
        scale === "all"
          ? "Every upload has"
          : scale === "most"
          ? "Most uploads have"
          : scale === "several"
          ? "Several uploads have"
          : "A few uploads have";
      candidates.push({
        dimensionKey: key,
        dimensionLabel: label,
        affectedCount: affected,
        affectedScale: scale,
        severity,
        fallbackText: `${spread} weak or missing ${label.toLowerCase()}.`,
      });
    }
  }

  const sevOrder: Record<IssueSeverity, number> = { high: 3, medium: 2, low: 1, good: 0 };
  candidates.sort((a, b) => {
    if (sevOrder[b.severity] !== sevOrder[a.severity]) {
      return sevOrder[b.severity] - sevOrder[a.severity];
    }
    return b.affectedCount - a.affectedCount;
  });

  return candidates.slice(0, 3);
}

/**
 * Identify any dimension that is uniformly strong (most videos in strong/good).
 * Used to append a "Keep it up" item to the recommended-fixes list.
 */
export function findGoodDimension(
  tallies: Array<{ key: string; counts: InternalBandCounts }>,
  windowSize: number
): { key: string; label: string } | null {
  if (windowSize === 0) return null;
  for (const { key, counts } of tallies) {
    const solid = counts.strong + counts.good;
    if (solid / windowSize >= 0.8) {
      return { key, label: DIM_LABELS[key] ?? key };
    }
  }
  return null;
}

/**
 * Safety net for LLM output. Rewrites any "N of M videos" or "N videos"
 * phrasing the model may still emit into qualitative language, so no
 * self-computed count can reach the page (policy III.E.4h).
 */
export function stripCounts(text: string): string {
  return text
    .replace(/\b(all\s+)?\d+\s+of\s+\d+\s+(videos?|uploads?)\b/gi, "most uploads")
    .replace(/\ball\s+\d+\s+(videos?|uploads?)\b/gi, "every upload")
    .replace(/\b\d+\s+(videos?|uploads?)\b/gi, "several uploads")
    .replace(/\b\d+\s*%\s*of\s+(videos?|uploads?|results?)\b/gi, "a large share of uploads")
    .trim();
}

/**
 * Extract textual issues from a per-video audit result. We surface up to
 * 4 short signals per video ("no chapters", "description too short", etc)
 * without exposing any numeric score.
 */
function extractVideoIssues(audit: ReturnType<typeof auditVideo>): string[] {
  const issues: string[] = [];
  for (const dim of audit.dimensions) {
    if (dim.band === "weak" || dim.band === "fair") {
      // Prefer the first signal string from the dimension, fallback to a
      // generic "weak/fair {dimension}" line.
      const firstSignal = dim.signals?.[0]?.message?.trim();
      if (firstSignal) {
        issues.push(firstSignal);
      } else {
        issues.push(`${dim.label} is ${dim.band}`);
      }
    }
  }
  return issues.slice(0, 4);
}

/** Pure-function orchestrator. The API route calls this after fetching API data. */
export function computeChannelAudit(args: {
  channel: {
    id: string;
    title: string;
    handle: string | null;
    thumbnailUrl: string | null;
    subscriberCount: number | null;
    videoCount: number | null;
    publishedAt: string | null;
    topicCategories: string[];
  };
  videoIds: string[];
  videoMap: Map<string, ApiVideoData & VideoEngagement>;
  /** LLM-supplied recurring issue text (severity + counts come from us). */
  llmIssues?: Array<{ dimensionKey: string; text: string }>;
  /** LLM-supplied textual summary. */
  summary?: string | null;
  analysisFailed?: boolean;
}): ChannelAuditResult {
  const { channel, videoIds, videoMap } = args;

  // Per-video audits (no score exposure — only pull the band + signals)
  type AuditedRow = {
    id: string;
    audit: ReturnType<typeof auditVideo>;
  };
  const auditedInternal: AuditedRow[] = videoIds
    .map((id) => {
      const data = videoMap.get(id);
      if (!data) return null;
      const info = videoInfoFromApi(id, data);
      const audit = auditVideo(info, { omitTags: true });
      return { id, audit };
    })
    .filter((v): v is AuditedRow => v !== null);

  // Public video rows: raw metadata + textual issues only.
  const videos: ChannelAuditVideo[] = auditedInternal.map((row) => {
    const data = videoMap.get(row.id);
    return {
      videoId: row.id,
      videoUrl: `https://www.youtube.com/watch?v=${row.id}`,
      title: data?.title ?? "",
      thumbnailUrl: data?.thumbnailUrl ?? null,
      publishDate: data?.publishDate ?? null,
      viewCount: data?.viewCount ?? null,
      likeCount: data?.likeCount ?? null,
      commentCount: data?.commentCount ?? null,
      durationSec: data?.lengthSeconds ?? null,
      issues: extractVideoIssues(row.audit),
    };
  });

  const dimensions = aggregateDimensions(auditedInternal);
  const aggregations = computeAggregations(videos);

  // Recurring issues. Band tallies stay server-side; only the qualitative
  // scale reaches the client (policy III.E.4h).
  const tallies = tallyBands(auditedInternal);
  const candidates = rankIssueCandidates(tallies, auditedInternal.length);
  const llmIssuesByDim = new Map<string, string>();
  for (const li of args.llmIssues ?? []) {
    if (li && typeof li.text === "string" && typeof li.dimensionKey === "string") {
      llmIssuesByDim.set(li.dimensionKey, li.text.trim());
    }
  }
  const recurringIssues: RecurringIssue[] = candidates.map((c) => ({
    text: stripCounts(llmIssuesByDim.get(c.dimensionKey) || c.fallbackText),
    severity: c.severity,
    affectedScale: c.affectedScale,
    dimensionKey: c.dimensionKey,
  }));

  // Optional "Keep it up" item.
  const goodDim = findGoodDimension(tallies, auditedInternal.length);
  if (goodDim) {
    recurringIssues.push({
      text: `Strong ${goodDim.label.toLowerCase()} discipline across the channel. Keep it up.`,
      severity: "good",
      affectedScale: "most",
      dimensionKey: goodDim.key,
    });
  }

  const primaryNiche = topicCategoriesToNiche(channel.topicCategories);

  return {
    channel: {
      id: channel.id,
      title: channel.title,
      handle: channel.handle,
      thumbnailUrl: channel.thumbnailUrl,
      subscriberCount: channel.subscriberCount,
      videoCount: channel.videoCount,
      publishedAt: channel.publishedAt,
      primaryNiche,
    },
    windowSize: auditedInternal.length,
    aggregations,
    dimensions,
    recurringIssues,
    videos,
    summary: args.summary ?? null,
    analysisFailed: args.analysisFailed,
  };
}

/**
 * LLM prompt for the recurring-issue rewrite step.
 *
 * The LLM does NOT decide severity or affectedCount — those are computed
 * deterministically from the dimension band counts in rankIssueCandidates().
 * The LLM's job is purely to turn a bland fact ("12 of 30 videos have weak
 * descriptions") into a creator-actionable sentence.
 */
export const CHANNEL_AUDIT_SYSTEM_PROMPT = `You write creator-actionable recurring-issue sentences for a YouTube channel audit.

You receive:
  - The channel name
  - Up to 3 issue candidates, each with: dimensionKey ("title" | "description" | "hashtags" | "chapters"), a qualitative spread ("all" | "most" | "several" | "few"), severity ("high" | "medium" | "low"), and a fallback sentence.

For each candidate, return ONE sentence that:
- Names the specific weakness pattern (not "improve descriptions", say what to do)
- Is action-oriented ("Add a CTA line...", "Front-load the keyword...", "Drop generic tags...")
- Is 1-2 sentences, under 25 words
- Avoids em-dashes (use commas, periods, or colons instead)

CRITICAL CONSTRAINTS. The sentence must NOT contain:
- Any digit at all. No counts, no percentages, no ratios, no scores.
- Phrases like "12 of 30 videos", "24 videos", "80% of uploads".
Describe spread qualitatively instead, using the provided scale:
  all -> "every upload"
  most -> "most uploads"
  several -> "several uploads"
  few -> "a few uploads"

Good: "Most uploads skip chapters. Add timestamped markers so viewers can navigate long sections."
Bad: "24 of 30 videos have no chapters."

Return JSON only, no markdown fences, no preamble:
{"issues": [{"dimensionKey": "title", "text": "your sentence here"}, ...]}

If a candidate looks unhelpful or redundant, you may omit it and return fewer than the input set, but never invent new candidates.`;

export function buildChannelAuditUserMessage(
  channelTitle: string,
  candidates: IssueCandidate[],
  _totalVideos: number
): string {
  // Deliberately omits raw counts so the model cannot echo them back.
  const lines = candidates.map((c, i) => {
    return `${i + 1}. dimensionKey=${c.dimensionKey} spread=${c.affectedScale} severity=${c.severity} fallback="${c.fallbackText}"`;
  });
  return (
    `Channel: ${channelTitle}\n\n` +
    `Candidates:\n${lines.join("\n")}\n\n` +
    `Return the JSON now. Remember: no digits anywhere in your sentences.`
  );
}

/**
 * One-sentence editorial summary (Haiku). Purely textual — describes the
 * strongest and weakest patterns without any numbers.
 */
export const CHANNEL_AUDIT_SUMMARY_SYSTEM_PROMPT = `You write one-sentence editorial summaries of a YouTube channel based on qualitative assessments across four packaging dimensions (title, description, hashtags, chapters).

You receive a qualitative verdict per dimension and a publishing cadence label.

Return JSON only, no markdown, no preamble:
{"summary": "one quotable sentence"}

The sentence must:
- Be a single sentence, max 25 words
- Name the channel's biggest editorial strength AND biggest gap, referencing the packaging dimensions
- Be quotable, written as if for a creator dashboard caption
- Avoid em-dashes (use commas, periods, or colons instead)
- Avoid generic phrasing like "doing great with content", reference the specific dimensions

CRITICAL: The sentence must contain NO digits. No counts, no percentages, no scores, no grades. Describe everything qualitatively, for example "strong hashtag discipline but most descriptions are thin".`;

export function buildChannelAuditSummaryMessage(
  channelTitle: string,
  dimensions: DimensionStats[],
  _windowSize: number,
  cadence: string
): string {
  // Sends only qualitative summaries so the model has no counts to echo.
  const lines = dimensions.map((d) => `${d.label}: ${d.summary}`);
  return (
    `Channel: ${channelTitle}\n` +
    `Publishing cadence: ${cadence}\n\n` +
    `Per-dimension assessment:\n${lines.join("\n")}\n\n` +
    `Return the one-sentence editorial summary as JSON now. No digits.`
  );
}
