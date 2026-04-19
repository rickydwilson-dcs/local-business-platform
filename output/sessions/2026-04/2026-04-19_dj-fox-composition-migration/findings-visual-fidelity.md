# Visual Fidelity Review Findings

**Reviewer:** cs-visual-fidelity-reviewer
**Reference:** sites/dj-fox-electrical (production Orion templates)
**Test:** sites/dj-fox-electrical-test (composition system)
**Date:** 2026-04-19

## Findings

### [Critical] VFR-001: Composition renderer drops section content for nested dataKeys

- **Page:** home, about, reviews, blog, pricing, projects (all pages using dot-notation dataKeys)
- **File:** `packages/component-composition/src/render-page.tsx`
- **Issue:** The renderer does a single-level object lookup `data[section.dataKey]`. Every home/about/reviews/etc. dataKey in `composition.json` uses dot notation (`"home.hero"`, `"home.stats"`, `"pricing.jobCosts"`, etc.) and `siteData["home.hero"]` returns `undefined`. Sections receive no `heading`, `eyebrow`, `subheading`, or other expected fields and render as empty shells.
- **Impact:** 10 of 12 pages render as near-blank scaffolds. This is total content-loss for every page using dot-notation dataKeys.
- **Fix:** Replace the direct object lookup with a dot-path resolver: `path.split(".").reduce((acc, key) => acc?.[key], obj)`. Also emit a warning diagnostic when a declared dataKey resolves to `undefined`.
- **Effort:** small

### [Critical] VFR-002: MDX content directory missing from test site

- **Page:** services/emergency-callout, locations/eastbourne (all detail routes)
- **File:** `sites/dj-fox-electrical-test/` (no `content/` subdirectory)
- **Issue:** Detail pages throw ENOENT: `no such file or directory, open '...content/services/emergency-callout.mdx'`. The test site has no `content/` tree; `generateStaticParams` will error at build time.
- **Impact:** Every MDX-backed detail page crashes. Ship blocker.
- **Fix:** `cp -R sites/dj-fox-electrical/content sites/dj-fox-electrical-test/content`
- **Effort:** trivial

### [Critical] VFR-003: Site logo broken — `public/` directory missing

- **Page:** every page (header logo)
- **File:** `sites/dj-fox-electrical-test/` (no `public/` subdirectory)
- **Issue:** All test screenshots show a broken-image placeholder in the header where the logo should be. The `/logo.svg` path referenced by `OrionHeader` returns 404.
- **Impact:** Primary brand identifier is missing on every page.
- **Fix:** `cp -R sites/dj-fox-electrical/public sites/dj-fox-electrical-test/public`
- **Effort:** trivial

### [High] VFR-004: Hero sections render without background image or dark overlay

- **Page:** home, about, reviews, blog, pricing, projects, services (all pages with a hero)
- **File:** `packages/core-components/src/components/composable/hero-section.tsx`
- **Issue:** `ComposableHeroSection` does not support Orion's full-bleed image with dark overlay variant. Even after the dataKey fix, the hero will render as a white block with text — missing the dark background image, dark overlay, and brand-tinted gradient.
- **Impact:** The most important section of every page is visually incorrect. Reference home hero is an immersive full-bleed dark image; test renders a small heading on blank whitespace.
- **Fix:** Extend `ComposableHeroSection` to support `background: "image"` with an `overlay` slot. Update `composition.json` home entry to use `layout: { background: "image", overlay: "brand", fullBleed: true }`.
- **Effort:** medium

### [High] VFR-005: ContactSection renders a hardcoded placeholder string instead of a form

- **Page:** contact
- **File:** `packages/core-components/src/components/composable/contact-section.tsx` (lines 86–93)
- **Issue:** The component literally renders `"Contact form placeholder — wire ContactForm at page level"`. No form is present.
- **Impact:** The site's highest-value conversion point is non-functional.
- **Fix:** Replace the placeholder `<p>` with `<ContactForm>` from `@platform/core-components`, or accept `children` to allow page-level injection.
- **Effort:** small

### [High] VFR-006: Services index missing category grouping and intro

- **Page:** services
- **Issue:** Reference has a "Browse services by type" category card row and services grouped by type. Test renders a flat grid with no categories.
- **Impact:** Service taxonomy is lost. Users cannot navigate by service type.
- **Fix:** Add a `CategoryCardsSection` composable, or add category grouping support to `ServiceCards`.
- **Effort:** medium

### [High] VFR-007: Locations index loses trust details and renders 10 locations instead of 21

- **Page:** locations
- **Issue:** Reference renders 21 locations as cards with trust copy and red CTA links. Test renders 10 bare text blocks. Location count mismatch is because `siteData.locations.features` sources from `siteConfig.serviceAreaRegions[0].towns` (10 entries) while reference uses MDX files (21 entries).
- **Impact:** Significantly reduced local SEO signal. Each location card in the reference is a landing-page entry point; in the test they are bare names.
- **Fix:** Source locations from MDX content directory once `content/` is copied. Extend `FeatureGrid` to support href and multi-line descriptions with CTA.
- **Effort:** medium

### [High] VFR-008: Reviews page renders empty — testimonials not wired from MDX

- **Page:** reviews
- **Issue:** `siteData.reviews.testimonials: []` is empty (stub). No MDX loader is wired for reviews. The `StatsStrip` and `TestimonialGrid` sections also hit the dataKey resolution bug (`reviews.stats`, `reviews.hero`).
- **Impact:** All social proof is absent from the reviews page.
- **Fix:** Wire the reviews MDX loader in `lib/page-data.ts`. Fix the dataKey resolver (VFR-001).
- **Effort:** medium

### [High] VFR-009: Projects, blog, and pricing pages render empty grids

- **Page:** projects, blog, pricing
- **Issue:** `siteData.projects.projects: []` and `siteData.blog.posts: []` are stubbed. Pricing page fully blank due to VFR-001 (all pricing dataKeys are nested). No MDX content loaders are wired.
- **Impact:** Three routes effectively do not exist as content pages.
- **Fix:** Fix VFR-001 dataKey resolver. Wire MDX loaders for projects/blog. Copy `content/` (see VFR-002).
- **Effort:** medium

### [Medium] VFR-010: Hero headings render at reduced scale without visual anchor

- **Page:** contact, reviews, projects (where headings render at all)
- **Issue:** Reference hero headings use h1 scale against a dark hero background. Test renders headings as floating text on white with no background strip — they read as mid-page section headings rather than page heroes.
- **Fix:** Ensure `ComposableHeroSection` renders a coloured strip (`subtle` or `inverse`) even when `background !== "image"` so the heading reads as a hero.
- **Effort:** small

### [Medium] VFR-011: "Why Choose Us" and stats strip missing dark backgrounds

- **Page:** home, about
- **Issue:** Reference alternates: hero → dark trust-bar → light → grey → light → dark-why-choose → red-CTA. Test `composition.json` uses `background: "subtle"` for stats and why-choose sections — the dark section rhythm that defines Orion identity is missing.
- **Fix:** Update `composition.json` home page `whyChooseUs` section to `layout: { background: "inverse" }`.
- **Effort:** trivial

### [Medium] VFR-012: Vertical rhythm audit deferred pending VFR-001 fix

- **Page:** all
- **Issue:** Cannot fully assess until sections render content. Flagging for re-review after VFR-001 is fixed.
- **Fix:** Re-run visual comparison after VFR-001 fix.
- **Effort:** small

### [Low] VFR-013: Brand primary colour is correct — pass

- **Page:** all
- **Issue:** No drift. Measured `#db0b0b` on test CTA strip matches `theme.config.ts` exactly.
- **Fix:** None.

### [Low] VFR-014: No hardcoded colour classes in test site — pass

- **Page:** all
- **Issue:** Zero matches for hardcoded hex colours or `bg-red-*`/`text-slate-*` violations in `sites/dj-fox-electrical-test/`.
- **Fix:** None.

### [Low] VFR-015: Footer renders correctly — pass

- **Page:** all
- **Issue:** Footer rendering matches reference. Text content and layout are correct.
- **Fix:** None.

## Statistics

- Critical: 3
- High: 6
- Medium: 3
- Low: 3
- Total: 15 (3 pass, 12 drift)
