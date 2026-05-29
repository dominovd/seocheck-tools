/**
 * Site-wide configuration. Used across metadata, sitemap, header, footer,
 * structured data, etc. Edit values here, not scattered through the codebase.
 *
 * Brand vs domain split:
 *  - `name` is the human-facing brand ("SEO Check Tools") used in copy, titles,
 *    OG site name, header/footer wordmark.
 *  - `domain` is the URL hostname only — used to build canonical URLs.
 *    Avoid using it in body copy.
 */

export const siteConfig = {
  name: "SEO Check Tools",
  domain: "seocheck.tools",
  tagline: "Free YouTube analytics, audits, and AI fixes",
  description:
    "Free YouTube SEO platform with composite Visibility Score, whole-channel Audit, single-click AI fix for weak metadata, Outlier Finder for breakthrough videos, Competitor Channel Analyzer, and weekly historical tracking. 20 tools across the creator workflow (Research, Optimize, Publish, Analyze) — no signup, no credit card, free forever.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://seocheck.tools",
  ogImage: "/og-default.png",
  locale: "en_US",
  twitterCreator: "@seochecktools",
  contactEmail: "hello@seocheck.tools",
  copyright: `© ${new Date().getFullYear()} SEO Check Tools — free forever`,
  googleSiteVerification: "Z9Wa4TR3TWf_MOGXOAHrz083v49JOACyIdjRYqZpC7M",
  bingSiteVerification: "1CE576589CB313123B0B3A5762459DA4",
} as const;

export type SiteConfig = typeof siteConfig;
