import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Tool } from "@/lib/tools-catalog";

type TaskChipProps = {
  tool: Tool;
};

/**
 * Compact, text-driven chip used in the homepage "What do you need?" section.
 * Lower visual weight than ToolCard — just icon + label, no description.
 */
export function TaskChip({ tool }: TaskChipProps) {
  const Icon = tool.Icon;
  const isComingSoon = tool.status === "coming-soon";

  const inner = (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition ${
        isComingSoon
          ? "opacity-60 cursor-not-allowed"
          : "hover:border-brand-300 hover:bg-brand-50/40 hover:text-gray-900"
      }`}
    >
      <Icon
        className="h-4 w-4 text-gray-500 group-hover:text-brand-600 transition-colors"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <span>{tool.taskLabel}</span>
      {tool.isAI && (
        <Sparkles
          className="h-3 w-3 text-brand-500"
          strokeWidth={2.5}
          aria-label="AI-powered"
        />
      )}
    </span>
  );

  if (isComingSoon) return inner;

  return (
    <Link href={`/tools/${tool.slug}`} className="group">
      {inner}
    </Link>
  );
}
