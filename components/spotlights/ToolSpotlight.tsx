import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Check,
} from "lucide-react";
import { type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type FeaturePill = string;
type SubFeature = { Icon: LucideIcon; label: string };
type SecondaryCta = { label: string; href: string; Icon?: LucideIcon };

type ToolSpotlightProps = {
  /** Lucide icon for the eyebrow chip */
  Icon: LucideIcon;
  /** Short eyebrow text, e.g. "Keyword research" */
  eyebrow: string;
  /** Section H2 */
  title: string;
  /** Lead paragraph under the heading */
  description: string;
  /** Primary CTA href */
  href: string;
  /** Primary CTA label */
  ctaLabel: string;
  /** AI badge (Sparkles in eyebrow) */
  isAI?: boolean;
  /** Flip side: copy on right, mock/image on left */
  reverse?: boolean;
  /** Mock UI element (legacy mode if imageSrc not provided) */
  mock?: ReactNode;
  /** Image src for the visual (preferred over mock when provided) */
  imageSrc?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Optional 2x2 feature pills grid */
  featurePills?: FeaturePill[];
  /** Optional single-card N-column feature row (icon above label) */
  featureRow?: FeaturePill[];
  /** Optional row of sub-features under the CTAs */
  subFeatures?: SubFeature[];
  /** Optional secondary CTA (e.g. "View example") */
  secondaryCta?: SecondaryCta;
  /** Legacy proof-of-output line; ignored when featurePills passed */
  proof?: string;
  /** Optional decorative "01" / "02" number rendered as small badge */
  number?: number;
};

/**
 * Two-column tool spotlight. Left (or right when `reverse`): heading,
 * description, optional feature pills, primary + secondary CTAs, optional
 * sub-feature row. Right (or left): product visual (image or mock).
 *
 * Layout pattern from the approved mockup. Backward compatible with the
 * older mock + proof style — both legacy props are still honored when
 * the new ones are not provided.
 */
export function ToolSpotlight({
  Icon,
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  isAI = false,
  reverse = false,
  mock,
  imageSrc,
  imageAlt,
  featurePills,
  featureRow,
  subFeatures,
  secondaryCta,
  proof,
  number,
}: ToolSpotlightProps) {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-14">
        {/* Copy column */}
        <div className={`relative ${reverse ? "lg:order-2" : ""}`}>
          {/* Decorative number badge */}
          {typeof number === "number" && (
            <p
              className="mb-4 font-mono text-5xl font-semibold tracking-tight text-gray-200 leading-none sm:text-6xl"
              aria-hidden="true"
            >
              {String(number).padStart(2, "0")}
            </p>
          )}

          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 ring-1 ring-inset ring-brand-100">
            <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
            {eyebrow}
            {isAI && (
              <Sparkles
                className="h-3 w-3"
                strokeWidth={2.5}
                aria-label="AI-powered"
              />
            )}
          </div>

          {/* H2 */}
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.5rem] leading-[1.1]">
            {title}
          </h2>

          {/* Description */}
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            {description}
          </p>

          {/* Feature pills 2x2 (preferred) */}
          {featurePills && featurePills.length > 0 && (
            <ul className="mt-6 grid grid-cols-2 gap-2.5">
              {featurePills.map((label) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5"
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                    <Check
                      className="h-3 w-3"
                      strokeWidth={2.75}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Feature row (single card, N columns, icon above label) */}
          {featureRow && featureRow.length > 0 && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-4 py-5 shadow-sm shadow-gray-100/60">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {featureRow.map((label) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 px-2 text-center"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                      <Check
                        className="h-3.5 w-3.5"
                        strokeWidth={2.75}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-[13px] font-medium leading-tight text-gray-800">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legacy proof line (fallback) */}
          {!featurePills && !featureRow && proof && (
            <p className="mt-5 inline-flex items-start gap-1.5 rounded-md bg-brand-50/60 px-3 py-2 text-sm font-medium text-brand-900 ring-1 ring-brand-100">
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                strokeWidth={2.25}
                aria-hidden="true"
              />
              <span>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                  What you&apos;ll see:
                </span>{" "}
                {proof}
              </span>
            </p>
          )}

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={href}
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-600 transition"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-6 py-3 text-base font-medium text-gray-800 hover:border-brand-300 hover:text-brand-700 transition"
              >
                {secondaryCta.Icon && (
                  <secondaryCta.Icon
                    className="h-4 w-4"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
                {secondaryCta.label}
              </Link>
            )}
          </div>

          {/* Sub-features row */}
          {subFeatures && subFeatures.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {subFeatures.map(({ Icon: SubIcon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                    <SubIcon
                      className="h-3.5 w-3.5"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-sm text-gray-700">{label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Visual column (image preferred over mock) */}
        <div
          className={`${reverse ? "lg:order-1" : ""} ${
            imageSrc && typeof number === "number" ? "lg:mt-32" : ""
          }`}
        >
          {imageSrc ? (
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-gray-200/50">
              <Image
                src={imageSrc}
                alt={imageAlt ?? ""}
                width={1600}
                height={1100}
                className="h-auto w-full"
              />
            </div>
          ) : (
            mock
          )}
        </div>
      </div>
    </section>
  );
}
