import type { SourcePoller, DiscoveredItem } from "./types";
import { fetchRssFeed } from "./rss-parser";

/**
 * YouTube Creators Blog (blog.youtube/news-and-events).
 *
 * The blog publishes a standard RSS feed. URL is best-effort: if YouTube
 * changes feed location, fall back to HTML scraping of the news-and-events
 * landing page.
 *
 * Items here usually map to MAJOR or MINOR severity (policy announcements,
 * Shorts updates, monetization changes). Classification happens at draft
 * time, not at discovery.
 */

const PRIMARY_FEED_URL = "https://blog.youtube/rss/";
const FALLBACK_FEED_URL = "https://blog.youtube/feed/";

export const youtubeBlogSource: SourcePoller = {
  id: "youtube-blog",
  name: "YouTube Creators Blog",
  async fetchRecent(): Promise<DiscoveredItem[]> {
    try {
      return await fetchRssFeed({
        url: PRIMARY_FEED_URL,
        sourceName: "YouTube Creators Blog",
        sourceTier: 1,
      });
    } catch (primaryErr) {
      try {
        return await fetchRssFeed({
          url: FALLBACK_FEED_URL,
          sourceName: "YouTube Creators Blog",
          sourceTier: 1,
        });
      } catch (fallbackErr) {
        throw new Error(
          `YouTube Creators Blog feed unreachable. Primary: ${asMsg(primaryErr)}. Fallback: ${asMsg(fallbackErr)}`,
        );
      }
    }
  },
};

function asMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
