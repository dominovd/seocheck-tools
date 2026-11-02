import type { NextRequest } from "next/server";
import { protectAI } from "@/lib/ai/protect";
import { callClaude } from "@/lib/anthropic-client";
import { parseJsonOutput } from "@/lib/ai/parse-json";
import {
  TAG_GROUP_LIMITS,
  TAG_GROUP_ORDER,
  type TagGroupId,
  type TagGroups,
} from "@/lib/youtube/tag-groups";

export const runtime = "edge";

/**
 * `v` is part of the parsed input so it is part of the cache hash.
 * Bump it whenever the output shape changes, otherwise cached v1
 * responses ({ tags: string[] }) would be served to the v2 client.
 */
type Input = { v: 2; topic: string; title?: string };
type Output = { groups: TagGroups };

const SYSTEM_PROMPT = `You generate YouTube video tags, grouped by the job each tag does. Output JSON only, no markdown, no preamble.
Schema: {"primary": [strings], "specific": [strings], "broad": [strings], "variants": [strings]}
Groups:
- primary: 2-3 tags. The exact phrase the video answers and its closest rewordings.
- specific: 5-8 tags. Long-tail searches (3-6 words) this exact video answers: skill level, tool, goal, format.
- broad: 2-4 tags. 1-2 word category terms that place the video in its topic.
- variants: 0-4 tags. Only real common misspellings, spacing variants, or British/American spellings of the primary keyword. Empty array if none exist.
Rules:
- Every tag is a phrase a viewer would actually type into YouTube search
- All lowercase except proper nouns and brand names
- No symbols, emoji, hashtags, or commas inside tags
- No tag repeated across groups
- If a video title is given, the primary group uses the same wording as the title for the main topic
- Write tags in the language of the topic`;

function clean(list: unknown, seen: Set<string>, max: number): string[] {
  if (!Array.isArray(list)) return [];
  const out: string[] = [];
  for (const raw of list) {
    if (typeof raw !== "string") continue;
    const tag = raw.replace(/[,#]/g, "").replace(/\s+/g, " ").trim();
    if (!tag || tag.length > 100) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
    if (out.length >= max) break;
  }
  return out;
}

export async function POST(req: NextRequest) {
  return protectAI<Input, Output>(req, {
    tool: "youtube-tag-generator",
    parseInput: (body) => {
      const b = (body ?? {}) as { topic?: unknown; title?: unknown };
      if (!b.topic || typeof b.topic !== "string") {
        throw new Error("Provide a `topic` string.");
      }
      const topic = b.topic.trim();
      if (topic.length < 3) throw new Error("Topic is too short (minimum 3 characters).");
      if (topic.length > 200) throw new Error("Topic is too long (maximum 200 characters).");
      const title = typeof b.title === "string" ? b.title.trim().slice(0, 100) : "";
      return title ? { v: 2, topic, title } : { v: 2, topic };
    },
    callModel: async ({ topic, title }) => {
      const user = title
        ? `Topic: ${topic}\nVideo title: ${title}\n\nReturn the JSON now.`
        : `Topic: ${topic}\n\nReturn the JSON now.`;
      const result = await callClaude<Output>({
        system: SYSTEM_PROMPT,
        user,
        maxTokens: 600,
        temperature: 0.7,
        parse: (raw) => {
          const data = parseJsonOutput<Record<TagGroupId, unknown>>(raw);
          if (!data || typeof data !== "object") {
            throw new Error("Model returned an unexpected shape.");
          }
          const seen = new Set<string>();
          const groups = {} as TagGroups;
          for (const id of TAG_GROUP_ORDER) {
            groups[id] = clean(data[id], seen, TAG_GROUP_LIMITS[id]);
          }
          if (groups.primary.length === 0 && groups.specific.length === 0) {
            throw new Error("Model returned no usable tags.");
          }
          return { groups };
        },
      });
      return { output: result.parsed, costUsd: result.costUsd };
    },
  });
}
