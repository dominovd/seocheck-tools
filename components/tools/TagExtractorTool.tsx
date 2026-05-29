"use client";

import { useState } from "react";
import {
  Link as LinkIcon,
  ScanLine,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Tags as TagsIcon,
  ExternalLink,
} from "lucide-react";
import { extractVideoId, isValidVideoId } from "@/lib/youtube/extract-video-id";
import { TAG_CHAR_LIMIT, totalTagChars, type VideoTagInfo } from "@/lib/youtube/extract-tags";

const SAMPLE_URL = "https://www.youtube.com/watch?v=jNQXAC9IVRw";

export function TagExtractorTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<VideoTagInfo | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function handleExtract(rawInput: string) {
    setError(null);
    setResult(null);

    const id = extractVideoId(rawInput);
    if (!isValidVideoId(id)) {
      setError("Couldn't find a YouTube video ID in that URL.");
      return;
    }
    setVideoId(id);

    setLoading(true);
    try {
      const res = await fetch("/api/youtube-tag-extractor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rawInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Extraction failed.");
        return;
      }
      setResult(data.result as VideoTagInfo);
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    await handleExtract(input);
  }

  async function copy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    } catch {
      // ignore
    }
  }

  const charsUsed = result ? totalTagChars(result.tags) : 0;
  const charsPct = result
    ? Math.min(100, (charsUsed / TAG_CHAR_LIMIT) * 100)
    : 0;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="video-url-input" className="block text-sm font-medium text-gray-700">
          YouTube video URL
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2.5 shadow-sm focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition">
            <LinkIcon className="h-4 w-4 text-gray-400" strokeWidth={2} aria-hidden="true" />
            <input
              id="video-url-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Fetching
              </>
            ) : (
              <>
                <ScanLine className="h-4 w-4" strokeWidth={2} />
                Extract tags
              </>
            )}
          </button>
        </div>

        <div className="mt-2 text-xs">
          {!input && (
            <button
              type="button"
              onClick={() => {
                setInput(SAMPLE_URL);
                handleExtract(SAMPLE_URL);
              }}
              className="text-brand-700 hover:text-brand-800 underline-offset-2 hover:underline"
            >
              Try with a sample URL
            </button>
          )}
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4">
          <AlertCircle
            className="h-4 w-4 shrink-0 text-red-500 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8">
          {/* Video header */}
          <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/70 to-white p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Extracted from
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              {videoId && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                  alt={result.title ?? "Video thumbnail"}
                  className="h-24 w-40 shrink-0 rounded-md object-cover ring-1 ring-gray-200 shadow-sm"
                  loading="lazy"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-base font-semibold text-gray-900 sm:text-lg">
                  {result.title ?? "Untitled video"}
                </p>
                {result.channel && (
                  <p className="mt-1 text-sm text-gray-600">{result.channel}</p>
                )}
                {videoId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"
                  >
                    Open on YouTube
                    <ExternalLink className="h-3 w-3" strokeWidth={2} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* No tags case */}
          {result.tags.length === 0 ? (
            <div className="mt-6 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50/60 p-4">
              <AlertCircle
                className="h-4 w-4 shrink-0 text-amber-500 mt-0.5"
                strokeWidth={2}
              />
              <p className="text-sm text-amber-800">
                This video doesn&apos;t have any tags, or the uploader removed
                them. Try a different video — most creators in the 10K+ subs
                range use tags for SEO.
              </p>
            </div>
          ) : (
            <>
              {/* Tag density bar */}
              <div className="mt-8">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-gray-500">
                    {result.tags.length} tags · {charsUsed} / {TAG_CHAR_LIMIT} chars
                  </span>
                  <button
                    type="button"
                    onClick={() => copy(result.tags.join(", "), "all")}
                    className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100 hover:bg-brand-100 transition"
                  >
                    {copiedKey === "all" ? (
                      <>
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                        Copied all
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" strokeWidth={2} />
                        Copy all (comma-separated)
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full transition-all ${
                      charsPct >= 90
                        ? "bg-amber-400"
                        : charsPct >= 60
                        ? "bg-brand-500"
                        : "bg-brand-300"
                    }`}
                    style={{ width: `${charsPct}%` }}
                  />
                </div>
              </div>

              {/* Tag chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                {result.tags.map((tag, i) => {
                  const key = `tag-${i}`;
                  const isCopied = copiedKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => copy(tag, key)}
                      className={`group inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium ring-1 ring-inset transition ${
                        isCopied
                          ? "bg-brand-500 text-white ring-brand-500"
                          : "bg-white text-gray-700 ring-gray-200 hover:ring-brand-300 hover:bg-brand-50/40"
                      }`}
                      aria-label={`Copy tag ${tag}`}
                    >
                      <TagsIcon
                        className={`h-3 w-3 ${
                          isCopied ? "text-white" : "text-gray-400 group-hover:text-brand-500"
                        }`}
                        strokeWidth={2}
                      />
                      {tag}
                      {isCopied ? (
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      ) : (
                        <Copy
                          className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                          strokeWidth={2}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
