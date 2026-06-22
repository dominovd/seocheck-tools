import Link from "next/link";
import { Check, ArrowRight, Copy } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { ChannelIdFinderTool } from "@/components/tools/ChannelIdFinderTool";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-channel-id-finder")!;

const PAGE_TITLE = "YouTube Channel ID Finder";
const META_DESCRIPTION =
  "Find a YouTube channel ID from any handle, custom URL, video link, Shorts URL, or legacy /user/ URL. Get the permanent UC ID and RSS feed URL.";
const OG_DESCRIPTION =
  "Convert any YouTube URL, handle, or video link into the permanent UC channel ID used for APIs, RSS feeds, dashboards, and automations.";

const base = buildMetadata({
  title: "YouTube Channel ID Finder | Find UC ID From URL",
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
  "Paste a YouTube handle, channel URL, video URL, Shorts link, or legacy /user/ URL and get the permanent UC channel ID, canonical channel URL, and RSS feed link.";

const ABOVE_FOLD_BULLETS = [
  "Convert handles, custom URLs, video links, and Shorts to UC IDs.",
  "Get the permanent ID, canonical URL, and RSS feed link in one step.",
  "Direct /channel/UC URLs resolve instantly without a network call.",
];

const WHEN_NEEDED = [
  "YouTube Data API requests.",
  "RSS feeds for new uploads.",
  "Zapier, Make, n8n, or other automation triggers.",
  "Looker Studio, Sheets, or internal reporting dashboards.",
  "WordPress, Webflow, or custom embeds.",
  "Competitor monitoring workflows.",
  "Channel audits or analytics tools that require the stable channel identifier.",
];

const INPUT_FORMATS = [
  { format: "youtube.com/channel/UC...", note: "Direct channel URL (instant)" },
  { format: "youtube.com/@handle", note: "Modern handle URL" },
  { format: "@handle", note: "Raw handle (no URL)" },
  { format: "youtube.com/c/CustomName", note: "Legacy custom URL" },
  { format: "youtube.com/user/Username", note: "Legacy username URL" },
  { format: "youtube.com/watch?v=VIDEO_ID", note: "Video URL — uses the uploader's channel" },
  { format: "youtube.com/shorts/VIDEO_ID", note: "Shorts URL" },
  { format: "youtu.be/VIDEO_ID", note: "Shortened video URL" },
  { format: "UCX6OQ3DkcsbYNE6H8uQQuVA", note: "Raw channel ID (returns immediately)" },
];

const RESULTS = [
  "The permanent UC... channel ID.",
  "The canonical channel URL.",
  "The handle URL when available.",
  "The RSS feed URL for new uploads.",
  "A quick link to open the channel on YouTube.",
  "Copy buttons for the values you are likely to paste into other tools.",
];

const IDENTIFIERS = [
  {
    label: "UC ID",
    name: "UC... channel ID",
    body: "The permanent channel identifier. Best for APIs, RSS, automations, and dashboards.",
    accent: "brand",
  },
  {
    label: "HANDLE",
    name: "@handle",
    body: "A readable public handle. Useful for sharing, but it can change.",
    accent: "slate",
  },
  {
    label: "LEGACY",
    name: "/c/ or /user/ URLs",
    body: "Older YouTube URL formats. They may still work, but they are not the underlying channel ID.",
    accent: "amber",
  },
  {
    label: "VIDEO",
    name: "Video ID",
    body: "The short ID in a video URL, such as dQw4w9WgXcQ. It identifies one video, not the channel. The tool can use a video URL to find the uploader's channel ID.",
    accent: "violet",
  },
];

const ACCENT_CLASSES: Record<
  string,
  { ring: string; bg: string; label: string }
> = {
  brand: { ring: "border-brand-100", bg: "bg-brand-50/30", label: "text-brand-700" },
  slate: { ring: "border-slate-200", bg: "bg-slate-50/40", label: "text-slate-600" },
  amber: { ring: "border-amber-100", bg: "bg-amber-50/30", label: "text-amber-700" },
  violet: { ring: "border-violet-100", bg: "bg-violet-50/30", label: "text-violet-700" },
};

const HOW_IT_WORKS_STEPS = [
  "You paste a YouTube URL, handle, video link, or channel ID.",
  "The tool detects the input type.",
  "Direct UC... IDs and /channel/UC... URLs are resolved immediately.",
  "Other formats are checked against public YouTube metadata.",
  "The tool returns the permanent channel ID and related URLs.",
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-channel-audit",
    name: "Channel Audit",
    body: "Audit the channel's recent metadata and recurring issues.",
  },
  {
    href: "/tools/youtube-competitor-analyzer",
    name: "Competitor Channel Analyzer",
    body: "Study the channel's top videos and patterns.",
  },
  {
    href: "/tools/youtube-outlier-finder",
    name: "Outlier Finder",
    body: "Find recent videos that beat the channel's normal baseline.",
  },
  {
    href: "/tools/youtube-tag-extractor",
    name: "Tag Extractor",
    body: "Inspect metadata from a specific video.",
  },
  {
    href: "/tools/youtube-thumbnail-downloader",
    name: "Thumbnail Downloader",
    body: "Download thumbnails from videos on the channel.",
  },
  {
    href: "/tools/youtube-channel-audit",
    name: "Channel Audit",
    body: "Score the channel 0-100 across CTR, metadata, headroom, and growth.",
  },
];

const FAQS = [
  {
    q: "What is a YouTube channel ID?",
    a: "A YouTube channel ID is the permanent identifier for a channel. It starts with UC and is used by YouTube APIs, RSS feeds, embeds, analytics tools, and automation workflows.",
  },
  {
    q: "How do I find my YouTube channel ID?",
    a: "Paste your channel handle, channel URL, or any video from your channel into the tool. It will return the permanent UC... channel ID.",
  },
  {
    q: "Can I find a channel ID from a YouTube handle?",
    a: "Yes. Paste the full handle URL, such as youtube.com/@MrBeast, or paste the raw handle, such as @MrBeast. The tool resolves it to the permanent channel ID when public metadata is available.",
  },
  {
    q: "Can I find a channel ID from a video URL?",
    a: "Yes. Paste a regular YouTube video URL, Shorts URL, or youtu.be link. The tool extracts the uploader's channel ID from the video metadata.",
  },
  {
    q: "What is the difference between a channel ID and a handle?",
    a: "A handle is the public @name people see and share. A channel ID is the permanent UC... identifier behind the channel. Handles can change; channel IDs stay stable.",
  },
  {
    q: "Why do APIs and RSS feeds need the channel ID?",
    a: "APIs, feeds, and automations need a stable identifier. A handle or custom URL may change, but the channel ID remains attached to the same channel.",
  },
  {
    q: "Is a YouTube channel ID public?",
    a: "Yes. Channel IDs are public identifiers used by YouTube's own pages, feeds, and APIs. This tool only reads public metadata.",
  },
  {
    q: "Does this work with old /c/ and /user/ URLs?",
    a: "Yes. Legacy custom URLs and username URLs are supported when YouTube still exposes enough metadata to resolve the channel.",
  },
  {
    q: "Why did the tool return no result?",
    a: "The URL may be invalid, the channel may not exist, the video may be private or unavailable, or YouTube may not expose enough metadata for that page. Try a different public video or the channel's handle URL.",
  },
  {
    q: "Do you store the URLs I paste?",
    a: "Lookup results may be cached temporarily to keep the tool fast and reduce repeated requests. The tool does not need your YouTube login and does not access private channel data.",
  },
];

export default function YouTubeChannelIdFinderPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
      >
        <ChannelIdFinderTool />
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
            Free, no signup. Direct{" "}
            <span className="font-mono">/channel/UC...</span> URLs resolve
            instantly; other formats are looked up from public YouTube
            metadata.
          </p>
        </div>
      </section>

      {/* Find the permanent ID behind any YouTube channel */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Find the permanent ID behind any YouTube channel
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            YouTube gives every channel a permanent ID that starts with{" "}
            <span className="font-mono text-sm">UC</span>. That ID stays
            the same even if the channel changes its handle, custom URL,
            branding, or display name.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The problem is that most YouTube links do not show the channel
            ID anymore. You might have an{" "}
            <span className="font-mono text-sm">@handle</span>, an old{" "}
            <span className="font-mono text-sm">/c/</span> custom URL, a{" "}
            <span className="font-mono text-sm">/user/</span> URL, a
            Shorts link, or a regular video URL. Those are easier to
            share, but they are not always the identifier you need for
            technical work.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            This YouTube Channel ID Finder converts those public URLs into
            the permanent{" "}
            <span className="font-mono text-sm">UC...</span> channel ID.
          </p>
        </div>
      </section>

      {/* When you need a YouTube channel ID */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            When you need a YouTube channel ID
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            Use the channel ID when you are setting up:
          </p>

          <ul className="mt-8 space-y-3">
            {WHEN_NEEDED.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-lg bg-gray-50/60 p-4 text-sm text-gray-700 leading-relaxed ring-1 ring-gray-100"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-sm text-gray-800 leading-relaxed">
            Handles are good for humans. Channel IDs are better for
            systems.
          </p>
        </div>
      </section>

      {/* Supported input formats */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Supported input formats
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The tool accepts:
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {INPUT_FORMATS.map((f) => (
                <li
                  key={f.format}
                  className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:gap-6"
                >
                  <span className="font-mono text-xs text-gray-800 sm:w-72 sm:shrink-0 sm:text-sm">
                    {f.format}
                  </span>
                  <span className="text-sm text-gray-600 leading-relaxed">
                    {f.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            If you paste a direct{" "}
            <span className="font-mono text-sm">/channel/UC...</span> URL
            or a raw <span className="font-mono text-sm">UC...</span> ID,
            the tool can return the result instantly. For handles, custom
            URLs, user URLs, and video links, it looks up the public page
            metadata and extracts the owning channel ID.
          </p>
        </div>
      </section>

      {/* What you get back */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            What you get back
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The result should show:
          </p>

          <ul className="mt-8 space-y-3">
            {RESULTS.map((r) => (
              <li
                key={r}
                className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed"
              >
                <Copy
                  className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span>{r}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-base text-gray-700 leading-relaxed">
            The RSS feed format is:
          </p>

          <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50/60 p-4">
            <code className="font-mono text-xs text-gray-800 sm:text-sm">
              https://www.youtube.com/feeds/videos.xml?channel_id=UC...
            </code>
          </div>

          <p className="mt-6 text-sm text-gray-600 leading-relaxed">
            That feed is useful when you want to monitor uploads without
            relying on YouTube recommendations or notifications.
          </p>
        </div>
      </section>

      {/* Channel ID vs handle vs video ID */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Channel ID vs handle vs video ID
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            These identifiers are easy to confuse:
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {IDENTIFIERS.map((id) => {
              const c = ACCENT_CLASSES[id.accent];
              return (
                <div
                  key={id.name}
                  className={`rounded-2xl border ${c.ring} ${c.bg} p-5`}
                >
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-wider ${c.label}`}
                  >
                    {id.label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900">
                    {id.name}
                  </p>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {id.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How it works
          </h2>

          <ol className="mt-8 space-y-4">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-sm text-gray-600 leading-relaxed">
            No private account access is required. The channel ID is
            public metadata.
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
              Useful tools after you find a channel ID
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Once you have the permanent channel ID, use it to audit the
              channel, monitor uploads, or inspect individual videos.
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
            Ready to find a channel ID?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Paste a handle, channel URL, or video link and get the
            permanent UC ID in seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Find channel ID
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
