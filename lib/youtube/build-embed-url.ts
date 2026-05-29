/**
 * Build YouTube embed URLs + iframe HTML snippets with the right
 * combination of player params.
 *
 * YouTube embed parameter reference:
 *   https://developers.google.com/youtube/player_parameters
 *
 * Notes / quirks:
 *  - autoplay=1 only works in most browsers when mute=1 is also set
 *  - loop=1 alone doesn't work for a single video — YouTube requires
 *    playlist=<videoId> to loop a single video
 *  - modestbranding was deprecated in 2023 (the YouTube logo always shows
 *    on the control bar now), so we don't expose it
 *  - rel=0 no longer hides related videos completely — it now only
 *    restricts them to the same channel as the current video
 */

export type EmbedOptions = {
  videoId: string;
  autoplay: boolean;
  mute: boolean;
  controls: boolean;
  loop: boolean;
  /** Show captions by default */
  captions: boolean;
  /** Restrict related videos to the same channel */
  hideRelated: boolean;
  /** Use youtube-nocookie.com domain (no tracking cookies until play) */
  privacyMode: boolean;
  /** Start time in seconds (0 = no start time) */
  startSeconds: number;
  /** End time in seconds (0 = no end time) */
  endSeconds: number;
  /** Player width in pixels (default 560) */
  width: number;
  /** Player height in pixels (default 315) */
  height: number;
};

export const DEFAULT_OPTIONS: EmbedOptions = {
  videoId: "",
  autoplay: false,
  mute: false,
  controls: true,
  loop: false,
  captions: false,
  hideRelated: false,
  privacyMode: false,
  startSeconds: 0,
  endSeconds: 0,
  width: 560,
  height: 315,
};

export function buildEmbedUrl(opts: EmbedOptions): string {
  const host = opts.privacyMode
    ? "https://www.youtube-nocookie.com"
    : "https://www.youtube.com";
  const url = new URL(`${host}/embed/${opts.videoId}`);

  if (opts.autoplay) url.searchParams.set("autoplay", "1");
  if (opts.mute || opts.autoplay) url.searchParams.set("mute", "1");
  if (!opts.controls) url.searchParams.set("controls", "0");
  if (opts.loop) {
    url.searchParams.set("loop", "1");
    // loop=1 requires playlist=<videoId> to loop a single video
    url.searchParams.set("playlist", opts.videoId);
  }
  if (opts.captions) url.searchParams.set("cc_load_policy", "1");
  if (opts.hideRelated) url.searchParams.set("rel", "0");
  if (opts.startSeconds > 0)
    url.searchParams.set("start", String(opts.startSeconds));
  if (opts.endSeconds > 0)
    url.searchParams.set("end", String(opts.endSeconds));

  return url.toString();
}

const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

export function buildIframeHtml(opts: EmbedOptions): string {
  const src = buildEmbedUrl(opts);
  return [
    `<iframe`,
    `  width="${opts.width}"`,
    `  height="${opts.height}"`,
    `  src="${src}"`,
    `  title="YouTube video player"`,
    `  frameborder="0"`,
    `  allow="${IFRAME_ALLOW}"`,
    `  referrerpolicy="strict-origin-when-cross-origin"`,
    `  allowfullscreen></iframe>`,
  ].join("\n");
}

export function buildResponsiveHtml(opts: EmbedOptions): string {
  const src = buildEmbedUrl(opts);
  return [
    `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">`,
    `  <iframe`,
    `    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"`,
    `    src="${src}"`,
    `    title="YouTube video player"`,
    `    frameborder="0"`,
    `    allow="${IFRAME_ALLOW}"`,
    `    referrerpolicy="strict-origin-when-cross-origin"`,
    `    allowfullscreen></iframe>`,
    `</div>`,
  ].join("\n");
}

/** Parse "mm:ss" or "h:mm:ss" or plain "90" into seconds. */
export function parseTimeInput(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) return 0;

  // Plain seconds (no colon)
  if (/^\d+$/.test(trimmed)) return Number(trimmed);

  // mm:ss or h:mm:ss
  const parts = trimmed.split(":").map((p) => Number(p));
  if (parts.some((n) => Number.isNaN(n) || n < 0)) return 0;

  if (parts.length === 2) {
    // mm:ss
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    // h:mm:ss
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

/** Format a seconds value back to a "mm:ss" or "h:mm:ss" display string. */
export function formatTimeOutput(seconds: number): string {
  if (seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
