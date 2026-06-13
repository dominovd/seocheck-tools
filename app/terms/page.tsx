import { Container } from "@/components/Container";
import { BreadcrumbSchema } from "@/components/PageSchemas";
import { ExternalLink } from "@/components/ExternalLink";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "Terms of use for SEO Check Tools. Free tools provided as-is, AI outputs free for any lawful use, fair-use limits, no warranty.",
  path: "terms",
});

const EFFECTIVE_DATE = "May 29, 2026";

export default function TermsPage() {
  return (
    <Container as="main" className="py-12 sm:py-16">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Terms of Use", url: `${siteConfig.url}/terms` },
        ]}
      />
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Terms of Use
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Effective: {EFFECTIVE_DATE}
        </p>

        <p className="mt-6 text-base text-gray-700 leading-relaxed">
          These terms govern your use of {siteConfig.name} at{" "}
          {siteConfig.domain}. By using the site you agree to them. If you
          don&apos;t, don&apos;t use the site. We&apos;ve kept the language
          plain — if anything is unclear, ask via{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="link">
            {siteConfig.contactEmail}
          </a>
          .
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          The service
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          {siteConfig.name} is a collection of free utilities for YouTube
          content creators: title and description generators, tag tools,
          thumbnail downloads, calculators, and similar. Use is free and does
          not require an account.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          Fair use limits
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          AI-powered tools have a daily limit of 15 generations per tool per
          IP address, and an overall daily compute budget across all users.
          Browser-side and lookup utilities have no per-IP limit but are
          rate-limited at the platform level to prevent abuse.
        </p>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          Attempting to circumvent these limits — through proxy rotation,
          automated scripts, distributed requests, or otherwise — may result
          in a temporary or permanent IP block. We reserve the right to
          adjust the limits at any time to keep the service free for the
          majority.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          What you may use the service for
        </h2>
        <ul className="mt-3 space-y-2 text-base text-gray-700 leading-relaxed">
          <li>
            Any lawful purpose, including commercial projects — no attribution
            required.
          </li>
          <li>
            Generating titles, descriptions, tags, and other metadata for
            videos you publish on YouTube or any other platform.
          </li>
          <li>
            Competitor research, including looking up public information about
            other channels and videos.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          What you may not use the service for
        </h2>
        <ul className="mt-3 space-y-2 text-base text-gray-700 leading-relaxed">
          <li>
            Generating content that violates law in your jurisdiction —
            including but not limited to defamation, harassment, hate speech,
            misleading medical or financial claims, or child sexual abuse
            material.
          </li>
          <li>
            Building a competing product by scraping our endpoints. We may
            block IPs and seek other remedies for systematic scraping.
          </li>
          <li>
            Reselling the AI output as a subscription service of your own,
            using our backend as the underlying provider.
          </li>
          <li>
            Anything that violates Anthropic&apos;s usage policies for the
            Claude API, which our AI tools relay:{" "}
            <ExternalLink
              href="https://www.anthropic.com/legal/aup"
              className="link"
              hideIcon
            >
              anthropic.com/legal/aup
            </ExternalLink>
            .
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          AI output ownership
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          We claim no ownership over content generated by the AI tools for
          you. You may use, modify, and publish the output in any lawful
          manner.
        </p>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          The copyright status of purely AI-generated text varies by
          jurisdiction. In the United States, the Copyright Office has held
          that purely AI-generated content is generally not eligible for
          copyright protection. In other jurisdictions the position differs.
          If copyright matters to your specific use, consult a lawyer
          familiar with your country&apos;s position.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          Accuracy of AI outputs
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          AI-generated content may contain factual errors, outdated
          information, or hallucinated specifics. You are responsible for
          reviewing every output before publishing or relying on it. We are
          not responsible for misleading or incorrect content you publish
          based on AI generations.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          Accuracy of utility tools
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          Tools that fetch data from YouTube (Channel ID Finder, Tag
          Extractor, Keyword Tool) parse public page sources at the time of
          your request. Results reflect YouTube&apos;s state at that moment,
          which may differ from what you see logged-in or from a different
          region. Estimated earnings from the Money Calculator are
          industry-average heuristics, not personalised forecasts.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          No warranty
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          The site and all tools are provided <strong>&quot;as is&quot;</strong>
          {" "}and <strong>&quot;as available&quot;</strong>, without warranty
          of any kind — express, implied, or statutory. Without limiting the
          foregoing, we expressly disclaim any warranties of merchantability,
          fitness for a particular purpose, non-infringement, and quiet
          enjoyment. We do not warrant that the service will be uninterrupted,
          error-free, or that defects will be corrected.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          Limitation of liability
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          To the maximum extent permitted by law, we are not liable for any
          indirect, incidental, special, consequential, or punitive damages,
          or any loss of revenue, profits, data, goodwill, or other intangible
          losses, resulting from your use of or inability to use the service.
          Our total liability for any direct damages will not exceed the
          amount you paid us for the service — which, since the service is
          free, is $0.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          Third-party trademarks and platforms
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          {siteConfig.name} is not affiliated with, endorsed by, or sponsored
          by YouTube, Alphabet Inc., Google, or any other platform mentioned
          on the site. &quot;YouTube&quot; is a trademark of Google LLC; we
          use it descriptively to indicate which platform our tools are
          designed for. Other product or service names mentioned (TubeBuddy,
          VidIQ, TubeRanker, Ahrefs, Canva, etc.) are trademarks of their
          respective owners.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          Affiliate and advertising disclosure
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          Some outbound links on the site are or may become affiliate links —
          if you sign up for a paid product through one of them, we may earn
          a small commission at no extra cost to you. These will be marked
          clearly. We only link to products we believe are genuinely useful.
        </p>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          The site may display contextual advertising via Google AdSense in
          the future. If so, ads will be clearly labelled and you can use any
          ad blocker without restriction.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          Changes to these terms
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          We may update these terms as the service evolves. When we do, we
          will update the &quot;Effective&quot; date at the top of this page.
          Continued use of the service after a change means you accept the
          updated terms. If you don&apos;t agree, stop using the service.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          Governing law
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          These terms are governed by the laws applicable in the operator&apos;s
          jurisdiction, without reference to conflict-of-laws principles. Any
          dispute will be resolved in good faith through correspondence first.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">Contact</h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          Questions about these terms:{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="link">
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </article>
    </Container>
  );
}
