import type { NextRequest } from "next/server";

/**
 * Extract the client IP from a Next.js request.
 *
 * On Vercel:
 *  - `x-forwarded-for` is set with a comma-separated list; the leftmost is
 *    the original client. The rightmost entries are added by intermediate proxies.
 *  - `x-real-ip` is set by Vercel's edge to the immediate client IP.
 *
 * Local dev returns "127.0.0.1" so rate limits still work consistently.
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}
