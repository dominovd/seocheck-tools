import type { NextRequest } from "next/server";
import { protectAI } from "@/lib/ai/protect";
import { callClaude } from "@/lib/anthropic-client";
import { parseJsonOutput } from "@/lib/ai/parse-json";

export const runtime = "edge";

type Style =
  | "mixed"
  | "short"
  | "descriptive"
  | "personality"
  | "playful"
  | "professional";

type Input = {
  niche: string;
  style: Style;
  creatorName?: string;
};

type NameIdea = {
  name: string;
  rationale: string;
};

type Output = {
  names: NameIdea[];
};

const STYLE_HINT: Record<Style, string> = {
  mixed: "Mix of styles: short/brandable, descriptive, personality-driven, playful, professional.",
  short: "Short and brandable — 1-2 words, made-up words OK, easy to say and spell.",
  descriptive: "Descriptive — clearly tells viewers what the channel is about.",
  personality: "Personality-driven — incorporates the creator's name or a persona.",
  playful: "Playful — puns, wordplay, unexpected combinations.",
  professional: "Professional — feels corporate, authoritative, agency-grade.",
};

const VALID_STYLES: Style[] = [
  "mixed",
  "short",
  "descriptive",
  "personality",
  "playful",
  "professional",
];

const SYSTEM_PROMPT = `You generate YouTube channel name ideas. Output JSON only — no markdown, no preamble.

Schema:
{"names": [exactly 10 objects of shape {"name": string, "rationale": string}]}

Rules per name:
- name: a YouTube channel name (2-30 characters). Title case or natural casing.
- rationale: 1 sentence explaining the vibe / why it fits the niche.
- Avoid trademarks, real company names, and exact existing-channel names you can think of.
- Mix made-up brandable names with descriptive ones.
- Don't suggest names that won't fit on a YouTube banner (too long).
- For personality style: if a creator name is provided, weave it in 5-6 of the 10.`;

export async function POST(req: NextRequest) {
  return protectAI<Input, Output>(req, {
    tool: "youtube-channel-name-generator",
    parseInput: (body) => {
      const b = (body ?? {}) as Partial<Input>;
      if (!b.niche || typeof b.niche !== "string") {
        throw new Error("Provide a `niche` string.");
      }
      const niche = b.niche.trim();
      if (niche.length < 3) throw new Error("Niche is too short (min 3 chars).");
      if (niche.length > 200) throw new Error("Niche is too long (max 200 chars).");
      const style: Style = VALID_STYLES.includes(b.style as Style)
        ? (b.style as Style)
        : "mixed";
      const creatorName =
        typeof b.creatorName === "string" && b.creatorName.trim().length > 0
          ? b.creatorName.trim().slice(0, 40)
          : undefined;
      return { niche, style, creatorName };
    },
    callModel: async ({ niche, style, creatorName }) => {
      const userPrompt = [
        `Channel niche: ${niche}`,
        `Style: ${STYLE_HINT[style]}`,
        creatorName ? `Creator name: ${creatorName}` : null,
        ``,
        `Return the JSON now.`,
      ]
        .filter(Boolean)
        .join("\n");

      const result = await callClaude<Output>({
        system: SYSTEM_PROMPT,
        user: userPrompt,
        maxTokens: 800,
        temperature: 0.95,
        parse: (raw) => {
          const data = parseJsonOutput<Output>(raw);
          if (!data || !Array.isArray(data.names)) {
            throw new Error("Model returned an unexpected shape.");
          }
          data.names = data.names
            .filter(
              (n): n is NameIdea =>
                n !== null &&
                typeof n === "object" &&
                typeof (n as NameIdea).name === "string" &&
                typeof (n as NameIdea).rationale === "string"
            )
            .map((n) => ({
              name: n.name.trim().slice(0, 40),
              rationale: n.rationale.trim(),
            }))
            .filter((n) => n.name.length >= 2);
          return data;
        },
      });
      return { output: result.parsed, costUsd: result.costUsd };
    },
  });
}
