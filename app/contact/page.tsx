import { Container } from "@/components/Container";
import { BreadcrumbSchema } from "@/components/PageSchemas";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with the SEO Check Tools team — feedback, bug reports, feature requests, or partnership inquiries.",
  path: "contact",
});

const REACH_OUT_FOR = [
  {
    title: "A tool isn't working",
    body: "Tell us what you tried and what you saw — the more specific the better. Include the URL of the tool and the input you used so we can reproduce.",
  },
  {
    title: "An AI output was off",
    body: "Forward us the prompt, the result, and what you expected instead. The AI tools improve based on patterns of feedback like this.",
  },
  {
    title: "You want a tool we don't have",
    body: "Tell us what task you're trying to do and how often. We prioritise additions based on overlap with existing creator workflows.",
  },
  {
    title: "You found a security or privacy issue",
    body: "Email us with the details before disclosing publicly. We'll respond within 72 hours and credit you (anonymously if you prefer) once the fix ships.",
  },
  {
    title: "Press, podcast, or partnership",
    body: "Include the publication / project and your timeline. We're a small team — typical response is 3-5 business days.",
  },
];

export default function ContactPage() {
  return (
    <Container as="main" className="py-12 sm:py-16">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Contact", url: `${siteConfig.url}/contact` },
        ]}
      />
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Contact
        </h1>

        <p className="mt-6 text-base text-gray-700 leading-relaxed">
          One email handles everything. We read it. We reply. Typical
          turnaround is 1-3 business days.
        </p>

        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-500 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-600 transition"
        >
          {siteConfig.contactEmail}
        </a>

        <h2 className="mt-12 text-xl font-semibold text-gray-900">
          What to reach out about
        </h2>

        <dl className="mt-5 space-y-5 text-base text-gray-700">
          {REACH_OUT_FOR.map(({ title, body }) => (
            <div key={title}>
              <dt className="font-semibold text-gray-900">{title}</dt>
              <dd className="mt-1 leading-relaxed">{body}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-12 text-xl font-semibold text-gray-900">
          What we won&apos;t reply to
        </h2>
        <ul className="mt-3 space-y-2 text-base text-gray-700 leading-relaxed">
          <li>
            SEO outreach offering link insertions, guest posts, or paid
            placement — we don&apos;t do any of those.
          </li>
          <li>
            Generic &quot;I noticed your site could benefit from…&quot; cold
            sales pitches.
          </li>
          <li>
            Requests to add an AI tool that competes directly with ours, or to
            white-label our backend.
          </li>
        </ul>

        <p className="mt-12 text-sm text-gray-500">
          For privacy-specific or legal inquiries, the same email works — see
          the relevant section in our{" "}
          <a href="/privacy" className="link">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/terms" className="link">
            Terms of Use
          </a>
          .
        </p>
      </article>
    </Container>
  );
}
