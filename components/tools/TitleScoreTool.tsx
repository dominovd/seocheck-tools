"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  AlertTriangle,
  X,
  Info,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import {
  analyzeTitle,
  type PublicTitleAnalysis,
  type Signal,
  type SignalKind,
} from "@/lib/youtube/title-score";
import { track } from "@/lib/analytics/track";

const SAMPLE_TITLES = [
  "I quit React after 8 years — here's what I switched to",
  "BEST PRODUCTIVITY APPS 2026!!! YOU WON'T BELIEVE #5",
  "How to set up a homelab on a $200 budget",
];

const SIGNAL_ICON: Record<SignalKind, LucideIcon> = {
  good: Check,
  warn: AlertTriangle,
  bad: X,
  info: Info,
};

const SIGNAL_STYLES: Record<SignalKind, string> = {
  good: "text-brand-700 bg-brand-50 ring-brand-100",
  warn: "text-amber-700 bg-amber-50 ring-amber-100",
  bad: "text-red-700 bg-red-50 ring-red-100",
  info: "text-gray-600 bg-gray-50 ring-gray-100",
};

const ANGLE_LABEL: Record<PublicTitleAnalysis["detectedAngle"], string> = {
  howto: "How-to / tutorial",
  listicle: "Listicle / numbered",
  curiosity: "Curiosity / question",
  comparison: "Comparison / vs",
  story: "First-person story",
  review: "Review",
  contrarian: "Contrarian / hot-take",
  unclear: "Unclear",
};

type Variant = { id: string; text: string };

type AnalyzedVariant = Variant & {
  analysis: PublicTitleAnalysis;
  issueCount: number;
  goodCount: number;
};

function genId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function countIssues(a: PublicTitleAnalysis): number {
  return a.signals.filter((s) => s.kind === "bad" || s.kind === "warn").length;
}

function countGood(a: PublicTitleAnalysis): number {
  return a.signals.filter((s) => s.kind === "good").length;
}

export function TitleScoreTool() {
  const [variants, setVariants] = useState<Variant[]>([
    { id: genId(), text: "" },
  ]);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const toolUsedFiredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const seed = params.get("title");
    if (seed && seed.trim()) {
      setVariants([{ id: genId(), text: seed.trim().slice(0, 150) }]);
    }
  }, []);

  const results: AnalyzedVariant[] = useMemo(
    () =>
      variants.map((v) => {
        const analysis = analyzeTitle(v.text);
        return {
          ...v,
          analysis,
          issueCount: countIssues(analysis),
          goodCount: countGood(analysis),
        };
      }),
    [variants]
  );

  // Rank by ascending issue count, break ties by descending good count.
  const sortedResults = useMemo(() => {
    if (variants.length < 2) return null;
    return [...results]
      .filter((r) => r.text.trim().length > 0)
      .sort((a, b) => {
        if (a.issueCount !== b.issueCount) return a.issueCount - b.issueCount;
        return b.goodCount - a.goodCount;
      });
  }, [results, variants.length]);

  function updateText(id: string, text: string) {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, text } : v)));
    if (!toolUsedFiredRef.current && text.trim().length > 3) {
      toolUsedFiredRef.current = true;
      track("tool_used", { slug: "youtube-title-score-checker" });
    }
  }

  function addVariant() {
    if (variants.length >= 5) return;
    const newId = genId();
    setVariants((prev) => [...prev, { id: newId, text: "" }]);
    setExpandedIds((prev) => ({ ...prev, [newId]: true }));
  }

  function removeVariant(id: string) {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((v) => v.id !== id));
  }

  function loadSample(idx: number) {
    const sample = SAMPLE_TITLES[idx];
    if (!sample) return;
    setVariants((prev) =>
      prev.length === 1 && prev[0].text === ""
        ? [{ id: prev[0].id, text: sample }]
        : [...prev, { id: genId(), text: sample }]
    );
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const showCompareRanking = sortedResults !== null && sortedResults.length >= 2;
  const allEmpty = variants.every((v) => !v.text.trim());

  return (
    <div>
      {/* Compare-mode ranking at top — by ascending issue count (fewer issues = better) */}
      {showCompareRanking && (
        <div className="mb-8 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/70 to-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
            Ranked by fewest flagged issues
          </p>
          <ol className="mt-3 space-y-1.5">
            {sortedResults!.map((r, i) => (
              <li
                key={r.id}
                className="flex items-center gap-3 text-sm text-gray-800"
              >
                <span className="w-4 font-mono text-xs text-gray-400">
                  {i + 1}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                  {r.issueCount > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 ring-1 ring-inset ring-amber-100">
                      <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />
                      {r.issueCount}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-brand-700 ring-1 ring-inset ring-brand-100">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                      Clean
                    </span>
                  )}
                </span>
                <span className="flex-1 truncate">{r.text}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] text-gray-500">
            Editorial ordering by the count of bad and warning signals. Not a
            YouTube metric.
          </p>
        </div>
      )}

      {/* Variants */}
      <div className="space-y-5">
        {results.map((v, idx) => (
          <VariantCard
            key={v.id}
            number={idx + 1}
            variant={v}
            expanded={expandedIds[v.id] ?? false}
            onChange={(text) => updateText(v.id, text)}
            onRemove={
              variants.length > 1 ? () => removeVariant(v.id) : undefined
            }
            onToggle={() => toggleExpand(v.id)}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={addVariant}
          disabled={variants.length >= 5}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-brand-300 hover:bg-brand-50/40 disabled:cursor-not-allowed disabled:opacity-40 transition"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add another variant
        </button>
        <span className="text-xs text-gray-400">
          Compare up to 5 variants side-by-side
        </span>

        <span className="ml-auto text-xs text-gray-500">Try a sample:</span>
        {SAMPLE_TITLES.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => loadSample(i)}
            className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition"
            title={s}
          >
            #{i + 1}
          </button>
        ))}
      </div>

      {allEmpty && (
        <div className="mt-6 rounded-xl border border-dashed border-brand-200 bg-brand-50/40 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900">
                No title yet?
              </p>
              <p className="mt-0.5 text-xs text-gray-600">
                Generate 10 click-worthy titles with AI, then paste your
                favourite here for editorial signals.
              </p>
            </div>
            <Link
              href="/tools/youtube-title-generator"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-brand-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              <WandSparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Generate titles with AI
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

type VariantCardProps = {
  number: number;
  variant: AnalyzedVariant;
  expanded: boolean;
  onChange: (text: string) => void;
  onRemove?: () => void;
  onToggle: () => void;
};

function VariantCard({
  number,
  variant,
  expanded,
  onChange,
  onRemove,
  onToggle,
}: VariantCardProps) {
  const { text, analysis, issueCount, goodCount } = variant;
  const hasContent = text.trim().length > 0;
  const visibleSignals =
    expanded || !hasContent ? analysis.signals : analysis.signals.slice(0, 2);
  const hiddenCount = hasContent
    ? analysis.signals.length - visibleSignals.length
    : 0;
  const badCount = analysis.signals.filter((s) => s.kind === "bad").length;
  const warnCount = analysis.signals.filter((s) => s.kind === "warn").length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      {/* Top row: number + textarea + remove */}
      <div className="flex items-start gap-3">
        <span className="font-mono text-xs tabular-nums text-gray-400 mt-2.5">
          {String(number).padStart(2, "0")}
        </span>
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste a YouTube title to analyze..."
            rows={2}
            maxLength={150}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none"
          />
          {hasContent && (
            <span className="absolute right-2 bottom-2 font-mono text-[10px] tabular-nums text-gray-400">
              {analysis.length}c
            </span>
          )}
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="mt-1 inline-flex items-center justify-center rounded-md p-1.5 text-gray-400 hover:bg-gray-50 hover:text-red-600 transition"
            aria-label="Remove this variant"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Signal summary + angle */}
      {hasContent && (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[11px]">
              {badCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-red-700 ring-1 ring-inset ring-red-100">
                  <X className="h-3 w-3" strokeWidth={2.5} />
                  {badCount}
                </span>
              )}
              {warnCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 ring-1 ring-inset ring-amber-100">
                  <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />
                  {warnCount}
                </span>
              )}
              {goodCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-brand-700 ring-1 ring-inset ring-brand-100">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                  {goodCount}
                </span>
              )}
              {issueCount === 0 && badCount === 0 && (
                <span className="text-brand-700">No issues flagged</span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              Angle:{" "}
              <span className="font-medium text-gray-700">
                {ANGLE_LABEL[analysis.detectedAngle]}
              </span>
            </span>
          </div>

          {/* Signals */}
          <ul className="mt-4 space-y-2">
            {visibleSignals.map((sig, i) => (
              <SignalRow key={i} signal={sig} />
            ))}
          </ul>

          {/* Expand + Improve actions */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            {analysis.signals.length > 2 ? (
              <button
                type="button"
                onClick={onToggle}
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-brand-700 transition"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-3 w-3" strokeWidth={2.5} />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" strokeWidth={2.5} />
                    Show {hiddenCount} more signal{hiddenCount === 1 ? "" : "s"}
                  </>
                )}
              </button>
            ) : (
              <span />
            )}
            <Link
              href={`/tools/youtube-title-generator?seed=${encodeURIComponent(text)}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-brand-200 bg-brand-50/60 px-2.5 py-1 text-xs font-medium text-brand-700 hover:border-brand-300 hover:bg-brand-50 transition"
              title="Generate 10 alternative titles with AI based on this one"
            >
              <WandSparkles className="h-3.5 w-3.5" strokeWidth={2} />
              Improve with AI
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function SignalRow({ signal }: { signal: Signal }) {
  const Icon = SIGNAL_ICON[signal.kind];
  const cls = SIGNAL_STYLES[signal.kind];
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1 ${cls}`}
      >
        <Icon className="h-3 w-3" strokeWidth={2.5} />
      </span>
      <span className="text-sm text-gray-700 leading-relaxed">
        {signal.message}
      </span>
    </li>
  );
}
