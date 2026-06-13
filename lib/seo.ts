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
  /**
   * Override the OG image URL. Defaults to a per-page dynamic image generated
   * by /api/og from the title + description.
   */
  ogImage?: string;
  /** Pass `{ ai: true }` to render the "AI-powered" accent on the dynamic OG. */
  ogVariant?: { ai?: boolean };
  /** Set to true on pages that should not be indexed. */
  noindex?: boolean;
  /**
   * Skip the automatic " | SEO Check Tools" brand suffix. Use sparingly,
   * only when the title is already self-branded (e.g. "Free YouTube SEO
   * tools" on the /tools index where the keyword density matters more
   * than the brand suffix).
   */
  noBrand?: boolean;
};

/**
 * Build a full Next.js Metadata object with consistent OG/Twitter/canonical.
 * Use this from every page's `generateMetadata` or `metadata` export.
 */
export function buildMetadata({
  title,
  description,
  path = "",
  ogImage,
  ogVariant,
  noindex = false,
  noBrand = false,
}: BuildMetadataInput): Metadata {
  const url = `${siteConfig.url}/${path}`.replace(/\/$/, "") || siteConfig.url;
  const fullTitle = noBrand
    ? title
    : path === ""
    ? `${title} — ${TITLE_BRAND_HOME}`
    : `${title} | ${TITLE_BRAND_SUB}`;

  // Build a default dynamic OG image URL if no override was passed.
  // Truncate the description so the query string stays reasonable.
  const ogParams = new URLSearchParams({
    title: title.slice(0, 80),
    subtitle: description.slice(0, 120),
  });
  if (ogVariant?.ai) ogParams.set("ai", "1");
  const resolvedOgImage = ogImage ?? `/api/og?${ogParams.toString()}`;

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
      images: [{ url: resolvedOgImage, width: 1200, height: 630, alt: title }],
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [resolvedOgImage],
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

/* ────────────────────────────────────────────────────────────────────
 * Structured data (JSON-LD) helpers
 *
 * Each function returns a plain JS object that should be serialized into a
 * <script type="application/ld+json"> tag via the <JsonLd /> component.
 * ──────────────────────────────────────────────────────────────────── */

/** JSON-LD schema for a tool page. */
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
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

/** WebSite schema for the homepage — enables sitelinks search box when applicable. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.tagline,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

/** Organization schema — used site-wide for knowledge-graph readiness. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    email: siteConfig.contactEmail,
  };
}

/** FAQ Page schema — emits the rich result block in Google SERP. */
export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
}

/** Breadcrumb list schema for tool/guide/legal pages. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Article schema — for guides. */
export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  /** Featured / hero image URL — required for Google Discover and Top Stories. */
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    ...(opts.image ? { image: [opts.image] } : {}),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icon.svg`,
      },
    },
  };
}

/** HowTo schema — for step-by-step guides. Eligible for SERP rich result. */
export function howToSchema(opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
  totalTimeISO?: string;
  steps: { name: string; text: string; url?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    ...(opts.image ? { image: [opts.image] } : {}),
    ...(opts.totalTimeISO ? { totalTime: opts.totalTimeISO } : {}),
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : { url: `${opts.url}#step-${i + 1}` }),
    })),
  };
}
