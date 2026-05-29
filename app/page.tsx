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
import { FeaturedToolCard } from "@/components/FeaturedToolCard";
import { FaqSchema } from "@/components/PageSchemas";
import { HeroAuditInput } from "@/components/HeroAuditInput";
import { TrackedDetails } from "@/components/TrackedDetails";
import { ToolSpotlight } from "@/components/spotlights/ToolSpotlight";
import { MockTitleGenerator } from "@/components/spotlights/MockTitleGenerator";
import { MockTagExtractor } from "@/components/spotlights/MockTagExtractor";
import { MockThumbnailDownloader } from "@/components/spotlights/MockThumbnailDownloader";
import { featuredTools } from "@/lib/tools-catalog";

const benefits = [
  {
    Icon: CircleDollarSign,
    title: "100% free",
    description:
      "No subscription, no trial, no per-tool credits. Every tool on SEO Check Tools is free for personal and commercial use.",
  },
  {
    Icon: Wand2,
    title: "AI where it counts",
    description:
      "Powered by Claude Haiku for short, high-quality generations. Browser-side utilities stay browser-side — no LLM cost, no delay.",
  },
  {
    Icon: Lock,
    title: "Privacy by default",
    description:
      "No accounts. No analytics that follow you. Your prompts and outputs are not stored — IPs are held in memory only for fair-use limits.",
  },
  {
    Icon: Zap,
    title: "No signup, no friction",
    description:
      "Open a tool, paste your input, copy the result. That's the whole flow. No email, no credit card, no waiting list.",
  },
  {
    Icon: ScanSearch,
    title: "Competitor research",
    description:
      "Extract any video's tags. See what's actually ranking. Get the same intel competitors pay $19/month for, free.",
  },
  {
    Icon: HeartHandshake,
    title: "Built for creators",
    description:
      "Every tool was designed around real YouTube SEO tasks — titles, tags, hashtags, thumbnails, descriptions, chapters, earnings, ideas.",
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
    q: "Is SEO Check Tools really free?",
    a: "Yes — all 15 tools are free to use without an account. AI-powered tools have a daily per-IP fair-use limit (15 generations/day) to keep the compute affordable. Browser-side and serverless utilities have no limit.",
  },
  {
    q: "Do you store my prompts or outputs?",
    a: "No. Prompts go to Anthropic's Claude API for processing and are not retained on our side. Outputs are returned to your browser and never written to a database. We briefly hold your IP address in memory paired with the date, only to enforce the daily fair-use limit.",
  },
  {
    q: "Can I use the AI outputs commercially?",
    a: "Yes. You may use anything our tools generate for any lawful purpose, including commercial projects, without attribution. AI-generated content may not be copyrightable in all jurisdictions — see our terms for details.",
  },
  {
    q: "Why is it free?",
    a: "Most paid YouTube SEO suites ($19–49/month) are built on the same APIs and open data we use. Operating costs for the toolset are low, so we can run it free, supported by lightweight contextual ads and partner links to deeper tools (Ahrefs, TubeBuddy, Canva) when relevant.",
  },
  {
    q: "Which AI model powers the generators?",
    a: "Claude Haiku 4.5 from Anthropic — fast, lightweight, and well-suited to the short, structured creative tasks our tools focus on.",
  },
  {
    q: "Will more tools be added?",
    a: "Yes. The current 15 tools cover the YouTube creator workflow — most recently the Video Audit and Title Score Checker. Multi-platform expansion (TikTok, Instagram, Pinterest) is planned. You can request a tool via the contact page.",
  },
];

export default function HomePage() {
  const tools = featuredTools(8);

  return (
    <>
      <FaqSchema faqs={faqs} />
      {/* ───────── Hero ───────── */}
      <Container as="section" className="pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          AI · Free · No signup · For YouTube creators
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
          Free YouTube SEO Toolkit
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
          Generate titles, descriptions, tags, and ideas with AI. Download
          thumbnails, calculate earnings, extract competitors&apos; tags. Everything
          a YouTube creator needs, in one place.
        </p>
      </Container>

      {/* ───────── Audit feature band — flagship tool, positioned right below hero ───────── */}
      <section className="border-y border-brand-100/70 bg-gradient-to-b from-brand-50/50 via-white to-white py-12 sm:py-16">
        <Container as="div">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              New · Flagship tool
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Audit any YouTube video in 5 seconds
            </h2>
            <p className="mt-3 text-base text-gray-600 sm:text-lg">
              Paste a URL — get a 0-100 score for title, description, tags,
              hashtags, and chapters with a one-click fix for every weakness.
            </p>
            <HeroAuditInput />
            <p className="mt-3 text-xs text-gray-500">
              No signup. No email. 30 audits per day, free forever.
            </p>
          </div>
        </Container>
      </section>

      {/* ───────── Featured tools grid ───────── */}
      <Container as="section" id="tools" className="pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Try the tools
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Pick a tool and get a result in seconds. No signup, no waiting.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {tools.map((tool) => (
            <FeaturedToolCard key={tool.slug} tool={tool} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-brand-300 hover:bg-brand-50/40 hover:text-gray-900 transition"
          >
            View all 15 tools
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

      {/* ───────── How it works ───────── */}
      <section className="border-y border-gray-100 bg-gray-50/40 py-20">
        <Container as="div">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              How it works
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Three steps. No accounts, no waiting.
            </p>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Pick a tool",
                description:
                  "Choose from 15 tools — video audit, title generator, tag extractor, thumbnail downloader, money calculator, more.",
              },
              {
                step: "2",
                title: "Enter your input",
                description:
                  "Paste a URL, type a topic, or fill the form. Most tools accept input in plain text or as a YouTube link.",
              },
              {
                step: "3",
                title: "Copy the result",
                description:
                  "Get a clean output instantly. Copy to clipboard or download. No emails, no sign-up wall.",
              },
            ].map(({ step, title, description }) => (
              <div key={step}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-brand-200">
                  {step}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
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
