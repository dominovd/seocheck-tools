"use client";

import { useMemo, useState } from "react";
import {
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  ClipboardPaste,
  Sparkles,
} from "lucide-react";
import {
  parseChapters,
  formatChapters,
  formatTimestamp,
  type OutputFormat,
} from "@/lib/youtube/parse-chapters";

const SAMPLE_INPUT = `0:00 Intro & what we're building
0:35 Project setup
2:10 Writing the first component
5:45 Styling with Tailwind
9:20 Adding state and interactivity
13:00 Wrapping up + next steps`;

export function ChapterGeneratorTool() {
  const [input, setInput] = useState("");
  const [format, setFormat] = useState<OutputFormat>("plain");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => parseChapters(input), [input]);

  const output = useMemo(
    () => formatChapters(result.chapters, format),
    [result.chapters, format]
  );

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // ignore
    }
  }

  const errors = result.issues.filter((i) => i.level === "error");
  const warnings = result.issues.filter((i) => i.level === "warning");
  const hasInput = input.trim().length > 0;

  return (
    <div>
      {/* Input textarea */}
      <div className="flex items-center justify-between">
        <label htmlFor="chapters-input" className="block text-sm font-medium text-gray-700">
          Paste your timestamped lines
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={pasteFromClipboard}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-brand-700 transition"
          >
            <ClipboardPaste className="h-3.5 w-3.5" strokeWidth={2} />
            Paste
          </button>
          {!hasInput && (
            <button
              type="button"
              onClick={() => setInput(SAMPLE_INPUT)}
              className="inline-flex items-center gap-1 text-xs text-brand-700 hover:text-brand-800 underline-offset-2 hover:underline"
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Try a sample
            </button>
          )}
        </div>
      </div>
      <textarea
        id="chapters-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={"0:00 Intro\n1:30 First topic\n5:00 Second topic"}
        rows={8}
        spellCheck={false}
        className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 font-mono text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />

      {/* Validation summary */}
      {hasInput && (
        <div className="mt-4 space-y-2">
          {result.valid && result.chapters.length >= 3 && (
            <div className="flex items-start gap-2 rounded-md border border-brand-200 bg-brand-50/50 p-3">
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                strokeWidth={2}
              />
              <p className="text-sm text-brand-800">
                Looks good — YouTube should display your{" "}
                <strong>{result.chapters.length} chapters</strong>.
              </p>
            </div>
          )}

          {errors.map((issue, i) => (
            <div
              key={`err-${i}`}
              className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50/60 p-3"
            >
              <AlertCircle
                className="h-4 w-4 shrink-0 text-red-500 mt-0.5"
                strokeWidth={2}
              />
              <p className="text-sm text-red-700">{issue.message}</p>
            </div>
          ))}

          {warnings.map((issue, i) => (
            <div
              key={`warn-${i}`}
              className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50/60 p-3"
            >
              <AlertCircle
                className="h-4 w-4 shrink-0 text-amber-500 mt-0.5"
                strokeWidth={2}
              />
              <p className="text-sm text-amber-800">{issue.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Detected chapters list */}
      {result.chapters.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {result.chapters.length} chapters detected
            </p>
            <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5">
              {(["plain", "dash"] as OutputFormat[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`rounded px-3 py-1 text-xs font-medium transition ${
                    format === f
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {f === "plain" ? "0:00 Title" : "0:00 - Title"}
                </button>
              ))}
            </div>
          </div>

          <ol className="mt-3 divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200 bg-white">
            {result.chapters.map((c, i) => {
              const next = result.chapters[i + 1];
              const length = next ? next.seconds - c.seconds : null;
              const isShort = length !== null && length < 10;
              return (
                <li
                  key={`${c.lineNumber}-${c.seconds}`}
                  className="flex items-center gap-4 px-4 py-2.5"
                >
                  <span className="font-mono text-xs tabular-nums text-gray-400 w-6 text-right">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-brand-700 w-16">
                    {formatTimestamp(c.seconds)}
                  </span>
                  <span className="flex-1 text-sm text-gray-800 truncate">
                    {c.title}
                  </span>
                  {length !== null && (
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        isShort ? "text-red-500" : "text-gray-400"
                      }`}
                    >
                      {length}s
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Output snippet */}
      {output && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Paste this into your video description
          </p>
          <div className="mt-2 relative overflow-hidden rounded-xl bg-gray-900 ring-1 ring-gray-800">
            <pre className="overflow-x-auto p-4 pr-16 text-xs leading-relaxed text-gray-100">
              <code className="font-mono">{output}</code>
            </pre>
            <button
              type="button"
              onClick={copyOutput}
              className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-100 ring-1 ring-gray-700 hover:bg-gray-700 transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-brand-400" strokeWidth={2.5} />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
