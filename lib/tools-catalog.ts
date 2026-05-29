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
  type LucideIcon,
} from "lucide-react";

/**
 * Master catalog of all tools on the site.
 *
 * This single source of truth drives:
 *  - The homepage tool grid
 *  - The header/footer navigation
 *  - The sitemap.xml (only `live` tools)
 *  - Structured data (SoftwareApplication schema)
 *  - Per-category filtering on the /tools index page (future)
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

export type Tool = {
  /** URL slug — also the folder name under app/tools/ */
  slug: string;
  /** Full display title, used as page H1 and SERP title */
  title: string;
  /** Compact title for nav/cards */
  shortTitle: string;
  /** One-line user-facing summary (used on homepage card + meta description) */
  description: string;
  /** SEO meta description (slightly longer than `description`, optimized for SERP) */
  metaDescription: string;
  /** Primary category — drives filtering and homepage grouping */
  category: ToolCategory;
  /** Lucide icon component — rendered by ToolCard/ToolLayout */
  Icon: LucideIcon;
  /** Whether this tool calls Claude (incurs LLM cost — needs cost protection) */
  isAI: boolean;
  /** Approximate monthly US search volume for the primary keyword (planning only) */
  searchVolume?: number;
  /** Sitemap priority 0.0-1.0 */
  priority: number;
  /** `live` shows on home + sitemap; `coming-soon` shows on home but not sitemap */
  status: "live" | "coming-soon";
};

export const TOOLS: Tool[] = [
  // ──────────────────────────────────────────────────────────
  // Browser-side tools (no AI cost)
  // ──────────────────────────────────────────────────────────
  {
    slug: "youtube-thumbnail-downloader",
    title: "YouTube Thumbnail Downloader",
    shortTitle: "Thumbnail Downloader",
    description:
      "Download any YouTube video's thumbnail in every available resolution — instantly, no watermarks.",
    metaDescription:
      "Free YouTube thumbnail downloader. Get HD, max resolution, and standard thumbnails from any YouTube URL. No signup, no watermark.",
    category: "downloader",
    Icon: ImageDown,
    isAI: false,
    searchVolume: 100000,
    priority: 0.9,
    status: "coming-soon",
  },
  {
    slug: "youtube-money-calculator",
    title: "YouTube Money Calculator",
    shortTitle: "Money Calculator",
    description:
      "Estimate YouTube earnings by views, niche, and engagement. Includes niche-specific CPM presets.",
    metaDescription:
      "Free YouTube earnings calculator. Estimate revenue by views with niche-specific CPM rates (gaming, finance, tech, lifestyle).",
    category: "calculator",
    Icon: Calculator,
    isAI: false,
    searchVolume: 80000,
    priority: 0.85,
    status: "coming-soon",
  },
  {
    slug: "youtube-embed-code-generator",
    title: "YouTube Embed Code Generator",
    shortTitle: "Embed Generator",
    description:
      "Generate custom YouTube embed code with autoplay, start/end times, controls, mute, and loop options.",
    metaDescription:
      "Generate custom YouTube embed code. Set autoplay, start/end times, controls, captions, and loop with one click.",
    category: "generator",
    Icon: Code2,
    isAI: false,
    searchVolume: 10000,
    priority: 0.7,
    status: "coming-soon",
  },
  {
    slug: "youtube-channel-id-finder",
    title: "YouTube Channel ID Finder",
    shortTitle: "Channel ID Finder",
    description:
      "Extract the YouTube channel ID from any channel URL, custom URL, handle, or video link.",
    metaDescription:
      "Find YouTube channel ID from any URL format — custom URLs, handles (@username), video links, or legacy channel URLs.",
    category: "utility",
    Icon: Fingerprint,
    isAI: false,
    searchVolume: 30000,
    priority: 0.75,
    status: "coming-soon",
  },
  {
    slug: "youtube-chapter-generator",
    title: "YouTube Chapter & Timestamp Generator",
    shortTitle: "Chapter Generator",
    description:
      "Format chapters and timestamps for YouTube descriptions. Validates ordering and the required 0:00 start.",
    metaDescription:
      "Format YouTube chapters and timestamps for descriptions. Validates ordering, the required 0:00 start, and minimum chapter length.",
    category: "generator",
    Icon: ListVideo,
    isAI: false,
    searchVolume: 5000,
    priority: 0.7,
    status: "coming-soon",
  },

  // ──────────────────────────────────────────────────────────
  // AI-powered tools (Claude Haiku, gated by cost protection)
  // ──────────────────────────────────────────────────────────
  {
    slug: "youtube-title-generator",
    title: "AI YouTube Title Generator",
    shortTitle: "Title Generator",
    description:
      "Generate 10 click-worthy YouTube titles for any topic. Multiple styles: curious, list, how-to, comparison.",
    metaDescription:
      "Free AI YouTube title generator. Get 10 SEO-optimized titles in seconds — list, how-to, comparison, and curiosity styles.",
    category: "ai",
    Icon: WandSparkles,
    isAI: true,
    searchVolume: 10000,
    priority: 0.85,
    status: "coming-soon",
  },
  {
    slug: "youtube-description-generator",
    title: "AI YouTube Description Generator",
    shortTitle: "Description Generator",
    description:
      "Generate a complete YouTube description with intro, body, call-to-action, hashtags, and chapter placeholders.",
    metaDescription:
      "Free AI YouTube description generator. Includes intro, body, CTA, hashtags, and chapter formatting in one click.",
    category: "ai",
    Icon: PenLine,
    isAI: true,
    searchVolume: 15000,
    priority: 0.85,
    status: "coming-soon",
  },
  {
    slug: "youtube-tag-generator",
    title: "AI YouTube Tag Generator",
    shortTitle: "Tag Generator",
    description:
      "Generate 20-30 relevant tags for your YouTube video. Mix of broad terms and long-tail keywords.",
    metaDescription:
      "Free AI YouTube tag generator. Get 20+ relevant tags for any video — mix of broad and long-tail keywords.",
    category: "ai",
    Icon: Tags,
    isAI: true,
    searchVolume: 30000,
    priority: 0.9,
    status: "coming-soon",
  },
  {
    slug: "youtube-hashtag-generator",
    title: "AI YouTube Hashtag Generator",
    shortTitle: "Hashtag Generator",
    description:
      "Get 15 relevant YouTube hashtags ranked by competition — niche-specific and broad-reach mix.",
    metaDescription:
      "Free AI YouTube hashtag generator. 15 relevant hashtags ranked by competition for any niche or topic.",
    category: "ai",
    Icon: Hash,
    isAI: true,
    searchVolume: 25000,
    priority: 0.85,
    status: "coming-soon",
  },
  {
    slug: "youtube-video-idea-generator",
    title: "AI YouTube Video Idea Generator",
    shortTitle: "Video Ideas",
    description:
      "Get 10 fresh video ideas for your niche, each with a brief premise and angle.",
    metaDescription:
      "Free AI YouTube video idea generator. 10 fresh video ideas with premises for any niche or channel topic.",
    category: "ai",
    Icon: Lightbulb,
    isAI: true,
    searchVolume: 20000,
    priority: 0.85,
    status: "coming-soon",
  },
  {
    slug: "youtube-channel-name-generator",
    title: "AI YouTube Channel Name Generator",
    shortTitle: "Channel Name Generator",
    description:
      "Get 10 creative YouTube channel name ideas based on your niche and style preferences.",
    metaDescription:
      "Free AI YouTube channel name generator. 10 creative, brandable channel name ideas for any niche.",
    category: "ai",
    Icon: Tv,
    isAI: true,
    searchVolume: 15000,
    priority: 0.8,
    status: "coming-soon",
  },
];

/** Tools that should appear in the sitemap. */
export const liveTools = (): Tool[] =>
  TOOLS.filter((t) => t.status === "live");

/** All tools, ordered for homepage display (highest priority first). */
export const allToolsSorted = (): Tool[] =>
  [...TOOLS].sort((a, b) => b.priority - a.priority);

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
