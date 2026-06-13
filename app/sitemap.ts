import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { liveTools, STAGE_ORDER } from "@/lib/tools-catalog";
import { GUIDES } from "@/lib/guides-catalog";
import { getAllUpdates } from "@/lib/updates";

/**
 * Updates feed indexing strategy (per seocheck-tools-updates-feed memory):
 *  - /updates index → always in sitemap, high priority.
 *  - Individual update posts → ROLLING WINDOW of the 10 most recent posts only.
 *  - Older posts stay indexable (no noindex) but drop out of sitemap to focus
 *    Google's crawl budget on fresh content.
 *  - Last-48-hour posts also appear in /sitemap-news.xml (Google News namespace),
 *    handled separately at app/sitemap-news.xml/route.ts.
 */
const UPDATES_SITEMAP_WINDOW = 10;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteConfig.url}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const stageHubPages: MetadataRoute.Sitemap = STAGE_ORDER.map((stage) => ({
    url: `${siteConfig.url}/tools/${stage}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const toolPages: MetadataRoute.Sitemap = liveTools().map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: tool.priority,
  }));

  const guidePages: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${siteConfig.url}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Updates feed: index page + rolling window of N most recent posts.
  const allUpdates = getAllUpdates();
  const recentUpdates = allUpdates.slice(0, UPDATES_SITEMAP_WINDOW);

  const updatesPages: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/updates`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...recentUpdates.map((post, i) => ({
      url: `${siteConfig.url}/updates/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      // Newest gets the strongest boost, then small decay across the window
      // so Google sees the recency order in the sitemap signal too.
      priority: i === 0 ? 0.85 : 0.8,
    })),
  ];

  return [
    ...staticPages,
    ...stageHubPages,
    ...toolPages,
    ...guidePages,
    ...updatesPages,
  ];
}
