import Link from "next/link";
import type { Tool } from "@/lib/tools-catalog";

type ToolCardProps = {
  tool: Tool;
};

export function ToolCard({ tool }: ToolCardProps) {
  const isComingSoon = tool.status === "coming-soon";

  const card = (
    <div
      className={`group relative flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition ${
        isComingSoon
          ? "opacity-70"
          : "hover:border-brand-300 hover:shadow-md cursor-pointer"
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl" aria-hidden="true">
          {tool.icon}
        </span>
        {tool.isAI && (
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
            AI
          </span>
        )}
        {isComingSoon && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            Soon
          </span>
        )}
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
