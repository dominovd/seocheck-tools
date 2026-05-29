"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import {
  NICHES,
  REGIONS,
  estimateEarnings,
  CREATOR_REVENUE_SHARE,
  MONETIZED_PLAYBACK_RATIO,
} from "@/lib/youtube/cpm-rates";

const VIEW_PRESETS = [1_000, 10_000, 100_000, 1_000_000];

function formatNumber(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatUsd(n: number): string {
  if (n < 1) return `$${n.toFixed(2)}`;
  if (n < 1000) return `$${n.toFixed(0)}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function MoneyCalculatorTool() {
  const [views, setViews] = useState<number>(100_000);
  const [nicheId, setNicheId] = useState<string>("tech");
  const [regionId, setRegionId] = useState<string>("us-uk-au-ca");

  const niche = NICHES.find((n) => n.id === nicheId) ?? NICHES[0];
  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];

  const estimate = useMemo(
    () => estimateEarnings(views, niche, region),
    [views, niche, region]
  );

  return (
    <div>
      {/* ─── Inputs ─── */}
      <div className="space-y-6">
        {/* Views */}
        <div>
          <label
            htmlFor="views-input"
            className="block text-sm font-medium text-gray-700"
          >
            Monthly views (or per video)
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2.5 shadow-sm focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition">
            <span className="text-sm text-gray-500">👁️</span>
            <input
              id="views-input"
              type="number"
              inputMode="numeric"
              min={0}
              max={1_000_000_000}
              value={views || ""}
              onChange={(e) =>
                setViews(Math.max(0, Number(e.target.value) || 0))
              }
              placeholder="100000"
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-xs font-mono text-gray-400 tabular-nums">
              {formatNumber(views)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {VIEW_PRESETS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setViews(v)}
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 transition ${
                  views === v
                    ? "bg-brand-500 text-white ring-brand-500"
                    : "bg-white text-gray-600 ring-gray-200 hover:ring-brand-300 hover:text-brand-700"
                }`}
              >
                {v >= 1_000_000 ? `${v / 1_000_000}M` : `${v / 1_000}K`}
              </button>
            ))}
          </div>
        </div>

        {/* Niche */}
        <div>
          <label
            htmlFor="niche-select"
            className="block text-sm font-medium text-gray-700"
          >
            Niche
          </label>
          <div className="mt-1.5 relative">
            <select
              id="niche-select"
              value={nicheId}
              onChange={(e) => setNicheId(e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm text-gray-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {NICHES.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.emoji} {n.label} (${n.cpmLow}–${n.cpmHigh} CPM)
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Region */}
        <div>
          <label
            htmlFor="region-select"
            className="block text-sm font-medium text-gray-700"
          >
            Audience region
          </label>
          <div className="mt-1.5 relative">
            <select
              id="region-select"
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm text-gray-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label} ({(r.multiplier * 100).toFixed(0)}% of US rate)
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-500">{region.hint}</p>
        </div>
      </div>

      {/* ─── Result card ─── */}
      <div className="mt-10 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/70 to-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
          Estimated creator earnings
        </p>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-4xl font-semibold tabular-nums text-gray-900 sm:text-5xl">
            {formatUsd(estimate.earningsAvg)}
          </span>
          <span className="text-sm text-gray-500">
            (range {formatUsd(estimate.earningsLow)} – {formatUsd(estimate.earningsHigh)})
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          From <span className="font-medium text-gray-900">{formatNumber(views)}</span>{" "}
          views in the {niche.label.toLowerCase()} niche to a{" "}
          {region.label.toLowerCase()} audience.
        </p>

        {/* Breakdown */}
        <dl className="mt-6 grid gap-x-6 gap-y-3 border-t border-brand-100 pt-5 text-sm sm:grid-cols-2">
          <div className="flex justify-between sm:flex-col">
            <dt className="text-gray-500">Effective CPM range</dt>
            <dd className="font-mono tabular-nums text-gray-900">
              ${estimate.effectiveCpmLow.toFixed(2)} – ${estimate.effectiveCpmHigh.toFixed(2)}
            </dd>
          </div>
          <div className="flex justify-between sm:flex-col">
            <dt className="text-gray-500">Monetized playback ratio</dt>
            <dd className="font-mono tabular-nums text-gray-900">
              {(MONETIZED_PLAYBACK_RATIO * 100).toFixed(0)}% of views
            </dd>
          </div>
          <div className="flex justify-between sm:flex-col">
            <dt className="text-gray-500">YouTube revenue share</dt>
            <dd className="font-mono tabular-nums text-gray-900">
              YouTube {(100 - CREATOR_REVENUE_SHARE * 100).toFixed(0)}% / You {(CREATOR_REVENUE_SHARE * 100).toFixed(0)}%
            </dd>
          </div>
          <div className="flex justify-between sm:flex-col">
            <dt className="text-gray-500">Per 1K views (avg)</dt>
            <dd className="font-mono tabular-nums text-gray-900">
              {formatUsd((estimate.earningsAvg / views) * 1000)}
            </dd>
          </div>
        </dl>

        <p className="mt-6 flex items-start gap-2 text-xs text-gray-500">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true" />
          Estimates only. Real CPMs vary by ad fill, season, video length,
          audience demographics, and whether the video is mid-roll eligible.
          Sponsorships and affiliate revenue are not included.
        </p>
      </div>
    </div>
  );
}
