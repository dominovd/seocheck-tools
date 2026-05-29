import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Tool } from "@/lib/tools-catalog";

type ToolCardProps = {
  tool: Tool;
};

export function ToolCard({ tool }: ToolCardProps) {
  const isComingSoon = tool.status === "coming-soon";
  const Icon = tool.Icon;

  const card = (
    <div
      className={`group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition ${
        isComingSoon
          ? "opacity-70"
          : "hover:border-brand-300 hover:shadow-md cursor-pointer"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Icon tile — gradient for AI tools, solid tint for others */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
            tool.isAI
              ? "bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 ring-1 ring-inset ring-brand-200"
              : "bg-brand-50 text-brand-600"
          }`}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>

        <div className="flex items-center gap-1.5">
          {tool.isAI && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-200">
              <Sparkles className="h-3 w-3" strokeWidth={2.5} />
              AI
            </span>
          )}
          {isComingSoon && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
              Soon
            </span>
          )}
        </div>
      </div>

      <h3 className="mt-4 text-base font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
        {tool.shortTitle}
      </h3>

      <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">
        {tool.description}
      </p>
    </div>
  );

  if (isComingSoon) return card;

  return (
    <Link href={`/tools/${tool.slug}`} aria-label={tool.title}>
      {card}
    </Link>
  );
}
