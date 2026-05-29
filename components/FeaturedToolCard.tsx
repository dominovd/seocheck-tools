import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Tool } from "@/lib/tools-catalog";

type FeaturedToolCardProps = {
  tool: Tool;
};

/**
 * Prominent showcase card for the homepage "Try the tools" grid.
 * TubeRanker-style: large icon centered, tool name in brand color, minimal
 * other chrome. Square-ish aspect ratio, generous padding.
 */
export function FeaturedToolCard({ tool }: FeaturedToolCardProps) {
  const isComingSoon = tool.status === "coming-soon";
  const Icon = tool.Icon;

  const inner = (
    <div
      className={`group relative flex aspect-[5/4] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-8 text-center transition ${
        isComingSoon
          ? "opacity-60"
          : "hover:border-brand-400 hover:shadow-[0_8px_24px_-12px_rgba(16,185,129,0.25)] cursor-pointer"
      }`}
    >
      {tool.isAI && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-0.5 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
          <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
          AI
        </span>
      )}

      {isComingSoon && (
        <span className="absolute top-3 right-3 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          Soon
        </span>
      )}

      <Icon
        className="h-12 w-12 text-gray-700 transition-colors group-hover:text-brand-500"
        strokeWidth={1.25}
        aria-hidden="true"
      />

      <h3 className="mt-5 text-base font-semibold text-brand-700 sm:text-lg">
        {tool.shortTitle}
      </h3>
    </div>
  );

  if (isComingSoon) return inner;

  return (
    <Link href={`/tools/${tool.slug}`} aria-label={tool.title}>
      {inner}
    </Link>
  );
}
