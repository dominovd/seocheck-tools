import type { NextRequest } from "next/server";
import { protectAI } from "@/lib/ai/protect";
import { callClaude } from "@/lib/anthropic-client";
import { parseJsonOutput } from "@/lib/ai/parse-json";
import { TAG_CHAR_LIMIT, totalTagChars } from "@/lib/youtube/extract-tags";

export const runtime = "edge";

type Input = { topic: string };
type Output = { tags: string[] };

const SYSTEM_PROMPT = `You generate YouTube video tags. Output JSON only — no markdown, no preamble.
Schema: {"tags": [20 to 30 strings]}
Rules:
- Mix broad terms (1-2 words) and long-tail variants (3-5 words)
- All lowercase except proper nouns and brand names
- Each tag must be a phrase a viewer might actually search for on YouTube
- No symbols, emoji, or commas inside tags
- Comma-joined total length under 480 characters (YouTube caps at 500)
- Include 2-3 common misspellings of the primary keyword if any exist
- Order: most important / highest-volume tags first`;

export async function POST(req: NextRequest) {
  return protectAI<Input, Output>(req, {
    tool: "youtube-tag-generator",
    parseInput: (body) => {
      const b = (body ?? {}) as Partial<Input>;
      if (!b.topic || typeof b.topic !== "string") {
        throw new Error("Provide a `topic` string.");
      }
      const topic = b.topic.trim();
      if (topic.length < 3) throw new Error("Topic is too short (minimum 3 characters).");
      if (topic.length > 200) throw new Error("Topic is too long (maximum 200 characters).");
      return { topic };
    },
    callModel: async ({ topic }) => {
      const result = await callClaude<Output>({
        system: SYSTEM_PROMPT,
        user: `Topic: ${topic}\n\nReturn the JSON now.`,
        maxTokens: 500,
        temperature: 0.7,
        parse: (raw) => {
          const data = parseJsonOutput<Output>(raw);
          if (!data || !Array.isArray(data.tags)) {
            throw new Error("Model returned an unexpected shape.");
          }
          // Clean + trim to 500 chars worth of tags
          const cleaned = data.tags
            .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
            .map((t) => t.trim().replace(/,/g, "")); // strip stray commas

          // Trim to fit the 500-char YouTube limit
          const fit: string[] = [];
          for (const tag of cleaned) {
            const next = [...fit, tag];
            if (totalTagChars(next) <= TAG_CHAR_LIMIT) fit.push(tag);
            else break;
          }
          return { tags: fit };
        },
      });
      return { output: result.parsed, costUsd: result.costUsd };
    },
  });
}
