import Link from "next/link";
import { GuideLayout } from "@/components/GuideLayout";
import { buildMetadata } from "@/lib/seo";
import { getGuideBySlug } from "@/lib/guides-catalog";

const guide = getGuideBySlug("youtube-seo-2026-complete-guide")!;

export const metadata = buildMetadata({
  title: guide.title,
  description: guide.description,
  path: `guides/${guide.slug}`,
});

export default function YouTubeSeoCompleteGuidePage() {
  return (
    <GuideLayout guide={guide}>
      <p>
        YouTube SEO in 2026 is not what it was in 2020. The platform&apos;s
        ranking system has quietly absorbed everything Google learned about
        AI-augmented search, and the signals that move the needle today are
        different from the ones every five-year-old &quot;ultimate guide&quot;
        will tell you about. This article is the working framework I&apos;d
        give a creator starting today.
      </p>

      <p>
        Skip ahead to the tools mentioned throughout:{" "}
        <Link href="/tools">all 17 free tools</Link>. Each tool exists because
        a specific step in this guide deserved its own utility.
      </p>

      <h2>The model in one paragraph</h2>
      <p>
        YouTube runs two distinct ranking systems, and your video is judged by
        both. <strong>Search</strong> matches your video to queries typed into
        the YouTube search bar. <strong>Browse</strong> decides whether your
        video gets surfaced on someone&apos;s home feed, suggested column, or
        Shorts shelf. Search rewards keyword relevance and click-through.
        Browse rewards watch behaviour and viewer retention. A video that
        wins both gets the algorithmic compounding that turns small channels
        into mid-sized ones. A video that wins only one stays niche.
      </p>

      <h2>What signals matter most in 2026</h2>
      <p>
        Drawn from creator-shared analytics, public YouTube statements, and a
        decade of observed behaviour, the signals that visibly move
        impressions:
      </p>

      <ol>
        <li>
          <strong>Click-through rate from impressions.</strong> The single
          biggest determinant of whether your video gets more impressions in
          the next hour. CTR is driven almost entirely by the title and
          thumbnail.
        </li>
        <li>
          <strong>Average view duration and retention curve.</strong>{" "}
          Specifically the shape of the retention curve in the first 30
          seconds — if it doesn&apos;t flatten, YouTube infers your video
          delivers on the title.
        </li>
        <li>
          <strong>Topical match.</strong> Title, description, captions, and
          tags collectively tell YouTube what the video is about. Without
          this signal in the first hour after upload, before watch behaviour
          exists, your video can&apos;t be surfaced anywhere relevant.
        </li>
        <li>
          <strong>Session length contribution.</strong> Does watching your
          video lead to viewers watching more YouTube? This is heavily
          weighted in browse-surface ranking.
        </li>
        <li>
          <strong>Engagement signals (likes, comments, shares).</strong> Less
          important than the above but still measurable. Comments correlate
          best with browse-surface lift.
        </li>
      </ol>

      <p>
        Notice what&apos;s <em>not</em> on this list: tags, hashtag count,
        upload time, video length within reason, or description length. Those
        are tools — not signals. They affect the signals above without being
        ranking factors themselves.
      </p>

      <h2>Step 1: Decide what your video is actually about</h2>
      <p>
        The sharper the answer to &quot;what is this video about?&quot;, the
        easier every later step becomes. Generic videos don&apos;t rank
        because YouTube can&apos;t place them anywhere specific in its
        topical graph. &quot;Tech review&quot; is too broad. &quot;Honest
        long-term review of the M5 MacBook Pro for video editors who already
        own an M2&quot; is searchable, browsable, and ranks naturally
        because YouTube knows exactly who to show it to.
      </p>

      <p>
        Before you write anything else, write the niche statement in one
        sentence. If you can&apos;t, the title and description will not save
        the video.
      </p>

      <h3>Find what people actually search for</h3>
      <p>
        Start with our{" "}
        <Link href="/tools/youtube-keyword-tool">Keyword Tool</Link> — it
        surfaces YouTube&apos;s own autocomplete suggestions for any seed
        term, expandable to 100+ long-tail variants. This is what people
        actually type. Use the variants to refine your niche statement.
      </p>

      <h2>Step 2: Title and thumbnail (drives CTR)</h2>
      <p>
        Title and thumbnail are the only signals YouTube has before impressions
        turn into actual viewer behaviour. They&apos;re responsible for
        anywhere from 60 to 90 percent of whether the algorithm gives you
        more impressions or quietly stops.
      </p>

      <p>
        Aim for titles that are <strong>40-70 characters</strong> long. Above
        70, YouTube truncates them with an ellipsis in search results, browse
        feeds, and the related-videos column — costing you visual real estate
        at the exact moment the viewer decides whether to click. Below 30,
        you usually can&apos;t pack enough keyword + curiosity to compete.
      </p>

      <p>
        Mix angles: curiosity (open loops), listicles (numbered), how-to,
        comparison/vs, contrarian, story. Sticking to one angle for every
        video flattens your channel into &quot;always X&quot; in the
        algorithm&apos;s eyes — easier to ignore.
      </p>

      <p>
        Our <Link href="/tools/youtube-title-generator">AI Title Generator</Link>{" "}
        produces ten title candidates in different angles for any topic,
        ready to A/B test. Pick the one that&apos;s honest to your video.
      </p>

      <h3>Thumbnails: what works in 2026</h3>
      <p>
        YouTube&apos;s thumbnail aesthetic is heading toward simpler, not
        louder. Faces still help when the channel is personality-led. Large
        legible text (3-5 words max) helps when the title alone undersells.
        Bright colour blocks help on mobile feeds. What doesn&apos;t help:
        more than three visual elements competing for attention.
      </p>

      <p>
        Use the{" "}
        <Link href="/tools/youtube-thumbnail-downloader">
          Thumbnail Downloader
        </Link>{" "}
        to grab competitor thumbnails in your niche at full resolution and
        compare what&apos;s working.
      </p>

      <h2>Step 3: Description (drives topical match)</h2>
      <p>
        The first 120 characters of your description show up in search
        results and the &quot;more&quot; preview before viewers click — write
        them like a sub-title that delivers the why. Most creators waste
        these characters on subscribe prompts.
      </p>

      <p>
        Below that, write 2-3 short paragraphs of what the video actually
        contains. Use the natural keywords your title suggested. Don&apos;t
        keyword-stuff: YouTube&apos;s 2024 algorithm update started penalising
        descriptions that read like SEO-bait.
      </p>

      <p>
        Pair with chapters. Chapters appear as clickable markers on the
        progress bar and significantly increase average view duration when
        the video is long enough to merit them. They also help YouTube
        understand the structure of the video.
      </p>

      <p>
        Two tools to round this out:{" "}
        <Link href="/tools/youtube-description-generator">
          AI Description Generator
        </Link>{" "}
        produces a structured description with hook, body, chapters
        placeholder, and CTA;{" "}
        <Link href="/tools/youtube-chapter-generator">Chapter Generator</Link>
        {" "}validates your timestamps against YouTube&apos;s four rules
        (first must be 0:00, at least 3 chapters, each ≥ 10 seconds,
        ascending order).
      </p>

      <h2>Step 4: Tags and hashtags (signal disambiguation)</h2>
      <p>
        Tags <em>still</em> matter — just less than they used to. YouTube has
        said tags play a &quot;minimal role&quot; in discovery. The honest
        framing: tags help with three things specifically.
      </p>

      <ol>
        <li>
          <strong>Misspellings of your topic.</strong> Tags are where
          creators capture common typos of their primary keyword — the place
          where the title can&apos;t reasonably go.
        </li>
        <li>
          <strong>Disambiguation when your title is short.</strong> If your
          title is &quot;Rome&quot; tags tell YouTube whether you mean the
          city, the empire, or the HBO show.
        </li>
        <li>
          <strong>First-hour signal.</strong> Before engagement data exists,
          tags are part of YouTube&apos;s evidence that your video is about
          the topic you say it is.
        </li>
      </ol>

      <p>
        YouTube caps total tag length at 500 characters including commas. A
        healthy mix is roughly 30% broad terms, 50% mid-specific, 20%
        long-tail. Our{" "}
        <Link href="/tools/youtube-tag-generator">AI Tag Generator</Link>{" "}
        produces 20-30 tags in that ratio and auto-trims to fit the 500-char
        limit. To see what competitors are tagging, use the{" "}
        <Link href="/tools/youtube-tag-extractor">Tag Extractor</Link> —
        YouTube hides tags from the public UI but they&apos;re still in the
        page source.
      </p>

      <h3>Hashtags vs tags</h3>
      <p>
        Hashtags are <em>public</em> and clickable (they appear above your
        title); tags are private metadata. Different functions, different
        best practices. YouTube displays only the first three hashtags from
        your description, so the order matters. Use the{" "}
        <Link href="/tools/youtube-hashtag-generator">Hashtag Generator</Link>{" "}
        for ranked options.
      </p>

      <h2>Step 5: Watch the first hour</h2>
      <p>
        Most of YouTube&apos;s algorithmic decisions about a new upload are
        made in the first one to four hours after publish. The video is shown
        to a small &quot;test&quot; audience drawn from your subscriber base
        and topic-matched browsers. If the test audience&apos;s CTR is above
        average and retention curve doesn&apos;t flatten too fast, the video
        gets expanded distribution. If not, it stays niche forever.
      </p>

      <p>
        Practical implications:
      </p>

      <ul>
        <li>
          Publish when your subscribers are most likely to watch immediately
          — the first hour matters more than the next 24.
        </li>
        <li>
          Notify any community (email list, Discord, niche subreddit) that&apos;s
          likely to engage in the first hour.
        </li>
        <li>
          Don&apos;t republish the same video with a new title. YouTube
          treats it as a fresh upload but penalises it as duplicate.
        </li>
      </ul>

      <h2>Step 6: Iterate on what you learn</h2>
      <p>
        Once a video has 48 hours of data, look at your CTR (visible in
        YouTube Studio &gt; Analytics &gt; Reach). If CTR is below your
        channel average, the title or thumbnail underperformed — try changing
        one of them (not both). YouTube allows you to edit either at any
        time and re-tests with the new version.
      </p>

      <p>
        If retention drops sharply in the first 30 seconds, your hook is
        weak. You can&apos;t fix this without re-editing the video, but it&apos;s
        the most valuable signal for future videos. The shape of the
        retention curve is more useful than the average.
      </p>

      <h2>Earnings reality check</h2>
      <p>
        YouTube&apos;s Partner Program shares 55% of ad revenue with
        creators. CPMs vary wildly by niche (finance and insurance pay
        $15-40 per 1000 ad views; gaming pays $2-5). Use our{" "}
        <Link href="/tools/youtube-money-calculator">Money Calculator</Link>
        {" "}with your specific niche and audience region for an
        order-of-magnitude estimate. Don&apos;t plan finances around it —
        real earnings can swing 30-50% by season alone.
      </p>

      <h2>What we&apos;re skipping deliberately</h2>
      <p>
        Three things every other YouTube SEO guide gives airtime to, that
        don&apos;t matter in 2026:
      </p>
      <ul>
        <li>
          <strong>Upload schedule consistency.</strong> Helps habitual
          viewers, doesn&apos;t affect ranking.
        </li>
        <li>
          <strong>Video length thresholds.</strong> &quot;8-12 minutes is
          ideal&quot; is folklore. Longer videos can convert better if
          retention holds. Shorter videos can convert better when they&apos;re
          tight. YouTube doesn&apos;t favour either as a structural rule.
        </li>
        <li>
          <strong>End screens / cards.</strong> Helpful for retention within
          your channel, irrelevant for ranking.
        </li>
      </ul>

      <h2>One-page workflow</h2>
      <p>
        For each video, the sequence:
      </p>
      <ol>
        <li>
          Write the niche statement in one sentence. Test it against{" "}
          <Link href="/tools/youtube-keyword-tool">Keyword Tool</Link>{" "}
          autocomplete to confirm real search demand.
        </li>
        <li>
          Generate 10 title candidates with the{" "}
          <Link href="/tools/youtube-title-generator">Title Generator</Link>.
          Pick the one that&apos;s honest and shortest.
        </li>
        <li>Design the thumbnail.</li>
        <li>
          Write the description with the{" "}
          <Link href="/tools/youtube-description-generator">
            Description Generator
          </Link>
          . Put the strongest 120 characters first.
        </li>
        <li>
          Generate tags with the{" "}
          <Link href="/tools/youtube-tag-generator">Tag Generator</Link>;
          generate 3 hashtags with the{" "}
          <Link href="/tools/youtube-hashtag-generator">Hashtag Generator</Link>.
        </li>
        <li>
          Format your chapters with the{" "}
          <Link href="/tools/youtube-chapter-generator">Chapter Generator</Link>{" "}
          and paste them into the description.
        </li>
        <li>
          Publish at peak subscriber-engagement time.
        </li>
        <li>
          Wait 48 hours. Look at CTR + retention. Iterate the next video.
        </li>
      </ol>

      <p>
        That&apos;s the whole framework. Everything else is decoration.
      </p>
    </GuideLayout>
  );
}
