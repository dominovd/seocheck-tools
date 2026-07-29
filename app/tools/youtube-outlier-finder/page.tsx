import Link from "next/link";
import {
  TrendingUp,
  Megaphone,
  Layers,
  Clock,
  GitBranch,
  Eye,
  Check,
  ArrowRight,
} from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { OutlierFinderTool } from "@/components/tools/OutlierFinderTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-outlier-finder")!;

const PAGE_TITLE = "Free YouTube Outlier Finder";
const META_DESCRIPTION =
  "Free YouTube outlier finder. Analyze a channel's last 100 uploads to find breakout videos, view spikes, and patterns behind videos that beat the channel baseline.";
const OG_DESCRIPTION =
  "Find the videos that beat a channel's normal performance and turn those breakout patterns into smarter topic, title, and format ideas.";

const base = buildMetadata({
  title: "Free YouTube Outlier Finder | Find Breakout Videos",
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
  "Analyze the last 100 uploads from any YouTube channel and find the videos that beat its normal view baseline. See which breakouts earned 3x, 10x, or more than usual, then use the pattern to plan smarter topics, titles, and formats.";

const ABOVE_FOLD_BULLETS = [
  "Surface videos that escaped the channel's normal performance.",
  "See breakout multipliers against the channel's own median, not a generic benchmark.",
  "Find repeatable exceptions you can turn into the next series, follow-up, or angle.",
];

const WHAT_IT_SHOWS = [
  "A median view baseline for the channel's recent performance.",
  "Videos that exceeded that baseline by 3x or more.",
  "Mega-outliers that cleared a much higher multiplier.",
  "View counts, publish dates, and performance multipliers.",
  "AI notes comparing breakout videos against average-performing uploads from the same channel.",
];

const WHEN_TO_USE = [
  "Before planning your next batch of videos, to find topics your audience has already rewarded.",
  "Before copying a competitor's idea, to check whether it was truly unusual for their channel.",
  "When a channel feels stuck, to separate average uploads from formats that already broke through.",
  "When researching a niche, to find small or mid-sized channels with breakout examples.",
  "After a video spikes, to compare it against older uploads and decide whether the angle is repeatable.",
];

type Signal = { Icon: typeof TrendingUp; title: string; body: string };

const HOW_TO_READ: Signal[] = [
  {
    Icon: TrendingUp,
    title: "Topic expansion",
    body: "The video reached a broader audience than the channel usually serves.",
  },
  {
    Icon: Megaphone,
    title: "Stronger promise",
    body: "The title made the payoff more concrete, urgent, or surprising.",
  },
  {
    Icon: Layers,
    title: "Format shift",
    body: "The video used a list, experiment, teardown, comparison, challenge, or story structure that changed viewer expectations.",
  },
  {
    Icon: Clock,
    title: "Timing advantage",
    body: "The upload landed during a trend, product launch, news cycle, or seasonal search spike.",
  },
  {
    Icon: GitBranch,
    title: "Audience bridge",
    body: "The video connected the channel's core topic to a larger adjacent interest.",
  },
  {
    Icon: Eye,
    title: "Packaging contrast",
    body: "The title and thumbnail made the idea easier to understand at a glance.",
  },
];

const HOW_IT_WORKS_STEPS = [
  "The channel input is resolved to a YouTube channel ID and uploads playlist.",
  "The latest 100 uploads are fetched from the channel's public upload history.",
  "The tool calculates the median view count across those uploads.",
  "Each video gets a multiplier: video views divided by the channel median.",
  "Videos at 3x or higher are marked as outliers. Stronger breakouts receive higher multipliers.",
  "The AI summary compares top outliers with normal-performing uploads from the same channel and looks for differences in topic, framing, title structure, and format.",
];

// HowTo schema — turns the "What to do after you find outliers" actionable
// workflow into a SERP rich-result candidate.
const HOW_TO_STEPS = [
  {
    name: "Write down the audience promise in plain English",
    text: "Describe in one sentence what the breakout video promised the viewer. Promise clarity is usually the most repeatable lesson.",
  },
  {
    name: "Identify whether the spike came from topic, format, timing, or packaging",
    text: "Classify the cause so you know what kind of follow-up to plan, not just what video to copy.",
  },
  {
    name: "Check whether the channel repeated the idea and whether the follow-up also worked",
    text: "A one-off spike is a guess. A repeated success is a lane the audience is asking for more of.",
  },
  {
    name: "Build 3 adjacent video ideas that keep the same promise but avoid direct copying",
    text: "Reuse the lesson, not the title. Adjacent ideas keep the audience expectation while giving you original room.",
  },
  {
    name: "Run the strongest idea through the Keyword Tool, Title Analyzer, and Thumbnail Preview before publishing",
    text: "Validate demand and packaging before production time. The point is to ship with proof, not just enthusiasm.",
  },
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-keyword-tool",
    name: "Keyword Tool",
    body: "Check search demand around the breakout topic.",
  },
  {
    href: "/tools/youtube-title-score-checker",
    name: "Title Analyzer",
    body: "Test whether the title promise is clear and clickable.",
  },
  {
    href: "/tools/youtube-thumbnail-preview",
    name: "Thumbnail Preview",
    body: "See how the idea reads in YouTube surfaces.",
  },
  {
    href: "/tools/youtube-competitor-analyzer",
    name: "Competitor Channel Analyzer",
    body: "Compare broader recurring patterns across another channel.",
  },
  {
    href: "/tools/youtube-tag-extractor",
    name: "Tag Extractor",
    body: "Inspect metadata on a specific breakout video.",
  },
  {
    href: "/tools/research",
    name: "All Research tools",
    body: "Browse the pre-production toolkit end to end.",
  },
];

const FAQS = [
  {
    q: "What is a YouTube outlier video?",
    a: "A YouTube outlier is a video that performs far above a channel's usual view baseline. In this tool, a video is flagged when it gets at least 3x the channel's median view count across recent uploads.",
  },
  {
    q: "Is this YouTube Outlier Finder free?",
    a: "Yes. The tool is free to use with a daily fair-use limit of 5 analyses per IP. There is no signup, no trial, and no paid account required.",
  },
  {
    q: "Why compare videos to the channel median?",
    a: "Channel-relative comparison is more useful than raw view count. A 30,000-view video may be ordinary for one channel and a major breakout for another. The median gives a stable baseline because it is not distorted by one unusually large video.",
  },
  {
    q: "Why analyze the latest 100 uploads?",
    a: "The latest 100 uploads usually reflect the channel's current audience, style, and publishing strategy. All-time data can be polluted by old viral hits, inactive formats, deleted trends, or videos from a different stage of the channel.",
  },
  {
    q: "Can I use it for competitor research?",
    a: "Yes. Paste any public YouTube channel to find which recent videos overperformed that channel's baseline. It is useful for competitor research because it shows what broke through, not just what has the most views overall.",
  },
  {
    q: "What should I do after finding an outlier?",
    a: "Look for the reason behind the spike: topic, title promise, format, timing, audience bridge, or thumbnail/title packaging. Then create adjacent ideas that reuse the lesson without copying the original video.",
  },
  {
    q: "What if my channel has no outliers?",
    a: "That can still be useful. It may mean your recent uploads are consistent, or it may mean the channel has not yet tested enough variation in topics, formats, and packaging. Try comparing your channel with nearby competitors to find possible experiment lanes.",
  },
  {
    q: "How is this different from the Competitor Channel Analyzer?",
    a: "Competitor Analyzer studies a channel's top videos by views and summarizes broad recurring patterns. Outlier Finder focuses on recent uploads and asks which videos performed unusually well compared with that same channel's normal baseline.",
  },
  {
    q: "Does this use private YouTube analytics?",
    a: "No. The tool only uses public YouTube data: channel, upload, title, publish date, and view-count information available through YouTube's public Data API. It cannot see private CTR, retention, revenue, or traffic-source data.",
  },
  {
    q: "Why is the daily limit 5?",
    a: "Each lookup uses YouTube API quota and may also run an AI comparison step. The daily limit keeps the free tool available without requiring accounts or subscriptions.",
  },
];

export default function YouTubeOutlierFinderPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <OutlierFinderTool />
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
            No signup. No credit card. Outliers are measured against the
            channel&apos;s own median, not a generic benchmark.
          </p>
        </div>
      </section>

      {/* About — Find the videos that escaped the baseline */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Find the videos that escaped the baseline
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Most YouTube analytics pages show totals: total views, total
            subscribers, average views, and recent uploads. Those numbers
            are useful, but they flatten the most interesting signal.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The videos that matter most are often the exceptions.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Outlier Finder looks for uploads that performed far above a
            channel&apos;s normal baseline. It does not ask &ldquo;what is
            the biggest video on this channel?&rdquo; It asks a more useful
            creator question: which recent videos beat this channel&apos;s
            usual performance by 3x, 10x, or more, and what changed when
            they did?
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            That makes the tool useful for your own channel and for
            competitor research. On your own channel, outliers show where
            the audience already gave you permission to go deeper. On a{" "}
            <Link
              href="/tools/youtube-competitor-analyzer"
              className="text-brand-700 hover:underline"
            >
              competitor&apos;s channel
            </Link>
            , outliers reveal which topics, formats, and packaging choices
            broke through even when the rest of the channel stayed
            average.
          </p>
        </div>
      </section>

      {/* What the Outlier Finder shows */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What the Outlier Finder shows
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            For each channel, the tool analyzes recent uploads and gives
            you:
          </p>

          <ol className="mt-8 space-y-4">
            {WHAT_IT_SHOWS.map((item, i) => (
              <li key={item} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {item}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            The key is the comparison set. A video with 50,000 views may
            be normal for a large channel and extraordinary for a small
            one. Outlier Finder judges each video against the channel it
            came from, so the result is more useful than a generic
            viral-video list.
          </p>
        </div>
      </section>

      {/* When to use it */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            When to use it
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Use Outlier Finder when you need evidence for what to make
            next:
          </p>

          <ul className="mt-8 space-y-3">
            {WHEN_TO_USE.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-lg bg-white p-4 text-sm text-gray-700 leading-relaxed ring-1 ring-gray-100"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>
                  {item.includes("researching a niche") ? (
                    <>
                      When{" "}
                      <Link
                        href="/tools/youtube-niche-check"
                        className="text-brand-700 hover:underline"
                      >
                        researching a niche
                      </Link>
                      , to find small or mid-sized channels with breakout
                      examples.
                    </>
                  ) : (
                    item
                  )}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            This is not a replacement for YouTube Studio. Studio is best
            for private retention, CTR, and traffic-source data. Outlier
            Finder is for public channel research: quick, free, and useful
            even when you do not own the channel.
          </p>
        </div>
      </section>

      {/* How to read an outlier */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How to read an outlier
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Do not treat every outlier as a format to copy. First, classify
            why it broke the baseline.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Look for:
          </p>

          <ul className="mt-8 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
            {HOW_TO_READ.map(({ Icon, title, body }) => (
              <li key={title} className="flex gap-4 p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {title}
                  </p>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            The best outliers are not random spikes. They show a
            repeatable audience response: a topic lane, format, or promise
            that can become the next series, follow-up, or channel
            direction.
          </p>
        </div>
      </section>

      {/* How the analysis works */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How the analysis works
          </h2>

          <ol className="mt-8 space-y-4">
            {HOW_IT_WORKS_STEPS.map((item, i) => (
              <li key={item} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {item}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-sm text-gray-600 leading-relaxed">
            Median is used instead of average because one huge video can
            distort the average. The median gives a cleaner view of what
            &ldquo;normal&rdquo; performance looks like for that channel.
          </p>

          <p className="mt-6 text-xs text-gray-500 leading-relaxed">
            Each non-cached analysis uses a small amount of YouTube API
            quota because it reads uploads from an existing channel
            playlist instead of running broad search queries. Results are
            cached for 24 hours.
          </p>
        </div>
      </section>

      {/* What to do after you find outliers — HowTo workflow */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What to do after you find outliers
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Turn each breakout into a practical next step:
          </p>

          <ol className="mt-8 space-y-4">
            {HOW_TO_STEPS.map((step, i) => (
              <li
                key={step.name}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {step.name}
                  </p>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-sm text-gray-800 leading-relaxed">
            The goal is not to clone the outlier. The goal is to understand
            why viewers treated it differently from the channel&apos;s
            normal uploads.
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
              Next tools for turning outliers into uploads
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Once you find a breakout pattern, use these tools to
              validate the topic, sharpen the title, and check the
              packaging before you publish.
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
            Ready to find a channel&apos;s breakout videos?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Paste a channel handle and get a free YouTube outlier report in
            seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Find breakout videos
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
