import type { NextRequest } from "next/server";
import { protectAI } from "@/lib/ai/protect";
import { callClaude } from "@/lib/anthropic-client";
import { parseJsonOutput } from "@/lib/ai/parse-json";

export const runtime = "edge";

type Input = { topic: string };

type HashtagItem = {
  tag: string;
  competition: "low" | "medium" | "high";
};

type Output = {
  hashtags: HashtagItem[];
};

const SYSTEM_PROMPT = `You generate YouTube hashtags. Output JSON only — no markdown, no preamble.

Schema:
{"hashtags": [15 objects with shape {"tag": string, "competition": "low" | "medium" | "high"}]}

Rules:
- Each tag is a single hashtag WITHOUT the leading # (we add it on display)
- All lowercase except brand names
- No spaces, hyphens, or special chars in the tag itself
- Mix the competition tiers: ~5 high (broad, popular), ~5 medium, ~5 low (niche-specific)
- Order by usefulness for the topic — most relevant first, not by competition
- Estimate competition based on how saturated the term is on YouTube as a hashtag (gaming = high, "mechanicalkeyboardrgb" = low)
- Include 1-2 obvious primary keyword + a couple of long-tail compounds
- No spammy hashtags like "fyp" or "viral" unless they truly fit`;

export async function POST(req: NextRequest) {
  return protectAI<Input, Output>(req, {
    tool: "youtube-hashtag-generator",
    parseInput: (body) => {
      const b = (body ?? {}) as Partial<Input>;
      if (!b.topic || typeof b.topic !== "string") {
        throw new Error("Provide a `topic` string.");
      }
      const topic = b.topic.trim();
      if (topic.length < 3) throw new Error("Topic is too short (min 3 characters).");
      if (topic.length > 200) throw new Error("Topic is too long (max 200 characters).");
      return { topic };
    },
    callModel: async ({ topic }) => {
      const result = await callClaude<Output>({
        system: SYSTEM_PROMPT,
        user: `Topic: ${topic}\n\nReturn the JSON now.`,
        maxTokens: 600,
        temperature: 0.6,
        parse: (raw) => {
          const data = parseJsonOutput<Output>(raw);
          if (!data || !Array.isArray(data.hashtags)) {
            throw new Error("Model returned an unexpected shape.");
          }
          data.hashtags = data.hashtags
            .filter(
              (h): h is HashtagItem =>
                h !== null &&
                typeof h === "object" &&
                typeof (h as HashtagItem).tag === "string" &&
                ["low", "medium", "high"].includes((h as HashtagItem).competition)
            )
            .map((h) => ({
              tag: h.tag
                .trim()
                .replace(/^#+/, "")
                .replace(/\s+/g, "")
                .replace(/[^\w]/g, "")
                .toLowerCase()
                .slice(0, 40),
              competition: h.competition,
            }))
            .filter((h) => h.tag.length > 0);
          return data;
        },
      });
      return { output: result.parsed, costUsd: result.costUsd };
    },
  });
}
