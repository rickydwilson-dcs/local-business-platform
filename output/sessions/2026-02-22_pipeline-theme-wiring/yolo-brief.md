# YOLO Implementation Brief: Pipeline Theme Wiring Fix

**Branch:** feature/pipeline-theme-wiring (created from develop)
**Session spec:** output/sessions/2026-02-22_pipeline-theme-wiring/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error

---

## Context

The ingestion pipeline generates theme packages and test sites, but test sites always render with Vega's identity instead of their new theme. The root cause is two gaps: (1) `generateIndexTs()` in scaffold-theme-package.ts doesn't emit a `ComponentRegistry` export, and (2) the pipeline instruction never updates `layout.tsx` after copying from base-template. This was confirmed via dual-model peer review (Claude + Codex) and the synthesis approved Claude's targeted 8-file fix approach.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/pipeline-theme-wiring   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Fix the scaffold tool (root cause)

**Goal:** Make `generateIndexTs()` emit a `ComponentRegistry` export so all future pipeline-generated themes have proper registries.

**File:** `tools/scaffold-theme-package.ts`

### Steps

1. Read `tools/scaffold-theme-package.ts` in full.

2. Add a module-level `REGISTRY_PRESETS` constant **above** the `generateIndexTs()` function (around line 70). Import the `ComponentRegistry` type at the top of the file from the types file (use a local interface or import from the analysis types — do NOT add a runtime import from `@platform/theme-system` since this is a tooling file, not a site file). Define the presets:

   ```typescript
   /** Registry variant presets — one per base theme. Update when adding a new base theme. */
   interface RegistryPreset {
     heroVariant: string;
     headerVariant: string;
     cardVariant: string;
     sectionVariant: string;
   }

   const REGISTRY_PRESETS: Record<string, RegistryPreset> = {
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

3. In `generateIndexTs()`, after the existing variable declarations (line ~76), resolve the registry preset:

   ```typescript
   const baseTheme = analysis.registryRecommendation?.themeName ?? "vega";
   const preset = REGISTRY_PRESETS[baseTheme] ?? REGISTRY_PRESETS.vega;
   ```

4. In the generated output template string (the `return` statement starting at line ~150):
   - Change the import line from:
     ```
     import type { DeepPartialThemeConfig } from "@platform/theme-system";
     ```
     to:
     ```
     import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
     ```
   - Insert the registry export **before** the `${camel}DefaultConfig` export:
     ```
     export const ${camel}Registry: ComponentRegistry = {
       theme: "${name}",
       heroVariant: "${preset.heroVariant}",
       headerVariant: "${preset.headerVariant}",
       cardVariant: "${preset.cardVariant}",
       sectionVariant: "${preset.sectionVariant}",
     };

     ```

### Verification gate — STOP if this fails
```bash
pnpm type-check
```

### Commit
```bash
git add tools/scaffold-theme-package.ts
git commit -m "$(cat <<'EOF'
fix: add ComponentRegistry export to scaffold theme generator

generateIndexTs() now emits a ComponentRegistry export derived from the
analysis registryRecommendation, so pipeline-generated themes get proper
registries instead of falling back to vega.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Fix existing theme packages

**Goal:** Add `ComponentRegistry` exports to lyra and atlas theme packages that were generated before the scaffold fix.

**Files (edit in parallel):**
- `packages/themes/lyra/index.ts`
- `packages/themes/atlas/index.ts`

### Steps

1. Read both files in parallel.

2. For **lyra** (`packages/themes/lyra/index.ts`):
   - Change `import type { DeepPartialThemeConfig }` to `import type { ComponentRegistry, DeepPartialThemeConfig }`
   - Add the registry export after the import block, before `lyraDefaultConfig`:
     ```typescript
     export const lyraRegistry: ComponentRegistry = {
       theme: "lyra",
       heroVariant: "split",
       headerVariant: "light",
       cardVariant: "standard",
       sectionVariant: "standard",
     };
     ```

3. For **atlas** (`packages/themes/atlas/index.ts`):
   - Change `import type { DeepPartialThemeConfig }` to `import type { ComponentRegistry, DeepPartialThemeConfig }`
   - Add the registry export after the import block, before `atlasDefaultConfig`:
     ```typescript
     export const atlasRegistry: ComponentRegistry = {
       theme: "atlas",
       heroVariant: "split",
       headerVariant: "light",
       cardVariant: "standard",
       sectionVariant: "standard",
     };
     ```

### Verification gate — STOP if this fails
```bash
pnpm type-check
```

### Commit
```bash
git add packages/themes/lyra/index.ts packages/themes/atlas/index.ts
git commit -m "$(cat <<'EOF'
fix: add ComponentRegistry exports to lyra and atlas themes

Both theme packages now export their own registry (vega-derived variants)
so test sites can import the registry directly instead of falling back
to vegaRegistry.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Update pipeline instruction

**Goal:** Update the `/pipeline.ingest` skill so future pipeline runs wire test sites correctly.

**File:** `.claude/commands/pipeline.ingest.md`

### Steps

1. Read `.claude/commands/pipeline.ingest.md` in full.

2. **Simplify Step 5a** — Replace the entire orion/vega branching block (the two code blocks for "For orion recommendation" and "For vega recommendation") with a single template that imports from the theme's own package:

   ```markdown
   **5a.** Rewrite `sites/test-<theme-name>/theme.config.ts`:

   First, read `packages/themes/<theme-name>/index.ts` to find the exported Registry and DefaultConfig variable names (e.g. `lyraRegistry` and `lyraDefaultConfig`).

   Then write:

   ```typescript
   import type { DeepPartialThemeConfig } from '@platform/theme-system';
   import { <camelCaseThemeName>Registry, <camelCaseThemeName>DefaultConfig } from '@platform/themes/<theme-name>';

   /**
    * Test site theme configuration
    * Generated by /pipeline.ingest
    */
   export const themeConfig: DeepPartialThemeConfig = {
     componentRegistry: <camelCaseThemeName>Registry,
     ...<camelCaseThemeName>DefaultConfig,
   };
   ```

   Where `<camelCaseThemeName>` is the theme name in camelCase (e.g., `lyra` → `lyra`, `dark-forest` → `darkForest`).
   ```

   Remove the paragraph about determining which registry to use from `site-analysis.json` (Step 5a currently reads the `registryRecommendation` — this is no longer needed since the theme package itself now contains the correct registry).

3. **Add Step 5e** after Step 5d:

   ```markdown
   **5e.** Update `sites/test-<theme-name>/app/layout.tsx`:

   1. Replace the theme registry import. Find:
      ```typescript
      import { vegaRegistry } from '@platform/themes/vega';
      ```
      (or `orionRegistry` from `@platform/themes/orion`)
      Replace with:
      ```typescript
      import { <camelCaseThemeName>Registry } from '@platform/themes/<theme-name>';
      ```

   2. Update the ThemeProvider props. Find:
      ```typescript
      <ThemeProvider theme="vega" registry={vegaRegistry}>
      ```
      (or `theme="orion"` / `registry={orionRegistry}`)
      Replace with:
      ```typescript
      <ThemeProvider theme="<theme-name>" registry={<camelCaseThemeName>Registry}>
      ```

   3. Update the SiteHeader appearance prop:
      - Read `packages/themes/<theme-name>/index.ts` and check the registry's `headerVariant` value
      - If `headerVariant` is `"dark"`, set `appearance="dark"`
      - If `headerVariant` is `"light"` (or any other value), set `appearance="light"`
   ```

### Verification gate
Re-read `.claude/commands/pipeline.ingest.md` and confirm Step 5a has a single template (no orion/vega branching) and Step 5e exists with all three sub-steps.

### Commit
```bash
git add .claude/commands/pipeline.ingest.md
git commit -m "$(cat <<'EOF'
fix: update pipeline.ingest to wire layout.tsx and use theme's own registry

Step 5a simplified: theme.config.ts now imports from the theme's own
package instead of vega/orion. Step 5e added: rewrites layout.tsx to
use the correct registry import, ThemeProvider props, and SiteHeader
appearance.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Fix existing test sites

**Goal:** Rewire test-lyra and test-atlas to use their own theme registries.

**Files (edit in parallel):**
- `sites/test-lyra/theme.config.ts`
- `sites/test-lyra/app/layout.tsx`
- `sites/test-atlas/theme.config.ts`
- `sites/test-atlas/app/layout.tsx`

### Steps

1. Read all four files in parallel.

2. **test-lyra/theme.config.ts** — Replace contents with:
   ```typescript
   import type { DeepPartialThemeConfig } from '@platform/theme-system';
   import { lyraRegistry, lyraDefaultConfig } from '@platform/themes/lyra';

   /**
    * Test site theme configuration
    * Generated by /pipeline.ingest
    */
   export const themeConfig: DeepPartialThemeConfig = {
     componentRegistry: lyraRegistry,
     ...lyraDefaultConfig,
   };
   ```

3. **test-lyra/app/layout.tsx** — Make three targeted edits:
   - Replace `import { vegaRegistry } from '@platform/themes/vega';` with `import { lyraRegistry } from '@platform/themes/lyra';`
   - Replace `<ThemeProvider theme="vega" registry={vegaRegistry}>` with `<ThemeProvider theme="lyra" registry={lyraRegistry}>`
   - Keep `appearance="light"` (lyra is vega-derived)

4. **test-atlas/theme.config.ts** — Replace contents with:
   ```typescript
   import type { DeepPartialThemeConfig } from '@platform/theme-system';
   import { atlasRegistry, atlasDefaultConfig } from '@platform/themes/atlas';

   /**
    * Test site theme configuration
    * Generated by /pipeline.ingest
    */
   export const themeConfig: DeepPartialThemeConfig = {
     componentRegistry: atlasRegistry,
     ...atlasDefaultConfig,
   };
   ```

5. **test-atlas/app/layout.tsx** — Make three targeted edits:
   - Replace `import { vegaRegistry } from '@platform/themes/vega';` with `import { atlasRegistry } from '@platform/themes/atlas';`
   - Replace `<ThemeProvider theme="vega" registry={vegaRegistry}>` with `<ThemeProvider theme="atlas" registry={atlasRegistry}>`
   - Keep `appearance="light"` (atlas is vega-derived)

### Verification gate — STOP if this fails
```bash
pnpm type-check
```

### Commit
```bash
git add sites/test-lyra/theme.config.ts sites/test-lyra/app/layout.tsx sites/test-atlas/theme.config.ts sites/test-atlas/app/layout.tsx
git commit -m "$(cat <<'EOF'
fix: wire test-lyra and test-atlas to their own theme registries

Both test sites now import their theme's own registry instead of
vegaRegistry, and ThemeProvider receives the correct theme name.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Verify end-to-end

**Goal:** Confirm the full monorepo builds and the theme wiring is correct.

### Steps

1. Run full type-check:
   ```bash
   pnpm type-check
   ```

2. Verify no remaining vega references in the test sites:
   ```bash
   grep -r "vegaRegistry" sites/test-lyra/ sites/test-atlas/ || echo "CLEAN — no vegaRegistry references"
   grep -r 'theme="vega"' sites/test-lyra/ sites/test-atlas/ || echo "CLEAN — no theme=vega references"
   ```

3. Verify the theme packages export registries:
   ```bash
   grep "Registry: ComponentRegistry" packages/themes/lyra/index.ts packages/themes/atlas/index.ts
   ```

4. Verify the scaffold tool generates registry exports (dry check — just confirm the REGISTRY_PRESETS constant exists):
   ```bash
   grep "REGISTRY_PRESETS" tools/scaffold-theme-package.ts
   ```

---

## Final Report

After all phases complete, output:
1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Verification grep results (no vega references in test sites, registries present in theme packages)
4. Any exceptions or intentional deviations from the plan

---

## Update Session File

After completing all phases, append to `output/sessions/2026-02-22_pipeline-theme-wiring/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-02-22
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits
[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Parallel reads and independent file edits should be done concurrently
- Minimal changes only — implement what the plan says, nothing more

---

## Completed

**Date:** 2026-02-22
**Status:** All phases executed successfully

All five phases implemented cleanly with no surprises. The scaffold tool now generates a `ComponentRegistry` export derived from the analysis `registryRecommendation`, both existing theme packages (lyra, atlas) received matching registry exports, the pipeline instruction was simplified to use each theme's own registry (eliminating the orion/vega branching) and gained a new Step 5e for layout.tsx wiring, and both test sites were rewired to import from their own theme packages. All verification gates passed on first attempt — `pnpm type-check` clean throughout, zero remaining `vegaRegistry` or `theme="vega"` references in test sites.

### Commits
- `9e659f1` fix: add ComponentRegistry export to scaffold theme generator
- `9c25099` fix: add ComponentRegistry exports to lyra and atlas themes
- `6957f45` fix: update pipeline.ingest to wire layout.tsx and use theme's own registry
- `30b9539` fix: wire test-lyra and test-atlas to their own theme registries
