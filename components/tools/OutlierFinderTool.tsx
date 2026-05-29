"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Loader2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Flame,
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Info,
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { track } from "@/lib/analytics/track";
import type { OutlierAnalysis, OutlierVideo } from "@/lib/youtube/outlier-analysis";
import type { TitleScoreBand } from "@/lib/youtube/title-score";

type ApiResponse =
  | { output: OutlierAnalysis; cached?: boolean; remaining?: number }
  | { error: string; code?: string };

const BAND_STYLES: Record<TitleScoreBand, { ring: string; text: string; label: string }> = {
  strong: { ring: "ring-brand-300", text: "text-brand-700", label: "Strong" },
  good:   { ring: "ring-brand-200", text: "text-brand-600", label: "Good" },
  fair:   { ring: "ring-amber-300", text: "text-amber-700", label: "Fair" },
  weak:   { ring: "ring-red-300",   text: "text-red-700",   label: "Weak" },
};

const SAMPLES = [
  { label: "Veritasium", value: "@veritasium" },
  { label: "Tom Scott", value: "@TomScottGo" },
  { label: "Marques B.", value: "@mkbhd" },
];

export function OutlierFinderTool() {
  const [channel, setChannel] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OutlierAnalysis | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function runAnalysis(targetChannel: string) {
    if (!targetChannel.trim() || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/youtube-outlier-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          input: { channel: targetChannel.trim() },
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Analysis failed.");
        return;
      }
      setResult(data.output);
      setRemaining(typeof data.remaining === "number" ? data.remaining : null);
      track("tool_used", {
        slug: "youtube-outlier-finder",
        cached: !!data.cached,
        outliers: data.output.outliers.length,
        mega_outliers: data.output.megaOutliers.length,
        patterns: data.output.patterns.length,
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
          runAnalysis(channel);
        }}
      >
        <label htmlFor="outlier-channel-input" className="block text-sm font-medium text-gray-700">
          Channel handle, URL, or ID
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input
            id="outlier-channel-input"
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            placeholder="@veritasium, youtube.com/@veritasium, or UCHnyfMqiRRG1u-2MsSQLbXA"
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
                Analyzing
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" strokeWidth={2} />
                Find outliers
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Analyzes the channel&apos;s last 100 uploads. An outlier = video with ≥3× the channel&apos;s median view count.
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
            5 analyses per day per IP.
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

      {result && <OutlierResults result={result} />}
    </div>
  );
}

function OutlierResults({ result }: { result: OutlierAnalysis }) {
  const { channel, outliers, megaOutliers, patterns, analysisFailed, windowSize, medianViews, meanViews } = result;

  return (
    <div className="mt-8 space-y-8">
      {/* Channel header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:p-5">
        {channel.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={channel.thumbnailUrl}
            alt={channel.title}
            className="h-16 w-16 rounded-full object-cover ring-1 ring-gray-200"
          />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-gray-900">{channel.title}</h2>
          {channel.handle && (
            <p className="text-sm text-gray-500">@{channel.handle.replace(/^@/, "")}</p>
          )}
        </div>
        <a
          href={`https://www.youtube.com/channel/${channel.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"
        >
          <ExternalLink className="h-3 w-3" strokeWidth={2} />
          Open on YouTube
        </a>
      </div>

      {/* Stat row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Window analyzed" value={`${windowSize} videos`} hint="Most recent uploads" />
        <Stat label="Median views" value={formatNumber(medianViews)} hint="Robust to viral spikes" emphasis />
        <Stat label="Mean views" value={formatNumber(meanViews)} hint="Pulled up by big hits" />
        <Stat
          label="Outliers (≥3×)"
          value={`${outliers.length}`}
          hint={megaOutliers.length > 0 ? `incl. ${megaOutliers.length} mega (≥10×)` : "none ≥10×"}
          emphasis
        />
      </div>

      {/* No outliers state */}
      {outliers.length === 0 && (
        <div className="flex items-start gap-2 rounded-md border border-gray-200 bg-gray-50/40 p-4">
          <Info className="h-4 w-4 shrink-0 text-gray-500 mt-0.5" strokeWidth={2} />
          <div className="text-sm text-gray-700">
            <p className="font-medium">No significant outliers in the last {windowSize} uploads</p>
            <p className="mt-1 text-gray-600">
              This channel has consistent performance — every video performs within 3× of the median.
              That&apos;s often a sign of a tight, focused audience who watches everything (good!) but also
              means there&apos;s no clear &quot;winning formula&quot; from the data alone. Try a channel with more
              variance.
            </p>
          </div>
        </div>
      )}

      {/* LLM patterns callout */}
      {patterns.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-white p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600" strokeWidth={2.5} />
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              What makes them outliers
            </p>
          </div>
          <p className="mt-1 text-[11px] text-gray-500">
            Patterns present in outliers AND absent from average-performing videos on the same channel.
          </p>
          <ol className="mt-3 space-y-3">
            {patterns.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-800">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {analysisFailed && (
        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-amber-900">
            AI pattern analysis couldn&apos;t be generated this time — the outlier list below is complete.
            Try the analysis again to retry the AI step.
          </p>
        </div>
      )}

      {/* Outlier list */}
      {outliers.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Top {outliers.length} outlier{outliers.length === 1 ? "" : "s"} by multiplier
          </p>
          <div className="mt-3 space-y-3">
            {outliers.map((v, i) => (
              <OutlierRow key={v.videoId} video={v} rank={i + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
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
        emphasis ? "border-amber-200 bg-amber-50/40" : "border-gray-200 bg-white"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p className={`mt-1 font-mono text-xl font-semibold tabular-nums ${emphasis ? "text-amber-700" : "text-gray-900"}`}>
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-gray-500">{hint}</p>
    </div>
  );
}

function OutlierRow({ video, rank }: { video: OutlierVideo; rank: number }) {
  const bs = BAND_STYLES[video.titleScore.band];
  const isMega = video.multiplier >= 10;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:flex-row sm:p-4">
      <span className="font-mono text-xs tabular-nums text-gray-400 sm:mt-1">
        {String(rank).padStart(2, "0")}
      </span>

      {video.thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full max-w-[180px] rounded-md object-cover ring-1 ring-gray-200 sm:max-w-[160px]"
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <h3 className="flex-1 text-sm font-semibold text-gray-900 leading-snug">{video.title}</h3>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
              isMega
                ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
            }`}
          >
            {isMega && <Flame className="h-3 w-3" strokeWidth={2.5} />}
            {video.multiplier.toFixed(1)}× median
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3 text-gray-400" strokeWidth={2} />
            <span className="font-mono tabular-nums">{formatNumber(video.viewCount)}</span>
          </span>
          {video.likeCount !== null && (
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="h-3 w-3 text-gray-400" strokeWidth={2} />
              <span className="font-mono tabular-nums">{formatNumber(video.likeCount)}</span>
            </span>
          )}
          {video.commentCount !== null && (
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3 w-3 text-gray-400" strokeWidth={2} />
              <span className="font-mono tabular-nums">{formatNumber(video.commentCount)}</span>
            </span>
          )}
          {video.publishDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" strokeWidth={2} />
              {video.publishDate}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2">
            <span
              className={`flex h-7 w-9 items-center justify-center rounded-md ring-1 bg-white font-mono text-xs font-semibold ${bs.text} ${bs.ring}`}
            >
              {video.titleScore.score}
            </span>
            <span className={`text-xs font-medium ${bs.text}`}>{bs.label} title</span>
          </div>
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-brand-700"
          >
            <ExternalLink className="h-3 w-3" strokeWidth={2} />
            Open
          </a>
        </div>
      </div>
    </div>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}
