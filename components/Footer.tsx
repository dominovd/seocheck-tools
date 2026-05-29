import Link from "next/link";
import { Container } from "./Container";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200 bg-gray-50">
      <Container as="div" className="py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-mono text-base font-semibold text-gray-900">
              seo<span className="text-brand-500">check</span>
              <span className="text-gray-400">.tools</span>
            </p>
            <p className="mt-2 text-sm text-gray-600">{siteConfig.tagline}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Site
            </p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-gray-900 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-gray-900 transition-colors">
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Legal
            </p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/privacy" className="hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gray-900 transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-xs text-gray-500">
          {siteConfig.copyright}
        </div>
      </Container>
    </footer>
  );
}
