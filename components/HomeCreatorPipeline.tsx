import Link from "next/link";
import {
  Lightbulb,
  MousePointerClick,
  FileText,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Check,
  LayoutGrid,
} from "lucide-react";
import { Container } from "@/components/Container";
import {
  toolsByStage,
  STAGE_ORDER,
  getToolBySlug,
  type ToolStage,
} from "@/lib/tools-catalog";

/**
 * "The creator pipeline" block. 4 stage cards (Research / Optimize /
 * Publish / Analyze) connected by dashed line through numbered circles
 * at the top. Each card shows:
 *  - mini mockup widget at top (stage-specific)
 *  - icon + eyebrow + heading + sub
 *  - small tools list with chevrons
 *  - bottom CTA link + tool count
 *
 * Final centered "View all 21 tools" button below the grid.
 *
 * Layout pattern from the approved mockup. All mockup widgets are static
 * JSX/SVG with illustrative numbers (no live data).
 */

const HOMEPAGE_STAGES: Record<
  ToolStage,
  {
    jobLabel: string;
    heading: string;
    subhead: string;
    featuredSlugs: string[];
    footerCta: string;
  }
> = {
  research: {
    jobLabel: "Idea",
    heading: "Before filming",
    subhead: "Find topics with proven demand",
    featuredSlugs: [
      "youtube-competitor-analyzer",
      "youtube-niche-check",
      "youtube-outlier-finder",
      "youtube-keyword-tool",
    ],
    footerCta: "Find video ideas",
  },
  optimize: {
    jobLabel: "Click",
    heading: "Before upload",
    subhead: "Make the click package stronger",
    featuredSlugs: [
      "youtube-thumbnail-preview",
      "youtube-title-generator",
      "youtube-title-score-checker",
      "youtube-tag-generator",
    ],
    footerCta: "Improve my upload",
  },
  publish: {
    jobLabel: "Metadata",
    heading: "At publish",
    subhead: "Ship with clean metadata",
    featuredSlugs: [
      "youtube-description-generator",
      "youtube-chapter-generator",
      "youtube-hashtag-generator",
    ],
    footerCta: "Prepare metadata",
  },
  analyze: {
    jobLabel: "Growth",
    heading: "After publish",
    subhead: "Learn what to fix next",
    featuredSlugs: [
      "youtube-video-audit",
      "youtube-visibility-score",
      "youtube-channel-audit",
      "youtube-outlier-finder",
    ],
    footerCta: "Audit performance",
  },
};

export function HomeCreatorPipeline() {
  const stageGroups = toolsByStage();

  return (
    <Container as="section" id="tools" className="pb-24">
      {/* Section header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          The creator pipeline
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          What to do at every step of your next upload
        </h2>
        <p className="mt-4 text-base text-gray-600 sm:text-lg max-w-xl mx-auto">
          Free YouTube SEO tools for every creator moment: find a video idea,
          improve the click package, publish clean metadata, and learn what
          to fix next.
        </p>
      </div>

      {/* Numbered circle bar (desktop only) */}
      <div className="mx-auto mt-12 max-w-6xl">
        <div className="mb-3 hidden grid-cols-4 gap-5 lg:grid">
          {[1, 2, 3, 4].map((n, i) => (
            <div key={n} className="relative flex items-center justify-center">
              {/* Left dash (skip for first) */}
              {i > 0 && (
                <div className="absolute left-0 right-[calc(50%+18px)] top-1/2 border-t-2 border-dashed border-brand-300" />
              )}
              {/* Right dash (skip for last) */}
              {i < 3 && (
                <div className="absolute left-[calc(50%+18px)] right-0 top-1/2 border-t-2 border-dashed border-brand-300" />
              )}
              <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-base font-bold text-white shadow-sm">
                {n}
              </span>
            </div>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {STAGE_ORDER.map((stage, i) => {
            const stageTools = stageGroups[stage];
            const homepageStage = HOMEPAGE_STAGES[stage];
            const featuredTools = homepageStage.featuredSlugs
              .map((slug) => getToolBySlug(slug))
              .filter((t): t is NonNullable<typeof t> => Boolean(t));

            return (
              <article
                key={stage}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60"
              >
                {/* Mobile number badge (replaces dashed bar) */}
                <div className="mb-3 flex items-center justify-center lg:hidden">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                </div>

                {/* Stage mockup widget */}
                <StageMockup stage={stage} />

                {/* Icon + eyebrow */}
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                    <StageIcon stage={stage} />
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">
                    {homepageStage.jobLabel}
                  </p>
                </div>

                {/* Heading + subhead */}
                <h3 className="mt-3 text-lg font-bold text-gray-900">
                  {homepageStage.heading}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {homepageStage.subhead}
                </p>

                {/* Tools list with chevrons */}
                <ul className="mt-4 flex-1 space-y-1">
                  {featuredTools.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="group/link flex items-center justify-between gap-2 rounded-md py-1.5 text-sm text-gray-700 transition hover:text-brand-700"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <tool.Icon
                            className="h-3.5 w-3.5 shrink-0 text-gray-400 transition group-hover/link:text-brand-600"
                            strokeWidth={2}
                          />
                          <span className="truncate">{tool.shortTitle}</span>
                        </span>
                        <ChevronRight
                          className="h-4 w-4 shrink-0 text-gray-300 transition group-hover/link:text-brand-500"
                          strokeWidth={2}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Bottom CTA + tool count */}
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-4 text-sm">
                  <Link
                    href={`/tools/${stage}`}
                    className="inline-flex items-center gap-1 font-bold text-brand-600 transition hover:text-brand-700"
                  >
                    {homepageStage.footerCta}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </Link>
                  <span className="text-xs text-gray-400">
                    {stageTools.length} tools
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Final "View all 21 tools" bordered CTA */}
      <div className="mt-12 flex justify-center">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
        >
          <LayoutGrid
            className="h-4 w-4 text-brand-600"
            strokeWidth={2}
            aria-hidden="true"
          />
          View all 21 tools
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </div>
    </Container>
  );
}

// ─── STAGE ICON ───────────────────────────────────────────────────────────

function StageIcon({ stage }: { stage: ToolStage }) {
  const Icon = {
    research: Lightbulb,
    optimize: MousePointerClick,
    publish: FileText,
    analyze: TrendingUp,
  }[stage];
  return <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />;
}

// ─── STAGE MOCKUP ROUTER ──────────────────────────────────────────────────

function StageMockup({ stage }: { stage: ToolStage }) {
  switch (stage) {
    case "research":
      return <ResearchMockup />;
    case "optimize":
      return <OptimizeMockup />;
    case "publish":
      return <PublishMockup />;
    case "analyze":
      return <AnalyzeMockup />;
  }
}

// ─── STAGE 1: RESEARCH (Top keyword ideas) ───────────────────────────────

function ResearchMockup() {
  const keywords = [
    "react useEffect tutorial",
    "useEffect cleanup",
    "react hooks explained",
    "useEffect best practices",
  ];
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-gray-900">
          Top keyword ideas
        </p>
        <span className="inline-flex items-center rounded-md bg-brand-50 px-1.5 py-0.5 text-[9px] font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
          High demand
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {keywords.map((t) => (
          <span
            key={t}
            className="inline-flex items-center rounded-md bg-gray-50 px-1.5 py-0.5 text-[9px] font-medium text-gray-700 ring-1 ring-inset ring-gray-200"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── STAGE 2: OPTIMIZE (Thumbnail preview + Title score) ─────────────────

function OptimizeMockup() {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-white p-2.5">
      {/* Thumbnail preview */}
      <div>
        <p className="mb-1 text-[9px] font-semibold text-gray-900">
          Thumbnail preview
        </p>
        <div className="relative aspect-video overflow-hidden rounded bg-gradient-to-br from-indigo-600 to-purple-700">
          <div className="absolute inset-0 flex items-center justify-between p-1.5">
            <div className="text-white">
              <p className="text-[8px] font-bold leading-none">useEffect</p>
              <p className="text-[11px] font-extrabold leading-none">HOOK</p>
              <p className="mt-0.5 inline-block bg-red-500 px-1 text-[6px] font-bold leading-tight">
                TUTORIAL
              </p>
            </div>
            <div className="h-7 w-7 shrink-0 rounded-full bg-amber-200 ring-1 ring-white/40" />
          </div>
        </div>
      </div>
      {/* Title score */}
      <div>
        <p className="mb-1 text-[9px] font-semibold text-gray-900">
          Title score
        </p>
        <div className="flex items-center justify-center">
          <ScoreCircle value={86} />
        </div>
      </div>
    </div>
  );
}

// ─── STAGE 3: PUBLISH (Metadata checklist) ───────────────────────────────

function PublishMockup() {
  const items = [
    { label: "Description", status: "Optimized" },
    { label: "Chapters", status: "Added" },
    { label: "Hashtags", status: "Optimized" },
  ];
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <p className="mb-2 text-[11px] font-semibold text-gray-900">
        Metadata checklist
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-100">
              <Check
                className="h-2 w-2 text-brand-700"
                strokeWidth={3.5}
                aria-hidden="true"
              />
            </span>
            <span className="flex-1 text-[10px] text-gray-700">
              {item.label}
            </span>
            <span className="text-[9px] font-semibold text-brand-600">
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── STAGE 4: ANALYZE (Visibility + Views trend) ─────────────────────────

function AnalyzeMockup() {
  const points =
    "2,18 8,16 14,17 20,13 26,15 32,11 38,12 44,8 50,9 56,5 58,3";
  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-white p-2.5">
      {/* Visibility score */}
      <div>
        <p className="mb-1 text-[9px] font-semibold text-gray-900">
          Visibility score
        </p>
        <div className="flex items-center justify-center">
          <ScoreCircle value={92} />
        </div>
      </div>
      {/* Views trend */}
      <div>
        <p className="mb-1 text-[9px] font-semibold text-gray-900">
          Views trend
        </p>
        <svg
          viewBox="0 0 60 24"
          className="h-8 w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="vt-stage" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            points={`${points} 60,24 0,24`}
            fill="url(#vt-stage)"
            stroke="none"
          />
          <polyline
            points={points}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          />
        </svg>
        <p className="mt-0.5 text-[11px] font-bold leading-none text-brand-600">
          +24%
        </p>
        <p className="text-[8px] text-gray-500">vs last 30 days</p>
      </div>
    </div>
  );
}

// ─── REUSED: small circular score widget ─────────────────────────────────

function ScoreCircle({ value }: { value: number }) {
  // r=15, circumference = 2 * PI * 15 ≈ 94.25
  const C = 2 * Math.PI * 15;
  const filled = (value / 100) * C;
  return (
    <div className="relative h-14 w-14">
      <svg
        viewBox="0 0 36 36"
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${filled.toFixed(2)}, ${C.toFixed(2)}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold leading-none text-gray-900">
          {value}
        </span>
        <span className="mt-0.5 text-[7px] leading-none text-gray-500">
          /100
        </span>
      </div>
    </div>
  );
}
