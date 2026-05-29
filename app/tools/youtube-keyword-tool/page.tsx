import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { KeywordToolTool } from "@/components/tools/KeywordToolTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";

const tool = getToolBySlug("youtube-keyword-tool")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

const FAQS = [
  {
    q: "Where do these suggestions come from?",
    a: "The same autocomplete YouTube shows when you start typing in its search bar. We hit the public suggest endpoint server-side, so you don't have to type letter-by-letter — and you can pivot the region without leaving the tab.",
  },
  {
    q: "What does 'Expand A-Z' do?",
    a: "It runs 26 parallel queries — your seed + ' a', ' b', ' c', through ' z' — to surface the long-tail variants YouTube has data on. So 'drone review' becomes 'drone review at night', 'drone review beginners', 'drone review camera', and so on. Most seeds produce 80-150 unique variants after de-duplication.",
  },
  {
    q: "Why doesn't this show search volume?",
    a: "YouTube doesn't expose volume in its public suggest API. For volume estimates you need a paid keyword tool that scrapes SERPs or uses clickstream data (Ahrefs, Semrush, Keywordtool.io). This tool is for discovery — what are people actually typing — not for volume sizing.",
  },
  {
    q: "Does region matter?",
    a: "A lot. US suggestions, UK suggestions, and Indian suggestions for the same seed are often noticeably different — different spellings, different popular brands, different angles. If your channel targets a specific country, pick that region.",
  },
  {
    q: "How are suggestions grouped?",
    a: "Pattern matching on the suggestion text. Anything containing 'what / why / how' goes to Questions, 'vs / or / alternative' to Comparisons, 'best / top / free' to Best & top, 'tutorial / guide' to Tutorials. Everything else lands in Other variants. Use Flat view if you want them in YouTube's original order.",
  },
  {
    q: "Is this against YouTube's terms?",
    a: "No. The autocomplete suggest endpoint is a public, undocumented-but-stable interface that every browser and dozens of SEO tools use. We hit it the same way your browser would.",
  },
  {
    q: "Why is the rate limit so generous?",
    a: "Suggest requests are cheap (a single request per seed for base mode, or 27 parallel for expand). 50 lookups/day is more than any single creator needs in a session. We rely on light rate limiting + 6-hour cache to keep YouTube happy.",
  },
];

export default function YouTubeKeywordToolPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <KeywordToolTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the Keyword Tool
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            YouTube&apos;s autocomplete is one of the most under-used SEO
            signals on the platform. Every suggestion you see when typing is
            backed by real search data — that&apos;s what makes it valuable.
            Most creators only see the first 10 hints YouTube shows them. This
            tool surfaces those, and lets you expand to 100+ long-tail
            variants in one click.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            Suggestions are fetched server-side from the same public endpoint
            YouTube&apos;s own search bar uses, with a region/language pair
            you choose. Nothing is stored beyond a per-seed cache so repeat
            lookups don&apos;t re-hit YouTube.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            How creators use it
          </h3>
          <ul className="mt-3 space-y-3 text-sm text-gray-700">
            <li>
              <strong>Title generation.</strong> Expand a topic and pick the
              variant that matches your video&apos;s angle exactly — instant
              title + you know it&apos;s what people are searching for.
            </li>
            <li>
              <strong>Series planning.</strong> Each expanded variant is a
              potential episode. &quot;Drone review&quot; → review per model,
              per use-case, per beginner-vs-pro split.
            </li>
            <li>
              <strong>Tag research.</strong> Combine with the Tag Extractor:
              find competitor tags, then verify which variants actually have
              search interest here.
            </li>
            <li>
              <strong>Region pivoting.</strong> Run the same seed across US,
              UK, and India to see if your channel should localize content or
              language for a different market.
            </li>
          </ul>

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
              Pair this with the rest of the SEO toolkit.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link href="/tools/youtube-tag-extractor" className="link text-sm">
                  Tag Extractor →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-tag-generator" className="link text-sm">
                  AI Tag Generator →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-title-generator" className="link text-sm">
                  AI Title Generator →
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
