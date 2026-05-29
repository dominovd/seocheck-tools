import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { EmbedCodeGeneratorTool } from "@/components/tools/EmbedCodeGeneratorTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-embed-code-generator")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
});

const FAQS = [
  {
    q: "Why doesn't autoplay work for me?",
    a: "Modern browsers block videos that autoplay with sound. The tool enables mute automatically when you turn on autoplay because that's the only combination that actually plays in Chrome, Safari, Firefox, and Edge. iOS Safari is even stricter and may still require a user tap.",
  },
  {
    q: "Why does loop need a 'playlist' parameter?",
    a: "Quirk of YouTube's embed player. Setting loop=1 alone has no effect for a single video. To loop one video, YouTube requires you to also pass playlist=<videoId> — which the tool does automatically when you enable Loop.",
  },
  {
    q: "What's the difference between youtube.com and youtube-nocookie.com?",
    a: "youtube-nocookie.com (Privacy-Enhanced Mode) doesn't drop tracking cookies on visitors until they actually press play. Functionally identical otherwise. Helpful for GDPR/CCPA compliance and reduces 'before consent' tracking complaints. The video count still gets logged.",
  },
  {
    q: "Why doesn't 'Restrict related videos' fully hide them?",
    a: "rel=0 used to hide related videos entirely. Since 2018 YouTube changed the behaviour: it now only restricts suggestions to the same channel as the embedded video. There's no longer a way to fully suppress them.",
  },
  {
    q: "How do start and end time work?",
    a: "Both are in seconds from the beginning of the video. The 'mm:ss' shortcut (e.g. 1:30) is parsed for convenience. Setting end without start works fine — the player starts at 0 and stops at the end value.",
  },
  {
    q: "Should I use plain iframe or responsive wrapper?",
    a: "Responsive (16:9) for anything modern — blogs, landing pages, any layout that needs to look right on mobile. Plain iframe for forums, email templates, and old-school CMS embed fields that strip <div> wrappers.",
  },
  {
    q: "What about modestbranding?",
    a: "Removed by YouTube in 2023. The YouTube logo now always appears on the control bar regardless of modestbranding=1. We don't expose the parameter because it no longer does anything.",
  },
];

export default function YouTubeEmbedCodeGeneratorPage() {
  return (
    <>
      <ToolLayout tool={tool}>
        <EmbedCodeGeneratorTool />
      </ToolLayout>

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the Embed Code Generator
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            YouTube&apos;s built-in &quot;Share → Embed&quot; gives you a fixed
            iframe with a handful of toggles buried behind &quot;Show more&quot;.
            This tool exposes the full set of player parameters in one place,
            shows you a live preview as you change settings, and produces both
            a plain iframe and a 16:9 responsive wrapper. No signup, no ads.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            All processing happens in your browser. The video ID is parsed
            client-side, the iframe URL is built locally, and the snippet is
            generated without any network call.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            Supported player parameters
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">autoplay</span>
              <span className="text-gray-700">Plays automatically (requires mute on most browsers)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">mute</span>
              <span className="text-gray-700">Starts muted</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">controls</span>
              <span className="text-gray-700">Show player UI (timeline, buttons)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">loop</span>
              <span className="text-gray-700">Repeats forever (sets playlist=videoId automatically)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">cc_load_policy</span>
              <span className="text-gray-700">Captions on by default</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">rel</span>
              <span className="text-gray-700">Restrict suggestions to the same channel</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-block w-32 shrink-0 font-mono text-gray-500">start / end</span>
              <span className="text-gray-700">Trim playback to a specific time range</span>
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
              Other free YouTube utilities you might need next.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link href="/tools/youtube-thumbnail-downloader" className="link text-sm">
                  Thumbnail Downloader →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-chapter-generator" className="link text-sm">
                  Chapter Generator →
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
