"use client";

import { useState } from "react";
import {
  Lightbulb,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  RotateCw,
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";

type Format =
  | "mixed"
  | "tutorial"
  | "deepdive"
  | "listicle"
  | "experiment"
  | "comparison"
  | "review";

const FORMAT_OPTIONS: { value: Format; label: string }[] = [
  { value: "mixed",      label: "Mixed formats" },
  { value: "tutorial",   label: "Tutorials / how-to" },
  { value: "deepdive",   label: "Deep dives / explainers" },
  { value: "listicle",   label: "Listicles (numbered)" },
  { value: "experiment", label: "Experiments (\"I tried…\")" },
  { value: "comparison", label: "Comparisons / vs" },
  { value: "review",     label: "Reviews" },
];

type VideoIdea = { title: string; premise: string };

type ApiResponse =
  | { output: { ideas: VideoIdea[] }; cached?: boolean; remaining?: number }
  | { error: string; code?: string };

export function VideoIdeaGeneratorTool() {
  const [niche, setNiche] = useState("");
  const [format, setFormat] = useState<Format>("mixed");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function generate() {
    if (!niche.trim() || loading) return;
    setError(null);
    setCached(false);
    try {
      setLoading(true);
      const res = await fetch("/api/youtube-video-idea-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          input: { niche: niche.trim(), format },
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Generation failed.");
        return;
      }
      setIdeas(data.output.ideas);
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
        <label htmlFor="niche-input" className="block text-sm font-medium text-gray-700">
          Niche or channel topic
        </label>
        <textarea
          id="niche-input"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="e.g. solo home-cooking on a $30/week grocery budget, aimed at college students"
          rows={3}
          maxLength={200}
          className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>The narrower the niche, the more useful the ideas.</span>
          <span className="font-mono tabular-nums">{niche.length} / 200</span>
        </div>

        <div className="mt-5">
          <label htmlFor="format-select" className="block text-sm font-medium text-gray-700">
            Video format
          </label>
          <div className="mt-1.5 relative max-w-sm">
            <select
              id="format-select"
              value={format}
              onChange={(e) => setFormat(e.target.value as Format)}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {FORMAT_OPTIONS.map((o) => (
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

        <div className="mt-5">
          <TurnstileWidget onToken={setTurnstileToken} />
        </div>

        <button
          type="submit"
          disabled={!niche.trim() || loading}
          className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              Generating
            </>
          ) : ideas.length > 0 ? (
            <>
              <RotateCw className="h-4 w-4" strokeWidth={2} />
              Generate new batch
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4" strokeWidth={2} />
              Generate 10 ideas
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

      {ideas.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {ideas.length} video ideas
              {cached && (
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

          <ol className="mt-3 space-y-3">
            {ideas.map((idea, i) => {
              const titleKey = `title-${i}`;
              const isCopied = copiedKey === titleKey;
              return (
                <li
                  key={titleKey}
                  className="group relative rounded-xl border border-gray-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-[11px] tabular-nums text-gray-400 w-6 text-right shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                        {idea.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                        {idea.premise}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(idea.title, titleKey)}
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition shrink-0 ${
                        isCopied
                          ? "bg-brand-50 text-brand-700"
                          : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
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
                          Copy title
                        </>
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
