import Link from "next/link";
import { Container } from "./Container";
import { siteConfig } from "@/lib/site-config";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container as="div" className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="text-[15px] sm:text-base font-semibold text-gray-900 whitespace-nowrap"
          aria-label={`${siteConfig.name} home`}
        >
          SEO <span className="text-brand-500">Check</span> Tools
        </Link>

        <nav className="flex items-center gap-4 sm:gap-5 text-sm text-gray-500">
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
