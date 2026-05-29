/**
 * YouTube autocomplete suggestion fetcher.
 *
 * Uses the public Google Suggest endpoint with `client=firefox` which
 * returns plain JSON (no JSONP wrapper) of the form:
 *
 *   ["seed", ["suggestion 1", "suggestion 2", ...]]
 *
 * The `ds=yt` parameter restricts suggestions to YouTube's own search
 * index — what you'd see if you typed the same seed into YouTube.com.
 */

const SUGGEST_ENDPOINT = "https://suggestqueries.google.com/complete/search";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export type Region = {
  id: string;
  label: string;
  hl: string;
  gl: string;
};

export const REGIONS: Region[] = [
  { id: "us", label: "United States (English)",     hl: "en", gl: "us" },
  { id: "gb", label: "United Kingdom (English)",    hl: "en", gl: "gb" },
  { id: "ca", label: "Canada (English)",            hl: "en", gl: "ca" },
  { id: "au", label: "Australia (English)",         hl: "en", gl: "au" },
  { id: "in", label: "India (English)",             hl: "en", gl: "in" },
  { id: "de", label: "Germany (German)",            hl: "de", gl: "de" },
  { id: "es", label: "Spain (Spanish)",             hl: "es", gl: "es" },
  { id: "mx", label: "Mexico (Spanish)",            hl: "es", gl: "mx" },
  { id: "br", label: "Brazil (Portuguese)",         hl: "pt", gl: "br" },
  { id: "fr", label: "France (French)",             hl: "fr", gl: "fr" },
  { id: "jp", label: "Japan (Japanese)",            hl: "ja", gl: "jp" },
];

export const DEFAULT_REGION = REGIONS[0];

export function getRegion(id: string): Region {
  return REGIONS.find((r) => r.id === id) ?? DEFAULT_REGION;
}

async function fetchSuggestions(query: string, region: Region): Promise<string[]> {
  const url = `${SUGGEST_ENDPOINT}?client=firefox&ds=yt&hl=${region.hl}&gl=${region.gl}&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json,text/javascript,*/*",
    },
    cache: "no-store",
  });
  if (!res.ok) return [];
  try {
    const data = (await res.json()) as [string, string[]];
    if (!Array.isArray(data) || data.length < 2) return [];
    return data[1].filter((s) => typeof s === "string");
  } catch {
    return [];
  }
}

/** Fetch the raw 10-15 base suggestions for a seed. */
export async function fetchBaseSuggestions(
  seed: string,
  region: Region
): Promise<string[]> {
  return fetchSuggestions(seed, region);
}

/**
 * Run A-Z + " " expansions in parallel to surface 100+ long-tail variants.
 * Returns a de-duplicated, ordered list (base seed results first).
 */
export async function fetchExpandedSuggestions(
  seed: string,
  region: Region
): Promise<string[]> {
  const trimmedSeed = seed.trim();
  const queries = [
    trimmedSeed,
    ...ALPHABET.map((c) => `${trimmedSeed} ${c}`),
  ];

  const results = await Promise.allSettled(
    queries.map((q) => fetchSuggestions(q, region))
  );

  // De-dup while preserving order: base seed results come first
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const sugg of r.value) {
      const norm = sugg.trim().toLowerCase();
      if (!norm || seen.has(norm)) continue;
      seen.add(norm);
      ordered.push(sugg);
    }
  }
  return ordered;
}

export type SuggestionGroup = {
  /** Group label, e.g. "How to" or "Best of" or "Comparisons". */
  label: string;
  /** Detected prefix or pattern that triggered this group. */
  pattern: string;
  suggestions: string[];
};

/**
 * Bucket suggestions into intent groups for skimmable display.
 * Anything that doesn't fit a known pattern falls into "Other variants".
 */
export function groupSuggestions(suggestions: string[]): SuggestionGroup[] {
  const buckets: Record<string, { label: string; pattern: string; suggestions: string[] }> = {
    question: { label: "Questions",       pattern: "what / why / how / where / when / who", suggestions: [] },
    comparison: { label: "Comparisons",   pattern: "vs / or / alternative",                  suggestions: [] },
    quality: { label: "Best & top",       pattern: "best / top / free",                      suggestions: [] },
    tutorial: { label: "Tutorials",       pattern: "tutorial / guide / for beginners",       suggestions: [] },
    other: { label: "Other variants",     pattern: "—",                                       suggestions: [] },
  };

  const QUESTION_RE = /\b(what|why|how|where|when|who|is)\b/i;
  const COMP_RE = /\b(vs|or|alternative|alternatives)\b/i;
  const QUALITY_RE = /\b(best|top|free|cheap|cheapest)\b/i;
  const TUTORIAL_RE = /\b(tutorial|guide|tutorials|guides|for beginners|step by step)\b/i;

  for (const s of suggestions) {
    if (QUESTION_RE.test(s)) buckets.question.suggestions.push(s);
    else if (COMP_RE.test(s)) buckets.comparison.suggestions.push(s);
    else if (QUALITY_RE.test(s)) buckets.quality.suggestions.push(s);
    else if (TUTORIAL_RE.test(s)) buckets.tutorial.suggestions.push(s);
    else buckets.other.suggestions.push(s);
  }

  return Object.values(buckets).filter((b) => b.suggestions.length > 0);
}
