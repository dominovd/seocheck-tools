import Link from "next/link";
import {
  Gauge,
  Heading,
  FileText,
  Hash,
  Bookmark,
  Wrench,
  Check,
  ArrowRight,
} from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { VideoAuditTool } from "@/components/tools/VideoAuditTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-video-audit")!;

export const metadata = buildMetadata({
  title: "YouTube Video Audit | Free SEO Checker",
  description:
    "Run a free YouTube video audit. Check any video URL for title, description, tags, hashtags, chapters, SEO score, and fix-it tools.",
  path: `tools/${tool.slug}`,
  noBrand: true,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

const HERO_SUBTITLE =
  "Paste any YouTube video URL to check its SEO score, metadata, title, description, tags, hashtags, and chapters, then see what to fix first.";

type Card = { Icon: typeof Gauge; title: string; body: string };

const WHAT_YOU_GET: Card[] = [
  {
    Icon: Gauge,
    title: "Overall video SEO score",
    body: "See whether the video package is strong, mixed, or needs work.",
  },
  {
    Icon: Heading,
    title: "Title audit",
    body: "Check whether the title is clear, specific, clickable, and not too long.",
  },
  {
    Icon: FileText,
    title: "Description audit",
    body: "Find thin descriptions, missing context, weak hooks, and missing calls to action.",
  },
  {
    Icon: Hash,
    title: "Tags and hashtags check",
    body: "See whether tags and hashtags are relevant, useful, and not overstuffed.",
  },
  {
    Icon: Bookmark,
    title: "Chapters check",
    body: "Check whether the video uses helpful timestamps when the format benefits from them.",
  },
  {
    Icon: Wrench,
    title: "Fix-it tools",
    body: "Jump to the right generator or checker for the weak field: title, description, tags, hashtags, or chapters.",
  },
];

const HOW_TO_STEPS = [
  {
    title: "Paste a YouTube video URL",
    body: "Use any public YouTube video, including regular videos, Shorts, youtu.be links, and copied mobile app links.",
  },
  {
    title: "Review the overall SEO score",
    body: "Start with the top-level score to see whether the video package is strong, mixed, or weak.",
  },
  {
    title: "Check each metadata field",
    body: "Look at the title, description, tags, hashtags, and chapters to see where the video loses points.",
  },
  {
    title: "Fix the weakest field first",
    body: "Do not rewrite everything at once. Start with the field that has the lowest score or clearest issue.",
  },
  {
    title: "Re-run the audit after edits",
    body: "After updating metadata in YouTube Studio, audit the video again to see whether the package improved.",
  },
];

type ScoredDimension = {
  dim: string;
  weight: string;
  checks: string;
  toolHref: string;
  toolLabel: string;
};

const SCORED: ScoredDimension[] = [
  {
    dim: "Title",
    weight: "30%",
    checks: "Length, clarity, specificity, click potential",
    toolHref: "/tools/youtube-title-score-checker",
    toolLabel: "Title Score Checker",
  },
  {
    dim: "Description",
    weight: "25%",
    checks: "Context, keyword use, first lines, CTA",
    toolHref: "/tools/youtube-description-generator",
    toolLabel: "Description Generator",
  },
  {
    dim: "Chapters",
    weight: "20%",
    checks: "Timestamps, structure, 0:00, usefulness",
    toolHref: "/tools/youtube-chapter-generator",
    toolLabel: "Chapter Generator",
  },
  {
    dim: "Tags",
    weight: "15%",
    checks: "Relevance, count, long-tail coverage",
    toolHref: "/tools/youtube-tag-generator",
    toolLabel: "Tag Generator",
  },
  {
    dim: "Hashtags",
    weight: "10%",
    checks: "Relevance, placement, overuse",
    toolHref: "/tools/youtube-hashtag-generator",
    toolLabel: "Hashtag Generator",
  },
];

const CHECKLIST = [
  "Does the title clearly explain the topic and value?",
  "Is the main search phrase included naturally?",
  "Is the title readable in search, browse, and suggested videos?",
  "Does the description explain the video in the first 1-2 lines?",
  "Does the description include useful context, links, and calls to action?",
  "Are tags relevant to the actual topic, people, products, or variants?",
  "Are hashtags specific instead of broad or spammy?",
  "Does a long or structured video include helpful chapters?",
  "Do the title and thumbnail work together without repeating the same words?",
  "Would the video still satisfy viewers after they click?",
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-title-score-checker",
    name: "Title Score Checker",
    body: "Check and improve the title before publishing or updating metadata.",
  },
  {
    href: "/tools/youtube-title-generator",
    name: "YouTube Title Generator",
    body: "Generate stronger title options if the audit flags the current one.",
  },
  {
    href: "/tools/youtube-description-generator",
    name: "Description Generator",
    body: "Create a clearer, more complete YouTube description.",
  },
  {
    href: "/tools/youtube-tag-generator",
    name: "Tag Generator",
    body: "Generate relevant tags from the topic or title.",
  },
  {
    href: "/tools/youtube-hashtag-generator",
    name: "Hashtag Generator",
    body: "Add focused hashtags without stuffing.",
  },
  {
    href: "/tools/youtube-thumbnail-preview",
    name: "Thumbnail Preview",
    body: "Preview how your title and thumbnail work together in YouTube layouts.",
  },
];

const FAQS = [
  {
    q: "What is a YouTube Video Audit?",
    a: "A YouTube Video Audit checks one public video and scores its upload package: title, description, tags, hashtags, and chapters. It helps you find weak metadata fields and decide what to fix first.",
  },
  {
    q: "Is this a YouTube video SEO checker?",
    a: "Yes. The tool works as a free YouTube video SEO checker. It reviews the metadata and packaging signals that help YouTube and viewers understand what the video is about.",
  },
  {
    q: "How is the overall score calculated?",
    a: "The overall score combines weighted checks for title, description, chapters, tags, and hashtags. Title and description carry the most weight because they strongly affect clicks, context, and search relevance.",
  },
  {
    q: "What does the audit actually check?",
    a: "It checks title length and clarity, description quality, tag relevance, hashtag use, and whether chapters are present and useful. It also points you to the right fix-it tool for each weak field.",
  },
  {
    q: "Does it work on private or unlisted videos?",
    a: "The audit works on public videos that can be accessed through YouTube's public data. Private videos are not available. Unlisted video support depends on whether the video data can be fetched publicly.",
  },
  {
    q: "Can I audit a competitor's video?",
    a: "Yes. You can paste any public YouTube video URL. This is useful for studying competitor metadata, title patterns, tags, and chapters.",
  },
  {
    q: "Why doesn't it score the thumbnail?",
    a: "The current audit focuses on metadata fields that can be checked consistently from video data: title, description, tags, hashtags, and chapters. Use Thumbnail Preview separately to evaluate title and thumbnail fit.",
  },
  {
    q: "Why doesn't it score views or engagement?",
    a: "Views and engagement measure performance after publishing. Video Audit focuses on the upload package you can edit directly. For channel-level growth signals, use Visibility Score or Channel Audit.",
  },
  {
    q: "Can this improve my YouTube SEO score?",
    a: "The audit can show what to improve, but it does not guarantee views. Fixing weak titles, thin descriptions, missing chapters, or poor tags can make the video easier to understand and more competitive.",
  },
  {
    q: "Does this use the YouTube Data API?",
    a: "Yes. The tool uses public YouTube video data to read available metadata and run the audit.",
  },
  {
    q: "Do you save the URLs I audit?",
    a: "The tool does not require an account. Any usage logging is limited to fair-use, abuse prevention, or aggregate product monitoring rather than building user profiles.",
  },
  {
    q: "What is the difference between Video Audit and Channel Audit?",
    a: "Video Audit checks one video in detail. Channel Audit checks recent uploads and finds recurring channel-wide issues. Use Video Audit for a specific upload and Channel Audit for patterns across the channel.",
  },
];

export default function YouTubeVideoAuditPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool} subtitleOverride={HERO_SUBTITLE}>
        <VideoAuditTool />
      </ToolLayout>

      {/* What you'll get */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              What you&apos;ll get
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Video Audit gives you one SEO score for a single video, plus a
              breakdown of the metadata fields that help YouTube and viewers
              understand the upload.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_YOU_GET.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl text-center">
            How to use the YouTube Video Audit
          </h2>

          <ol className="mt-12 space-y-6">
            {HOW_TO_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What the YouTube Video Audit checks
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Most YouTube SEO tools focus on one field at a time: generate a
            title, extract tags, or write a description. Video Audit checks
            the whole upload package in one pass, so you can see whether a
            specific video is ready for search, browse, and suggested videos.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Paste a public YouTube URL and the tool reviews the title,
            description, tags, hashtags, and chapters against practical
            YouTube SEO signals. The goal is not to guarantee views, but to
            show which parts of the video package may be limiting discovery,
            clicks, or clarity.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use it before promoting a video, after publishing a new upload,
            when refreshing old metadata, or when studying competitor videos
            in your niche.
          </p>
        </div>
      </section>

      {/* What gets scored */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              What gets scored
            </h2>
          </div>

          {/* Desktop table */}
          <div className="mt-10 hidden overflow-hidden rounded-2xl border border-gray-200 bg-white sm:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-700">
                    Dimension
                  </th>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-700">
                    Weight
                  </th>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-700">
                    What it checks
                  </th>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-700">
                    Fix-it tool
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {SCORED.map((row) => (
                  <tr key={row.dim}>
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {row.dim}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">
                      {row.weight}
                    </td>
                    <td className="px-5 py-3">{row.checks}</td>
                    <td className="px-5 py-3">
                      <Link href={row.toolHref} className="link">
                        {row.toolLabel}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-8 grid gap-3 sm:hidden">
            {SCORED.map((row) => (
              <div
                key={row.dim}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-gray-900">
                    {row.dim}
                  </p>
                  <span className="font-mono text-xs text-gray-500">
                    {row.weight}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {row.checks}
                </p>
                <Link
                  href={row.toolHref}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600"
                >
                  {row.toolLabel}
                  <ArrowRight className="h-3 w-3" strokeWidth={2.25} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video SEO checklist */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            YouTube video SEO checklist
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use this checklist before publishing or when improving an older
            video.
          </p>

          <ul className="mt-8 space-y-3 rounded-2xl border border-gray-200 bg-white p-5">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-800">
                <Check
                  className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
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
              Fix the weak parts of your video
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Start with the audit, then use the right tool for the field that
              needs work.
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
                  Open tool
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
            Ready to audit a YouTube video?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Paste a public YouTube URL and get a free video SEO audit in
            seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Audit this video
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
