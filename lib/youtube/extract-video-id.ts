/**
 * Extract an 11-character YouTube video ID from any common URL shape:
 *
 *   https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *   https://youtube.com/watch?v=dQw4w9WgXcQ&t=10
 *   https://m.youtube.com/watch?v=dQw4w9WgXcQ
 *   https://youtu.be/dQw4w9WgXcQ
 *   https://youtu.be/dQw4w9WgXcQ?si=...
 *   https://www.youtube.com/embed/dQw4w9WgXcQ
 *   https://www.youtube.com/shorts/dQw4w9WgXcQ
 *   https://www.youtube.com/live/dQw4w9WgXcQ
 *   https://www.youtube.com/v/dQw4w9WgXcQ
 *   dQw4w9WgXcQ   ← already a raw video ID
 *
 * Returns the 11-char ID or null if no valid ID can be extracted.
 * Used by: Thumbnail Downloader, Tag Extractor, Channel ID Finder,
 * Embed Generator, Chapter Generator.
 */

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const URL_PATTERNS: RegExp[] = [
  // Standard watch URL with v= query param
  /[?&]v=([A-Za-z0-9_-]{11})/,
  // Shortened youtu.be path
  /youtu\.be\/([A-Za-z0-9_-]{11})/,
  // Embed, shorts, live, v paths
  /youtube\.com\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{11})/,
];

export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Already a raw video ID
  if (VIDEO_ID_PATTERN.test(trimmed)) return trimmed;

  // Try URL patterns
  for (const pattern of URL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function isValidVideoId(id: string | null | undefined): id is string {
  return !!id && VIDEO_ID_PATTERN.test(id);
}
