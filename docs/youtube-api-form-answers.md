# YouTube API Quota Extension Form — Answers Reference

Use this file to quickly refill the form if it gets reset/reloaded.
Form URL: https://support.google.com/youtube/contact/yt_api_form

---

## Section 1: Request Type
- **Request Type:** Complete a compliance audit to request for additional quota

## Section 2: Organization & Contact Information
- **Are you applying:** As an individual user
- **Your Full Legal Name:** Denis Dominov
- **Organization Name:** self
- **Parent Company Name:** self
- **Your Organization's Primary Website:** https://seocheck.tools
- **Country:** Other (please specify) → Ukraine
- **Street Address:** Sichovykh Striltsiv Street
- **City:** Dnepr
- **State/Province:** Dnipropetrovsk
- **Postal Code:** 49000
- **Industry/Business Vertical (Category):** Marketing and Advertising Technology
- **Organization Size / Type:** Startup (fewer than 10 employees)
- **Primary Contact Name:** Denis Dominov
- **Primary Contact Email:** dominov.denis@gmail.com
- **Primary Technical Contact:** Same as Primary Contact
  - Name: Denis Dominov
  - Email: dominov.denis@gmail.com

## Section 3: Business Model and Google Contacts
- **Business Model / Monetization:** Free service + Advertising (AdSense on website)
- **Do you sell advertisements or sponsorships ON or WITHIN YouTube video content or the embedded YouTube player itself?** No, ads only appear elsewhere on the page
- **Target audience:** Individual Content Creators (YouTubers, influencers)
- **Business description (5000 chars):**

```
seocheck.tools is a free, no-signup YouTube SEO platform that helps independent
creators audit, optimise, and track their channel performance. Our application
is monetised through Google AdSense and operates without user accounts — there
is no signup wall, no paid tier. The YouTube Data API is the foundational data
source for our channel-level analyses, alongside our own heuristics (title
scoring, metadata audit) and Anthropic's Claude Haiku for pattern summaries.
We offer 21 tools across the creator workflow (Research, Optimize, Publish,
Analyze). The flagship analytical tools are: Video Audit (per-video scoring +
AI fix), Channel Audit (whole-channel scan), YouTube Visibility Score
(composite 0-100 metric), Competitor Channel Analyzer (top 10 + AI pattern
summary), Outlier Finder (videos breaking 3x median), Niche Check (topic
opportunity verdict), and weekly historical Visibility Score tracking on
user-marked channels. Creators that use our tools publish better-titled,
better-described videos with proper chapter formatting, leading to higher
viewer satisfaction. We help small independent creators compete with paid
SEO suites for free.
```

## Section 4: API Client Overview and Access Information
- **API Client Name:** SEO Check Tools
- **Does the API Client name contain "YouTube"?** No
- **Primary Access URL:** https://seocheck.tools
- **Privacy Policy URL:** https://seocheck.tools/privacy
- **Terms of Service URL:** https://seocheck.tools/terms
- **Is your API Client publicly accessible?** Yes
- **How many project numbers are you adding?** 1
- **Project Number:** 380359419674
- **Project ID:** seocheck-tools
- **Use Case (Section 4):**
  - Tools for Creators ✓
  - Analytics & Reporting ✓
- **OAuth 2.0 required?** Not applicable (no user-facing component)
  - **Note:** if form rejects "Not applicable", try "No" — our app uses API key only, no OAuth flow at all

## Section 5: Use Cases and Quota Extension Details (Project #1)
- **I have read and agree to the additional policies for derived metrics and data storage:** ✓ Checked
- **Expected API Usage Volume:** 10,000 to 100,000 requests per day
- **Selected endpoints (Project #1):**
  - youtube.search.list ✓
  - youtube.channels.list ✓
  - youtube.videos.list ✓
  - youtube.videoCategories.list ✓
- **Quota request:** Above Default quota
- **Total Per Day Quota:** 150000
- **Peak Per Min Quota:** 500
- **Detailed Justification (default endpoints, 150K daily):**

```
seocheck.tools is a free YouTube SEO platform serving content creators.
Our non-search endpoints (videos.list, channels.list, videoCategories.list)
power our Channel Audit, Outlier Finder, Visibility Score, Historical
Tracking, and Niche Check tools. We project 50-200 audits/day at launch
growing to 1,000-3,000 audits/day within 6 months. We aggressively cache
results in Upstash Redis (24h TTL on channel data, 7d TTL on videos) and
enforce per-IP rate limits (5-25 calls/day depending on tool tier). The
150K daily quota gives organic-growth headroom without throttling
legitimate creator usage.
```

- **search.list Per Day Quota:** 30000
- **search.list Peak Per Min:** 300
- **search.list Justification:**

```
search.list (100 units/call) powers our Niche Check tool, which evaluates
whether a content topic is worth pursuing by analyzing the top 25 SERP
videos for freshness, outlier ratio, and small-channel presence. We
rate-limit Niche Check to 5 calls per IP per day, cache results 24h, and
project ~300 searches/day at scale (= 30,000 quota units). search.list is
the only quota-expensive call in our entire surface area — every other
endpoint is 1 unit.
```

## Section 6: Required Evidence (file uploads)
- **Privacy Policy Screenshot:** Screenshot of https://seocheck.tools/privacy (showing YouTube API Services section)
- **Homepage Screenshot:** Screenshot of https://seocheck.tools (footer with Privacy link + YouTube branding visible)
- **Terms of Service Documentation:** PDF export of https://seocheck.tools/terms
- **Conditional Evidence (Dashboard / Feature Screenshots — for Analytics & Reporting):** Screenshot of Channel Audit or Visibility Score result page

## Section 7: Attestations (check all)
- ☑ YouTube API Services Terms of Service
- ☑ Google Privacy Policy
- ☑ Developer Policies (acknowledge change notification)
- ☑ Termination Understanding
- ☑ Demo Account Terms Waiver
- ☑ Accuracy of Information (Truthfulness)
- ☑ Use of Submission Data (Data Usage Consent)
- ☑ Support Recording Consent

---

## Known issue
The form's OAuth radio group (Section 4) becomes sticky-invalid after a failed Submit attempt. If this happens:
1. **Don't reload the page** — you'll lose everything
2. Try clicking on a different OAuth option (Yes / No / Not applicable) cycling once, then Submit
3. If still stuck — reload page in fresh tab and refill from this reference (should take 20-30 min with files already prepared)
