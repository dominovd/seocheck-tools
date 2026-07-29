import Link from "next/link";
import {
  Lightbulb,
  Search,
  ListChecks,
  HelpCircle,
  Scale,
  Globe,
  ArrowRight,
} from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { KeywordToolTool } from "@/components/tools/KeywordToolTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";

const tool = getToolBySlug("youtube-keyword-tool")!;

export const metadata = buildMetadata({
  title: "YouTube Keyword Tool | Free Keyword Research",
  description:
    "Use a free YouTube keyword tool to find keyword ideas, autocomplete suggestions, long-tail topics, questions, comparisons, and video ideas by region.",
  path: `tools/${tool.slug}`,
  noBrand: true,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

const HERO_SUBTITLE =
  "Find what people are searching for on YouTube. Enter a seed keyword and get keyword ideas, autocomplete suggestions, long-tail topics, questions, comparisons, and video angles.";

type Card = { Icon: typeof Lightbulb; title: string; body: string };

const WHAT_YOU_GET: Card[] = [
  {
    Icon: Lightbulb,
    title: "Keyword ideas",
    body: "Find YouTube search terms related to your seed topic.",
  },
  {
    Icon: Search,
    title: "Autocomplete suggestions",
    body: "Use YouTube's own search suggestions to discover what viewers are typing.",
  },
  {
    Icon: ListChecks,
    title: "Long-tail keywords",
    body: "Expand one topic into more specific phrases with clearer intent and less competition.",
  },
  {
    Icon: HelpCircle,
    title: "Question keywords",
    body: "Find how, what, why, and should-style searches that work well for tutorials and explainers.",
  },
  {
    Icon: Scale,
    title: "Comparison keywords",
    body: 'Find "vs," "or," and alternative-style searches for review and buying-intent videos.',
  },
  {
    Icon: Globe,
    title: "Regional research",
    body: "Compare keyword ideas across audience regions to find local gaps and content angles.",
  },
];

const HOW_TO_STEPS = [
  {
    title: "Enter a seed keyword",
    body: 'Start with a broad topic like "drone review," "react tutorial," "sourdough," or "budget gaming setup." The tool expands it into related YouTube keyword ideas.',
  },
  {
    title: "Choose your audience region",
    body: "Pick the country and language your channel targets. YouTube keyword suggestions can vary by region, so local research matters.",
  },
  {
    title: "Scan the first suggestions",
    body: "The first results usually show the highest-confidence autocomplete variants for your seed topic.",
  },
  {
    title: "Expand for long-tail keywords",
    body: "Use expanded variants to find more specific phrases, questions, comparisons, and niche topics that many creators miss.",
  },
  {
    title: "Group keywords into video ideas",
    body: 'Use questions for tutorials, comparisons for review videos, "best" searches for list videos, and long-tail phrases for focused uploads.',
  },
];

const SEO_TIPS = [
  'Start with the topic, then narrow the angle. A broad seed like "camera review" can become "best camera for beginner YouTubers" or "iPhone vs mirrorless for travel videos."',
  "Use long-tail keywords for focused videos. Long-tail searches are usually more specific and easier to match with a clear video promise.",
  'Look for question keywords. Searches that begin with "how," "what," "why," or "should" often make strong tutorial and explainer videos.',
  'Use comparison keywords for buying intent. Queries like "X vs Y," "best X for Y," and "X alternatives" often attract viewers who are actively deciding.',
  "Do not chase keywords that do not match the video. A keyword can bring the wrong audience if the video does not satisfy the search intent.",
  "Use keywords naturally in titles and descriptions. Put the main phrase where it helps clarity. Avoid repeating the same keyword unnaturally.",
  "Build topic clusters. Turn one seed into a group of 5-10 related videos so your channel becomes easier to understand around a niche.",
];

const USE_CASES = [
  {
    title: "Plan video topics",
    body: "Use keyword suggestions to choose topics people already search for instead of guessing from scratch.",
  },
  {
    title: "Write stronger titles",
    body: "Turn a keyword into a title that matches viewer intent and clearly promises value.",
  },
  {
    title: "Create tag lists",
    body: "Use close keyword variants as a starting point for relevant YouTube tags.",
  },
  {
    title: "Build descriptions",
    body: "Use related terms naturally in the description to add context for viewers and YouTube.",
  },
  {
    title: "Find series ideas",
    body: "Group related keywords into a sequence of videos around one topic cluster.",
  },
  {
    title: "Research new regions",
    body: "Run the same seed in different regions to see whether viewers phrase the topic differently.",
  },
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-title-generator",
    name: "YouTube Title Generator",
    body: "Turn a keyword into click-worthy title ideas.",
  },
  {
    href: "/tools/youtube-title-score-checker",
    name: "Title Analyzer",
    body: "Check whether your final title is clear, specific, and clickable.",
  },
  {
    href: "/tools/youtube-tag-generator",
    name: "YouTube Tag Generator",
    body: "Generate relevant tags from your topic or keyword.",
  },
  {
    href: "/tools/youtube-description-generator",
    name: "Description Generator",
    body: "Write a structured description around the chosen topic.",
  },
  {
    href: "/tools/youtube-video-idea-generator",
    name: "Video Idea Generator",
    body: "Turn keyword clusters into new video concepts.",
  },
  {
    href: "/tools/youtube-niche-check",
    name: "Niche Check",
    body: "Validate whether a topic has enough room to build a channel around.",
  },
];

const FAQS = [
  {
    q: "What is a YouTube keyword tool?",
    a: "A YouTube keyword tool helps you find search terms people use on YouTube. It turns a seed topic into keyword ideas, autocomplete suggestions, long-tail phrases, questions, comparisons, and video angles.",
  },
  {
    q: "Is this YouTube Keyword Tool free?",
    a: "Yes. The tool is free to use with no signup required. It is built for quick YouTube keyword research before filming, writing titles, or planning a content cluster.",
  },
  {
    q: "Where do the keyword suggestions come from?",
    a: "The suggestions are based on YouTube autocomplete-style keyword ideas. These are useful because they reflect how viewers phrase searches on YouTube.",
  },
  {
    q: "What is YouTube keyword research?",
    a: "YouTube keyword research is the process of finding topics and search phrases that viewers already use on YouTube. Creators use it to plan videos, write titles, create descriptions, choose tags, and understand search intent.",
  },
  {
    q: "How do I find keywords for YouTube videos?",
    a: "Start with a seed topic, generate suggestions, then look for phrases that match your video idea and audience. Prioritize keywords that clearly describe the topic, viewer problem, format, or comparison.",
  },
  {
    q: "What are long-tail YouTube keywords?",
    a: 'Long-tail keywords are more specific phrases, usually several words long. They often describe a clearer intent, such as "best camera for beginner YouTubers" instead of just "camera."',
  },
  {
    q: "Why doesn't this show search volume?",
    a: "This tool focuses on YouTube-native keyword discovery rather than estimated search volume. Paid SEO platforms may estimate volume, but autocomplete-style suggestions are useful for finding real phrasing and content angles.",
  },
  {
    q: "Does audience region matter?",
    a: "Yes. YouTube suggestions can vary by country and language. If your audience is mostly in the US, UK, India, Brazil, Germany, or another market, choose that region for more relevant ideas.",
  },
  {
    q: "Can I use these keywords as YouTube tags?",
    a: "Yes, but use them selectively. Pick the most relevant variants for your actual video. Do not paste every keyword into tags if the terms do not match the content.",
  },
  {
    q: "Can I use this as a YouTube keyword generator?",
    a: "Yes. It works as a YouTube keyword generator by expanding one seed topic into related keyword ideas, questions, comparisons, and long-tail phrases.",
  },
  {
    q: "Is this a YouTube keyword rank checker?",
    a: "No. This tool helps you find keyword ideas. It does not track where your video ranks for a keyword. For ranking checks, you need a rank tracking workflow or a dedicated rank checker.",
  },
  {
    q: "How should I use keywords in a YouTube title?",
    a: "Use the main keyword naturally if it helps viewers understand the video. The title should still sound human, specific, and clickable. Do not stuff multiple keyword variations into one title.",
  },
];

export default function YouTubeKeywordToolPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool} subtitleOverride={HERO_SUBTITLE}>
        <KeywordToolTool />
      </ToolLayout>

      {/* What you'll get */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              What you&apos;ll get
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              The YouTube Keyword Tool helps you turn one seed topic into
              search-driven video ideas you can use for titles, tags,
              descriptions, and content planning.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_YOU_GET.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl text-center">
            How to use the YouTube Keyword Tool
          </h2>

          <ol className="mt-12 space-y-6">
            {HOW_TO_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* YouTube keyword research tips */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            YouTube keyword research tips
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Good YouTube keyword research is not about stuffing phrases into
            metadata. It is about understanding what viewers already want and
            turning that demand into better topics, titles, and video
            packages.
          </p>

          <ul className="mt-8 space-y-3">
            {SEO_TIPS.map((tip) => (
              <li
                key={tip}
                className="flex gap-3 rounded-lg bg-gray-50/60 p-4 text-sm text-gray-700 leading-relaxed ring-1 ring-gray-100"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            About the YouTube Keyword Tool
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The YouTube Keyword Tool helps creators find search-driven topic
            ideas from a seed keyword. Use it as a free YouTube keyword
            research tool, YouTube keyword generator, or YouTube keyword
            suggestion tool when planning videos before filming.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The tool is designed for early-stage research. It helps you see
            how people phrase topics on YouTube, which questions they ask, and
            which comparison or long-tail searches could become focused
            videos.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            It does not replace paid keyword research tools with search
            volume, CPC, or rank tracking. Instead, it gives fast
            YouTube-native keyword ideas you can use for content planning,
            titles, tags, descriptions, and topic clusters.
          </p>
        </div>
      </section>

      {/* How creators use it */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              How creators use YouTube keyword research
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((u) => (
              <div
                key={u.title}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <h3 className="text-base font-semibold text-gray-900">
                  {u.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {u.body}
                </p>
              </div>
            ))}
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
              Turn keywords into a stronger upload
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              After finding keyword ideas, use these tools to build the rest
              of the YouTube SEO package.
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
                  Open tool
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
            Ready to find YouTube keywords?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Enter a seed topic and generate free YouTube keyword ideas in
            seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Find keywords
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
