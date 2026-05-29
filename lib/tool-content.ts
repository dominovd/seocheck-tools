/**
 * Per-tool indexable content: How-to steps + SEO tips + related guide.
 *
 * Rendered by <ToolContentSections /> between the tool UI and the FAQ on
 * every tool page. Adds ~400-600 words of SEO-friendly text per page
 * without bloating the actual tool component code.
 *
 * Keep tips short and concrete (no fluff like "SEO-optimized"). Each step
 * should be doable; each tip should be a single rule or principle.
 */

export type HowToStep = { title: string; body: string };

export type ToolContent = {
  howToSteps: HowToStep[];
  seoTips: string[];
  /** Slug from lib/guides-catalog. Renders a callout linking to the guide. */
  relatedGuideSlug:
    | "youtube-seo-2026-complete-guide"
    | "how-to-write-youtube-titles"
    | "youtube-tags-best-practices-2026";
  /** One-sentence why-this-guide. */
  relatedGuideBlurb: string;
};

export const TOOL_CONTENT: Record<string, ToolContent> = {
  // ─── Browser-side utilities ───

  "youtube-thumbnail-downloader": {
    howToSteps: [
      {
        title: "Copy any YouTube video URL",
        body: "From the address bar, the Share button, or the channel page. We accept watch URLs, youtu.be short links, /shorts/ URLs, and embed URLs.",
      },
      {
        title: "Paste it into the field above",
        body: "The video ID is extracted in your browser — no upload, no signup, no tracking.",
      },
      {
        title: "Pick a resolution",
        body: "We surface every variant YouTube has: maxresdefault (1280×720), sddefault (640×480), hqdefault (480×360), mqdefault (320×180), and default (120×90). Lower variants are always available; maxres only exists for HD uploads.",
      },
      {
        title: "Download or copy the URL",
        body: "Click Download for a clean JPG named after the video and resolution, or Copy URL to embed the thumbnail elsewhere.",
      },
    ],
    seoTips: [
      "Thumbnails drive about 40% of YouTube click-through. Spend at least as much time on the thumbnail as on the title.",
      "Faces with strong emotion outperform graphics for personality-led channels.",
      "Cap your thumbnail at 3 visual elements. More than that competes with itself.",
      "Use 3-5 words of large legible text when the title alone undersells the value.",
      "Bright colour blocks beat photographs on mobile feeds where the thumbnail is tiny.",
      "Test thumbnails A/B in YouTube Studio. Change one variable at a time so you can isolate what moved CTR.",
      "Use maxresdefault for design references and competitor research; it's the print-quality version.",
      "Pre-2018 videos often have no maxresdefault — the tool falls back to hqdefault automatically.",
    ],
    relatedGuideSlug: "youtube-seo-2026-complete-guide",
    relatedGuideBlurb:
      "How thumbnails fit into the bigger YouTube algorithmic picture, alongside titles and retention curves.",
  },

  "youtube-money-calculator": {
    howToSteps: [
      {
        title: "Enter your views",
        body: "Per video or per month — whichever you want to estimate. Use the preset chips (1K / 10K / 100K / 1M) for quick reference points.",
      },
      {
        title: "Pick your niche",
        body: "CPM varies 15× between niches. Finance and insurance pay top dollar; gaming and music pay less. Pick the closest match for an honest estimate.",
      },
      {
        title: "Pick your audience region",
        body: "Tier-1 markets (US, UK, Canada, Australia) pay roughly double what Western Europe pays and 5× what India or Latin America pay. If your audience is mixed, use 'Global average'.",
      },
      {
        title: "Read the breakdown",
        body: "The headline number is your share after YouTube's 45% cut and the typical 60% monetised-playback ratio. The low and high range reflect ad fill variance.",
      },
    ],
    seoTips: [
      "December CPMs are 30-50% higher than January due to ad-budget seasonality. Plan revenue around the annual average, not the holiday peak.",
      "Videos under 8 minutes don't qualify for mid-roll ads. The estimate assumes mid-roll eligibility.",
      "Niche selection matters more than view count once you're past a few thousand subscribers. A 50K-view finance video can out-earn a 500K-view gaming video.",
      "RPM (the real metric in Studio) is roughly CPM × 0.55 × monetised-playback-ratio. Use the calculator output as RPM, not CPM.",
      "Audience region is the single biggest swing factor your channel can intentionally shape — choose topics that resonate in higher-CPM markets if monetisation is the goal.",
      "Sponsorships and affiliate income typically dwarf YouTube ad revenue at scale. The Money Calculator doesn't include those.",
    ],
    relatedGuideSlug: "youtube-seo-2026-complete-guide",
    relatedGuideBlurb:
      "How monetisation interacts with discovery, retention, and niche choice in 2026.",
  },

  "youtube-channel-id-finder": {
    howToSteps: [
      {
        title: "Paste any YouTube URL or handle",
        body: "Channel URL with /channel/UC..., a modern @handle, legacy /c/ or /user/ URL, a video URL, or even just the 11-char video ID — the tool figures out the rest.",
      },
      {
        title: "Click Find channel ID",
        body: "URLs with /channel/UC... resolve instantly in your browser. Everything else hits our serverless endpoint, which fetches the YouTube page and parses the ID from the metadata.",
      },
      {
        title: "Copy whichever identifier you need",
        body: "The result includes the UC channel ID, the canonical channel URL, the handle URL (when available), and the RSS feed URL for subscribing in any RSS reader.",
      },
      {
        title: "Open the channel to verify",
        body: "Click the YouTube link in the result to confirm it's the right channel before plugging the ID into your tooling.",
      },
    ],
    seoTips: [
      "Channel IDs (UC...) are permanent. Handles (@username) can change. Always use the channel ID when wiring up automation.",
      "The RSS feed URL works in any reader (Feedly, Inoreader, NetNewsWire) and bypasses the algorithm entirely — useful for monitoring competitors without polluting your home feed.",
      "Most third-party YouTube analytics tools (TubeBuddy, VidIQ, Tubular) require the channel ID, not the handle.",
      "Legacy /c/ and /user/ URLs from channels created before 2016 don't expose the UC ID in the URL — you have to look it up.",
      "Zapier, Make, n8n, and similar automation tools all want the channel ID for YouTube triggers.",
      "Channel IDs are public — they appear in every video page's source code and are exposed via the YouTube Data API.",
    ],
    relatedGuideSlug: "youtube-seo-2026-complete-guide",
    relatedGuideBlurb:
      "Why channel identity stability matters for the algorithm and how IDs differ from handles.",
  },

  "youtube-tag-extractor": {
    howToSteps: [
      {
        title: "Find 3-5 competitor videos in your exact niche",
        body: "The closer the topic match, the more useful the data. Videos with 100K-1M views from established channels are the sweet spot.",
      },
      {
        title: "Paste a video URL and click Extract tags",
        body: "We fetch the video page server-side and parse the meta keywords tag. YouTube hides tags from the public UI but they're still in every video's HTML source.",
      },
      {
        title: "Note the overlap",
        body: "Tags that appear in all 3-5 videos are usually the highest-ranked terms in the niche. Add the ones you don't already have.",
      },
      {
        title: "Find the gaps",
        body: "Tags competitors use that you don't have a variant of — those are missing search angles you can target in your own title and tags.",
      },
      {
        title: "Use as inspiration, never copy verbatim",
        body: "YouTube can detect mass-copied tag lists and may flag your video for misleading metadata. Take the angles, write your own.",
      },
    ],
    seoTips: [
      "Tags still matter for misspellings, topic disambiguation, and first-hour topical signal — but not for ranking on their own.",
      "Combined tag length must stay under 500 characters including commas. Quality over quantity.",
      "The first 3-5 tags carry the most weight — put your strongest primary keyword variants there.",
      "A healthy mix is ~30% broad (1-2 words), ~50% mid-specific (3 words), ~20% long-tail (4-6 words).",
      "Include 1-2 deliberate misspellings of your primary keyword if any are common — tags are where this kind of capture lives.",
      "Don't include tags about unrelated trending topics. YouTube's misleading-metadata enforcement is aggressive.",
      "Avoid channel-name tags. YouTube already knows your channel.",
    ],
    relatedGuideSlug: "youtube-tags-best-practices-2026",
    relatedGuideBlurb:
      "The honest framework for tag strategy in 2026 — what still matters, what doesn't, and how to combine extraction with the AI tag generator.",
  },

  "youtube-keyword-tool": {
    howToSteps: [
      {
        title: "Type a seed keyword",
        body: "Start broad — 'drone review', 'react tutorial', 'sourdough'. The tool returns YouTube's own autocomplete suggestions for that seed.",
      },
      {
        title: "Pick your audience region",
        body: "US, UK, India, Brazil, Germany, Japan — autocomplete suggestions vary noticeably by region. Pick the market your channel targets.",
      },
      {
        title: "Click Find keywords for the base 10-15 suggestions",
        body: "These are the highest-confidence variants YouTube has on your seed.",
      },
      {
        title: "Click Expand to 100+ variants for the long tail",
        body: "We run 26 parallel queries (seed + each letter A-Z) and de-duplicate. This surfaces the long-tail keywords most creators miss.",
      },
      {
        title: "Switch to the Grouped view",
        body: "We bucket suggestions by intent: Questions (what/why/how), Comparisons (vs / or), Best & top, Tutorials, and Other. Each group is a different angle for your content plan.",
      },
    ],
    seoTips: [
      "YouTube autocomplete is backed by real search data — anything that appears is something people type. Anything that doesn't is something people don't.",
      "Question-prefixed keywords ('how to', 'why does', 'what is') signal informational intent — these are easiest to rank for and convert into watch time.",
      "Comparison keywords ('X vs Y') tend to attract higher-engagement viewers actively making a purchase decision.",
      "Long-tail keywords (4+ words) have less competition and rank faster, even with moderate watch time.",
      "Cross-region pivots reveal market gaps — a topic saturated in the US may have low competition in India or Brazil.",
      "Use autocomplete as a primary research signal, not a ranking tool. There's no volume data here — for that you need a paid keyword research service.",
      "Plan content in clusters: pick a seed, expand A-Z, then group the variants into a series of 5-10 related videos.",
    ],
    relatedGuideSlug: "youtube-seo-2026-complete-guide",
    relatedGuideBlurb:
      "Where keyword research sits in the bigger picture — and why YouTube autocomplete beats most paid keyword tools for early-stage research.",
  },

  "youtube-embed-code-generator": {
    howToSteps: [
      {
        title: "Paste your YouTube video URL",
        body: "Watch URL, youtu.be short link, or /shorts/ URL all work. The tool extracts the video ID and shows a live preview.",
      },
      {
        title: "Toggle the player options you want",
        body: "Autoplay (forces mute), Hide controls, Loop, Captions on, Restrict related videos, Privacy mode (youtube-nocookie.com). The preview updates as you toggle.",
      },
      {
        title: "Set start and end times if you want a clip",
        body: "Use mm:ss or plain seconds — '1:30' or '90' both work. End without start is fine.",
      },
      {
        title: "Pick output format",
        body: "Plain iframe for forums and CMS embed fields. Responsive 16:9 wrapper for modern blogs and landing pages.",
      },
      {
        title: "Copy and paste into your HTML",
        body: "The snippet is everything you need — no script tags, no extra wrappers.",
      },
    ],
    seoTips: [
      "Embedded YouTube videos count toward your watch time even when viewers don't visit YouTube itself — your video benefits whether the play happens on your blog or on the platform.",
      "Privacy-enhanced mode (youtube-nocookie.com) is the right default for any embed on a site with GDPR or CCPA concerns. Functionality is identical.",
      "Autoplay requires mute on modern browsers. The tool forces mute automatically when you enable autoplay.",
      "Loop alone doesn't work — YouTube requires playlist=videoId for single-video looping. The tool wires this up for you.",
      "rel=0 since 2018 restricts suggestions to the same channel only — it no longer fully hides them.",
      "Use the responsive wrapper on any site that ever loads on mobile. Plain iframes break on phones.",
      "Embedded plays show up in YouTube Studio's analytics under 'External', so you can measure the contribution to overall channel performance.",
    ],
    relatedGuideSlug: "youtube-seo-2026-complete-guide",
    relatedGuideBlurb:
      "Why embedded views still count and how to use blog embeds as a discovery channel.",
  },

  "youtube-chapter-generator": {
    howToSteps: [
      {
        title: "Paste your timestamped lines",
        body: "One chapter per line, format '0:00 Title' or '0:00 - Title'. Hours work too: '1:23:45 Title'. Use the 'Try a sample' button for a working example.",
      },
      {
        title: "Read the validation banner",
        body: "Green = YouTube will display your chapters. Red = something violates the rules and YouTube will silently skip rendering chapters until you fix it.",
      },
      {
        title: "Fix any errors",
        body: "Common issues: first timestamp isn't 0:00, fewer than 3 chapters, a chapter shorter than 10 seconds, timestamps not strictly ascending.",
      },
      {
        title: "Choose your output format",
        body: "Plain '0:00 Title' or dash-separated '0:00 - Title' — match what the rest of your description uses.",
      },
      {
        title: "Copy the formatted block",
        body: "Paste it into your video description in YouTube Studio. The chapters appear on the progress bar within a few minutes.",
      },
    ],
    seoTips: [
      "Chapters significantly boost average view duration on long-form videos by letting viewers skip to what they want.",
      "First timestamp must be 0:00, you need at least 3 chapters, each chapter must be at least 10 seconds long, and timestamps must strictly ascend. YouTube silently ignores chapters that violate any of these rules.",
      "Use chapters for videos longer than ~3 minutes. Shorter videos don't benefit and may look over-engineered.",
      "Don't sandbag the intro at 0:00. Use it as the actual chapter title (e.g. '0:00 What we're building'), not a filler word.",
      "Chapter titles get truncated visually around 40-50 characters on mobile. Keep them concise.",
      "Use chapters as a content-planning tool: write them before filming to enforce structure.",
      "Emojis render fine in chapter titles but don't help with SEO. Use them for visual hierarchy on long videos, not engagement bait.",
      "YouTube Shorts don't support chapters at all.",
    ],
    relatedGuideSlug: "youtube-seo-2026-complete-guide",
    relatedGuideBlurb:
      "Why chapter structure matters for retention curves and how YouTube's algorithm reads them.",
  },

  // ─── AI generators ───

  "youtube-title-generator": {
    howToSteps: [
      {
        title: "Describe your video specifically",
        body: "Not 'tech review' — 'honest M5 MacBook Pro review after 30 days for video editors who already own an M2'. The narrower the input, the sharper the output.",
      },
      {
        title: "Pick a style if you have a signature",
        body: "Mixed gives variety across 6 angles. Curiosity, listicle, how-to, comparison, contrarian, or story if you want all 10 in one angle. Match the angle your channel is known for.",
      },
      {
        title: "Pass the Turnstile check (usually invisible)",
        body: "Cloudflare's bot challenge runs silently in the background for almost everyone. You'll only see it if your IP looks suspicious.",
      },
      {
        title: "Generate and scan the 10 titles",
        body: "Each title is in the 40-70 character sweet spot. Each row shows the character count — amber if outside the sweet spot.",
      },
      {
        title: "Pick the honest one, not the punchiest",
        body: "Over-promising in the title spikes CTR once and tanks retention forever. The best title is the most accurate one written most interestingly.",
      },
    ],
    seoTips: [
      "Titles between 40 and 70 characters display fully in search results, browse feeds, and the related-videos column. Above 70, YouTube truncates with an ellipsis.",
      "The first 6-8 words decide whether a viewer keeps scanning. Put the value there, not your channel name or 'Episode 47'.",
      "Mix angles across your channel — videos always in one angle (always listicles, always hot takes) get flattened by the algorithm.",
      "Curiosity gaps work but you must deliver on the implied promise. Empty curiosity destroys long-term CTR.",
      "Numbers in titles boost both CTR and chapter detection. 'Top 5' beats 'top few'.",
      "All caps drops CTR 20-30% on average and signals low effort to YouTube's moderation models.",
      "Edit titles 48 hours after publish if CTR is below your channel average. YouTube re-tests with the new version within hours.",
      "Don't change title and thumbnail at the same time — you won't know which moved the metric.",
    ],
    relatedGuideSlug: "how-to-write-youtube-titles",
    relatedGuideBlurb:
      "The 5 angles top channels rotate through, the 40-70 sweet spot, and the specific mistakes that kill CTR before the video has a chance.",
  },

  "youtube-description-generator": {
    howToSteps: [
      {
        title: "Write a tight video brief",
        body: "2-4 sentences describing what the video covers, who it's for, and any specific angle. Specificity in the brief = specificity in the output.",
      },
      {
        title: "Optionally add your channel name",
        body: "The model weaves it into the call-to-action naturally if provided. Skip if you're early-stage and the channel name is still in flux.",
      },
      {
        title: "Generate the description",
        body: "The model returns a structured description: 1-2 line hook (these are the only 120 chars YouTube shows in search), 2-3 paragraph body, chapter placeholder, CTA, and 3 hashtags at the end.",
      },
      {
        title: "Replace the chapter placeholder",
        body: "Drop in your real chapter timestamps. Use our Chapter Generator to validate them against YouTube's 4 rules.",
      },
      {
        title: "Add affiliate or sponsor links after the CTA",
        body: "We leave room for these intentionally. Disclose paid partnerships clearly — YouTube requires it and the FTC enforces it.",
      },
    ],
    seoTips: [
      "The first 120 characters of your description show up in search results and the 'more' preview before viewers click. Write them like a sub-title that delivers the why.",
      "Length isn't a ranking factor but signal density is. Aim for 800-2,500 characters with meaningful content, not filler.",
      "Use the natural keywords your title implies — don't keyword-stuff. The 2024 algorithm update specifically downweighted descriptions that read like SEO-bait.",
      "Put chapter timestamps in every video longer than 3 minutes — they boost average view duration and signal structure to YouTube.",
      "Subscribe-prompts at the top waste the most valuable real estate. Put them in the CTA section, after the body.",
      "Only the first 3 hashtags from the description display above the title. Choose deliberately.",
      "Affiliate disclosure should be visible without 'show more'. Put it in the first paragraph if your video relies heavily on affiliate income.",
    ],
    relatedGuideSlug: "youtube-seo-2026-complete-guide",
    relatedGuideBlurb:
      "Where the description sits in YouTube's ranking model and how it interacts with title, tags, and watch behaviour.",
  },

  "youtube-tag-generator": {
    howToSteps: [
      {
        title: "Describe your video in plain language",
        body: "The model uses your description to choose the right mix of broad terms, mid-specific phrases, and long-tail variants.",
      },
      {
        title: "Generate 20-30 tags",
        body: "The output is sorted by importance — most relevant tags first. The total is automatically trimmed to fit under YouTube's 500-character ceiling with a small buffer.",
      },
      {
        title: "Add 1-2 deliberate misspellings of your primary keyword",
        body: "If your primary keyword has common typos, add them by hand. Tags are where misspelling-capture lives — the title can't reasonably contain them.",
      },
      {
        title: "Cross-check with competitor tags",
        body: "Run the Tag Extractor on 3-5 top videos in your niche. Add tags you missed; drop ones that don't fit.",
      },
      {
        title: "Paste comma-separated into YouTube Studio",
        body: "Use the 'Copy all (comma-separated)' button. YouTube parses commas automatically.",
      },
    ],
    seoTips: [
      "Combined tag length must stay under 500 characters including commas. Quality over quantity.",
      "Tag order matters — YouTube weights earlier tags more. Put your strongest 3-5 primary keyword variants in the first positions.",
      "The 30/50/20 mix is a safe default: 30% broad terms, 50% mid-specific, 20% long-tail.",
      "Don't repeat your channel name in tags. The algorithm already knows your channel.",
      "Avoid single-letter and generic spam tags ('a', 'the', 'cool', 'new'). Every tag should be a phrase a real viewer might search for.",
      "Tags don't help with click-through rate or browse-feed discovery — they help with search disambiguation and first-hour topical signal.",
      "Skip the trending-from-other-niches hack. Using #mrbeast on an unrelated cooking video may flag your video for misleading metadata.",
    ],
    relatedGuideSlug: "youtube-tags-best-practices-2026",
    relatedGuideBlurb:
      "What tags still do in 2026 and how to combine the AI generator with competitor extraction for a complete tag list.",
  },

  "youtube-hashtag-generator": {
    howToSteps: [
      {
        title: "Describe your video",
        body: "A specific topic produces specific hashtag candidates. Generic topics get generic hashtags.",
      },
      {
        title: "Generate 15 hashtags ranked by competition",
        body: "Each hashtag is tagged High (millions of videos using it), Medium (niche-aware), or Low (specific enough that your video might rank on the hashtag page).",
      },
      {
        title: "Focus on the top 3",
        body: "YouTube only displays the first 3 hashtags from your description above the title. Those are your primary visible signals — choose deliberately.",
      },
      {
        title: "Paste at the end of your description",
        body: "YouTube reads the last line for the 3 hashtags to display. Use the 'Copy top 3' button for the visible set.",
      },
      {
        title: "Don't exceed 15 hashtags total",
        body: "Beyond 15, YouTube ignores all hashtags on the video and may flag it for hashtag spam.",
      },
    ],
    seoTips: [
      "Hashtags are public and clickable; tags are private metadata. Different functions, different best practices.",
      "Only the first 3 hashtags from your description display above the title — those are the high-stakes ones.",
      "A balanced top 3 mixes one high-competition hashtag for reach, one medium for discoverability, one low for niche-precision.",
      "Hashtags drive discovery on the hashtag landing pages — a separate surface from search and browse.",
      "YouTube Shorts rely on hashtags more than long-form videos do. #shorts is essentially required for Shorts shelf distribution.",
      "Don't use trending hashtags from unrelated niches. YouTube's misleading-metadata enforcement is aggressive.",
      "Hashtags don't help CTR — that's title and thumbnail. They help discovery, which is upstream of CTR.",
    ],
    relatedGuideSlug: "youtube-tags-best-practices-2026",
    relatedGuideBlurb:
      "Hashtags vs tags — what each does, where they live, and how to use both without overlap.",
  },

  "youtube-video-idea-generator": {
    howToSteps: [
      {
        title: "Describe your niche specifically",
        body: "'Cooking' returns generic ideas. 'Solo home-cooking on a $30/week grocery budget for college students' returns ideas you can actually film.",
      },
      {
        title: "Pick a format if you have one",
        body: "Mixed for variety. Tutorial, deep dive, listicle, experiment, comparison, or review if your channel has a signature format.",
      },
      {
        title: "Generate 10 ideas with title + premise",
        body: "The premise is what the video would actually contain — angle, structure, what the viewer learns. Use it as a working brief.",
      },
      {
        title: "Generate 2-3 batches",
        body: "Same niche on a different click returns different ideas. The model runs at high creative temperature for this tool.",
      },
      {
        title: "Filter aggressively",
        body: "Pick the 3-5 ideas you're actually excited to film. Excitement reads on camera; obligation doesn't.",
      },
    ],
    seoTips: [
      "Search demand validates ideas faster than gut feel. Test your top picks against the Keyword Tool autocomplete before committing.",
      "Avoid ideas that require you to fake expertise. Algorithm aside, viewers detect it within 30 seconds and retention collapses.",
      "Mix evergreen and timely ideas. Evergreen ideas earn slowly forever; timely ideas spike then fade.",
      "Plan ideas in clusters of 3-5 related videos so each video can promote the next via end screens and pinned comments.",
      "Pivot exploration: type a niche you're considering moving into. If you can't name 10 videos you'd be excited to make there, the pivot is probably wrong.",
      "Listicle format works best for evergreen utility. Experiments work best for personality-led channels. Pick by channel type, not by trend.",
      "Don't film an idea just because the model returned it. The model trains on what worked for others, not what works for you specifically.",
    ],
    relatedGuideSlug: "youtube-seo-2026-complete-guide",
    relatedGuideBlurb:
      "How ideation fits into the algorithmic surface YouTube actually rewards — and why niche specificity beats variety.",
  },

  "youtube-channel-name-generator": {
    howToSteps: [
      {
        title: "Describe your channel niche concretely",
        body: "'Travel' returns generic names. 'Solo travel tips for women over 40 on a budget' returns brandable, niche-anchored ideas.",
      },
      {
        title: "Pick a style for your channel type",
        body: "Short & brandable for product-style channels (think Vox, Wired). Descriptive for SEO-first. Personality-driven for face-led channels. Playful for entertainment. Professional for B2B and education.",
      },
      {
        title: "Optionally add your name",
        body: "If you picked Personality-driven, the model weaves your name into several of the 10 variants.",
      },
      {
        title: "Generate 10 names with rationales",
        body: "Each name comes with a one-sentence rationale and a suggested @handle preview (lowercased, spaces removed).",
      },
      {
        title: "Verify availability before committing",
        body: "Click the 'Check' link next to each name to open a YouTube search for it. If the top result is an established channel, pick a different one — collisions hurt search visibility.",
      },
    ],
    seoTips: [
      "Channel name should fit on a YouTube banner — under 20-25 characters is the safe upper limit.",
      "If you can't say it out loud to a friend without cringing, it'll fail the recall test.",
      "Made-up brandable names (1-2 words) work for product-style channels but require longer to build recognition.",
      "Descriptive names tell viewers the niche immediately and rank better for niche-specific searches, but lock you into that niche.",
      "Personality-driven names work for solo creators with face-led content; they tie your brand to your specific person.",
      "Trademark check the top 3-5 candidates before committing. Even without legal trademark, name collisions with established channels kill discovery.",
      "Channel handles (@names) must be unique across YouTube. Your displayed name and handle can differ.",
      "YouTube lets you change your channel name up to 3 times every 14 days — but renaming after a substantial audience exists is risky.",
    ],
    relatedGuideSlug: "youtube-seo-2026-complete-guide",
    relatedGuideBlurb:
      "Why channel naming sits at the start of the algorithmic identity chain and how it affects every downstream signal.",
  },
};
