import { WandSparkles, Copy } from "lucide-react";

const TITLES = [
  "iPhone 17 Review: Is It Actually Worth the Upgrade?",
  "I Used the iPhone 17 for 30 Days — Here's the Truth",
  "iPhone 17 vs iPhone 16: 7 Things You Need to Know",
  "Don't Buy the iPhone 17 Until You Watch This",
  "iPhone 17 Pro Max — The Honest Review Apple Doesn't Want",
  "Is the iPhone 17 a Scam? My Brutally Honest Take",
  "5 Hidden iPhone 17 Features Apple Didn't Advertise",
  "iPhone 17 One Week Later: Was It Worth $1,200?",
  "The iPhone 17 Has One MAJOR Problem (Tested)",
  "iPhone 17 Camera Test — Better Than Pro Cameras?",
];

export function MockTitleGenerator() {
  return (
    <div className="relative rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200/80 overflow-hidden">
      {/* Browser-ish header bar */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/70 px-5 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
        </div>
        <div className="ml-3 flex items-center gap-1.5 text-xs text-gray-500">
          <WandSparkles className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} />
          <span className="font-medium text-gray-700">AI Title Generator</span>
        </div>
      </div>

      <div className="p-5">
        {/* Input row */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Topic
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm">
            iPhone 17 review
            <span className="ml-auto text-[10px] font-mono text-gray-400">15 chars</span>
          </div>
        </div>

        {/* Generated titles */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              10 generated titles
            </label>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-brand-600">
              <WandSparkles className="h-3 w-3" strokeWidth={2.5} />
              Claude Haiku
            </span>
          </div>
          <ul className="mt-2 space-y-1.5">
            {TITLES.map((title, i) => (
              <li
                key={i}
                className="group flex items-center gap-3 rounded-md bg-gray-50/70 px-3 py-2 text-xs text-gray-800 ring-1 ring-inset ring-gray-100"
              >
                <span className="font-mono text-[10px] text-gray-400 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 leading-tight">{title}</span>
                <Copy
                  className="h-3 w-3 text-gray-300 group-hover:text-brand-500 transition-colors"
                  strokeWidth={2}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
