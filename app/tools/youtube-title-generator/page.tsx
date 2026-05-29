import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { TitleGeneratorTool } from "@/components/tools/TitleGeneratorTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";

const tool = getToolBySlug("youtube-title-generator")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

const FAQS = [
  {
    q: "Is this really free?",
    a: "Yes, with a fair-use daily limit. You can generate up to 15 batches of titles per day per IP. The Unicode and browser-side tools have no limit. We rely on Anthropic's Claude Haiku for the actual generation — your prompt and the output are not stored on our end.",
  },
  {
    q: "Why does YouTube recommend titles 40-70 characters?",
    a: "Above 70 characters, YouTube truncates the title with an ellipsis in search results, browse feeds, and the related-videos column. Below 30 characters, you usually don't pack enough keyword + curiosity to compete. The 40-70 sweet spot maximizes both information density and full-display rate.",
  },
  {
    q: "Should I always pick the longest title in the result?",
    a: "No. Pick the one that matches your video's actual content — the click-through rate suffers fast when the title oversells. Use length as a tie-breaker between equally-honest options.",
  },
  {
    q: "What does each style do?",
    a: "Mixed gives variety across 6 angles — good default. Curiosity opens a loop ('Why nobody talks about…'). Listicle uses numbers ('7 things…'). How-to is tutorial-framed. Comparison uses 'vs' or 'or'. Contrarian takes the counter-position. Story is first-person ('I tried…').",
  },
  {
    q: "Can I keep generating until I find one I like?",
    a: "Yes, but each generation counts against your daily 15. The 'Generate new batch' button regenerates with a fresh seed; same topic + same style on a different click usually returns different titles.",
  },
  {
    q: "Are the titles copyrightable? Can I use them commercially?",
    a: "AI-generated content's copyright status varies by jurisdiction — in the US, purely AI-generated text is generally not copyrightable. You can use any title for any lawful purpose, including commercial use, without attribution. We claim no rights over what the model generates for you.",
  },
  {
    q: "Which AI model powers this?",
    a: "Claude Haiku 4.5 from Anthropic. It's the fast, lightweight model in the Claude 4 family — well-suited to short, structured creative tasks like title generation. Each batch costs us about $0.003 to run, which is why we can offer it for free at this volume.",
  },
];

export default function YouTubeTitleGeneratorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <TitleGeneratorTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the AI Title Generator
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Type a topic, pick a style (or keep &quot;Mixed&quot; for variety),
            and get 10 click-worthy YouTube titles in seconds. The model
            generates titles in the 40-70 character sweet spot YouTube
            recommends, mixes angles so you have honest options to choose
            from, and never repeats the exact same batch twice.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            All generation happens server-side through Anthropic&apos;s Claude
            Haiku API. We don&apos;t store your topic or the generated titles
            — we only track an anonymized per-IP daily counter to keep the
            free service free.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            How to write a topic that gets good titles
          </h3>
          <ul className="mt-3 space-y-3 text-sm text-gray-700">
            <li>
              <strong>Be specific.</strong> &quot;Tech review&quot; gets
              generic output. &quot;Honest M5 MacBook Pro review after 30 days
              for video editors&quot; gets sharp titles.
            </li>
            <li>
              <strong>Include the angle.</strong> Are you contrarian? Excited?
              Trying to debunk? Mention it. The model uses it.
            </li>
            <li>
              <strong>Mention the target viewer.</strong> &quot;For beginners&quot;,
              &quot;for people who already use Notion&quot;, &quot;for solo
              creators&quot; — these shape the titles meaningfully.
            </li>
            <li>
              <strong>Skip the keyword stuffing.</strong> The model will work
              in keywords naturally. You don&apos;t need to list 5 search terms.
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
              Use these together for a complete pre-publish workflow.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link href="/tools/youtube-description-generator" className="link text-sm">
                  AI Description Generator →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-tag-generator" className="link text-sm">
                  AI Tag Generator →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-keyword-tool" className="link text-sm">
                  Keyword Tool →
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
