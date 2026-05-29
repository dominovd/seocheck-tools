import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { ThumbnailDownloaderTool } from "@/components/tools/ThumbnailDownloaderTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";

const tool = getToolBySlug("youtube-thumbnail-downloader")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

const FAQS = [
  {
    q: "Why isn't the max resolution (1280×720) showing up?",
    a: "YouTube only generates the maxresdefault image for videos uploaded in HD or higher. Older or lower-quality uploads fall back to hqdefault (480×360), which is always available.",
  },
  {
    q: "Can I download a thumbnail from a YouTube Short?",
    a: "Yes. Paste the Shorts URL (youtube.com/shorts/…) and the tool extracts the video ID the same way. Shorts thumbnails are usually only available up to hqdefault.",
  },
  {
    q: "Are these thumbnails free to use?",
    a: "The thumbnails belong to the video's uploader and are subject to copyright. You can use them for personal reference, design moodboards, or commentary under fair use, but not as your own thumbnail or for commercial reuse without permission.",
  },
  {
    q: "Why does the download save with a long filename?",
    a: "We name the file <videoId>-<resolution>.jpg so you can identify which video it came from later. Rename it after downloading if you prefer.",
  },
  {
    q: "Do you save the URLs I paste here?",
    a: "No. Video IDs are extracted in your browser, thumbnails load directly from YouTube's servers, and nothing is sent to our backend. See our privacy policy.",
  },
];

export default function YouTubeThumbnailDownloaderPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <ThumbnailDownloaderTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      {/* Supporting content for SEO + topical authority */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the thumbnail downloader
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Every YouTube video has up to five auto-generated thumbnail images,
            served from <span className="font-mono text-sm text-gray-900">i.ytimg.com</span>
            {" "}at fixed resolutions. This tool extracts the video ID from any
            YouTube URL you paste, builds the URL for every variant, and lets you
            download or copy the link.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            Everything runs in your browser. No video URL or thumbnail is sent to
            our servers — images load directly from YouTube&apos;s CDN, and the
            download happens client-side via Blob URL.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            Available resolutions
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>
              <span className="font-mono text-gray-900">maxresdefault</span> — 1280 × 720,
              HD uploads only
            </li>
            <li>
              <span className="font-mono text-gray-900">sddefault</span> — 640 × 480
            </li>
            <li>
              <span className="font-mono text-gray-900">hqdefault</span> — 480 × 360,
              always available
            </li>
            <li>
              <span className="font-mono text-gray-900">mqdefault</span> — 320 × 180
            </li>
            <li>
              <span className="font-mono text-gray-900">default</span> — 120 × 90,
              always available
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
            <h3 className="text-base font-semibold text-gray-900">
              Related tools
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Other free YouTube tools you might need next.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link
                  href="/tools/youtube-channel-id-finder"
                  className="link text-sm"
                >
                  Channel ID Finder →
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/youtube-tag-extractor"
                  className="link text-sm"
                >
                  Tag Extractor →
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/youtube-embed-code-generator"
                  className="link text-sm"
                >
                  Embed Code Generator →
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
