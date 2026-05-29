import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { ChannelIdFinderTool } from "@/components/tools/ChannelIdFinderTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";
import { FaqSchema } from "@/components/PageSchemas";

const tool = getToolBySlug("youtube-channel-id-finder")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

const FAQS = [
  {
    q: "What is a YouTube channel ID?",
    a: "Every YouTube channel has a unique permanent identifier that starts with UC and has 22 more characters (e.g. UCX6OQ3DkcsbYNE6H8uQQuVA). Unlike handles (@MrBeast) which the creator can change, the channel ID is fixed for the lifetime of the channel.",
  },
  {
    q: "Where do I need the channel ID?",
    a: "YouTube Data API queries, RSS subscription feeds, Webflow/WordPress YouTube embeds, third-party analytics (TubeBuddy, VidIQ, Tubular), Looker Studio dashboards, and most automation tools (Zapier, n8n, Make) all require the UC channel ID — not the @handle or custom URL.",
  },
  {
    q: "Why does my channel have a /c/ or /user/ URL but no UC ID I can see?",
    a: "Channels created before 2016 (or migrated from Google+) often have legacy custom URLs (/c/Name) or username URLs (/user/Name). These don't expose the UC ID anywhere in the URL — you have to either inspect the page source or use a tool like this one to look it up.",
  },
  {
    q: "Is the channel ID public information?",
    a: "Yes. The channel ID is embedded in the page source of every channel page and every video page on YouTube. It's a public identifier — Google designed it that way for use with the YouTube Data API and RSS feeds.",
  },
  {
    q: "How is the RSS feed URL useful?",
    a: "Subscribe in any RSS reader (Feedly, Inoreader, NetNewsWire) to get every new video as a feed entry — no ads, no algorithm, no logged-in YouTube account required. Format: https://www.youtube.com/feeds/videos.xml?channel_id=UCxxx",
  },
  {
    q: "Do you store the URLs I paste here?",
    a: "We cache the lookup result for 6 hours (channel IDs basically never change, so caching saves us a YouTube fetch on the next user's request for the same channel). We don't store anything that identifies you personally.",
  },
];

export default function YouTubeChannelIdFinderPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <ChannelIdFinderTool />
      </ToolLayout>

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the Channel ID Finder
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            YouTube identifies every channel with a 24-character UC ID that
            never changes — but the URLs you see in the wild rarely use that ID
            directly. Modern URLs use @handles, legacy ones use /c/ or /user/
            paths, and video URLs only show the video ID. This tool resolves
            any of those formats to the underlying UC channel ID.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            URLs already in the <span className="font-mono text-sm">/channel/UCxxx</span>{" "}
            form are resolved instantly in your browser — no network call. For
            handles, custom URLs, user URLs, and video URLs, we fetch the
            YouTube page server-side and parse the channel ID from the page
            metadata. Nothing about your lookup is logged.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            Supported URL formats
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">
                /channel/UC…
              </span>
              <span className="text-gray-700">Direct channel URL (instant)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">
                /@handle
              </span>
              <span className="text-gray-700">Modern handle URL</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">
                /c/name
              </span>
              <span className="text-gray-700">Legacy custom URL</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">
                /user/name
              </span>
              <span className="text-gray-700">Legacy username URL</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">
                /watch?v=…
              </span>
              <span className="text-gray-700">
                Video URL — derives the uploader&apos;s channel
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">
                /shorts/…
              </span>
              <span className="text-gray-700">Shorts URL</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">
                youtu.be/…
              </span>
              <span className="text-gray-700">Shortened video URL</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">
                @handle
              </span>
              <span className="text-gray-700">Raw handle (no URL)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">
                UCxxx…
              </span>
              <span className="text-gray-700">
                Raw channel ID (returns immediately, no lookup needed)
              </span>
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
              More free YouTube utilities you might need.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link
                  href="/tools/youtube-thumbnail-downloader"
                  className="link text-sm"
                >
                  Thumbnail Downloader →
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
