/**
 * YouTube oEmbed — public endpoint that returns basic video metadata.
 *
 * Reliability advantages over /watch scraping:
 *  - Designed for third-party access; no rate-limiting under normal load.
 *  - Stable JSON contract; no markup-change risk.
 *  - Works even when /watch returns 429 / 503 from cloud-provider IPs.
 *
 * What it gives us: title, author_name (channel), thumbnail_url.
 * What it does NOT give: tags, description, chapters, view count, hashtags.
 *
 * Used as the foundation layer for the Video Audit so the user always
 * gets a useful response (title + channel + thumb), even if the deeper
 * /watch scrape fails for the same video.
 *
 * Reference: https://oembed.com + https://www.youtube.com/oembed
 */

export type OembedInfo = {
  title: string | null;
  channel: string | null;
  thumbnailUrl: string | null;
};

type OembedResponse = {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
};

export async function fetchOembed(videoId: string): Promise<OembedInfo | null> {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; seocheck-tools/1.0; +https://seocheck.tools)",
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as OembedResponse;
    return {
      title: data.title ?? null,
      channel: data.author_name ?? null,
      thumbnailUrl: data.thumbnail_url ?? null,
    };
  } catch {
    return null;
  }
}
