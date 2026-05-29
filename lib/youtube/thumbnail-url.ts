/**
 * Resolves any user-supplied thumbnail reference into a usable image URL.
 *
 * Accepts:
 *   - A YouTube watch URL (https://www.youtube.com/watch?v=...)
 *   - A youtu.be short URL
 *   - A /shorts/ URL
 *   - A bare 11-character video ID
 *   - A direct image URL (returns as-is)
 *
 * For YouTube references we build the deterministic max-resolution CDN
 * path. For direct image URLs we just hand them back so users can preview
 * mockups before publishing.
 */

import { extractVideoId, isValidVideoId } from "./extract-video-id";

const IMAGE_EXTENSIONS_RE = /\.(jpg|jpeg|png|webp|avif|gif)(\?|#|$)/i;

export type ResolvedThumbnail = {
  /** The image URL to display. */
  url: string;
  /** "youtube" if we recognised it as a YouTube reference; "direct" otherwise. */
  source: "youtube" | "direct";
  /** Set when source = "youtube". */
  videoId?: string;
};

export function resolveThumbnail(input: string): ResolvedThumbnail | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try YouTube extraction first (handles URLs, IDs, /shorts/ etc.)
  const maybeId = extractVideoId(trimmed);
  if (isValidVideoId(maybeId)) {
    return {
      url: `https://i.ytimg.com/vi/${maybeId}/maxresdefault.jpg`,
      source: "youtube",
      videoId: maybeId,
    };
  }

  // Direct image URL (http/https only)
  if (/^https?:\/\//.test(trimmed) && IMAGE_EXTENSIONS_RE.test(trimmed)) {
    return { url: trimmed, source: "direct" };
  }

  return null;
}
