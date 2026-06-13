/**
 * Master catalog of cornerstone guides.
 *
 * Drives the /guides index, sitemap, breadcrumb, and Article schema for
 * each guide page. Add new guides here AND create the corresponding route
 * at app/guides/<slug>/page.tsx.
 */

export type Guide = {
  slug: string;
  title: string;
  description: string;
  /** Short label for grid cards and nav. */
  shortTitle: string;
  /** YYYY-MM-DD; used in Article schema and "Updated" line on the page. */
  publishedAt: string;
  /** Estimated reading time in minutes. */
  readingTimeMinutes: number;
  /** Word count, rough — for the article schema and reading-time display. */
  wordCount: number;
};

export const GUIDES: Guide[] = [
  {
    slug: "youtube-seo-2026-complete-guide",
    title: "YouTube SEO in 2026: The Complete Guide",
    shortTitle: "YouTube SEO 2026 Guide",
    description:
      "Learn YouTube SEO in 2026: how to choose topics, write better titles and descriptions, optimize thumbnails, use tags and chapters, and audit videos after publishing.",
    publishedAt: "2026-05-29",
    readingTimeMinutes: 12,
    wordCount: 2400,
  },
  {
    slug: "how-to-write-youtube-titles",
    title: "How to Write YouTube Titles That Actually Get Clicks",
    shortTitle: "Writing Titles",
    description:
      "The five angles top creators rotate through, the 40-70 character sweet spot, and the mistakes that kill CTR before the video even has a chance.",
    publishedAt: "2026-05-29",
    readingTimeMinutes: 9,
    wordCount: 1800,
  },
  {
    slug: "youtube-tags-best-practices-2026",
    title: "YouTube Tags in 2026: What Still Works (And What Doesn't)",
    shortTitle: "Tags Best Practices",
    description:
      "Tags don't matter the way they used to — but they still matter for the right reasons. Here's a working framework with the 500-character rule, broad/long-tail mix, and the misspelling angle.",
    publishedAt: "2026-05-29",
    readingTimeMinutes: 8,
    wordCount: 1700,
  },
];

export const getGuideBySlug = (slug: string): Guide | undefined =>
  GUIDES.find((g) => g.slug === slug);
