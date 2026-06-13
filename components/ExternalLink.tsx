import { ExternalLink as ExternalLinkIcon } from "lucide-react";

/**
 * Outbound link to any off-domain URL.
 *
 * Always applies `rel="nofollow noopener"` and `target="_blank"`:
 *
 *  - `nofollow` blocks PageRank flow. The site has a heavy outbound link
 *    profile (guides, planned /updates feed, source citations) and we
 *    cite a lot of YouTube/Google docs. Telling Google "we're citing,
 *    not endorsing for ranking purposes" is the same convention
 *    Wikipedia and fact-check sites use.
 *  - `noopener` is security, not SEO: blocks the new tab from accessing
 *    `window.opener` on the page that opened it via `target="_blank"`.
 *
 * Intentionally omitted:
 *  - `noreferrer` — keeping the referrer leaks a small "we link to them"
 *    signal to the destination's analytics, which is harmless and
 *    slightly useful for the relationship.
 *
 * The visible link gets these rel attributes. NewsArticle JSON-LD on
 * the updates feed places source URLs in `isBasedOn`/`citation` instead,
 * which is a machine-readable signal Google reads independently of rel.
 *
 * NEVER write raw external `<a>` tags. Use this component everywhere.
 */
type Props = {
  href: string;
  children: React.ReactNode;
  /** Optional className passed through to the anchor (e.g. "link"). */
  className?: string;
  /** Hide the trailing external-link icon. Default false. */
  hideIcon?: boolean;
};

export function ExternalLink({
  href,
  children,
  className,
  hideIcon = false,
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener"
      className={className}
    >
      {children}
      {!hideIcon && (
        <ExternalLinkIcon
          className="ml-0.5 inline-block h-3 w-3 opacity-70"
          style={{ verticalAlign: "-0.1em" }}
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
    </a>
  );
}
