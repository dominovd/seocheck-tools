# seocheck.tools

Free YouTube SEO Toolkit — AI-powered tools for content creators.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Anthropic Claude Haiku 4.5 (AI generations)
- Upstash Redis (cache + rate limits)
- Cloudflare Turnstile (bot protection)
- Vercel (deploy)

## Local setup

```bash
# Install dependencies
npm install

# Create local env
cp .env.example .env.local
# Fill in ANTHROPIC_API_KEY, Upstash, Turnstile keys

# Run dev server
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

```bash
# First-time: install Vercel CLI and link the project
npm i -g vercel
vercel link

# Set production env vars (paste each value when prompted)
vercel env add ANTHROPIC_API_KEY production
vercel env add UPSTASH_REDIS_REST_URL production
vercel env add UPSTASH_REDIS_REST_TOKEN production
vercel env add NEXT_PUBLIC_TURNSTILE_SITE_KEY production
vercel env add TURNSTILE_SECRET_KEY production
vercel env add AI_DAILY_BUDGET_USD production
vercel env add NEXT_PUBLIC_SITE_URL production

# Deploy to production
vercel --prod
```

Connect the `seocheck.tools` domain via Vercel dashboard → Project Settings → Domains.

## Project structure

```
seocheck-tools/
├── app/                  # Next.js App Router
│   ├── (legal)/          # About, Privacy, Terms, Contact
│   ├── tools/            # Individual tool pages
│   ├── guides/           # MDX articles
│   ├── api/              # API routes (AI endpoints)
│   ├── layout.tsx
│   ├── page.tsx          # Homepage with tool grid
│   ├── sitemap.ts
│   └── robots.ts
├── components/           # Shared UI
├── lib/
│   ├── site-config.ts    # Site-wide constants
│   ├── tools-catalog.ts  # Master list of all tools
│   └── seo.ts            # Metadata helpers
└── public/               # Static assets
```

## Adding a new tool

1. Add an entry to `lib/tools-catalog.ts`.
2. Create `app/tools/<slug>/page.tsx`.
3. (If AI-powered) Create `app/api/<slug>/route.ts` using the cost protection layer.
4. Sitemap, homepage grid, and footer pick it up automatically from the catalog.

## AI cost protection

All AI endpoints are gated by:

1. Cloudflare Turnstile challenge (blocks headless bots)
2. Per-IP daily rate limit (15 generations/day/tool default)
3. Cache lookup by `(tool, hash(input))` — 24h TTL
4. Global daily budget cap — kill switch at `AI_DAILY_BUDGET_USD`
5. Conservative `max_tokens` per tool

See [docs/ai-cost-protection.md](./docs/ai-cost-protection.md) for the
full wiring guide plus a worked example.
