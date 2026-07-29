import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { TagExtractorTool } from "@/components/tools/TagExtractorTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-tag-extractor")!;

const PAGE_TITLE = "Free YouTube Tag Extractor";
const META_DESCRIPTION =
  "Free YouTube tag extractor. Paste any video URL to see hidden YouTube tags, check competitor metadata, and copy tags for SEO research. No signup.";
const OG_DESCRIPTION =
  "Reveal the hidden tags behind any public YouTube video and use competitor metadata to improve your own tag strategy.";

const base = buildMetadata({
  title: "Free YouTube Tag Extractor | Check Video Tags",
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
  "Paste any YouTube video URL to reveal the hidden tags behind it. Use competitor tags to understand the topic map, spot missing keyword angles, and build a cleaner tag list for your next upload.";

const ABOVE_FOLD_BULLETS = [
  "See tags YouTube hides from the public watch page.",
  "Compare how 3-5 competing videos label the same topic.",
  "Turn extracted tags into a cleaner list for your next upload.",
];

const WHAT_IT_HELPS = [
  "Which tags did a competing video use for this topic?",
  "Are creators using broad tags, long-tail tags, or branded tags?",
  "What alternate spellings or related phrases are being added?",
  "Are top videos in the niche using similar tag clusters?",
  "Is the tag list focused, or is it stuffed with unrelated keywords?",
  "Which tags are worth using as inspiration for my own metadata?",
];

const HOW_TO_USE_STEPS = [
  "Extract the tags.",
  "Separate primary topic tags from broad category tags.",
  "Look for repeated phrases across multiple videos.",
  "Note spelling variants, abbreviations, product names, and audience language.",
  "Remove anything unrelated to your own video.",
  "Use the strongest remaining tags as inputs for your title, description, and tag list.",
];

const COPY_SIGNALS = [
  "Exact topic names.",
  "Product names or tool names shown in the video.",
  "Common abbreviations.",
  "Alternate spellings.",
  "Long-tail phrases that describe the specific problem.",
  "Category terms that match the video closely.",
];

const IGNORE_SIGNALS = [
  "A competitor's channel name.",
  "Celebrity or brand names that are not actually in your video.",
  "Unrelated trending topics.",
  'Huge generic tags like "viral" or "funny" when they do not describe the content.',
  "Repeated keyword variations that add no meaning.",
];

const TAGS_STILL_HELP = [
  "Clarifying ambiguous words, names, acronyms, and topics.",
  "Capturing common misspellings.",
  "Supporting the main topic during early indexing.",
  "Helping YouTube understand alternate wording around the same subject.",
  "Keeping your metadata consistent with your title and description.",
];

const HOW_IT_WORKS_STEPS = [
  "You paste a YouTube video URL.",
  "The tool identifies the video ID.",
  "It fetches the public video metadata.",
  "It extracts the available tag or keyword data.",
  "The tags are shown as individual chips and as a comma-separated list for easy copying.",
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-tag-generator",
    name: "Tag Generator",
    body: "Create a clean tag list from the topic.",
  },
  {
    href: "/tools/youtube-keyword-tool",
    name: "Keyword Tool",
    body: "Find YouTube search phrases around the same idea.",
  },
  {
    href: "/tools/youtube-video-audit",
    name: "Video Audit",
    body: "Check whether your title, description, hashtags, and tags work together.",
  },
  {
    href: "/tools/youtube-title-score-checker",
    name: "Title Analyzer",
    body: "Test the title before publishing.",
  },
  {
    href: "/tools/youtube-competitor-analyzer",
    name: "Competitor Channel Analyzer",
    body: "Study the broader channel, not just one video's tags.",
  },
  {
    href: "/guides/youtube-tags-best-practices-2026",
    name: "YouTube Tags Best Practices guide",
    body: "Read the field-tested rules for using tags in 2026.",
  },
];

const FAQS = [
  {
    q: "Is this YouTube Tag Extractor free?",
    a: "Yes. The YouTube Tag Extractor is free to use. There is no signup, no paid account, and no browser extension required.",
  },
  {
    q: "How do I see tags on a YouTube video?",
    a: "Paste the video URL into the extractor. The tool checks the public video metadata and shows any tags that are available. You can use regular YouTube URLs, shortened youtu.be links, and Shorts URLs.",
  },
  {
    q: "Can I extract tags from YouTube Shorts?",
    a: "Yes. Shorts URLs work the same way. Some Shorts may have fewer tags than long-form videos because many creators rely more on topic, audio, captions, and viewer behavior for Shorts discovery.",
  },
  {
    q: "Do YouTube tags still help with SEO?",
    a: "Tags have a limited role in YouTube SEO. They are useful for clarifying the topic, alternate spellings, acronyms, and misspellings, but they are much less important than the title, thumbnail, description, and viewer engagement signals.",
  },
  {
    q: "Should I copy competitor tags exactly?",
    a: "No. Use competitor tags as research, not as a list to paste blindly. Keep only tags that accurately describe your own video. Copying unrelated tags can look like keyword stuffing or misleading metadata.",
  },
  {
    q: "Why does a video show no tags?",
    a: 'The uploader may not have added tags, YouTube may not expose the metadata for that video, the video may be region-limited, or the page may return limited data. A "no tags" result does not always mean the tool failed.',
  },
  {
    q: "What is the YouTube tag character limit?",
    a: "YouTube allows up to 500 characters total in the tag field, including commas and spaces. Most videos do better with a focused set of accurate tags than with a stuffed list of weak variations.",
  },
  {
    q: "What is the difference between Tag Extractor and Tag Generator?",
    a: "Tag Extractor pulls tags from an existing YouTube video. Tag Generator creates new tag ideas from your topic. Use Extractor for competitor research, then use Generator to build a cleaner list for your own upload.",
  },
  {
    q: "Do you store the videos I check?",
    a: "Results may be cached temporarily by video ID to keep the tool fast and reduce repeated requests. Searches are not used to build user profiles.",
  },
  {
    q: "Is extracting YouTube tags allowed?",
    a: "The tool reads public metadata from public videos. Use the results responsibly: study how creators describe their videos, but do not add unrelated or misleading tags to your own uploads.",
  },
];

export default function YouTubeTagExtractorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <TagExtractorTool />
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
            Free, no signup. Cached results refresh after 6 hours.
          </p>
        </div>
      </section>

      {/* About — See the tags YouTube does not show in the interface */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            See the tags YouTube does not show in the interface
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            YouTube tags are no longer visible on the public video page,
            which makes competitor research harder than it used to be. But
            tags can still appear in a video&apos;s public metadata, and
            they still reveal how the uploader tried to describe the topic
            to YouTube.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The YouTube Tag Extractor reads that metadata and gives you
            the tag list in a clean, copy-friendly view. Use it to
            inspect a competitor&apos;s video, compare tag choices across
            several videos, or check whether your own upload uses the
            right mix of primary terms, alternate wording, and common
            misspellings.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Tags are not the main ranking lever in modern YouTube SEO.
            Titles, thumbnails, viewer behavior, descriptions, and
            retention matter more. But tags are still useful for
            disambiguation, spelling variants, and early topic signals,
            especially when the video topic can mean more than one thing.
          </p>
        </div>
      </section>

      {/* What this tool helps you find */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What this tool helps you find
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The tool is useful when you want to answer questions like:
          </p>

          <ul className="mt-8 space-y-3">
            {WHAT_IT_HELPS.map((q) => (
              <li
                key={q}
                className="flex gap-3 rounded-lg bg-gray-50/60 p-4 text-sm text-gray-700 leading-relaxed ring-1 ring-gray-100"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>{q}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            The result is not a list you should blindly copy. It is a
            research layer. Good tag strategy means understanding the
            vocabulary of the topic, then choosing the tags that
            accurately match your own video.
          </p>
        </div>
      </section>

      {/* How to use extracted tags */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How to use extracted tags
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Start with 3 to 5 videos that are genuinely close to your
            upload. The closer the topic match, the more useful the tag
            data becomes.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            For each video:
          </p>

          <ol className="mt-8 space-y-4">
            {HOW_TO_USE_STEPS.map((step, i) => (
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

          <p className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-sm text-gray-800 leading-relaxed">
            The best tags are not always the highest-volume keywords.
            They are the terms that accurately describe what the viewer
            will get from the video.
          </p>
        </div>
      </section>

      {/* What to copy, what to ignore */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What to copy, what to ignore
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Copy the idea behind a tag, not the full competitor tag list.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Good signals
              </p>
              <ul className="mt-3 space-y-2">
                {COPY_SIGNALS.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm text-gray-800"
                  >
                    <Check
                      className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-1"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
                Weak signals
              </p>
              <ul className="mt-3 space-y-2">
                {IGNORE_SIGNALS.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm text-gray-800"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500"
                      aria-hidden="true"
                    />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-700 leading-relaxed">
            Misleading tags can hurt trust and may violate YouTube&apos;s
            metadata policies. Use extracted tags to understand the
            niche, not to impersonate another video.
          </p>
        </div>
      </section>

      {/* Do YouTube tags still matter in 2026? */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Do YouTube tags still matter in 2026?
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Tags matter less than they did years ago, but they are not
            useless.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            YouTube has said tags play a limited role compared with
            stronger signals like title, description, thumbnail, watch
            behavior, and viewer satisfaction. That means tags will not
            rescue a weak video. They will not make an unrelated video
            rank. And stuffing hundreds of keyword variants into the tag
            field is not a growth strategy.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Where tags still help:
          </p>

          <ul className="mt-6 space-y-2">
            {TAGS_STILL_HELP.map((item) => (
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
            Think of tags as supporting metadata. They should confirm the
            topic, not carry the whole SEO strategy.
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

      {/* How the extractor works */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How the extractor works
          </h2>

          <ol className="mt-8 space-y-4">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
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

          <p className="mt-6 text-sm text-gray-600 leading-relaxed">
            Some videos may return no tags. That usually means the
            uploader did not add tags, the metadata is not exposed for
            that video, the video is unavailable in the current region,
            or YouTube returned limited metadata.
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
              Turn extracted tags into better metadata
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              After you inspect competitor tags, use these tools to build
              a focused tag list, validate keywords, and check the rest
              of your video SEO.
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
            Ready to check a YouTube video&apos;s tags?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Paste a video URL and get the hidden tag list in seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Extract tags
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
