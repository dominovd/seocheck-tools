import Link from "next/link";
import { Container } from "@/components/Container";
import { BreadcrumbSchema } from "@/components/PageSchemas";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { allToolsSorted } from "@/lib/tools-catalog";

export const metadata = buildMetadata({
  title: "About",
  description:
    "SEO Check Tools is a free YouTube SEO toolkit for content creators. No signup, no credit card, AI where it counts, privacy-first.",
  path: "about",
});

export default function AboutPage() {
  const liveCount = allToolsSorted().filter((t) => t.status === "live").length;

  return (
    <Container as="main" className="py-12 sm:py-16">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "About", url: `${siteConfig.url}/about` },
        ]}
      />
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          About {siteConfig.name}
        </h1>

        <p className="mt-6 text-base text-gray-700 leading-relaxed">
          {siteConfig.name} is a free toolkit for YouTube creators. {liveCount}{" "}
          tools that cover the full pre-publish workflow: title and description
          generators, tag and hashtag tools, thumbnail downloads, chapter
          formatting, earnings estimates, embed snippets, and competitor
          research utilities.
        </p>

        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          We built it because the alternatives don&apos;t fit how most creators
          actually work. The big paid suites (TubeBuddy, VidIQ, TubeRanker)
          charge $19-49/month for tools you only need before each upload. The
          free alternatives are 10-year-old ad-stuffed sites with broken
          interfaces. Neither felt right.
        </p>

        <h2 className="mt-12 text-xl font-semibold text-gray-900">
          The principles
        </h2>

        <dl className="mt-5 space-y-5 text-base text-gray-700">
          <div>
            <dt className="font-semibold text-gray-900">100% free, no signup</dt>
            <dd className="mt-1 leading-relaxed">
              Every tool is free. There is no account creation, no email
              capture, no &quot;free trial&quot; that turns into a subscription.
              The AI-powered tools have a daily fair-use limit (15 generations
              per tool per IP) to keep compute costs affordable — that&apos;s
              it.
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-gray-900">AI where it counts</dt>
            <dd className="mt-1 leading-relaxed">
              We use Anthropic&apos;s Claude Haiku for tasks where AI genuinely
              produces better results: title brainstorming, description
              writing, tag and idea generation. Browser-side utilities (thumb
              download, embed code, chapter format) stay browser-side —
              no LLM cost, no API delay.
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-gray-900">Privacy by default</dt>
            <dd className="mt-1 leading-relaxed">
              No analytics scripts that follow you across the web. No cookies
              beyond what bot protection strictly requires. IPs are held in
              memory only and discarded each UTC day. Prompts and outputs are
              not stored.
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-gray-900">No tool-gating</dt>
            <dd className="mt-1 leading-relaxed">
              Features paid suites charge for — like extracting tags from a
              competitor&apos;s video — are simply free here. The only reason
              they can charge is that nobody bothered to make a free version
              that doesn&apos;t suck.
            </dd>
          </div>
        </dl>

        <h2 className="mt-12 text-xl font-semibold text-gray-900">
          How we keep it free
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          Hosting costs are small (Vercel + Cloudflare + Upstash all on free
          tiers). The biggest expense is the AI compute — about $0.003 per
          generation, capped at $5/day platform-wide. In the future the site
          may host lightweight contextual ads via Google AdSense and a small
          number of affiliate links to genuinely useful paid tools (Ahrefs,
          TubeBuddy, Canva). If and when that happens, it will be clearly
          disclosed and easy to spot.
        </p>

        <h2 className="mt-12 text-xl font-semibold text-gray-900">
          The tech stack
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          Next.js 14 on Vercel. Anthropic Claude Haiku for AI generations.
          Upstash Redis for rate limiting and caching. Cloudflare Turnstile for
          bot protection. Vercel Analytics for cookieless page-view
          measurement. That&apos;s the whole list of services involved when
          you use the site.
        </p>

        <h2 className="mt-12 text-xl font-semibold text-gray-900">
          Get in touch
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          Feedback, feature requests, bug reports, or partnership inquiries —
          email{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="link">
            {siteConfig.contactEmail}
          </a>{" "}
          or use the{" "}
          <Link href="/contact" className="link">
            contact page
          </Link>
          . We read everything.
        </p>
      </article>
    </Container>
  );
}
