import Link from "next/link";
import { Container } from "./Container";
import { siteConfig } from "@/lib/site-config";

export function Header() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <Container as="div" className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold text-gray-900"
          aria-label={`${siteConfig.name} home`}
        >
          SEO <span className="text-brand-500">Check</span> Tools
        </Link>

        <nav className="flex items-center gap-5 text-sm text-gray-500">
          <Link href="/tools" className="hover:text-gray-900 transition-colors">
            Tools
          </Link>
          <Link href="/guides" className="hover:text-gray-900 transition-colors">
            Guides
          </Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors">
            About
          </Link>
        </nav>
      </Container>
    </header>
  );
}
