import Anthropic from "@anthropic-ai/sdk";

/**
 * Singleton Anthropic client.
 *
 * Default model: Claude Haiku 4.5 — the cheapest model that's good enough
 * for the short, structured creative tasks SEO Check Tools focuses on.
 * Pricing (as of 2026-05): $1/MTok input, $5/MTok output.
 */

export const CLAUDE_MODEL = "claude-haiku-4-5-20251001" as const;
export const PRICING = {
  inputPerMTok: 1.0,
  outputPerMTok: 5.0,
} as const;

let _client: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (_client) return _client;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Anthropic is not configured. Set ANTHROPIC_API_KEY in .env.local."
    );
  }

  _client = new Anthropic({ apiKey });
  return _client;
}

/**
 * Compute USD cost of a Claude call from its token usage.
 */
export function computeCost(input_tokens: number, output_tokens: number): number {
  return (
    (input_tokens / 1_000_000) * PRICING.inputPerMTok +
    (output_tokens / 1_000_000) * PRICING.outputPerMTok
  );
}

type CallClaudeOpts<T> = {
  /** System prompt — sets persona/context. Keep tight to save tokens. */
  system: string;
  /** User message — the actual request. */
  user: string;
  /** Max output tokens. Default 500 (suits ~10 list items). */
  maxTokens?: number;
  /**
   * Parse the model's raw text into a typed structured output.
   * The function should throw on unparseable input — the protect layer
   * will surface a 502 in that case.
   */
  parse: (rawText: string) => T;
  /** Optional temperature, default 0.7 for creative tasks. */
  temperature?: number;
};

export type ClaudeResult<T> = {
  parsed: T;
  /** Raw text from the model (before parsing) — useful for debugging. */
  raw: string;
  /** Computed USD cost based on token usage. */
  costUsd: number;
  /** Token usage from the model response. */
  usage: { input_tokens: number; output_tokens: number };
};

/**
 * Generic, typed Claude call helper.
 *
 * Tools call this from their `callModel` callback. The protect layer
 * (lib/ai/protect.ts) wraps this with rate limits, caching, budget caps.
 */
export async function callClaude<T>(opts: CallClaudeOpts<T>): Promise<ClaudeResult<T>> {
  const response = await anthropic().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: opts.maxTokens ?? 500,
    temperature: opts.temperature ?? 0.7,
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
  });

  // Extract text content from the response (Claude can return multiple blocks)
  const raw = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  const parsed = opts.parse(raw);
  const costUsd = computeCost(
    response.usage.input_tokens,
    response.usage.output_tokens
  );

  return {
    parsed,
    raw,
    costUsd,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  };
}
