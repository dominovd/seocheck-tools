/* eslint-disable no-console */
/**
 * CLI: draft an /updates post from a source URL.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... \
 *   npm run draft-update -- \
 *     --url=https://blog.youtube/news-and-events/some-article \
 *     --source="YouTube Creators Blog" \
 *     --date=2026-06-11
 *
 * Flags:
 *   --url           (required) source URL to fetch
 *   --source        (required) human-readable source name, e.g. "YouTube Creators Blog"
 *   --date          (optional) ISO published date (YYYY-MM-DD)
 *   --tier          (optional, default 1) 1 | 2 | 3 per source policy
 *   --provider      (optional, default openai for this CLI) openai | anthropic
 *
 * Output:
 *   content/updates/<slug>.md           (factualConfidence: high → auto-publish)
 *   content/updates/_drafts/gpt/<slug>.md  (medium → review queue)
 *   nothing (low → reject)
 *
 * The CLI is a thin wrapper around lib/updates-pipeline.ts so the same
 * logic runs from the auto-discovery cron without duplicating code.
 */

import fs from "node:fs";
import path from "node:path";
import { runDraftPipeline } from "@/lib/updates-pipeline";
import { estimateCostUSD } from "@/lib/llm/types";
import type { Provider } from "@/lib/llm";

type Args = {
  url: string;
  sourceName: string;
  publishedDate?: string;
  tier: 1 | 2 | 3;
  provider: Provider;
};

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (key: string): string | undefined => {
    const prefix = `--${key}=`;
    for (const a of argv) if (a.startsWith(prefix)) return a.slice(prefix.length);
    const i = argv.indexOf(`--${key}`);
    if (i >= 0 && i + 1 < argv.length) return argv[i + 1];
    return undefined;
  };

  const url = get("url");
  const sourceName = get("source");
  if (!url || !sourceName) {
    console.error(
      "Usage: npm run draft-update -- --url=<url> --source=<name> [--date=YYYY-MM-DD] [--tier=1|2|3] [--provider=openai|anthropic]",
    );
    process.exit(1);
  }

  const tierStr = get("tier") ?? "1";
  const tier = Number(tierStr) as 1 | 2 | 3;
  if (![1, 2, 3].includes(tier)) {
    console.error(`--tier must be 1, 2, or 3 (got "${tierStr}")`);
    process.exit(1);
  }

  const dateRaw = get("date");
  if (dateRaw !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) {
    console.error(
      `--date must be YYYY-MM-DD format with real digits (got "${dateRaw}"). Did you forget to replace the placeholder?`,
    );
    process.exit(1);
  }

  const provider = (get("provider") ?? "openai") as Provider;
  if (provider !== "openai" && provider !== "anthropic") {
    console.error(`--provider must be openai or anthropic`);
    process.exit(1);
  }

  return { url, sourceName, publishedDate: dateRaw, tier, provider };
}

async function main() {
  const args = parseArgs();
  console.log(`> Source: ${args.url}`);
  console.log(`> Drafting via provider="${args.provider}"`);

  const result = await runDraftPipeline({
    url: args.url,
    sourceName: args.sourceName,
    sourceTier: args.tier,
    publishedDate: args.publishedDate,
    provider: args.provider,
  });

  if (result.kind === "rejected") {
    console.error(`> Rejected: ${result.reason}`);
    if (result.notesForReviewer) {
      console.error(`  notesForReviewer: ${result.notesForReviewer}`);
    }
    console.error(`> Model: ${result.model} | tokens: ${result.usage.inputTokens}/${result.usage.outputTokens}`);
    process.exit(2);
  }

  if (result.dashesReplaced > 0) {
    console.warn(
      `> Post-process: replaced ${result.dashesReplaced} em/en dash(es). Review the draft.`,
    );
  }

  // Side effect: write to local filesystem (cron uses GitHub API instead).
  const outPath = path.join(process.cwd(), result.filePath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, result.markdown, "utf8");

  const costUSD = estimateCostUSD(result.usage, result.model);
  const isPublished = result.confidence === "high";
  console.log(``);
  console.log(
    `> ${isPublished ? "PUBLISHED" : "Draft (review needed)"}: ${result.filePath}`,
  );
  console.log(
    `> Model: ${result.model} | tokens in: ${result.usage.inputTokens} | out: ${result.usage.outputTokens} | est. cost: $${costUSD.toFixed(4)}`,
  );
  console.log(
    `> Severity: ${result.severity} | Category: ${result.category} | Confidence: ${result.confidence}`,
  );
  console.log(`> Related tools: ${result.relatedTools.join(", ") || "(none)"}`);
  if (result.notesForReviewer) {
    console.log(`> Reviewer notes: ${result.notesForReviewer}`);
  }
  if (!isPublished) {
    console.log(``);
    console.log(
      `> Confidence is "${result.confidence}". Review and move from _drafts/gpt/ to content/updates/ to publish.`,
    );
  }
}

main().catch((e) => {
  console.error(`\n[draft-update] ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
