# seocheck.tools

Free YouTube SEO tools. Next.js 14 App Router, TypeScript, Tailwind,
deployed on Vercel. No signup, no OAuth, public YouTube data only.

---

## Read this before touching any tool

**`docs/youtube-api-compliance.md` is binding.** The project went
through a YouTube API Services compliance review (reports V.1 to V.4,
2026-06 to 2026-08). Every rule in that document came from a written
violation notice. Breaking one risks API access for the whole site.

The short version, but read the full document before building or
changing a tool:

- **No composite scores or grades.** No 0-100, no 0-10, no A-F, no
  stars. Internal scoring may exist server-side but must be stripped
  before the API responds.
- **No derived ratios, multipliers, or percentages** calculated against
  our own thresholds. Show two raw numbers side by side instead.
- **No counts of items that failed our own checks.** Not "24 of 30
  videos have weak titles". Use the qualitative scale: all / most /
  several / few. Counting our own sample size is fine ("last 30
  uploads").
- **No YouTube statistic stored beyond 30 days.** Enforce with an entry
  cap, a hard TTL, and a read-time date filter.
- **Label every statistic in words.** `1.2K views`, not an eye icon
  followed by `1.2K`.
- **Every assessment surface needs `<DerivedMetricsNotice />`** with the
  reviewer's exact wording. Do not reword it.

Before shipping, walk the checklist in section 7 of the compliance doc
against the rendered page and the network response, not just the code.

## Writing rules

- No em-dashes in any user-facing copy. Use commas, periods, colons, or
  a middot for UI separators.
- American English, sentence case.
- No hype words. No "game-changer", "revolutionary", "unlock".
- Outbound links go through `components/ExternalLink.tsx`, which applies
  `rel="nofollow noopener" target="_blank"`. JSON-LD source references
  are separate and stay as-is.
- No competitor links in body copy.

## Working style

- Preview visual changes on `npm run dev` before committing. Do not
  stack several visual edits without a review pass.
- `npx tsc --noEmit` must be clean before any commit.
- Builds are billed per build on Vercel. Batch changes rather than
  pushing many small commits.

## Architecture notes

- Tool pages live at `app/tools/<slug>/page.tsx`, interactive parts in
  `components/tools/<Name>Tool.tsx`, API routes at
  `app/api/<slug>/route.ts`.
- `lib/tools-catalog.ts` is the single source of truth for the tool
  list. It drives nav, the `/tools` grid, the sitemap, and structured
  data. Add new tools there.
- AI tools go through `lib/ai/protect.ts` for rate limiting, caching,
  Turnstile verification, and the global cost cap.
- Internal-to-public type conversion happens at the API boundary. See
  the table in section 6.1 of the compliance doc.
- Content collections: guides under `app/guides/`, the updates feed
  under `content/updates/` with an auto-discovery cron.

## Quota

Extension approved 2026-09-17 for 6 months, so it lapses around
2027-03-17. Default bucket 160,000 units/day. `search.list` has its own
bucket of 30,100 units/day.

`search.list` costs 100 units per call, so Niche Check and Competitor
Analyzer share roughly 301 uncached queries a day between them. That is
still the binding constraint on the site. Everything else runs off the
default bucket and is effectively unbounded at current traffic:
Channel Audit 3 units, Video Audit 1, Outlier Finder 5.

The grant is locked to the stated use case. A materially new kind of
tool needs a fresh quota request before it ships. Details and the
capacity table in `docs/youtube-api-quota-audit.md`; the standing
obligations in `docs/youtube-api-compliance.md` section 9.
