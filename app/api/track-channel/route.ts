import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { trackChannel } from "@/lib/tracking/tracked-channels";
import { getClientIp } from "@/lib/ai/get-client-ip";
import { checkRateLimit } from "@/lib/ai/rate-limit";

export const runtime = "edge";

/**
 * Track-this-channel endpoint.
 *
 * Adds a channel to the weekly re-audit set. Cheap (single ZADD).
 * Rate-limited per IP to prevent abuse of the bounded set.
 */

const DAILY_LIMIT = 20;
const RATE_LIMIT_KEY = "track-channel";
const CHANNEL_ID_RE = /^UC[A-Za-z0-9_-]{22}$/;

type Body = { channelId?: string };

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return jsonError("invalid-input", "Request body is not valid JSON.", 400);
  }

  const channelId = (body.channelId ?? "").trim();
  if (!CHANNEL_ID_RE.test(channelId)) {
    return jsonError(
      "invalid-input",
      "Provide a valid YouTube channel ID (starts with UC, 24 characters).",
      400
    );
  }

  const ip = getClientIp(req);
  const rl = await checkRateLimit(RATE_LIMIT_KEY, ip, DAILY_LIMIT);
  if (!rl.allowed) {
    return jsonError(
      "rate-limited",
      `Too many tracking requests today (max ${DAILY_LIMIT}). Resets at UTC midnight.`,
      429
    );
  }

  try {
    const result = await trackChannel(channelId);
    return NextResponse.json({ ok: result.added });
  } catch {
    return jsonError("store-failed", "Couldn't save the tracking request.", 502);
  }
}

function jsonError(code: string, message: string, status: number): Response {
  return NextResponse.json({ error: message, code }, { status });
}
