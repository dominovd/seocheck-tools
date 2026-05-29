"use client";

import { useState } from "react";
import { ToolCard } from "@/components/ToolCard";
import {
  type Tool,
  type ToolCategory,
  categoryLabel,
} from "@/lib/tools-catalog";

type Props = {
  toolsByCategory: Record<ToolCategory, Tool[]>;
  categoryOrder: ToolCategory[];
};

const FILTER_LABELS: Record<ToolCategory | "all", string> = {
  all: "All",
  ai: "AI",
  utility: "Utilities",
  downloader: "Downloaders",
  generator: "Generators",
  calculator: "Calculators",
};

/**
 * Interactive client wrapper for the /tools index. Renders category
 * filter chips and the grouped grid. The full grid is server-rendered
 * in the parent and always present in the DOM (hidden via CSS when
 * filtered), so Google indexes every tool regardless of the active
 * filter.
 */
export function ToolsIndexClient({ toolsByCategory, categoryOrder }: Props) {
  const [active, setActive] = useState<ToolCategory | "all">("all");

  const filters: Array<ToolCategory | "all"> = ["all", ...categoryOrder];

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => {
          const isActive = active === f;
          const count =
            f === "all"
              ? Object.values(toolsByCategory).flat().length
              : toolsByCategory[f].length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-brand-200 hover:bg-brand-50/40 hover:text-brand-700"
              }`}
            >
              {FILTER_LABELS[f]}
              <span
                className={`font-mono text-[10px] tabular-nums ${
                  isActive ? "text-brand-500" : "text-gray-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grouped grid — every category always rendered, filtered via display */}
      <div className="mt-10 space-y-14">
        {categoryOrder.map((cat) => {
          const tools = toolsByCategory[cat];
          if (tools.length === 0) return null;
          const visible = active === "all" || active === cat;
          return (
            <section
              key={cat}
              className={visible ? "" : "hidden"}
              aria-hidden={!visible}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                {categoryLabel(cat)}
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
