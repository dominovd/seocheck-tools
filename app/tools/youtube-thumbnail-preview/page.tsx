import Link from "next/link";
import {
  Check,
  ArrowRight,
  Search,
  House,
  PanelRight,
  Smartphone,
  Moon,
} from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { ThumbnailPreviewTool } from "@/components/tools/ThumbnailPreviewTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-thumbnail-preview")!;

const PAGE_TITLE = "YouTube Thumbnail Preview Tool";
const META_DESCRIPTION =
  "Free YouTube thumbnail preview tool. Test your thumbnail and title in search, home feed, sidebar, mobile, and dark mode before publishing.";
const OG_DESCRIPTION =
  "Preview your YouTube thumbnail and title in realistic layouts to catch readability, cropping, and title-truncation issues before publishing.";

const base = buildMetadata({
  title: "YouTube Thumbnail Preview Tool | Check Title + CTR",
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
  "Preview your thumbnail and title the way viewers will actually see them: in YouTube search, home feed, sidebar, mobile, and dark mode. Catch weak contrast, tiny text, awkward cropping, and title truncation before you publish.";

const ABOVE_FOLD_BULLETS = [
  "Test the thumbnail and title across 5 real YouTube surfaces.",
  "Catch title truncation, weak contrast, and tiny text at small size.",
  "Toggle dark mode to check contrast for night-time viewers.",
];

const SURFACES = [
  {
    Icon: Search,
    name: "Desktop search",
    body: "Larger thumbnail, title, and surrounding context. The most competitive surface for query-driven discovery.",
  },
  {
    Icon: House,
    name: "Home feed",
    body: "Browse-style card where the thumbnail does most of the work. Viewers scan fast, so the image has to land instantly.",
  },
  {
    Icon: PanelRight,
    name: "Sidebar / next-up",
    body: "Small thumbnail and aggressively truncated title. If the key phrase sits past character 60-70, viewers will not see it.",
  },
  {
    Icon: Smartphone,
    name: "Mobile feed",
    body: "The surface where most viewers first judge the video. The thumbnail dominates, the title shrinks.",
  },
  {
    Icon: Moon,
    name: "Light and dark themes",
    body: "Contrast check for different viewing environments. Dark backgrounds and dark text can blend into the YouTube UI at night.",
  },
];

const PUBLISH_QUESTIONS = [
  "Can I understand the thumbnail in under one second?",
  "Is the most important visual element still clear at small size?",
  "Does the title add information instead of repeating the thumbnail text?",
  "Does the key phrase appear before the title gets truncated?",
  "Does the design still work in dark mode?",
];

const PAIR_ROLES = [
  {
    label: "THUMBNAIL",
    role: "Thumbnail",
    body: "Shows the tension, result, object, face, or visual contrast. Creates instant recognition or curiosity.",
    accent: "brand",
  },
  {
    label: "TITLE",
    role: "Title",
    body: "Explains the stakes, question, payoff, or transformation. Clarifies the promise the thumbnail teases.",
    accent: "violet",
  },
];

const PAIR_CLASSES: Record<string, { ring: string; bg: string; label: string }> = {
  brand: { ring: "border-brand-100", bg: "bg-brand-50/30", label: "text-brand-700" },
  violet: { ring: "border-violet-100", bg: "bg-violet-50/30", label: "text-violet-700" },
};

const USE_STEPS = [
  "Paste a YouTube URL, video ID, Shorts URL, or direct image URL.",
  "Enter the title you plan to publish with.",
  "Check desktop search, home feed, sidebar, and mobile previews.",
  "Toggle dark mode.",
  "Rewrite the title or adjust the thumbnail until the promise is clear in every view.",
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-title-generator",
    name: "Title Generator",
    body: "Create title options for the same thumbnail.",
  },
  {
    href: "/tools/youtube-title-score-checker",
    name: "Title Analyzer",
    body: "Score title clarity, length, and click potential.",
  },
  {
    href: "/tools/youtube-thumbnail-downloader",
    name: "Thumbnail Downloader",
    body: "Pull thumbnails from existing videos for reference.",
  },
  {
    href: "/tools/youtube-video-audit",
    name: "Video Audit",
    body: "Check a published video's metadata after upload.",
  },
  {
    href: "/tools/youtube-keyword-tool",
    name: "Keyword Tool",
    body: "Validate search phrases before locking the title.",
  },
  {
    href: "/tools",
    name: "All Optimize tools",
    body: "Browse the rest of the packaging workflow.",
  },
];

const FAQS = [
  {
    q: "Is this YouTube Thumbnail Preview Tool free?",
    a: "Yes. The tool is free to use and does not require signup.",
  },
  {
    q: "What can I paste into the thumbnail field?",
    a: "You can paste a YouTube video URL, Shorts URL, youtu.be link, video ID, or a direct image URL ending in a format like .jpg, .png, or .webp.",
  },
  {
    q: "Can I preview a thumbnail before the video is uploaded?",
    a: "Yes, if the thumbnail image is available at a public direct image URL. Paste the image URL and enter the title you plan to use.",
  },
  {
    q: "Does this tool generate thumbnails?",
    a: "No. This tool previews and checks an existing thumbnail concept. Use your design tool or thumbnail generator first, then use this preview to test how the thumbnail and title read in YouTube-style layouts.",
  },
  {
    q: "Why should I preview the title with the thumbnail?",
    a: "Viewers see the title and thumbnail together. A thumbnail can create curiosity, but the title usually clarifies the promise. Testing them together helps you avoid repeated text, unclear stakes, and titles that get cut before the important words.",
  },
  {
    q: "Which preview matters most?",
    a: "Mobile and sidebar are the harshest tests because space is limited. If the packaging works there, it usually works in larger desktop views too.",
  },
  {
    q: "Can this predict my YouTube CTR?",
    a: "No. It can help you catch packaging problems that may hurt CTR, but it does not predict actual click-through rate. Real CTR depends on audience, topic, traffic source, competition, timing, and viewer history.",
  },
  {
    q: "Why does my title get cut off?",
    a: "YouTube truncates titles differently across surfaces. Sidebar and mobile views often show less text than desktop search. Put the main promise or keyword early so viewers see it before truncation.",
  },
  {
    q: "Does dark mode matter?",
    a: "Yes. Many viewers use YouTube in dark mode. Low-contrast thumbnails, black backgrounds, and dark text can lose clarity against dark UI surfaces.",
  },
  {
    q: "Do you store my thumbnail or title?",
    a: "No. The preview runs in the browser. YouTube thumbnails are loaded from YouTube's public image URLs, and direct image URLs are loaded from the URL you provide.",
  },
];

export default function YouTubeThumbnailPreviewPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <ThumbnailPreviewTool />
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
            Free, no signup. Runs in your browser using YouTube&apos;s
            public thumbnail URLs.
          </p>
        </div>
      </section>

      {/* Test the packaging before YouTube tests it on viewers */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Test the packaging before YouTube tests it on viewers
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Thumbnail design is not finished when the image looks good at
            full size. It is finished when the thumbnail and title still
            make sense inside YouTube&apos;s real surfaces.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            That is where many videos lose clicks. Text that looks bold in
            an editor becomes unreadable at sidebar size. A face or
            product gets cropped on mobile. A title depends on words that
            disappear after truncation. A dark thumbnail blends into dark
            mode. None of those problems are obvious when you only review
            the design on a clean canvas.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The YouTube Thumbnail Preview Tool lets you test the full
            package before publishing: thumbnail, title, layout, scale,
            contrast, and truncation.
          </p>
        </div>
      </section>

      {/* What this tool previews */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What this tool previews
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The tool simulates the places where your video packaging has
            to compete:
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {SURFACES.map(({ Icon, name, body }) => (
              <div
                key={name}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <p className="text-base font-semibold text-gray-900">
                    {name}
                  </p>
                </div>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            The goal is not a perfect clone of YouTube&apos;s UI. The goal
            is a practical stress test: can a viewer understand the video
            fast enough to consider clicking?
          </p>
        </div>
      </section>

      {/* What to check before publishing */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What to check before publishing
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Use the preview to answer five questions:
          </p>

          <ol className="mt-8 space-y-4">
            {PUBLISH_QUESTIONS.map((q, i) => (
              <li
                key={q}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{q}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            If the answer is no, fix the packaging before uploading.
            Changing a title or thumbnail after a weak launch is possible,
            but it is cleaner to catch obvious problems before the first
            impression.
          </p>
        </div>
      </section>

      {/* Thumbnail and title should work as one idea */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Thumbnail and title should work as one idea
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            A strong YouTube package is not just a good image or a clever
            title. It is the combination.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The thumbnail should create instant recognition or curiosity.
            The title should clarify the promise. If both say the same
            thing, you waste space. If they point in different directions,
            viewers hesitate.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PAIR_ROLES.map((p) => {
              const c = PAIR_CLASSES[p.accent];
              return (
                <div
                  key={p.role}
                  className={`rounded-2xl border ${c.ring} ${c.bg} p-5`}
                >
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-wider ${c.label}`}
                  >
                    {p.label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900">
                    {p.role}
                  </p>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            For example, a thumbnail can show a failed result, while the
            title explains the experiment. Or the thumbnail can show the
            product, while the title names the surprising conclusion. The
            preview helps you see whether that pairing survives in real
            layouts.
          </p>
        </div>
      </section>

      {/* How to use the preview */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How to use the preview
          </h2>

          <ol className="mt-8 space-y-4">
            {USE_STEPS.map((step, i) => (
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
            For unpublished thumbnails, paste a direct image URL from your
            image host. For existing YouTube videos, paste the video URL
            and the tool will use the public thumbnail.
          </p>
        </div>
      </section>

      {/* What this tool does not do */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What this tool does not do
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50/40 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                Not an A/B test
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                It does not measure real CTR, impressions, or retention.{" "}
                <Link
                  href="/tools/youtube-video-audit"
                  className="text-brand-700 hover:underline"
                >
                  Video Audit
                </Link>{" "}
                and YouTube Studio are the source of truth after the video
                goes live.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50/40 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                Not a thumbnail generator
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                It will not design the image for you. Its job is simpler:
                show whether the thumbnail and title you already have are
                readable, understandable, and clickable enough to publish.
              </p>
            </div>
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Use it before upload, after designing in Canva, Figma, or
            Photoshop, or when comparing title variants for the same
            thumbnail.
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
              Finish the packaging workflow
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Preview is the final check. Use these tools to generate,
              score, and audit the rest of the video package.
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
            Ready to test your packaging?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Paste your thumbnail and title, then scan five real YouTube
            layouts.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Preview thumbnail and title
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
