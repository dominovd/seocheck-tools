import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { VideoAuditTool } from "@/components/tools/VideoAuditTool";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-video-audit")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
});

const FAQS = [
  {
    q: "What does the audit actually check?",
    a: "Five dimensions: title (length, structure, angle, clickbait risk), description (length, above-the-fold hook, CTA, links), tags (count, long-tail ratio, char budget), hashtags (count, position), and chapters (count, 0:00 start, minimum 10s segments, ordering). Each dimension gets a 0-100 score and a list of specific signals — what's working and what to fix.",
  },
  {
    q: "How is the overall score calculated?",
    a: "Weighted average across the five dimensions: title 30%, description 25%, chapters 20%, tags 15%, hashtags 10%. Title and description carry the most weight because they have the highest measurable CTR and retention impact. Hashtags weigh less because YouTube only renders the first three above the title.",
  },
  {
    q: "Does it work on private or unlisted videos?",
    a: "No — only public videos. The auditor fetches the same /watch page a logged-out user would see, so anything that requires authentication is invisible to it.",
  },
  {
    q: "Why doesn't it score the thumbnail?",
    a: "Thumbnail quality is the single biggest CTR factor but it's not measurable from heuristics alone — it's a design judgment. The audit confirms a thumbnail is present and gives you the URL to download it for review; for actual evaluation, A/B-test in YouTube Studio or use a peer review.",
  },
  {
    q: "Why doesn't it score views or engagement?",
    a: "Views/likes/comments are outcomes, not levers. The audit scores the input variables you control before publishing — title, description, tags, hashtags, chapters. Optimising those is what changes the outcomes.",
  },
  {
    q: "Does this use the YouTube Data API?",
    a: "No. The auditor scrapes the public /watch page HTML — the same approach our tag extractor uses. That means no quota limits and no API key required, but also that we depend on YouTube not changing their page structure.",
  },
  {
    q: "Do you save the URLs I audit?",
    a: "Audit results are cached by video ID for 12 hours so a re-run returns instantly. We do not log which URLs were audited by which user — IPs are only held in memory paired with the day to enforce the 30/day fair-use limit.",
  },
];

export default function YouTubeVideoAuditPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <VideoAuditTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the Video Audit
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Most YouTube SEO tools focus on a single field — generate a title,
            extract tags, write a description. The Video Audit goes the other
            way: paste an existing video and see every metadata field scored
            against documented best practices in one pass, with a one-click
            path to the right tool for each weakness.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            Use it before publishing a new video (paste the YouTube URL after
            upload, fix the weak dimensions, then re-run), or on competitors&apos;
            videos to see what they&apos;re doing well that you can borrow.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            What gets scored
          </h3>
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Dimension</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Weight</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Fix-it tool</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="px-4 py-2">Title (length, angle, clickbait)</td>
                  <td className="px-4 py-2 font-mono text-xs">30%</td>
                  <td className="px-4 py-2"><Link href="/tools/youtube-title-generator" className="link">AI Title Generator</Link></td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Description (length, hook, CTA)</td>
                  <td className="px-4 py-2 font-mono text-xs">25%</td>
                  <td className="px-4 py-2"><Link href="/tools/youtube-description-generator" className="link">AI Description Generator</Link></td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Chapters (count, 0:00, ordering)</td>
                  <td className="px-4 py-2 font-mono text-xs">20%</td>
                  <td className="px-4 py-2"><Link href="/tools/youtube-chapter-generator" className="link">Chapter Generator</Link></td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Tags (count, long-tail ratio)</td>
                  <td className="px-4 py-2 font-mono text-xs">15%</td>
                  <td className="px-4 py-2"><Link href="/tools/youtube-tag-generator" className="link">AI Tag Generator</Link></td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Hashtags (count, position)</td>
                  <td className="px-4 py-2 font-mono text-xs">10%</td>
                  <td className="px-4 py-2"><Link href="/tools/youtube-hashtag-generator" className="link">AI Hashtag Generator</Link></td>
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
              The Video Audit chains into every single-purpose tool. Start here, then fix.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li><Link href="/tools/youtube-title-score-checker" className="link text-sm">Title Score Checker →</Link></li>
              <li><Link href="/tools/youtube-tag-extractor" className="link text-sm">Tag Extractor →</Link></li>
              <li><Link href="/tools/youtube-thumbnail-downloader" className="link text-sm">Thumbnail Downloader →</Link></li>
              <li><Link href="/tools" className="link text-sm">All YouTube tools →</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
