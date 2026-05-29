import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { TagExtractorTool } from "@/components/tools/TagExtractorTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-tag-extractor")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
});

const FAQS = [
  {
    q: "Wait — YouTube removed tags from the public UI. How can you still see them?",
    a: "YouTube removed the tag display from the channel-facing UI in 2018, but the tags are still embedded in the page source of every video for crawlers and the YouTube Data API. The <meta name=\"keywords\"> tag is still there if you View Source. We just parse it programmatically.",
  },
  {
    q: "Do tags actually still matter for ranking?",
    a: "Less than they used to. YouTube has stated that tags play a 'minimal role' in discovery — most of the ranking work is done by the title, description, captions, and watch-behaviour signals. But tags still help with: (1) misspellings of your topic, (2) disambiguation when your title is too short, and (3) signaling to YouTube what your video is about for the first hour after upload before engagement data exists.",
  },
  {
    q: "What's the 500-character limit?",
    a: "YouTube limits the combined length of all your tags (including the commas separating them) to 500 characters. Most creators use 5-15 well-chosen tags rather than stuffing 30+ short ones — quality over quantity. The progress bar in the result shows how close to the limit a video is.",
  },
  {
    q: "Can I extract tags from a Shorts video?",
    a: "Yes. Shorts URLs (youtube.com/shorts/...) are accepted and tags extracted the same way. Most Shorts have fewer tags than long-form videos because Shorts SEO leans heavily on the audio and on-screen text.",
  },
  {
    q: "Why does this video show 'no tags'?",
    a: "Three possibilities: (1) the uploader didn't add any (common for hobbyist channels), (2) YouTube hid them due to a community guidelines issue, or (3) the page is region-blocked from our server. Try the same video while logged into YouTube if you're the uploader.",
  },
  {
    q: "Is extracting competitor tags against YouTube's terms?",
    a: "No. Tags are public metadata that YouTube intentionally exposes via the Data API and in the page source. Looking at them for competitive research is the same as looking at a competitor's video title — fine. Copying their tags verbatim onto an unrelated video could be flagged as keyword stuffing, though, so use them as inspiration rather than verbatim.",
  },
  {
    q: "Do you save my searches?",
    a: "We cache the tags for each video ID for 6 hours so repeat lookups don't re-hit YouTube. We don't track which videos you specifically looked up — just an anonymized per-IP daily counter to prevent abuse.",
  },
];

export default function YouTubeTagExtractorPage() {
  return (
    <>
      <ToolLayout tool={tool}>
        <TagExtractorTool />
      </ToolLayout>

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the Tag Extractor
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            YouTube hid video tags from the public UI in 2018, but the tags
            are still embedded in the page source of every video. This tool
            reads that page source and pulls out the full tag list — the same
            intel TubeBuddy and VidIQ charge a monthly subscription for, free.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            Paste any YouTube video URL, and we&apos;ll fetch the page
            server-side (so YouTube&apos;s CORS policy doesn&apos;t block your
            browser), parse out the tags, and show them with a copy-friendly
            chip layout. The full result is also one click away as a
            comma-separated string ready to paste into your own video&apos;s
            tag field.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            What to do with extracted tags
          </h3>
          <ul className="mt-3 space-y-3 text-sm text-gray-700">
            <li>
              <strong>Competitive research.</strong> See which broad and
              long-tail variants top creators in your niche are targeting.
            </li>
            <li>
              <strong>Find content gaps.</strong> If competitors all use the
              same 5 tags but skip an obvious 6th, that&apos;s an opening.
            </li>
            <li>
              <strong>Misspellings &amp; alternates.</strong> Tags are where
              creators capture common misspellings of their topic — useful for
              your own tag list.
            </li>
            <li>
              <strong>Niche calibration.</strong> If a competitor with 10×
              your subs ranks for the same tags, you&apos;re in the right
              niche but need different angles.
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
              Pair extracted tags with our AI generators for a complete setup.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link href="/tools/youtube-tag-generator" className="link text-sm">
                  AI Tag Generator →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-keyword-tool" className="link text-sm">
                  Keyword Tool →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-channel-id-finder" className="link text-sm">
                  Channel ID Finder →
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
