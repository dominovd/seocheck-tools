import type { NextRequest } from "next/server";
import { protectAI } from "@/lib/ai/protect";
import { callClaude } from "@/lib/anthropic-client";
import { parseJsonOutput } from "@/lib/ai/parse-json";

export const runtime = "edge";

type Format =
  | "mixed"
  | "tutorial"
  | "deepdive"
  | "listicle"
  | "experiment"
  | "comparison"
  | "review";

type Input = {
  niche: string;
  format: Format;
};

type VideoIdea = {
  title: string;
  premise: string;
};

type Output = {
  ideas: VideoIdea[];
};

const FORMAT_HINT: Record<Format, string> = {
  mixed: "Mix formats: tutorial, deep-dive, listicle, experiment, comparison, review.",
  tutorial: "All tutorials / how-to videos.",
  deepdive: "All deep-dive / explainer videos.",
  listicle: "All listicle / numbered-list videos.",
  experiment: "All experiment / 'I tried this for X days' videos.",
  comparison: "All comparison / versus / showdown videos.",
  review: "All review videos — products, services, tools.",
};

const VALID_FORMATS: Format[] = [
  "mixed",
  "tutorial",
  "deepdive",
  "listicle",
  "experiment",
  "comparison",
  "review",
];

const SYSTEM_PROMPT = `You generate YouTube video ideas. Output JSON only — no markdown, no preamble.

Schema:
{"ideas": [exactly 10 objects of shape {"title": string, "premise": string}]}

Rules per idea:
- title: a working video title (50-65 characters, click-worthy but honest)
- premise: 1-2 sentences explaining the angle and what the viewer would actually see/learn
- Ideas should cover different angles: avoid 10 variations of the same idea
- Match the chosen format — if "all tutorials", every idea must be tutorial-shaped
- Skip generic ideas a beginner would think of in 30 seconds — give creators ideas they'd actually use`;

export async function POST(req: NextRequest) {
  return protectAI<Input, Output>(req, {
    tool: "youtube-video-idea-generator",
    parseInput: (body) => {
      const b = (body ?? {}) as Partial<Input>;
      if (!b.niche || typeof b.niche !== "string") {
        throw new Error("Provide a `niche` string.");
      }
      const niche = b.niche.trim();
      if (niche.length < 3) throw new Error("Niche is too short (min 3 chars).");
      if (niche.length > 200) throw new Error("Niche is too long (max 200 chars).");
      const format: Format = VALID_FORMATS.includes(b.format as Format)
        ? (b.format as Format)
        : "mixed";
      return { niche, format };
    },
    callModel: async ({ niche, format }) => {
      const result = await callClaude<Output>({
        system: SYSTEM_PROMPT,
        user: `Niche / channel topic: ${niche}\n\nFormat: ${FORMAT_HINT[format]}\n\nReturn the JSON now.`,
        maxTokens: 900,
        temperature: 0.9,
        parse: (raw) => {
          const data = parseJsonOutput<Output>(raw);
          if (!data || !Array.isArray(data.ideas)) {
            throw new Error("Model returned an unexpected shape.");
          }
          data.ideas = data.ideas
            .filter(
              (idea): idea is VideoIdea =>
                idea !== null &&
                typeof idea === "object" &&
                typeof (idea as VideoIdea).title === "string" &&
                typeof (idea as VideoIdea).premise === "string"
            )
            .map((idea) => ({
              title: idea.title.trim(),
              premise: idea.premise.trim(),
            }))
            .filter((idea) => idea.title.length > 0 && idea.premise.length > 0);
          return data;
        },
      });
      return { output: result.parsed, costUsd: result.costUsd };
    },
  });
}
