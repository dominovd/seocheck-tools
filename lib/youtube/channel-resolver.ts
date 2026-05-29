/**
 * YouTube channel input parser.
 *
 * Users paste channel references in half a dozen different shapes; this
 * module normalizes them into one of three lookup strategies the YouTube
 * Data API understands:
 *
 *  - `id`      — direct channel ID like UCxxxxxxxxxxxxxxxxxxxxxx
 *  - `handle`  — handle like @MrBeast (with or without @)
 *  - `legacy`  — legacy username (/c/Name or /user/Name)
 *
 * Examples that all resolve correctly:
 *  - UCX6OQ3DkcsbYNE6H8uQQuVA
 *  - @MrBeast
 *  - https://www.youtube.com/@MrBeast
 *  - youtube.com/@MrBeast/videos
 *  - https://youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA
 *  - https://youtube.com/c/MrBeast6000
 *  - https://youtube.com/user/PewDiePie
 */

export type ChannelLookup =
  | { type: "id"; value: string }
  | { type: "handle"; value: string }
  | { type: "legacy"; value: string };

// Channel IDs always start with UC and are 24 characters total.
const CHANNEL_ID_RE = /^UC[A-Za-z0-9_-]{22}$/;

export function resolveChannelInput(raw: string): ChannelLookup | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // 1. Bare channel ID
  if (CHANNEL_ID_RE.test(trimmed)) {
    return { type: "id", value: trimmed };
  }

  // 2. Bare handle (with optional @)
  if (/^@?[A-Za-z0-9._-]{3,30}$/.test(trimmed) && !trimmed.includes("/")) {
    const handle = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
    return { type: "handle", value: handle };
  }

  // 3. URL formats — normalize, strip protocol/host, then match path
  let path: string;
  try {
    const withProtocol = /^https?:\/\//.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const url = new URL(withProtocol);
    if (!/(?:^|\.)youtube\.com$/.test(url.hostname) && url.hostname !== "youtu.be") {
      return null;
    }
    path = url.pathname.replace(/\/+$/, ""); // trim trailing slash
  } catch {
    return null;
  }

  // /channel/UCxxx
  const channelMatch = path.match(/^\/channel\/(UC[A-Za-z0-9_-]{22})/);
  if (channelMatch) {
    return { type: "id", value: channelMatch[1] };
  }

  // /@handle (with optional sub-path like /videos)
  const handleMatch = path.match(/^\/@([A-Za-z0-9._-]+)/);
  if (handleMatch) {
    return { type: "handle", value: handleMatch[1] };
  }

  // /c/CustomName (legacy custom URL)
  const customMatch = path.match(/^\/c\/([A-Za-z0-9._-]+)/);
  if (customMatch) {
    return { type: "legacy", value: customMatch[1] };
  }

  // /user/LegacyUsername (oldest format)
  const userMatch = path.match(/^\/user\/([A-Za-z0-9._-]+)/);
  if (userMatch) {
    return { type: "legacy", value: userMatch[1] };
  }

  return null;
}

/**
 * Stable cache-key segment for a resolved channel lookup. Used to dedup
 * `@handle` and `https://youtube.com/@handle` to the same cache entry.
 */
export function lookupCacheKey(lookup: ChannelLookup): string {
  return `${lookup.type}:${lookup.value.toLowerCase()}`;
}
