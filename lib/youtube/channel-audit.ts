/**
 * Channel Audit — types + aggregation + LLM prompt.
 *
 * Pipeline (called from the API route):
 *  1. Resolve channel + uploadsPlaylistId (1 unit)
 *  2. Latest 10 video IDs via playlistItems.list (1 unit)
 *  3. Batched videos.list for stats + snippet (1 unit)
 *  4. Build VideoInfo from each via videoInfoFromApi() and run auditVideo
 *     with omitTags=true (tags aren't available via API for non-owners)
 *  5. Aggregate per-dimension scores across all 10 videos
 *  6. Compute overall channel grade from average overall score
 *  7. LLM analysis (best-effort): top 3 recurring issues
 *
 * Cost: 3 YouTube units + LLM. Cache 24h by channel ID.
 *
 * Why no /watch scraping per video: 10 parallel /watch fetches from
 * Vercel IPs would multiply 429 risk and slow the pipeline. The API
 * gives us 4 of 5 dimensions; tags is the only loss and it's the
 * noisiest signal anyway.
 */

import type { AuditBand, VideoAuditResult } from "./video-audit";

export type ChannelAuditVideo = {
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string | null;
  publishDate: string | null;
  viewCount: number | null;
  /** Full Video Audit result for this video (tags dimension excluded). */
  audit: VideoAuditResult;
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

export type ChannelGrade = "A" | "B" | "C" | "D" | "F";

export type ChannelAuditResult = {
  channel: {
    id: string;
    title: string;
    handle: string | null;
    thumbnailUrl: string | null;
    subscriberCount: number | null;
    videoCount: number | null;
  };
  /** How many videos we actually audited (may be <10 for small channels). */
  videoCount: number;
  /** Average overall score across all videos. */
  averageScore: number;
  grade: ChannelGrade;
  /** Per-dimension aggregation across all videos. */
  dimensions: DimensionStats[];
  /** Each video's individual audit result. */
  videos: ChannelAuditVideo[];
  /** Top 3 recurring issues from Claude Haiku. */
  recurringIssues: string[];
  analysisFailed?: boolean;
};

export function computeGrade(avg: number): ChannelGrade {
  if (avg >= 85) return "A";
  if (avg >= 70) return "B";
  if (avg >= 55) return "C";
  if (avg >= 40) return "D";
  return "F";
}

export const GRADE_DESCRIPTION: Record<ChannelGrade, string> = {
  A: "Channel-wide packaging discipline. Most videos optimized across most dimensions.",
  B: "Strong overall, with one or two dimensions consistently letting videos down.",
  C: "Mixed. Some videos packaged well, others not. Look at the dimension breakdown for the pattern.",
  D: "Recurring packaging gaps. Most videos have multiple weak dimensions.",
  F: "Systematic packaging issues across the channel. Highest-leverage area: pick the worst dimension and fix it everywhere.",
};

export const CHANNEL_AUDIT_SYSTEM_PROMPT = `You analyze a YouTube channel's last 10 videos and identify the top 3 RECURRING issues that, if fixed, would have the biggest CTR / retention impact.

You receive a per-dimension scorecard summarizing 10 videos:
  - For each dimension (title, description, hashtags, chapters): average score 0-100 and how many videos fall in each band (Strong/Good/Fair/Weak)
  - Each video's overall score and title

Return JSON only — no markdown fences, no preamble:
{"issues": ["issue 1", "issue 2", "issue 3"]}

Each issue must:
- Name a SPECIFIC pattern of weakness visible in the scorecard (not generic best practice)
- Be 1-2 sentences, action-oriented ("Add a CTA line to every description — 7 of 10 have none", not "improve descriptions")
- Reference the actual counts/scores from the scorecard for credibility
- If a dimension is already strong everywhere, don't fabricate an issue with it
- If the channel is uniformly strong, return 1-2 minor refinements rather than 3 invented issues`;

export function buildChannelAuditUserMessage(
  channelTitle: string,
  dimensions: DimensionStats[],
  videos: ChannelAuditVideo[]
): string {
  const dimSummary = dimensions
    .map(
      (d) =>
        `- ${d.label}: avg ${d.averageScore}, bands { Strong: ${d.bandCounts.strong}, Good: ${d.bandCounts.good}, Fair: ${d.bandCounts.fair}, Weak: ${d.bandCounts.weak} }`
    )
    .join("\n");
  const videoSummary = videos
    .map((v, i) => `${i + 1}. "${v.title}" — overall ${v.audit.overallScore}`)
    .join("\n");

  return (
    `Channel: ${channelTitle}\n\n` +
    `Per-dimension scorecard (last ${videos.length} uploads):\n${dimSummary}\n\n` +
    `Per-video overall scores:\n${videoSummary}\n\n` +
    `Return the JSON with up to 3 recurring issues now.`
  );
}
