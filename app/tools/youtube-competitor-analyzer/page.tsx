import Link from "next/link";
import {
  Trophy,
  Calendar,
  Heading,
  BarChart3,
  Sparkles,
  Users,
  Briefcase,
  Building2,
  Megaphone,
  Check,
  ArrowRight,
} from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { CompetitorAnalyzerTool } from "@/components/tools/CompetitorAnalyzerTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-competitor-analyzer")!;

const PAGE_TITLE = "Free YouTube Competitor Analysis Tool";
const META_DESCRIPTION =
  "Free YouTube competitor analysis tool. Paste any channel to see top videos, latest uploads, title angles, views, engagement, and AI patterns for your YouTube SEO strategy.";
const OG_DESCRIPTION =
  "Analyze a YouTube competitor channel for free and find the videos, title patterns, and content angles already working in your niche.";

const base = buildMetadata({
  title: PAGE_TITLE,
  description: META_DESCRIPTION,
  path: `tools/${tool.slug}`,
  ogVariant: tool.isAI ? { ai: true } : undefined,
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

const HERO_SUBTITLE =
  "Paste any competitor channel for free and see what is already working: their top videos by views, latest uploads, title angles, engagement signals, and 3 AI-backed patterns you can use for your next content bet.";

const ABOVE_FOLD_BULLETS = [
  "See the competitor's best-performing videos, not just their newest uploads.",
  "Compare historical winners with current publishing direction.",
  "Find repeatable title and format patterns before you script your next video.",
];

type Card = { Icon: typeof Trophy; title: string; body: string };

const WHAT_YOU_GET: Card[] = [
  {
    Icon: Trophy,
    title: "Top 10 videos by views",
    body: "Find the videos that proved demand in the niche. These are the competitor's strongest public signals, useful for topic research and format discovery.",
  },
  {
    Icon: Calendar,
    title: "Latest 10 uploads",
    body: "See whether the channel is doubling down, testing new angles, or moving away from its historical winners.",
  },
  {
    Icon: Heading,
    title: "Title angles",
    body: "Each title is classified by angle (how-to, listicle, curiosity, comparison, story, contrarian) so you can spot which formats the channel keeps winning with.",
  },
  {
    Icon: BarChart3,
    title: "Views, likes, comments, dates",
    body: "Compare performance signals without opening every video manually.",
  },
  {
    Icon: Sparkles,
    title: "AI patterns to borrow",
    body: 'Get 3 concrete observations based on the actual videos in the result, not generic advice like "post consistently."',
  },
];

const HOW_TO_STEPS = [
  {
    title: "Paste a competitor channel in your niche.",
    body: "Use a public channel that already gets meaningful views in the topic you want to enter or grow.",
  },
  {
    title: "Scan the top videos by views.",
    body: "Note repeated topics, formats, promise types, title structures, and audience pains. These are public signals of what works.",
  },
  {
    title: "Switch to the latest uploads.",
    body: "Check whether the channel is still using the same strategy or testing a new direction. The gap is the strategy signal.",
  },
  {
    title: "Compare 3-5 competitors before choosing your next topic cluster.",
    body: "A single channel can be lucky. Patterns that repeat across multiple competitors are stronger evidence of demand.",
  },
  {
    title: "Use the related tools to turn patterns into publish-ready metadata.",
    body: "Move into the YouTube keyword tool, title scorer, tag extractor, and video audit to build the upload package.",
  },
];

type UseCase = { Icon: typeof Users; title: string; body: string };

const USE_CASES: UseCase[] = [
  {
    Icon: Users,
    title: "Creators",
    body: "Choose video ideas based on what already earns views in your niche.",
  },
  {
    Icon: Briefcase,
    title: "YouTube SEO specialists",
    body: "Audit competitor positioning before recommending title, topic, or metadata changes.",
  },
  {
    Icon: Building2,
    title: "Agencies",
    body: "Build faster competitive research snapshots for prospects and clients.",
  },
  {
    Icon: Megaphone,
    title: "Founders and marketers",
    body: "Research content angles before using YouTube as an acquisition channel.",
  },
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-keyword-tool",
    name: "YouTube Keyword Tool",
    body: "Turn the niche signals into a keyword cluster before writing titles.",
  },
  {
    href: "/tools/youtube-title-score-checker",
    name: "YouTube Title Analyzer",
    body: "Check whether your own next title hits the patterns competitors use.",
  },
  {
    href: "/tools/youtube-tag-extractor",
    name: "YouTube Tag Extractor",
    body: "Pull tags from a specific competitor video for tag research.",
  },
  {
    href: "/tools/youtube-video-audit",
    name: "YouTube Video Audit",
    body: "Audit a specific video before publishing to match the winning patterns.",
  },
  {
    href: "/tools/youtube-channel-audit",
    name: "YouTube Channel Audit",
    body: "Audit your own channel and any competitor across title, description, hashtags, and chapters.",
  },
];

const FAQS = [
  {
    q: "What is a YouTube competitor analysis tool?",
    a: "A YouTube competitor analysis tool helps you study another channel's public performance signals: top videos, recent uploads, titles, views, engagement, and publishing patterns. This tool turns those signals into a quick content research snapshot so you can plan better topics, titles, and formats.",
  },
  {
    q: "Is this YouTube competitor analyzer free?",
    a: "Yes. You can run 3 competitor analyses per day per IP for free. The limit exists because each uncached lookup uses YouTube Data API quota and AI processing.",
  },
  {
    q: "What can I learn from a competitor's top videos?",
    a: "Top videos reveal proven demand. Look for repeated topics, title formulas, formats, audience problems, thumbnail promises, and video lengths. If several competitors win with the same pattern, it may be a strong opportunity for your own channel.",
  },
  {
    q: "Why compare top videos with latest uploads?",
    a: "Top videos show what worked historically. Latest uploads show where the channel is going now. The difference between the two can reveal pivots, experiments, and new content angles before they become obvious.",
  },
  {
    q: "Can I use this for YouTube SEO?",
    a: "Yes. The tool helps with YouTube SEO research by showing which topics and title structures already perform in a niche. Pair it with a YouTube keyword tool, title checker, and tag extractor before publishing.",
  },
  {
    q: "Does this show private analytics?",
    a: "No. The analyzer only uses public channel and video data available through YouTube's official systems. It does not access private YouTube Studio analytics.",
  },
  {
    q: "What channel formats can I paste?",
    a: "You can paste a YouTube handle, full channel URL, legacy custom URL, user URL, or bare channel ID. Examples include @MrBeast, youtube.com/@MrBeast, youtube.com/channel/UC..., /c/CustomName, and /user/Username.",
  },
  {
    q: "How fresh is the data?",
    a: "The tool fetches live data from YouTube for uncached analyses, then caches the result for 24 hours. View, like, and comment counts reflect the time of the underlying YouTube response.",
  },
  {
    q: "Will I see tags for each video?",
    a: "Not on this page yet. YouTube does not expose all video tags for non-owners through the official API. Use the standalone YouTube Tag Extractor for a single video URL.",
  },
  {
    q: "Do you store the channels I analyze?",
    a: "Results are cached by channel ID for 24 hours. The tool does not keep a per-user history of who searched for which channel.",
  },
];

export default function YouTubeCompetitorAnalyzerPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <CompetitorAnalyzerTool />
      </ToolLayout>

      {/* Above-fold benefit bullets */}
      <section className="border-t border-gray-100 bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ul className="grid gap-3 sm:grid-cols-3">
            {ABOVE_FOLD_BULLETS.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 rounded-xl bg-gray-50/60 p-4 text-sm text-gray-700 ring-1 ring-gray-100 leading-relaxed"
              >
                <Check
                  className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-center text-xs text-gray-500">
            No signup. No credit card. Uses YouTube&apos;s official Data API
            plus AI pattern analysis.
          </p>
        </div>
      </section>

      {/* About — Find the videos competitors are winning with */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Find the YouTube videos your competitors are winning with
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Most YouTube SEO tools stop at keywords, tags, or surface-level
            channel stats. This competitor analyzer starts with the question
            creators actually care about: what is already working in this
            niche?
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Paste a competing YouTube channel and the tool pulls the videos
            that earned the most views, compares them with the channel&apos;s
            latest uploads, scores the titles, and summarizes the patterns
            that show up again and again. Instead of guessing whether to copy
            a topic, angle, format, or title structure, you get a quick read
            on the content strategy behind the channel.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use it when you are planning a new niche, refreshing a channel
            strategy, validating a video idea, or trying to understand why a
            smaller competitor keeps getting outsized views.
          </p>
        </div>
      </section>

      {/* What you get from each competitor analysis */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              What you get from each competitor analysis
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_YOU_GET.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use it for YouTube SEO research */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl text-center">
            How to use it for YouTube SEO research
          </h2>

          <ol className="mt-12 space-y-6">
            {HOW_TO_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-10 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-sm text-gray-800 leading-relaxed">
            The goal is not to clone a competitor. The goal is to see the
            market clearly before you invest time in a video that has no
            proof of demand.
          </p>
        </div>
      </section>

      {/* Why this is different from a basic YouTube channel checker */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Why this is different from a basic YouTube channel checker
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            A basic YouTube channel checker tells you how many subscribers,
            videos, and views a channel has. That is useful, but it rarely
            tells you what to make next.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            This tool is built for competitive content research. It connects
            channel metrics to individual videos, title quality, publishing
            recency, and AI pattern detection. That makes it more useful for
            YouTube SEO strategy, topic validation, and channel growth
            planning than a raw metrics scraper.
          </p>
        </div>
      </section>

      {/* Best use cases */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Best use cases
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How the analysis works */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How the analysis works
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            When you submit a channel, SEO Check Tools resolves the handle or
            URL to a YouTube channel ID, fetches the channel&apos;s strongest
            videos and newest uploads, then enriches each result with public
            performance data.
          </p>

          <p className="mt-6 text-base text-gray-700 leading-relaxed">
            The analyzer then runs two extra layers:
          </p>

          <ul className="mt-4 space-y-3">
            <li className="rounded-lg bg-gray-50/60 p-4 ring-1 ring-gray-100">
              <p className="text-sm font-semibold text-gray-900">
                Title scoring
              </p>
              <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                Every video title is checked against the same title-quality
                heuristics used in the{" "}
                <Link
                  href="/tools/youtube-title-score-checker"
                  className="link"
                >
                  YouTube Title Analyzer
                </Link>
                .
              </p>
            </li>
            <li className="rounded-lg bg-gray-50/60 p-4 ring-1 ring-gray-100">
              <p className="text-sm font-semibold text-gray-900">
                AI pattern analysis
              </p>
              <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                The tool looks for repeatable structures across the
                competitor&apos;s top videos and summarizes the patterns in
                plain English.
              </p>
            </li>
          </ul>

          <p className="mt-6 text-xs text-gray-500 leading-relaxed">
            For transparency: each uncached lookup uses roughly 103 YouTube
            Data API quota units, so free use is limited to 3 analyses per IP
            per day. Cached channel results refresh every 24 hours.
          </p>
        </div>
      </section>

      <RelatedGuideCallout slug={tool.slug} />

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl text-center">
            Frequently asked
          </h2>
          <dl className="mt-10 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
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

      {/* Related tools */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Continue your YouTube SEO research
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Turn competitor patterns into publish-ready metadata with the
              rest of the SEO Check Tools workflow.
            </p>
          </div>

          <div className="mx-auto mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RELATED_TOOLS.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-sm"
              >
                <p className="text-base font-semibold text-gray-900 group-hover:text-brand-700 transition">
                  {r.name}
                </p>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  {r.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-600 group-hover:text-brand-700 transition">
                  Open tool
                  <ArrowRight
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2.25}
                  />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/tools" className="link text-sm">
              Browse all YouTube SEO tools →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Ready to analyze a competitor?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Paste a competitor channel and get a free YouTube competitor
            analysis in seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Analyze competitor
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
