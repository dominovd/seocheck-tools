import Link from "next/link";
import { Container } from "./Container";
import { siteConfig } from "@/lib/site-config";
import { toolsByCategory } from "@/lib/tools-catalog";

/**
 * Programmatic-SEO style footer (Mictoo-pattern).
 *
 * As deep pages are built — comparison pages (vs TubeBuddy, vs VidIQ),
 * per-niche pages (gaming tags, cooking tags), language pages — they
 * get added here for crawl coverage. For MVP we only link to what exists.
 */
export function Footer() {
  const groups = toolsByCategory();

  return (
    <footer className="mt-24 border-t border-gray-100 bg-gray-50/60">
      <Container as="div" className="py-14">
        {/* Wordmark + tagline */}
        <div className="mb-12">
          <p className="text-base font-semibold text-gray-900">
            SEO <span className="text-brand-500">Check</span> Tools
          </p>
          <p className="mt-2 text-sm text-gray-600 max-w-md">
            {siteConfig.tagline} for YouTube creators. Free, no signup, AI where
            it counts.
          </p>
        </div>

        {/* Multi-column link sections */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <FooterColumn
            heading="AI Tools"
            links={groups.ai.map((t) => ({
              href: `/tools/${t.slug}`,
              label: t.shortTitle,
            }))}
          />
          <FooterColumn
            heading="Utilities"
            links={[...groups.utility, ...groups.downloader].map((t) => ({
              href: `/tools/${t.slug}`,
              label: t.shortTitle,
            }))}
          />
          <FooterColumn
            heading="Generators"
            links={[...groups.generator, ...groups.calculator].map((t) => ({
              href: `/tools/${t.slug}`,
              label: t.shortTitle,
            }))}
          />
          <FooterColumn
            heading="Site"
            links={[
              { href: "/tools", label: "All tools" },
              { href: "/guides", label: "Guides" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ]}
          />
          <FooterColumn
            heading="Legal"
            links={[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
            ]}
          />
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-gray-500">{siteConfig.copyright}</p>
          <p className="text-xs text-gray-400">
            Not affiliated with YouTube or Alphabet Inc.
          </p>
        </div>
      </Container>
    </footer>
  );
}

type FooterColumnProps = {
  heading: string;
  links: { href: string; label: string }[];
};

function FooterColumn({ heading, links }: FooterColumnProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {heading}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
