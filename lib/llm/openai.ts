import type {
  DraftRequest,
  DraftResponse,
  DraftResult,
  LLMDrafter,
} from "./types";
import { SYSTEM_PROMPT, buildUserMessage } from "./prompts";

/**
 * OpenAI driver using fetch (no extra SDK dependency).
 *
 * Calls Chat Completions with response_format=json_object so the model
 * returns parseable JSON. Temperature 0.2 keeps the output tight and
 * factual; higher values make the model speculate, which the system
 * prompt forbids anyway.
 */
type OpenAIOptions = {
  apiKey: string;
  /** Model id, e.g. "gpt-5.4". Default falls back to env or "gpt-5.4". */
  model?: string;
};

export class OpenAIDrafter implements LLMDrafter {
  private apiKey: string;
  private model: string;

  constructor(opts: OpenAIOptions) {
    if (!opts.apiKey) {
      throw new Error("OpenAIDrafter: apiKey is required.");
    }
    this.apiKey = opts.apiKey;
    this.model = opts.model || process.env.OPENAI_MODEL || "gpt-5.4";
  }

  async draft(req: DraftRequest): Promise<DraftResult> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserMessage(req) },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(
        `OpenAI API error (${res.status} ${res.statusText}): ${errText.slice(0, 500)}`,
      );
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };

    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI response missing message content.");
    }

    let parsed: DraftResponse;
    try {
      parsed = JSON.parse(content) as DraftResponse;
    } catch (e) {
      throw new Error(
        `OpenAI returned non-JSON content despite json_object format: ${content.slice(0, 300)}`,
      );
    }

    // Normalize optional fields if model omitted them.
    parsed.whatThisMeansForCreators ??= "";
    parsed.relatedTools ??= [];
    parsed.effectiveDate ??= "";
    parsed.notesForReviewer ??= "";

    return {
      draft: parsed,
      usage: {
        inputTokens: json.usage?.prompt_tokens ?? 0,
        outputTokens: json.usage?.completion_tokens ?? 0,
      },
      model: this.model,
      provider: "openai",
    };
  }
}
