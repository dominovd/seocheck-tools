"use client";

import { ArrowUp } from "lucide-react";
import { TAG_EXAMPLE_EVENT } from "@/lib/youtube/tag-examples";

/** "Open in generator": switches the widget above to this example, no AI call. */
export function TagExampleButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(TAG_EXAMPLE_EVENT, { detail: id }))}
      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
    >
      Open in generator
      <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}
