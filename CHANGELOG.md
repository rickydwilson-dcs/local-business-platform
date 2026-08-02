# Platform Changelog

Notable platform-level changes to the Local Business Platform. Site-specific changes are tracked in each site's own CHANGELOG.md. Package-level changes are tracked via changesets in each package directory.

> For the full project development history (2025-10 through 2026-01), see [docs/project-history.md](docs/project-history.md).

---

## 2026-08-02

### Sites

- Privacy Policy and Cookie Policy pages across `base-template` and every site scaffolded from it (`dch-automotive`, `mad-graphics`, `dcs`, `colossus-scaffolding`, `npracing-v1`, `npracing-v3`) replaced their rainbow blue/green/purple/amber/red/yellow legal-basis callout boxes — each carrying an `eslint-disable platform/no-hardcoded-tailwind-colors` escape hatch — with the site's own brand palette (`bg-surface-subtle` / `border-brand-primary`). The pattern originated in `base-template` and was copied into every derived site verbatim, so fixing the template stops new sites from inheriting it. Genuinely semantic non-brand colors (form error-state tints, real third-party accreditation-badge branding) were left as-is — they aren't the same issue.

---

## 2026-07-12

### Infrastructure

- Fixed the Regression Watchdog GitHub Action (`.github/workflows/watchdog.yml`) silently never triaging failures since its April 2026 launch: the smoke-test step piped `npx playwright test` through `tee` without `pipefail`, so the shell's exit code always reflected `tee` (success) rather than Playwright, and `smoke_failed` was never set — every prod/staging push showed the smoke step as green and skipped auto-triage even when tests failed. Added `set -o pipefail` to the step.
- Fixed `packages/playwright-shared/sites.json`'s prod smoke targets, which the pipefail bug above had been masking: colossus pointed at `colossusscaffolding.com`, an unrelated `.com` domain with no DNS records configured (not colossus-scaffolding's real domain, `colossus-scaffolding.co.uk`), so all 10 colossus smoke checks failed on `ERR_NAME_NOT_RESOLVED` on every run; and a `dcs` entry targeted `digitalconsultingservices.co.uk`, which is not an LBP platform site at all but the platform owner's own WordPress consultancy site, and was removed.
- Fixed a second, deeper cause of the same silent-failure problem, found while verifying the pipefail fix live on staging: the smoke-test step's `--reporter=json,github` CLI flag overrides `smoke.config.ts`'s reporter array wholesale (including its `outputFile` option), so the JSON reporter fell back to writing to stdout instead of a file. The next step's `cp packages/playwright-shared/smoke-results.json /tmp/smoke-results.json` then silently failed and fell back to a hardcoded `{"stats":{"ok":true},"suites":[]}` stub, which is what the triage script actually read — so even with `smoke_failed` now correctly set, triage logged "All smoke tests passed" on a real 10-failure run. Fixed by setting `PLAYWRIGHT_JSON_OUTPUT_FILE` explicitly so the JSON reporter writes to the real path regardless of the CLI reporter override.
- Fixed a third, still deeper bug found once the JSON was finally being read correctly: `tools/watchdog/lib/types.ts` and `index.ts`'s `collectFailures()` assumed the wrong Playwright JSON schema (`suite.tests[].status` directly), when the real shape nests a `specs[]` layer with the per-attempt outcome under `spec.tests[].results[]` and the aggregate outcome under `spec.tests[].status` ("expected"/"unexpected"/"flaky"/"skipped"). The parser always walked past real failures silently. Rewrote the walk to match the actual schema and verified against a captured artifact — triage now correctly identifies and diagnoses all 9 failures via Claude instead of reporting "0 failure(s) to triage." Also removed a dead `report.stats?.ok` early-return in `index.ts`'s `main()`: real Playwright JSON never sets a `stats.ok` field (only the workflow's hardcoded fallback stub did), so this check was a no-op against real data and `collectFailures()` already handles the genuine zero-failures case correctly on its own.
- Fixed `packages/playwright-shared/sites.json`'s staging colossus target too, once triage was verified actually working: `colossus-scaffolding.vercel.app` is a dead Vercel alias (`DEPLOYMENT_NOT_FOUND`). Repointed at `local-business-platform-colossus-reference.vercel.app`, a stable alias on the same Vercel project that's publicly reachable (the project's other stable aliases sit behind Vercel SSO and would 401/redirect-to-login in CI).

---

## 2026-07-11

### Sites

- `sites/dch-automotive`'s Car Remaps feature rebuilt around DCH-owned data: the embedded Viezu iframe is replaced by an interactive ready reckoner, ~144 crawlable per-make AEO pages with `Product`/`Service` JSON-LD, a progressive public JSON API, and an MCP endpoint (`lookup_vehicle_tuning` tool) — all reading through one shared repository. See `sites/dch-automotive/CHANGELOG.md` and `sites/dch-automotive/docs/car-remaps-runbook.md` for the full build and its scope-matching mechanism (Viezu's own live AJAX vehicle-finder cascade, not WooCommerce categories, which were tried and found unreliable).
- `sites/dch-automotive`'s Savings Calculator made vehicle-aware and gained a live UK fuel price source. First platform site to fetch third-party open data live at request time (Next.js `fetch()` with a 7-day `revalidate`, no cron or committed-JSON pipeline involved) rather than via the usual sync-and-commit pattern — see `sites/dch-automotive/CHANGELOG.md` for details.
- `sites/dch-automotive`'s Car Remaps scope extended from cars/vans to cars/vans/HGV (61 new lorry/truck makes) to back the Savings Calculator's van/lorry use case. Surfaced and fixed two real bugs in the sync pipeline along the way — a marque-matching fallback that could misattribute products across an unrelated marque sharing a leading word, and a complete absence of request timeouts that let a single unresponsive page hang the entire live sync — both now covered by tests/timeouts. See `sites/dch-automotive/docs/car-remaps-runbook.md` §5.

---

## 2026-07-09

### Sites

- `sites/dch-automotive` built out and prepared for its first Vercel deployment: dark/orange self-contained theme, bespoke `ContactForm`, real Car Remaps catalogue with embedded Viezu dealer widget, real Eastbourne/Polegate/Hailsham location content, and a site-specific `vercel.json` pointing the Turborepo build filter at the site
- `.env.example` for `dch-automotive` documents which variables are shared across LBP sites (NewRelic license key, Supabase URL, Resend API key) versus which must be unique per site (`CSRF_SECRET`); initial deploy targets the Vercel-assigned URL rather than the live `dchautomotive.co.uk` domain, pending domain cutover
- Known gaps carried into this deploy (tracked in `tasks/clients/dch-automotive.md`): `/reviews` still serves generic base-template placeholder testimonials, flagged for a follow-up content pass before the real domain is cut over
- Post-launch fixes on `dch-automotive`: `-webkit-autofill` override so browser-autofilled contact form fields keep their white text legible against the dark theme; real hero imagery added to all three location pages (previously showing a placeholder icon); dead `<button>` elements on the homepage and Car Remaps hero wired to real destinations (`/services`, `/contact`, and an in-page anchor to the fleet enquiry form); homepage hero heading/subtext/buttons resized down from an oversized all-caps treatment
- `sites/dch-automotive/CLAUDE.md` rewritten — was still the verbatim `base-template` guide since the site was scaffolded, describing components/routes/schemas that don't match this site's bespoke homepage/Car Remaps pages and dark theme
- All `dch-automotive` images migrated to Cloudflare R2 (shared platform bucket, `dch-automotive/` key prefix) via new `tools/upload-dch-automotive-to-r2.ts`, matching the platform's `docs/standards/images.md` rule; `public/stitch-images/`, `public/viezu/`, `public/logo/` removed from the repo, all render call sites now resolve via `getImageUrl()`
- `/car-remaps` expanded with substantive educational content: a "What Is ECU Remapping?" explainer, a benefits section (fuel economy, throttle response, towing torque, gearbox smoothness), and a 12-question FAQ (legality, insurance, warranty, reversibility, Stage 1-3 differences, emissions/MOT compliance) with `FAQPage` JSON-LD

### Architecture

- Fixed a pre-existing bug in `@platform/core-components`'s shared `Schema` component: the `FAQPage`/`BreadcrumbList` JSON-LD `@id` fields double-prefixed the site URL whenever `webpage.url` (conventionally passed already-absolute) was used to build them, producing malformed `@id`s like `https://site.com/https://site.com/page#faq`. Affected every page across the platform combining `webpage` + `faqs`/`breadcrumbs` props, not just `dch-automotive` — found while adding the Car Remaps FAQ schema above
- Content-accuracy pass: removed lingering **Tow Bars** and **Alarms** references (homepage credential badges, `site.config.ts` certifications list, and all three location pages' hero copy/FAQs/service lists) — both services were confirmed deleted during the WordPress migration (see `tasks/clients/dch-automotive.md`) but survived into location-page copy; trade-certification count corrected from 7 to 6 to match

---

## 2026-02-08

### Architecture

- Completed content-schemas deduplication — deleted site-specific copies, all sites now import from `@platform/core-components`
- Unified `LocationFrontmatterSchema` — resolved structural divergence between colossus and base-template/smiths hero fields
- Fixed location MDX frontmatter to use canonical field names (`title`/`description` instead of `heading`/`subheading`)

---

## 2026-02-07

### Architecture

- Moved location data (coordinates, region, isCounty) into MDX frontmatter — deleted hardcoded TS data files
- Migrated `brand-blue` to `brand-primary` theme tokens across all shared components
- Added `useFocusTrap` hook to `@platform/core-components` for mobile-menu and ConsentManager

### Platform

- Centralised Supabase rate limiter in `@platform/core-components` — replaces per-site stub implementations
- CSRF hardening: timing-safe comparison, single-use tokens
- Input validation: length limits on all API fields
- Accessibility: `lang="en-GB"`, skip navigation, SVG `aria-hidden`, proper page titles

### Infrastructure

- Security headers: `font-src` in CSP, HSTS, CORP, Permissions-Policy
- API info disclosure fixes — error responses no longer leak internals

### Documentation

- Rewrote all docs from reference lists to instructional teaching approach
- Added four "How It Works" architecture docs: dynamic routing, theme system, build pipeline, site creation
- Restructured CLAUDE.md as architectural briefing

---

## 2026-01-27

### Platform

- Site registry system with Supabase backend (7-table schema)
- Management CLI (`tools/manage-sites.ts`): list, show, sync, set-status commands
- Registry API client with Vercel and NewRelic integration

---

## 2026-01-25

### Platform

- Blog system: MDX-based with RSS feed, categories, Schema.org BlogPosting
- Projects portfolio: case studies with image galleries and client testimonials
- Testimonials and reviews system with aggregate ratings and Schema.org Review markup

### Packages

- `@platform/core-components`: extended content.ts with blog, projects, testimonials helpers
- Added 3 new Zod content schemas (BlogFrontmatter, ProjectFrontmatter, TestimonialFrontmatter)

---

## 2025-12-21

### Platform

- Theme system: `@platform/theme-system` package with CSS variable generation, Tailwind plugin, WCAG validation
- Base template (`sites/base-template`): gold-standard copy-and-customize template for new sites
- Migrated 32+ UI components from hardcoded colours to CSS variables

### Infrastructure

- Next.js 16.0.7 upgrade with Turbopack as default bundler
- Modern ESLint 9 flat config across all sites and packages

---

## 2025-12-07

### Tooling

- AI image generation pipeline: Gemini 3 Pro for card images, batch API, R2 CDN upload
- Service and location page generators (Claude + Gemini providers)
- Content quality validators: readability, SEO, uniqueness scoring

### Platform

- Dynamic location discovery — filesystem-based slug detection replaces hardcoded patterns

### Infrastructure

- Security audit remediation: HTML escaping, secure IP extraction, CSP hardening, HSTS
- React 19.1.2 (CVE-2025-55182 patch)

---

## 2025-10-10

### Infrastructure

- Tiered E2E testing: smoke-only on develop, full suite on staging/main
- Performance tracking with historical trend analysis and degradation alerts
- CI pipeline consolidation: 3 jobs to 1, saving 4-6 minutes per run
