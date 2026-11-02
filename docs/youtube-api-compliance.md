# YouTube API Services compliance rules

**Status: binding. Read this before building or changing any tool that touches the YouTube Data API.**

Project number: `380359419674`
API client: SEO Check Tools (https://seocheck.tools)

These rules are not theoretical. Every one of them comes from a written
violation notice issued during the compliance review that ran from
2026-06 to 2026-08 (reports V.1 through V.4). Breaking one of them puts
API access at risk.

Policy source: https://developers.google.com/youtube/terms/developer-policies

---

## 1. The one-paragraph version

We may show raw values the API returns, and simple statistical
descriptions of those values. We may not show any figure we calculate
ourselves against our own thresholds. Anything we assess ourselves must
be qualitative, and must carry the disclaimer. No YouTube statistic may
be stored for more than 30 days. Every statistic on screen must be
labelled in words, not by an icon alone.

---

## 2. Hard rules, never break these

### 2.1 No composite scores or grades

Never display a 0-100 score, a 0-10 score, a letter grade, a star
rating, or any single number that summarises quality.

Removed during the review: Visibility Score (0-100), its four
subscores, A-F channel grades, Video Audit overall score, per-dimension
scores, Title Score Checker's 0-100 output, per-title scores in the
Title Generator, Niche Check's 0-10 opportunity score.

Internal scoring may still exist server-side to rank or bucket things.
It must never reach the browser. Sanitise it out of the API response,
not just out of the JSX.

### 2.2 No derived ratios, multipliers, or percentages

Never display a figure produced by dividing, multiplying, or comparing
YouTube values against a threshold we chose.

Removed during the review: outlier multipliers ("175x median"),
view-to-subscriber reach ratios, "Top 16% of similar channels",
"Big channel share 80% of top 20".

To convey the same idea, show the two raw numbers side by side and let
the reader compare them. Example: show a video's view count next to the
channel's median view count, with no multiplier between them.

### 2.3 No counts of items that failed our own checks

This one is subtle and it cost us a full review round. Counting how many
videos failed a check we invented is itself a derived metric.

Forbidden: "24 of 30 videos have weak titles", "30 videos affected",
"11 videos lack descriptions", "2 small-channel outliers".

Use the qualitative scale instead: `all` / `most` / `several` / `few`.
Helper: `toAffectedScale()` and `AFFECTED_SCALE_LABEL` in
`lib/youtube/channel-audit.ts`.

Counting the size of our own sample is fine: "last 30 uploads",
"across top 20 results". That describes the window we looked at, not a
judgement about the channel.

### 2.4 No YouTube statistic stored beyond 30 days

Applies to caches, history lists, logs, snapshots, anything persisted.

Enforce it three ways, not one:
1. Cap the number of entries so the window cannot exceed 30 days
2. Set a hard TTL on the key and re-arm it on every write
3. Filter by date when reading, so a stale key cannot leak

Reference implementations: `lib/tracking/tracked-channels.ts`
(4 weekly snapshots, 30-day TTL, read-time filter) and
`lib/analytics/audit-log.ts` (30-day TTL, prune pass on write).

Do not log YouTube statistics at all if you can avoid it. Our audit log
records only counts from our own editorial checks.

### 2.5 Never imply our assessment came from YouTube

No wording, styling, or iconography that suggests YouTube produced or
endorsed our judgement. Do not use the YouTube play button mark in our
branding.

---

## 3. What is allowed

- Any field returned directly by the API: view count, like count,
  comment count, subscriber count, video count, publish date, duration,
  title text, description text, hashtags, thumbnails, topic categories
- Standard statistical descriptions of raw values: median, mean
- Counts of API results matching a plain factual filter, for example
  "top results published in the past 30 days"
- The size of our analysis window: "last 30 uploads"
- Categorical editorial labels with no number attached: verdict names,
  priority labels (High / Medium / Keep it up), quality bands
  (Strong / Good / Fair / Weak), title angle classifications, trend
  direction
- Proportional bars, as long as no count or percentage is printed as
  text next to them
- Free-text editorial advice, provided it contains no digits about the
  channel

Reviewers explicitly left median views, fresh-video counts, verdict
labels, topic direction, and the channel snapshot untouched across
multiple rounds. Those are the safe precedents.

---

## 3b. The opt-in derived-metrics route, published 2026-09-14

Google published a new policy page three days before our quota
approval. It does not change anything above for us today, but it is the
one thing that could, so it needs to be on the record.

https://developers.google.com/youtube/terms/derived-metrics-policy
(referenced from Developer Policies section III.L)

What it says: developers with an **analytics use case** who **explicitly
apply** for permission through the quota extension form and **accept an
amendment** to the Developer Policies may calculate derived metrics that
are otherwise prohibited. The list includes custom channel scores and
ratios built from weighted formulas, revenue projections presented as
third-party estimates, custom tagging, sentiment scoring, leaderboards,
and brand suitability scoring. Accepted clients may also store
statistics from statistical endpoints for **36 calendar months** instead
of 30 days, though titles, descriptions, names, and comment text still
follow the 30-day rule.

Why it does not apply to us yet:

- The permission is granted per application, through the form, with
  "Section 5: Use Cases, API Integration, and Feature Implementation"
  then "Analytics & Reporting" selected to accept the amendment.
- Our 2026-09-17 approval is locked to the use case we described, which
  after four violation rounds is explicitly a no-derived-metrics tool
  set. We have not accepted the amendment.
- So every rule in section 2 stands. Nothing becomes allowed by reading
  this page.

If we ever want scoring back, that is a deliberate new submission, not a
code change. Weigh it carefully: our file contains four violation
reports, the current site, the Methodology page, and the About page all
sell "no scores" as a position, and the 36-month storage allowance is
worth more to us than scores are. See
`docs/youtube-api-quota-audit.md` for the terms of the current grant.

---

## 3c. Attribution is required, not optional

Developer Policies section III.F Branding:
https://developers.google.com/youtube/terms/developer-policies#f.-user-experience

> Any API Client page or feature that displays YouTube content,
> including search results, videos, channels, playlists, thumbnails, and
> players, must make clear to the viewer that YouTube is the source of
> the relevant content by displaying YouTube Brand Features.

This cuts the other way from the Branding Guidelines. Shipping no
YouTube mark at all avoids every logo-misuse rule, but it does not
satisfy III.F on pages that display YouTube content, and several of ours
do: Thumbnail Downloader, Channel Audit, Competitor Analyzer, Outlier
Finder, Video Audit, Tag Extractor.

Also in III.F: content that is not from YouTube must not be presented in
a way that suggests it came from YouTube. Our editorial assessments sit
right next to API data, which is what the disclaimer handles, and the
reason the disclaimer sits adjacent to the assessment rather than in the
footer.

Open item, not yet resolved: pick an attribution treatment that reads as
sourcing rather than branding. The YouTube Icon exists for exactly this
case, placed next to individual content elements where sources are
intermingled, and it must link back to YouTube. It must not be the most
prominent element on the page. A text credit alone may not be
sufficient, since the policy says Brand Features.

---

## 4. Grey zone, avoid unless necessary

- Summed totals that resemble a metric YouTube already exposes. We
  removed "total views in window" because YouTube publishes a channel
  total natively.
- Long-run aggregation across many audits. The 30-day retention limit
  makes corpus-scale study pages impractical. Do not plan features that
  need historical YouTube statistics.
- Percentile or cohort comparisons. Never shipped, and they would be a
  derived metric.

---

## 5. Required elements on every tool

### 5.1 The disclaimer

Every surface that shows an assessment of ours must render:

> These metrics are not related to YouTube and have been derived by the
> API client (SEO Check Tools).

Use `components/DerivedMetricsNotice.tsx`. Variants: `block` once per
result set near the top, `inline` under an individual derived section.
Every instance carries `data-derived-metrics-disclaimer` so all
placements can be found with one selector.

The exact sentence was dictated by the reviewer. Do not reword it.

### 5.2 Label every statistic in words

An icon alone is not a label. Every number must be followed by the word
for what it measures.

Correct: `1.2K views`, `45 likes`, `12 comments`, `826 subscribers`,
`Published 2026-05-25`

Wrong: an eye icon followed by `1.2K`

Mark decorative icons `aria-hidden="true"` once the text carries the
meaning.

### 5.3 Terms and Privacy references

`/terms` must state that using the site means agreeing to the
[YouTube Terms of Service](https://www.youtube.com/t/terms). Both
`/terms` and `/privacy` must carry the derived-metrics disclaimer and
describe the 30-day retention ceiling. Already in place, keep them
accurate when behaviour changes.

---

## 6. Code patterns to follow

### 6.1 Public shapes

Internal types may hold scores and counts. The API must return a
sanitised shape. Existing examples:

| Internal | Public | Converter |
|---|---|---|
| `VideoAuditResult` | `PublicVideoAuditResult` | `toPublicAudit()` |
| `TitleScoreResult` | `PublicTitleAnalysis` | `analyzeTitle()` |
| `OutlierAnalysis` | `PublicOutlierAnalysis` | `toPublicOutlierAnalysis()` |
| `NicheCheckResult` | `PublicNicheCheckResult` | `toPublicNicheCheck()` |
| `CompetitorAnalysis` | `PublicCompetitorAnalysis` | `toPublicCompetitorAnalysis()` |

Any new tool with internal scoring must follow the same split. Convert
at the API boundary, before caching, so the cache never holds a
forbidden value either.

### 6.2 LLM prompts

Prompts that generate user-facing text must forbid digits outright, and
the user message must not carry counts the model could echo back.

Pattern in `lib/youtube/channel-audit.ts`:
- System prompt states "The sentence must contain NO digits" with
  good and bad examples
- User message passes the qualitative scale, never the raw count
- `stripCounts()` post-processes the output as a safety net

Reuse `stripCounts()` for any new LLM surface that describes a channel.

### 6.3 Proportional bars

Size segments from shares (`0..1`), not counts. Put the meaning in an
`aria-label` and a qualitative summary string. Print no numbers.
See `DimensionRow` in `components/tools/ChannelAuditTool.tsx`.

---

## 7. Checklist before shipping a tool change

Run through this on the rendered page, not the code.

- [ ] No 0-100, 0-10, X/Y, letter grade, or star rating anywhere
- [ ] No percentage we calculated ourselves
- [ ] No multiplier or ratio between two YouTube values
- [ ] No count of items failing one of our own checks
- [ ] Sample-size counts read as sample size, for example "last 30 uploads"
- [ ] Every statistic followed by its unit word
- [ ] `DerivedMetricsNotice` present on the result set
- [ ] LLM output contains no digits about the channel
- [ ] Nothing new persisted beyond 30 days
- [ ] API response inspected in the network tab, not just the UI
- [ ] Marketing copy, meta description, and any screenshot match the
      shipped behaviour

That last one matters. Report V.1 flagged marketing screenshots showing
scoring UI that had already been removed from the product.

---

## 8. Review history

| Report | Date | Issue | Resolution |
|---|---|---|---|
| V.1 | 2026-07-24 | Missing YouTube ToS reference in Terms; derived metrics across all tools | Added ToS section; removed all composite scores, grades, subscores, multipliers |
| V.2 | 2026-08-07 | Retention over 30 days; unlabelled view icons | Cut history to 4 weekly snapshots with TTL; stopped logging YouTube statistics; labelled every statistic |
| V.3 | 2026-08-08 | Self-computed counts and percentages still present | Replaced affected counts with qualitative scale; replaced big-channel share and outlier count with qualitative bands; rewrote verdict prose |
| V.4 | 2026-08-11 | Disclaimer required | Added `DerivedMetricsNotice` across all tools, Terms, and Privacy |

Confirmations given to the reviewer that must stay true:

- One project number only: `380359419674`
- No OAuth, no user accounts, public data only, server-side API key
- Per-query cache 24 hours maximum
- Weekly refresh for user-tracked channels, 4 snapshots maximum
- Anonymous logs 30 days maximum, hashed source IDs, no YouTube
  statistics
- Purge on user request within 7 days

---

## 9. Standing obligations from the quota approval

The quota extension was approved on 2026-09-17 for 6 months (project
`380359419674`, 160,000 units/day default plus 30,100/day for
`search.list`). Three conditions make this document a live asset rather
than a record of a closed episode.

**A compliance audit may be requested at any time.** This document is
the answer to that request. It only works if it stays true, which means
updating it in the same commit as any change to what a tool displays,
not afterwards.

**The grant is locked to the stated use case.** It covers the tool set
described in the application: analysis of public channel and video
metadata for creators, free and without accounts. A materially
different kind of tool, anything that redistributes content, anything
behind a paywall, or anything that touches authenticated user data
needs a fresh quota request before it ships.

**Branding Guidelines apply.** https://developers.google.com/youtube/terms/branding-guidelines
In practice: no YouTube logo or play-button mark in our branding, no
name that reads as an official YouTube product, attribution where
YouTube data is shown, and links back to the original YouTube URLs.
This is why the site logo does not use a play button.

Quota can also be reduced for underuse or for any compliance lapse.
Renewal should start around **2027-02-17**. See
`docs/youtube-api-quota-audit.md` for the per-tool capacity table.

---

## 10. If a new violation notice arrives

1. Read which policy number is cited and look at exactly what is
   circled in the screenshots. The circles are more precise than the
   prose.
2. Note what is visible but not circled. That is the reviewer telling
   you what passes.
3. Fix, deploy, verify on production, then reply. Never reply
   describing a fix that is not live.
4. Reply itemised against their numbering, and end by inviting them to
   flag anything retained that should also go. Cheaper than another
   round.
5. Update this document.
