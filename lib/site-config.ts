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
  tagline: "Free YouTube SEO Toolkit",
  description:
    "Free YouTube SEO tools for content creators. Generate titles, descriptions, tags, hashtags, and ideas with AI. Download thumbnails, calculate earnings, and more — no signup required.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://seocheck.tools",
  ogImage: "/og-default.png",
  locale: "en_US",
  twitterCreator: "@seochecktools",
  contactEmail: "hello@seocheck.tools",
  copyright: `© ${new Date().getFullYear()} SEO Check Tools — free forever`,
  googleSiteVerification: "Z9Wa4TR3TWf_MOGXOAHrz083v49JOACyIdjRYqZpC7M",
} as const;

export type SiteConfig = typeof siteConfig;
