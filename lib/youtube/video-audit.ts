/**
 * Video Audit engine — pure-function heuristics that score every dimension
 * of a YouTube video's metadata against documented best practices.
 *
 * The engine reuses scoreTitle() for the title dimension and applies its
 * own checks for everything else. Each dimension returns:
 *   - score (0-100)
 *   - band (strong/good/fair/weak)
 *   - signals (list of good/warn/bad observations)
 *   - ctaTool (which existing tool fixes this weakness)
 *
 * No LLM, no network call inside the engine itself — the caller provides
 * the VideoInfo from a separate fetch.
 */

import { scoreTitle, type Signal, type TitleScoreBand } from "./title-score";
import type { VideoInfo } from "./extract-video-info";

export type AuditBand = TitleScoreBand;

export type AuditDimension = {
  key: "title" | "description" | "tags" | "hashtags" | "chapters";
  label: string;
  score: number;
  band: AuditBand;
  signals: Signal[];
  /** Existing tool slug to send the user to for fixing this. */
  ctaTool: { slug: string; label: string };
};

export type VideoAuditResult = {
  videoId: string;
  videoUrl: string;
  /** Video metadata for display (title, channel, thumbnail, views, etc.) */
  meta: {
    title: string | null;
    channel: string | null;
    thumbnailUrl: string | null;
    viewCount: number | null;
    publishDate: string | null;
    lengthSeconds: number | null;
  };
  /** Weighted average across dimensions. */
  overallScore: number;
  overallBand: AuditBand;
  dimensions: AuditDimension[];
};

// Dimension weights — title and description carry the most weight because
// they have the highest measurable CTR impact.
const WEIGHTS: Record<AuditDimension["key"], number> = {
  title: 0.30,
  description: 0.25,
  tags: 0.15,
  hashtags: 0.10,
  chapters: 0.20,
};

export function auditVideo(info: VideoInfo): VideoAuditResult {
  const dimensions: AuditDimension[] = [
    auditTitle(info),
    auditDescription(info),
    auditTags(info),
    auditHashtags(info),
    auditChapters(info),
  ];

  let weightedSum = 0;
  let totalWeight = 0;
  for (const d of dimensions) {
    const w = WEIGHTS[d.key];
    weightedSum += d.score * w;
    totalWeight += w;
  }
  const overallScore = Math.round(weightedSum / totalWeight);

  return {
    videoId: info.videoId,
    videoUrl: `https://www.youtube.com/watch?v=${info.videoId}`,
    meta: {
      title: info.title,
      channel: info.channel,
      thumbnailUrl: info.thumbnailUrl,
      viewCount: info.viewCount,
      publishDate: info.publishDate,
      lengthSeconds: info.lengthSeconds,
    },
    overallScore,
    overallBand: bandFor(overallScore),
    dimensions,
  };
}

// ─── Dimension auditors ────────────────────────────────────────────────

function auditTitle(info: VideoInfo): AuditDimension {
  if (!info.title) {
    return {
      key: "title",
      label: "Title",
      score: 0,
      band: "weak",
      signals: [{ kind: "bad", message: "Couldn't read the title from the page." }],
      ctaTool: { slug: "youtube-title-generator", label: "Generate titles with AI" },
    };
  }
  const result = scoreTitle(info.title);
  return {
    key: "title",
    label: "Title",
    score: result.score,
    band: result.band,
    signals: result.signals,
    ctaTool: { slug: "youtube-title-generator", label: "Generate titles with AI" },
  };
}

function auditDescription(info: VideoInfo): AuditDimension {
  const signals: Signal[] = [];
  let score = 50;
  const desc = info.description ?? "";
  const len = desc.length;
  const wordCount = desc.trim().split(/\s+/).filter(Boolean).length;

  if (len === 0) {
    return {
      key: "description",
      label: "Description",
      score: 0,
      band: "weak",
      signals: [
        {
          kind: "bad",
          message: "Description is empty. YouTube uses description text heavily for topical relevance — even 100 words helps.",
        },
      ],
      ctaTool: {
        slug: "youtube-description-generator",
        label: "Write a description with AI",
      },
    };
  }

  // Length checks
  if (wordCount < 50) {
    score -= 20;
    signals.push({
      kind: "bad",
      message: `Only ${wordCount} words — too short. Aim for 150-250 words minimum so YouTube can classify the topic confidently.`,
    });
  } else if (wordCount < 150) {
    score -= 5;
    signals.push({
      kind: "warn",
      message: `${wordCount} words — under the 150-word recommendation. Adding niche keywords + a structured intro helps topical authority.`,
    });
  } else if (wordCount <= 400) {
    score += 20;
    signals.push({
      kind: "good",
      message: `${wordCount} words — solid length for topical signal without padding.`,
    });
  } else {
    score += 10;
    signals.push({
      kind: "info",
      message: `${wordCount} words — long. Make sure the first 150 chars (above the "...more" fold) hook the viewer.`,
    });
  }

  // Above-the-fold hook (first 150 chars)
  const fold = desc.slice(0, 150).trim();
  if (fold.length < 100) {
    score -= 5;
    signals.push({
      kind: "warn",
      message: 'First line is short — the "above-the-fold" preview shows ~150 chars. Use that space.',
    });
  } else {
    score += 5;
    signals.push({
      kind: "good",
      message: 'Above-the-fold preview (first ~150 chars) is well-filled.',
    });
  }

  // CTA presence (subscribe, follow, link, etc.)
  const hasCta =
    /\bsubscribe\b/i.test(desc) ||
    /\bfollow\b/i.test(desc) ||
    /\bjoin\b/i.test(desc) ||
    /\bnewsletter\b/i.test(desc);
  if (hasCta) {
    score += 5;
    signals.push({
      kind: "good",
      message: "Contains a viewer call-to-action (subscribe / follow / join / newsletter).",
    });
  } else {
    score -= 3;
    signals.push({
      kind: "warn",
      message: "No call-to-action detected. Even one line ('Subscribe for weekly videos') lifts subscriber conversion.",
    });
  }

  // External link
  if (info.externalLinks.length > 0) {
    score += 5;
    signals.push({
      kind: "good",
      message: `${info.externalLinks.length} link${info.externalLinks.length === 1 ? "" : "s"} included — sends a signal to YouTube that the video has off-platform context.`,
    });
  }

  // Timestamps (even if not formal chapters)
  if (info.hasTimestamps && info.chapters.length < 3) {
    signals.push({
      kind: "info",
      message: "Description has timestamps but they don't qualify as chapters — see the Chapters dimension below.",
    });
  }

  score = clamp(score, 0, 100);
  return {
    key: "description",
    label: "Description",
    score,
    band: bandFor(score),
    signals,
    ctaTool: {
      slug: "youtube-description-generator",
      label: "Write a description with AI",
    },
  };
}

function auditTags(info: VideoInfo): AuditDimension {
  const signals: Signal[] = [];
  const count = info.tags.length;
  let score = 50;

  if (count === 0) {
    return {
      key: "tags",
      label: "Tags",
      score: 20,
      band: "weak",
      signals: [
        {
          kind: "bad",
          message: "No tags found. Tags are less critical than they used to be but still help with spelling variants and niche queries — adding 10-15 takes 30 seconds.",
        },
      ],
      ctaTool: { slug: "youtube-tag-generator", label: "Generate tags with AI" },
    };
  }

  // Count band
  if (count < 5) {
    score -= 10;
    signals.push({
      kind: "warn",
      message: `Only ${count} tag${count === 1 ? "" : "s"} — too few. 10-15 well-chosen tags is the sweet spot.`,
    });
  } else if (count <= 25) {
    score += 25;
    signals.push({
      kind: "good",
      message: `${count} tags — in the recommended 10-25 range.`,
    });
  } else {
    score -= 5;
    signals.push({
      kind: "warn",
      message: `${count} tags — over the 25-tag mark. Diminishing returns; YouTube weights early tags more heavily.`,
    });
  }

  // Long-tail vs broad ratio (tags with 3+ words = long-tail signal)
  const longTail = info.tags.filter((t) => t.trim().split(/\s+/).length >= 3).length;
  const longTailRatio = longTail / count;
  if (longTailRatio < 0.2) {
    score -= 5;
    signals.push({
      kind: "warn",
      message: `Only ${longTail} long-tail tag${longTail === 1 ? "" : "s"} (3+ words). Long-tails rank for less-competitive queries; aim for at least 30% of your tag list.`,
    });
  } else if (longTailRatio >= 0.4) {
    score += 10;
    signals.push({
      kind: "good",
      message: `${longTail} long-tail tags (${Math.round(longTailRatio * 100)}%) — strong mix of broad + niche.`,
    });
  }

  // Total char budget (YouTube's hard 500-char ceiling)
  const totalChars = info.tags.join(",").length;
  if (totalChars > 480) {
    score -= 5;
    signals.push({
      kind: "warn",
      message: `Tag list uses ${totalChars}/500 characters — near the limit. YouTube will silently drop anything past 500.`,
    });
  } else if (totalChars < 200 && count >= 5) {
    signals.push({
      kind: "info",
      message: `${totalChars}/500 characters used. You have room for more specific long-tail tags.`,
    });
  }

  score = clamp(score, 0, 100);
  return {
    key: "tags",
    label: "Tags",
    score,
    band: bandFor(score),
    signals,
    ctaTool: { slug: "youtube-tag-generator", label: "Generate tags with AI" },
  };
}

function auditHashtags(info: VideoInfo): AuditDimension {
  const signals: Signal[] = [];
  const count = info.hashtags.length;
  let score = 50;

  if (count === 0) {
    return {
      key: "hashtags",
      label: "Hashtags",
      score: 25,
      band: "weak",
      signals: [
        {
          kind: "bad",
          message: "No hashtags in the description. YouTube renders the first 3 hashtags as clickable links above the video title — free real estate.",
        },
      ],
      ctaTool: { slug: "youtube-hashtag-generator", label: "Generate hashtags with AI" },
    };
  }

  if (count > 15) {
    score -= 15;
    signals.push({
      kind: "bad",
      message: `${count} hashtags — over YouTube's 15-hashtag policy ceiling. Over-tagging triggers a soft spam penalty; the whole list gets ignored.`,
    });
  } else if (count >= 3 && count <= 5) {
    score += 30;
    signals.push({
      kind: "good",
      message: `${count} hashtags — in the 3-5 sweet spot. The first 3 render above the title.`,
    });
  } else if (count <= 10) {
    score += 15;
    signals.push({
      kind: "good",
      message: `${count} hashtags — useful, but only the first 3 render above the title. Consider tightening to 3-5 high-impact ones.`,
    });
  } else if (count < 3) {
    score += 5;
    signals.push({
      kind: "warn",
      message: `${count} hashtag${count === 1 ? "" : "s"} — below the 3-hashtag threshold YouTube renders above the title.`,
    });
  }

  score = clamp(score, 0, 100);
  return {
    key: "hashtags",
    label: "Hashtags",
    score,
    band: bandFor(score),
    signals,
    ctaTool: { slug: "youtube-hashtag-generator", label: "Generate hashtags with AI" },
  };
}

function auditChapters(info: VideoInfo): AuditDimension {
  const signals: Signal[] = [];
  const chapters = info.chapters;
  let score = 50;

  if (chapters.length === 0) {
    return {
      key: "chapters",
      label: "Chapters",
      score: 30,
      band: "weak",
      signals: [
        {
          kind: "bad",
          message: "No chapters detected. Chapters let viewers skim, improve retention by ~10-15%, and appear as deep-link snippets in Google search.",
        },
      ],
      ctaTool: { slug: "youtube-chapter-generator", label: "Format chapters" },
    };
  }

  // YouTube rule: first chapter must start at 0:00
  const firstAtZero = chapters[0].startSeconds === 0;
  if (!firstAtZero) {
    score -= 20;
    signals.push({
      kind: "bad",
      message: `First chapter starts at ${formatTime(chapters[0].startSeconds)} — YouTube requires the first chapter at 0:00 or it ignores the entire list.`,
    });
  } else {
    score += 10;
    signals.push({
      kind: "good",
      message: "First chapter at 0:00 — YouTube's required start.",
    });
  }

  // YouTube rule: minimum 3 chapters
  if (chapters.length < 3) {
    score -= 15;
    signals.push({
      kind: "bad",
      message: `Only ${chapters.length} chapter${chapters.length === 1 ? "" : "s"} — YouTube requires at least 3 to render chapter UI.`,
    });
  } else if (chapters.length >= 3 && chapters.length <= 12) {
    score += 20;
    signals.push({
      kind: "good",
      message: `${chapters.length} chapters — well-scoped.`,
    });
  } else {
    score -= 5;
    signals.push({
      kind: "warn",
      message: `${chapters.length} chapters — getting dense. Consider grouping into broader sections.`,
    });
  }

  // YouTube rule: each chapter must be ≥ 10 seconds
  const tooShort: number[] = [];
  for (let i = 0; i < chapters.length - 1; i++) {
    const gap = chapters[i + 1].startSeconds - chapters[i].startSeconds;
    if (gap < 10) tooShort.push(i);
  }
  if (tooShort.length > 0) {
    score -= 15;
    signals.push({
      kind: "bad",
      message: `${tooShort.length} chapter${tooShort.length === 1 ? "" : "s"} shorter than 10 seconds — YouTube ignores chapter lists with sub-10s segments.`,
    });
  }

  // Monotonic check
  const monotonic = chapters.every(
    (c, i) => i === 0 || c.startSeconds > chapters[i - 1].startSeconds
  );
  if (!monotonic) {
    score -= 10;
    signals.push({
      kind: "bad",
      message: "Chapters are out of order. Timestamps must strictly ascend.",
    });
  }

  score = clamp(score, 0, 100);
  return {
    key: "chapters",
    label: "Chapters",
    score,
    band: bandFor(score),
    signals,
    ctaTool: { slug: "youtube-chapter-generator", label: "Format chapters" },
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function bandFor(score: number): AuditBand {
  if (score >= 80) return "strong";
  if (score >= 60) return "good";
  if (score >= 40) return "fair";
  return "weak";
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
