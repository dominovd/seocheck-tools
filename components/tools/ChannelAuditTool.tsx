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
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { track } from "@/lib/analytics/track";
import type {
  ChannelAuditResult,
  ChannelAuditVideo,
  ChannelGrade,
  DimensionStats,
  IssueSeverity,
  RecurringIssue,
  ScoreBand,
  Subscore,
} from "@/lib/youtube/channel-audit";
import { GRADE_DESCRIPTION } from "@/lib/youtube/channel-audit";
import type { AuditBand } from "@/lib/youtube/video-audit";

type ApiResponse =
  | { output: ChannelAuditResult; cached?: boolean; remaining?: number }
  | { error: string; code?: string };

const BAND_STYLE: Record<
  ScoreBand,
  { ring: string; text: string; bg: string; bar: string; pill: string }
> = {
  excellent: {
    ring: "ring-brand-400",
    text: "text-brand-700",
    bg: "bg-brand-50",
    bar: "bg-brand-500",
    pill: "bg-brand-50 text-brand-700 ring-brand-200",
  },
  "very-good": {
    ring: "ring-brand-300",
    text: "text-brand-700",
    bg: "bg-brand-50/70",
    bar: "bg-brand-400",
    pill: "bg-brand-50 text-brand-700 ring-brand-100",
  },
  medium: {
    ring: "ring-amber-300",
    text: "text-amber-700",
    bg: "bg-amber-50",
    bar: "bg-amber-400",
    pill: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  weak: {
    ring: "ring-red-300",
    text: "text-red-600",
    bg: "bg-red-50",
    bar: "bg-red-400",
    pill: "bg-red-50 text-red-700 ring-red-200",
  },
};

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

const GRADE_TEXT: Record<ChannelGrade, string> = {
  A: "text-brand-700",
  B: "text-brand-700",
  C: "text-amber-700",
  D: "text-orange-700",
  F: "text-red-700",
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
      // Read body as text first so we can surface meaningful info even when
      // the route returned non-JSON (HTML error page from Vercel, etc).
      const bodyText = await res.text();
      let data: ApiResponse | null = null;
      try {
        data = JSON.parse(bodyText) as ApiResponse;
      } catch {
        setError(
          `Server returned a non-JSON response (HTTP ${res.status}). Check the dev terminal for the stack trace. First 200 chars: ${bodyText.slice(0, 200)}`
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
        grade: data.output.grade,
        overall: data.output.overallScore,
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
          Pulls the channel&apos;s last 30 public uploads and scores CTR potential,
          metadata quality, niche headroom, and growth trajectory.
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
    overallScore,
    grade,
    overallBand,
    overallBandLabel,
    subscores,
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

      {/* Top row — Visibility Score + 4 subscore cards */}
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <VisibilityScoreCard
          score={overallScore}
          grade={grade}
          band={overallBand}
          bandLabel={overallBandLabel}
          windowSize={windowSize}
          summary={summary}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {subscores.map((s) => (
            <SubscoreCard key={s.key} subscore={s} />
          ))}
        </div>
      </div>

      {/* Bottom row — Recommended fixes + Channel snapshot */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <RecommendedFixes
          issues={recurringIssues}
          analysisFailed={!!analysisFailed}
        />
        <ChannelSnapshot
          channel={channel}
          windowSize={windowSize}
          grade={grade}
        />
      </div>

      {/* Per-dimension breakdown — kept as a power-user drill-down */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Per-dimension breakdown across {windowSize} videos
        </p>
        <p className="mt-1 text-xs text-gray-500">
          How each piece of video packaging (title, description, hashtags, chapters) holds up
          across the channel.
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
// Visibility Score card (left of the top row)
// ───────────────────────────────────────────────────────────────
function VisibilityScoreCard({
  score,
  grade,
  band,
  bandLabel,
  windowSize,
  summary,
}: {
  score: number;
  grade: ChannelGrade;
  band: ScoreBand;
  bandLabel: string;
  windowSize: number;
  summary: string | null;
}) {
  const style = BAND_STYLE[band];
  const pct = Math.max(0, Math.min(100, score));
  // SVG ring geometry
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Visibility Score
      </p>
      <div className="flex items-center gap-4">
        <div className="relative h-32 w-32 shrink-0">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-gray-100"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="currentColor"
              className={style.text.replace("text-", "text-")}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-4xl font-bold text-gray-900 leading-none">
              {score}
            </span>
            <span className="mt-1 text-xs text-gray-500">/100</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex items-center self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style.pill}`}
          >
            {bandLabel}
          </span>
          <span className={`font-mono text-xs font-semibold ${GRADE_TEXT[grade]}`}>
            Grade {grade}
          </span>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-gray-600">
        Averaged across {windowSize} most recent uploads. {GRADE_DESCRIPTION[grade]}
      </p>
      {summary && (
        <div className="rounded-lg bg-brand-50/50 px-3 py-2 ring-1 ring-inset ring-brand-100">
          <div className="flex items-start gap-1.5">
            <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-brand-600" strokeWidth={2.5} />
            <p className="text-xs leading-snug text-gray-700">{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Subscore card (one of 4 in the top row)
// ───────────────────────────────────────────────────────────────
function SubscoreCard({ subscore }: { subscore: Subscore }) {
  const style = BAND_STYLE[subscore.band];
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-semibold text-gray-700">{subscore.label}</p>
      <div className="mt-1.5 flex items-baseline justify-between">
        <span className={`font-mono text-3xl font-bold ${style.text}`}>
          {subscore.score}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${style.bar}`}
          style={{ width: `${Math.max(0, Math.min(100, subscore.score))}%` }}
        />
      </div>
      <p className={`mt-2 text-xs font-semibold ${style.text}`}>{subscore.bandLabel}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-gray-500">{subscore.evidence}</p>
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
        Patterns identified across multiple videos. Severity reflects how many uploads are affected.
      </p>
      {issues.length === 0 ? (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-brand-50/40 p-3 ring-1 ring-inset ring-brand-100">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.25} />
          <p className="text-sm text-gray-700">
            No recurring weaknesses detected. Channel packaging is solid across the analyzed window.
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
  grade,
}: {
  channel: ChannelAuditResult["channel"];
  windowSize: number;
  grade: ChannelGrade;
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
          value={`Last ${windowSize} uploads · Grade ${grade}`}
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
// Per-dimension band breakdown (legacy, kept as a drill-down)
// ───────────────────────────────────────────────────────────────
function DimensionRow({
  dimension,
  totalVideos,
}: {
  dimension: DimensionStats;
  totalVideos: number;
}) {
  const { label, averageScore, bandCounts, isWorst } = dimension;
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
              Worst dimension
            </span>
          )}
        </div>
        <p className="font-mono text-sm font-semibold tabular-nums text-gray-800">
          {averageScore}
          <span className="ml-1 text-xs font-normal text-gray-400">avg</span>
        </p>
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
// Audited videos list
// ───────────────────────────────────────────────────────────────
function AuditedVideoRow({ video, rank }: { video: ChannelAuditVideo; rank: number }) {
  const grade = computeQuickGrade(video.audit.overallScore);
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
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ring-2 bg-white ${gradeRing(
            grade
          )}`}
        >
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
  if (g === "A" || g === "B") return "ring-brand-300";
  if (g === "C") return "ring-amber-300";
  if (g === "D") return "ring-orange-300";
  return "ring-red-300";
}

function gradeText(g: ChannelGrade): string {
  return GRADE_TEXT[g];
}

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDate(iso: string): string {
  // iso = "YYYY-MM-DD"
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mi = parseInt(m, 10) - 1;
  return `${months[mi] ?? m} ${parseInt(d, 10)}, ${y}`;
}
