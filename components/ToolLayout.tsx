import { type ReactNode } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Container } from "./Container";
import { JsonLd } from "./JsonLd";
import type { Tool } from "@/lib/tools-catalog";
import { siteConfig } from "@/lib/site-config";
import { softwareApplicationSchema, breadcrumbSchema } from "@/lib/seo";

type ToolLayoutProps = {
  tool: Tool;
  children: ReactNode;
  /** Override the H1 (defaults to tool.title). */
  titleOverride?: string;
  /** Override the hero subtitle (defaults to tool.description). */
  subtitleOverride?: string;
  /**
   * Override the description used in the WebApplication JSON-LD schema only.
   * Display title is unaffected; lets pages match schema description to the
   * page meta description without changing the catalog entry.
   */
  schemaDescriptionOverride?: string;
  /**
   * "centered" (default): icon tile, centered hero, max-w-3xl tool slot.
   * "wide": left-aligned hero with breadcrumbs, H1 with an inline AI tag,
   * a short facts row, and a max-w-6xl tool slot.
   */
  variant?: "centered" | "wide";
  /** Short facts under the subtitle, wide variant only. */
  facts?: ReactNode[];
};

const STAGE_LABEL: Record<Tool["stage"], string> = {
  research: "Research",
  optimize: "Optimize",
  publish: "Publish",
  analyze: "Analyze",
};

/**
 * Common chrome for every tool page: icon tile, H1, description,
 * structured data (SoftwareApplication + BreadcrumbList), and a slot for
 * the tool's actual UI.
 */
export function ToolLayout({
  tool,
  children,
  titleOverride,
  subtitleOverride,
  schemaDescriptionOverride,
  variant = "centered",
  facts = [],
}: ToolLayoutProps) {
  const Icon = tool.Icon;
  const url = `${siteConfig.url}/tools/${tool.slug}`;

  const schemas = [
    softwareApplicationSchema({
      name: tool.title,
      description: schemaDescriptionOverride ?? tool.description,
      url,
    }),
    breadcrumbSchema(
      variant === "wide"
        ? [
            { name: "Home", url: siteConfig.url },
            { name: "Tools", url: `${siteConfig.url}/tools` },
            { name: STAGE_LABEL[tool.stage], url: `${siteConfig.url}/tools/${tool.stage}` },
            { name: tool.shortTitle, url },
          ]
        : [
            { name: "Home", url: siteConfig.url },
            { name: "Tools", url: `${siteConfig.url}/tools` },
            { name: tool.shortTitle, url },
          ]
    ),
  ];

  if (variant === "wide") {
    return (
      <Container as="main" className="py-8 sm:py-10">
        <JsonLd data={schemas} />
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-1.5 text-sm text-gray-500">
            <Link href="/tools" className="hover:text-gray-700">Tools</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/tools/${tool.stage}`} className="hover:text-gray-700">
              {STAGE_LABEL[tool.stage]}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-gray-700" aria-current="page">{tool.shortTitle}</span>
          </nav>
          <header className="mt-4 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl sm:leading-[1.05]">
              {titleOverride ?? tool.title}
              {tool.isAI && (
                <span className="ml-3 inline-flex translate-y-[-0.35em] items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 align-middle text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  <Sparkles className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                  AI
                </span>
              )}
            </h1>
            <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
              {subtitleOverride ?? tool.description}
            </p>
            {facts.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                {facts.map((f, i) => (
                  <li key={i} className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-brand-600" strokeWidth={2.5} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </header>
          <div className="mt-8">{children}</div>
        </div>
      </Container>
    );
  }

  return (
    <Container as="main" className="py-10 sm:py-14">
      <JsonLd data={schemas} />

      <header className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
              tool.isAI
                ? "bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 ring-1 ring-inset ring-brand-200"
                : "bg-brand-50 text-brand-600"
            }`}
            aria-hidden="true"
          >
            <Icon className="h-8 w-8" strokeWidth={2} />
          </div>
        </div>

        {tool.isAI && (
          <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-200">
            <Sparkles className="h-3 w-3" strokeWidth={2.5} />
            AI-powered
          </span>
        )}

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {titleOverride ?? tool.title}
        </h1>
        <p className="mt-3 text-base text-gray-600 sm:text-lg">
          {subtitleOverride ?? tool.description}
        </p>
      </header>

      <div className="mx-auto mt-10 max-w-3xl">{children}</div>
    </Container>
  );
}
