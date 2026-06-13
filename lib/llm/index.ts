import type { LLMDrafter, Provider } from "./types";
import { OpenAIDrafter } from "./openai";
import { AnthropicDrafter } from "./anthropic";

/**
 * Provider-agnostic factory.
 *
 * Resolution order for provider:
 *  1. Explicit `opts.provider` argument
 *  2. UPDATES_DRAFTER env (intended runtime switch)
 *  3. Fallback to "anthropic" (cost-minimized default, per memory)
 *
 * For each provider, the corresponding API key must be set in env:
 *  - openai: OPENAI_API_KEY (plus OPENAI_MODEL, default "gpt-5.4")
 *  - anthropic: ANTHROPIC_API_KEY (plus ANTHROPIC_MODEL, default Haiku)
 */
export function createDrafter(opts: { provider?: Provider } = {}): LLMDrafter {
  const provider: Provider =
    opts.provider ??
    (process.env.UPDATES_DRAFTER as Provider | undefined) ??
    "anthropic";

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY is not set. Add it to .env.local or pass via environment.",
      );
    }
    return new OpenAIDrafter({ apiKey });
  }

  if (provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not set.");
    }
    return new AnthropicDrafter({ apiKey });
  }

  // Exhaustiveness check
  const exhaustive: never = provider;
  throw new Error(`Unknown LLM provider: ${exhaustive}`);
}

export type { LLMDrafter, DraftRequest, DraftResponse, DraftResult, Provider } from "./types";
