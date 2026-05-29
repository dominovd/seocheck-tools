import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { TagGeneratorTool } from "@/components/tools/TagGeneratorTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-tag-generator")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
});

const FAQS = [
  {
    q: "Do YouTube tags still matter?",
    a: "Less than they used to, but not zero. YouTube has stated tags play a 'minimal role' in discovery. They still help with: misspellings of your topic, disambiguation when your title is short, and signaling to YouTube what your video is about for the first hour after upload before engagement data exists. They cost you nothing to add — there's no downside to using them.",
  },
  {
    q: "How does the model know what's a good tag?",
    a: "The model has learned patterns from millions of YouTube videos in its training data: which broad terms creators in each niche use, which long-tail variants surface in autocomplete, which misspellings recur. It mixes broad and long-tail in roughly the proportion top videos use.",
  },
  {
    q: "Why does the tool stop at 480 characters instead of 500?",
    a: "YouTube counts the commas between tags in its 500-char limit. We trim at 480 to leave a small buffer in case you want to add 1-2 manual tags from your own brand or series names.",
  },
  {
    q: "Should I always use all the tags it generates?",
    a: "Usually yes — if all are relevant. If one feels off-topic, drop it. The cost of an irrelevant tag is the tag spot, not a penalty.",
  },
  {
    q: "Can I combine this with the Tag Extractor?",
    a: "That's the recommended workflow. Use the Tag Extractor to see what top videos in your niche tag for. Use this generator to fill in the gaps and add variants they missed. Don't copy a competitor's tags verbatim — it can read as keyword stuffing.",
  },
  {
    q: "How accurate are the misspellings it suggests?",
    a: "The model tries to surface the most common variant spellings of the primary keyword. For brand names and well-known terms it's usually right. For very specialized vocabulary, double-check before using.",
  },
  {
    q: "Is this really free? What's the limit?",
    a: "Yes, free with a fair-use daily limit of 15 generations per IP per day for this tool. Generate as often as you like within that — each generation produces 20-30 tags.",
  },
];

export default function YouTubeTagGeneratorPage() {
  return (
    <>
      <ToolLayout tool={tool}>
        <TagGeneratorTool />
      </ToolLayout>

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the AI Tag Generator
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Describe what your video is about, and the model generates 20-30
            YouTube tags optimized for the 500-character limit YouTube
            enforces. The mix balances broad terms (good for first-hour signal
            to YouTube&apos;s algorithm), long-tail variants (good for search
            from the long tail), and common misspellings of your primary
            keyword.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            Output is in YouTube&apos;s expected order — most important tags
            first — and trimmed to fit under the 500-char ceiling with a
            small buffer for your own additions. One click copies everything
            comma-separated, ready to paste into YouTube Studio.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            What makes a tag list good
          </h3>
          <ul className="mt-3 space-y-3 text-sm text-gray-700">
            <li>
              <strong>Order matters.</strong> YouTube weights earlier tags
              more. The first 3-5 should be your strongest primary keyword
              variants.
            </li>
            <li>
              <strong>Mix broad with specific.</strong> All-broad reads as
              spammy. All-narrow misses the discovery audience. Aim for ~30%
              broad / ~50% mid / ~20% long-tail.
            </li>
            <li>
              <strong>Stay topically tight.</strong> Tags about unrelated
              popular topics (&quot;mr beast&quot;, &quot;viral&quot;) won&apos;t
              help and may flag you for misleading metadata.
            </li>
            <li>
              <strong>Include misspellings deliberately.</strong> If your
              primary keyword has 2-3 common typo variants, include them. This
              is where tags still pull weight that title and description
              can&apos;t.
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
              Pair this with the rest of the SEO toolkit for a full pre-publish setup.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link href="/tools/youtube-tag-extractor" className="link text-sm">
                  Tag Extractor (competitor research) →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-title-generator" className="link text-sm">
                  AI Title Generator →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-description-generator" className="link text-sm">
                  AI Description Generator →
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
