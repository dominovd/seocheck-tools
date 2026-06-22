import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { MoneyCalculatorTool } from "@/components/tools/MoneyCalculatorTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-money-calculator")!;

const PAGE_TITLE = "YouTube Money Calculator";
const META_DESCRIPTION =
  "Estimate YouTube earnings from views, niche, audience region, CPM/RPM, and YouTube's revenue share. Free calculator for ad revenue ranges, not inflated guesses.";
const OG_DESCRIPTION =
  "Estimate YouTube ad revenue by views, niche, and audience region. See CPM/RPM assumptions, revenue share, monetized playback ratio, and realistic earning ranges.";

const base = buildMetadata({
  title: "YouTube Money Calculator | Earnings & RPM Estimator",
  description: META_DESCRIPTION,
  path: `tools/${tool.slug}`,
  noBrand: true,
  ogVariant: tool.isAI ? { ai: true } : undefined,
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
    title: PAGE_TITLE,
    description: OG_DESCRIPTION,
  },
};

const HERO_SUBTITLE =
  "Estimate YouTube ad revenue from views, niche, audience region, CPM/RPM assumptions, monetized playback ratio, and YouTube's revenue share.";

const ABOVE_FOLD_BULLETS = [
  "Realistic low, typical, and high earning range, not one fake-precise number.",
  "Niche CPM presets and audience region multiplier baked in.",
  "Revenue share and monetized playback ratio shown alongside the result.",
];

const INCLUDED = [
  "View count",
  "Niche CPM range",
  "Audience region multiplier",
  "Estimated monetized playback ratio",
  "YouTube's creator revenue share",
  "Low, typical, and high earning scenarios",
];

const EXCLUDED = [
  "Sponsorships",
  "Affiliate commissions",
  "Merch",
  "Memberships",
  "Super Thanks",
  "Paid communities",
  "Courses",
  "Brand deals",
];

const HOW_IT_WORKS_STEPS = [
  "Enter the number of views you want to estimate.",
  "Pick the closest niche or content category.",
  "Choose the main audience region.",
  "The calculator applies a CPM/RPM-style range for that niche and region.",
  "It estimates creator revenue after YouTube's share and monetized playback assumptions.",
  "Review the low, typical, and high revenue scenarios.",
];

const RPM_FACTORS = [
  "Audience country",
  "Niche and advertiser demand",
  "Video length and mid-roll eligibility",
  "Viewer age and purchase intent",
  "Seasonality",
  "Ad inventory and fill rate",
  "Brand-safety limits",
  "Monetization status",
  "Shorts vs long-form format",
];

type CpmRow = {
  niche: string;
  range: string;
  tier: "high" | "mid" | "low";
};

const CPM_RANGES: CpmRow[] = [
  { niche: "Insurance & legal", range: "$18 - $40", tier: "high" },
  { niche: "Finance & investing", range: "$15 - $30", tier: "high" },
  { niche: "Real estate", range: "$12 - $25", tier: "high" },
  { niche: "Business & marketing", range: "$10 - $20", tier: "high" },
  { niche: "Tech reviews", range: "$5 - $15", tier: "mid" },
  { niche: "Travel", range: "$5 - $10", tier: "mid" },
  { niche: "Health & fitness", range: "$4 - $10", tier: "mid" },
  { niche: "Education", range: "$3 - $8", tier: "mid" },
  { niche: "Lifestyle & vlogs", range: "$3 - $7", tier: "mid" },
  { niche: "Gaming", range: "$2 - $5", tier: "low" },
  { niche: "Music & entertainment", range: "$1 - $4", tier: "low" },
  { niche: "Kids (COPPA limits)", range: "$1 - $3", tier: "low" },
];

const TIER_LABELS: Record<CpmRow["tier"], { label: string; color: string }> = {
  high: { label: "HIGH", color: "text-emerald-700" },
  mid: { label: "MID", color: "text-amber-700" },
  low: { label: "LOW", color: "text-slate-600" },
};

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-channel-audit",
    name: "Channel Audit",
    body: "Score the channel 0-100 across CTR, metadata, headroom, and growth, with severity-ranked recurring fixes.",
  },
  {
    href: "/tools/youtube-video-audit",
    name: "Video Audit",
    body: "Audit a single video's title, description, tags, and chapters.",
  },
  {
    href: "/tools/youtube-niche-check",
    name: "Niche Check",
    body: "Validate whether a topic area has room for a new entrant.",
  },
  {
    href: "/tools/youtube-outlier-finder",
    name: "Outlier Finder",
    body: "Find videos that beat a channel's normal baseline.",
  },
  {
    href: "/tools/youtube-video-idea-generator",
    name: "Video Idea Generator",
    body: "Turn a niche into 10 filmable video concepts.",
  },
];

const FAQS = [
  {
    q: "Is this YouTube Money Calculator free?",
    a: "Yes. It is free to use and does not require signup.",
  },
  {
    q: "Is this a YouTube earnings checker?",
    a: "It is an estimator. It can calculate a realistic revenue range from views, niche, and audience region, but it cannot access private YouTube Studio revenue data.",
  },
  {
    q: "How accurate is the estimate?",
    a: "It is useful for planning and comparison, not exact accounting. Real earnings depend on your RPM, audience geography, video length, ad fill, seasonality, monetization status, and YouTube Analytics data.",
  },
  {
    q: "What is the difference between CPM and RPM?",
    a: "CPM is what advertisers pay per 1,000 ad impressions. RPM is revenue per 1,000 views from the creator's perspective. RPM is usually more useful when estimating what a channel earns.",
  },
  {
    q: "How much does YouTube pay per 1,000 views?",
    a: "There is no single rate. A low-RPM entertainment video and a high-RPM finance video can earn very different amounts from the same 1,000 views.",
  },
  {
    q: "Can I check YouTube earnings by channel link?",
    a: "Public tools can estimate revenue from visible views and assumptions, but they cannot know the channel's real YouTube Studio earnings. For your own channel, YouTube Studio is the source of truth.",
  },
  {
    q: "Does this include Shorts revenue?",
    a: "The default estimate is best for long-form ad revenue. Shorts use a different monetization model, so treat Shorts estimates separately unless the tool adds a dedicated Shorts mode.",
  },
  {
    q: "Does this include sponsorships?",
    a: "No. Sponsorships, affiliate revenue, memberships, merch, paid courses, and other creator income streams are not included.",
  },
  {
    q: "Why does finance earn more than gaming?",
    a: "Finance advertisers often have higher customer value and pay more to reach viewers. Gaming has large audience demand, but ad rates are usually lower.",
  },
  {
    q: "How do I check my real YouTube RPM?",
    a: "Open YouTube Studio, go to Analytics, then Revenue. Your RPM and estimated revenue are shown there if your channel is monetized and has enough data.",
  },
  {
    q: "Why is my real revenue lower than the estimate?",
    a: "Common reasons include low ad fill, non-monetized views, limited ads, Shorts traffic, lower-paying audience regions, January seasonality, copyright claims, or videos that are not fully monetized.",
  },
  {
    q: "Why is my real revenue higher than the estimate?",
    a: "Your channel may have a high-value audience, strong US/UK/Canada traffic, long videos with mid-rolls, strong advertiser demand, or high seasonal CPMs.",
  },
];

export default function YouTubeMoneyCalculatorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <MoneyCalculatorTool />
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
            Free calculator. No signup. Estimates are based on visible
            inputs and industry-style assumptions; actual revenue depends
            on your YouTube Analytics.
          </p>
        </div>
      </section>

      {/* Estimate YouTube earnings without pretending the number is exact */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Estimate YouTube earnings without pretending the number is
            exact
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Most YouTube money calculators give one shiny number and hide
            the assumptions. That is not how YouTube revenue works. Two
            videos with the same view count can earn very different
            amounts depending on the niche, viewer country, video length,
            advertiser demand, ad fill, and season.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            This free YouTube Money Calculator gives you a realistic
            earning range instead of a fake-precise prediction. Enter
            views, choose the niche, pick the audience region, and see
            the estimated revenue after YouTube&apos;s revenue share.
          </p>
        </div>
      </section>

      {/* What the calculator estimates */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What the calculator estimates
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The tool estimates YouTube Partner Program ad revenue. It
            uses:
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                Included
              </p>
              <ul className="mt-3 space-y-2">
                {INCLUDED.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm text-gray-800"
                  >
                    <Check
                      className="h-3.5 w-3.5 shrink-0 text-brand-600 mt-1"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                Not included
              </p>
              <ul className="mt-3 space-y-2">
                {EXCLUDED.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm text-gray-800"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"
                      aria-hidden="true"
                    />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why YouTube earnings vary so much */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Why YouTube earnings vary so much
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            A finance channel and a gaming channel can both get 100,000
            views, but the finance video may earn several times more from
            ads because advertisers pay more to reach that audience. A
            US-heavy audience usually earns more than a global mixed
            audience. Long videos may have more ad opportunities than
            short videos. December often pays more than January.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            That is why a useful YouTube revenue calculator should show a
            range, not a single &quot;you will earn exactly this&quot;
            number.
          </p>
        </div>
      </section>

      {/* CPM vs RPM */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            CPM vs RPM: the difference that matters
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-violet-100 bg-violet-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-700">
                CPM
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                Advertiser side
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                CPM is what advertisers pay per 1,000 ad impressions. It
                explains why some topics monetize better than others.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                RPM
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                Creator side
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                RPM is revenue per 1,000 video views after revenue share
                and after accounting for views that did not show ads.
              </p>
            </div>
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            If you are estimating your own channel, RPM is the cleaner
            planning number. If you are comparing niches, CPM explains
            why some topics monetize better than others.
          </p>
        </div>
      </section>

      {/* Can you check another channel's YouTube income? */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Can you check another channel&apos;s YouTube income?
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            You can estimate it if you know or approximate the
            channel&apos;s views, niche, and audience region. But you
            cannot see another creator&apos;s actual YouTube Studio
            revenue unless they share it.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use this tool for planning, benchmarking, and rough
            competitor research. Do not treat public estimates as
            confirmed earnings.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How it works
          </h2>

          <ol className="mt-8 space-y-4">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CPM ranges by niche */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            CPM ranges by niche (USD)
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            Per 1,000 ad impressions, before YouTube&apos;s share.
            Indicative ranges, not a quote.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {CPM_RANGES.map((row) => {
                const tier = TIER_LABELS[row.tier];
                return (
                  <li
                    key={row.niche}
                    className="flex items-center gap-4 px-5 py-3 sm:gap-6"
                  >
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${tier.color} sm:w-12 sm:shrink-0`}
                    >
                      {tier.label}
                    </span>
                    <span className="flex-1 text-sm text-gray-800">
                      {row.niche}
                    </span>
                    <span className="font-mono text-sm text-gray-900">
                      {row.range}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Useful explainers */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What affects YouTube RPM?
          </h2>

          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {RPM_FACTORS.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 rounded-lg bg-gray-50/60 p-3 text-sm text-gray-700 ring-1 ring-gray-100"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-12 text-lg font-semibold text-gray-900">
            Why niche matters
          </h3>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            Some niches attract advertisers with high customer lifetime
            value: finance, insurance, software, business, real estate,
            and legal topics. Other niches have huge audiences but lower
            advertiser competition: gaming, entertainment, music, memes,
            and broad lifestyle content.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            A lower-CPM niche can still build a strong business through
            volume, sponsorships, products, and community. Ad revenue is
            only one layer.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            Why region matters
          </h3>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            Advertisers usually pay more for viewers in markets where
            buying power and ad competition are higher. A US-heavy
            audience often earns more per 1,000 views than a mixed global
            audience with the same niche and watch time.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            Why sponsorships are not included
          </h3>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            Sponsorship revenue depends on the creator&apos;s brand,
            audience trust, conversion power, negotiation, deliverables,
            exclusivity, and deal structure. A calculator can estimate
            ad revenue from views; it cannot reliably estimate private
            sponsorship deals.
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
              Plan revenue alongside performance
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Pair the calculator with the rest of the Analyze toolkit to
              find higher-CPM niches and stronger video patterns.
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
                  Open
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
            Ready to estimate YouTube earnings?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Enter views, pick a niche, and choose a region. The range
            comes with assumptions, not a single fake-precise number.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Calculate earnings
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
