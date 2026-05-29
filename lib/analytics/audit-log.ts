/**
 * Anonymous audit logging — foundation for YouTube Studies pages.
 *
 * Every Video Audit / Channel Audit / Outlier Finder result writes a
 * compact summary to a Redis list. The store is:
 *
 *   key:   `seo:audit-log:<source>`         (one list per tool)
 *   value: JSON {
 *     ch: hash(channelId | videoId),         // 16-byte sha256 prefix
 *     ts: ISO date string (YYYY-MM-DD only),  // day granularity — no per-request fingerprinting
 *     scores: { overall, title, description, ... }
 *   }
 *
 * No personally-identifying information is stored:
 *   - channel/video IDs are SHA-256-hashed before write
 *   - no user IPs, no user agents, no request fingerprints
 *   - timestamp is rounded to the day
 *
 * Why: in 4-6 weeks the list will contain thousands of audit summaries,
 * which lets us build research-style pages ("Median title score across
 * X audited videos", "What % of channels have chapters", etc) — the
 * thing LLMs and bloggers actually cite. Right now it costs ~1 Redis
 * LPUSH per audit (sub-millisecond), zero user-visible change.
 *
 * Future studies pages will read the data via LRANGE + aggregate.
 * Cap length per source at 10000 entries (LTRIM after write) to keep
 * storage bounded.
 */

import { redis, KEY_PREFIX } from "../upstash";

const MAX_ENTRIES = 10_000;

export type AuditLogSource = "video-audit" | "channel-audit" | "outlier-finder";

export type AuditLogEntry = {
  /** 16-byte SHA-256 prefix of the source ID (channel ID or video ID). */
  ch: string;
  /** ISO date (YYYY-MM-DD) — day granularity, no per-request fingerprint. */
  ts: string;
  /** Tool-specific score payload. Keys vary by source. */
  scores: Record<string, number | null>;
};

export async function logAudit(
  source: AuditLogSource,
  sourceId: string,
  scores: Record<string, number | null>
): Promise<void> {
  try {
    const ch = await hashId(sourceId);
    const ts = new Date().toISOString().slice(0, 10);
    const entry: AuditLogEntry = { ch, ts, scores };
    const key = `${KEY_PREFIX}audit-log:${source}`;
    await redis().lpush(key, JSON.stringify(entry));
    // Trim from the right so we keep the most recent MAX_ENTRIES
    await redis().ltrim(key, 0, MAX_ENTRIES - 1);
  } catch {
    // Logging must never break the user's response — fail silent
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
