"use client";

import { useEffect, useState } from "react";
import {
  Gauge,
  Loader2,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { track } from "@/lib/analytics/track";
import type { VisibilityScoreResult, VisibilityGrade } from "@/lib/youtube/visibility-score";

type ApiResponse =
  | { output: VisibilityScoreResult; cached?: boolean; remaining?: number }
  | { error: string; code?: string };

const GRADE_STYLES: Record<VisibilityGrade, { ring: string; text: string; bg: string }> = {
  A: { ring: "ring-brand-400", text: "text-brand-700", bg: "bg-brand-50" },
  B: { ring: "ring-brand-300", text: "text-brand-700", bg: "bg-brand-50/70" },
  C: { ring: "ring-amber-300", text: "text-amber-700", bg: "bg-amber-50" },
  D: { ring: "ring-orange-300", text: "text-orange-700", bg: "bg-orange-50" },
  F: { ring: "ring-red-300", text: "text-red-700", bg: "bg-red-50" },
};

const SAMPLES = [
  { label: "Veritasium", value: "@veritasium" },
  { label: "Linus Tech", value: "@LinusTechTips" },
  { label: "MKBHD", value: "@mkbhd" },
];

export function VisibilityScoreTool() {
  const [channel, setChannel] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VisibilityScoreResult | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function run(target: string) {
    if (!target.trim() || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/youtube-visibility-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          input: { channel: target.trim() },
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Score failed.");
        return;
      }
      setResult(data.output);
      setRemaining(typeof data.remaining === "number" ? data.remaining : null);
      track("tool_used", {
        slug: "youtube-visibility-score",
        cached: !!data.cached,
        score: data.output.overallScore,
        grade: data.output.grade,
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
    const seed = params.get("channel");
    if (seed && seed.trim()) setChannel(seed.trim());
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(channel);
        }}
      >
        <label htmlFor="vs-channel-input" className="block text-sm font-medium text-gray-700">
          Channel handle, URL, or ID
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input
            id="vs-channel-input"
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            placeholder="@your-channel or youtube.com/@your-channel"
            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={!channel.trim() || loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Scoring
              </>
            ) : (
              <>
                <Gauge className="h-4 w-4" strokeWidth={2} />
                Get Visibility Score
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Computes a 0-100 composite score from CTR Potential, Metadata Quality, Niche Headroom, and Growth Trajectory across the channel&apos;s last 30 uploads.
        </p>

        <div className="mt-4">
          <TurnstileWidget onToken={setTurnstileToken} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">Try a sample:</span>
          {SAMPLES.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setChannel(s.value)}
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

function Results({ result }: { result: VisibilityScoreResult }) {
  const gs = GRADE_STYLES[result.grade];

  return (
    <div className="mt-8 space-y-8">
      {/* Channel header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:p-5">
        {result.channel.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.channel.thumbnailUrl}
            alt={result.channel.title}
            className="h-16 w-16 rounded-full object-cover ring-1 ring-gray-200"
          />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-gray-900">{result.channel.title}</h2>
          {result.channel.handle && (
            <p className="text-sm text-gray-500">@{result.channel.handle.replace(/^@/, "")}</p>
          )}
        </div>
        <a
          href={`https://www.youtube.com/channel/${result.channel.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"
        >
          <ExternalLink className="h-3 w-3" strokeWidth={2} />
          Open on YouTube
        </a>
      </div>

      {/* Score hero */}
      <div className={`rounded-2xl border ${gs.ring.replace("ring-", "border-")} ${gs.bg} p-6 sm:p-8`}>
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
          <div className="flex flex-col items-center gap-1">
            <div className={`flex h-32 w-32 items-center justify-center rounded-full ring-4 bg-white ${gs.ring}`}>
              <span className={`font-mono text-5xl font-semibold ${gs.text}`}>
                {result.overallScore}
              </span>
            </div>
            <p className={`mt-2 text-lg font-semibold ${gs.text}`}>
              Grade {result.grade}
            </p>
          </div>
          <div className="mt-4 flex-1 sm:mt-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              YouTube Visibility Score
            </p>
            <p className="mt-2 text-base text-gray-800">
              {result.summary ? (
                <>
                  <Sparkles className="mr-1 inline h-4 w-4 text-brand-600" strokeWidth={2.5} />
                  {result.summary}
                </>
              ) : (
                <>
                  Composite metric across CTR Potential, Metadata Quality,
                  Niche Headroom, and Growth Trajectory — averaged across the
                  last {result.windowSize} uploads.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-score grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {result.subscores.map((sub) => (
          <SubScoreCard
            key={sub.key}
            label={sub.label}
            score={sub.score}
            evidence={sub.evidence}
          />
        ))}
      </div>
    </div>
  );
}

function SubScoreCard({
  label,
  score,
  evidence,
}: {
  label: string;
  score: number;
  evidence: string;
}) {
  const bandColor =
    score >= 80 ? "text-brand-700" : score >= 60 ? "text-brand-600" : score >= 40 ? "text-amber-700" : "text-red-700";
  const barColor =
    score >= 80 ? "bg-brand-500" : score >= 60 ? "bg-brand-400" : score >= 40 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className={`font-mono text-2xl font-semibold tabular-nums ${bandColor}`}>{score}</p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div className={barColor} style={{ width: `${score}%`, height: "100%" }} />
      </div>
      <p className="mt-2 text-xs text-gray-500 leading-relaxed">{evidence}</p>
    </div>
  );
}
