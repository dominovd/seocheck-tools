/**
 * Extract tags + video metadata from the HTML of a YouTube video page.
 *
 * YouTube still serves the `<meta name="keywords">` tag in the page source
 * even though it removed the tags from the public-facing UI a few years
 * back. That's the primary signal we use. A fallback path parses tags from
 * the ytInitialPlayerResponse JSON blob in case the meta tag is missing
 * (region-specific or experimental pages).
 */

export type VideoTagInfo = {
  /** Comma-separated tags the uploader set. May be empty if the video has none. */
  tags: string[];
  /** Video title, for display. */
  title: string | null;
  /** Uploader / channel name. */
  channel: string | null;
};

export function extractTagsFromHtml(html: string): VideoTagInfo {
  // ── Tags ──
  let tags: string[] = [];

  // Primary: <meta name="keywords" content="tag1, tag2, tag3">
  const metaKeywordsMatch = html.match(
    /<meta\s+name="keywords"\s+content="([^"]+)"/
  );
  if (metaKeywordsMatch) {
    tags = metaKeywordsMatch[1]
      .split(",")
      .map((t) => decodeHtmlEntities(t.trim()))
      .filter(Boolean);
  }

  // Fallback: "keywords":["tag1","tag2"] inside ytInitialPlayerResponse
  if (tags.length === 0) {
    const playerKeywordsMatch = html.match(/"keywords":\[((?:"[^"]*",?)+)\]/);
    if (playerKeywordsMatch) {
      tags = playerKeywordsMatch[1]
        .split(",")
        .map((t) =>
          decodeHtmlEntities(t.trim().replace(/^"|"$/g, "")).replace(/\\u0026/g, "&")
        )
        .filter(Boolean);
    }
  }

  // ── Title ──
  const title =
    matchFirst(html, /<meta property="og:title" content="([^"]+)"/) ??
    matchFirst(html, /<title>([^<]+) - YouTube<\/title>/);

  // ── Channel ──
  const channel =
    matchFirst(html, /<link itemprop="name" content="([^"]+)"/) ??
    matchFirst(html, /<meta name="author" content="([^"]+)"/);

  return { tags, title, channel };
}

function matchFirst(input: string, pattern: RegExp): string | null {
  const m = input.match(pattern);
  return m?.[1] ? decodeHtmlEntities(m[1]) : null;
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** YouTube tag total-character limit, counting commas between tags. */
export const TAG_CHAR_LIMIT = 500;

/**
 * Total characters a comma-joined tag list takes up.
 * YouTube counts commas in its 500-character limit.
 */
export function totalTagChars(tags: string[]): number {
  if (tags.length === 0) return 0;
  return tags.reduce((sum, t) => sum + t.length, 0) + (tags.length - 1);
}
