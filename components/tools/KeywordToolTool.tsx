"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { REGIONS, groupSuggestions } from "@/lib/youtube/keyword-suggest";

type ViewMode = "grouped" | "flat";

export function KeywordToolTool() {
  const [seed, setSeed] = useState("");
  const [regionId, setRegionId] = useState("us");
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState<"base" | "expand" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grouped");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const groups = useMemo(
    () => (suggestions ? groupSuggestions(suggestions) : []),
    [suggestions]
  );

  async function runQuery(expandMode: boolean) {
    if (!seed.trim() || loading) return;
    setError(null);
    setLoading(expandMode ? "expand" : "base");
    if (!expandMode) {
      setSuggestions(null);
      setExpanded(false);
    }
    try {
      const res = await fetch("/api/youtube-keyword-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seed: seed.trim(),
          regionId,
          expand: expandMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Lookup failed.");
        return;
      }
      setSuggestions(data.suggestions as string[]);
      setExpanded(expandMode);
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(null);
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
      {/* ─── Inputs ─── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runQuery(false);
        }}
      >
        <label htmlFor="seed-input" className="block text-sm font-medium text-gray-700">
          Seed keyword
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input
            id="seed-input"
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="e.g. drone review, react tutorial, sourdough"
            autoComplete="off"
            spellCheck={false}
            maxLength={80}
            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={!seed.trim() || loading !== null}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 transition"
          >
            {loading === "base" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Searching
              </>
            ) : (
              <>
                <Search className="h-4 w-4" strokeWidth={2} />
                Find keywords
              </>
            )}
          </button>
        </div>

        {/* Region */}
        <div className="mt-4">
          <label htmlFor="region-select" className="block text-sm font-medium text-gray-700">
            Audience region
          </label>
          <div className="mt-1.5 relative max-w-xs">
            <select
              id="region-select"
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
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

      {/* Results */}
      {suggestions && suggestions.length === 0 && !error && (
        <div className="mt-8 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50/60 p-4">
          <AlertCircle
            className="h-4 w-4 shrink-0 text-amber-500 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-sm text-amber-800">
            No suggestions for &quot;{seed}&quot; in this region. Try a broader
            term or a different region.
          </p>
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {suggestions.length} suggestions for{" "}
                <span className="text-gray-700">&quot;{seed}&quot;</span>
              </p>
              {expanded && (
                <p className="mt-1 text-xs text-brand-700">
                  ✓ Expanded A-Z (26 letter probes)
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5">
                {(["grouped", "flat"] as ViewMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setViewMode(m)}
                    className={`rounded px-3 py-1 text-xs font-medium transition ${
                      viewMode === m
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {m === "grouped" ? "Grouped" : "Flat"}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => copy(suggestions.join("\n"), "all")}
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

          {/* Expand button (only show if not already expanded) */}
          {!expanded && (
            <button
              type="button"
              onClick={() => runQuery(true)}
              disabled={loading !== null}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-brand-200 bg-brand-50/60 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40 transition"
            >
              {loading === "expand" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  Expanding A-Z…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" strokeWidth={2} />
                  Expand to 100+ variants (A-Z)
                </>
              )}
            </button>
          )}

          {/* Results body */}
          <div className="mt-6">
            {viewMode === "grouped" ? (
              <div className="space-y-6">
                {groups.map((group) => (
                  <div key={group.label}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {group.label}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {group.suggestions.length} ·{" "}
                        <span className="font-mono">{group.pattern}</span>
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {group.suggestions.map((s, i) => (
                        <Chip
                          key={`${group.label}-${i}`}
                          text={s}
                          chipKey={`${group.label}-${i}`}
                          copiedKey={copiedKey}
                          onCopy={copy}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s, i) => (
                  <Chip
                    key={`flat-${i}`}
                    text={s}
                    chipKey={`flat-${i}`}
                    copiedKey={copiedKey}
                    onCopy={copy}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type ChipProps = {
  text: string;
  chipKey: string;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
};

function Chip({ text, chipKey, copiedKey, onCopy }: ChipProps) {
  const isCopied = copiedKey === chipKey;
  return (
    <button
      type="button"
      onClick={() => onCopy(text, chipKey)}
      className={`group inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium ring-1 ring-inset transition ${
        isCopied
          ? "bg-brand-500 text-white ring-brand-500"
          : "bg-white text-gray-700 ring-gray-200 hover:ring-brand-300 hover:bg-brand-50/40"
      }`}
    >
      {text}
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
}
