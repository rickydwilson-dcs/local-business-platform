# Claude's Plan: End-to-End Client Ingestion Pipeline

**Date:** 2026-02-20
**Author:** Claude (independent plan, written before Codex review)

---

## Scope Decision

Fix the four defects that break the pipeline. Do NOT wire content generation (services/locations MDX) — that manual step is documented and functional today.

**In scope:**
- Defect 1: Fix `generateThemeConfigContent()` format
- Defect 2: Add `componentRegistry` to `create-site-from-project.ts` output
- Defect 3: Add `themeVariant` to `ProjectFileSchema.theme`
- Defect 4: Add orion/vega style question to intake system prompt

**Deferred:**
- MCP tool for theme extraction during intake chat (requires full handler implementation)
- Content generation wiring (already works via separate tools)
- Overlay color generation in `create-site-from-project.ts` (pre-existing minor gap)

---

## Step 1: Fix `generateThemeConfigContent()` in theme-generator.ts

**File:** `packages/intake-system/src/theme-extraction/theme-generator.ts` lines 399–442

**The fix:** Replace the entire function body. The new version outputs `DeepPartialThemeConfig` format without a registry (registry is injected by callers).

**Why no registry in this function:** `generateThemeConfigContent()` is a pure colour/typography serialiser. It receives a `ThemeSuggestion` (which has no orion/vega knowledge). The caller — either `generate-theme-from-reference.ts` or `create-site-from-project.ts` — knows the registry decision and injects it. Keeping the function pure avoids changing its signature and breaking callers.

**New output:**
```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';

/**
 * Theme configuration for [siteName]
 * Generated from extracted brand colors
 * Style: [style]
 * Confidence: [n]%
 */
export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: '[primary]',
      primaryHover: '[primaryHover]',
      secondary: '[secondary]',
      accent: '[accent]',
    },
    surface: {
      background: '[background]',
      foreground: '[foreground]',
      muted: '[muted]',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Font', ...],
      heading: ['Font', ...],
    },
  },
};
```

**Key differences from current:**
- `import { defineTheme }` → `import type { DeepPartialThemeConfig }`
- `export default defineTheme({` → `export const themeConfig: DeepPartialThemeConfig = {`
- Remove `name:` field (not part of `DeepPartialThemeConfig`)
- Closing `})` → `};`

**Effect on `generate-theme-from-reference.ts`:**
The `generateEnrichedThemeConfig()` function at lines 190–218 patches the base config with two regexes:
```typescript
// Regex 1: inject registry import after DeepPartialThemeConfig import line
baseConfig.replace(
  /import type \{ DeepPartialThemeConfig \} from '@platform\/theme-system';/,
  `import type { DeepPartialThemeConfig } from '@platform/theme-system';\n${registryImport}`
);
// Regex 2: inject componentRegistry as first field in the config object
withImport.replace(
  /export const themeConfig: DeepPartialThemeConfig = \{/,
  `export const themeConfig: DeepPartialThemeConfig = {\n  componentRegistry: ${registryRef},\n`
);
```
Both regexes will match the corrected output. **`generate-theme-from-reference.ts` needs zero changes.**

**Verification gate:**
```bash
npx tsx -e "
import { generateThemeConfigContent } from './packages/intake-system/src/theme-extraction/theme-generator';
const s = { colors: { brand: { primary: '#db0b0b', primaryHover: '#ba0909', secondary: '#b00909', accent: '#fbbf24' }, surface: { background: '#fff', foreground: '#111', muted: '#f5f5f5' } }, typography: { fontFamily: { sans: ['Inter'], heading: ['Inter'] } }, style: 'bold', confidence: 0.9, source: 'website' };
console.log(generateThemeConfigContent(s, 'test-site'));
" 2>&1
```
Confirm:
- Contains `import type { DeepPartialThemeConfig }`
- Contains `export const themeConfig: DeepPartialThemeConfig = {`
- Contains NO `defineTheme`
- Contains NO `export default`

---

## Step 2: Add `themeVariant` to `ProjectFileSchema`

**File:** `packages/intake-system/src/schemas/project-file.schema.ts`

**The fix:** Add one optional field to `ThemeSchema`.

Find the `ThemeSchema` object and add:
```typescript
themeVariant: z.enum(['orion', 'vega']).optional(),
```

Placement: after `components` block, before `logoUrl`. This gives it a logical position alongside other theme-level decisions.

**Non-breaking:** `optional()` ensures all existing ProjectFile JSONs remain valid.

**Type export:** `z.infer<typeof ThemeSchema>` automatically picks up the new field — no separate type change needed.

**Verification gate:**
```bash
npm run type-check  # from monorepo root
```
Expect zero new errors.

---

## Step 3: Wire `themeVariant` into `create-site-from-project.ts`

**File:** `tools/create-site-from-project.ts`

Two additions to the `generateThemeConfig(project: ProjectFile)` function (lines 624–743):

**3a. Resolve registry at top of function:**
```typescript
function generateThemeConfig(project: ProjectFile): string {
  const theme = project.theme;
  const themeVariant = theme?.themeVariant ?? 'vega';

  const registryImport = themeVariant === 'orion'
    ? `import { orionRegistry } from '@platform/themes/orion';`
    : `import { vegaRegistry } from '@platform/themes/vega';`;
  const registryRef = themeVariant === 'orion' ? 'orionRegistry' : 'vegaRegistry';

  // ... rest of function unchanged until the config template string ...
```

**3b. Update the template string at lines 683–691:**
```typescript
const config = `import type { DeepPartialThemeConfig } from '@platform/theme-system';
${registryImport}

/**
 * ${project.business.name} - Theme Configuration
 * ...
 */
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: ${registryRef},

  colors: {
```

The rest of the template string is unchanged.

**3c. Log the variant in the generation summary:**
After writing `theme.config.ts`, add a console log:
```
  ✓ Theme variant: ${themeVariant} (${registryRef})
```

**Verification gate:**
```bash
# Test with vega (default)
cat > /tmp/test-vega.json << 'EOF'
{ "metadata": {...}, "business": {...}, "services": [...], "regions": [...], "theme": {} }
EOF
npx tsx tools/create-site-from-project.ts --project /tmp/test-vega.json --dry-run

# Test with orion
# Set theme.themeVariant: "orion" in test JSON and repeat
```
Confirm dry-run output shows correct registry for each variant.

For a full write test:
```bash
npx tsx tools/create-site-from-project.ts --project tools/examples/sample-project.json --force
# Then:
cd sites/smiths-electrical && npx tsc --noEmit
```

---

## Step 4: Add orion/vega style question to intake system prompt

**File:** `packages/intake-system/src/chat-intake/system-prompt.ts`

**Location:** In the brand/theme section of the intake flow (Section 9 in the full system prompt, near where colours are collected).

**The addition:** After collecting brand colours, add a style preference question:

```
After discussing colours, ask:
"Last question on design — would you prefer a bold, dramatic look with a dark header and
full-width image background (great for trades businesses like electricians and plumbers),
or a clean, professional look with a light header and structured layout (great for
contractors, scaffolding, or consulting businesses)?"

Map their answer to themeVariant in the ProjectFile:
- Bold/dramatic/dark → themeVariant: "orion"
- Clean/professional/light → themeVariant: "vega"
- Unsure → themeVariant: "vega" (safe default)

Include themeVariant in the ProjectFile JSON produced by generate_project_file tool.
```

**Why here:** Theme variant is a visual style preference — it belongs with colour and font choices in the brand section, not with deployment or business info.

**Verification:** Manual review of system prompt diff. No compile step needed.

---

## Step 5: End-to-end smoke test

Run the full pipeline with the existing sample project file, then with a modified version:

```bash
# Test 1: Default vega (no themeVariant set)
npx tsx tools/create-site-from-project.ts \
  --project tools/examples/sample-project.json \
  --force

# Verify:
grep "vegaRegistry" sites/smiths-electrical/theme.config.ts  # should match
grep "componentRegistry" sites/smiths-electrical/theme.config.ts  # should match
grep "defineTheme" sites/smiths-electrical/theme.config.ts  # should return nothing
cd sites/smiths-electrical && npx tsc --noEmit  # should pass

# Test 2: Orion (add "themeVariant": "orion" to sample-project.json theme section)
# Edit tools/examples/sample-project.json temporarily, re-run, verify orionRegistry

# Test 3: generate-theme-from-reference.ts still works after Step 1 fix
npx tsx tools/generate-theme-from-reference.ts \
  --url https://colorcode.events/ \
  --name test-run \
  --dry-run
# Confirm output contains componentRegistry and no defineTheme

# Cleanup
rm -rf sites/smiths-electrical
```

---

## Risks

**Risk 1: Regex patches in `generate-theme-from-reference.ts` are fragile**
After Step 1, both regexes will match. But if `generateThemeConfigContent()` ever changes format again, both patches will silently fail. The robust fix is to pass `themeVariant` into `generateThemeConfigContent()` so it emits a complete file. However, this changes the function signature and `ThemeSuggestion` doesn't carry `themeVariant`. Defer this refactor — add a code comment noting the fragility.

**Risk 2: `overlay` colors not in generated output**
Production configs include `overlay: { dark, light, primary }`. Neither `generateThemeConfigContent()` nor `create-site-from-project.ts`'s `generateThemeConfig()` emits this. It's `optional()` in `DeepPartialThemeConfig` so type-check passes. Sites will use theme defaults. **Do not fix in this session** — it's a pre-existing gap, not a new defect.

**Risk 3: Sample project JSON may not validate**
`tools/examples/sample-project.json` may not pass current schema validation if schema has evolved since the file was written. If smoke test fails on validation, fix the sample JSON, not the schema.

**Risk 4: `intake-system` package needs rebuild**
After changing `theme-generator.ts` and `project-file.schema.ts`, the package dist needs rebuilding if any site imports from the compiled dist rather than source. Check `tsup.config.ts` to see what the package exposes. Run `pnpm --filter @platform/intake-system build` after changes.

---

## File Change Summary

| File | Change |
|------|--------|
| `packages/intake-system/src/theme-extraction/theme-generator.ts` | Replace `generateThemeConfigContent()` body: `defineTheme` → `DeepPartialThemeConfig` format |
| `packages/intake-system/src/schemas/project-file.schema.ts` | Add `themeVariant: z.enum(['orion','vega']).optional()` to `ThemeSchema` |
| `tools/create-site-from-project.ts` | Add registry resolution + inject `componentRegistry` in `generateThemeConfig()` |
| `packages/intake-system/src/chat-intake/system-prompt.ts` | Add style question → orion/vega mapping |
| `tools/generate-theme-from-reference.ts` | **No changes needed** — regex patches will work after Step 1 |
