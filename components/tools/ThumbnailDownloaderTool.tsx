"use client";


import { useEffect, useMemo, useState } from "react";
import {
  Link as LinkIcon,
  Download,
  Copy,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { extractVideoId, isValidVideoId } from "@/lib/youtube/extract-video-id";
import {
  VARIANTS,
  thumbnailUrl,
  thumbnailFilename,
  type ThumbnailVariantId,
} from "@/lib/youtube/thumbnail-variants";

const SAMPLE_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

type VariantState = "loading" | "ok" | "missing" | "error";

export function ThumbnailDownloaderTool() {
  const [input, setInput] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [variantStates, setVariantStates] = useState<
    Record<ThumbnailVariantId, VariantState>
  >({
    maxresdefault: "loading",
    sddefault: "loading",
    hqdefault: "loading",
    mqdefault: "loading",
    default: "loading",
  });

  const videoId = useMemo(() => extractVideoId(input), [input]);

  // Reset variant states whenever the video changes
  useEffect(() => {
    if (!videoId) return;
    setVariantStates({
      maxresdefault: "loading",
      sddefault: "loading",
      hqdefault: "loading",
      mqdefault: "loading",
      default: "loading",
    });
  }, [videoId]);

  function markVariant(variant: ThumbnailVariantId, state: VariantState) {
    setVariantStates((prev) => ({ ...prev, [variant]: state }));
  }

  /**
   * Detect "missing" by inspecting the loaded image's natural width.
   * YouTube returns a 120×90 placeholder image for unavailable resolutions
   * (most often maxresdefault on non-HD uploads), so any non-default variant
   * that reports a natural width of 120 is considered missing.
   */
  function handleImageLoad(
    variant: ThumbnailVariantId,
    naturalWidth: number,
    expectedWidth: number
  ) {
    const isPlaceholder =
      variant !== "default" && naturalWidth <= 120 && expectedWidth > 120;
    markVariant(variant, isPlaceholder ? "missing" : "ok");
  }

  async function downloadThumbnail(variant: ThumbnailVariantId) {
    if (!videoId) return;
    const url = thumbnailUrl(videoId, variant);
    const filename = thumbnailFilename(videoId, variant);
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: open in new tab so the user can right-click → Save As
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  async function copyUrl(variant: ThumbnailVariantId, key: string) {
    if (!videoId) return;
    const url = thumbnailUrl(videoId, variant);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    } catch {
      // Clipboard API can fail in non-HTTPS or older browsers — fall back silently
    }
  }

  const hasError = input.trim().length > 0 && !isValidVideoId(videoId);
  const visibleVariants = VARIANTS.filter(
    (v) => variantStates[v.id] !== "missing"
  );

  return (
    <div>
      {/* Input */}
      <label
        htmlFor="yt-url"
        className="block text-sm font-medium text-gray-700"
      >
        YouTube video URL or ID
      </label>
      <div className="mt-1.5 flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2.5 shadow-sm focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition">
        <LinkIcon className="h-4 w-4 text-gray-400" strokeWidth={2} aria-hidden="true" />
        <input
          id="yt-url"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=…"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        {input && (
          <button
            type="button"
            onClick={() => setInput("")}
            className="text-xs text-gray-400 hover:text-gray-600"
            aria-label="Clear input"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        {hasError ? (
          <span className="inline-flex items-center gap-1 text-red-600">
            <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />
            Couldn&apos;t find a valid video ID in that input.
          </span>
        ) : videoId ? (
          <span className="text-gray-500">
            Video ID: <span className="font-mono text-gray-700">{videoId}</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setInput(SAMPLE_URL)}
            className="text-brand-700 hover:text-brand-800 underline-offset-2 hover:underline"
          >
            Try with a sample URL
          </button>
        )}
      </div>

      {/* Results */}
      {videoId && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {visibleVariants.length} resolutions available
          </p>

          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VARIANTS.map((variant) => {
              const state = variantStates[variant.id];
              if (state === "missing") return null;

              const url = thumbnailUrl(videoId, variant.id);
              const isCopied = copiedKey === variant.id;

              return (
                <article
                  key={variant.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-brand-300"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100">
                    {state === "loading" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2
                          className="h-5 w-5 animate-spin text-gray-400"
                          strokeWidth={2}
                        />
                      </div>
                    )}
                    {/* Hidden until loaded to avoid flashing the placeholder image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${variant.label} thumbnail for video ${videoId}`}
                      crossOrigin="anonymous"
                      onLoad={(e) =>
                        handleImageLoad(
                          variant.id,
                          (e.target as HTMLImageElement).naturalWidth,
                          variant.width
                        )
                      }
                      onError={() => markVariant(variant.id, "error")}
                      className={`h-full w-full object-cover transition-opacity ${
                        state === "ok" ? "opacity-100" : "opacity-0"
                      }`}
                      loading="lazy"
                    />
                  </div>

                  <header className="mt-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {variant.label}
                      </h3>
                      <p className="font-mono text-xs text-gray-500">
                        {variant.width} × {variant.height}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-gray-400">
                      {variant.id}
                    </span>
                  </header>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => downloadThumbnail(variant.id)}
                      disabled={state !== "ok"}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-brand-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 transition"
                    >
                      <Download className="h-3.5 w-3.5" strokeWidth={2} />
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => copyUrl(variant.id, variant.id)}
                      disabled={state !== "ok"}
                      className="inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition"
                      aria-label={isCopied ? "URL copied" : "Copy URL"}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-brand-600" strokeWidth={2.5} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                          URL
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* If maxres is missing, show a one-line note */}
          {variantStates.maxresdefault === "missing" && (
            <p className="mt-4 text-xs text-gray-500">
              Note: The maximum resolution (1280 × 720) isn&apos;t available for this video.
              YouTube only generates the max-res thumbnail for HD uploads.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
