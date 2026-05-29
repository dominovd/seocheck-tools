import { Redis } from "@upstash/redis";

/**
 * Singleton Upstash Redis client.
 *
 * Used for:
 *  - AI per-IP rate limiting (lib/ai/rate-limit.ts)
 *  - AI prompt/response cache (lib/ai/cache.ts)
 *  - Daily AI spend budget tracker (lib/ai/budget.ts)
 *
 * Upstash free tier: 10,000 commands/day, 256 MB storage, REST-based
 * so it works on Vercel Edge runtime.
 */

let _client: Redis | null = null;

export function redis(): Redis {
  if (_client) return _client;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Upstash Redis is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local."
    );
  }

  _client = new Redis({ url, token });
  return _client;
}
