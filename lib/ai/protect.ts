import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getClientIp } from "./get-client-ip";
import { verifyTurnstile } from "./turnstile";
import { checkRateLimit, DEFAULT_DAILY_LIMIT } from "./rate-limit";
import { getCachedOutput, setCachedOutput } from "./cache";
import { hasBudgetHeadroom, recordSpend } from "./budget";

/**
 * Wrap a tool's API route with the full AI cost-protection stack:
 *
 *   Request
 *     ↓
 *   1. Parse body (your `parseInput`)
 *   2. Verify Cloudflare Turnstile token
 *   3. Extract client IP and check per-IP daily rate limit
 *   4. Cache lookup by (tool, hash(input)) — return cached on hit
 *   5. Check global daily budget headroom
 *   6. Call your `callModel`
 *   7. Record spend, store cache
 *   8. Return response
 *     ↓
 *   { output }
 *
 * On any failure we return JSON `{ error, code, ... }` with an appropriate
 * HTTP status. The codes are stable so the frontend can show specific UX:
 *
 *   400 invalid-input        — parseInput threw
 *   400 turnstile-failed     — Turnstile token missing or rejected
 *   429 rate-limited         — per-IP daily quota exhausted
 *   503 budget-exhausted     — global daily budget cap hit
 *   502 model-error          — Anthropic call threw or output didn't parse
 *   500 server-error         — anything else
 */

type ProtectOpts<TInput, TOutput> = {
  /** Tool slug, e.g. "youtube-title-generator". Used as cache + rate-limit key. */
  tool: string;
  /** Parse and validate the request body into the tool's input shape. Throws on invalid. */
  parseInput: (body: unknown) => TInput;
  /** Call the model with the parsed input. Returns the output and the cost in USD. */
  callModel: (
    input: TInput
  ) => Promise<{ output: TOutput; costUsd: number }>;
  /** Optional: per-tool override for the daily IP limit. */
  dailyLimit?: number;
};

type ProtectBody = {
  /** Cloudflare Turnstile response token from the client widget. */
  turnstileToken?: string;
  /** Tool-specific input payload. */
  input: unknown;
};

export async function protectAI<TInput, TOutput>(
  req: NextRequest,
  opts: ProtectOpts<TInput, TOutput>
): Promise<Response> {
  const limit = opts.dailyLimit ?? DEFAULT_DAILY_LIMIT;

  // ── 0. Parse outer envelope ──
  let envelope: ProtectBody;
  try {
    envelope = (await req.json()) as ProtectBody;
  } catch {
    return error("invalid-input", "Request body is not valid JSON.", 400);
  }

  // ── 1. Parse + validate tool input ──
  let input: TInput;
  try {
    input = opts.parseInput(envelope.input);
  } catch (err) {
    return error(
      "invalid-input",
      err instanceof Error ? err.message : "Input validation failed.",
      400
    );
  }

  // ── 2. Turnstile ──
  const clientIp = getClientIp(req);
  const turnstile = await verifyTurnstile(envelope.turnstileToken, clientIp);
  if (!turnstile.ok) {
    return error("turnstile-failed", `Turnstile: ${turnstile.reason}`, 400);
  }

  // ── 3. Rate limit ──
  const rl = await checkRateLimit(opts.tool, clientIp, limit);
  if (!rl.allowed) {
    return error(
      "rate-limited",
      `You've used your daily ${limit} generations for this tool. Resets at UTC midnight.`,
      429,
      { remaining: 0, resetAt: rl.resetAt, limit }
    );
  }

  // ── 4. Cache ──
  const cached = await getCachedOutput<TOutput>(opts.tool, input);
  if (cached) {
    return NextResponse.json(
      { output: cached, cached: true, remaining: rl.remaining },
      { status: 200 }
    );
  }

  // ── 5. Budget ──
  const budget = await hasBudgetHeadroom();
  if (!budget.ok) {
    return error(
      "budget-exhausted",
      "The free AI quota for today is used up. Please try again tomorrow.",
      503,
      { spent: budget.spent, cap: budget.cap }
    );
  }

  // ── 6. Call the model ──
  let result: { output: TOutput; costUsd: number };
  try {
    result = await opts.callModel(input);
  } catch (err) {
    console.error(`[${opts.tool}] model error`, err);
    return error(
      "model-error",
      "The AI model didn't return a usable response. Try again in a moment.",
      502
    );
  }

  // ── 7. Record spend + store cache (fire and forget; don't block response) ──
  await Promise.all([
    recordSpend(result.costUsd).catch(() => {}),
    setCachedOutput(opts.tool, input, result.output).catch(() => {}),
  ]);

  // ── 8. Return ──
  return NextResponse.json(
    {
      output: result.output,
      cached: false,
      remaining: rl.remaining,
      resetAt: rl.resetAt,
    },
    { status: 200 }
  );
}

function error(
  code: string,
  message: string,
  status: number,
  extra: Record<string, unknown> = {}
): Response {
  return NextResponse.json({ error: message, code, ...extra }, { status });
}
