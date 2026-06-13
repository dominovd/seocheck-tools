import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { EmbedCodeGeneratorTool } from "@/components/tools/EmbedCodeGeneratorTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-embed-code-generator")!;

const PAGE_TITLE = "YouTube Embed Code Generator";
const META_DESCRIPTION =
  "Generate custom YouTube embed code for any video. Set autoplay, mute, start/end time, captions, loop, controls, responsive layout, and privacy-enhanced mode.";
const OG_DESCRIPTION =
  "Create clean YouTube iframe embed code with responsive layout, autoplay, mute, loop, captions, start/end time, controls, and youtube-nocookie privacy mode.";

const base = buildMetadata({
  title: "YouTube Embed Code Generator | Responsive iframe Tool",
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
  "Paste a YouTube URL and generate clean iframe embed code with autoplay, mute, start/end time, loop, captions, controls, responsive layout, and privacy-enhanced youtube-nocookie mode.";

const ABOVE_FOLD_BULLETS = [
  "Autoplay, mute, captions, loop, controls, and start/end time in one place.",
  "Plain iframe or responsive 16:9 wrapper output.",
  "Privacy-enhanced youtube-nocookie domain available.",
];

const OPTIONS = [
  {
    name: "Autoplay",
    body: "Start playback automatically when the embed loads.",
  },
  {
    name: "Mute",
    body: "Required for reliable autoplay in modern browsers.",
  },
  {
    name: "Start time",
    body: "Begin the video at a specific second or mm:ss timestamp.",
  },
  {
    name: "End time",
    body: "Stop playback before the full video ends.",
  },
  {
    name: "Controls",
    body: "Show or hide the standard YouTube player controls.",
  },
  {
    name: "Captions",
    body: "Ask the player to show captions by default when captions are available.",
  },
  {
    name: "Loop",
    body: "Replay the same video using YouTube's required playlist parameter.",
  },
  {
    name: "Related videos",
    body: "Restrict recommendations to videos from the same channel where YouTube supports it.",
  },
  {
    name: "Privacy-enhanced mode",
    body: "Use youtube-nocookie.com instead of the standard YouTube embed domain.",
  },
  {
    name: "Responsive layout",
    body: "Wrap the iframe so it scales correctly on mobile and desktop.",
  },
];

const HOW_IT_WORKS = [
  "Paste a YouTube video URL, Shorts URL, youtu.be link, embed URL, or raw video ID.",
  "Choose player options: autoplay, mute, controls, captions, loop, related-video behavior, and privacy-enhanced mode.",
  "Add optional start and end times in seconds or mm:ss format.",
  "Pick plain iframe or responsive 16:9 wrapper.",
  "Preview the embed and copy the final HTML.",
];

const SEO_TIPS = [
  {
    name: "Embed the video where it actually helps the page",
    body: "A YouTube embed should support the page's purpose. Put demos near product explanations, tutorials near step-by-step instructions, and testimonials near proof sections. A video buried at the bottom of a page rarely gets watched.",
  },
  {
    name: "Keep the surrounding page fast",
    body: "YouTube embeds can add weight to a page. If performance matters, avoid stacking many embeds on one page, use one primary video per section, and consider lazy-loading embeds inside your site template.",
  },
  {
    name: "Use a responsive wrapper for mobile traffic",
    body: "Fixed-size iframes often look fine on desktop and break on mobile. A responsive wrapper keeps the player inside the viewport and makes the embed usable across phones, tablets, and wide screens.",
  },
  {
    name: "Do not rely on embeds alone for SEO context",
    body: "Search engines still need readable page content around the video. Add a clear heading, short summary, transcript excerpt, or supporting copy so the page has context beyond the iframe.",
  },
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-thumbnail-downloader",
    name: "Thumbnail Downloader",
    body: "Pull thumbnails to use alongside the embed.",
  },
  {
    href: "/tools/youtube-chapter-generator",
    name: "Chapter Generator",
    body: "Format timestamps for the description and on-page outline.",
  },
  {
    href: "/tools/youtube-channel-id-finder",
    name: "Channel ID Finder",
    body: "Find the permanent UC channel ID for APIs and RSS feeds.",
  },
  {
    href: "/tools/youtube-description-generator",
    name: "Description Generator",
    body: "Generate a publish-ready YouTube description.",
  },
  {
    href: "/tools/youtube-video-audit",
    name: "Video Audit",
    body: "Audit the embedded video's title, description, and tags.",
  },
  {
    href: "/tools",
    name: "All Publish tools",
    body: "Browse the rest of the publish workflow.",
  },
];

const FAQS = [
  {
    q: "Is this YouTube Embed Code Generator free?",
    a: "Yes. The tool is free and does not require signup. Paste a YouTube URL, choose your options, preview the player, and copy the generated HTML.",
  },
  {
    q: "What YouTube URLs can I paste?",
    a: "You can paste standard watch URLs, youtu.be short links, Shorts URLs, embed URLs, or a raw YouTube video ID.",
  },
  {
    q: "Can I make a responsive YouTube embed?",
    a: "Yes. Choose the responsive wrapper output when you want the video to scale with the page width and keep a 16:9 aspect ratio on mobile and desktop.",
  },
  {
    q: "How do I embed a YouTube video with autoplay?",
    a: "Turn on autoplay in the generator. For better browser support, keep mute enabled too. Most browsers block autoplay with sound.",
  },
  {
    q: "Why does autoplay require mute?",
    a: "Browsers restrict videos that start automatically with sound because they are disruptive. Muted autoplay is allowed more often, though final behavior still depends on the viewer's browser and device settings.",
  },
  {
    q: "How do start and end times work?",
    a: "The generator converts your timestamp into YouTube embed parameters. You can enter seconds, such as 90, or timestamp format, such as 1:30.",
  },
  {
    q: "How do I loop a YouTube embed?",
    a: "Enable loop. The generator adds the required loop parameter and the matching playlist parameter, which YouTube needs when looping a single video.",
  },
  {
    q: "What is youtube-nocookie.com?",
    a: "It is YouTube's privacy-enhanced embed domain. It can reduce cookie behavior before playback starts, but it does not remove all external YouTube requests or replace your site's privacy obligations.",
  },
  {
    q: "Can I hide related videos completely?",
    a: "No. YouTube no longer lets embeds fully hide related videos. The available option restricts related videos more narrowly, usually toward the same channel, when supported by YouTube.",
  },
  {
    q: "Does this work with YouTube Shorts?",
    a: "Yes. Paste a Shorts URL and the tool extracts the video ID for the embed code. The embed output still uses YouTube's standard iframe player.",
  },
  {
    q: "Plain iframe or responsive wrapper: which should I use?",
    a: "Use plain iframe if your CMS already makes videos responsive. Use the responsive wrapper if you are pasting into your own HTML and want the embed to resize cleanly on mobile.",
  },
  {
    q: "Do you store the video URL I paste?",
    a: "No. The tool only uses the URL to extract the video ID and generate the embed code.",
  },
];

export default function YouTubeEmbedCodeGeneratorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <EmbedCodeGeneratorTool />
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
            Free browser-side tool. No signup. Your video URL is only used
            to build the embed code.
          </p>
        </div>
      </section>

      {/* Generate YouTube embed code without editing iframe parameters by hand */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Generate YouTube embed code without editing iframe parameters
            by hand
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            YouTube&apos;s default Share &gt; Embed button is fine for a
            basic iframe, but it is not built for people who need a
            specific player behavior. This free YouTube Embed Code
            Generator gives you the useful options in one place: autoplay,
            mute, controls, captions, loop, start time, end time,
            responsive sizing, and privacy-enhanced embeds.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Paste a video URL, choose the settings you want, preview the
            player, then copy the generated HTML into your website, CMS,
            blog post, documentation page, course page, or landing page.
          </p>
        </div>
      </section>

      {/* What you can customize */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What you can customize
          </h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {OPTIONS.map((o) => (
              <div
                key={o.name}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <p className="text-base font-semibold text-gray-900">
                  {o.name}
                </p>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  {o.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plain iframe vs responsive embed */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Plain iframe vs responsive embed
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                PLAIN IFRAME
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                Drop-in HTML for any field
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                Use the plain iframe when your CMS already handles
                responsive video embeds or when a platform only accepts
                iframe HTML.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                RESPONSIVE 16:9 WRAPPER
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                Scales cleanly on mobile and desktop
              </p>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                Use the responsive wrapper when you control the page HTML
                and CSS. It keeps the video at a stable 16:9 ratio,
                prevents layout overflow on mobile, and avoids the common
                problem where a fixed-width YouTube embed breaks a narrow
                page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Autoplay, mute, and browser rules */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Autoplay, mute, and browser rules
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Most modern browsers block autoplay when video starts with
            sound. That is why this tool pairs autoplay with mute. A muted
            autoplay embed is much more likely to work, especially inside
            landing pages, product pages, and documentation pages.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Autoplay can still vary by browser, device, power-saving
            mode, and user settings. For the most predictable experience,
            keep controls visible so the viewer can start playback
            manually if the browser blocks autoplay.
          </p>
        </div>
      </section>

      {/* Privacy-enhanced YouTube embeds */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Privacy-enhanced YouTube embeds
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Privacy-enhanced mode changes the iframe domain from{" "}
            <span className="font-mono text-sm">youtube.com</span> to{" "}
            <span className="font-mono text-sm">youtube-nocookie.com</span>.
            This can reduce cookie behavior before playback starts, which
            is useful for websites with stricter privacy expectations.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            It is not magic compliance by itself. The YouTube player still
            loads external resources, and your site may still need the
            right consent or privacy disclosures depending on your
            audience and legal requirements.
          </p>
        </div>
      </section>

      {/* Start time, end time, and loop behavior */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Start time, end time, and loop behavior
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Start and end times are converted into the parameters YouTube
            expects. You can enter seconds or timestamp-style values like{" "}
            <span className="font-mono text-sm">1:23</span>.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Looping a single YouTube video has one awkward detail:
            YouTube requires the same video ID to be passed as the{" "}
            <span className="font-mono text-sm">playlist</span> parameter.
            The generator adds that automatically, so you do not have to
            remember the syntax.
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
            {HOW_IT_WORKS.map((step, i) => (
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

      {/* SEO tips */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Tips for embedding YouTube on a page
          </h2>

          <div className="mt-8 space-y-4">
            {SEO_TIPS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <p className="text-base font-semibold text-gray-900">
                  {t.name}
                </p>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  {t.body}
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
              Other YouTube publishing utilities
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Use these alongside the embed when shipping a page that
              hosts a YouTube video.
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
            Ready to build your YouTube embed code?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Paste a video URL and pick the options you need. The HTML is
            ready to copy in seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Generate embed code
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
