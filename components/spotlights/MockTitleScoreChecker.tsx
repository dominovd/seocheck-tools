import { Check, AlertTriangle, X, Gauge } from "lucide-react";

const ROWS = [
  { score: 91, text: "I tried index-fund investing for 5 years", band: "Strong" },
  { score: 76, text: "5 React patterns I use in every project", band: "Good" },
  { score: 42, text: "BEST PRODUCTIVITY APPS!!! #1 WILL SHOCK YOU", band: "Fair" },
];

export function MockTitleScoreChecker() {
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
          <Gauge className="h-3.5 w-3.5 text-brand-500" strokeWidth={2} />
          <span className="font-medium text-gray-700">Title Score Checker</span>
        </div>
      </div>

      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          3 variants ranked
        </p>

        <ol className="mt-3 space-y-2">
          {ROWS.map((r, i) => {
            const scoreColor =
              r.score >= 80
                ? "text-brand-700 ring-brand-300"
                : r.score >= 60
                ? "text-brand-600 ring-brand-200"
                : "text-amber-700 ring-amber-300";
            return (
              <li
                key={i}
                className="flex items-center gap-3 rounded-md bg-gray-50/70 px-3 py-2 ring-1 ring-inset ring-gray-100"
              >
                <span className="font-mono text-[10px] tabular-nums text-gray-400">
                  {i + 1}
                </span>
                <span
                  className={`flex h-7 w-9 items-center justify-center rounded-md ring-1 bg-white font-mono text-xs font-semibold ${scoreColor}`}
                >
                  {r.score}
                </span>
                <span className="flex-1 truncate text-xs text-gray-800">
                  {r.text}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Selected variant breakdown */}
        <div className="mt-5 rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-brand-300 bg-white">
              <span className="font-mono text-sm font-semibold text-brand-700">91</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-700">Strong</p>
              <p className="text-[10px] text-gray-500">Angle: Story</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1.5">
            <SignalRow icon="good" text="Length 41 chars — in the 40-70 sweet spot" />
            <SignalRow icon="good" text="Contains a number" />
            <SignalRow icon="good" text="First-person story angle" />
            <SignalRow icon="warn" text="No curiosity element — consider one" />
          </ul>
        </div>
      </div>
    </div>
  );
}

function SignalRow({ icon, text }: { icon: "good" | "warn"; text: string }) {
  const Icon = icon === "good" ? Check : AlertTriangle;
  const cls =
    icon === "good"
      ? "text-brand-700 bg-brand-50 ring-brand-100"
      : "text-amber-700 bg-amber-50 ring-amber-100";
  return (
    <li className="flex items-start gap-1.5 text-[11px] text-gray-700">
      <span
        className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-1 ${cls}`}
      >
        <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
      </span>
      <span>{text}</span>
    </li>
  );
}
