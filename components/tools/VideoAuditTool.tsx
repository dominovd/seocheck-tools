"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Loader2,
  AlertCircle,
  Check,
  AlertTriangle,
  X,
  Info,
  ArrowRight,
  Play,
  type LucideIcon,
} from "lucide-react";
import type {
  VideoAuditResult,
  AuditDimension,
  AuditBand,
} from "@/lib/youtube/video-audit";
import type { Signal, SignalKind } from "@/lib/youtube/title-score";
import { track } from "@/lib/analytics/track";

const SIGNAL_ICON: Record<SignalKind, LucideIcon> = {
  good: Check,
  warn: AlertTriangle,
  bad: X,
  info: Info,
};

const SIGNAL_STYLES: Record<SignalKind, string> = {
  good: "text-brand-700 bg-brand-50 ring-brand-100",
  warn: "text-amber-700 bg-amber-50 ring-amber-100",
  bad: "text-red-700 bg-red-50 ring-red-100",
  info: "text-gray-600 bg-gray-50 ring-gray-100",
};

const BAND_STYLES: Record<AuditBand, { ring: string; text: string; bg: string; label: string }> = {
  strong: { ring: "ring-brand-300", text: "text-brand-700", bg: "bg-brand-50", label: "Strong" },
  good:   { ring: "ring-brand-200", text: "text-brand-600", bg: "bg-brand-50/60", label: "Good" },
  fair:   { ring: "ring-amber-300", text: "text-amber-700", bg: "bg-amber-50", label: "Fair" },
  weak:   { ring: "ring-red-300",   text: "text-red-700",   bg: "bg-red-50",   label: "Weak" },
};

type AuditMode = "full" | "noTags" | "partial";

type ApiResponse =
  | { result: VideoAuditResult; cached?: boolean; mode?: AuditMode; remaining?: number }
  | { error: string; code?: string };

export function VideoAuditTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoAuditResult | null>(null);
  const [mode, setMode] = useState<AuditMode>("full");

  const runAudit = useCallback(async (targetUrl: string) => {
    if (!targetUrl.trim() || loading) return;
    setError(null);
    setResult(null);
    setMode("full");
    setLoading(true);
    try {
      const res = await fetch("/api/youtube-video-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Audit failed.");
        return;
      }
      setResult(data.result);
      setMode(data.mode ?? "full");
      track("tool_used", {
        slug: "youtube-video-audit",
        mode: data.mode ?? "full",
        overall_score: data.result.overallScore,
      });
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Auto-run when arriving with ?url= param (from homepage hero)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const seed = params.get("url");
    if (seed && seed.trim()) {
      setUrl(seed.trim());
      runAudit(seed.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runAudit(url);
        }}
      >
        <label htmlFor="audit-url" className="block text-sm font-medium text-gray-700">
          YouTube video URL
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input
            id="audit-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={!url.trim() || loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Auditing
              </>
            ) : (
              <>
                <ClipboardCheck className="h-4 w-4" strokeWidth={2} />
                Audit this video
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Works with /watch?v=, /shorts/, youtu.be, and copied-from-app links.
        </p>
      </form>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {result && <AuditResults result={result} mode={mode} />}
    </div>
  );
}

function AuditResults({ result, mode }: { result: VideoAuditResult; mode: AuditMode }) {
  const bs = BAND_STYLES[result.overallBand];

  return (
    <div className="mt-8">
      {/* Video header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:p-5">
        {result.meta.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.meta.thumbnailUrl}
            alt={result.meta.title ?? "Video thumbnail"}
            className="w-full max-w-[240px] rounded-md object-cover ring-1 ring-gray-200"
          />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-gray-900 leading-snug">
            {result.meta.title ?? "Untitled video"}
          </h2>
          {result.meta.channel && (
            <p className="mt-1 text-sm text-gray-600">{result.meta.channel}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
            {result.meta.viewCount !== null && (
              <span>
                <span className="font-mono tabular-nums text-gray-700">
                  {formatNumber(result.meta.viewCount)}
                </span>{" "}
                views
              </span>
            )}
            {result.meta.publishDate && (
              <span>Published {result.meta.publishDate}</span>
            )}
            {result.meta.lengthSeconds !== null && (
              <span>{formatDuration(result.meta.lengthSeconds)}</span>
            )}
          </div>
          <a
            href={result.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track("external_link_clicked", {
                destination: "youtube",
                slug: "youtube-video-audit",
                location: "audit_result_header",
              })
            }
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"
          >
            <Play className="h-3 w-3" strokeWidth={2.5} />
            Open on YouTube
          </a>
        </div>
      </div>

      {/* Overall score */}
      <div className={`mt-6 rounded-2xl border ${bs.ring.replace("ring-", "border-")} ${bs.bg} p-5 sm:p-6`}>
        <div className="flex items-center gap-5">
          <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ring-4 bg-white ${bs.ring}`}>
            <span className={`font-mono text-2xl font-semibold tabular-nums ${bs.text}`}>
              {result.overallScore}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Overall audit score
            </p>
            <p className={`mt-1 text-xl font-semibold ${bs.text}`}>{bs.label}</p>
            <p className="mt-1 text-sm text-gray-600">
              Weighted across {result.dimensions.length} dimensions. Click any card below to see what to fix.
            </p>
          </div>
        </div>
      </div>

      {/* noTags banner — API rescue path, everything except tags scored */}
      {mode === "noTags" && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" strokeWidth={2} />
          <div className="text-sm text-amber-900">
            <p className="font-medium">Tags couldn&apos;t be loaded for this video</p>
            <p className="mt-1 text-amber-800/80">
              YouTube hides tags from public lookups for non-owners, and the
              public watch page couldn&apos;t be reached for this video right now —
              everything else was scored as normal. Try again in a minute if you
              need the tags dimension.
            </p>
          </div>
        </div>
      )}

      {/* Partial-audit banner — only oEmbed worked, only title scored */}
      {mode === "partial" && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" strokeWidth={2} />
          <div className="text-sm text-amber-900">
            <p className="font-medium">Partial audit — try again in a minute</p>
            <p className="mt-1 text-amber-800/80">
              YouTube is temporarily rate-limiting our servers for this video, so
              only the title could be scored from public oEmbed data. Tags,
              description, hashtags, and chapters need direct access to the watch
              page — try the audit again shortly.
            </p>
          </div>
        </div>
      )}

      {/* Dimension cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {result.dimensions.map((d) => (
          <DimensionCard key={d.key} dimension={d} />
        ))}
      </div>
    </div>
  );
}

function DimensionCard({ dimension }: { dimension: AuditDimension }) {
  const bs = BAND_STYLES[dimension.band];
  const showCta = dimension.band === "weak" || dimension.band === "fair";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-2 bg-white ${bs.ring}`}>
          <span className={`font-mono text-base font-semibold tabular-nums ${bs.text}`}>
            {dimension.score}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">{dimension.label}</p>
          <p className={`text-xs font-medium ${bs.text}`}>{bs.label}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {dimension.signals.map((sig, i) => (
          <SignalRow key={i} signal={sig} />
        ))}
      </ul>

      {showCta && (
        <Link
          href={`/tools/${dimension.ctaTool.slug}`}
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-brand-200 bg-brand-50/60 px-3 py-2 text-xs font-medium text-brand-700 hover:border-brand-300 hover:bg-brand-50 transition"
        >
          {dimension.ctaTool.label}
          <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
        </Link>
      )}
    </div>
  );
}

function SignalRow({ signal }: { signal: Signal }) {
  const Icon = SIGNAL_ICON[signal.kind];
  const cls = SIGNAL_STYLES[signal.kind];
  return (
    <li className="flex items-start gap-2">
      <span className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-1 ${cls}`}>
        <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
      </span>
      <span className="text-xs text-gray-700 leading-relaxed">{signal.message}</span>
    </li>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
