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
  Sparkles,
  Copy,
  type LucideIcon,
} from "lucide-react";
import type {
  PublicVideoAuditResult,
  PublicAuditDimension,
} from "@/lib/youtube/video-audit";
import type { Signal, SignalKind } from "@/lib/youtube/title-score";
import { track } from "@/lib/analytics/track";
import type { FixPackage } from "@/app/api/youtube-audit-fix/route";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { DerivedMetricsNotice } from "@/components/DerivedMetricsNotice";

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

type AuditMode = "full" | "noTags" | "partial";

type ApiResponse =
  | { result: PublicVideoAuditResult; cached?: boolean; mode?: AuditMode; remaining?: number }
  | { error: string; code?: string };

/** A dimension has "issues" if it contains any bad or warn signals. */
function hasIssues(d: PublicAuditDimension): boolean {
  return d.signals.some((s) => s.kind === "bad" || s.kind === "warn");
}

/** Count of bad + warn signals across all dimensions. Used for header summary. */
function countIssues(result: PublicVideoAuditResult): number {
  let n = 0;
  for (const d of result.dimensions) {
    for (const s of d.signals) if (s.kind === "bad" || s.kind === "warn") n += 1;
  }
  return n;
}

export function VideoAuditTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicVideoAuditResult | null>(null);
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
        issue_count: countIssues(data.result),
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

type FixApiResponse =
  | { output: FixPackage; cached?: boolean; remaining?: number }
  | { error: string; code?: string };

function AuditResults({ result, mode }: { result: PublicVideoAuditResult; mode: AuditMode }) {
  const dimensionsWithIssues = result.dimensions.filter(hasIssues);
  const totalIssues = countIssues(result);

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
            rel="nofollow noopener"
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

      {/* Issues summary — replaces the removed composite score card */}
      <div
        className={`mt-6 rounded-2xl border p-5 sm:p-6 ${
          totalIssues === 0
            ? "border-brand-200 bg-brand-50/60"
            : "border-amber-200 bg-amber-50/60"
        }`}
      >
        <div className="flex items-start gap-4">
          <span
            className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
              totalIssues === 0 ? "bg-brand-500 text-white" : "bg-amber-500 text-white"
            }`}
          >
            {totalIssues === 0 ? (
              <Check className="h-5 w-5" strokeWidth={2.5} />
            ) : (
              <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Audit summary
            </p>
            <p
              className={`mt-1 text-lg font-semibold ${
                totalIssues === 0 ? "text-brand-700" : "text-amber-800"
              }`}
            >
              {totalIssues === 0
                ? "No issues flagged"
                : `${totalIssues} ${
                    totalIssues === 1 ? "issue" : "issues"
                  } flagged across ${dimensionsWithIssues.length} ${
                    dimensionsWithIssues.length === 1 ? "dimension" : "dimensions"
                  }`}
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Editorial checks across the video packaging: title, description,
              hashtags, chapters
              {result.dimensions.some((d) => d.key === "tags") ? ", tags" : ""}.
            </p>
          </div>
        </div>
      </div>

      {/* Required disclaimer for every assessment we derive ourselves */}
      <DerivedMetricsNotice className="mt-6" />

      {/* noTags banner — API rescue path */}
      {mode === "noTags" && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" strokeWidth={2} />
          <div className="text-sm text-amber-900">
            <p className="font-medium">Tags couldn&apos;t be loaded for this video</p>
            <p className="mt-1 text-amber-800/80">
              YouTube hides tags from public lookups for non-owners, and the
              public watch page couldn&apos;t be reached for this video right now —
              everything else was audited as normal. Try again in a minute if you
              need the tags dimension.
            </p>
          </div>
        </div>
      )}

      {/* Partial-audit banner */}
      {mode === "partial" && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" strokeWidth={2} />
          <div className="text-sm text-amber-900">
            <p className="font-medium">Partial audit — try again in a minute</p>
            <p className="mt-1 text-amber-800/80">
              YouTube is temporarily rate-limiting our servers for this video, so
              only the title could be audited from public oEmbed data. Tags,
              description, hashtags, and chapters need direct access to the watch
              page — try the audit again shortly.
            </p>
          </div>
        </div>
      )}

      {/* Fix-with-AI block — only when weaknesses exist */}
      <FixWithAIBlock audit={result} dimensionsWithIssues={dimensionsWithIssues} />

      {/* Dimension cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {result.dimensions.map((d) => (
          <DimensionCard key={d.key} dimension={d} />
        ))}
      </div>
    </div>
  );
}

function FixWithAIBlock({
  audit,
  dimensionsWithIssues,
}: {
  audit: PublicVideoAuditResult;
  dimensionsWithIssues: PublicAuditDimension[];
}) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fix, setFix] = useState<FixPackage | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (dimensionsWithIssues.length === 0) return null;

  async function runFix() {
    if (loading) return;
    setError(null);
    setFix(null);
    setLoading(true);
    try {
      const res = await fetch("/api/youtube-audit-fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          input: { audit },
        }),
      });
      const data = (await res.json()) as FixApiResponse;
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Fix failed.");
        return;
      }
      setFix(data.output);
      track("tool_used", {
        slug: "youtube-audit-fix",
        cached: !!data.cached,
        fixed_dimensions: [
          data.output.title ? "title" : "",
          data.output.description ? "description" : "",
          data.output.tags ? "tags" : "",
          data.output.hashtags ? "hashtags" : "",
        ]
          .filter(Boolean)
          .join(","),
      });
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  async function copyValue(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(key);
      setTimeout(() => setCopiedField((k) => (k === key ? null : k)), 1500);
      track("tool_result_copied", { slug: "youtube-audit-fix", field: key });
    } catch {
      // ignore
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/70 via-white to-white p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
          <Sparkles className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
            AI YouTube Coach
          </p>
          <h3 className="mt-0.5 text-base font-semibold text-gray-900 sm:text-lg">
            Fix all {dimensionsWithIssues.length}{" "}
            {dimensionsWithIssues.length === 1 ? "flagged area" : "flagged areas"} with AI
          </h3>
          <p className="mt-0.5 text-sm text-gray-600">
            Claude reads the audit and writes targeted replacements for{" "}
            {dimensionsWithIssues.map((d) => d.label.toLowerCase()).join(", ")} in
            one click — aligned to your title.
          </p>
        </div>
      </div>

      {!fix && (
        <>
          <div className="mt-4">
            <TurnstileWidget onToken={setTurnstileToken} />
          </div>
          <button
            type="button"
            onClick={runFix}
            disabled={loading}
            className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Fixing
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" strokeWidth={2} />
                Fix with AI
              </>
            )}
          </button>
        </>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {fix && (
        <div className="mt-5 space-y-4">
          {fix.notes && (
            <p className="rounded-md bg-brand-50/60 px-3 py-2 text-xs italic text-brand-800">
              {fix.notes}
            </p>
          )}
          {fix.title && (
            <FixField
              label="New title"
              value={fix.title}
              kind="title"
              copied={copiedField === "title"}
              onCopy={() => copyValue("title", fix.title!)}
            />
          )}
          {fix.description && (
            <FixField
              label="New description"
              value={fix.description}
              kind="description"
              copied={copiedField === "description"}
              onCopy={() => copyValue("description", fix.description!)}
            />
          )}
          {fix.tags && fix.tags.length > 0 && (
            <FixField
              label="New tags"
              value={fix.tags.join(", ")}
              kind="tags"
              copied={copiedField === "tags"}
              onCopy={() => copyValue("tags", fix.tags!.join(", "))}
            />
          )}
          {fix.hashtags && fix.hashtags.length > 0 && (
            <FixField
              label="New hashtags"
              value={fix.hashtags.join(" ")}
              kind="hashtags"
              copied={copiedField === "hashtags"}
              onCopy={() => copyValue("hashtags", fix.hashtags!.join(" "))}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FixField({
  label,
  value,
  kind,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  kind: "title" | "description" | "tags" | "hashtags";
  copied: boolean;
  onCopy: () => void;
}) {
  const isLong = kind === "description";
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </p>
        <button
          type="button"
          onClick={onCopy}
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition ${
            copied
              ? "bg-brand-50 text-brand-700"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          {copied ? (
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
      </div>
      <p
        className={`mt-2 whitespace-pre-wrap text-sm text-gray-900 ${
          isLong ? "leading-relaxed" : "leading-snug"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function DimensionCard({ dimension }: { dimension: PublicAuditDimension }) {
  const showCta = hasIssues(dimension);
  const badCount = dimension.signals.filter((s) => s.kind === "bad").length;
  const warnCount = dimension.signals.filter((s) => s.kind === "warn").length;
  const goodCount = dimension.signals.filter((s) => s.kind === "good").length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">{dimension.label}</h3>
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          {badCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-red-700 ring-1 ring-inset ring-red-100">
              <X className="h-3 w-3" strokeWidth={2.5} />
              {badCount}
            </span>
          )}
          {warnCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 ring-1 ring-inset ring-amber-100">
              <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />
              {warnCount}
            </span>
          )}
          {goodCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-brand-700 ring-1 ring-inset ring-brand-100">
              <Check className="h-3 w-3" strokeWidth={2.5} />
              {goodCount}
            </span>
          )}
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
