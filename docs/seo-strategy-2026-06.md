# SEO Strategy — June 2026

Based on 10,003 broad-match US YouTube-niche keywords (522,550 monthly volume).
Source: `YouTube_broad-match_us_2026-06-09.csv`.

---

## Headline findings

| # | Cluster | Volume | Coverage | Action |
|---|---|---|---|---|
| 1 | SEO general (`youtube seo`, `youtube seo tool`, `youtube seo tools`) | 65,360 | Partial (homepage, /tools) | **Optimize homepage + /tools as primary SEO destinations** |
| 2 | **Transcript generator** | 55,610 | **None** | **Build YouTube Transcript Generator (highest-volume gap)** |
| 3 | Subscriber how-to | 42,910 | None | **3 guide pages — informational, high volume** |
| 4 | Keyword research | 36,350 | `/tools/youtube-keyword-tool` (live) | **Rename + optimize page H1/title for "youtube keyword tool" 12,100/mo** |
| 5 | Name generator | 30,260 | `/tools/youtube-channel-name-generator` (live) | **Optimize + add Handle/Username Generator** |
| 6 | Tag generator | 18,050 | Two tools live | Consolidate landing copy, internal-link the two |
| 7 | **Monetization checker** | 17,110 | **None** | **Build YouTube Monetization Checker** |
| 8 | Thumbnail | 15,040 | Preview + Downloader live | Add **AI Thumbnail Generator** to capture demand |
| 9 | **Copyright checker** | 14,760 | None | **Build YouTube Copyright Music Checker** (limited scope — music-only) |
| 10 | Title generator | 7,970 | Live + Score Checker | Optimize title pages |
| 11 | Description generator | 7,450 | Live | Optimize landing |
| 12 | Comments check | 7,790 | None | Guide page (informational) |
| 13 | Converter (mp3/mp4) | 8,690 | **DO NOT BUILD** | YouTube ToS violation — skip |
| 14 | Rank checker | 4,120 | None | **Build YouTube Rank Checker (low-hanging — we have the API)** |
| 15 | Embed | 3,140 | Live | Re-optimize H1 to match queries |
| 16 | History check | 3,210 | None | Skip (low conversion, navigational) |
| 17 | Script generator | 2,570 | None | Optional AI tool — medium priority |
| 18 | Shorts generator | 2,930 | None | Optional AI tool — medium priority |
| 19 | Clip generator | 1,190 | None | Skip — too niche, video-processing infra needed |

---

## NEW TOOL ROADMAP (priority order)

### Sprint 1 — high-volume, low build cost

#### 1. **YouTube Transcript Generator** ★★★★★

- Target keyword: `youtube transcript generator` — **22,200/mo · KD 70**
- Long-tail: `youtube video transcript generator` 4,400 · `generate transcript from youtube video` 2,400 · `free youtube transcript generator` 1,900 · `youtube transcript generator free` 1,900 · `youtube closed captions generator` 880
- **Total cluster volume: 55,610/mo** — biggest gap by far
- **Build approach:** Use `youtubetranscript.com`-style scraping of YouTube's public timedtext endpoint, or use `youtube-transcript-api` Python equivalent in Node. Zero API cost.
- **Differentiator vs Tactiq/NoteGPT:** instant + no signup + paste-anything + multiple format export (TXT/SRT/VTT/JSON) + AI summary button (paid Haiku call, gated by per-IP rate limit) that turns transcript → "5-bullet summary" + "5 key quotes" + "3 article outline"
- **Slug:** `youtube-transcript-generator`
- **Stage:** Research (or new "Convert" sub-bucket)
- **Effort:** 2 days

#### 2. **YouTube Monetization Checker** ★★★★

- Target: `youtube monetization checker` 2,400 · `youtube monetize checker` 1,600 · `youtube monetization check` 1,000 · long-tail 17K total
- **Build approach:** YouTube Data API `channels.list` → check subscriber count ≥ 1,000 AND check uploads count. Watch hours can't be fetched via public API → present as "thresholds met / not met" for the verifiable criteria + clear note explaining the watch-hours limitation. AdSense eligibility checklist below.
- **Differentiator:** Most existing tools just check subscriber count — we add the full YPP requirements checklist + AI-generated "what to do next" CTA linking to our other tools.
- **Slug:** `youtube-monetization-checker`
- **Stage:** Analyze
- **Effort:** 1 day

#### 3. **YouTube Rank Checker** ★★★★

- Target: `youtube rank checker` 880 · `youtube video rank checker` 480 · ~4K cluster total
- **Build approach:** YouTube Data API `search.list` for the keyword (already in our quota plan), then scan first N pages for the user's video ID. Cache 1h per (keyword, videoId).
- **Differentiator:** Reuses our existing search.list quota allocation. Pair with Niche Check for "keyword opportunity → rank → fix" loop.
- **Slug:** `youtube-rank-checker`
- **Stage:** Analyze
- **Effort:** 1 day

#### 4. **YouTube Username / Handle Generator** ★★★

- Target: `youtube username generator` 2,900 · `youtube handle generator` 320 · `name for youtube generator` 720 · `random youtube name generator` 720
- **Build approach:** Spinoff of existing Channel Name Generator, but constrained to handle format (no spaces, lowercase, max 30 chars, @-prefix). AI-generated with style options (clean / playful / professional).
- **Slug:** `youtube-username-generator`
- **Stage:** Research
- **Effort:** 0.5 day (fork channel-name-generator)

### Sprint 2 — medium-volume, medium effort

#### 5. **AI YouTube Thumbnail Generator** ★★★

- Target: `youtube thumbnail generator` 1,600 · `ai youtube thumbnail generator` 1,000 · ~5-6K total
- **Build approach:** Either (a) Bring-your-own image + AI-suggested text overlay positions + style, or (b) text-to-thumbnail via image-gen API (costly). Recommend (a) for cost: user uploads image, we run Haiku to suggest 3 title-overlay placements + color choices + caption variants, plus render preview using canvas.
- **Slug:** `youtube-thumbnail-generator`
- **Stage:** Optimize
- **Effort:** 3 days

#### 6. **YouTube Copyright Music Checker** ★★

- Target: `youtube copyright checker` 1,600 · `copyright checker youtube` 1,300 · ~7K cluster (excluding "copyright school" 3,600 which is unrelated)
- **Build approach:** Scope it narrow — "check if a song title is likely copyright-claimed on YouTube". Input: song name/artist. Output: lookup against known music DB heuristic + YouTube search for the song + read top videos' descriptions for "label" markers.
- **Honest framing:** "Quick check, not a guarantee — Content ID is the only source of truth." 
- **Slug:** `youtube-copyright-music-checker`
- **Stage:** Publish
- **Effort:** 2 days

#### 7. **AI YouTube Script Generator** ★★

- Target: `youtube script generator` 880 · cluster ~2.5K
- **Build approach:** Haiku prompt: input topic + hook + duration → output Intro/Body/Outro structure with timestamps. Length-tiered (60s / 5min / 10min).
- **Slug:** `youtube-script-generator`
- **Stage:** Publish
- **Effort:** 1 day

### Sprint 3 — optional / lower priority

- **AI Video Summarizer** (chains off Transcript Generator) — 590+ volume
- **AI YouTube Shorts Script Generator** — 2.9K volume but heavy LLM cost
- **YouTube Shadowban Checker** — 210 volume but low KD=4
- **YouTube Adsense Income Checker** — 320 volume (pair with Money Calculator)

---

## CONTENT / GUIDE ROADMAP

These are big informational queries — better as guides than tools.

| Guide URL | Target keywords | Volume | Plan |
|---|---|---|---|
| **`/guides/how-to-check-youtube-subscribers`** ★★★★★ | "how to check subscribers on youtube" 6,600 · "how to check who are your subscribers on youtube" 6,600 · long-tail 30K | 40K+ | New article: walk through Studio + 3rd-party tools, include CTA to Channel ID Finder + Visibility Score. Could be a "tool + how-to" combo page. |
| **`/guides/youtube-monetization-requirements-2026`** ★★★ | "youtube monetization policy ai generated content 2025/2026" 700 · evergreen YPP eligibility queries | 5K+ | New article: subscriber/watch-hour thresholds, AI content rules update for 2026. Pair with Monetization Checker. |
| **`/guides/youtube-copyright-school`** ★★★ | "how to check if i completed copyright school youtube" 3,600 + related | 4K | New article on Copyright School completion + status check. |
| **`/guides/check-youtube-history-recap`** ★★ | "how to check youtube history" 720 · "how to check youtube recap" 880 · "how to check youtube wrapped" 480 | 2K | New article (note: youtube recap is the YT equivalent of Spotify Wrapped). |
| **`/guides/youtube-seo-2026-complete-guide`** *(existing)* | "youtube seo" 6,600 · "youtube seo tips" 1,000 · "youtube seo best practices" 720 · "what is youtube seo" 1,000 · "youtube seo best practices 2025" 1,000 | 12K+ | Update H1 + title to include "2026" prominently, add section "youtube seo best practices 2026" 720 |
| **`/guides/how-to-write-youtube-titles`** *(existing)* | "youtube seo title" 1,000 + adj | 2K+ | Update meta to target "youtube seo title". |
| **`/guides/youtube-tags-best-practices-2026`** *(existing)* | Tag-related informational | 2K+ | Already optimized. |

---

## EXISTING PAGE OPTIMIZATION

### Homepage (`/`) — TOP PRIORITY

**Current weakness:** title/meta focused on broad branding, not the high-value "youtube seo tool(s)" cluster.

**Target keywords (low KD, high volume — best opportunity on the entire site):**
- `youtube seo tool` — 2,400 · **KD 23 ★**
- `youtube seo tools` — 1,900 · **KD 25 ★**
- `seo tools for youtube` — 1,300 · KD 23
- `youtube seo` — 6,600 · KD 62 (aspirational)
- `youtube tools` — 720 · KD 53

**Proposed changes:**
- **H1:** "Free YouTube SEO Tools — 21 tools to research, optimize, and grow your channel"
- **Title tag:** "Free YouTube SEO Tools — Visibility Score, Channel Audit, AI Title Generator (2026)"
- **Meta description:** "21 free YouTube SEO tools — no signup. Run a Channel Audit, generate AI titles/tags/descriptions, check niche opportunity, and track Visibility Score over time."
- **Above-the-fold copy:** lead with "Free YouTube SEO toolkit" not "creator workflow"
- **Section heading:** rename "The creator workflow" → "Free YouTube SEO tools by stage" (keep workflow taxonomy)
- **FAQ section** at bottom with "what is youtube seo", "youtube seo best practices", "youtube seo tips" (low KD)

### `/tools` — Stage 2 priority

**Currently:** "Free YouTube SEO tools" (H1) — already good!

**Optimize:**
- Title tag: change from "Free YouTube SEO tools" to "Free YouTube SEO Tools — 21 free tools for creators"
- Add intro paragraph targeting "youtube seo tools" / "seo tools for youtube" / "youtube tools" (low-KD opportunity)
- Add internal-link anchors to all 4 stage hubs at the top

### Tool-specific optimization

| Tool page | Current H1 | Target keyword | Volume | Suggested H1 / Title |
|---|---|---|---|---|
| `/tools/youtube-keyword-tool` | "YouTube Keyword Tool" | `youtube keyword tool` | **12,100** KD 66 | Keep H1 = "YouTube Keyword Tool". **Title:** "YouTube Keyword Tool — Free Keyword Research (20+ suggestions)". Subtitle h2: "Free YouTube keyword research tool". Add long-tail variants in copy: `youtube keyword research tool`, `youtube keyword generator`, `keyword tool youtube`. |
| `/tools/youtube-channel-name-generator` | "AI YouTube Channel Name Generator" | `youtube channel name generator` | 5,400 KD 33 | Keep H1. Add h2 "YouTube name generator" (target 8,100 KD 32). Add internal cross-link to new `/tools/youtube-username-generator`. |
| `/tools/youtube-tag-generator` | "AI YouTube Tag Generator" | `youtube tag generator` 5,400 + `youtube tags generator` 2,400 | 9K | Keep H1. Add h2 "YouTube tags generator" + paragraph targeting "tag generator youtube" 1,900 and "tag generator for youtube" 1,300. |
| `/tools/youtube-tag-extractor` | "YouTube Tag Extractor" | `youtube tag extractor` (small) | low | Cross-link from `/tools/youtube-tag-generator`. Could be combined or kept distinct. |
| `/tools/youtube-title-generator` | "AI YouTube Title Generator" | `youtube title generator` 2,900 · `ai youtube title generator` 590 | 4K | Keep H1. Make sure "AI YouTube Title Generator" is in title tag (low-KD direct match). |
| `/tools/youtube-title-score-checker` | "YouTube Title Score Checker" | `youtube title checker` 390 · `youtube title strength checker` 590 | 1K | **Update H1 to "YouTube Title Score Checker — Free Title Strength Test"**. Adds direct match for "title strength checker". |
| `/tools/youtube-description-generator` | "AI YouTube Description Generator" | `youtube description generator` | 2,900 | Already good. Add subtitle "Free YouTube description generator" (covers exact match). |
| `/tools/youtube-hashtag-generator` | "AI YouTube Hashtag Generator" | `youtube hashtag generator` | 880 | Already good. Title direct match. |
| `/tools/youtube-thumbnail-preview` | "YouTube Thumbnail Preview Tool" | `youtube thumbnail preview` (low) | low | Cross-link from `/tools/youtube-thumbnail-generator` (new) when built. |
| `/tools/youtube-thumbnail-downloader` | "YouTube Thumbnail Downloader" | high volume covered | — | Add internal link to Thumbnail Preview + (new) Thumbnail Generator. |
| `/tools/youtube-money-calculator` | "YouTube Money Calculator" | `youtube earning checker` 590 · `youtube pay checker` 590 · `youtube channel earning checker` 260 | 1.5K | Add H2 "YouTube earning checker" + H2 "YouTube channel earning checker" to capture these. |
| `/tools/youtube-channel-id-finder` | "YouTube Channel ID Finder" | already strong | — | Add subtitle "YouTube name checker / handle finder" (covers 720+) |
| `/tools/youtube-embed-code-generator` | "YouTube Embed Code Generator" | `youtube embed code generator` 720 · variants | 3K cluster | Keep H1. Add "embed code generator youtube" + "youtube embed generator" as H2 variations. |
| `/tools/youtube-chapter-generator` | "YouTube Chapter & Timestamp Generator" | `generate youtube chapters free` 320 | low | Add subtitle "Generate YouTube chapters free". |
| `/tools/youtube-visibility-score` | "YouTube Visibility Score" | `youtube analytics tool(s)` 700 · `youtube channel seo tools` 320 | 1K+ | Add H2 "YouTube channel SEO checker" (covers 320 KD 21!) and "YouTube analytics tool". |
| `/tools/youtube-channel-audit` | "YouTube Channel Audit" | `youtube channel seo checker` 320 KD 21 | low | **Critical: add H2 "Free YouTube channel SEO checker" — low KD direct match**. |
| `/tools/youtube-niche-check` | new tool | covered well | — | Cross-link from Outlier/Audit. |

---

## QUICK-WINS (low-KD, high-volume, easy to capture)

Sorted by ROI:

| Keyword | Volume | KD | Where to target | Effort |
|---|---|---|---|---|
| **youtube seo services** | 1,600 | **17** | Homepage FAQ or new page | 30 min |
| **youtube seo service** | 1,000 | **16** | Homepage FAQ | 10 min |
| youtube seo agency | 1,600 | 24 | New page or FAQ on homepage | 30 min |
| **youtube seo london** | 720 | **8** | Skip (geo-specific, but worth knowing) | — |
| **youtube monetize checker** | 1,600 | **20** | New tool (Monetization Checker) | 1 day |
| youtube seo tool | 2,400 | 23 | Homepage primary | 1h |
| youtube seo tools | 1,900 | 25 | /tools page primary | 1h |
| youtube to mp4 converter tool | 1,900 | 24 | **Skip — ToS violation** | — |
| **youtube channel seo tools** | 320 | **18** | Channel Audit H2 | 5 min |
| **youtube channel seo checker** | 320 | **21** | Channel Audit H2 | 5 min |
| youtube embed code generator | 720 | 24 | Embed Generator H1 (already good) | — |
| **fake-youtube-subscriber-checker** | 320 | **5** | New tool or guide | 30 min |
| **youtube shadowban checker** | 210 | **4** | Tiny tool / guide | 2h |
| youtube seo best practices 2025 | 1,000 | 22 | Update existing guide | 30 min |
| **youtube monetize checking** | 480 | 34 | Monetization Checker page | 5 min |

---

## EXECUTION PLAN

### Week 1 — Quick wins + 1 tool

- [ ] Update homepage H1/title/meta (see above) — 30 min
- [ ] Update `/tools` H1/title — 15 min
- [ ] Update existing tool H2s per the table above — 1 hour
- [ ] Update `youtube-seo-2026-complete-guide` to add "2026" in H1+title + new section for 2026 best practices — 30 min
- [ ] **Build YouTube Transcript Generator** (Sprint 1 #1) — 2 days
- [ ] **Build YouTube Monetization Checker** (Sprint 1 #2) — 1 day
- [ ] **Build YouTube Rank Checker** (Sprint 1 #3) — 1 day

Total: ~1 week. Captures ~95K monthly volume of currently-uncovered demand.

### Week 2 — Content + 1 tool

- [ ] Write guide: `/guides/how-to-check-youtube-subscribers` — 1 day
- [ ] Write guide: `/guides/youtube-monetization-requirements-2026` — 0.5 day
- [ ] Build **Username Generator** (fork name-generator) — 0.5 day
- [ ] Write guide: `/guides/youtube-copyright-school` — 0.5 day

### Week 3+ — Sprint 2 tools

- [ ] **AI Thumbnail Generator** — 3 days
- [ ] **Copyright Music Checker** — 2 days
- [ ] **AI Script Generator** — 1 day

---

## TRACKING

After implementation, monitor in Google Search Console:
- Position for "youtube seo tool", "youtube seo tools", "youtube transcript generator", "youtube monetization checker", "youtube rank checker"
- Impressions per cluster
- CTR for homepage vs tool pages

Re-pull keyword data quarterly to spot new trending queries (especially "2026" suffixes and emerging AI-content monetization queries).
