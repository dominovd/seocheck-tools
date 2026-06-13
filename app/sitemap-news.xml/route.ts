import { getAllUpdates } from "@/lib/updates";
import { siteConfig } from "@/lib/site-config";

/**
 * Google News sitemap.
 *
 * Separate from the main /sitemap.xml because Google News uses a custom
 * XML namespace that Next.js MetadataRoute.Sitemap does not support.
 *
 * Includes ONLY update posts from the last 48 hours. Standard pattern for
 * news publishers, opens path to Top Stories surface. Per the indexing
 * strategy in seocheck-tools-updates-feed memory: older posts stay in the
 * main sitemap (rolling 10 window) and remain indexable; this file is
 * just the fresh-news firehose.
 *
 * If no posts fall in the 48h window, returns a valid but empty urlset.
 * Google handles that gracefully.
 */

export const dynamic = "force-static";

const NEWS_WINDOW_HOURS = 48;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function GET() {
  const all = getAllUpdates();
  const cutoffMs = Date.now() - NEWS_WINDOW_HOURS * 60 * 60 * 1000;

  const recent = all.filter((p) => {
    const postMs = new Date(`${p.date}T00:00:00Z`).getTime();
    return postMs >= cutoffMs;
  });

  const urls = recent
    .map((p) => {
      const loc = `${siteConfig.url}/updates/${p.slug}`;
      const pubDate = `${p.date}T00:00:00+00:00`;
      const title = escapeXml(p.title);
      const siteName = escapeXml(siteConfig.name);

      return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>${siteName}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
