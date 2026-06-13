import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { DescriptionGeneratorTool } from "@/components/tools/DescriptionGeneratorTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-description-generator")!;

const PAGE_TITLE = "Free YouTube Description Generator";
const META_DESCRIPTION =
  "Free AI YouTube description generator. Create publish-ready descriptions with a strong intro, natural keywords, CTA, links, chapters placeholder, and hashtags.";
const OG_DESCRIPTION =
  "Generate a complete YouTube description from your video brief, including intro, summary, CTA, chapters placeholder, links section, and hashtags.";

const base = buildMetadata({
  title: "Free YouTube Description Generator | AI SEO Copy",
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
  "Turn your video brief into a publish-ready YouTube description with a strong first line, natural SEO keywords, summary, call to action, links section, chapter placeholder, and hashtags.";

const ABOVE_FOLD_BULLETS = [
  "Publish-ready structure: intro, summary, CTA, links, chapters, hashtags.",
  "Strong viewer promise in the first 120 characters.",
  "Built to paste straight into YouTube Studio after editing.",
];

const INCLUDED_PARTS = [
  "opening hook for the first visible lines",
  "natural keyword-rich summary",
  "short body paragraphs describing the video",
  "chapter placeholder for timestamps",
  "call to action",
  "links or resources section",
  "optional channel mention",
  "relevant hashtags",
];

const OPENING_QUESTIONS = [
  "What is this video about?",
  "Who is it for?",
  "What will the viewer learn, see, or solve?",
];

const SEO_SIGNALS = [
  "topic coverage",
  "related keywords",
  "tools, products, or names mentioned",
  "links and resources",
  "chapters and structure",
  "hashtags",
  "disclosure and credibility signals",
];

const INPUT_TIPS = [
  "the main topic",
  "the viewer skill level",
  "key sections",
  "tools, products, or people mentioned",
  "the outcome",
  "the style of video",
  "any required disclosure or CTA",
];

const PUBLISH_STEPS: { step: string; tool?: { name: string; href: string } }[] = [
  {
    step: "Finalize the video title and thumbnail.",
    tool: { name: "Title Score Checker", href: "/tools/youtube-title-score-checker" },
  },
  {
    step: "Write a short brief of what the final video actually contains.",
  },
  {
    step: "Generate the description.",
  },
  {
    step: "Replace chapter placeholders with real timestamps.",
    tool: { name: "Chapter Generator", href: "/tools/youtube-chapter-generator" },
  },
  {
    step: "Add your links, affiliate disclosures, sponsor notes, or downloads.",
  },
  {
    step: "Review the first 120 characters.",
  },
  {
    step: "Paste into YouTube Studio.",
  },
  {
    step: "Run a final metadata check after publishing.",
    tool: { name: "Video Audit", href: "/tools/youtube-video-audit" },
  },
];

const DUO_STEPS = [
  "Generate the description.",
  "Generate or clean up the chapters.",
  "Paste the chapter block into the description.",
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-chapter-generator",
    name: "Chapter Generator",
    body: "Format timestamp chapters for the description.",
  },
  {
    href: "/tools/youtube-hashtag-generator",
    name: "Hashtag Generator",
    body: "Choose visible hashtags for the end of the description.",
  },
  {
    href: "/tools/youtube-tag-generator",
    name: "Tag Generator",
    body: "Create hidden metadata tags for YouTube Studio.",
  },
  {
    href: "/tools/youtube-title-score-checker",
    name: "Title Score Checker",
    body: "Check the title before publishing.",
  },
  {
    href: "/tools/youtube-thumbnail-preview",
    name: "Thumbnail Preview",
    body: "Test the title and thumbnail together.",
  },
  {
    href: "/tools/youtube-video-audit",
    name: "Video Audit",
    body: "Check the published video metadata.",
  },
];

const FAQS = [
  {
    q: "Is this YouTube Description Generator free?",
    a: "Yes. The tool is free to use with a daily fair-use limit. There is no signup or paid account required.",
  },
  {
    q: "How long should a YouTube description be?",
    a: "Many strong descriptions are between 800 and 2,500 characters, but length is less important than usefulness. Write enough to summarize the video, add context, include links, and support the title naturally.",
  },
  {
    q: "Does the YouTube description affect SEO?",
    a: "Yes, as a support signal. The description helps YouTube understand the topic and gives viewers extra context, but it works alongside the title, thumbnail, retention, viewer satisfaction, and traffic source.",
  },
  {
    q: "What should I put in a YouTube description?",
    a: "Include a strong opening, a short summary, important keywords used naturally, chapters if relevant, links or resources, credits, disclosures, a call to action, and a few relevant hashtags.",
  },
  {
    q: "Where should hashtags go in the description?",
    a: "Most creators place hashtags at the end of the description. YouTube may display up to 3 hashtags above the title, so choose the first 3 carefully.",
  },
  {
    q: "Can this generate descriptions for YouTube Shorts?",
    a: "Yes. Use a shorter brief and mention that the video is a Short. Shorts descriptions are often shorter, but they can still include a clear topic line, CTA, and hashtags.",
  },
  {
    q: "Should I include affiliate links or sponsor disclosures?",
    a: "Yes, if they apply. Keep disclosures clear and easy to find. For sponsored or affiliate-heavy videos, do not bury the disclosure where viewers are unlikely to see it.",
  },
  {
    q: "Should I write the description before or after filming?",
    a: "Write the final description after filming or editing. A description is strongest when it reflects what is actually in the final video.",
  },
  {
    q: "Is AI-generated description text safe to use?",
    a: "Yes, as long as you review it and make sure it accurately describes the video. Remove anything exaggerated, false, or not actually covered in the upload.",
  },
  {
    q: "What should I do after generating the description?",
    a: "Replace placeholders, add real links and chapters, check the first lines, then paste it into YouTube Studio. After publishing, use Video Audit to check whether the full metadata package is complete.",
  },
];

export default function YouTubeDescriptionGeneratorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <DescriptionGeneratorTool />
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
            Free: 15 generations per IP per day. No signup required.
          </p>
        </div>
      </section>

      {/* Generate a YouTube description that is ready to publish */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Generate a YouTube description that is ready to publish
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            A good YouTube description is not filler under the video. It
            helps viewers understand what they will get, gives YouTube
            more context about the topic, and creates a clean place for
            chapters, links, credits, disclosures, and hashtags.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The YouTube Description Generator turns a short video brief
            into a structured description you can paste into YouTube
            Studio. It writes the opening lines, summarizes the video
            naturally, leaves room for chapters, adds a call to action,
            and includes a clean hashtag line.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use it after the video is mostly finished, when you know what
            is actually in the upload.
          </p>
        </div>
      </section>

      {/* What the generated description includes */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What the generated description includes
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The output is built around the parts most creators need at
            publish time:
          </p>

          <ul className="mt-8 space-y-3">
            {INCLUDED_PARTS.map((p) => (
              <li
                key={p}
                className="flex gap-3 rounded-lg bg-gray-50/60 p-4 text-sm text-gray-700 leading-relaxed ring-1 ring-gray-100"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            The goal is a useful description, not a block of SEO stuffing.
          </p>
        </div>
      </section>

      {/* Why the first lines matter */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Why the first lines matter
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The first part of a YouTube description can appear in search,
            previews, and the collapsed &quot;more&quot; area. That means
            the opening should work like a compact subtitle for the video.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            A strong opening should answer:
          </p>

          <ol className="mt-6 space-y-3">
            {OPENING_QUESTIONS.map((q, i) => (
              <li
                key={q}
                className="flex gap-3 rounded-lg bg-white p-4 text-sm text-gray-700 leading-relaxed ring-1 ring-gray-200"
              >
                <span className="font-semibold text-brand-700">
                  {i + 1}.
                </span>
                <span>{q}</span>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Do not start with &quot;Subscribe to my channel&quot; or a
            long affiliate disclaimer unless the video legally requires
            disclosure near the top. Put the viewer promise first.
          </p>
        </div>
      </section>

      {/* Does the YouTube description help SEO? */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Does the YouTube description help SEO?
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Yes, but it is a support signal.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The title and thumbnail shape the first click. Watch behavior,
            retention, satisfaction, and audience fit do the heavier
            ranking work. The description helps by giving YouTube and
            viewers additional context:
          </p>

          <ul className="mt-6 space-y-2">
            {SEO_SIGNALS.map((s) => (
              <li
                key={s}
                className="flex gap-3 text-sm text-gray-700 leading-relaxed"
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
            Descriptions should read naturally. Repeating the same keyword
            ten times is not useful. A clear description with specific
            terms is better than a keyword-stuffed one.
          </p>
        </div>
      </section>

      {/* How to get better descriptions from the generator */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How to get better descriptions from the generator
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
                Weak input
              </p>
              <p className="mt-3 font-mono text-sm text-gray-800">
                video about home server
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Better input
              </p>
              <p className="mt-3 font-mono text-sm leading-relaxed text-gray-800">
                A beginner tutorial on setting up a Proxmox home server on
                a $200 mini PC, installing Jellyfin, Immich, Vaultwarden,
                and Home Assistant, aimed at people who know Docker but
                have never used Proxmox.
              </p>
            </div>
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Add:
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {INPUT_TIPS.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <Check
                  className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-base text-gray-700 leading-relaxed">
            Specific briefs create descriptions that sound like the actual
            video instead of generic channel copy.
          </p>
        </div>
      </section>

      {/* Recommended publish workflow */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Recommended publish workflow
          </h2>

          <ol className="mt-8 space-y-4">
            {PUBLISH_STEPS.map(({ step, tool: t }, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {step}
                  {t && (
                    <>
                      {" "}
                      Use the{" "}
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

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            For videos longer than a few minutes, use chapters. For
            tutorials, reviews, and long explainers, chapters make the
            video easier to scan and can help viewers jump to the section
            they need.
          </p>
        </div>
      </section>

      {/* Description Generator vs Chapter Generator */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Description Generator vs Chapter Generator
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                DESCRIPTION GENERATOR
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                Writes the full description structure
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                The Description Generator writes the full description
                structure with intro, summary, CTA, links, chapter
                placeholder, and hashtags.
              </p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-700">
                CHAPTER GENERATOR
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                Formats and validates timestamp blocks
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                The{" "}
                <Link
                  href="/tools/youtube-chapter-generator"
                  className="font-medium text-violet-700 hover:underline"
                >
                  Chapter Generator
                </Link>{" "}
                formats timestamp blocks and checks whether they follow
                YouTube&apos;s chapter rules.
              </p>
            </div>
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Use both when the video has multiple sections:
          </p>

          <ol className="mt-6 space-y-4">
            {DUO_STEPS.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
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
              Finish the upload metadata
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Descriptions work best when the title, tags, hashtags, and
              chapters are clean too.
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
            Ready to generate your description?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Drop in your video brief and get a publish-ready description
            in seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Generate description
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
