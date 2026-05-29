import { JsonLd } from "./JsonLd";
import {
  websiteSchema,
  organizationSchema,
  faqPageSchema,
  breadcrumbSchema,
} from "@/lib/seo";

/**
 * Renders WebSite + Organization JSON-LD. Drop at the top of any layout
 * that should expose those entities to crawlers (typically: root layout).
 */
export function SiteSchemas() {
  return <JsonLd data={[websiteSchema(), organizationSchema()]} />;
}

/**
 * Renders FAQPage JSON-LD from an array of question/answer pairs.
 * Use on any page that already renders a FAQ section so Google can show
 * rich result snippets in SERP.
 */
export function FaqSchema({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (faqs.length === 0) return null;
  return <JsonLd data={faqPageSchema(faqs)} />;
}

/**
 * BreadcrumbList JSON-LD. Pass a flat array of { name, url } from root to
 * current page; the helper assigns positions automatically.
 */
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return <JsonLd data={breadcrumbSchema(items)} />;
}
