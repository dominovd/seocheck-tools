import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { NicheCheckTool } from "@/components/tools/NicheCheckTool";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-niche-check")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
});

const FAQS = [
  {
    q: "What is the Niche Check tool?",
    a: "A topic-level opportunity verdict tool. Paste a topic or keyword (not a channel) and get one of six verdicts: ENTER NOW, NICHE GAP, HIGH COMPETITION, OVERSATURATED, WEAK DEMAND, or NEUTRAL. Each verdict includes a 0-10 score and an explanation grounded in the actual top-20 video data we pulled from YouTube.",
  },
  {
    q: "What's the difference vs Competitor Analyzer or Channel Audit?",
    a: "Those analyze a specific CHANNEL you paste. Niche Check analyzes a TOPIC. Use Niche Check before you've started a channel, or when deciding whether to make a video on a new topic. Use the others when you have a channel and want to drill into a specific creator's strategy.",
  },
  {
    q: "How is the verdict computed?",
    a: "Deterministic rules — same input always returns the same output. We fetch the top 20 results for your keyword via YouTube's search.list, look up their channel sizes, count outlier videos (small channels with views ≥ 3× their subscriber count), big-channel share, fresh videos in the last 30 days, and infer whether the topic is rising or declining from the publish-date distribution of the top results. Then rules from best opportunity to worst pick the verdict. No LLM — your verdict isn't subject to a model's mood.",
  },
  {
    q: "What does ENTER NOW mean?",
    a: "The strongest possible signal: small channels (≤50K subs) in the top 20 results have views ≥3× their subscriber count — meaning the YouTube algorithm is promoting the TOPIC itself rather than the channel. New entrants have a real chance to break through here. Combined with healthy median views and a non-declining trend, this is the gold-niche pattern.",
  },
  {
    q: "What does NICHE GAP mean?",
    a: "Demand exists (median views > 10K), big channels don't dominate the top results, and few videos in the top 20 are fresh (last 30 days). There's clean space for a new entrant who publishes something focused and timely.",
  },
  {
    q: "Why is the daily limit only 5?",
    a: "Each Niche Check uses YouTube's search.list endpoint, which costs 100 quota units per call (vs 1 unit for most other endpoints). On our default 10,000 unit daily quota, 5 per IP per day keeps total system usage safe across multiple users. Cached lookups (same query within 24h) don't count.",
  },
  {
    q: "Does it work for non-English topics?",
    a: "YouTube returns results from the language matching its search index for that query. The tool itself is language-agnostic — it counts numbers, not words. The autocomplete suggestions default to US English, but the search and analysis work for any language YouTube indexes.",
  },
  {
    q: "Do you store the topics I search?",
    a: "Verdict results are cached in Redis by normalized query for 24 hours so re-runs return instantly. We don't log which queries were searched by which user — IPs are only held in memory paired with the day to enforce the 5/day rate limit.",
  },
];

export default function YouTubeNicheCheckPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <NicheCheckTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the Niche Check
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Every other flagship tool on this site analyzes a specific channel
            you already have. The Niche Check is different: it analyzes a TOPIC
            before you&apos;ve made any decision. Paste a keyword you&apos;re
            considering filming about, get a verdict on whether the topic is
            ready for a new entrant.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            For a small channel the central question isn&apos;t &quot;how big
            is the audience&quot; — it&apos;s &quot;can a small channel break
            through here at all&quot;. That&apos;s why our top-priority signal
            is outlier videos from small channels (≤50K subs) that pulled views
            way above their subscriber base. When that pattern shows up in the
            top results, the algorithm is promoting the TOPIC, not channel
            size. That&apos;s the moment to enter.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">The six verdicts</h3>
          <dl className="mt-4 space-y-4 text-sm text-gray-700">
            <div>
              <dt className="font-semibold text-brand-700">ENTER NOW (9/10)</dt>
              <dd className="mt-0.5">Small channels are breaking through with outlier views, median demand is healthy, topic isn&apos;t declining. The algorithm is rewarding the niche itself — small channels can ride that wave.</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-700">NICHE GAP (8/10)</dt>
              <dd className="mt-0.5">Demand is solid, supply is thin (few fresh videos), big channels don&apos;t dominate. Clean room for a focused new entrant.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">NEUTRAL (5/10)</dt>
              <dd className="mt-0.5">No clear opportunity signal either way. Your decision depends on your positioning rather than market dynamics.</dd>
            </div>
            <div>
              <dt className="font-semibold text-amber-700">HIGH COMPETITION (4/10)</dt>
              <dd className="mt-0.5">≥70% of the top results are big channels (&gt;50K subs). New entrants struggle to break in without a sharply differentiated angle.</dd>
            </div>
            <div>
              <dt className="font-semibold text-orange-700">OVERSATURATED (3/10)</dt>
              <dd className="mt-0.5">Many fresh videos already on the topic AND the recent-vs-older view ratio is declining. Everyone already filmed it and the audience has moved on.</dd>
            </div>
            <div>
              <dt className="font-semibold text-red-700">WEAK DEMAND (3/10)</dt>
              <dd className="mt-0.5">Median views in the top window below 2K. Audience too small to justify the work.</dd>
            </div>
          </dl>

          <h3 className="mt-12 text-lg font-semibold text-gray-900">How it works</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-700">
            <li>
              YouTube autocomplete (free, no quota) returns the related keywords
              people actually type around your seed term.
            </li>
            <li>
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">search.list</code>
              returns the top 20 video IDs by relevance for your query, plus total
              result count.
            </li>
            <li>
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">videos.list</code>
              (batched) returns title, view count, and publish date for those 20.
            </li>
            <li>
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">channels.list</code>
              (batched) returns subscriber count for the channels behind those 20 videos.
            </li>
            <li>
              Pure-function logic counts outliers, big-channel share, freshness,
              and infers topic direction from publish-date distribution. Six
              rules from best to worst pick the verdict.
            </li>
          </ol>
          <p className="mt-3 text-xs text-gray-500">
            Total YouTube quota per non-cached check: ~102 units (search.list is
            the expensive one). Cached for 24 hours by normalized query.
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
              After the niche check, drill into specific channels and keywords.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li><Link href="/tools/youtube-keyword-tool" className="link text-sm">Keyword Tool →</Link></li>
              <li><Link href="/tools/youtube-competitor-analyzer" className="link text-sm">Competitor Channel Analyzer →</Link></li>
              <li><Link href="/tools/youtube-outlier-finder" className="link text-sm">Outlier Finder →</Link></li>
              <li><Link href="/tools/youtube-video-idea-generator" className="link text-sm">AI Video Idea Generator →</Link></li>
              <li><Link href="/tools/research" className="link text-sm">All Research tools →</Link></li>
              <li><Link href="/tools" className="link text-sm">All YouTube tools →</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
