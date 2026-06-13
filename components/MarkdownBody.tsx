import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";

/**
 * Renders a markdown body for updates posts.
 *
 * Key behavior: every link in the markdown body goes through the
 * appropriate Next.js / ExternalLink wrapper, so the external-link-policy
 * (rel="nofollow noopener" target="_blank") applies to anything an author
 * writes inside post bodies without them having to remember.
 *
 * Designed for the seocheck.tools editorial voice: small set of inline
 * styles, no exotic markdown features needed. If we add tables, code
 * blocks, or images later, extend the `components` map here.
 */
export function MarkdownBody({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-gray max-w-none prose-p:leading-relaxed prose-a:text-brand-700 hover:prose-a:underline prose-headings:tracking-tight prose-headings:font-semibold prose-li:my-1">
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            const url = href ?? "";
            const isExternal = /^https?:\/\//.test(url);
            const isInternal = url.startsWith("/");

            if (isExternal) {
              return (
                <ExternalLink href={url} className="text-brand-700">
                  {children}
                </ExternalLink>
              );
            }
            if (isInternal) {
              return (
                <Link href={url} className="text-brand-700 hover:underline">
                  {children}
                </Link>
              );
            }
            // Anchor / mailto / unknown: render as plain anchor without
            // policy attrs.
            return <a href={url}>{children}</a>;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
