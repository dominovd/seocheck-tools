import Link from "next/link";
import { ClipboardCheck, ArrowRight, Sparkles, Target } from "lucide-react";
import { Container } from "@/components/Container";
import { ToolCard } from "@/components/ToolCard";
import { FaqSchema } from "@/components/PageSchemas";
import { buildMetadata } from "@/lib/seo";
import {
  toolsByStage,
  allToolsSorted,
  getToolBySlug,
  stageLabel,
  stageTagline,
  STAGE_ORDER,
} from "@/lib/tools-catalog";

const META_DESCRIPTION =
  "Use 21 free YouTube SEO tools to research keywords, check niches, analyze competitors, generate titles and tags, audit videos, preview thumbnails, and grow your channel.";
const OG_DESCRIPTION =
  "Free YouTube SEO tools for every creator workflow: research topics, optimize metadata, publish faster, audit videos, and analyze channel growth.";

const base = buildMetadata({
  title: "Free YouTube SEO Tools | 21 Tools for Creators",
  description: META_DESCRIPTION,
  path: "tools",
  noBrand: true,
});

export const metadata = {
  ...base,
  openGraph: {
    ...base.openGraph,
    description: OG_DESCRIPTION,
  },
  twitter: {
    ...base.twitter,
    description: OG_DESCRIPTION,
  },
};

type GoalGroup = {
  goal: string;
  blurb: string;
  toolSlugs: string[];
};

const GOAL_GROUPS: GoalGroup[] = [
  {
    goal: "Find a video idea",
    blurb: "Research demand and find untapped angles before you record.",
    toolSlugs: [
      "youtube-niche-check",
      "youtube-keyword-tool",
      "youtube-video-idea-generator",
      "youtube-outlier-finder",
    ],
  },
  {
    goal: "Improve a title or thumbnail",
    blurb: "Sharpen the package that decides whether viewers click.",
    toolSlugs: [
      "youtube-title-score-checker",
      "youtube-title-generator",
      "youtube-thumbnail-preview",
    ],
  },
  {
    goal: "Research competitors",
    blurb: "See what already works in the niche before betting on a topic.",
    toolSlugs: [
      "youtube-competitor-analyzer",
      "youtube-tag-extractor",
      "youtube-outlier-finder",
    ],
  },
  {
    goal: "Fix a published video",
    blurb: "Start with an audit, then jump to the right fix-it tool.",
    toolSlugs: ["youtube-video-audit"],
  },
  {
    goal: "Audit a whole channel",
    blurb: "Find recurring weak spots and see channel-level health at a glance.",
    toolSlugs: [
      "youtube-channel-audit",
      "youtube-money-calculator",
    ],
  },
];

const FAQS = [
  {
    q: "Are these YouTube SEO tools free?",
    a: "Yes. All tools on SEO Check Tools are free to use. Some AI-powered tools have fair-use limits to keep compute costs predictable.",
  },
  {
    q: "Do I need to sign up?",
    a: "No. The tools work without account creation, email capture, or credit card.",
  },
  {
    q: "Which YouTube SEO tool should I start with?",
    a: "If you already have a video, start with Video Audit. If you are planning content, start with Niche Check, Keyword Tool, or Competitor Analyzer.",
  },
  {
    q: "What tools help with YouTube titles and tags?",
    a: "Use Title Analyzer, Title Generator, Tag Generator, Tag Extractor, and Hashtag Generator.",
  },
  {
    q: "What tools help analyze a YouTube channel?",
    a: "Use Channel Audit, Competitor Analyzer, Outlier Finder, and Money Calculator.",
  },
];

export default function ToolsIndexPage() {
  const stages = toolsByStage();
  const totalLive = STAGE_ORDER.flatMap((s) => stages[s]).filter(
    (t) => t.status === "live"
  ).length;
  const totalSoon = STAGE_ORDER.flatMap((s) => stages[s]).filter(
    (t) => t.status === "coming-soon"
  ).length;

  const auditTool = getToolBySlug("youtube-video-audit");
  // "Most popular" = top 5 by priority, excluding the audit (already featured above)
  const popular = allToolsSorted()
    .filter((t) => t.status === "live" && t.slug !== "youtube-video-audit")
    .slice(0, 5);

  return (
    <Container as="main" className="py-12 sm:py-16">
      <FaqSchema faqs={FAQS} />

      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Free YouTube SEO Tools
        </h1>
        <p className="mt-4 text-base text-gray-700 sm:text-lg leading-relaxed">
          {totalLive} free tools to research YouTube topics, improve titles
          and tags, preview thumbnails, prepare uploads, audit videos,
          analyze competitors, and find channel growth opportunities. No
          signup required.
        </p>
        <p className="mt-3 text-xs text-gray-500">
          Free forever · No signup · AI where it helps · Browser-side
          utilities where it does not
          {totalSoon > 0 && (
            <span className="ml-1.5 text-gray-400">
              · {totalSoon} more coming soon
            </span>
          )}
        </p>
      </header>

      {/* ───────── Start here callout ───────── */}
      {auditTool && (
        <Link
          href={`/tools/${auditTool.slug}`}
          className="group mt-10 flex flex-col gap-3 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/70 via-brand-50/30 to-white p-5 transition hover:border-brand-300 hover:shadow-sm sm:flex-row sm:items-center sm:gap-5 sm:p-6"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
            <ClipboardCheck className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Start here
            </p>
            <h2 className="mt-1 text-lg font-semibold text-gray-900 sm:text-xl">
              Not sure what to fix first? Start with a free video audit.
            </h2>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
              Paste any YouTube video URL to get an editorial audit across
              title, description, tags, hashtags, chapters, and packaging
              signals, with direct links to the right fix-it tool.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-brand-700 ring-1 ring-brand-200 transition group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
            Run free audit
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
        </Link>
      )}

      {/* ───────── Choose by goal ───────── */}
      <section className="mt-14">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-brand-500" strokeWidth={2} />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            What are you trying to do?
          </h2>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-gray-600 leading-relaxed">
          Match a goal to the right tools instead of mapping each problem to
          a tool name yourself.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GOAL_GROUPS.map((g) => {
            const tools = g.toolSlugs
              .map((s) => getToolBySlug(s))
              .filter(
                (t): t is NonNullable<typeof t> =>
                  !!t && t.status === "live"
              );
            if (tools.length === 0) return null;
            return (
              <div
                key={g.goal}
                className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5"
              >
                <p className="text-base font-semibold text-gray-900">
                  {g.goal}
                </p>
                <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                  {g.blurb}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {tools.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/tools/${t.slug}`}
                        className="inline-flex items-center gap-1 rounded-full bg-brand-50/60 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-100 hover:bg-brand-50 hover:ring-brand-200 transition"
                      >
                        {t.shortTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────── Most popular ───────── */}
      {popular.length > 0 && (
        <section className="mt-14">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-500" strokeWidth={2} />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Most popular
            </h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* ───────── Browse by workflow stage ───────── */}
      <section className="mt-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Browse by workflow stage
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Pick the stage you&apos;re at — research, optimize, publish, or
            analyze — to see only the tools that matter for that step.
          </p>
        </div>

        {/* Stage chip nav */}
        <div className="mt-6 flex flex-wrap gap-2">
          {STAGE_ORDER.map((s, i) => (
            <Link
              key={s}
              href={`/tools/${s}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700 transition"
            >
              <span className="font-mono text-[10px] tabular-nums text-gray-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{stageLabel(s)}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500">{stageTagline(s)}</span>
              <ArrowRight className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
            </Link>
          ))}
        </div>

        {/* Stage sections — every stage fully rendered server-side */}
        <div className="mt-12 space-y-14">
          {STAGE_ORDER.map((s) => {
            const tools = stages[s];
            if (tools.length === 0) return null;
            return (
              <section key={s} id={s}>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <Link
                      href={`/tools/${s}`}
                      className="group inline-flex items-center gap-2"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-700 transition">
                        {stageLabel(s)}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-brand-700 transition" strokeWidth={2} />
                    </Link>
                    <p className="text-xs text-gray-500">{stageTagline(s)}</p>
                  </div>
                  <p className="text-xs font-mono tabular-nums text-gray-400">
                    {tools.length} {tools.length === 1 ? "tool" : "tools"}
                  </p>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {/* ───────── Bottom SEO section ───────── */}
      <section className="mt-20 border-t border-gray-100 pt-12">
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            A free YouTube SEO toolkit for the whole creator workflow
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed">
            SEO Check Tools is organized around the way creators actually
            publish videos. Start with research tools when you need a topic,
            keyword, niche, or competitor insight. Move to optimization
            tools when you need stronger titles, tags, hashtags, and
            thumbnails. Use publishing tools to prepare descriptions,
            chapters, and embeds. After publishing, use the audit and
            analysis tools to understand what to fix next.
          </p>
          <p className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed">
            Every tool is free, and most work without signup or account
            connection. AI is used for generation, summarization, and
            pattern detection; simple utilities stay fast and browser-side.
          </p>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="mt-16">
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            Frequently asked
          </h2>
          <dl className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="group px-5 py-4 sm:px-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-3 text-left text-sm font-semibold text-gray-900 sm:text-base">
                  <span>{item.q}</span>
                  <span className="mt-0.5 text-gray-400 transition-transform group-open:rotate-180">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <dd className="mt-3 text-sm text-gray-700 leading-relaxed">
                  {item.a}
                </dd>
              </details>
            ))}
          </dl>
        </div>
      </section>
    </Container>
  );
}
