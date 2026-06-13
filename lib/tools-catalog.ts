import {
  ImageDown,
  Calculator,
  Code2,
  Fingerprint,
  ListVideo,
  WandSparkles,
  PenLine,
  Tags,
  Hash,
  Lightbulb,
  Tv,
  ScanLine,
  Search,
  Gauge,
  ClipboardCheck,
  Users,
  Eye,
  TrendingUp,
  ClipboardList,
  Compass,
  type LucideIcon,
} from "lucide-react";

/**
 * Master catalog of all tools on the site.
 *
 * This single source of truth drives:
 *  - The homepage "what do you need?" chips
 *  - The /tools grid page
 *  - The header/footer navigation
 *  - The sitemap.xml (only `live` tools)
 *  - Structured data (SoftwareApplication schema)
 *
 * To add a new tool, append an entry here AND create the corresponding
 * route at app/tools/<slug>/page.tsx.
 */

export type ToolCategory =
  | "downloader"
  | "generator"
  | "calculator"
  | "utility"
  | "ai";

/**
 * Workflow stage — how a YouTube creator's actual process maps to our tools.
 * Used as the PRIMARY information architecture (header, footer, /tools page,
 * hub pages /tools/research etc). Category is kept for legacy reasons but
 * stage is what we organize around.
 */
export type ToolStage = "research" | "optimize" | "publish" | "analyze";

export type Tool = {
  /** URL slug — also the folder name under app/tools/ */
  slug: string;
  /** Full display title, used as page H1 and SERP title */
  title: string;
  /** Compact title for nav/cards */
  shortTitle: string;
  /** Short verb-phrase used in the homepage "What do you need?" chip */
  taskLabel: string;
  /** One-line user-facing summary (used on /tools card + meta description) */
  description: string;
  /** SEO meta description (slightly longer than `description`, optimized for SERP) */
  metaDescription: string;
  /** Primary category — kept for legacy filter UI (chip filter on /tools index). */
  category: ToolCategory;
  /** Workflow stage — primary information architecture (hub pages, footer, nav). */
  stage: ToolStage;
  /** Lucide icon component — rendered by ToolCard/ToolLayout/TaskChip */
  Icon: LucideIcon;
  /** Whether this tool calls Claude (incurs LLM cost — needs cost protection) */
  isAI: boolean;
  /** Approximate monthly US search volume for the primary keyword (planning only) */
  searchVolume?: number;
  /** Sitemap priority 0.0-1.0 */
  priority: number;
  /** `live` shows everywhere + sitemap; `coming-soon` shows on /tools but not sitemap */
  status: "live" | "coming-soon";
};

export const TOOLS: Tool[] = [
  // ──────────────────────────────────────────────────────────
  // Flagships — audit + competitor analyzer
  // ──────────────────────────────────────────────────────────
  {
    slug: "youtube-niche-check",
    title: "YouTube Niche Check",
    shortTitle: "Niche Check",
    taskLabel: "Check a topic's opportunity",
    description:
      "Validate a topic before recording with demand, competition, freshness, and small-channel breakthrough signals.",
    metaDescription:
      "Free YouTube niche check. Paste a topic, get a one-word verdict with score, signals, and top-20 evidence. Find under-saturated niches before recording.",
    category: "ai",
    stage: "research",
    Icon: Compass,
    isAI: false,
    searchVolume: 20000,
    priority: 0.96,
    status: "live",
  },
  {
    slug: "youtube-outlier-finder",
    title: "YouTube Outlier Finder",
    shortTitle: "Outlier Finder",
    taskLabel: "Find a channel's outlier videos",
    description:
      "Find the videos that beat a channel's normal baseline by 3x or more, with AI notes on what changed in topic, title, and format.",
    metaDescription:
      "Free YouTube outlier finder. Paste any channel — see which videos overperformed the channel's median by 3× or more, with AI analysis of what made them outliers vs average videos.",
    category: "ai",
    stage: "research",
    Icon: TrendingUp,
    isAI: true,
    searchVolume: 8000,
    priority: 0.96,
    status: "live",
  },
  {
    slug: "youtube-competitor-analyzer",
    title: "YouTube Competitor Channel Analyzer",
    shortTitle: "Competitor Analyzer",
    taskLabel: "Analyze a competitor channel",
    description:
      "Study a competitor channel and uncover the videos, title structures, and repeatable content patterns behind their biggest wins.",
    metaDescription:
      "Free YouTube competitor analyzer. Paste a channel — see their top 10 videos by views with title scores, engagement metrics, and 3 concrete patterns their videos share.",
    category: "ai",
    stage: "research",
    Icon: Users,
    isAI: true,
    searchVolume: 30000,
    priority: 0.97,
    status: "live",
  },
  {
    slug: "youtube-visibility-score",
    title: "YouTube Visibility Score",
    shortTitle: "Visibility Score",
    taskLabel: "Get a channel's Visibility Score",
    description:
      "Paste a channel — get a 0-100 composite Visibility Score across CTR Potential, Metadata Quality, Niche Headroom, and Growth Trajectory.",
    metaDescription:
      "Free YouTube Visibility Score. Paste any channel — get a composite 0-100 score across CTR Potential, Metadata Quality, Niche Headroom, and Growth Trajectory, with AI summary.",
    category: "ai",
    stage: "analyze",
    Icon: Gauge,
    isAI: true,
    searchVolume: 15000,
    priority: 0.98,
    status: "live",
  },
  {
    slug: "youtube-channel-audit",
    title: "YouTube Channel Audit",
    shortTitle: "Channel Audit",
    taskLabel: "Audit a whole YouTube channel",
    description:
      "Paste a channel — get a channel-wide grade across title, description, hashtags, and chapters, plus AI-flagged recurring issues across the last 10 uploads.",
    metaDescription:
      "Free YouTube channel audit. Paste any channel — get a channel-level grade with per-dimension breakdown and AI-identified recurring issues across the last 10 uploads.",
    category: "ai",
    stage: "analyze",
    Icon: ClipboardList,
    isAI: true,
    searchVolume: 12000,
    priority: 0.95,
    status: "live",
  },
  {
    slug: "youtube-video-audit",
    title: "YouTube Video Audit",
    shortTitle: "Video Audit",
    taskLabel: "Audit a YouTube video",
    description:
      "Paste any YouTube URL — get a free instant audit of title, description, tags, hashtags, and chapters with fix-it tools for every weakness.",
    metaDescription:
      "Free YouTube video audit. Paste a URL and get a 0-100 score for title, description, tags, hashtags, and chapters with one-click fixes for every weakness.",
    category: "utility",
    stage: "analyze",
    Icon: ClipboardCheck,
    isAI: false,
    searchVolume: 10000,
    priority: 0.99,
    status: "live",
  },

  // ──────────────────────────────────────────────────────────
  // Browser-side / serverless tools (no AI cost)
  // ──────────────────────────────────────────────────────────
  {
    slug: "youtube-thumbnail-preview",
    title: "YouTube Thumbnail Preview Tool",
    shortTitle: "Thumbnail Preview",
    taskLabel: "Preview a thumbnail in YouTube UI",
    description:
      "Check how your YouTube thumbnail and title read in search, sidebar, mobile, and dark mode before you publish.",
    metaDescription:
      "Free YouTube thumbnail preview tool. Test your thumbnail and title in search, home feed, sidebar, mobile, and dark mode before publishing.",
    category: "utility",
    stage: "optimize",
    Icon: Eye,
    isAI: false,
    searchVolume: 20000,
    priority: 0.93,
    status: "live",
  },
  {
    slug: "youtube-thumbnail-downloader",
    title: "YouTube Thumbnail Downloader",
    shortTitle: "Thumbnail Downloader",
    taskLabel: "Download a thumbnail",
    description:
      "Download HD and standard thumbnails from any YouTube video, Shorts URL, youtu.be link, or raw video ID.",
    metaDescription:
      "Free YouTube thumbnail downloader. Paste any video or Shorts URL to download HD, maxresdefault, hqdefault, and standard thumbnail images. No signup.",
    category: "downloader",
    stage: "optimize",
    Icon: ImageDown,
    isAI: false,
    searchVolume: 100000,
    priority: 0.9,
    status: "live",
  },
  {
    slug: "youtube-money-calculator",
    title: "YouTube Money Calculator",
    shortTitle: "Money Calculator",
    taskLabel: "Estimate earnings",
    description:
      "Estimate YouTube ad revenue from views, niche, and audience region with CPM, RPM, and revenue-share ranges.",
    metaDescription:
      "Estimate YouTube earnings from views, niche, audience region, CPM/RPM, and YouTube's revenue share. Free calculator for ad revenue ranges, not inflated guesses.",
    category: "calculator",
    stage: "analyze",
    Icon: Calculator,
    isAI: false,
    searchVolume: 80000,
    priority: 0.88,
    status: "live",
  },
  {
    slug: "youtube-tag-extractor",
    title: "YouTube Tag Extractor",
    shortTitle: "Tag Extractor",
    taskLabel: "Extract a competitor's tags",
    description:
      "Extract hidden tags from any YouTube video and use competitor metadata to improve your own tag strategy.",
    metaDescription:
      "Free YouTube tag extractor. See the tags any competitor's video is using by pasting a YouTube URL. No signup required.",
    category: "utility",
    stage: "research",
    Icon: ScanLine,
    isAI: false,
    searchVolume: 20000,
    priority: 0.87,
    status: "live",
  },
  {
    slug: "youtube-keyword-tool",
    title: "YouTube Keyword Tool",
    shortTitle: "Keyword Tool",
    taskLabel: "Find keywords",
    description:
      "Turn a seed topic into YouTube keyword ideas people actually search for, then use them for titles, tags, and video planning.",
    metaDescription:
      "Free YouTube keyword tool. Get 20+ keyword suggestions from any seed term using YouTube's own autocomplete data.",
    category: "utility",
    stage: "research",
    Icon: Search,
    isAI: false,
    searchVolume: 15000,
    priority: 0.85,
    status: "live",
  },
  {
    slug: "youtube-channel-id-finder",
    title: "YouTube Channel ID Finder",
    shortTitle: "Channel ID Finder",
    taskLabel: "Find a channel ID",
    description:
      "Convert any YouTube handle, URL, or video link into the permanent UC channel ID.",
    metaDescription:
      "Find a YouTube channel ID from any handle, custom URL, video link, Shorts URL, or legacy /user/ URL. Get the permanent UC ID and RSS feed URL.",
    category: "utility",
    stage: "research",
    Icon: Fingerprint,
    isAI: false,
    searchVolume: 30000,
    priority: 0.78,
    status: "live",
  },
  {
    slug: "youtube-embed-code-generator",
    title: "YouTube Embed Code Generator",
    shortTitle: "Embed Generator",
    taskLabel: "Generate embed code",
    description:
      "Generate custom YouTube embed code with autoplay, start/end times, controls, captions, loop, and responsive 16:9 wrapper.",
    metaDescription:
      "Generate custom YouTube embed code for any video. Set autoplay, mute, start/end time, captions, loop, controls, responsive layout, and privacy-enhanced mode.",
    category: "generator",
    stage: "publish",
    Icon: Code2,
    isAI: false,
    searchVolume: 10000,
    priority: 0.7,
    status: "live",
  },
  {
    slug: "youtube-chapter-generator",
    title: "YouTube Chapter & Timestamp Generator",
    shortTitle: "Chapter Generator",
    taskLabel: "Format chapters",
    description:
      "Format and validate YouTube chapters. Catches the 0:00 start, 3-chapter minimum, 10-second rule, and ordering before you publish.",
    metaDescription:
      "Generate and validate YouTube chapters for your video description. Format timestamps, check the required 0:00 start, fix ordering, and copy a paste-ready chapter block.",
    category: "generator",
    stage: "publish",
    Icon: ListVideo,
    isAI: false,
    searchVolume: 5000,
    priority: 0.7,
    status: "live",
  },

  // ──────────────────────────────────────────────────────────
  // AI-powered tools (Claude Haiku, gated by cost protection)
  // ──────────────────────────────────────────────────────────
  {
    slug: "youtube-title-generator",
    title: "AI YouTube Title Generator",
    shortTitle: "Title Generator",
    taskLabel: "Generate a title",
    description:
      "Generate 10 click-worthy YouTube titles for any topic. Multiple styles: curious, list, how-to, comparison.",
    metaDescription:
      "Free AI YouTube title generator. Get 10 SEO-optimized titles in seconds — list, how-to, comparison, and curiosity styles.",
    category: "ai",
    stage: "optimize",
    Icon: WandSparkles,
    isAI: true,
    searchVolume: 10000,
    priority: 0.86,
    status: "live",
  },
  {
    slug: "youtube-description-generator",
    title: "AI YouTube Description Generator",
    shortTitle: "Description Generator",
    taskLabel: "Write a description",
    description:
      "Generate a complete YouTube description with intro, summary, CTA, links, chapter placeholder, and hashtags.",
    metaDescription:
      "Free AI YouTube description generator. Create publish-ready descriptions with a strong intro, natural keywords, CTA, links, chapters placeholder, and hashtags.",
    category: "ai",
    stage: "publish",
    Icon: PenLine,
    isAI: true,
    searchVolume: 15000,
    priority: 0.85,
    status: "live",
  },
  {
    slug: "youtube-tag-generator",
    title: "AI YouTube Tag Generator",
    shortTitle: "Tag Generator",
    taskLabel: "Generate tags",
    description:
      "Generate relevant YouTube tags for any video topic, ready to paste into YouTube Studio.",
    metaDescription:
      "Free AI YouTube tag generator. Enter your video topic to get relevant broad, long-tail, and spelling-variant tags trimmed for YouTube's 500-character limit.",
    category: "ai",
    stage: "optimize",
    Icon: Tags,
    isAI: true,
    searchVolume: 30000,
    priority: 0.89,
    status: "live",
  },
  {
    slug: "youtube-hashtag-generator",
    title: "AI YouTube Hashtag Generator",
    shortTitle: "Hashtag Generator",
    taskLabel: "Generate hashtags",
    description:
      "Generate relevant YouTube hashtags for videos and Shorts, ready to paste into your title or description.",
    metaDescription:
      "Free AI YouTube hashtag generator. Enter a video topic to get relevant hashtags for videos and Shorts, with top 3 picks for YouTube's visible hashtag display.",
    category: "ai",
    stage: "optimize",
    Icon: Hash,
    isAI: true,
    searchVolume: 25000,
    priority: 0.84,
    status: "live",
  },
  {
    slug: "youtube-video-idea-generator",
    title: "AI YouTube Video Idea Generator",
    shortTitle: "Video Ideas",
    taskLabel: "Get video ideas",
    description:
      "Turn a niche into 10 filmable YouTube ideas with clear angles, formats, and viewer promises.",
    metaDescription:
      "Free AI YouTube video idea generator. Enter a niche or channel topic to get 10 filmable video ideas with angles, formats, and premises. No signup.",
    category: "ai",
    stage: "research",
    Icon: Lightbulb,
    isAI: true,
    searchVolume: 20000,
    priority: 0.83,
    status: "live",
  },
  {
    slug: "youtube-title-score-checker",
    title: "YouTube Title Score Checker",
    shortTitle: "Title Score Checker",
    taskLabel: "Score a title",
    description:
      "Score any YouTube title 0-100 and compare up to 5 variants before you publish.",
    metaDescription:
      "Free YouTube title score checker. Test title length, clarity, angle, keyword placement, truncation risk, and clickbait signals. Compare up to 5 variants.",
    category: "utility",
    stage: "optimize",
    Icon: Gauge,
    isAI: false,
    searchVolume: 5000,
    priority: 0.82,
    status: "live",
  },
  {
    slug: "youtube-channel-name-generator",
    title: "AI YouTube Channel Name Generator",
    shortTitle: "Channel Name Generator",
    taskLabel: "Name my channel",
    description:
      "Get 10 creative YouTube channel name ideas based on your niche and style preferences.",
    metaDescription:
      "Free AI YouTube channel name generator. 10 creative, brandable channel name ideas for any niche.",
    category: "ai",
    stage: "research",
    Icon: Tv,
    isAI: true,
    searchVolume: 15000,
    priority: 0.8,
    status: "live",
  },
];

/** Tools that should appear in the sitemap. */
export const liveTools = (): Tool[] =>
  TOOLS.filter((t) => t.status === "live");

/** All tools, ordered for display (highest priority first). */
export const allToolsSorted = (): Tool[] =>
  [...TOOLS].sort((a, b) => b.priority - a.priority);

/** Top N tools for the homepage "What do you need?" chip selector. */
export const featuredTools = (n = 8): Tool[] => allToolsSorted().slice(0, n);

/** Lookup a tool by slug. */
export const getToolBySlug = (slug: string): Tool | undefined =>
  TOOLS.find((t) => t.slug === slug);

/** Display label for a category. */
export const categoryLabel = (c: ToolCategory): string => {
  switch (c) {
    case "ai":
      return "AI Generators";
    case "downloader":
      return "Downloaders";
    case "generator":
      return "Generators";
    case "calculator":
      return "Calculators";
    case "utility":
      return "Utilities";
  }
};

/** Display label for a workflow stage. */
export const stageLabel = (s: ToolStage): string => {
  switch (s) {
    case "research": return "Research";
    case "optimize": return "Optimize";
    case "publish":  return "Publish";
    case "analyze":  return "Analyze";
  }
};

/** Short tagline shown in nav, hub headers, footer column subtitles. */
export const stageTagline = (s: ToolStage): string => {
  switch (s) {
    case "research": return "Find what to make";
    case "optimize": return "Titles, tags & thumbnails";
    case "publish":  return "Descriptions & format";
    case "analyze":  return "Audit & earnings";
  }
};

/** Longer description for the stage hub page hero. */
export const stageDescription = (s: ToolStage): string => {
  switch (s) {
    case "research":
      return "Before you press record. Find what to make, scout competitors with the Competitor Channel Analyzer, surface breakthrough patterns with the Outlier Finder, and validate that a topic is worth your time.";
    case "optimize":
      return "After you've shot it, before you upload. Shape the surfaces viewers actually click — titles, thumbnails (with multi-context Thumbnail Preview), tags, and hashtags. Each tool integrates with the Video Audit's Fix-with-AI button so weak packaging gets rewritten in one click.";
    case "publish":
      return "The final mile before you hit publish. Tools that format the description, chapters, and embeds the way YouTube expects — pair them with the AI Description Generator after the Video Audit to ship a complete package.";
    case "analyze":
      return "After your video is live, or before you make the next bet. The YouTube Visibility Score gives you a composite 0-100 number across CTR, metadata, headroom, and growth trajectory. Channel Audit aggregates weakness patterns across your last 10 uploads. Video Audit drills into a single video with one-click AI fixes. Money Calculator projects earnings. Plus weekly historical tracking on any channel you mark to follow.";
  }
};

/** Group tools by stage for hub-page rendering. */
export const toolsByStage = (): Record<ToolStage, Tool[]> => {
  const groups: Record<ToolStage, Tool[]> = {
    research: [],
    optimize: [],
    publish: [],
    analyze: [],
  };
  for (const t of allToolsSorted()) groups[t.stage].push(t);
  return groups;
};

/** Display order of stages — matches the creator's actual workflow. */
export const STAGE_ORDER: ToolStage[] = ["research", "optimize", "publish", "analyze"];

/** Group tools by category for grid/index display. */
export const toolsByCategory = (): Record<ToolCategory, Tool[]> => {
  const groups: Record<ToolCategory, Tool[]> = {
    ai: [],
    downloader: [],
    generator: [],
    calculator: [],
    utility: [],
  };
  for (const t of allToolsSorted()) groups[t.category].push(t);
  return groups;
};
