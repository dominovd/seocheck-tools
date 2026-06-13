import { XMLParser } from "fast-xml-parser";
import type { DiscoveredItem } from "./types";

/**
 * Generic RSS / Atom feed fetcher. Used by source modules whose
 * upstream offers a standard feed format (Google Search Central,
 * YouTube channel feeds, anything Wordpress-flavored).
 *
 * Tolerant to both RSS 2.0 (<item><title/><link/><pubDate/></item>)
 * and Atom (<entry><title/><link href=""/><published/></entry>).
 */

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  // Some atom feeds put <link href="..."/> at top level under <entry>.
  // fast-xml-parser handles those when we pass ignoreAttributes: false.
});

type RssMeta = {
  url: string;
  sourceName: string;
  sourceTier: 1 | 2 | 3;
  /** Optional cap on items returned. Default 20. */
  limit?: number;
};

export async function fetchRssFeed(meta: RssMeta): Promise<DiscoveredItem[]> {
  const res = await fetch(meta.url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; seocheck-tools-discovery/0.1; +https://seocheck.tools)",
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
    },
  });
  if (!res.ok) {
    throw new Error(
      `Feed fetch failed for ${meta.sourceName} (${res.status} ${res.statusText})`,
    );
  }
  const xml = await res.text();
  const parsed = parser.parse(xml);

  const items = extractItems(parsed);
  const limit = meta.limit ?? 20;

  return items.slice(0, limit).map((it) => ({
    url: it.url,
    title: it.title,
    sourceName: meta.sourceName,
    sourceTier: meta.sourceTier,
    publishedAt: it.publishedAt,
  }));
}

type RawItem = {
  url: string;
  title: string;
  publishedAt?: string;
};

function extractItems(root: unknown): RawItem[] {
  if (!root || typeof root !== "object") return [];
  const r = root as Record<string, unknown>;

  // RSS 2.0: <rss><channel><item>
  const rss = r.rss as Record<string, unknown> | undefined;
  const channel = rss?.channel as Record<string, unknown> | undefined;
  if (channel?.item) {
    const items = arr(channel.item);
    return items.map((raw) => {
      const i = raw as Record<string, unknown>;
      const link =
        typeof i.link === "string"
          ? i.link
          : asString((i.link as Record<string, unknown>)?.["@_href"]);
      return {
        url: normalizeUrl(link),
        title: asString(i.title).trim(),
        publishedAt: isoDate(asString(i.pubDate)),
      };
    });
  }

  // Atom: <feed><entry>
  const feed = r.feed as Record<string, unknown> | undefined;
  if (feed?.entry) {
    const entries = arr(feed.entry);
    return entries.map((raw) => {
      const e = raw as Record<string, unknown>;
      // Atom <link href="..."/> may be a single object or an array of {rel, href}
      let link = "";
      if (Array.isArray(e.link)) {
        const alt =
          (e.link as Array<Record<string, unknown>>).find(
            (l) => l["@_rel"] === "alternate" || !l["@_rel"],
          ) ?? e.link[0];
        link = asString((alt as Record<string, unknown>)?.["@_href"]);
      } else if (typeof e.link === "object" && e.link !== null) {
        link = asString((e.link as Record<string, unknown>)["@_href"]);
      } else {
        link = asString(e.link);
      }
      return {
        url: normalizeUrl(link),
        title: asString(e.title).trim(),
        publishedAt: isoDate(asString(e.published ?? e.updated)),
      };
    });
  }

  return [];
}

function arr<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [v];
}

function asString(v: unknown): string {
  if (typeof v === "string") return v;
  if (v == null) return "";
  return String(v);
}

function normalizeUrl(u: string): string {
  return u.trim().replace(/\/$/, "");
}

function isoDate(s: string): string | undefined {
  if (!s) return undefined;
  const d = new Date(s);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}
