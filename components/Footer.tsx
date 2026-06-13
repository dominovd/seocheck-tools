import Link from "next/link";
import { Container } from "./Container";
import { siteConfig } from "@/lib/site-config";
import {
  toolsByStage,
  stageLabel,
  stageTagline,
  STAGE_ORDER,
} from "@/lib/tools-catalog";

/**
 * Workflow-stage footer. Mirrors the /tools page information architecture
 * (Research / Optimize / Publish / Analyze) so header, /tools index, and
 * footer all reinforce the same mental model. Each stage column doubles
 * as an internal-linking hub for the stage's hub page.
 */
export function Footer() {
  const groups = toolsByStage();

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

        {/* Stage columns + site + legal */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {STAGE_ORDER.map((s) => (
            <FooterColumn
              key={s}
              heading={stageLabel(s)}
              subheading={stageTagline(s)}
              hubHref={`/tools/${s}`}
              links={groups[s].map((t) => ({
                href: `/tools/${t.slug}`,
                label: t.shortTitle,
              }))}
            />
          ))}
          <FooterColumn
            heading="Site"
            links={[
              { href: "/tools", label: "All tools" },
              { href: "/guides", label: "Guides" },
              { href: "/updates", label: "Updates" },
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
  subheading?: string;
  /** When set, the heading becomes a link to this stage hub page. */
  hubHref?: string;
  links: { href: string; label: string }[];
};

function FooterColumn({ heading, subheading, hubHref, links }: FooterColumnProps) {
  return (
    <div>
      {hubHref ? (
        <Link
          href={hubHref}
          className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-brand-700 transition"
        >
          {heading}
        </Link>
      ) : (
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {heading}
        </p>
      )}
      {subheading && (
        <p className="mt-1 text-[11px] text-gray-400">{subheading}</p>
      )}
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
