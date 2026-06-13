/**
 * Provider-agnostic LLM types for the updates feed drafter.
 *
 * Same DraftRequest / DraftResponse shape regardless of provider, so the
 * pipeline code (and the eventual admin queue UI) doesn't care whether
 * GPT-5.4 or Claude Haiku produced the draft.
 *
 * Per seocheck-tools-updates-feed memory:
 *  - whatThisMeansForCreators is ALWAYS null from the model. Human writes
 *    that line by hand. Hard rule, no humanMustVerify alternative — model
 *    output anchors human editing toward whatever it wrote.
 *  - factualConfidence "low" means stop, do not publish, hand to reviewer.
 */

export type UpdateSeverity = "major" | "minor" | "info";

export type UpdateCategory =
  | "algorithm"
  | "monetization"
  | "shorts"
  | "api"
  | "policy";

export type Provider = "openai" | "anthropic";

export type DraftRequest = {
  source: {
    name: string;
    url: string;
    publishedDate?: string;
    /** Extracted plain text from the source article. Truncated by caller. */
    contentText: string;
  };
};

export type DraftResponse = {
  title: string;
  summary: string;
  /** Exactly 3 paragraphs, each restating one fact from the source. */
  body: string[];
  proposedSeverity: UpdateSeverity;
  proposedCategory: UpdateCategory;
  factualConfidence: "high" | "medium" | "low";
  /**
   * 1-2 sentence creator takeaway. Constrained: grounded in body facts,
   * no speculation, no imperative recommendations, no revenue/engagement
   * predictions. Model produces this; human approves at publish time.
   */
  whatThisMeansForCreators: string;
  /**
   * Tool slugs to feature on the post page. Model selects 2-4 from the
   * catalog provided in the system prompt. Empty array if none fit.
   */
  relatedTools: string[];
  /**
   * Effective date of the platform change in ISO YYYY-MM-DD when the
   * source states one. Used by the CLI when --date flag is omitted.
   * Empty string if not determinable from source.
   */
  effectiveDate: string;
  /** Anything uncertain the human reviewer should double-check. */
  notesForReviewer: string;
};

export type Usage = {
  inputTokens: number;
  outputTokens: number;
};

export type DraftResult = {
  draft: DraftResponse;
  usage: Usage;
  model: string;
  provider: Provider;
};

export interface LLMDrafter {
  draft(req: DraftRequest): Promise<DraftResult>;
}

/**
 * Estimated USD cost based on published per-million-token prices.
 * Update if pricing changes. Used for the CLI summary line.
 */
export function estimateCostUSD(
  usage: Usage,
  model: string,
): number {
  const m = model.toLowerCase();
  // OpenAI per-million-token rates (verified 2026-06 from openai.com/api/pricing)
  if (m.startsWith("gpt-5.5")) {
    return (usage.inputTokens * 5 + usage.outputTokens * 30) / 1_000_000;
  }
  if (m.startsWith("gpt-5.4-mini")) {
    return (usage.inputTokens * 0.75 + usage.outputTokens * 4.5) / 1_000_000;
  }
  if (m.startsWith("gpt-5.4")) {
    return (usage.inputTokens * 2.5 + usage.outputTokens * 15) / 1_000_000;
  }
  // Anthropic Haiku (current Sonnet 4.5 generation rates approximated)
  if (m.includes("haiku")) {
    return (usage.inputTokens * 0.8 + usage.outputTokens * 4) / 1_000_000;
  }
  return 0;
}
