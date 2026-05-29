"use client";

import { useMemo, useState } from "react";
import {
  PenLine,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  RotateCw,
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";

type ApiResponse =
  | {
      output: { description: string; hashtags: string[] };
      cached?: boolean;
      remaining?: number;
    }
  | { error: string; code?: string };

const YT_DESCRIPTION_LIMIT = 5000;

export function DescriptionGeneratorTool() {
  const [brief, setBrief] = useState("");
  const [channelName, setChannelName] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  // Final paste-ready description = description + hashtag line if not already there
  const finalDescription = useMemo(() => {
    if (!description) return "";
    const trimmed = description.trim();
    // Check if hashtags are already at the end
    const lastLine = trimmed.split("\n").pop() ?? "";
    const hasHashtagLine = /^\s*#\w+/.test(lastLine);
    if (hasHashtagLine || hashtags.length === 0) return trimmed;
    return `${trimmed}\n\n${hashtags.map((h) => `#${h}`).join(" ")}`;
  }, [description, hashtags]);

  async function generate() {
    if (!brief.trim() || loading) return;
    setError(null);
    setCached(false);

    try {
      setLoading(true);
      const res = await fetch("/api/youtube-description-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          input: {
            brief: brief.trim(),
            channelName: channelName.trim() || undefined,
          },
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || "error" in data) {
        setError(("error" in data && data.error) || "Generation failed.");
        return;
      }
      setDescription(data.output.description);
      setHashtags(data.output.hashtags);
      setCached(!!data.cached);
      setRemaining(typeof data.remaining === "number" ? data.remaining : null);
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  async function copy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    } catch {
      // ignore
    }
  }

  const charsUsed = finalDescription.length;
  const charsPct = Math.min(100, (charsUsed / YT_DESCRIPTION_LIMIT) * 100);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generate();
        }}
      >
        <label htmlFor="brief-input" className="block text-sm font-medium text-gray-700">
          What&apos;s the video about?
        </label>
        <textarea
          id="brief-input"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="e.g. Tutorial on how to set up a home server with Proxmox and run 4 self-hosted apps (Jellyfin, Immich, Vaultwarden, Home Assistant) on a single mini PC. Aimed at people who already use Docker but haven't tried Proxmox."
          rows={5}
          maxLength={800}
          className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>2-4 sentences works best. Niche, key points, target viewer.</span>
          <span className="font-mono tabular-nums">{brief.length} / 800</span>
        </div>

        <div className="mt-5">
          <label htmlFor="channel-input" className="block text-sm font-medium text-gray-700">
            Channel name <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="channel-input"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="e.g. Homelab Hank"
            maxLength={80}
            className="mt-1.5 w-full max-w-sm rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="mt-5">
          <TurnstileWidget onToken={setTurnstileToken} />
        </div>

        <button
          type="submit"
          disabled={!brief.trim() || loading}
          className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              Generating
            </>
          ) : finalDescription ? (
            <>
              <RotateCw className="h-4 w-4" strokeWidth={2} />
              Regenerate
            </>
          ) : (
            <>
              <PenLine className="h-4 w-4" strokeWidth={2} />
              Generate description
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {finalDescription && (
        <div className="mt-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Generated description
              {cached && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 normal-case">
                  cached
                </span>
              )}
            </p>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-mono tabular-nums text-gray-500">
                {charsUsed} / {YT_DESCRIPTION_LIMIT} chars
              </span>
              {remaining !== null && (
                <span className="text-gray-400">{remaining} left today</span>
              )}
              <button
                type="button"
                onClick={() => copy(finalDescription, "all")}
                className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100 hover:bg-brand-100 transition"
              >
                {copiedKey === "all" ? (
                  <>
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" strokeWidth={2} />
                    Copy description
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Char usage bar */}
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-brand-400 transition-all"
              style={{ width: `${charsPct}%` }}
            />
          </div>

          {/* Description content */}
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-gray-800">
              {finalDescription}
            </pre>
          </div>

          {/* Hashtag chips (separately copyable) */}
          {hashtags.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Hashtags (also at the end of description)
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {hashtags.map((h, i) => {
                  const key = `hash-${i}`;
                  const isCopied = copiedKey === key;
                  const value = `#${h}`;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => copy(value, key)}
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium ring-1 ring-inset transition ${
                        isCopied
                          ? "bg-brand-500 text-white ring-brand-500"
                          : "bg-white text-gray-700 ring-gray-200 hover:ring-brand-300 hover:bg-brand-50/40"
                      }`}
                    >
                      {value}
                      {isCopied ? (
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      ) : (
                        <Copy className="h-3 w-3" strokeWidth={2} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
