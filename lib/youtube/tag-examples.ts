/**
 * Static example results for the Tag Generator. Served in the page HTML,
 * switched client-side, never sent to the AI and never counted against
 * the daily generation limit. Edit by hand: these are reviewed copy.
 */
import type { TagGroups } from "./tag-groups";

export type TagExampleId = "sourdough" | "minecraft" | "workout";

export type TagExample = {
  id: TagExampleId;
  label: string;
  topic: string;
  title: string;
  groups: TagGroups;
  /** Tags shown but not selected by default. */
  off: string[];
};

export const TAG_EXAMPLES: TagExample[] = [
  {
    id: "sourdough",
    label: "Sourdough bread for beginners",
    topic: "sourdough bread for beginners",
    title: "Sourdough Bread for Beginners: My Easy No-Fail Recipe",
    groups: {
      primary: ["sourdough bread for beginners", "beginner sourdough bread", "sourdough bread recipe"],
      specific: [
        "easy sourdough recipe",
        "how to make sourdough starter",
        "sourdough starter from scratch",
        "how to shape sourdough",
        "no knead sourdough",
      ],
      variants: ["sour dough", "sour dough bread", "sourdough for beginers"],
      broad: ["sourdough", "baking", "bread baking"],
    },
    off: ["bread baking"],
  },
  {
    id: "minecraft",
    label: "Minecraft survival guide for the first night",
    topic: "minecraft survival guide for the first night",
    title: "",
    groups: {
      primary: ["minecraft survival guide", "minecraft first night"],
      specific: [
        "minecraft first night tips",
        "how to survive in minecraft",
        "minecraft beginner guide",
        "what to do on your first night in minecraft",
      ],
      variants: ["minecraf", "mine craft survival"],
      broad: ["minecraft", "survival games"],
    },
    off: [],
  },
  {
    id: "workout",
    label: "Home workout with no equipment",
    topic: "home workout with no equipment",
    title: "20 Min Full Body Workout at Home",
    groups: {
      primary: ["home workout no equipment", "no equipment workout"],
      specific: [
        "full body workout at home",
        "beginner bodyweight workout",
        "20 minute home workout",
        "workout without weights",
      ],
      variants: ["work out at home", "homeworkout"],
      broad: ["home workout", "fitness", "exercise"],
    },
    off: ["exercise"],
  },
];

export const TAG_EXAMPLE_EVENT = "tag-generator:example";

export function getTagExample(id: string): TagExample | undefined {
  return TAG_EXAMPLES.find((e) => e.id === id);
}

export function exampleSelection(ex: TagExample): Set<string> {
  const off = new Set(ex.off);
  const all = [...ex.groups.primary, ...ex.groups.specific, ...ex.groups.variants, ...ex.groups.broad];
  return new Set(all.filter((t) => !off.has(t)));
}
