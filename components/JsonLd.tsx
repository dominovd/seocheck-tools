/**
 * Drop a JSON-LD structured data block into a page.
 *
 * Pass a plain object built by one of the helpers in lib/seo.ts
 * (faqPageSchema, breadcrumbSchema, websiteSchema, organizationSchema,
 *  articleSchema, softwareApplicationSchema). The script element is
 * server-rendered and never hydrated — zero client JS cost.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
