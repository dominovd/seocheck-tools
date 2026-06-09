import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type ToolSpotlightProps = {
  /** Lucide icon for the section heading area */
  Icon: LucideIcon;
  /** Short eyebrow text shown above the heading, e.g. "AI Generator" */
  eyebrow: string;
  /** Section H2 */
  title: string;
  /** Lead paragraph under the heading */
  description: string;
  /** CTA href (link to the tool's page) */
  href: string;
  /** CTA label, e.g. "Try the title generator" */
  ctaLabel: string;
  /** Whether this is an AI tool (shows Sparkles in eyebrow) */
  isAI?: boolean;
  /** Render the mock UI on the right of copy (default). Flip to true to put it on the left. */
  reverse?: boolean;
  /** The mock UI element (a component like MockTitleGenerator) */
  mock: ReactNode;
  /**
   * Optional concrete proof-of-output line, e.g. "Title score: 62 → 88".
   * Rendered between the description and the CTA with a check-icon. Use to
   * give creators a tangible idea of what the tool actually outputs.
   */
  proof?: string;
};

/**
 * Two-column "show, don't tell" section for a single tool.
 * Left (or right when `reverse`): heading + description + CTA.
 * Other side: a mock UI render showing what the tool actually does.
 *
 * Inspired by TubeRanker's per-tool homepage spotlight pattern, but in
 * our clean minimal aesthetic (no cartoon illustrations, just a stylized
 * product mock that looks like the real tool's output).
 */
export function ToolSpotlight({
  Icon,
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  isAI = false,
  reverse = false,
  mock,
  proof,
}: ToolSpotlightProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Copy */}
        <div className={reverse ? "lg:order-2" : ""}>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-inset ring-brand-100">
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            {eyebrow}
            {isAI && (
              <Sparkles className="h-3 w-3" strokeWidth={2.5} aria-label="AI-powered" />
            )}
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            {description}
          </p>
          {proof && (
            <p className="mt-5 inline-flex items-start gap-1.5 rounded-md bg-brand-50/60 px-3 py-2 text-sm font-medium text-brand-900 ring-1 ring-brand-100">
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                strokeWidth={2.25}
                aria-hidden="true"
              />
              <span>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                  What you&apos;ll see:
                </span>{" "}
                {proof}
              </span>
            </p>
          )}
          <Link
            href={href}
            className="mt-8 inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        {/* Mock UI */}
        <div className={reverse ? "lg:order-1" : ""}>{mock}</div>
      </div>
    </section>
  );
}
