import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { VisibilityScoreTool } from "@/components/tools/VisibilityScoreTool";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-visibility-score")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
});

const FAQS = [
  {
    q: "What is the YouTube Visibility Score?",
    a: "A composite 0-100 metric that summarizes a channel's overall packaging health and growth dynamics in a single number. It's calculated from four sub-scores — CTR Potential, Metadata Quality, Niche Headroom, Growth Trajectory — weighted by their impact on actual channel growth. The composite is what you share; the sub-scores tell you which lever to pull.",
  },
  {
    q: "What does each sub-score measure?",
    a: "CTR Potential (35%): average title quality across the last 30 uploads. Metadata Quality (25%): average overall Video Audit score across description, hashtags, and chapters. Niche Headroom (15%): how much room the channel has to grow into a wider audience, approximated from the ratio of median views to subscriber count. Growth Trajectory (25%): outlier rate — what % of videos break through 1.5× the channel's median view count.",
  },
  {
    q: "Why weighted 35/25/15/25?",
    a: "CTR carries the most weight because thumbnail and title are the single biggest lever in YouTube's current algorithm — they decide whether a video gets clicked at all. Metadata follows as it shapes how the algorithm classifies the content. Growth Trajectory matters as a leading indicator of audience expansion. Niche Headroom is weighted least because the underlying view-to-subscriber ratio is the noisiest signal — high-quality channels with very loyal audiences can score lower here even when they're healthy.",
  },
  {
    q: "Why is the Niche Headroom score on a curve?",
    a: "The ratio of median views to subscribers gives us a measure of how far the channel reaches beyond its existing subscriber base. A ratio of 0.05 (5% reach) is weak. 0.20 is typical for an established channel. 0.50+ means the algorithm is regularly pushing the channel beyond its base — strong sign of headroom. We map this on a log scale so the difference between 1% and 10% reach matters more than between 50% and 60%.",
  },
  {
    q: "What's a 'good' score?",
    a: "A (85-100): channel-wide packaging discipline with healthy growth signals. B (70-84): strong, with one or two sub-scores letting it down. C (55-69): mixed — packaging is fine but growth is flat, or vice versa. D (40-54): packaging issues compounding. F (0-39): systematic gaps in multiple dimensions. The grade is meant for quick reading; the sub-scores tell you where to act.",
  },
  {
    q: "What does the AI summary do?",
    a: "After computing the four sub-scores, Claude Haiku writes a one-sentence positioning statement naming the channel's biggest strength AND biggest gap. The sentence is designed to be quotable — usable as a Twitter share, a dashboard caption, or a starting point for your own channel review.",
  },
  {
    q: "How is this different from the Channel Audit?",
    a: "Channel Audit gives you a detailed per-dimension breakdown — 'how are my descriptions doing across recent videos.' Visibility Score gives you a single composite metric — 'where is my channel overall, in one number, vs everyone else.' The first is diagnosis. The second is positioning. Use Channel Audit when you're optimizing; use Visibility Score when you're benchmarking.",
  },
];

export default function YouTubeVisibilityScorePage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <VisibilityScoreTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the YouTube Visibility Score
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The Visibility Score is the highest-level metric in our toolkit.
            All the other tools answer specific diagnostic questions —
            &quot;does this title score well&quot;, &quot;is this video&apos;s description long
            enough&quot;, &quot;what are the outliers on this channel.&quot; The Visibility
            Score collapses all of those signals into one comparable number,
            so two channels can be benchmarked side by side without reading
            through eight separate audit reports.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">Sub-score weights</h3>
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Sub-score</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Weight</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="px-4 py-2">CTR Potential</td>
                  <td className="px-4 py-2 font-mono text-xs">35%</td>
                  <td className="px-4 py-2">Average title score across last 30 uploads</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Metadata Quality</td>
                  <td className="px-4 py-2 font-mono text-xs">25%</td>
                  <td className="px-4 py-2">Average <Link href="/tools/youtube-video-audit" className="link">Video Audit</Link> overall score</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Growth Trajectory</td>
                  <td className="px-4 py-2 font-mono text-xs">25%</td>
                  <td className="px-4 py-2">% of videos with views ≥ 1.5× the channel median</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Niche Headroom</td>
                  <td className="px-4 py-2 font-mono text-xs">15%</td>
                  <td className="px-4 py-2">Log-scaled median-views-to-subscribers ratio</td>
                </tr>
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
            <h3 className="text-base font-semibold text-gray-900">Related tools</h3>
            <p className="mt-1 text-sm text-gray-600">
              Visibility Score sits above the diagnostic tools — drill into any sub-score with these:
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li><Link href="/tools/youtube-channel-audit" className="link text-sm">Channel Audit (full breakdown) →</Link></li>
              <li><Link href="/tools/youtube-outlier-finder" className="link text-sm">Outlier Finder →</Link></li>
              <li><Link href="/tools/youtube-video-audit" className="link text-sm">Video Audit (single video) →</Link></li>
              <li><Link href="/tools/youtube-competitor-analyzer" className="link text-sm">Competitor Analyzer →</Link></li>
              <li><Link href="/tools/analyze" className="link text-sm">All Analyze tools →</Link></li>
              <li><Link href="/tools" className="link text-sm">All YouTube tools →</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
