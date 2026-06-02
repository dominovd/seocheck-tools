# YouTube API Services — Audit & Quota Extension

Forms to fill out at:
- Main entry point: https://support.google.com/youtube/contact/yt_api_form
- Detailed audit form (after initial outreach Google sends): a multi-page Google Form covering each topic below.

Default project quota is 10,000 units/day. Audit + extension is **free**. Approval requires a clear, legitimate use case and demonstrated compliance with YouTube API Terms of Service. Live working product strengthens the application significantly — we ship it before applying.

---

## Draft answers (copy/adapt for each field)

### Project details

- **Application name**: SEO Check Tools
- **Application URL**: https://seocheck.tools
- **Project / API client**: (the Google Cloud project ID where `YOUTUBE_API_KEY` lives)
- **Primary contact**: Denis Dominov, dominov.denis@gmail.com
- **Country**: (your country)

### What the application does

> SEO Check Tools is a free public web application that helps independent YouTube creators understand and improve the SEO quality of their own channels and benchmark against public competitor channels. It is a measurement-and-recommendation toolkit, not a content distribution tool.
>
> The application is monetised through Google AdSense and operates without user accounts — there is no signup wall, no paid tier. The YouTube Data API is the foundational data source for our channel-level analyses, alongside our own heuristics (title scoring, metadata audit) and Anthropic's Claude Haiku for pattern summaries.

### Specific tools using YouTube Data API v3

List each tool, the endpoints used, and the per-call quota cost. Be specific.

| Tool URL | API endpoints | Units per call | Daily limit per IP |
|---|---|---|---|
| `/tools/youtube-video-audit` (tier-2 fallback) | `videos.list` (snippet + statistics + contentDetails) | 1 | 30 |
| `/tools/youtube-competitor-analyzer` | `channels.list` + `search.list?order=viewCount` + `playlistItems.list` (latest) + `videos.list` (batched) | ~103 | 3 |
| `/tools/youtube-outlier-finder` | `channels.list` + `playlistItems.list` (paginated, 100 IDs) + `videos.list` (batched 50s) | ~5 | 5 |
| `/tools/youtube-channel-audit` | `channels.list` + `playlistItems.list` (10) + `videos.list` (batched) | ~3 | 5 |
| `/tools/youtube-visibility-score` | `channels.list` + `playlistItems.list` (30) + `videos.list` (batched 50s) | ~3 | 5 |
| `/api/cron/refresh-tracked-channels` | Same as Visibility Score, weekly × 200 tracked channels | 600 units/week | n/a (cron) |

### Estimated current daily quota usage

> Today, with our default 10,000 unit quota, we operate at approximately 5,000–8,000 units per day at our current traffic level (under 100 unique users/day). We rely on aggressive 24-hour Redis caching keyed by channel ID and on hashed input — repeat lookups for the same channel within a day cost zero quota.
>
> As traffic grows, we expect to hit the 10K ceiling within the next few weeks. We are requesting a quota extension to scale comfortably to **100,000 units/day** initially, with room to grow to ~1,000,000 units/day at higher traffic.

### Why we need additional quota

> Our most-used flagship tool, the Competitor Channel Analyzer, costs ~100 units per non-cached call (due to `search.list?order=viewCount` being 100 units). Even with 24-hour caching, popular-channel lookups dominate but long-tail unique-channel queries grow as user count grows. At our default 10K/day quota, ~98 unique channel analyses fully exhaust the project budget — clearly insufficient as we approach our first few hundred users/day.
>
> An extension to 100K/day allows us to serve ~1,000 unique channel analyses per day across all tools while keeping headroom for our weekly background tracking cron (~600 units/week). This corresponds to roughly 1,000–3,000 unique users/day on the site.

### Compliance with YouTube API Terms of Service

Address each ToS clause directly. Below are the typical questions.

#### Data storage and retention

> We do not store YouTube user data persistently in any user-identifiable form.
>
> - Audit results are cached in Redis keyed by channel ID with a 12-hour TTL (Video Audit) or 24-hour TTL (Channel Audit, Visibility Score, Outlier Finder, Competitor Analyzer). After TTL expiry data is purged automatically.
> - Our internal anonymous audit log (used to build future aggregated research reports such as "median title score across 10K audited videos") stores SHA-256-hashed channel IDs only — reverse lookup is impossible. The log is bounded to the most recent 10,000 entries per tool.
> - Visibility Score timeline storage (for the optional "Track this channel" feature) holds the channel ID + weekly composite score for up to 26 weeks per channel, capped at 200 tracked channels total. Users implicitly opt in by clicking "Track this channel".
> - No video transcripts, no comments, no view-history data is fetched or stored.

#### User authentication

> We do not authenticate users with YouTube OAuth. No user data from authenticated YouTube accounts is accessed. All API calls use a single server-side API key that operates against publicly available metadata for public channels and videos.

#### Use of YouTube branding

> We do not display the YouTube logo or use YouTube's brand assets. Where channel thumbnails are shown in our UI, they are loaded directly from `i.ytimg.com` (YouTube's own CDN) without re-hosting. Channel and video links always point back to the original YouTube URLs.

#### Compliance with rate limits and quota

> We respect the per-second rate limits documented in YouTube Data API v3 documentation. We never employ multi-account or multi-project rotation to evade quota; this is our single Google Cloud project on the single API key. Our heaviest endpoint (`search.list` at 100 units) is gated by 24-hour caching and a 3-per-IP-per-day rate limit on the tool that uses it.

#### Cross-origin compliance

> The API key is server-side only and never exposed to clients. All API calls happen from our Vercel Edge / Node Lambda runtime. The key is restricted to YouTube Data API v3 only in Google Cloud Console (Application restrictions: None for server-side; API restrictions: YouTube Data API v3 only).

### Roadmap (next 6-12 months) — strengthens the application

Have a concrete forward-looking story. Reviewers want to see this is a serious project, not a one-off script.

> 1. **YouTube Studies** (Q2 2026) — public aggregated research reports built from our anonymous audit log: median title length distribution, most common chapter formats, average outlier rate per niche. These pages strengthen the YouTube creator ecosystem by surfacing patterns that benefit the entire community, free.
> 2. **Niche Opportunity Checker** (Q2 2026) — paste a topic keyword, get a demand-vs-supply verdict. Helps independent creators find under-served niches rather than competing in saturated ones.
> 3. **Quota-extension-aware growth** — with the requested 100K quota we can serve our anticipated 1,000-3,000 daily users without compromising the user experience. Without it we would have to artificially throttle features, which degrades the value to creators.

### Why our application benefits the YouTube ecosystem

> SEO Check Tools is built explicitly for independent creators who cannot afford paid suites like vidIQ ($19/mo) or TubeBuddy ($9/mo). We give them the analytical tools — Visibility Score, Channel Audit, Outlier Finder, Competitor Channel Analyzer — that paid tools gate behind a paywall.
>
> Creators that use our tools publish better-titled, better-described videos with proper chapter formatting, leading to higher viewer satisfaction and lower bounce on the YouTube watch page. Better creator → better YouTube ecosystem.
>
> We are not redistributing YouTube content; we are helping creators understand their own metadata to publish content that performs better on the platform.

---

## Submission checklist before you click Send

- [ ] Live working product at https://seocheck.tools (we have it ✅)
- [ ] Public privacy policy at https://seocheck.tools/privacy (we have it ✅)
- [ ] Public terms of service at https://seocheck.tools/terms (we have it ✅)
- [ ] Contact email reachable: hello@seocheck.tools or dominov.denis@gmail.com (verify ✅)
- [ ] API project ID handy (look up in Google Cloud Console → top-left project picker)
- [ ] Reviewed every answer above for accuracy; corrected any auto-generated number that doesn't match the actual deployed code

## After submission

The audit + quota extension request typically takes **2–6 weeks** for Google to review. You'll get an automated email confirmation, then later a reviewer email (or sometimes silence followed by quota appearing in your Cloud Console).

While waiting:
- Continue operating on the 10K default quota.
- Aggressive caching is doing the work.
- Niche Check tool (P1 below) is also `search.list`-heavy (~100 units/call) so it'll benefit from the same extension.
