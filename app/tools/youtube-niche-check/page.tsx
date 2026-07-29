import Link from "next/link";
import {
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Clock,
  Scale,
  Rocket,
  RefreshCw,
  SearchCheck,
  Building2,
  Check,
  ArrowRight,
} from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { NicheCheckTool } from "@/components/tools/NicheCheckTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-niche-check")!;

const PAGE_TITLE = "Free YouTube Niche Checker";
const META_DESCRIPTION =
  "Free YouTube niche checker. Validate a video topic before recording with a categorical verdict, demand signals, competition risk, freshness, and top-result evidence.";
const OG_DESCRIPTION =
  "Check a YouTube topic for free before you make the video. See whether demand, timing, and competition make it worth entering.";

const base = buildMetadata({
  title: "Free YouTube Niche Checker | Validate a Topic Before Recording",
  description: META_DESCRIPTION,
  path: `tools/${tool.slug}`,
  noBrand: true,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

export const metadata = {
  ...base,
  openGraph: {
    ...base.openGraph,
    description: OG_DESCRIPTION,
  },
  twitter: {
    ...base.twitter,
    description: OG_DESCRIPTION,
  },
};

const HERO_SUBTITLE =
  "Before you script, record, or brief an editor, check whether the topic has a real opening. Get a plain-English verdict category, factual signals from the top-20 results, and evidence you can act on.";

const ABOVE_FOLD_BULLETS = [
  "Know when a topic deserves production time.",
  "Find openings where smaller channels can still break through.",
  "Walk away from stale or crowded ideas before they eat your week.",
];

type Signal = { Icon: typeof TrendingUp; title: string; body: string };

const SIGNALS: Signal[] = [
  {
    Icon: TrendingUp,
    title: "Audience pull",
    body: "Do the current results earn enough views to make the topic worth your effort?",
  },
  {
    Icon: ShieldAlert,
    title: "Gatekeeper risk",
    body: "Are big channels controlling the results, or can smaller creators still appear?",
  },
  {
    Icon: Sparkles,
    title: "Breakthrough proof",
    body: "Are small channels getting more views than their subscriber base would normally predict?",
  },
  {
    Icon: Clock,
    title: "Timing",
    body: "Are recent uploads still gaining attention, or did the trend already cool off?",
  },
];

type Verdict = {
  label: string;
  swatch: string;
  text: string;
  bg: string;
  ring: string;
  desc: string;
};

const VERDICTS: Verdict[] = [
  {
    label: "ENTER NOW",
    swatch: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    desc: "Strongest opportunity. Top results show healthy demand and small-channel outliers, which suggests the topic may be rewarding relevant videos rather than only established channels.",
  },
  {
    label: "NICHE GAP",
    swatch: "bg-brand-500",
    text: "text-brand-700",
    bg: "bg-brand-50",
    ring: "ring-brand-200",
    desc: "There is demand, but the current supply looks thin or not very fresh. A focused new video or channel angle may have room to compete.",
  },
  {
    label: "HIGH COMPETITION",
    swatch: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    desc: "Top results are mostly controlled by larger channels. The niche may still be valuable, but a new creator needs a differentiated angle instead of a generic version of the topic.",
  },
  {
    label: "OVERSATURATED",
    swatch: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
    ring: "ring-red-200",
    desc: "Many recent videos already cover the topic and the result pattern does not show a strong opening. This is a warning to narrow the idea or choose a fresher angle.",
  },
  {
    label: "WEAK DEMAND",
    swatch: "bg-gray-400",
    text: "text-gray-700",
    bg: "bg-gray-50",
    ring: "ring-gray-200",
    desc: "Top videos do not show enough view activity to justify the effort for most creators. It may still work for a very specific audience, but it is not a broad opportunity.",
  },
  {
    label: "NEUTRAL",
    swatch: "bg-slate-400",
    text: "text-slate-700",
    bg: "bg-slate-50",
    ring: "ring-slate-200",
    desc: "Signals are mixed. The topic is not clearly an opportunity or a trap. Use a narrower angle or compare a few related queries to find a sharper opening.",
  },
];

const WORKFLOW_STEPS = [
  {
    title: "Start with the topic you are tempted to make.",
    body: "Type the topic the way a viewer might search for it on YouTube, not the way you would brand it on your channel.",
  },
  {
    title: "Read the verdict as a go/no-go signal, not a guarantee.",
    body: "The verdict reflects how the market currently looks. Strong signals raise the odds; they do not promise the next video will perform.",
  },
  {
    title: "If the result is crowded, test narrower angles before abandoning the idea.",
    body: 'A wide topic like "AI tools" may be crowded, while "AI tools for solo founders" or "open-source AI tools for video editors" can have clean openings.',
  },
  {
    title: "If the result shows a gap, inspect the top videos and ask what a better, fresher version would look like.",
    body: "Look at title structures, video length, framing, and audience promise. Aim for a sharper version of the winning pattern, not a copy.",
  },
  {
    title: "Move only the strongest topics into keyword research, competitor review, and title development.",
    body: "Keep the funnel narrow on purpose. Most ideas should be filtered out at this stage so production time is reserved for topics with proof.",
  },
];

type UseCase = { Icon: typeof Rocket; title: string; body: string };

const USE_CASES: UseCase[] = [
  {
    Icon: Rocket,
    title: "New creators",
    body: "Pick a niche where a small channel has a realistic chance to earn views.",
  },
  {
    Icon: RefreshCw,
    title: "Existing channels",
    body: "Validate a new topic before adding it to your content calendar.",
  },
  {
    Icon: SearchCheck,
    title: "YouTube SEO specialists",
    body: "Use top-result evidence before recommending a topic cluster.",
  },
  {
    Icon: Building2,
    title: "Agencies and marketers",
    body: "Quickly separate promising YouTube content opportunities from crowded or low-demand ideas.",
  },
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-keyword-tool",
    name: "YouTube Keyword Tool",
    body: "Turn a validated niche into a keyword cluster and search angles.",
  },
  {
    href: "/tools/youtube-outlier-finder",
    name: "YouTube Outlier Finder",
    body: "Find videos that overperform a channel's normal baseline within a niche.",
  },
  {
    href: "/tools/youtube-competitor-analyzer",
    name: "Competitor Channel Analyzer",
    body: "Once a niche looks open, study which channels are already winning.",
  },
  {
    href: "/tools/youtube-video-idea-generator",
    name: "AI Video Idea Generator",
    body: "Turn the chosen niche into a list of concrete video ideas.",
  },
  {
    href: "/tools/research",
    name: "All Research tools",
    body: "Browse the rest of the pre-production toolkit.",
  },
  {
    href: "/tools/youtube-title-score-checker",
    name: "Title Analyzer",
    body: "Test the title before producing the video the niche check approved.",
  },
];

const FAQS = [
  {
    q: "What is a YouTube niche checker?",
    a: "A YouTube niche checker helps you evaluate whether a topic is worth entering before you create content. It looks at public YouTube results for a keyword and estimates demand, competition, freshness, and whether smaller channels can break through.",
  },
  {
    q: "Is this YouTube niche checker free?",
    a: "Yes. You can run 5 niche checks per IP per day for free. Cached results refresh every 24 hours and help keep the tool available without signup or payment.",
  },
  {
    q: "What does ENTER NOW mean?",
    a: "ENTER NOW is the strongest opportunity verdict. It means the top results show healthy demand and small-channel outliers, which suggests the topic may be rewarding relevant videos rather than only established channels.",
  },
  {
    q: "What does NICHE GAP mean?",
    a: "NICHE GAP means there is demand, but the current supply looks thin or not very fresh. A focused new video or channel angle may have room to compete.",
  },
  {
    q: "What does HIGH COMPETITION mean?",
    a: "HIGH COMPETITION means the top results are mostly controlled by larger channels. The niche may still be valuable, but a new creator needs a differentiated angle instead of a generic version of the topic.",
  },
  {
    q: "What does OVERSATURATED mean?",
    a: "OVERSATURATED means many recent videos already cover the topic and the result pattern does not show a strong opening. This is a warning to narrow the idea or choose a fresher angle.",
  },
  {
    q: "What does WEAK DEMAND mean?",
    a: "WEAK DEMAND means the top videos do not show enough view activity to justify the effort for most creators. It may still work for a very specific audience, but it is not a broad opportunity.",
  },
  {
    q: "How is the verdict computed?",
    a: "The verdict category is based on rule-based signals from the top 20 YouTube results: median views, small-channel outliers, big-channel share, freshness, and topic direction. It is designed to be consistent rather than subjective, and does not surface a numeric score.",
  },
  {
    q: "Is this the same as a YouTube keyword tool?",
    a: "No. A YouTube keyword tool helps you find search terms. This niche checker helps you decide whether a topic is worth entering by looking at actual YouTube result dynamics. Use both together for stronger topic research.",
  },
  {
    q: "Does it work for non-English topics?",
    a: "Yes. The tool analyzes public YouTube results for the query you enter. Autocomplete suggestions may lean US English, but the niche verdict works with topics YouTube can index.",
  },
  {
    q: "Do you store the topics I search?",
    a: "Results are cached by normalized query for 24 hours. The tool does not keep a per-user search history.",
  },
];

export default function YouTubeNicheCheckPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <NicheCheckTool />
      </ToolLayout>

      {/* Above-fold benefit bullets + trust line */}
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
            No signup. No credit card. A rule-based verdict from public
            YouTube result data.
          </p>
        </div>
      </section>

      {/* About: make the topic decision before you make the video */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Make the topic decision before you make the video
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The expensive part of YouTube is not the upload. It is the hours
            spent researching, scripting, recording, editing, and packaging a
            video that never had a fair chance.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Niche Check is a pre-production filter. Enter a topic and it
            reads the current YouTube result set like a market: is there
            demand, are smaller channels getting traction, are fresh videos
            still winning, or is the page already crowded with large
            channels and stale interest?
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Use it when you are choosing a channel direction, deciding
            whether to make a specific video, or narrowing a broad idea into
            a topic with a cleaner opening.
          </p>
        </div>
      </section>

      {/* The four signals behind the verdict */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            The four signals behind the verdict
          </h2>

          <ul className="mt-10 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
            {SIGNALS.map(({ Icon, title, body }) => (
              <li key={title} className="flex gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
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

          <div className="mt-6 flex gap-3 rounded-2xl border border-brand-200 bg-brand-50/40 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 ring-1 ring-inset ring-brand-200">
              <Scale className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">Verdict</p>
              <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                The tool turns those signals into one clear decision label
                and a categorical verdict from the top-20 results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The signal that matters for new channels */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            The signal that matters for new channels
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            For a new or small channel, total search volume can be
            misleading. A topic can be popular and still impossible to enter
            if the visible results are locked up by large channels.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The useful signal is small-channel outperformance. If a channel
            with a modest subscriber base is getting outsized views in the
            current results, YouTube may be rewarding the topic, timing, or
            packaging rather than only the channel&apos;s authority.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            That does not guarantee your video will win, but it changes the
            decision. It tells you there may be an actual opening instead of
            a leaderboard you can only admire from the sidewalk.
          </p>
        </div>
      </section>

      {/* The six decision labels */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              The six decision labels
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Every check returns one of these verdicts. Each one tells you
              what to do next: enter, narrow, wait, or walk away.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {VERDICTS.map((v) => (
              <div
                key={v.label}
                className={`rounded-2xl p-5 ring-1 ${v.ring} ${v.bg}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${v.swatch}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${v.text}`}
                  >
                    {v.label}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A practical workflow for choosing topics */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl text-center">
            A practical workflow for choosing topics
          </h2>

          <ol className="mt-12 space-y-6">
            {WORKFLOW_STEPS.map((step, i) => (
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

          <p className="mt-10 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-sm text-gray-800 leading-relaxed">
            This keeps Niche Check distinct from a keyword tool. Keywords
            help you name the opportunity; this page helps you decide whether
            the opportunity deserves production time.
          </p>
        </div>
      </section>

      {/* Best use cases */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Best use cases
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map(({ Icon, title, body }) => (
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

      {/* How the niche check works */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How the YouTube niche check works
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The tool starts with your topic, pulls related query signals,
            then analyzes the top 20 YouTube videos for that query. It
            checks view counts, publish dates, channel sizes, big-channel
            share, small-channel outliers, and freshness.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The verdict is rule-based, not a loose AI opinion. The same
            query returns the same verdict until the underlying YouTube
            data or 24-hour cache changes.
          </p>
          <p className="mt-6 text-xs text-gray-500 leading-relaxed">
            For transparency: each uncached check uses roughly 102 YouTube
            Data API quota units, so free use is limited to 5 checks per
            IP per day.
          </p>
        </div>
      </section>

      <RelatedGuideCallout slug={tool.slug} />

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

      {/* Related tools */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Continue your YouTube niche research
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              After you find a promising niche, turn it into keywords,
              competitor research, and video ideas.
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
      <section className="border-t border-gray-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Ready to check a YouTube topic?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Type the topic and get a free verdict before you commit
            production time.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Check niche for free
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
