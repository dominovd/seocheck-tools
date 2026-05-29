import Link from "next/link";
import { BookOpen } from "lucide-react";
import { TOOL_CONTENT } from "@/lib/tool-content";
import { getGuideBySlug } from "@/lib/guides-catalog";

type Props = { slug: string };

/**
 * Renders the per-tool indexable content block: How to use, SEO tips, and
 * a Related guide callout. Reads from lib/tool-content.ts — to update copy
 * for a tool, edit the catalog entry, not this component.
 */
export function ToolContentSections({ slug }: Props) {
  const content = TOOL_CONTENT[slug];
  if (!content) return null;

  const guide = getGuideBySlug(content.relatedGuideSlug);

  return (
    <section className="border-t border-gray-100 bg-white py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* How to use */}
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          How to use this tool
        </h2>
        <ol className="mt-6 space-y-5">
          {content.howToSteps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-brand-200">
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* SEO tips */}
        <h2 className="mt-14 text-2xl font-semibold tracking-tight text-gray-900">
          YouTube SEO tips
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Field-tested principles for getting more out of this part of the
          workflow.
        </p>
        <ul className="mt-5 space-y-3 text-sm text-gray-700 leading-relaxed">
          {content.seoTips.map((tip, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                aria-hidden="true"
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        {/* Related guide */}
        {guide && (
          <Link
            href={`/guides/${guide.slug}`}
            className="mt-14 group flex items-start gap-4 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/70 to-white p-5 transition hover:border-brand-300 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
              <BookOpen className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Read the related guide
              </p>
              <h3 className="mt-1 text-base font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
                {guide.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                {content.relatedGuideBlurb}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {guide.readingTimeMinutes} min read
              </p>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
