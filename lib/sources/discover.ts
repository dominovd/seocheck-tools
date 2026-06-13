import type { DiscoveredItem, SourcePoller } from "./types";
import { youtubeBlogSource } from "./youtube-blog";
import { searchCentralSource } from "./search-central";
import { apiReleaseNotesSource } from "./api-release-notes";
import { isSeen, readSeen } from "./seen-urls";
import type { SeenState } from "./seen-urls";

/**
 * Discovery orchestrator. Polls all registered Tier 1 sources, dedupes
 * against the committed seen-sources.json state, and returns a list of
 * fresh items for the drafter pipeline.
 *
 * Sources are polled in parallel. Source failures are isolated: if one
 * source is down (e.g. YouTube changed their feed URL), the rest still
 * produce items. Errors are surfaced in the return value so the cron
 * route can include them in its response/log.
 */

const REGISTRY: SourcePoller[] = [
  youtubeBlogSource,
  searchCentralSource,
  apiReleaseNotesSource,
  // Add Help Center + Creator Insider sources here when their poller
  // modules are written. Until then they are simply absent from polling.
];

export type SourceRunResult = {
  source: string;
  ok: boolean;
  count: number;
  error?: string;
};

export type DiscoveryResult = {
  state: SeenState;
  stateSha?: string;
  perSource: SourceRunResult[];
  freshItems: DiscoveredItem[];
};

export async function discoverNew(): Promise<DiscoveryResult> {
  const { state, sha: stateSha } = await readSeen();

  const polls = await Promise.allSettled(
    REGISTRY.map(async (s) => {
      const items = await s.fetchRecent();
      return { source: s, items };
    }),
  );

  const perSource: SourceRunResult[] = [];
  const allItems: DiscoveredItem[] = [];

  for (let i = 0; i < polls.length; i++) {
    const result = polls[i];
    const source = REGISTRY[i];
    if (result.status === "fulfilled") {
      const { items } = result.value;
      perSource.push({ source: source.name, ok: true, count: items.length });
      allItems.push(...items);
    } else {
      perSource.push({
        source: source.name,
        ok: false,
        count: 0,
        error: result.reason instanceof Error
          ? result.reason.message
          : String(result.reason),
      });
    }
  }

  const seen = new Set(state.entries.map((e) => e.url));
  // Also dedupe within this poll (in case the same article URL appears
  // across multiple sources).
  const freshSeen = new Set<string>();
  const freshItems = allItems.filter((it) => {
    if (seen.has(it.url)) return false;
    if (freshSeen.has(it.url)) return false;
    if (isSeen(state, it.url)) return false;
    freshSeen.add(it.url);
    return true;
  });

  return { state, stateSha, perSource, freshItems };
}
