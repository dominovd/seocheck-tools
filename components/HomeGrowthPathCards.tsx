import Link from "next/link";
import {
  TrendingUp,
  Compass,
  Gauge,
  PlayCircle,
  Users,
  TrendingUp as TrendingUpChip,
  Tag,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

/**
 * Two-segment growth-path block. Replaces the older "I have a channel"
 * vs "I'm starting one" CTA cards with a richer mockup-driven layout
 * approved by the user: each card shows the tool category eyebrow,
 * heading, chip row, a static visual mockup of the tool output, and
 * two CTAs.
 *
 * LEFT card (brand-green): existing channels → Channel Audit + outliers
 * RIGHT card (orange):      new creators     → Niche Check + ideas
 *
 * All mockup widgets are static JSX/SVG. Numbers are illustrative and
 * intentionally honest (good but not perfect). No real API data.
 */

export function HomeGrowthPathCards() {
  return (
    <section className="pb-20 sm:pb-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose your YouTube growth path
          </h2>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            Already publishing or just getting started, pick the right tools
            first.
          </p>
        </div>

        {/* Two cards */}
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <ExistingChannelsCard />
          <NewCreatorsCard />
        </div>
      </div>
    </section>
  );
}

// ─── LEFT CARD ────────────────────────────────────────────────────────────

function ExistingChannelsCard() {
  return (
    <article className="flex flex-col rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm shadow-gray-100/60">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
          <TrendingUp className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
          For existing channels
        </span>
      </div>

      {/* H2 + subtitle */}
      <h3 className="mt-7 text-2xl font-bold tracking-tight text-gray-900 sm:text-[1.75rem] leading-tight">
        Find what&apos;s holding your channel back
      </h3>
      <p className="mt-3 text-base text-gray-600 leading-relaxed">
        Paste your channel handle and get a clear score, weak uploads, and
        the fastest fixes.
      </p>

      {/* Feature chips */}
      <div className="mt-5 flex flex-wrap gap-2.5">
        <FeatureChip Icon={Gauge} tone="brand">
          Visibility score
        </FeatureChip>
        <FeatureChip Icon={PlayCircle} tone="brand">
          Weak uploads
        </FeatureChip>
        <FeatureChip Icon={Users} tone="brand">
          Competitor gaps
        </FeatureChip>
      </div>

      {/* Mockup */}
      <div className="mt-6 grid gap-3 rounded-2xl bg-gray-50/60 p-3 ring-1 ring-inset ring-gray-100 sm:grid-cols-[1fr_1.3fr]">
        <VisibilityScoreCircle />
        <div className="flex flex-col gap-3">
          <VisibilityTrendChart />
          <WeakUploadsList />
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-auto pt-7 flex flex-wrap gap-2.5">
        <Link
          href="/tools/youtube-channel-audit"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition sm:flex-initial sm:px-6"
        >
          Audit my channel
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
        <Link
          href="/tools/youtube-outlier-finder"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:border-brand-300 hover:text-brand-700 transition sm:flex-initial sm:px-6"
        >
          Find weak videos
        </Link>
      </div>
    </article>
  );
}

// ─── RIGHT CARD ──────────────────────────────────────────────────────────

function NewCreatorsCard() {
  return (
    <article className="flex flex-col rounded-3xl border border-gray-200 bg-white p-7 sm:p-8 shadow-sm shadow-gray-100/60">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
          <Compass className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
          For new creators
        </span>
      </div>

      {/* H2 + subtitle */}
      <h3 className="mt-7 text-2xl font-bold tracking-tight text-gray-900 sm:text-[1.75rem] leading-tight">
        Validate your channel idea before you start
      </h3>
      <p className="mt-3 text-base text-gray-600 leading-relaxed">
        Check demand, competition, names, keywords, and video ideas before
        you launch.
      </p>

      {/* Feature chips */}
      <div className="mt-5 flex flex-wrap gap-2.5">
        <FeatureChip Icon={TrendingUpChip} tone="orange">
          Niche demand
        </FeatureChip>
        <FeatureChip Icon={Tag} tone="orange">
          Channel names
        </FeatureChip>
        <FeatureChip Icon={Lightbulb} tone="orange">
          Video ideas
        </FeatureChip>
      </div>

      {/* Mockup */}
      <div className="mt-6 grid gap-3 rounded-2xl bg-gray-50/60 p-3 ring-1 ring-inset ring-gray-100 sm:grid-cols-[1fr_1.6fr]">
        <NicheDemandGauge />
        <div className="flex flex-col gap-3">
          <KeywordPillTags />
          <VideoIdeaCards />
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-auto pt-7 flex flex-wrap gap-2.5">
        <Link
          href="/tools/youtube-niche-check"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition sm:flex-initial sm:px-6"
        >
          Validate niche
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
        <Link
          href="/tools/youtube-video-idea-generator"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:border-orange-300 hover:text-orange-700 transition sm:flex-initial sm:px-6"
        >
          Generate ideas
        </Link>
      </div>
    </article>
  );
}

// ─── REUSABLE CHIP ────────────────────────────────────────────────────────

type LucideIcon = typeof Gauge;

function FeatureChip({
  Icon,
  children,
  tone,
}: {
  Icon: LucideIcon;
  children: React.ReactNode;
  tone: "brand" | "orange";
}) {
  const cls =
    tone === "brand"
      ? "border-brand-200 bg-brand-50 text-brand-700"
      : "border-orange-200 bg-orange-50 text-orange-700";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${cls} px-3 py-1 text-xs font-semibold`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
      {children}
    </span>
  );
}

// ─── MOCKUP WIDGETS (left card) ───────────────────────────────────────────

function VisibilityScoreCircle() {
  // Circle: r=44, circumference = 2*PI*44 ≈ 276
  // 92% filled = 254 stroke, 22 gap
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white px-3 py-4 ring-1 ring-gray-100">
      <p className="self-start text-[11px] font-semibold text-gray-900">
        Visibility score
      </p>
      <div className="relative mt-2 flex h-28 w-28 items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="276.46"
            strokeDashoffset="22.12"
          />
        </svg>
        <div className="relative flex items-baseline gap-0.5">
          <span className="text-3xl font-bold tabular-nums text-gray-900">
            92
          </span>
          <span className="text-sm font-semibold text-gray-400">/100</span>
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold text-brand-600">Great job!</p>
      <p className="text-[10px] text-gray-500">Keep optimizing.</p>
    </div>
  );
}

function VisibilityTrendChart() {
  // Polyline points within a 100x40 viewBox, slight upward trend.
  const points = "2,32 12,28 22,30 32,24 42,26 52,18 62,22 72,14 82,10 92,8 98,4";
  return (
    <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-gray-100">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold text-gray-900">
          Channel visibility trend
        </p>
        <div className="text-right">
          <p className="text-xs font-bold text-brand-600">+24%</p>
          <p className="text-[9px] text-gray-500">vs last 30 days</p>
        </div>
      </div>
      <svg
        viewBox="0 0 100 40"
        className="mt-1 h-12 w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="vt-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={`${points} 100,40 0,40`}
          fill="url(#vt-fill)"
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
        {points.split(" ").map((p) => {
          const [x, y] = p.split(",");
          return (
            <circle
              key={p}
              cx={x}
              cy={y}
              r="1.2"
              fill="#10b981"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
    </div>
  );
}

function WeakUploadsList() {
  const rows = [
    { title: "My Editing Setup in 2024", label: "Title", tone: "red" },
    { title: "How I Get More Views", label: "Description", tone: "amber" },
    { title: "Best Mic for YouTubers?", label: "Tags", tone: "orange" },
  ] as const;
  const labelStyle = (tone: "red" | "amber" | "orange") => {
    if (tone === "red") return "bg-red-50 text-red-700 ring-red-100";
    if (tone === "amber") return "bg-amber-50 text-amber-700 ring-amber-100";
    return "bg-orange-50 text-orange-700 ring-orange-100";
  };
  return (
    <div className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-gray-100">
      <p className="text-[11px] font-semibold text-gray-900">3 weak uploads</p>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <li key={r.title} className="flex items-center gap-2">
            <div
              className="h-6 w-9 shrink-0 rounded-md bg-gray-200"
              aria-hidden="true"
            />
            <span className="flex-1 truncate text-[11px] text-gray-700">
              {r.title}
            </span>
            <span
              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-semibold ring-1 ring-inset ${labelStyle(r.tone)}`}
            >
              {r.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── MOCKUP WIDGETS (right card) ──────────────────────────────────────────

function NicheDemandGauge() {
  // Half-arc gauge. 0% at left (180°), 100% at right (0°).
  // Indicator at ~75% → angle = 180 - (0.75 * 180) = 45° from positive x axis.
  // We use SVG with two arcs: gray full + orange portion, then needle.
  // Arc center at (50, 50), radius 40.
  // 100% full = path from (10,50) to (90,50) sweeping clockwise across top.
  // For 75% filled, end angle = 180 - 135 = 45° from x.
  // Point at angle 45°: (50 + 40*cos(45°), 50 - 40*sin(45°)) = (78.28, 21.72)
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white px-3 py-4 ring-1 ring-gray-100">
      <p className="self-start text-[11px] font-semibold text-gray-900">
        Niche demand
      </p>
      <svg viewBox="0 0 100 60" className="mt-1 w-full max-w-[10rem]" aria-hidden="true">
        {/* gray full arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* orange portion (75%) */}
        <path
          d="M 10 50 A 40 40 0 0 1 78.28 21.72"
          fill="none"
          stroke="#f97316"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* needle */}
        <line
          x1="50"
          y1="50"
          x2="78"
          y2="22"
          stroke="#1f2937"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="50" cy="50" r="3" fill="#1f2937" />
      </svg>
      <p className="mt-1 text-xs font-semibold text-orange-600">High demand</p>
      <p className="text-[10px] text-gray-500">Plenty of room to grow</p>
    </div>
  );
}

function KeywordPillTags() {
  const tags = [
    "faceless youtube channel",
    "ai video ideas",
    "cash cow channel",
    "easy youtube niches",
    "automation channel",
  ];
  return (
    <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-gray-100">
      <p className="text-[11px] font-semibold text-gray-900">
        Top keyword ideas
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700 ring-1 ring-inset ring-orange-100"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function VideoIdeaCards() {
  const ideas = [
    { n: 1, title: "AI Tools Explained" },
    { n: 2, title: "Side Hustles from Home" },
    { n: 3, title: "Tech Shorts" },
  ];
  return (
    <div className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-gray-100">
      <p className="text-[11px] font-semibold text-gray-900">10 ideas</p>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {ideas.map((i) => (
          <div
            key={i.n}
            className="relative overflow-hidden rounded-md bg-gray-200 aspect-[4/3]"
          >
            <span className="absolute left-1 top-1 z-10 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-gray-900">
              {i.n}
            </span>
            <div className="absolute inset-x-0 bottom-0 bg-black/55 px-1 py-0.5 text-[8px] font-medium text-white leading-tight">
              {i.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
