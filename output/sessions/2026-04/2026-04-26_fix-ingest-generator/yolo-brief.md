# YOLO Implementation Brief: Fix pipeline.ingest Theme Generator Bugs

**Branch:** feature/fix-ingest-generator (created from develop)
**Session spec:** output/sessions/2026-04/2026-04-26_fix-ingest-generator/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The `/pipeline.ingest` skill aborted at Phase B on 2026-04-25 when the generated `packages/themes/lyra/` failed TPV validation (Critical=2, High=3). All 5 findings trace back to bugs in the generator tools — not site-specific extraction failures — meaning every future pipeline run will fail the same way until fixed. This brief implements 6 targeted fixes across 7 files: removing a blanket `"use client"` rule for navigation components, always emitting required color categories and typography scale, adding theme-prefixed header/footer aliases to the barrel, fixing a broken blueprint ID lookup that causes ghost barrel entries, and correcting the `packages/themes/package.json` dependency section. The synthesis was reviewed and approved via dual-model peer review. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80 / $4             | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/fix-ingest-generator
pnpm type-check   # must be clean before starting
```

---

## Phase 0 — Baseline: add red tests before changing code

**Goal:** Write unit tests that assert correct post-fix behaviour. These tests will fail against the current code — confirming the bugs — and turn green as each subsequent phase is implemented.

**Model:** sonnet — requires understanding existing test patterns and the functions under test.

**Context to read first (parallel reads):**

Read these files simultaneously before writing anything:

- `tools/__tests__/theme-component-generator.test.ts` — existing `needsUseClient` tests, `makeBlueprint` helper
- `tools/__tests__/scaffold-integrity.test.ts` — source-pattern test pattern
- `tools/lib/theme-component-generator.ts` lines 355–380 — current `needsUseClient` implementation
- `tools/scaffold-theme-package.ts` lines 95–220 — current `generateIndexTs` and `generateComponentBarrel`
- `tools/__tests__/analysis-schemas.test.ts` — existing schema test pattern

**Tests to add:**

**1. `tools/__tests__/theme-component-generator.test.ts`** — append to the existing `needsUseClient` describe block:

```typescript
test("returns false for Navigation category with purely static JSX (Bug 1 fix)", () => {
  const bp = makeBlueprint({ category: "Navigation", interactionNeeds: "none" });
  const staticJsx = '  return <nav className="bg-surface-inverse py-4"><a href="/">Home</a></nav>;';
  expect(needsUseClient(bp, staticJsx)).toBe(false);
});

test("still returns true for Navigation category when JSX contains onClick", () => {
  const bp = makeBlueprint({ category: "Navigation", interactionNeeds: "none" });
  const interactiveJsx = "  return <nav><button onClick={() => setOpen(true)}>Menu</button></nav>;";
  expect(needsUseClient(bp, interactiveJsx)).toBe(true);
});
```

**2. `tools/__tests__/scaffold-integrity.test.ts`** — append a new describe block:

```typescript
describe("generateIndexTs completeness (TPV-006, TPV-009)", () => {
  test("always emits colors.semantic block (Bug 2 fix)", () => {
    expect(scaffoldSource).toMatch(/semantic:\s*\{/);
  });

  test("always emits colors.overlay block (Bug 2 fix)", () => {
    expect(scaffoldSource).toMatch(/overlay:\s*\{/);
  });

  test("defines DEFAULT_TYPOGRAPHY_SCALE constant with all 8 levels (Bug 3 fix)", () => {
    expect(scaffoldSource).toContain("DEFAULT_TYPOGRAPHY_SCALE");
    expect(scaffoldSource).toContain("hero:");
    expect(scaffoldSource).toContain("caption:");
  });

  test("typography scale uses ?? DEFAULT_TYPOGRAPHY_SCALE fallback (Bug 3 fix)", () => {
    expect(scaffoldSource).toContain("DEFAULT_TYPOGRAPHY_SCALE");
    expect(scaffoldSource).toMatch(/typography\.scale.*\?\?|tokens\.typography\.scale.*\?\?/);
  });
});

describe("generateComponentBarrel contract (TPV-002, Bug 5)", () => {
  test("generateComponentBarrel accepts themeName option (Bug 4 fix)", () => {
    // Verify the function signature accepts an options object
    expect(scaffoldSource).toMatch(/generateComponentBarrel\s*\([^)]*options/);
  });

  test("barrel emits theme-prefixed Header alias (Bug 4 fix)", () => {
    expect(scaffoldSource).toMatch(/Header.*from/);
    expect(scaffoldSource).toMatch(/pascal.*Header/);
  });

  test("blueprintId is used as primary key in map reconstruction (Bug 5 fix)", () => {
    expect(scaffoldSource).toContain("match.blueprintId");
  });
});
```

**Verification gate — STOP if this fails:**

```bash
# Run the tools test suite — these tests SHOULD FAIL before Phase 1 begins (that's correct)
cd tools && npx vitest run --reporter=verbose 2>&1 | tail -30
```

Confirm:

- The 2 new `needsUseClient` tests fail (navigation category still returns true)
- The scaffold-integrity tests fail (semantic/overlay/DEFAULT_TYPOGRAPHY_SCALE not yet in source)
- All pre-existing tests still pass

**Commit:**

```bash
git add tools/__tests__/theme-component-generator.test.ts tools/__tests__/scaffold-integrity.test.ts
git commit -m "$(cat <<'EOF'
test(generator): add red tests for TPV-002/003/006/009 generator bugs

Pre-fix baseline: these tests fail against current code confirming the
5 generator bugs (Navigation blanket client rule, missing semantic/overlay
colors, missing typography scale, missing barrel aliases, broken blueprintId
lookup). They turn green as each subsequent phase is implemented.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 1 — Static fix: `packages/themes/package.json` (Bug 6)

**Goal:** Move `react` and `next` from `dependencies` to `peerDependencies`.

**Model:** haiku — single-file mechanical edit.

**File:** `packages/themes/package.json`

Read the file first. Then rewrite `dependencies` and `peerDependencies` sections:

```json
{
  "peerDependencies": {
    "react": ">=19.0.0",
    "next": ">=15.0.0"
  },
  "dependencies": {
    "lucide-react": "^0.544.0"
  },
  "devDependencies": {
    "@types/react": "^19"
  }
}
```

Keep all other fields (`name`, `version`, `private`, `description`, `exports`) unchanged.

**Verification gate — STOP if this fails:**

```bash
pnpm install --lockfile-only
node -e "const p=require('./packages/themes/package.json'); const bad=Object.keys(p.dependencies||{}).filter(k=>k==='react'||k==='next'); if(bad.length) {console.error('FAIL: react/next still in dependencies:', bad); process.exit(1)}; console.log('PASS')"
```

**Commit:**

```bash
git add packages/themes/package.json
git commit -m "$(cat <<'EOF'
fix(themes): move react and next to peerDependencies (TPV-004)

Prevents pnpm from resolving a duplicate React instance for the themes
workspace, which caused invalid hook call errors when themes and sites
run different resolution paths.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Fix `needsUseClient()` blanket Navigation rule (Bug 1)

**Goal:** Remove the one line that marks every Navigation-category component as a client component unconditionally.

**Model:** haiku — single-line deletion.

**File:** `tools/lib/theme-component-generator.ts`

Read the file. Find the `needsUseClient` function (~line 369). Delete this line:

```typescript
if (blueprint.category === "Navigation") return true;
```

Do not change anything else in the function. The `CLIENT_PATTERNS` regex (line 358) already catches `onClick`, `onChange`, `useState`, `useEffect`, `RevealOnScroll`, `Carousel`, and all other interactive patterns — real nav components with interactivity will still become client components via that path.

**Verification gate — STOP if this fails:**

```bash
# Confirm line is gone
grep -n 'blueprint.category === "Navigation"' tools/lib/theme-component-generator.ts \
  && { echo "FAIL: line not removed"; exit 1; } || echo "PASS: line removed"

# Run the needsUseClient tests — the 2 new ones should now pass
cd tools && npx vitest run --reporter=verbose theme-component-generator 2>&1 | tail -20
```

**Commit:**

```bash
git add tools/lib/theme-component-generator.ts
git commit -m "$(cat <<'EOF'
fix(generator): remove blanket Navigation→client-component rule (TPV-003)

The Navigation category override forced every nav component to be "use client"
even when the generated JSX had no interactive hooks. CLIENT_PATTERNS already
catches useState/onClick/handlers, so static navs now correctly become Server
Components. Interactive navs are still client components via the regex path.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Fix `ComponentMatch` serialisation (Bug 5)

**Goal:** Preserve blueprint IDs through the serialise → reconstruct roundtrip so "reused from core" components are correctly excluded from the barrel.

**Model:** sonnet — cross-file interface change with downstream consumers.

**Step 3a+3b — Read both interface files simultaneously, then edit in parallel:**

Read simultaneously:

- `tools/lib/reference-analysis-types.ts` (find `ComponentMatch` interface, ~lines 167–172)
- `tools/lib/analysis-schemas.ts` (find `ComponentMatchSchema` or equivalent Zod schema)

Then edit both files (these are independent — no shared state):

**`tools/lib/reference-analysis-types.ts`** — add `blueprintId?: string` as the first field of `ComponentMatch`:

```typescript
export interface ComponentMatch {
  blueprintId?: string; // id of the SectionBlueprint; present in analyses generated after this fix
  componentName: string;
  importPath: string;
  matchConfidence: "exact" | "close" | "partial";
  adaptationNotes?: string;
}
```

**`tools/lib/analysis-schemas.ts`** — find the Zod schema for `ComponentMatch` (search for `matchConfidence` to locate it). Add `blueprintId: z.string().optional()` as the first field.

**Step 3c+3d — Read both files simultaneously, then edit in parallel:**

Read simultaneously:

- `tools/analyse-site.ts` (~lines 548–560, the componentMatches flatten loop)
- `tools/lib/component-matcher.ts` (find where `results.set(blueprint.id, {...})` is called)

Then edit both files:

**`tools/analyse-site.ts`** — replace the key-discarding loop:

```typescript
// Before:
for (const [, match] of componentMatchMap) {
  if (match) componentMatches.push(match);
}

// After:
for (const [blueprintId, match] of componentMatchMap) {
  if (match) componentMatches.push({ ...match, blueprintId });
}
```

**`tools/lib/component-matcher.ts`** — find the `results.set(blueprint.id, {...})` call and add `blueprintId: blueprint.id` to the object literal. This ensures IDs are present from creation, not only added at serialisation.

**Step 3e — Fix the Map reconstruction in `scaffoldThemePackage`:**

Read `tools/scaffold-theme-package.ts` lines 635–655.

Replace the inner loop inside the `componentMatchMap` rebuild:

```typescript
// Before (broken — core names ≠ blueprint export names):
for (const match of analysis.componentMatches) {
  for (const bp of analysis.sectionBlueprints) {
    if (bp.componentExportName === match.componentName || bp.name === match.componentName) {
      componentMatchMap.set(bp.id, { matchConfidence: match.matchConfidence });
    }
  }
}

// After:
for (const match of analysis.componentMatches) {
  if (match.blueprintId) {
    componentMatchMap.set(match.blueprintId, { matchConfidence: match.matchConfidence });
  }
  // No legacy fallback — the old name-match never worked anyway.
  // Old site-analysis.json files without blueprintId should be re-ingested.
}
```

**Verification gate — STOP if this fails:**

```bash
pnpm type-check

# Confirm blueprintId is in the interface
grep -n "blueprintId" tools/lib/reference-analysis-types.ts && echo "PASS: interface updated"
grep -n "blueprintId" tools/lib/analysis-schemas.ts && echo "PASS: schema updated"
grep -n "blueprintId" tools/analyse-site.ts && echo "PASS: analyse-site updated"
grep -n "blueprintId" tools/lib/component-matcher.ts && echo "PASS: matcher updated"
grep -n "match.blueprintId" tools/scaffold-theme-package.ts && echo "PASS: scaffold updated"
```

**Commit:**

```bash
git add tools/lib/reference-analysis-types.ts tools/lib/analysis-schemas.ts \
        tools/analyse-site.ts tools/lib/component-matcher.ts tools/scaffold-theme-package.ts
git commit -m "$(cat <<'EOF'
fix(generator): preserve blueprintId through ComponentMatch serialisation (Bug 5)

The in-memory Map<blueprintId, ComponentMatch> was flattened to an array
discarding the key. scaffoldThemePackage then tried to rebuild the Map by
matching core component names against blueprint export names — which are always
different. This caused ghost barrel entries for 3 core-reused components.

Fix: serialise blueprintId into the array; use it directly for reconstruction.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Fix `generateIndexTs()` completeness (Bugs 2 + 3)

**Goal:** Always emit `colors.semantic`, `colors.overlay`, required surface sub-fields, and all 8 typography scale levels — with safe defaults when extraction didn't find them.

**Model:** sonnet — substantial edits to one file, requires careful template string construction.

**File:** `tools/scaffold-theme-package.ts`

Read the full file before editing. Make all of the following changes:

**Step 4a — Add helpers above `generateIndexTs()` (around line 99):**

```typescript
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const DEFAULT_TYPOGRAPHY_SCALE = {
  hero: { size: "4rem", lineHeight: "1.1", letterSpacing: "-0.02em", weight: 800 },
  h1: { size: "3rem", lineHeight: "1.15", letterSpacing: "-0.015em", weight: 700 },
  h2: { size: "2.25rem", lineHeight: "1.2", letterSpacing: "-0.01em", weight: 700 },
  h3: { size: "1.875rem", lineHeight: "1.25", letterSpacing: "-0.005em", weight: 600 },
  h4: { size: "1.5rem", lineHeight: "1.3", letterSpacing: "0", weight: 600 },
  body: { size: "1rem", lineHeight: "1.6", letterSpacing: "0", weight: 400 },
  small: { size: "0.875rem", lineHeight: "1.5", letterSpacing: "0", weight: 400 },
  caption: { size: "0.75rem", lineHeight: "1.5", letterSpacing: "0.01em", weight: 400 },
} as const;
```

**Step 4b — Surface sub-fields: replace lines 114–119 (the conditional pushes) with always-emitted fallbacks:**

```typescript
surfaceEntries.push(`      card: "${tokens.surface.card ?? tokens.surface.background}",`);
surfaceEntries.push(`      cardBorder: "${tokens.surface.cardBorder ?? "#e5e7eb"}",`);
surfaceEntries.push(`      mutedForeground: "${tokens.surface.mutedForeground ?? "#6b7280"}",`);
surfaceEntries.push(`      subtle: "${tokens.surface.subtle ?? tokens.surface.muted}",`);
surfaceEntries.push(`      inverse: "${tokens.surface.inverse ?? tokens.surface.foreground}",`);
if (tokens.surface.secondaryForeground) {
  surfaceEntries.push(`      secondaryForeground: "${tokens.surface.secondaryForeground}",`);
}
```

**Step 4c — Compute overlay.primary before the return statement:**

```typescript
const overlayPrimary = /^#[0-9a-fA-F]{6}$/.test(tokens.brand.primary)
  ? hexToRgba(tokens.brand.primary, 0.8)
  : "rgba(0,0,0,0.6)";
```

**Step 4d — Add `semantic` and `overlay` blocks to the template string** (inside the `colors:` block, after the `surface` block):

```
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error:   '#ef4444',
      info:    '#3b82f6',
    },
    overlay: {
      dark:    'rgba(0,0,0,0.8)',
      light:   'rgba(255,255,255,0.8)',
      primary: '${overlayPrimary}',
    },
```

Note: `${overlayPrimary}` is a JavaScript template literal interpolation — the variable is computed above the return statement.

**Step 4e — Replace the conditional `scaleBlock` logic (lines 122–139) with always-emitted scale:**

```typescript
const resolvedScale = tokens.typography.scale ?? DEFAULT_TYPOGRAPHY_SCALE;
const scaleEntries: string[] = [];
for (const [key, entry] of Object.entries(resolvedScale)) {
  if (!entry) continue;
  const fields: string[] = [];
  if (entry.size) fields.push(`size: "${entry.size}"`);
  if (entry.lineHeight) fields.push(`lineHeight: "${entry.lineHeight}"`);
  if (entry.letterSpacing) fields.push(`letterSpacing: "${entry.letterSpacing}"`);
  if (entry.weight) fields.push(`weight: ${entry.weight}`);
  if (fields.length > 0) scaleEntries.push(`      ${key}: { ${fields.join(", ")} },`);
}
const scaleBlock = `\n    scale: {\n${scaleEntries.join("\n")}\n    },`;
```

**Verification gate — STOP if this fails:**

```bash
pnpm type-check

# Run the scaffold-integrity tests — the new semantic/overlay/scale tests should now pass
cd tools && npx vitest run --reporter=verbose scaffold-integrity 2>&1 | tail -30

# Spot-check: generate a mini index.ts from the lyra analysis
node -e "
const ts = require('./tools/scaffold-theme-package.ts');
" 2>&1 | head -5 || echo "(tsx required for direct import — type-check sufficient)"
```

**Commit:**

```bash
git add tools/scaffold-theme-package.ts
git commit -m "$(cat <<'EOF'
fix(generator): always emit semantic, overlay, surface sub-fields and typography scale (TPV-006, TPV-009)

generateIndexTs previously wrote semantic/overlay blocks never, and
typography.scale only when the extraction pipeline provided values (rare).
Add DEFAULT_TYPOGRAPHY_SCALE constant and hexToRgba helper; always emit
all required color categories and all 8 typography scale levels using
safe fallbacks when extraction did not populate them.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — Fix barrel naming convention (Bug 4)

**Goal:** Add `{ThemeName}Header` / `{ThemeName}Footer` alias exports and their prop types to every generated `components/index.ts` barrel.

**Model:** sonnet — logic change to an existing function, needs careful candidate selection.

**File:** `tools/scaffold-theme-package.ts`

Read the file again (it has changed from Phase 4). Locate `generateComponentBarrel` (~line 332).

**Step 5a — Change signature to options object** (preserves positional safety for existing callers):

```typescript
function generateComponentBarrel(
  analysis: ReferenceAnalysis | SiteAnalysis,
  options?: { themeName?: string },
  componentMatches?: Map<string, { matchConfidence: string }>,
): string {
```

**Step 5b — Update the single call site** (~line 658, inside `scaffoldThemePackage`):

```typescript
[path.join(themeDir, 'components', 'index.ts'), generateComponentBarrel(analysis, { themeName: name }, componentMatchMap)],
```

**Step 5c — Append alias logic** at the end of `generateComponentBarrel`, before `return lines.join('\n')`:

```typescript
if (options?.themeName) {
  const pascal = toPascalCase(options.themeName);

  let primaryNavBp: (typeof analysis.sectionBlueprints)[number] | undefined;
  let primaryFooterBp: (typeof analysis.sectionBlueprints)[number] | undefined;

  for (const bp of analysis.sectionBlueprints) {
    const conf = componentMatches?.get(bp.id)?.matchConfidence;
    const isMatched = conf === "exact" || conf === "close";
    if (!isMatched && bp.category === "Navigation") {
      const fn = bp.componentFileName.toLowerCase();
      const pur = bp.purpose.toLowerCase();
      const isMainNav =
        fn.includes("site-header") ||
        fn.includes("primary-nav") ||
        pur.includes("primary") ||
        pur.includes("sticky");
      if (isMainNav && !primaryNavBp) primaryNavBp = bp;
      else if (!primaryNavBp) primaryNavBp = bp;
    }
    if (!isMatched && bp.category === "Footer" && !primaryFooterBp) {
      primaryFooterBp = bp;
    }
  }

  if (primaryNavBp || primaryFooterBp) {
    lines.push("");
    lines.push("// Theme contract aliases (TPV-002)");
  }
  if (primaryNavBp) {
    const file = primaryNavBp.componentFileName.replace(".tsx", "");
    lines.push(
      `export { ${primaryNavBp.componentExportName} as ${pascal}Header } from './${file}';`
    );
    lines.push(
      `export type { ${primaryNavBp.componentExportName}Props as ${pascal}HeaderProps } from './${file}';`
    );
  }
  if (primaryFooterBp) {
    const file = primaryFooterBp.componentFileName.replace(".tsx", "");
    lines.push(
      `export { ${primaryFooterBp.componentExportName} as ${pascal}Footer } from './${file}';`
    );
    lines.push(
      `export type { ${primaryFooterBp.componentExportName}Props as ${pascal}FooterProps } from './${file}';`
    );
  }
}
```

**Verification gate — STOP if this fails:**

```bash
pnpm type-check

# Run scaffold-integrity — the barrel alias and themeName option tests should now pass
cd tools && npx vitest run --reporter=verbose scaffold-integrity 2>&1 | tail -30

# Run full tools test suite — all tests should now pass
cd tools && npx vitest run --reporter=verbose 2>&1 | tail -20
```

**Commit:**

```bash
git add tools/scaffold-theme-package.ts
git commit -m "$(cat <<'EOF'
fix(generator): add {ThemeName}Header/{ThemeName}Footer barrel aliases (TPV-002)

generateComponentBarrel now accepts { themeName } option and appends
canonical Header/Footer alias exports at the end of the barrel. Primary nav
candidate prefers 'site-header'/'primary-nav' filenames over other Navigation
blueprints. Aliases include prop type re-exports required by TPV-002.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6 — End-to-end verification

**Goal:** Confirm type-check passes, existing themes are unaffected, and the full test suite is green.

**Model:** sonnet — orchestrating verification commands and interpreting results.

**Step 6a — Full type-check and test suite:**

```bash
# Verification gate — STOP if this fails
pnpm type-check
cd tools && npx vitest run --reporter=verbose 2>&1 | tail -40
```

All tests must pass. If any pre-existing test regresses, investigate before continuing.

**Step 6b — Smoke check existing themes are untouched:**

```bash
# No lyra-specific changes should bleed into orion/vega
grep -r "LyraHeader\|LyraFooter" packages/themes/orion packages/themes/vega 2>/dev/null \
  && echo "WARN: existing themes affected" || echo "PASS: existing themes clean"

# Existing themes should still import cleanly
node -e "
const orion = require('./packages/themes/orion/index.ts');
console.log('PASS: orion imports ok');
" 2>/dev/null || echo "(tsx required — type-check sufficient)"
```

**Step 6c — Full build and lint:**

```bash
# Verification gate — STOP if any fails
pnpm type-check
pnpm build
pnpm pipeline:smoke
```

`pnpm build` runs all sites — this confirms nothing in the theme changes broke downstream consumers. Note: build takes several minutes.

**Commit:**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore(generator): verify all generator fixes pass type-check, build, and pipeline smoke

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)" 2>/dev/null || echo "nothing to commit — verification only"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                            | File overlap      | Model  | Rationale                                                   |
| ----- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------ | ----------------------------------------------------------- |
| G1    | Phase 0 | Read: `theme-component-generator.test.ts`, `scaffold-integrity.test.ts`, `theme-component-generator.ts`, `scaffold-theme-package.ts`, `analysis-schemas.test.ts` | none (reads only) | n/a    | 5 independent reads — batch in one message                  |
| G2    | Phase 3 | Read: `reference-analysis-types.ts`, `analysis-schemas.ts`                                                                                                       | none (reads only) | n/a    | Independent reads before 3a+3b edits                        |
| G3    | Phase 3 | Edit `reference-analysis-types.ts` (Step 3a) + Edit `analysis-schemas.ts` (Step 3b)                                                                              | none              | sonnet | No shared state; interface and schema are independent files |
| G4    | Phase 3 | Read: `analyse-site.ts`, `component-matcher.ts`                                                                                                                  | none (reads only) | n/a    | Independent reads before 3c+3d edits                        |
| G5    | Phase 3 | Edit `analyse-site.ts` (Step 3c) + Edit `component-matcher.ts` (Step 3d)                                                                                         | none              | sonnet | Different files, no ordering dependency between the two     |

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                   | Reason                                                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Phase 3 Step 3e must follow G3 and G5  | Step 3e edits `scaffold-theme-package.ts` and uses the `blueprintId` interface added in Step 3a              |
| Phase 4 must follow Phase 3            | Both touch `scaffold-theme-package.ts`; Phase 3 Step 3e must be committed before Phase 4 edits the same file |
| Phase 5 must follow Phase 4            | Phase 5 edits `scaffold-theme-package.ts` again; must read Phase 4's version first                           |
| Verification gates between every phase | Each phase's output gates the next. `pnpm type-check` is the synchronisation barrier.                        |
| `pnpm build` runs alone                | Writes to `.next/` and `dist/` — concurrent builds corrupt caches                                            |
| Git commits                            | One commit per phase, in order                                                                               |

---

## Cost Estimate

| Phase                          | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------ | ------ | ----------------- | ------------------ | ---------- |
| Phase 0: Write red tests       | sonnet | ~20k              | ~2k                | ~$0.09     |
| Phase 1: package.json fix      | haiku  | ~5k               | ~0.2k              | ~$0.005    |
| Phase 2: needsUseClient fix    | haiku  | ~8k               | ~0.1k              | ~$0.006    |
| Phase 3: blueprintId roundtrip | sonnet | ~30k              | ~3k                | ~$0.14     |
| Phase 4: generateIndexTs fixes | sonnet | ~20k              | ~4k                | ~$0.12     |
| Phase 5: barrel aliases        | sonnet | ~20k              | ~3k                | ~$0.11     |
| Phase 6: verification          | sonnet | ~12k              | ~1k                | ~$0.05     |
| **Total**                      |        | **~115k**         | **~13k**           | **~$0.52** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm all three pass: `pnpm type-check && pnpm build && pnpm pipeline:smoke`
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Compare to the Cost Estimate above (~$0.52). For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-26_fix-ingest-generator/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.** The groups block is the authoritative execution plan.
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used: `Claude Sonnet 4.6 <noreply@anthropic.com>`
- Every brief MUST verify with all three of: `pnpm type-check`, `pnpm build`, and `pnpm pipeline:smoke`. STOP if any fails.
