import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { DescriptionGeneratorTool } from "@/components/tools/DescriptionGeneratorTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";
import { FaqSchema } from "@/components/PageSchemas";

const tool = getToolBySlug("youtube-description-generator")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

const FAQS = [
  {
    q: "How long should a YouTube description be?",
    a: "Most well-performing videos have descriptions between 800 and 2,500 characters. The first ~120 characters are the most important — they show in search results and in the 'more' preview before the click. Length itself isn't a ranking factor, but a thoughtful description signals to YouTube that your video isn't low-effort.",
  },
  {
    q: "Does YouTube actually use the description for ranking?",
    a: "Yes, for two reasons. (1) It's part of the signal YouTube uses to understand what the video is about — especially in the first hour after upload, before watch-behaviour data exists. (2) The first 120 characters appear in search results and influence click-through rate, which is itself a ranking signal.",
  },
  {
    q: "What's the chapter placeholder for?",
    a: "It marks where to paste your timestamps. Use our free Chapter Generator to format them — paste your rough timestamps in, it validates them against YouTube's 4 rules, and gives you back the correctly-formatted block to drop in here.",
  },
  {
    q: "Should I include affiliate or sponsor links?",
    a: "Yes, after the call-to-action. Most creators put them in a 'Links' section below the chapters. Disclose paid partnerships clearly — YouTube requires it and FTC enforces it. The model intentionally leaves space for these so you can paste your own.",
  },
  {
    q: "Why only 3 hashtags?",
    a: "YouTube only displays the first 3 hashtags from a description above the title. Beyond 3 they just count as text. More than 15 total hashtags can flag your video for hashtag abuse and demote it.",
  },
  {
    q: "Should I write the description before or after the video?",
    a: "After. The model produces a sharper description when you describe what's actually in the final video — including any tangents or unexpected segments. Pre-write a working title and tags before filming, save the description for the upload step.",
  },
  {
    q: "Is the description AI-generated text safe for monetization?",
    a: "Yes. YouTube monetizes based on the video itself and the channel's overall standing — not on whether the description was AI-written. As long as the description accurately describes the video and doesn't violate community guidelines, you're fine.",
  },
];

export default function YouTubeDescriptionGeneratorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool}>
        <DescriptionGeneratorTool />
      </ToolLayout>

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the AI Description Generator
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Describe what&apos;s in your video, and the model produces a
            complete YouTube description — hook, body, chapters placeholder,
            call-to-action, and 3 hashtags — in seconds. The structure follows
            the format that performs well in YouTube&apos;s search and browse
            surfaces, with the strongest signal packed into the first 120
            characters.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            Generated descriptions are ready to paste into YouTube Studio.
            Drop in your real chapter timestamps where the placeholder is,
            add any affiliate or sponsor links after the CTA, and you&apos;re
            done.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            Description structure
          </h3>
          <ol className="mt-3 space-y-3 text-sm text-gray-700">
            <li>
              <strong>1. Hook (1-2 lines).</strong> The most important real
              estate — shows in SERP previews. The model puts the key value
              up top.
            </li>
            <li>
              <strong>2. Body (2-3 short paragraphs).</strong> Expanded
              description of the video content. Keywords appear naturally,
              not stuffed.
            </li>
            <li>
              <strong>3. Chapter placeholder.</strong> A &quot;⏱️ Chapters&quot;
              header with a 0:00 Intro stub, ready for you to fill in.
            </li>
            <li>
              <strong>4. Call-to-action.</strong> Subscribe / like / comment
              prompt in natural language, not aggressive.
            </li>
            <li>
              <strong>5. Hashtag line.</strong> Three hashtags YouTube
              displays above your title.
            </li>
          </ol>

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
              Use these together for a complete upload checklist.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link href="/tools/youtube-chapter-generator" className="link text-sm">
                  Chapter Generator →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-title-generator" className="link text-sm">
                  AI Title Generator →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-hashtag-generator" className="link text-sm">
                  AI Hashtag Generator →
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
