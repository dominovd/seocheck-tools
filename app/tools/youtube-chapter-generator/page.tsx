import Link from "next/link";
import { Check, ArrowRight, X } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { ChapterGeneratorTool } from "@/components/tools/ChapterGeneratorTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-chapter-generator")!;

const PAGE_TITLE = "YouTube Chapter Generator";
const META_DESCRIPTION =
  "Generate and validate YouTube chapters for your video description. Format timestamps, check the required 0:00 start, fix ordering, and copy a paste-ready chapter block.";
const OG_DESCRIPTION =
  "Create paste-ready YouTube chapters and timestamps. Validate the 0:00 start, 3+ chapter rule, 10-second minimum, and timestamp order before publishing.";

const base = buildMetadata({
  title: "YouTube Chapter Generator | Free Timestamp Formatter",
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
  "Format YouTube timestamps into a clean chapter block and catch the rules that make chapters fail: missing 0:00, too few sections, short chapters, and out-of-order timestamps.";

const ABOVE_FOLD_BULLETS = [
  "Validates the 0:00 start, 3-chapter minimum, and 10-second rule.",
  "Fixes ordering issues before YouTube silently ignores the block.",
  "Plain or dash-separated output, ready to paste into the description.",
];

const CHECKS = [
  "First timestamp starts at 0:00",
  "You have at least 3 chapters",
  "Timestamps are in ascending order",
  "Each chapter is at least 10 seconds long",
  "Hour-long timestamps use a valid h:mm:ss format",
  "Chapter titles are present and readable",
  "Output is clean enough to paste into the YouTube description",
];

const NAVIGATION_EXAMPLES = [
  "0:00 What this fix solves",
  "2:14 Before and after example",
  "5:30 Settings to change",
  "8:05 Common mistake",
  "10:42 Final checklist",
];

const HOW_IT_WORKS = [
  "Paste your chapter lines in timestamp order.",
  "The tool parses timestamps and titles from each line.",
  "It checks YouTube's chapter rules: 0:00 start, 3+ sections, 10-second minimum, and ascending order.",
  "It flags any line that prevents chapters from rendering.",
  "Choose plain or dash-separated output.",
  "Copy the formatted block into your YouTube description.",
];

const REQUIRED_RULES = [
  "First timestamp at 0:00",
  "At least 3 chapters",
  "Each chapter at least 10 seconds long",
  "Timestamps in ascending order",
];

const SAFE_FORMATS = ["0:00 Intro", "0:00 - Intro", "1:02:33 Full example"];

const AVOID_FORMATS = [
  "Missing titles",
  "Duplicate timestamps",
  "Chapters shorter than 10 seconds",
  "Decorative separators between every line",
  "Repeating the same keyword in every chapter title",
];

const RETENTION_TIPS = [
  {
    name: "Use chapters where navigation helps",
    body: "Chapters are most useful on tutorials, reviews, interviews, podcasts, webinars, product demos, explainers, and long comparison videos. They help viewers skip to the part they need instead of abandoning the video.",
  },
  {
    name: "Make chapter labels specific",
    body: 'Specific labels are easier to scan and may give YouTube clearer context about the structure of the video. "Fix audio sync in Premiere Pro" is better than "Step 2."',
  },
  {
    name: "Do not over-chapter short videos",
    body: "For a short video, too many chapters can make the description feel noisy. Use chapters when the video has real sections, not just because the option exists.",
  },
  {
    name: "Put the chapter block where viewers can find it",
    body: "Place chapters near the top of the description, especially for tutorials and long videos. If the description starts with a wall of links, the navigation value is easier to miss.",
  },
  {
    name: "Use chapters while planning the video",
    body: "A strong chapter outline can become the filming structure. If you cannot write clear chapters before recording, the video may not have a clear enough sequence yet.",
  },
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-description-generator",
    name: "Description Generator",
    body: "Generate a publish-ready YouTube description for the chapter block to live in.",
  },
  {
    href: "/tools/youtube-embed-code-generator",
    name: "Embed Code Generator",
    body: "Build a custom iframe with start time and player options.",
  },
  {
    href: "/tools/youtube-video-audit",
    name: "Video Audit",
    body: "Audit the published video's full metadata, including chapters.",
  },
  {
    href: "/tools/youtube-title-score-checker",
    name: "Title Analyzer",
    body: "Score the title and compare variants before publishing.",
  },
  {
    href: "/tools/youtube-thumbnail-preview",
    name: "Thumbnail Preview",
    body: "Test the thumbnail and title across YouTube surfaces.",
  },
  {
    href: "/tools",
    name: "All Publish tools",
    body: "Browse the rest of the publish workflow.",
  },
];

const FAQS = [
  {
    q: "Is this YouTube Chapter Generator free?",
    a: "Yes. It is free, browser-side, and does not require signup.",
  },
  {
    q: "What is the difference between YouTube chapters and timestamps?",
    a: "Timestamps are the text entries in your description. Chapters are the clickable sections YouTube creates from those timestamps when the format follows its rules.",
  },
  {
    q: "What are YouTube's chapter requirements?",
    a: "Use a first timestamp of 0:00, add at least 3 chapters, keep every chapter at least 10 seconds long, and make sure timestamps are in ascending order.",
  },
  {
    q: "Why are my YouTube chapters not showing?",
    a: "Usually one rule is broken: the first timestamp is not 0:00, there are fewer than 3 chapters, one chapter is too short, or the timestamps are not in order. YouTube may ignore the whole chapter block when this happens.",
  },
  {
    q: "Do YouTube chapters help SEO?",
    a: "They can help indirectly by improving navigation, satisfaction, and retention on videos where viewers want to jump between sections. They also give YouTube and viewers a clearer view of the video's structure.",
  },
  {
    q: "Can I generate timestamps for a YouTube video automatically?",
    a: "This tool formats and validates timestamp lines you provide. If you need fully automatic timestamps, start from a transcript or outline, then paste the draft here to clean and validate it.",
  },
  {
    q: "Do YouTube Shorts support chapters?",
    a: "No. Chapters are for long-form YouTube videos, not Shorts.",
  },
  {
    q: "Can I use emojis in chapter titles?",
    a: "Yes, but use them sparingly. They can help visual scanning, but they are not a ranking factor and can make a chapter list look messy if overused.",
  },
  {
    q: "What is the best format for YouTube timestamps?",
    a: "The safest format is 0:00 Chapter title. Dash-separated lines like 0:00 - Chapter title also work well and are easier to read in long descriptions.",
  },
  {
    q: "Why does YouTube show automatic chapters instead of mine?",
    a: "If your manual chapter block is invalid, YouTube may still show auto-generated chapters. Check the manual timestamp rules first, then review the auto-chapter setting in YouTube Studio if needed.",
  },
  {
    q: "Do you store my chapter text?",
    a: "No. The formatting and validation happen in your browser.",
  },
];

export default function YouTubeChapterGeneratorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <ChapterGeneratorTool />
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
            Free browser-side tool. No signup. Your chapter text is not
            uploaded or stored.
          </p>
        </div>
      </section>

      {/* Generate YouTube chapters YouTube will actually read */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Generate YouTube chapters YouTube will actually read
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            YouTube chapters are simple on the surface: add timestamps to
            the video description and YouTube turns them into clickable
            sections on the progress bar. The frustrating part is that
            YouTube is strict. If the format is wrong, chapters usually do
            not render, and YouTube does not explain why.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            This free YouTube Chapter Generator formats your timestamp
            list and checks the rules that matter before you paste it
            into YouTube Studio.
          </p>
        </div>
      </section>

      {/* What the tool checks */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What the tool checks
          </h2>

          <ul className="mt-8 space-y-3">
            {CHECKS.map((c) => (
              <li
                key={c}
                className="flex gap-3 rounded-lg bg-gray-50/60 p-4 text-sm text-gray-700 leading-relaxed ring-1 ring-gray-100"
              >
                <Check
                  className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why YouTube chapters fail */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Why YouTube chapters fail
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Most broken chapter blocks fail for small reasons: the first
            line starts at{" "}
            <span className="font-mono text-sm">0:01</span>, there are
            only two sections, one chapter is six seconds long, or a
            timestamp is out of order after an edit. YouTube often ignores
            the whole block instead of showing a helpful error.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The generator turns that invisible failure into a checklist,
            so you can fix the issue before publishing.
          </p>
        </div>
      </section>

      {/* Chapters are navigation, not decoration */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Chapters are navigation, not decoration
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Good chapter titles help viewers decide where to jump. They
            should describe the actual section, not repeat vague labels
            like &quot;Part 1&quot; or &quot;More tips.&quot;
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use chapters to name the moments people came for:
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/60">
            <ul className="divide-y divide-gray-100">
              {NAVIGATION_EXAMPLES.map((line) => (
                <li
                  key={line}
                  className="px-5 py-3 font-mono text-sm text-gray-800"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Manual chapters vs YouTube auto chapters */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Manual chapters vs YouTube auto chapters
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            YouTube can generate automatic chapters for some videos, but
            they are inferred from the content. Manual chapters give you
            control over the labels, structure, and exact start points.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            If YouTube shows chapters even when your manual block is
            invalid, you may be seeing auto-generated chapters instead of
            your description timestamps.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How it works
          </h2>

          <ol className="mt-8 space-y-4">
            {HOW_IT_WORKS.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Practical chapter rules */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Practical chapter rules
          </h2>

          <div className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/30 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
              Required rules
            </p>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              YouTube chapters normally need:
            </p>
            <ul className="mt-3 space-y-2">
              {REQUIRED_RULES.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-2 text-sm text-gray-800"
                >
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-brand-600 mt-1"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Safe formats
              </p>
              <ul className="mt-3 space-y-2">
                {SAFE_FORMATS.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 font-mono text-sm text-gray-800"
                  >
                    <Check
                      className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-1"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
                Avoid
              </p>
              <ul className="mt-3 space-y-2">
                {AVOID_FORMATS.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-gray-800"
                  >
                    <X
                      className="h-3.5 w-3.5 shrink-0 text-red-600 mt-1"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube SEO and retention tips */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Tips for chapters that help retention
          </h2>

          <div className="mt-8 space-y-4">
            {RETENTION_TIPS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <p className="text-base font-semibold text-gray-900">
                  {t.name}
                </p>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  {t.body}
                </p>
              </div>
            ))}
          </div>
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
              Other YouTube publishing utilities
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Use these alongside chapters when shipping a long-form
              video.
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
            Ready to format your YouTube chapters?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Paste your timestamps and get a validated, paste-ready chapter
            block.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Format chapters
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
