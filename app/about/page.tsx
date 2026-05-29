import { Container } from "@/components/Container";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "seocheck.tools is a free YouTube SEO toolkit for content creators. No signup, no credit card, privacy-first.",
  path: "about",
});

export default function AboutPage() {
  return (
    <Container as="main" className="py-12 sm:py-16">
      <article className="mx-auto max-w-2xl prose prose-gray">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          About seocheck.tools
        </h1>
        <p className="mt-6 text-base text-gray-700 leading-relaxed">
          seocheck.tools is a free toolkit for YouTube creators. We build the
          utilities we wished existed when we were optimizing our own channels —
          tag generators, thumbnail downloaders, earnings calculators, AI-powered
          title and description writers — and we make them free to use without
          signup or paywalls.
        </p>
        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          Every tool runs in your browser or through a privacy-first API call.
          We do not store your prompts, outputs, or browsing data. The only
          information we briefly track is your IP address paired with the date,
          and only for the purpose of enforcing fair-use daily limits on the
          AI-powered tools.
        </p>
        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          If you have feedback, feature requests, or want to report a bug, reach
          out via the <a href="/contact" className="link">contact page</a>.
        </p>
      </article>
    </Container>
  );
}
