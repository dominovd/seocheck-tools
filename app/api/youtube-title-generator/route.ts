import type { NextRequest } from "next/server";
import { protectAI } from "@/lib/ai/protect";
import { callClaude } from "@/lib/anthropic-client";
import { parseJsonOutput } from "@/lib/ai/parse-json";

export const runtime = "edge";

type Style =
  | "mixed"
  | "curious"
  | "listicle"
  | "howto"
  | "comparison"
  | "contrarian"
  | "story";

type Input = {
  topic: string;
  style: Style;
};

type Output = {
  titles: string[];
};

const STYLE_HINT: Record<Style, string> = {
  mixed:
    "Mix of angles: curiosity, list, how-to, comparison/vs, contrarian, and story.",
  curious: "All open-loop / curiosity-gap angles.",
  listicle: "All listicle format (e.g. '5 reasons…', '10 tips for…').",
  howto: "All how-to / tutorial framing.",
  comparison: "All comparison / vs / alternative framing.",
  contrarian: "All contrarian / counter-intuitive framing.",
  story: "All first-person story / experience framing.",
};

const SYSTEM_PROMPT = `You generate YouTube video titles. Output JSON only — no markdown fences, no preamble.
Schema: {"titles": [10 strings]}
Each title:
- 40-70 characters (YouTube's recommended display length)
- No emoji unless it genuinely fits the topic
- No clickbait that wouldn't deliver
- Written in the natural language of the topic
- Sentence case or title case — match what feels native to the niche`;

const VALID_STYLES: Style[] = [
  "mixed",
  "curious",
  "listicle",
  "howto",
  "comparison",
  "contrarian",
  "story",
];

export async function POST(req: NextRequest) {
  return protectAI<Input, Output>(req, {
    tool: "youtube-title-generator",
    parseInput: (body) => {
      const b = (body ?? {}) as Partial<Input>;
      if (!b.topic || typeof b.topic !== "string") {
        throw new Error("Provide a `topic` string.");
      }
      const topic = b.topic.trim();
      if (topic.length < 3) throw new Error("Topic is too short (minimum 3 characters).");
      if (topic.length > 200) throw new Error("Topic is too long (maximum 200 characters).");

      const style: Style = VALID_STYLES.includes(b.style as Style)
        ? (b.style as Style)
        : "mixed";

      return { topic, style };
    },
    callModel: async ({ topic, style }) => {
      const result = await callClaude<Output>({
        system: SYSTEM_PROMPT,
        user: `Topic: ${topic}\n\nStyle: ${STYLE_HINT[style]}\n\nReturn the JSON now.`,
        maxTokens: 500,
        temperature: 0.85,
        parse: (raw) => {
          const data = parseJsonOutput<Output>(raw);
          if (!data || !Array.isArray(data.titles)) {
            throw new Error("Model returned an unexpected shape.");
          }
          // Filter any non-string or empty titles defensively
          data.titles = data.titles
            .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
            .map((t) => t.trim());
          return data;
        },
      });
      return { output: result.parsed, costUsd: result.costUsd };
    },
  });
}
