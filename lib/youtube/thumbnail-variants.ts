/**
 * YouTube serves thumbnails at multiple fixed resolutions from a single
 * predictable URL pattern. This file lists the variants and provides URL
 * builders.
 *
 * Note: `maxresdefault` is only available for videos uploaded in HD or
 * higher. For lower-res uploads, the URL returns a 120×90 placeholder
 * gray image. The tool detects this and hides the variant.
 */

export type ThumbnailVariantId =
  | "maxresdefault"
  | "sddefault"
  | "hqdefault"
  | "mqdefault"
  | "default";

export type ThumbnailVariant = {
  id: ThumbnailVariantId;
  label: string;
  width: number;
  height: number;
  /** Whether this resolution may be missing for non-HD uploads. */
  mayBeMissing: boolean;
};

export const VARIANTS: ThumbnailVariant[] = [
  { id: "maxresdefault", label: "Max resolution", width: 1280, height: 720, mayBeMissing: true },
  { id: "sddefault",     label: "Standard def",   width: 640,  height: 480, mayBeMissing: true },
  { id: "hqdefault",     label: "High quality",   width: 480,  height: 360, mayBeMissing: false },
  { id: "mqdefault",     label: "Medium quality", width: 320,  height: 180, mayBeMissing: false },
  { id: "default",       label: "Default",        width: 120,  height: 90,  mayBeMissing: false },
];

export function thumbnailUrl(videoId: string, variant: ThumbnailVariantId): string {
  return `https://i.ytimg.com/vi/${videoId}/${variant}.jpg`;
}

export function thumbnailFilename(videoId: string, variant: ThumbnailVariantId): string {
  return `${videoId}-${variant}.jpg`;
}
