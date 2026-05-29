import { Container } from "@/components/Container";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with the seocheck.tools team for feedback, bug reports, or partnership inquiries.",
  path: "contact",
});

export default function ContactPage() {
  return (
    <Container as="main" className="py-12 sm:py-16">
      <article className="mx-auto max-w-2xl prose prose-gray">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Contact
        </h1>
        <p className="mt-6 text-base text-gray-700 leading-relaxed">
          Have feedback, want to report a bug, request a new tool, or discuss a
          partnership? Reach out at{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="link">
            {siteConfig.contactEmail}
          </a>
          .
        </p>
        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          We read every email and reply to most within a few business days.
        </p>
      </article>
    </Container>
  );
}
