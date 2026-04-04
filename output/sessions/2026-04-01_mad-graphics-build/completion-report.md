# Session: Mad Graphics Site Build — Completion Report

**Date:** 2026-04-01 → 2026-04-04
**Status:** Complete (images pending — separate session)
**Client:** Mad Graphics (Martin Adams)
**Domain:** madgraphics.co.uk
**Vercel:** https://mad-graphics.vercel.app

---

## What Was Built

Full production site `sites/mad-graphics` in the LBP monorepo:

- **Theme:** Cygnus — dark mode, Press-Black (#131313), Signal Orange (#F47B20), Craft Green (#7AC143)
- **49 service pages** — 8 category hubs + 41 sub-service leaf pages (all flat at `/services/[slug]`)
- **19 location pages** — 9 Tier 1 (Eastbourne, Hastings, Lewes, Bexhill, Uckfield, Crowborough, Seaford, Hailsham, Newhaven) + 10 Tier 2
- **2 blog posts** — vehicle graphics guide + shop signs guide
- **1 project** — fleet graphics Eastbourne
- **3 testimonials** — van graphics (Hailsham), shop sign (Eastbourne), banner (Hastings)

Hard constraints respected: no full vehicle wraps (stated in FAQ), no Brighton/towns west of Peacehaven.

---

## Key Commits

| SHA | Description |
|-----|-------------|
| `307d960` | feat(themes): add cygnus theme package + update theme docs |
| `fb4c4ab` | feat(site): add mad-graphics — cygnus theme, 49 service pages, 19 locations (W4) |
| `0058e81` | fix(mad-graphics): fix content validation — seoTitles and location FAQs (W4) |
| `7e64b72` | fix(mad-graphics): update schema tests with real business name |
| `411ef22` | fix(base-template): replace hardcoded placeholder assertions in schema tests |
| `fa6ac2c` | fix(mad-graphics): import cygnus globals.css instead of vega |
| `a19950f` | chore(mad-graphics): add vercel.json with pnpm monorepo build config |

---

## Issues Found and Fixed

### 1. Cygnus theme package missing from repo
The `packages/themes/cygnus/` directory existed locally but was never committed. W4 fell back to Vega on every run. Recreated `index.ts` (cygnusRegistry + cygnusDefaultConfig) and `globals.css` from conversation context and committed.

### 2. W4 wrong working directory
`worker.py` used `cwd=REPO_ROOT` (force dir) instead of the LBP path. Fixed in force commit `445489c`.

### 3. W4 brief_path not reaching the workflow
Classifier stripped the file path from the payload. Fixed in force commit `6db3628`.

### 4. W4 MAX_TURNS too low for large builds
`MAX_TURNS[4] = 40` — insufficient for 49 services + 19 locations (~167 turns needed). Raised to 200 in force commit `75b9f67`.

### 5. W4 missing hard-block rule
When Cygnus wasn't found, W4 substituted Vega silently instead of stopping. Added hard-block rule to w4-site-build.md Step 2b in force commit `04e82f5`.

### 6. W4 globals.css not updated for theme
W4 copied base-template's globals.css (imports vega) without updating the import. Site rendered as light-mode despite Cygnus config being correct. Fixed in `fa6ac2c`. W4 workflow updated in force to prevent recurrence.

### 7. Schema tests used template placeholder values
`lib/__tests__/schema.test.ts` asserted `'Your Business Name'` — fails on every new site. Fixed in mad-graphics (`7e64b72`) and base-template (`411ef22`).

### 8. Vercel deployment setup
`vercel.json` required to use pnpm monorepo build pattern (same as dj-fox, colossus). Added in `a19950f`.

---

## Force Repo Fixes (~/Sites/force)

| Commit | Description |
|--------|-------------|
| `445489c` | fix: W4 working directory — set cwd to LBP |
| `6db3628` | fix(w4): add brief_path to classifier payload |
| `1b7c0c2` | fix(w4): read brief path from input and add pre-write self-check |
| `04e82f5` | fix(w4): hard-block on unresolvable constraints |
| `75b9f67` | fix(worker): raise W4 MAX_TURNS from 40 to 200 |
| `d93b3b3` | fix(w4): require globals.css theme import update in Step 4 |

---

## Vercel Setup

- **Project:** `mad-graphics` (prj_TP3cjYrS3Y2fFrjlS4qluccd83bL)
- **Team:** ricky-wilsons-projects
- **URL:** https://mad-graphics.vercel.app
- **Root Directory:** `sites/mad-graphics`
- **Build:** `cd ../.. && pnpm turbo run build --filter=mad-graphics`

**Env vars set (production):**
- `NEXT_PUBLIC_SITE_URL` = https://madgraphics.co.uk
- `BUSINESS_EMAIL` = office@madgraphics.co.uk
- `RESEND_API_KEY` = shared key
- `CSRF_SECRET` = generated
- `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` = shared instance
- `NEXT_PUBLIC_R2_PUBLIC_URL` = shared R2 bucket
- `FEATURE_CONSENT_BANNER` = true
- `FEATURE_ANALYTICS_ENABLED` = false

---

## Outstanding

- [ ] **Custom domain** — add `madgraphics.co.uk` + `www.madgraphics.co.uk` in Vercel → Settings → Domains, then add DNS records at registrar (`A` → `76.76.21.21`, `CNAME www` → `cname.vercel-dns.com`)
- [ ] **Resend domain verification** — verify `madgraphics.co.uk` as sending domain in resend.com
- [ ] **Images** — run image pipeline for mad-graphics (separate session). `tools/generate-image-manifest.ts` needs `--site` flag first — currently hardcoded for colossus-scaffolding. All MDX files have `placeholder/hero-*.webp` paths.
- [ ] **Client review** — founding year (2004 used, needs confirmation), business hours, Instagram handle (@mad_graphicssussex assumed)
- [ ] **GA4** — create property, add `NEXT_PUBLIC_GA_MEASUREMENT_ID` + set `FEATURE_ANALYTICS_ENABLED=true` when client is ready
- [ ] **Google Search Console** — add property, verify via DNS TXT, submit sitemap at `https://madgraphics.co.uk/sitemap-index.xml`
