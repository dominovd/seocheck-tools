import type { SourcePoller, DiscoveredItem } from "./types";

/**
 * YouTube Data API v3 release notes (developers.google.com/youtube/v3/revision_history).
 *
 * No RSS, just a static HTML changelog. We parse the page for
 * date-prefixed entries (the page convention is "Month Day, Year" or
 * ISO at the top of each entry).
 *
 * Each entry becomes a DiscoveredItem with a fragment URL pointing at
 * the entry anchor when possible. Since the page does not anchor
 * individual entries reliably, we use the page URL itself for all
 * items; dedupe instead uses a hash of the entry title/date so the same
 * entry is not re-drafted across cron cycles.
 */

const PAGE_URL = "https://developers.google.com/youtube/v3/revision_history";

export const apiReleaseNotesSource: SourcePoller = {
  id: "api-release-notes",
  name: "YouTube API Release Notes",
  async fetchRecent(): Promise<DiscoveredItem[]> {
    const res = await fetch(PAGE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; seocheck-tools-discovery/0.1; +https://seocheck.tools)",
      },
    });
    if (!res.ok) {
      throw new Error(
        `API release notes fetch failed (${res.status} ${res.statusText})`,
      );
    }
    const html = await res.text();

    // The page structure uses <h2> headers for each release, with the
    // date as the heading text. Capture each heading and its first
    // paragraph to use as title and description.
    const entries: Array<{ date: string; title: string }> = [];
    const headingRegex = /<h2[^>]*>([^<]+)<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
    let m: RegExpExecArray | null;
    while ((m = headingRegex.exec(html)) !== null) {
      const rawDate = m[1].trim();
      const isoDate = parseHumanDate(rawDate);
      if (!isoDate) continue;
      const firstP = stripTags(m[2]).trim();
      if (!firstP) continue;
      // Build a synthetic dedupe URL with date + content hash. The
      // visible URL we publish is the page itself.
      const dedupeKey = `${PAGE_URL}#${isoDate}-${shortHash(firstP)}`;
      entries.push({
        date: isoDate,
        title: truncate(firstP, 120),
      });
      // Tie the synthetic dedupeKey by writing it into URL field; the
      // orchestrator uses the URL as dedupe identity.
      (entries[entries.length - 1] as DiscoveredItem & { date: string }).url =
        dedupeKey;
      (entries[entries.length - 1] as DiscoveredItem & { date: string }).sourceName =
        "YouTube API Release Notes";
      (entries[entries.length - 1] as DiscoveredItem & { date: string }).sourceTier = 1;
    }

    return entries.slice(0, 10).map((e) => {
      const item = e as unknown as DiscoveredItem & { date: string };
      return {
        url: item.url,
        title: item.title,
        sourceName: "YouTube API Release Notes",
        sourceTier: 1,
        publishedAt: item.date,
      };
    });
  },
};

function parseHumanDate(s: string): string | undefined {
  // Accept formats: "June 3, 2026", "2026-06-03", "Jun 3, 2026"
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return undefined;
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 3).trimEnd() + "..." : s;
}

function shortHash(s: string): string {
  // Tiny non-cryptographic hash so dedupe keys are stable.
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36).slice(0, 6);
}
