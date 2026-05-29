/**
 * Tracked-channel storage.
 *
 * Channels users explicitly "Track" get added to a sorted set, scored
 * by last-access timestamp. A weekly cron picks the most-recently-
 * accessed N channels and re-scores them, writing each result to a
 * per-channel history list. Over weeks the history accumulates into
 * a timeline visible on the Visibility Score page.
 *
 * Bounded by design — cap on total tracked channels keeps storage and
 * weekly cron cost predictable, even with viral traffic.
 *
 * Key layout:
 *   seo:tracked:set              → sorted set (member=channelId, score=lastAccessTs)
 *   seo:tracked:history:<chanId> → list of JSON entries, newest first, LTRIMmed
 */

import { redis, KEY_PREFIX } from "../upstash";

const TRACKED_SET = `${KEY_PREFIX}tracked:set`;
const HISTORY_KEY = (channelId: string) => `${KEY_PREFIX}tracked:history:${channelId}`;
/** Maximum tracked channels at any time. Older least-used drop off. */
const MAX_TRACKED = 200;
/** Maximum history entries per channel. ~6 months at weekly cadence. */
const MAX_HISTORY = 26;

export type HistoryEntry = {
  /** ISO date string YYYY-MM-DD when the snapshot was taken. */
  ts: string;
  /** Composite Visibility Score 0-100. */
  visibility: number;
  /** Sub-score snapshot for the same date. */
  ctr: number;
  metadata: number;
  headroom: number;
  trajectory: number;
};

/**
 * Mark a channel as tracked. If we're already at MAX_TRACKED, oldest-
 * accessed channels are evicted automatically (sorted set is trimmed
 * by score after add).
 */
export async function trackChannel(channelId: string): Promise<{ added: boolean }> {
  if (!channelId || channelId.length > 64) return { added: false };
  const now = Date.now();
  await redis().zadd(TRACKED_SET, { score: now, member: channelId });

  // Evict the oldest entries above the cap. Using ZREMRANGEBYRANK keeps
  // the highest-scored (most-recently-accessed) up to MAX_TRACKED.
  const size = await redis().zcard(TRACKED_SET);
  if (size > MAX_TRACKED) {
    await redis().zremrangebyrank(TRACKED_SET, 0, size - MAX_TRACKED - 1);
  }
  return { added: true };
}

/** Check whether a channel is currently being tracked. */
export async function isTracked(channelId: string): Promise<boolean> {
  if (!channelId) return false;
  const score = await redis().zscore(TRACKED_SET, channelId);
  return score !== null && score !== undefined;
}

/** Top N most-recently-accessed tracked channels — used by the weekly cron. */
export async function listTrackedChannels(limit = MAX_TRACKED): Promise<string[]> {
  const members = await redis().zrange(TRACKED_SET, 0, limit - 1, { rev: true });
  return Array.isArray(members) ? (members as string[]) : [];
}

/** Append a snapshot entry to a channel's history list (newest first). */
export async function appendHistory(channelId: string, entry: HistoryEntry): Promise<void> {
  const key = HISTORY_KEY(channelId);
  await redis().lpush(key, JSON.stringify(entry));
  await redis().ltrim(key, 0, MAX_HISTORY - 1);
}

/** Read a channel's history (newest first). */
export async function getHistory(channelId: string, limit = MAX_HISTORY): Promise<HistoryEntry[]> {
  const key = HISTORY_KEY(channelId);
  const raw = await redis().lrange(key, 0, limit - 1);
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[])
    .map((s) => {
      try {
        return typeof s === "string" ? (JSON.parse(s) as HistoryEntry) : null;
      } catch {
        return null;
      }
    })
    .filter((e): e is HistoryEntry => e !== null);
}
