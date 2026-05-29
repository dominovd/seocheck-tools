import type { NextRequest } from "next/server";
import { protectAI } from "@/lib/ai/protect";
import { callClaude } from "@/lib/anthropic-client";
import { parseJsonOutput } from "@/lib/ai/parse-json";

export const runtime = "edge";

type Input = {
  brief: string;
  channelName?: string;
};

type Output = {
  description: string;
  hashtags: string[];
};

const SYSTEM_PROMPT = `You generate YouTube video descriptions. Output JSON only — no markdown fences, no preamble.

Schema:
{"description": "the full description as one string with \\n line breaks", "hashtags": [exactly 3 strings without the # prefix]}

Structure the description in this exact order, separated by blank lines:

1. HOOK (1-2 lines): What the viewer will get from watching. Direct, no clickbait. Mention key value upfront because YouTube only shows the first ~120 characters in search results.

2. BODY (2-3 short paragraphs): Expand on the video content. Mention the topic naturally so YouTube understands what the video is about. Avoid keyword stuffing.

3. CHAPTERS PLACEHOLDER block, exactly:
⏱️ Chapters
0:00 Intro
[add your chapter timestamps here]

4. CALL TO ACTION (1-2 lines): Friendly nudge to subscribe / like / comment. Natural language, not aggressive.

5. HASHTAG LINE: three hashtags joined by spaces (e.g. "#topic #niche #channel")

Tone: match the niche. Tech = informative. Lifestyle = warm. Gaming = casual.
No emoji except the ⏱️ on the chapters line and natural mentions.`;

export async function POST(req: NextRequest) {
  return protectAI<Input, Output>(req, {
    tool: "youtube-description-generator",
    parseInput: (body) => {
      const b = (body ?? {}) as Partial<Input>;
      if (!b.brief || typeof b.brief !== "string") {
        throw new Error("Provide a `brief` describing your video.");
      }
      const brief = b.brief.trim();
      if (brief.length < 10)
        throw new Error("Brief is too short — give a couple of sentences about your video.");
      if (brief.length > 800)
        throw new Error("Brief is too long (max 800 characters).");

      const channelName =
        typeof b.channelName === "string" && b.channelName.trim().length > 0
          ? b.channelName.trim().slice(0, 80)
          : undefined;

      return { brief, channelName };
    },
    callModel: async ({ brief, channelName }) => {
      const userPrompt = [
        `Video brief: ${brief}`,
        channelName ? `Channel name: ${channelName}` : null,
        ``,
        `Return the JSON now.`,
      ]
        .filter(Boolean)
        .join("\n");

      const result = await callClaude<Output>({
        system: SYSTEM_PROMPT,
        user: userPrompt,
        maxTokens: 900,
        temperature: 0.75,
        parse: (raw) => {
          const data = parseJsonOutput<Output>(raw);
          if (
            !data ||
            typeof data.description !== "string" ||
            !Array.isArray(data.hashtags)
          ) {
            throw new Error("Model returned an unexpected shape.");
          }
          // Clean hashtags: strip leading #, lowercase, trim
          data.hashtags = data.hashtags
            .filter((h): h is string => typeof h === "string")
            .map((h) => h.trim().replace(/^#+/, ""))
            .filter(Boolean)
            .slice(0, 3);
          return data;
        },
      });
      return { output: result.parsed, costUsd: result.costUsd };
    },
  });
}
