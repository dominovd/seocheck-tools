"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Link as LinkIcon,
  Copy,
  Check,
  AlertCircle,
  Code2,
} from "lucide-react";
import { extractVideoId, isValidVideoId } from "@/lib/youtube/extract-video-id";
import {
  buildEmbedUrl,
  buildIframeHtml,
  buildResponsiveHtml,
  parseTimeInput,
  formatTimeOutput,
  DEFAULT_OPTIONS,
  type EmbedOptions,
} from "@/lib/youtube/build-embed-url";

const SAMPLE_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

type OutputMode = "iframe" | "responsive";

export function EmbedCodeGeneratorTool() {
  const [input, setInput] = useState("");
  const [opts, setOpts] = useState<EmbedOptions>(DEFAULT_OPTIONS);
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [outputMode, setOutputMode] = useState<OutputMode>("iframe");
  const [copied, setCopied] = useState(false);

  const videoId = useMemo(() => extractVideoId(input), [input]);

  // Sync videoId into opts whenever input changes
  useEffect(() => {
    setOpts((prev) => ({ ...prev, videoId: videoId ?? "" }));
  }, [videoId]);

  // Parse start/end time inputs into seconds whenever they change
  useEffect(() => {
    setOpts((prev) => ({
      ...prev,
      startSeconds: parseTimeInput(startInput),
      endSeconds: parseTimeInput(endInput),
    }));
  }, [startInput, endInput]);

  const previewUrl = videoId ? buildEmbedUrl(opts) : "";
  const snippet = videoId
    ? outputMode === "responsive"
      ? buildResponsiveHtml(opts)
      : buildIframeHtml(opts)
    : "";

  function setBool<K extends keyof EmbedOptions>(key: K, value: boolean) {
    setOpts((prev) => ({ ...prev, [key]: value }));
  }

  async function copySnippet() {
    if (!snippet) return;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  const hasError = input.trim().length > 0 && !isValidVideoId(videoId);

  return (
    <div>
      {/* URL Input */}
      <label htmlFor="yt-url" className="block text-sm font-medium text-gray-700">
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
      </div>
      <div className="mt-2 text-xs">
        {hasError ? (
          <span className="inline-flex items-center gap-1 text-red-600">
            <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />
            Couldn&apos;t find a valid video ID.
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

      {/* Live preview */}
      {videoId && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Live preview
          </p>
          <div className="mt-2 overflow-hidden rounded-xl bg-black ring-1 ring-gray-200">
            <div className="relative aspect-video w-full">
              <iframe
                key={previewUrl}
                src={previewUrl}
                title="YouTube preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            The preview updates live as you toggle options below.
          </p>
        </div>
      )}

      {/* Options */}
      <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <ToggleRow
          label="Autoplay"
          hint="Browser will require mute — auto-enabled below."
          checked={opts.autoplay}
          onChange={(v) => setBool("autoplay", v)}
        />
        <ToggleRow
          label="Mute audio"
          hint="Forced on when autoplay is enabled."
          checked={opts.mute || opts.autoplay}
          disabled={opts.autoplay}
          onChange={(v) => setBool("mute", v)}
        />
        <ToggleRow
          label="Show player controls"
          hint="Hide for clean kiosk/background embeds."
          checked={opts.controls}
          onChange={(v) => setBool("controls", v)}
        />
        <ToggleRow
          label="Loop"
          hint="Repeats forever (single-video playlist trick)."
          checked={opts.loop}
          onChange={(v) => setBool("loop", v)}
        />
        <ToggleRow
          label="Captions on by default"
          checked={opts.captions}
          onChange={(v) => setBool("captions", v)}
        />
        <ToggleRow
          label="Restrict related videos"
          hint="Limits suggestions to the same channel."
          checked={opts.hideRelated}
          onChange={(v) => setBool("hideRelated", v)}
        />
        <ToggleRow
          label="Privacy-enhanced (no cookies)"
          hint="Uses youtube-nocookie.com — GDPR-friendlier."
          checked={opts.privacyMode}
          onChange={(v) => setBool("privacyMode", v)}
        />

        {/* Time inputs */}
        <div className="grid grid-cols-2 gap-3 sm:col-span-2">
          <div>
            <label
              htmlFor="start-time"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Start at
            </label>
            <input
              id="start-time"
              type="text"
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
              placeholder="0:30 or 30"
              className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            {opts.startSeconds > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                = {opts.startSeconds}s ({formatTimeOutput(opts.startSeconds)})
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="end-time"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              End at
            </label>
            <input
              id="end-time"
              type="text"
              value={endInput}
              onChange={(e) => setEndInput(e.target.value)}
              placeholder="2:30 or 150"
              className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            {opts.endSeconds > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                = {opts.endSeconds}s ({formatTimeOutput(opts.endSeconds)})
              </p>
            )}
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label
            htmlFor="width"
            className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            Width (px)
          </label>
          <input
            id="width"
            type="number"
            min={100}
            max={3840}
            value={opts.width}
            onChange={(e) =>
              setOpts((prev) => ({ ...prev, width: Number(e.target.value) || 560 }))
            }
            className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label
            htmlFor="height"
            className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            Height (px)
          </label>
          <input
            id="height"
            type="number"
            min={100}
            max={2160}
            value={opts.height}
            onChange={(e) =>
              setOpts((prev) => ({ ...prev, height: Number(e.target.value) || 315 }))
            }
            className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      {/* Output mode toggle + snippet */}
      {videoId && (
        <div className="mt-10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Embed code
            </p>
            <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5">
              {(["iframe", "responsive"] as OutputMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setOutputMode(mode)}
                  className={`rounded px-3 py-1 text-xs font-medium transition ${
                    outputMode === mode
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {mode === "iframe" ? "Plain iframe" : "Responsive (16:9)"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 relative overflow-hidden rounded-xl bg-gray-900 ring-1 ring-gray-800">
            <pre className="overflow-x-auto p-4 pr-16 text-xs leading-relaxed text-gray-100">
              <code className="font-mono">{snippet}</code>
            </pre>
            <button
              type="button"
              onClick={copySnippet}
              className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-100 ring-1 ring-gray-700 hover:bg-gray-700 transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-brand-400" strokeWidth={2.5} />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="mt-3 flex items-start gap-2 text-xs text-gray-500">
            <Code2 className="h-3.5 w-3.5 shrink-0 mt-0.5" strokeWidth={2} />
            {outputMode === "responsive"
              ? "Responsive wrapper keeps the player at a 16:9 aspect ratio across any container width."
              : "Fixed-size iframe — paste anywhere that accepts raw HTML."}
          </div>
        </div>
      )}
    </div>
  );
}

type ToggleRowProps = {
  label: string;
  hint?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
};

function ToggleRow({ label, hint, checked, disabled, onChange }: ToggleRowProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      <span
        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
          checked ? "bg-brand-500" : "bg-gray-200"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-1 ring-gray-300 transition ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-gray-800">{label}</span>
        {hint && <span className="block text-xs text-gray-500">{hint}</span>}
      </span>
    </label>
  );
}
