import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { TagGeneratorTool } from "@/components/tools/TagGeneratorTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-tag-generator")!;

const PAGE_TITLE = "Free YouTube Tag Generator";
const META_DESCRIPTION =
  "Free AI YouTube tag generator. Enter your video topic to get relevant broad, long-tail, and spelling-variant tags trimmed for YouTube's 500-character limit.";
const OG_DESCRIPTION =
  "Generate a clean YouTube tag list for any video topic, with relevant broad, specific, and long-tail tags ready for YouTube Studio.";

const base = buildMetadata({
  title: "Free YouTube Tag Generator | AI Video Tags",
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
  "Enter your video topic and generate a focused YouTube tag list with broad terms, specific phrases, long-tail variants, and common spelling variations, trimmed to fit YouTube's 500-character tag limit.";

const ABOVE_FOLD_BULLETS = [
  "Broad, specific, long-tail, and spelling-variant tags in one mix.",
  "Trimmed for YouTube's 500-character hidden tag field.",
  "Copy-paste straight into YouTube Studio as a comma-separated list.",
];

const TAG_MIX = [
  "broad topic tags",
  "specific keyword phrases",
  "long-tail search variants",
  "tool, product, or brand terms when relevant",
  "common spelling variations",
  "alternate ways viewers describe the same topic",
];

const TAG_USES = [
  "what the video is about",
  "who the video is for",
  "the exact tool, product, game, person, or concept shown",
  "common alternate names",
  "abbreviations and acronyms",
  "misspellings people actually use",
  "long-tail variations of the main topic",
];

const TAGS_HELP = [
  "misspellings",
  "ambiguous topics",
  "acronyms",
  "alternate wording",
  "product names",
  "early topic clarification",
  "search edge cases where wording matters",
];

const INPUT_TIPS = [
  "the main topic",
  "the viewer type",
  "the skill level",
  "the product, tool, or platform",
  "the video format",
  "the outcome or problem solved",
];

const WORKFLOW_STEPS = [
  "Generate tags from your video topic.",
  "Remove anything that does not accurately describe the video.",
  "Put the strongest primary topic tags first.",
  "Add 1 or 2 real spelling variants if they matter.",
  "Use Tag Extractor on a few competitor videos to find missing terms.",
  "Paste the final comma-separated list into YouTube Studio.",
];

const COMBINED_WORKFLOW = [
  "Generate a clean first tag list from your topic.",
  "Extract tags from 3 to 5 similar competitor videos.",
  "Keep only the extracted terms that truly fit your video.",
  "Remove duplicates and weak generic tags.",
  "Stay under YouTube's 500-character limit.",
];

const ORDER_PRIORITIES = [
  "exact primary topic",
  "close keyword variants",
  "specific tool, product, or person terms",
  "long-tail phrases",
  "spelling variants and edge cases",
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-tag-extractor",
    name: "Tag Extractor",
    body: "Inspect hidden tags from competitor videos.",
  },
  {
    href: "/tools/youtube-keyword-tool",
    name: "Keyword Tool",
    body: "Find YouTube search phrases around the topic.",
  },
  {
    href: "/tools/youtube-hashtag-generator",
    name: "Hashtag Generator",
    body: "Create visible hashtags for the description.",
  },
  {
    href: "/tools/youtube-title-generator",
    name: "Title Generator",
    body: "Create title options for the same topic.",
  },
  {
    href: "/tools/youtube-description-generator",
    name: "Description Generator",
    body: "Write the full YouTube description.",
  },
  {
    href: "/guides/youtube-tags-best-practices-2026",
    name: "YouTube Tags Best Practices guide",
    body: "Read the field-tested rules for using tags in 2026.",
  },
];

const FAQS = [
  {
    q: "Is this YouTube Tag Generator free?",
    a: "Yes. The tool is free to use with a daily fair-use limit. There is no signup, paid account, or browser extension required.",
  },
  {
    q: "How many YouTube tags should I use?",
    a: "Use as many accurate tags as you need while staying under YouTube's 500-character limit. A focused set of relevant tags is better than a long list of weak or unrelated terms.",
  },
  {
    q: "Do YouTube tags still help with SEO?",
    a: "Tags have a limited role in YouTube SEO. They can help with misspellings, ambiguous topics, acronyms, and alternate wording, but they are much less important than the title, thumbnail, description, and viewer engagement signals.",
  },
  {
    q: "Should I use all generated tags?",
    a: "Only use tags that accurately describe your video. If a generated tag feels too broad, misleading, or unrelated, remove it before publishing.",
  },
  {
    q: "Does tag order matter on YouTube?",
    a: "It is safest to place your most important tags first. Start with the exact topic and close variants, then add specific and long-tail phrases.",
  },
  {
    q: "What is the 500-character tag limit?",
    a: "YouTube's tag field supports up to 500 characters total. That includes all tags and separators. The generator should keep the list compact so it is easier to paste into YouTube Studio.",
  },
  {
    q: "Can this generate tags for YouTube Shorts?",
    a: "Yes. Enter the Shorts topic the same way you would describe a regular video. Keep in mind that Shorts discovery relies heavily on viewer behavior, captions, audio, and topic relevance, so tags are only a supporting signal.",
  },
  {
    q: "Should I copy competitor tags?",
    a: "No. Use competitor tags as research, not as a list to copy blindly. Copy only terms that accurately match your own video, and combine them with tags generated from your actual topic.",
  },
  {
    q: "What is the difference between tags and hashtags?",
    a: "Tags are hidden metadata entered in YouTube Studio. Hashtags are visible clickable terms in the description or title. Use Tag Generator for hidden tags and Hashtag Generator for visible hashtags.",
  },
  {
    q: "Can tags make my video go viral?",
    a: "No. Tags alone will not make a video go viral. They help clarify the topic, but clicks, retention, satisfaction, topic demand, and packaging matter much more.",
  },
];

export default function YouTubeTagGeneratorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <TagGeneratorTool />
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

      {/* Generate YouTube tags that match the actual video */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Generate YouTube tags that match the actual video
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            YouTube tags work best when they describe the video clearly.
            They are not a place to stuff every trending keyword you can
            find.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            This YouTube Tag Generator takes your video topic and creates
            a focused tag list with a practical mix of:
          </p>

          <ul className="mt-6 space-y-2">
            {TAG_MIX.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm text-gray-700 leading-relaxed"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            The result is built for the hidden tag field inside YouTube
            Studio and trimmed for YouTube&apos;s 500-character limit.
          </p>
        </div>
      </section>

      {/* What makes a good YouTube tag list? */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What makes a good YouTube tag list?
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            A good tag list supports the rest of your metadata. It should
            match the title, description, spoken topic, and viewer intent.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use tags to clarify:
          </p>

          <ul className="mt-6 space-y-3">
            {TAG_USES.map((u) => (
              <li
                key={u}
                className="flex gap-3 rounded-lg bg-gray-50/60 p-4 text-sm text-gray-700 leading-relaxed ring-1 ring-gray-100"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>{u}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Avoid tags that describe a different video. Unrelated
            celebrity names, trend tags, &quot;viral&quot;,
            &quot;funny&quot;, or broad spam terms do not make the video
            more relevant. They make the metadata less trustworthy.
          </p>
        </div>
      </section>

      {/* Do YouTube tags still matter? */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Do YouTube tags still matter?
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Tags are a supporting signal, not the main ranking factor.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Modern YouTube discovery depends much more on the title,
            thumbnail, topic fit, viewer behavior, retention,
            satisfaction, and traffic source. Tags will not save a weak
            video or make an unrelated topic rank.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            But tags can still help with:
          </p>

          <ul className="mt-6 space-y-2">
            {TAGS_HELP.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm text-gray-700 leading-relaxed"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-base text-gray-700 leading-relaxed">
            That is why the goal is not &quot;as many tags as
            possible&quot;. The goal is a clean, accurate set of tags
            that reinforces what the video is already about.
          </p>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            For the full field-tested ruleset, read the{" "}
            <Link
              href="/guides/youtube-tags-best-practices-2026"
              className="text-brand-700 hover:underline"
            >
              YouTube Tags Best Practices guide
            </Link>
            .
          </p>
        </div>
      </section>

      {/* How to get better tags from the generator */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How to get better tags from the generator
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
                Weak input
              </p>
              <p className="mt-3 font-mono text-sm text-gray-800">
                fitness
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Better input
              </p>
              <p className="mt-3 font-mono text-sm leading-relaxed text-gray-800">
                20-minute no-equipment home workout for beginners trying
                to lose weight
              </p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
                Weak input
              </p>
              <p className="mt-3 font-mono text-sm text-gray-800">
                camera review
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Better input
              </p>
              <p className="mt-3 font-mono text-sm leading-relaxed text-gray-800">
                Sony ZV-E10 II review for beginner YouTubers choosing
                their first camera
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
            The more specific the input, the less generic the tags.
          </p>
        </div>
      </section>

      {/* Recommended workflow */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Recommended workflow
          </h2>

          <ol className="mt-8 space-y-4">
            {WORKFLOW_STEPS.map((step, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {i === 4 ? (
                    <>
                      Use{" "}
                      <Link
                        href="/tools/youtube-tag-extractor"
                        className="font-medium text-brand-700 hover:underline"
                      >
                        Tag Extractor
                      </Link>{" "}
                      on a few competitor videos to find missing terms.
                    </>
                  ) : (
                    step
                  )}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Tags should be the final support layer after the title,
            thumbnail, and description are clear.
          </p>
        </div>
      </section>

      {/* Tag Generator vs Tag Extractor */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Tag Generator vs Tag Extractor
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                TAG GENERATOR
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                Build your own tag list from a topic
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                Use Tag Generator when you are building tags for your own
                video from a topic.
              </p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-700">
                TAG EXTRACTOR
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                Inspect tags on an existing video
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                Use{" "}
                <Link
                  href="/tools/youtube-tag-extractor"
                  className="font-medium text-violet-700 hover:underline"
                >
                  Tag Extractor
                </Link>{" "}
                when you want to inspect the hidden tags on an existing
                YouTube video, usually for competitor research.
              </p>
            </div>
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            The strongest workflow is both:
          </p>

          <ol className="mt-6 space-y-4">
            {COMBINED_WORKFLOW.map((step, i) => (
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

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            This gives you coverage without copying another creator&apos;s
            metadata blindly.
          </p>
        </div>
      </section>

      {/* YouTube tag limit and order */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            YouTube tag limit and order
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            YouTube allows up to 500 characters in the tag field,
            including separators. That limit fills faster than most
            creators expect.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Put your most important tags early:
          </p>

          <ol className="mt-6 space-y-3">
            {ORDER_PRIORITIES.map((p, i) => (
              <li
                key={p}
                className="flex gap-3 rounded-lg bg-white p-4 text-sm text-gray-700 leading-relaxed ring-1 ring-gray-200"
              >
                <span className="font-semibold text-brand-700">
                  {i + 1}.
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Do not waste the first tags on your channel name, generic
            words, or unrelated trends. The first few tags should confirm
            the core topic.
          </p>
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
              Complete the tag workflow
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Generate a first tag list, compare competitor tags, then
              finish the rest of your video metadata.
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
            Ready to generate your YouTube tags?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Enter your video topic and get a focused tag list ready for
            YouTube Studio.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Generate tags
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
