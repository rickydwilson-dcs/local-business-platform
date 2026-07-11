# CLAUDE.md - DCH Automotive

Guidance for Claude Code when working with `sites/dch-automotive`.

## Overview

DCH Automotive is a vehicle security, fleet electrics and ECU remapping installer serving the South East of England (based in Polegate, centred on Eastbourne). The site was scaffolded from `sites/base-template` in July 2026 but has since diverged significantly — it is **not** a typical MDX-only/theme-driven site. Two pages (`/` and `/car-remaps`) are fully bespoke, hand-built React with hardcoded content arrays; everything else follows the platform's usual MDX-content pattern. See `tasks/clients/dch-automotive.md` for the full migration/build history and outstanding client items.

## Bespoke vs. MDX-Driven Pages

This is the most important thing to know before editing this site:

- **`app/page.tsx` (homepage) and `app/car-remaps/page.tsx`** — fully bespoke, static React components with hardcoded `const SERVICES = [...]`, `const CREDENTIALS = [...]`, `const REMAP_SERVICES = [...]` etc. arrays at the top of the file. There is no MDX content backing these pages. This is a deliberate exception to the platform's usual "MDX-only" rule (see root `CLAUDE.md`) — these two pages came from a Stitch design exploration and were kept as bespoke layouts rather than retrofitted into the content pipeline. When asked to update homepage copy, service cards, or the Car Remaps catalogue, edit the array literals directly in these files, not MDX.
- **Services, Locations, Blog, Projects** — normal MDX content in `content/`, validated against the shared Zod schemas from `@platform/core-components` (no local `lib/content-schemas.ts` — imports the platform's canonical schemas directly). Detail pages (`app/services/[slug]/page.tsx`, `app/locations/[slug]/page.tsx`, etc.) read MDX via `generateStaticParams()` and render through bespoke page-template components in `components/pages/` (`service-detail-page.tsx`, `location-detail-page.tsx`, etc.) — **not** `packages/themes/*` or the generic composable-section templates other sites use. These templates are dark/orange-styled to match `theme.config.ts` and are specific to this site.
- **`components/pages/home-page.tsx`** exists but is **unused dead code** — it's the generic vega-style homepage template inherited from base-template, superseded by the bespoke `app/page.tsx`. Don't edit it expecting it to affect the live homepage.

## Theme

Dark-first identity, self-contained in `theme.config.ts` per the platform's self-containment migration (no `@platform/themes/*` import): near-black background (`#0C0B09`), off-white text (`#F5F5F5`), single orange accent (`#F2730D`) used sparingly. Originally extracted from a Stitch design exploration into `packages/themes/lyra/` (that package remains a reference/extraction record only, not consumed at runtime). `surface.inverse` is deliberately the _light_ end of the palette here — the opposite of most other sites' theme configs — since there's no darker tone left to contrast against a background that's already near-black.

## Contact Form

`components/contact-form.tsx` is a bespoke component (not the shared `@platform/core-components` `ContactForm`) — the last generic UI component replaced during the July 2026 redesign. If you need to change contact-form behaviour or styling, edit this file directly; it won't pick up changes made to the shared component.

## Images — Served via Cloudflare R2

All production images live in the shared platform R2 bucket under the `dch-automotive/` key prefix, resolved at render time via `getImageUrl()` from `@/lib/image`. There is no local `/public` image bloat (`public/stitch-images/`, `public/viezu/` were migrated out — see `docs/standards/images.md` for the platform-wide rule and `tools/upload-dch-automotive-to-r2.ts` for the upload script used). When adding a new image:

1. Upload it to R2 under `dch-automotive/<category>/<name>.<ext>` (see the upload script for the pattern)
2. Reference it as a **relative R2 key** (e.g. `"dch-automotive/stitch-images/img-005.jpg"`), not a local path — this satisfies the shared `ImagePathSchema` (`site-name/...` format) used by MDX frontmatter
3. Resolve it through `getImageUrl()` before use in any raw `<img src>` or `next/image` `src` — components that read `frontmatter.heroImage`/`frontmatter.image` directly must call `getImageUrl(...)` themselves; the schema only validates the _stored_ key, it doesn't resolve URLs

## Content Types

MDX content in `content/` (services/car-remaps/homepage are the bespoke exception above):

| Type         | Directory               | Count                                                                          |
| ------------ | ----------------------- | ------------------------------------------------------------------------------ |
| Services     | `content/services/`     | 5 (Vehicle Security, Parking Aids, Fleet Solutions, Accessories, Dash Cameras) |
| Locations    | `content/locations/`    | 3 (Eastbourne, Polegate, Hailsham)                                             |
| Blog         | `content/blog/`         | 2                                                                              |
| Projects     | `content/projects/`     | 1                                                                              |
| Testimonials | `content/testimonials/` | 3                                                                              |

Note: homepage testimonials are separate, hardcoded sample quotes in `app/page.tsx` explicitly marked "SAMPLE QUOTE, not a real customer" — pending real client quotes, see `tasks/clients/dch-automotive.md`.

## Essential Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000) — uses --webpack, not Turbopack
npm run build             # Production build

# Validation
npm run validate:content  # Validate MDX content (services/locations/blog/projects/testimonials)
npm run validate:quality  # Platform quality gates
npm run type-check        # TypeScript type checking
npm run lint              # ESLint

# Testing
npm test                  # Unit tests (Vitest)
npm run test:e2e:smoke    # Fast E2E smoke tests (Playwright)
```

### Schema Locations

Validation schemas come from `@platform/core-components` (imported via subpath, not a local copy):

- `ServiceFrontmatterSchema`, `LocationFrontmatterSchema`, `BlogFrontmatterSchema`, `ProjectFrontmatterSchema`, `TestimonialFrontmatterSchema`

## Routes

| Route                | Description                                                                                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                  | Homepage — **bespoke**, hardcoded in `app/page.tsx`                                                                                                                                                                                   |
| `/car-remaps`        | ECU remapping catalogue — **bespoke** intro/content, plus an interactive DCH-owned ready reckoner (`components/car-remaps-*.tsx`) and a fuel savings calculator. No longer embeds the Viezu iframe — see "Car Remaps Subsystem" below |
| `/car-remaps/[make]` | Per-make AEO page — statically generated, real server-rendered performance tables + `Product`/`Service` JSON-LD, one per in-scope make (~83)                                                                                          |
| `/services`          | Services listing (MDX-driven)                                                                                                                                                                                                         |
| `/services/[slug]`   | Service detail (MDX-driven)                                                                                                                                                                                                           |
| `/locations`         | Locations listing (MDX-driven)                                                                                                                                                                                                        |
| `/locations/[slug]`  | Location detail (MDX-driven)                                                                                                                                                                                                          |
| `/blog`              | Blog listing (MDX-driven)                                                                                                                                                                                                             |
| `/blog/[slug]`       | Blog post (MDX-driven)                                                                                                                                                                                                                |
| `/projects`          | Projects listing (MDX-driven)                                                                                                                                                                                                         |
| `/projects/[slug]`   | Project detail (MDX-driven)                                                                                                                                                                                                           |
| `/reviews`           | Testimonials page — still generic base-template placeholder content, see outstanding items                                                                                                                                            |
| `/about`, `/contact` | Bespoke static pages                                                                                                                                                                                                                  |

## Key Files

### Configuration

- `site.config.ts` — business info, credentials, service list, service areas
- `theme.config.ts` — dark/orange theme tokens (self-contained, see Theme above)
- `.env.local` / `.env.example` — includes `NEXT_PUBLIC_R2_PUBLIC_URL` for the shared image bucket

### Content Utilities (thin shims over `@platform/core-components`, per root CLAUDE.md)

- `lib/content.ts` — content loading
- `lib/image.ts` — `getImageUrl()` re-export + site-specific alt/title generators
- `lib/schema.ts` — JSON-LD schema generators
- `lib/contact-info.ts` — phone/address/hours formatting

### Components

- `components/*.tsx` — flat, bespoke components (`contact-form.tsx`, `cta-band.tsx`, `faq-accordion.tsx`, `page-hero.tsx`, `breadcrumb-bar.tsx`, `site-header.tsx`, `site-footer.tsx`, `fuel-savings-calculator.tsx`, `car-remaps-ready-reckoner.tsx`, `car-remaps-selectors.tsx`, `car-remaps-results-table.tsx`) — there is no `components/ui/` subdirectory on this site
- `components/pages/*.tsx` — bespoke page-template components for MDX-driven detail/listing pages (dark/orange-styled, specific to this site, not shared with other themes)

## Car Remaps Subsystem

`/car-remaps` was rebuilt in July 2026 to replace a third-party Viezu iframe with DCH-owned data. This is a substantial, mostly self-contained subsystem — read `docs/car-remaps-runbook.md` before touching any of it, and `lib/car-remaps/__fixtures__/README.md` for the full data-shape investigation behind every parser/config constant.

- **`lib/car-remaps/`** — `types.ts` (shared types), `parsers.ts` (pure-function parsers + the scope-matching logic, fixture-tested in `parsers.test.ts`), `repository.ts` (the single read layer every page/API/MCP tool goes through), `schema.ts` (site-local `Product`/`Service` JSON-LD generator — deliberately not promoted to `@platform/core-components`, see the `TODO` comment), `url.ts`, `mcp-tools.ts`.
- **`scripts/car-remaps/`** — the live sync pipeline (`sync.ts` orchestrates `fetch-marques.ts` → `fetch-store-api.ts` → `fetch-product-html.ts` → `normalize.ts`). Run via `pnpm --filter dch-automotive run car-remaps:sync` — manual only, before each deploy that ships Car Remaps changes, not on a schedule. Takes tens of minutes (walks Viezu's live catalogue + a marque/model AJAX cascade, politely rate-limited).
- **`data/car-remaps/`** — the sync's committed output (`manifest.json`, `index.json`, `makes/<slug>.json`). The site reads this at build/runtime; it is **not** fetched live. Regenerate and commit it after any scope/parser fix.
- **Scope determination is the trickiest part of this subsystem**: Viezu's WooCommerce categories do NOT cleanly separate cars/vans from bikes/HGV/agriculture/marine — that was tried and rejected. Scope instead walks Viezu's own `/dealer` widget's live AJAX cascade (`get_filter_brands`/`get_filter_models`, keyed on `vehicle-type`), which is what the widget itself uses to populate its dropdowns. This depends on an undocumented internal WordPress endpoint (nonce + `admin-ajax.php`), not a stable public API — if a future sync run starts failing or excluding real vehicles, check `docs/car-remaps-runbook.md` §5 first.
- `app/api/car-remaps/lookup/route.ts` (progressive JSON API) and `app/api/[transport]/route.ts` (MCP endpoint, `lookup_vehicle_tuning` tool) both read through `lib/car-remaps/repository.ts` — no duplicated lookup logic.

## Change Philosophy

Same as root `CLAUDE.md`: don't remove existing content or features unless explicitly confirmed (e.g. against `tasks/clients/dch-automotive.md`'s documented client decisions). Prefer minimal, targeted changes. When editing the bespoke homepage/car-remaps pages, check the hardcoded arrays against `tasks/clients/dch-automotive.md`'s "Current Services" and "New Service Launching" tables before assuming a service/credential/claim is still accurate — content drifts out of sync with confirmed client decisions more easily here than on MDX-driven pages, since there's no schema validation catching stale claims in plain TSX string literals.
