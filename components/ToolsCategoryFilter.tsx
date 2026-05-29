"use client";

import { useEffect, useState } from "react";
import type { ToolCategory } from "@/lib/tools-catalog";

type Props = {
  /** Categories in display order. */
  categories: ToolCategory[];
  /** Pre-computed count per category (calculated server-side). */
  counts: Array<{ category: ToolCategory; count: number; label: string }>;
  /** Total tool count for the "All" chip. */
  totalCount: number;
  /** DOM id of the grid container whose <section data-category> children we filter. */
  gridId: string;
};

const ALL_LABEL = "All";

/**
 * Pure-UI client component that owns the active-filter state and toggles
 * section visibility imperatively via the DOM. Crucially: this component
 * receives ONLY primitives (strings, numbers) as props — never tool data
 * with Lucide Icon components, which would fail to serialize across the
 * server/client boundary and break static generation.
 *
 * The grid itself is server-rendered and statically generated; this
 * component just hides/shows sections in response to chip clicks.
 */
export function ToolsCategoryFilter({ categories, counts, totalCount, gridId }: Props) {
  const [active, setActive] = useState<ToolCategory | "all">("all");

  useEffect(() => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const sections = grid.querySelectorAll<HTMLElement>("section[data-category]");
    sections.forEach((section) => {
      const cat = section.getAttribute("data-category");
      const visible = active === "all" || active === cat;
      section.style.display = visible ? "" : "none";
    });
  }, [active, gridId]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip
        label={ALL_LABEL}
        count={totalCount}
        active={active === "all"}
        onClick={() => setActive("all")}
      />
      {counts.map(({ category, count, label }) => (
        <Chip
          key={category}
          label={label}
          count={count}
          active={active === category}
          onClick={() => setActive(category)}
        />
      ))}
    </div>
  );
}

function Chip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-brand-300 bg-brand-50 text-brand-700"
          : "border-gray-200 bg-white text-gray-600 hover:border-brand-200 hover:bg-brand-50/40 hover:text-brand-700"
      }`}
    >
      {label}
      <span
        className={`font-mono text-[10px] tabular-nums ${
          active ? "text-brand-500" : "text-gray-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
