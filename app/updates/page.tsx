import { Container } from "@/components/Container";
import { BreadcrumbSchema } from "@/components/PageSchemas";
import { UpdatesFeedClient } from "@/components/UpdatesFeedClient";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { getAllUpdates } from "@/lib/updates";

const PAGE_TITLE = "YouTube Updates";
const META_DESCRIPTION =
  "YouTube algorithm, monetization, Shorts, API, and policy changes that affect creators. Curated from YouTube's own channels with a short summary and what it means for your channel.";

const base = buildMetadata({
  title: "YouTube Updates: Algorithm, Monetization, Shorts, API & Policy",
  description: META_DESCRIPTION,
  path: "updates",
  noBrand: true,
});

const ogImagePath = `/api/og?title=${encodeURIComponent("YouTube updates")}&subtitle=${encodeURIComponent("News that affects creators")}`;

export const metadata = {
  ...base,
  openGraph: {
    ...base.openGraph,
    title: PAGE_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    images: [{ url: ogImagePath }],
  },
  twitter: {
    ...base.twitter,
    title: PAGE_TITLE,
    description: META_DESCRIPTION,
    images: [{ url: ogImagePath }],
  },
};

export default function UpdatesFeedPage() {
  const posts = getAllUpdates();

  // ItemList JSON-LD: gives Google the list of articles and their order.
  // Each item is a thin reference; the full NewsArticle schema lives on
  // the per-item page at /updates/[slug].
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "YouTube updates",
    description: META_DESCRIPTION,
    url: `${siteConfig.url}/updates`,
    numberOfItems: posts.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}/updates/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Updates", url: `${siteConfig.url}/updates` },
        ]}
      />

      <Container as="main" className="py-10 sm:py-14">
        <div className="mx-auto max-w-2xl">
          {/* Hero */}
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            YouTube updates
          </h1>
          <p className="mt-3 text-base text-gray-600 leading-relaxed">
            Algorithm, monetization, Shorts, API, and policy changes that
            affect creators. Curated from YouTube&apos;s own channels with
            a short summary and what it means for your channel.
          </p>

          {/* Filter + cards (client) */}
          <UpdatesFeedClient posts={posts} />
        </div>
      </Container>
    </>
  );
}
