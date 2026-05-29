import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Container } from "./Container";
import { siteConfig } from "@/lib/site-config";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <Container as="div" className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-lg font-semibold tracking-tight text-gray-900"
          aria-label={`${siteConfig.displayName} home`}
        >
          <BadgeCheck
            className="h-5 w-5 text-brand-500"
            strokeWidth={2.25}
            aria-hidden="true"
          />
          <span>
            seo<span className="text-brand-500">check</span>
            <span className="text-gray-400">.tools</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/#tools" className="hover:text-gray-900 transition-colors">
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
