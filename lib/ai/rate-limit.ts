import { redis } from "../upstash";

/**
 * Per-IP, per-tool daily rate limit.
 *
 * Implementation: simple Redis counter with a 24h TTL keyed by
 * `rl:<tool>:<ip>:<YYYY-MM-DD>`. Counter is set with `incr`; on first
 * write we set the TTL. This is a "fixed window" limit aligned to UTC
 * midnight — simpler and cheaper than a true sliding window, and the
 * fairness gap doesn't matter for our use case.
 *
 * Default budget per IP per tool per day: 15.
 */

export const DEFAULT_DAILY_LIMIT = 15;

export type RateLimitResult =
  | { allowed: true; remaining: number; resetAt: number }
  | { allowed: false; remaining: 0; resetAt: number; limit: number };

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function endOfUtcDay(): number {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d.getTime();
}

/**
 * Atomically check and increment the per-IP per-tool counter.
 * Returns whether the request is allowed, plus remaining quota.
 */
export async function checkRateLimit(
  tool: string,
  ip: string,
  limit: number = DEFAULT_DAILY_LIMIT
): Promise<RateLimitResult> {
  const key = `rl:${tool}:${ip}:${todayUtc()}`;
  const r = redis();

  // INCR returns the new value. If it's 1, the key was just created
  // and we need to set an expiry (UTC day end).
  const count = await r.incr(key);
  if (count === 1) {
    // 25 hours to give a small buffer past UTC midnight
    await r.expire(key, 60 * 60 * 25);
  }

  const resetAt = endOfUtcDay();

  if (count > limit) {
    return { allowed: false, remaining: 0, resetAt, limit };
  }

  return { allowed: true, remaining: limit - count, resetAt };
}
