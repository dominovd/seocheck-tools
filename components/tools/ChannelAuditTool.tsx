"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Eye,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
  Gauge,
  Users,
  Film,
  Compass,
  TrendingUp,
  Clock,
  BarChart3,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { track } from "@/lib/analytics/track";
import type {
  ChannelAggregations,
  ChannelAuditResult,
  ChannelAuditVideo,
  DimensionStats,
  IssueSeverity,
  RecurringIssue,
} from "@/lib/youtube/channel-audit";
import type { AuditBand } from "@/lib/youtube/video-audit";

type ApiResponse =
  | { output: ChannelAuditResult; cached?: boolean; remaining?: number }
  | { error: string; code?: string };

const SEVERITY_STYLE: Record<
  IssueSeverity,
  { pillClass: string; pillLabel: string; iconBg: string; iconText: string; Icon: typeof AlertCircle }
> = {
  high: {
    pillClass: "bg-red-50 text-red-700 ring-red-200",
    pillLabel: "High priority",
    iconBg: "bg-red-50",
    iconText: "text-red-600",
    Icon: AlertTriangle,
  },
  medium: {
    pillClass: "bg-amber-50 text-amber-700 ring-amber-200",
    pillLabel: "Medium priority",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    Icon: AlertCircle,
  },
  low: {
    pillClass: "bg-gray-100 text-gray-700 ring-gray-200",
    pillLabel: "Low priority",
    iconBg: "bg-gray-100",
    iconText: "text-gray-600",
    Icon: Info,
  },
  good: {
    pillClass: "bg-brand-50 text-brand-700 ring-brand-200",
    pillLabel: "Keep it up",
    iconBg: "bg-brand-50",
    iconText: "text-brand-600",
    Icon: CheckCircle2,
  },
};

const BAND_COLOR_DIM: Record<AuditBand, string> = {
  strong: "bg-brand-500",
  good: "bg-brand-300",
  fair: "bg-amber-400",
  weak: "bg-red-400",
};

const BAND_LABEL_DIM: Record<AuditBand, string> = {
  strong: "Strong",
  good: "Good",
  fair: "Fair",
  weak: "Weak",
};

const SAMPLES = [
  { label: "Veritasium", value: "@veritasium" },
  { label: "Linus Tech", value: "@LinusTechTips" },
  { label: "MKBHD", value: "@mkbhd" },
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
      const bodyText = await res.text();
      let data: ApiResponse | null = null;
      try {
        data = JSON.parse(bodyText) as ApiResponse;
      } catch {
        setError(
          `Server returned a non-JSON response (HTTP ${res.status}). First 200 chars: ${bodyText.slice(0, 200)}`
        );
        return;
      }
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || `Audit failed (HTTP ${res.status}).`);
        return;
      }
      setResult(data.output);
      setRemaining(typeof data.remaining === "number" ? data.remaining : null);
      track("tool_used", {
        slug: "youtube-channel-audit",
        cached: !!data.cached,
        videos: data.output.windowSize,
      });
    } catch (err) {
      setError(
        `Network error — ${err instanceof Error ? err.message : "try again in a moment."}`
      );
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
        <label
          htmlFor="channel-audit-input"
          className="block text-sm font-medium text-gray-700"
        >
          Analyze any YouTube channel
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input
            id="channel-audit-input"
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            placeholder="https://www.youtube.com/@your-channel"
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
                <Gauge className="h-4 w-4" strokeWidth={2} />
                Analyze
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Pulls the channel&apos;s last 30 public uploads and surfaces the raw
          YouTube metrics plus editorial recommendations for descriptions,
          hashtags, chapters, and titles.
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
  const {
    channel,
    windowSize,
    aggregations,
    dimensions,
    recurringIssues,
    videos,
    summary,
    analysisFailed,
  } = result;

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
            <p className="text-sm text-gray-500">
              @{channel.handle.replace(/^@/, "")}
            </p>
          )}
        </div>
        <a
          href={`https://www.youtube.com/channel/${channel.id}`}
          target="_blank"
          rel="nofollow noopener"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"
        >
          <ExternalLink className="h-3 w-3" strokeWidth={2} />
          Open on YouTube
        </a>
      </div>

      {/* Optional AI editorial summary (textual only) */}
      {summary && (
        <div className="flex items-start gap-3 rounded-2xl bg-brand-50/50 px-4 py-3 ring-1 ring-inset ring-brand-100">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.25} />
          <p className="text-sm leading-relaxed text-gray-800">{summary}</p>
        </div>
      )}

      {/* Channel overview (factual aggregations from raw YouTube data) */}
      <ChannelOverview aggregations={aggregations} windowSize={windowSize} />

      {/* Bottom row — Recommended fixes + Channel snapshot */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <RecommendedFixes
          issues={recurringIssues}
          analysisFailed={!!analysisFailed}
        />
        <ChannelSnapshot channel={channel} windowSize={windowSize} />
      </div>

      {/* Per-dimension breakdown — band counts only */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Per-dimension breakdown across {windowSize} videos
        </p>
        <p className="mt-1 text-xs text-gray-500">
          How many videos fall into each editorial band for title, description,
          hashtags, and chapters. Categorical labels — not a YouTube metric.
        </p>
        <div className="mt-3 space-y-3">
          {dimensions.map((d) => (
            <DimensionRow key={d.key} dimension={d} totalVideos={windowSize} />
          ))}
        </div>
      </div>

      {/* Audited videos */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Audited videos ({windowSize} most recent)
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

// ───────────────────────────────────────────────────────────────
// Channel overview — factual aggregations, no scores
// ───────────────────────────────────────────────────────────────
function ChannelOverview({
  aggregations,
  windowSize,
}: {
  aggregations: ChannelAggregations;
  windowSize: number;
}) {
  const items: { Icon: typeof Users; label: string; value: string; hint?: string }[] = [
    {
      Icon: Film,
      label: "Uploads analyzed",
      value: String(windowSize),
      hint: "Last public uploads",
    },
    {
      Icon: Eye,
      label: "Median views",
      value: formatNumber(aggregations.medianViews),
      hint: "Across analyzed uploads",
    },
    {
      Icon: TrendingUp,
      label: "Mean views",
      value: formatNumber(aggregations.meanViews),
      hint: "Pulled up by big hits",
    },
    {
      Icon: Clock,
      label: "Median length",
      value:
        aggregations.medianDurationSec !== null
          ? formatDuration(aggregations.medianDurationSec)
          : "—",
      hint: "Typical video length",
    },
    {
      Icon: Calendar,
      label: "Publishing cadence",
      value: aggregations.publishingCadence,
    },
    {
      Icon: BarChart3,
      label: "Total views in window",
      value: formatNumber(aggregations.totalViews),
      hint:
        aggregations.dateRange.earliest && aggregations.dateRange.latest
          ? `${aggregations.dateRange.earliest} → ${aggregations.dateRange.latest}`
          : undefined,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Channel overview
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Factual aggregations over the raw YouTube metrics for the analyzed window.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ Icon, label, value, hint }) => (
          <div key={label} className="rounded-xl bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              {label}
            </div>
            <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
            {hint && <p className="mt-0.5 text-[11px] text-gray-500">{hint}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Recommended fixes
// ───────────────────────────────────────────────────────────────
function RecommendedFixes({
  issues,
  analysisFailed,
}: {
  issues: RecurringIssue[];
  analysisFailed: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Recommended fixes
        </p>
        {analysisFailed && (
          <span className="text-[11px] text-amber-600">AI rewrite unavailable</span>
        )}
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Editorial patterns identified across multiple videos. Priority reflects how many uploads are affected.
      </p>
      {issues.length === 0 ? (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-brand-50/40 p-3 ring-1 ring-inset ring-brand-100">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.25} />
          <p className="text-sm text-gray-700">
            No recurring weaknesses detected. Channel packaging looks solid across the analyzed window.
          </p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-gray-100">
          {issues.map((issue, i) => (
            <RecommendedFixRow key={i} issue={issue} />
          ))}
        </ul>
      )}
    </div>
  );
}

function RecommendedFixRow({ issue }: { issue: RecurringIssue }) {
  const style = SEVERITY_STYLE[issue.severity];
  const { Icon } = style;
  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <span
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}
      >
        <Icon className={`h-4 w-4 ${style.iconText}`} strokeWidth={2.25} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">{issue.text}</p>
        {issue.affectedCount > 0 && issue.dimensionKey && (
          <p className="mt-0.5 text-xs text-gray-500">
            {issue.affectedCount} {issue.affectedCount === 1 ? "video" : "videos"} affected ·{" "}
            {labelForDimension(issue.dimensionKey)}
          </p>
        )}
      </div>
      <span
        className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${style.pillClass}`}
      >
        {style.pillLabel}
      </span>
      <ChevronRight className="mt-2 h-3.5 w-3.5 shrink-0 text-gray-300" strokeWidth={2} />
    </li>
  );
}

function labelForDimension(key: string): string {
  switch (key) {
    case "title":
      return "Title";
    case "description":
      return "Description";
    case "hashtags":
      return "Hashtags";
    case "chapters":
      return "Chapters";
    default:
      return key;
  }
}

// ───────────────────────────────────────────────────────────────
// Channel snapshot card
// ───────────────────────────────────────────────────────────────
function ChannelSnapshot({
  channel,
  windowSize,
}: {
  channel: ChannelAuditResult["channel"];
  windowSize: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Channel snapshot
      </p>
      <div className="mt-3 space-y-2.5 text-sm">
        <SnapshotRow
          Icon={Users}
          label="Subscribers"
          value={channel.subscriberCount !== null ? formatNumber(channel.subscriberCount) : "Hidden"}
        />
        <SnapshotRow
          Icon={Film}
          label="Total videos"
          value={channel.videoCount !== null ? formatNumber(channel.videoCount) : "—"}
        />
        <SnapshotRow
          Icon={Calendar}
          label="Channel created"
          value={channel.publishedAt ? formatDate(channel.publishedAt) : "—"}
        />
        {channel.primaryNiche && (
          <SnapshotRow Icon={Compass} label="Primary niche" value={channel.primaryNiche} />
        )}
        <SnapshotRow
          Icon={Gauge}
          label="Audit window"
          value={`Last ${windowSize} uploads`}
        />
      </div>
    </div>
  );
}

function SnapshotRow({
  Icon,
  label,
  value,
}: {
  Icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="inline-flex items-center gap-2 text-gray-600">
        <Icon className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
        {label}
      </span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Per-dimension band breakdown (count-only, no averageScore)
// ───────────────────────────────────────────────────────────────
function DimensionRow({
  dimension,
  totalVideos,
}: {
  dimension: DimensionStats;
  totalVideos: number;
}) {
  const { label, bandCounts, isWorst } = dimension;
  const total = totalVideos > 0 ? totalVideos : 1;
  const segments: { band: AuditBand; pct: number }[] = (
    ["strong", "good", "fair", "weak"] as AuditBand[]
  )
    .map((band) => ({ band, pct: (bandCounts[band] / total) * 100 }))
    .filter((s) => s.pct > 0);

  return (
    <div
      className={`rounded-xl border bg-white p-4 ${
        isWorst ? "border-amber-300" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
          {isWorst && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
              Focus area
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-gray-100">
        {segments.map(({ band, pct }) => (
          <div
            key={band}
            className={BAND_COLOR_DIM[band]}
            style={{ width: `${pct}%` }}
            title={`${BAND_LABEL_DIM[band]}: ${bandCounts[band]} of ${totalVideos}`}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-gray-600">
        {(["strong", "good", "fair", "weak"] as AuditBand[]).map((band) => (
          <span key={band} className="inline-flex items-center gap-1">
            <span className={`inline-block h-2 w-2 rounded-sm ${BAND_COLOR_DIM[band]}`} />
            {BAND_LABEL_DIM[band]}: {bandCounts[band]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Audited videos list — raw metadata + textual issues, no scores
// ───────────────────────────────────────────────────────────────
function AuditedVideoRow({ video, rank }: { video: ChannelAuditVideo; rank: number }) {
  return (
    <a
      href={video.videoUrl}
      target="_blank"
      rel="nofollow noopener"
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
              <Eye className="h-3 w-3 text-gray-400" strokeWidth={2} aria-hidden="true" />
              <span className="font-mono tabular-nums">{formatNumber(video.viewCount)}</span>
              <span>views</span>
            </span>
          )}
          {video.likeCount !== null && (
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="h-3 w-3 text-gray-400" strokeWidth={2} aria-hidden="true" />
              <span className="font-mono tabular-nums">{formatNumber(video.likeCount)}</span>
              <span>likes</span>
            </span>
          )}
          {video.commentCount !== null && (
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3 w-3 text-gray-400" strokeWidth={2} aria-hidden="true" />
              <span className="font-mono tabular-nums">{formatNumber(video.commentCount)}</span>
              <span>comments</span>
            </span>
          )}
          {video.durationSec !== null && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" strokeWidth={2} aria-hidden="true" />
              {formatDuration(video.durationSec)}
            </span>
          )}
          {video.publishDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" strokeWidth={2} aria-hidden="true" />
              Published {video.publishDate}
            </span>
          )}
        </div>

        {/* Textual editorial issues per video, no scores */}
        {video.issues.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {video.issues.map((issue, i) => (
              <li
                key={i}
                className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-inset ring-amber-100"
              >
                <AlertCircle className="h-3 w-3" strokeWidth={2} />
                {issue}
              </li>
            ))}
          </ul>
        )}
      </div>
    </a>
  );
}

// ───────────────────────────────────────────────────────────────
// Formatters
// ───────────────────────────────────────────────────────────────
function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mi = parseInt(m, 10) - 1;
  return `${months[mi] ?? m} ${parseInt(d, 10)}, ${y}`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  if (min < 60) return `${min}:${String(sec).padStart(2, "0")}`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
