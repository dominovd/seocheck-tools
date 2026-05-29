"use client";

import { useRef, type ReactNode } from "react";
import { track } from "@/lib/analytics/track";

type Props = {
  /** The question text (used as the analytics `question` property) */
  question: string;
  /** Page identifier — homepage, tool slug, guide slug, etc. */
  location: string;
  /** The rendered children (question text + answer body) */
  children: ReactNode;
  className?: string;
};

/**
 * Drop-in replacement for `<details>` that fires `faq_expanded` the first
 * time it's opened on a given page mount. Multiple opens of the same
 * question only count once per session — we care about which FAQs draw
 * attention, not how many times someone toggles.
 */
export function TrackedDetails({ question, location, children, className }: Props) {
  const firedRef = useRef(false);

  function onToggle(e: React.SyntheticEvent<HTMLDetailsElement>) {
    if (firedRef.current) return;
    if (e.currentTarget.open) {
      firedRef.current = true;
      track("faq_expanded", { question, location });
    }
  }

  return (
    <details className={className} onToggle={onToggle}>
      {children}
    </details>
  );
}
