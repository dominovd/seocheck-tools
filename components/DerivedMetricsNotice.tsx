import { Info } from "lucide-react";

/**
 * Disclaimer required by the YouTube API Services Developer Policies
 * (policy III.E.4h), as directed in the compliance review of
 * 2026-08-11.
 *
 * The reviewer asked for the following statement to appear wherever we
 * surface an assessment we produced ourselves:
 *
 *   "these metrics are not related to YouTube and have been derived by
 *    the API client"
 *
 * We render that sentence verbatim and name the client so end users
 * know who produced the assessment.
 *
 * Place this on every surface that shows an editorial band, verdict,
 * priority label, recommendation, or any other judgement of ours. It is
 * not needed next to values returned directly by the YouTube Data API,
 * but showing it once per result set is the safer default.
 *
 * Variants:
 *   block  — standalone card, use once per result set near the top
 *   inline — compact line, use under an individual derived section
 */

const DISCLAIMER =
  "These metrics are not related to YouTube and have been derived by the API client (SEO Check Tools).";

export function DerivedMetricsNotice({
  variant = "block",
  className = "",
}: {
  variant?: "block" | "inline";
  className?: string;
}) {
  if (variant === "inline") {
    return (
      <p
        className={`mt-2 text-[11px] leading-snug text-gray-500 ${className}`}
        data-derived-metrics-disclaimer=""
      >
        {DISCLAIMER}
      </p>
    );
  }

  return (
    <div
      className={`flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 ${className}`}
      data-derived-metrics-disclaimer=""
    >
      <Info
        className="mt-0.5 h-4 w-4 shrink-0 text-gray-500"
        strokeWidth={2}
        aria-hidden="true"
      />
      <p className="text-xs leading-relaxed text-gray-600">{DISCLAIMER}</p>
    </div>
  );
}

export { DISCLAIMER as DERIVED_METRICS_DISCLAIMER };
