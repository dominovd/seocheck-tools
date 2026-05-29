"use client";

import { useState } from "react";
import {
  WandSparkles,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  RotateCw,
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";

type Style =
  | "mixed"
  | "curious"
  | "listicle"
  | "howto"
  | "comparison"
  | "contrarian"
  | "story";

const STYLE_OPTIONS: { value: Style; label: string }[] = [
  { value: "mixed",      label: "Mixed (variety of angles)" },
  { value: "curious",    label: "Curiosity / open-loop" },
  { value: "listicle",   label: "Listicle (numbered)" },
  { value: "howto",      label: "How-to / tutorial" },
  { value: "comparison", label: "Comparison / vs" },
  { value: "contrarian", label: "Contrarian / hot take" },
  { value: "story",      label: "First-person story" },
];

type ApiResponse =
  | { output: { titles: string[] }; cached?: boolean; remaining?: number }
  | { error: string; code?: string; resetAt?: number; limit?: number };

export function TitleGeneratorTool() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<Style>("mixed");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [usedCached, setUsedCached] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function generate() {
    if (!topic.trim() || loading) return;
    setError(null);
    setUsedCached(false);

    try {
      setLoading(true);
      const res = await fetch("/api/youtube-title-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          input: { topic: topic.trim(), style },
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Generation failed.");
        return;
      }
      setTitles(data.output.titles);
      setUsedCached(!!data.cached);
      setRemaining(typeof data.remaining === "number" ? data.remaining : null);
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  async function copyOne(text: string, idx: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx((i) => (i === idx ? null : i)), 1500);
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
        {/* Topic */}
        <label htmlFor="topic-input" className="block text-sm font-medium text-gray-700">
          Video topic
        </label>
        <textarea
          id="topic-input"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. honest review of the new M5 MacBook Pro after 30 days"
          rows={3}
          maxLength={200}
          className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>The more specific, the better — niche, angle, target viewer.</span>
          <span className="font-mono tabular-nums">
            {topic.length} / 200
          </span>
        </div>

        {/* Style */}
        <div className="mt-5">
          <label htmlFor="style-select" className="block text-sm font-medium text-gray-700">
            Title style
          </label>
          <div className="mt-1.5 relative max-w-sm">
            <select
              id="style-select"
              value={style}
              onChange={(e) => setStyle(e.target.value as Style)}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {STYLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Turnstile (invisible in most cases) */}
        <div className="mt-5">
          <TurnstileWidget onToken={setTurnstileToken} />
        </div>

        {/* Submit */}
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
          ) : titles.length > 0 ? (
            <>
              <RotateCw className="h-4 w-4" strokeWidth={2} />
              Generate new batch
            </>
          ) : (
            <>
              <WandSparkles className="h-4 w-4" strokeWidth={2} />
              Generate 10 titles
            </>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Results */}
      {titles.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {titles.length} generated titles
              {usedCached && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 normal-case">
                  cached
                </span>
              )}
            </p>
            {remaining !== null && (
              <p className="text-xs text-gray-400">
                {remaining} generations left today
              </p>
            )}
          </div>

          <ol className="mt-3 divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
            {titles.map((title, i) => {
              const isCopied = copiedIdx === i;
              const len = title.length;
              const lenColor =
                len < 30 || len > 75
                  ? "text-amber-500"
                  : len <= 70
                  ? "text-gray-400"
                  : "text-amber-500";
              return (
                <li key={`${i}-${title}`} className="group flex items-center gap-3 px-4 py-3">
                  <span className="font-mono text-[11px] tabular-nums text-gray-400 w-7 text-right">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-sm text-gray-800 leading-snug">{title}</span>
                  <span className={`font-mono text-[10px] tabular-nums ${lenColor}`}>
                    {len}c
                  </span>
                  <button
                    type="button"
                    onClick={() => copyOne(title, i)}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition ${
                      isCopied
                        ? "bg-brand-50 text-brand-700"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" strokeWidth={2} />
                        Copy
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
