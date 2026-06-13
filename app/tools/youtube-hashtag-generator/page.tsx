import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { HashtagGeneratorTool } from "@/components/tools/HashtagGeneratorTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-hashtag-generator")!;

const PAGE_TITLE = "Free YouTube Hashtag Generator";
const META_DESCRIPTION =
  "Free AI YouTube hashtag generator. Enter a video topic to get relevant hashtags for videos and Shorts, with top 3 picks for YouTube's visible hashtag display.";
const OG_DESCRIPTION =
  "Generate relevant YouTube hashtags for videos and Shorts, then choose the best 3 visible hashtags for your title or description.";

const base = buildMetadata({
  title: "Free YouTube Hashtag Generator | Shorts + Videos",
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
  "Enter your video topic and get relevant YouTube hashtags for videos and Shorts. Pick the best 3 visible hashtags for your description, plus extra niche options if you want broader coverage.";

const ABOVE_FOLD_BULLETS = [
  "Visible, clickable hashtags for the title or description.",
  "Top 3 picked for the slot YouTube displays above the title.",
  "Shorts-friendly mix when the topic is short-form.",
];

const TOP3_ROLES = [
  "the main topic",
  "the niche or format",
  "the audience, product, or specific angle",
];

const HASHTAG_DIFF = [
  {
    label: "HASHTAGS",
    name: "Hashtags",
    accent: "brand",
    rows: [
      "visible to viewers",
      "clickable",
      "placed in the title or description",
      "can appear above the title",
      "help with hashtag-page discovery",
    ],
  },
  {
    label: "TAGS",
    name: "Tags",
    accent: "violet",
    rows: [
      "hidden in YouTube Studio",
      "not visible on the public page",
      "used as supporting metadata",
      "useful for misspellings and topic clarification",
      "limited by the 500-character tag field",
    ],
  },
];

const DIFF_CLASSES: Record<string, { ring: string; bg: string; label: string; dot: string }> = {
  brand: {
    ring: "border-brand-100",
    bg: "bg-brand-50/30",
    label: "text-brand-700",
    dot: "bg-brand-500",
  },
  violet: {
    ring: "border-violet-100",
    bg: "bg-violet-50/30",
    label: "text-violet-700",
    dot: "bg-violet-500",
  },
};

const HASHTAG_MIX = [
  "1 broad category hashtag",
  "1 niche-specific hashtag",
  "1 exact topic or format hashtag",
  "optional product, tool, or person hashtag",
  "optional Shorts hashtag when the video is a Short",
];

const SHORTS_PATTERNS = [
  {
    label: "REQUIRED FOR SHORTS",
    body: "#Shorts when the upload is a Short.",
  },
  {
    label: "TOPIC",
    body: "#FitnessTips, #BookTok, #AItools",
  },
  {
    label: "FORMAT",
    body: "#QuickTips, #Tutorial, #BeforeAfter",
  },
  {
    label: "NICHE",
    body: "#HomeWorkout, #BudgetCooking, #TravelHacks",
  },
];

const HOW_TO_STEPS = [
  "Enter your video or Shorts topic.",
  "Generate hashtag options.",
  "Choose the top 3 that best describe the video.",
  "Put them at the end of the description or in the title if the style fits.",
  "Keep the total under 15 hashtags.",
  "Remove anything unrelated, misleading, or too generic.",
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-tag-generator",
    name: "Tag Generator",
    body: "Create hidden metadata tags for YouTube Studio.",
  },
  {
    href: "/tools/youtube-description-generator",
    name: "Description Generator",
    body: "Write a description with a clean hashtag line.",
  },
  {
    href: "/tools/youtube-title-generator",
    name: "Title Generator",
    body: "Create title options before adding visible hashtags.",
  },
  {
    href: "/tools/youtube-keyword-tool",
    name: "Keyword Tool",
    body: "Find search phrases around the topic.",
  },
  {
    href: "/tools/youtube-video-audit",
    name: "Video Audit",
    body: "Check whether a published video's metadata is complete.",
  },
  {
    href: "/guides/youtube-tags-best-practices-2026",
    name: "YouTube Tags Best Practices guide",
    body: "Read the field-tested rules for tags and hashtags in 2026.",
  },
];

const FAQS = [
  {
    q: "Is this YouTube Hashtag Generator free?",
    a: "Yes. The tool is free to use with a daily fair-use limit. There is no signup or paid account required.",
  },
  {
    q: "Do YouTube hashtags help with views?",
    a: "Hashtags can help with topic clarity and discovery through hashtag pages, but they do not guarantee views. Click-through rate, retention, topic demand, title, thumbnail, and viewer satisfaction matter much more.",
  },
  {
    q: "Where should I put YouTube hashtags?",
    a: "Most creators put hashtags at the end of the description. You can also place them in the title, but that can make the title look cluttered. YouTube may display up to 3 hashtags above the video title.",
  },
  {
    q: "How many hashtags should I use on YouTube?",
    a: "Use 3 to 5 strong hashtags for most videos. YouTube allows up to 15, but if you go beyond 15, YouTube may ignore all hashtags on the video.",
  },
  {
    q: "Why do only 3 hashtags show above the title?",
    a: "YouTube limits the visible hashtag display above the title. Extra hashtags can still exist in the description, but the first 3 are the most visible and should be chosen carefully.",
  },
  {
    q: "Should I use #shorts?",
    a: "Use #shorts when the video is actually a YouTube Short. Do not add it to regular long-form videos just to chase Shorts traffic.",
  },
  {
    q: "What is the difference between YouTube tags and hashtags?",
    a: "Tags are hidden metadata entered in YouTube Studio. Hashtags are visible clickable labels placed in the title or description. Use tags for metadata support and hashtags for visible topic labels.",
  },
  {
    q: "Can I use trending hashtags from other niches?",
    a: "No. Use only hashtags that accurately describe the video. Misleading hashtags can hurt trust and may trigger YouTube's misleading-metadata enforcement.",
  },
  {
    q: "Should hashtags be broad or specific?",
    a: "Use a mix. One broad hashtag can help categorize the video, but specific niche hashtags are usually more useful for relevance. The top 3 should make the topic clear at a glance.",
  },
  {
    q: "Can I use this for YouTube Shorts?",
    a: "Yes. Enter the Shorts topic and include that it is a Short if relevant. The tool can generate Shorts-friendly hashtags alongside normal topic hashtags.",
  },
];

export default function YouTubeHashtagGeneratorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <HashtagGeneratorTool />
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

      {/* Generate visible hashtags for YouTube videos and Shorts */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Generate visible hashtags for YouTube videos and Shorts
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            YouTube hashtags are public, clickable labels that can appear
            above your video title when you add them to the title or
            description. They help YouTube and viewers understand the
            topic, and they give your video another discovery path
            through hashtag pages.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            This YouTube Hashtag Generator takes your video topic and
            creates relevant hashtags for the visible part of your
            metadata. It is especially useful when you want a balanced
            mix of broad reach, niche clarity, and Shorts-friendly topic
            labels.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The goal is not to use the most hashtags possible. The goal
            is to choose the right few.
          </p>
        </div>
      </section>

      {/* Why the top 3 hashtags matter most */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Why the top 3 hashtags matter most
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            YouTube may display up to 3 hashtags above the video title.
            Those are the hashtags viewers actually see before they open
            or watch the video.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            That makes the top 3 more important than the rest. They
            should communicate:
          </p>

          <ol className="mt-6 space-y-3">
            {TOP3_ROLES.map((r, i) => (
              <li
                key={r}
                className="flex gap-3 rounded-lg bg-gray-50/60 p-4 text-sm text-gray-700 leading-relaxed ring-1 ring-gray-100"
              >
                <span className="font-semibold text-brand-700">
                  {i + 1}.
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            For example, a video about a beginner camera review might
            use:
          </p>
          <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Useful set
            </p>
            <p className="mt-3 font-mono text-sm text-gray-800">
              #SonyA7RV #CameraReview #BeginnerPhotography
            </p>
          </div>

          <p className="mt-6 text-base text-gray-700 leading-relaxed">
            That set is more useful than a pile of generic hashtags like:
          </p>
          <div className="mt-3 rounded-2xl border border-red-100 bg-red-50/30 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
              Generic set
            </p>
            <p className="mt-3 font-mono text-sm text-gray-800">
              #video #youtube #viral #new #review
            </p>
          </div>
        </div>
      </section>

      {/* Hashtags vs tags on YouTube */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Hashtags vs tags on YouTube
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Hashtags and tags are not the same thing.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {HASHTAG_DIFF.map((h) => {
              const c = DIFF_CLASSES[h.accent];
              return (
                <div
                  key={h.name}
                  className={`rounded-2xl border ${c.ring} ${c.bg} p-5`}
                >
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-wider ${c.label}`}
                  >
                    {h.label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900">
                    {h.name}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {h.rows.map((row) => (
                      <li
                        key={row}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`}
                          aria-hidden="true"
                        />
                        <span>{row}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Use the Hashtag Generator for visible hashtags. Use the{" "}
            <Link
              href="/tools/youtube-tag-generator"
              className="text-brand-700 hover:underline"
            >
              Tag Generator
            </Link>{" "}
            for hidden metadata tags.
          </p>
        </div>
      </section>

      {/* How many YouTube hashtags should you use? */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How many YouTube hashtags should you use?
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            YouTube allows up to 15 hashtags across the title and
            description. If you use more than 15, YouTube may ignore all
            hashtags on the video.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            In practice, most videos should use 3 to 5 relevant hashtags:
          </p>

          <ul className="mt-6 space-y-2">
            {HASHTAG_MIX.map((m) => (
              <li
                key={m}
                className="flex gap-3 text-sm text-gray-700 leading-relaxed"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>{m}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Do not add hashtags that do not match the video. Unrelated
            trending hashtags can make the metadata look misleading.
          </p>
        </div>
      </section>

      {/* YouTube Shorts hashtags */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            YouTube Shorts hashtags
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Shorts often rely on hashtags more than long-form videos
            because they give the short clip quick topical context.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Useful Shorts hashtag patterns:
          </p>

          <div className="mt-8 space-y-3">
            {SHORTS_PATTERNS.map((p) => (
              <div
                key={p.label}
                className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:gap-6"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700 sm:w-44 sm:shrink-0">
                  {p.label}
                </p>
                <p className="font-mono text-sm text-gray-800">{p.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Avoid stuffing every Short with generic hashtags. A clear,
            relevant set is stronger than a noisy one.
          </p>
        </div>
      </section>

      {/* How to use the generated hashtags */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How to use the generated hashtags
          </h2>

          <ol className="mt-8 space-y-4">
            {HOW_TO_STEPS.map((step, i) => (
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

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            For most uploads, placing hashtags at the end of the{" "}
            <Link
              href="/tools/youtube-description-generator"
              className="text-brand-700 hover:underline"
            >
              description
            </Link>{" "}
            keeps the title clean while still giving YouTube visible
            hashtag metadata.
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
              Finish your visible and hidden metadata
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Hashtags are only one layer. Use these tools to build the
              rest of the YouTube metadata package.
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
            Ready to pick your top 3 hashtags?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Enter a video or Shorts topic and get a relevant hashtag mix
            in seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Generate hashtags
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
