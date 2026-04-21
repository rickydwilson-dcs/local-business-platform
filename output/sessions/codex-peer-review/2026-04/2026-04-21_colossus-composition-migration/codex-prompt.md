# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan. Do **not** look at `claude-plan.md` — the whole point is for you to reason from the brief alone so we can compare your conclusions to Claude's independently.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04/2026-04-21_colossus-composition-migration/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise
```

---

## Brief: Colossus Scaffolding — Self-Contained Composition Migration

**Date:** 2026-04-21
**Project:** Local Business Platform monorepo (Turborepo + pnpm workspaces, Next.js 16, Tailwind, MDX content, Vercel hosting)
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec.

### Problem Statement

We need to migrate `sites/colossus-scaffolding/` from the current `@platform/themes/vega`-based architecture to the new self-contained composition-based architecture proven on DJ Fox Electrical (swapped to production 2026-04-21).

**The headline concern is not the migration mechanics.** The 7-step self-containment recipe is documented and has been executed once successfully. The headline concern is **preventing the DJ Fox-class visual drift**, where during that migration several sections rendered as empty scaffolds, a missing Tailwind token caused invisible text on dark backgrounds, contact forms were placeholder text, and the issues were only discovered after a human reviewed side-by-side screenshots. Claude repeatedly declared "done" before the site was actually parity-accurate, because visual review was a manual, vision-based step rather than a programmatic gate. The user is explicit: "I want to avoid that at all costs. I am happy with a few percentage points of variance between the look and feel, but I don't want to have major differences. Neither do I want to have to have my time used checking every individual page and component."

Colossus also introduces structural complexity DJ Fox did not have:

- A county → towns hierarchy in both content frontmatter and navigation (the locations dropdown must group towns under county headers, not just show alphabetical columns).
- Nested `/services/{service}/{location}` routes (e.g. `/services/commercial-scaffolding/brighton`) that do not exist in DJ Fox.
- Leaflet-based coverage map with town markers.
- Site-specific sections: `LocalAuthorityExpertise` (councils, permits, fast-track claims), `PricingPackagesSection` (three-tier pricing), `CountyGatewayCards` (cards per county on the locations index), `TownFinderSection` (searchable autocomplete).
- 5 county overview pages (East Sussex, West Sussex, Kent, Surrey, Essex) with a structure distinct from town pages.

### Goals

1. Colossus migrated to self-containment (no `@platform/themes/*` dependency, no `packages/themes/vega` references anywhere in the site).
2. All pages rendered by the composition system (via `composition.json` + `renderComposedPage` from `@platform/component-composition`), matching the DJ Fox pattern.
3. Visual parity with the current production site (`colossusscaffolding.com`) within a measured, automated threshold at desktop + tablet + mobile viewports — enforced as a hard gate before the migration can be marked done.
4. No manual page-by-page human inspection required to certify parity.
5. Any Colossus-specific components added to the shared composable catalog (reusable for future scaffolding / civil / regional sites) — not as site-local components.
6. Ongoing visual regression protection after the swap, so future work on Colossus doesn't silently drift.

### Non-Goals

- Do not touch `base-template` or any other live site. This migration is scoped to Colossus only.
- Do not change content frontmatter schemas. The MDX files already carry the fields we need (`county`, `countySlug`, `countyDescription`, `countyHighlights`, `redirectTowns`, `localAuthority`, etc.).
- Do not introduce new theming primitives or a new component-composition API. Stay inside the shape the DJ Fox migration established.
- Do not refactor shared code beyond what the migration requires.
- Do not enable or disable feature flags; migration is like-for-like.
- Do not redesign Colossus — the output must look like what's live today, not a new design.

### Acceptance Criteria

1. `grep -rn "@platform/themes\|packages/themes" sites/colossus-scaffolding --exclude-dir=node_modules --exclude-dir=.next` returns zero hits.
2. Renaming `packages/themes/vega/` to `.disabled` and running `pnpm --filter colossus-scaffolding run build` still succeeds.
3. Every route served by the current production site also serves from the migrated site with a 200 response, the same semantic heading structure, and the same section count.
4. An automated per-page visual diff against a captured production baseline (one PNG per route per viewport) yields under a defined threshold — user has said "a few percentage points" is acceptable, "major differences" are not. Propose a concrete threshold number and defend it.
5. The locations header dropdown displays towns grouped under their county names (not alphabetical columns as DJ Fox uses).
6. `pnpm --filter colossus-scaffolding run build`, `run test`, and `playwright test e2e/smoke.spec.ts` all pass on the migrated site.
7. The migration can be executed by a YOLO / autonomous Claude session without user intervention per page. The exit gate is programmatic.

### Constraints

**Hard constraints from CLAUDE.md and project memory:**

- Workflow: `develop → staging → main`. Never push direct to staging or main.
- Production builds use `next build --webpack`. Turbopack has PostCSS bugs in CI.
- Every env var affecting build output must be in `turbo.json` `env` array.
- Site `vercel.json` must NOT set `outputDirectory`.
- No hardcoded hex colors in components. Theme tokens only.
- Theme component contract: Header + Footer must be Server Components. `'use client'` forbidden on them. Dropdown client components are allowed but only for the interactive bits.
- Tailwind content globs must not descend into `node_modules/` (builds go to 18+ min).
- No `theme()` function in plain CSS — use CSS custom properties.
- Site rename requires `pnpm install` and commit of updated lockfile.
- Theme `components/` files use lowercase filenames with named exports. PascalCase filenames break jiti.
- The composition system already has a dot-path resolver for dataKeys like `"home.hero"` (bug fixed in `render-page.tsx` and `render-layout.tsx` via `path.split(".").reduce(...)`).

**Architectural constraints from DJ Fox migration lessons:**

- `SiteHeader` and `SiteFooter` are site-local, not theme-package components. They are Server Components.
- `theme.config.ts` inlines the `componentRegistry` literal — no `import { vegaRegistry }`.
- Missing Tailwind tokens cause invisible text on dark backgrounds. The DJ Fox `text-surface-inverse-foreground` bug must not be repeated — audit which tokens the Colossus composition will need against what the theme-system plugin registers.
- The composition PoC for DJ Fox initially had data-resolution bugs (single-level `data[key]` lookup) for nested dataKeys. This is now fixed at the platform level; rely on it.
- Contact forms and hero images were shipped as placeholders in DJ Fox and discovered by visual review. A programmatic gate must catch this class of bug.

### Relevant Architecture

**Composition system (core of the new architecture):**

- `packages/component-composition/src/render-page.tsx` exports `renderComposedPage(pageType, data)` which reads `composition.json`, looks up each `section.component` in the dispatcher, and renders with data resolved via dot-path from `data`.
- `packages/component-composition/src/render-layout.tsx` does the same for header/footer.
- `packages/core-components/src/components/composable/` currently contains ~22 composable sections: `HeroSection`, `StatsStrip`, `ServiceCards`, `ServiceListSection`, `CategoryCardsSection`, `LocationPillsSection`, `WhyChooseUsSection`, `CTASection`, `ContentSection`, `FeatureGrid`, `FAQSection`, `ContactSection`, `BlogGrid`, `ProjectGrid`, `TestimonialGrid`, `RateCardsSection`, `PricingTable`, `EmergencyBanner`, `TextSection`, `ImageGridSection`.
- Each composable has a sibling `.slots.ts` describing which slots it accepts and a Vitest test in `__tests__/`.
- `tools/lib/composition-catalog.ts` is an AI-facing catalog of composable components; must be updated when new ones land.

**DJ Fox reference implementation:**

- `sites/dj-fox-electrical/` (now production, formerly `-test`) is the reference self-contained site.
- `sites/dj-fox-electrical/composition.json` defines 15 pageTypes with sections/dataKeys/layout/slots. Attached structure should be copied.
- `sites/dj-fox-electrical/components/site-header.tsx` and `site-footer.tsx` are site-local Server Components.
- `sites/dj-fox-electrical/theme.config.ts` contains an inline `componentRegistry` literal with `{ theme: "orion", heroVariant, headerVariant, cardVariant, sectionVariant }`.
- `sites/dj-fox-electrical/app/globals.css` inlines the theme's globals (with `animations.css` rewritten to import from `@platform/core-components/src/styles/animations.css`).

**Header nav dropdown primitive (recently added):**

- `packages/core-components/src/components/ui/header-nav-dropdown.tsx` — generic mega-menu primitive, client component, supports hover + keyboard interaction.
- `packages/core-components/src/components/ui/buildAlphaColumns.ts` — helper that groups a flat list of items into N alphabetical columns for display in the dropdown.
- DJ Fox uses this for Locations. Colossus requires a **county-grouped** variant, not alphabetical — needs either a new `buildGroupedColumns` helper or an extension.

**Content structure (already in place, no schema changes needed):**

- 71 MDX files total across `content/services/` (24 base + 6 location variants), `content/locations/` (37 files including 5 county pages), `content/blog/` (5), `content/projects/` (2), `content/testimonials/` (3).
- Location frontmatter fields: `county`, `countySlug`, `countyDescription`, `countyHighlights`, `redirectTowns`, `localAuthority`, `pricing`, `specialists`, `coverage`.
- County pages have distinct frontmatter (`countyDescription`, `countyHighlights`, list of towns, no pricing or service specialists) vs town pages.

**Validation tooling currently available in the monorepo:**

- `tools/lib/pipeline-visual-compare.ts` — `compareImages(refPath, testBuffer, diffOutPath)` using `sharp`, pixel-level diff, generates red-highlighted diff PNGs. Already in use for Stitch design pipeline.
- `tools/lib/screenshot-capture.ts` — Playwright Chromium lifecycle pattern, captures full-page screenshots of discovered pages.
- `tools/lib/visual-qa-loop.ts` — dev-server-lifecycle + capture + diff + fix-loop pattern.
- `cs-visual-fidelity-reviewer` agent — vision-based comparison using 14 rules (VFR-001 through VFR-014). Manual/qualitative, not what we want as the hard gate.
- `cs-theme-package-validator` agent — 15 structural rules.
- `/pipeline.validate-site` skill — parallel fan-out of visual + a11y + perf agents.
- No existing tool captures a production-URL baseline. No tool compares dev vs production automatically.
- Playwright `toHaveScreenshot()` is configured per-site but baselines are not integrated into the pipeline.

### Codebase Snapshot

**Colossus-specific files of note:**

- `sites/colossus-scaffolding/app/layout.tsx` — currently imports `VegaHeader`, `VegaFooter` from `@platform/themes/vega/components`; passes flat `locations` array (not county-grouped) to the header.
- `sites/colossus-scaffolding/lib/locations.ts` — `getAllCounties()` function (lines 74-118) builds the county→towns hierarchy from MDX frontmatter; battle-tested, reusable as-is.
- `sites/colossus-scaffolding/theme.config.ts` — brand primary `#005A9E`, secondary `#0066b5`, accent amber `#f59e0b`. Uses `vegaRegistry`. 65 lines total.
- `sites/colossus-scaffolding/site.config.ts` — business info, navigation (6 main items), feature flags, 459 lines. No code changes needed.
- `sites/colossus-scaffolding/app/page.tsx` — home page, 256 lines, inline HeroSection + CoverageAreas + ServicesOverview.
- `sites/colossus-scaffolding/app/locations/page.tsx` — locations index, 271 lines, inline with `TownFinderSection`, `CountyGatewayCards`, `CoverageMapSection`.
- `sites/colossus-scaffolding/app/locations/[slug]/page.tsx` — county AND town detail, currently ~100+ lines, uses `LargeFeatureCards`, `ServiceShowcase`, `PricingPackages`, `LocalAuthorityExpertise`.
- `sites/colossus-scaffolding/app/services/[slug]/[location]/page.tsx` — nested service-location route.
- `sites/colossus-scaffolding/app/globals.css` — 26 lines, imports Leaflet + Vega globals + Tailwind layers.

**Dependencies:** `next@16.0.10`, `react@19.2.3`, `leaflet@1.9.4`, `react-leaflet@5.0.0`, `newrelic`, `resend`, `next-mdx-remote`, `gray-matter`, `zod`.

**Production URL:** `colossusscaffolding.com` (domain field in `site.config.ts:170`).

### What a Good Plan Should Cover

Your plan needs to answer:

1. **The validation gate design.** How exactly do you prevent the DJ Fox-class drift from recurring? Concretely: what tools, what thresholds, what viewports, how is "done" defined? This is the load-bearing question.
2. **Where does the migration happen physically?** Parallel `sites/colossus-scaffolding-test/`? In-place branch? Some other approach?
3. **What new composable components must be built?** List them. For each: should it be a new composable, a variant of an existing one, or kept site-local? Justify.
4. **How does the county-grouped locations dropdown get built?** Extend the existing `header-nav-dropdown` primitive, or something else?
5. **How is the nested `/services/{service}/{location}` route handled in composition?** New pageType? Wrapper page.tsx? Data shape?
6. **How do we handle the 5 county overview pages** that are structurally distinct from town pages?
7. **What is the phase/step ordering?** What are the verification gates between phases?
8. **What are the risks and trade-offs?** Specifically: where could this go wrong that DJ Fox didn't reveal?
9. **How does the production swap happen** without breaking the Vercel deployment?
10. **What ongoing regression protection is in place after the swap** so this class of drift is caught going forward, not just during the migration?

### Open Questions to Flag

- The user accepts "a few percentage points of variance" but rejects "major differences." What concrete thresholds (pixel-diff %, per-viewport, per-page-type) operationalise this?
- Should the baseline be captured once and committed to the repo, or re-captured dynamically? (Trade-off: repo bloat vs. freshness.)
- Should the test site run the full build and Playwright suite on every composition.json edit, or only at phase boundaries? (Trade-off: feedback latency vs. total CI cost.)
- If a page is in the REVIEW zone (diff above "likely-ok" but below "definitely-broken"), what is the cheapest way to resolve it without a human eye?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases and steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Concrete threshold numbers for the visual validation gate (defend your choices)
- Risks and trade-offs called out explicitly

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04/2026-04-21_colossus-composition-migration/`.

Then output this command for the user to copy-paste into Claude Code:

`/plan.with.codex synthesise`
