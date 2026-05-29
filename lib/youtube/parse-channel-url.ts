/**
 * Classify any YouTube URL into the channel-lookup categories we support.
 *
 *   Direct (no API call needed):
 *     youtube.com/channel/UCxxx...   → already contains the UC channel ID
 *
 *   Indirect (serverless function fetches + parses the page):
 *     youtube.com/@handle            → handle URL (modern)
 *     youtube.com/c/customname       → legacy custom URL
 *     youtube.com/user/username      → legacy user URL
 *     youtube.com/watch?v=VIDEO_ID   → video URL (derive channel from video)
 *     youtube.com/shorts/VIDEO_ID    → Shorts URL
 *     youtube.com/embed/VIDEO_ID     → embed URL
 *     youtube.com/live/VIDEO_ID      → live URL
 *
 *   raw `@handle` or `UCxxx...` strings are also accepted.
 */

export type ChannelUrlClassification =
  | { kind: "direct"; channelId: string }
  | { kind: "handle"; handle: string; normalizedUrl: string }
  | { kind: "custom"; slug: string; normalizedUrl: string }
  | { kind: "user"; username: string; normalizedUrl: string }
  | { kind: "video"; videoId: string; normalizedUrl: string }
  | { kind: "invalid" };

const CHANNEL_ID_PATTERN = /^UC[A-Za-z0-9_-]{22}$/;
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const HANDLE_PATTERN = /^[\w.-]{3,30}$/;

export function classifyChannelInput(input: string): ChannelUrlClassification {
  const raw = input.trim();
  if (!raw) return { kind: "invalid" };

  // Raw channel ID
  if (CHANNEL_ID_PATTERN.test(raw)) return { kind: "direct", channelId: raw };

  // Raw handle without @
  if (raw.startsWith("@")) {
    const handle = raw.slice(1);
    if (HANDLE_PATTERN.test(handle)) {
      return {
        kind: "handle",
        handle,
        normalizedUrl: `https://www.youtube.com/@${handle}`,
      };
    }
  }

  // Try to parse as URL (with or without protocol)
  let parsed: URL;
  try {
    parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return { kind: "invalid" };
  }

  const host = parsed.hostname.replace(/^(www\.|m\.)/, "");
  if (host !== "youtube.com" && host !== "youtu.be") return { kind: "invalid" };

  // youtu.be/<videoId>
  if (host === "youtu.be") {
    const videoId = parsed.pathname.slice(1).split("/")[0];
    if (VIDEO_ID_PATTERN.test(videoId)) {
      return {
        kind: "video",
        videoId,
        normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    }
    return { kind: "invalid" };
  }

  const pathname = parsed.pathname;

  // /channel/UCxxx...
  const channelMatch = pathname.match(/^\/channel\/(UC[A-Za-z0-9_-]{22})$/);
  if (channelMatch) return { kind: "direct", channelId: channelMatch[1] };

  // /@handle
  const handleMatch = pathname.match(/^\/@([\w.-]+)\/?$/);
  if (handleMatch) {
    return {
      kind: "handle",
      handle: handleMatch[1],
      normalizedUrl: `https://www.youtube.com/@${handleMatch[1]}`,
    };
  }

  // /c/customname  (legacy)
  const customMatch = pathname.match(/^\/c\/([\w-]+)\/?$/);
  if (customMatch) {
    return {
      kind: "custom",
      slug: customMatch[1],
      normalizedUrl: `https://www.youtube.com/c/${customMatch[1]}`,
    };
  }

  // /user/username  (legacy)
  const userMatch = pathname.match(/^\/user\/([\w-]+)\/?$/);
  if (userMatch) {
    return {
      kind: "user",
      username: userMatch[1],
      normalizedUrl: `https://www.youtube.com/user/${userMatch[1]}`,
    };
  }

  // /watch?v=VIDEO_ID
  if (pathname === "/watch") {
    const videoId = parsed.searchParams.get("v");
    if (videoId && VIDEO_ID_PATTERN.test(videoId)) {
      return {
        kind: "video",
        videoId,
        normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    }
  }

  // /shorts/<id>, /embed/<id>, /live/<id>, /v/<id>
  const pathVideoMatch = pathname.match(
    /^\/(?:shorts|embed|live|v)\/([A-Za-z0-9_-]{11})/
  );
  if (pathVideoMatch) {
    return {
      kind: "video",
      videoId: pathVideoMatch[1],
      normalizedUrl: `https://www.youtube.com/watch?v=${pathVideoMatch[1]}`,
    };
  }

  return { kind: "invalid" };
}

/**
 * Extract a channel ID from raw HTML of a YouTube channel/video page.
 * Tries multiple known sources in order of reliability.
 */
export function extractChannelIdFromHtml(html: string): {
  channelId: string | null;
  handle: string | null;
  name: string | null;
  avatarUrl: string | null;
} {
  // Channel ID: try the most reliable signals first
  const channelId =
    matchFirst(html, /<meta itemprop="(?:channelId|identifier)" content="(UC[\w-]{22})"/) ??
    matchFirst(html, /"channelId":"(UC[\w-]{22})"/) ??
    matchFirst(html, /\/channel\/(UC[\w-]{22})/);

  // Handle (e.g. @MrBeast)
  const handle =
    matchFirst(html, /"canonicalBaseUrl":"\/@([\w.-]+)"/) ??
    matchFirst(html, /youtube\.com\/@([\w.-]+)"/);

  // Channel name (og:title is the most reliable across page types)
  const name =
    matchFirst(html, /<meta property="og:title" content="([^"]+)"/) ??
    matchFirst(html, /<title>([^<]+) - YouTube<\/title>/);

  // Avatar (usually a yt3 URL)
  const avatarUrl =
    matchFirst(html, /<link rel="image_src" href="([^"]+)"/) ??
    matchFirst(html, /"avatar":\{"thumbnails":\[\{"url":"([^"]+)"/) ??
    matchFirst(html, /<meta property="og:image" content="([^"]+)"/);

  return { channelId, handle, name, avatarUrl };
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
