"use client";

import { useEffect, useState } from "react";
import {
  Compass,
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Sparkles,
  Eye,
  Calendar,
} from "lucide-react";
import { track } from "@/lib/analytics/track";
import type {
  PublicNicheCheckResult,
  Verdict,
  EnrichedNicheVideo,
} from "@/lib/youtube/niche-check";

type ApiResponse =
  | { result: PublicNicheCheckResult; cached?: boolean; remaining?: number }
  | { error: string; code?: string };

const VERDICT_STYLES: Record<
  Verdict,
  { ring: string; text: string; bg: string; label: string }
> = {
  ENTER_NOW:        { ring: "ring-brand-400", text: "text-brand-700",  bg: "bg-brand-50",    label: "ENTER NOW" },
  NICHE_GAP:        { ring: "ring-brand-300", text: "text-brand-700",  bg: "bg-brand-50/80", label: "NICHE GAP" },
  HIGH_COMPETITION: { ring: "ring-amber-300", text: "text-amber-700",  bg: "bg-amber-50",    label: "HIGH COMPETITION" },
  OVERSATURATED:    { ring: "ring-orange-300",text: "text-orange-700", bg: "bg-orange-50",   label: "OVERSATURATED" },
  WEAK_DEMAND:      { ring: "ring-red-300",   text: "text-red-700",    bg: "bg-red-50",      label: "WEAK DEMAND" },
  NEUTRAL:          { ring: "ring-gray-300",  text: "text-gray-700",   bg: "bg-gray-50",     label: "NEUTRAL" },
};

const SAMPLES = [
  { label: "AI coding tools", value: "ai coding tools" },
  { label: "Home automation", value: "home automation" },
  { label: "Productivity apps 2026", value: "productivity apps 2026" },
];

export function NicheCheckTool() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicNicheCheckResult | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function run(target: string) {
    if (!target.trim() || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/youtube-niche-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: target.trim() }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Niche check failed.");
        return;
      }
      setResult(data.result);
      setRemaining(typeof data.remaining === "number" ? data.remaining : null);
      track("tool_used", {
        slug: "youtube-niche-check",
        cached: !!data.cached,
        verdict: data.result.verdict,
      });
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const seed = params.get("q") || params.get("query");
    if (seed && seed.trim()) setQuery(seed.trim());
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(query);
        }}
      >
        <label htmlFor="niche-input" className="block text-sm font-medium text-gray-700">
          Topic or keyword
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input
            id="niche-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. ai coding tools 2026"
            maxLength={100}
            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Analyzing
              </>
            ) : (
              <>
                <Compass className="h-4 w-4" strokeWidth={2} />
                Check this niche
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Returns a verdict (ENTER NOW / NICHE GAP / HIGH COMPETITION / OVERSATURATED / WEAK DEMAND / NEUTRAL) based on the top 20 videos for your query.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">Try a sample:</span>
          {SAMPLES.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setQuery(s.value)}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition"
            >
              {s.label}
            </button>
          ))}
          <p className="ml-auto text-xs text-gray-400">
            5 per IP per day.
            {remaining !== null && <span className="ml-1">({remaining} left today)</span>}
          </p>
        </div>
      </form>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {result && <Results result={result} />}
    </div>
  );
}

function Results({ result }: { result: PublicNicheCheckResult }) {
  const vs = VERDICT_STYLES[result.verdict];

  return (
    <div className="mt-8 space-y-8">
      {/* Verdict hero — categorical label + editorial headline, no numeric score */}
      <div className={`rounded-2xl border ${vs.ring.replace("ring-", "border-")} ${vs.bg} p-6 sm:p-8`}>
        <div className="flex flex-col items-start gap-2">
          <p className={`text-xs font-semibold uppercase tracking-wider ${vs.text}`}>
            Verdict
          </p>
          <h2 className={`text-2xl font-bold tracking-tight ${vs.text} sm:text-3xl`}>
            {vs.label}
          </h2>
          <p className="mt-1 text-base font-semibold text-gray-900">
            {result.headline}
          </p>
          <p className="mt-1 text-sm text-gray-700 leading-relaxed">
            {result.explanation}
          </p>
        </div>
      </div>

      {/* Signal grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Signal
          label="Median views"
          value={formatNumber(result.signals.medianViews)}
          hint="Across top 20 results"
        />
        <Signal
          label="Big channel share"
          value={`${Math.round(result.signals.bigChannelShare * 100)}% of top 20`}
          hint="Results from channels above 50K subscribers"
        />
        <Signal
          label="Fresh videos"
          value={`${result.signals.freshCount}`}
          hint={`Of the last ${result.windowSize} results, published in the past 30 days`}
        />
        <Signal
          label="Small-channel outliers"
          value={`${result.signals.outlierCount}`}
          hint="Channels under 50K subscribers whose views far exceed their subscriber count"
          emphasis={result.signals.outlierCount >= 2}
        />
      </div>

      {/* Trend direction */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <TrendIcon direction={result.signals.trendDirection} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Topic direction
          </p>
          <p className="mt-0.5 text-sm font-medium text-gray-900">
            {trendLabel(result.signals.trendDirection)}
          </p>
        </div>
      </div>

      {/* Evidence list */}
      {result.evidence.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Top {result.evidence.length} videos — evidence behind the verdict
          </p>
          <div className="mt-3 space-y-2">
            {result.evidence.map((v) => (
              <EvidenceRow key={v.videoId} video={v} />
            ))}
          </div>
        </div>
      )}

      {/* Related keywords */}
      {result.relatedKeywords.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-600" strokeWidth={2} />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Related searches — from YouTube autocomplete
            </p>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            What people actually type when looking around this topic. Tighter angles often outscore the seed.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.relatedKeywords.map((kw, i) => (
              <a
                key={i}
                href={`/tools/youtube-niche-check?q=${encodeURIComponent(kw)}`}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition"
              >
                {kw}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Signal({
  label,
  value,
  hint,
  emphasis = false,
}: {
  label: string;
  value: string;
  hint: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        emphasis ? "border-brand-300 bg-brand-50/40" : "border-gray-200 bg-white"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-xl font-semibold tabular-nums ${
          emphasis ? "text-brand-700" : "text-gray-900"
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-gray-500">{hint}</p>
    </div>
  );
}

function EvidenceRow({ video }: { video: EnrichedNicheVideo }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 transition hover:border-brand-300 hover:shadow-sm"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <h3 className="flex-1 text-sm font-semibold text-gray-900 leading-snug group-hover:text-brand-700 transition">
            {video.title}
          </h3>
          {video.isOutlier && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-200">
              Outlier
            </span>
          )}
          {video.isBigChannel && !video.isOutlier && (
            <span className="inline-flex shrink-0 items-center rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
              Big channel
            </span>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-gray-600">
          <span>{video.channelTitle}</span>
          {video.channelSubs !== null && (
            <span className="font-mono tabular-nums">
              {formatNumber(video.channelSubs)} subscribers
            </span>
          )}
          {video.viewCount !== null && (
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3 text-gray-400" strokeWidth={2} aria-hidden="true" />
              <span className="font-mono tabular-nums">{formatNumber(video.viewCount)}</span>
              <span>views</span>
            </span>
          )}
          {video.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" strokeWidth={2} aria-hidden="true" />
              Published {video.publishedAt.slice(0, 10)}
            </span>
          )}
        </div>
      </div>
      <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-400 group-hover:text-brand-700" strokeWidth={2} />
    </a>
  );
}

function TrendIcon({ direction }: { direction: "rising" | "flat" | "declining" | "unknown" }) {
  if (direction === "rising")
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <TrendingUp className="h-4 w-4" strokeWidth={2.5} />
      </div>
    );
  if (direction === "declining")
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-700">
        <TrendingDown className="h-4 w-4" strokeWidth={2.5} />
      </div>
    );
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600">
      <Minus className="h-4 w-4" strokeWidth={2.5} />
    </div>
  );
}

function trendLabel(direction: "rising" | "flat" | "declining" | "unknown"): string {
  switch (direction) {
    case "rising":
      return "Rising — recent videos in the top window are pulling more views than older ones.";
    case "declining":
      return "Declining — recent videos are getting fewer views than older top performers.";
    case "flat":
      return "Flat — the topic is consistent but not heating up or cooling down.";
    case "unknown":
      return "Unknown — not enough publication-date variance in the top window to infer.";
  }
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}
