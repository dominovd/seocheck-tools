import Link from "next/link";
import { Container } from "@/components/Container";
import { BreadcrumbSchema } from "@/components/PageSchemas";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { GUIDES } from "@/lib/guides-catalog";

export const metadata = buildMetadata({
  title: "Guides",
  description:
    "Cornerstone guides on YouTube SEO, title writing, tags, and what actually moves the needle in 2026.",
  path: "guides",
});

export default function GuidesIndexPage() {
  return (
    <Container as="main" className="py-12 sm:py-16">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
        ]}
      />

      <header className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Guides
        </h1>
        <p className="mt-4 text-base text-gray-600 sm:text-lg">
          Long-form articles on YouTube SEO, title writing, tag strategy, and
          the signals YouTube&apos;s algorithm weights most. Practical, no
          fluff, no &quot;use power words&quot;.
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-3xl space-y-5">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group block rounded-xl border border-gray-200 bg-white p-6 transition hover:border-brand-300 hover:shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Guide · {guide.readingTimeMinutes} min read
            </p>
            <h2 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
              {guide.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {guide.description}
            </p>
            <p className="mt-3 text-xs text-gray-400">
              Published {guide.publishedAt}
            </p>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-3xl rounded-lg border border-gray-200 bg-gray-50/40 p-5">
        <h3 className="text-sm font-semibold text-gray-900">
          More guides coming
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          We&apos;re drafting deeper dives on thumbnail design, chapter
          strategy, hashtag taxonomy, and Shorts SEO. Subscribe via the{" "}
          <Link href="/contact" className="link">
            contact page
          </Link>{" "}
          if you want a heads-up when they ship.
        </p>
      </div>
    </Container>
  );
}
