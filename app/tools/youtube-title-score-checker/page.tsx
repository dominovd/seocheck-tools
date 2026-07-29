import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { TitleScoreTool } from "@/components/tools/TitleScoreTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-title-score-checker")!;

const PAGE_TITLE = "YouTube Title Analyzer";
const META_DESCRIPTION =
  "Free YouTube title analyzer. Test title length, clarity, angle, keyword placement, truncation risk, and clickbait signals. Compare up to 5 variants.";
const OG_DESCRIPTION =
  "Score and compare YouTube title ideas before publishing. Catch length, clarity, truncation, and clickbait-risk issues while they are easy to fix.";

const base = buildMetadata({
  title: "YouTube Title Analyzer | Free SEO Title Tool",
  // Slug remains /tools/youtube-title-score-checker for SEO continuity; display renamed.
  description: META_DESCRIPTION,
  path: `tools/${tool.slug}`,
  noBrand: true,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

export const metadata = {
  ...base,
  openGraph: {
    ...base.openGraph,
    title: PAGE_TITLE,
    description: OG_DESCRIPTION,
  },
  twitter: {
    ...base.twitter,
    title: PAGE_TITLE,
    description: OG_DESCRIPTION,
  },
};

const HERO_SUBTITLE =
  "Paste a YouTube title to get editorial signals on length, clarity, angle, keyword placement, truncation risk, and clickbait cues. Compare up to 5 title variants before you publish.";

const ABOVE_FOLD_BULLETS = [
  "Editorial signals for any YouTube title.",
  "Compare up to 5 variants side by side before publishing.",
  "Catches truncation, clickbait risk, vague angle, and weak keyword placement.",
];

const SIGNALS = [
  "length and truncation risk",
  "clarity of the viewer promise",
  "whether the title has a recognizable angle",
  "keyword or topic placement",
  "overuse of all caps",
  "excessive punctuation",
  "clickbait-risk words",
  "generic phrasing",
  "numbers, comparisons, questions, and how-to structures",
  "whether the strongest words appear early enough",
];

type LengthBand = {
  range: string;
  body: string;
  accent: "red" | "emerald" | "amber" | "brand";
};

const LENGTH_BANDS: LengthBand[] = [
  {
    range: "Under 30 chars",
    body: "Often lacks enough context for the viewer to commit to a click.",
    accent: "red",
  },
  {
    range: "40-70 chars",
    body: "Usually the safest working range for full display in search, home, and sidebar.",
    accent: "emerald",
  },
  {
    range: "Over 70 chars",
    body: "Increases truncation risk in sidebar, browse, and mobile feeds.",
    accent: "amber",
  },
  {
    range: "First 40-50 chars",
    body: "Should carry the main promise. Do not bury the keyword at the end.",
    accent: "brand",
  },
];

const BAND_CLASSES: Record<string, { ring: string; bg: string; label: string }> = {
  red: { ring: "border-red-100", bg: "bg-red-50/30", label: "text-red-700" },
  emerald: { ring: "border-emerald-100", bg: "bg-emerald-50/30", label: "text-emerald-700" },
  amber: { ring: "border-amber-100", bg: "bg-amber-50/30", label: "text-amber-700" },
  brand: { ring: "border-brand-100", bg: "bg-brand-50/30", label: "text-brand-700" },
};

const SCORE_CATCHES = [
  "titles that are too long",
  "vague titles with no angle",
  "titles that rely on clickbait words",
  "titles that repeat the thumbnail instead of adding meaning",
  "titles that bury the keyword or promise",
  "titles that sound generic next to competitors",
];

const COMPARE_STEPS = [
  "Write or generate 5-10 title ideas.",
  "Pick the strongest 3-5.",
  "Paste them into the checker.",
  "Compare length, clarity, angle, and risk signals.",
  "Choose the title that is clear, honest, and differentiated.",
  "Preview it with the thumbnail before publishing.",
];

const BEST_WORKFLOW: { step: string; tool?: { name: string; href: string } }[] = [
  {
    step: "Clarify the topic before writing titles.",
    tool: { name: "Video Idea Generator", href: "/tools/youtube-video-idea-generator" },
  },
  {
    step: "Create title options for the topic.",
    tool: { name: "Title Generator", href: "/tools/youtube-title-generator" },
  },
  {
    step: "Score and compare the best variants here.",
  },
  {
    step: "Test the chosen title with the thumbnail in YouTube-style layouts.",
    tool: { name: "Thumbnail Preview", href: "/tools/youtube-thumbnail-preview" },
  },
  {
    step: "After publishing, check the full metadata package.",
    tool: { name: "Video Audit", href: "/tools/youtube-video-audit" },
  },
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-title-generator",
    name: "Title Generator",
    body: "Create title options from a topic.",
  },
  {
    href: "/tools/youtube-thumbnail-preview",
    name: "Thumbnail Preview",
    body: "Test the title with the thumbnail in YouTube-style layouts.",
  },
  {
    href: "/tools/youtube-keyword-tool",
    name: "Keyword Tool",
    body: "Find search phrases to include naturally.",
  },
  {
    href: "/tools/youtube-video-idea-generator",
    name: "Video Idea Generator",
    body: "Clarify the topic before writing titles.",
  },
  {
    href: "/tools/youtube-description-generator",
    name: "Description Generator",
    body: "Write the supporting description.",
  },
  {
    href: "/tools/youtube-video-audit",
    name: "Video Audit",
    body: "Check the final published metadata.",
  },
];

const FAQS = [
  {
    q: "Is this YouTube Title Analyzer free?",
    a: "Yes. The tool is free to use and does not require signup.",
  },
  {
    q: "How does the YouTube Title Analyzer work?",
    a: "The analyzer runs deterministic editorial checks against a title: length, truncation risk, angle detection, clarity, keyword placement, punctuation, all-caps usage, clickbait-risk language, and structural patterns like questions, numbers, comparisons, and how-to phrasing. Each check produces a good, warning, or bad signal you can act on. No composite numeric score is produced.",
  },
  {
    q: "Does the analyzer predict CTR?",
    a: "No. The analyzer does not predict your actual click-through rate. CTR depends on the topic, audience, thumbnail, traffic source, competition, timing, and viewer history. It helps you catch title issues that may hurt performance.",
  },
  {
    q: "What is the best YouTube title length?",
    a: "A practical range is 40-70 characters. Shorter titles can lack context, while longer titles are more likely to be truncated in search, browse, mobile, or sidebar layouts.",
  },
  {
    q: "Should I always use the highest-scoring title?",
    a: "Not always. Use the signals as guidance, not as the final decision. Choose the title that is clear, accurate, differentiated, and aligned with the thumbnail.",
  },
  {
    q: "Can I compare multiple YouTube titles?",
    a: "Yes. Compare up to 5 variants side by side. This is useful when you have several title ideas and want to see which one has the strongest structure.",
  },
  {
    q: "What is clickbait risk?",
    a: "Clickbait risk means the title uses exaggerated wording, excessive punctuation, or a promise that may be bigger than the video can deliver. A strong title can create curiosity without misleading the viewer.",
  },
  {
    q: "Does YouTube title affect SEO?",
    a: "Yes. The title helps YouTube and viewers understand the topic. It can influence search relevance, click-through behavior, and how the video is framed, but it works together with the thumbnail, description, retention, and audience satisfaction.",
  },
  {
    q: "Are my titles stored?",
    a: "No. The checker runs in the browser. Your title text is not uploaded, logged, or stored.",
  },
  {
    q: "What should I do after scoring a title?",
    a: "Rewrite weak variants, choose the strongest title, then preview it with the thumbnail. The title and thumbnail should work together as one viewer promise.",
  },
];

export default function YouTubeTitleScoreCheckerPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <TitleScoreTool />
      </ToolLayout>

      {/* Above-fold benefit bullets */}
      <section className="border-t border-gray-100 bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ul className="grid gap-3 sm:grid-cols-3">
            {ABOVE_FOLD_BULLETS.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 rounded-xl bg-gray-50/60 p-4 text-sm text-gray-700 ring-1 ring-gray-100 leading-relaxed"
              >
                <Check
                  className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-center text-xs text-gray-500">
            Runs in your browser. Titles are not uploaded or stored.
          </p>
        </div>
      </section>

      {/* Check your YouTube title before you publish */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Check your YouTube title before you publish
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Your title is one of the first things viewers use to decide
            whether a video is worth clicking. It has to do several jobs
            at once: describe the topic, create a reason to watch, fit the
            surface where it appears, and support the thumbnail without
            repeating it.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The YouTube Title Analyzer helps you catch title problems
            before the video goes live. Paste one title or compare several
            variants side-by-side and review the flagged signals.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The signals are not a promise of views. They are a quality check for
            common title issues that are easy to miss when you are too
            close to the video.
          </p>
        </div>
      </section>

      {/* What the title analyzer checks */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What the analyzer checks
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The checker evaluates signals that affect how a title reads on
            YouTube:
          </p>

          <ul className="mt-8 space-y-3">
            {SIGNALS.map((s) => (
              <li
                key={s}
                className="flex gap-3 rounded-lg bg-gray-50/60 p-4 text-sm text-gray-700 leading-relaxed ring-1 ring-gray-100"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>{s}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-sm text-gray-800 leading-relaxed">
            Every signal is meant to answer one question: will a viewer
            understand the video quickly enough to consider clicking?
          </p>
        </div>
      </section>

      {/* Why title length matters */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Why title length matters
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            YouTube titles can be long, but viewers do not always see the
            full title. Search, home, suggested videos, mobile, and
            sidebar layouts can truncate titles differently.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            As a practical rule:
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {LENGTH_BANDS.map((b) => {
              const c = BAND_CLASSES[b.accent];
              return (
                <div
                  key={b.range}
                  className={`rounded-2xl border ${c.ring} ${c.bg} p-5`}
                >
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-wider ${c.label}`}
                  >
                    {b.range}
                  </p>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {b.body}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Do not hide the important part at the end. If the title only
            makes sense after the final phrase, many viewers will never
            see it.
          </p>
        </div>
      </section>

      {/* A clean signal read is useful, but not final */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            A clean signal read is useful, but not final
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The tool rewards titles that follow strong YouTube packaging
            habits. But a title can read cleanly through the analyzer and still be
            wrong for the video. It can also flag several signals and still work because the
            idea is specific, honest, or intentionally unusual.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use the analyzer to catch:
          </p>

          <ul className="mt-6 space-y-2">
            {SCORE_CATCHES.map((c) => (
              <li
                key={c}
                className="flex gap-3 text-sm text-gray-700 leading-relaxed"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>{c}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Then use your judgment. The title must match the video, the
            thumbnail, and the audience.
          </p>
        </div>
      </section>

      {/* How to compare title variants */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How to compare title variants
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The strongest workflow is not one title. It is a shortlist.
          </p>

          <ol className="mt-8 space-y-4">
            {COMPARE_STEPS.map((step, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            If two titles flag similar signals, choose the one that better
            matches the thumbnail and makes the payoff easier to
            understand.
          </p>
        </div>
      </section>

      {/* Title Generator vs Title Analyzer */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Title Generator vs Title Analyzer
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-violet-100 bg-violet-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-700">
                TITLE GENERATOR
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                When you need new title ideas
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                Use{" "}
                <Link
                  href="/tools/youtube-title-generator"
                  className="font-medium text-violet-700 hover:underline"
                >
                  Title Generator
                </Link>{" "}
                when you do not yet have title candidates and want a
                batch of options from a topic.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                TITLE SCORE CHECKER
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                When you have candidates to compare
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                Use Title Analyzer when you already have title
                candidates and want to choose or improve one.
              </p>
            </div>
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Best workflow:
          </p>

          <ol className="mt-6 space-y-4">
            {BEST_WORKFLOW.map(({ step, tool: t }, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {step}
                  {t && (
                    <>
                      {" "}
                      <Link
                        href={t.href}
                        className="font-medium text-brand-700 hover:underline"
                      >
                        {t.name}
                      </Link>
                      {"."}
                    </>
                  )}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <RelatedGuideCallout slug={tool.slug} />

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl text-center">
            Frequently asked
          </h2>
          <dl className="mt-10 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="group px-5 py-4 sm:px-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-3 text-left text-sm font-semibold text-gray-900 sm:text-base">
                  <span>{item.q}</span>
                  <span className="mt-0.5 text-gray-400 transition-transform group-open:rotate-180">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <dd className="mt-3 text-sm text-gray-700 leading-relaxed">
                  {item.a}
                </dd>
              </details>
            ))}
          </dl>
        </div>
      </section>

      {/* Related tools */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Generate, analyze, then preview
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Use these tools to build a stronger title and test how it
              works with the rest of the video package.
            </p>
          </div>

          <div className="mx-auto mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RELATED_TOOLS.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-sm"
              >
                <p className="text-base font-semibold text-gray-900 group-hover:text-brand-700 transition">
                  {r.name}
                </p>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  {r.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-600 group-hover:text-brand-700 transition">
                  Open
                  <ArrowRight
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2.25}
                  />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/tools" className="link text-sm">
              Browse all YouTube SEO tools →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Ready to analyze your title?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Paste up to 5 title variants and pick the strongest one
            before you publish.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Score a title
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
