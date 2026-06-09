import { Search, Copy } from "lucide-react";

type Suggestion = {
  keyword: string;
  intent: "Info" | "Commercial" | "Brand";
  volume: string;
};

const SUGGESTIONS: Suggestion[] = [
  { keyword: "react useEffect hook tutorial", intent: "Info", volume: "8.4K" },
  { keyword: "useEffect cleanup function", intent: "Info", volume: "3.1K" },
  { keyword: "useEffect dependency array", intent: "Info", volume: "2.7K" },
  { keyword: "react useEffect best practices", intent: "Info", volume: "1.9K" },
  { keyword: "react hooks vs class components", intent: "Info", volume: "1.6K" },
  { keyword: "useEffect infinite loop", intent: "Info", volume: "1.2K" },
  { keyword: "react useEffect async", intent: "Info", volume: "990" },
  { keyword: "react course 2026", intent: "Commercial", volume: "740" },
];

const INTENT_STYLES: Record<Suggestion["intent"], string> = {
  Info: "bg-blue-50 text-blue-700 ring-blue-100",
  Commercial: "bg-amber-50 text-amber-700 ring-amber-100",
  Brand: "bg-purple-50 text-purple-700 ring-purple-100",
};

export function MockKeywordTool() {
  return (
    <div className="relative rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200/80 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/70 px-5 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
        </div>
        <div className="ml-3 flex items-center gap-1.5 text-xs text-gray-500">
          <Search className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} />
          <span className="font-medium text-gray-700">Keyword Tool</span>
        </div>
      </div>

      <div className="p-5">
        {/* Seed input */}
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Seed keyword
        </label>
        <div className="mt-1.5 flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm">
          <Search
            className="h-3.5 w-3.5 shrink-0 text-gray-400"
            strokeWidth={2}
          />
          <span className="font-mono text-xs text-gray-800">react useEffect</span>
        </div>

        {/* Results */}
        <div className="mt-5 flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            {SUGGESTIONS.length} keyword ideas
          </label>
          <button className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
            <Copy className="h-2.5 w-2.5" strokeWidth={2.5} />
            Copy list
          </button>
        </div>

        <ul className="mt-2.5 divide-y divide-gray-100 rounded-md ring-1 ring-gray-100">
          {SUGGESTIONS.map((s) => (
            <li
              key={s.keyword}
              className="flex items-center justify-between gap-3 px-3 py-2"
            >
              <span className="truncate text-xs text-gray-800">{s.keyword}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ring-inset ${INTENT_STYLES[s.intent]}`}
                >
                  {s.intent}
                </span>
                <span className="w-9 text-right font-mono text-[10px] tabular-nums text-gray-500">
                  {s.volume}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer note */}
        <div className="mt-4 flex items-center justify-between text-[10px] text-gray-400">
          <span>Pulled from YouTube autocomplete + related searches</span>
          <span className="font-mono">US</span>
        </div>
      </div>
    </div>
  );
}
