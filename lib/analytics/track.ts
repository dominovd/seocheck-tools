"use client";

import { track as vercelTrack } from "@vercel/analytics";

/**
 * Wrapper around @vercel/analytics' track() that fails silently if the
 * client SDK isn't ready (e.g. preview environment, blocked by extension).
 * Use this everywhere instead of importing from @vercel/analytics directly
 * so we can later swap providers / add bulk event batching without touching
 * every call site.
 *
 * Conventions for event names (snake_case):
 *  - tool_used               — fired once when a tool produces a result
 *  - tool_result_copied      — fired when the user copies a result to clipboard
 *  - faq_expanded            — fired when a <details> in any FAQ is opened
 *  - external_link_clicked   — fired on outbound link navigation
 *
 * Properties should be lowercase snake_case and use string/number/boolean
 * values only (Vercel Analytics flattens props for display).
 */
export function track(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>
): void {
  try {
    vercelTrack(event, properties);
  } catch {
    // swallow — analytics must never crash the UI
  }
}

export type AnalyticsEvent =
  | "tool_used"
  | "tool_result_copied"
  | "faq_expanded"
  | "external_link_clicked"
  | "newsletter_signup";
