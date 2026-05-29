import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { ChannelAuditTool } from "@/components/tools/ChannelAuditTool";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-channel-audit")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
});

const FAQS = [
  {
    q: "What's the difference between this and the Video Audit?",
    a: "Video Audit scores ONE video against 5 dimensions. Channel Audit runs the same scoring against your channel's last 10 uploads and AGGREGATES the result, showing which dimension is consistently weak across your work. The video-level view tells you 'this video needs work'; the channel-level view tells you 'I have a pattern of weak descriptions across the entire channel'.",
  },
  {
    q: "What does my channel grade mean?",
    a: "A: most videos optimized across most dimensions. B: strong overall with one or two consistent gaps. C: mixed packaging — look at the dimension breakdown. D: recurring gaps in most dimensions. F: systematic issues across the channel. The grade is based on the average overall score of the 10 audited videos.",
  },
  {
    q: "Why only 4 dimensions instead of 5?",
    a: "The Video Audit scores 5 dimensions including tags. Tags are hidden from YouTube's public API for non-owners (since 2022), so for a channel-wide audit using the API we can't get them reliably. We skip the tags dimension here — title, description, hashtags, chapters are what's measured. Run the individual Video Audit on a specific video if you need tags too.",
  },
  {
    q: "Why audit only the last 10 uploads?",
    a: "Channels evolve. Videos from 3 years ago tell you about a previous era. The last 10 captures your current packaging discipline — which is what's actually shipping today. We want this to surface CURRENT recurring issues so you can fix them in your next upload.",
  },
  {
    q: "What's the 'worst dimension' tag?",
    a: "The dimension with the lowest average score across all audited videos. If that flag is on Description, it means description quality is your single biggest channel-wide gap — fixing it across your next 5 uploads would lift more overall scores than any other change. The amber border on its row makes it visually obvious.",
  },
  {
    q: "Will this work on a channel that's not mine?",
    a: "Yes — works on any public YouTube channel. Useful for benchmarking competitors and for figuring out which dimensions they consistently win on. Run yours and a competitor's side by side and the contrast usually reveals where to invest.",
  },
  {
    q: "Why is the daily limit only 5?",
    a: "Each audit burns ~3 YouTube API units. Combined with our quota (10K/day) and the other API-heavy tools, 5/IP keeps the daily budget safe against abuse. Cached results don't count.",
  },
];

export default function YouTubeChannelAuditPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <ChannelAuditTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the Channel Audit
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Video Audit answers &quot;is this video well-packaged?&quot; Channel Audit
            answers a different question: &quot;am I weak at one thing across
            everything I publish?&quot;. The second question is the more valuable
            one — fixing a recurring problem across your next 10 uploads compounds
            far more than perfecting one video.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            Paste your channel; the tool pulls the last 10 uploads, runs each
            through the Video Audit engine, then aggregates: per-dimension averages,
            band distribution (how many Strong / Good / Fair / Weak across all 10),
            an overall channel grade, and a Claude-generated list of the top 3
            recurring issues. The dimension with the lowest average score is
            flagged as your &quot;worst&quot; — fix it there first.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">How it works</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-700">
            <li>
              Channel input resolved to channel ID + uploads playlist ID via the
              Data API.
            </li>
            <li>
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">playlistItems.list</code>
              returns the latest 10 video IDs.
            </li>
            <li>
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">videos.list</code>
              batched on those 10 IDs returns snippet + statistics + contentDetails.
            </li>
            <li>
              Each video is built into a VideoInfo and run through the existing
              <Link href="/tools/youtube-video-audit" className="link">Video Audit</Link>
              engine with the tags dimension excluded.
            </li>
            <li>
              Per-dimension stats aggregated across all 10 videos (average score,
              band counts). The lowest-average dimension is flagged as &quot;worst&quot;.
            </li>
            <li>
              Per-dimension scorecard + per-video overall scores passed to Claude
              Haiku, which extracts up to 3 recurring issues with references to
              the actual counts. Generic best practices are explicitly forbidden.
            </li>
          </ol>
          <p className="mt-3 text-xs text-gray-500">
            Total YouTube quota per non-cached analysis: ~3 units. The cheapest
            of our YouTube-API-backed tools.
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
              Channel Audit lives in the Analyze stage. The natural next steps from here:
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li><Link href="/tools/youtube-video-audit" className="link text-sm">Video Audit (single video) →</Link></li>
              <li><Link href="/tools/youtube-outlier-finder" className="link text-sm">Outlier Finder →</Link></li>
              <li><Link href="/tools/youtube-competitor-analyzer" className="link text-sm">Competitor Channel Analyzer →</Link></li>
              <li><Link href="/tools/youtube-money-calculator" className="link text-sm">Money Calculator →</Link></li>
              <li><Link href="/tools/analyze" className="link text-sm">All Analyze tools →</Link></li>
              <li><Link href="/tools" className="link text-sm">All YouTube tools →</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
