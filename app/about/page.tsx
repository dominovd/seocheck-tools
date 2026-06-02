import Link from "next/link";
import { Container } from "@/components/Container";
import { BreadcrumbSchema } from "@/components/PageSchemas";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { allToolsSorted } from "@/lib/tools-catalog";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Free YouTube analytics and SEO platform — Visibility Score, Channel Audit, AI Fix-with-AI, Outlier Finder, weekly tracking. No signup, privacy-first.",
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
          {siteConfig.name} is a free YouTube analytics and SEO platform for
          content creators. {liveCount} tools across the full creator workflow
          — Research, Optimize, Publish, Analyze. The flagship surfaces are
          measurement-first: a composite <Link href="/tools/youtube-visibility-score" className="link">Visibility Score</Link>
          {" "}across CTR, metadata, niche headroom, and growth trajectory; a
          whole-channel{" "}
          <Link href="/tools/youtube-channel-audit" className="link">Channel Audit</Link>
          {" "}with AI-extracted recurring issues; a single-video{" "}
          <Link href="/tools/youtube-video-audit" className="link">Video Audit</Link>{" "}
          with one-click AI-Fix orchestration that rewrites every weak metadata
          field at once; an{" "}
          <Link href="/tools/youtube-outlier-finder" className="link">Outlier Finder</Link>
          {" "}that surfaces breakthrough videos against the channel median;
          and weekly historical Visibility Score tracking on any channel you
          mark to follow. On top of that, 14 single-purpose AI generators and
          browser utilities for titles, tags, hashtags, thumbnails, chapters,
          descriptions, and earnings.
        </p>

        <p className="mt-4 text-base text-gray-700 leading-relaxed">
          We built it because the alternatives don&apos;t fit how most creators
          actually work. The big paid suites (TubeBuddy, VidIQ, TubeRanker)
          charge $19-49/month for tools you only need before each upload, and
          gate the most valuable analytical features behind paywalls. The free
          alternatives are 10-year-old ad-stuffed sites with broken interfaces.
          We built the measurement-instrument layer (Visibility Score, Channel
          Audit, Outlier Finder, historical tracking) free, alongside a
          well-designed generator collection that doesn&apos;t feel like 2010.
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
              produces better results: title and description brainstorming, tag
              and idea generation, the orchestrated{" "}
              <Link href="/tools/youtube-video-audit" className="link">Fix-with-AI</Link>{" "}
              button that rewrites every weak metadata field after the audit in
              one call, the differential pattern analysis in Competitor and
              Outlier Finder, the recurring-issue extraction in Channel Audit,
              and the one-sentence positioning summary on the Visibility Score.
              Browser-side utilities (thumb download, embed code, chapter format,
              Title Score Checker, Thumbnail Preview) stay browser-side — no
              LLM cost, no API delay.
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
