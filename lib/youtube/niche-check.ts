/**
 * Niche Check — topic-level opportunity verdict engine.
 *
 * Answers "should I make a video about X?" with one of six verdicts:
 *
 *   ENTER_NOW         — outlier breakthroughs visible + demand healthy
 *   NICHE_GAP         — demand exists, few fresh videos covering it
 *   HIGH_COMPETITION  — top results dominated by big channels
 *   OVERSATURATED     — too many fresh videos, interest declining
 *   WEAK_DEMAND       — view counts too low, audience too small
 *   NEUTRAL           — no clear opportunity signal either way
 *
 * Each verdict ships with a 0-10 opportunity score and a plain-English
 * explanation grounded in the actual numbers we observed.
 *
 * The central question for a small channel isn't "how many views are
 * possible" — it's "can a small channel break through here at all".
 * That's why our top-priority signal is OUTLIERS: small-channel videos
 * (≤50K subs) with views ≥3× their subscriber count. When that pattern
 * appears, the YouTube algorithm is promoting the TOPIC itself, not the
 * channel — meaning new entrants have a real shot.
 *
 * Methodology adapted from external strategy review. Thresholds are
 * starting calibration; expect to revisit once we have niche-specific
 * baselines from our anonymous audit log accumulation.
 */

import type { NicheVideoRecord } from "./youtube-api";
import { median } from "./outlier-analysis";

// ─── Configurable thresholds ──────────────────────────────────────────

/** Days a video must be within to count as "fresh". */
const FRESH_DAYS = 30;
/** views >= subs * this multiplier = the video broke through its base */
const OUTLIER_RATIO = 3;
/** Channels at or below this sub count count as "small" (breakable). */
const SMALL_CHANNEL_SUBS = 50_000;
/** Threshold for "many fresh videos in top 20" indicating saturation. */
const SATURATION_FRESH = 8;
/** Below this median, demand is too thin to be worth entering. */
const WEAK_DEMAND_MEDIAN = 2_000;
/** Above this median, demand is healthy enough to support a new entrant. */
const STRONG_DEMAND_MEDIAN = 10_000;
/** Big-channel share above this = the top is locked. */
const BIG_CHANNEL_LOCK_SHARE = 0.7;

// ─── Types ─────────────────────────────────────────────────────────────

export type Verdict =
  | "ENTER_NOW"
  | "NICHE_GAP"
  | "HIGH_COMPETITION"
  | "OVERSATURATED"
  | "WEAK_DEMAND"
  | "NEUTRAL";

export type EnrichedNicheVideo = NicheVideoRecord & {
  channelTitle: string;
  channelSubs: number | null;
  isOutlier: boolean;
  isFresh: boolean;
  isBigChannel: boolean;
};

export type NicheCheckResult = {
  query: string;
  /** Total YouTube results (from search.list pageInfo.totalResults). */
  totalResults: number;
  /** Window we actually analyzed — typically up to 20 top videos. */
  windowSize: number;
  /** Verdict category. */
  verdict: Verdict;
  /** Internal opportunity score 0-10 — never expose to public UI. */
  score: number;
  headline: string;
  explanation: string;
  /** Per-component signals shown in the UI. Factual aggregations over raw search data. */
  signals: {
    medianViews: number;
    bigChannelShare: number; // 0..1
    freshCount: number;
    outlierCount: number;
    trendDirection: "rising" | "flat" | "declining" | "unknown";
  };
  /** Top 5 enriched videos (especially outliers) for evidence. */
  evidence: EnrichedNicheVideo[];
  /** YouTube autocomplete suggestions for the seed term — quick-win extras. */
  relatedKeywords: string[];
};

/** Qualitative bands for the competition and breakthrough signals. */
export type CompetitionLevel = "dominated" | "mixed" | "open";
export type BreakthroughLevel = "several" | "some" | "none";

export const COMPETITION_LABEL: Record<CompetitionLevel, string> = {
  dominated: "Dominated by large channels",
  mixed: "Mix of large and small channels",
  open: "Open to smaller channels",
};

export const BREAKTHROUGH_LABEL: Record<BreakthroughLevel, string> = {
  several: "Several small channels breaking through",
  some: "Some small channels breaking through",
  none: "No small-channel breakthroughs found",
};

/**
 * Public-facing result.
 *
 * COMPLIANCE (policy III.E.4h): we must not publish figures we compute
 * ourselves from YouTube data. The composite 0-10 score, the big-channel
 * share percentage, and the small-channel outlier count were all removed
 * and replaced with qualitative bands.
 *
 * What remains is either a direct API value or a trivial statistical
 * aggregate of raw view counts:
 *   - medianViews: median of the raw viewCount values in the window
 *   - freshCount: count of results whose publishedAt falls in 30 days
 *   - verdict / trendDirection: categorical editorial classifications
 */
export type PublicNicheCheckResult = Omit<
  NicheCheckResult,
  "score" | "signals"
> & {
  signals: {
    medianViews: number;
    freshCount: number;
    competitionLevel: CompetitionLevel;
    breakthroughLevel: BreakthroughLevel;
    trendDirection: "rising" | "flat" | "declining" | "unknown";
  };
};

function toCompetitionLevel(share: number): CompetitionLevel {
  if (share >= 0.7) return "dominated";
  if (share >= 0.4) return "mixed";
  return "open";
}

function toBreakthroughLevel(count: number): BreakthroughLevel {
  if (count >= 3) return "several";
  if (count >= 1) return "some";
  return "none";
}

export function toPublicNicheCheck(r: NicheCheckResult): PublicNicheCheckResult {
  const { score: _score, signals, ...rest } = r;
  void _score;
  return {
    ...rest,
    signals: {
      medianViews: signals.medianViews,
      freshCount: signals.freshCount,
      competitionLevel: toCompetitionLevel(signals.bigChannelShare),
      breakthroughLevel: toBreakthroughLevel(signals.outlierCount),
      trendDirection: signals.trendDirection,
    },
  };
}

// ─── Pipeline-level enrichment helpers ─────────────────────────────────

/**
 * Enrich raw search results with channel info + per-video flags.
 * Pure function — no I/O, all data already fetched.
 */
export function enrichNicheVideos(
  videos: NicheVideoRecord[],
  channelMap: Map<string, { title: string; subscriberCount: number | null }>
): EnrichedNicheVideo[] {
  const now = Date.now();
  return videos.map((v) => {
    const ch = channelMap.get(v.channelId);
    const subs = ch?.subscriberCount ?? null;
    const ageDays = v.publishedAt
      ? (now - new Date(v.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
      : Infinity;
    const isFresh = ageDays <= FRESH_DAYS;
    const isBigChannel = (subs ?? 0) > SMALL_CHANNEL_SUBS;
    const isOutlier =
      subs !== null &&
      subs > 0 &&
      subs <= SMALL_CHANNEL_SUBS &&
      v.viewCount !== null &&
      v.viewCount >= subs * OUTLIER_RATIO;
    return {
      ...v,
      channelTitle: ch?.title ?? "",
      channelSubs: subs,
      isOutlier,
      isFresh,
      isBigChannel,
    };
  });
}

/**
 * Infer topic direction from the YouTube-only data we have: split the
 * window into "recent half" vs "older half" by publishedAt and compare
 * median views. Rising = recent videos averaging much more views than
 * older ones (algorithm is currently pushing the topic). Declining =
 * opposite.
 *
 * Not as authoritative as Google Trends but free + needs no extra API.
 */
export function inferTrendDirection(
  videos: EnrichedNicheVideo[]
): "rising" | "flat" | "declining" | "unknown" {
  const sorted = videos
    .filter((v) => v.publishedAt && v.viewCount !== null && v.viewCount > 0)
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());

  if (sorted.length < 6) return "unknown";

  const half = Math.floor(sorted.length / 2);
  const recent = sorted.slice(0, half);
  const older = sorted.slice(half);
  const recentMedian = median(recent.map((v) => v.viewCount!));
  const olderMedian = median(older.map((v) => v.viewCount!));

  if (olderMedian === 0) return "unknown";
  const ratio = recentMedian / olderMedian;
  if (ratio > 1.5) return "rising";
  if (ratio < 0.67) return "declining";
  return "flat";
}

// ─── Verdict engine — rule order is best-case first ─────────────────────

export function computeVerdict(
  enriched: EnrichedNicheVideo[],
  totalResults: number,
  query: string,
  relatedKeywords: string[]
): NicheCheckResult {
  const n = enriched.length;
  const signalsBase = {
    medianViews: 0,
    bigChannelShare: 0,
    freshCount: 0,
    outlierCount: 0,
    trendDirection: "unknown" as const,
  };

  if (n === 0) {
    return {
      query,
      totalResults,
      windowSize: 0,
      verdict: "WEAK_DEMAND",
      score: 1,
      headline: "Almost no content found",
      explanation:
        "YouTube returned no usable top results for this topic. That usually means the demand is so thin it isn't worth entering — or the phrasing needs to be different (try a synonym or a related keyword from the suggestions).",
      signals: signalsBase,
      evidence: [],
      relatedKeywords,
    };
  }

  // Compute core signals
  const viewCounts = enriched
    .map((v) => v.viewCount)
    .filter((v): v is number => v !== null && v > 0);
  const medianViews = Math.round(median(viewCounts));
  const bigChannelShare =
    enriched.filter((v) => v.isBigChannel).length / n;
  const freshCount = enriched.filter((v) => v.isFresh).length;
  const outlierCount = enriched.filter((v) => v.isOutlier).length;
  const trendDirection = inferTrendDirection(enriched);
  const hasBreakout = outlierCount >= 2;

  const signals = {
    medianViews,
    bigChannelShare,
    freshCount,
    outlierCount,
    trendDirection,
  };

  // Sort evidence: outliers first by view count, then non-outlier top performers
  const evidence = [...enriched]
    .sort((a, b) => {
      if (a.isOutlier !== b.isOutlier) return a.isOutlier ? -1 : 1;
      return (b.viewCount ?? 0) - (a.viewCount ?? 0);
    })
    .slice(0, 8);

  // ─── Rule order: best opportunity first, fall through to neutral ───

  // 1. ENTER NOW — outlier breakthrough visible + demand healthy
  if (
    hasBreakout &&
    trendDirection !== "declining" &&
    medianViews > STRONG_DEMAND_MEDIAN
  ) {
    return {
      query,
      totalResults,
      windowSize: n,
      verdict: "ENTER_NOW",
      score: 9,
      headline: "Strong opening, small channels are breaking through",
      explanation: `Small channels in the top results pulled views well above their subscriber base, which is the clearest signal the algorithm is promoting the topic itself rather than channel size. Median views in the top window: ${formatNumber(medianViews)}. Topic direction: ${trendDirection}. If you ship something here soon you are competing against the algorithm rewarding the niche, not against established creators.`,
      signals,
      evidence,
      relatedKeywords,
    };
  }

  // 2. NICHE GAP — demand exists, content is thin
  if (
    medianViews > STRONG_DEMAND_MEDIAN &&
    freshCount < 3 &&
    bigChannelShare < 0.5
  ) {
    return {
      query,
      totalResults,
      windowSize: n,
      verdict: "NICHE_GAP",
      score: 8,
      headline: "Demand without supply, clean niche entry",
      explanation: `Median views are healthy (${formatNumber(medianViews)}) and very few of the top videos were published recently. Large channels do not hold most of the top results, so there is clear room for a new entrant. Publish something focused and timely.`,
      signals,
      evidence,
      relatedKeywords,
    };
  }

  // 3. WEAK_DEMAND — interest too thin
  if (medianViews < WEAK_DEMAND_MEDIAN) {
    return {
      query,
      totalResults,
      windowSize: n,
      verdict: "WEAK_DEMAND",
      score: 3,
      headline: "Audience is too small to justify the work",
      explanation: `Median views in the top window: ${formatNumber(medianViews)}. Even the top results are not pulling a meaningful audience, so either the topic is too narrow or the phrasing is off. Try one of the related keywords below for a tighter angle.`,
      signals,
      evidence,
      relatedKeywords,
    };
  }

  // 4. OVERSATURATED — too many fresh entries AND declining interest
  if (freshCount >= SATURATION_FRESH && trendDirection === "declining") {
    return {
      query,
      totalResults,
      windowSize: n,
      verdict: "OVERSATURATED",
      score: 3,
      headline: "Late to the trend",
      explanation: `Most of the top videos went up very recently while median views on the newer ones are falling behind the older top performers. Everyone already filmed it and the audience has moved on. Pick another angle.`,
      signals,
      evidence,
      relatedKeywords,
    };
  }

  // 5. HIGH_COMPETITION — top dominated by big channels
  if (bigChannelShare >= BIG_CHANNEL_LOCK_SHARE) {
    return {
      query,
      totalResults,
      windowSize: n,
      verdict: "HIGH_COMPETITION",
      score: 4,
      headline: "Top is locked by big channels",
      explanation: `Most of the top results come from established channels with large subscriber bases. New entrants struggle to break in unless they have a sharp differentiated angle. Look at sub-niches or a contrarian framing.`,
      signals,
      evidence,
      relatedKeywords,
    };
  }

  // 6. NEUTRAL — no clear signal either way
  return {
    query,
    totalResults,
    windowSize: n,
    verdict: "NEUTRAL",
    score: 5,
    headline: "No clear opportunity signal",
    explanation: `Median views in the top window sit at ${formatNumber(medianViews)}, with a mix of large and small channels and no strong trend in either direction. Nothing is obviously broken and nothing is obviously a gold mine, so your decision depends on your specific positioning rather than market dynamics.`,
    signals,
    evidence,
    relatedKeywords,
  };
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}
