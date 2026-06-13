import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { JsonLd } from "./JsonLd";
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
} from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import type { Guide } from "@/lib/guides-catalog";

type GuideLayoutProps = {
  guide: Guide;
  children: ReactNode;
  /** Featured image URL for Article + HowTo schema. Defaults to dynamic OG. */
  image?: string;
  /** If provided, also emits HowTo JSON-LD alongside Article. */
  howToSteps?: { name: string; text: string }[];
  /** ISO-8601 duration like "PT15M" for HowTo totalTime. */
  howToTotalTimeISO?: string;
  /** If provided, also emits FAQPage JSON-LD. */
  faqs?: { q: string; a: string }[];
};

/**
 * Common chrome + JSON-LD for every cornerstone guide.
 * Emits Article schema + breadcrumb, plus optional HowTo / FAQPage schemas
 * and an explicit featured image for Discover / Top Stories eligibility.
 */
export function GuideLayout({
  guide,
  children,
  image,
  howToSteps,
  howToTotalTimeISO,
  faqs,
}: GuideLayoutProps) {
  const url = `${siteConfig.url}/guides/${guide.slug}`;
  const featuredImage =
    image ??
    `${siteConfig.url}/api/og?${new URLSearchParams({
      title: guide.title.slice(0, 80),
      subtitle: guide.description.slice(0, 120),
    }).toString()}`;

  const schemas: object[] = [
    articleSchema({
      headline: guide.title,
      description: guide.description,
      url,
      datePublished: guide.publishedAt,
      image: featuredImage,
    }),
    breadcrumbSchema([
      { name: "Home", url: siteConfig.url },
      { name: "Guides", url: `${siteConfig.url}/guides` },
      { name: guide.shortTitle, url },
    ]),
  ];

  if (howToSteps && howToSteps.length > 0) {
    schemas.push(
      howToSchema({
        name: guide.title,
        description: guide.description,
        url,
        image: featuredImage,
        totalTimeISO: howToTotalTimeISO,
        steps: howToSteps,
      }),
    );
  }

  if (faqs && faqs.length > 0) {
    schemas.push(faqPageSchema(faqs));
  }

  return (
    <Container as="main" className="py-12 sm:py-16">
      <JsonLd data={schemas} />

      <nav className="mx-auto max-w-3xl text-xs text-gray-500">
        <Link href="/guides" className="hover:text-gray-900 transition-colors">
          ← All guides
        </Link>
      </nav>

      <header className="mx-auto mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
          Guide
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          {guide.title}
        </h1>
        <p className="mt-5 text-base text-gray-600 sm:text-lg leading-relaxed">
          {guide.description}
        </p>
        <p className="mt-5 text-xs text-gray-500">
          Published {guide.publishedAt} · {guide.readingTimeMinutes} min read
        </p>
      </header>

      <article
        className="mx-auto mt-12 max-w-3xl prose prose-gray
          prose-headings:font-semibold prose-headings:tracking-tight
          prose-h2:mt-12 prose-h2:text-2xl prose-h2:text-gray-900
          prose-h3:mt-8 prose-h3:text-lg prose-h3:text-gray-900
          prose-p:text-base prose-p:leading-relaxed prose-p:text-gray-700
          prose-li:text-base prose-li:text-gray-700
          prose-a:text-brand-700 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900"
      >
        {children}
      </article>
    </Container>
  );
}
