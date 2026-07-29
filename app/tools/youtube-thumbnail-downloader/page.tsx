import Link from "next/link";
import { Check, ArrowRight, Download } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { ThumbnailDownloaderTool } from "@/components/tools/ThumbnailDownloaderTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-thumbnail-downloader")!;

const PAGE_TITLE = "YouTube Thumbnail Downloader";
const META_DESCRIPTION =
  "Free YouTube thumbnail downloader. Paste any video or Shorts URL to download HD, maxresdefault, hqdefault, and standard thumbnail images. No signup.";
const OG_DESCRIPTION =
  "Download YouTube thumbnails from any video URL in every available resolution, including max resolution when YouTube provides it.";

const base = buildMetadata({
  title: "YouTube Thumbnail Downloader | HD + Max Resolution",
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
  "Paste any YouTube video or Shorts URL and download the thumbnail in every available size, from small preview images to HD and max resolution when YouTube provides it.";

const ABOVE_FOLD_BULLETS = [
  "Download in every available size, including maxresdefault when YouTube has it.",
  "Works with watch URLs, Shorts, youtu.be links, embed URLs, and raw IDs.",
  "Loaded straight from YouTube's image CDN. No signup, no watermark.",
];

type Resolution = {
  name: string;
  size: string;
  note: string;
  accent: "brand" | "slate";
};

const RESOLUTIONS: Resolution[] = [
  {
    name: "maxresdefault.jpg",
    size: "1280 x 720",
    note: "Best quality. Available on many HD videos.",
    accent: "brand",
  },
  {
    name: "sddefault.jpg",
    size: "640 x 480",
    note: "Mid-tier fallback when max resolution is missing.",
    accent: "slate",
  },
  {
    name: "hqdefault.jpg",
    size: "480 x 360",
    note: "Usually available, even on older or low-resolution uploads.",
    accent: "slate",
  },
  {
    name: "mqdefault.jpg",
    size: "320 x 180",
    note: "Lightweight preview for embeds and quick references.",
    accent: "slate",
  },
  {
    name: "default.jpg",
    size: "120 x 90",
    note: "Smallest variant. Useful only for tiny inline previews.",
    accent: "slate",
  },
];

const ACCENT_CLASSES: Record<string, { ring: string; bg: string; label: string }> = {
  brand: { ring: "border-brand-200", bg: "bg-brand-50/40", label: "text-brand-700" },
  slate: { ring: "border-gray-200", bg: "bg-white", label: "text-gray-500" },
};

const MAX_USES = [
  "design reference",
  "thumbnail analysis",
  "presentations",
  "moodboards",
  "visual comparison",
  "competitor research",
];

const FALLBACK_USES = [
  "a smaller image",
  "a quick preview",
  "a lightweight embed",
  "a fallback for videos without max resolution",
];

const HOW_TO_STEPS = [
  "Copy the YouTube video URL from the address bar or Share button.",
  "Paste it into the downloader.",
  "Pick the resolution you need.",
  "Click download, copy the image URL, or open the thumbnail in a new tab.",
];

const SUPPORTED_FORMATS = [
  "youtube.com/watch?v=VIDEO_ID",
  "youtu.be/VIDEO_ID",
  "youtube.com/shorts/VIDEO_ID",
  "youtube.com/embed/VIDEO_ID",
  "VIDEO_ID",
];

const RESEARCH_STEPS = [
  "Download for reference.",
  "Study what makes it work.",
  "Build your own original thumbnail.",
  "Preview it with your title before publishing.",
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-thumbnail-preview",
    name: "Thumbnail Preview",
    body: "Test your own thumbnail and title in YouTube-style layouts.",
  },
  {
    href: "/tools/youtube-title-score-checker",
    name: "Title Analyzer",
    body: "Check whether the title supports the thumbnail.",
  },
  {
    href: "/tools/youtube-title-generator",
    name: "Title Generator",
    body: "Generate title options for the same idea.",
  },
  {
    href: "/tools/youtube-tag-extractor",
    name: "Tag Extractor",
    body: "Inspect the video's metadata alongside the thumbnail.",
  },
  {
    href: "/tools/youtube-competitor-analyzer",
    name: "Competitor Channel Analyzer",
    body: "Study the channel's strongest videos.",
  },
  {
    href: "/tools",
    name: "All Optimize tools",
    body: "Browse the rest of the packaging workflow.",
  },
];

const FAQS = [
  {
    q: "Is this YouTube Thumbnail Downloader free?",
    a: "Yes. The tool is free to use and does not require signup.",
  },
  {
    q: "Can I download thumbnails from YouTube Shorts?",
    a: "Yes. Paste the Shorts URL and the tool will extract the video ID. Some Shorts may only have lower-resolution thumbnail versions available.",
  },
  {
    q: "Why is maxresdefault not available?",
    a: "YouTube does not create a maxresdefault image for every video. Older uploads, low-resolution videos, and some Shorts may only have hqdefault, mqdefault, or smaller versions.",
  },
  {
    q: "What is the highest YouTube thumbnail resolution?",
    a: "The highest common YouTube thumbnail resolution is maxresdefault.jpg, usually 1280 x 720. It is available only when YouTube generated that version for the video.",
  },
  {
    q: "Can I use someone else's thumbnail?",
    a: "Be careful. Thumbnails are usually copyrighted by the uploader or rights holder. Downloading for reference, commentary, internal research, or moodboards may be reasonable depending on context, but reusing someone else's thumbnail as your own can create copyright and misleading-content issues.",
  },
  {
    q: "Does this work with youtu.be links?",
    a: "Yes. The tool supports youtu.be short links, regular watch URLs, Shorts URLs, embed URLs, and raw video IDs.",
  },
  {
    q: "Does this download the video too?",
    a: "No. This tool only downloads thumbnail images. It does not download YouTube videos or audio.",
  },
  {
    q: "Why are some thumbnails 4:3 instead of 16:9?",
    a: "Some fallback versions such as hqdefault and sddefault can use 4:3 dimensions or include letterboxing or cropping depending on the source video and YouTube's generated image set.",
  },
  {
    q: "Do you store the URLs I paste?",
    a: "No private account connection is required. The tool extracts the video ID and loads public thumbnail images from YouTube's image CDN.",
  },
  {
    q: "What should I do after downloading a thumbnail?",
    a: "If you are using it for research, compare the thumbnail with the title, topic, and performance context. Then create your own original version and use the Thumbnail Preview tool to test how it reads before publishing.",
  },
];

export default function YouTubeThumbnailDownloaderPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <ThumbnailDownloaderTool />
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
            Video IDs are parsed in your browser and thumbnails load from
            YouTube&apos;s public image CDN.
          </p>
        </div>
      </section>

      {/* Download a YouTube thumbnail from any video URL */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Download a YouTube thumbnail from any video URL
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Every public YouTube video has thumbnail images stored on
            YouTube&apos;s image CDN. This tool extracts the video ID from
            the URL you paste and shows the available thumbnail versions
            so you can download the one you need.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use it for design reference, content research, moodboards,
            reporting, embeds, or checking how a competitor packaged a
            video. Paste a regular YouTube URL, a{" "}
            <span className="font-mono text-sm">youtu.be</span> short
            link, a Shorts URL, an embed URL, or just the video ID.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            No signup. No watermark. No extension.
          </p>
        </div>
      </section>

      {/* Available thumbnail sizes */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Available thumbnail sizes
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            YouTube commonly serves these thumbnail files:
          </p>

          <div className="mt-8 space-y-3">
            {RESOLUTIONS.map((r) => {
              const c = ACCENT_CLASSES[r.accent];
              return (
                <div
                  key={r.name}
                  className={`flex flex-col gap-2 rounded-2xl border ${c.ring} ${c.bg} p-5 sm:flex-row sm:items-center sm:gap-6`}
                >
                  <div className="sm:w-56 sm:shrink-0">
                    <p className="font-mono text-sm text-gray-900">
                      {r.name}
                    </p>
                    <p className={`mt-1 text-xs font-medium ${c.label}`}>
                      {r.size}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {r.note}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Not every video has every size.{" "}
            <span className="font-mono text-sm">maxresdefault</span> is
            the best quality when available, but older videos, low-
            resolution uploads, and some Shorts may only have lower-
            resolution versions.
          </p>
        </div>
      </section>

      {/* When to use each resolution */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            When to use each resolution
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                MAXRESDEFAULT
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                When you want the cleanest image
              </p>
              <ul className="mt-3 space-y-1.5">
                {MAX_USES.map((u) => (
                  <li
                    key={u}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                      aria-hidden="true"
                    />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                HQDEFAULT / MQDEFAULT
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                When you need a smaller image
              </p>
              <ul className="mt-3 space-y-1.5">
                {FALLBACK_USES.map((u) => (
                  <li
                    key={u}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"
                      aria-hidden="true"
                    />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            If you are comparing thumbnail strategy, always start with the
            highest available resolution. It gives you the clearest view
            of text, face expression, product placement, color contrast,
            and composition.
          </p>
        </div>
      </section>

      {/* How to download a YouTube thumbnail */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How to download a YouTube thumbnail
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
            Supported formats:
          </p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/60">
            <ul className="divide-y divide-gray-100">
              {SUPPORTED_FORMATS.map((f) => (
                <li
                  key={f}
                  className="px-5 py-3 font-mono text-xs text-gray-800 sm:text-sm"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Use thumbnails as research, not as stolen assets */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Use thumbnails as research, not as stolen assets
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Downloaded thumbnails are useful for studying packaging:
            colors, layout, facial expression, text size, contrast, and
            topic framing.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            But a thumbnail belongs to the creator or rights holder who
            uploaded it. Do not reuse another creator&apos;s thumbnail as
            your own unless you have permission or a clear legal basis.
            For most creators, the right workflow is:
          </p>

          <ol className="mt-8 space-y-4">
            {RESEARCH_STEPS.map((step, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {i === 3 ? (
                    <>
                      Preview it with your title before publishing in the{" "}
                      <Link
                        href="/tools/youtube-thumbnail-preview"
                        className="font-medium text-brand-700 hover:underline"
                      >
                        Thumbnail Preview
                      </Link>{" "}
                      tool.
                    </>
                  ) : (
                    step
                  )}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-sm text-gray-800 leading-relaxed">
            The best use of this tool is learning from packaging, not
            copying it.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How it works
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The tool extracts the YouTube video ID from the URL you enter
            and builds the public image URLs YouTube uses for that
            video&apos;s thumbnails. It then checks which versions are
            available and shows download options.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The images are loaded from YouTube&apos;s public{" "}
            <span className="font-mono text-sm">i.ytimg.com</span> CDN.
            The tool does not need your YouTube account and does not
            access private analytics.
          </p>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-4 text-sm text-gray-700">
            <Download
              className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>
              The download happens client-side via Blob URL. Nothing
              about your lookup is sent to our servers.
            </span>
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
              Study, then build your own packaging
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Download thumbnails for reference, then preview your own
              title and thumbnail before publishing.
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
            Ready to download a YouTube thumbnail?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Paste a video URL and pick the resolution you need.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Download thumbnail
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
