import { getFile, putFile } from "@/lib/github";

/**
 * Persistent dedupe state for the auto-discovery cron.
 *
 * Lives at `content/updates/_state/seen-sources.json` in the repo. The
 * cron reads it, filters discovered items, drafts new ones, then appends
 * those URLs back to the file in the same workflow.
 *
 * Committing the state to git has two benefits beyond simplicity:
 *  - No external dependency (no Supabase / KV / S3 for this MVP).
 *  - Audit log for free: git history shows when each URL was first seen.
 *
 * Schema:
 * {
 *   "version": 1,
 *   "entries": [
 *     {
 *       "url": "https://blog.youtube/news-and-events/...",
 *       "discoveredAt": "2026-06-13T12:00:00Z",
 *       "status": "published" | "draft" | "rejected",
 *       "slug": "2026-06-foo-bar"   // only for published/draft
 *     }
 *   ]
 * }
 */

const STATE_PATH = "content/updates/_state/seen-sources.json";

export type SeenStatus = "published" | "draft" | "rejected";

export type SeenEntry = {
  url: string;
  discoveredAt: string;
  status: SeenStatus;
  slug?: string;
};

export type SeenState = {
  version: 1;
  entries: SeenEntry[];
};

const EMPTY: SeenState = { version: 1, entries: [] };

export async function readSeen(): Promise<{ state: SeenState; sha?: string }> {
  const file = await getFile(STATE_PATH);
  if (!file) return { state: EMPTY };
  try {
    const parsed = JSON.parse(file.content) as SeenState;
    if (parsed?.version !== 1 || !Array.isArray(parsed.entries)) {
      throw new Error("Unexpected seen-sources.json shape");
    }
    return { state: parsed, sha: file.sha };
  } catch (e) {
    throw new Error(
      `seen-sources.json parse failed: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
}

export function isSeen(state: SeenState, url: string): boolean {
  return state.entries.some((e) => e.url === url);
}

/**
 * Returns a new state with the given entries appended. Does NOT commit.
 * The cron writes the file once at the end of a run.
 */
export function appendEntries(
  state: SeenState,
  newEntries: SeenEntry[],
): SeenState {
  return {
    version: 1,
    entries: [...state.entries, ...newEntries],
  };
}

export async function writeSeen(state: SeenState, sha?: string): Promise<void> {
  await putFile({
    path: STATE_PATH,
    content: JSON.stringify(state, null, 2) + "\n",
    message: `chore(updates): update seen-sources.json (${state.entries.length} entries)`,
    sha,
  });
}

/** Path constant exported for batched cron commits. */
export const SEEN_SOURCES_PATH = STATE_PATH;

/** Serializes a state object the same way writeSeen does (newline at end). */
export function serializeSeen(state: SeenState): string {
  return JSON.stringify(state, null, 2) + "\n";
}
