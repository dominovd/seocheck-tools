"use client";

import { useState } from "react";
import {
  Tags as TagsIcon,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  RotateCw,
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { TAG_CHAR_LIMIT, totalTagChars } from "@/lib/youtube/extract-tags";

type ApiResponse =
  | { output: { tags: string[] }; cached?: boolean; remaining?: number }
  | { error: string; code?: string };

export function TagGeneratorTool() {
  const [topic, setTopic] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function generate() {
    if (!topic.trim() || loading) return;
    setError(null);
    setCached(false);
    try {
      setLoading(true);
      const res = await fetch("/api/youtube-tag-generator", {
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
      setTags(data.output.tags);
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

  const charsUsed = totalTagChars(tags);
  const charsPct = Math.min(100, (charsUsed / TAG_CHAR_LIMIT) * 100);

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
          placeholder="e.g. how to use Davinci Resolve for color grading"
          rows={3}
          maxLength={200}
          className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>Be specific — niche, angle, target viewer.</span>
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
          ) : tags.length > 0 ? (
            <>
              <RotateCw className="h-4 w-4" strokeWidth={2} />
              Generate new batch
            </>
          ) : (
            <>
              <TagsIcon className="h-4 w-4" strokeWidth={2} />
              Generate tags
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

      {tags.length > 0 && (
        <div className="mt-8">
          {/* Density bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {tags.length} tags · {charsUsed} / {TAG_CHAR_LIMIT} chars
              {cached && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 normal-case">
                  cached
                </span>
              )}
            </p>
            <div className="flex items-center gap-2">
              {remaining !== null && (
                <span className="text-xs text-gray-400">
                  {remaining} left today
                </span>
              )}
              <button
                type="button"
                onClick={() => copy(tags.join(", "), "all")}
                className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100 hover:bg-brand-100 transition"
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
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full transition-all ${
                charsPct >= 90 ? "bg-amber-400" : charsPct >= 60 ? "bg-brand-500" : "bg-brand-300"
              }`}
              style={{ width: `${charsPct}%` }}
            />
          </div>

          {/* Tag chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag, i) => {
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
        </div>
      )}
    </div>
  );
}
