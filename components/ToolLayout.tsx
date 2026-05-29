import { type ReactNode } from "react";
import { Container } from "./Container";
import type { Tool } from "@/lib/tools-catalog";
import { siteConfig } from "@/lib/site-config";
import { softwareApplicationSchema } from "@/lib/seo";

type ToolLayoutProps = {
  tool: Tool;
  children: ReactNode;
};

/**
 * Common chrome for every tool page: H1, description, structured data,
 * and a slot for the tool's actual UI. Wrap tool pages with this.
 */
export function ToolLayout({ tool, children }: ToolLayoutProps) {
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
        <span className="text-4xl" aria-hidden="true">
          {tool.icon}
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {tool.title}
        </h1>
        <p className="mt-3 text-base text-gray-600 sm:text-lg">{tool.description}</p>
      </header>

      <div className="mx-auto mt-10 max-w-3xl">{children}</div>
    </Container>
  );
}
