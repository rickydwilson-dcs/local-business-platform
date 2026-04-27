# Implementation Plan: Fix pipeline.ingest Theme Generator Bugs

**Date:** 2026-04-26
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect                              | Claude                                                            | Codex                                                                                  | Decision                                                                                                                            |
| ----------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Testing phase                       | Verification gates only, no upfront test writing                  | Full Phase 0: write tests before touching code                                         | **Codex wins** — add targeted unit tests before changes; they're cheap to write against pure functions and catch regressions        |
| `generateComponentBarrel` signature | Positional: `generateComponentBarrel(name, analysis, matches)`    | Options object: `generateComponentBarrel(analysis, options?, matches?)`                | **Codex wins** — options object is safer for a function with multiple callers; positional param insertion is a latent breakage risk |
| Zod schema update                   | Not mentioned                                                     | Update `analysis-schemas.ts` to accept optional `blueprintId`                          | **Codex wins** — the serialised match objects pass through Zod validation; missing field update would cause silent drops            |
| `hexToRgba` edge case               | Explicit guard for non-6-digit hex, fallback to `rgba(0,0,0,0.6)` | "parse hex, keep deterministic, fallback to safe default" — same intent, less specific | **Claude wins** — the regex guard `^#[0-9a-fA-F]{6}$` is concrete; use it                                                           |
| Existing-theme regression check     | Implicit (type-check covers it)                                   | Explicit smoke check of orion/vega/cygnus/solaris                                      | **Codex wins** — worth an explicit step given the barrel and needsUseClient changes                                                 |

## Blind Spots Caught

- **Codex caught (Claude missed):** `tools/lib/analysis-schemas.ts` contains the Zod schema for `ComponentMatch`. If `blueprintId` is added to the interface but not the Zod schema, the field is silently stripped on validation. Must update both.
- **Codex caught (Claude missed):** Positional parameter insertion into `generateComponentBarrel` is brittle. Any call site that passes the `Map` as second arg (e.g., for standalone scaffold invocations) would break silently. Options object is the right pattern.
- **Codex caught (Claude missed):** Write tests against the pure generator functions _before_ changing them. These functions are deterministic and pure — unit tests are cheap, and they'll catch future regressions from the next pipeline run that reveals a new site's edge cases.
- **Claude caught (Codex missed):** `hexToRgba` needs an explicit format guard. A site whose CSS uses shorthand hex (`#aaa`) or already-computed `rgba(...)` as the brand primary would produce `rgba(NaN,NaN,NaN,0.8)`. The regex guard prevents silent bad output.
- **Claude caught (Codex missed):** `component-matcher.ts` (where `ComponentMatch` objects are created) also needs `blueprintId: blueprint.id` added — not just the serialisation and reconstruction ends.

---

## Implementation Plan

### Phase 0 — Baseline & unit tests (write before touching code)

**Goal:** Establish red tests that confirm the bugs, so we know when they're fixed and guard against future regression.

Files: `tools/**/__tests__/` (or wherever the existing test harness lives — check with `find tools -name '*.test.ts' -o -name '*.spec.ts'`)

Write minimal unit tests covering:

1. **`needsUseClient()`** — assert that a Navigation-category blueprint with a static JSX body (no hooks) returns `false` after the fix. Assert it still returns `true` when JSX contains `onClick` or `useState`.
2. **`generateIndexTs()`** — given a minimal `SiteAnalysis` with no `semantic`/`overlay`/`scale` in tokens, assert the output string contains `semantic:`, `overlay:`, and `scale:`.
3. **`generateComponentBarrel()`** — given analysis with 1 close-matched and 2 unmatched blueprints, assert the matched one is absent from the barrel, and the barrel contains `{ThemeName}Header` and `{ThemeName}Footer` aliases.
4. **`scaffoldThemePackage` Map reconstruction** — given a `componentMatches` array with `blueprintId` set, assert the rebuilt Map keys match the blueprint IDs.

**Verification gate:** `pnpm test` (or equivalent in `tools/`) runs — tests fail for the current bugs, pass after each fix.

---

### Phase 1 — One-time static fix (Bug 6)

**File:** `packages/themes/package.json`

Move `react` and `next` from `dependencies` to `peerDependencies`. Use ranges:

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

**Verification gate:** `pnpm install --lockfile-only` succeeds. `pnpm type-check` unchanged.

---

### Phase 2 — Fix `needsUseClient()` (Bug 1)

**File:** `tools/lib/theme-component-generator.ts:371`

Delete one line:

```typescript
if (blueprint.category === "Navigation") return true;
```

The existing `CLIENT_PATTERNS` regex (line 358) catches `onClick`, `onChange`, `useState`, `useEffect`, `useRef`, `RevealOnScroll`, `Carousel` etc. Real interactive navs are covered. Static navs and announcement bars become Server Components as intended.

**Verification gate:** Phase 0 unit test for `needsUseClient()` goes green.

---

### Phase 3 — Fix `ComponentMatch` serialisation (Bug 5)

**Step 3a — Add `blueprintId` to the interface**

**File:** `tools/lib/reference-analysis-types.ts` — `ComponentMatch` interface

```typescript
export interface ComponentMatch {
  blueprintId?: string; // optional: present in analyses generated after this fix
  componentName: string;
  importPath: string;
  matchConfidence: "exact" | "close" | "partial";
  adaptationNotes?: string;
}
```

Optional (`?`) for backward compatibility with existing `site-analysis.json` files.

**Step 3b — Update Zod schema**

**File:** `tools/lib/analysis-schemas.ts` — `ComponentMatchSchema` (or equivalent)

Add `blueprintId: z.string().optional()` to the schema so the field is not silently stripped on validation.

**Step 3c — Preserve the ID when flattening in `analyse-site.ts`**

**File:** `tools/analyse-site.ts` (~line 555)

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

**Step 3d — Add `blueprintId` at match creation**

**File:** `tools/lib/component-matcher.ts` — where `results.set(blueprint.id, {...})` is called

Add `blueprintId: blueprint.id` to the match object literal so the ID is present from creation, not only added at serialisation time.

**Step 3e — Fix the Map reconstruction in `scaffoldThemePackage`**

**File:** `tools/scaffold-theme-package.ts` — lines 638–650

```typescript
// Before (broken — core name ≠ blueprint export name):
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
    // Primary path: direct ID lookup (new analyses)
    componentMatchMap.set(match.blueprintId, { matchConfidence: match.matchConfidence });
  }
  // Legacy fallback omitted intentionally — prefer false-negative (ghost export)
  // over false-positive (excluding a component that shouldn't be excluded).
  // Old site-analysis.json files can be re-ingested to get the fix.
}
```

**Why omit legacy fallback:** The broken name-matching never worked anyway. Keeping it risks misidentifying blueprints. A ghost export causes a TS build error that's immediately visible; a wrongly-excluded component is a silent feature gap. Fail loud over fail silent.

**Verification gate:** Phase 0 Map reconstruction test goes green. For lyra specifically: barrel no longer contains `hero-blog-centered`, `hero-centered-light`, or `navigation`.

---

### Phase 4 — Fix `generateIndexTs()` completeness (Bugs 2 + 3)

**File:** `tools/scaffold-theme-package.ts`

**Step 4a — Add helpers above `generateIndexTs()`**

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

**Step 4b — Surface sub-fields always emitted** (replace lines 114–119)

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

**Step 4c — Always emit `semantic` and `overlay` in the template**

Derive `overlay.primary` from `brand.primary` with a format guard:

```typescript
const overlayPrimary = /^#[0-9a-fA-F]{6}$/.test(tokens.brand.primary)
  ? hexToRgba(tokens.brand.primary, 0.8)
  : "rgba(0,0,0,0.6)";
```

Add to the `colors` block in the returned template string (after `surface`, before closing `}`):

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

**Step 4d — Always emit `typography.scale`** (replace lines 122–139)

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

**Verification gate:** Phase 0 `generateIndexTs()` test goes green. TypeScript compiles the generated `index.ts` output without errors.

---

### Phase 5 — Fix barrel naming convention (Bug 4)

**File:** `tools/scaffold-theme-package.ts` — `generateComponentBarrel()`

**Step 5a — Change to options-object signature** (safer for callers)

```typescript
function generateComponentBarrel(
  analysis: ReferenceAnalysis | SiteAnalysis,
  options?: { themeName?: string },
  componentMatches?: Map<string, { matchConfidence: string }>,
): string {
```

Update the single call site at line 658:

```typescript
generateComponentBarrel(analysis, { themeName: name }, componentMatchMap);
```

**Step 5b — Append theme-contract aliases after the main loop**

```typescript
if (options?.themeName) {
  const pascal = toPascalCase(options.themeName);

  // Header candidate: prefer explicit 'header'/'primary nav' in name/purpose,
  // fall back to first unmatched Navigation blueprint
  let primaryNavBp: SectionBlueprint | undefined;
  let primaryFooterBp: SectionBlueprint | undefined;

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
      if (isMainNav && !primaryNavBp) {
        primaryNavBp = bp;
      } else if (!primaryNavBp) {
        primaryNavBp = bp;
      }
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

**Verification gate:** Phase 0 barrel test goes green. Generated `components/index.ts` for lyra contains `LyraHeader` and `LyraFooter`.

---

### Phase 6 — End-to-end verification

```bash
# 1. Full type check — zero new errors
pnpm type-check

# 2. Smoke check existing themes untouched
grep -r "LyraHeader\|LyraFooter" packages/themes/orion packages/themes/vega 2>/dev/null \
  && echo "WARN: existing themes affected" || echo "PASS: existing themes clean"

# 3. Re-run pipeline for fountaindigital
# /pipeline.ingest --url https://www.fountaindigital.co.uk/ --name lyra
```

**Expected Phase B result:** `Statistics: Critical=0 High=0 Medium=1 Low=0`

The Medium (TPV-013, `backgroundImage` inline style in `cta-full-bleed-gradient.tsx`) is a pre-existing AI generation quality issue — not addressed by these fixes.

---

## Files changed

| File                                     | Bug(s)     | Change                                                                                                                                                                                   |
| ---------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/themes/package.json`           | 6          | Move react/next → peerDependencies                                                                                                                                                       |
| `tools/lib/theme-component-generator.ts` | 1          | Delete line 371 (Navigation blanket rule)                                                                                                                                                |
| `tools/lib/reference-analysis-types.ts`  | 5          | Add `blueprintId?: string` to `ComponentMatch`                                                                                                                                           |
| `tools/lib/analysis-schemas.ts`          | 5          | Add `blueprintId: z.string().optional()` to match schema                                                                                                                                 |
| `tools/lib/component-matcher.ts`         | 5          | Add `blueprintId: blueprint.id` at match creation                                                                                                                                        |
| `tools/analyse-site.ts`                  | 5          | Preserve blueprintId when flattening Map (~line 555)                                                                                                                                     |
| `tools/scaffold-theme-package.ts`        | 2, 3, 4, 5 | `hexToRgba` helper; `DEFAULT_TYPOGRAPHY_SCALE`; surface fallbacks; semantic/overlay blocks; always-emit scale; options-object signature; Header/Footer aliases; blueprintId-first lookup |
| `tools/**/__tests__/*`                   | —          | New unit tests for Phase 0                                                                                                                                                               |
