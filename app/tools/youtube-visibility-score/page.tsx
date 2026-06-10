import Link from "next/link";
import {
  Gauge,
  MousePointerClick,
  FileText,
  TrendingUp,
  Telescope,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { VisibilityScoreTool } from "@/components/tools/VisibilityScoreTool";
import { FaqSchema } from "@/components/PageSchemas";
import { ToolContentSections } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-visibility-score")!;

export const metadata = buildMetadata({
  title: "YouTube Visibility Score Checker | Free Channel SEO Score",
  description:
    "Check your YouTube channel Visibility Score for free. Score recent uploads across title strength, metadata quality, niche reach, and growth trajectory.",
  path: `tools/${tool.slug}`,
  noBrand: true,
});

const HERO_SUBTITLE =
  "Paste your channel to see how discoverable it is, what is holding it back, and which uploads are worth fixing first.";

type Card = {
  Icon: typeof Gauge;
  title: string;
  body: string;
};

const WHAT_YOU_GET: Card[] = [
  {
    Icon: Gauge,
    title: "0-100 channel score",
    body: "A fast benchmark for your channel's YouTube SEO and packaging health.",
  },
  {
    Icon: MousePointerClick,
    title: "CTR Potential",
    body: "Shows whether recent titles are likely to earn clicks from search, browse, and suggested videos.",
  },
  {
    Icon: FileText,
    title: "Metadata Quality",
    body: "Checks how well descriptions, hashtags, chapters, and upload metadata support discovery.",
  },
  {
    Icon: TrendingUp,
    title: "Growth Trajectory",
    body: "Finds whether recent videos are breaking above the channel's normal performance baseline.",
  },
  {
    Icon: Telescope,
    title: "Niche Headroom",
    body: "Estimates how far your videos reach beyond your existing subscriber base.",
  },
  {
    Icon: Sparkles,
    title: "AI summary",
    body: "Highlights the channel's biggest strength and the most important gap to fix next.",
  },
];

type ScoreBand = {
  range: string;
  label: string;
  ring: string;
  text: string;
  bg: string;
  desc: string;
};

const SCORE_BANDS: ScoreBand[] = [
  {
    range: "85-100",
    label: "Excellent",
    ring: "ring-emerald-200",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    desc: "Strong channel packaging, healthy growth signals, and few obvious SEO gaps.",
  },
  {
    range: "70-84",
    label: "Good",
    ring: "ring-brand-200",
    text: "text-brand-700",
    bg: "bg-brand-50",
    desc: "Solid overall, but one or two sub-scores are likely holding the channel back.",
  },
  {
    range: "55-69",
    label: "Mixed",
    ring: "ring-amber-200",
    text: "text-amber-700",
    bg: "bg-amber-50",
    desc: "The channel has some working signals, but titles, metadata, or growth consistency need attention.",
  },
  {
    range: "Below 55",
    label: "Needs work",
    ring: "ring-red-200",
    text: "text-red-700",
    bg: "bg-red-50",
    desc: "The channel likely has repeated upload-level issues that should be checked with Channel Audit or Video Audit.",
  },
];

const FAQS = [
  {
    q: "What is the YouTube Visibility Score?",
    a: "The YouTube Visibility Score is a free 0-100 channel score that estimates how discoverable and well-packaged a YouTube channel is. It looks at recent uploads and combines title strength, metadata quality, growth signals, and niche reach into one simple benchmark.",
  },
  {
    q: "How do I check my YouTube channel SEO score?",
    a: "Paste your YouTube channel handle, channel URL, or channel ID into the tool and run the score. The tool checks recent uploads and returns a channel-level score plus sub-scores for click potential, metadata quality, growth trajectory, and niche headroom.",
  },
  {
    q: "What is a good YouTube Visibility Score?",
    a: "A score above 85 is excellent, 70-84 is good, 55-69 is mixed, and anything below 55 usually means the channel has clear upload-level issues to fix. The most useful part is not just the number, but which sub-score is weakest.",
  },
  {
    q: "Why is my YouTube channel visibility low?",
    a: "Low visibility usually comes from weak titles, unclear video packaging, thin descriptions, missing chapters, poor metadata, low reach beyond subscribers, or a lack of videos that outperform the channel baseline. The sub-scores help identify which problem is most likely.",
  },
  {
    q: "How can I improve my Visibility Score?",
    a: "Start with the weakest sub-score. If CTR Potential is low, improve titles and thumbnails. If Metadata Quality is low, improve descriptions, tags, hashtags, and chapters. If Growth Trajectory is low, study outlier videos and competitor patterns. If Niche Headroom is low, revisit topic selection and keyword demand.",
  },
  {
    q: "What does each sub-score measure?",
    a: "CTR Potential measures title strength. Metadata Quality measures descriptions, hashtags, chapters, and audit signals. Growth Trajectory measures how often recent uploads outperform the channel's normal baseline. Niche Headroom measures whether videos reach beyond the existing subscriber base.",
  },
  {
    q: "How is the score calculated?",
    a: "The score combines four weighted signals: CTR Potential at 35%, Metadata Quality at 25%, Growth Trajectory at 25%, and Niche Headroom at 15%. The result is normalized into a 0-100 score so channels can be compared more easily.",
  },
  {
    q: "Is this a YouTube analytics replacement?",
    a: "No. Visibility Score is not a replacement for YouTube Studio analytics. It is a fast SEO and packaging check that helps you understand whether your recent uploads are set up for discovery. Use YouTube Studio for detailed retention, traffic source, and audience analytics.",
  },
  {
    q: "How is this different from Channel Audit?",
    a: "Visibility Score gives you one high-level channel score and four sub-scores. Channel Audit gives a deeper breakdown of recent uploads and shows more specific recurring issues across titles, descriptions, tags, hashtags, and chapters.",
  },
  {
    q: "Can I use this with competitor channels?",
    a: "Yes. You can score any public YouTube channel by pasting its handle or URL. This is useful for benchmarking your channel against competitors and seeing what stronger channels may be doing better.",
  },
  {
    q: "Is the YouTube Visibility Score checker free?",
    a: "Yes. The YouTube Visibility Score checker is free to use with no signup and no credit card. Usage may be limited per IP to keep the tool available and prevent abuse.",
  },
  {
    q: "Does the score guarantee more views?",
    a: "No tool can guarantee views. The score helps identify discoverability and packaging issues that may limit performance. Improving weak areas can make a channel more competitive, but results still depend on topic demand, audience fit, video quality, retention, and consistency.",
  },
];

export default function YouTubeVisibilityScorePage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool} subtitleOverride={HERO_SUBTITLE}>
        <VisibilityScoreTool />
      </ToolLayout>

      <ToolContentSections slug={tool.slug} />

      {/* What you'll get */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              What you&apos;ll get
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Visibility Score gives you one simple channel health number, plus
              the sub-scores that explain where the number came from.
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

      {/* About */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What the YouTube Visibility Score tells you
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Visibility Score turns your recent uploads into one simple channel
            health number. Instead of checking titles, metadata, outliers, and
            growth signals one by one, you get a fast benchmark and a clear
            direction for what to fix next.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use it when you want to understand whether your channel is being
            held back by weak titles, thin metadata, low reach beyond
            subscribers, or a lack of breakout videos. The score is not a
            promise of future views, but it helps you see which part of your
            YouTube SEO workflow deserves attention first.
          </p>
        </div>
      </section>

      {/* Sub-Score Table */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              How the score is calculated
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              The score combines four signals from the channel&apos;s recent
              uploads. CTR Potential carries the most weight because titles and
              thumbnails decide whether a video earns the click at all.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-700">
                    Sub-score
                  </th>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-700">
                    Weight
                  </th>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-700">
                    What it measures
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="px-5 py-3 font-medium text-gray-900">
                    CTR Potential
                  </td>
                  <td className="px-5 py-3 font-mono text-xs">35%</td>
                  <td className="px-5 py-3">
                    Title strength across the last 30 uploads
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium text-gray-900">
                    Metadata Quality
                  </td>
                  <td className="px-5 py-3 font-mono text-xs">25%</td>
                  <td className="px-5 py-3">
                    Description, hashtags, chapters, and audit quality
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium text-gray-900">
                    Growth Trajectory
                  </td>
                  <td className="px-5 py-3 font-mono text-xs">25%</td>
                  <td className="px-5 py-3">
                    How often uploads beat the channel&apos;s normal baseline
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium text-gray-900">
                    Niche Headroom
                  </td>
                  <td className="px-5 py-3 font-mono text-xs">15%</td>
                  <td className="px-5 py-3">
                    How far videos reach beyond the subscriber base
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Score Bands */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              What is a good score?
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {SCORE_BANDS.map((band) => (
              <div
                key={band.range}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-mono font-semibold ${band.bg} ${band.text} ring-1 ring-inset ${band.ring}`}
                  >
                    {band.range}
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {band.label}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {band.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
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

      {/* Related tools (kept from original) */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-base font-semibold text-gray-900">
              Related tools
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Visibility Score sits above the diagnostic tools. Drill into any
              sub-score with these:
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link
                  href="/tools/youtube-channel-audit"
                  className="link text-sm"
                >
                  Channel Audit (full breakdown) →
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/youtube-outlier-finder"
                  className="link text-sm"
                >
                  Outlier Finder →
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/youtube-video-audit"
                  className="link text-sm"
                >
                  Video Audit (single video) →
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/youtube-competitor-analyzer"
                  className="link text-sm"
                >
                  Competitor Analyzer →
                </Link>
              </li>
              <li>
                <Link href="/tools/analyze" className="link text-sm">
                  All Analyze tools →
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

      {/* Final CTA */}
      <section className="border-t border-gray-100 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Ready to check your channel?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Paste your channel handle and get a free YouTube Visibility Score in
            seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Score my channel
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
