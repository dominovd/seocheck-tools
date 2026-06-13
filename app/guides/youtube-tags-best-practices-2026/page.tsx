import Link from "next/link";
import { GuideLayout } from "@/components/GuideLayout";
import { ExternalLink } from "@/components/ExternalLink";
import { buildMetadata } from "@/lib/seo";
import { getGuideBySlug } from "@/lib/guides-catalog";

const guide = getGuideBySlug("youtube-tags-best-practices-2026")!;

const META_DESCRIPTION =
  "Learn YouTube tags best practices for 2026: when tags matter, how to use the 500-character limit, tag examples, tags vs hashtags, mistakes, and a checklist.";
const OG_DESCRIPTION =
  "A practical guide to YouTube tags in 2026: what tags do, what they do not do, how to choose tags, how many to use, and how to avoid metadata mistakes.";

const base = buildMetadata({
  title: "YouTube Tags Best Practices 2026: What Still Works",
  description: META_DESCRIPTION,
  path: `guides/${guide.slug}`,
  noBrand: true,
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

// HowTo schema covers the 10-step "Quick workflow for tagging a YouTube video"
const HOW_TO_STEPS = [
  {
    name: "Finish the title first",
    text: "A clear title tells you which tags actually fit. Do not start tagging until the title is set.",
  },
  {
    name: "Write the description summary",
    text: "Lock the topic framing in the first lines so tags can support what the description already says.",
  },
  {
    name: "List the primary topic in 2-3 phrases",
    text: "Cover the core topic with two or three natural phrasings, not one repeated keyword.",
  },
  {
    name: "Add 3-5 intent or long-tail phrases",
    text: "Pick phrases that match what the viewer is actually trying to do.",
  },
  {
    name: "Add related metadata terms",
    text: "Use a few surrounding-topic tags so YouTube can place the video in the right neighborhood.",
  },
  {
    name: "Add 1-2 misspellings or variants if useful",
    text: "Only when the topic is commonly misspelled or has well-known alternate names.",
  },
  {
    name: "Remove anything unrelated or too generic",
    text: "If a tag does not describe the video, delete it. Generic one-word tags rarely earn their slot.",
  },
  {
    name: "Keep the total under 500 characters",
    text: "Stay inside the YouTube tag character limit. Counted with spaces and punctuation.",
  },
  {
    name: "Put the most important tags near the front",
    text: "Front-loading helps you stay organized and review the list quickly later.",
  },
  {
    name: "Save a reusable tag set for recurring formats",
    text: "Reviews, tutorials, lists, and series share most tags. Keep a template to save time.",
  },
];

const FAQS = [
  {
    q: "Do YouTube tags still matter in 2026?",
    a: "Yes, but they matter less than titles, thumbnails, descriptions, and viewer satisfaction. Tags are best used for misspellings, alternate names, disambiguation, and supporting topic context.",
  },
  {
    q: "How many tags should I use on YouTube?",
    a: "Most videos do well with 8-15 useful tags. The number matters less than relevance. Do not add weak tags just to fill space.",
  },
  {
    q: "What is the YouTube tag limit?",
    a: "YouTube gives you up to 500 characters for video tags. You do not need to use all 500 characters. A shorter relevant tag set is better than a full box of generic tags.",
  },
  {
    q: "Should I put keywords in YouTube tags?",
    a: "Yes, if they accurately describe the video. Use your main topic, related phrases, long-tail variants, and common misspellings. Avoid unrelated popular keywords.",
  },
  {
    q: "Are YouTube tags the same as hashtags?",
    a: "No. Tags are private metadata in YouTube Studio. Hashtags are public clickable labels in the title or description.",
  },
  {
    q: "Can tags help a new YouTube channel?",
    a: "Tags can help clarify the topic, especially before YouTube has much performance data for the video. They will not make a weak video rank by themselves, but they can support good metadata.",
  },
  {
    q: "Should I copy competitor tags?",
    a: "Use competitor tags for research, not copying. Keep only the tags that accurately describe your video and add your own topic-specific variants.",
  },
  {
    q: "What are the best tags for YouTube Shorts?",
    a: "Use the same principle: relevant topic tags, alternate names, and variants. Do not rely on tags alone for Shorts discovery. The hook, viewer retention, and topic clarity matter more.",
  },
];

type TagBlock = { label: string; tags: string };

const TAG_EXAMPLES: TagBlock[] = [
  {
    label: "YouTube SEO video",
    tags: "youtube seo, youtube seo 2026, youtube tags, youtube tags 2026, youtube metadata, youtube title optimization, youtube description optimization, video seo, youtube seo for beginners, how to rank youtube videos",
  },
  {
    label: "Cooking tutorial",
    tags: "sourdough bread, sourdough bread recipe, sourdough for beginners, no knead sourdough, sourdough starter, beginner bread recipe, homemade bread, bread baking tutorial",
  },
  {
    label: "Tech review",
    tags: "iphone 17 pro review, iphone 17 pro camera, iphone 17 pro battery, iphone 17 pro after 30 days, iphone 17 pro for creators, iphone review 2026, best phone for video creators",
  },
  {
    label: "Software tutorial",
    tags: "notion tutorial, notion setup, notion for beginners, notion productivity, notion workspace, notion project management, notion weekly planning, notion templates",
  },
  {
    label: "Fitness video",
    tags: "home gym, home gym setup, budget home gym, home workout equipment, garage gym, home gym for beginners, strength training at home, small space home gym",
  },
];

export default function YouTubeTagsBestPracticesPage() {
  return (
    <GuideLayout
      guide={guide}
      howToSteps={HOW_TO_STEPS}
      howToTotalTimeISO="PT8M"
      faqs={FAQS}
    >
      <p>
        YouTube tags are no longer the ranking shortcut many creators
        hoped they were. They will not rescue a weak title, a confusing
        thumbnail, or a video that does not satisfy viewers.
      </p>
      <p>But tags are not useless either.</p>
      <p>In 2026, the best way to think about YouTube tags is simple:</p>
      <blockquote>
        Tags are support metadata. They help YouTube understand edge
        cases, variants, misspellings, and ambiguous topics.
      </blockquote>
      <p>
        They are not the main discovery lever. Your title, thumbnail,
        description, topic clarity, and viewer response matter more.
        Still, because tags take only a few minutes and cost nothing, they
        are worth doing well.
      </p>
      <p>
        This guide explains what YouTube tags do, what they do not do,
        how to choose tags, how to use the 500-character limit, how tags
        differ from hashtags, and how to build a clean tag set before
        publishing.
      </p>
      <p>
        Use the{" "}
        <Link href="/tools/youtube-tag-generator">YouTube Tag Generator</Link>{" "}
        when you need tag ideas, and the{" "}
        <Link href="/tools/youtube-tag-extractor">YouTube Tag Extractor</Link>{" "}
        when you want to inspect tags from a public video.
      </p>

      {/* Table of contents */}
      <nav
        aria-label="Table of contents"
        className="not-prose my-8 rounded-2xl border border-gray-200 bg-gray-50/60 p-5 sm:p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          In this guide
        </p>
        <ol className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {[
            { href: "#do-tags-matter", label: "Do YouTube tags still matter?" },
            { href: "#what-tags-do", label: "What YouTube tags actually do" },
            { href: "#tags-vs-hashtags", label: "Tags vs hashtags" },
            { href: "#character-limit", label: "The 500-character limit" },
            { href: "#how-many", label: "How many tags should you use?" },
            { href: "#best-mix", label: "The best tag mix for most videos" },
            { href: "#examples", label: "YouTube tag examples by niche" },
            { href: "#research-competitors", label: "How to research competitor tags" },
            { href: "#mistakes", label: "Common YouTube tag mistakes" },
            { href: "#workflow", label: "Quick workflow for tagging a video" },
            { href: "#checklist", label: "YouTube tags checklist" },
            { href: "#faq", label: "FAQ" },
          ].map((item) => (
            <li key={item.href} className="text-sm">
              <a
                href={item.href}
                className="text-gray-700 hover:text-brand-700 transition"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <h2 id="do-tags-matter">Do YouTube tags still matter?</h2>
      <p>Yes, but not in the old way.</p>
      <p>
        Older YouTube SEO advice treated tags like a ranking engine. Add
        enough tags, hit enough keyword variants, and the video would
        rank. That is not how YouTube discovery works today.
      </p>
      <p>Tags are now best used as a clarification layer. They help YouTube understand:</p>
      <ul>
        <li>Common misspellings.</li>
        <li>Alternate names.</li>
        <li>Closely related topic variants.</li>
        <li>Ambiguous words.</li>
        <li>Supporting long-tail phrases.</li>
      </ul>
      <p>
        YouTube&apos;s own{" "}
        <ExternalLink href="https://support.google.com/youtube/answer/146402">
          Help guidance
        </ExternalLink>{" "}
        says tags can be useful if the content is commonly misspelled, but
        that the video&apos;s title, thumbnail, and description are more
        important for discovery.
      </p>
      <p>That is the right mental model: tags help, but they are not the core strategy.</p>

      <h2 id="what-tags-do">What YouTube tags actually do</h2>
      <p>
        Tags live in YouTube Studio as private metadata. Viewers do not
        see them on the watch page.
      </p>
      <p>Use tags for four main jobs.</p>

      <h3>1. Misspellings</h3>
      <p>
        Some topics are often misspelled. You probably do not want typos
        in your title, but tags can cover them.
      </p>
      <p>Example:</p>
      <blockquote>
        <strong>Correct phrase:</strong> DaVinci Resolve color grading
        <br />
        <strong>Useful tag variants:</strong> davinci resolve color
        grading, davinchi resolve, davinci color grading, resolve color
        grading
      </blockquote>

      <h3>2. Alternate names</h3>
      <p>Some topics have multiple names or shorthand versions.</p>
      <p>Example:</p>
      <blockquote>
        <strong>Primary phrase:</strong> YouTube search engine optimization
        <br />
        <strong>Useful tags:</strong> youtube seo, yt seo, youtube search
        optimization, youtube video seo
      </blockquote>

      <h3>3. Disambiguation</h3>
      <p>Some words mean different things in different contexts.</p>
      <ul>
        <li>
          <strong>Java</strong> — could mean the programming language or
          coffee.
        </li>
        <li>
          <strong>Mercury</strong> — could mean the planet, the element,
          the car brand, or a person.
        </li>
        <li>
          <strong>Python</strong> — could mean the programming language or
          the snake.
        </li>
      </ul>
      <p>Tags can help clarify which meaning fits your video.</p>

      <h3>4. Supporting long-tail phrases</h3>
      <p>
        If a phrase is relevant but too awkward for the title, it may fit
        naturally as a tag.
      </p>
      <p>Example:</p>
      <blockquote>
        <strong>Title:</strong> How to Write YouTube Titles That Get
        Clicks in 2026
        <br />
        <strong>Possible tags:</strong> youtube title tips, youtube title
        seo, how to write youtube titles, youtube titles that get clicks,
        youtube title examples
      </blockquote>

      <h3>What YouTube tags do not do</h3>
      <p>Tags do not:</p>
      <ul>
        <li>Replace a clear title.</li>
        <li>Replace a useful description.</li>
        <li>Improve click-through rate directly.</li>
        <li>Make unrelated topics rank.</li>
        <li>Work like public hashtags.</li>
        <li>Justify keyword stuffing.</li>
      </ul>
      <p>
        If the video is about sourdough bread, tags like{" "}
        <code>mrbeast</code>, <code>minecraft</code>, or{" "}
        <code>iphone review</code> do not help. They confuse the metadata
        and can make the video look misleading.
      </p>

      <h2 id="tags-vs-hashtags">Tags vs hashtags</h2>
      <p>
        Creators often confuse tags and hashtags, but they are different.
      </p>

      {/* Tags vs hashtags side-by-side */}
      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
            YouTube tags
          </p>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            Private metadata in YouTube Studio. They help classify the
            video behind the scenes.
          </p>
          <ul className="mt-4 space-y-1.5">
            {[
              "youtube seo",
              "youtube tags",
              "youtube tag generator",
              "youtube metadata",
              "video seo",
            ].map((t) => (
              <li
                key={t}
                className="rounded-md bg-gray-50 px-3 py-1.5 text-xs font-mono text-gray-800 ring-1 ring-gray-100"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
            YouTube hashtags
          </p>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            Public and clickable. They usually appear in the title or
            description.
          </p>
          <ul className="mt-4 space-y-1.5">
            {["#YouTubeSEO", "#ContentCreator", "#VideoMarketing"].map(
              (t) => (
                <li
                  key={t}
                  className="rounded-md bg-white px-3 py-1.5 text-xs font-mono text-brand-700 ring-1 ring-brand-100"
                >
                  {t}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>

      <p>
        Use tags for metadata clarity. Use hashtags for public topic
        labels. You can use both, but they should not be treated as the
        same thing.
      </p>
      <p>
        Use the{" "}
        <Link href="/tools/youtube-hashtag-generator">Hashtag Generator</Link>{" "}
        when you need public hashtags for a description.
      </p>

      <h2 id="character-limit">The 500-character limit</h2>
      <p>YouTube gives you up to 500 characters for tags.</p>
      <p>
        That limit includes spaces and punctuation, so it is easy to
        waste space with weak tags. You do not need to fill every
        character. A clean set of relevant tags is better than a full box
        of generic ones.
      </p>

      {/* Weak vs better tag sets */}
      <div className="not-prose my-8 grid gap-4">
        <div className="rounded-2xl border border-red-100 bg-red-50/40 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
            Weak tag set
          </p>
          <p className="mt-2 font-mono text-xs text-gray-700 leading-relaxed">
            youtube, video, viral, trending, best, tips, tutorial, how to,
            new, 2026, content, creator
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
            Better tag set
          </p>
          <p className="mt-2 font-mono text-xs text-gray-800 leading-relaxed">
            youtube tags, youtube tags 2026, youtube tag best practices,
            youtube video tags, youtube metadata, youtube seo tags, how to
            tag youtube videos, youtube tags vs hashtags
          </p>
        </div>
      </div>

      <p>The better set is more specific and easier for YouTube to interpret.</p>

      <h2 id="how-many">How many YouTube tags should you use?</h2>
      <p>
        There is no perfect number. For most videos,{" "}
        <strong>8-15 useful tags</strong> is a good working range.
      </p>
      <p>Use fewer tags when the topic is simple and clear. Use more tags when the topic has:</p>
      <ul>
        <li>Multiple names.</li>
        <li>Common misspellings.</li>
        <li>Several long-tail variants.</li>
        <li>Ambiguous terms.</li>
        <li>A technical or niche vocabulary.</li>
      </ul>
      <p>Do not add tags just to hit a count. Every tag should have a job.</p>

      <h2 id="best-mix">The best tag mix for most videos</h2>
      <p>A practical tag set usually includes four groups.</p>

      <h3>1. Primary topic tags</h3>
      <p>These describe the main topic.</p>
      <blockquote>youtube tags, youtube tags 2026, youtube video tags</blockquote>

      <h3>2. Intent tags</h3>
      <p>These match what the viewer is trying to do.</p>
      <blockquote>
        how to tag youtube videos, youtube tag best practices, youtube
        tags for seo
      </blockquote>

      <h3>3. Related metadata tags</h3>
      <p>These clarify the surrounding topic.</p>
      <blockquote>
        youtube metadata, youtube seo, video seo, youtube tags vs hashtags
      </blockquote>

      <h3>4. Variant or misspelling tags</h3>
      <p>These cover alternate wording.</p>
      <blockquote>yt tags, yt seo tags, youtube tag optimization</blockquote>

      <p>
        You do not need the same number from each group. The point is
        balance: broad enough to place the topic, specific enough to
        avoid noise.
      </p>

      <h2 id="examples">YouTube tag examples by niche</h2>

      <div className="not-prose my-8 grid gap-3">
        {TAG_EXAMPLES.map((ex) => (
          <div
            key={ex.label}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
              {ex.label}
            </p>
            <p className="mt-2 font-mono text-xs text-gray-700 leading-relaxed">
              {ex.tags}
            </p>
          </div>
        ))}
      </div>

      <h2 id="research-competitors">How to research competitor tags</h2>
      <p>
        Competitor tags can help you understand how similar videos are
        labeled.
      </p>
      <p>Use them for research, not blind copying.</p>
      <p>Workflow:</p>
      <ol>
        <li>Find 3-5 videos that match your topic closely.</li>
        <li>
          Run each URL through the{" "}
          <Link href="/tools/youtube-tag-extractor">Tag Extractor</Link>.
        </li>
        <li>Look for repeated tags across multiple videos.</li>
        <li>Separate broad tags from specific tags.</li>
        <li>Keep only tags that accurately describe your video.</li>
        <li>Add your own variants and misspellings where useful.</li>
      </ol>
      <p>
        Do not copy every competitor tag. Their video may have a different
        angle, audience, or format. Tags should describe your video, not
        just the niche.
      </p>

      <h2 id="mistakes">Common YouTube tag mistakes</h2>

      <h3>1. Using unrelated trending tags</h3>
      <p>
        Do not add popular names, creators, games, products, or trends
        unless they are actually part of the video.
      </p>
      <p>
        <strong>Bad example:</strong>{" "}
        <code>mrbeast, minecraft, iphone, viral, shorts</code> on a video
        about sourdough bread.
      </p>

      <h3>2. Repeating the same phrase too many ways</h3>
      <p>Some variation is fine. Repetition is not.</p>
      <p>
        <strong>Weak:</strong>{" "}
        <code>
          youtube tags, tags youtube, youtube video tags, video youtube
          tags, tags for youtube video, youtube tags video
        </code>
      </p>
      <p>
        <strong>Better:</strong>{" "}
        <code>
          youtube tags, youtube tag best practices, youtube metadata,
          youtube tags vs hashtags, how to tag youtube videos
        </code>
      </p>

      <h3>3. Adding generic one-word tags</h3>
      <p>
        Generic tags like <code>video</code>, <code>tips</code>,{" "}
        <code>best</code>, <code>new</code>, or <code>tutorial</code>{" "}
        usually do not add much on their own.
      </p>
      <p>Use phrases that describe the actual topic.</p>

      <h3>4. Ignoring misspellings when they matter</h3>
      <p>
        If your topic includes a brand, product, technical term, or
        foreign word that people often misspell, add one or two common
        variants.
      </p>

      <h3>5. Treating tags as a substitute for the title</h3>
      <p>
        If the main topic is not clear in the title or description, tags
        are not enough. Fix the visible metadata first.
      </p>

      <h3>6. Confusing tags with hashtags</h3>
      <p>
        Tags go in the private Tags field. Hashtags go in the title or
        description with <code>#</code>.
      </p>

      <h2 id="workflow">Quick workflow for tagging a YouTube video</h2>

      <ol className="not-prose my-6 space-y-3">
        {HOW_TO_STEPS.map((step, i) => (
          <li
            key={step.name}
            id={`step-${i + 1}`}
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

      <p>Total time once you have a workflow: about 2-3 minutes.</p>

      <h2 id="checklist">YouTube tags checklist</h2>
      <p>Before publishing, check:</p>
      <ul>
        <li>Does every tag describe the video?</li>
        <li>Is the main topic represented?</li>
        <li>Are there useful long-tail variants?</li>
        <li>Are common misspellings covered if relevant?</li>
        <li>Did you avoid unrelated trending terms?</li>
        <li>Did you avoid generic one-word tags?</li>
        <li>Are tags and hashtags separated correctly?</li>
        <li>Are you under the 500-character limit?</li>
        <li>
          Would the tag set still make sense if someone read it out loud?
        </li>
      </ul>
      <p>
        If yes, you are done. Do not over-optimize tags for another 20
        minutes.
      </p>

      <h2>Recommended tool workflow</h2>
      <p>For faster tagging:</p>
      <ol>
        <li>
          Use <Link href="/tools/youtube-keyword-tool">Keyword Tool</Link>{" "}
          to find phrases people search.
        </li>
        <li>
          Use <Link href="/tools/youtube-tag-extractor">Tag Extractor</Link>{" "}
          to inspect similar videos.
        </li>
        <li>
          Use <Link href="/tools/youtube-tag-generator">Tag Generator</Link>{" "}
          to build a clean tag set.
        </li>
        <li>
          Use{" "}
          <Link href="/tools/youtube-hashtag-generator">Hashtag Generator</Link>{" "}
          for public hashtags.
        </li>
        <li>
          Use <Link href="/tools/youtube-video-audit">Video Audit</Link>{" "}
          after publishing to check metadata quality.
        </li>
      </ol>

      <h2 id="faq">FAQ</h2>
      <dl className="not-prose mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
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

      <h2>Closing</h2>
      <p>YouTube tags are not magic, but they are still worth doing.</p>
      <p>
        The right tag set will not turn a bad video into a winner. It
        can, however, help YouTube understand the topic more clearly,
        especially when the wording is ambiguous, misspelled, technical,
        or niche-specific.
      </p>
      <p>
        Keep tags relevant, specific, and clean. Then move on to the
        parts that carry more weight: topic, title, thumbnail,
        description, and the video itself.
      </p>
    </GuideLayout>
  );
}
