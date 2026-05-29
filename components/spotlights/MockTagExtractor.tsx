import { ScanLine, Copy } from "lucide-react";

const TAGS = [
  "gaming setup 2026",
  "rgb gaming pc",
  "best gaming chair",
  "streamer setup tour",
  "razer mouse review",
  "mechanical keyboard",
  "gaming pc build",
  "rtx 5090 review",
  "1440p monitor",
  "gaming desk setup",
  "cable management",
  "gaming room ideas",
  "ultrawide monitor",
  "elgato stream deck",
  "gaming headset",
];

export function MockTagExtractor() {
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
          <ScanLine className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} />
          <span className="font-medium text-gray-700">Tag Extractor</span>
        </div>
      </div>

      <div className="p-5">
        {/* URL input */}
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Competitor video URL
        </label>
        <div className="mt-1.5 flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm">
          <span className="font-mono text-xs text-gray-400">https://</span>
          <span className="font-mono text-xs text-gray-800 truncate">
            youtube.com/watch?v=dQw4w9WgXcQ
          </span>
        </div>

        {/* Extracted tags */}
        <div className="mt-5 flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            {TAGS.length} tags found
          </label>
          <button className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
            <Copy className="h-2.5 w-2.5" strokeWidth={2.5} />
            Copy all
          </button>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-700 ring-1 ring-inset ring-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Total chars */}
        <div className="mt-4 flex items-center justify-between text-[10px] text-gray-400">
          <span>Total: 182 / 500 chars</span>
          <span className="font-mono">YouTube limit applied</span>
        </div>
      </div>
    </div>
  );
}
