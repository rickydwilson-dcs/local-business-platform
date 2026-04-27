# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04/2026-04-26_fix-ingest-generator/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04/2026-04-26_fix-ingest-generator/
```

---

## Brief: Fix pipeline.ingest Theme Generator Bugs

**Date:** 2026-04-26
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The `/pipeline.ingest` skill runs `tools/analyse-site.ts` to clone a reference website and generate a theme package at `packages/themes/<name>/`. The generated package then goes through Phase B TPV (Theme Package Validator) before a test site is created.

On 2026-04-25, a pipeline run for `https://www.fountaindigital.co.uk/` aborted at Phase B with **Critical=2, High=3** TPV findings. All 5 findings traced back to bugs in the generator — not site-specific extraction failures. The same bugs will recur on every future pipeline run until fixed.

The 5 bugs are:

**Bug 1 — Header/Footer emitted as Client Components (Critical, TPV-003)**
`tools/lib/theme-component-generator.ts:371` has a blanket rule: `if (blueprint.category === "Navigation") return true` inside `needsUseClient()`. This forces every navigation-category component to be a `"use client"` component with `useState`, even when the generated JSX body has no interactive hooks. The `CLIENT_PATTERNS` regex on line 358 already catches genuine hook/handler usage — the category override is redundant and harmful.

**Bug 2 — DefaultConfig missing required color categories (Critical, TPV-006)**
`tools/scaffold-theme-package.ts` → `generateIndexTs()` (lines 108–119) writes surface sub-fields (`card`, `mutedForeground`, `inverse`) only when they're present in `themeTokenRecommendations`. The `semantic` and `overlay` color blocks are completely absent from the scaffolder — they're not in the `ThemeTokenRecommendations` type, and no code in the pipeline writes them. Every generated theme will fail TPV-006 unless the consuming site explicitly overrides them.

**Bug 3 — `typography.scale` never populated (High, TPV-009)**
`generateIndexTs()` lines 122–139: `scaleBlock` is only written `if (tokens.typography.scale)`. The `typography.scale` field in `ThemeTokenRecommendations` is typed as optional and the extraction pipeline almost never populates it (requires very specific CSS shapes). The 8-level scale (`hero`, `h1`–`h4`, `body`, `small`, `caption`) is required by the theme system Tailwind plugin to generate `text-h1` etc. utilities.

**Bug 4 — Barrel naming convention not followed (High, TPV-002)**
`generateComponentBarrel()` (lines 332–362) exports components by their blueprint `componentExportName` (generic names like `SiteFooter`, `PrimaryNavigation`). TPV-002 requires a `{ThemeName}Header` and `{ThemeName}Footer` named export plus their prop types. The function doesn't have access to the theme name, and no aliases are added.

**Bug 5 — Ghost barrel entries for core-reused components (build failure)**
`analyse-site.ts:555` flattens the in-memory `Map<blueprintId, ComponentMatch>` into a `ComponentMatch[]` array, discarding the blueprint IDs:

```typescript
for (const [, match] of componentMatchMap) {
  // key discarded!
  if (match) componentMatches.push(match);
}
```

Later, `scaffoldThemePackage()` tries to rebuild the Map from `analysis.componentMatches` by matching `bp.componentExportName === match.componentName`. But `match.componentName` stores the **core** component name (e.g. `"PageHero"`) while `bp.componentExportName` is the **site** component name (e.g. `"HeroSplit"`). The lookup never matches, so "reused-from-core" components still get barrel entries pointing to files that don't exist.

**Bug 6 — `react`/`next` in wrong dependency section (High, TPV-004)**
`packages/themes/package.json` has `react` and `next` in `dependencies` instead of `peerDependencies`. One-time static fix.

### Goals

1. Fix all 5 generator bugs so `/pipeline.ingest` produces Phase B-compliant packages on every run
2. Fix the one-time `packages/themes/package.json` dependency type error
3. TypeScript must continue to pass (`pnpm type-check`) after changes
4. No regressions on existing themes (orion, vega, cygnus, solaris)
5. After fixing, re-run `/pipeline.ingest --url https://www.fountaindigital.co.uk/ --name lyra` should produce Phase B result: `Critical=0 High=0`

### Non-Goals

- Fixing the Medium TPV-013 finding (inline `backgroundImage` style) — that's a component quality issue, not a generator bug
- Fixing TS errors inside the generated Lyra components themselves (AnnouncementBar, ServicesGrid, etc.) — those are AI generation quality issues, separate concern
- Changing the token extraction pipeline to better populate `typography.scale` or surface sub-fields — the generator should provide safe fallbacks, not require better extraction
- Adding new theme components or changing existing themes (orion, vega, cygnus, solaris)

### Acceptance Criteria

1. Running `pnpm type-check` produces zero new TypeScript errors after all changes
2. Running `/pipeline.ingest --url https://www.fountaindigital.co.uk/ --name lyra` produces `Statistics: Critical=0 High=0` from the TPV validator (Phase B passes)
3. Every generated `{name}DefaultConfig` always includes: `colors.semantic` (success/warning/error/info), `colors.overlay` (dark/light/primary), `colors.surface.card`, `colors.surface.mutedForeground`, `colors.surface.inverse`, `typography.scale` (all 8 levels)
4. Every generated `components/index.ts` barrel includes `{ThemeName}Header` and `{ThemeName}Footer` alias exports with their prop types
5. No ghost barrel entries — components matched as "exact" or "close" to core-components are excluded from the barrel

### Constraints

- All changes are confined to `tools/` and `packages/themes/package.json` — no changes to `packages/theme-system/`, `packages/core-components/`, or any `sites/`
- The `ComponentMatch` interface in `reference-analysis-types.ts` is serialised to `site-analysis.json` — adding a new field must be backward-compatible (optional or with a default that doesn't break reading old JSON files)
- `generateComponentBarrel()` is called in two contexts: (a) from `scaffoldThemePackage()` as part of the pipeline, (b) potentially from other tools. Adding `name` as a parameter must not break other callers
- The `DEFAULT_TYPOGRAPHY_SCALE` constants must produce valid CSS — sizes in `rem`, lineHeights as unitless ratios, letterSpacing in `em`, weight as a number
- `overlay.primary` must be derived from `brand.primary` hex — cannot hardcode it since every theme has a different primary colour
- The Navigation category blanket rule removal (Bug 1) must not break themes that currently have working nav components (orion, vega) — those themes were created before the generator, not by it, so they're unaffected. But the next pipeline run must not regress

### Relevant Architecture

**Theme system contract (the TPV rules we're fixing for):**

- `packages/theme-system/src/types.ts` — `DeepPartialThemeConfig` and `ThemeConfig` define which fields exist. `semantic` and `overlay` are both optional at the config level but required by the TPV rules for generated themes.
- Every site's `theme.config.ts` imports `{Name}DefaultConfig` and merges site overrides. If `DefaultConfig` is missing fields, sites must override them manually — unacceptable for generated themes.
- The theme-system Tailwind plugin reads `typography.scale` to generate `text-hero`, `text-h1` etc. utilities. Without the scale, all typography utilities render with undefined CSS variables.

**Generation pipeline (relevant to these bugs):**

- `tools/analyse-site.ts` — orchestrates all 15 steps. Relevant sections: step 9 (component matching, builds in-memory `Map<blueprintId, ComponentMatch>`), step 11 (builds `siteAnalysis` object, flattens match Map to array at line 555), step 12 (calls `generateThemeComponents`), step 14 (calls `scaffoldThemePackage`)
- `tools/lib/theme-component-generator.ts` — generates `.tsx` files. `needsUseClient()` at line 369 decides client vs server component shell. `CLIENT_PATTERNS` regex at line 358 catches interactive hook/handler usage.
- `tools/scaffold-theme-package.ts` — generates the theme package structure. `generateIndexTs()` at line 100 writes `{name}DefaultConfig`. `generateComponentBarrel()` at line 332 writes `components/index.ts`. `scaffoldThemePackage()` at line ~620 is the entry point; it rebuilds the `componentMatchMap` from `analysis.componentMatches` at lines 638–650.
- `tools/lib/reference-analysis-types.ts` — `ComponentMatch` interface (lines 167–172), `SiteAnalysis` type

**Existing correct themes for reference:**

- `packages/themes/orion/index.ts` — has `semantic`, `overlay`, `surface.mutedForeground`, `surface.card`, `surface.inverse` all defined
- `packages/themes/orion/components/index.ts` — exports `OrionHeader`, `OrionFooter` (theme-prefixed) with type exports
- `packages/themes/vega/index.ts` — same pattern as orion for config
- `packages/themes/vega/components/index.ts` — exports `VegaHeader`, `VegaFooter`

### Codebase Snapshot

Key file paths:

```
tools/
  analyse-site.ts                       Main pipeline orchestrator (15 steps)
  scaffold-theme-package.ts             generateIndexTs(), generateComponentBarrel(), scaffoldThemePackage()
  lib/
    theme-component-generator.ts        needsUseClient(), generateThemeComponents()
    theme-component-templates.ts        clientComponentShell(), serverComponentShell(), AI prompts
    reference-analysis-types.ts         ComponentMatch interface, SiteAnalysis type
    analysis-schemas.ts                 Zod validation schemas

packages/
  themes/
    package.json                        react/next in wrong dependency section
    orion/
      index.ts                          Reference: correct DefaultConfig shape
      components/index.ts               Reference: correct barrel naming (OrionHeader/Footer)
    vega/
      index.ts                          Reference: correct DefaultConfig shape
      components/index.ts               Reference: correct barrel naming (VegaHeader/Footer)
  theme-system/src/types.ts             DeepPartialThemeConfig, ThemeConfig, TypographyScaleEntry

output/ingestion/lyra/
  site-analysis.json                    Example pipeline output showing bugs
  meta/findings-theme-package.md        Full TPV audit report
```

**ComponentMatch interface (current — broken):**

```typescript
// tools/lib/reference-analysis-types.ts:167-172
export interface ComponentMatch {
  componentName: string; // core component name e.g. "PageHero"
  importPath: string;
  matchConfidence: "exact" | "close" | "partial";
  adaptationNotes?: string;
}
```

**The broken Map reconstruction (scaffold-theme-package.ts:638-649):**

```typescript
for (const match of analysis.componentMatches) {
  for (const bp of analysis.sectionBlueprints) {
    if (bp.componentExportName === match.componentName || bp.name === match.componentName) {
      // This never matches because core names ≠ blueprint export names
      componentMatchMap.set(bp.id, { matchConfidence: match.matchConfidence });
    }
  }
}
```

**needsUseClient (theme-component-generator.ts:369-376):**

```typescript
export function needsUseClient(blueprint: SectionBlueprint, jsxBody: string): boolean {
  if (blueprint.interactionNeeds === "stateful") return true;
  if (blueprint.category === "Navigation") return true; // ← BUG: too broad
  const purpose = blueprint.purpose.toLowerCase();
  if (purpose.includes("form") || purpose.includes("newsletter")) return true;
  if (CLIENT_PATTERNS.test(jsxBody)) return true;
  return false;
}
```

**generateIndexTs surface tokens (scaffold-theme-package.ts:108-119):**

```typescript
// Only 3 surface fields always written; rest are conditional:
const surfaceEntries = [
  `background: "${tokens.surface.background}",`,
  `foreground: "${tokens.surface.foreground}",`,
  `muted: "${tokens.surface.muted}",`,
];
if (tokens.surface.card) surfaceEntries.push(...);
if (tokens.surface.mutedForeground) surfaceEntries.push(...);
// No semantic block. No overlay block. Never.
```

**typography.scale (scaffold-theme-package.ts:122-139):**

```typescript
let scaleBlock = "";
if (tokens.typography.scale) {
  // ← almost never true; no fallback
  // ...
}
```

### What a Good Plan Should Cover

1. For Bug 1: should the Navigation category rule be removed entirely, or replaced with a more precise rule? What's the risk to themes that currently work?

2. For Bug 2: where exactly in `generateIndexTs()` do the new blocks go? What are safe default values for `semantic` (universal web colours are fine), `overlay` (needs derivation from brand.primary), and the missing surface sub-fields? How to derive `overlay.primary` from a hex string?

3. For Bug 3: what are appropriate default `typography.scale` values? Should they match the theme-system defaults exactly, or use a different ramp? How does the `TypographyScaleEntry` type constrain the values?

4. For Bug 4: how should `generateComponentBarrel()` identify which component becomes `{ThemeName}Header` and which becomes `{ThemeName}Footer`? Multiple Nav/Footer blueprints may exist in a run. What if no unmatched Nav/Footer blueprint exists?

5. For Bug 5: the fix requires adding `blueprintId` to `ComponentMatch` — what are the serialisation concerns? Old `site-analysis.json` files won't have this field. How should the scaffold rebuild handle missing `blueprintId`?

6. Is there a simpler fix for Bug 5 that doesn't require changing the interface — for example, fixing the name-matching logic so it correctly identifies which blueprint ID corresponds to a matched component name?

7. What is the correct order of changes to minimise risk? Should Bug 6 (package.json) be done first since it's isolated?

8. Are there any tests in the codebase that cover these functions? Should tests be added, and if so, what's the minimal test coverage needed to gate these changes?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04/2026-04-26_fix-ingest-generator/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04/2026-04-26_fix-ingest-generator/`
