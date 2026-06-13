import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { BreadcrumbSchema } from "@/components/PageSchemas";
import { ExternalLink } from "@/components/ExternalLink";
import { MarkdownBody } from "@/components/MarkdownBody";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import {
  getAllUpdateSlugs,
  getUpdateBySlug,
  type UpdatePost,
} from "@/lib/updates";
import { getToolBySlug } from "@/lib/tools-catalog";

// Only pre-rendered slugs are valid; unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllUpdateSlugs().map((slug) => ({ slug }));
}

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props) {
  const post = getUpdateBySlug(params.slug);
  if (!post) {
    return buildMetadata({
      title: "Update not found",
      description: "",
      path: `updates/${params.slug}`,
    });
  }

  const pageTitle = `${post.title} | YouTube Updates`;
  const ogTitle = post.title;
  const ogImagePath = `/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(CATEGORY_LABEL[post.category])}`;

  const base = buildMetadata({
    title: pageTitle,
    description: post.summary,
    path: `updates/${post.slug}`,
    noBrand: true,
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      title: ogTitle,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      images: [{ url: ogImagePath }],
    },
    twitter: {
      ...base.twitter,
      title: ogTitle,
      description: post.summary,
      images: [{ url: ogImagePath }],
    },
  };
}

const CATEGORY_LABEL: Record<UpdatePost["category"], string> = {
  algorithm: "Algorithm",
  monetization: "Monetization",
  shorts: "Shorts",
  api: "API",
  policy: "Policy",
};

const SEVERITY_STYLE: Record<UpdatePost["severity"], { label: string; cls: string }> = {
  major: { label: "MAJOR", cls: "bg-red-50 text-red-800 ring-red-200" },
  minor: { label: "MINOR", cls: "bg-amber-50 text-amber-800 ring-amber-200" },
  info: { label: "INFO", cls: "bg-gray-100 text-gray-700 ring-gray-200" },
};

function formatDate(iso: string): string {
  // YYYY-MM-DD → e.g. "Jun 11, 2026"
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function UpdatePostPage({ params }: Props) {
  const post = getUpdateBySlug(params.slug);
  if (!post) notFound();

  const sev = SEVERITY_STYLE[post.severity];
  const categoryLabel = CATEGORY_LABEL[post.category];
  const formattedDate = formatDate(post.date);

  const related = (post.relatedTools ?? [])
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<ReturnType<typeof getToolBySlug>> => !!t);

  const pageUrl = `${siteConfig.url}/updates/${post.slug}`;

  // NewsArticle JSON-LD. isBasedOn = source URL (machine-readable citation,
  // independent of the visible anchor's rel="nofollow noopener").
  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en-US",
    articleSection: categoryLabel,
    isBasedOn: post.source.url,
    url: pageUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
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
        url: `${siteConfig.url}${siteConfig.ogImage}`,
      },
    },
    image: [
      `${siteConfig.url}/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(categoryLabel)}`,
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD is structured data, not user content
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Updates", url: `${siteConfig.url}/updates` },
          { name: post.title, url: pageUrl },
        ]}
      />

      <Container as="main" className="py-10 sm:py-14">
        <article className="mx-auto max-w-2xl">
          {/* Breadcrumb */}
          <p className="text-xs text-gray-500">
            <Link href="/updates" className="hover:text-brand-700">
              Updates
            </Link>{" "}
            ›{" "}
            <span className="text-gray-700">
              {categoryLabel}
            </span>
          </p>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <time
              dateTime={post.date}
              className="text-xs text-gray-500"
            >
              {formattedDate}
            </time>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${sev.cls}`}
            >
              {sev.label}
            </span>
            <span className="rounded-md px-2 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
              {categoryLabel}
            </span>
          </div>

          {/* Title */}
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl leading-tight">
            {post.title}
          </h1>

          {/* "What this means" callout (hand-written, optional). */}
          {post.whatThisMeans && (
            <div className="mt-6 rounded-lg bg-brand-50/60 ring-1 ring-inset ring-brand-100 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                What this means for creators
              </p>
              <p className="mt-2 text-sm text-gray-800 leading-relaxed">
                {post.whatThisMeans}
              </p>
            </div>
          )}

          {/* Body */}
          <div className="mt-8">
            <MarkdownBody markdown={post.body} />
          </div>

          {/* Source citation */}
          <div className="mt-10 rounded-xl bg-gray-50/60 ring-1 ring-inset ring-gray-200 px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Source
            </p>
            <p className="mt-1 text-sm text-gray-800">
              <ExternalLink href={post.source.url} className="text-brand-700 hover:underline">
                {post.source.name}
              </ExternalLink>
            </p>
          </div>

          {/* Related tools */}
          {related.length > 0 && (
            <div className="mt-10 border-t border-gray-100 pt-6">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Related tools
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {related.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:border-brand-300 hover:text-brand-700 transition"
                  >
                    {t.shortTitle}
                    <ArrowRight className="h-3 w-3" strokeWidth={2.25} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-12 border-t border-gray-100 pt-6">
            <Link
              href="/updates"
              className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline"
            >
              ← Back to all updates
            </Link>
          </div>
        </article>
      </Container>
    </>
  );
}
