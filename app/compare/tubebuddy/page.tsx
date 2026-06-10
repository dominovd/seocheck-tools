import Link from "next/link";
import { ArrowRight, Check, X, Sparkles } from "lucide-react";
import { Container } from "@/components/Container";
import { FaqSchema, BreadcrumbSchema } from "@/components/PageSchemas";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const PAGE_TITLE = "SEO Check Tools vs TubeBuddy: Free YouTube SEO Tool";
const PAGE_DESCRIPTION =
  "Looking for a free TubeBuddy alternative? Compare SEO Check Tools vs TubeBuddy across YouTube SEO tools, audits, AI generators, pricing, and workflows.";
const OG_DESCRIPTION =
  "See which YouTube SEO tool fits your workflow: TubeBuddy for deep Studio workflows, or SEO Check Tools for free no-signup audits, generators, and keyword research.";
const TWITTER_TITLE = "SEO Check Tools vs TubeBuddy";
const TWITTER_DESCRIPTION =
  "Compare pricing, features, audits, AI generators, keyword research, and creator workflows.";

const base = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "compare/tubebuddy",
  noBrand: true,
});

export const metadata = {
  ...base,
  openGraph: {
    ...base.openGraph,
    title: PAGE_TITLE,
    description: OG_DESCRIPTION,
  },
  twitter: {
    ...base.twitter,
    title: TWITTER_TITLE,
    description: TWITTER_DESCRIPTION,
  },
};

const BREADCRUMBS = [
  { name: "Home", url: siteConfig.url },
  { name: "Comparisons", url: `${siteConfig.url}/compare` },
  {
    name: "SEO Check Tools vs TubeBuddy",
    url: `${siteConfig.url}/compare/tubebuddy`,
  },
];

const RELATED_COMPARISONS = [
  {
    slug: "vidiq",
    name: "VidIQ",
    blurb: "Daily ideas, dashboard analytics, AI optimization for YouTube creators.",
  },
  {
    slug: "tuberanker",
    name: "TubeRanker",
    blurb: "Mid-market YouTube SEO with tag generator, audit, and rank tracker.",
  },
  {
    slug: "keywordtool",
    name: "Keywordtool.io",
    blurb: "Autocomplete-based keyword research across YouTube, Google, and more.",
  },
  {
    slug: "keyword-surfer",
    name: "Keyword Surfer",
    blurb: "Chrome extension for in-SERP keyword volume and related terms.",
  },
];

type ComparisonRow = {
  need: string;
  ours: string;
  theirs: string;
};

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    need: "Quick free tools",
    ours: "Yes, no signup",
    theirs: "Limited free tools, account/extension workflow",
  },
  {
    need: "YouTube keyword research",
    ours: "Free keyword tool",
    theirs: "Keyword Explorer / SEO Studio",
  },
  {
    need: "Title, tag, description generators",
    ours: "Free AI generators",
    theirs: "Available across TubeBuddy tools/plans",
  },
  {
    need: "Video / channel audit",
    ours: "Free Video Audit + Channel Audit",
    theirs: "Best Practice Audit / SEO workflows",
  },
  {
    need: "Competitor research",
    ours: "Competitor analyzer + outlier finder",
    theirs: "Channel insights, competitor tools depending on plan",
  },
  {
    need: "In-YouTube Studio workflow",
    ours: "No",
    theirs: "Yes, browser extension",
  },
  {
    need: "Bulk editing",
    ours: "No",
    theirs: "Yes, especially for deeper paid workflows",
  },
  {
    need: "A/B testing",
    ours: "No",
    theirs: "Yes, TubeBuddy offers A/B testing",
  },
  {
    need: "Signup / channel authorization",
    ours: "No for most tools",
    theirs: "Yes, install extension and authorize channel",
  },
  {
    need: "Best for",
    ours: "Fast free checks and generators",
    theirs: "Deep channel management and Studio productivity",
  },
];

const FAQS = [
  {
    q: "Is SEO Check Tools better than TubeBuddy?",
    a: "Not universally. SEO Check Tools is better for free, no-signup YouTube SEO tasks. TubeBuddy is better for creators who want a full browser extension and deeper YouTube Studio workflow.",
  },
  {
    q: "Is SEO Check Tools a free TubeBuddy alternative?",
    a: "Yes, if you need quick tools like keyword research, title generation, tag generation, descriptions, audits, and competitor checks. It is not a replacement for TubeBuddy's bulk editing, A/B testing, or in-Studio extension features.",
  },
  {
    q: "Do I need to connect my YouTube channel?",
    a: "SEO Check Tools does not require a connected account for most tools. TubeBuddy's workflow typically involves signing up, installing the browser extension, and authorizing access to your channel.",
  },
  {
    q: "Which tool is better for beginners?",
    a: "SEO Check Tools is easier if you want to start without setup. TubeBuddy can be better once you want a full YouTube Studio companion and are ready to manage optimization inside your channel workflow.",
  },
  {
    q: "Which tool is better for agencies?",
    a: "TubeBuddy is stronger for ongoing channel management and bulk workflows. SEO Check Tools is useful for fast client checks, research, and free audit-style outputs without adding paid seats.",
  },
];

function ComparisonValue({ value }: { value: string }) {
  if (value === "Yes" || value.startsWith("Yes,") || value.startsWith("Yes ")) {
    return (
      <span className="inline-flex items-start gap-1.5">
        <Check
          className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5"
          strokeWidth={2.5}
          aria-hidden="true"
        />
        <span>{value}</span>
      </span>
    );
  }
  if (value === "No") {
    return (
      <span className="inline-flex items-start gap-1.5 text-gray-500">
        <X
          className="h-4 w-4 shrink-0 text-gray-400 mt-0.5"
          strokeWidth={2.5}
          aria-hidden="true"
        />
        <span>{value}</span>
      </span>
    );
  }
  if (value.startsWith("No ")) {
    return (
      <span className="inline-flex items-start gap-1.5">
        <X
          className="h-4 w-4 shrink-0 text-gray-400 mt-0.5"
          strokeWidth={2.5}
          aria-hidden="true"
        />
        <span>{value}</span>
      </span>
    );
  }
  return <span>{value}</span>;
}

export default function TubeBuddyCompareePage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={BREADCRUMBS} />

      {/* Hero */}
      <section className="py-16 sm:py-20">
        <Container as="div">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Comparison
            </p>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {siteConfig.name} vs TubeBuddy: which YouTube SEO tool should you use?
            </h1>
            <p className="mt-5 text-base text-gray-600 sm:text-lg leading-relaxed">
              TubeBuddy is a full YouTube growth suite with a browser extension,
              deep Studio workflows, bulk tools, and paid plans. {siteConfig.name}{" "}
              is a free, no-signup toolkit for quick YouTube SEO audits, keyword
              research, generators, and copy-ready fixes.
            </p>
          </div>

          {/* Mini verdict callout */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-brand-100 bg-brand-50/50 p-5 sm:p-6">
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
              <span className="font-semibold text-brand-700">Short answer:</span>{" "}
              use TubeBuddy if you need in-Studio workflows, bulk edits, A/B
              testing, and advanced channel management. Use {siteConfig.name} if
              you want free YouTube SEO tools you can open instantly without
              connecting your channel.
            </p>
          </div>
        </Container>
      </section>

      {/* Comparison Table */}
      <section className="border-y border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <Container as="div">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Feature by feature: what each tool covers
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              Compared by the job creators actually hire each tool for, not by
              raw feature count.
            </p>
          </div>

          {/* Desktop table */}
          <div className="mx-auto mt-10 hidden max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white sm:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold text-gray-500">
                    Need
                  </th>
                  <th className="px-5 py-4 text-left font-semibold text-brand-700">
                    {siteConfig.name}
                  </th>
                  <th className="px-5 py-4 text-left font-semibold text-gray-700">
                    TubeBuddy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.need}>
                    <th className="px-5 py-3.5 text-left font-medium text-gray-900 align-top">
                      {row.need}
                    </th>
                    <td className="px-5 py-3.5 align-top">
                      <ComparisonValue value={row.ours} />
                    </td>
                    <td className="px-5 py-3.5 align-top text-gray-600">
                      <ComparisonValue value={row.theirs} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:hidden">
            {COMPARISON_ROWS.map((row) => (
              <div
                key={row.need}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {row.need}
                </p>
                <div className="mt-3 grid gap-2 text-sm">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                      {siteConfig.name}
                    </p>
                    <p className="mt-0.5 text-gray-800">
                      <ComparisonValue value={row.ours} />
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      TubeBuddy
                    </p>
                    <p className="mt-0.5 text-gray-700">
                      <ComparisonValue value={row.theirs} />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Who Should Choose What */}
      <section className="py-16 sm:py-20">
        <Container as="div">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Choose based on the workflow you actually need
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Choose {siteConfig.name} if
              </p>
              <p className="mt-3 text-sm text-gray-800 leading-relaxed">
                You want free YouTube SEO tools for quick checks: keyword ideas,
                titles, tags, descriptions, video audits, channel scores, and
                competitor research without signing in or connecting a channel.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                Choose TubeBuddy if
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                You want a full YouTube Studio companion with browser extension
                workflows, bulk processing, A/B testing, channel analytics, and
                long-term channel management.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50/70 to-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Use both if
              </p>
              <p className="mt-3 text-sm text-gray-800 leading-relaxed">
                Use {siteConfig.name} for fast no-login research and AI fixes,
                then use TubeBuddy when you need deeper in-Studio workflows or
                bulk updates across an existing catalog.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Honest Disclosure */}
      <section className="border-y border-gray-100 bg-gradient-to-b from-white via-gray-50/30 to-white py-16">
        <Container as="div">
          <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50/50 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Honest take
            </p>
            <p className="mt-3 text-sm sm:text-base text-amber-900 leading-relaxed">
              TubeBuddy is the more complete YouTube management platform. It is
              built for creators who want a browser extension inside YouTube
              Studio, bulk processing, A/B testing, channel analytics, and
              advanced workflow tools. {siteConfig.name} is not trying to
              replace all of that. It is best for free, fast, no-signup YouTube
              SEO tasks: keyword research, audits, generators, competitor
              checks, and copy-ready fixes.
            </p>
          </div>
        </Container>
      </section>

      {/* SEO Sections */}
      <section className="py-16 sm:py-20">
        <Container as="div">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                Is {siteConfig.name} a TubeBuddy alternative?
              </h2>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                Yes, for quick YouTube SEO tasks. It can replace TubeBuddy for
                creators who mainly need keyword research, title ideas, tags,
                descriptions, audits, and free utilities. It is not a full
                replacement for TubeBuddy&apos;s browser extension, bulk
                editing, A/B testing, or deep YouTube Studio workflows.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                What {siteConfig.name} does better
              </h2>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                It opens instantly, requires no signup, and keeps the workflow
                simple. You can run a tool, copy the result, and move on. That
                makes it useful for quick checks before filming, before upload,
                or after publishing.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                What TubeBuddy does better
              </h2>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                TubeBuddy is stronger for creators who manage a channel inside
                YouTube Studio every day. Its official feature set includes SEO
                tools, content strategy tools, video and thumbnail tools,
                productivity tools, A/B testing, channel insights, and bulk
                processing/editing features.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-y border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <Container as="div">
          <div className="mx-auto max-w-3xl">
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
                    <span className="mt-0.5 text-gray-400 group-open:rotate-180 transition-transform">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24">
        <Container as="div">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-inset ring-brand-100">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Free YouTube SEO toolkit
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Try the free TubeBuddy alternative for quick YouTube SEO tasks
            </h2>
            <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
              No signup, no extension, no channel authorization. Pick a tool and
              get a usable result in a few seconds.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/tools/youtube-keyword-tool"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
              >
                Find keywords
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link
                href="/tools/youtube-video-audit"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-gray-900 ring-1 ring-gray-200 shadow-sm hover:bg-gray-50 transition"
              >
                Audit a video
              </Link>
              <Link
                href="/tools/youtube-channel-audit"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-gray-900 ring-1 ring-gray-200 shadow-sm hover:bg-gray-50 transition"
              >
                Score my channel
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Other comparisons */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <Container as="div">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              More comparisons
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              {siteConfig.name} vs other YouTube SEO tools
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              Still deciding? See how {siteConfig.name} stacks up against other
              popular options for keyword research, audits, and channel growth.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RELATED_COMPARISONS.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-sm"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Compare
                </p>
                <p className="mt-1.5 text-base font-semibold text-gray-900 group-hover:text-brand-700 transition">
                  vs {c.name}
                </p>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  {c.blurb}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-600 group-hover:text-brand-700 transition">
                  See comparison
                  <ArrowRight
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2.25}
                  />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
