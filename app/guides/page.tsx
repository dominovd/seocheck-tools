import Link from "next/link";
import { Container } from "@/components/Container";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Guides",
  description:
    "In-depth guides on YouTube SEO, growing a channel, and getting the most out of our free tools. Coming soon.",
  path: "guides",
  noindex: true,
});

export default function GuidesIndexPage() {
  return (
    <Container as="main" className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Coming soon
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          In-depth YouTube SEO guides
        </h1>
        <p className="mt-4 text-base text-gray-600 sm:text-lg">
          Long-form deep dives on title writing, tag strategy, the chapter
          rules, money math, and the small details that move the needle on
          YouTube&apos;s algorithm. We&apos;re still drafting these — for now,
          start with the tools and let us know what you&apos;d like to read
          about.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/tools" className="btn-primary">
            Browse all tools
          </Link>
          <Link href="/contact" className="btn-secondary">
            Request a guide
          </Link>
        </div>
      </div>
    </Container>
  );
}
