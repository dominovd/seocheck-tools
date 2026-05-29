import Link from "next/link";
import { ClipboardCheck, ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/Container";
import { ToolCard } from "@/components/ToolCard";
import { buildMetadata } from "@/lib/seo";
import {
  toolsByStage,
  allToolsSorted,
  getToolBySlug,
  stageLabel,
  stageTagline,
  STAGE_ORDER,
} from "@/lib/tools-catalog";

export const metadata = buildMetadata({
  title: "All Tools",
  description:
    "All 17 free YouTube SEO tools organized by the creator's workflow — Research, Optimize, Publish, Analyze. No signup required.",
  path: "tools",
});

export default function ToolsIndexPage() {
  const stages = toolsByStage();
  const totalLive = STAGE_ORDER.flatMap((s) => stages[s]).filter(
    (t) => t.status === "live"
  ).length;
  const totalSoon = STAGE_ORDER.flatMap((s) => stages[s]).filter(
    (t) => t.status === "coming-soon"
  ).length;

  const auditTool = getToolBySlug("youtube-video-audit");
  // "Most popular" = top 5 by priority, excluding the audit (already featured above)
  const popular = allToolsSorted()
    .filter((t) => t.status === "live" && t.slug !== "youtube-video-audit")
    .slice(0, 5);

  return (
    <Container as="main" className="py-12 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          All YouTube SEO tools
        </h1>
        <p className="mt-3 text-base text-gray-600">
          {totalLive} live · {totalSoon} coming soon. Organized by the creator&apos;s
          workflow — Research, Optimize, Publish, Analyze.
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

      {/* ───────── Browse by workflow stage ───────── */}
      <section className="mt-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Browse by workflow stage
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Pick the stage you&apos;re at — research, optimize, publish, or
            analyze — to see only the tools that matter for that step.
          </p>
        </div>

        {/* Stage chip nav */}
        <div className="mt-6 flex flex-wrap gap-2">
          {STAGE_ORDER.map((s, i) => (
            <Link
              key={s}
              href={`/tools/${s}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700 transition"
            >
              <span className="font-mono text-[10px] tabular-nums text-gray-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{stageLabel(s)}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500">{stageTagline(s)}</span>
              <ArrowRight className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
            </Link>
          ))}
        </div>

        {/* Stage sections — every stage fully rendered server-side */}
        <div className="mt-12 space-y-14">
          {STAGE_ORDER.map((s) => {
            const tools = stages[s];
            if (tools.length === 0) return null;
            return (
              <section key={s} id={s}>
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <Link
                      href={`/tools/${s}`}
                      className="group inline-flex items-center gap-2"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-700 transition">
                        {stageLabel(s)}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-brand-700 transition" strokeWidth={2} />
                    </Link>
                    <p className="text-xs text-gray-500">{stageTagline(s)}</p>
                  </div>
                  <p className="text-xs font-mono tabular-nums text-gray-400">
                    {tools.length} {tools.length === 1 ? "tool" : "tools"}
                  </p>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </Container>
  );
}
