"use client";

import { useState } from "react";
import {
  Link as LinkIcon,
  Search,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { classifyChannelInput } from "@/lib/youtube/parse-channel-url";

type LookupResult = {
  channelId: string;
  handle?: string;
  name?: string;
  avatarUrl?: string;
  inputKind: "direct" | "handle" | "custom" | "user" | "video";
};

const SAMPLE = "https://www.youtube.com/@MrBeast";

export function ChannelIdFinderTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function handleLookup(rawInput: string) {
    setError(null);
    setResult(null);

    const classification = classifyChannelInput(rawInput);
    if (classification.kind === "invalid") {
      setError(
        "Couldn't recognise that as a YouTube URL, handle, or channel ID."
      );
      return;
    }

    // Fast path: direct channel ID
    if (classification.kind === "direct") {
      setResult({
        channelId: classification.channelId,
        inputKind: "direct",
      });
      return;
    }

    // Otherwise hit the serverless lookup
    setLoading(true);
    try {
      const res = await fetch("/api/youtube-channel-id-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rawInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Lookup failed.");
        return;
      }
      setResult(data.result as LookupResult);
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    await handleLookup(input);
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="channel-url-input"
          className="block text-sm font-medium text-gray-700"
        >
          YouTube URL, @handle, or channel ID
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2.5 shadow-sm focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition">
            <LinkIcon className="h-4 w-4 text-gray-400" strokeWidth={2} aria-hidden="true" />
            <input
              id="channel-url-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://www.youtube.com/@channel or @handle or UCxxx..."
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Looking up
              </>
            ) : (
              <>
                <Search className="h-4 w-4" strokeWidth={2} />
                Find channel ID
              </>
            )}
          </button>
        </div>

        <div className="mt-2 text-xs">
          {!input && (
            <button
              type="button"
              onClick={() => {
                setInput(SAMPLE);
                handleLookup(SAMPLE);
              }}
              className="text-brand-700 hover:text-brand-800 underline-offset-2 hover:underline"
            >
              Try with @MrBeast
            </button>
          )}
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4">
          <AlertCircle
            className="h-4 w-4 shrink-0 text-red-500 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/70 to-white p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
            Channel found
          </p>

          {/* Identity row */}
          <div className="mt-3 flex items-center gap-4">
            {result.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={result.avatarUrl}
                alt={result.name ?? "Channel avatar"}
                className="h-14 w-14 rounded-full ring-2 ring-white shadow-sm"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-brand-100 ring-2 ring-white shadow-sm flex items-center justify-center text-brand-700 font-semibold">
                {(result.name?.[0] ?? "?").toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-gray-900">
                {result.name ?? "Unnamed channel"}
              </p>
              {result.handle && (
                <p className="font-mono text-xs text-gray-500">@{result.handle}</p>
              )}
            </div>
          </div>

          {/* Copyable values */}
          <dl className="mt-6 space-y-3">
            <CopyableRow
              label="Channel ID"
              value={result.channelId}
              valueKey="channel-id"
              copiedKey={copiedKey}
              onCopy={copy}
              mono
            />
            <CopyableRow
              label="Canonical channel URL"
              value={`https://www.youtube.com/channel/${result.channelId}`}
              valueKey="canonical-url"
              copiedKey={copiedKey}
              onCopy={copy}
            />
            {result.handle && (
              <CopyableRow
                label="Handle URL"
                value={`https://www.youtube.com/@${result.handle}`}
                valueKey="handle-url"
                copiedKey={copiedKey}
                onCopy={copy}
              />
            )}
            <CopyableRow
              label="RSS feed URL"
              value={`https://www.youtube.com/feeds/videos.xml?channel_id=${result.channelId}`}
              valueKey="rss-url"
              copiedKey={copiedKey}
              onCopy={copy}
            />
          </dl>

          <a
            href={`https://www.youtube.com/channel/${result.channelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 hover:text-brand-800"
          >
            Open the channel on YouTube
            <ExternalLink className="h-3 w-3" strokeWidth={2} />
          </a>
        </div>
      )}
    </div>
  );
}

type CopyableRowProps = {
  label: string;
  value: string;
  valueKey: string;
  copiedKey: string | null;
  onCopy: (value: string, key: string) => void;
  mono?: boolean;
};

function CopyableRow({
  label,
  value,
  valueKey,
  copiedKey,
  onCopy,
  mono,
}: CopyableRowProps) {
  const isCopied = copiedKey === valueKey;
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm">
        <span
          className={`flex-1 truncate text-sm text-gray-800 ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onCopy(value, valueKey)}
          className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition"
        >
          {isCopied ? (
            <>
              <Check className="h-3 w-3 text-brand-600" strokeWidth={2.5} />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" strokeWidth={2} />
              Copy
            </>
          )}
        </button>
      </dd>
    </div>
  );
}
