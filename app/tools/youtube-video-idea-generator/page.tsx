import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { VideoIdeaGeneratorTool } from "@/components/tools/VideoIdeaGeneratorTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";

const tool = getToolBySlug("youtube-video-idea-generator")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

const FAQS = [
  {
    q: "How do I get genuinely useful ideas instead of generic ones?",
    a: "Be specific in the niche description. \"Cooking\" gets you generic ideas; \"solo home-cooking on a $30/week grocery budget aimed at college students\" gets you sharp, executable ones. The narrower the input, the better.",
  },
  {
    q: "What does each format do?",
    a: "Mixed gives variety. Tutorial = how-to / step-by-step. Deep dive = explainer or analytical. Listicle = numbered lists. Experiment = \"I tried X for Y days\" framing. Comparison = vs / showdown. Review = product / tool reviews. Pick a format if your channel has a signature style.",
  },
  {
    q: "Are these ideas already used by other creators?",
    a: "Probably some are. The model trains on what's worked on YouTube, so popular angles will come up. Use them as starting points — your unique take + your specific audience is what differentiates the execution.",
  },
  {
    q: "Why is each idea shown with a premise?",
    a: "A bare title isn't enough to plan a video around. The premise tells you what the video would actually contain — the angle, what the viewer learns, the structure. Use it as a working brief, then refine.",
  },
  {
    q: "Can I get ideas for a YouTube series?",
    a: "Yes — describe the series concept in the niche field. e.g. \"weekly series on rebuilding a vintage motorcycle from a flooded $200 starter bike\" returns episode ideas that fit a recurring format.",
  },
  {
    q: "How often should I regenerate?",
    a: "Each generation produces a different batch — the model uses temperature 0.9 (more creative) for ideas, so even the same niche + format returns fresh ideas on the next click. Generate 2-3 batches and you'll have 20-30 ideas to filter.",
  },
  {
    q: "Are these ideas copyrightable?",
    a: "Ideas themselves aren't copyrightable in most jurisdictions — execution is. You can take any idea here, film your version, and publish without attribution. The model holds no rights over what it generates for you.",
  },
];

export default function YouTubeVideoIdeaGeneratorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <VideoIdeaGeneratorTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the AI Video Idea Generator
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Describe your channel&apos;s niche and pick a format, and the
            model returns 10 video ideas — each with a working title and a
            short premise explaining the angle. Built for the brainstorming
            phase, when you have content slots to fill but want sharper
            angles than &quot;more cooking videos&quot;.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            The model uses higher creative temperature for this tool than the
            title or tag generators — variety matters more than precision
            here. Run it twice with the same input and you&apos;ll get
            different ideas each time.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            How creators use this tool
          </h3>
          <ul className="mt-3 space-y-3 text-sm text-gray-700">
            <li>
              <strong>Monthly content planning.</strong> Generate 2-3 batches
              for the month ahead, pick 4-8 ideas to film.
            </li>
            <li>
              <strong>Unblocking when stuck.</strong> When the next-video
              decision feels frozen, scan 10 ideas — usually one immediately
              feels right.
            </li>
            <li>
              <strong>Pivot exploration.</strong> Type the niche you&apos;re
              considering pivoting into to see whether you can name 10 videos
              you&apos;d be excited to make there.
            </li>
            <li>
              <strong>Format experimentation.</strong> Pick a format you
              haven&apos;t tried (experiments, deep dives) to see what your
              niche looks like through a different lens.
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
              Once you&apos;ve picked an idea, finish the pre-publish workflow.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
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
