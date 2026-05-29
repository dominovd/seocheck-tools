"use client";

import { useMemo, useState } from "react";
import {
  Hash,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  RotateCw,
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";

type HashtagItem = {
  tag: string;
  competition: "low" | "medium" | "high";
};

type ApiResponse =
  | {
      output: { hashtags: HashtagItem[] };
      cached?: boolean;
      remaining?: number;
    }
  | { error: string; code?: string };

const COMP_PRIORITY = { high: 0, medium: 1, low: 2 } as const;

const COMP_STYLES: Record<HashtagItem["competition"], string> = {
  high: "bg-amber-50 text-amber-700 ring-amber-200",
  medium: "bg-brand-50 text-brand-700 ring-brand-200",
  low: "bg-blue-50 text-blue-700 ring-blue-200",
};

type SortMode = "relevance" | "competition";

export function HashtagGeneratorTool() {
  const [topic, setTopic] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<HashtagItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("relevance");

  const sortedHashtags = useMemo(() => {
    if (sortMode === "relevance") return hashtags;
    return [...hashtags].sort(
      (a, b) => COMP_PRIORITY[a.competition] - COMP_PRIORITY[b.competition]
    );
  }, [hashtags, sortMode]);

  const top3 = useMemo(() => hashtags.slice(0, 3), [hashtags]);

  async function generate() {
    if (!topic.trim() || loading) return;
    setError(null);
    setCached(false);
    try {
      setLoading(true);
      const res = await fetch("/api/youtube-hashtag-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          input: { topic: topic.trim() },
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Generation failed.");
        return;
      }
      setHashtags(data.output.hashtags);
      setCached(!!data.cached);
      setRemaining(typeof data.remaining === "number" ? data.remaining : null);
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
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

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generate();
        }}
      >
        <label htmlFor="topic-input" className="block text-sm font-medium text-gray-700">
          Video topic
        </label>
        <textarea
          id="topic-input"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. unboxing the new Sony A7R V mirrorless camera"
          rows={3}
          maxLength={200}
          className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>The more specific, the better the long-tail hashtags.</span>
          <span className="font-mono tabular-nums">{topic.length} / 200</span>
        </div>

        <div className="mt-5">
          <TurnstileWidget onToken={setTurnstileToken} />
        </div>

        <button
          type="submit"
          disabled={!topic.trim() || loading}
          className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              Generating
            </>
          ) : hashtags.length > 0 ? (
            <>
              <RotateCw className="h-4 w-4" strokeWidth={2} />
              Generate new batch
            </>
          ) : (
            <>
              <Hash className="h-4 w-4" strokeWidth={2} />
              Generate hashtags
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {hashtags.length > 0 && (
        <div className="mt-8">
          {/* Top 3 callout (YouTube displays first 3 above title) */}
          {top3.length === 3 && (
            <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/70 to-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Top 3 — these show above your title
              </p>
              <p className="mt-1 text-xs text-gray-600">
                YouTube renders the first 3 hashtags from your description directly under your channel name.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {top3.map((h, i) => (
                  <span
                    key={`top-${i}`}
                    className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200"
                  >
                    #{h.tag}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => copy(top3.map((h) => `#${h.tag}`).join(" "), "top3")}
                  className="inline-flex items-center gap-1 rounded-md bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition"
                >
                  {copiedKey === "top3" ? (
                    <>
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" strokeWidth={2} />
                      Copy top 3
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* All hashtags */}
          <div className="mt-8 flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {hashtags.length} hashtags
              {cached && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 normal-case">
                  cached
                </span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5">
                {(["relevance", "competition"] as SortMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSortMode(m)}
                    className={`rounded px-3 py-1 text-xs font-medium transition ${
                      sortMode === m
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {m === "relevance" ? "By relevance" : "By competition"}
                  </button>
                ))}
              </div>
              {remaining !== null && (
                <span className="text-xs text-gray-400">{remaining} left today</span>
              )}
              <button
                type="button"
                onClick={() =>
                  copy(hashtags.map((h) => `#${h.tag}`).join(" "), "all")
                }
                className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100 hover:bg-brand-100 transition"
              >
                {copiedKey === "all" ? (
                  <>
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" strokeWidth={2} />
                    Copy all
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {sortedHashtags.map((h, i) => {
              const key = `tag-${h.tag}-${i}`;
              const isCopied = copiedKey === key;
              const value = `#${h.tag}`;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => copy(value, key)}
                  className={`group inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium ring-1 ring-inset transition ${
                    isCopied
                      ? "bg-brand-500 text-white ring-brand-500"
                      : `${COMP_STYLES[h.competition]} hover:opacity-80`
                  }`}
                  title={`${h.competition} competition`}
                >
                  {value}
                  <span
                    className={`text-[10px] font-mono uppercase ${
                      isCopied ? "opacity-70" : "opacity-50"
                    }`}
                  >
                    {h.competition[0]}
                  </span>
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

          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
              High
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
              Medium
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              Low (niche)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
