"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Loader2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Eye,
  Calendar,
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { track } from "@/lib/analytics/track";
import type {
  ChannelAuditResult,
  ChannelAuditVideo,
  DimensionStats,
  ChannelGrade,
} from "@/lib/youtube/channel-audit";
import { GRADE_DESCRIPTION } from "@/lib/youtube/channel-audit";
import type { AuditBand } from "@/lib/youtube/video-audit";

type ApiResponse =
  | { output: ChannelAuditResult; cached?: boolean; remaining?: number }
  | { error: string; code?: string };

const GRADE_STYLES: Record<ChannelGrade, { ring: string; text: string; bg: string }> = {
  A: { ring: "ring-brand-400", text: "text-brand-700", bg: "bg-brand-50" },
  B: { ring: "ring-brand-300", text: "text-brand-700", bg: "bg-brand-50/70" },
  C: { ring: "ring-amber-300", text: "text-amber-700", bg: "bg-amber-50" },
  D: { ring: "ring-orange-300", text: "text-orange-700", bg: "bg-orange-50" },
  F: { ring: "ring-red-300", text: "text-red-700", bg: "bg-red-50" },
};

const BAND_COLOR: Record<AuditBand, string> = {
  strong: "bg-brand-500",
  good: "bg-brand-300",
  fair: "bg-amber-400",
  weak: "bg-red-400",
};

const BAND_LABEL: Record<AuditBand, string> = {
  strong: "Strong",
  good: "Good",
  fair: "Fair",
  weak: "Weak",
};

const SAMPLES = [
  { label: "Veritasium", value: "@veritasium" },
  { label: "Linus Tech", value: "@LinusTechTips" },
  { label: "Tom Scott", value: "@TomScottGo" },
];

export function ChannelAuditTool() {
  const [channel, setChannel] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ChannelAuditResult | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function runAudit(target: string) {
    if (!target.trim() || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/youtube-channel-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          input: { channel: target.trim() },
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Audit failed.");
        return;
      }
      setResult(data.output);
      setRemaining(typeof data.remaining === "number" ? data.remaining : null);
      track("tool_used", {
        slug: "youtube-channel-audit",
        cached: !!data.cached,
        grade: data.output.grade,
        avg_score: data.output.averageScore,
        videos: data.output.videoCount,
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
          runAudit(channel);
        }}
      >
        <label htmlFor="channel-audit-input" className="block text-sm font-medium text-gray-700">
          Channel handle, URL, or ID
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input
            id="channel-audit-input"
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
                Auditing
              </>
            ) : (
              <>
                <ClipboardList className="h-4 w-4" strokeWidth={2} />
                Audit channel
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Audits the channel&apos;s last 10 public uploads across title, description, hashtags, and chapters.
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
            5 audits per day per IP.
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

      {result && <AuditResults result={result} />}
    </div>
  );
}

function AuditResults({ result }: { result: ChannelAuditResult }) {
  const { channel, videoCount, averageScore, grade, dimensions, videos, recurringIssues, analysisFailed } = result;
  const gs = GRADE_STYLES[grade];

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

      {/* Grade hero */}
      <div className={`rounded-2xl border ${gs.ring.replace("ring-", "border-")} ${gs.bg} p-5 sm:p-6`}>
        <div className="flex items-center gap-5">
          <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full ring-4 bg-white ${gs.ring}`}>
            <span className={`font-mono text-4xl font-semibold ${gs.text}`}>{grade}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Channel-level packaging grade
            </p>
            <p className={`mt-1 text-xl font-semibold ${gs.text}`}>
              Average overall score: {averageScore}
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Averaged across {videoCount} most recent uploads. {GRADE_DESCRIPTION[grade]}
            </p>
          </div>
        </div>
      </div>

      {/* LLM recurring issues */}
      {recurringIssues.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-white p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600" strokeWidth={2.5} />
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Top recurring issues
            </p>
          </div>
          <p className="mt-1 text-[11px] text-gray-500">
            Patterns of weakness AI identified across multiple videos. Fix these for the biggest impact.
          </p>
          <ol className="mt-3 space-y-3">
            {recurringIssues.map((p, i) => (
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
            AI recurring-issue analysis couldn&apos;t be generated this time — the per-dimension breakdown
            and video list below are still complete.
          </p>
        </div>
      )}

      {/* Dimension breakdown */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Per-dimension breakdown across {videoCount} videos
        </p>
        <div className="mt-3 space-y-3">
          {dimensions.map((d) => (
            <DimensionRow key={d.key} dimension={d} totalVideos={videoCount} />
          ))}
        </div>
      </div>

      {/* Audited videos */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Audited videos ({videoCount} most recent)
        </p>
        <div className="mt-3 space-y-3">
          {videos.map((v, i) => (
            <AuditedVideoRow key={v.videoId} video={v} rank={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DimensionRow({ dimension, totalVideos }: { dimension: DimensionStats; totalVideos: number }) {
  const { label, averageScore, bandCounts, isWorst } = dimension;
  // Build percentage widths for stacked bar
  const total = totalVideos > 0 ? totalVideos : 1;
  const segments: { band: AuditBand; pct: number }[] = (["strong", "good", "fair", "weak"] as AuditBand[])
    .map((band) => ({ band, pct: (bandCounts[band] / total) * 100 }))
    .filter((s) => s.pct > 0);

  return (
    <div className={`rounded-xl border bg-white p-4 ${isWorst ? "border-amber-300" : "border-gray-200"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
          {isWorst && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
              Worst dimension
            </span>
          )}
        </div>
        <p className="font-mono text-sm font-semibold tabular-nums text-gray-800">
          {averageScore}
          <span className="ml-1 text-xs font-normal text-gray-400">avg</span>
        </p>
      </div>

      {/* Stacked band bar */}
      <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-gray-100">
        {segments.map(({ band, pct }) => (
          <div
            key={band}
            className={BAND_COLOR[band]}
            style={{ width: `${pct}%` }}
            title={`${BAND_LABEL[band]}: ${bandCounts[band]} of ${totalVideos}`}
          />
        ))}
      </div>

      {/* Band counts */}
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-gray-600">
        {(["strong", "good", "fair", "weak"] as AuditBand[]).map((band) => (
          <span key={band} className="inline-flex items-center gap-1">
            <span className={`inline-block h-2 w-2 rounded-sm ${BAND_COLOR[band]}`} />
            {BAND_LABEL[band]}: {bandCounts[band]}
          </span>
        ))}
      </div>
    </div>
  );
}

function AuditedVideoRow({ video, rank }: { video: ChannelAuditVideo; rank: number }) {
  const grade = computeQuickGrade(video.audit.overallScore);
  return (
    <a
      href={video.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-brand-300 hover:shadow-sm sm:flex-row sm:p-4"
    >
      <span className="font-mono text-xs tabular-nums text-gray-400 sm:mt-1">
        {String(rank).padStart(2, "0")}
      </span>

      {video.thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full max-w-[160px] rounded-md object-cover ring-1 ring-gray-200"
        />
      )}

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-brand-700 transition">
          {video.title}
        </h3>

        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
          {video.viewCount !== null && (
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3 text-gray-400" strokeWidth={2} />
              <span className="font-mono tabular-nums">{formatNumber(video.viewCount)}</span>
            </span>
          )}
          {video.publishDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" strokeWidth={2} />
              {video.publishDate}
            </span>
          )}
        </div>

        {/* Per-dimension scores */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {video.audit.dimensions.map((d) => {
            const tone =
              d.band === "strong" || d.band === "good"
                ? "bg-brand-50 text-brand-700 ring-brand-200"
                : d.band === "fair"
                ? "bg-amber-50 text-amber-700 ring-amber-200"
                : "bg-red-50 text-red-700 ring-red-200";
            return (
              <span
                key={d.key}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-mono font-semibold ring-1 ${tone}`}
                title={`${d.label}: ${d.score} (${d.band})`}
              >
                {d.label.slice(0, 4).toUpperCase()} {d.score}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-center sm:flex-col sm:gap-1">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ring-2 bg-white ${gradeRing(grade)}`}>
          <span className={`font-mono text-lg font-semibold ${gradeText(grade)}`}>
            {video.audit.overallScore}
          </span>
        </div>
      </div>
    </a>
  );
}

function computeQuickGrade(score: number): ChannelGrade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

function gradeRing(g: ChannelGrade): string {
  return GRADE_STYLES[g].ring;
}
function gradeText(g: ChannelGrade): string {
  return GRADE_STYLES[g].text;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}
