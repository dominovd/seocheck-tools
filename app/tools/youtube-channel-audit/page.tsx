import Link from "next/link";
import {
  Award,
  BarChart3,
  AlertTriangle,
  Repeat,
  ListChecks,
  Wrench,
  Check,
  ArrowRight,
} from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { ChannelAuditTool } from "@/components/tools/ChannelAuditTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-channel-audit")!;

export const metadata = buildMetadata({
  title: "YouTube Channel Audit | Free Visibility Score & SEO Checker",
  description:
    "Run a free YouTube channel audit. Get a 0-100 Visibility Score across CTR potential, metadata quality, niche headroom, and growth trajectory, with severity-ranked recurring fixes across the last 30 uploads.",
  path: `tools/${tool.slug}`,
  noBrand: true,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

const HERO_SUBTITLE =
  "Paste any YouTube channel and get a free 0-100 channel SEO score across title strength, metadata quality, niche reach, and recent growth momentum, plus severity-ranked recurring fixes across the last 30 uploads.";

type Card = { Icon: typeof Award; title: string; body: string };

const WHAT_YOU_GET: Card[] = [
  {
    Icon: Award,
    title: "0-100 Visibility Score",
    body: "A quotable headline number for the channel composed of 4 weighted subscores. Shareable in your bio or pinned comment.",
  },
  {
    Icon: BarChart3,
    title: "4 dashboard subscores",
    body: "CTR Potential, Metadata Quality, Niche Headroom, and Growth Trajectory — each scored 0-100 with one-line evidence.",
  },
  {
    Icon: AlertTriangle,
    title: "Severity-ranked fixes",
    body: "Recurring issues across the last 30 uploads, tagged High, Medium, or Low priority with the actual count of videos affected.",
  },
  {
    Icon: Repeat,
    title: "Per-dimension breakdown",
    body: "How title, description, hashtags, and chapters hold up — averages plus a strong/good/fair/weak band breakdown.",
  },
  {
    Icon: ListChecks,
    title: "Upload-by-upload audit",
    body: "Each of the last 30 videos gets its own per-dimension scorecard so you can spot which uploads pull the channel down.",
  },
  {
    Icon: Wrench,
    title: "Channel snapshot",
    body: "Subscriber count, total videos, creation date, and primary niche auto-detected from YouTube topic categories.",
  },
];

const HOW_TO_STEPS = [
  {
    title: "Paste a channel handle or URL",
    body: "Use your own channel or a public competitor channel. The audit works with public uploads only.",
  },
  {
    title: "Review the overall grade",
    body: "Start with the channel-wide score to understand whether the recent upload package is strong, mixed, or weak.",
  },
  {
    title: "Find the weakest dimension",
    body: "Look for the lowest average across title, description, hashtags, and chapters. This is usually the first place to improve.",
  },
  {
    title: "Read the recurring issues",
    body: "The most valuable insight is not one bad video. It is the pattern that keeps showing up across uploads.",
  },
  {
    title: "Fix the next 3-5 uploads first",
    body: "Apply the audit to upcoming videos before rewriting your whole catalog. Fresh uploads are easier to improve and measure.",
  },
];

const DIMENSIONS = [
  {
    title: "Title quality",
    body: "Checks whether recent titles are clear, specific, searchable, and likely to earn clicks without overpromising.",
  },
  {
    title: "Description quality",
    body: "Checks whether descriptions give YouTube and viewers enough context, include useful keywords naturally, and support the video topic.",
  },
  {
    title: "Hashtags",
    body: "Checks whether videos use relevant hashtags without stuffing unrelated or overly broad tags.",
  },
  {
    title: "Chapters",
    body: "Checks whether videos use helpful timestamps when the format benefits from navigation and structured sections.",
  },
  {
    title: "Recurring issues",
    body: "Looks across multiple uploads to find repeated weak spots, such as vague titles, thin descriptions, missing chapters, or inconsistent metadata.",
  },
];

const CHECKLIST = [
  "Do recent titles make the topic and value clear?",
  "Are the most important keywords included naturally?",
  "Do descriptions explain the video in the first few lines?",
  "Do videos include useful links, context, and calls to action?",
  "Are hashtags relevant and not stuffed?",
  "Do long videos include chapters or timestamps?",
  "Are weak patterns repeated across several uploads?",
  "Do outlier videos reveal a topic, title, or format worth repeating?",
  "Are upcoming uploads using what the audit found?",
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-video-audit",
    name: "Video Audit",
    body: "Audit one specific video in detail.",
  },
  {
    href: "/tools/youtube-title-score-checker",
    name: "Title Score Checker",
    body: "Check whether weak titles are clear, specific, and clickable.",
  },
  {
    href: "/tools/youtube-description-generator",
    name: "Description Generator",
    body: "Create stronger descriptions for videos with thin metadata.",
  },
  {
    href: "/tools/youtube-outlier-finder",
    name: "Outlier Finder",
    body: "Find videos that performed far above the channel's normal baseline.",
  },
  {
    href: "/tools/youtube-competitor-analyzer",
    name: "Competitor Analyzer",
    body: "Compare patterns from other channels in your niche.",
  },
];

const FAQS = [
  {
    q: "What is a YouTube Channel Audit?",
    a: "A YouTube Channel Audit checks recent uploads and looks for recurring SEO and packaging issues across the channel. Instead of auditing one video, it shows patterns across titles, descriptions, hashtags, chapters, and overall upload quality.",
  },
  {
    q: "How do I audit my YouTube channel for free?",
    a: "Paste your channel handle, URL, or ID into the tool and run the audit. The tool checks recent public uploads and returns a channel grade, per-dimension scores, weak spots, and recurring issues.",
  },
  {
    q: "What does the channel grade mean?",
    a: "The channel grade summarizes how well recent uploads are packaged for discovery. A strong grade means the channel is consistent across titles, descriptions, hashtags, and chapters. A weak grade means the same issues likely appear across multiple uploads.",
  },
  {
    q: "What is the difference between Channel Audit and Video Audit?",
    a: "Video Audit checks one video. Channel Audit checks recent uploads and finds channel-wide patterns. Use Video Audit when you want to fix a specific upload. Use Channel Audit when you want to understand what keeps going wrong across the channel.",
  },
  {
    q: "Why audit only the last 30 uploads?",
    a: "The last 30 uploads usually show the channel's current workflow better than older videos. They are recent enough to reveal present habits and large enough to compute meaningful niche-headroom and growth-trajectory statistics without slowing the audit down.",
  },
  {
    q: "What does “worst dimension” mean?",
    a: "The worst dimension is the area with the lowest average score across recent uploads. It helps you choose the first improvement to make, such as better titles, stronger descriptions, cleaner hashtags, or more useful chapters.",
  },
  {
    q: "Will this work on a channel that is not mine?",
    a: "Yes. You can audit any public YouTube channel. This is useful for competitor research, client checks, or comparing your channel with creators in the same niche.",
  },
  {
    q: "Is this a YouTube SEO checker?",
    a: "Yes. Channel Audit works as a free YouTube SEO checker for recent uploads. It focuses on upload packaging signals like titles, descriptions, hashtags, chapters, and repeated metadata issues.",
  },
  {
    q: "Can a channel audit improve views?",
    a: "The audit cannot guarantee more views, but it can show problems that limit discovery and clicks. Fixing weak titles, thin descriptions, missing chapters, or repeated metadata issues can make future uploads more competitive.",
  },
  {
    q: "Why is the daily limit 5 audits?",
    a: "Channel audits use YouTube API requests and AI analysis. The daily limit keeps the tool free and available while preventing abuse.",
  },
  {
    q: "Does this replace YouTube Studio analytics?",
    a: "No. YouTube Studio is still the source for impressions, CTR, retention, traffic sources, and audience data. Channel Audit is a fast SEO and packaging review that helps you decide what to fix.",
  },
  {
    q: "Can I use this for client channels?",
    a: "Yes. You can use it for client research, prospect audits, or quick channel checks. For private data or deeper analytics, you still need access to the client's YouTube Studio.",
  },
  {
    q: "How is the audit calculated?",
    a: "The tool resolves your channel handle to a channel ID, pulls the last 30 public uploads, and runs each video through the same scoring engine used by Video Audit (title, description, hashtags, chapters). Those feed the Metadata Quality subscore. CTR Potential uses average title scores, Niche Headroom uses median views vs subscribers, and Growth Trajectory uses the outlier rate (videos that beat 1.5× the channel median). The overall 0-100 Visibility Score is a weighted blend of all four. Recurring fixes are ranked by severity from the actual band counts, then AI rewrites each into a creator-actionable sentence.",
  },
];

export default function YouTubeChannelAuditPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool} subtitleOverride={HERO_SUBTITLE}>
        <ChannelAuditTool />
      </ToolLayout>

      {/* What you'll get */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              What you&apos;ll get
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Channel Audit turns recent uploads into a channel-wide SEO
              report, so you can stop fixing one video at a time and find the
              pattern worth improving first.
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
            How to use the YouTube Channel Audit
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

      {/* About */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What the YouTube Channel Audit checks
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Video Audit answers &ldquo;is this one video well-packaged?&rdquo;
            Channel Audit answers a bigger question: &ldquo;what am I
            repeatedly weak at across my uploads?&rdquo; That second question
            is often more useful because fixing a recurring problem can
            improve every future upload.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Paste a channel and the tool checks recent public uploads across
            key YouTube SEO signals: title quality, description quality,
            hashtags, and chapters. It then summarizes the average scores, the
            weakest dimension, and the recurring issues most likely holding
            the channel back.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use it as a free YouTube SEO checker when you want a fast audit
            before planning new videos, updating metadata, or comparing your
            channel with competitors.
          </p>
        </div>
      </section>

      {/* What each dimension means */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What each audit dimension means
          </h2>

          <ul className="mt-8 space-y-5">
            {DIMENSIONS.map((d) => (
              <li key={d.title}>
                <h3 className="text-base font-semibold text-gray-900">
                  {d.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                  {d.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Channel audit checklist */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            YouTube channel audit checklist
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use this checklist when reviewing your channel manually or
            interpreting the audit results.
          </p>

          <ul className="mt-8 space-y-3 rounded-2xl border border-gray-200 bg-white p-5">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-800">
                <Check
                  className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span>{item}</span>
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
              Fix what the audit finds
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Use these tools to drill into the weak areas from your channel
              audit.
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
            Ready to audit your YouTube channel?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Paste your channel handle and get a free YouTube Channel Audit in
            seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Audit channel
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
