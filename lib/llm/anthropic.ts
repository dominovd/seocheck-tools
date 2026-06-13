import Anthropic from "@anthropic-ai/sdk";
import type {
  DraftRequest,
  DraftResponse,
  DraftResult,
  LLMDrafter,
} from "./types";
import { SYSTEM_PROMPT, buildUserMessage } from "./prompts";

/**
 * Anthropic Claude Haiku driver.
 *
 * Used as the default cost-minimized state (~$0.80 input / $4 output per
 * million tokens, ~5-10x cheaper than GPT-5.4). The CLI defaults to
 * OpenAI for testing; once tone is evaluated and accepted, switch back
 * here by setting UPDATES_DRAFTER=anthropic.
 */
type AnthropicOptions = {
  apiKey: string;
  model?: string;
};

const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

export class AnthropicDrafter implements LLMDrafter {
  private client: Anthropic;
  private model: string;

  constructor(opts: AnthropicOptions) {
    if (!opts.apiKey) {
      throw new Error("AnthropicDrafter: apiKey is required.");
    }
    this.client = new Anthropic({ apiKey: opts.apiKey });
    this.model = opts.model || process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  }

  async draft(req: DraftRequest): Promise<DraftResult> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `${buildUserMessage(req)}\n\nReturn only the JSON object described in the system instructions. No preamble, no markdown.`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Anthropic response missing text content.");
    }

    // Haiku sometimes wraps JSON in ```json fences despite instructions.
    const raw = textBlock.text.trim();
    const stripped = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed: DraftResponse;
    try {
      parsed = JSON.parse(stripped) as DraftResponse;
    } catch (e) {
      throw new Error(
        `Anthropic returned non-JSON content: ${stripped.slice(0, 300)}`,
      );
    }

    parsed.whatThisMeansForCreators ??= "";
    parsed.relatedTools ??= [];
    parsed.effectiveDate ??= "";
    parsed.notesForReviewer ??= "";

    return {
      draft: parsed,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
      model: this.model,
      provider: "anthropic",
    };
  }
}
