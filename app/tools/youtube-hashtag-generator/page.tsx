import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { HashtagGeneratorTool } from "@/components/tools/HashtagGeneratorTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-hashtag-generator")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
});

const FAQS = [
  {
    q: "Why only the first 3 hashtags?",
    a: "YouTube only displays the first 3 hashtags from your description above the video title. Beyond 3, they just count as text in your description and don't get the same visibility. We mark the top 3 separately so you know which to prioritise.",
  },
  {
    q: "What does 'competition' mean here?",
    a: "How saturated the hashtag is on YouTube. High = millions of videos using it (e.g. #gaming, #vlog). Medium = niche-aware but searchable. Low = specific enough that your video might surface on the hashtag page. A healthy mix: 1 high for reach, 1 medium for discoverability, 1 low for niche-precision.",
  },
  {
    q: "Where should I put hashtags?",
    a: "At the very end of your description. YouTube parses the last line for the 3 hashtags it displays above the title. You can also put them inline in the description text — they'll still count for the 15-max limit but won't display above the title.",
  },
  {
    q: "What's the maximum number of hashtags?",
    a: "15 across the entire video (title + description). Beyond 15, YouTube ignores all hashtags on your video and may flag it for hashtag spam. We give you 15 to choose from, but stick to using the top 3-5 you actually want above the title.",
  },
  {
    q: "Does this work for YouTube Shorts?",
    a: "Yes, and Shorts rely on hashtags more than long-form videos do. #shorts is essentially required for distribution on the Shorts shelf. The model includes it automatically when the topic is Shorts-y; otherwise add it manually if your video is a Short.",
  },
  {
    q: "Should I use trending hashtags from other niches?",
    a: "No. YouTube cracks down on misleading metadata — using #mrbeast on an unrelated cooking video can demote your video or remove it from search. Stick to topically relevant tags.",
  },
  {
    q: "How is this different from the Tag Generator?",
    a: "Tags are private metadata YouTube uses for indexing (max 500 chars combined). Hashtags are public and clickable — viewers can tap them to see other videos with the same hashtag. Different functions, different best practices.",
  },
];

export default function YouTubeHashtagGeneratorPage() {
  return (
    <>
      <ToolLayout tool={tool}>
        <HashtagGeneratorTool />
      </ToolLayout>

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the AI Hashtag Generator
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Describe your video, get 15 YouTube hashtags ranked by how
            saturated they are on the platform. The model balances high-reach
            broad hashtags with niche-specific long-tail ones so your video
            has a shot at both discovery surfaces — the trending hashtag pages
            and your specific niche&apos;s tighter audience.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            The top 3 are called out separately because YouTube displays them
            above your video title. Choose carefully — those are your primary
            visible signals.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            Hashtag vs tag — what&apos;s the difference?
          </h3>
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700"></th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Hashtags</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="px-4 py-2 font-medium">Visibility</td>
                  <td className="px-4 py-2">Public, clickable</td>
                  <td className="px-4 py-2">Hidden metadata</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Location</td>
                  <td className="px-4 py-2">Description or title</td>
                  <td className="px-4 py-2">Tags field in Studio</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Max count</td>
                  <td className="px-4 py-2">15 (3 display)</td>
                  <td className="px-4 py-2">500 char limit</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Primary use</td>
                  <td className="px-4 py-2">Discovery on hashtag pages</td>
                  <td className="px-4 py-2">Indexing + misspellings</td>
                </tr>
              </tbody>
            </table>
          </div>

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
              The hashtags pair well with these other AI generators.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link href="/tools/youtube-tag-generator" className="link text-sm">
                  AI Tag Generator →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-description-generator" className="link text-sm">
                  AI Description Generator →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-title-generator" className="link text-sm">
                  AI Title Generator →
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
