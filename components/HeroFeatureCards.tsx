import { Check, Sparkles, Shield, Zap, type LucideIcon } from "lucide-react";

/**
 * 4-card feature strip rendered under the hero CTAs. Each card has a
 * small brand-tinted icon, bold label, and one-line subtitle. Matches
 * the "100% Free / AI-Powered / Secure & Private / 20 SEO Tools"
 * pattern from the approved homepage mockup.
 */

type Feature = {
  Icon: LucideIcon;
  label: string;
  subtitle: string;
};

const FEATURES: Feature[] = [
  {
    Icon: Check,
    label: "100% Free",
    subtitle: "No signup, no limits",
  },
  {
    Icon: Sparkles,
    label: "AI-Powered",
    subtitle: "Smarter insights",
  },
  {
    Icon: Shield,
    label: "Secure & Private",
    subtitle: "No data collection",
  },
  {
    Icon: Zap,
    label: "20 SEO Tools",
    subtitle: "All in one place",
  },
];

export function HeroFeatureCards() {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {FEATURES.map(({ Icon, label, subtitle }) => (
        <li
          key={label}
          className="flex flex-col items-start gap-2 overflow-hidden rounded-xl border border-gray-200 bg-white px-2.5 py-2.5 shadow-sm shadow-gray-100/60"
        >
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
            <Icon
              className="h-3.5 w-3.5"
              strokeWidth={2.25}
              aria-hidden="true"
            />
          </span>
          <div className="min-w-0 w-full">
            <p className="text-[12px] font-semibold leading-tight text-gray-900">
              {label}
            </p>
            <p className="mt-0.5 text-[11px] leading-tight text-gray-500">
              {subtitle}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
