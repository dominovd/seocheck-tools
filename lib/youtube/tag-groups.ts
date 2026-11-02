/**
 * Tag groups for the Tag Generator. Pure functions, no YouTube API data:
 * every check here runs on tags the user generated and selected.
 */
import { TAG_CHAR_LIMIT, totalTagChars } from "./extract-tags";

export type TagGroupId = "primary" | "specific" | "broad" | "variants";
export type TagGroups = Record<TagGroupId, string[]>;

/** Generation order, as returned by the API. */
export const TAG_GROUP_ORDER: TagGroupId[] = ["primary", "specific", "broad", "variants"];

/** Paste order: broad terms go last. */
export const TAG_PASTE_ORDER: TagGroupId[] = ["primary", "specific", "variants", "broad"];

export const TAG_GROUP_LIMITS: Record<TagGroupId, number> = {
  primary: 3,
  specific: 8,
  broad: 4,
  variants: 4,
};

export const TAG_GROUP_META: Record<TagGroupId, { name: string; hint: string }> = {
  primary: {
    name: "Primary keyword",
    hint: "Put these first. They describe the video in the words viewers search with.",
  },
  specific: {
    name: "Specific searches",
    hint: "Long-tail questions this video answers.",
  },
  broad: {
    name: "Broad topic",
    hint: "Place the video in its topic. One or two are enough, keep them last.",
  },
  variants: {
    name: "Spelling variants",
    hint: "Common misspellings and spacing. YouTube says this is where tags help most.",
  },
};

/** Tags in paste order, filtered to the selection. */
export function orderedSelection(groups: TagGroups, selected: Set<string>): string[] {
  const out: string[] = [];
  for (const id of TAG_PASTE_ORDER) {
    for (const t of groups[id]) if (selected.has(t)) out.push(t);
  }
  return out;
}

/**
 * Default selection: walk the paste order and keep every tag that still
 * fits the 500-character limit. Broad tags past the second are left off.
 */
export function defaultSelection(groups: TagGroups): Set<string> {
  const picked: string[] = [];
  for (const id of TAG_PASTE_ORDER) {
    groups[id].forEach((t, i) => {
      if (id === "broad" && i >= 2) return;
      if (totalTagChars([...picked, t]) <= TAG_CHAR_LIMIT) picked.push(t);
    });
  }
  return new Set(picked);
}

export type TagCheckState = "ready" | "attention" | "problem" | "neutral";
export type TagCheck = { state: TagCheckState; label: string; text: string };

const STOP = new Set(["the", "and", "for", "with", "how", "you", "your", "in", "to", "of", "a", "an"]);

function words(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

export function runTagChecks(
  groups: TagGroups,
  selected: Set<string>,
  title: string
): TagCheck[] {
  const list = orderedSelection(groups, selected);
  const chars = totalTagChars(list);
  const checks: TagCheck[] = [];

  checks.push(
    chars <= TAG_CHAR_LIMIT
      ? { state: "ready", label: "Ready", text: "Fits YouTube's 500-character limit" }
      : { state: "problem", label: "Too long", text: "Over the 500-character limit. Drop a broad tag first." }
  );

  const primary = groups.primary.filter((t) => selected.has(t));
  checks.push(
    primary.length > 0
      ? { state: "ready", label: "Ready", text: "Primary keyword comes first" }
      : { state: "attention", label: "Needs attention", text: "No primary keyword selected. Keep at least one." }
  );

  if (!title.trim()) {
    checks.push({
      state: "neutral",
      label: "Not checked",
      text: "Add your title above to check that tags and title use the same wording",
    });
  } else if (primary.length > 0) {
    const titleWords = new Set(words(title));
    const main = words(primary[0]);
    const matches = main.length > 0 && main.every((w) => titleWords.has(w));
    checks.push(
      matches
        ? { state: "ready", label: "Ready", text: "Main topic uses the same wording as your title" }
        : {
            state: "attention",
            label: "Needs attention",
            text: `Your title words the main topic differently from "${primary[0]}". Align one with the other.`,
          }
    );
  }

  const broad = groups.broad.filter((t) => selected.has(t));
  if (broad.length > 2) {
    checks.push({
      state: "attention",
      label: "Needs attention",
      text: "Several broad tags selected. One or two is enough.",
    });
  }

  return checks;
}
