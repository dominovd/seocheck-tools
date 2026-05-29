import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "./Container";
import { ToolCard } from "./ToolCard";
import {
  toolsByStage,
  stageLabel,
  stageTagline,
  stageDescription,
  STAGE_ORDER,
  type ToolStage,
} from "@/lib/tools-catalog";

/**
 * Hub page for one workflow stage (/tools/{stage}). Renders:
 *  - hero with stage label + description
 *  - grid of every tool in this stage
 *  - "Other stages" footer linking to the other 3 hubs (internal-linking
 *    play that distributes link equity across the workflow taxonomy)
 *
 * Used by `app/tools/{research,optimize,publish,analyze}/page.tsx` —
 * the route files are thin wrappers around this component.
 */
export function StageHub({ stage }: { stage: ToolStage }) {
  const groups = toolsByStage();
  const tools = groups[stage];
  const otherStages = STAGE_ORDER.filter((s) => s !== stage);

  return (
    <Container as="main" className="py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
          Stage {STAGE_ORDER.indexOf(stage) + 1} of 4 · {stageLabel(stage)}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {stageLabel(stage)} — {stageTagline(stage).toLowerCase()}
        </h1>
        <p className="mt-3 text-base text-gray-700 leading-relaxed sm:text-lg">
          {stageDescription(stage)}
        </p>
      </header>

      <div className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {tools.length} {tools.length === 1 ? "tool" : "tools"} in this stage
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>

      <section className="mt-16 border-t border-gray-100 pt-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Other stages in the workflow
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {otherStages.map((s) => (
            <li key={s}>
              <Link
                href={`/tools/${s}`}
                className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-brand-300 hover:bg-brand-50/30"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 group-hover:bg-brand-50 group-hover:text-brand-700 group-hover:ring-brand-200">
                  {STAGE_ORDER.indexOf(s) + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{stageLabel(s)}</p>
                  <p className="mt-0.5 text-xs text-gray-600">{stageTagline(s)}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gray-400 group-hover:text-brand-700" strokeWidth={2} />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-brand-300 hover:bg-brand-50/40 hover:text-gray-900 transition"
          >
            View all 16 tools
            <ArrowRight className="h-4 w-4 text-gray-400" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </Container>
  );
}
