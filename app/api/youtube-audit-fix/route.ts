import type { NextRequest } from "next/server";
import { protectAI } from "@/lib/ai/protect";
import { callClaude } from "@/lib/anthropic-client";
import { parseJsonOutput } from "@/lib/ai/parse-json";
import type {
  PublicAuditDimension,
  PublicVideoAuditResult,
} from "@/lib/youtube/video-audit";

export const runtime = "edge";

/**
 * AI Audit Fix orchestrator.
 *
 * Single endpoint that takes a completed VideoAuditResult and returns
 * targeted replacements for ONLY the dimensions the audit marked as
 * weak or fair. One Haiku call returns a JSON package — title, description,
 * tags, hashtags — so the visitor can fix every weakness in one click
 * instead of bouncing through 4 separate generator tools.
 *
 * Why one call, not parallel calls to each generator: single Anthropic
 * round-trip is cheaper (one set of system tokens), more coherent (the
 * model sees all dimensions together and aligns the fixes to each
 * other), and dramatically simpler UX (one Turnstile, one rate limit,
 * one cost line).
 *
 * Cost: ~600-800 input + 600 output tokens for a fully-broken audit.
 * Best case ~$0.005, worst case ~$0.012. Already covered by the global
 * daily AI budget cap.
 *
 * Strong dimensions return as null — we don't ask the model to rewrite
 * what's already working.
 */

type FixInput = {
  /** Whole audit result from /api/youtube-video-audit (public, sanitized shape) */
  audit: PublicVideoAuditResult;
  /** Current description from the user's YouTube video, for context */
  currentDescription?: string;
};

export type FixPackage = {
  title: string | null;
  description: string | null;
  tags: string[] | null;
  hashtags: string[] | null;
  /** Short note from the model explaining what it changed and why */
  notes: string | null;
};

const SYSTEM_PROMPT = `You are a YouTube SEO coach. You receive a video's current metadata + an audit identifying which dimensions are weak. You return targeted replacements for ONLY the weak/fair dimensions.

Output JSON only — no markdown, no preamble:
{
  "title": "improved title (40-70 chars, clear angle)" | null,
  "description": "improved description (150-300 words, first 150 chars hook viewer)" | null,
  "tags": ["tag1", "tag2", ...10-20 tags] | null,
  "hashtags": ["#tag1", ...3-5 hashtags] | null,
  "notes": "one-line note on what changed and why"
}

CRITICAL: Set a field to null if the audit marks that dimension as Strong or Good. Don't waste effort rewriting what's already working.

For each dimension you DO fix:
- title: 40-70 chars, clear angle (curiosity/listicle/how-to/comparison), no clickbait that won't deliver
- description: 150-300 words. First 150 chars hook the viewer (shown above the "...more" fold). Include the keyword early. End with a soft CTA.
- tags: mix of broad + 30% long-tail (3+ word phrases). 10-20 tags total. Stay under 500 chars total.
- hashtags: 3-5 hashtags, the first 3 render above the title — make those the highest-impact.

All output must align around the new (or existing) title so the package is cohesive — don't write a description for a different video than the title.`;

export async function POST(req: NextRequest) {
  return protectAI<FixInput, FixPackage>(req, {
    tool: "youtube-audit-fix",
    dailyLimit: 10,
    parseInput: (body) => {
      const b = (body ?? {}) as Partial<FixInput>;
      if (!b.audit || typeof b.audit !== "object") {
        throw new Error("Provide an `audit` object from a completed Video Audit.");
      }
      // Minimal shape check
      const a = b.audit as PublicVideoAuditResult;
      if (!a.meta || !Array.isArray(a.dimensions)) {
        throw new Error("Audit shape is invalid — re-run the Video Audit first.");
      }
      if (!a.meta.title) {
        throw new Error("Audit has no video title — can't generate a coherent fix package.");
      }
      // Need at least one dimension with bad/warn signals to fix
      const hasWeakness = a.dimensions.some((d) =>
        d.signals.some((s) => s.kind === "bad" || s.kind === "warn")
      );
      if (!hasWeakness) {
        throw new Error("Nothing to fix — no bad or warning signals in any dimension.");
      }
      return {
        audit: a,
        currentDescription: typeof b.currentDescription === "string" ? b.currentDescription : undefined,
      };
    },
    callModel: async ({ audit, currentDescription }) => {
      const userMessage = buildUserMessage(audit, currentDescription);
      const result = await callClaude<FixPackage>({
        system: SYSTEM_PROMPT,
        user: userMessage,
        maxTokens: 1500,
        temperature: 0.7,
        parse: (raw) => {
          const data = parseJsonOutput<FixPackage>(raw);
          if (!data) throw new Error("Fix package returned an unexpected shape.");
          // Validate + sanitize fields
          return {
            title: typeof data.title === "string" && data.title.trim() ? data.title.trim() : null,
            description: typeof data.description === "string" && data.description.trim() ? data.description.trim() : null,
            tags: Array.isArray(data.tags)
              ? data.tags.filter((t): t is string => typeof t === "string" && t.trim().length > 0).map((t) => t.trim()).slice(0, 25)
              : null,
            hashtags: Array.isArray(data.hashtags)
              ? data.hashtags
                  .filter((h): h is string => typeof h === "string" && h.trim().length > 0)
                  .map((h) => {
                    const t = h.trim();
                    return t.startsWith("#") ? t : `#${t}`;
                  })
                  .slice(0, 8)
              : null,
            notes: typeof data.notes === "string" && data.notes.trim() ? data.notes.trim() : null,
          };
        },
      });
      return { output: result.parsed, costUsd: result.costUsd };
    },
  });
}

function buildUserMessage(audit: PublicVideoAuditResult, currentDescription?: string): string {
  const lines: string[] = [];
  lines.push(`Current title: "${audit.meta.title}"`);
  if (currentDescription) {
    const truncated = currentDescription.length > 800 ? currentDescription.slice(0, 800) + "…" : currentDescription;
    lines.push(`\nCurrent description (truncated):\n${truncated}`);
  }
  lines.push(`\nPer-dimension signals:`);
  for (const d of audit.dimensions) {
    lines.push(formatDimension(d));
  }
  lines.push(
    `\nReturn the JSON now. Only rewrite dimensions with BAD or WARN signals — leave dimensions with only GOOD/INFO signals as null.`
  );
  return lines.join("\n");
}

function formatDimension(d: PublicAuditDimension): string {
  const badCount = d.signals.filter((s) => s.kind === "bad").length;
  const warnCount = d.signals.filter((s) => s.kind === "warn").length;
  const goodCount = d.signals.filter((s) => s.kind === "good").length;
  const needsFix = badCount > 0 || warnCount > 0;
  const signalLine = d.signals
    .slice(0, 3)
    .map((s) => `  - ${s.kind.toUpperCase()}: ${s.message}`)
    .join("\n");
  return `${d.label} (${badCount} bad, ${warnCount} warn, ${goodCount} good — ${
    needsFix ? "FIX THIS" : "OK, skip"
  })\n${signalLine}`;
}
