import Link from "next/link";
import {
  Gauge,
  MousePointerClick,
  FileText,
  TrendingUp,
  Telescope,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { VisibilityScoreTool } from "@/components/tools/VisibilityScoreTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-visibility-score")!;

const PAGE_TITLE = "YouTube Visibility Score Checker";
const META_DESCRIPTION =
  "Check your YouTube channel Visibility Score for free. Get a 0-100 channel SEO score across CTR potential, metadata quality, growth trajectory, and niche reach.";
const OG_DESCRIPTION =
  "Paste any public YouTube channel and get a free 0-100 Visibility Score with sub-scores for CTR potential, metadata quality, growth trajectory, and niche headroom.";

const base = buildMetadata({
  title: "YouTube Visibility Score Checker | Free Channel SEO Score",
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
  "Paste any YouTube channel and get a free 0-100 channel SEO score across title strength, metadata quality, niche reach, and recent growth momentum.";

const ABOVE_FOLD_BULLETS = [
  "Channel-level 0-100 score plus four explainable sub-scores.",
  "Names the weakest lever and the next tool to open.",
  "Works on your own channel or any public competitor.",
];

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
    desc: "Strong channel packaging, healthy growth signals, and few obvious SEO gaps. Keep testing new topics and protect what is already working.",
  },
  {
    range: "70-84",
    label: "Good",
    ring: "ring-brand-200",
    text: "text-brand-700",
    bg: "bg-brand-50",
    desc: "Solid overall, but one or two sub-scores are likely holding the channel back. Fix the weakest lever first.",
  },
  {
    range: "55-69",
    label: "Mixed",
    ring: "ring-amber-200",
    text: "text-amber-700",
    bg: "bg-amber-50",
    desc: "Some discoverable uploads, but the packaging system is inconsistent. Prioritize repeatable improvements: clearer titles, stronger descriptions, better topic selection.",
  },
  {
    range: "Below 55",
    label: "Discovery friction",
    ring: "ring-red-200",
    text: "text-red-700",
    bg: "bg-red-50",
    desc: "Recent uploads are likely fighting multiple problems at once. Start with the easiest visible fixes: titles, descriptions, chapters, tags, and thumbnails.",
  },
];

type WeakSub = {
  Icon: typeof Gauge;
  label: string;
  name: string;
  body: string;
  tools: { name: string; href: string }[];
  accent: "brand" | "amber" | "violet" | "emerald";
};

const WEAK_SUBSCORES: WeakSub[] = [
  {
    Icon: MousePointerClick,
    label: "CTR POTENTIAL LOW",
    name: "Improve titles and thumbnails first",
    body: "Recent titles are not earning clicks in search, suggested, or browse. Fix packaging before topic strategy.",
    tools: [
      { name: "Title Score Checker", href: "/tools/youtube-title-score-checker" },
      { name: "Thumbnail Preview", href: "/tools/youtube-thumbnail-preview" },
      { name: "Video Audit", href: "/tools/youtube-video-audit" },
    ],
    accent: "brand",
  },
  {
    Icon: FileText,
    label: "METADATA LOW",
    name: "Fix descriptions, tags, hashtags, chapters",
    body: "Uploads are not giving YouTube enough context. Tighten the supporting metadata across recent videos.",
    tools: [
      { name: "Channel Audit", href: "/tools/youtube-channel-audit" },
      { name: "Description Generator", href: "/tools/youtube-description-generator" },
      { name: "Tag Generator", href: "/tools/youtube-tag-generator" },
      { name: "Hashtag Generator", href: "/tools/youtube-hashtag-generator" },
      { name: "Chapter Generator", href: "/tools/youtube-chapter-generator" },
    ],
    accent: "violet",
  },
  {
    Icon: TrendingUp,
    label: "GROWTH LOW",
    name: "Study outliers and competitor patterns",
    body: "Recent uploads are not breaking the channel baseline. Find what is working elsewhere and apply it deliberately.",
    tools: [
      { name: "Outlier Finder", href: "/tools/youtube-outlier-finder" },
      { name: "Competitor Analyzer", href: "/tools/youtube-competitor-analyzer" },
    ],
    accent: "amber",
  },
  {
    Icon: Telescope,
    label: "NICHE HEADROOM LOW",
    name: "Revisit topic selection and demand",
    body: "Videos are mostly serving the existing audience. Look at the topic mix before packaging.",
    tools: [
      { name: "Niche Check", href: "/tools/youtube-niche-check" },
      { name: "Keyword Tool", href: "/tools/youtube-keyword-tool" },
      { name: "Video Idea Generator", href: "/tools/youtube-video-idea-generator" },
    ],
    accent: "emerald",
  },
];

const WEAK_CLASSES: Record<string, { ring: string; bg: string; label: string }> = {
  brand: { ring: "border-brand-100", bg: "bg-brand-50/30", label: "text-brand-700" },
  amber: { ring: "border-amber-100", bg: "bg-amber-50/30", label: "text-amber-700" },
  violet: { ring: "border-violet-100", bg: "bg-violet-50/30", label: "text-violet-700" },
  emerald: { ring: "border-emerald-100", bg: "bg-emerald-50/30", label: "text-emerald-700" },
};

const HOW_IT_WORKS_STEPS = [
  "Paste a public YouTube channel handle, URL, or channel ID.",
  "The tool reads recent public uploads.",
  "Each upload is scored across title strength, metadata quality, performance momentum, and reach signals.",
  "The channel gets a normalized 0-100 Visibility Score.",
  "Sub-scores show which part of the discovery system is weakest.",
  "The page recommends the next tool to use based on the weak sub-score.",
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-channel-audit",
    name: "Channel Audit",
    body: "Deeper upload-level diagnosis and recurring issues across recent videos.",
  },
  {
    href: "/tools/youtube-video-audit",
    name: "Video Audit",
    body: "Drill into a single video's title, description, tags, and chapters.",
  },
  {
    href: "/tools/youtube-outlier-finder",
    name: "Outlier Finder",
    body: "Find recent videos that beat the channel baseline by 3x or more.",
  },
  {
    href: "/tools/youtube-competitor-analyzer",
    name: "Competitor Analyzer",
    body: "Study a competitor's top videos and recurring patterns.",
  },
  {
    href: "/tools/youtube-niche-check",
    name: "Niche Check",
    body: "Validate whether a topic area has room for a new entrant.",
  },
  {
    href: "/tools/youtube-title-score-checker",
    name: "Title Score Checker",
    body: "Score and compare title variants before publishing.",
  },
];

const FAQS = [
  {
    q: "What is the YouTube Visibility Score?",
    a: "It is a free 0-100 channel score that estimates how discoverable and well-packaged a YouTube channel is based on recent public uploads.",
  },
  {
    q: "Is this a YouTube SEO score checker?",
    a: "Yes. It works as a channel-level YouTube SEO score checker by reviewing title strength, metadata quality, growth trajectory, and niche reach.",
  },
  {
    q: "Is this a YouTube rank checker?",
    a: "Not in the keyword-position sense. It does not check where a video ranks for one search query. It checks whether the channel's recent uploads are set up for discovery.",
  },
  {
    q: "How do I check my YouTube channel score?",
    a: "Paste your channel handle, channel URL, or channel ID. The tool analyzes recent public uploads and returns a 0-100 Visibility Score with sub-scores.",
  },
  {
    q: "What is a good Visibility Score?",
    a: "Above 85 is strong, 70-84 is good with room to improve, 55-69 is mixed, and below 55 usually means several discovery or packaging issues need attention.",
  },
  {
    q: "What does CTR Potential measure?",
    a: "It estimates whether recent titles are strong enough to earn clicks from search, suggested videos, and browse surfaces.",
  },
  {
    q: "What does Metadata Quality measure?",
    a: "It looks at whether descriptions, hashtags, tags, chapters, and other upload fields support discoverability and viewer understanding.",
  },
  {
    q: "What does Growth Trajectory measure?",
    a: "It checks whether recent uploads are improving against the channel's normal performance baseline.",
  },
  {
    q: "What does Niche Headroom measure?",
    a: "It estimates whether the channel is reaching beyond its subscriber base or mainly serving the same existing audience.",
  },
  {
    q: "How can I improve my Visibility Score?",
    a: "Start with the weakest sub-score. Improve titles and thumbnails for CTR Potential, descriptions and chapters for Metadata Quality, topic strategy for Niche Headroom, and outlier analysis for Growth Trajectory.",
  },
  {
    q: "How is the score calculated?",
    a: "The score combines four weighted signals: CTR Potential at 35%, Metadata Quality at 25%, Growth Trajectory at 25%, and Niche Headroom at 15%. The result is normalized into a 0-100 score so channels can be compared more easily.",
  },
  {
    q: "Can I use this on competitor channels?",
    a: "Yes. You can score any public YouTube channel and use the result as a benchmark.",
  },
  {
    q: "Is this a replacement for YouTube Studio analytics?",
    a: "No. YouTube Studio is the source of truth for private analytics like retention, impressions, CTR, RPM, and audience data. Visibility Score is a fast public-facing SEO and packaging benchmark.",
  },
  {
    q: "How is this different from Channel Audit?",
    a: "Visibility Score gives you one high-level channel score plus four sub-scores and a recommended next tool. Channel Audit goes deeper into individual recent uploads and surfaces recurring issues across titles, descriptions, tags, hashtags, and chapters.",
  },
  {
    q: "Is the YouTube Visibility Score Checker free?",
    a: "Yes. It is free to use with no signup. Usage may be rate-limited to prevent abuse.",
  },
  {
    q: "Does a higher score guarantee more views?",
    a: "No. A higher score means fewer visible discovery and packaging issues. Actual views still depend on audience demand, retention, topic fit, competition, consistency, and video quality.",
  },
];

export default function YouTubeVisibilityScorePage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <VisibilityScoreTool />
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
            Free channel analysis. No signup. Works with public YouTube
            channels. This is a channel visibility benchmark, not a
            keyword rank tracker.
          </p>
        </div>
      </section>

      {/* A YouTube channel score that explains what is holding growth back */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            A YouTube channel score that explains what is holding growth
            back
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Views are noisy. One upload can spike, another can flop, and
            YouTube Studio can leave you staring at disconnected metrics.
            Visibility Score turns the channel&apos;s recent public
            uploads into a simple 0-100 benchmark for discoverability and
            packaging health.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The point is not just the score. The useful part is the
            breakdown: whether the channel is being limited by weak
            titles, thin metadata, poor recent momentum, or limited reach
            beyond the existing subscriber base.
          </p>
        </div>
      </section>

      {/* What you'll get */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              What the Visibility Score measures
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              One channel-level number plus four explainable sub-scores
              that show where it came from.
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

      {/* How the score is calculated */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              How the score is calculated
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              The score combines four signals from recent uploads. CTR
              Potential carries the most weight because titles and
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
                    How often uploads beat the channel&apos;s normal
                    baseline
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

      {/* What is a good score? */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
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

      {/* What to do with each weak sub-score */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              What to do with each weak sub-score
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              The score points at the bottleneck. Open the matching
              diagnostic tool to fix it.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {WEAK_SUBSCORES.map(({ Icon, label, name, body, tools, accent }) => {
              const c = WEAK_CLASSES[accent];
              return (
                <div
                  key={label}
                  className={`rounded-2xl border ${c.ring} ${c.bg} p-5`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white ${c.label} ring-1 ring-inset ring-gray-200`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <p
                      className={`text-[11px] font-semibold uppercase tracking-wider ${c.label}`}
                    >
                      {label}
                    </p>
                  </div>
                  <p className="mt-3 text-base font-semibold text-gray-900">
                    {name}
                  </p>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {body}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                    {tools.map((t) => (
                      <li key={t.name}>
                        <Link
                          href={t.href}
                          className="text-xs font-medium text-gray-800 hover:text-brand-700 underline-offset-2 hover:underline"
                        >
                          {t.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use it for your channel or competitors */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Use it for your channel or competitors
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            You can score your own channel to find the weakest growth
            lever, or score a competitor to benchmark how your packaging
            and metadata compare. Since the tool works from public channel
            data, it is useful before you have access to another
            channel&apos;s private analytics.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            It does not replace YouTube Studio. It gives you a fast
            outside-in view of channel visibility.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How it works
          </h2>

          <ol className="mt-8 space-y-4">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Visibility Score vs Channel Audit */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Visibility Score vs Channel Audit
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                VISIBILITY SCORE
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                Fast scorecard and direction
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                One channel number plus four sub-scores. Names the
                weakest lever and points at the next tool to use.
              </p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-700">
                CHANNEL AUDIT
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                Deeper upload-level diagnosis
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                Per-upload breakdown across titles, descriptions, tags,
                hashtags, and chapters. Surfaces recurring issues.{" "}
                <Link
                  href="/tools/youtube-channel-audit"
                  className="font-medium text-violet-700 hover:underline"
                >
                  Open Channel Audit
                </Link>
                .
              </p>
            </div>
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
              Drill into any sub-score
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Visibility Score sits above the diagnostic tools. Use these
              when you want to dig deeper.
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
            Ready to check your channel?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Paste your channel handle and get a free YouTube Visibility
            Score in seconds.
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
