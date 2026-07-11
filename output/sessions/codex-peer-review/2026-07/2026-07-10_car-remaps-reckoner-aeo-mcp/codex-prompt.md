# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-07/2026-07-10_car-remaps-reckoner-aeo-mcp/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-07/2026-07-10_car-remaps-reckoner-aeo-mcp/
```

---

## Brief: Replace embedded Viezu iframe with an in-house ready reckoner + AEO pages + MCP endpoint

**Date:** 2026-07-10
**Project:** local-business-platform (Turborepo/pnpm monorepo, Next.js 16 App Router sites under `sites/*`, shared code under `packages/*`)
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

`sites/dch-automotive/app/car-remaps/page.tsx` (a fully bespoke, hardcoded React page — this site does not use MDX content for this route) currently embeds a third-party Viezu vehicle-tuning finder via an `<iframe src="https://viezu.com/dealer?id=33805671920f0d02e6d18f630985aace">`. The client dislikes how this looks/feels (generic, breaks page styling) and Viezu offers no partner API.

Live investigation (already done, not to be repeated) found:

1. Viezu's site is WordPress + WooCommerce. The widget uses the "Advanced Product Fields for WooCommerce PRO" plugin for cascading Type → Make → Model → Fuel Type → Variant dropdowns. Each vehicle "file" (e.g. "Mercedes CLE Tuning (2023–Present)") is a WooCommerce **variable product**.
2. WooCommerce's **Store API is public with no authentication**: `https://viezu.com/wp-json/wc/store/v1/products?page=N&per_page=100`. Total catalog: **3,188 products** across 32 pages. Returns id, name, slug, permalink, `categories` (= make, e.g. "BMW Tuning" — 58 categories total, mixed with non-vehicle categories for tools/cables/accessories that must be filtered out), `attributes` (Fuel Type, Variant/engine size), and `variations` (fuel/engine combo IDs) with base pricing.
3. The Store API's `description` fields are empty. The real performance data lives in a **structured JSON blob** embedded in each product's _rendered page HTML_, in the standard WooCommerce `data-product_variations="[...]"` attribute on the variations `<form>`. Per variation this includes: `original_bhp`, `power_bhp` (gain), `original_torque`, `torque_nm` (gain), `economy_gain_bhp`, `economy_gain_nm`, `fuel_saving`, `display_price_cents`. Confirmed live on `viezu.com/shop/mercedes-cle-2023-present/`, and cross-checked against a screenshot of the live widget (a DAF Buses HGV example) showing the identical field set under "Performance Figures" and "Blue Optimize Fuel Efficiency Tune" result tables. Some fields are pipe-delimited (e.g. `"original_bhp":"258 | 197"`), likely encoding two parallel stage values — needs confirming during parsing, not resolved yet.
4. `robots.txt` on viezu.com disallows nothing.
5. This is therefore a **paginated public JSON API pull** for the catalog index, plus **one HTTP GET per surviving product permalink** (a few hundred to ~1,000 after filtering to car/van categories, exact count unknown until Pass A runs) to extract the performance-data JSON blob — not fragile UI-automation of the form itself.
6. Confirmed with the client: the current widget only _displays results_ (performance/economy gain figures + price) — it does not hand off to a Viezu cart/checkout. So the rebuild only needs accurate data display, no purchase flow.

The client's ask has three linked goals, confirmed directly:

1. Extract Viezu's data systematically so the business owns it.
2. Use that data to drive an **interactive "ready reckoner" tool** on the `/car-remaps` page (replacing the iframe), **and** publish it as crawlable pages for SEO/AEO (answer-engine) citation, at **one page per make** granularity (client's explicit choice over one-giant-page or one-page-per-model, to avoid thin-content risk while keeping page count sane).
3. Additionally expose the data as a **directly callable endpoint (MCP server)** so LLM agents can query it in real time — not just crawl static pages. Client was told, and accepted, that mainstream AI answer engines get citations by crawling public pages, not by auto-discovering third-party MCP servers — there's no directory that makes a new MCP endpoint auto-discoverable yet. The MCP endpoint is being built anyway as a deliberate step into the emerging "agent-callable business data" channel; its distribution/discoverability (e.g. listing in an MCP directory) is an explicit follow-up, out of scope for this build.

### Goals

- Replace the Viezu iframe on `/car-remaps` with an interactive, DCH-branded vehicle selector (Make → Model → Fuel Type → Variant) showing the same stage-by-stage performance/economy results, sourced from DCH-owned data instead of a live third-party embed.
- Publish one crawlable page per make (e.g. `/car-remaps/bmw`) with all covered models/engines/stages in real HTML tables plus Schema.org JSON-LD structured data.
- Expose the same underlying data via a plain public JSON API and via a remote MCP server with at least one callable tool for vehicle-tuning lookup.
- Keep the data resynchronisable from Viezu on demand (not a one-off dump that immediately goes stale).

### Non-Goals

- No checkout/purchase/booking flow — results display only (matches current widget behaviour).
- No scheduled/automatic re-sync in this pass — manual re-run before deploy is sufficient for now.
- No MCP directory submission or other distribution/discoverability work — building the endpoint only.
- Not attempting to cover Viezu's non-automotive categories (Agriculture, Marine, HGV-only, Bike, Motorhome-only, tools/cables/accessories) unless the plan determines the client's fleet-services angle (`#fleet-enquiry` section already on this page) makes commercial-vehicle inclusion (Van, and possibly HGV given the fleet angle) worth it — flag this as a scoping question rather than assuming either way.

### Acceptance Criteria

- Running the sync tooling produces DCH-owned structured data for the in-scope vehicle categories, spot-checkable against live Viezu figures for a handful of known vehicles.
- `/car-remaps` renders an interactive selector backed by DCH's own data (iframe fully removed) that reproduces the current widget's stage-by-stage performance/economy/price output for a given vehicle.
- Each in-scope make has a dedicated, statically-generated page with real semantic HTML tables (not JS-only rendering) and valid Schema.org JSON-LD.
- A public JSON API endpoint returns the same lookup data as the interactive tool, independently curl-able.
- A remote MCP server endpoint is live and testable (e.g. via `npx @modelcontextprotocol/inspector` or as a connector), exposing a tool that returns vehicle-tuning performance data plus a canonical page URL for citation.
- `pnpm type-check` and `pnpm --filter dch-automotive run lint` pass.
- Standard repo git workflow is respected: branch off `develop`, never push directly to `staging`/`main`.

### Constraints

- **Platform architecture (root `CLAUDE.md`):** MDX-only content is the platform norm _except_ this specific site/page, which is a documented bespoke exception (`sites/dch-automotive/CLAUDE.md`: "`app/page.tsx` and `app/car-remaps/page.tsx` — fully bespoke, static React components with hardcoded arrays... a deliberate exception to the platform's usual 'MDX-only' rule"). Do not force this feature into the MDX content pipeline; follow the bespoke-page precedent already established for this route.
- **Shared utilities use factory patterns** (`packages/core-components` exports `createX(config)` factories; sites have thin `lib/` shims that call them, importing via **subpath**, never the barrel — barrel imports cause circular deps in vitest). New API routes in this codebase (e.g. `sites/dch-automotive/app/api/csrf-token/route.ts`) follow the pattern: `export const runtime = 'nodejs'; export const dynamic = 'force-dynamic';` then delegate to an imported handler.
- **Schema generation today:** `packages/core-components/src/lib/schema-generators.ts` (`createSchemaGenerators(ctx)`) currently exports `getLocalBusinessSchema`/`getOrganizationSchema`, `getWebSiteSchema`, `getBreadcrumbSchema`, `getFAQSchema`, `getServiceAreaSchema`, `getArticleSchema`, `getAggregateRatingSchema`. **There is no `Product`-shaped schema generator yet.** dch-automotive's shim is `sites/dch-automotive/lib/schema.ts` (thin re-export of the factory output). Decide whether a new generator belongs in the shared factory (used across all sites, `packages/core-components` convention) or should stay local to dch-automotive since no other site currently needs it — this is a real architectural judgment call, not settled.
- **Version risk:** `sites/dch-automotive/package.json` already depends on `zod@^4.1.11`. Community MCP tooling documentation (e.g. `mcp-handler`, Vercel's package for hosting MCP servers on Next.js App Router) has referenced a `zod@^3` peer requirement — **verify current compatibility before committing to a specific MCP hosting package/version**; do not assume the docs snippet found during investigation is still accurate, npm/GitHub should be checked live at implementation time.
- **No MCP precedent anywhere in this monorepo** — confirmed via full grep of source + lockfiles for `modelcontextprotocol`/`mcp-handler`. This is genuinely new territory for the codebase.
- **No `public/llms.txt` precedent anywhere in the monorepo either**, if the plan chooses to add one.
- dch-automotive is on Next.js 16.0.10 (App Router), React 19.2.3, standard Vercel deployment (`rootDirectory: sites/dch-automotive`), no custom server, `next build --webpack` (Turbopack has PostCSS bugs in this repo's CI, per root `CLAUDE.md`).
- Images: this site resolves all production images through Cloudflare R2 via `getImageUrl()` from `@/lib/image` — not relevant to data/schema work but relevant if any UI component needs vehicle/make logos.
- Existing `components/fuel-savings-calculator.tsx` on the same page is the closest existing analogue for an interactive, theme-token-styled calculator component — a pattern reference, not something to reuse code from directly (it's a different calculation domain).
- Git workflow is non-negotiable: `develop → staging → main`, always start on `develop`, never push directly to `staging`/`main`.

### Relevant Architecture

- `sites/dch-automotive/app/car-remaps/page.tsx` — the page to modify. Iframe block is at lines ~485–506 (section comment: `{/* Viezu vehicle-selector widget */}`). Immediately below it (lines ~508+) is a static `#fleet-enquiry` contact section — leave untouched.
- `sites/dch-automotive/components/fuel-savings-calculator.tsx` — existing interactive calculator on this same page, useful as a styling/state-pattern reference.
- `packages/core-components/src/lib/schema-generators.ts` — the shared JSON-LD factory (see Constraints above for current exports).
- `sites/dch-automotive/lib/schema.ts` — the site's thin re-export shim over the factory.
- `sites/dch-automotive/app/api/csrf-token/route.ts` — canonical minimal example of this site's API route convention (`runtime = 'nodejs'`, `dynamic = 'force-dynamic'`, delegate to an imported handler).
- `tools/lib/clone-entry/ingest-live-site.ts` — existing precedent in this monorepo for fetching a live external site politely (custom User-Agent, delay between requests) — a pattern reference for the sync script, not something to reuse code from directly (different purpose).
- `sites/dch-automotive/CLAUDE.md` — documents the bespoke-page exception and site-specific conventions (image handling via R2, contact form, theme).
- `sites/dch-automotive/package.json` — current dependencies (Next 16.0.10, React 19.2.3, `zod@^4.1.11`, no MCP-related packages yet).

### Codebase Snapshot

```
sites/dch-automotive/
  app/
    car-remaps/page.tsx      <- bespoke page, iframe to replace (~line 485-506)
    api/
      csrf-token/route.ts    <- API route convention example
      contact/route.ts
      analytics/track/route.ts
  components/
    fuel-savings-calculator.tsx  <- interactive component pattern reference
  lib/
    schema.ts                <- thin shim over shared schema-generators factory
    image.ts                 <- getImageUrl() for R2-hosted images
  content/                   <- MDX content for OTHER routes (services/locations/blog/projects) — NOT used by car-remaps
  package.json                <- zod@^4.1.11 already present, no MCP packages

packages/core-components/
  src/lib/
    schema-generators.ts     <- createSchemaGenerators(ctx) factory, no Product type yet
    api/
      csrf-route.ts          <- example of a shared API-route factory
      contact-route.ts

tools/
  lib/clone-entry/ingest-live-site.ts  <- pattern reference for polite external fetching
```

### What a Good Plan Should Cover

- **Real-data strategy (mandatory, per repo policy on external-API work):** the plan MUST describe how the sync tooling will be validated against real recorded Viezu payloads before the rest of the build depends on it — e.g. capture a handful of real Store API pages and real product-page HTML (with the `data-product_variations` blob) as fixtures, and test the parser against those real fixtures, not synthetic mocks of the expected shape. State what happens if Viezu changes markup/plugin versions between now and implementation (staleness/breakage detection).
- Where the sync script lives and how it's organized (single script vs. modular pass A/pass B), and where the normalized output data lives and in what shape/granularity (this determines how the per-make pages, the JSON API, and the MCP tool all read data without duplicating lookup logic).
- Whether/how to filter Viezu's 58 categories down to the in-scope vehicle types, and how that intersects with the fleet-enquiry angle already on this page (Non-Goals above flags this as an open scoping question — the plan should take a position and justify it).
- The `data-product_variations` pipe-delimited value question — a concrete parsing strategy plus how you'd confirm the interpretation is correct against real data before relying on it site-wide.
- Where the new `Product`-shaped (or equivalent) schema generator belongs — shared `packages/core-components` factory vs. site-local — with a clear justification either way given the "shared utilities use factory patterns" architecture rule.
- The MCP hosting approach for a Next.js 16 App Router site on Vercel, including concretely how to resolve the zod v3-vs-v4 compatibility question before adding any MCP package as a dependency, and what the exposed tool's name/parameters/return shape should be (including returning a canonical page URL per result, for citation).
- The public JSON API route's shape (params, response format) and its relationship to the MCP tool (shared lookup module vs. separate implementations).
- Concrete file-by-file plan: what's created/modified, in what order, with a verification gate after each meaningful step (not just at the end).
- Realistic risks: Viezu markup changes breaking the scraper, page-count/thin-content risk if category filtering is too broad, MCP package immaturity/version churn, git workflow compliance.

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-07/2026-07-10_car-remaps-reckoner-aeo-mcp/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-07/2026-07-10_car-remaps-reckoner-aeo-mcp/`
