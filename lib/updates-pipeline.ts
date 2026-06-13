import { createDrafter } from "@/lib/llm";
import type { Provider } from "@/lib/llm";
import { liveTools } from "@/lib/tools-catalog";

/**
 * Core drafter pipeline. Reusable across:
 *  - CLI (scripts/draft-update.ts) — writes to filesystem
 *  - Cron (app/api/cron/scan-update-sources/route.ts) — commits via GitHub API
 *
 * Inputs come from either flow as a source URL + meta. The pipeline:
 *  1. Fetches and strips the source page to plain text.
 *  2. Calls the drafter via lib/llm (OpenAI or Anthropic).
 *  3. Rejects on factualConfidence "low".
 *  4. Post-processes em/en dashes (defense in depth on the prompt).
 *  5. Filters relatedTools against the live catalog.
 *  6. Picks the effective date (explicit > model > today UTC).
 *  7. Builds the markdown file (frontmatter + body).
 *  8. Returns the file path and contents. Side effects are caller's job.
 */

export type PipelineInput = {
  url: string;
  sourceName: string;
  sourceTier: 1 | 2 | 3;
  /** Optional override for the published date. */
  publishedDate?: string;
  /** Provider override. Defaults to UPDATES_DRAFTER env then "anthropic". */
  provider?: Provider;
};

export type PipelineRejected = {
  kind: "rejected";
  reason: string;
  notesForReviewer: string;
  model: string;
  usage: { inputTokens: number; outputTokens: number };
};

export type PipelineDrafted = {
  kind: "drafted";
  confidence: "high" | "medium";
  severity: "major" | "minor" | "info";
  category: "algorithm" | "monetization" | "shorts" | "api" | "policy";
  slug: string;
  /** Path relative to repo root, e.g. "content/updates/<slug>.md" or "content/updates/_drafts/gpt/<slug>.md". */
  filePath: string;
  /** Markdown content to write. */
  markdown: string;
  relatedTools: string[];
  notesForReviewer: string;
  dashesReplaced: number;
  model: string;
  usage: { inputTokens: number; outputTokens: number };
};

export type PipelineResult = PipelineRejected | PipelineDrafted;

export async function runDraftPipeline(
  input: PipelineInput,
): Promise<PipelineResult> {
  const contentText = await fetchSourceText(input.url);

  const drafter = createDrafter({ provider: input.provider });
  const result = await drafter.draft({
    source: {
      name: input.sourceName,
      url: input.url,
      publishedDate: input.publishedDate,
      contentText,
    },
  });

  if (result.draft.factualConfidence === "low") {
    return {
      kind: "rejected",
      reason: "Model returned factualConfidence=low",
      notesForReviewer: result.draft.notesForReviewer,
      model: result.model,
      usage: result.usage,
    };
  }

  // Defense in depth: post-process em/en dashes.
  const titleSweep = sweepDashes(result.draft.title);
  const summarySweep = sweepDashes(result.draft.summary);
  const bodySweeps = result.draft.body.map(sweepDashes);
  const whatThisMeansSweep = sweepDashes(result.draft.whatThisMeansForCreators);
  const dashesReplaced =
    titleSweep.replaced +
    summarySweep.replaced +
    whatThisMeansSweep.replaced +
    bodySweeps.reduce((acc, b) => acc + b.replaced, 0);

  // Filter relatedTools against the catalog.
  const proposed = Array.isArray(result.draft.relatedTools)
    ? result.draft.relatedTools
    : [];
  const validSlugs = new Set(liveTools().map((t) => t.slug));
  const relatedTools = proposed.filter((s) => validSlugs.has(s));

  // Pick effective date: explicit flag > model effectiveDate > today UTC.
  const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
  let date = input.publishedDate;
  if (!date && ISO_DATE.test(result.draft.effectiveDate)) {
    date = result.draft.effectiveDate;
  }
  if (!date) date = new Date().toISOString().slice(0, 10);

  const slug = slugify(titleSweep.text, date);

  const markdown = buildMarkdown({
    title: titleSweep.text,
    date,
    severity: result.draft.proposedSeverity,
    category: result.draft.proposedCategory,
    summary: summarySweep.text,
    whatThisMeans: whatThisMeansSweep.text,
    sourceName: input.sourceName,
    sourceUrl: input.url,
    sourceTier: input.sourceTier,
    relatedTools,
    body: bodySweeps.map((b) => b.text),
  });

  // Routing by confidence: high → publish dir; medium → drafts dir.
  const filePath =
    result.draft.factualConfidence === "high"
      ? `content/updates/${slug}.md`
      : `content/updates/_drafts/gpt/${slug}.md`;

  return {
    kind: "drafted",
    confidence: result.draft.factualConfidence as "high" | "medium",
    severity: result.draft.proposedSeverity,
    category: result.draft.proposedCategory,
    slug,
    filePath,
    markdown,
    relatedTools,
    notesForReviewer: result.draft.notesForReviewer,
    dashesReplaced,
    model: result.model,
    usage: result.usage,
  };
}

// ---- helpers ----

async function fetchSourceText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; seocheck-tools-drafter/0.1; +https://seocheck.tools)",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch source (${res.status} ${res.statusText})`);
  }
  const html = await res.text();
  return stripHtml(html);
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);
}

function sweepDashes(s: string): { text: string; replaced: number } {
  let replaced = 0;
  const out = s.replace(/[—–]/g, () => {
    replaced += 1;
    return ", ";
  });
  return { text: out, replaced };
}

function slugify(title: string, date?: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!date) return base;
  const [y, m] = date.split("-");
  return `${y}-${m}-${base}`;
}

type FrontmatterInput = {
  title: string;
  date: string;
  severity: "major" | "minor" | "info";
  category: "algorithm" | "monetization" | "shorts" | "api" | "policy";
  summary: string;
  whatThisMeans: string;
  sourceName: string;
  sourceUrl: string;
  sourceTier: 1 | 2 | 3;
  relatedTools: string[];
  body: string[];
};

function buildMarkdown(fm: FrontmatterInput): string {
  const y = (s: string) => JSON.stringify(s);
  const relatedYaml =
    fm.relatedTools.length === 0
      ? "relatedTools: []"
      : `relatedTools:\n${fm.relatedTools.map((s) => `  - ${s}`).join("\n")}`;
  return `---
title: ${y(fm.title)}
date: ${y(fm.date)}
severity: ${fm.severity}
category: ${fm.category}
summary: ${y(fm.summary)}
whatThisMeans: ${y(fm.whatThisMeans)}
source:
  name: ${y(fm.sourceName)}
  url: ${y(fm.sourceUrl)}
  tier: ${fm.sourceTier}
${relatedYaml}
---

${fm.body.join("\n\n")}
`;
}
