import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { OutlierFinderTool } from "@/components/tools/OutlierFinderTool";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-outlier-finder")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
});

const FAQS = [
  {
    q: "What counts as an outlier?",
    a: "A video whose view count is 3× or more the channel's median over the last 100 uploads. We use median rather than mean specifically because mean gets distorted by one mega-hit — median is robust. Anything 10× or above we additionally tag as a 'mega-outlier' (red flame badge).",
  },
  {
    q: "Why does this matter for my channel?",
    a: "Most channels have a few videos that outperform the rest by a large margin. The ones that overperform tell you what your audience actually values vs what you assume they value. Reverse-engineering those wins is the single highest-ROI exercise a creator can run — that's what agencies pay tools like Spotter $50K+ a year for. We do it free, with the same statistical method.",
  },
  {
    q: "Why analyze the last 100 uploads and not all-time?",
    a: "100 strikes the balance between statistical confidence and recency. All-time would include videos from before the channel found its audience — patterns from 5 years ago aren't actionable. 100 captures the channel's current era while still being a meaningful sample. For channels with fewer than 100 uploads, we use what's there (minimum 10).",
  },
  {
    q: "What if my channel has no outliers?",
    a: "That's actually useful information. Consistent performance (everything within 3× of median) usually means a tight, loyal audience that watches everything — which is great for retention but means the data alone won't tell you what to do more of. You'd need viewer surveys or comment analysis at that point.",
  },
  {
    q: "Why median instead of mean?",
    a: "Mean (average) gets pulled up dramatically by one viral video. A channel with 99 videos at 10K views and 1 video at 10M views has a mean of 110K — which makes everything look like it's underperforming. Median doesn't move: it's still 10K, and the 10M-view video shows up correctly as a 1000× outlier. Median is the right statistic for skewed distributions, which view counts always are.",
  },
  {
    q: "How is this different from the Competitor Analyzer?",
    a: "Competitor Analyzer pulls top 10 by views and finds patterns those top videos share. Outlier Finder pulls the last 100 uploads, calculates the channel's normal performance, and finds what's PRESENT in outliers but ABSENT in average videos. Different question: 'what does this channel do consistently right' (competitor) vs 'what made these specific videos blow up vs their other content' (outlier).",
  },
  {
    q: "Why is the daily limit 5?",
    a: "Each analysis burns ~5 YouTube Data API units. Our project quota is 10K/day, so 5/IP keeps the quota safe against abuse while letting a serious user analyze a few channels in a session. Cached results don't count.",
  },
];

export default function YouTubeOutlierFinderPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <OutlierFinderTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the Outlier Finder
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Most YouTube channels have a small number of videos that significantly
            outperform the rest. Those outliers are the highest-signal data points
            you have — they tell you what your audience actually rewards, beyond
            what you assume. The pattern is so reliable that paid services like
            Spotter built an entire $50,000+/year agency offering around
            reverse-engineering it. We do the same statistical analysis with the
            public YouTube Data API, for free.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            Use it on your own channel to find your hidden winning formulas, or
            on competitors to see what specific videos broke their pattern (and
            why).
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">How it works</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-700">
            <li>
              Channel input is resolved to a YouTube channel ID + uploads
              playlist ID via the Data API.
            </li>
            <li>
              We fetch the latest 100 video IDs from the uploads playlist
              (newer first) and batch-fetch their stats in one API call.
            </li>
            <li>
              Median view count is calculated. Median (not mean) is robust to
              viral spikes — one mega-hit doesn&apos;t distort the baseline.
            </li>
            <li>
              Every video is tagged with its multiplier (views / median).
              ≥3× = outlier. ≥10× = mega-outlier (flame badge).
            </li>
            <li>
              Top 8 outliers and 8 average-performing videos (0.7–1.3× median)
              are passed to Claude Haiku, which is asked to identify 3 specific
              structural choices PRESENT in outliers and ABSENT in averages.
              The system prompt forbids generic best practices.
            </li>
          </ol>
          <p className="mt-3 text-xs text-gray-500">
            Total YouTube quota per non-cached analysis: ~5 units. Much cheaper
            than the Competitor Analyzer (102 units) because we skip the
            expensive search.list endpoint.
          </p>

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
            <h3 className="text-base font-semibold text-gray-900">Related tools</h3>
            <p className="mt-1 text-sm text-gray-600">
              Outlier Finder pairs naturally with the rest of the Research stage.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li><Link href="/tools/youtube-competitor-analyzer" className="link text-sm">Competitor Channel Analyzer →</Link></li>
              <li><Link href="/tools/youtube-keyword-tool" className="link text-sm">Keyword Tool →</Link></li>
              <li><Link href="/tools/youtube-tag-extractor" className="link text-sm">Tag Extractor →</Link></li>
              <li><Link href="/tools/youtube-title-score-checker" className="link text-sm">Title Score Checker →</Link></li>
              <li><Link href="/tools/research" className="link text-sm">All Research tools →</Link></li>
              <li><Link href="/tools" className="link text-sm">All YouTube tools →</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
