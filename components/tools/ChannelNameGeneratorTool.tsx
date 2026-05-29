"use client";

import { useState } from "react";
import {
  Tv,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  RotateCw,
  ExternalLink,
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";

type Style =
  | "mixed"
  | "short"
  | "descriptive"
  | "personality"
  | "playful"
  | "professional";

const STYLE_OPTIONS: { value: Style; label: string }[] = [
  { value: "mixed",         label: "Mixed styles" },
  { value: "short",         label: "Short & brandable" },
  { value: "descriptive",   label: "Descriptive" },
  { value: "personality",   label: "Personality-driven" },
  { value: "playful",       label: "Playful (puns, wordplay)" },
  { value: "professional",  label: "Professional / authoritative" },
];

type NameIdea = { name: string; rationale: string };

type ApiResponse =
  | { output: { names: NameIdea[] }; cached?: boolean; remaining?: number }
  | { error: string; code?: string };

export function ChannelNameGeneratorTool() {
  const [niche, setNiche] = useState("");
  const [style, setStyle] = useState<Style>("mixed");
  const [creatorName, setCreatorName] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [names, setNames] = useState<NameIdea[]>([]);
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
      const res = await fetch("/api/youtube-channel-name-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          input: {
            niche: niche.trim(),
            style,
            creatorName: creatorName.trim() || undefined,
          },
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Generation failed.");
        return;
      }
      setNames(data.output.names);
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
          Channel niche
        </label>
        <textarea
          id="niche-input"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="e.g. solo travel tips for women over 40 on a budget"
          rows={3}
          maxLength={200}
          className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>What's the channel about? Be specific.</span>
          <span className="font-mono tabular-nums">{niche.length} / 200</span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="style-select" className="block text-sm font-medium text-gray-700">
              Style
            </label>
            <div className="mt-1.5 relative">
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
          <div>
            <label htmlFor="creator-input" className="block text-sm font-medium text-gray-700">
              Your name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="creator-input"
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="e.g. Jenny"
              maxLength={40}
              className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
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
          ) : names.length > 0 ? (
            <>
              <RotateCw className="h-4 w-4" strokeWidth={2} />
              Generate new batch
            </>
          ) : (
            <>
              <Tv className="h-4 w-4" strokeWidth={2} />
              Generate channel names
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

      {names.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {names.length} channel name ideas
              {cached && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 normal-case">
                  cached
                </span>
              )}
            </p>
            {remaining !== null && (
              <p className="text-xs text-gray-400">{remaining} generations left today</p>
            )}
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Click a name to copy. Then check availability on YouTube before committing — handles must be unique.
          </p>

          <ol className="mt-4 space-y-2.5">
            {names.map((idea, i) => {
              const key = `name-${i}`;
              const isCopied = copiedKey === key;
              const handle = idea.name.replace(/\s+/g, "").toLowerCase();
              return (
                <li
                  key={key}
                  className="group rounded-xl border border-gray-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-[11px] tabular-nums text-gray-400 w-6 text-right shrink-0 mt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h3 className="text-base font-semibold text-gray-900">
                          {idea.name}
                        </h3>
                        <span className="font-mono text-xs text-gray-400">
                          @{handle}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                        {idea.rationale}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => copy(idea.name, key)}
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
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(idea.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
                        title="Search YouTube to check if this name is taken"
                      >
                        Check
                        <ExternalLink className="h-2.5 w-2.5" strokeWidth={2} />
                      </a>
                    </div>
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
