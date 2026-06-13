import Link from "next/link";
import {
  Check,
  ArrowRight,
  Users,
  Target,
  Sparkles,
  Film,
} from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { VideoIdeaGeneratorTool } from "@/components/tools/VideoIdeaGeneratorTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-video-idea-generator")!;

const PAGE_TITLE = "Free YouTube Video Idea Generator";
const META_DESCRIPTION =
  "Free AI YouTube video idea generator. Enter a niche or channel topic to get 10 filmable video ideas with angles, formats, and premises. No signup.";
const OG_DESCRIPTION =
  "Generate YouTube video ideas from any niche, complete with a clear premise and angle you can turn into a real upload.";

const base = buildMetadata({
  title: "Free YouTube Video Idea Generator | AI Topic Ideas",
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
  "Enter your niche, audience, or channel topic and get 10 YouTube video ideas you can actually film, each with a clear angle, format direction, and premise for the viewer payoff.";

const ABOVE_FOLD_BULLETS = [
  "10 filmable video concepts from one niche input.",
  "Each idea ships with a premise, angle, and format direction.",
  "Built for content planning, not random topic spam.",
];

const IDEA_PARTS = [
  {
    Icon: Users,
    name: "Audience",
    body: "Who the video is actually for. Skill level, situation, the specific problem they bring to YouTube.",
  },
  {
    Icon: Target,
    name: "Problem or desire",
    body: "What the viewer wants solved, explained, compared, tested, or entertained by the end of the video.",
  },
  {
    Icon: Sparkles,
    name: "Angle",
    body: "The specific twist that makes this version different from the 50 other videos already on the topic.",
  },
  {
    Icon: Film,
    name: "Format",
    body: "The structure that makes the idea easy to film for you and easy to understand for the viewer.",
  },
];

const INPUT_TIPS = [
  "the audience",
  "the skill level",
  "the constraint",
  "the outcome",
  "the channel style",
  "the format you can realistically produce",
];

const BUCKETS = [
  {
    label: "FILM NOW",
    title: "Film now",
    body: "Ideas you can produce with your current time, skill, and resources.",
    swatch: "emerald",
  },
  {
    label: "VALIDATE FIRST",
    title: "Validate first",
    body: "Ideas that need keyword or competitor research before you commit.",
    swatch: "brand",
  },
  {
    label: "SERIES POTENTIAL",
    title: "Series potential",
    body: "Ideas that could become 3 to 5 related uploads under one recurring format.",
    swatch: "violet",
  },
  {
    label: "LATER",
    title: "Later",
    body: "Good ideas that require more budget, experience, or better timing.",
    swatch: "amber",
  },
  {
    label: "REJECT",
    title: "Reject",
    body: "Ideas that sound clickable but do not fit your audience or channel.",
    swatch: "slate",
  },
];

const SWATCH_CLASSES: Record<
  string,
  { ring: string; bg: string; label: string }
> = {
  emerald: {
    ring: "border-emerald-100",
    bg: "bg-emerald-50/30",
    label: "text-emerald-700",
  },
  brand: {
    ring: "border-brand-100",
    bg: "bg-brand-50/30",
    label: "text-brand-700",
  },
  violet: {
    ring: "border-violet-100",
    bg: "bg-violet-50/30",
    label: "text-violet-700",
  },
  amber: {
    ring: "border-amber-100",
    bg: "bg-amber-50/30",
    label: "text-amber-700",
  },
  slate: {
    ring: "border-slate-200",
    bg: "bg-slate-50/40",
    label: "text-slate-600",
  },
  red: {
    ring: "border-red-100",
    bg: "bg-red-50/30",
    label: "text-red-700",
  },
};

const VALIDATION_STEPS: { step: string; tool?: { name: string; href: string } }[] = [
  {
    step: "See whether people search related phrases on YouTube.",
    tool: { name: "Keyword Tool", href: "/tools/youtube-keyword-tool" },
  },
  {
    step: "Check if the topic area has room for a new entrant.",
    tool: { name: "Niche Check", href: "/tools/youtube-niche-check" },
  },
  {
    step: "See whether similar channels have breakout videos around the angle.",
    tool: { name: "Outlier Finder", href: "/tools/youtube-outlier-finder" },
  },
  {
    step: "Turn the chosen idea into clickable title options.",
    tool: { name: "Title Generator", href: "/tools/youtube-title-generator" },
  },
  {
    step: "Check whether the idea reads in YouTube search, home, and mobile.",
    tool: { name: "Thumbnail Preview", href: "/tools/youtube-thumbnail-preview" },
  },
];

const USE_CASES = [
  {
    name: "Monthly content calendar",
    body: "Generate several batches, pick the strongest ideas, then group them into themes for the month.",
  },
  {
    name: "Channel pivot testing",
    body: "Enter the niche you are considering. If the tool cannot produce ideas you would be excited to make, the pivot may be too vague or not a good fit.",
  },
  {
    name: "Series planning",
    body: "Describe the recurring format and audience. Use the output as episode ideas instead of one-off topics.",
  },
  {
    name: "Format experimentation",
    body: "Switch between tutorial, experiment, comparison, review, and deep dive to see how the same niche changes under different structures.",
  },
  {
    name: "Creator block",
    body: "When every idea feels stale, generate a batch and look for one angle that makes you want to start outlining.",
  },
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-keyword-tool",
    name: "Keyword Tool",
    body: "Validate search demand and related phrases.",
  },
  {
    href: "/tools/youtube-niche-check",
    name: "Niche Check",
    body: "Test whether a new topic area has room.",
  },
  {
    href: "/tools/youtube-outlier-finder",
    name: "Outlier Finder",
    body: "Find breakout examples from similar channels.",
  },
  {
    href: "/tools/youtube-title-generator",
    name: "Title Generator",
    body: "Turn the idea into clickable title options.",
  },
  {
    href: "/tools/youtube-thumbnail-preview",
    name: "Thumbnail Preview",
    body: "Check whether the idea reads in YouTube surfaces.",
  },
  {
    href: "/tools/youtube-description-generator",
    name: "Description Generator",
    body: "Prepare the publish metadata for the chosen idea.",
  },
];

const FAQS = [
  {
    q: "Is this YouTube Video Idea Generator free?",
    a: "Yes. The tool is free to use with a daily fair-use limit. There is no signup, no subscription, and no credit card required.",
  },
  {
    q: "How do I get better YouTube video ideas?",
    a: 'Give the tool a specific audience, problem, niche, and constraint. "Cooking" will produce broad ideas. "Cheap high-protein meals for college students with no oven" will produce ideas that are much easier to film.',
  },
  {
    q: "Does the tool generate titles or full video ideas?",
    a: "It generates video ideas with a working direction and premise. Some ideas may include title-style phrasing, but the main goal is to help you decide what the video is about. Use the Title Generator after you choose an idea.",
  },
  {
    q: "Can I use it for a YouTube series?",
    a: 'Yes. Describe the series concept, audience, and repeatable format. For example: "weekly teardown series of failed startup landing pages for solo founders." The output will be closer to episode ideas than random one-off topics.',
  },
  {
    q: "Are these ideas unique?",
    a: "Ideas are starting points, not protected inventions. Some angles may resemble videos that already exist because they are based on common YouTube formats. Your execution, examples, experience, and audience positioning make the idea yours.",
  },
  {
    q: "How many batches should I generate?",
    a: "Generate 2 or 3 batches, then filter hard. One batch gives you options. Multiple batches reveal patterns, stronger angles, and ideas that feel more natural for your channel.",
  },
  {
    q: "Should I use search volume before choosing an idea?",
    a: "For educational, review, tutorial, and evergreen topics, yes. Use the Keyword Tool to check search demand. For personality-led, trend, commentary, or experiment videos, competitor examples and audience fit may matter more than keyword volume.",
  },
  {
    q: "What format should I choose?",
    a: "Use mixed formats when exploring. Choose tutorial for step-by-step education, deep dive for explanation, comparison for decision-stage viewers, review for products or tools, experiment for personality-led channels, and listicle for broad evergreen utility.",
  },
  {
    q: "Can I use generated ideas commercially?",
    a: "Yes. You can turn generated ideas into videos for your channel. The tool does not claim ownership over what it generates.",
  },
  {
    q: "What should I do after picking an idea?",
    a: "Validate the topic, write several title options, check the thumbnail concept, and build a simple outline. A good workflow is: Idea Generator, Keyword Tool, Title Generator, Thumbnail Preview, then Video Audit after publishing.",
  },
];

export default function YouTubeVideoIdeaGeneratorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <VideoIdeaGeneratorTool />
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
            Free: 15 generations per IP per day. No signup required.
          </p>
        </div>
      </section>

      {/* Go from vague niche to filmable video concepts */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Go from vague niche to filmable video concepts
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Most YouTube idea lists are too broad to use. &quot;Make a
            tutorial&quot;, &quot;try a challenge&quot;, or &quot;review a
            product&quot; is not a video plan. A useful idea needs a
            specific viewer, a clear promise, a format, and a reason
            someone would click now.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The YouTube Video Idea Generator turns your niche or channel
            topic into 10 concrete video concepts. Each idea includes a
            working direction and a short premise, so you can see what the
            video would actually contain before you spend time scripting,
            filming, or editing.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use it when you know the area you want to create in, but need
            sharper angles for your next upload, content calendar, series,
            or niche test.
          </p>
        </div>
      </section>

      {/* What makes a good YouTube idea? */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What makes a good YouTube idea?
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            A strong YouTube idea usually has four parts:
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {IDEA_PARTS.map(({ Icon, name, body }) => (
              <div
                key={name}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <p className="text-base font-semibold text-gray-900">
                    {name}
                  </p>
                </div>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            For example, &quot;meal prep ideas&quot; is broad. &quot;I
            built a $30 college meal plan using only one pan&quot; is
            filmable. It has an audience, constraint, promise, and format.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            That is the difference this tool is designed to create.
          </p>
        </div>
      </section>

      {/* How to get better ideas from the tool */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How to get better ideas from the tool
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The quality of the input controls the quality of the output.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
                Weak input
              </p>
              <p className="mt-3 font-mono text-sm text-gray-800">
                fitness
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Stronger input
              </p>
              <p className="mt-3 font-mono text-sm leading-relaxed text-gray-800">
                home workouts for busy parents who have 20 minutes, no
                equipment, and want beginner-friendly routines
              </p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
                Weak input
              </p>
              <p className="mt-3 font-mono text-sm text-gray-800">
                AI tools
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Stronger input
              </p>
              <p className="mt-3 font-mono text-sm leading-relaxed text-gray-800">
                AI tools for freelance designers who want to save time on
                client research, moodboards, and first-draft concepts
              </p>
            </div>
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            Add:
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {INPUT_TIPS.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <Check
                  className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-base text-gray-700 leading-relaxed">
            Specific inputs create ideas that sound like real uploads
            instead of generic prompts.
          </p>
        </div>
      </section>

      {/* Use ideas as a content planning system */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Use ideas as a content planning system
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Do not stop at the first batch. Generate 2 or 3 batches, then
            sort the ideas into buckets:
          </p>

          <div className="mt-8 space-y-3">
            {BUCKETS.map((b) => {
              const c = SWATCH_CLASSES[b.swatch];
              return (
                <div
                  key={b.title}
                  className={`rounded-2xl border ${c.ring} ${c.bg} p-5`}
                >
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-wider ${c.label}`}
                  >
                    {b.label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900">
                    {b.title}
                  </p>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    {b.body}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-sm text-gray-800 leading-relaxed">
            The best creators do not publish every idea. They build a
            stronger filter.
          </p>
        </div>
      </section>

      {/* Validate the idea before you film */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Validate the idea before you film
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            AI can generate angles, but it cannot guarantee demand. Before
            you commit to a video, run the idea through a quick validation
            pass:
          </p>

          <ol className="mt-8 space-y-4">
            {VALIDATION_STEPS.map(({ step, tool: t }, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {step}
                  {t && (
                    <>
                      {" "}
                      <Link
                        href={t.href}
                        className="font-medium text-brand-700 hover:underline"
                      >
                        {t.name}
                      </Link>
                      {"."}
                    </>
                  )}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            This keeps the tool in the right role: idea generation first,
            validation second, production third.
          </p>
        </div>
      </section>

      {/* Best use cases */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Best use cases
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {USE_CASES.map((u) => (
              <div
                key={u.name}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <p className="text-base font-semibold text-gray-900">
                  {u.name}
                </p>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  {u.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How the AI works */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How the AI works
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The tool sends your niche, audience, and selected format to an
            AI prompt designed for YouTube ideation. The output is not
            just titles. It asks for ideas with a premise: what the video
            contains, why the viewer would care, and what angle makes it
            distinct.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The model is intentionally more creative here than in tools
            like{" "}
            <Link
              href="/tools/youtube-title-generator"
              className="text-brand-700 hover:underline"
            >
              Title Generator
            </Link>{" "}
            or{" "}
            <Link
              href="/tools/youtube-tag-generator"
              className="text-brand-700 hover:underline"
            >
              Tag Generator
            </Link>
            . Ideation benefits from variety. Generate multiple batches
            and choose the ideas that fit your channel, not just the ideas
            that sound clever.
          </p>
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
              Turn an idea into a ready-to-publish video
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              After you choose a video concept, validate demand, package
              the title, and prepare the metadata before you film or
              publish.
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
            Ready to plan your next 10 videos?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Enter a niche and get 10 filmable concepts with angles and
            premises in seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Generate 10 ideas
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
