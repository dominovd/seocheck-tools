/**
 * Verify a Cloudflare Turnstile token server-side.
 *
 * Turnstile is Cloudflare's CAPTCHA alternative. The browser solves a
 * passive challenge and gets a one-time token; we POST it to Cloudflare
 * to confirm it's legitimate before processing the API request.
 *
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type SiteVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
};

export async function verifyTurnstile(
  token: string | null | undefined,
  clientIp: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // In local dev without Turnstile configured, allow through with or
  // without a token to make development possible. PRODUCTION must always
  // have TURNSTILE_SECRET_KEY set, and tokens are required there.
  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      return { ok: true };
    }
    return { ok: false, reason: "server-not-configured" };
  }

  if (!token) return { ok: false, reason: "missing-token" };

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: clientIp,
  });

  const res = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) return { ok: false, reason: `verify-http-${res.status}` };

  const data = (await res.json()) as SiteVerifyResponse;
  if (data.success) return { ok: true };

  return {
    ok: false,
    reason: (data["error-codes"] ?? ["unknown"]).join(","),
  };
}
