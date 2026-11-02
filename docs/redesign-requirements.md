# Redesign requirements

Target: rebuild seocheck.tools on Astro with the new visual direction.
This document is the spec. Build against it, not against the mockup
alone.

Status: draft for approval. Sections marked **[decide]** need Denis to
choose before build starts.

---

## 1. What this redesign is for

The business model is organic search traffic monetised by AdSense.
Every design decision serves one of three goals, in this order:

1. **A visitor arriving from Google search completes one tool action.**
   They landed on a long-tail query, they need the answer fast, they
   leave. Depth of engagement is not the goal.
2. **The page earns an ad impression without hurting the visit.**
   Ad slots are planned into the layout, not bolted on.
3. **The visitor discovers a second tool.** Cheap upside, never at the
   cost of goal one.

Explicitly not goals: account creation, session length, feature
discovery, dashboard-style engagement. The product is a set of
single-purpose utilities, and the design should feel like that.

---

## 2. Non-negotiable constraints

### 2.1 Compliance

`docs/youtube-api-compliance.md` is binding and the redesign is the
highest-risk moment for regressing on it. A new mockup that looks good
with a score ring in it is the exact failure mode.

Design-level rules:

- **No gauge, ring, dial, meter, or progress circle with a number in
  it.** These shapes exist to display a score. Even if the number is
  removed, the shape invites one back later.
- **No letter grades, star ratings, or badge numbers.**
- **No number next to an icon without a unit word.** `1.2K views`, not
  an eye icon and `1.2K`.
- **Proportional bars are allowed** with no printed count or
  percentage, and an `aria-label` carrying the qualitative meaning.
- **Every assessment surface carries the disclaimer component.** Design
  a slot for it. It is roughly 40px tall at desktop widths and must not
  look like an afterthought.
- **Qualitative labels are the primary visual language** for our
  assessments: `High priority`, `Needs attention`, `Ready`, `Missing`,
  `Strong`, `Weak`. Design a proper pill system for these, since they
  now carry the weight that numbers used to.

The mockup Denis provided already follows this. Keep it that way.

### 2.1b Branding and trade dress

The derived-metrics rules above came from the violation reports. These
come from the Branding Guidelines, which the quota approval made a
standing obligation. They are the design-specific half and nobody has
flagged us on them yet, which is exactly why they are easy to break.

Source: https://developers.google.com/youtube/terms/branding-guidelines

- **Do not imitate YouTube's trade dress.** The guidelines name it
  explicitly: no designs confusingly similar to YouTube trademarks, and
  no imitating "the look and feel of YouTube web design properties,
  YouTube brand packaging, distinctive color combinations, typography,
  graphic designs, product icons, or imagery associated with YouTube."
  This is why the brand palette is green, not red, and why the logo
  uses no play-button mark.
- **Red is a reserved color.** Do not use YouTube red as a brand,
  accent, or header color. Our red is confined to the `problem` status
  and never appears as a large filled surface.
- **No play-button shape in the logo, favicon, or app icon.** Rounded
  rectangle plus white triangle reads as the YouTube mark whatever the
  color.
- **Never use "YouTube", "YT", or a variant in the overall product
  name**, and never pair YouTube branding imagery with the product name.
  "SEO Check Tools" is compliant. Descriptive tool names like "YouTube
  Channel Audit" are the accepted "works with YouTube" phrasing, but
  they must never read as the name of the site itself.
- **Attribution is required on any page that displays YouTube content.**
  Developer Policies III.F says a page showing search results, videos,
  channels, playlists, thumbnails, or players must make clear that
  YouTube is the source by displaying YouTube Brand Features. Shipping
  no mark at all avoids the logo-misuse rules but does not satisfy this.
  Design a sourcing treatment, not a branding one: the YouTube Icon
  exists for intermingled sources, must be clickable to YouTube, and
  must not be the most prominent element on the page. See
  `docs/youtube-api-compliance.md` section 3c, this is an open item.
- **Thumbnails stay hotlinked from `i.ytimg.com`.** Do not re-host, crop,
  overlay, or filter them.

Open risk worth a decision: the Thumbnail Preview tool renders a mock
YouTube search and sidebar layout, and a pixel-accurate clone of those
surfaces is the clearest trade-dress exposure on the site. Keep the
preview recognizably ours: our own type scale, our own spacing, no
YouTube red, no YouTube logo, no YouTube iconography, and a visible
label saying it is an approximation by SEO Check Tools. The point of
the tool is the size and crop of the thumbnail, which does not require
copying their chrome.

### 2.1c Source documents

| Document | Why it matters here |
|---|---|
| [Developer Policies](https://developers.google.com/youtube/terms/developer-policies) | The policy numbers cited in every violation report we received. III.A.1 (Terms reference), III.D.1 (one project), III.E.4 (data handling, retention, derived metrics) |
| [Branding Guidelines](https://developers.google.com/youtube/terms/branding-guidelines) | Logo, naming, color, and trade-dress rules. Section 2.1b above |
| [Required Minimum Functionality](https://developers.google.com/youtube/terms/required-minimum-functionality) | What an API client must let users do, including playback via the official player |
| [API Services Terms of Service](https://developers.google.com/youtube/terms/api-services-terms-of-service) | The agreement itself |
| [Complying with the Developer Policies](https://developers.google.com/youtube/terms/developer-policies-guide) | Google's own plain-language guide to the policies |
| [YouTube Terms of Service](https://www.youtube.com/t/terms) | The link our Terms page is required to carry |
| `docs/youtube-api-compliance.md` | Our own binding rulebook, written from the four violation reports. Read this first, it is shorter and specific to us |

### 2.2 Writing

- No em-dashes anywhere in user-facing copy. Comma, period, colon, or a
  middot for UI separators.
- American English, sentence case for headings and buttons.
- No hype words: game-changer, revolutionary, unlock, supercharge.
- Numbers in copy only when they are raw API values or our sample size.

### 2.3 Performance

The site lives or dies on organic search, so Core Web Vitals are a
ranking input, not a vanity metric.

| Metric | Budget |
|---|---|
| LCP | under 2.0s on mobile 4G |
| CLS | under 0.05 including ads |
| INP | under 200ms |
| JS shipped on a tool page | under 100KB gzipped |
| JS shipped on a guide or index page | under 20KB gzipped |

Astro implication: guides, indexes, legal pages, and the marketing
parts of tool pages ship zero JavaScript. Only the interactive tool
widget is an island, hydrated with `client:visible` where it sits below
the fold and `client:load` where it is the primary above-fold element.

---

## 3. Brand and visual system

### 3.1 Colour

| Token | Value | Use |
|---|---|---|
| `brand-500` | `#10b981` | Primary actions, active states, brand accent |
| `brand-600` | darker step | Hover on primary |
| `brand-50` | lightest step | Tinted backgrounds, pill fills |
| `gray-900` | near-black | Headings |
| `gray-600` | mid | Body copy |
| `gray-500` | light | Hints, captions, disclaimer |
| `gray-200` | border | Card borders, dividers |
| `amber-*` | warm | "Needs attention" state |
| `red-*` | warm | "Missing" or high-priority state |
| `orange-*` | warm | Secondary path, "for new creators" segment |

Keep the existing brand green. It is established across the site and in
any existing search snippets.

Semantic mapping for assessment states, use consistently everywhere:

| State | Colour family | Label examples |
|---|---|---|
| Good | brand | Ready, Strong, Keep it up |
| Caution | amber | Needs attention, Fair, Medium priority |
| Problem | red | Missing, Weak, High priority |
| Neutral | gray | Not assessed, Not enough data |

### 3.2 Type

The mockup uses a geometric sans with tight tracking on headings. Keep
the current stack unless there is a measured reason to change, since a
webfont swap costs LCP.

| Role | Size (desktop) | Weight | Notes |
|---|---|---|---|
| H1 | 48 to 56px | 700 | Tight tracking, 1.05 line height |
| H2 | 30 to 36px | 600 | Section headings |
| H3 | 18 to 20px | 600 | Card titles |
| Body | 16px | 400 | 1.6 line height minimum |
| Small | 13 to 14px | 400 | Hints, metadata |
| Micro | 11 to 12px | 500 | Pills, badges, captions |

Mobile scales H1 down to 32 to 36px. Never below 16px for body.

### 3.3 Shape and depth

- Corner radius: 12px for cards, 8px for buttons and inputs, full for
  pills
- Borders: 1px `gray-200`, preferred over shadows
- Shadows: at most one soft shadow per surface, reserved for the hero
  mockup and modal-like elements
- No gradients except the very light tint already used on callout
  cards

### 3.4 Spacing

8px base scale. Section vertical rhythm 64px mobile, 96px desktop.
Card padding 20px mobile, 24 to 32px desktop.

---

## 4. Content and SEO requirements

This is where the mockup needs work. It reads beautifully and ranks for
nothing. Every heading must carry a real query.

### 4.1 Homepage

**[decide]** Approve or edit these.

| Element | Mockup | Proposed |
|---|---|---|
| Eyebrow | none | `Free YouTube SEO tools · No signup · AI-powered` |
| H1 | "Better tools for every upload." | `Better YouTube SEO tools for every upload` |
| Subtitle | "Research ideas, prepare metadata, and review your channel, all in one free workspace." | `Research YouTube ideas, prepare metadata, and audit your channel. Twenty free tools, no signup.` |
| Section H2 | "Everything you need, from idea to insight." | `Free YouTube SEO tools for every stage` |
| Stage H3s | Research / Optimize / Publish / Analyze | Keep, add a keyword line under each |
| Workflow H2 | Discover / Prepare / Review | Keep as is, this is brand voice and that is fine below the fold |
| Findings H2 | "Turn findings into clear next steps" | Keep |
| Final CTA | "Make the next upload easier." | Keep |

Rule of thumb: the word "YouTube" appears in the H1, the subtitle, and
the first section H2. Below the fold, brand voice can take over.

### 4.2 Tool pages

The 20 tool pages carry most of the organic traffic. Template:

- **H1**: exact tool name matching the primary query, from
  `lib/tools-catalog.ts`. Example: `YouTube Channel Audit`.
- **Subtitle**: one sentence, contains the primary query phrase plus
  the promise. Never contains a number claim.
- **Tool widget**: immediately below, above the fold on desktop and
  reachable within one scroll on mobile. This is the whole reason the
  visitor came.
- **Then** the supporting content: what you get, how to use, what each
  check means, checklist, related guide, FAQ, related tools, final CTA.

The supporting content is what ranks. It stays. Do not let the
redesign shorten it in the name of cleanliness.

FAQ blocks feed `FaqSchema`. Keep them and keep the JSON-LD.

### 4.3 Meta patterns

- Title: `<Tool name> | Free <what it does>` under 60 characters
- Description: 150 to 160 characters, contains the primary query, no
  numeric claims about scores
- OG image: existing generator, needs a variant matching the new visual
  direction

---

## 5. Page templates to build

| Template | Count | JS | Notes |
|---|---|---|---|
| Homepage | 1 | Island only for the hero demo, if any | Highest design effort |
| Tool page | 20 | One island, the tool widget | Shared shell, per-tool content |
| Stage hub | 4 | None | Research / Optimize / Publish / Analyze |
| Tools index | 1 | Small island for filters | Filter chips are the only interactive part |
| Guide | 3 and growing | None | Long-form, Astro content collection |
| Updates index and post | 2 | None | Content collection |
| Legal | 3 | None | About, Privacy, Terms |
| Compare | few | None | Existing |

---

## 6. Component inventory

Build these once, use everywhere.

**Layout**
`Header`, `Footer`, `Container`, `Section`, `PageHero`

**Assessment vocabulary** (the compliance-critical set)
`StatusPill` — Ready / Needs attention / Missing / Strong / Weak, with
the semantic colour mapping from 3.1
`PriorityPill` — High / Medium / Low / Keep it up
`ProportionBar` — segmented bar, no printed numbers, `aria-label`
`DerivedMetricsNotice` — block and inline variants, already built
`StatTile` — label, raw value, unit word, optional hint
`SignalRow` — good / warn / bad / info icon plus text

**Tool shell**
`ToolInput` — text field plus primary action, with loading state
`SampleChips` — try-a-sample row
`RateLimitNote` — "5 per day per IP, 4 left today"
`TurnstileSlot` — reserved height so it cannot cause CLS
`ResultCard`, `EmptyState`, `ErrorState`, `LoadingState`

**Marketing**
`FeatureCard`, `StageCard`, `WorkflowStep`, `FaqAccordion`,
`RelatedTools`, `FinalCta`, `TrustStrip`

**Ads**
`AdSlot` — see section 8

---

## 7. States, the part mockups always miss

Every tool needs all six designed, not just the happy path.

| State | Requirement |
|---|---|
| Empty | Before first run. Explain what will happen and show a sample chip row. Never a blank panel. |
| Loading | Skeleton matching the result shape, not a spinner. Reserve the final height to protect CLS. |
| Success | The mockup. |
| Partial | Some data unavailable, for example tags hidden by YouTube. Amber banner, results still shown. |
| Error | Plain language, what to try next. Never a raw status code. |
| Rate limited | Distinct from error. Explain the daily limit and when it resets. |

Turnstile widget height must be reserved from first paint.

---

## 8. Ad placement

AdSense is the revenue model, so slots are part of the design, not a
later insertion. **[decide]** Confirm this placement plan.

| Page | Slot | Position | Format |
|---|---|---|---|
| Tool page | 1 | Between the tool widget and the supporting content | Responsive horizontal |
| Tool page | 2 | Between FAQ and related tools | Responsive horizontal |
| Guide | 1 | After the intro, before the first H2 | Responsive horizontal |
| Guide | 2 | Mid-article, after roughly 50 percent | In-article |
| Index and hub | 1 | After the first grid section | Responsive horizontal |
| Homepage | none | Keep the entry page clean | |

Rules:

- Every `AdSlot` reserves its height with `min-height` before the ad
  loads. This is the single biggest CLS risk on the site.
- No ad above the fold on a tool page. The tool must be the first thing
  the visitor sees, both for the visitor and for AdSense policy on
  content-to-ad balance.
- No ad inside a result panel.
- Slots are components with a feature flag, so they can ship dark and
  be enabled after AdSense approval.

---

## 9. Responsive

Breakpoints: 640, 768, 1024, 1280.

Mobile is the primary case, most long-tail search traffic is mobile.

- Tool input is full width, action button full width below the field
  rather than beside it
- Result cards stack, no horizontal scroll anywhere
- Tables become stacked cards
- The hero mockup either drops below the copy or is hidden on small
  screens if it costs LCP
- Tap targets 44px minimum

---

## 10. Accessibility

- Contrast 4.5:1 for body, 3:1 for large text. The current light gray
  on white for hints is borderline, check it.
- Every decorative icon `aria-hidden="true"`, every meaningful icon has
  a text label beside it, which the compliance rules require anyway.
- Colour is never the only carrier of meaning. Status pills always have
  a word, not just a colour.
- Visible focus rings, keyboard reachable, logical tab order.
- Proportional bars get `role="img"` and an `aria-label` with the
  qualitative summary.

---

## 11. Logo

Current wordmark is fine. The mockup's mark cannot use the YouTube play
button, that is a Google trademark and using it also risks AdSense
approval.

**[decide]** Options previously shown:

1. Green circle with a play triangle, different silhouette from the
   YouTube mark
2. Magnifying glass with a play triangle inside, best fit for the niche
3. Bar chart with a checkmark, zero video association
4. SCT monogram

Recommendation stands at option 2, or option 1 if it reads too busy at
small sizes. Favicon must be legible at 16px.

---

## 12. Out of scope

- Dark mode
- Any dashboard, saved state, or account concept
- Animations beyond hover and focus transitions
- Illustration set beyond the existing spot pieces
- Anything that reintroduces a numeric score

---

## 13. Open decisions

1. Homepage copy in 4.1, approve or edit
2. Ad placement plan in section 8
3. Logo direction in section 11
4. Whether the hero keeps a product mockup on mobile, given the LCP cost
5. Whether to keep the current font stack or move to a webfont

---

## 14. Definition of done

- All templates built, all six states designed and implemented per tool
- Performance budgets in section 2.3 met on a throttled mobile run
- Compliance checklist in `docs/youtube-api-compliance.md` section 7
  passed against every rendered tool page
- No em-dash anywhere in shipped copy
- Every H1, subtitle, and meta description reviewed against the
  keyword map in `docs/seo-strategy-2026-06.md`
- Existing URLs unchanged, or redirected where a slug must move
- Sitemap, JSON-LD, and OG images regenerated
