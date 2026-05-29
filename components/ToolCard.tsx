import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Tool } from "@/lib/tools-catalog";

type ToolCardProps = {
  tool: Tool;
};

/**
 * Flat tool card used on the /tools index page.
 *
 * Mictoo-style: text-driven, minimal chrome. Icon sits inline next to the
 * title as a small accent, not as a primary visual element. No gradient
 * tiles. No heavy borders. Hover lifts via subtle border color change.
 */
export function ToolCard({ tool }: ToolCardProps) {
  const isComingSoon = tool.status === "coming-soon";
  const Icon = tool.Icon;

  const inner = (
    <article
      className={`group h-full rounded-lg border border-gray-200 bg-white p-5 transition ${
        isComingSoon
          ? "opacity-70"
          : "hover:border-brand-300 cursor-pointer"
      }`}
    >
      <header className="flex items-center gap-2.5">
        <Icon
          className="h-5 w-5 text-brand-600 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <h3 className="flex-1 text-[15px] font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
          {tool.shortTitle}
        </h3>
        {tool.isAI && (
          <span
            className="inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-600"
            title="AI-powered"
          >
            <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
            AI
          </span>
        )}
        {isComingSoon && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Soon
          </span>
        )}
      </header>

      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
        {tool.description}
      </p>
    </article>
  );

  if (isComingSoon) return inner;

  return (
    <Link href={`/tools/${tool.slug}`} aria-label={tool.title}>
      {inner}
    </Link>
  );
}
