import { ImageDown, Download } from "lucide-react";

const VARIANTS = [
  { label: "Max resolution", size: "1280 × 720", filename: "maxresdefault.jpg", weight: "168 KB" },
  { label: "HD",              size: "480 × 360",  filename: "hqdefault.jpg",   weight: "44 KB"  },
  { label: "Medium",          size: "320 × 180",  filename: "mqdefault.jpg",   weight: "18 KB"  },
  { label: "Standard",        size: "120 × 90",   filename: "default.jpg",     weight: "5 KB"   },
];

export function MockThumbnailDownloader() {
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
          <ImageDown className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} />
          <span className="font-medium text-gray-700">Thumbnail Downloader</span>
        </div>
      </div>

      <div className="p-5">
        {/* URL input */}
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Video URL
        </label>
        <div className="mt-1.5 flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm">
          <span className="font-mono text-xs text-gray-400">https://</span>
          <span className="font-mono text-xs text-gray-800 truncate">
            youtu.be/dQw4w9WgXcQ
          </span>
        </div>

        {/* Variants */}
        <label className="mt-5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          {VARIANTS.length} resolutions available
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {VARIANTS.map((v) => (
            <div
              key={v.filename}
              className="group rounded-lg border border-gray-200 bg-gray-50/40 p-2.5 hover:border-brand-300 hover:bg-white transition"
            >
              {/* Faux thumbnail */}
              <div
                className="aspect-video w-full rounded-md bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 ring-1 ring-inset ring-gray-300/40"
                aria-hidden="true"
              />
              <div className="mt-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-gray-800">
                    {v.label}
                  </p>
                  <p className="font-mono text-[10px] text-gray-500">{v.size}</p>
                </div>
                <Download
                  className="h-3.5 w-3.5 shrink-0 text-gray-400 group-hover:text-brand-500 transition-colors"
                  strokeWidth={2}
                />
              </div>
              <p className="mt-1 font-mono text-[9px] text-gray-400">{v.weight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
