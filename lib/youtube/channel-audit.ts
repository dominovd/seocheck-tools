/**
 * Channel Audit — unified channel dashboard.
 *
 * Single source of truth for everything we know about a channel:
 *   - Headline composite score 0-100 (the quotable number)
 *   - 4 subscores: CTR Potential / Metadata Quality / Niche Headroom / Growth Trajectory
 *   - 4 metadata dimensions (title/description/hashtags/chapters) with band breakdown
 *   - Recommended fixes (recurring issues) with deterministic severity + affectedCount
 *   - Channel snapshot (subs, total videos, created date, primary niche)
 *
 * This used to be two tools — Channel Audit and Visibility Score. Merged
 * in 2026-06 because (a) they showed overlapping signals on the same
 * channel, (b) creators wanted one dashboard not two, (c) the headline
 * number is more quotable with 4 subscores than a single "average score".
 *
 * Pipeline (called from the API route):
 *  1. Resolve channel + uploadsPlaylistId + topicCategories (1 unit)
 *  2. Latest 30 video IDs via playlistItems.list (1 unit)
 *  3. Batched videos.list for stats + snippet (1 unit)
 *  4. Audit each video (omitTags — API doesn't return tags for non-owners)
 *  5. Aggregate per-dimension band stats across all videos
 *  6. Compute 4 visibility subscores via computeVisibilityScore()
 *  7. Compute deterministic recurring-issue candidates from dimension data
 *  8. LLM (Haiku) rewrites issue text + optional one-sentence summary
 *
 * Cost: 3 YouTube units + 1 Haiku call. Cache 24h by channel ID.
 */

import type { ApiVideoData, VideoEngagement } from "./youtube-api";
import { videoInfoFromApi } from "./extract-video-info";
import { auditVideo, type AuditBand } from "./video-audit";
import { computeVisibilityScore, type SubScore } from "./visibility-score";

export type ChannelGrade = "A" | "B" | "C" | "D" | "F";

/** Headline / subscore band used for UI color coding. */
export type ScoreBand = "excellent" | "very-good" | "medium" | "weak";

/** Severity attached to a recurring issue. */
export type IssueSeverity = "high" | "medium" | "low" | "good";

export type Subscore = SubScore & {
  /** Color band for UI. Derived from `score`. */
  band: ScoreBand;
  /** Human label for the band ("Excellent" / "Very Good" / "Medium" / "Weak"). */
  bandLabel: string;
};

export type DimensionStats = {
  key: string;
  label: string;
  /** Average score across all audited videos (0-100). */
  averageScore: number;
  /** Count of videos in each band. */
  bandCounts: Record<AuditBand, number>;
  /** Worst dimension iff true — feeds the recurring-issue callout. */
  isWorst: boolean;
};

export type ChannelAuditVideo = {
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string | null;
  publishDate: string | null;
  viewCount: number | null;
  /** Full Video Audit result for this video (tags dimension excluded). */
  audit: ReturnType<typeof auditVideo>;
};

export type RecurringIssue = {
  /** Creator-friendly action sentence. Written by Haiku in the happy path. */
  text: string;
  /** Deterministic severity computed from band counts. */
  severity: IssueSeverity;
  /** How many of the analyzed videos are affected. */
  affectedCount: number;
  /** Dimension this issue is tied to ("title" | "description" | ...). */
  dimensionKey: string | null;
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
    /** Friendly niche label derived from YouTube topicCategories ("Education", "Gaming", etc.). Null if not classifiable. */
    primaryNiche: string | null;
  };
  /** How many videos we actually analyzed (≤30, may be smaller for tiny channels). */
  windowSize: number;
  /** Composite weighted score 0-100. The quotable number. */
  overallScore: number;
  grade: ChannelGrade;
  /** Band for the headline score (drives ring color in the UI). */
  overallBand: ScoreBand;
  overallBandLabel: string;
  /** 4 subscores: CTR / Metadata / Headroom / Trajectory. */
  subscores: Subscore[];
  /** Per-dimension aggregation: title / description / hashtags / chapters. */
  dimensions: DimensionStats[];
  /** Recommended fixes with deterministic severity. */
  recurringIssues: RecurringIssue[];
  /** Each video's individual audit result (for the "Audited videos" list). */
  videos: ChannelAuditVideo[];
  /** Optional one-sentence positioning summary from Haiku. */
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

export function computeGrade(score: number): ChannelGrade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

/**
 * Score → band mapping for UI coloring. Tuned to the mockup:
 *   80+: Excellent (green)
 *   65-79: Very Good (green)
 *   50-64: Medium (amber)
 *   <50: Weak (red)
 */
export function scoreToBand(score: number): { band: ScoreBand; label: string } {
  if (score >= 80) return { band: "excellent", label: "Excellent" };
  if (score >= 65) return { band: "very-good", label: "Very Good" };
  if (score >= 50) return { band: "medium", label: "Medium" };
  return { band: "weak", label: "Weak" };
}

export const GRADE_DESCRIPTION: Record<ChannelGrade, string> = {
  A: "Channel-wide packaging discipline. Most videos optimized across most dimensions.",
  B: "Strong overall, with one or two dimensions consistently letting videos down.",
  C: "Mixed. Some videos packaged well, others not. Look at the subscore breakdown for the pattern.",
  D: "Recurring packaging gaps. Most videos have multiple weak dimensions.",
  F: "Systematic packaging issues across the channel. Highest-leverage area: pick the worst dimension and fix it everywhere.",
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
 * Aggregate per-dimension band stats across an array of audited videos.
 */
export function aggregateDimensions(
  audited: ChannelAuditVideo[]
): DimensionStats[] {
  if (audited.length === 0) return [];
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
      isWorst: false,
    };
  });

  if (dimensions.length > 0) {
    const minAvg = Math.min(...dimensions.map((d) => d.averageScore));
    for (const d of dimensions) {
      if (d.averageScore === minAvg) d.isWorst = true;
    }
  }
  return dimensions;
}

/**
 * Deterministically rank dimensions by how "broken" they are, returning
 * a candidate set of issues with severity + affectedCount. The LLM then
 * rewrites each candidate's text into a creator-actionable sentence.
 *
 * We pre-compute severity because:
 *   - Severity must match the actual band counts (LLMs invent numbers)
 *   - High/medium/low maps cleanly to UI pills
 *   - If the LLM call fails we still surface usable fallback text
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

  // Pick top 3 by severity (high > medium > low), then by affectedCount desc
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
 * Identify any dimension that is uniformly strong (>=80% videos in strong/good).
 * Used to add a positive "Keep it up" item to the recommended-fixes list when
 * the rest of the recommendations are negative.
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
  /** LLM-supplied recurring issues (text only — severity and counts come from us). */
  llmIssues?: Array<{ dimensionKey: string; text: string }>;
  /** LLM-supplied positioning summary. */
  summary?: string | null;
  analysisFailed?: boolean;
}): ChannelAuditResult {
  const { channel, videoIds, videoMap } = args;

  // Per-video audits
  const audited: ChannelAuditVideo[] = videoIds
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

  const dimensions = aggregateDimensions(audited);

  // Visibility-Score-style composite
  const visibilityChannelData = {
    id: channel.id,
    title: channel.title,
    handle: channel.handle,
    thumbnailUrl: channel.thumbnailUrl,
    subscriberCount: channel.subscriberCount,
    videoCount: channel.videoCount,
  };
  const visibility = computeVisibilityScore(visibilityChannelData, videoIds, videoMap);

  const subscores: Subscore[] = visibility.subscores.map((s) => {
    const { band, label } = scoreToBand(s.score);
    return { ...s, band, bandLabel: label };
  });

  const overallScore = visibility.overallScore;
  const grade = computeGrade(overallScore);
  const { band: overallBand, label: overallBandLabel } = scoreToBand(overallScore);

  // Recurring issues
  const candidates = rankIssueCandidates(dimensions, audited.length);
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

  // Optional "Keep it up" item when at least one dimension is uniformly strong.
  const goodDim = findGoodDimension(dimensions, audited.length);
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
    windowSize: audited.length,
    overallScore,
    grade,
    overallBand,
    overallBandLabel,
    subscores,
    dimensions,
    recurringIssues,
    videos: audited,
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
 * descriptions") into a creator-actionable sentence ("Most uploads skip the
 * first-line hook — open every description with a one-sentence value prop").
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
 * One-sentence positioning summary (Haiku). Optional — UI hides cleanly
 * when null.
 */
export const CHANNEL_AUDIT_SUMMARY_SYSTEM_PROMPT = `You write one-sentence positioning summaries of a YouTube channel based on a 4-dimension Visibility Score.

You receive 4 subscores (0-100 each, higher is better):
  - CTR Potential (title discipline)
  - Metadata Quality (description / hashtags / chapters)
  - Niche Headroom (reach beyond subscriber base)
  - Growth Trajectory (outlier rate)

Return JSON only — no markdown, no preamble:
{"summary": "one quotable sentence"}

The sentence must:
- Be a single sentence, max 25 words
- Name the channel's biggest strength AND biggest gap explicitly ("Strong title discipline but leaves CTR on the table with weak descriptions")
- Avoid em-dashes (use commas, periods, or colons instead)
- Avoid generic phrasing ("doing great with content"). Reference specific dimensions.
- Be quotable — written as if for a Twitter share or a creator dashboard caption.`;

export function buildChannelAuditSummaryMessage(
  channelTitle: string,
  subscores: Subscore[]
): string {
  const lines = subscores.map((s) => `${s.label}: ${s.score}`).join("\n");
  return `Channel: ${channelTitle}\n\n${lines}\n\nReturn the one-sentence summary as JSON now.`;
}
