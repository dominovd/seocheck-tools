import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getHistory, isTracked } from "@/lib/tracking/tracked-channels";

export const runtime = "edge";

/**
 * Channel history reader.
 *
 * Returns the time-series Visibility-Score snapshots collected by the
 * weekly cron for the given channel ID. Lightweight (single LRANGE),
 * public — no rate limit needed.
 */

const CHANNEL_ID_RE = /^UC[A-Za-z0-9_-]{22}$/;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channelId = (searchParams.get("channelId") ?? "").trim();
  if (!CHANNEL_ID_RE.test(channelId)) {
    return NextResponse.json(
      { error: "Provide a valid channelId (UC… 24 chars).", code: "invalid-input" },
      { status: 400 }
    );
  }

  try {
    const [history, tracked] = await Promise.all([
      getHistory(channelId),
      isTracked(channelId),
    ]);
    return NextResponse.json({ channelId, tracked, history });
  } catch {
    return NextResponse.json(
      { error: "Couldn't read channel history.", code: "store-failed" },
      { status: 502 }
    );
  }
}
