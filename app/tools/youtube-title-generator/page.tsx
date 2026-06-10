import Link from "next/link";
import {
  ListChecks,
  Layers,
  Search,
  MousePointerClick,
  Smartphone,
  Copy,
  ArrowRight,
} from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { TitleGeneratorTool } from "@/components/tools/TitleGeneratorTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";

const tool = getToolBySlug("youtube-title-generator")!;

export const metadata = buildMetadata({
  title: "YouTube Title Generator | Free AI Video Title Ideas",
  description:
    "Generate YouTube titles for free with AI. Get click-worthy video title ideas for long-form videos, Shorts, reviews, tutorials, lists, and comparisons.",
  path: `tools/${tool.slug}`,
  noBrand: true,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

const HERO_SUBTITLE =
  "Generate 10 click-worthy YouTube title ideas for any video topic. Pick a style, compare angles, and copy a title built for search, browse, and suggested videos.";

type Card = { Icon: typeof ListChecks; title: string; body: string };

const WHAT_YOU_GET: Card[] = [
  {
    Icon: ListChecks,
    title: "10 title ideas",
    body: "Generate a fresh batch of YouTube video titles from one topic or rough idea.",
  },
  {
    Icon: Layers,
    title: "Multiple angles",
    body: "Try curiosity, how-to, list, comparison, contrarian, story, or mixed title styles.",
  },
  {
    Icon: Search,
    title: "SEO-ready phrasing",
    body: "Work your main topic into the title naturally without keyword stuffing.",
  },
  {
    Icon: MousePointerClick,
    title: "Click-focused options",
    body: "Get titles that lead with value, tension, specificity, or a clear viewer outcome.",
  },
  {
    Icon: Smartphone,
    title: "Long-form and Shorts",
    body: "Use it for tutorials, reviews, reaction videos, comparisons, Shorts, and channel experiments.",
  },
  {
    Icon: Copy,
    title: "Copy-ready output",
    body: "Pick the strongest title and paste it into YouTube Studio or your content calendar.",
  },
];

const HOW_TO_STEPS = [
  {
    title: "Describe your video specifically",
    body: 'Do not write "tech review." Write "honest M5 MacBook Pro review after 30 days for video editors who already own an M2." The narrower the input, the sharper the title ideas.',
  },
  {
    title: "Choose a title style",
    body: "Use Mixed if you want variety. Pick curiosity, list, how-to, comparison, contrarian, or story if your channel has a consistent title style.",
  },
  {
    title: "Generate 10 title ideas",
    body: "The tool returns multiple YouTube title ideas so you can compare hooks, keyword placement, and viewer promise.",
  },
  {
    title: "Choose the honest title, not just the loudest one",
    body: "The best YouTube title makes a clear promise the video actually delivers. Clickbait can raise CTR once, but it hurts retention and trust.",
  },
  {
    title: "Check the title before publishing",
    body: "After choosing a title, run it through the YouTube Title Score Checker to test clarity, specificity, length, and click potential.",
  },
];

const SEO_TIPS = [
  "Put the main topic early. The first few words matter most in search results, browse feeds, and suggested videos.",
  'Use the viewer outcome. "How to edit faster in Premiere Pro" is stronger than "Premiere Pro tutorial" because it promises a result.',
  'Add specificity. Numbers, timeframes, audiences, and constraints make titles feel more concrete: "after 30 days," "for beginners," "under $500."',
  "Match the thumbnail. The title and thumbnail should create one clear idea together. Do not repeat the exact same words in both.",
  "Avoid empty curiosity. Curiosity works when the video delivers. Vague titles may get clicks but can hurt retention.",
  "Keep most titles readable. Many YouTube titles work best around 40-70 characters, but clarity matters more than hitting an exact length.",
  "Use keywords naturally. Include the search phrase if it fits, but do not stuff the title with repeated keywords.",
];

const TOPIC_TIPS = [
  {
    title: "Be specific",
    body: '"Fitness tips" will produce generic titles. "Beginner dumbbell workout for busy parents with 20 minutes at home" gives the tool a real angle.',
  },
  {
    title: "Include the format",
    body: "Mention whether the video is a review, tutorial, comparison, reaction, case study, list, or YouTube Short.",
  },
  {
    title: "Mention the viewer",
    body: "Add who the video is for: beginners, creators, students, small business owners, gamers, editors, parents, or solo founders.",
  },
  {
    title: "Include the tension",
    body: 'If the video has a conflict or opinion, say it: "why I stopped using Notion," "cheap camera vs iPhone," "mistakes beginners make."',
  },
  {
    title: "Do not list 10 keywords",
    body: "One clear topic works better than keyword stuffing. The title should sound natural to humans first.",
  },
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-title-score-checker",
    name: "YouTube Title Score Checker",
    body: "Check whether your title is clear, specific, and click-worthy.",
  },
  {
    href: "/tools/youtube-keyword-tool",
    name: "YouTube Keyword Tool",
    body: "Find search terms and related keywords before writing the final title.",
  },
  {
    href: "/tools/youtube-description-generator",
    name: "YouTube Description Generator",
    body: "Turn your topic and title into a structured video description.",
  },
  {
    href: "/tools/youtube-tag-generator",
    name: "YouTube Tag Generator",
    body: "Generate relevant YouTube tags from your topic or title.",
  },
  {
    href: "/tools/youtube-thumbnail-preview",
    name: "Thumbnail Preview",
    body: "Preview how your title and thumbnail work together in YouTube layouts.",
  },
  {
    href: "/tools/youtube-video-audit",
    name: "Video Audit",
    body: "Audit the full upload package after publishing or before updating metadata.",
  },
];

const FAQS = [
  {
    q: "Is this YouTube Title Generator free?",
    a: "Yes. The YouTube Title Generator is free to use with no signup required. Some AI usage may have fair-use limits to keep the tool available.",
  },
  {
    q: "What is an AI YouTube Title Generator?",
    a: "An AI YouTube Title Generator turns a video topic into title ideas using different angles, such as curiosity, how-to, list, comparison, contrarian, or story. It helps you brainstorm titles faster before uploading to YouTube.",
  },
  {
    q: "How do I make a good YouTube title?",
    a: "A good YouTube title is clear, specific, and interesting. It should tell viewers what the video is about, include the main topic naturally, and create a reason to click without misleading them.",
  },
  {
    q: "Can this generate YouTube Shorts titles?",
    a: "Yes. You can use it as a YouTube Shorts title generator. For better results, mention that the video is a Short and describe the hook, topic, or moment the Short is built around.",
  },
  {
    q: "What title style should I choose?",
    a: "Use Mixed if you want variety. Choose How-to for tutorials, List for numbered ideas, Comparison for versus videos, Curiosity for mystery-driven hooks, Contrarian for hot takes, and Story for personal or narrative videos.",
  },
  {
    q: "Should I always pick the most clickable title?",
    a: "No. Pick the most accurate clickable title. A title that overpromises may get clicks but can hurt retention, satisfaction, and long-term channel trust.",
  },
  {
    q: "How long should a YouTube title be?",
    a: "Many YouTube titles work well around 40-70 characters because they are easier to scan and less likely to feel bloated. But the best length depends on clarity. A shorter title that communicates the idea is better than a long title stuffed with keywords.",
  },
  {
    q: "Does a YouTube title help SEO?",
    a: "Yes. The title is one of the clearest signals YouTube and viewers use to understand the video. A good YouTube SEO title includes the topic naturally, matches search intent, and gives viewers a reason to click.",
  },
  {
    q: "Can I use the generated titles commercially?",
    a: "Yes. You can use generated title ideas for your own videos, client videos, commercial channels, and content planning. You should still edit the final title so it matches the video accurately.",
  },
  {
    q: "What is the difference between this and the YouTube Title Score Checker?",
    a: "The YouTube Title Generator creates title ideas from a topic. The YouTube Title Score Checker evaluates a title you already have. Use the generator to brainstorm, then use the checker to choose or refine the strongest option.",
  },
  {
    q: "Which AI model powers this?",
    a: "The tool uses an AI model to generate title ideas from your topic and selected style. The goal is to produce useful, copy-ready options while keeping the workflow fast and simple.",
  },
];

export default function YouTubeTitleGeneratorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool} subtitleOverride={HERO_SUBTITLE}>
        <TitleGeneratorTool />
      </ToolLayout>

      {/* What you'll get */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              What you&apos;ll get
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              The YouTube Title Generator gives you multiple title angles so you
              can choose the version that fits your video, audience, and
              thumbnail.
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
            How to use the YouTube Title Generator
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

      {/* YouTube SEO tips */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            YouTube title SEO tips
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            A good YouTube title helps viewers understand the video fast. It
            should be searchable, clickable, and honest enough to keep
            retention strong after the click.
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
            About the AI YouTube Title Generator
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The AI YouTube Title Generator helps creators turn a rough topic
            into stronger YouTube video title ideas. It is useful when you know
            what the video is about but need better angles for search, browse,
            suggested videos, or Shorts.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            You can use it as a YouTube title generator, AI YouTube title
            generator, YouTube video title generator, or free title idea tool
            before publishing. Enter your topic, choose a style, and generate a
            batch of titles you can compare before choosing one.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The tool is designed to create useful options, not fake hype.
            Strong titles are specific, clear, and interesting while still
            matching the actual video.
          </p>
        </div>
      </section>

      {/* How to write a topic that gets better titles */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How to write a topic that gets better titles
          </h2>

          <ul className="mt-8 space-y-5">
            {TOPIC_TIPS.map((t) => (
              <li key={t.title}>
                <h3 className="text-base font-semibold text-gray-900">
                  {t.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                  {t.body}
                </p>
              </li>
            ))}
          </ul>
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
              Improve the rest of your upload
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              After choosing a title, use these tools to finish the YouTube SEO
              package.
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
            Ready to generate YouTube titles?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Enter your video topic and get 10 free AI YouTube title ideas in
            seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Generate 10 titles
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
