import Link from "next/link";
import {
  CircleDollarSign,
  Lock,
  Wand2,
  ScanSearch,
  ArrowRight,
  WandSparkles,
  Search,
  Tv,
  Gauge,
  Compass,
  Sparkles,
  FileText,
  Target,
  TrendingUp,
  Rocket,
  Upload,
  Briefcase,
  ClipboardCheck,
  Check,
  Eye,
} from "lucide-react";
import { Container } from "@/components/Container";
import { FaqSchema } from "@/components/PageSchemas";
import { TrackedDetails } from "@/components/TrackedDetails";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { HeroFeatureCards } from "@/components/HeroFeatureCards";
import { HomeGrowthPathCards } from "@/components/HomeGrowthPathCards";
import { HomeCreatorPipeline } from "@/components/HomeCreatorPipeline";
import { ToolSpotlight } from "@/components/spotlights/ToolSpotlight";
import { MockKeywordTool } from "@/components/spotlights/MockKeywordTool";
import {
  ChannelNameGeneratorScreenshots,
} from "@/components/spotlights/ScreenshotSets";
import { buildMetadata } from "@/lib/seo";
import {
  toolsByStage,
  STAGE_ORDER,
  getToolBySlug,
} from "@/lib/tools-catalog";

export const metadata = buildMetadata({
  title: "Free YouTube SEO Tools for Creators",
  description:
    "21 free YouTube SEO tools for creators. No signup. Score any channel in 5 seconds, audit your next upload, generate AI titles, tags, and descriptions, and find under-saturated niches before you record.",
  path: "",
  noBrand: false,
});

const benefits = [
  {
    Icon: CircleDollarSign,
    title: "Free, no trial games",
    description:
      "Use every tool without a subscription, credit card, or per-tool credits. Channel audits, video audits, generators, and AI fixes are all included.",
  },
  {
    Icon: Wand2,
    title: "AI fixes, not generic advice",
    description:
      "Get rewritten titles, descriptions, tags, and hashtags only where your audit finds weak spots, so you can copy fixes straight into YouTube Studio.",
  },
  {
    Icon: Lock,
    title: "No account, no tracking profile",
    description:
      "Use the tools without signing up. Prompts and outputs are not stored, and channel audit data is anonymized for privacy.",
  },
  {
    Icon: Target,
    title: "Editorial audit before rewrite",
    description:
      "See what is actually weak first: title, metadata, hashtags, chapters. Then use generators to fix the right thing.",
  },
  {
    Icon: ScanSearch,
    title: "Find what is working in your niche",
    description:
      "Analyze competitor channels, pull hidden tags, and spot outlier videos that performed far above the channel's normal baseline.",
  },
  {
    Icon: TrendingUp,
    title: "Track progress over time",
    description:
      "Save a channel after an audit and watch its raw metrics (subscribers, median views, upload cadence) shift week by week, so growth becomes visible instead of guesswork.",
  },
];

const audiences = [
  {
    Icon: Rocket,
    label: "Just starting",
    description:
      "Validate your niche, name your channel, and generate your first video ideas.",
  },
  {
    Icon: Upload,
    label: "Publishing regularly",
    description:
      "Improve titles, thumbnails, tags, descriptions, and chapters before each upload.",
  },
  {
    Icon: TrendingUp,
    label: "Trying to grow",
    description:
      "Find outliers, audit weak uploads, and track your channel visibility over time.",
  },
  {
    Icon: Briefcase,
    label: "Managing YouTube for clients",
    description:
      "Run fast YouTube SEO checks and copy-ready fixes for multiple channels.",
  },
];

const comparisons = [
  { label: "vs TubeBuddy", href: "/compare/tubebuddy" },
  { label: "vs VidIQ", href: "/compare/vidiq" },
  { label: "vs TubeRanker", href: "/compare/tuberanker" },
  { label: "vs Keywordtool.io", href: "/compare/keywordtool" },
  { label: "vs Keyword Surfer", href: "/compare/keyword-surfer" },
];

const faqs = [
  {
    q: "What is YouTube SEO?",
    a: "YouTube SEO is the process of helping your videos get discovered in YouTube Search, suggested videos, and related recommendations. It includes choosing the right topic, writing a clear title, adding useful metadata, improving thumbnails, using chapters, and tracking which uploads perform better than expected.",
  },
  {
    q: "What are the best free YouTube SEO tools?",
    a: "The best free YouTube SEO tools cover the full creator workflow: keyword research, title generation, tag generation, description generation, thumbnail preview, video audit, channel audit, and competitor research. SEO Check Tools combines these into one free toolkit with no signup or credit card.",
  },
  {
    q: "What are YouTube SEO best practices in 2026?",
    a: "Start with a topic people already search for, write a title that clearly promises value, use a thumbnail that is readable on mobile, add a useful description, include relevant tags and hashtags, add chapters when helpful, and review performance after publishing. The best workflow is research before filming, optimize before upload, then audit after publish.",
  },
  {
    q: "What is a YouTube keyword tool?",
    a: "A YouTube keyword tool helps you find search terms people use on YouTube. Use it before filming to choose a topic, then reuse the strongest keywords naturally in your title, description, tags, chapters, and hashtags.",
  },
  {
    q: "How do I write a YouTube title that gets clicks?",
    a: "A strong YouTube title is clear, specific, and curiosity-driven without misleading viewers. Good titles usually combine the topic with an outcome, tension, comparison, or surprising angle. The YouTube Title Generator gives multiple title angles so you can choose the strongest fit for your video.",
  },
  {
    q: "How do I choose YouTube tags?",
    a: "Use tags to clarify the topic, spelling variants, people, products, tools, and related searches in the video. Avoid stuffing broad tags. Start with your main keyword, add close variations, then include a few niche-specific terms from keyword or competitor research.",
  },
  {
    q: "Can I generate YouTube descriptions for free?",
    a: "Yes. The free YouTube Description Generator helps turn your topic, title, or notes into a structured description with relevant keywords, useful context, links, and calls to action. You can copy the result into YouTube Studio and edit it before publishing.",
  },
  {
    q: "What does Channel Audit show me?",
    a: "Channel Audit pulls the last 30 public uploads for any channel and surfaces raw YouTube metrics (median and mean views, publishing cadence, typical length), a per-dimension editorial breakdown (title, description, hashtags, chapters), and severity-ranked recommended fixes rewritten as creator-actionable sentences.",
  },
  {
    q: "What is the difference between Video Audit and Channel Audit?",
    a: "Video Audit checks one video and surfaces editorial signals for its title, description, tags, hashtags, and chapters. Channel Audit looks across recent uploads to find recurring patterns, weak metadata habits, and the uploads that may be dragging the channel down.",
  },
  {
    q: "How does the Fix-with-AI button work?",
    a: "Fix-with-AI uses the audit results to rewrite only the weak parts of a video package, such as title, description, tags, or hashtags. Instead of generic advice, it gives copy-ready improvements you can paste into YouTube Studio.",
  },
  {
    q: "Can I track a channel's growth over time?",
    a: "Yes. After running a Channel Audit you can add the channel to weekly tracking. Each week we re-pull raw YouTube metrics (subscribers, view counts, upload counts) and add them to that channel's history, so you can watch the numbers move.",
  },
  {
    q: "Is SEO Check Tools really free?",
    a: "Yes. SEO Check Tools is free to use with no signup, no credit card, and no subscription. Some AI-powered or YouTube API-heavy tools may have fair-use limits, but the core toolkit is available for free.",
  },
  {
    q: "Do you store my prompts, outputs, or channel data?",
    a: "No account is required. Prompts and outputs are not stored as user profiles. Channel audit data is handled with privacy in mind, and usage limits are designed to prevent abuse rather than track individual creators.",
  },
  {
    q: "Why is it free when VidIQ and TubeBuddy charge monthly?",
    a: "SEO Check Tools focuses on lightweight, single-purpose YouTube SEO tools and uses AI only where it adds real value, such as audits, fixes, and pattern summaries. That keeps the product simple enough to offer for free while still covering the creator workflow.",
  },
];

/**
 * Homepage-specific re-framing of the workflow stages. The global
 * tools-catalog uses neutral "Research / Optimize / Publish / Analyze"
 * labels; here on the homepage we use creator-pipeline framing
 * (Before filming / Before upload / At publish / After publish) so
 * visitors instantly see when each group of tools fits.
 *
 * Each stage also pins an exact tool list and footer CTA, so the
 * homepage isn't at the mercy of the global priority sort (e.g. we
 * surface Title Analyzer on the homepage even though it has a
 * lower priority than Hashtag Generator). The footer CTA still links
 * to the stage hub page where the full tool list lives.
 */
const HOMEPAGE_STAGES: Record<
  "research" | "optimize" | "publish" | "analyze",
  {
    /** Compact job label, shown as eyebrow chip on the card (e.g. "Idea") */
    jobLabel: string;
    /** Card heading — the creator-pipeline moment */
    heading: string;
    /** One-liner under the heading describing the outcome */
    subhead: string;
    /** Tools to surface on the homepage (overrides the global priority sort) */
    featuredSlugs: string[];
    /** Footer link label leading to the stage hub */
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
      "youtube-channel-audit",
      "youtube-outlier-finder",
    ],
    footerCta: "Audit performance",
  },
};

export default function HomePage() {
  const stageGroups = toolsByStage();

  return (
    <>
      <FaqSchema faqs={faqs} />
      {/* ───────── Hero ───────── */}
      <Container as="section" className="pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          {/* LEFT — copy, CTAs, feature cards */}
          <div className="text-center lg:text-left">
            {/* Eyebrow pill */}
            <div className="inline-flex items-center rounded-full bg-brand-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-800 ring-1 ring-inset ring-brand-100">
              Free YouTube SEO tools · No signup · AI-powered
            </div>

            {/* H1 — big, bold, brand accent on the action verbs */}
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.5rem] xl:text-6xl leading-[1.05]">
              Free YouTube SEO Tools to{" "}
              <span className="text-brand-500">Audit, Improve, and Grow</span>{" "}
              Any Channel
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-xl text-base text-gray-600 sm:text-lg leading-relaxed mx-auto lg:mx-0">
              Find what to make next, fix weak uploads, and track your
              channel&apos;s visibility over time. 20 free YouTube SEO tools
              powered by AI.
            </p>

            {/* Primary + secondary CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                href="/tools/youtube-channel-audit"
                className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-600 transition"
              >
                Start checking
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-6 py-3 text-base font-medium text-gray-800 hover:border-brand-300 hover:text-brand-700 transition"
              >
                Browse tools
              </Link>
            </div>

            {/* 4 feature cards */}
            <div className="mt-8">
              <HeroFeatureCards />
            </div>
          </div>

          {/* RIGHT — product dashboard mockup */}
          {/* Hero mockup — clean textual dashboard preview, no scoring */}
          <HeroDashboardPreview />
        </div>
      </Container>

      {/* ───────── Growth-path cards: "Choose your YouTube growth path" ───────── */}
      <Container as="div">
        <HomeGrowthPathCards />
      </Container>

      {/* ───────── The creator workflow. Tools by stage ───────── */}
      <HomeCreatorPipeline />

      {/* ───────── Coming soon: Transcript Generator (highest demand tool in pipeline) ───────── */}
      <section className="border-y border-amber-100 bg-gradient-to-r from-amber-50/60 via-white to-amber-50/40 py-14 sm:py-16">
        <Container as="div">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm sm:h-16 sm:w-16">
                <FileText className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.75} />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 ring-1 ring-inset ring-amber-200">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                  Coming soon · Most requested
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                  AI YouTube Transcript Generator
                </h2>
                <p className="mt-3 text-base text-gray-600 leading-relaxed">
                  Paste any YouTube URL, get the full transcript in TXT, SRT,
                  or VTT format. Plus a one-click AI summary, key quotes
                  extraction, and 3-section article outline. Free, no signup,
                  shipping shortly.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2.5 sm:justify-start">
                  <Link
                    href="#newsletter"
                    className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-amber-600 transition"
                  >
                    Notify me when it ships
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ───────── Tool spotlights. Show, don't tell ───────── */}
      <section className="border-y border-gray-100 bg-gradient-to-b from-white via-gray-50/40 to-white">
        <Container as="div" className="divide-y divide-gray-100">
          <ToolSpotlight
            number={1}
            Icon={Search}
            eyebrow="Keyword research"
            title="Find YouTube keywords creators are actually searching for"
            description="Use the free YouTube keyword tool to find topics, search terms, and related keywords before you film. Build titles, tags, and descriptions around demand instead of guessing."
            href="/tools/youtube-keyword-tool"
            ctaLabel="Find keywords"
            featurePills={[
              "Keyword ideas",
              "Search intent",
              "Related terms",
              "Copy-ready list",
            ]}
            subFeatures={[
              { Icon: TrendingUp, label: "Data from YouTube autocomplete" },
              { Icon: Target, label: "Uncover high-opportunity topics" },
              { Icon: Upload, label: "Export and use instantly" },
            ]}
          />
          <ToolSpotlight
            number={2}
            Icon={WandSparkles}
            eyebrow="AI Title Generator"
            isAI
            reverse
            title="Turn a video idea into click-worthy YouTube titles"
            description="Type your topic and generate YouTube titles across proven angles: curiosity, how-to, listicle, comparison, and contrarian. Pick a stronger title before your next upload."
            href="/tools/youtube-title-generator"
            ctaLabel="Generate titles"
            featureRow={[
              "10 title ideas",
              "Different angles",
              "SEO-ready phrasing",
              "Copy in one click",
            ]}
            secondaryCta={{
              label: "View example",
              href: "/tools/youtube-title-generator",
              Icon: Eye,
            }}
          />
          <ToolSpotlight
            number={3}
            Icon={Tv}
            eyebrow="Channel Starter"
            isAI
            title="Name your YouTube channel with a brandable idea"
            description="Use the YouTube channel name generator to turn your niche, topic, or style into memorable channel names. Good for new creators, rebrands, and niche validation."
            href="/tools/youtube-channel-name-generator"
            ctaLabel="Generate channel names"
            proof="brandable names · niche-based ideas · username-style options"
            mock={<ChannelNameGeneratorScreenshots />}
          />
          <ToolSpotlight
            number={4}
            Icon={Gauge}
            eyebrow="Channel Audit"
            isAI
            reverse
            title="Audit your whole YouTube channel in one click"
            description="Paste a channel and see raw YouTube metrics for the last 30 uploads (median and mean views, publishing cadence, typical length) plus severity-ranked editorial fixes across title, description, hashtags, and chapters."
            href="/tools/youtube-channel-audit"
            ctaLabel="Audit my channel"
            proof="raw metrics · per-dimension band counts · severity-ranked recurring fixes · last 30 uploads"
          />
        </Container>
      </section>

      {/* ───────── Example audit result — real product output, not promise ───────── */}
      <section className="border-y border-gray-100 bg-gradient-to-b from-brand-50/40 via-white to-white py-20 sm:py-24">
        <Container as="div">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-inset ring-brand-100">
                <ClipboardCheck className="h-3.5 w-3.5" strokeWidth={2} />
                Example output
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                What a YouTube audit actually shows you
              </h2>
              <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
                Instead of generic YouTube SEO advice, each audit points to the
                exact part of the upload package that needs work, and how to
                fix it.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check
                    className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Editorial audit
                    </strong>{" "}
                    flags what to fix across title, description, hashtags, chapters
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check
                    className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Per-dimension breakdown
                    </strong>{" "}
                    flags weak title, description, tags, hashtags, and chapters
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check
                    className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                    strokeWidth={2.5}
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Fix-with-AI
                    </strong>{" "}
                    rewrites only the weak parts, ready to paste into YouTube
                    Studio
                  </span>
                </li>
              </ul>
              <Link
                href="/tools/youtube-video-audit"
                className="mt-8 inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
              >
                Audit a video
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>

            {/* Screenshot placeholder — old scoring shots removed for compliance */}
            <div className="hidden lg:block" />
          </div>
        </Container>
      </section>

      {/* ───────── Why use ───────── */}
      <section className="py-20">
        <Container as="div">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Why creators choose these free YouTube SEO tools
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Get the parts paid YouTube SEO suites hide behind subscriptions:
              audits, AI fixes, competitor insights, and tracking. Free, no
              signup, privacy-first.
            </p>
          </div>

          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ Icon, title, description }) => (
              <div key={title}>
                <Icon
                  className="h-5 w-5 text-brand-500"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <h3 className="mt-3 text-base font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────── Who uses ───────── */}
      <section className="border-y border-gray-100 bg-gray-50/40 py-20">
        <Container as="div">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Built for every stage of your YouTube journey
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Solo creators, growing channels, and agencies all use the same
              workflow: validate the idea, optimize the upload, and learn what
              to fix next.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map(({ Icon, label, description }) => (
              <div
                key={label}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {label}
                </h3>
                <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────── Final CTA + inline comparison links ───────── */}
      <section className="py-20 sm:py-24">
        <Container as="div">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Ready to improve your next YouTube upload?
            </h2>
            <p className="mt-4 text-base text-gray-600 sm:text-lg">
              Use free YouTube SEO tools to score your channel, audit a video,
              find keywords, and fix weak metadata before you publish.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/tools/youtube-channel-audit"
                className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
              >
                Score my channel
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link
                href="/tools/youtube-video-audit"
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-brand-300 hover:text-brand-700 transition"
              >
                Audit a video
              </Link>
              <Link
                href="/tools/youtube-keyword-tool"
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-brand-300 hover:text-brand-700 transition"
              >
                Find keywords
              </Link>
            </div>

            <p className="mt-8 text-xs text-gray-500">
              Comparing alternatives? See SEO Check Tools{" "}
              {comparisons.map((c, i) => (
                <span key={c.href}>
                  <Link
                    href={c.href}
                    className="text-gray-600 underline decoration-gray-300 underline-offset-2 hover:text-brand-700 hover:decoration-brand-300 transition"
                  >
                    {c.label.replace(/^vs\s+/, "")}
                  </Link>
                  {i < comparisons.length - 2
                    ? ", "
                    : i === comparisons.length - 2
                    ? ", and "
                    : "."}
                </span>
              ))}
            </p>
          </div>
        </Container>
      </section>

      {/* ───────── Newsletter (secondary, compact) ───────── */}
      <section
        id="newsletter"
        className="border-t border-gray-100 bg-gray-50/40 py-14 scroll-mt-16"
      >
        <Container as="div">
          <div className="mx-auto max-w-xl">
            <NewsletterSignup
              source="homepage"
              title="Get new YouTube SEO tools and guides"
              subtitle="Occasional emails with new tools, creator workflows, and practical YouTube SEO ideas. No spam, unsubscribe anytime."
            />
          </div>
        </Container>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-20">
        <Container as="div">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              YouTube SEO: frequently asked questions
            </h2>
            <p className="mt-3 text-base text-gray-600">
              What YouTube SEO is, what works in 2026, and how this free toolkit
              fits in.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl divide-y divide-gray-200">
            {faqs.map(({ q, a }) => (
              <TrackedDetails
                key={q}
                question={q}
                location="homepage"
                className="group py-5"
              >
                <summary className="flex cursor-pointer items-center justify-between text-base font-medium text-gray-900 list-none">
                  {q}
                  <span className="ml-4 shrink-0 text-gray-400 transition-transform group-open:rotate-45 text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{a}</p>
              </TrackedDetails>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

/**
 * Hero dashboard preview — a fully static SVG/HTML mockup. Shows the
 * flow of a Channel Audit result without any derived numeric metrics.
 * Replaces the removed dashboard-hero.webp which displayed a composite
 * "Channel score 92/100" and "Fix list: 17 fixes" surfaced in the
 * compliance report.
 */
function HeroDashboardPreview() {
  return (
    <div className="relative">
      <div
        className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        style={{ aspectRatio: "16 / 10" }}
      >
        <div className="grid h-full grid-cols-[140px_1fr]">
          {/* Sidebar */}
          <aside className="hidden border-r border-gray-100 bg-gray-50/60 p-4 sm:block">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-brand-500 text-white">
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <span className="text-[11px] font-semibold text-gray-900">
                SEO Check Tools
              </span>
            </div>
            <ul className="mt-5 space-y-2 text-[11px] text-gray-600">
              <li className="rounded-md bg-brand-50 px-2 py-1.5 font-semibold text-brand-700">
                Channel Audit
              </li>
              <li className="px-2 py-1.5">Video Audit</li>
              <li className="px-2 py-1.5">Keyword Tool</li>
              <li className="px-2 py-1.5">Outlier Finder</li>
              <li className="px-2 py-1.5">Niche Check</li>
              <li className="px-2 py-1.5">Title Analyzer</li>
            </ul>
          </aside>

          {/* Content */}
          <div className="flex flex-col gap-3 p-4 sm:p-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Channel overview
              </p>
              <h3 className="mt-0.5 text-sm font-semibold text-gray-900">
                @your-channel · last 30 uploads
              </h3>
            </div>

            {/* Aggregation tiles */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Uploads", value: "30" },
                { label: "Median views", value: "3.2K" },
                { label: "Cadence", value: "2x / wk" },
                { label: "Total views", value: "128K" },
              ].map((t) => (
                <div
                  key={t.label}
                  className="rounded-lg bg-gray-50 px-2.5 py-2"
                >
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                    {t.label}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">
                    {t.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Recommended fixes */}
            <div className="mt-1 flex flex-1 flex-col rounded-lg border border-gray-100 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                Recommended fixes
              </p>
              <ul className="mt-2 space-y-2 text-[11px] text-gray-700">
                {[
                  {
                    label: "Add chapters to 26 uploads",
                    tone: "high" as const,
                  },
                  {
                    label: "Front-load keywords in 12 titles",
                    tone: "medium" as const,
                  },
                  {
                    label: "Strong hashtag discipline — keep it up",
                    tone: "good" as const,
                  },
                ].map((r) => {
                  const pillClass =
                    r.tone === "high"
                      ? "bg-red-50 text-red-700 ring-red-100"
                      : r.tone === "medium"
                      ? "bg-amber-50 text-amber-700 ring-amber-100"
                      : "bg-brand-50 text-brand-700 ring-brand-100";
                  const pillLabel =
                    r.tone === "high"
                      ? "High"
                      : r.tone === "medium"
                      ? "Medium"
                      : "Keep it up";
                  return (
                    <li key={r.label} className="flex items-center gap-2">
                      <span className="flex-1 truncate">{r.label}</span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ring-1 ring-inset ${pillClass}`}
                      >
                        {pillLabel}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
