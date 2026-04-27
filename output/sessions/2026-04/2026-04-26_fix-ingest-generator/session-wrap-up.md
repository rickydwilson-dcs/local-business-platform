# Session Wrap-Up: Fix pipeline.ingest Theme Generator Bugs

**Date:** 2026-04-27
**Session folder:** output/sessions/2026-04/2026-04-26_fix-ingest-generator/
**Branch:** feature/fix-ingest-generator
**Status:** Completed

## Goal

Fix 6 generator bugs (across 7 files) that caused every `/pipeline.ingest` run to produce a theme package failing TPV validation with Critical=2, High=3.

## What Was Done

- **Phase 0:** Added 8 red tests to `theme-component-generator.test.ts` and `scaffold-integrity.test.ts` confirming all bugs before touching source
- **Phase 1:** Moved `react` and `next` from `dependencies` to `peerDependencies` in `packages/themes/package.json` (TPV-004)
- **Phase 2:** Deleted the one-line blanket `if (blueprint.category === "Navigation") return true` from `needsUseClient()` — static navs now correctly become Server Components (TPV-003)
- **Phase 3:** Added `blueprintId?: string` to `ComponentMatch` interface, serialised it through `analyse-site.ts` and `component-matcher.ts`, and fixed the `scaffold-theme-package.ts` Map reconstruction to use `match.blueprintId` directly instead of a broken name-match fallback (Bug 5)
- **Phase 4:** Added `hexToRgba` helper and `DEFAULT_TYPOGRAPHY_SCALE` constant; rewired `generateIndexTs()` to always emit `colors.semantic`, `colors.overlay`, all surface sub-fields, and all 8 typography scale levels with safe fallbacks (TPV-006, TPV-009)
- **Phase 5:** Changed `generateComponentBarrel` signature to accept `options?: { themeName? }` and appended `{Pascal}Header`/`{Pascal}Footer` alias exports (with prop type re-exports) to the barrel when a primary nav/footer blueprint is found (TPV-002)

## Key Decisions

- **Step 3b skipped (no-op):** `analysis-schemas.ts` has no `ComponentMatchSchema` — the Zod schema for `ComponentMatch` was never added to that file. Only the TypeScript interface in `reference-analysis-types.ts` needed updating.
- **No legacy name-match fallback in Step 3e:** The old loop that tried to match component names against blueprint export names never worked (core names ≠ blueprint export names). Removed entirely; old `site-analysis.json` files without `blueprintId` must be re-ingested.
- **`DEFAULT_TYPOGRAPHY_SCALE` covers all 8 levels:** The Zod schema for `typography.scale` only enumerated 6 keys (`hero`–`body`). The default scale adds `small` and `caption`. These will pass through the generator without Zod validation errors because the scale is emitted directly into the template string.

## Commits

- `b833718` — test(generator): add red tests for TPV-002/003/006/009 generator bugs
- `ea24af2` — fix(themes): move react and next to peerDependencies (TPV-004)
- `75b1026` — fix(generator): remove blanket Navigation→client-component rule (TPV-003)
- `b569e6c` — fix(generator): preserve blueprintId through ComponentMatch serialisation (Bug 5)
- `4115bac` — fix(generator): always emit semantic, overlay, surface sub-fields and typography scale (TPV-006, TPV-009)
- `17cbe15` — fix(generator): add {ThemeName}Header/{ThemeName}Footer barrel aliases (TPV-002)
- `d73292b` — chore(generator): verify all generator fixes pass type-check, build, and pipeline smoke

## Files Changed

- `tools/lib/theme-component-generator.ts` — removed Navigation blanket client rule
- `tools/scaffold-theme-package.ts` — hexToRgba, DEFAULT_TYPOGRAPHY_SCALE, always-emit surface/semantic/overlay/scale, barrel alias logic, blueprintId Map reconstruction
- `tools/lib/reference-analysis-types.ts` — `blueprintId?` added to `ComponentMatch`
- `tools/analyse-site.ts` — flatten loop now serialises blueprintId
- `tools/lib/component-matcher.ts` — `results.set()` now includes `blueprintId: blueprint.id`
- `packages/themes/package.json` — react/next moved to peerDependencies
- `tools/__tests__/theme-component-generator.test.ts` — 2 new needsUseClient tests
- `tools/__tests__/scaffold-integrity.test.ts` — 6 new generateIndexTs/barrel contract tests

## What Was Learned / Why It Matters

All 5 TPV Critical/High findings from the 2026-04-25 Lyra ingest failure traced back to generator code, not site-specific data — meaning they would have repeated on every future ingest run. The fixes are generator-level and therefore apply to all future theme packages. The `blueprintId` serialisation fix in particular resolves a silent data-loss bug that had existed since the component-matching system was built: the Map key was discarded at serialisation and could never be recovered, so the "skip core-reused components" logic in the barrel was always a no-op. Pipeline smoke confirms the full scaffold cycle now passes end-to-end.

## Follow-On Tasks

- Re-run `/pipeline.ingest` against Fountain Digital to produce a clean Lyra package and re-run TPV — the existing `packages/themes/lyra/` was generated with the buggy generator and should be regenerated
- The `typography.scale` Zod schema in `analysis-schemas.ts` only covers 6 keys; extend it to include `small` and `caption` to match `DEFAULT_TYPOGRAPHY_SCALE`
