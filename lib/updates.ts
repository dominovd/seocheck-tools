import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Loader for /updates news feed posts.
 *
 * Posts live as markdown files in `content/updates/*.md`. Each file is
 * the source of truth: a manual hand-write at MVP scale, an AI draft +
 * human approval later.
 *
 * Reads happen at build time inside server components and
 * generateStaticParams. The folder may be empty during early development;
 * the loader handles that gracefully.
 */

export type UpdateSeverity = "major" | "minor" | "info";

export type UpdateCategory =
  | "algorithm"
  | "monetization"
  | "shorts"
  | "api"
  | "policy";

/**
 * Source tier (per seocheck-tools-updates-feed memory):
 *   1 = YouTube own channels (Creators Blog, Help Center, TeamYouTube X,
 *       Creator Insider, API release notes, Google Search Central). Must
 *       confirm before publish.
 *   2 = Industry press (Tubefilter, Variety, Reuters, The Verge).
 *   3 = Creator commentary / subreddits. Context only, never sole source.
 */
export type SourceTier = 1 | 2 | 3;

export type UpdateSource = {
  name: string;
  url: string;
  tier: SourceTier;
};

export type UpdatePost = {
  slug: string;
  title: string;
  /** ISO date YYYY-MM-DD. */
  date: string;
  severity: UpdateSeverity;
  category: UpdateCategory;
  source: UpdateSource;
  /**
   * Two-sentence summary surfaced on the feed index card and in
   * meta/og description. Required.
   */
  summary: string;
  /**
   * Hand-written by a human (never the model). Optional but strongly
   * recommended. This is what turns the feed into actionable for
   * creators rather than just a news mirror.
   */
  whatThisMeans?: string;
  /**
   * Tool slugs to feature in the related-tools block on the post page.
   */
  relatedTools?: string[];
  /** Raw markdown body (paragraphs between frontmatter and end of file). */
  body: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "updates");

const isMarkdownFile = (name: string) =>
  name.endsWith(".md") && !name.startsWith("_") && !name.startsWith(".");

/** Read all markdown files. Returns posts sorted by date desc. */
export function getAllUpdates(): UpdatePost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter(isMarkdownFile);

  const posts = files.map((file) => parseFile(file));

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

/** Lookup one post by slug. */
export function getUpdateBySlug(slug: string): UpdatePost | undefined {
  return getAllUpdates().find((p) => p.slug === slug);
}

/** All slugs, for generateStaticParams. */
export function getAllUpdateSlugs(): string[] {
  return getAllUpdates().map((p) => p.slug);
}

/** Filter helper for the index page. */
export function getUpdatesByCategory(
  category: UpdateCategory | "all",
): UpdatePost[] {
  const all = getAllUpdates();
  return category === "all" ? all : all.filter((p) => p.category === category);
}

// ---- internals ----

function parseFile(filename: string): UpdatePost {
  const fullPath = path.join(CONTENT_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  // Slug derived from filename if not explicitly set in frontmatter.
  // Filename convention: YYYY-MM-kebab-title.md
  const slugFromFile = filename.replace(/\.md$/, "");
  const slug = (data.slug as string | undefined) ?? slugFromFile;

  return {
    slug,
    title: requireString(data, "title", filename),
    date: requireString(data, "date", filename),
    severity: requireEnum(data, "severity", filename, [
      "major",
      "minor",
      "info",
    ]) as UpdateSeverity,
    category: requireEnum(data, "category", filename, [
      "algorithm",
      "monetization",
      "shorts",
      "api",
      "policy",
    ]) as UpdateCategory,
    source: requireSource(data, filename),
    summary: requireString(data, "summary", filename),
    whatThisMeans:
      typeof data.whatThisMeans === "string" ? data.whatThisMeans : undefined,
    relatedTools: Array.isArray(data.relatedTools)
      ? (data.relatedTools as string[])
      : undefined,
    body: content.trim(),
  };
}

function requireString(
  data: Record<string, unknown>,
  key: string,
  filename: string,
): string {
  const v = data[key];
  if (typeof v !== "string" || !v) {
    throw new Error(
      `content/updates/${filename}: frontmatter "${key}" is required and must be a non-empty string.`,
    );
  }
  return v;
}

function requireEnum(
  data: Record<string, unknown>,
  key: string,
  filename: string,
  allowed: string[],
): string {
  const v = data[key];
  if (typeof v !== "string" || !allowed.includes(v)) {
    throw new Error(
      `content/updates/${filename}: frontmatter "${key}" must be one of: ${allowed.join(", ")}. Got: ${String(v)}`,
    );
  }
  return v;
}

function requireSource(
  data: Record<string, unknown>,
  filename: string,
): UpdateSource {
  const src = data.source as Record<string, unknown> | undefined;
  if (!src || typeof src !== "object") {
    throw new Error(
      `content/updates/${filename}: frontmatter "source" object is required (name, url, tier).`,
    );
  }
  const tier = src.tier;
  if (tier !== 1 && tier !== 2 && tier !== 3) {
    throw new Error(
      `content/updates/${filename}: source.tier must be 1, 2, or 3. Got: ${String(tier)}`,
    );
  }
  return {
    name: requireString(src, "name", `${filename}:source`),
    url: requireString(src, "url", `${filename}:source`),
    tier,
  };
}
