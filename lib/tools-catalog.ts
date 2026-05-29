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
    slug: "youtube-competitor-analyzer",
    title: "YouTube Competitor Channel Analyzer",
    shortTitle: "Competitor Analyzer",
    taskLabel: "Analyze a competitor channel",
    description:
      "Paste any YouTube channel — get their top 10 videos by views with title scores, view counts, and 3 patterns you can borrow.",
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
      "See how your thumbnail + title actually reads in YouTube search, home feed, sidebar, and mobile — before you publish.",
    metaDescription:
      "Free YouTube thumbnail preview tool. Render any thumbnail + title in real YouTube UI contexts (search, home, sidebar, mobile) to test CTR before publishing.",
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
      "Download any YouTube video's thumbnail in every available resolution — instantly, no watermarks.",
    metaDescription:
      "Free YouTube thumbnail downloader. Get HD, max resolution, and standard thumbnails from any YouTube URL. No signup, no watermark.",
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
      "Estimate YouTube earnings by views, niche, and engagement. Includes niche-specific CPM presets.",
    metaDescription:
      "Free YouTube earnings calculator. Estimate revenue by views with niche-specific CPM rates (gaming, finance, tech, lifestyle).",
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
      "Reveal the exact tags any YouTube video is using. Paste a competitor's URL to see their SEO setup.",
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
      "Discover what people are searching on YouTube. Get 20+ keyword suggestions from any seed term.",
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
      "Extract the YouTube channel ID from any channel URL, custom URL, handle, or video link.",
    metaDescription:
      "Find YouTube channel ID from any URL format — custom URLs, handles (@username), video links, or legacy channel URLs.",
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
      "Generate custom YouTube embed code with autoplay, start/end times, controls, mute, and loop.",
    metaDescription:
      "Generate custom YouTube embed code. Set autoplay, start/end times, controls, captions, and loop with one click.",
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
      "Format chapters and timestamps for YouTube descriptions. Validates ordering and the required 0:00 start.",
    metaDescription:
      "Format YouTube chapters and timestamps for descriptions. Validates ordering, the required 0:00 start, and minimum chapter length.",
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
      "Generate a complete YouTube description with intro, body, CTA, hashtags, and chapter placeholders.",
    metaDescription:
      "Free AI YouTube description generator. Includes intro, body, CTA, hashtags, and chapter formatting in one click.",
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
      "Generate 20-30 relevant tags for your YouTube video. Mix of broad terms and long-tail keywords.",
    metaDescription:
      "Free AI YouTube tag generator. Get 20+ relevant tags for any video — mix of broad and long-tail keywords.",
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
      "Get 15 relevant YouTube hashtags ranked by competition — niche-specific and broad-reach mix.",
    metaDescription:
      "Free AI YouTube hashtag generator. 15 relevant hashtags ranked by competition for any niche or topic.",
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
      "Get 10 fresh video ideas for your niche, each with a brief premise and angle.",
    metaDescription:
      "Free AI YouTube video idea generator. 10 fresh video ideas with premises for any niche or channel topic.",
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
      "Score any YouTube title 0-100 against documented best practices. Compare up to 5 variants side-by-side.",
    metaDescription:
      "Free YouTube title score checker. Evaluate any title against length, structure, angle, and clickbait-risk heuristics. Compare variants side-by-side.",
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
      return "Before you press record. Tools for finding what to make, scouting competitors, and validating that a topic is worth your time.";
    case "optimize":
      return "After you've shot it, before you upload. Tools that shape the surfaces viewers actually click — titles, thumbnails, tags, and hashtags.";
    case "publish":
      return "The final mile before you hit publish. Tools that format the description, chapters, and embeds the way YouTube expects.";
    case "analyze":
      return "After your video is live, or before you make the next bet. Tools that score what's working, surface what's broken, and project earnings.";
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
