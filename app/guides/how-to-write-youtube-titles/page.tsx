import Link from "next/link";
import { GuideLayout } from "@/components/GuideLayout";
import { buildMetadata } from "@/lib/seo";
import { getGuideBySlug } from "@/lib/guides-catalog";

const guide = getGuideBySlug("how-to-write-youtube-titles")!;

export const metadata = buildMetadata({
  title: guide.title,
  description: guide.description,
  path: `guides/${guide.slug}`,
});

export default function HowToWriteYouTubeTitlesPage() {
  return (
    <GuideLayout guide={guide}>
      <p>
        Titles drive click-through rate, and click-through rate determines
        whether YouTube keeps showing your video. A great title above an
        average video outperforms a mediocre title above a great video — the
        algorithm doesn&apos;t watch your content, it watches whether viewers
        click on the impression.
      </p>

      <p>
        This guide is the working playbook for titles. No fluff, no &quot;use
        power words&quot;. We&apos;ll cover the five angles that actually
        rotate through top channels, the 40-70 character sweet spot, and the
        specific mistakes that kill CTR before the video ever has a chance.
      </p>

      <h2>The 40-70 character rule</h2>
      <p>
        YouTube truncates titles with an ellipsis above 70 characters in
        search results, browse feeds, and the related-videos column. That
        means anything past 70 characters is invisible at the moment of
        click decision. Below 30, titles tend to undersell — there&apos;s not
        enough room to pack both the keyword and the curiosity.
      </p>

      <p>
        The 40-70 sweet spot maximises full-display rate without sacrificing
        keyword density. Aim for the lower end (40-50) when your channel
        relies on thumbnails as the primary hook. Aim for the upper end
        (60-70) when your title carries the curiosity load alone.
      </p>

      <h2>The five angles top channels rotate through</h2>

      <h3>1. Curiosity (open loop)</h3>
      <p>
        The title sets up a question or implication and withholds the
        answer. Effective when your topic has a counter-intuitive payoff or
        a hidden mechanism.
      </p>
      <ul>
        <li>&quot;Why nobody talks about the iPhone 17&apos;s biggest flaw&quot;</li>
        <li>&quot;The reason most home renovations fail in year two&quot;</li>
        <li>&quot;Why this $40 espresso machine outperforms the $2,000 ones&quot;</li>
      </ul>
      <p>
        Risk: if the video doesn&apos;t deliver on the implied promise,
        retention drops sharp and you lose the algorithmic boost. Use this
        angle only when you actually have the answer.
      </p>

      <h3>2. Listicle (numbered)</h3>
      <p>
        A number in the title sets viewer expectation about depth and
        structure. Lists also signal to YouTube&apos;s topical classifier
        that you&apos;ve structured the video — which improves chapter
        detection and discovery.
      </p>
      <ul>
        <li>&quot;7 React patterns I use in every project&quot;</li>
        <li>&quot;5 mistakes new sourdough bakers make&quot;</li>
        <li>&quot;3 tools that actually save you time in 2026&quot;</li>
      </ul>
      <p>
        Risk: the number sets a hard expectation. 7 means 7. Padding with
        weak items hurts retention. If you have 3 great ideas and 4 mediocre
        ones, the title should say 3.
      </p>

      <h3>3. How-to (instructional)</h3>
      <p>
        Direct utility framing — the viewer knows exactly what they&apos;ll
        learn. Strong on search because it matches the exact phrasing of
        the query (&quot;how do I…&quot;).
      </p>
      <ul>
        <li>&quot;How to set up a homelab on a $200 budget&quot;</li>
        <li>&quot;How to write Python that doesn&apos;t make you cry&quot;</li>
        <li>&quot;How I built a $1M business while keeping my day job&quot;</li>
      </ul>
      <p>
        Risk: low ceiling on browse-surface discovery. People search for
        how-tos; they don&apos;t click them out of curiosity. Use for
        evergreen content with intent-driven traffic.
      </p>

      <h3>4. Comparison (vs / or)</h3>
      <p>
        Two named things compete for attention. Pulls viewers from both
        sides of the comparison.
      </p>
      <ul>
        <li>&quot;Notion vs Obsidian: which one stays out of your way?&quot;</li>
        <li>&quot;iPhone 17 or Pixel 10? I used both for 30 days&quot;</li>
        <li>&quot;React Server Components vs Next.js Pages — when to use which&quot;</li>
      </ul>
      <p>
        Risk: requires real comparison. &quot;Spoiler: I like both&quot; is
        the worst possible verdict for retention. Pick a side.
      </p>

      <h3>5. Contrarian (hot take)</h3>
      <p>
        State a position most viewers disagree with, then defend it. Highest
        CTR ceiling, highest retention risk.
      </p>
      <ul>
        <li>&quot;Why I quit React after 8 years&quot;</li>
        <li>&quot;The home gym industry is lying to you&quot;</li>
        <li>&quot;Most YouTube SEO advice is outdated. Here&apos;s what actually works.&quot;</li>
      </ul>
      <p>
        Risk: viewers expect a sharp defence. A hot-take title with a
        wishy-washy video is the single fastest way to torch your channel&apos;s
        trust score with the algorithm and the audience.
      </p>

      <h2>The 1-2 angle rotation rule</h2>
      <p>
        Don&apos;t use the same angle on every video. YouTube&apos;s topical
        classifier flattens channels that look like &quot;always
        listicles&quot; or &quot;always hot takes&quot; — they become easy
        to ignore. Rotate two or three angles across your last ten videos.
      </p>

      <p>
        The fastest way to get title variants in different angles for the
        same topic: drop your video brief into the{" "}
        <Link href="/tools/youtube-title-generator">AI Title Generator</Link>
        . Pick the angle that feels honest, generate, and rotate over time.
      </p>

      <h2>Common mistakes that kill CTR</h2>

      <h3>1. Front-loading the channel name</h3>
      <p>
        &quot;Tech Insights — Honest Review of the iPhone 17&quot; wastes
        the most valuable characters on something the viewer already sees in
        the channel name below the title. The first 6-8 words decide whether
        a viewer keeps scanning. Put the value there, not your brand.
      </p>

      <h3>2. Curiosity gaps with no payoff</h3>
      <p>
        &quot;You won&apos;t believe what happened&quot; titles still work
        for CTR on the first impression but destroy long-term performance —
        viewers learn that your channel oversells, click-through drops over
        time, and the algorithm responds.
      </p>

      <h3>3. ALL CAPS or excessive punctuation</h3>
      <p>
        Both signal low-effort spam to viewers and to YouTube&apos;s
        moderation models. CTR drops 20-30% on average compared to
        sentence-case titles in the same niche.
      </p>

      <h3>4. Keyword stuffing</h3>
      <p>
        &quot;React tutorial React beginner React 2026 React hooks&quot; gets
        you nothing. The 2024 algorithm update specifically downweighted
        repetition. Stick to one primary keyword phrase and let the tag list
        carry variations — generate tags with the{" "}
        <Link href="/tools/youtube-tag-generator">AI Tag Generator</Link>.
      </p>

      <h3>5. Burying the niche</h3>
      <p>
        &quot;My honest review&quot; tells YouTube nothing. &quot;My honest
        long-term iPhone 17 Pro review for video editors&quot; tells YouTube
        exactly who to surface this for. The narrower your niche statement,
        the easier the algorithm&apos;s job and the more impressions it
        gives you.
      </p>

      <h2>How to A/B test titles</h2>
      <p>
        YouTube Studio lets you change a title at any time. The video&apos;s
        position in browse feeds adjusts within hours of the change. The
        clean workflow:
      </p>

      <ol>
        <li>Publish with your strongest title candidate.</li>
        <li>
          After 48 hours, check CTR in Studio &gt; Analytics &gt; Reach. If
          CTR is at or above your channel average, leave it alone.
        </li>
        <li>
          If CTR is below average and views aren&apos;t obviously growing,
          try a second angle. Don&apos;t change the thumbnail at the same
          time — you won&apos;t know which variable moved.
        </li>
        <li>
          If the second title also underperforms, the issue is the
          thumbnail or the topic itself. Move on; iterate on the next video.
        </li>
      </ol>

      <p>
        Don&apos;t flip titles back and forth more than twice — viewers who
        see the same video with three different titles get confused and the
        algorithm registers it as instability.
      </p>

      <h2>Templates that age well</h2>
      <p>
        Tactical formulas that consistently outperform generic alternatives
        across niches:
      </p>
      <ul>
        <li>
          <strong>I tried X for Y days.</strong> First-person experiment
          framing. Honest CTR ceiling, strong retention because it sets a
          time-bounded story.
        </li>
        <li>
          <strong>I switched from X to Y. Here&apos;s what changed.</strong>{" "}
          Comparison + personal stakes.
        </li>
        <li>
          <strong>Why I [unexpectedly did X].</strong> Curiosity with
          first-person investment.
        </li>
        <li>
          <strong>The truth about [popular thing].</strong> Contrarian frame
          without committing you to a specific position upfront.
        </li>
        <li>
          <strong>X mistakes I made so you don&apos;t have to.</strong>{" "}
          Listicle + utility + first-person credibility.
        </li>
      </ul>

      <h2>One more thing</h2>
      <p>
        Your title is a contract. Every viewer who clicks expects the video
        to deliver on what the title promised. Over-promising spikes CTR
        once and tanks retention forever. Under-promising leaves
        impressions on the table.
      </p>
      <p>
        The best titles describe exactly what the video gives — and just
        slightly more interestingly than the video itself. That&apos;s the
        whole job.
      </p>
    </GuideLayout>
  );
}
