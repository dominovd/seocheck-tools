import { Container } from "@/components/Container";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Privacy policy for seocheck.tools. We don't store your prompts, outputs, or personal data. IP addresses are used only for fair-use rate limiting.",
  path: "privacy",
});

export default function PrivacyPage() {
  return (
    <Container as="main" className="py-12 sm:py-16">
      <article className="mx-auto max-w-2xl prose prose-gray">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: replace-with-date</p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">What we collect</h2>
        <p className="mt-2 text-base text-gray-700 leading-relaxed">
          We do not require accounts. We do not store the content you generate
          with our AI tools. We do not sell or share any user data with third
          parties for marketing purposes.
        </p>

        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          We briefly hold your IP address paired with the current date, in
          volatile memory only, for the sole purpose of enforcing daily usage
          limits on AI-powered tools. This information is automatically discarded
          at the end of each day and is never written to any database.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">Cookies</h2>
        <p className="mt-2 text-base text-gray-700 leading-relaxed">
          We use minimal, strictly necessary cookies for security (Cloudflare
          Turnstile bot protection on AI endpoints). We do not use tracking or
          advertising cookies on this site.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">Third-party services</h2>
        <p className="mt-2 text-base text-gray-700 leading-relaxed">
          AI generations are powered by Anthropic&apos;s Claude API. Inputs are
          sent server-side to Anthropic for processing per their{" "}
          <a
            href="https://www.anthropic.com/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            privacy policy
          </a>
          . We do not retain a copy of the prompt or the output.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">Contact</h2>
        <p className="mt-2 text-base text-gray-700 leading-relaxed">
          Questions about privacy can be sent to{" "}
          <a href="/contact" className="link">our contact page</a>.
        </p>
      </article>
    </Container>
  );
}
