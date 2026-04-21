# Session Wrap-Up: Theme Component Contract

**Date:** 2026-04-19
**Session folder:** output/sessions/2026-04/2026-04-19_theme-component-contract/
**Branch:** feature/theme-component-contract
**Status:** Completed

## Goal

Establish a machine-enforced Theme Component Contract so composable section components render consistently across all 6 themes, not just Orion.

## What Was Done

- Created `packages/theme-system/src/component-contract.ts` defining 10 required CSS classes (5 buttons, 1 section, 1 overlay, 3 utilities) and re-exported from the theme-system barrel.
- Built `tools/validate-theme-globals.ts` — a CSS parser that extracts class selectors from each theme's `globals.css` and checks them against the contract. Fixed a brace-depth parsing bug in the brief's original code.
- Backfilled all 6 themes with theme-appropriate implementations: Vega (navy), Cygnus (industrial/sharp), Solaris (pastel/pill with custom radius tokens), Designlab and Navagarden (standard rounded-lg).
- Migrated 4 stray classes (`noise-overlay`, `stat-value`, `location-pill`, `location-pill-arrow`) from `sites/dj-fox-electrical-test/app/globals.css` into `packages/themes/orion/globals.css`.
- Wired validator into CI (`.github/workflows/ci.yml`) and as a build-gating task in `turbo.json`. Documented the contract in `docs/standards/theme-component-contract.md` and updated CLAUDE.md, core-components CLAUDE.md, architecture docs, and the creating-new-theme guide.

## Key Decisions

- **Validator CSS parser rewrite:** The brief's original buffer-based parser failed because `@import` lines and `@apply` content inside rule bodies accumulated in the buffer, causing the `@`-prefix check to reject valid class selectors. Replaced with a character-by-character brace-depth tracker that only extracts classes from depth-0 selectors.
- **Cygnus `location-pill` uses `rounded-none`** instead of `rounded-xl` — matches Cygnus's card convention (`rounded-none` on `.card`).
- **Solaris uses custom CSS properties** (`--solaris-radius-btn`, `--solaris-radius-pill`) for button and pill radii instead of Tailwind radius classes, preserving its existing design token pattern.
- **Noise overlay opacity varies by theme:** Orion/Vega/Designlab/Navagarden at 0.04, Cygnus at 0.06 (industrial texture), Solaris at 0.02 (softer aesthetic).

## Commits

- `f1ddd93` feat(theme-system): introduce Theme Component Contract + validator (warn-only)
- `8ce37f0` feat(themes/vega): implement theme component contract
- `d939ab3` feat(themes): implement component contract for designlab + navagarden
- `b871591` feat(themes/cygnus): implement theme component contract
- `6947c3a` feat(themes/solaris): implement theme component contract
- `4dc268a` refactor(orion): absorb noise-overlay / stat-value / location-pill from site globals
- `8e5d476` ci(theme-contract): promote validator to error + wire into CI
- `bb2119a` docs(theme-contract): document the Theme Component Contract + enforcement

## Files Changed

- `packages/theme-system/src/component-contract.ts` — new contract source of truth
- `tools/validate-theme-globals.ts` — new CI validator
- `packages/themes/{orion,vega,cygnus,solaris,designlab,navagarden}/globals.css` — contract class backfill
- `sites/dj-fox-electrical-test/app/globals.css` — removed migrated classes
- `turbo.json` — build-gating task
- `.github/workflows/ci.yml` — CI step
- `docs/standards/theme-component-contract.md` — new spec

## What Was Learned / Why It Matters

The contract establishes a clean separation between composable sections and theme CSS — composables can reference any contract class name with confidence that every theme implements it. This is the architectural prerequisite for the composition system to work across themes: without it, adding a new theme or changing a composable would silently break rendering on other themes. The validator catches drift at CI time, before it reaches production. The `THEME_COMPONENT_CONTRACT` export is also available for future tooling (Stitch/ingest pipelines can use it as a checklist when generating new themes).

## Follow-On Tasks

- Rebase `feature/composable-components-redesign` onto `develop` after this branch merges — the composable class references are now valid against the backfilled contract.
- Pre-existing `pnpm lint` failure: `faq-item.tsx` has `"use client"` in composable Server Components — unrelated to this work but blocks clean lint runs.
- Pre-existing `pnpm pipeline:smoke` failure: missing fixture `output/ingestion/lyra/site-analysis.json`.
