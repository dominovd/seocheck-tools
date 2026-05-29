import { redis, KEY_PREFIX } from "../upstash";

/**
 * Prompt/response cache.
 *
 * Key: `cache:<tool>:<sha256(normalizedInput)>`
 * Value: JSON-stringified output
 * TTL: 24 hours
 *
 * Deduplicating identical prompts cuts a meaningful slice off compute cost
 * — common queries (e.g. "title for gaming video") recur often. Cache hits
 * skip the Anthropic call entirely.
 */

const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24h

/**
 * Hash an input object/string to a stable cache key segment.
 * Uses Web Crypto (works on Edge runtime).
 */
async function hashInput(input: unknown): Promise<string> {
  const normalized =
    typeof input === "string"
      ? input.trim().toLowerCase()
      : JSON.stringify(input, Object.keys(input as object).sort());
  const encoded = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getCachedOutput<T>(
  tool: string,
  input: unknown
): Promise<T | null> {
  const hash = await hashInput(input);
  const key = `${KEY_PREFIX}cache:${tool}:${hash}`;
  const value = await redis().get<string>(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    // Corrupted cache entry — treat as miss
    return null;
  }
}

export async function setCachedOutput(
  tool: string,
  input: unknown,
  output: unknown
): Promise<void> {
  const hash = await hashInput(input);
  const key = `${KEY_PREFIX}cache:${tool}:${hash}`;
  await redis().set(key, JSON.stringify(output), { ex: CACHE_TTL_SECONDS });
}
