/**
 * Full video metadata extractor — pulls everything we can from a single
 * /watch page HTML fetch. Used by the Video Audit tool to score the video
 * across every dimension without making multiple HTTP calls.
 *
 * Everything here is best-effort; YouTube's HTML format changes frequently
 * and any single signal can be absent. The audit engine handles missing
 * fields gracefully.
 */

import { extractTagsFromHtml } from "./extract-tags";

export type VideoInfo = {
  videoId: string;
  title: string | null;
  channel: string | null;
  description: string | null;
  /** Tags from the uploader (often empty for newer videos). */
  tags: string[];
  /** Duration in seconds. */
  lengthSeconds: number | null;
  /** Publish date as ISO string (YYYY-MM-DD). */
  publishDate: string | null;
  /** View count as integer. */
  viewCount: number | null;
  /** Best-available thumbnail URL. */
  thumbnailUrl: string | null;
  /** Hashtags found anywhere in the description (#word style). */
  hashtags: string[];
  /** Detected chapters with start time (seconds) + title. */
  chapters: Chapter[];
  /** Are there any timestamp lines in the description (mm:ss style)? */
  hasTimestamps: boolean;
  /** External links found in description. */
  externalLinks: string[];
};

export type Chapter = {
  startSeconds: number;
  title: string;
};

export function extractVideoInfo(html: string, videoId: string): VideoInfo {
  // Tags come from the shared extractor (proven path).
  // Title and channel get more robust multi-source extraction below
  // because YouTube serves slightly different HTML depending on region,
  // consent state, and which backend handled the request.
  const tagInfo = extractTagsFromHtml(html);

  const title = extractTitleRobust(html) ?? tagInfo.title;
  const channel = extractChannelRobust(html) ?? tagInfo.channel;
  const description = extractDescription(html);
  const lengthSeconds = extractLength(html);
  const publishDate = extractPublishDate(html);
  const viewCount = extractViewCount(html);
  const thumbnailUrl = extractThumbnail(html, videoId);

  // Description-derived fields
  const hashtags = description ? extractHashtags(description) : [];
  const chapters = description ? extractChapters(description) : [];
  const hasTimestamps =
    description !== null && /^\s*\d{1,2}:\d{2}(?::\d{2})?\s+/m.test(description);
  const externalLinks = description ? extractLinks(description) : [];

  return {
    videoId,
    title,
    channel,
    description,
    tags: tagInfo.tags,
    lengthSeconds,
    publishDate,
    viewCount,
    thumbnailUrl,
    hashtags,
    chapters,
    hasTimestamps,
    externalLinks,
  };
}

/**
 * Robust title extractor — tries multiple sources in priority order.
 * Uses [^"]+ in content groups (HTML attributes always use double quotes
 * in YouTube's markup; allowing single quotes there breaks on apostrophes
 * in titles like "Don't" or "Bob's").
 */
function extractTitleRobust(html: string): string | null {
  // 1. og:title — primary
  const og = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/);
  if (og?.[1]) return decodeHtmlEntities(og[1]);

  // 2. ytInitialPlayerResponse JSON: videoDetails.title is the canonical source
  const vd = html.match(/"videoDetails":\{[^}]*?"title":"((?:\\.|[^"\\])*)"/);
  if (vd?.[1]) return unescapeJsonString(vd[1]);

  // 3. ytInitialData JSON: title.runs[0].text
  const runs = html.match(/"title":\s*\{\s*"runs":\s*\[\s*\{\s*"text":"((?:\\.|[^"\\])*)"/);
  if (runs?.[1]) return unescapeJsonString(runs[1]);

  // 4. twitter:title — third-party crawler fallback
  const tw = html.match(/<meta\s+name="twitter:title"\s+content="([^"]+)"/);
  if (tw?.[1]) return decodeHtmlEntities(tw[1]);

  // 5. <title>X - YouTube</title>
  const t = html.match(/<title>([^<]+?)\s+-\s+YouTube\s*<\/title>/);
  if (t?.[1]) return decodeHtmlEntities(t[1].trim());

  return null;
}

function extractChannelRobust(html: string): string | null {
  // 1. itemprop=name (link tag)
  const item = html.match(/<link\s+itemprop="name"\s+content="([^"]+)"/);
  if (item?.[1]) return decodeHtmlEntities(item[1]);

  // 2. meta author
  const author = html.match(/<meta\s+name="author"\s+content="([^"]+)"/);
  if (author?.[1]) return decodeHtmlEntities(author[1]);

  // 3. videoDetails.author in JSON
  const vd = html.match(/"videoDetails":\{[^}]*?"author":"((?:\\.|[^"\\])*)"/);
  if (vd?.[1]) return unescapeJsonString(vd[1]);

  // 4. ownerChannelName in JSON
  const owner = html.match(/"ownerChannelName":"((?:\\.|[^"\\])*)"/);
  if (owner?.[1]) return unescapeJsonString(owner[1]);

  return null;
}

// ─── Field extractors ──────────────────────────────────────────────

function extractDescription(html: string): string | null {
  // 1. shortDescription in ytInitialPlayerResponse JSON — canonical, full-length
  //    Use [^"\\] | \\. to correctly skip escaped quotes inside the value
  const sd = html.match(/"shortDescription":"((?:\\.|[^"\\])*)"/);
  if (sd?.[1]) {
    const v = unescapeJsonString(sd[1]);
    if (v.length > 0) return v;
  }

  // 2. attributedDescription in newer YouTube player payload
  const ad = html.match(/"attributedDescription":\{"content":"((?:\\.|[^"\\])*)"/);
  if (ad?.[1]) {
    const v = unescapeJsonString(ad[1]);
    if (v.length > 0) return v;
  }

  // 3. og:description — fallback (truncated by YouTube to ~155 chars)
  const og = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/);
  if (og?.[1]) return decodeHtmlEntities(og[1]);

  // 4. twitter:description — last resort
  const tw = html.match(/<meta\s+name="twitter:description"\s+content="([^"]+)"/);
  if (tw?.[1]) return decodeHtmlEntities(tw[1]);

  return null;
}

function extractLength(html: string): number | null {
  const m = html.match(/"lengthSeconds":"(\d+)"/);
  return m ? parseInt(m[1], 10) : null;
}

function extractPublishDate(html: string): string | null {
  // publishDate is like "2024-01-15T00:00:00-07:00" in the JSON
  const m = html.match(/"publishDate":"(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  // Fallback: itemprop=datePublished
  const m2 = html.match(/<meta itemprop="datePublished" content="(\d{4}-\d{2}-\d{2})/);
  return m2 ? m2[1] : null;
}

function extractViewCount(html: string): number | null {
  const m = html.match(/"viewCount":"(\d+)"/);
  return m ? parseInt(m[1], 10) : null;
}

function extractThumbnail(html: string, videoId: string): string | null {
  // og:image is the cleanest source
  const og = html.match(/<meta property="og:image" content="([^"]+)"/);
  if (og) return og[1];
  // Fallback to the deterministic CDN path
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

function extractHashtags(description: string): string[] {
  const matches = description.match(/#[\p{L}\p{N}_-]+/gu);
  if (!matches) return [];
  // Dedup while preserving order
  const seen = new Set<string>();
  const out: string[] = [];
  for (const h of matches) {
    const lower = h.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      out.push(h);
    }
  }
  return out;
}

/**
 * Parse chapters from a YouTube-style description.
 *
 * Real YouTube chapter rules: each chapter is a line starting with a
 * timestamp (mm:ss or h:mm:ss), the first chapter MUST start at 0:00,
 * there MUST be at least 3 chapters, each chapter MUST be at least 10s.
 * We extract everything that looks like a chapter line; the audit engine
 * validates compliance with those rules.
 */
function extractChapters(description: string): Chapter[] {
  const lines = description.split("\n");
  const chapters: Chapter[] = [];
  // Match lines that START with a timestamp (allowing leading dash/bullet)
  const re = /^\s*[-•*]?\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s+(.+)$/;
  for (const line of lines) {
    const m = line.match(re);
    if (!m) continue;
    const h = m[3] ? parseInt(m[1], 10) : 0;
    const mm = m[3] ? parseInt(m[2], 10) : parseInt(m[1], 10);
    const ss = m[3] ? parseInt(m[3], 10) : parseInt(m[2], 10);
    const startSeconds = h * 3600 + mm * 60 + ss;
    const title = m[4].trim();
    if (title.length > 0 && title.length <= 100) {
      chapters.push({ startSeconds, title });
    }
  }
  return chapters;
}

function extractLinks(description: string): string[] {
  const matches = description.match(/https?:\/\/[^\s)]+/g);
  if (!matches) return [];
  return [...new Set(matches)].slice(0, 20);
}

// ─── Helpers ────────────────────────────────────────────────────────

function unescapeJsonString(s: string): string {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .replace(/\\u0026/g, "&")
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">")
    .replace(/\\u0027/g, "'")
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
