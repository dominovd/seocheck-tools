"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  AlertCircle,
  Sun,
  Moon,
  ImageIcon,
} from "lucide-react";
import { resolveThumbnail } from "@/lib/youtube/thumbnail-url";
import { track } from "@/lib/analytics/track";

/**
 * Multi-context Thumbnail Preview tool.
 *
 * User pastes a YouTube URL or direct image URL plus a custom title; we
 * render the combination in four real YouTube UI contexts (desktop
 * search, desktop home/browse grid card, desktop sidebar next-up, mobile
 * feed) so the creator can see how the packaging actually reads before
 * publishing — not just in their thumbnail editor at 1920x1080.
 *
 * Pure client-side. No fetch, no LLM, no quota — just CSS mockups.
 */

const SAMPLES = [
  {
    label: "MrBeast",
    url: "https://www.youtube.com/watch?v=erLbbextvlY",
    title: "I Spent 7 Days In A Wheelchair",
  },
  {
    label: "MKBHD",
    url: "https://www.youtube.com/watch?v=URkGiBxoAm0",
    title: "Are AI Phones Already Cooked?",
  },
  {
    label: "Veritasium",
    url: "https://www.youtube.com/watch?v=UVQGmsuMfNk",
    title: "How One Line in the Oldest Math Text Hinted at Hidden Universes",
  },
];

const DEFAULT_CHANNEL = "Your Channel";
const DEFAULT_VIEWS = "12K views";
const DEFAULT_AGE = "2 days ago";

export function ThumbnailPreviewTool() {
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("Your title — see how it reads on YouTube");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [imgError, setImgError] = useState(false);
  const [trackedOnce, setTrackedOnce] = useState(false);

  const resolved = useMemo(() => (input.trim() ? resolveThumbnail(input) : null), [input]);
  const thumbUrl = resolved?.url ?? null;

  // Hydrate from ?url=&title= query params (deep-linkable previews)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get("url");
    const titleParam = params.get("title");
    if (urlParam) setInput(urlParam);
    if (titleParam) setTitle(titleParam);
  }, []);

  function loadSample(idx: number) {
    const s = SAMPLES[idx];
    setInput(s.url);
    setTitle(s.title);
    setImgError(false);
  }

  function onThumbLoad() {
    setImgError(false);
    if (!trackedOnce) {
      setTrackedOnce(true);
      track("tool_used", {
        slug: "youtube-thumbnail-preview",
        source: resolved?.source ?? "unknown",
      });
    }
  }

  const inputInvalid = input.trim().length > 0 && resolved === null;

  return (
    <div>
      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="thumb-input" className="block text-sm font-medium text-gray-700">
            Thumbnail (YouTube URL, video ID, or image URL)
          </label>
          <input
            id="thumb-input"
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setImgError(false);
            }}
            placeholder="https://youtu.be/... or https://example.com/image.jpg"
            className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          {inputInvalid && (
            <p className="mt-1 flex items-start gap-1 text-xs text-amber-700">
              <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" strokeWidth={2} />
              Couldn&apos;t recognise that. Use a YouTube URL, a video ID, or a direct image URL (.jpg/.png/.webp).
            </p>
          )}
        </div>

        <div>
          <label htmlFor="title-input" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            placeholder="Your video title here"
            className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
            <span>40-70 chars is the sweet spot.</span>
            <span className="font-mono tabular-nums">{title.length} / 120</span>
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-brand-300 hover:bg-brand-50/40 transition"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          {theme === "light" ? (
            <>
              <Moon className="h-3.5 w-3.5" strokeWidth={2} />
              Dark theme
            </>
          ) : (
            <>
              <Sun className="h-3.5 w-3.5" strokeWidth={2} />
              Light theme
            </>
          )}
        </button>

        <span className="ml-auto text-xs text-gray-500">Try a sample:</span>
        {SAMPLES.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => loadSample(i)}
            className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition"
            title={`Load ${s.label}: ${s.title}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Previews */}
      <div className="mt-8 space-y-8">
        {!thumbUrl ? (
          <EmptyState />
        ) : imgError ? (
          <ErrorState onRetry={() => setImgError(false)} />
        ) : (
          <>
            <PreviewBlock
              label="Desktop search results"
              caption="How it appears in YouTube search — the most competitive surface."
            >
              <SearchResultMock
                title={title}
                thumbUrl={thumbUrl}
                theme={theme}
                onLoad={onThumbLoad}
                onError={() => setImgError(true)}
              />
            </PreviewBlock>

            <PreviewBlock
              label="Desktop home / browse"
              caption="The home feed grid card — what subscribers see first."
            >
              <BrowseGridMock title={title} thumbUrl={thumbUrl} theme={theme} />
            </PreviewBlock>

            <PreviewBlock
              label="Desktop sidebar (next-up)"
              caption="Tight space — title often gets truncated. Front-load the keyword."
            >
              <SidebarMock title={title} thumbUrl={thumbUrl} theme={theme} />
            </PreviewBlock>

            <PreviewBlock
              label="Mobile feed"
              caption="60-70% of YouTube traffic is mobile. Thumbnail dominates."
            >
              <MobileFeedMock title={title} thumbUrl={thumbUrl} theme={theme} />
            </PreviewBlock>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Layout helpers ───────────────────────────────────────────────────

function PreviewBlock({
  label,
  caption,
  children,
}: {
  label: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        <p className="text-xs text-gray-500">{caption}</p>
      </div>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/40 py-16 text-center">
      <ImageIcon className="h-8 w-8 text-gray-300" strokeWidth={1.5} />
      <p className="mt-3 text-sm text-gray-500">
        Paste a YouTube URL or click a sample above to see the previews.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50/40 py-12 text-center">
      <AlertCircle className="h-6 w-6 text-amber-600" strokeWidth={2} />
      <p className="mt-3 text-sm text-amber-900">
        The thumbnail image couldn&apos;t be loaded. Newly uploaded YouTube videos
        sometimes take a few minutes for their maxresdefault thumbnail to be available.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
      >
        Try again
      </button>
    </div>
  );
}

// ─── Themed shells ────────────────────────────────────────────────────

const themeBg = (t: "light" | "dark") =>
  t === "light" ? "bg-white" : "bg-[#0f0f0f]";
const themeText = (t: "light" | "dark") =>
  t === "light" ? "text-gray-900" : "text-white";
const themeSubtle = (t: "light" | "dark") =>
  t === "light" ? "text-gray-600" : "text-gray-400";
const themeBorder = (t: "light" | "dark") =>
  t === "light" ? "border-gray-200" : "border-gray-800";

type MockProps = {
  title: string;
  thumbUrl: string;
  theme: "light" | "dark";
};

// ─── 1. Desktop search results ────────────────────────────────────────

function SearchResultMock({
  title,
  thumbUrl,
  theme,
  onLoad,
  onError,
}: MockProps & { onLoad?: () => void; onError?: () => void }) {
  return (
    <div className={`rounded-lg border ${themeBorder(theme)} ${themeBg(theme)} p-4`}>
      <div className="flex gap-4">
        <div className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbUrl}
            alt=""
            onLoad={onLoad}
            onError={onError}
            className="w-[240px] aspect-video rounded-lg object-cover ring-1 ring-black/5"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-base font-medium leading-snug ${themeText(theme)} line-clamp-2`}>
            {title}
          </p>
          <p className={`mt-1 text-xs ${themeSubtle(theme)}`}>
            {DEFAULT_VIEWS} · {DEFAULT_AGE}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className={`h-6 w-6 rounded-full ${theme === "light" ? "bg-gray-200" : "bg-gray-700"}`} />
            <p className={`text-xs ${themeSubtle(theme)}`}>{DEFAULT_CHANNEL}</p>
          </div>
          <p className={`mt-2 text-xs ${themeSubtle(theme)} line-clamp-2`}>
            Description preview line one — YouTube shows roughly 100-130 characters of context here in search results.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── 2. Desktop home / browse grid card ───────────────────────────────

function BrowseGridMock({ title, thumbUrl, theme }: MockProps) {
  // Render 3 sibling cards (real card + 2 placeholders) to show how the
  // thumbnail competes against neighbors in the grid.
  return (
    <div className={`rounded-lg border ${themeBorder(theme)} ${themeBg(theme)} p-4`}>
      <div className="grid grid-cols-3 gap-3">
        <GridCard title={title} thumbUrl={thumbUrl} theme={theme} highlighted />
        <GridCard title="Neighbor video that competes for the click" thumbUrl={thumbUrl} theme={theme} muted />
        <GridCard title="Another nearby suggestion in the feed" thumbUrl={thumbUrl} theme={theme} muted />
      </div>
    </div>
  );
}

function GridCard({
  title,
  thumbUrl,
  theme,
  highlighted = false,
  muted = false,
}: MockProps & { highlighted?: boolean; muted?: boolean }) {
  return (
    <div className={`${highlighted ? "ring-2 ring-brand-400 rounded-xl p-1 -m-1" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbUrl}
        alt=""
        className={`w-full aspect-video rounded-lg object-cover ring-1 ring-black/5 ${muted ? "opacity-30 grayscale" : ""}`}
      />
      <div className="mt-2 flex gap-2">
        <div className={`h-6 w-6 shrink-0 rounded-full ${theme === "light" ? "bg-gray-200" : "bg-gray-700"} ${muted ? "opacity-30" : ""}`} />
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium leading-snug ${themeText(theme)} line-clamp-2 ${muted ? "opacity-40" : ""}`}>
            {title}
          </p>
          <p className={`mt-1 text-xs ${themeSubtle(theme)} ${muted ? "opacity-40" : ""}`}>
            {DEFAULT_CHANNEL} · {DEFAULT_VIEWS}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── 3. Desktop sidebar (next-up) ─────────────────────────────────────

function SidebarMock({ title, thumbUrl, theme }: MockProps) {
  return (
    <div className={`rounded-lg border ${themeBorder(theme)} ${themeBg(theme)} p-4`}>
      <div className="max-w-md space-y-3">
        <SidebarRow title={title} thumbUrl={thumbUrl} theme={theme} highlighted />
        <SidebarRow title="A competing suggestion just below yours" thumbUrl={thumbUrl} theme={theme} muted />
        <SidebarRow title="And another one in the next-up column" thumbUrl={thumbUrl} theme={theme} muted />
      </div>
    </div>
  );
}

function SidebarRow({
  title,
  thumbUrl,
  theme,
  highlighted = false,
  muted = false,
}: MockProps & { highlighted?: boolean; muted?: boolean }) {
  return (
    <div className={`flex gap-2 ${highlighted ? "rounded-md ring-2 ring-brand-400 p-1 -m-1" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbUrl}
        alt=""
        className={`w-[168px] aspect-video rounded-md object-cover ring-1 ring-black/5 shrink-0 ${muted ? "opacity-30 grayscale" : ""}`}
      />
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-medium leading-snug ${themeText(theme)} line-clamp-2 ${muted ? "opacity-40" : ""}`}>
          {title}
        </p>
        <p className={`mt-1 text-[11px] ${themeSubtle(theme)} ${muted ? "opacity-40" : ""}`}>
          {DEFAULT_CHANNEL}
        </p>
        <p className={`text-[11px] ${themeSubtle(theme)} ${muted ? "opacity-40" : ""}`}>
          {DEFAULT_VIEWS} · {DEFAULT_AGE}
        </p>
      </div>
    </div>
  );
}

// ─── 4. Mobile feed ───────────────────────────────────────────────────

function MobileFeedMock({ title, thumbUrl, theme }: MockProps) {
  return (
    <div className={`rounded-lg border ${themeBorder(theme)} ${themeBg(theme)} p-4`}>
      <div className="mx-auto max-w-[360px]">
        <div className={`rounded-lg overflow-hidden ${theme === "light" ? "bg-white" : "bg-[#0f0f0f]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbUrl}
            alt=""
            className="w-full aspect-video object-cover"
          />
          <div className="p-3 flex gap-2">
            <div className={`h-9 w-9 shrink-0 rounded-full ${theme === "light" ? "bg-gray-200" : "bg-gray-700"}`} />
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium leading-snug ${themeText(theme)} line-clamp-2`}>
                {title}
              </p>
              <p className={`mt-1 text-xs ${themeSubtle(theme)}`}>
                {DEFAULT_CHANNEL} · {DEFAULT_VIEWS} · {DEFAULT_AGE}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
