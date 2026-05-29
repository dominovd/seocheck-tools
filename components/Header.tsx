import Link from "next/link";
import { Container } from "./Container";
import { siteConfig } from "@/lib/site-config";

export function Header() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <Container as="div" className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-gray-900"
          aria-label={`${siteConfig.displayName} home`}
        >
          seo<span className="text-brand-500">check</span>
          <span className="text-gray-400">.tools</span>
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
