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

## Moat / differentiation ideas (deferred)

The three we didn't pick for Sprint 3 — kept on the table for later.

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
