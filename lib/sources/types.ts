/**
 * Shared types for the auto-discovery layer of the /updates feed.
 *
 * A "source" is a Tier 1 outlet (YouTube Creators Blog, Help Center
 * announcements, Data API release notes, etc.) we poll on a cron to
 * find new platform-change articles. Each source module returns a list
 * of DiscoveredItems; the orchestrator (lib/sources/discover.ts)
 * dedupes against seen-urls.json and queues fresh items into the
 * drafter pipeline.
 *
 * Sources are intentionally pure-fetch only: they do not call the LLM,
 * they do not write files. That keeps each module testable in isolation.
 */

export type DiscoveredItem = {
  /** Canonical source URL of the article. Used as dedupe key. */
  url: string;
  /** Article title from feed/HTML, for queue summaries and emails. */
  title: string;
  /** Human-readable source label, e.g. "YouTube Creators Blog". */
  sourceName: string;
  /** Tier 1, 2, or 3 per seocheck-tools-updates-feed memory. */
  sourceTier: 1 | 2 | 3;
  /** ISO date the source published the article, when available. */
  publishedAt?: string;
};

export type SourcePoller = {
  /** Stable id used in the source registry, e.g. "youtube-blog". */
  id: string;
  /** Display name shown in logs and cron summaries. */
  name: string;
  /**
   * Fetches the latest items from this source. Returns them in
   * source-defined order (usually newest first). Dedupe is the
   * orchestrator's job.
   */
  fetchRecent(): Promise<DiscoveredItem[]>;
};
