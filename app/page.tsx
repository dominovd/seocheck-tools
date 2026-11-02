import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  Compass,
  Database,
  Gift,
  Link2,
  PenLine,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/Container";
import { FaqSchema } from "@/components/PageSchemas";
import { TrackedDetails } from "@/components/TrackedDetails";
import { DerivedMetricsNotice } from "@/components/DerivedMetricsNotice";
import { buildMetadata } from "@/lib/seo";
import {
  STAGE_ORDER,
  toolsByStage,
  stageLabel,
  liveTools,
  type ToolStage,
} from "@/lib/tools-catalog";

/**
 * Homepage, 2026 redesign.
 *
 * Built from the approved mockup (SEO Check Tools Homepage Redesign.html)
 * with these decisions:
 *   - one channel audit field in the hero, not tabs
 *   - every tool linked from the stage grid, not only featured ones
 *   - "Most used free tools" kept, compact, no screenshots
 *   - eight FAQ entries
 *   - no ad slots on the homepage (spec section 8)
 *
 * The page is a server component. The hero form is a plain GET form
 * that hands the value to the Channel Audit page, which reads ?channel=
 * and runs Turnstile itself. No client JavaScript is needed here apart
 * from the FAQ analytics wrapper.
 *
 * COMPLIANCE: every assessment shown on this page is illustrative and
 * labeled "Example", uses the categorical vocabulary only, and carries
 * the derived-metrics disclaimer. No score, gauge, percentage, or count
 * of failed checks. See docs/youtube-api-compliance.md.
 */

const TOOL_COUNT = liveTools().length;

export const metadata = buildMetadata({
  title: "Free YouTube SEO Tools for Creators",
  description: `${TOOL_COUNT} free YouTube SEO tools for creators. No signup. Audit any channel or video, generate AI titles, tags, and descriptions, and check a niche before you record.`,
  path: "",
  noBrand: false,
});

// ─── Content ─────────────────────────────────────────────────────────

const TRUST: { Icon: LucideIcon; label: string }[] = [
  { Icon: Gift, label: "Free to use" },
  { Icon: UserRound, label: "No signup" },
  { Icon: ShieldCheck, label: "Privacy friendly" },
  { Icon: Sparkles, label: "AI where useful" },
];

const STAGE_STYLE: Record<
  ToolStage,
  { Icon: LucideIcon; tint: string; color: string; keyline: string }
> = {
  research: {
    Icon: Compass,
    tint: "bg-brand-50",
    color: "text-brand-600",
    keyline: "Keyword research, niche checks, competitor analysis",
  },
  optimize: {
    Icon: PenLine,
    tint: "bg-orange-50",
    color: "text-orange-600",
    keyline: "Title generator, tag generator, thumbnail preview",
  },
  publish: {
    Icon: Send,
    tint: "bg-indigo-50",
    color: "text-indigo-600",
    keyline: "Description generator, chapters, embed code",
  },
  analyze: {
    Icon: BarChart3,
    tint: "bg-sky-50",
    color: "text-sky-600",
    keyline: "Channel audit, video audit, money calculator",
  },
};

const FLOW: { Icon: LucideIcon; title: string; body: string; tint: string; color: string }[] = [
  { Icon: Search, title: "Discover", body: "Find keywords and ideas", tint: "bg-brand-50", color: "text-brand-600" },
  { Icon: PenLine, title: "Prepare", body: "Create metadata", tint: "bg-orange-50", color: "text-orange-600" },
  { Icon: Check, title: "Review", body: "Check what needs attention", tint: "bg-indigo-50", color: "text-indigo-600" },
];

const POPULAR: { title: string; body: string; href: string; examples: string[] }[] = [
  {
    title: "YouTube keyword tool",
    body: "Turn a seed topic into phrases people actually type into YouTube search, then build titles and tags around them.",
    href: "/tools/youtube-keyword-tool",
    examples: ["home workout for beginners", "react hooks tutorial"],
  },
  {
    title: "AI YouTube title generator",
    body: "Get several title angles for one video idea, with the main keyword kept near the start.",
    href: "/tools/youtube-title-generator",
    examples: ["how I edit videos fast", "budget travel tips"],
  },
  {
    title: "YouTube channel name generator",
    body: "Brandable channel name ideas for your niche, style, or topic, ready to check as a handle.",
    href: "/tools/youtube-channel-name-generator",
    examples: ["cooking for students", "retro gaming"],
  },
  {
    title: "YouTube channel audit",
    body: "Raw metrics for the last 30 uploads plus the recurring fixes across titles, descriptions, hashtags, and chapters.",
    href: "/tools/youtube-channel-audit",
    examples: ["any public channel", "no login needed"],
  },
];

type Status = "ready" | "caution" | "problem" | "neutral";

const STATUS_PILL: Record<Status, { label: string; cls: string; dot: string }> = {
  ready: { label: "Ready", cls: "bg-brand-50 text-brand-700", dot: "bg-brand-500" },
  caution: { label: "Needs attention", cls: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  problem: { label: "Missing", cls: "bg-red-50 text-red-700", dot: "bg-red-500" },
  neutral: { label: "Not assessed", cls: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
};

const CHECKS: { label: string; status: Status }[] = [
  { label: "Titles are clear and keyword aware", status: "ready" },
  { label: "Descriptions need more detail", status: "caution" },
  { label: "Important tags are missing", status: "problem" },
  { label: "Thumbnails could be stronger", status: "caution" },
  { label: "End screens not used", status: "neutral" },
  { label: "Playlists are well organized", status: "ready" },
  { label: "Channel details could be improved", status: "caution" },
];

const SUGGESTIONS: { tone: Status; priority: string; title: string; body: string }[] = [
  {
    tone: "problem",
    priority: "High priority",
    title: "Improve your descriptions",
    body: "Add a short summary, key moments, and a call to action. Include related keywords naturally.",
  },
  {
    tone: "caution",
    priority: "Medium priority",
    title: "Add these tags",
    body: "Include topic and variation tags to help your video get found by the right audience.",
  },
  {
    tone: "ready",
    priority: "Keep it up",
    title: "Create a stronger title",
    body: "Make it specific, benefit-driven, and worth the click.",
  },
];

const HOW: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Database,
    title: "Public data only",
    body: "We analyze public channel and video data that is available to everyone. We never ask you to sign in to YouTube.",
  },
  {
    Icon: Brain,
    title: "AI where useful",
    body: "AI drafts text and explains findings in plain English. It never decides whether a check passes.",
  },
  {
    Icon: ShieldCheck,
    title: "Practical first",
    body: "Checks focus on what you can act on right away, not on vanity numbers. No scores, no grades.",
  },
];

const COMPARISONS = [
  { label: "TubeBuddy", href: "/compare/tubebuddy" },
  { label: "vidIQ", href: "/compare/vidiq" },
  { label: "TubeRanker", href: "/compare/tuberanker" },
  { label: "Keywordtool.io", href: "/compare/keywordtool" },
  { label: "Keyword Surfer", href: "/compare/keyword-surfer" },
];

const faqs = [
  {
    q: "What is YouTube SEO?",
    a: "YouTube SEO is the practice of packaging a video so both viewers and YouTube understand what it is about: a clear title, a description with real context, relevant tags and hashtags, useful chapters, and a thumbnail that matches the promise of the title.",
  },
  {
    q: "What are the best free YouTube SEO tools?",
    a: "The best free YouTube SEO tools cover the whole creator workflow: keyword research, title and tag generation, description writing, thumbnail preview, and video and channel audits. SEO Check Tools puts all of these in one free toolkit with no signup or credit card.",
  },
  {
    q: "Which tool should I use first?",
    a: "If you already have a video published, start with the Video Audit. If you are planning your next upload, start with Niche Check or the Keyword Tool. If you want a view across your whole channel, run the Channel Audit.",
  },
  {
    q: "Are the tools really free?",
    a: "Yes. Every tool is free with no account, no credit card, and no trial. Tools that call the YouTube API or an AI model carry a small daily limit per IP address so the service stays available and running costs stay predictable.",
  },
  {
    q: "Why is it free when vidIQ and TubeBuddy charge monthly?",
    a: "SEO Check Tools focuses on lightweight, single-purpose tools and uses AI only where it adds real value. The site is supported by advertising rather than subscriptions, which keeps the toolkit free while still covering the creator workflow.",
  },
  {
    q: "Do I need an account?",
    a: "No. There is no signup, no login, and no browser extension. Paste a link or a topic and the tool runs. We never ask you to connect your YouTube account.",
  },
  {
    q: "Do you store my channel data?",
    a: "Only briefly. Lookups are cached for up to a day so repeat requests are fast, and no YouTube statistic is kept for longer than 30 days. There are no accounts, so nothing is tied to you personally.",
  },
  {
    q: "How are assessment labels created?",
    a: "Labels such as Ready, Needs attention, and Missing come from our own editorial checks against documented YouTube best practices. They are produced by SEO Check Tools, not by YouTube, and they are not official YouTube measurements or scores.",
  },
];

// ─── Small pieces ────────────────────────────────────────────────────

function StatusPill({ status, label }: { status: Status; label?: string }) {
  const s = STATUS_PILL[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {label ?? s.label}
    </span>
  );
}

function ExampleBadge() {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
      Example
    </span>
  );
}

const btnPrimary =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 text-base font-semibold text-white transition hover:bg-brand-700";
const btnSecondary =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 text-base font-medium text-gray-800 transition hover:border-brand-300 hover:text-brand-700";

// ─── Page ────────────────────────────────────────────────────────────

export default function HomePage() {
  const stageGroups = toolsByStage();

  return (
    <>
      <FaqSchema faqs={faqs} />

      {/* ───────── Hero ───────── */}
      <Container as="section" className="pt-10 pb-10 sm:pt-14">
        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14">
          {/* Copy. On mobile the panel sits between the subtitle and the buttons. */}
          <div className="contents lg:block">
            <div className="order-1">
              <p className="text-sm font-semibold text-brand-600">
                Free YouTube SEO tools <span className="mx-1 text-gray-300">·</span> No signup
                <span className="mx-1 text-gray-300">·</span> AI-powered
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.4rem]">
                Better YouTube SEO tools for every upload
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
                Research YouTube ideas, prepare metadata, and audit your channel.
                Twenty free tools, no signup.
              </p>
            </div>

            <div className="order-3 mt-6 flex flex-col gap-3 sm:flex-row lg:mt-8">
              <Link href="/tools/youtube-channel-audit" className={btnPrimary}>
                Audit your channel
              </Link>
              <Link href="/tools" className={btnSecondary}>
                Browse all {TOOL_COUNT} tools
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>

            <p className="order-4 mt-4 text-sm text-gray-500">
              Works with any public channel. No login and no extension needed.
            </p>
          </div>

          {/* Audit panel */}
          <form
            action="/tools/youtube-channel-audit"
            method="get"
            className="order-2 mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-[0_18px_40px_-18px_rgba(17,24,39,0.18)] sm:p-6 lg:mt-0"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Audit a channel</h2>
              <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                Uses public YouTube data
              </span>
            </div>

            <label htmlFor="hero-channel" className="sr-only">
              Channel URL or @handle
            </label>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
              <Link2 className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={2} aria-hidden="true" />
              <input
                id="hero-channel"
                name="channel"
                type="text"
                required
                autoComplete="off"
                placeholder="Paste a channel URL or @handle"
                className="min-h-[48px] w-full min-w-0 border-0 bg-transparent text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
              />
            </div>

            <button
              type="submit"
              className="mt-3 min-h-[48px] w-full rounded-lg bg-brand-600 px-4 text-base font-semibold text-white transition hover:bg-brand-700"
            >
              Run channel audit
            </button>

            <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-800">What you get</p>
              <ul className="mt-1.5 space-y-1">
                {[
                  "Raw metrics for the last 30 uploads",
                  "Titles, descriptions, tags, hashtags, and chapters checked",
                  "Recurring fixes, ordered by priority",
                ].map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" strokeWidth={3} aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <DerivedMetricsNotice variant="inline" className="mt-3" />

            <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
              Free, no signup <span className="mx-1 text-gray-300">·</span> Daily limit of 5 audits per IP address
            </p>
          </form>
        </div>

        {/* Trust strip */}
        <ul className="mt-10 grid grid-cols-2 rounded-xl border border-gray-200 sm:grid-cols-4">
          {TRUST.map(({ Icon, label }, i) => (
            <li
              key={label}
              className={`flex items-center gap-2.5 px-4 py-3.5 text-sm text-gray-700 sm:justify-center ${
                i % 2 === 1 ? "border-l border-gray-100" : ""
              } ${i >= 2 ? "border-t border-gray-100 sm:border-t-0" : ""} ${
                i === 2 ? "sm:border-l" : ""
              }`}
            >
              <Icon className="h-5 w-5 shrink-0 text-brand-600" strokeWidth={2} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </Container>

      {/* ───────── Every tool, by stage ───────── */}
      <Container as="section" className="pt-16 sm:pt-24">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Free YouTube SEO tools for every stage
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-gray-600">
          Twenty tools grouped by where you are in the upload. Tools marked AI
          write text for you.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAGE_ORDER.map((stage) => {
            const style = STAGE_STYLE[stage];
            const StageIcon = style.Icon;
            const tools = stageGroups[stage].filter((t) => t.status === "live");
            const label = stageLabel(stage);
            return (
              <div key={stage} className="flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${style.tint} ${style.color}`}
                  >
                    <StageIcon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                    <p className="mt-0.5 text-[13.5px] leading-snug text-gray-600">{style.keyline}</p>
                  </div>
                </div>

                <ul className="mt-4 flex-1 border-t border-gray-100">
                  {tools.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/tools/${t.slug}`}
                        className="group flex min-h-[42px] items-center gap-2 border-b border-gray-100 text-[14.5px] text-gray-700 transition hover:text-brand-700"
                      >
                        <span className="min-w-0 flex-1 truncate">{t.shortTitle}</span>
                        {t.isAI && (
                          <span className="rounded bg-indigo-50 px-1.5 text-[10.5px] font-bold text-indigo-600">
                            AI
                          </span>
                        )}
                        <span className="text-gray-300 transition group-hover:text-brand-600" aria-hidden="true">
                          ›
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/tools/${stage}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition hover:text-brand-800"
                >
                  All {label.toLowerCase()} tools
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Discover, prepare, review */}
        <div className="mt-6 grid items-center gap-4 rounded-xl border border-gray-200 bg-gray-50/70 p-5 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-5 sm:px-7">
          {FLOW.map(({ Icon, title, body, tint, color }, i) => (
            <div key={title} className="contents">
              {i > 0 && (
                <ArrowRight className="hidden h-5 w-5 text-gray-300 sm:block" strokeWidth={2} aria-hidden="true" />
              )}
              <div className="flex items-center gap-3.5">
                <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tint} ${color}`}>
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="text-sm text-gray-600">
                  <b className="block text-base font-semibold text-gray-900">{title}</b>
                  {body}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* ───────── Most used free tools ───────── */}
      <Container as="section" className="pt-16 sm:pt-24">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Most used free tools
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-gray-600">
          The four tools creators open first.
        </p>

        <div className="mt-9 grid gap-4 md:grid-cols-2">
          {POPULAR.map((p) => (
            <div
              key={p.href}
              className="grid gap-x-5 gap-y-1.5 rounded-xl border border-gray-200 bg-white p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
              <Link
                href={p.href}
                className="order-last justify-self-start whitespace-nowrap rounded-lg border border-brand-200 px-3.5 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 sm:order-none sm:row-span-2 sm:self-center"
              >
                Open tool
              </Link>
              <p className="text-[15px] leading-relaxed text-gray-600">{p.body}</p>
              <div className="mt-2 flex flex-wrap gap-1.5 sm:col-span-2">
                {p.examples.map((x) => (
                  <span
                    key={x}
                    className="rounded-md border border-gray-100 bg-gray-50 px-2 py-0.5 text-[13px] text-gray-700"
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* ───────── Findings example ───────── */}
      <Container as="section" className="pt-16 sm:pt-24">
        <div className="grid gap-10 rounded-xl border border-gray-200 bg-white p-5 sm:p-8 lg:grid-cols-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                Turn findings into clear next steps
              </h2>
              <ExampleBadge />
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
              <div className="flex justify-between border-b border-gray-100 bg-gray-50/70 px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wider text-gray-500">
                <span>What we checked</span>
                <span>Status</span>
              </div>
              <ul className="divide-y divide-gray-100">
                {CHECKS.map((c) => (
                  <li key={c.label} className="flex items-center justify-between gap-3 px-4 py-2.5 text-[14.5px] text-gray-800">
                    <span className="min-w-0">{c.label}</span>
                    <StatusPill status={c.status} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Proportion only. No count or percentage is printed. */}
            <div
              role="img"
              aria-label="Most checks need attention, a few are ready, one is missing"
              className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full"
            >
              <i className="block bg-brand-500" style={{ flex: 0.3 }} />
              <i className="block bg-amber-500" style={{ flex: 0.42 }} />
              <i className="block bg-red-500" style={{ flex: 0.14 }} />
              <i className="block bg-gray-300" style={{ flex: 0.14 }} />
            </div>
            <p className="mt-2 text-[13.5px] text-gray-600">
              Most checks need attention, a few are ready, one is missing
            </p>

            <DerivedMetricsNotice className="mt-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">Copy-ready suggestions</h3>
            <div className="mt-4 space-y-3">
              {SUGGESTIONS.map((s) => (
                <div key={s.title} className="rounded-xl border border-gray-200 p-4">
                  <StatusPill status={s.tone} label={s.priority} />
                  <p className="mt-2.5 font-semibold text-gray-900">{s.title}</p>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-gray-600">{s.body}</p>
                </div>
              ))}
            </div>
            <Link
              href="/tools/youtube-channel-audit"
              className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-brand-700 transition hover:text-brand-800"
            >
              Run a real audit on your channel
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </Container>

      {/* ───────── How the checks work + compare ───────── */}
      <Container as="section" className="pt-16 sm:pt-24">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          How the checks work
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {HOW.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>
              <h3 className="mt-3.5 text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[14.5px]">
          <span className="text-gray-600">Compare with</span>
          {COMPARISONS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-700 transition hover:border-brand-300 hover:text-brand-700"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </Container>

      {/* ───────── FAQ ───────── */}
      <Container as="section" className="pt-16 sm:pt-24">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Frequently asked questions
        </h2>
        <div className="mx-auto mt-8 max-w-2xl">
          {faqs.map(({ q, a }) => (
            <TrackedDetails
              key={q}
              question={q}
              location="homepage"
              className="group border-b border-gray-200 py-4"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[16.5px] font-semibold text-gray-900">
                {q}
                <span className="shrink-0 text-xl font-normal leading-none text-gray-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2.5 text-[15.5px] leading-relaxed text-gray-600">{a}</p>
            </TrackedDetails>
          ))}
        </div>
      </Container>

      {/* ───────── Final CTA ───────── */}
      <Container as="section" className="pt-16 pb-16 sm:pt-24 sm:pb-24">
        <div className="flex flex-col items-stretch gap-6 rounded-xl border border-brand-200 bg-brand-50/60 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Make the next upload easier.
            </h2>
            <p className="mt-1.5 text-gray-600">Practical tools. Clear guidance. Better results.</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
            <Link href="/tools/youtube-channel-audit" className={btnPrimary}>
              Audit your channel
            </Link>
            <Link href="/tools" className={btnSecondary}>
              Browse all {TOOL_COUNT} tools
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
