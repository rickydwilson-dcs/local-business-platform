# Implementation Plan: Pipeline Theme Wiring Fix

**Date:** 2026-02-22
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

## Key Differences Between Plans

| Aspect | Claude | Codex | Synthesised Decision |
|--------|--------|-------|----------------------|
| **Scope** | Targeted bug fix: add missing registry exports + fix layout.tsx wiring (5 changes, 8 files) | Full validation framework: visual diff harness, Playwright comparisons, threshold model, baseline manager (~15 new files) | **Claude's scope.** The immediate bug is a straightforward wiring gap. Codex's validation framework is valuable but solves a different problem (quality assurance) and should be a separate initiative. |
| **Registry generation** | Add `REGISTRY_PRESETS` lookup in `generateIndexTs()`, derive variants from `registryRecommendation.themeName` | Same core fix (Step 3: enforce `<theme>Registry` + `<theme>DefaultConfig` exports) but wrapped in a new `theme-wiring-validator.ts` module | **Claude's approach.** Inline the preset lookup in the existing generator function. No need for a separate validator module yet — the type system catches mismatches at build time. |
| **layout.tsx wiring** | Add Step 5e to `pipeline.ingest.md` to rewrite layout.tsx imports and ThemeProvider props | Mentioned as part of Step 3 enforcement but no specific pipeline instruction changes detailed | **Claude's approach.** The pipeline instruction is the actual execution spec — it must be explicit about layout.tsx. |
| **Existing test sites** | Manually fix test-lyra and test-atlas wiring | Not addressed (assumes re-run of pipeline) | **Claude's approach.** Fix the existing sites directly — faster than re-running the full pipeline. |
| **Validation** | Type-check + visual inspection of dev server | Automated Playwright visual diff suite with thresholds, masks, and baseline management | **Claude's approach for now.** Type-check + dev server is sufficient for this fix. Codex's visual validation is a separate backlog item. |

## Blind Spots Caught

- **Codex caught:** The need for automated validation to prevent regression — currently there's no guardrail beyond manual inspection. This is a real gap, but it's a separate initiative (added to backlog below).
- **Codex caught:** The risk of flaky visual comparisons from fonts/async rendering — relevant context for when visual validation is built.
- **Claude caught:** The specific `SiteHeader appearance` prop needs updating based on `headerVariant` — Codex's plan didn't address this detail.
- **Claude caught:** The `pipeline.ingest.md` instruction file is the actual execution spec and needs explicit step-by-step changes — Codex treated it as a secondary concern.

## Backlog Items (from Codex, deferred)

These are good ideas from Codex's plan that should be tracked separately:

1. **Theme wiring validator tool** — automated pre-build check that registry/config/layout.tsx are consistent
2. **Visual regression harness** — Playwright-based screenshot comparison against reference baselines
3. **Pipeline validation gate** — integrate wiring + visual checks as a hard-fail step in the pipeline

---

## Implementation Plan

### Phase 1: Fix the scaffold tool (root cause)

**File:** `tools/scaffold-theme-package.ts`

**Changes to `generateIndexTs()` (line 73):**

1. Add `ComponentRegistry` to the type import from `@platform/theme-system`
2. Add a `REGISTRY_PRESETS` constant mapping base theme names to variant values:
   ```typescript
   const REGISTRY_PRESETS: Record<string, Omit<ComponentRegistry, 'theme'>> = {
     vega: {
       heroVariant: "split",
       headerVariant: "light",
       cardVariant: "standard",
       sectionVariant: "standard",
     },
     orion: {
       heroVariant: "image-overlay",
       headerVariant: "dark",
       cardVariant: "icon-circle",
       sectionVariant: "dark-accent",
     },
   };
   ```
   Place this as a module-level constant (above `generateIndexTs`), not inside the function.

3. In `generateIndexTs()`, read `analysis.registryRecommendation.themeName` to pick the preset (fallback: `"vega"`)

4. In the generated output string, emit a registry export **before** the config export:
   ```typescript
   export const ${camel}Registry: ComponentRegistry = {
     theme: "${name}",
     heroVariant: "${preset.heroVariant}",
     headerVariant: "${preset.headerVariant}",
     cardVariant: "${preset.cardVariant}",
     sectionVariant: "${preset.sectionVariant}",
   };
   ```

**Verification gate:** `pnpm type-check` passes from root.

### Phase 2: Fix existing theme packages

**Files:**
- `packages/themes/lyra/index.ts`
- `packages/themes/atlas/index.ts`

For each, add `ComponentRegistry` to the import type and add the registry export. Both use vega-derived variants (confirmed from their `site-analysis.json` — both recommend `"vega"`).

**lyra:**
```typescript
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";

export const lyraRegistry: ComponentRegistry = {
  theme: "lyra",
  heroVariant: "split",
  headerVariant: "light",
  cardVariant: "standard",
  sectionVariant: "standard",
};
```

**atlas:**
```typescript
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";

export const atlasRegistry: ComponentRegistry = {
  theme: "atlas",
  heroVariant: "split",
  headerVariant: "light",
  cardVariant: "standard",
  sectionVariant: "standard",
};
```

**Verification gate:** `pnpm type-check` passes.

### Phase 3: Update pipeline instruction

**File:** `.claude/commands/pipeline.ingest.md`

**3a. Simplify Step 5a** — Remove the orion/vega branching. The generated `theme.config.ts` should always import from the theme's own package:

```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { <camel>Registry, <camel>DefaultConfig } from '@platform/themes/<theme-name>';

/**
 * Test site theme configuration
 * Generated by /pipeline.ingest
 */
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: <camel>Registry,
  ...<camel>DefaultConfig,
};
```

To determine the correct export names, read `packages/themes/<theme-name>/index.ts` and find the exported `Registry` and `DefaultConfig` variable names.

**3b. Add Step 5e** — Update `sites/test-<theme-name>/app/layout.tsx`:

1. Replace the registry import:
   - Find: `import { vegaRegistry } from '@platform/themes/vega';` (or orionRegistry from orion)
   - Replace with: `import { <camel>Registry } from '@platform/themes/<theme-name>';`

2. Update ThemeProvider:
   - Find: `<ThemeProvider theme="vega" registry={vegaRegistry}>`
   - Replace with: `<ThemeProvider theme="<theme-name>" registry={<camel>Registry}>`

3. Update SiteHeader appearance:
   - Read `registryRecommendation.themeName` from `output/ingestion/<theme-name>/site-analysis.json`
   - If `"orion"` → `appearance="dark"`, otherwise → `appearance="light"`

**Verification gate:** Re-read the instruction file to confirm the steps are unambiguous.

### Phase 4: Fix existing test sites

**Files:**
- `sites/test-lyra/theme.config.ts` — import `lyraRegistry` from `@platform/themes/lyra` instead of `vegaRegistry` from vega
- `sites/test-lyra/app/layout.tsx` — import `lyraRegistry`, set `theme="lyra"`, `registry={lyraRegistry}`, keep `appearance="light"`
- `sites/test-atlas/theme.config.ts` — import `atlasRegistry` from `@platform/themes/atlas` instead of `vegaRegistry` from vega
- `sites/test-atlas/app/layout.tsx` — import `atlasRegistry`, set `theme="atlas"`, `registry={atlasRegistry}`, keep `appearance="light"`

**Verification gate:** `pnpm type-check` passes from root.

### Phase 5: Verify end-to-end

1. `pnpm type-check` — full monorepo type check
2. Start test-lyra dev server, confirm:
   - Purple/yellow ColorCode palette renders (not Vega blue)
   - ThemeProvider shows `theme="lyra"` in React DevTools
3. Start test-atlas dev server, confirm:
   - Blue Boldway palette renders
   - ThemeProvider shows `theme="atlas"` in React DevTools

---

## Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `REGISTRY_PRESETS` becomes stale if new base themes are added | Low (only orion + vega exist) | Comment in code: "Update when adding a new base theme" |
| Future themes need variant values that differ from their base | Medium | Current approach copies base variants — sufficient for MVP. Can be refined later to derive from `visualLanguage` analysis data |
| No automated regression test for wiring | Medium | Tracked as backlog item from Codex's plan |
