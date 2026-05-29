import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { CompetitorAnalyzerTool } from "@/components/tools/CompetitorAnalyzerTool";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-competitor-analyzer")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
});

const FAQS = [
  {
    q: "What does this tool actually show me?",
    a: "Three layers. (1) A header for the competitor's channel — subscriber count, video count, total views, thumbnail. (2) Their top 10 videos sorted by view count, each with title (auto-scored by our Title Score Checker), views, likes, comments, publish date, and length. (3) An AI-generated summary of 3 concrete patterns those top 10 videos share — things like title structure, content angle, format choice — that you can borrow.",
  },
  {
    q: "Why are the patterns so specific instead of generic advice?",
    a: "The AI is instructed to reference what it actually sees in the data and reject platitudes like 'post consistently' or 'be authentic'. If it can't find concrete patterns in the 10 videos, it simply returns fewer than 3 — better to ship a useful list of 2 than to pad with filler.",
  },
  {
    q: "Why is the daily limit so low (3 per day)?",
    a: "Each analysis burns ~102 YouTube Data API units (channel lookup + top-videos search + video metadata batch). Our project's default daily quota is 10,000 units, so an unprotected tool could be exhausted by 98 lookups. The 3/IP/day limit keeps the quota intact for real users; cached results don't count against your limit.",
  },
  {
    q: "What channel formats can I paste?",
    a: "Any of these resolve correctly: @MrBeast (just the handle), youtube.com/@MrBeast (handle URL), youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA (channel-ID URL), youtube.com/c/MrBeast6000 (legacy custom URL), youtube.com/user/PewDiePie (oldest username URL), or a bare UC… channel ID.",
  },
  {
    q: "How fresh is the data?",
    a: "Live from YouTube's official Data API every analysis, then cached by channel for 24 hours so a re-run returns instantly. View/like/comment counts in the result are accurate to the time of the underlying YouTube response.",
  },
  {
    q: "Will I see tags for each video?",
    a: "Not yet. Tags are hidden by YouTube from the official API for non-owners (since 2022) — they're still extractable from the public watch page via scraping, but we defer that to v2 because the 10 parallel HTTPS fetches add complexity and a rate-limit risk that isn't worth it for the MVP. Use the standalone Tag Extractor on any single video URL to pull tags for that video.",
  },
  {
    q: "Do you store the channels I look up?",
    a: "Cached results live in Redis keyed by channel ID with a 24-hour TTL — that's it. We don't keep a per-user log of who looked up what. IPs are only held in memory paired with the day to enforce the 3/day limit.",
  },
];

export default function YouTubeCompetitorAnalyzerPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <CompetitorAnalyzerTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the Competitor Channel Analyzer
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Free competitor-analysis tools fall in two camps: bare metrics
            scrapers that hand you a CSV of view counts, or full-stack
            subscriptions like vidIQ that lock the useful parts behind a $19/mo
            paywall. This tool sits between them — it gives you the metrics
            anyone can pull, scores every top title against documented
            best-practice heuristics, and runs an AI pattern summary that
            calls out the specific structural choices their top 10 share.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            Use it before publishing to a niche you don&apos;t yet dominate
            (paste 3-5 channels in that niche, find the patterns that
            consistently rank), or to study a specific competitor before
            making a content bet (paste their channel, see exactly what their
            top videos have in common that your channel doesn&apos;t).
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            How the analysis works
          </h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-700">
            <li>
              Channel input is resolved to a YouTube channel ID via the
              Data API (handles handles, URLs, legacy custom URLs, and bare IDs).
            </li>
            <li>
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">search.list</code>
              with <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">order=viewCount</code>
              returns the channel&apos;s top 10 video IDs.
            </li>
            <li>
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">videos.list</code>
              batched on those 10 IDs returns snippet + statistics + contentDetails
              in a single API call.
            </li>
            <li>
              Our <Link href="/tools/youtube-title-score-checker" className="link">Title Score Checker</Link>
              heuristics are applied to every title client-side — no extra cost.
            </li>
            <li>
              The 10 titles + view counts + ages are summarized into a
              compact prompt and sent to Claude Haiku for pattern extraction.
              The model is constrained to return three specific, observable
              patterns and reject platitudes.
            </li>
          </ol>

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
              The Competitor Analyzer plays well with the single-purpose tools.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li><Link href="/tools/youtube-video-audit" className="link text-sm">Video Audit →</Link></li>
              <li><Link href="/tools/youtube-tag-extractor" className="link text-sm">Tag Extractor →</Link></li>
              <li><Link href="/tools/youtube-title-score-checker" className="link text-sm">Title Score Checker →</Link></li>
              <li><Link href="/tools" className="link text-sm">All YouTube tools →</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
