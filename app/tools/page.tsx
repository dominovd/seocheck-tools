import Link from "next/link";
import { ClipboardCheck, ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/Container";
import { ToolCard } from "@/components/ToolCard";
import { ToolsCategoryFilter } from "@/components/ToolsCategoryFilter";
import { buildMetadata } from "@/lib/seo";
import {
  toolsByCategory,
  allToolsSorted,
  getToolBySlug,
  categoryLabel,
  type ToolCategory,
} from "@/lib/tools-catalog";

export const metadata = buildMetadata({
  title: "All Tools",
  description:
    "All 16 free YouTube SEO tools — AI generators, downloaders, calculators, plus the new Competitor Analyzer and Video Audit. No signup required.",
  path: "tools",
});

const CATEGORY_ORDER: ToolCategory[] = [
  "ai",
  "utility",
  "downloader",
  "generator",
  "calculator",
];

const GRID_ID = "tools-category-grid";

export default function ToolsIndexPage() {
  const groups = toolsByCategory();
  const totalLive = Object.values(groups)
    .flat()
    .filter((t) => t.status === "live").length;
  const totalSoon = Object.values(groups)
    .flat()
    .filter((t) => t.status === "coming-soon").length;

  const auditTool = getToolBySlug("youtube-video-audit");
  // "Most popular" = top 5 by priority, excluding the audit (already featured above)
  const popular = allToolsSorted()
    .filter((t) => t.status === "live" && t.slug !== "youtube-video-audit")
    .slice(0, 5);

  // Counts and labels are primitives — safe to pass to the client filter component
  const counts = CATEGORY_ORDER.map((category) => ({
    category,
    count: groups[category].length,
    label: categoryLabel(category),
  })).filter((c) => c.count > 0);
  const totalCount = counts.reduce((sum, c) => sum + c.count, 0);

  return (
    <Container as="main" className="py-12 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          All YouTube SEO tools
        </h1>
        <p className="mt-3 text-base text-gray-600">
          {totalLive} live · {totalSoon} coming soon. Pick a single tool or
          start with a full video audit.
        </p>
      </header>

      {/* ───────── Start here callout ───────── */}
      {auditTool && (
        <Link
          href={`/tools/${auditTool.slug}`}
          className="group mt-10 flex flex-col gap-3 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/70 via-brand-50/30 to-white p-5 transition hover:border-brand-300 hover:shadow-sm sm:flex-row sm:items-center sm:gap-5 sm:p-6"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
            <ClipboardCheck className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Start here
            </p>
            <h2 className="mt-1 text-lg font-semibold text-gray-900 sm:text-xl">
              Not sure which tool you need? Run a video audit.
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Paste any YouTube URL — get a 0-100 score for every dimension
              with a direct CTA to the right fix-it tool for each weakness.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-brand-700 ring-1 ring-brand-200 transition group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
            Try the audit
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
        </Link>
      )}

      {/* ───────── Most popular ───────── */}
      {popular.length > 0 && (
        <section className="mt-14">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-500" strokeWidth={2} />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Most popular
            </h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* ───────── Browse by category — server-rendered grid + client filter ───────── */}
      <div className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Browse by category
        </h2>

        <div className="mt-5">
          <ToolsCategoryFilter
            categories={CATEGORY_ORDER}
            counts={counts}
            totalCount={totalCount}
            gridId={GRID_ID}
          />
        </div>

        <div id={GRID_ID} className="mt-10 space-y-14">
          {CATEGORY_ORDER.map((cat) => {
            const tools = groups[cat];
            if (tools.length === 0) return null;
            return (
              <section key={cat} data-category={cat}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  {categoryLabel(cat)}
                </h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
