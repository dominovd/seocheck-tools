# AI Cost Protection

How every AI-powered tool on this site is gated to keep the Anthropic bill
from running away.

## The stack

```
Browser → Cloudflare Turnstile widget → API route → protectAI() wrapper
                                                         │
                                                         ├── Turnstile verify
                                                         ├── Per-IP rate limit (Upstash Redis)
                                                         ├── Prompt/output cache (Upstash Redis)
                                                         ├── Daily budget headroom (Upstash Redis)
                                                         ├── Anthropic Claude Haiku 4.5
                                                         └── Record spend, write cache
```

Five independent layers between a bad actor and the Anthropic bill. Any one
of them failing still leaves four others in place.

## Why each layer exists

**Turnstile** stops automated headless browsers from hitting the API at all.
Free, ~5 ms verify time, and the widget is invisible in most cases.

**Per-IP rate limit (15/day per tool)** stops a single user — even with a
solved CAPTCHA — from running 10,000 generations and burning compute.

**Prompt cache (24 h TTL)** deduplicates identical inputs. "Generate a title
for gaming review" is asked many times per day; only the first one calls the
model.

**Daily budget cap (default $5)** is the backstop. If a coordinated attacker
defeats Turnstile (paid CAPTCHA-solving services exist) and rotates IPs to
defeat rate limits, the global ceiling stops the bleeding at the configured
amount. Once hit, every AI endpoint returns 503 until UTC midnight.

**Claude Haiku 4.5** is the cheapest production-grade Anthropic model.
Pricing (as of 2026-05): $1/MTok input, $5/MTok output. Typical short
generation (~500 input + ~300 output tokens) costs ~$0.0015.

## Worst-case math

100 unique IPs × 15 generations × $0.003 average = $4.50/day.

Budget cap kicks in at $5, so the next request returns 503. Bot abuse
beyond this point produces only 503s, not API calls.

## Wiring a new AI tool

```ts
// app/api/youtube-title-generator/route.ts
import type { NextRequest } from "next/server";
import { protectAI } from "@/lib/ai/protect";
import { callClaude } from "@/lib/anthropic-client";

export const runtime = "edge";

type Input = { topic: string; style?: string };
type Output = { titles: string[] };

export async function POST(req: NextRequest) {
  return protectAI<Input, Output>(req, {
    tool: "youtube-title-generator",

    parseInput: (body) => {
      const b = body as Partial<Input>;
      if (!b.topic || typeof b.topic !== "string" || b.topic.length > 200) {
        throw new Error("Provide a topic (up to 200 characters).");
      }
      return { topic: b.topic.trim(), style: b.style };
    },

    callModel: async ({ topic, style }) => {
      const result = await callClaude<Output>({
        system: "You are a YouTube SEO expert. Return only JSON.",
        user: `Generate 10 click-worthy YouTube titles for: ${topic}${
          style ? ` (style: ${style})` : ""
        }. Reply with JSON: {"titles": ["...", ...]}.`,
        maxTokens: 400,
        parse: (raw) => JSON.parse(raw) as Output,
      });
      return { output: result.parsed, costUsd: result.costUsd };
    },
  });
}
```

That's the whole route. The protect layer handles everything else.

## Client side: sending the request

```tsx
"use client";
import { useState } from "react";
import { TurnstileWidget } from "@/components/TurnstileWidget";

export function TitleGeneratorForm() {
  const [token, setToken] = useState<string | null>(null);
  const [topic, setTopic] = useState("");

  async function submit() {
    const res = await fetch("/api/youtube-title-generator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turnstileToken: token,
        input: { topic },
      }),
    });
    const data = await res.json();
    // handle data.output, data.error, etc.
  }

  return (
    <>
      <input value={topic} onChange={(e) => setTopic(e.target.value)} />
      <TurnstileWidget onToken={setToken} />
      <button disabled={!token} onClick={submit}>Generate</button>
    </>
  );
}
```

## Error codes (stable)

| Code               | HTTP | Meaning                                   |
| ------------------ | ---- | ----------------------------------------- |
| `invalid-input`    | 400  | parseInput threw                          |
| `turnstile-failed` | 400  | CAPTCHA token missing/invalid             |
| `rate-limited`     | 429  | Per-IP daily quota for this tool used up  |
| `budget-exhausted` | 503  | Global daily AI budget cap hit            |
| `model-error`      | 502  | Anthropic call failed or output unparseable |
| `server-error`     | 500  | Anything else                             |

UX should treat 429 and 503 differently — 429 is the user's fault (and resets
at UTC midnight), 503 is ours (and resets the same way, with no individual
action available).

## Environment variables

See `.env.example`. The full set required for AI tools to function:

```
ANTHROPIC_API_KEY=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
AI_DAILY_BUDGET_USD=5
```

In development without Turnstile keys set, the verify step is bypassed so
you can iterate locally. Production hard-requires all keys.

## Future tuning

Once AdSense + affiliate revenue covers compute costs:

- Raise per-IP limit from 15 → 25 or 30
- Raise budget cap from $5 → $30/day or higher
- Consider a paid tier that bypasses the rate limit
- Add per-tool overrides where appropriate (cheap tools can have higher
  per-IP limits; expensive ones lower)
