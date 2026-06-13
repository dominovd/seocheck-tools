import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { discoverNew } from "@/lib/sources/discover";
import {
  appendEntries,
  serializeSeen,
  SEEN_SOURCES_PATH,
} from "@/lib/sources/seen-urls";
import type { SeenEntry } from "@/lib/sources/seen-urls";
import { runDraftPipeline } from "@/lib/updates-pipeline";
import { commitFiles } from "@/lib/github";

export const runtime = "nodejs";
// Node runtime (not edge) so the GitHub helper's Buffer import resolves.
export const maxDuration = 300;

/**
 * Auto-discovery cron: every 6h Vercel hits this endpoint. The job:
 *
 *  1. Polls Tier 1 sources (lib/sources/discover.ts).
 *  2. Dedupes new items against committed seen-sources.json.
 *  3. For each fresh item: runs the drafter pipeline.
 *  4. Commits each "drafted" result via GitHub Contents API:
 *      - confidence: high   → content/updates/<slug>.md  (live next deploy)
 *      - confidence: medium → content/updates/_drafts/gpt/<slug>.md
 *      - confidence: low    → no file, marks URL as "rejected" in state
 *  5. Updates content/updates/_state/seen-sources.json with all processed URLs.
 *
 * Vercel sees each commit and rebuilds → new posts appear on /updates
 * without any human intervention. The cron is the only source of
 * automation; the CLI (scripts/draft-update.ts) stays available for
 * one-off manual drafts.
 *
 * Required env:
 *  - CRON_SECRET     — same as existing crons, set by Vercel
 *  - GITHUB_TOKEN    — PAT with repo scope
 *  - GITHUB_REPO     — owner/repo
 *  - GITHUB_BRANCH   — default "main"
 *  - OPENAI_API_KEY  — for drafter
 *  - UPDATES_DRAFTER — optional, "openai" or "anthropic"
 *
 * Schedule (vercel.json): every 6 hours.
 */

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured" },
      { status: 500 },
    );
  }
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  const startedAt = Date.now();
  const log: unknown[] = [];

  try {
    const { state, stateSha, perSource, freshItems } = await discoverNew();

    log.push({ phase: "discovery", perSource, freshCount: freshItems.length });

    if (freshItems.length === 0) {
      return NextResponse.json({
        ok: true,
        elapsedMs: Date.now() - startedAt,
        perSource,
        message: "No new items discovered.",
      });
    }

    // Per-cycle cap. First-run safety: if the seen-state is empty we
    // could otherwise face dozens of fresh items at once. Items beyond
    // the cap are NOT marked as seen, so they get picked up next cycle.
    const PER_CYCLE_LIMIT = 5;
    const toProcess = freshItems.slice(0, PER_CYCLE_LIMIT);
    const deferred = freshItems.length - toProcess.length;

    const newSeenEntries: SeenEntry[] = [];
    const filesToCommit: Array<{ path: string; content: string }> = [];
    let drafted = 0;
    let published = 0;
    let rejected = 0;
    let totalCostUsd = 0;

    // Process items serially. Collect (not commit) drafts and the state
    // update; batch them into ONE Git Data API commit at the end so
    // Vercel sees a single push event and runs one build per cron cycle.
    for (const item of toProcess) {
      try {
        const result = await runDraftPipeline({
          url: item.url,
          sourceName: item.sourceName,
          sourceTier: item.sourceTier,
          publishedDate: item.publishedAt,
        });

        if (result.kind === "rejected") {
          newSeenEntries.push({
            url: item.url,
            discoveredAt: new Date().toISOString(),
            status: "rejected",
          });
          rejected += 1;
          log.push({
            phase: "drafted",
            url: item.url,
            outcome: "rejected",
            reason: result.reason,
          });
          continue;
        }

        filesToCommit.push({ path: result.filePath, content: result.markdown });

        newSeenEntries.push({
          url: item.url,
          discoveredAt: new Date().toISOString(),
          status: result.confidence === "high" ? "published" : "draft",
          slug: result.slug,
        });

        drafted += 1;
        if (result.confidence === "high") published += 1;
        totalCostUsd +=
          estimateCost(result.usage.inputTokens, result.usage.outputTokens, result.model);

        log.push({
          phase: "drafted",
          url: item.url,
          outcome: "queued-for-commit",
          path: result.filePath,
          confidence: result.confidence,
          severity: result.severity,
          category: result.category,
        });
      } catch (itemErr) {
        log.push({
          phase: "drafted",
          url: item.url,
          outcome: "error",
          error: itemErr instanceof Error ? itemErr.message : String(itemErr),
        });
        // Do NOT mark as seen; we'll retry on next cron cycle.
      }
    }

    // Batched commit. ONE git push event regardless of how many files.
    if (newSeenEntries.length > 0) {
      const nextState = appendEntries(state, newSeenEntries);
      filesToCommit.push({
        path: SEEN_SOURCES_PATH,
        content: serializeSeen(nextState),
      });

      const summary = `feat(updates): cron cycle — ${published} published, ${drafted - published} drafts, ${rejected} rejected`;
      const { commitSha } = await commitFiles({
        files: filesToCommit,
        message: summary,
      });
      log.push({ phase: "commit", filesCommitted: filesToCommit.length, commitSha });
    }

    return NextResponse.json({
      ok: true,
      elapsedMs: Date.now() - startedAt,
      perSource,
      fresh: freshItems.length,
      processed: toProcess.length,
      deferredToNextCycle: deferred,
      drafted,
      published,
      rejected,
      totalCostUsd: Number(totalCostUsd.toFixed(4)),
      log,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        elapsedMs: Date.now() - startedAt,
        error: e instanceof Error ? e.message : String(e),
        log,
      },
      { status: 500 },
    );
  }
}

/** Inline cost estimator so the route doesn't import the CLI helper. */
function estimateCost(inTok: number, outTok: number, model: string): number {
  const m = model.toLowerCase();
  if (m.startsWith("gpt-5.5")) return (inTok * 5 + outTok * 30) / 1_000_000;
  if (m.startsWith("gpt-5.4-mini")) return (inTok * 0.75 + outTok * 4.5) / 1_000_000;
  if (m.startsWith("gpt-5.4")) return (inTok * 2.5 + outTok * 15) / 1_000_000;
  if (m.includes("haiku")) return (inTok * 0.8 + outTok * 4) / 1_000_000;
  return 0;
}
