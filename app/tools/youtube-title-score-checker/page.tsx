import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { TitleScoreTool } from "@/components/tools/TitleScoreTool";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-title-score-checker")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
});

const FAQS = [
  {
    q: "How is the score calculated?",
    a: "It's a weighted sum of measurable signals — length vs the 40-70 char sweet spot, presence of a number, all-caps and excessive punctuation detection, power-word density, detected angle (curiosity / listicle / how-to / etc.), active verb in the first 5 words, and stop-word ratio. Every signal that contributes to your score is shown with a one-line explanation. No black box.",
  },
  {
    q: "Why 40-70 characters?",
    a: "Above 70 chars, YouTube truncates titles with an ellipsis in search results, browse feeds, and the related-videos column — viewers can't read what's past the cutoff. Below 30 chars, you usually can't pack enough keyword + curiosity to compete. The 40-70 range maximises full-display rate without sacrificing density.",
  },
  {
    q: "Should I always aim for the highest possible score?",
    a: "No. The scorer rewards titles that follow documented best practices, but the best title is the most accurate one written most interestingly — not the most rule-compliant. A contrarian title that scores 65 can outperform a rule-perfect 90 if it's honest to the video. Use the score to catch obvious mistakes, not as the final word.",
  },
  {
    q: "What does the 'detected angle' mean?",
    a: "We classify your title into one of seven angles: how-to, listicle, curiosity, comparison, story, review, contrarian — based on its grammatical structure. Having a clear angle is a positive signal because YouTube's topical classifier places videos in format clusters; titles without a clear angle get flattened.",
  },
  {
    q: "Can I compare multiple titles?",
    a: "Yes — click 'Add another variant' (up to 5 at a time) to score multiple candidates side-by-side. The ranked summary at the top sorts by score. This is the recommended workflow: generate 10 titles with the AI Title Generator, paste your top 3-5 here, pick the winner.",
  },
  {
    q: "Why doesn't it detect clickbait perfectly?",
    a: "Power-word density is a proxy, not a final verdict. A title with 'shocking' and 'truth' can be honest if the video delivers; a title with neither can still oversell. The scorer flags the risk pattern — you decide whether your video actually delivers on the implied promise.",
  },
  {
    q: "Do you save the titles I paste?",
    a: "No. Scoring is entirely client-side JavaScript — your input never leaves the browser. We don't log titles, don't cache them, don't send them anywhere.",
  },
];

export default function YouTubeTitleScoreCheckerPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <TitleScoreTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the Title Score Checker
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Other YouTube tools generate titles. This one evaluates them. Paste
            a candidate, get a 0-100 score against documented best practices,
            and see exactly which signals contributed — length, structure,
            angle, density of power words, all-caps and punctuation patterns,
            active-verb placement, and more.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            The score is a heuristic, not a prediction. It catches the obvious
            mistakes — titles that get truncated in SERP, titles in ALL CAPS,
            titles padded with three power words — and rewards the patterns
            that correlate with higher CTR across niches.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            What gets scored
          </h3>
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Signal
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Direction
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="px-4 py-2">Length in the 40-70 char sweet spot</td>
                  <td className="px-4 py-2 text-brand-700">+25</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Length over 70 chars (truncation)</td>
                  <td className="px-4 py-2 text-red-700">-15 to -25</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Contains a number</td>
                  <td className="px-4 py-2 text-brand-700">+8</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">ALL CAPS or 2+ all-caps words</td>
                  <td className="px-4 py-2 text-red-700">-20 to -25</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">!!! / ?!?! punctuation bursts</td>
                  <td className="px-4 py-2 text-red-700">-12</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">3+ power words (clickbait risk)</td>
                  <td className="px-4 py-2 text-red-700">-10</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Clear angle (how-to / listicle / curiosity / etc.)</td>
                  <td className="px-4 py-2 text-brand-700">+6</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Question format</td>
                  <td className="px-4 py-2 text-brand-700">+4</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Active verb in first 5 words</td>
                  <td className="px-4 py-2 text-brand-700">+3</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">High stop-word ratio (generic title)</td>
                  <td className="px-4 py-2 text-amber-700">-6</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Proper noun + number (specificity)</td>
                  <td className="px-4 py-2 text-brand-700">+3</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            Score bands
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>
              <strong className="text-brand-700">80-100 — Strong.</strong> The
              title follows documented best practices and has a clear angle.
              Ship it.
            </li>
            <li>
              <strong className="text-brand-600">60-79 — Good.</strong> Works,
              but one or two signals are weaker than they could be. Consider
              the suggestions before publishing.
            </li>
            <li>
              <strong className="text-amber-700">40-59 — Fair.</strong>{" "}
              Functional but at least one significant issue (truncation,
              generic phrasing, missing angle). Worth iterating.
            </li>
            <li>
              <strong className="text-red-700">0-39 — Weak.</strong> Multiple
              red signals. Most likely truncated, all-caps, padded with power
              words, or missing the basics.
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
            <h3 className="text-base font-semibold text-gray-900">
              Related tools
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Generate, then score. The cleanest pre-publish workflow.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link href="/tools/youtube-title-generator" className="link text-sm">
                  AI Title Generator →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-keyword-tool" className="link text-sm">
                  Keyword Tool →
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
