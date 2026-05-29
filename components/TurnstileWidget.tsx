"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile invisible-ish CAPTCHA widget.
 *
 * Renders the challenge container and calls `onToken` with the verified
 * token once the user passes (passively, in most cases). Pass that token
 * to your AI API route alongside the form input.
 *
 * https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible" | "invisible";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

type TurnstileWidgetProps = {
  onToken: (token: string) => void;
  onExpired?: () => void;
  size?: "normal" | "compact" | "flexible" | "invisible";
  className?: string;
};

export function TurnstileWidget({
  onToken,
  onExpired,
  size = "flexible",
  className,
}: TurnstileWidgetProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!ref.current || !siteKey) return;
    if (!window.turnstile) return; // script not ready yet

    widgetIdRef.current = window.turnstile.render(ref.current, {
      sitekey: siteKey,
      callback: onToken,
      "expired-callback": onExpired,
      size,
      theme: "light",
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (!siteKey) {
    // Dev environment without Turnstile configured.
    if (process.env.NODE_ENV !== "production") {
      return (
        <p className="text-xs text-gray-400">
          Turnstile site key not set. Bot protection disabled in development.
        </p>
      );
    }
    return null;
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Re-trigger render once the script lands
          if (ref.current && window.turnstile && !widgetIdRef.current) {
            widgetIdRef.current = window.turnstile.render(ref.current, {
              sitekey: siteKey,
              callback: onToken,
              "expired-callback": onExpired,
              size,
              theme: "light",
            });
          }
        }}
      />
      <div ref={ref} className={className} />
    </>
  );
}
