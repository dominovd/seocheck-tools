/**
 * Parse and validate YouTube description chapters.
 *
 * YouTube's rules for chapters to actually take effect:
 *   1. First timestamp must be 0:00 (or 00:00 / 00:00:00)
 *   2. At least 3 chapters total
 *   3. Each chapter must be at least 10 seconds long
 *   4. Timestamps must be in strict ascending order
 *
 * Plus formatting rules:
 *   - "MM:SS Title" or "HH:MM:SS Title" per line
 *   - Optional " - " or " — " separator between time and title
 *   - Blank lines and other description text between chapters is tolerated
 *
 * If any of the four rules fail, YouTube will NOT render chapters even if
 * the format looks right. This tool surfaces those failures explicitly.
 */

export type ParsedChapter = {
  /** Original line number in the input (1-based). */
  lineNumber: number;
  /** Raw line text. */
  raw: string;
  /** Parsed time in seconds. */
  seconds: number;
  /** Title text after the timestamp. */
  title: string;
};

export type ValidationIssue = {
  level: "error" | "warning";
  message: string;
  /** Affected chapter index, if applicable. */
  chapterIndex?: number;
};

export type ChapterParseResult = {
  chapters: ParsedChapter[];
  issues: ValidationIssue[];
  /** Whether YouTube will accept this as a valid chapter set. */
  valid: boolean;
};

const MIN_CHAPTER_SECONDS = 10;
const MIN_CHAPTERS = 3;

/**
 * Match a timestamp at the start of a line, optionally followed by a
 * separator (- or — or :), then the title.
 *
 * Captures:
 *   1 = timestamp (e.g. "0:00", "1:23", "1:23:45")
 *   2 = title (everything after the separator, trimmed)
 */
const CHAPTER_LINE_RE =
  /^\s*(\d{1,2}(?::\d{1,2}){1,2})\s*(?:[-—:]\s*)?(.*?)\s*$/;

function parseTimestamp(ts: string): number | null {
  const parts = ts.split(":").map((p) => Number(p));
  if (parts.some((n) => Number.isNaN(n) || n < 0)) return null;
  if (parts.length === 2) {
    // MM:SS
    if (parts[1] > 59) return null;
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    // H:MM:SS
    if (parts[1] > 59 || parts[2] > 59) return null;
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return null;
}

export function formatTimestamp(seconds: number): string {
  if (seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function parseChapters(input: string): ChapterParseResult {
  const lines = input.split("\n");
  const chapters: ParsedChapter[] = [];

  lines.forEach((line, idx) => {
    const match = line.match(CHAPTER_LINE_RE);
    if (!match) return;
    const seconds = parseTimestamp(match[1]);
    if (seconds === null) return;
    const title = match[2]?.trim() ?? "";
    if (!title) return; // require a non-empty title
    chapters.push({
      lineNumber: idx + 1,
      raw: line,
      seconds,
      title,
    });
  });

  const issues: ValidationIssue[] = [];

  // Rule 1: First timestamp must be 0:00
  if (chapters.length > 0 && chapters[0].seconds !== 0) {
    issues.push({
      level: "error",
      message: `First chapter must start at 0:00 (currently ${formatTimestamp(
        chapters[0].seconds
      )}). YouTube will not show chapters otherwise.`,
      chapterIndex: 0,
    });
  }

  // Rule 2: At least 3 chapters
  if (chapters.length > 0 && chapters.length < MIN_CHAPTERS) {
    issues.push({
      level: "error",
      message: `YouTube requires at least ${MIN_CHAPTERS} chapters (you have ${chapters.length}).`,
    });
  }

  // Rule 3: Each ≥ 10 seconds long
  for (let i = 0; i < chapters.length - 1; i++) {
    const length = chapters[i + 1].seconds - chapters[i].seconds;
    if (length < MIN_CHAPTER_SECONDS) {
      issues.push({
        level: "error",
        message: `Chapter ${i + 1} (\"${chapters[i].title}\") is only ${length}s long. YouTube requires each chapter to be at least ${MIN_CHAPTER_SECONDS} seconds.`,
        chapterIndex: i,
      });
    }
  }

  // Rule 4: Ascending order
  for (let i = 0; i < chapters.length - 1; i++) {
    if (chapters[i + 1].seconds <= chapters[i].seconds) {
      issues.push({
        level: "error",
        message: `Chapter ${i + 2} (\"${chapters[i + 1].title}\") starts at ${formatTimestamp(chapters[i + 1].seconds)}, before or at the same time as the previous chapter. Timestamps must strictly ascend.`,
        chapterIndex: i + 1,
      });
    }
  }

  // No chapters parsed at all — gentle nudge, not a hard error
  if (chapters.length === 0 && input.trim().length > 0) {
    issues.push({
      level: "warning",
      message: "No chapters were found. Each line should look like `0:00 Title` or `00:00:00 Title`.",
    });
  }

  const valid =
    chapters.length >= MIN_CHAPTERS &&
    chapters[0]?.seconds === 0 &&
    issues.every((i) => i.level !== "error");

  return { chapters, issues, valid };
}

export type OutputFormat = "plain" | "dash";

export function formatChapters(
  chapters: ParsedChapter[],
  format: OutputFormat = "plain"
): string {
  return chapters
    .map((c) => {
      const ts = formatTimestamp(c.seconds);
      return format === "dash" ? `${ts} - ${c.title}` : `${ts} ${c.title}`;
    })
    .join("\n");
}
