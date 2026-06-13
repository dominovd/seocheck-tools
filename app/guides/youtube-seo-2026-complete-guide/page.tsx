import Link from "next/link";
import Image from "next/image";
import { GuideLayout } from "@/components/GuideLayout";
import { buildMetadata } from "@/lib/seo";
import { getGuideBySlug } from "@/lib/guides-catalog";

const guide = getGuideBySlug("youtube-seo-2026-complete-guide")!;

const META_DESCRIPTION =
  "Learn YouTube SEO in 2026: how to choose topics, write better titles and descriptions, optimize thumbnails, use tags and chapters, and audit videos after publishing.";
const OG_DESCRIPTION =
  "A practical YouTube SEO guide for 2026: topic research, titles, thumbnails, descriptions, tags, chapters, retention, analytics, and post-publish optimization.";

const base = buildMetadata({
  title: "YouTube SEO in 2026: Complete Guide to Ranking Videos",
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

const HOW_TO_STEPS = [
  {
    name: "Choose a clear topic",
    text: "Pick a specific topic so YouTube can place the video and viewers can decide whether it is for them. Write a one-sentence topic statement before drafting the title.",
  },
  {
    name: "Validate demand before recording",
    text: "Check whether people are searching for the topic, whether current videos earn meaningful views, and whether smaller channels can break through.",
  },
  {
    name: "Write a title people understand and want to click",
    text: "A good title helps both YouTube and the viewer understand the topic while giving a reason to click. Keep titles readable on mobile, often around 40-70 characters.",
  },
  {
    name: "Build the thumbnail and title together",
    text: "Treat title and thumbnail as one piece of packaging. Do not repeat the same words; let the title carry the searchable promise and the thumbnail add a fast visual reason to care.",
  },
  {
    name: "Write a useful description",
    text: "Open with a useful first sentence, summarize what the viewer will learn, add chapters and key links, and use natural language instead of keyword dumps.",
  },
  {
    name: "Use tags for disambiguation, not magic ranking",
    text: "Use tags for misspellings, alternate names, and closely related variants. Do not dump unrelated popular keywords.",
  },
  {
    name: "Add chapters when they help the viewer",
    text: "Use chapters when the video has clear sections, viewers may want to jump to a part, or the video is long enough that navigation improves the experience.",
  },
  {
    name: "Publish with the first 48 hours in mind",
    text: "Confirm packaging matches the video, watch CTR, retention, and traffic sources after publish, and avoid making multiple changes at once.",
  },
  {
    name: "Audit and improve after publishing",
    text: "Build a feedback loop: if CTR is low, test the title or thumbnail. If retention drops early, improve the hook. If search traffic is low, improve topic clarity. If browse traffic is low, study packaging and viewer satisfaction.",
  },
];

const FAQS = [
  {
    q: "Does YouTube SEO still matter in 2026?",
    a: "Yes. YouTube SEO still matters because YouTube needs to understand what a video is about and who should see it. What changed is that metadata alone is not enough. Titles, thumbnails, retention, satisfaction, and topic clarity all work together.",
  },
  {
    q: "What is the most important YouTube SEO factor?",
    a: "There is no single factor that works in isolation. The strongest practical combination is a clear topic, clickable title and thumbnail, accurate metadata, and a video that satisfies the viewer who clicked.",
  },
  {
    q: "Do YouTube tags still matter?",
    a: "Tags matter less than many older guides suggest. Use them for misspellings, alternate names, and disambiguation. Do not expect tags to make an unrelated or weakly packaged video rank.",
  },
  {
    q: "How long should a YouTube title be?",
    a: "There is no perfect title length, but many effective titles are short enough to read quickly on mobile. A practical range is often 40-70 characters. Clarity matters more than hitting an exact number.",
  },
  {
    q: "Should I update titles and thumbnails after publishing?",
    a: "Yes, if the data suggests packaging is underperforming. If CTR is weak and retention is decent, a title or thumbnail test can help. Change one major element at a time so you can learn from the result.",
  },
  {
    q: "Do descriptions help YouTube rankings?",
    a: "Descriptions help YouTube and viewers understand the video. They are not a magic ranking factor, but a clear description supports relevance, search matching, and viewer trust.",
  },
  {
    q: "Are hashtags useful on YouTube?",
    a: "Hashtags can help categorize content and create clickable topic paths, but they should be relevant and limited. The first few hashtags matter most because YouTube may show them more prominently.",
  },
  {
    q: "What should a beginner optimize first?",
    a: "Start with topic clarity, title, and thumbnail. Those determine whether YouTube can place the video and whether viewers choose to click. Then improve the description, tags, chapters, and post-publish audit process.",
  },
];

export default function YouTubeSeoCompleteGuidePage() {
  return (
    <GuideLayout
      guide={guide}
      howToSteps={HOW_TO_STEPS}
      howToTotalTimeISO="PT15M"
      faqs={FAQS}
    >
      <p>
        YouTube SEO in 2026 is not just about adding keywords to a title.
        Keywords still matter, but they are only one part of a larger
        system: YouTube needs to understand what your video is about,
        viewers need to want to click it, and the video needs to satisfy
        the people who do click.
      </p>

      <p>The short version:</p>

      <blockquote>
        YouTube SEO = clear topic + strong packaging + helpful metadata +
        satisfied viewers.
      </blockquote>

      <p>
        If your topic is vague, YouTube has trouble placing the video. If
        your title and thumbnail are weak, people do not click. If the
        video fails to deliver on the promise, retention drops and YouTube
        has less reason to keep recommending it.
      </p>

      <p>
        This guide walks through the full workflow: choosing a topic,
        validating demand, writing titles, designing thumbnails, using
        descriptions and tags, adding chapters, watching early analytics,
        and improving videos after publish.
      </p>

      <nav
        aria-label="Table of contents"
        className="not-prose my-8 rounded-2xl border border-gray-200 bg-gray-50/60 p-5 sm:p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          In this guide
        </p>

        <div className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          <a
            href="#what-changed"
            className="text-sm text-gray-700 hover:text-brand-700 transition"
          >
            What changed in YouTube SEO in 2026
          </a>
          <a
            href="#how-discovery-works"
            className="text-sm text-gray-700 hover:text-brand-700 transition"
          >
            How YouTube discovery works
          </a>
        </div>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          9-step workflow
        </p>
        <ol className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {[
            { href: "#step-1", label: "Choose a clear topic" },
            { href: "#step-2", label: "Validate demand before recording" },
            { href: "#step-3", label: "Write a title people want to click" },
            { href: "#step-4", label: "Build thumbnail and title together" },
            { href: "#step-5", label: "Write a useful description" },
            { href: "#step-6", label: "Use tags for disambiguation" },
            { href: "#step-7", label: "Add chapters when they help" },
            { href: "#step-8", label: "Publish with the first 48 hours in mind" },
            { href: "#step-9", label: "Audit and improve after publishing" },
          ].map((item, i) => (
            <li key={item.href} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-mono font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                {i + 1}
              </span>
              <a
                href={item.href}
                className="text-gray-700 hover:text-brand-700 transition"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>

        <div className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          <a
            href="#checklist"
            className="text-sm text-gray-700 hover:text-brand-700 transition"
          >
            YouTube SEO checklist
          </a>
          <a
            href="#workflow"
            className="text-sm text-gray-700 hover:text-brand-700 transition"
          >
            Recommended tool workflow
          </a>
          <a
            href="#faq"
            className="text-sm text-gray-700 hover:text-brand-700 transition"
          >
            FAQ
          </a>
        </div>
      </nav>

      <h2 id="what-changed">What changed in YouTube SEO in 2026</h2>
      <p>
        The fundamentals are stable: YouTube still needs to match videos
        with viewers and keep those viewers satisfied. What changed is the
        amount of competition around every topic.
      </p>
      <p>
        In 2026, creators are publishing with better tools, faster AI
        workflows, stronger thumbnails, and more aggressive topic
        research. That raises the baseline. A generic video with a
        keyword-stuffed title is easier to ignore because viewers have
        better alternatives.
      </p>
      <p>The biggest practical shifts:</p>
      <ol>
        <li>
          <strong>Packaging matters earlier.</strong> Your title and
          thumbnail shape whether YouTube can get enough early viewer
          behavior to evaluate the video.
        </li>
        <li>
          <strong>Specific topics beat broad topics.</strong> A precise
          topic gives YouTube a clearer audience and gives viewers a
          clearer reason to click.
        </li>
        <li>
          <strong>AI-generated content needs a real angle.</strong> AI
          can help with titles, descriptions, outlines, and ideation, but
          generic AI content blends into the background.
        </li>
        <li>
          <strong>Metadata is a support signal.</strong> Titles,
          descriptions, tags, captions, hashtags, and chapters help
          YouTube understand the video, but they cannot rescue weak
          viewer response.
        </li>
        <li>
          <strong>Post-publish iteration matters.</strong> Updating a
          weak title or thumbnail after real data comes in is part of
          modern YouTube SEO.
        </li>
      </ol>

      <h2 id="how-discovery-works">How YouTube discovery works</h2>
      <p>
        YouTube discovery is not one ranking system. Your video can appear
        in several places:
      </p>
      <ul>
        <li>YouTube Search</li>
        <li>Home feed</li>
        <li>Suggested videos</li>
        <li>Shorts feed</li>
        <li>Channel pages</li>
        <li>External Google results</li>
      </ul>
      <p>
        For SEO, the two big mental models are <strong>Search</strong> and{" "}
        <strong>Browse</strong>.
      </p>
      <p>
        Search starts with a query. Someone types a phrase into YouTube,
        and YouTube tries to return videos that match the intent. Metadata
        is especially important here: title, description, captions,
        chapters, and other context help YouTube understand relevance.
      </p>
      <p>
        Browse starts with the viewer. YouTube decides what to recommend
        based on viewer interests and behavior. Packaging and satisfaction
        signals matter heavily here: whether people click, how long they
        watch, whether they keep watching YouTube after your video, and
        whether similar viewers respond well.
      </p>
      <p>The best videos usually satisfy both:</p>
      <ul>
        <li>Search understands what the video is about.</li>
        <li>Browse sees that the right viewers respond well.</li>
      </ul>

      <h2 id="step-1">Step 1: Choose a clear topic</h2>
      <p>Every SEO decision gets easier when the topic is specific.</p>
      <p>
        <strong>Weak topic:</strong> Productivity apps
      </p>
      <p>
        <strong>Stronger topic:</strong> Best productivity apps for solo
        founders who manage clients, notes, and weekly planning
      </p>
      <p>
        <strong>Weak topic:</strong> Camera review
      </p>
      <p>
        <strong>Stronger topic:</strong> Sony ZV-E10 II review for
        beginner YouTubers filming indoors
      </p>
      <p>A clear topic does three things:</p>
      <ul>
        <li>It tells YouTube where the video belongs.</li>
        <li>It tells viewers whether the video is for them.</li>
        <li>It gives you a sharper title, thumbnail, and description.</li>
      </ul>
      <p>Before you write a title, write a one-sentence topic statement:</p>
      <blockquote>
        This video helps [viewer] solve [problem] in [specific situation].
      </blockquote>
      <p>Examples:</p>
      <ul>
        <li>
          This video helps new YouTubers choose a beginner camera for
          indoor talking-head videos.
        </li>
        <li>
          This video helps small business owners use YouTube keywords
          before planning a content calendar.
        </li>
        <li>
          This video helps Notion users decide whether to switch to a
          simpler notes app in 2026.
        </li>
      </ul>
      <p>
        Use the{" "}
        <Link href="/tools/youtube-keyword-tool">YouTube Keyword Tool</Link>{" "}
        to expand the topic into real search phrases people type.
      </p>

      <h2 id="step-2">Step 2: Validate demand before recording</h2>
      <p>
        A topic can sound good and still be a bad use of production time.
      </p>
      <p>Before recording, check three things:</p>
      <ol>
        <li>Are people searching for this?</li>
        <li>Are current videos getting meaningful views?</li>
        <li>
          Can smaller channels break through, or are results dominated by
          established channels?
        </li>
      </ol>
      <p>
        This matters because demand alone is not enough. A topic can have
        demand but still be too competitive for a new channel. Another
        topic can have lower search volume but a better opening because
        smaller channels are already earning views.
      </p>
      <p>
        Use <Link href="/tools/youtube-niche-check">Niche Check</Link> when
        you need a go/no-go signal before making a video. Use{" "}
        <Link href="/tools/youtube-competitor-analyzer">
          Competitor Analyzer
        </Link>{" "}
        when you already know the niche and want to study channels inside
        it.
      </p>

      <h2 id="step-3">
        Step 3: Write a title people understand and want to click
      </h2>
      <p>A good YouTube title has two jobs:</p>
      <ul>
        <li>Help YouTube and viewers understand the topic.</li>
        <li>Give the right viewer a reason to click.</li>
      </ul>
      <p>Most weak titles fail because they do only one of those jobs.</p>
      <p>
        <strong>Keyword-only title:</strong> YouTube SEO Tips 2026
      </p>
      <p>
        <strong>Clearer title:</strong> YouTube SEO in 2026: 9 Fixes That
        Help Videos Get Found
      </p>
      <p>
        <strong>Curiosity-only title:</strong> I Changed This and My
        Channel Exploded
      </p>
      <p>
        <strong>Clearer title:</strong> I Rewrote 20 YouTube Titles. Here
        is What Improved CTR
      </p>
      <p>Useful title formats:</p>
      <ul>
        <li>How to [result] without [pain]</li>
        <li>[Tool/Product] Review After [time period]</li>
        <li>[X] Mistakes That Keep [audience] From [goal]</li>
        <li>[A] vs [B]: Which Is Better for [specific use case]?</li>
        <li>I Tried [method] for [time period]. Here is What Happened</li>
        <li>The [specific audience] Guide to [topic]</li>
      </ul>
      <p>
        Keep titles readable on mobile. As a practical rule, many titles
        work best around 40-70 characters, but clarity matters more than a
        fixed number.
      </p>
      <p>
        Use the{" "}
        <Link href="/tools/youtube-title-generator">Title Generator</Link>{" "}
        for angles, then run finalists through the{" "}
        <Link href="/tools/youtube-title-score-checker">
          Title Score Checker
        </Link>
        .
      </p>

      {/* Title Generator screenshot */}
      <figure className="my-10 not-prose">
        <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-white shadow-sm">
          <Image
            src="/screenshots/title-generator.webp"
            alt="AI YouTube Title Generator showing 10 generated titles for a React tutorial topic"
            width={1220}
            height={1506}
            className="w-full h-auto"
          />
        </div>
        <figcaption className="mt-3 text-center text-xs text-gray-500">
          Example output: the Title Generator returns 10 angles you can
          shortlist, then score before publishing.
        </figcaption>
      </figure>

      <h2 id="step-4">Step 4: Build the thumbnail and title together</h2>
      <p>
        The title and thumbnail are one piece of packaging. They should
        not repeat the exact same idea.
      </p>
      <p>
        <strong>Weak pairing:</strong>
        <br />
        Title: Best Budget Cameras for YouTube
        <br />
        Thumbnail text: Best Budget Cameras for YouTube
      </p>
      <p>
        <strong>Stronger pairing:</strong>
        <br />
        Title: Best Budget Cameras for YouTube Beginners in 2026
        <br />
        Thumbnail text: Under $700
      </p>
      <p>
        The title carries the searchable promise. The thumbnail adds a
        fast visual reason to care.
      </p>
      <p>Good thumbnail principles:</p>
      <ul>
        <li>One clear focal point.</li>
        <li>Strong contrast on mobile.</li>
        <li>Minimal text, usually 0-5 words.</li>
        <li>No tiny details that disappear in feed.</li>
        <li>Emotion or outcome when relevant.</li>
        <li>
          Visual difference from competitors in the same result set.
        </li>
      </ul>
      <p>
        Before publishing, preview the thumbnail next to the title in
        realistic placements: search, home feed, sidebar, and mobile. Use{" "}
        <Link href="/tools/youtube-thumbnail-preview">Thumbnail Preview</Link>{" "}
        for this.
      </p>

      <h2 id="step-5">Step 5: Write a useful description</h2>
      <p>
        The description is not where you dump keywords. It is where you
        clarify the video for both viewers and YouTube.
      </p>
      <p>
        A strong description starts with a useful first sentence. Those
        first lines can appear in previews, so do not waste them on a
        generic subscribe request.
      </p>
      <p>Description structure:</p>
      <ol>
        <li>First 1-2 sentences: what the video helps with.</li>
        <li>Short summary: what the viewer will learn.</li>
        <li>Key links or resources.</li>
        <li>Chapters, if useful.</li>
        <li>Light CTA.</li>
        <li>Disclosure or affiliate notes, if needed.</li>
      </ol>
      <p>Example:</p>
      <blockquote>
        Learn how to choose YouTube keywords that match your video idea
        before you write the title. In this video, I show a simple
        workflow for finding long-tail topics, checking competition, and
        turning one seed idea into a publish-ready title.
        <br />
        <br />
        We cover:
        <br />- How YouTube autocomplete helps with topic research
        <br />- How to judge whether a keyword is too broad
        <br />- How to turn keyword ideas into titles
        <br />- What to check before publishing
      </blockquote>
      <p>
        Use natural language. If a phrase would sound strange to a viewer,
        do not force it into the description.
      </p>
      <p>
        Use the{" "}
        <Link href="/tools/youtube-description-generator">
          Description Generator
        </Link>{" "}
        to draft a structured version, then edit it so it matches the
        actual video.
      </p>

      <h2 id="step-6">
        Step 6: Use tags for disambiguation, not magic ranking
      </h2>
      <p>
        Tags still have a role, but they are not the ranking lever many
        old guides make them out to be.
      </p>
      <p>
        YouTube&apos;s own guidance says tags can be useful when content
        is commonly misspelled, but the title, thumbnail, and description
        are more important for discovery.
      </p>
      <p>Use tags for:</p>
      <ul>
        <li>Misspellings.</li>
        <li>Alternate names.</li>
        <li>Closely related topic variants.</li>
        <li>Disambiguation when a topic has multiple meanings.</li>
        <li>Supporting long-tail phrases that would be awkward in the title.</li>
      </ul>
      <p>
        Do not use tags as a dumping ground for unrelated popular
        keywords. That creates weak relevance and can make the metadata
        look sloppy.
      </p>
      <p>Practical tag mix:</p>
      <ul>
        <li>
          <strong>Primary topic:</strong> youtube seo, youtube seo 2026
        </li>
        <li>
          <strong>Specific topic:</strong> youtube title optimization,
          youtube description optimization, youtube keyword research
        </li>
        <li>
          <strong>Long-tail:</strong> how to rank youtube videos in 2026,
          youtube seo for beginners
        </li>
        <li>
          <strong>Misspellings or variants:</strong> yt seo, youtube
          search optimization
        </li>
      </ul>
      <p>
        Use the <Link href="/tools/youtube-tag-generator">Tag Generator</Link>{" "}
        for ideas and the{" "}
        <Link href="/tools/youtube-tag-extractor">Tag Extractor</Link> to
        inspect how competitors label similar videos.
      </p>

      <h2 id="step-7">Step 7: Add chapters when they help the viewer</h2>
      <p>
        Chapters help viewers navigate longer videos. They can also make
        the structure easier to understand.
      </p>
      <p>Use chapters when:</p>
      <ul>
        <li>The video has clear sections.</li>
        <li>Viewers may want to jump to a specific part.</li>
        <li>
          The video is long enough that navigation improves the
          experience.
        </li>
      </ul>
      <p>
        Do not add fake chapters to a short video just because a checklist
        told you to. If chapters do not help the viewer, they are
        clutter.
      </p>
      <p>Good chapter format:</p>
      <blockquote>
        0:00 Intro
        <br />
        0:42 Why YouTube SEO changed
        <br />
        2:15 Topic research
        <br />
        4:10 Titles and thumbnails
        <br />
        6:35 Descriptions and tags
        <br />
        8:20 Post-publish audit
      </blockquote>
      <p>
        Use the{" "}
        <Link href="/tools/youtube-chapter-generator">Chapter Generator</Link>{" "}
        to check timestamp ordering and formatting.
      </p>

      <h2 id="step-8">
        Step 8: Publish with the first 48 hours in mind
      </h2>
      <p>
        Early performance matters because YouTube needs evidence. That
        does not mean the first hour permanently decides everything, but
        the early window gives the system useful signals about who
        responds to the video.
      </p>
      <p>Before publishing:</p>
      <ul>
        <li>Make sure the title and thumbnail match the actual video.</li>
        <li>Check the first sentence of the description.</li>
        <li>Add chapters if useful.</li>
        <li>Confirm tags and hashtags are relevant.</li>
        <li>
          Share the video where the right viewers will actually watch,
          not just click.
        </li>
      </ul>
      <p>After publishing:</p>
      <ul>
        <li>Watch impressions and CTR.</li>
        <li>Watch retention, especially early drop-off.</li>
        <li>Watch traffic sources.</li>
        <li>Read comments for mismatch between expectation and delivery.</li>
      </ul>
      <p>
        Avoid making five changes at once. If you change the title and
        thumbnail at the same time, you will not know which change
        helped.
      </p>

      <h2 id="step-9">Step 9: Audit and improve after publishing</h2>
      <p>
        Most creators publish and move on. Better creators build a
        feedback loop.
      </p>
      <p>After 24-48 hours, ask:</p>
      <ul>
        <li>Did the right people click?</li>
        <li>Did the video deliver on the title and thumbnail?</li>
        <li>Where did viewers drop?</li>
        <li>Did search traffic appear?</li>
        <li>Did suggested or browse traffic appear?</li>
        <li>Are comments confused, satisfied, or asking for a follow-up?</li>
      </ul>
      <p>If CTR is low, test the title or thumbnail.</p>
      <p>
        If retention drops early, improve the hook in the next video. You
        usually cannot fix a weak opening with metadata.
      </p>
      <p>
        If search traffic is low but retention is good, improve topic
        clarity in the title, description, and chapters.
      </p>
      <p>
        If browse traffic is low, study packaging and viewer
        satisfaction. Browse often needs a stronger promise and a broader
        viewer appeal.
      </p>
      <p>
        Use <Link href="/tools/youtube-video-audit">Video Audit</Link> for
        a metadata and packaging check. Use{" "}
        <Link href="/tools/youtube-visibility-score">Visibility Score</Link>{" "}
        and{" "}
        <Link href="/tools/youtube-channel-audit">Channel Audit</Link> when
        you want to review channel-level patterns.
      </p>

      {/* Video Audit screenshots */}
      <figure className="my-10 not-prose">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-white shadow-sm">
            <Image
              src="/screenshots/video-audit-1.webp"
              alt="YouTube Video Audit result showing overall SEO score of 65 with weaknesses summary and a Fix with AI button"
              width={1386}
              height={1480}
              className="w-full h-auto"
            />
          </div>
          <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-white shadow-sm">
            <Image
              src="/screenshots/video-audit-2.webp"
              alt="Video audit per-dimension breakdown across title, description, tags, hashtags and chapters"
              width={1294}
              height={1372}
              className="w-full h-auto"
            />
          </div>
        </div>
        <figcaption className="mt-3 text-center text-xs text-gray-500">
          Video Audit returns an overall score and a per-dimension
          breakdown so you know which field to fix first.
        </figcaption>
      </figure>

      <h2 id="checklist">YouTube SEO checklist</h2>
      <p>
        <strong>Before recording:</strong>
      </p>
      <ul>
        <li>Define the viewer and problem.</li>
        <li>Write a one-sentence topic statement.</li>
        <li>Check YouTube keyword ideas.</li>
        <li>Validate demand and competition.</li>
        <li>Study top-performing competitor videos.</li>
      </ul>
      <p>
        <strong>Before publishing:</strong>
      </p>
      <ul>
        <li>Title is clear and clickable.</li>
        <li>Thumbnail is readable on mobile.</li>
        <li>Title and thumbnail work together.</li>
        <li>Description starts with a useful summary.</li>
        <li>Tags support relevance and disambiguation.</li>
        <li>Hashtags are relevant and ordered.</li>
        <li>Chapters help viewers navigate.</li>
      </ul>
      <p>
        <strong>After publishing:</strong>
      </p>
      <ul>
        <li>Check CTR.</li>
        <li>Check retention curve.</li>
        <li>Check traffic sources.</li>
        <li>Read comments for expectation mismatch.</li>
        <li>Test one packaging change at a time if needed.</li>
        <li>Feed the lesson into the next video.</li>
      </ul>

      <h2 id="workflow">Recommended tool workflow</h2>
      <p>For a new video:</p>
      <ol>
        <li>
          Use <Link href="/tools/youtube-keyword-tool">Keyword Tool</Link>{" "}
          to discover topic phrasing.
        </li>
        <li>
          Use <Link href="/tools/youtube-niche-check">Niche Check</Link> to
          validate the topic.
        </li>
        <li>
          Use{" "}
          <Link href="/tools/youtube-competitor-analyzer">
            Competitor Analyzer
          </Link>{" "}
          to study winning channels.
        </li>
        <li>
          Use{" "}
          <Link href="/tools/youtube-title-generator">Title Generator</Link>{" "}
          and{" "}
          <Link href="/tools/youtube-title-score-checker">
            Title Score Checker
          </Link>{" "}
          to refine titles.
        </li>
        <li>
          Use{" "}
          <Link href="/tools/youtube-thumbnail-preview">Thumbnail Preview</Link>{" "}
          before upload.
        </li>
        <li>
          Use{" "}
          <Link href="/tools/youtube-description-generator">
            Description Generator
          </Link>
          ,{" "}
          <Link href="/tools/youtube-tag-generator">Tag Generator</Link>, and{" "}
          <Link href="/tools/youtube-chapter-generator">Chapter Generator</Link>{" "}
          to prepare metadata.
        </li>
        <li>
          Use <Link href="/tools/youtube-video-audit">Video Audit</Link>{" "}
          after publishing.
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
      <p>
        YouTube SEO in 2026 is not about tricking the algorithm. It is
        about making the video easier to understand, easier to choose,
        and more satisfying for the viewer who clicked.
      </p>
      <p>
        Do that consistently and the technical pieces start to work
        together: search can understand the video, browse can test it
        with the right audience, and your analytics can show what to
        improve next.
      </p>
    </GuideLayout>
  );
}
