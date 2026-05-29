# seocheck.tools — backlog

State as of 2026-05-29, after Sprint 3 (Title Score Checker shipped, commit `7269402`). Live tools count is now **14**.

## Sprint history

| Sprint | What | Status |
|---|---|---|
| 1 | Scaffold, Next.js 14, brand, 4 legal stubs | ✅ |
| 2 | AI cost protection (Turnstile + rate limit + cache + budget) | ✅ |
| 3a | 7 browser/serverless tools | ✅ |
| 3b | 6 AI-powered tools | ✅ |
| 4 | About/Privacy/Terms/Contact rewrite (GDPR+CCPA-aware) | ✅ |
| 5 | JSON-LD schemas, dynamic OG images, 3 cornerstone guides | ✅ |
| 6 | Tool page expansion (~800-1200 words each via `ToolContentSections`) | ✅ |
| 7 | Title Score Checker — first evaluation tool, transparent heuristics | ✅ |

## Confirmed next sprints

### Sprint 4 — Video Audit Tool ✅ SHIPPED

Shipped commits `5b63b6d` → `28aba2b` → `52828b4` → `f6e73bc`. 15 live tools total. Hero feature on the homepage (audit input in a brand-tinted feature band right below the brand hero).

**Architecture decision: oEmbed + /watch scraping, NOT YouTube Data API.**
The audit uses YouTube oEmbed (https://www.youtube.com/oembed) for reliable title/channel/thumbnail (no rate limit), then /watch HTML scrape for tags/description/chapters/hashtags. Runtime is `nodejs` (not `edge`) because Vercel Edge IPs sit on Cloudflare Workers pool which YouTube aggressively 429s.

**Calibration trigger — revisit YouTube Data API integration if:**
- Vercel Analytics shows the "Partial audit" amber banner firing on >20% of audit requests in the production logs, OR
- A traffic spike (Reddit/HN post) reveals systematic 429s.

If triggered, refactor `app/api/youtube-video-audit/route.ts` so YouTube Data API v3 (`videos.list` parts=snippet,statistics,contentDetails — 1 unit/call, 10K/day quota) is the primary source, and /watch scraping is used only for the tags dimension (the one field API doesn't return for non-owners since 2022).

### Sprint 5 — Competitor Channel Analyzer

### Sprint 5 — Competitor Channel Analyzer

Paste competitor handle/URL → top 10 videos by views with title (auto-scored via Title Score Checker), view/comment/like counts, tags (scraped from /watch pages). Bottom of result: Claude Haiku pattern summary — "3 things their top 10 have in common that you can copy."

**New infrastructure needed**:
- `YOUTUBE_API_KEY` in Vercel env (Google Cloud Console → YouTube Data API v3)
- 24h Redis cache on channel ID → top 10 video data (popular channels = cache hits)
- Per-IP rate limit 3 lookups/day (stricter than AI tools because of API quota)
- Scraping logic for tags: 10 parallel /watch fetches with backoff

**Quota reality**: 10K units/day default = ~98 unique channels/day before exhaustion. Cache absorbs popular channels (MrBeast, MKBHD, etc.) but long-tail niche channels miss. Monitor quota burn for 1-2 weeks; if Reddit/HN spike risks blowing it, file Google quota extension request.

**Differentiation vs vidIQ/Hadron**: not "another metrics scraper" — the LLM pattern summary + integration with our Title Score is what makes it ours.

## Moat / differentiation ideas (deferred)

The original Sprint 3 deferral pool. Channel Pack was pivoted to Video Audit (Sprint 4); the other two remain.

### 1. Templates / Frameworks library by niche

**Strongest long-term SEO moat** but heavy editorial lift.

- Curated title/description/hashtag templates organised by niche (gaming, finance, tech, lifestyle, food, fitness, education, etc.)
- Each template = pattern + when-to-use + 3-5 real examples + linked tool
- v1: 3 niches × 5 templates = 15 entries, one weekend of writing
- Scaled: 10-20 niches × 10-20 templates = 100-400 indexable pages (programmatic SEO gold)
- Why defensible: requires real niche expertise to write credibly; AI slop detectable by Google
- Why valuable: each template page targets long-tail like "gaming youtube title templates"

**When to start:** after stable AdSense + some user data on which niches matter most. Start with the top 3 by traffic, expand iteratively.

### 2. Batch workflows / CSV export

**High revenue ceiling** but compute cost catastrophe without paid tier.

- Agency / power-user feature: 50 video topics in, CSV of titles/tags/descriptions out
- Real B2B revenue model (Stripe + pricing page)
- Compute cost reality: 50 batch × $0.003 = $0.15/req. Without paid wall, abuse risk catastrophic

**When to start:** DO NOT build until (a) site does $200+/mo AdSense buffer, (b) Stripe integration in place, (c) ready to handle support tickets from paying users. Phase 3 territory.

### 3. Channel Pack — workflow wizard

**High concept differentiation**, risky without user-pattern data.

- Single guided flow: idea → keyword → title → description → hashtags → chapters
- State preserved between steps (URL params or localStorage)
- Output: complete metadata bundle ready to paste into YouTube Studio
- Risk: may confuse single-tool searchers ("youtube tag generator free"); needs separate prominent entry point

**When to start:** AFTER Vercel Analytics events reveal which tools users actually chain together. Sprint candidate after analytics events ship.

## Smaller audit follow-ups not yet implemented

Roughly ROI-ordered:

- **Vercel Analytics events** (~1 hour) — wire `tool_used`, `tool_result_copied`, `faq_expanded`, `external_link_clicked`. Critical data for future moat decisions, especially Channel Pack flow design. Should be NEXT before any moat work.
- **/tools index improvements** (~1.5 hr) — category filters (AI / Utilities / Downloaders / Calculators / Generators), "Start here" workflow callout, "Most popular" section.
- **Newsletter signup CTA** (~30 min) — single inline email signup on homepage + footer of tool pages. Pick Buttondown or Beehiiv. Foundational for lead capture before AdSense.
- **Replace "SEO-optimized" buzzwords with specifics** (~15 min) — 3-4 instances across copy. Tactical cleanup.
- **i18n (EN + RU/ES/PT)** (~6-8 hr) — Phase 2. Tool pages translated = 3x long-tail growth. Pick languages by Vercel Analytics region data once it's collecting.
- **Lighthouse audit + CWV fixes** (~2-3 hr) — Task #7 in conversation tracker. Needs local Mac.

## What we explicitly deferred (and why)

- **Multi-guide-per-tool content cluster** — auditor wanted "1 money guide + 2-3 supporting" per tool × 13 = 40-50 guides. We agreed this is overkill. 3 cornerstone guides cover the cluster.
- **Named operator on /about** — auditor pushed for more concrete E-E-A-T. We chose abstract "we" intentionally during privacy/terms rewrite to keep brand vs personal-identity decoupled.
- **Full corporate-style privacy policy with DPO contact** — overkill for indie tool site. GDPR+CCPA-aware version is the right shape.

## Current state to remember

- Production URL: `https://seocheck.tools` (DNS via Cloudflare to Vercel; A/CNAME on DNS-only, NOT Proxied)
- Upstash Redis shared with `statusworld` via `seo:` namespace prefix
- AI cost protection: per-IP 15/day, $5/day global cap, 24h cache
- **14 live tools** = 7 browser/serverless + 6 AI-powered + Title Score Checker
- **3 cornerstone guides** at `/guides/{youtube-seo-2026-complete-guide,how-to-write-youtube-titles,youtube-tags-best-practices-2026}`
- Tool pages now 800-1200 words each via `ToolContentSections`
- All schemas wired (WebSite / Organization / SoftwareApplication / BreadcrumbList / FAQPage / Article)
- Dynamic per-page OG via `/api/og?title=...&subtitle=...&ai=1`
- Vercel Analytics installed but **only collecting pageviews** (no custom events yet)
- Cloudflare Turnstile gates the 6 AI tools
- GitHub: `github.com/dominovd/seocheck-tools`, auto-deploys to Vercel on push to `main`

## Recommended next sequence

1. Wait for GSC indexing data (1-2 weeks post-deploy). Use real traffic numbers to pick which niches/templates to prioritise.
2. Wire up **Vercel Analytics events** FIRST — provides the data needed for Channel Pack design and Templates niche selection. 1 hour of work, massive future payoff.
3. THEN decide between Templates v1 or Channel Pack v1 based on event data.
4. Defer Batch workflows until AdSense revenue covers compute risk + Stripe is wired.
