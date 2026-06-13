import Link from "next/link";
import { Container } from "@/components/Container";
import { BreadcrumbSchema, FaqSchema } from "@/components/PageSchemas";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { allToolsSorted } from "@/lib/tools-catalog";

const META_DESCRIPTION =
  "SEO Check Tools is a free YouTube SEO platform with 21 creator tools for research, optimization, publishing, audits, competitor analysis, and channel growth.";
const OG_DESCRIPTION =
  "Free YouTube SEO tools for creators: research, optimize, publish, analyze, audit channels, find outliers, and improve metadata without signup.";

const base = buildMetadata({
  title: "About SEO Check Tools | Free YouTube SEO Tools",
  description: META_DESCRIPTION,
  path: "about",
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

const FAQS = [
  {
    q: "Is SEO Check Tools really free?",
    a: "Yes. The tools are free to use without signup. Some AI-powered tools have daily fair-use limits so the platform can stay available without charging users.",
  },
  {
    q: "Do I need a YouTube account to use the tools?",
    a: "No. Most tools work with public YouTube URLs, keywords, handles, video IDs, or channel IDs. You do not need to connect a YouTube account.",
  },
  {
    q: "Is SEO Check Tools affiliated with YouTube?",
    a: "No. SEO Check Tools is an independent site and is not affiliated with YouTube or Alphabet Inc.",
  },
  {
    q: "Do you store my searches?",
    a: "The site uses temporary caching and rate limiting to keep tools fast and affordable. It does not create user accounts or maintain a personal search history.",
  },
  {
    q: "Why use AI in some tools but not all tools?",
    a: "AI is useful for generation, summarization, and pattern detection. It is unnecessary for simple utilities, so those tools stay faster and lighter without AI.",
  },
];

export default function AboutPage() {
  const liveCount = allToolsSorted().filter((t) => t.status === "live").length;

  return (
    <Container as="main" className="py-12 sm:py-16">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "About", url: `${siteConfig.url}/about` },
        ]}
      />
      <FaqSchema faqs={FAQS} />

      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          About {siteConfig.name}
        </h1>

        <p className="mt-6 text-base text-gray-700 leading-relaxed">
          {siteConfig.name} is a free YouTube SEO platform for creators,
          marketers, and small teams who want better publishing decisions
          without paying for a full monthly suite.
        </p>
        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          The site includes {liveCount} tools across the creator workflow:
          Research, Optimize, Publish, and Analyze. You can research
          keywords and niches, inspect competitors, generate titles and
          tags, preview thumbnails, audit videos, estimate earnings, find
          outlier videos, and track channel visibility signals.
        </p>
        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          The core idea is simple: YouTube creators should be able to make
          smarter content decisions before each upload without creating an
          account, starting a trial, or paying for tools they only use a few
          times a month.
        </p>

        {/* What Makes It Different */}
        <h2 className="mt-14 text-2xl font-semibold tracking-tight text-gray-900">
          What makes it different
        </h2>
        <p className="mt-5 text-base text-gray-700 leading-relaxed">
          Most YouTube SEO tools fall into two frustrating categories.
        </p>
        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          Paid suites like TubeBuddy, vidIQ, and similar platforms bundle
          useful research and optimization features into subscriptions that
          can cost $19-49/month. That can make sense for full-time teams,
          but it is overkill for many creators who just need help choosing a
          topic, improving a title, checking tags, or auditing one video
          before publishing.
        </p>
        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          Free alternatives often have the opposite problem: outdated
          interfaces, aggressive ads, limited functionality, and tools that
          feel like they were built once and abandoned.
        </p>
        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          {siteConfig.name} sits between those worlds. The goal is to keep
          the useful measurement layer free, make the interface calm and
          fast, and use AI only where it improves the result.
        </p>

        {/* What You Can Do Here */}
        <h2 className="mt-14 text-2xl font-semibold tracking-tight text-gray-900">
          What you can do here
        </h2>

        <div className="mt-5">
          <h3 className="text-base font-semibold text-gray-900">
            Use the Research tools to decide what to make
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed">
            <li>
              Check whether a{" "}
              <Link href="/tools/youtube-niche-check" className="link">
                YouTube niche
              </Link>{" "}
              is worth entering.
            </li>
            <li>
              Find{" "}
              <Link href="/tools/youtube-competitor-analyzer" className="link">
                competitor channels
              </Link>{" "}
              and their winning content patterns.
            </li>
            <li>
              Discover{" "}
              <Link href="/tools/youtube-outlier-finder" className="link">
                outlier videos
              </Link>{" "}
              that beat a channel&apos;s usual performance.
            </li>
            <li>
              Research{" "}
              <Link href="/tools/youtube-keyword-tool" className="link">
                YouTube keywords
              </Link>{" "}
              and video ideas.
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-base font-semibold text-gray-900">
            Use the Optimize tools to improve packaging
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed">
            <li>
              Score and generate{" "}
              <Link href="/tools/youtube-title-generator" className="link">
                YouTube titles
              </Link>
              .
            </li>
            <li>Extract, generate, and organize tags.</li>
            <li>
              Preview thumbnails in a realistic YouTube layout.
            </li>
            <li>Generate hashtags and metadata ideas.</li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-base font-semibold text-gray-900">
            Use the Publish tools to prepare the upload
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed">
            <li>Generate descriptions.</li>
            <li>Format chapters.</li>
            <li>Create embed code.</li>
            <li>Clean up metadata before the video goes live.</li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-base font-semibold text-gray-900">
            Use the Analyze tools to understand performance
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed">
            <li>
              Audit a single{" "}
              <Link href="/tools/youtube-video-audit" className="link">
                video
              </Link>
              .
            </li>
            <li>
              Audit a whole{" "}
              <Link href="/tools/youtube-channel-audit" className="link">
                channel
              </Link>
              .
            </li>
            <li>Estimate revenue.</li>
            <li>
              Check{" "}
              <Link href="/tools/youtube-visibility-score" className="link">
                visibility signals
              </Link>{" "}
              and track channel progress over time.
            </li>
          </ul>
        </div>

        {/* Our Principles */}
        <h2 className="mt-14 text-2xl font-semibold tracking-tight text-gray-900">
          Our principles
        </h2>

        <dl className="mt-5 space-y-6 text-base text-gray-700">
          <div>
            <dt className="font-semibold text-gray-900">Free, no signup</dt>
            <dd className="mt-1.5 leading-relaxed">
              Every tool is free to use. There is no account creation, email
              capture, credit card, or trial that turns into a subscription.
            </dd>
            <dd className="mt-2 leading-relaxed">
              AI-powered tools have fair-use limits to keep compute costs
              predictable. Browser-side tools stay instant and do not use AI
              when they do not need it.
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-gray-900">
              AI where it actually helps
            </dt>
            <dd className="mt-1.5 leading-relaxed">
              We use AI for tasks where it can produce a better result than
              a static template: title ideas, descriptions, tags, video
              ideas, audit fixes, competitor pattern summaries, outlier
              analysis, and recurring issue extraction.
            </dd>
            <dd className="mt-2 leading-relaxed">
              We do not use AI just to make a tool sound impressive. Simple
              utilities like thumbnail downloads, embed code, chapter
              formatting, title scoring, and thumbnail previews stay
              lightweight and browser-side where possible.
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-gray-900">Privacy by default</dt>
            <dd className="mt-1.5 leading-relaxed">
              We do not build the product around tracking users.
            </dd>
            <dd className="mt-2 leading-relaxed">
              There are no invasive analytics scripts, no cross-site
              tracking, and no account-level profile of your searches. Rate
              limits use IP-based checks, and temporary data is kept only as
              long as needed for bot protection, caching, and fair-use
              limits.
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-gray-900">No feature gating</dt>
            <dd className="mt-1.5 leading-relaxed">
              The most useful parts of the platform are not hidden behind a
              paid tier. Tools like tag extraction, competitor research,
              video audits, and visibility checks are free because the site
              is designed to be useful without a sales wall in the middle of
              the workflow.
            </dd>
          </div>
        </dl>

        {/* How We Keep It Free */}
        <h2 className="mt-14 text-2xl font-semibold tracking-tight text-gray-900">
          How we keep it free
        </h2>
        <p className="mt-5 text-base text-gray-700 leading-relaxed">
          {siteConfig.name} is intentionally lightweight.
        </p>
        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          Hosting and infrastructure costs are kept low with services like
          Vercel, Cloudflare, and Upstash. AI is the main variable cost, so
          AI-heavy features use daily fair-use limits and caching where
          possible.
        </p>
        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          In the future, the site may use clearly labeled contextual ads or
          a small number of affiliate links to tools we genuinely think are
          useful. If that happens, it will be disclosed clearly. The core
          tools will stay free.
        </p>

        {/* Tech Stack */}
        <h2 className="mt-14 text-2xl font-semibold tracking-tight text-gray-900">
          The tech stack
        </h2>
        <p className="mt-5 text-base text-gray-700 leading-relaxed">
          {siteConfig.name} is built with:
        </p>
        <ul className="mt-4 space-y-2 text-base text-gray-700 leading-relaxed">
          <li className="flex gap-3">
            <span
              className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
              aria-hidden="true"
            />
            <span>Next.js on Vercel for the web app.</span>
          </li>
          <li className="flex gap-3">
            <span
              className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
              aria-hidden="true"
            />
            <span>Anthropic Claude Haiku for selected AI workflows.</span>
          </li>
          <li className="flex gap-3">
            <span
              className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
              aria-hidden="true"
            />
            <span>Upstash Redis for caching and rate limiting.</span>
          </li>
          <li className="flex gap-3">
            <span
              className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
              aria-hidden="true"
            />
            <span>Cloudflare Turnstile for bot protection.</span>
          </li>
          <li className="flex gap-3">
            <span
              className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
              aria-hidden="true"
            />
            <span>
              Vercel Analytics for lightweight, cookieless page-view
              measurement.
            </span>
          </li>
        </ul>
        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          That is the whole stack involved in normal use of the site.
        </p>

        {/* Contact */}
        <h2 className="mt-14 text-2xl font-semibold tracking-tight text-gray-900">
          Contact
        </h2>
        <p className="mt-5 text-base text-gray-700 leading-relaxed">
          Have feedback, a bug report, a feature request, or a partnership
          idea?
        </p>
        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          Email{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="link">
            {siteConfig.contactEmail}
          </a>{" "}
          or use the{" "}
          <Link href="/contact" className="link">
            contact page
          </Link>
          . We read every message.
        </p>

        {/* FAQ */}
        <h2 className="mt-14 text-2xl font-semibold tracking-tight text-gray-900">
          FAQ
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
      </article>
    </Container>
  );
}
