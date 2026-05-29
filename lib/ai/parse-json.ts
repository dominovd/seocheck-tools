/**
 * Robust JSON parser for Claude's text output.
 *
 * Claude Haiku, when asked for JSON output, almost always returns clean
 * JSON. But it occasionally wraps the response in markdown fences (```json
 * ... ```) or adds a brief preamble. This helper strips those wrappers
 * before parsing so individual tools don't have to.
 *
 * Throws (caught by lib/ai/protect.ts and surfaced as a 502 "model-error")
 * if the cleaned output still isn't valid JSON.
 */
export function parseJsonOutput<T>(raw: string): T {
  let cleaned = raw.trim();

  // Strip a leading ```json or ``` fence
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "");
    cleaned = cleaned.replace(/\n?```\s*$/i, "");
  }

  // Sometimes Claude prefixes "Here is the JSON: ..." — try to locate the
  // first { or [ and slice from there.
  const firstBrace = cleaned.search(/[\{\[]/);
  if (firstBrace > 0) cleaned = cleaned.slice(firstBrace);

  return JSON.parse(cleaned) as T;
}
