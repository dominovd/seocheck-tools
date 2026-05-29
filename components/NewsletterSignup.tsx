"use client";

import { useState, type FormEvent } from "react";
import { Mail, Check, Loader2, AlertCircle } from "lucide-react";
import { track } from "@/lib/analytics/track";

type Props = {
  /** Where in the site this form sits — used for analytics segmentation. */
  source: string;
  /** Compact ("inline") variant uses smaller padding; "card" gets full styling. */
  variant?: "inline" | "card";
  /** Optional title/subtitle for the card variant. */
  title?: string;
  subtitle?: string;
  className?: string;
};

type ApiResponse =
  | { ok: true; alreadySubscribed: boolean; message: string }
  | { error: string; code?: string };

/**
 * Newsletter signup form. POSTs to /api/newsletter which stores emails
 * directly in Upstash Redis. No third-party provider integration yet —
 * this captures early-interest addresses so we can migrate to
 * Buttondown / Beehiiv / etc. later with the list already in hand.
 */
export function NewsletterSignup({
  source,
  variant = "card",
  title = "Get notified when we ship new tools",
  subtitle = "Occasional emails — never more than monthly, never sold.",
  className = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ alreadySubscribed: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Signup failed.");
        return;
      }
      setDone({ alreadySubscribed: data.alreadySubscribed, message: data.message });
      track("newsletter_signup", { source, already_subscribed: data.alreadySubscribed });
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50/60 px-4 py-3 text-sm text-brand-800 ${className}`}
      >
        <Check className="h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.5} />
        <span>{done.message}</span>
      </div>
    );
  }

  const isCard = variant === "card";

  return (
    <div
      className={`${
        isCard
          ? "rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
          : ""
      } ${className}`}
    >
      {isCard && (
        <>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-brand-600" strokeWidth={2} />
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Newsletter
            </p>
          </div>
          <h3 className="mt-2 text-base font-semibold text-gray-900 sm:text-lg">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        </>
      )}

      <form
        onSubmit={submit}
        className={`${isCard ? "mt-4" : ""} flex flex-col gap-2 sm:flex-row sm:gap-2`}
      >
        <input
          type="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          disabled={!email.trim() || loading}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              Subscribing
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>

      {error && (
        <div className="mt-2 flex items-start gap-1.5 text-xs text-red-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      {!isCard && !error && (
        <p className="mt-2 text-xs text-gray-500">
          Occasional emails — never more than monthly, never sold.
        </p>
      )}
    </div>
  );
}
