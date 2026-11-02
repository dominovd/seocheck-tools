"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Tags as TagsIcon,
  Loader2,
  AlertCircle,
  Clock,
  Copy,
  Check,
  Plus,
  RotateCw,
  ArrowRight,
} from "lucide-react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { ExternalLink } from "@/components/ExternalLink";
import { DerivedMetricsNotice } from "@/components/DerivedMetricsNotice";
import { TAG_CHAR_LIMIT, totalTagChars } from "@/lib/youtube/extract-tags";
import {
  TAG_GROUP_META,
  TAG_PASTE_ORDER,
  defaultSelection,
  orderedSelection,
  runTagChecks,
  type TagCheckState,
  type TagGroups,
} from "@/lib/youtube/tag-groups";
import {
  TAG_EXAMPLES,
  TAG_EXAMPLE_EVENT,
  exampleSelection,
  getTagExample,
  type TagExampleId,
} from "@/lib/youtube/tag-examples";
import { track } from "@/lib/analytics/track";

type ApiResponse =
  | { output: { groups: TagGroups }; cached?: boolean; remaining?: number }
  | { error: string; code?: string; resetAt?: number };

const BAR_SEGMENTS = 40;

const PILL: Record<TagCheckState, string> = {
  ready: "bg-brand-50 text-brand-700",
  attention: "bg-amber-50 text-amber-800",
  problem: "bg-red-50 text-red-700",
  neutral: "bg-gray-100 text-gray-600",
};

function hoursUntil(resetAt?: number): string {
  if (!resetAt) return "a few hours";
  const h = Math.ceil((resetAt - Date.now()) / 3_600_000);
  if (h <= 1) return "about 1 hour";
  return `about ${h} hours`;
}

const FIRST_EXAMPLE = TAG_EXAMPLES[0];

export function TagGeneratorTool() {
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // What the result area shows: a static example or the visitor's own result.
  const [mode, setMode] = useState<"example" | "user">("example");
  const [exampleId, setExampleId] = useState<TagExampleId>(FIRST_EXAMPLE.id);
  const [groups, setGroups] = useState<TagGroups>(FIRST_EXAMPLE.groups);
  const [selected, setSelected] = useState<Set<string>>(() => exampleSelection(FIRST_EXAMPLE));
  const [resultTopic, setResultTopic] = useState(FIRST_EXAMPLE.topic);
  const [resultTitle, setResultTitle] = useState(FIRST_EXAMPLE.title);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const topicRef = useRef<HTMLInputElement>(null);

  const showExample = useCallback((id: string, scroll = false) => {
    const ex = getTagExample(id);
    if (!ex) return;
    setMode("example");
    setExampleId(ex.id);
    setGroups(ex.groups);
    setSelected(exampleSelection(ex));
    setResultTopic(ex.topic);
    setResultTitle(ex.title);
    setError(null);
    setCopiedKey(null);
    if (scroll) rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Prefill from ?topic= / ?title= ("Next step" links between tools).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get("topic");
    const ti = p.get("title");
    if (t) setTopic(t.slice(0, 200));
    if (ti) setTitle(ti.slice(0, 100));
  }, []);

  // "Open in generator" buttons in the page's examples section.
  useEffect(() => {
    const onExample = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (typeof id === "string") showExample(id, true);
    };
    window.addEventListener(TAG_EXAMPLE_EVENT, onExample);
    return () => window.removeEventListener(TAG_EXAMPLE_EVENT, onExample);
  }, [showExample]);

  async function generate() {
    const q = topic.trim();
    if (!q || loading) return;
    setError(null);
    setRateLimited(null);
    try {
      setLoading(true);
      const res = await fetch("/api/youtube-tag-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          input: { topic: q, title: title.trim() || undefined },
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if ("error" in data) {
        if (data.code === "rate-limited") {
          setRateLimited(hoursUntil(data.resetAt));
          setRemaining(0);
        } else {
          setError(data.error || "Generation failed.");
        }
        return;
      }
      if (!res.ok) {
        setError("Generation failed.");
        return;
      }
      setMode("user");
      setGroups(data.output.groups);
      setSelected(defaultSelection(data.output.groups));
      setResultTopic(q);
      setResultTitle(title.trim());
      setCopiedKey(null);
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      track("tool_used", { slug: "youtube-tag-generator" });
    } catch {
      setError("The connection dropped. Your topic is still in the field, try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  function applyExampleTopic() {
    const ex = getTagExample(exampleId);
    if (!ex) return;
    setTopic(ex.topic);
    setTitle(ex.title);
    topicRef.current?.focus();
  }

  function toggle(tag: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
    setCopiedKey(null);
  }

  async function copy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      if (mode === "user") {
        track("tool_result_copied", { slug: "youtube-tag-generator", format: key });
      }
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 2000);
    } catch {
      // ignore
    }
  }

  const list = useMemo(() => orderedSelection(groups, selected), [groups, selected]);
  const chars = totalTagChars(list);
  const over = chars > TAG_CHAR_LIMIT;
  const filled = Math.round((Math.min(chars, TAG_CHAR_LIMIT) / TAG_CHAR_LIMIT) * BAR_SEGMENTS);
  const isExample = mode === "example";
  const checks = runTagChecks(groups, selected, resultTitle).map((c) =>
    isExample && c.state === "neutral"
      ? { ...c, text: "This example has no title, so the wording check is skipped" }
      : c
  );
  const primarySet = new Set(groups.primary);

  const nextHref = `/tools/youtube-description-generator?brief=${encodeURIComponent(
    [resultTitle, resultTopic].filter(Boolean).join(". ")
  )}`;

  return (
    <div>
      <div ref={rootRef} id="tag-tool" className="scroll-mt-6 rounded-2xl border border-gray-200 bg-white">
        {/* Form */}
        <form
          className="p-5 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            generate();
          }}
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-start">
            <div>
              <label htmlFor="topic-input" className="block text-sm font-semibold text-gray-800">
                Video topic
              </label>
              <input
                ref={topicRef}
                id="topic-input"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. how to color grade in DaVinci Resolve for beginners"
                maxLength={200}
                className="mt-1.5 h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Niche, angle and who the video is for</span>
                <span className="tabular-nums">{topic.length} / 200</span>
              </div>
            </div>
            <div>
              <label htmlFor="title-input" className="block text-sm font-semibold text-gray-800">
                Video title <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <input
                id="title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Checks your tags use the same wording"
                maxLength={100}
                className="mt-1.5 h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              <p className="mt-1 text-xs text-gray-500">Used only for the wording check</p>
            </div>
            <button
              type="submit"
              disabled={!topic.trim() || loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 text-[15px] font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40 transition lg:mt-[26px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  Generating
                </>
              ) : mode === "user" ? (
                <>
                  <RotateCw className="h-4 w-4" strokeWidth={2} />
                  Generate new batch
                </>
              ) : (
                <>
                  <TagsIcon className="h-4 w-4" strokeWidth={2} />
                  Generate tags
                </>
              )}
            </button>
          </div>
          <div className="mt-3 empty:hidden">
            <TurnstileWidget onToken={setTurnstileToken} />
          </div>
        </form>

        {/* Examples bar */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-gray-100 bg-gray-50 px-5 py-3 sm:px-6">
          <span className="text-sm text-gray-600">Example:</span>
          {TAG_EXAMPLES.map((ex) => {
            const on = isExample && exampleId === ex.id;
            return (
              <button
                key={ex.id}
                type="button"
                aria-pressed={on}
                onClick={() => showExample(ex.id)}
                className={`min-h-9 rounded-full border px-3 text-sm transition ${
                  on
                    ? "border-brand-500 bg-brand-50 text-brand-800"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                {ex.topic}
              </button>
            );
          })}
          <span className="w-full text-xs text-gray-500 sm:ml-auto sm:w-auto">
            Examples don&apos;t use your daily generations
          </span>
        </div>

        {/* Status banners */}
        {(error || rateLimited) && !loading && (
          <div className="px-5 pt-5 sm:px-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="flex items-center gap-2 text-[15px] font-semibold text-red-800">
                  <AlertCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  We couldn&apos;t generate tags this time
                </p>
                <p className="mt-1 text-sm text-red-800 leading-relaxed">{error}</p>
              </div>
            )}
            {rateLimited && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="flex items-center gap-2 text-[15px] font-semibold text-amber-900">
                  <Clock className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  You&apos;ve used today&apos;s free generations
                </p>
                <p className="mt-1 text-sm text-amber-900 leading-relaxed">
                  The limit is 15 per day per IP and resets at midnight UTC, in {rateLimited}. The
                  examples above still work, and so do these:{" "}
                  <Link href="/tools/youtube-tag-extractor" className="font-medium underline">
                    Tag Extractor
                  </Link>
                  {" · "}
                  <Link href="/guides/youtube-tags-best-practices-2026" className="font-medium underline">
                    Tags best practices
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {loading ? (
          <div className="p-5 sm:p-6" aria-busy="true" aria-label="Grouping tags for your video">
            <div className="h-6 w-40 rounded bg-gray-200" />
            <div className="mt-5 grid gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-5">
                  <div className="h-4 w-1/3 rounded bg-gray-200" />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="h-9 w-40 rounded-lg bg-gray-100" />
                    <div className="h-9 w-28 rounded-lg bg-gray-100" />
                    <div className="h-9 w-48 rounded-lg bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                    {isExample ? "Example result" : "Your tags"}
                    {isExample && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
                        Example
                      </span>
                    )}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Topic: <strong className="text-gray-900">{resultTopic}</strong>. Click a tag to
                    drop it or bring it back.
                  </p>
                </div>
                {isExample ? (
                  <button
                    type="button"
                    onClick={applyExampleTopic}
                    className="inline-flex h-11 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                  >
                    Use this topic
                  </button>
                ) : (
                  remaining !== null && (
                    <span className="text-sm text-gray-500">
                      {remaining} {remaining === 1 ? "generation" : "generations"} left today
                    </span>
                  )
                )}
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="grid min-w-0 gap-4">
                  {TAG_PASTE_ORDER.filter((id) => groups[id].length > 0).map((id) => (
                    <section
                      key={id}
                      aria-label={TAG_GROUP_META[id].name}
                      className={`min-w-0 rounded-xl border p-4 sm:p-5 ${
                        id === "primary" ? "border-brand-200 bg-brand-50/40" : "border-gray-200"
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {TAG_GROUP_META[id].name}
                        <span className="ml-2 text-sm font-normal text-gray-600">
                          {TAG_GROUP_META[id].hint}
                        </span>
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {groups[id].map((tag) => {
                          const on = selected.has(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              aria-pressed={on}
                              onClick={() => toggle(tag)}
                              className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm transition ${
                                on
                                  ? "border border-brand-500 bg-white text-brand-800"
                                  : "border border-dashed border-gray-300 bg-white text-gray-500 hover:border-gray-400"
                              }`}
                            >
                              {on ? (
                                <Check className="h-3.5 w-3.5 text-brand-700" strokeWidth={2.5} aria-hidden="true" />
                              ) : (
                                <Plus className="h-3.5 w-3.5 text-gray-400" strokeWidth={2.5} aria-hidden="true" />
                              )}
                              <span className={on ? "" : "line-through"}>{tag}</span>
                              <span className="hidden text-xs text-gray-400 sm:inline" aria-label={`${tag.length} characters`}>
                                {tag.length}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>

                <aside className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-xl border border-gray-200 p-5 sm:col-span-2 lg:col-span-1">
                    <h3 className="text-base font-semibold text-gray-900">Before you paste</h3>
                    <ul className="mt-3 space-y-2.5">
                      {checks.map((c) => (
                        <li key={c.text} className="flex items-start gap-2.5">
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${PILL[c.state]}`}>
                            {c.label}
                          </span>
                          <span className="text-sm text-gray-700 leading-snug">{c.text}</span>
                        </li>
                      ))}
                    </ul>
                    <DerivedMetricsNotice variant="inline" className="mt-3" />
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <h3 className="text-base font-semibold text-gray-900">How much tags matter</h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      YouTube says tags play a minimal role in discovery and help most when your
                      topic is often misspelled.
                    </p>
                    <p className="mt-2 text-sm">
                      <ExternalLink
                        href="https://support.google.com/youtube/answer/146402"
                        className="font-medium text-brand-700 hover:text-brand-800"
                      >
                        YouTube Help: Add tags to your videos
                      </ExternalLink>
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-5">
                    <h3 className="text-base font-semibold text-gray-900">Where to paste them</h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      YouTube Studio · Content · your video · Details · Show more · Tags.
                    </p>
                  </div>
                </aside>
              </div>
            </div>

            {/* Count + copy panel: sticky on desktop only, mobile anchor ads own the bottom edge there */}
            <div className="rounded-b-2xl border-t border-gray-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-6 lg:sticky lg:bottom-0 lg:z-10">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="min-w-0 flex-[1_1_280px]">
                  <p className={`text-sm ${over ? "text-red-700" : "text-gray-700"}`}>
                    <strong>{list.length} tags selected</strong> · {chars} of {TAG_CHAR_LIMIT} characters
                  </p>
                  <div
                    role="img"
                    aria-label={over ? "Selection is over the 500-character tag limit" : "Selection fits the 500-character tag limit"}
                    className="mt-2 flex gap-0.5"
                  >
                    {Array.from({ length: BAR_SEGMENTS }, (_, i) => (
                      <span
                        key={i}
                        className={`h-2 flex-1 rounded-sm ${
                          i < filled ? (over ? "bg-red-400" : "bg-brand-500") : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copy(list.join("\n"), "list")}
                    disabled={list.length === 0}
                    className="hidden h-11 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-40 transition sm:inline-flex"
                  >
                    {copiedKey === "list" ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Copy className="h-4 w-4" strokeWidth={2} />}
                    {copiedKey === "list" ? "Copied" : "Copy as list"}
                  </button>
                  <button
                    type="button"
                    onClick={() => copy(list.join(", "), "comma")}
                    disabled={list.length === 0}
                    className={`inline-flex h-11 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition disabled:opacity-40 ${
                      isExample
                        ? "border border-brand-600 bg-white text-brand-700 hover:bg-brand-50"
                        : "bg-brand-600 text-white hover:bg-brand-700"
                    }`}
                  >
                    {copiedKey === "comma" ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Copy className="h-4 w-4" strokeWidth={2} />}
                    {copiedKey === "comma"
                      ? "Copied"
                      : isExample
                        ? "Copy example tags"
                        : "Copy for YouTube Studio"}
                  </button>
                </div>
              </div>
              <p
                className="mt-3 hidden truncate rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-[13px] text-gray-600 sm:block"
                title={list.join(", ")}
              >
                {list.map((t, i) => (
                  <span key={t}>
                    {i > 0 && ", "}
                    <span className={primarySet.has(t) ? "font-semibold text-brand-800" : ""}>{t}</span>
                  </span>
                ))}
              </p>
            </div>
          </>
        )}
      </div>

      {mode === "user" && !loading && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-brand-200 bg-brand-50 px-6 py-5">
          <div>
            <p className="text-xs font-semibold text-brand-700">Next step</p>
            <p className="mt-0.5 text-[17px] font-semibold text-gray-900">Write the description</p>
            <p className="mt-0.5 text-sm text-gray-700">Your topic and title carry over.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/tools/youtube-tag-extractor"
              onClick={() => track("next_step_click", { from: "youtube-tag-generator", to: "youtube-tag-extractor" })}
              className="text-sm font-medium text-brand-700 hover:text-brand-800"
            >
              See a competitor&apos;s tags in Tag Extractor
            </Link>
            <Link
              href={nextHref}
              onClick={() => track("next_step_click", { from: "youtube-tag-generator", to: "youtube-description-generator" })}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 transition"
            >
              Open Description Generator
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
