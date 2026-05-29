"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Loader2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { track } from "@/lib/analytics/track";
import type {
  CompetitorAnalysis,
  CompetitorVideo,
} from "@/lib/youtube/competitor-analysis";
import type { TitleScoreBand } from "@/lib/youtube/title-score";

type ApiResponse =
  | { output: CompetitorAnalysis; cached?: boolean; remaining?: number }
  | { error: string; code?: string };

const BAND_STYLES: Record<TitleScoreBand, { ring: string; text: string; label: string }> = {
  strong: { ring: "ring-brand-300", text: "text-brand-700", label: "Strong" },
  good:   { ring: "ring-brand-200", text: "text-brand-600", label: "Good" },
  fair:   { ring: "ring-amber-300", text: "text-amber-700", label: "Fair" },
  weak:   { ring: "ring-red-300",   text: "text-red-700",   label: "Weak" },
};

export function CompetitorAnalyzerTool() {
  const [channel, setChannel] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompetitorAnalysis | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function runAnalysis(targetChannel: string) {
    if (!targetChannel.trim() || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/youtube-competitor-analyzer", {
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
        slug: "youtube-competitor-analyzer",
        cached: !!data.cached,
        videos: data.output.topVideos.length,
        patterns: data.output.patterns.length,
      });
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  // Hydrate from ?channel= URL param
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const seed = params.get("channel");
    if (seed && seed.trim()) {
      setChannel(seed.trim());
    }
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runAnalysis(channel);
        }}
      >
        <label htmlFor="channel-input" className="block text-sm font-medium text-gray-700">
          Channel handle, URL, or ID
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input
            id="channel-input"
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            placeholder="@MrBeast, youtube.com/@MrBeast, or UCX6OQ3DkcsbYNE6H8uQQuVA"
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
                <Users className="h-4 w-4" strokeWidth={2} />
                Analyze channel
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Works with @handle, youtube.com/@name, youtube.com/channel/UC…,
          /c/CustomName, /user/Username, or a bare channel ID.
        </p>

        {/* Turnstile */}
        <div className="mt-4">
          <TurnstileWidget onToken={setTurnstileToken} />
        </div>

        <p className="mt-3 text-xs text-gray-400">
          3 analyses per day per IP — this lookup burns a chunk of our YouTube
          API quota, so the limit is stricter than other tools.
          {remaining !== null && (
            <span className="ml-2">({remaining} left today)</span>
          )}
        </p>
      </form>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {result && <AnalysisResults result={result} />}
    </div>
  );
}

function AnalysisResults({ result }: { result: CompetitorAnalysis }) {
  const { channel, topVideos, patterns, patternsFailed } = result;

  return (
    <div className="mt-8 space-y-8">
      {/* Channel header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:p-5">
        {channel.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={channel.thumbnailUrl}
            alt={channel.title}
            className="h-20 w-20 rounded-full object-cover ring-1 ring-gray-200"
          />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-gray-900">{channel.title}</h2>
          {channel.handle && (
            <p className="text-sm text-gray-500">@{channel.handle.replace(/^@/, "")}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
            {channel.subscriberCount !== null && (
              <span>
                <span className="font-mono font-semibold text-gray-800">{formatNumber(channel.subscriberCount)}</span>{" "}
                subscribers
              </span>
            )}
            {channel.videoCount !== null && (
              <span>
                <span className="font-mono font-semibold text-gray-800">{formatNumber(channel.videoCount)}</span>{" "}
                videos
              </span>
            )}
            {channel.viewCount !== null && (
              <span>
                <span className="font-mono font-semibold text-gray-800">{formatNumber(channel.viewCount)}</span>{" "}
                total views
              </span>
            )}
          </div>
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

      {/* LLM pattern summary */}
      {patterns.length > 0 && (
        <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/70 via-white to-white p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-600" strokeWidth={2.5} />
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              3 patterns to borrow
            </p>
          </div>
          <ol className="mt-3 space-y-3">
            {patterns.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-800">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {patternsFailed && (
        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-amber-900">
            Pattern summary couldn&apos;t be generated this time — video data
            below is still complete. Try the analysis again to retry the AI step.
          </p>
        </div>
      )}

      {/* Top videos */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Top {topVideos.length} videos by views
        </p>
        <div className="mt-3 space-y-3">
          {topVideos.map((v, i) => (
            <VideoRow key={v.videoId} video={v} rank={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoRow({ video, rank }: { video: CompetitorVideo; rank: number }) {
  const bs = BAND_STYLES[video.titleScore.band];

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
        <h3 className="text-sm font-semibold text-gray-900 leading-snug">{video.title}</h3>

        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
          {video.viewCount !== null && (
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3 text-gray-400" strokeWidth={2} />
              <span className="font-mono tabular-nums">{formatNumber(video.viewCount)}</span>
            </span>
          )}
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
