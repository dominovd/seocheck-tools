import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { redis, KEY_PREFIX } from "@/lib/upstash";
import { getClientIp } from "@/lib/ai/get-client-ip";
import { checkRateLimit } from "@/lib/ai/rate-limit";

export const runtime = "edge";

/**
 * Newsletter signup endpoint — lazy MVP.
 *
 * Stores emails directly in Upstash Redis (`seo:newsletter:emails` set
 * for dedup + `seo:newsletter:meta:<email>` hash for signup_at +
 * source). No third-party newsletter provider integration yet — when we
 * pick Buttondown/Beehiiv, migrate by piping the set through their API.
 *
 * This pattern lets us capture early-interest emails immediately
 * without blocking on the provider decision.
 *
 * Protected by:
 *  - Per-IP daily rate limit (10/day — single human shouldn't sign up
 *    more than that)
 *  - Email format validation
 */

const DAILY_LIMIT = 10;
const RATE_LIMIT_KEY = "newsletter-signup";
const SET_KEY = `${KEY_PREFIX}newsletter:emails`;
const META_KEY = (email: string) => `${KEY_PREFIX}newsletter:meta:${email}`;

// Minimal RFC-5322-compatible check — server-side complement to browser validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = { email?: string; source?: string };

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return jsonError("invalid-input", "Request body is not valid JSON.", 400);
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return jsonError("invalid-input", "That doesn't look like a valid email address.", 400);
  }

  const source = (body.source ?? "unknown").slice(0, 64);

  // Rate limit by IP
  const ip = getClientIp(req);
  const rl = await checkRateLimit(RATE_LIMIT_KEY, ip, DAILY_LIMIT);
  if (!rl.allowed) {
    return jsonError(
      "rate-limited",
      "Too many signup attempts today — try again tomorrow.",
      429
    );
  }

  // Already subscribed?
  try {
    const alreadyMember = await redis().sismember(SET_KEY, email);
    if (alreadyMember) {
      return NextResponse.json({
        ok: true,
        alreadySubscribed: true,
        message: "You're already on the list — thanks!",
      });
    }

    // Add to the set + write meta
    await Promise.all([
      redis().sadd(SET_KEY, email),
      redis().hset(META_KEY(email), {
        signup_at: new Date().toISOString(),
        source,
        ip_hash: await hashIp(ip),
      }),
    ]);

    return NextResponse.json({
      ok: true,
      alreadySubscribed: false,
      message: "Subscribed — we'll email when there's something worth reading.",
    });
  } catch {
    return jsonError(
      "store-failed",
      "Couldn't save your signup right now. Try again in a moment.",
      502
    );
  }
}

/**
 * Hash the IP so we keep abuse-detection data without storing raw IPs.
 * Matches the privacy-first stance in the public Privacy page.
 */
async function hashIp(ip: string): Promise<string> {
  const encoded = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function jsonError(code: string, message: string, status: number): Response {
  return NextResponse.json({ error: message, code }, { status });
}
