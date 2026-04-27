# Codex Implementation Plan — Fix `pipeline.ingest` Theme Generator Bugs

**Date:** 2026-04-26  
**Scope:** `tools/**` and `packages/themes/package.json` only

## 1) Phase 0 — Baseline + Safety Net

1. **Create a baseline branch and capture current behavior**
   - Run:
     - `pnpm type-check`
     - Existing test suite for tools/theme generation (if present)
   - Archive failing Lyra run artifacts (already in `output/ingestion/lyra/`) as comparison baseline.

2. **Add/extend minimal regression tests before refactor**
   - Prefer targeted unit tests around pure generators:
     - `needsUseClient()` behavior
     - `generateIndexTs()` required token blocks
     - `generateComponentBarrel()` alias + ghost exclusion
     - component match map reconstruction behavior
   - If no existing harness for these files, add smallest possible test entry using repo-standard runner (do not introduce a new framework unless absolutely required).

**Files likely touched**

- `tools/**/__tests__/*` (or existing test location)

**Verification gate**

- Baseline tests run and fail where expected for current bugs (or are added as red tests).

---

## 2) Phase 1 — One-time package metadata fix (Bug 6)

1. **Move `react` and `next` from `dependencies` to `peerDependencies`** in:
   - `packages/themes/package.json`

2. Keep version ranges unchanged; only section placement changes.

**Files modified**

- `packages/themes/package.json`

**Verification gate**

- `pnpm install`/workspace resolution is clean.
- `pnpm type-check` unchanged except for expected downstream bug fixes not yet applied.

**Risk/trade-off**

- Very low risk, isolated metadata-only change. Good first change to reduce noise later.

---

## 3) Phase 2 — Fix client/server component misclassification (Bug 1)

1. **Refine `needsUseClient()`**
   - Remove blanket rule:
     - `if (blueprint.category === "Navigation") return true`
   - Keep deterministic interactive signals:
     - `interactionNeeds === "stateful"`
     - form/newsletter purpose heuristic
     - `CLIENT_PATTERNS` regex for hooks/handlers/browser APIs in generated JSX

2. **(Optional hardening)** add explicit comment/tests that navigation is client-only _only_ when interactive markers exist.

**Files modified**

- `tools/lib/theme-component-generator.ts`
- tests for `needsUseClient`

**Verification gate**

- Unit tests prove static nav/header/footer without hooks stays server component.
- Components with `useState`, handlers, or stateful needs still become client components.

**Risk/trade-off**

- Small risk of false negatives if interactive code escapes `CLIENT_PATTERNS`; mitigate by tests covering common interactivity strings.

---

## 4) Phase 3 — Make generated DefaultConfig always complete (Bugs 2 & 3)

### 4A. Ensure required color blocks always emitted (Bug 2)

1. **Introduce defaults in scaffolder generation path**, not extractor:
   - Always emit:
     - `colors.surface.card`
     - `colors.surface.mutedForeground`
     - `colors.surface.inverse`
     - `colors.semantic.{success,warning,error,info}`
     - `colors.overlay.{dark,light,primary}`

2. **Add backward-compatible type updates** for token recommendation shape used by scaffolder:
   - Extend `ThemeTokenRecommendations` in tools types to include optional `semantic` and `overlay` blocks (optional for extraction compatibility; scaffolder fills defaults).

3. **Overlay primary derivation**
   - Derive from `brand.primary` dynamically (no hardcoded brand):
     - parse hex (`#RGB`/`#RRGGBB`)
     - emit valid CSS color for translucent overlay (e.g. `rgba(r, g, b, 0.72)`)
   - If parse fails, fall back to safe default derived behavior (e.g. use brand.primary directly or a known safe rgba), but keep deterministic.

### 4B. Ensure 8-level typography scale always emitted (Bug 3)

4. Define `DEFAULT_TYPOGRAPHY_SCALE` constant in scaffolder with all required levels:
   - `hero`, `h1`, `h2`, `h3`, `h4`, `body`, `small`, `caption`
   - Each entry valid per constraints:
     - `size` in `rem`
     - `lineHeight` unitless number
     - `letterSpacing` in `em`
     - `weight` number

5. In `generateIndexTs()`:
   - Always emit scale block using `tokens.typography.scale ?? DEFAULT_TYPOGRAPHY_SCALE`.

**Files modified**

- `tools/scaffold-theme-package.ts`
- `tools/lib/reference-analysis-types.ts` (or token type file where `ThemeTokenRecommendations` lives)
- `tools/lib/analysis-schemas.ts` (if schema validates token recommendation object)
- tests for `generateIndexTs`

**Verification gate**

- Snapshot/string tests verify `index.ts` always includes required color + typography keys, even with sparse tokens.
- Generated output compiles with TS.

**Risk/trade-off**

- Defaults may differ slightly from extractor-provided aesthetics; acceptable by non-goals. Priority is contract completeness and TPV compliance.

---

## 5) Phase 4 — Preserve blueprint identity through serialization (Bug 5 root fix)

1. **Make `ComponentMatch` blueprint-aware**
   - Add optional field:
     - `blueprintId?: string`
   - Keep optional for backward compatibility with old `site-analysis.json`.

2. **Write blueprint IDs during flatten in `analyse-site.ts`**
   - Replace key-discarding loop with key-preserving serialization:
   - from map entries `[blueprintId, match]` => push `{ ...match, blueprintId }`.

3. **Update Zod/schema validation** for serialized analysis to accept optional `blueprintId`.

4. **Fix map reconstruction in `scaffoldThemePackage()`**
   - Primary path: use `match.blueprintId` directly when present.
   - Legacy fallback path for old analyses (no `blueprintId`):
     - attempt prior name matching only if unique and confident
     - otherwise skip with warning (prefer false-negative over false-positive ghost exports).

**Files modified**

- `tools/lib/reference-analysis-types.ts`
- `tools/lib/analysis-schemas.ts`
- `tools/analyse-site.ts`
- `tools/scaffold-theme-package.ts`
- tests for round-trip and reconstruction logic

**Verification gate**

- New analysis JSON includes `blueprintId`.
- Reconstructed map contains correct blueprint IDs for exact/close matches.
- No ghost barrel entries for reused core components.

**Risk/trade-off**

- Older analysis files without IDs may not perfectly reconstruct reuse map; acceptable if fallback is conservative and non-breaking.

---

## 6) Phase 5 — Barrel exports: required ThemeName Header/Footer aliases (Bug 4)

1. **Update `generateComponentBarrel()` signature safely**
   - Add optional parameter for theme name (prefer options object to avoid positional breakage):
     - e.g. `generateComponentBarrel(components, options?: { themeName?: string; ... })`
   - Maintain compatibility for existing callers.

2. **Add alias generation**
   - Continue exporting normal component exports for unmatched generated files.
   - Additionally emit:
     - `{ThemeName}Header` and `{ThemeName}HeaderProps`
     - `{ThemeName}Footer` and `{ThemeName}FooterProps`
   - Alias target chosen from unmatched components using deterministic selection:
     - Header candidate priority: explicit `header` in name/purpose > `Navigation` category > `nav` keywords
     - Footer candidate priority: explicit `footer` name/purpose/category
     - If multiple candidates, stable sort by blueprint order/index and pick first.

3. **No alias to missing files**
   - Aliases can only point to local generated exports that are actually in barrel.
   - If no candidate exists, log warning (and fail test scenario if TPV contract requires strict presence for generated themes).

**Files modified**

- `tools/scaffold-theme-package.ts`
- tests for `generateComponentBarrel`

**Verification gate**

- Generated `components/index.ts` includes theme-prefixed Header/Footer aliases + prop types.
- Works with both contexts calling `generateComponentBarrel()` (no caller break).

**Risk/trade-off**

- Candidate selection heuristics may be imperfect with unusual blueprint naming; deterministic priority + tests reduce drift.

---

## 7) Phase 6 — Integrate ghost-entry exclusion with barrel generation (Bug 5 observable symptom)

1. Ensure component list passed to barrel excludes blueprints with `exact` or `close` core matches using corrected map from Phase 4.
2. Confirm only truly generated files are exported from local barrel.
3. Validate aliases are built from remaining exported components only.

**Files modified**

- `tools/scaffold-theme-package.ts`
- related tests

**Verification gate**

- No barrel line references non-existent local component files.
- Build/import of generated theme package succeeds at TS level.

---

## 8) Phase 7 — End-to-end validation

1. Run:
   - `pnpm type-check`
2. Re-run ingest:
   - `/pipeline.ingest --url https://www.fountaindigital.co.uk/ --name lyra`
3. Validate TPV output:
   - `Statistics: Critical=0 High=0`
4. Manually inspect generated Lyra outputs:
   - `packages/themes/lyra/index.ts` contains required surface/semantic/overlay + 8-level typography scale
   - `packages/themes/lyra/components/index.ts` contains `LyraHeader`, `LyraFooter` + prop type aliases
   - no ghost exports for core-reused components

**Verification gate**

- Acceptance criteria 1–5 all pass.

---

## 9) Rollout/Regression checks

1. Smoke check existing themes are untouched:
   - `packages/themes/orion`, `vega`, `cygnus`, `solaris` no content regressions from generator logic.
2. Optionally run ingest on one additional URL to confirm generality.
3. Document migration note:
   - `ComponentMatch.blueprintId` is optional and now preferred for reconstruction.

---

## Key design decisions (explicit answers to brief questions)

1. **Bug 1 navigation rule:** remove blanket Navigation=>client rule entirely; rely on real interactivity signals. This minimizes false positives and aligns with TPV-003.
2. **Bug 2 defaults location:** implement in `generateIndexTs()`/scaffolder, not extractor; always emit required keys.
3. **Bug 3 typography scale:** always provide default 8-step scale (contract-first); extractor values override when present.
4. **Bug 4 alias naming:** add themeName-aware alias exports via deterministic header/footer candidate selection from unmatched components.
5. **Bug 5 identity fix:** add optional `blueprintId` to `ComponentMatch`; serialize it in analysis output; reconstruct map by ID first.
6. **Bug 5 simpler alternative considered:** name-matching-only fix is fragile because core names and blueprint names diverge; reject as primary approach.
7. **Change order:** isolated package.json fix first, then logic changes with tests, then end-to-end run.
8. **Testing minimum:** targeted unit tests for pure generators + one end-to-end ingest verification gate.
