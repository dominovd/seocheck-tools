"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, ArrowRight } from "lucide-react";

/**
 * Hero input on the homepage. Lightweight wrapper: the user pastes a
 * YouTube URL here and we navigate them to /tools/youtube-video-audit?url=...
 * where the actual audit logic runs (and the URL param is read on mount,
 * auto-triggering the audit).
 *
 * Keeping this thin means the homepage stays SSG-friendly and the audit
 * code path lives in one place.
 */
export function HeroAuditInput() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    router.push(`/tools/youtube-video-audit?url=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto mt-10 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg sm:flex-row sm:gap-0 sm:p-1.5"
    >
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste a YouTube URL — https://youtube.com/watch?v=..."
        className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-base"
        aria-label="YouTube video URL"
      />
      <button
        type="submit"
        disabled={!url.trim()}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 transition sm:text-base"
      >
        <ClipboardCheck className="h-4 w-4" strokeWidth={2} />
        Audit video
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </button>
    </form>
  );
}
