# Session Wrap-Up: DJ Fox Test Site Self-Containment

**Date:** 2026-04-20
**Session folder:** output/sessions/2026-04/2026-04-19_dj-fox-test-self-contained/
**Branch:** feature/dj-fox-test-self-contained
**Status:** Completed

## Goal

Make `sites/dj-fox-electrical-test/` fully self-contained by removing all dependencies on `packages/themes/orion/`, and retire the Theme Component Contract validator whose premise dies with the shared-theme-package model.

## What Was Done

- Inlined all 630 lines of Orion's `globals.css` into the site's own `app/globals.css`, replacing the `@import` with verbatim CSS
- Copied `OrionHeader` and `OrionFooter` into the site as `SiteHeader` / `SiteFooter`, updated `layout.tsx` registrations and `composition.json` keys
- Inlined the `orionRegistry` component registry literal into `theme.config.ts` with `satisfies ComponentRegistry`
- Removed `@platform/themes/orion` path aliases from `tsconfig.json`, theme content globs from `tailwind.config.ts`, and the `@platform/themes` dependency from `package.json`
- Retired the Theme Component Contract validator: deleted `tools/validate-theme-globals.ts`, removed `validate:theme-contract` from `package.json` scripts, `turbo.json` tasks (including `build.dependsOn`), and CI workflow; marked the spec doc as deprecated

## Key Decisions

- **Relative path for animations.css import** (`../../../packages/core-components/...`) rather than `@platform/` alias — the site has no PostCSS import alias plugin, so CSS `@import` can't resolve tsconfig paths
- **Aliased both component and type** from core-components (`CoreSiteHeader`, `CoreSiteHeaderProps`) to avoid identifier collision with the site's own `SiteHeader` / `SiteHeaderProps`
- **Removed `@platform/themes` from `package.json`** — not in the original brief but required to pass the zero-hits self-containment invariant
- **Trimmed Orion comment block** in inlined globals.css that referenced the old `packages/themes/orion/globals.css` import path — would have been a false positive on the grep invariant

## Commits

- `351cc58` refactor(dj-fox-test): inline orion globals.css into site
- `a98eb90` refactor(dj-fox-test): copy Orion header and footer into site as SiteHeader/SiteFooter
- `fbba5a2` refactor(dj-fox-test): inline orion component registry into theme.config
- `6e78f7a` chore(dj-fox-test): remove @platform/themes/orion path aliases
- `358dfc7` chore(dj-fox-test): scope tailwind content globs to site
- `474f6cf` chore(dj-fox-test): remove unused @platform/themes dependency
- `19e204b` chore(theme-contract): retire validator ahead of packages/themes/\* removal

## Files Changed

- `sites/dj-fox-electrical-test/app/globals.css` — inlined 630 lines of Orion CSS
- `sites/dj-fox-electrical-test/components/site-header.tsx` — new, copied from orion header
- `sites/dj-fox-electrical-test/components/site-footer.tsx` — new, copied from orion footer
- `sites/dj-fox-electrical-test/app/layout.tsx` — import paths + registration keys
- `sites/dj-fox-electrical-test/theme.config.ts` — inline registry literal
- `sites/dj-fox-electrical-test/tsconfig.json` — removed 3 path aliases
- `sites/dj-fox-electrical-test/tailwind.config.ts` — removed 2 theme globs
- `tools/validate-theme-globals.ts` — deleted
- `turbo.json` — removed validator task + build dependency
- `.github/workflows/ci.yml` — removed validator step

## What Was Learned / Why It Matters

This is the first site to complete the self-containment migration, proving the recipe works: inline CSS, copy components, inline registry, drop aliases, drop globs, verify with delete simulation. The delete simulation (renaming `packages/themes/orion/` away and rebuilding) passed cleanly both times, confirming zero runtime coupling. The recipe is now proven for the remaining 9 sites. One thing to codify in future briefs: always check `package.json` workspace dependencies alongside source imports — they're invisible to source-level grep but can re-introduce implicit resolution.

## Follow-On Tasks

- Migrate remaining 9 sites using the same recipe (each gets its own PR)
- Once the last site is migrated off a theme, delete that theme package
- Pre-existing lint failure in `core-components/faq-item.tsx` (`"use client"` in composable component) needs separate fix
- Write `recipe.md` in this session folder codifying the repeatable migration steps
