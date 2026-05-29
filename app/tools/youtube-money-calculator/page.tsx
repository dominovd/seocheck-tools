import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { MoneyCalculatorTool } from "@/components/tools/MoneyCalculatorTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";

const tool = getToolBySlug("youtube-money-calculator")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

const FAQS = [
  {
    q: "How accurate is this calculator?",
    a: "Order-of-magnitude accurate, not penny-accurate. The CPM ranges are 2024-2026 industry averages aggregated from Tubular, Influencer Marketing Hub, and creator-shared screenshots. Your actual CPM depends on ad fill, seasonality, video length, mid-roll eligibility, and audience demographics — variables this tool can't see.",
  },
  {
    q: "What's the difference between CPM and RPM?",
    a: "CPM (cost per mille) is what advertisers pay per 1,000 ad impressions. RPM (revenue per mille) is what you actually receive per 1,000 video views, after YouTube's 45% cut and accounting for views that don't see an ad. RPM is roughly CPM × 0.55 × the monetized playback ratio (about 60% of views, on average).",
  },
  {
    q: "Why is gaming so low and finance so high?",
    a: "Advertiser demand. Finance, insurance, and B2B advertisers pay top dollar to reach viewers because their customer lifetime value is high. Gaming has massive reach but advertisers compete less aggressively for that audience, so CPMs drop.",
  },
  {
    q: "Why does my actual revenue differ from this estimate?",
    a: "Five common reasons: (1) Your audience region mix is different from what you picked. (2) Your video length doesn't qualify for mid-roll ads. (3) Seasonality — December CPMs are 30-50% higher than January. (4) Your ad inventory has limited fill at the moment. (5) You have AdSense disabled or limited monetization on the video.",
  },
  {
    q: "Does this include sponsorships and affiliate revenue?",
    a: "No. This is YouTube ad revenue only (Partner Program). Sponsorship and affiliate income is typically 2-5× larger for established creators but depends entirely on individual deals.",
  },
  {
    q: "How is the region multiplier calculated?",
    a: "Multipliers are relative to Tier-1 English-speaking markets (US, UK, Canada, Australia) which are baseline (1.0×). Western Europe averages ~0.7×, Eastern Europe ~0.35×, Latin America and South Asia ~0.2×. If your audience is mixed, use 'Global average' (~0.5×).",
  },
];

export default function YouTubeMoneyCalculatorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <MoneyCalculatorTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      {/* Supporting content for SEO + topical authority */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            How the YouTube Money Calculator works
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            YouTube pays creators a share of the ad revenue earned when ads
            play on their videos. The exact amount depends on three things:
            the niche your content sits in (which determines what advertisers
            are willing to bid), the country your viewers are in (advertiser
            spend varies dramatically by market), and how many of your views
            actually saw an ad.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            The calculator combines those three inputs with two YouTube
            constants — the 45/55 revenue share and the typical ~60% monetized
            playback ratio — to produce a creator-side earnings range. The low
            end assumes lean ad fill, the high end assumes strong fill.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            CPM ranges by niche (USD)
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Per 1,000 ad impressions, before YouTube&apos;s share.
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Niche
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">
                    CPM range
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="px-4 py-2">Insurance & legal</td><td className="px-4 py-2 text-right font-mono">$18 – $40</td></tr>
                <tr><td className="px-4 py-2">Finance & investing</td><td className="px-4 py-2 text-right font-mono">$15 – $30</td></tr>
                <tr><td className="px-4 py-2">Real estate</td><td className="px-4 py-2 text-right font-mono">$12 – $25</td></tr>
                <tr><td className="px-4 py-2">Business & marketing</td><td className="px-4 py-2 text-right font-mono">$10 – $20</td></tr>
                <tr><td className="px-4 py-2">Tech reviews</td><td className="px-4 py-2 text-right font-mono">$5 – $15</td></tr>
                <tr><td className="px-4 py-2">Travel</td><td className="px-4 py-2 text-right font-mono">$5 – $10</td></tr>
                <tr><td className="px-4 py-2">Health & fitness</td><td className="px-4 py-2 text-right font-mono">$4 – $10</td></tr>
                <tr><td className="px-4 py-2">Education</td><td className="px-4 py-2 text-right font-mono">$3 – $8</td></tr>
                <tr><td className="px-4 py-2">Lifestyle & vlogs</td><td className="px-4 py-2 text-right font-mono">$3 – $7</td></tr>
                <tr><td className="px-4 py-2">Gaming</td><td className="px-4 py-2 text-right font-mono">$2 – $5</td></tr>
                <tr><td className="px-4 py-2">Music & entertainment</td><td className="px-4 py-2 text-right font-mono">$1 – $4</td></tr>
                <tr><td className="px-4 py-2">Kids (COPPA limits)</td><td className="px-4 py-2 text-right font-mono">$1 – $3</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="mt-12 text-lg font-semibold text-gray-900">
            Frequently asked questions
          </h3>
          <div className="mt-4 divide-y divide-gray-200">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between text-base font-medium text-gray-900">
                  {q}
                  <span className="ml-4 shrink-0 text-gray-400 transition-transform group-open:rotate-45 text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-base font-semibold text-gray-900">
              Related tools
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              More free YouTube tools to grow and monetize your channel.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link
                  href="/tools/youtube-video-idea-generator"
                  className="link text-sm"
                >
                  AI Video Idea Generator →
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/youtube-tag-generator"
                  className="link text-sm"
                >
                  AI Tag Generator →
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/youtube-channel-name-generator"
                  className="link text-sm"
                >
                  AI Channel Name Generator →
                </Link>
              </li>
              <li>
                <Link href="/tools" className="link text-sm">
                  All YouTube tools →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
