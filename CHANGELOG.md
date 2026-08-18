# Platform Changelog

Notable platform-level changes to the Local Business Platform. Site-specific changes are tracked in each site's own CHANGELOG.md. Package-level changes are tracked via changesets in each package directory.

> For the full project development history (2025-10 through 2026-01), see [docs/project-history.md](docs/project-history.md).

---

## 2026-08-18

### Infrastructure

- **Prototype assets now live in Cloudflare R2, and prototypes deploy to a URL.** Design sessions were accumulating serious weight in git: `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/` held 142MB, 117MB of it 2048px PNG masters that nothing referenced. All 67 assets (14.2MB live + 116.9MB masters) moved to `prototypes/<session-slug>/…` in the existing bucket, the 54 prototypes' 311 asset references were rewritten to absolute R2 URLs, and the folder dropped to 19MB. The prototypes now deploy as a static Vercel project — https://dcs-prototypes.vercel.app — so they can be reviewed on a phone or sent to a client instead of only opening from a `file://` path on the machine that built them. Trade-off accepted deliberately: prototypes now require an internet connection to render.
- **Root cause fixed, not just the symptom.** The root `.gitignore` has excluded images since it was written (_"These go to Cloudflare R2, not Git"_), but `output/.gitignore`'s `!sessions/**` line un-ignored everything beneath `output/sessions/`, binaries included — verified with `git check-ignore --no-index -v`. That is why 78 image files became stageable without anyone forcing them, and it had been true for every session folder, not just this one. `**/*.mp4`, `**/*.mov`, `**/*.webm` and `**/*.svg` were never in the root list at all. `output/.gitignore` now carries an explicit binary deny-list below the allow rules.
- Two new tools: `tools/upload-prototype-assets.ts` (upload, verify, rewrite, manifest) and `tools/publish-prototype.ts` (pre-flight, static Vercel deploy). `R2Client` gained an additive `headFile()` so callers can skip re-uploading unchanged objects — `fileExists()` only answers presence, not whether the bytes match. New guide: [docs/guides/prototype-hosting.md](docs/guides/prototype-hosting.md).
- Three traps found while building this, all encoded in the tools and the guide: `R2Client`'s default `immutable, 1 year` Cache-Control is wrong for assets that get regenerated (overwriting a key does not bust the CDN cache), so live prototype assets get `max-age=300` and only `_archive/` keeps the long TTL; `R2Client.getContentType()` has no video entry, so content types are mapped explicitly and fail loudly on an unknown extension; and the Vercel CLI resolves `vercel.json` against the process working directory, so running it from the repo root pulled in the monorepo's root config and the first deploy served the root placeholder page instead of the prototypes.

### Documentation

- Two new CSS gotchas documented in root `CLAUDE.md` (CSS Syntax section), both surfaced repeatedly while building the DCS homepage design prototypes and both invisible in markup:
  - The existing `backdrop-filter` containing-block rule already noted `transform` in passing; the trap bites **independently** and catches floating navs in particular. A centred floating nav built with `transform: translateX(-50%)` establishes a containing block with no `backdrop-filter` present at all, so a nav carrying both has two separate triggers and fixing only the blur leaves the overlay trapped. Centre with `left`/`right`/`margin-inline` instead. Verified by measurement: a `position:fixed` probe nested inside such a nav reports the nav's own box (277×58) where a correct sibling overlay reports the viewport (390×844).
  - `font-variant-numeric: tabular-nums` on a figure containing a thousands comma gives the comma a full digit advance, rendering **`£1,995` as `£1 , 995`**. It corrupts a price, is invisible in source, and only shows on screen. It inherits, so an ancestor carrying the property breaks a figure that looks clean itself — resolve it up the ancestor chain when checking, and scope `tnum` to comma-free numerals rather than setting it on `body`. Hit independently in six prototypes across two typefaces (Schibsted Grotesk, Newsreader).

### Design

- `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/` — 54 static HTML homepage prototypes for the DCS site redesign, across five brief iterations, with `prototype/index.html` as a live-iframe library. Design exploration only: nothing in `sites/dcs` was touched and no platform or site code changed. The brief evolved twice on client feedback (positioning broadened from trades-only to all small businesses; register moved from under-construction to elevated design studio), leaving six directions off-brief and retained as record only. `HANDOFF.md` in that folder carries the traps and next steps.

## 2026-08-04

### Fixes

- Documented a new CSS gotcha in root `CLAUDE.md` (CSS Syntax section): a `fixed inset-0` mobile-nav dialog nested inside a header with `backdrop-blur-*` gets confined to that header's own box instead of the viewport, because `backdrop-filter` establishes a containing block for `position: fixed` descendants (same as `transform`). Found via `npracing-v1`'s mobile burger menu, which rendered correctly on an actual phone but broke in a resized desktop browser — fixed by portaling the dialog to `document.body` via `createPortal` (`sites/npracing-v1/components/site-nav-mobile.tsx`).
- Every site's `next.config.ts` had a CSP `script-src` with `unsafe-eval` dropped in all environments ("not needed, security risk" per `docs/standards/security.md`). That's true in production, but `next dev`'s webpack HMR/React Refresh runtime evaluates code as strings and needs it — without it, the runtime throws an `EvalError` on load that silently breaks all client-side interactivity (every button, every form) in `next dev`, while the page still renders and looks correct. `dj-fox-electrical` already had the fix (gate `unsafe-eval` behind `process.env.NODE_ENV === 'development'`); applied the same pattern to the other 8 sites (`npracing-v1`, `dch-automotive`, `base-template`, `mad-graphics`, `npracing-v3`, `colossus-scaffolding`, `dcs`, `showcase`) and corrected `docs/standards/security.md` and root `CLAUDE.md`'s Build & CI notes to match.

### Infrastructure

- `RESEND_FROM_EMAIL` added to `turbo.json`'s `build.env` array, matching the platform's own rule that every env var affecting build output must be listed there (missing entries cause stale cache hits). Discovered while wiring up `npracing-v1`'s contact form: the var was already read by `createContactHandler` (`packages/core-components/src/lib/api/contact-route.ts`), but never listed in `turbo.json`, and never set for that site — sending fell back to Resend's sandbox domain (`noreply@resend.dev`), which silently restricts delivery to the Resend account's own email regardless of the configured recipient, even when the site's own sending domain is separately verified in Resend. Same gap likely affects other sites that never set this var (confirmed also missing for `dj-fox-electrical`).
- `docs/guides/adding-new-site.md`, `docs/guides/end-to-end-workflow.md`, and `docs/standards/security.md` corrected to require `RESEND_FROM_EMAIL` in the required-env-vars checklist and drop `BUSINESS_EMAIL`, which is not read anywhere in the codebase (the contact form's destination address comes from `site.config.ts`'s `business.email` field, not an env var) — both docs had listed the unused var and omitted the required one.

---

## 2026-08-03

### Sites

- `npracing-v1` and `npracing-v3` each gained a dedicated `/team` page — a photo grid of all 10 crew members (name + role, sourced from the team's own photo gallery and two directly-supplied portraits) replacing the previous "just a homepage section" teaser. Implemented independently in both sites per the self-containment rule: a new `team` MDX content type (`content/team/*.mdx`, `lib/schemas/team.ts`, a self-contained loader mirroring the existing `merch` pattern) and a `TeamPage` component styled to each site's own design language. Both sites' nav and homepage/about CTAs now link to the new page instead of (or alongside) the old in-page anchor.
- One team member's supplied photo was a Canon `.cr2` RAW file with no usable web format — converted to JPEG and orientation-corrected with macOS `sips` rather than asking for a re-export, since the RAW data already contained everything needed.
- Fixed two accidental duplicate images in `npracing-v1`'s homepage gallery (both images had been used twice in the same grid): one paddock-team photo slot now shows a different team photo, and the duplicated on-track cornering shot was swapped for an already-hosted race-report photo instead of the repeated one.
- `npracing-v1` and `npracing-v3`'s homepage "merch" CTA band was redesigned: the cap product photo is now a genuine product shot (cropped tight to its own bounding box instead of the source photo's mostly-empty square frame, composited onto the red band via `mix-blend-multiply` so its white background drops out), shown before the heading on mobile since it's the actual subject of the CTA, and vertically centred on the right side of the band on desktop — inset from the edges rather than bleeding into the corner, which had been clipping the crown and brim against the card's rounded corners. It also straightens and grows on hover as a deliberately obvious sign of life (skipped under `prefers-reduced-motion`). Both sites also gained a favicon — the joined "NP" cropped from the team's oval logo mark, since the full mark's fine detail (the ring, "RACING", the bike silhouette) doesn't survive down to 16–32px. Committing `app/icon.png` / `app/apple-icon.png` directly (rather than routing through R2) required a new `.gitignore` exception, since the platform's blanket "images go to R2" rule doesn't have one for the Next.js file-based favicon convention — see [docs/standards/images.md](docs/standards/images.md#core-principles) for the documented exceptions list.
- `npracing-v1` and `npracing-v3` gained a homepage sponsor strip, positioned above the gallery section: a single auto-scrolling marquee of partner logos (Berkshire Cycles, GBRacing, HEL Performance, Emerson Cranes, Lowe Rental, GPS Photography, The Clothing Kings), each linking out to the sponsor's own site or social page. Every logo was sourced from the sponsor's own site (or Instagram profile picture for GPS Photography, which has no separate site) and recoloured to solid white-on-transparent regardless of its original brand colours, so the strip reads as one calm monochrome row rather than mismatched coloured logos on white cards — the first version used per-logo white cards on a grid, which didn't match the intended "quiet department-store brand strip" feel. Both sites now reuse (v1) or newly define (v3) a `.marquee`/`.marquee-track` CSS pattern — track rendered twice for a seamless `translateX(-50%)` loop, animation gated behind `@media (prefers-reduced-motion: no-preference)`, and paused on hover/focus so the real links inside it are actually clickable (also satisfies WCAG 2.2.2 for auto-moving content).
- Matt's team bio updated on both sites: role changed from "Mechanic" to "No. 1 Mechanic", plus a job description. Required adding an optional `description` field to the `team` content schema (`lib/schemas/team.ts`) and rendering it conditionally in both `TeamPage` components — most crew still only have a role on file.

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
