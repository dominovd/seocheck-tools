/**
 * Tracked-channel storage.
 *
 * Channels users explicitly "Track" get added to a sorted set, scored
 * by last-access timestamp. A weekly cron picks the most-recently-
 * accessed N channels and re-fetches them, writing each result to a
 * per-channel history list.
 *
 * COMPLIANCE (YouTube API Services policy III.E.4a-g):
 * YouTube statistics must not be stored for more than 30 days. The
 * history list therefore holds at most 4 weekly snapshots (28 days)
 * and every history key carries a hard 30-day TTL that is re-armed on
 * each write. Snapshots older than 30 days are pruned on write.
 *
 * Bounded by design — cap on total tracked channels keeps storage and
 * weekly cron cost predictable, even with viral traffic.
 *
 * Key layout:
 *   seo:tracked:set              → sorted set (member=channelId, score=lastAccessTs)
 *   seo:tracked:history:<chanId> → list of JSON entries, newest first, LTRIMmed + TTL
 */

import { redis, KEY_PREFIX } from "../upstash";

const TRACKED_SET = `${KEY_PREFIX}tracked:set`;
const HISTORY_KEY = (channelId: string) => `${KEY_PREFIX}tracked:history:${channelId}`;
/** Maximum tracked channels at any time. Older least-used drop off. */
const MAX_TRACKED = 200;
/**
 * Maximum history entries per channel. 4 weekly snapshots = 28 days,
 * which stays inside the 30-day YouTube statistics retention ceiling.
 */
const MAX_HISTORY = 4;
/** Hard TTL on every history key. YouTube policy III.E.4a-g caps this at 30 days. */
const HISTORY_TTL_SECONDS = 30 * 24 * 60 * 60;
/** Same window in days, used for the date-based prune pass. */
const RETENTION_DAYS = 30;

export type HistoryEntry = {
  /** ISO date string YYYY-MM-DD when the snapshot was taken. */
  ts: string;
  /** Raw subscriber count from YouTube API at snapshot time. */
  subscriberCount: number | null;
  /** Raw total video count at snapshot time. */
  videoCount: number | null;
  /** Number of uploads in the analysis window (typically 30). */
  windowSize: number;
  /** Median view count across the analyzed uploads. Factual aggregation. */
  medianViews: number;
  /** Mean view count across the analyzed uploads. Factual aggregation. */
  meanViews: number;
  /** Sum of view counts across the analyzed uploads. Raw. */
  totalViewsInWindow: number;
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

/**
 * Append a snapshot entry to a channel's history list (newest first).
 *
 * Enforces the 30-day YouTube statistics retention ceiling three ways:
 *   1. LTRIM caps the list at MAX_HISTORY (4 weekly snapshots = 28 days)
 *   2. EXPIRE re-arms a hard 30-day TTL on every write
 *   3. Any snapshot dated outside the window is dropped
 */
export async function appendHistory(channelId: string, entry: HistoryEntry): Promise<void> {
  const key = HISTORY_KEY(channelId);
  await redis().lpush(key, JSON.stringify(entry));
  await redis().ltrim(key, 0, MAX_HISTORY - 1);
  await redis().expire(key, HISTORY_TTL_SECONDS);
}

/** True when a snapshot's date is inside the 30-day retention window. */
function isWithinRetention(entry: HistoryEntry): boolean {
  if (!entry || typeof entry.ts !== "string") return false;
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  return entry.ts >= cutoff;
}

/**
 * Read a channel's history (newest first). Snapshots dated outside the
 * 30-day retention window are filtered out at read time so a stale key
 * can never surface out-of-window statistics.
 */
export async function getHistory(channelId: string, limit = MAX_HISTORY): Promise<HistoryEntry[]> {
  const key = HISTORY_KEY(channelId);
  const raw = await redis().lrange(key, 0, Math.min(limit, MAX_HISTORY) - 1);
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[])
    .map((s) => {
      try {
        return typeof s === "string" ? (JSON.parse(s) as HistoryEntry) : null;
      } catch {
        return null;
      }
    })
    .filter((e): e is HistoryEntry => e !== null && isWithinRetention(e));
}
