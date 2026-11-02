import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { TagGeneratorTool } from "@/components/tools/TagGeneratorTool";
import { FaqSchema } from "@/components/PageSchemas";
import { TagExampleButton } from "@/components/tools/TagExampleButton";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";
import { TAG_EXAMPLES } from "@/lib/youtube/tag-examples";
import { TAG_PASTE_ORDER, type TagGroupId } from "@/lib/youtube/tag-groups";
import { totalTagChars } from "@/lib/youtube/extract-tags";

const tool = getToolBySlug("youtube-tag-generator")!;

const PAGE_TITLE = "Free YouTube Tag Generator";
const META_DESCRIPTION =
  "Free AI YouTube tag generator. Get tags grouped into primary, long-tail, broad and spelling variants, pick the ones that fit, and stay under the 500-character limit.";
const OG_DESCRIPTION =
  "Generate a clean YouTube tag list for any video topic, with relevant broad, specific, and long-tail tags ready for YouTube Studio.";

const base = buildMetadata({
  title: "Free YouTube Tag Generator | AI Video Tags",
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
  "Get tags grouped by the job each tag does, keep the ones that fit your video and copy them into YouTube Studio.";

const HERO_FACTS = ["Free, no signup", "15 generations a day", "Checks the 500-character limit"];

const GOOD_LIST = [
  {
    n: "01",
    name: "Primary keyword",
    body: "The exact topic in the words viewers search with. Include the product, tool or game name here.",
    tags: ["sourdough bread for beginners"],
  },
  {
    n: "02",
    name: "Specific searches",
    body: "Long-tail questions and alternate ways viewers describe the same topic.",
    tags: ["how to make sourdough starter", "no knead sourdough"],
  },
  {
    n: "03",
    name: "Spelling variants",
    body: "Real misspellings, spacing and acronyms. YouTube says this is where tags help most.",
    tags: ["sour dough", "homeworkout"],
  },
  {
    n: "04",
    name: "Broad topic",
    body: "One or two terms that place the video in its topic. Keep them last.",
    tags: ["baking"],
  },
];

const EXAMPLE_CHIP: Record<TagGroupId, string> = {
  primary: "border-brand-300 bg-brand-50 text-brand-800",
  specific: "border-gray-200 bg-white text-gray-700",
  variants: "border-gray-200 bg-gray-100 text-gray-700",
  broad: "border-indigo-100 bg-indigo-50 text-indigo-800",
};

const EXAMPLE_LEGEND: { id: TagGroupId; label: string; dot: string }[] = [
  { id: "primary", label: "Primary", dot: "bg-brand-500" },
  { id: "specific", label: "Specific", dot: "border border-gray-300 bg-white" },
  { id: "variants", label: "Spelling", dot: "bg-gray-200" },
  { id: "broad", label: "Broad", dot: "bg-indigo-200" },
];

const INPUT_PAIRS = [
  {
    weak: "fitness",
    better: "20-minute no-equipment home workout for beginners trying to lose weight",
  },
  {
    weak: "camera review",
    better: "Sony ZV-E10 II review for beginner YouTubers choosing their first camera",
  },
];

const WORKFLOW = [
  { title: "Find the wording", body: "shows what people type on YouTube.", tool: { name: "Keyword Tool", href: "/tools/youtube-keyword-tool" } },
  { title: "Generate tags", body: "Start from your topic here, keep what fits.", current: true },
  { title: "Check competitors", body: "Open 3 to 5 similar videos and take only terms that fit.", tool: { name: "Tag Extractor", href: "/tools/youtube-tag-extractor" } },
  { title: "Trim", body: "Drop duplicates and weak broad tags until you are under 500." },
  { title: "Paste", body: "Copy the comma list into YouTube Studio." },
];

const CHAIN = [
  { stage: "Research", name: "Keyword Tool", body: "Search phrases", href: "/tools/youtube-keyword-tool" },
  { stage: "Optimize", name: "Tag Generator", body: "You are here", current: true },
  { stage: "Research", name: "Tag Extractor", body: "Competitor tags", href: "/tools/youtube-tag-extractor" },
  { stage: "Optimize", name: "Title Generator", body: "Title options", href: "/tools/youtube-title-generator" },
  { stage: "Publish", name: "Description Generator", body: "Full description", href: "/tools/youtube-description-generator" },
  { stage: "Optimize", name: "Hashtag Generator", body: "Visible hashtags", href: "/tools/youtube-hashtag-generator" },
];

const FAQS = [
  {
    q: "Is this YouTube Tag Generator free?",
    a: "Yes. You get 15 generations a day per IP with no signup, paid account, or browser extension. The examples on this page do not count toward the limit.",
  },
  {
    q: "How many YouTube tags should I use?",
    a: "Use as many accurate tags as you need while staying under YouTube's 500-character limit. A focused set of relevant tags is better than a long list of weak or unrelated terms. Drop any generated tag that describes a different video.",
  },
  {
    q: "Does tag order matter on YouTube?",
    a: "It is safest to place your most important tags first. Start with the exact topic and close variants, then add specific and long-tail phrases.",
  },
  {
    q: "What is the 500-character tag limit?",
    a: "YouTube's tag field supports up to 500 characters total. That includes all tags and separators. The counter under your result follows your selection, so you can see what fits before you paste.",
  },
  {
    q: "Can this generate tags for YouTube Shorts?",
    a: "Yes. Enter the Shorts topic the same way you would describe a regular video. Keep in mind that Shorts discovery relies heavily on viewer behavior, captions, audio, and topic relevance, so tags are only a supporting signal.",
  },
  {
    q: "Should I copy competitor tags?",
    a: "No. Use competitor tags as research, not as a list to copy blindly. Copy only terms that accurately match your own video, and combine them with tags generated from your actual topic.",
  },
  {
    q: "What is the difference between tags and hashtags?",
    a: "Tags are hidden metadata entered in YouTube Studio. Hashtags are visible clickable terms in the description or title. Use Tag Generator for hidden tags and Hashtag Generator for visible hashtags.",
  },
];

export default function YouTubeTagGeneratorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout
        tool={tool}
        variant="wide"
        titleOverride={PAGE_TITLE}
        subtitleOverride={HERO_SUBTITLE}
        schemaDescriptionOverride={META_DESCRIPTION}
        facts={HERO_FACTS}
      >
        <TagGeneratorTool />
      </ToolLayout>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* What a good YouTube tag list looks like */}
        <section className="py-14 sm:py-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            What a good YouTube tag list looks like
          </h2>
          <p className="mt-3 max-w-2xl text-base text-gray-600 leading-relaxed">
            Tags support your title and description. The generator builds them in four groups, in
            the order you paste them.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GOOD_LIST.map((g) => (
              <div key={g.n} className="rounded-xl border border-gray-200 p-5">
                <p className="font-mono text-xs font-semibold text-brand-700">{g.n}</p>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{g.name}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{g.body}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.tags.map((t) => (
                    <span key={t} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 border-l-2 border-red-300 pl-3 text-sm text-gray-700">
            <strong>Skip:</strong> tags that describe a different video, unrelated celebrity names,
            trend tags, &quot;viral&quot;, &quot;funny&quot;. They make the metadata less trustworthy.
          </p>
        </section>

        {/* YouTube tag examples by topic */}
        <section className="border-t border-gray-100 py-14 sm:py-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            YouTube tag examples by topic
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Built the same way the generator builds yours, in paste order.
          </p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {TAG_EXAMPLES.map((ex) => {
              const off = new Set(ex.off);
              const items = TAG_PASTE_ORDER.flatMap((id) =>
                ex.groups[id].filter((t) => !off.has(t)).map((t) => ({ id, t }))
              );
              return (
                <div key={ex.id} className="flex flex-col rounded-xl border border-gray-200 p-5">
                  <h3 className="text-base font-semibold text-gray-900">{ex.label}</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {items.map(({ id, t }) => (
                      <li key={t} className={`rounded-md border px-2 py-1 text-[13px] ${EXAMPLE_CHIP[id]}`}>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm text-gray-500">
                    <span>
                      {items.length} tags · {totalTagChars(items.map((i) => i.t))} of 500
                    </span>
                    <TagExampleButton id={ex.id} />
                  </div>
                </div>
              );
            })}
          </div>
          <ul className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600" aria-label="Legend">
            {EXAMPLE_LEGEND.map((l) => (
              <li key={l.id} className="inline-flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-sm ${l.dot}`} aria-hidden="true" />
                {l.label}
              </li>
            ))}
          </ul>
        </section>

        {/* Do YouTube tags still matter? */}
        <section className="border-t border-gray-100 py-14 sm:py-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Do YouTube tags still matter?
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Not much for ranking</h3>
              <p className="mt-2 text-base text-gray-600 leading-relaxed">
                Title, thumbnail, topic fit and how viewers respond carry the weight. Tags will not
                save a weak video or make an unrelated topic rank.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">They still help with</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-gray-600">
                <li>misspellings and acronyms</li>
                <li>ambiguous topics and alternate wording</li>
                <li>product names and search edge cases</li>
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Get better tags with better input</h3>
              <dl className="mt-3 space-y-3">
                {INPUT_PAIRS.map((p) => (
                  <div key={p.weak} className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
                    <dt className="font-mono text-xs font-semibold text-red-700">WEAK</dt>
                    <dd className="text-gray-500 line-through">{p.weak}</dd>
                    <dt className="font-mono text-xs font-semibold text-brand-700">BETTER</dt>
                    <dd className="text-gray-800">{p.better}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Order and the 500-character limit</h3>
              <p className="mt-2 text-base text-gray-600 leading-relaxed">
                YouTube allows 500 characters in the tag field, commas included. Put the exact topic
                first, spelling variants and broad terms last. Do not spend the first tags on your
                channel name.
              </p>
            </div>
          </div>
        </section>

        {/* The full tag workflow */}
        <section className="border-t border-gray-100 py-14 sm:py-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            The full tag workflow
          </h2>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {WORKFLOW.map((s, i) => (
              <li
                key={s.title}
                className={`rounded-xl border p-4 ${s.current ? "border-brand-300 bg-brand-50" : "border-gray-200"}`}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-600 leading-snug">
                  {s.tool && (
                    <>
                      <Link href={s.tool.href} className="font-semibold text-brand-700 hover:text-brand-800">
                        {s.tool.name}
                      </Link>{" "}
                    </>
                  )}
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="border-t border-gray-100 py-14 sm:py-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-6 max-w-3xl divide-y divide-gray-200 border-y border-gray-200">
            {FAQS.map((item, i) => (
              <details
                key={item.q}
                open={i === 0}
                className="group py-4 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-3 text-base font-semibold text-gray-900">
                  <span>{item.q}</span>
                  <span className="text-gray-400 group-open:hidden" aria-hidden="true">+</span>
                  <span className="hidden text-gray-400 group-open:inline" aria-hidden="true">−</span>
                </summary>
                <p className="mt-2 text-base text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Finish your video metadata */}
        <section className="border-t border-gray-100 py-14 sm:py-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Finish your video metadata
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CHAIN.map((c) => {
              const inner = (
                <>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{c.stage}</span>
                  <span className="mt-1 block text-sm font-semibold text-gray-900">{c.name}</span>
                  <span className="mt-1 block text-sm text-gray-600">{c.body}</span>
                </>
              );
              return (
                <li key={c.name}>
                  {c.current ? (
                    <div aria-current="page" className="h-full rounded-xl border border-brand-300 bg-brand-50 p-4">
                      {inner}
                    </div>
                  ) : (
                    <Link href={c.href!} className="block h-full rounded-xl border border-gray-200 p-4 hover:border-brand-300 transition">
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-5">
            <Link
              href="/guides/youtube-tags-best-practices-2026"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Read: YouTube Tags Best Practices 2026
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          </p>
        </section>

        {/* Final CTA */}
        <section className="border-t border-gray-100 py-14 text-center sm:py-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Ready to generate your YouTube tags?
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Enter your topic and keep the tags that fit your video.
          </p>
          <a
            href="#tag-tool"
            className="mt-6 inline-flex h-12 items-center gap-1.5 rounded-lg bg-brand-600 px-6 text-[15px] font-semibold text-white hover:bg-brand-700 transition"
          >
            Generate tags
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </a>
        </section>
      </div>
    </>
  );
}
