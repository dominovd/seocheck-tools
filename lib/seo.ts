import type { Metadata } from "next";
import { siteConfig } from "./site-config";

/**
 * Title-tag brand. Was previously "YouTube SEO Check Tools" on sub-pages for
 * keyword density, but produced ugly duplication when the tool's own title
 * also contained "YouTube" and "SEO" — e.g. "AI YouTube Tag Generator |
 * YouTube SEO SEO Check Tools". Each tool name already includes "YouTube"
 * and the brand contains "SEO", so the keyword pair still appears across
 * the title without the redundant prefix.
 */
const TITLE_BRAND_HOME = siteConfig.name; // "SEO Check Tools"
const TITLE_BRAND_SUB = siteConfig.name; // "SEO Check Tools"

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path without leading slash. Empty string for home. */
  path?: string;
  /** Override the OG image URL. Defaults to siteConfig.ogImage. */
  ogImage?: string;
  /** Set to true on pages that should not be indexed. */
  noindex?: boolean;
};

/**
 * Build a full Next.js Metadata object with consistent OG/Twitter/canonical.
 * Use this from every page's `generateMetadata` or `metadata` export.
 */
export function buildMetadata({
  title,
  description,
  path = "",
  ogImage = siteConfig.ogImage,
  noindex = false,
}: BuildMetadataInput): Metadata {
  const url = `${siteConfig.url}/${path}`.replace(/\/$/, "") || siteConfig.url;
  const fullTitle =
    path === ""
      ? `${title} — ${TITLE_BRAND_HOME}`
      : `${title} | ${TITLE_BRAND_SUB}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: siteConfig.twitterCreator,
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: siteConfig.googleSiteVerification,
      other: {
        "msvalidate.01": siteConfig.bingSiteVerification,
      },
    },
  };
}

/**
 * JSON-LD SoftwareApplication schema for a tool page.
 * Drop this into a <script type="application/ld+json"> tag in the tool's layout.
 */
export function softwareApplicationSchema(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
