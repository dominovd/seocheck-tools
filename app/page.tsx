import Link from "next/link";
import {
  CircleDollarSign,
  Lock,
  Wand2,
  Zap,
  ScanSearch,
  HeartHandshake,
  ArrowRight,
  WandSparkles,
  ScanLine,
  ImageDown,
} from "lucide-react";
import { Container } from "@/components/Container";
import { FaqSchema } from "@/components/PageSchemas";
import { HeroAuditInput } from "@/components/HeroAuditInput";
import { TrackedDetails } from "@/components/TrackedDetails";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ToolSpotlight } from "@/components/spotlights/ToolSpotlight";
import { MockTitleGenerator } from "@/components/spotlights/MockTitleGenerator";
import { MockTagExtractor } from "@/components/spotlights/MockTagExtractor";
import { MockThumbnailDownloader } from "@/components/spotlights/MockThumbnailDownloader";
import {
  toolsByStage,
  stageLabel,
  stageTagline,
  STAGE_ORDER,
} from "@/lib/tools-catalog";

const benefits = [
  {
    Icon: CircleDollarSign,
    title: "100% free",
    description:
      "No subscription, no trial, no per-tool credits. Every tool — including Visibility Score, Channel Audit, and the AI Fix-with-AI orchestrator — is free for personal and commercial use.",
  },
  {
    Icon: Wand2,
    title: "AI where it counts",
    description:
      "Claude Haiku powers the AI YouTube Coach (one-click fixes after every audit), the Competitor and Outlier pattern analysis, and the Visibility Score one-sentence summary. Browser-side utilities stay browser-side — no LLM cost, no delay.",
  },
  {
    Icon: Lock,
    title: "Privacy by default",
    description:
      "No accounts. No analytics that follow you. Your prompts and outputs are not stored. Channel IDs in our audit log are SHA-256-hashed before storage — IPs are held in memory only for fair-use limits.",
  },
  {
    Icon: Zap,
    title: "Measurement, not just generation",
    description:
      "Composite Visibility Score (0-100) summarizes a channel's standing in one shareable number. Channel Audit, Video Audit, and Outlier Finder turn diagnosis into action. The toolkit is a measurement instrument first, generators second.",
  },
  {
    Icon: ScanSearch,
    title: "Competitor intelligence + outliers",
    description:
      "Competitor Channel Analyzer pulls top 10 + latest 10 with AI pattern summary. Outlier Finder surfaces channel videos that broke through 3× the median — the data agencies pay Spotter $50K+/year for, free.",
  },
  {
    Icon: HeartHandshake,
    title: "Historical trend tracking",
    description:
      "Track this channel on any Visibility Score result and a weekly cron re-scores it every Monday. After a few weeks, the timeline shows your trajectory — the trend competitors only show behind a paywall.",
  },
];

const audiences = [
  {
    label: "YouTubers",
    description: "Optimize titles, tags, and descriptions before publishing.",
  },
  {
    label: "Content marketers",
    description: "Generate B2B video metadata at scale across multiple brands.",
  },
  {
    label: "Social media managers",
    description: "Find tags, hashtags, and ideas without paying $30/month tools.",
  },
  {
    label: "Affiliate marketers",
    description: "Research competitors, find low-competition keywords, ship faster.",
  },
  {
    label: "Educators",
    description: "Format chapters, generate descriptions, transcribe lectures.",
  },
  {
    label: "Agencies",
    description: "Free toolbox for client work that doesn't burn the budget.",
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
    q: "What is the YouTube Visibility Score?",
    a: "Composite 0-100 metric across four weighted sub-scores: CTR Potential (35% — title quality), Metadata Quality (25% — description/hashtags/chapters discipline), Niche Headroom (15% — reach beyond subscriber base), and Growth Trajectory (25% — outlier rate). Paste any channel handle or URL and get an A-F grade with an AI one-sentence summary in 5 seconds. Shareable as a single number, drillable into specific sub-scores for action.",
  },
  {
    q: "How does the Fix-with-AI button work?",
    a: "After Video Audit identifies weak dimensions, a single Fix-with-AI button runs ONE Claude Haiku call that returns aligned replacements for ONLY the weak or fair fields (title, description, tags, hashtags). Strong dimensions return null — the AI doesn't waste effort rewriting what's already working. Copy the new package straight into YouTube Studio. Turns the audit from diagnosis into one-click solution.",
  },
  {
    q: "Can I track a channel's growth over time?",
    a: "Yes. On any Visibility Score result, click 'Track this channel'. A weekly Vercel cron re-scores the channel every Monday and accumulates a timeline. After 2-3 weeks the chart shows your Visibility Score trajectory — the trend competitors only show behind a paywall. Up to 200 channels tracked at any time across the site.",
  },
  {
    q: "What's the difference between Video Audit and Channel Audit?",
    a: "Video Audit scores ONE video across title, description, tags, hashtags, and chapters. Channel Audit runs the same engine against your channel's LAST 10 UPLOADS and aggregates the result — per-dimension averages, band distribution, the worst dimension flagged, plus an AI list of recurring channel-wide issues. The first is diagnosis for one video; the second is pattern detection across your output.",
  },
  {
    q: "Is SEO Check Tools really free?",
    a: "Yes — all 21 tools are free without an account. AI-powered tools have a daily per-IP fair-use limit (15/day for generators, 3-10/day for YouTube-API-heavy analyzers and audits like Visibility Score, Channel Audit, Competitor Analyzer, Outlier Finder). Browser-side tools (Thumbnail Preview, Title Score Checker) have no limit.",
  },
  {
    q: "Do you store my prompts, outputs, or channel data?",
    a: "Prompts go to Anthropic's Claude API and are not retained on our side. Outputs return to your browser and are never written to a database. Channel IDs in the anonymous audit log are SHA-256-hashed before storage so reverse lookup is impossible — the log is bounded to the most recent 10,000 entries per tool for our internal YouTube Studies pages. IPs are held in memory only to enforce daily fair-use limits, never written to disk.",
  },
  {
    q: "Why is it free when VidIQ/TubeBuddy charge $19-49/month?",
    a: "Most paid YouTube SEO suites are built on the same YouTube Data API and open data we use. Operating cost for our toolkit is low because we run heuristics where we can (Title Score Checker, Channel Audit aggregation) and only call AI for genuinely creative work (Fix-with-AI, pattern summaries). The toolkit is supported by lightweight contextual ads and partner links to deeper tools (Ahrefs, Canva) when relevant.",
  },
  {
    q: "Which AI model powers the analysis and fixes?",
    a: "Claude Haiku 4.5 from Anthropic. Used for: the Fix-with-AI orchestrator, Competitor Analyzer pattern + direction summaries, Outlier Finder differential analysis, Channel Audit recurring-issue extraction, and Visibility Score one-sentence positioning. Fast, lightweight, and constrained by system prompts to reject platitudes ('be authentic', 'post consistently') and reference actual data.",
  },
  {
    q: "Will more tools be added?",
    a: "Yes. The current 21 tools cover the YouTube creator workflow across Research, Optimize, Publish, and Analyze stages. Most recent additions: Niche Check verdict tool, YouTube Visibility Score, AI Fix-with-AI button, Channel Audit, Outlier Finder, Thumbnail Preview, Historical Tracking. Multi-platform expansion (TikTok, Instagram, Pinterest) is on the roadmap.",
  },
];

export default function HomePage() {
  const stageGroups = toolsByStage();

  return (
    <>
      <FaqSchema faqs={faqs} />
      {/* ───────── Hero ───────── */}
      <Container as="section" className="pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          AI · Free · No signup · For YouTube creators
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
          Score, audit, and{" "}
          <span className="text-brand-600">fix any YouTube channel</span>.
          Free.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
          Composite Visibility Score across CTR, metadata, niche headroom, and
          growth trajectory. Whole-channel Audit with one-click AI fixes for
          every weak dimension. Outlier Finder for breakthrough videos. Weekly
          historical tracking — plus 16 single-purpose generators and utilities.
        </p>
      </Container>

      {/* ───────── Audit feature band — flagship tool, positioned right below hero ───────── */}
      <section className="border-y border-brand-100/70 bg-gradient-to-b from-brand-50/50 via-white to-white py-12 sm:py-16">
        <Container as="div">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Flagship · Video Audit + AI Fix
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Audit any YouTube video in 5 seconds, fix every weak spot in one click
            </h2>
            <p className="mt-3 text-base text-gray-600 sm:text-lg">
              Paste a URL — get a 0-100 score for title, description, tags, hashtags,
              and chapters. Then one click triggers an AI YouTube Coach that
              rewrites the weak dimensions into aligned replacements you can copy
              straight into YouTube Studio.
            </p>
            <HeroAuditInput />
            <p className="mt-3 text-xs text-gray-500">
              No signup. No email. 30 audits per day, free forever.
            </p>
          </div>
        </Container>
      </section>

      {/* ───────── The creator workflow — tools by stage ───────── */}
      <Container as="section" id="tools" className="pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            The creator workflow
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Your tools, by stage of the work
          </h2>
          <p className="mt-3 text-base text-gray-600">
            We cover every step a YouTube creator runs through — pick a tool
            for the stage you&apos;re at.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {STAGE_ORDER.map((stage, i) => {
            const stageTools = stageGroups[stage];
            const shown = stageTools.slice(0, 4);
            const remaining = stageTools.length - shown.length;
            return (
              <article
                key={stage}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 font-mono text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
                    {i + 1}
                  </span>
                  <p className="text-xs font-mono tabular-nums text-gray-400">
                    {stageTools.length} {stageTools.length === 1 ? "tool" : "tools"}
                  </p>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {stageLabel(stage)}
                </h3>
                <p className="mt-1 text-sm text-brand-700">{stageTagline(stage)}</p>

                <ul className="mt-4 flex-1 space-y-1.5">
                  {shown.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="text-sm text-gray-700 hover:text-brand-700 transition"
                      >
                        {tool.shortTitle}
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/tools/${stage}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-brand-700 transition"
                >
                  Browse all {stageTools.length} {stageLabel(stage).toLowerCase()} tools
                  <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-brand-300 hover:bg-brand-50/40 hover:text-gray-900 transition"
          >
            View all 21 tools
            <ArrowRight className="h-4 w-4 text-gray-400" strokeWidth={2} />
          </Link>
        </div>
      </Container>

      {/* ───────── Tool spotlights — show, don't tell ───────── */}
      <section className="border-y border-gray-100 bg-gradient-to-b from-white via-gray-50/40 to-white">
        <Container as="div" className="divide-y divide-gray-100">
          <ToolSpotlight
            Icon={WandSparkles}
            eyebrow="AI Generator"
            isAI
            title="Click-worthy titles in seconds, not hours"
            description="Type your topic. Claude Haiku returns 10 SEO-optimized YouTube titles in different angles — curious, listicle, how-to, comparison, contrarian. Pick the one that fits, copy it, ship the video."
            href="/tools/youtube-title-generator"
            ctaLabel="Try the title generator"
            mock={<MockTitleGenerator />}
          />
          <ToolSpotlight
            Icon={ScanLine}
            eyebrow="Competitor research"
            reverse
            title="See the exact tags your competitors are ranking with"
            description="YouTube hides tags from public view — but they're still in the page source. Paste any competitor's video URL and pull their full tag list in one click. The same intel TubeBuddy charges $19/month for, free."
            href="/tools/youtube-tag-extractor"
            ctaLabel="Try the tag extractor"
            mock={<MockTagExtractor />}
          />
          <ToolSpotlight
            Icon={ImageDown}
            eyebrow="Utility"
            title="Every thumbnail size, one click"
            description="Need a competitor's thumbnail for your design reference board? Or your own thumbnail in print-quality 1280 × 720? Paste the URL — get every available resolution at once, no watermarks, no signup."
            href="/tools/youtube-thumbnail-downloader"
            ctaLabel="Try the thumbnail downloader"
            mock={<MockThumbnailDownloader />}
          />
        </Container>
      </section>


      {/* ───────── Why use ───────── */}
      <section className="py-20">
        <Container as="div">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Why creators use SEO Check Tools
            </h2>
            <p className="mt-3 text-base text-gray-600">
              What you get that paid YouTube SEO suites either charge for or don&apos;t offer at all.
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
              Who uses SEO Check Tools
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Anyone who works with YouTube content — solo or in a team.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map(({ label, description }) => (
              <div key={label}>
                <h3 className="text-base font-semibold text-gray-900">{label}</h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────── Switching from another tool? ───────── */}
      <section className="py-20">
        <Container as="div">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Switching from another tool?
            </h2>
            <p className="mt-3 text-base text-gray-600">
              See how SEO Check Tools compares — what&apos;s the same, what&apos;s
              different, what&apos;s missing.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {comparisons.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:border-brand-300 hover:bg-brand-50/40 hover:text-gray-900 transition"
              >
                {c.label}
                <ArrowRight className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────── Newsletter ───────── */}
      <section className="py-16">
        <Container as="div">
          <div className="mx-auto max-w-xl">
            <NewsletterSignup
              source="homepage"
              title="Get notified when we ship new tools"
              subtitle="Occasional emails — typically when a new tool ships or a major guide drops. No spam, never sold, unsubscribe in one click."
            />
          </div>
        </Container>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-20">
        <Container as="div">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Quick answers to common questions about seocheck.tools.
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
