/**
 * Anonymous audit logging.
 *
 * Every Video Audit / Channel Audit / Outlier Finder result writes a
 * compact summary to a Redis list. The store is:
 *
 *   key:   `seo:audit-log:<source>`         (one list per tool)
 *   value: JSON {
 *     ch: hash(channelId | videoId),         // 16-byte sha256 prefix
 *     ts: ISO date string (YYYY-MM-DD only),  // day granularity
 *     counts: { ... }                         // our own editorial counts
 *   }
 *
 * COMPLIANCE (YouTube API Services policy III.E.4a-g):
 *   - We do NOT log any YouTube-provided statistic (view counts,
 *     subscriber counts, like counts, median/mean views, etc). Only
 *     counts derived from our own editorial checks are stored, such as
 *     "how many dimensions had a warning".
 *   - The key carries a hard 30-day TTL and is re-armed on every write,
 *     so nothing survives more than 30 days.
 *   - Entries older than 30 days are also pruned on write as a
 *     belt-and-braces measure in case the TTL is ever cleared.
 *
 * No personally-identifying information is stored:
 *   - channel/video IDs are SHA-256-hashed before write
 *   - no user IPs, no user agents, no request fingerprints
 *   - timestamp is rounded to the day
 */

import { redis, KEY_PREFIX } from "../upstash";

const MAX_ENTRIES = 10_000;
/** Hard retention ceiling in seconds. YouTube policy III.E.4a-g caps this at 30 days. */
const RETENTION_SECONDS = 30 * 24 * 60 * 60;
/** Same window expressed in days, used for the date-based prune pass. */
const RETENTION_DAYS = 30;

export type AuditLogSource = "video-audit" | "channel-audit" | "outlier-finder";

export type AuditLogEntry = {
  /** 16-byte SHA-256 prefix of the source ID (channel ID or video ID). */
  ch: string;
  /** ISO date (YYYY-MM-DD) — day granularity, no per-request fingerprint. */
  ts: string;
  /**
   * Counts derived from our own editorial checks. Must never contain a
   * YouTube-provided statistic (views, subscribers, likes, comments) or
   * any aggregation of one.
   */
  counts: Record<string, number | null>;
};

export async function logAudit(
  source: AuditLogSource,
  sourceId: string,
  counts: Record<string, number | null>
): Promise<void> {
  try {
    const ch = await hashId(sourceId);
    const ts = new Date().toISOString().slice(0, 10);
    const entry: AuditLogEntry = { ch, ts, counts };
    const key = `${KEY_PREFIX}audit-log:${source}`;

    await redis().lpush(key, JSON.stringify(entry));
    // Bound the list length so storage stays predictable.
    await redis().ltrim(key, 0, MAX_ENTRIES - 1);
    // Re-arm the 30-day TTL on every write so the key can never outlive
    // the retention window even under continuous traffic.
    await redis().expire(key, RETENTION_SECONDS);
    // Belt-and-braces: drop any entry whose recorded date is older than
    // the retention window.
    await pruneStale(key);
  } catch {
    // Logging must never break the user's response — fail silent
  }
}

/**
 * Remove entries older than RETENTION_DAYS. The list is newest-first, so
 * we can scan from the tail and truncate at the first in-window entry.
 */
async function pruneStale(key: string): Promise<void> {
  try {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const raw = await redis().lrange(key, 0, MAX_ENTRIES - 1);
    if (!Array.isArray(raw) || raw.length === 0) return;

    let keep = raw.length;
    for (let i = raw.length - 1; i >= 0; i--) {
      const item = raw[i];
      let ts: string | null = null;
      try {
        ts = typeof item === "string" ? (JSON.parse(item) as AuditLogEntry).ts : null;
      } catch {
        ts = null;
      }
      // Unparseable or out-of-window entries get dropped from the tail.
      if (ts === null || ts < cutoff) {
        keep = i;
      } else {
        break;
      }
    }
    if (keep < raw.length) {
      if (keep === 0) {
        await redis().del(key);
      } else {
        await redis().ltrim(key, 0, keep - 1);
      }
    }
  } catch {
    // Pruning is best-effort; the TTL is the hard guarantee.
  }
}

async function hashId(id: string): Promise<string> {
  const encoded = new TextEncoder().encode(id);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
