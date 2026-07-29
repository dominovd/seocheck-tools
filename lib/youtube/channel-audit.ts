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

export type DimensionStats = {
  key: string;
  label: string;
  /** Count of videos in each band. Factual — no derived numeric average. */
  bandCounts: Record<AuditBand, number>;
  /** Marked when this dimension has the most videos in weak/fair. Editorial callout, not a metric. */
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
  /** Raw count of videos this issue applies to. Factual aggregation over YouTube API data. */
  affectedCount: number;
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

/**
 * Aggregate per-dimension band stats across audited videos. Returns
 * band counts only — no averageScore is computed for public display.
 */
export function aggregateDimensions(
  audited: Array<{ audit: ReturnType<typeof auditVideo> }>
): DimensionStats[] {
  if (audited.length === 0) return [];
  const dimKeys = audited[0].audit.dimensions.map((d) => d.key);
  const dimensions: DimensionStats[] = dimKeys.map((key) => {
    const bandCounts: Record<AuditBand, number> = {
      strong: 0,
      good: 0,
      fair: 0,
      weak: 0,
    };
    for (const v of audited) {
      const d = v.audit.dimensions.find((dd) => dd.key === key);
      if (!d) continue;
      bandCounts[d.band] += 1;
    }
    return {
      key,
      label: DIM_LABELS[key] ?? key,
      bandCounts,
      isWorst: false,
    };
  });

  // Mark the dimension with the largest weak+fair share as "worst" for editorial callout.
  if (dimensions.length > 0) {
    const withWeakSum = dimensions.map((d) => ({
      d,
      badCount: d.bandCounts.weak + d.bandCounts.fair,
    }));
    const maxBad = Math.max(...withWeakSum.map((w) => w.badCount));
    if (maxBad > 0) {
      for (const w of withWeakSum) {
        if (w.badCount === maxBad) w.d.isWorst = true;
      }
    }
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
  affectedCount: number;
  severity: IssueSeverity;
  /** Default text used as fallback when the LLM doesn't rewrite it. */
  fallbackText: string;
};

export function rankIssueCandidates(
  dimensions: DimensionStats[],
  windowSize: number
): IssueCandidate[] {
  if (windowSize === 0) return [];

  const candidates: IssueCandidate[] = [];
  for (const d of dimensions) {
    const weak = d.bandCounts.weak;
    const fair = d.bandCounts.fair;
    const affected = weak + fair;
    const ratio = affected / windowSize;
    const weakRatio = weak / windowSize;

    let severity: IssueSeverity | null = null;
    if (weakRatio >= 0.4 || ratio >= 0.6) severity = "high";
    else if (ratio >= 0.4) severity = "medium";
    else if (ratio >= 0.2) severity = "low";

    if (severity) {
      candidates.push({
        dimensionKey: d.key,
        dimensionLabel: d.label,
        affectedCount: affected,
        severity,
        fallbackText: `${affected} of ${windowSize} videos have weak or missing ${d.label.toLowerCase()}.`,
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
 * Identify any dimension that is uniformly strong (≥80% videos in strong/good).
 * Used to append a "Keep it up" item to the recommended-fixes list.
 */
export function findGoodDimension(
  dimensions: DimensionStats[],
  windowSize: number
): DimensionStats | null {
  if (windowSize === 0) return null;
  for (const d of dimensions) {
    const strong = d.bandCounts.strong + d.bandCounts.good;
    if (strong / windowSize >= 0.8) return d;
  }
  return null;
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

  // Recurring issues
  const candidates = rankIssueCandidates(dimensions, auditedInternal.length);
  const llmIssuesByDim = new Map<string, string>();
  for (const li of args.llmIssues ?? []) {
    if (li && typeof li.text === "string" && typeof li.dimensionKey === "string") {
      llmIssuesByDim.set(li.dimensionKey, li.text.trim());
    }
  }
  const recurringIssues: RecurringIssue[] = candidates.map((c) => ({
    text: llmIssuesByDim.get(c.dimensionKey) || c.fallbackText,
    severity: c.severity,
    affectedCount: c.affectedCount,
    dimensionKey: c.dimensionKey,
  }));

  // Optional "Keep it up" item.
  const goodDim = findGoodDimension(dimensions, auditedInternal.length);
  if (goodDim) {
    recurringIssues.push({
      text: `Strong ${goodDim.label.toLowerCase()} discipline across the channel — keep it up.`,
      severity: "good",
      affectedCount: 0,
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
  - Up to 3 issue candidates, each with: dimensionKey ("title" | "description" | "hashtags" | "chapters"), affectedCount, totalVideos, severity ("high" | "medium" | "low"), and a fallback sentence.

For each candidate, return ONE sentence that:
- Names the specific weakness pattern (not "improve descriptions" — say what to do)
- References the actual counts ("12 of 30 videos…")
- Is action-oriented ("Add a CTA line…", "Front-load the keyword…", "Drop generic tags…")
- Is 1-2 sentences, under 25 words
- Avoids em-dashes (use commas, periods, or colons instead)
- Uses no numeric scores — only counts of affected videos

Return JSON only — no markdown fences, no preamble:
{"issues": [{"dimensionKey": "title", "text": "your sentence here"}, ...]}

If a candidate looks unhelpful or redundant, you may omit it and return fewer than the input set, but never invent new candidates.`;

export function buildChannelAuditUserMessage(
  channelTitle: string,
  candidates: IssueCandidate[],
  totalVideos: number
): string {
  const lines = candidates.map((c, i) => {
    return `${i + 1}. dimensionKey=${c.dimensionKey} affectedCount=${c.affectedCount}/${totalVideos} severity=${c.severity} fallback="${c.fallbackText}"`;
  });
  return (
    `Channel: ${channelTitle}\n` +
    `Window size: ${totalVideos} videos\n\n` +
    `Candidates:\n${lines.join("\n")}\n\n` +
    `Return the JSON now.`
  );
}

/**
 * One-sentence editorial summary (Haiku). Purely textual — describes the
 * strongest and weakest patterns without any numbers.
 */
export const CHANNEL_AUDIT_SUMMARY_SYSTEM_PROMPT = `You write one-sentence editorial summaries of a YouTube channel based on band counts across four packaging dimensions (title, description, hashtags, chapters).

You receive band counts (how many of N recent videos fall in strong/good/fair/weak for each dimension) and a publishing cadence label.

Return JSON only — no markdown, no preamble:
{"summary": "one quotable sentence"}

The sentence must:
- Be a single sentence, max 25 words
- Name the channel's biggest editorial strength AND biggest gap, referencing the packaging dimensions
- Be quotable — written as if for a Twitter share or a creator dashboard caption
- Avoid em-dashes (use commas, periods, or colons instead)
- Avoid numeric scores or grades — describe patterns qualitatively (e.g. "strong hashtag discipline", "most descriptions are weak or missing")
- Avoid generic phrasing like "doing great with content" — reference the specific dimensions`;

export function buildChannelAuditSummaryMessage(
  channelTitle: string,
  dimensions: DimensionStats[],
  windowSize: number,
  cadence: string
): string {
  const lines = dimensions.map((d) => {
    const { strong, good, fair, weak } = d.bandCounts;
    return `${d.label}: strong=${strong}, good=${good}, fair=${fair}, weak=${weak}`;
  });
  return (
    `Channel: ${channelTitle}\n` +
    `Window: ${windowSize} recent uploads\n` +
    `Publishing cadence: ${cadence}\n\n` +
    `Band counts per dimension:\n${lines.join("\n")}\n\n` +
    `Return the one-sentence editorial summary as JSON now.`
  );
}
