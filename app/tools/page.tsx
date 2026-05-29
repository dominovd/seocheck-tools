import { Container } from "@/components/Container";
import { ToolCard } from "@/components/ToolCard";
import { buildMetadata } from "@/lib/seo";
import { toolsByCategory, categoryLabel, type ToolCategory } from "@/lib/tools-catalog";

export const metadata = buildMetadata({
  title: "All Tools",
  description:
    "All 13 free YouTube SEO tools — AI generators, downloaders, calculators, and utilities. No signup required.",
  path: "tools",
});

const CATEGORY_ORDER: ToolCategory[] = [
  "ai",
  "utility",
  "downloader",
  "generator",
  "calculator",
];

export default function ToolsIndexPage() {
  const groups = toolsByCategory();
  const totalLive = Object.values(groups)
    .flat()
    .filter((t) => t.status === "live").length;
  const totalSoon = Object.values(groups)
    .flat()
    .filter((t) => t.status === "coming-soon").length;

  return (
    <Container as="main" className="py-12 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          All YouTube SEO tools
        </h1>
        <p className="mt-3 text-base text-gray-600">
          {totalLive} live · {totalSoon} coming soon. Grouped by what they do.
        </p>
      </header>

      <div className="mt-12 space-y-14">
        {CATEGORY_ORDER.map((cat) => {
          const tools = groups[cat];
          if (tools.length === 0) return null;
          return (
            <section key={cat}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                {categoryLabel(cat)}
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Container>
  );
}
