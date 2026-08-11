import { Container } from "@/components/Container";
import { BreadcrumbSchema } from "@/components/PageSchemas";
import { ExternalLink } from "@/components/ExternalLink";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Privacy policy for SEO Check Tools. No accounts, no tracking cookies, IPs held in memory only for fair-use rate limiting. GDPR + CCPA compliant.",
  path: "privacy",
});

const EFFECTIVE_DATE = "May 29, 2026";

export default function PrivacyPage() {
  return (
    <Container as="main" className="py-12 sm:py-16">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Privacy Policy", url: `${siteConfig.url}/privacy` },
        ]}
      />
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Effective: {EFFECTIVE_DATE}
        </p>

        <p className="mt-6 text-base text-gray-700 leading-relaxed">
          This policy describes what happens to information when you use{" "}
          {siteConfig.name} at {siteConfig.domain}. We&apos;ve tried to write
          it in plain English. If something is unclear,{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="link">
            email us
          </a>
          .
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          The short version
        </h2>
        <ul className="mt-3 space-y-2 text-base text-gray-700 leading-relaxed">
          <li>We don&apos;t require an account.</li>
          <li>We don&apos;t use tracking cookies or behavioural ad networks.</li>
          <li>
            We don&apos;t store the prompts you submit to AI tools or the
            generated outputs.
          </li>
          <li>
            We briefly hold your IP address paired with the current UTC date,
            in memory only, to enforce a daily fair-use limit on AI tools.
            That information is discarded each UTC midnight.
          </li>
          <li>
            We use a small number of third-party services to make the site
            work — listed in full below.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          What we collect, and why
        </h2>

        <h3 className="mt-5 text-base font-semibold text-gray-900">
          IP address (for rate limiting)
        </h3>
        <p className="mt-2 text-base text-gray-700 leading-relaxed">
          When you use an AI-powered tool we briefly note your IP address paired
          with the current UTC date in our Redis cache. This lets us enforce a
          daily limit of 15 generations per tool per IP. The record is held in
          memory only and is automatically discarded at the end of each UTC day.
          We do not log IPs anywhere else, do not correlate them with browsing
          activity, and do not share them with third parties for marketing.
        </p>

        <h3 className="mt-5 text-base font-semibold text-gray-900">
          Prompts and outputs (not stored)
        </h3>
        <p className="mt-2 text-base text-gray-700 leading-relaxed">
          When you ask an AI tool to generate something (a title, description,
          tag list, etc.), your prompt is sent server-side to Anthropic&apos;s
          Claude API and the response is returned to your browser. We do not
          retain a copy of either. We do hash the normalized prompt and cache
          the response for 24 hours so that identical follow-up requests
          don&apos;t cost extra compute — this cache key is the hash of the
          prompt, not the prompt itself.
        </p>

        <h3 className="mt-5 text-base font-semibold text-gray-900">
          URLs and channels you paste into utility tools (not stored)
        </h3>
        <p className="mt-2 text-base text-gray-700 leading-relaxed">
          For tools that look up information from YouTube — like the Channel
          Audit, Video Audit, Outlier Finder, Niche Check, Channel ID Finder,
          Tag Extractor, and Keyword Tool — we query the YouTube Data
          API v3 server-side to fetch publicly available metadata (channel
          stats, video lists, video stats, search results) and return the
          result. We cache the response per query for 6&ndash;24 hours so
          popular lookups are fast and cheap. The cache stores only the query
          and the API response, not who requested it. See the &ldquo;YouTube
          API Services&rdquo; section below for the full disclosure required by
          YouTube&apos;s API terms.
        </p>

        <h3 className="mt-5 text-base font-semibold text-gray-900">
          Cookies
        </h3>
        <p className="mt-2 text-base text-gray-700 leading-relaxed">
          We use cookies only for two strictly necessary purposes:
        </p>
        <ul className="mt-2 space-y-2 text-base text-gray-700 leading-relaxed">
          <li>
            <strong>Cloudflare Turnstile bot protection.</strong> When you use
            an AI tool, Cloudflare may set a short-lived cookie
            (<span className="font-mono text-sm">cf_clearance</span>,{" "}
            <span className="font-mono text-sm">__cf_bm</span>) to identify
            that you&apos;ve already passed the bot challenge. These cookies
            are required for the AI tools to function.
          </li>
          <li>
            <strong>Vercel Analytics.</strong> Our page-view analytics is the
            cookieless variant of Vercel Analytics — it does not drop a cookie
            and does not personally identify visitors. It records page paths
            and anonymized device-class data only.
          </li>
        </ul>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          We do not use third-party advertising cookies or cross-site tracking
          cookies. If we add Google AdSense or affiliate program cookies in the
          future, this policy will be updated and the additions clearly
          disclosed.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          Third-party services involved when you use this site
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          The minimum set of providers we share data with so the site can
          function:
        </p>
        <ul className="mt-3 space-y-3 text-base text-gray-700 leading-relaxed">
          <li>
            <strong>Anthropic.</strong> AI generation requests are forwarded to
            Anthropic&apos;s Claude API for processing. Anthropic&apos;s privacy
            policy:{" "}
            <ExternalLink
              href="https://www.anthropic.com/legal/privacy"
              className="link"
              hideIcon
            >
              anthropic.com/legal/privacy
            </ExternalLink>
            . Anthropic retains API request data for up to 30 days for trust
            &amp; safety review before deletion; they do not use API data for
            model training.
          </li>
          <li>
            <strong>Cloudflare.</strong> Cloudflare hosts our DNS, provides
            DDoS protection, and runs the Turnstile bot challenge on AI tool
            endpoints. Their privacy policy:{" "}
            <ExternalLink
              href="https://www.cloudflare.com/privacypolicy/"
              className="link"
              hideIcon
            >
              cloudflare.com/privacypolicy
            </ExternalLink>
            .
          </li>
          <li>
            <strong>Vercel.</strong> Vercel hosts the site and provides the
            cookieless page-view analytics. Their privacy policy:{" "}
            <ExternalLink
              href="https://vercel.com/legal/privacy-policy"
              className="link"
              hideIcon
            >
              vercel.com/legal/privacy-policy
            </ExternalLink>
            .
          </li>
          <li>
            <strong>Upstash.</strong> Upstash provides the Redis instance we
            use for rate limiting and short-term caching. Their privacy policy:{" "}
            <ExternalLink
              href="https://upstash.com/trust/privacy.pdf"
              className="link"
              hideIcon
            >
              upstash.com/trust/privacy.pdf
            </ExternalLink>
            .
          </li>
          <li>
            <strong>Google (YouTube Data API).</strong> When you use a tool
            that looks up channel or video data, we query the YouTube Data
            API v3 server-side to fetch publicly available metadata. Google&apos;s
            privacy policy:{" "}
            <ExternalLink
              href="https://policies.google.com/privacy"
              className="link"
              hideIcon
            >
              policies.google.com/privacy
            </ExternalLink>
            . Use of the YouTube Data API is governed by the YouTube API
            Services Terms of Service:{" "}
            <ExternalLink
              href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
              className="link"
              hideIcon
            >
              developers.google.com/youtube/terms/api-services-terms-of-service
            </ExternalLink>
            . See the dedicated &ldquo;YouTube API Services&rdquo; section
            below.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          YouTube API Services
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          Several tools on this site — Channel Audit, Video Audit, Outlier
          Finder, Niche Check, Channel ID Finder, Historical Tracking, and the
          Competitor Channel Analyzer — query the YouTube Data API v3 to fetch
          publicly available channel and video metadata (channel statistics,
          video lists, video statistics, search results, video category
          metadata). We do not request OAuth permission to read your YouTube
          account, we do not access private data on your behalf, and you are
          never asked to sign in with Google to use these tools.
        </p>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          By using these tools you agree to be bound by the{" "}
          <ExternalLink
            href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
            className="link"
            hideIcon
          >
            YouTube API Services Terms of Service
          </ExternalLink>{" "}
          and acknowledge that data we surface from YouTube is governed by{" "}
          <ExternalLink
            href="https://policies.google.com/privacy"
            className="link"
            hideIcon
          >
            Google&apos;s Privacy Policy
          </ExternalLink>
          .
        </p>

        <h3 className="mt-5 text-base font-semibold text-gray-900">
          Our assessments are not YouTube data
        </h3>
        <p className="mt-2 text-base text-gray-700 leading-relaxed">
          Our tools produce editorial assessments of their own alongside the
          public data retrieved from the API: recommendations, priority labels,
          quality bands, verdicts, and similar judgements.{" "}
          <strong>
            These metrics are not related to YouTube and have been derived by
            the API client ({siteConfig.name}).
          </strong>{" "}
          They are not endorsed by or sourced from YouTube.
        </p>

        <h3 className="mt-5 text-base font-semibold text-gray-900">
          What YouTube-derived data we store
        </h3>
        <ul className="mt-2 space-y-2 text-base text-gray-700 leading-relaxed">
          <li>
            <strong>Short-term query cache (6&ndash;24 hours).</strong>{" "}
            Responses to API lookups (channel stats, video lists, video stats)
            are cached per query so popular lookups are fast. The cache key is
            the query itself; we do not associate cached data with the IP that
            requested it.
          </li>
          <li>
            <strong>Channel snapshots for Historical Tracking (up to 4
            weekly snapshots per channel, 30 days maximum).</strong> When a
            user opts into tracking a channel, we run a weekly background
            refresh and store raw YouTube-provided metrics (subscriber count,
            video count, view counts, upload dates) so the trend chart can
            render. These snapshots are keyed by channel ID, not by the user
            who added the channel. In line with the YouTube API Services
            Developer Policies, no YouTube statistic is retained for longer
            than 30 days: each snapshot key carries a hard 30-day expiry and
            out-of-window snapshots are discarded automatically.
          </li>
          <li>
            <strong>Anonymous editorial counts (30 days maximum).</strong> We
            log a small anonymous record per audit containing only counts
            produced by our own editorial checks, such as how many uploads had
            a flagged dimension. Source channel and video IDs are SHA-256
            hashed before writing, and no YouTube-provided statistic is
            included. These records expire after 30 days.
          </li>
        </ul>

        <h3 className="mt-5 text-base font-semibold text-gray-900">
          How to revoke access and delete YouTube-derived data
        </h3>
        <p className="mt-2 text-base text-gray-700 leading-relaxed">
          Because we don&apos;t request OAuth scopes from your Google account,
          there is normally nothing for you to revoke at{" "}
          <ExternalLink
            href="https://myaccount.google.com/permissions"
            className="link"
            hideIcon
          >
            myaccount.google.com/permissions
          </ExternalLink>
          . To remove cached YouTube data we hold about a channel, email{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="link">
            {siteConfig.contactEmail}
          </a>{" "}
          with the channel URL or channel ID. We will purge the short-term
          query cache and any Historical Tracking snapshots for that channel
          within 7 days of the request.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          Your rights
        </h2>

        <h3 className="mt-5 text-base font-semibold text-gray-900">
          If you&apos;re in the EU, UK, or EEA (GDPR)
        </h3>
        <p className="mt-2 text-base text-gray-700 leading-relaxed">
          Under the GDPR you have the right to access, rectify, delete, or
          restrict processing of your personal data. Because we do not
          maintain any persistent record tied to an individual user (no
          accounts, no profiles, no long-term IP logs), there&apos;s typically
          nothing for us to retrieve or delete on request. If you believe we
          hold information about you, email us at{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="link">
            {siteConfig.contactEmail}
          </a>{" "}
          and we&apos;ll confirm in writing within 30 days.
        </p>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          Our legal basis for processing the limited IP data described above is
          legitimate interest (Article 6(1)(f) GDPR) — preventing abuse of a
          free service. You may object to this processing at any time, in which
          case you may not be able to use the AI-powered tools but the
          browser-side tools will continue to work.
        </p>

        <h3 className="mt-5 text-base font-semibold text-gray-900">
          If you&apos;re in California (CCPA / CPRA)
        </h3>
        <p className="mt-2 text-base text-gray-700 leading-relaxed">
          We do not sell or share personal information for cross-context
          behavioural advertising. We do not knowingly collect personal
          information from California residents under the age of 16. You have
          the right to know, delete, and limit the use of any personal
          information we hold about you. To exercise any of these rights,
          email{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="link">
            {siteConfig.contactEmail}
          </a>
          .
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          Children&apos;s privacy
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          The site is intended for users aged 13 and over. We do not knowingly
          collect personal information from children under 13. If you believe a
          child has provided information to us, please contact us so we can
          investigate.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          Data retention summary
        </h2>
        <ul className="mt-3 space-y-2 text-base text-gray-700 leading-relaxed">
          <li>
            <strong>IP + UTC date (rate limit):</strong> in-memory, discarded
            at UTC midnight
          </li>
          <li>
            <strong>Prompt-output cache (AI tools):</strong> hash of prompt and
            output, 24 hours
          </li>
          <li>
            <strong>YouTube Data API lookup cache:</strong> 6&ndash;24 hours
            per query, keyed by query (not by requester)
          </li>
          <li>
            <strong>Historical Tracking channel snapshots:</strong> up to 4
            weekly snapshots per tracked channel and never longer than 30
            days, keyed by channel ID; purged on email request within 7 days
          </li>
          <li>
            <strong>Anonymous editorial audit counts:</strong> 30 days
            maximum, hashed source ID, no YouTube statistics included
          </li>
          <li>
            <strong>Vercel Analytics events:</strong> per Vercel&apos;s
            standard retention
          </li>
          <li>
            <strong>Server access logs:</strong> Vercel&apos;s default retention
            (typically a few days), purged automatically
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">
          Changes to this policy
        </h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          When we change anything substantive — adding a new third party,
          changing what we collect, adding advertising or affiliate tracking —
          we&apos;ll update the &quot;Effective&quot; date at the top and
          summarise the change here. Continued use of the site after a change
          means you accept the new terms.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-gray-900">Contact</h2>
        <p className="mt-3 text-base text-gray-700 leading-relaxed">
          Questions about this policy or how we handle data:{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="link">
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </article>
    </Container>
  );
}
