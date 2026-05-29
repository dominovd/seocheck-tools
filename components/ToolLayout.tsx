import { type ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Container } from "./Container";
import type { Tool } from "@/lib/tools-catalog";
import { siteConfig } from "@/lib/site-config";
import { softwareApplicationSchema } from "@/lib/seo";

type ToolLayoutProps = {
  tool: Tool;
  children: ReactNode;
};

/**
 * Common chrome for every tool page: icon tile, H1, description,
 * structured data, and a slot for the tool's actual UI. Wrap tool pages with this.
 */
export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const Icon = tool.Icon;
  const schema = softwareApplicationSchema({
    name: tool.title,
    description: tool.description,
    url: `${siteConfig.url}/tools/${tool.slug}`,
  });

  return (
    <Container as="main" className="py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

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
          {tool.title}
        </h1>
        <p className="mt-3 text-base text-gray-600 sm:text-lg">{tool.description}</p>
      </header>

      <div className="mx-auto mt-10 max-w-3xl">{children}</div>
    </Container>
  );
}
