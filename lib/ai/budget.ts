import { redis, KEY_PREFIX } from "../upstash";

/**
 * Daily AI spend tracker.
 *
 * Cumulative Anthropic cost is tracked in a Redis key
 * `budget:<YYYY-MM-DD>`. Before each model call we check that today's
 * spend hasn't exceeded `AI_DAILY_BUDGET_USD`. After each successful
 * call we increment by the actual cost.
 *
 * This is a backstop, not the primary defense — rate limits and Turnstile
 * are. But if both fail (e.g. a paid CAPTCHA-solving service plus rotated
 * proxies), this stops the bleeding at the configured cap.
 */

const DEFAULT_DAILY_BUDGET_USD = 5;

function todayKey(): string {
  return `${KEY_PREFIX}budget:${new Date().toISOString().slice(0, 10)}`;
}

function dailyBudgetUsd(): number {
  const raw = process.env.AI_DAILY_BUDGET_USD;
  if (!raw) return DEFAULT_DAILY_BUDGET_USD;
  const parsed = Number(raw);
  if (Number.isNaN(parsed) || parsed <= 0) return DEFAULT_DAILY_BUDGET_USD;
  return parsed;
}

/**
 * Returns the current day's spend in USD (0 if nothing yet).
 */
async function readSpend(): Promise<number> {
  const value = await redis().get<string>(todayKey());
  if (!value) return 0;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

/**
 * Check whether we have budget headroom to make a call.
 * Call this BEFORE invoking Anthropic.
 */
export async function hasBudgetHeadroom(): Promise<{
  ok: boolean;
  spent: number;
  cap: number;
}> {
  const cap = dailyBudgetUsd();
  const spent = await readSpend();
  return { ok: spent < cap, spent, cap };
}

/**
 * Record a successful AI spend. Call this AFTER the Anthropic call returns.
 */
export async function recordSpend(costUsd: number): Promise<void> {
  if (costUsd <= 0) return;
  const key = todayKey();
  const r = redis();
  // Upstash supports incrbyfloat for atomic float increments
  await r.incrbyfloat(key, costUsd);
  // Set TTL on first write of the day (48h gives clean rollover buffer)
  await r.expire(key, 60 * 60 * 48);
}
