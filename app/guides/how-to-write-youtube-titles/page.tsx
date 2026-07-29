import Link from "next/link";
import Image from "next/image";
import { GuideLayout } from "@/components/GuideLayout";
import { buildMetadata } from "@/lib/seo";
import { getGuideBySlug } from "@/lib/guides-catalog";

const guide = getGuideBySlug("how-to-write-youtube-titles")!;

const META_DESCRIPTION =
  "Learn how to write YouTube titles that get clicks: title formulas, examples, ideal length, common mistakes, A/B testing tips, and templates for better CTR.";
const OG_DESCRIPTION =
  "A practical guide to better YouTube titles: formulas, before-and-after examples, search vs browse angles, title length, mistakes, and a final checklist.";

const base = buildMetadata({
  title: "How to Write YouTube Titles That Get Clicks in 2026",
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

// HowTo schema covers the 5-step "Fast workflow for writing better titles"
const HOW_TO_STEPS = [
  {
    name: "Write the plain version",
    text: "Start from the raw topic without trying to sound clever. Example: How to write YouTube titles.",
  },
  {
    name: "Add the audience",
    text: "Specify who the video is for. Example: How small channels can write better YouTube titles.",
  },
  {
    name: "Add the outcome",
    text: "Make the title promise something the viewer can measure. Example: How small channels can write YouTube titles that get more clicks.",
  },
  {
    name: "Add specificity",
    text: "Include numbers, time frames, audiences, or constraints. Example: How small channels can write YouTube titles that get clicks in 2026.",
  },
  {
    name: "Make it cleaner",
    text: "Trim words, fix capitalization, and pick the strongest phrasing. Example: How to Write YouTube Titles That Get Clicks in 2026.",
  },
];

const FAQS = [
  {
    q: "How long should a YouTube title be?",
    a: "There is no perfect length, but many strong titles are readable in the 40-70 character range. Shorter titles can work when the thumbnail carries more context. Longer titles can work when the search query needs more detail.",
  },
  {
    q: "Should I use keywords in YouTube titles?",
    a: "Yes, but naturally. Use the main phrase a viewer would expect, then add a reason to click. Keyword stuffing makes the title harder to read and less trustworthy.",
  },
  {
    q: "Do numbers improve YouTube titles?",
    a: "Numbers can help when the video is structured as a list or set of steps. Do not add a number just for style. If the title says 7 tips, the video should deliver 7 useful tips.",
  },
  {
    q: "Can I change a YouTube title after publishing?",
    a: "Yes. You can update a YouTube title after publishing. If the video has low CTR but decent retention, testing a new title can be useful. Change one major element at a time so you can understand the result.",
  },
  {
    q: "What makes a YouTube title clickbait?",
    a: "A title becomes clickbait when it creates a promise the video does not satisfy. Curiosity is fine. Misleading the viewer is not. Good titles create interest and still deliver honestly.",
  },
  {
    q: "Should my title and thumbnail say the same thing?",
    a: "Usually no. They should work together. The title can carry the searchable promise, while the thumbnail adds visual context, emotion, contrast, or a shorter hook.",
  },
  {
    q: "What is the easiest way to improve a weak title?",
    a: "Add specificity. Name the audience, situation, outcome, time frame, or problem. \"Camera tips\" is weak. \"Camera settings for indoor YouTube videos without studio lights\" is much clearer.",
  },
];

const BEFORE_AFTER = [
  {
    label: "Vague review",
    before: "My Honest Review",
    after:
      "iPhone 17 Pro Review After 30 Days: Great Camera, One Big Problem",
    why: "The new title names the product, gives a time frame, and adds a specific tension.",
  },
  {
    label: "Generic tutorial",
    before: "YouTube Tags Tutorial",
    after: "How to Use YouTube Tags Without Keyword Stuffing",
    why: "The new title solves a clearer problem and reduces a common fear.",
  },
  {
    label: "Weak productivity video",
    before: "Best Apps 2026",
    after: "7 Productivity Apps I Would Actually Use in 2026",
    why: "The new title adds a category, number, personal filter, and year.",
  },
  {
    label: "Broad SEO video",
    before: "YouTube SEO Tips",
    after: "YouTube SEO in 2026: 9 Fixes That Help Videos Get Found",
    why: "The new title is timely, specific, and outcome-driven.",
  },
  {
    label: "Overhyped curiosity",
    before: "You Won't Believe What Happened",
    after:
      "I Changed My YouTube Titles for 30 Days. CTR Was Not the Surprise.",
    why: "The new title keeps curiosity but gives the viewer real context.",
  },
];

const SEARCH_TITLES = [
  "How to Add Chapters to a YouTube Video",
  "Best Budget Camera for YouTube Beginners",
  "How to Find YouTube Tags on Any Video",
  "YouTube Title Length: What Works Best?",
];

const BROWSE_TITLES = [
  "I Rewrote 50 YouTube Titles. These 7 Patterns Won.",
  "Why Your YouTube Titles Get Impressions But No Clicks",
  "The Thumbnail Was Fine. The Title Was the Problem.",
  "I Tried Every YouTube Title Formula for 30 Days",
];

const FORMULAS = [
  {
    label: "1. How to [result] without [pain]",
    use: "Best for tutorials and evergreen search.",
    examples: [
      "How to Write YouTube Titles Without Sounding Clickbait",
      "How to Film Better Videos Without Buying a New Camera",
      "How to Find Keywords Without Paying for SEO Tools",
    ],
    why: "It gives the viewer a result and removes a fear.",
  },
  {
    label: "2. [Number] mistakes that keep [audience] from [goal]",
    use: "Best for educational videos and beginner audiences.",
    examples: [
      "7 Mistakes That Keep New YouTubers From Getting Clicks",
      "5 Tag Mistakes That Make Your YouTube Metadata Messy",
      "9 Thumbnail Mistakes That Kill Mobile CTR",
    ],
    why: "It promises diagnosis and improvement.",
  },
  {
    label: "3. I tried [thing] for [time period]",
    use: "Best for experiments, challenges, and creator-led videos.",
    examples: [
      "I Tried Posting Shorts Every Day for 30 Days",
      "I Used AI to Write 100 YouTube Titles",
      "I Changed My Thumbnail Style for One Month",
    ],
    why: "It creates a story with a clear outcome window.",
  },
  {
    label: "4. [A] vs [B]: which is better for [specific use case]?",
    use: "Best for comparison and product videos.",
    examples: [
      "Notion vs Obsidian: Which Is Better for Writers?",
      "TubeBuddy vs vidIQ: Which Is Better for Small Channels?",
      "Long Titles vs Short Titles: Which Gets More Clicks?",
    ],
    why: "It pulls interest from both sides and narrows the decision.",
  },
  {
    label: "5. Why [common belief] is wrong",
    use: "Best for contrarian videos, but only when you can defend the claim.",
    examples: [
      "Why Most YouTube Title Advice Is Too Generic",
      "Why Your Best Video Idea Might Be Too Broad",
      "Why Tags Are Not the YouTube SEO Shortcut You Think",
    ],
    why: "It creates tension and invites the viewer to check the argument.",
  },
  {
    label: "6. The [specific audience] guide to [topic]",
    use: "Best for niche positioning.",
    examples: [
      "The Beginner Creator's Guide to YouTube Titles",
      "The Small Channel Guide to YouTube SEO",
      "The Solo Founder's Guide to YouTube Content Ideas",
    ],
    why: "It tells the viewer, \"this was made for you.\"",
  },
  {
    label: "7. I changed [specific thing]. Here is what happened.",
    use: "Best for analytics, iteration, and personal case studies.",
    examples: [
      "I Changed 20 YouTube Titles. Here is What Happened.",
      "I Rewrote My Descriptions. Search Traffic Finally Moved.",
      "I Stopped Using Generic Thumbnails. CTR Got Easier to Read.",
    ],
    why: "It promises evidence instead of theory.",
  },
];

export default function HowToWriteYouTubeTitlesPage() {
  return (
    <GuideLayout
      guide={guide}
      howToSteps={HOW_TO_STEPS}
      howToTotalTimeISO="PT9M"
      faqs={FAQS}
    >
      <p>
        Your YouTube title has one job before the click: make the right
        viewer understand the promise fast enough to choose your video.
      </p>
      <p>
        That does not mean the title works alone. A title can earn the
        click, but the video has to earn the watch. If the title
        overpromises, viewers leave early. If it undersells, people never
        click. The best YouTube titles sit in the middle: clear enough for
        search, interesting enough for browse, and honest enough that the
        video can deliver.
      </p>
      <p>
        This guide gives you a practical title-writing system: title
        length, formulas, examples, common mistakes, search vs browse
        angles, and a checklist you can use before publishing.
      </p>
      <p>
        Use the{" "}
        <Link href="/tools/youtube-title-generator">YouTube Title Generator</Link>{" "}
        when you need ideas, then check finalists with the{" "}
        <Link href="/tools/youtube-title-score-checker">
          YouTube Title Analyzer
        </Link>
        .
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
            { href: "#what-works", label: "What makes a YouTube title work" },
            { href: "#not-the-whole-job", label: "The title is not the whole job" },
            { href: "#title-length", label: "How long should a YouTube title be?" },
            { href: "#search-vs-browse", label: "Search titles vs browse titles" },
            { href: "#formulas", label: "7 YouTube title formulas that work" },
            { href: "#before-after", label: "Before and after examples" },
            { href: "#mistakes", label: "Common title mistakes" },
            { href: "#testing", label: "How to test YouTube titles after publishing" },
            { href: "#checklist", label: "YouTube title checklist" },
            { href: "#fast-workflow", label: "Fast workflow for writing better titles" },
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

      {/* Title Generator screenshot — the tool mentioned in the intro */}
      <figure className="my-10 not-prose">
        <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-white shadow-sm">
          <Image
            src="/screenshots/title-generator.webp"
            alt="AI YouTube Title Generator returning 10 click-worthy title ideas for a single topic"
            width={1220}
            height={1506}
            className="w-full h-auto"
          />
        </div>
        <figcaption className="mt-3 text-center text-xs text-gray-500">
          The Title Generator returns 10 angles from one topic so you have
          a real shortlist to compare.
        </figcaption>
      </figure>

      <h2 id="what-works">What makes a YouTube title work</h2>
      <p>A strong YouTube title usually does three things:</p>
      <ol>
        <li>
          <strong>Names the topic clearly.</strong>
        </li>
        <li>
          <strong>Creates a reason to click.</strong>
        </li>
        <li>
          <strong>Matches what the video actually delivers.</strong>
        </li>
      </ol>

      <p>
        <strong>Weak title:</strong> My Setup
        <br />
        <strong>Better title:</strong> My YouTube Desk Setup for Filming
        Faster in a Small Room
      </p>
      <p>
        <strong>Weak title:</strong> SEO Tips
        <br />
        <strong>Better title:</strong> YouTube SEO Tips I Wish I Knew
        Before My First 100 Videos
      </p>
      <p>
        <strong>Weak title:</strong> iPhone Review
        <br />
        <strong>Better title:</strong> iPhone 17 Pro Review After 30 Days:
        Great Camera, One Big Problem
      </p>
      <p>
        The better versions do not just add keywords. They add context,
        audience, outcome, or tension.
      </p>

      <h2 id="not-the-whole-job">The title is not the whole job</h2>
      <p>
        It is tempting to treat the title as the thing that makes a video
        win. It is more accurate to think of the title as the start of a
        promise.
      </p>
      <p>
        The title and thumbnail help a viewer decide whether to click. The
        opening of the video tells them whether the click was worth it.
        If those two things do not match, the viewer leaves and the title
        becomes a liability.
      </p>
      <p>
        <strong>Good title:</strong> I Tried Posting Shorts Every Day for
        30 Days. Here is What Happened.
      </p>
      <p>
        <strong>Bad delivery:</strong> The video spends five minutes
        explaining what Shorts are before showing results.
      </p>
      <p>
        <strong>Better delivery:</strong> The first 30 seconds show the
        starting point, final numbers, and the main surprise.
      </p>
      <blockquote>
        The title earns the click. The first 30 seconds must prove the
        click was worth it.
      </blockquote>

      <h2 id="title-length">How long should a YouTube title be?</h2>
      <p>
        There is no perfect YouTube title length. The real goal is
        readability on mobile and clarity in feed.
      </p>
      <p>
        As a practical range, many titles work best around{" "}
        <strong>40-70 characters</strong>. Shorter titles can work when
        the thumbnail carries the context. Longer titles can work when
        the search phrase needs more detail.
      </p>
      <p>
        <strong>Too short:</strong> Notion Tips
        <br />
        <strong>Too vague:</strong> I Tried a New App and It Changed
        Everything
        <br />
        <strong>Better:</strong> 7 Notion Tips That Make Weekly Planning
        Faster
        <br />
        <strong>Long but useful:</strong> Notion vs Obsidian for Writers:
        Which App Is Easier to Stick With?
      </p>
      <p>
        Do not chase character count at the expense of meaning. If the
        viewer cannot understand the promise quickly, the title is too
        hard to click.
      </p>

      <h2 id="search-vs-browse">Search titles vs browse titles</h2>
      <p>
        Not every YouTube title should use the same style. Search and
        browse often need different angles.
      </p>

      {/* Search vs browse visual cards */}
      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
            Search titles
          </p>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            Clear and specific because the viewer already has intent.
          </p>
          <ul className="mt-4 space-y-2">
            {SEARCH_TITLES.map((t) => (
              <li
                key={t}
                className="rounded-md bg-white px-3 py-2 text-xs text-gray-800 ring-1 ring-gray-100"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
            Browse titles
          </p>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            Need a stronger hook because the viewer was not actively
            looking for your video.
          </p>
          <ul className="mt-4 space-y-2">
            {BROWSE_TITLES.map((t) => (
              <li
                key={t}
                className="rounded-md bg-white px-3 py-2 text-xs text-gray-800 ring-1 ring-gray-100"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3>Search titles</h3>
      <p>Use search-style titles when:</p>
      <ul>
        <li>The video solves a specific problem.</li>
        <li>The topic is evergreen.</li>
        <li>People are likely to type the question into YouTube.</li>
      </ul>

      <h3>Browse titles</h3>
      <p>Use browse-style titles when:</p>
      <ul>
        <li>The video has a story, test, or surprising result.</li>
        <li>
          You want the home feed or suggested videos to carry the video.
        </li>
        <li>
          The topic is interesting even without a direct search query.
        </li>
      </ul>

      <p>The best titles often blend both:</p>
      <blockquote>
        YouTube Title Formulas: 7 Patterns That Help Videos Get Clicks
      </blockquote>

      <h2 id="formulas">7 YouTube title formulas that work</h2>

      {FORMULAS.map((f) => (
        <div key={f.label}>
          <h3>{f.label}</h3>
          <p>{f.use}</p>
          <ul>
            {f.examples.map((ex) => (
              <li key={ex}>{ex}</li>
            ))}
          </ul>
          <p>
            <strong>Why it works:</strong> {f.why}
          </p>
        </div>
      ))}

      <h2 id="before-after">Before and after examples</h2>

      {/* Before/After cards */}
      <div className="not-prose my-8 grid gap-4">
        {BEFORE_AFTER.map((ex) => (
          <div
            key={ex.label}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Example: {ex.label}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md bg-red-50/60 p-3 ring-1 ring-inset ring-red-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-red-700">
                  Before
                </p>
                <p className="mt-1 text-sm text-gray-700 line-through decoration-red-300/70">
                  {ex.before}
                </p>
              </div>
              <div className="rounded-md bg-emerald-50/60 p-3 ring-1 ring-inset ring-emerald-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                  After
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {ex.after}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-600 leading-relaxed">
              <strong className="text-gray-900">Why it is better:</strong>{" "}
              {ex.why}
            </p>
          </div>
        ))}
      </div>

      <h2 id="mistakes">Common title mistakes</h2>

      <h3>1. Front-loading the channel name</h3>
      <p>
        <strong>Weak:</strong> Creator Lab - How to Write Better YouTube
        Titles
        <br />
        <strong>Better:</strong> How to Write YouTube Titles That Get
        Clicks
      </p>
      <p>
        The channel name is already visible near the video. Use the title
        space for the promise.
      </p>

      <h3>2. Making the title too broad</h3>
      <p>
        <strong>Weak:</strong> Camera Tips
        <br />
        <strong>Better:</strong> Camera Settings for Indoor YouTube Videos
        Without Studio Lights
      </p>
      <p>
        Broad titles are hard for YouTube to place and hard for viewers to
        choose.
      </p>

      <h3>3. Using curiosity with no context</h3>
      <p>
        <strong>Weak:</strong> This Changed Everything
        <br />
        <strong>Better:</strong> This One Title Change Made My Old Videos
        Easier to Click
      </p>
      <p>Curiosity works better when the viewer knows the topic.</p>

      <h3>4. Keyword stuffing</h3>
      <p>
        <strong>Weak:</strong> YouTube Titles YouTube Title Tips YouTube
        Title SEO 2026
        <br />
        <strong>Better:</strong> YouTube Title Tips: 7 Ways to Make Videos
        Easier to Click
      </p>
      <p>
        Use one primary phrase naturally. Put variations in the
        description or tags when they fit.
      </p>

      <h3>5. Overselling the result</h3>
      <p>
        <strong>Weak:</strong> This Title Hack Will 10x Your Views
        Overnight
        <br />
        <strong>Better:</strong> The Title Test That Helped Me Understand
        Low CTR
      </p>
      <p>
        Overpromising may earn curiosity once, but it can hurt trust and
        retention if the video cannot deliver.
      </p>

      <h3>6. Changing too many things at once</h3>
      <p>
        If a video underperforms, do not rewrite the title, replace the
        thumbnail, change the description, and update tags all at once.
        You will not know what helped.
      </p>
      <p>Test one major packaging change at a time.</p>

      <h2 id="testing">How to test YouTube titles after publishing</h2>
      <p>
        You can change a YouTube title after publishing. That makes title
        iteration part of the workflow, not a failure.
      </p>
      <p>A simple testing process:</p>
      <ol>
        <li>Publish with your strongest honest title.</li>
        <li>
          Wait until the video has enough impressions to judge direction.
        </li>
        <li>Compare CTR to your channel baseline and traffic source.</li>
        <li>
          If CTR is weak but retention is decent, test a new title or
          thumbnail.
        </li>
        <li>Change one major element at a time.</li>
        <li>Write down what changed and what happened.</li>
      </ol>
      <p>
        Do not treat every low-CTR video as a title problem. Sometimes the
        thumbnail is unclear. Sometimes the topic is too broad. Sometimes
        the video is being shown to a colder audience than usual.
      </p>
      <p>
        Use <Link href="/tools/youtube-video-audit">Video Audit</Link> to
        check packaging and metadata after publishing.
      </p>

      {/* Video Audit screenshot — visualises the testing workflow */}
      <figure className="my-10 not-prose">
        <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-white shadow-sm">
          <Image
            src="/screenshots/video-audit-1.webp"
            alt="YouTube Video Audit result showing overall SEO score and an inline Fix with AI button"
            width={1386}
            height={1480}
            className="w-full h-auto"
          />
        </div>
        <figcaption className="mt-3 text-center text-xs text-gray-500">
          After publishing, Video Audit gives a single score and flags the
          weakest field so the next iteration is targeted, not blind.
        </figcaption>
      </figure>

      <h2 id="checklist">YouTube title checklist</h2>
      <p>Before publishing, ask:</p>
      <ul>
        <li>Is the main topic clear?</li>
        <li>Does the title match the actual video?</li>
        <li>Would the right viewer understand it in two seconds?</li>
        <li>Is there a reason to click beyond the keyword?</li>
        <li>
          Does the thumbnail add something instead of repeating the title?
        </li>
        <li>Is the title readable on mobile?</li>
        <li>Is the strongest word or idea near the front?</li>
        <li>Is the title specific enough for YouTube to place it?</li>
        <li>Did you avoid hype the video cannot deliver?</li>
        <li>Have you written at least 5 alternate versions?</li>
      </ul>
      <p>If the answer is no to several of these, keep working.</p>

      <h2 id="fast-workflow">Fast workflow for writing better titles</h2>

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

      <p>
        This is the simplest way to avoid both extremes: vague titles and
        bloated titles.
      </p>

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
      <p>A YouTube title is not a trick. It is a promise.</p>
      <p>
        The best title tells the right viewer what the video gives them,
        adds enough tension to make the click feel worthwhile, and stays
        honest enough that the video can deliver.
      </p>
      <p>
        Write the plain version first. Make it specific. Give it an angle.
        Then test it against the thumbnail and the actual opening of the
        video. If all three tell the same story, you are much closer to a
        title that can earn the click and keep the viewer.
      </p>
    </GuideLayout>
  );
}
