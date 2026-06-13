import type { SourcePoller, DiscoveredItem } from "./types";
import { fetchRssFeed } from "./rss-parser";

/**
 * Google Search Central blog (developers.google.com/search/blog).
 *
 * Tier 1 because Google publishes search-relevant changes here that
 * sometimes affect YouTube video discovery in Google SERP. Limited
 * scope: only items genuinely about video search behavior reach the
 * draft pipeline (classifier will return factualConfidence: low for
 * irrelevant items, which the cron will skip).
 */

const FEED_URL = "https://developers.google.com/search/blog/rss/feed.xml";

export const searchCentralSource: SourcePoller = {
  id: "search-central",
  name: "Google Search Central",
  async fetchRecent(): Promise<DiscoveredItem[]> {
    return fetchRssFeed({
      url: FEED_URL,
      sourceName: "Google Search Central",
      sourceTier: 1,
    });
  },
};
