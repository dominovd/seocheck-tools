import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { ThumbnailPreviewTool } from "@/components/tools/ThumbnailPreviewTool";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-thumbnail-preview")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
});

const FAQS = [
  {
    q: "Why does this matter? My thumbnail looks fine in Photoshop.",
    a: "Photoshop shows it at 1920×1080 against a clean canvas. YouTube shows it at 240×135 in a busy sidebar, in mobile feed at half that size, in dark mode, next to three competing thumbnails. The same image can read beautifully in your editor and disappear completely on the surfaces that actually drive clicks. This tool lets you see all those surfaces before you publish.",
  },
  {
    q: "Which preview is most important?",
    a: "Mobile. Roughly 60-70% of YouTube watch time is mobile, and on mobile the thumbnail dominates while title is shrunk and subtitle is gone. If your packaging only works at desktop sizes, you're losing the majority of available CTR. Test mobile first; if it lands there, the rest tends to follow.",
  },
  {
    q: "What can I paste as the thumbnail?",
    a: "Any YouTube URL (watch?v=…, youtu.be/…, /shorts/…) — we'll pull the maxresdefault thumbnail from YouTube's CDN. Or a direct image URL ending in .jpg/.png/.webp — useful if you want to preview a mockup you've hosted before the video is uploaded.",
  },
  {
    q: "Why does the sidebar preview show the title truncated?",
    a: "That's intentional — the YouTube sidebar truncates titles after roughly 60-70 characters, and the truncation is what actually appears to viewers. If your important keyword sits past the 70-char mark, sidebar viewers will never see it. Front-load the keyword to the first 40-50 chars.",
  },
  {
    q: "Can I test light vs dark theme?",
    a: "Yes — toggle in the controls above the previews. Dark-mode safety matters more than people realise. Black/dark backgrounds vanish; high-contrast yellow/red/white pops. Test both before committing.",
  },
  {
    q: "Do you store the images I preview?",
    a: "No. Everything happens client-side in your browser. The thumbnail URL is fetched directly from YouTube's CDN (for YouTube refs) or from the URL you provided (for direct image refs). Nothing touches our servers.",
  },
  {
    q: "Will you add upload support?",
    a: "Not yet — file upload pulls us into image-hosting infrastructure that adds cost and complexity for a feature that's solved by uploading to any image host first (Imgur, Cloudinary, even Google Drive with public link). For now, paste the URL.",
  },
];

export default function YouTubeThumbnailPreviewPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <ThumbnailPreviewTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the Thumbnail Preview tool
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Other thumbnail tools download or generate — this one stress-tests
            yours against the real surfaces YouTube actually shows. A thumbnail
            that looks confident at 1920×1080 in your editor can vanish in the
            sidebar at 168px wide. A title that lands cleanly on desktop search
            often gets truncated past the 70-char mark in mobile feed.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            Use it before you publish: paste the thumbnail URL plus your final
            title, scan the four contexts, and ship only when the packaging
            holds up across all four. The goal isn&apos;t the cleanest mock —
            it&apos;s the highest CTR.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            What gets simulated
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>
              <strong className="text-gray-900">Desktop search results</strong> —
              the largest thumbnail surface and the most competitive one. Title
              has ~2 lines, description gets ~100 chars of context.
            </li>
            <li>
              <strong className="text-gray-900">Desktop home / browse</strong> —
              your thumbnail competes with two neighbour cards. We grey them out
              so your packaging is the visible focus.
            </li>
            <li>
              <strong className="text-gray-900">Desktop sidebar (next-up)</strong> —
              the tightest layout, with the title aggressively truncated. If
              your keyword sits past char 70, it&apos;s invisible here.
            </li>
            <li>
              <strong className="text-gray-900">Mobile feed</strong> —
              full-width thumbnail dominating the layout. 60-70% of YouTube
              watch time happens here.
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
            <h3 className="text-base font-semibold text-gray-900">Related tools</h3>
            <p className="mt-1 text-sm text-gray-600">
              Generate the packaging, score it, then preview before publishing.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li><Link href="/tools/youtube-title-generator" className="link text-sm">AI Title Generator →</Link></li>
              <li><Link href="/tools/youtube-title-score-checker" className="link text-sm">Title Score Checker →</Link></li>
              <li><Link href="/tools/youtube-thumbnail-downloader" className="link text-sm">Thumbnail Downloader →</Link></li>
              <li><Link href="/tools/youtube-video-audit" className="link text-sm">Video Audit →</Link></li>
              <li><Link href="/tools/optimize" className="link text-sm">All Optimize tools →</Link></li>
              <li><Link href="/tools" className="link text-sm">All YouTube tools →</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
