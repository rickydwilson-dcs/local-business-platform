# Implementation Plan: End-to-End Client Ingestion Pipeline

**Date:** 2026-02-20
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect | Claude | Codex | Synthesised Decision |
|--------|--------|-------|----------------------|
| `generateThemeConfigContent()` signature | Keep pure (no registry param); callers inject via regex | Accept optional registry param; emit complete file | **Codex wins.** The function is already broken and being touched. Eliminating the regex fragility now costs one caller update (`generate-theme-from-reference.ts`) and prevents silent failures in the future. |
| `generate-theme-from-reference.ts` changes | Zero changes — regex patches "just work" after fix | Simplify/remove regex patches now that function is complete | **Codex wins.** Regex surgery on string output is a maintenance hazard. If the function now emits complete output, remove the surgery. |
| Snapshot test for `generateThemeConfigContent()` | Not mentioned | Add vitest snapshot to lock emitted string format | **Codex wins.** This is the function that broke silently before. A snapshot prevents regression. |
| README documentation | Not mentioned | Update `packages/intake-system/README.md` with `themeVariant` field docs | **Codex wins.** New schema field should be documented. |
| Intake-system package rebuild | Mentioned explicitly | Not mentioned | **Claude wins.** After changing source files in the package, dist must be rebuilt. |
| Sample project JSON drift | Flag it; fix JSON not schema | Not mentioned | **Claude wins.** Smoke test will catch this; good to note pre-emptively. |

## Blind Spots Caught

**Codex caught (Claude missed):**
- Snapshot test for `generateThemeConfigContent()` — the function that broke silently needs a regression guard
- Simplify `generate-theme-from-reference.ts` — passing registry param eliminates the regex surgery entirely
- Document `themeVariant` in `packages/intake-system/README.md`

**Claude caught (Codex missed):**
- Rebuild `intake-system` package dist after source changes (`pnpm --filter @platform/intake-system build`)
- Sample project JSON may have schema drift — fix the JSON, not the schema, if smoke test fails
- `overlay` colors gap: pre-existing, leave alone, don't fix in this session

---

## Implementation Plan

### Step 1 — Fix `generateThemeConfigContent()` with optional registry parameter

**File:** `packages/intake-system/src/theme-extraction/theme-generator.ts` L399–442

Update the function signature to accept an optional `themeVariant` parameter:

```typescript
export function generateThemeConfigContent(
  suggestion: ThemeSuggestion,
  siteName: string,
  themeVariant: 'orion' | 'vega' = 'vega'
): string {
```

The function now emits a complete, valid `theme.config.ts` including the registry import and `componentRegistry` field:

```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { vegaRegistry } from '@platform/themes/vega'; // or orionRegistry

/**
 * Theme configuration for [siteName]
 * Generated from extracted brand colors
 * Style: [style]
 * Confidence: [n]%
 */
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: vegaRegistry,

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

Key changes from current broken output:
- `import { defineTheme }` → `import type { DeepPartialThemeConfig }` + registry import
- `export default defineTheme({` → `export const themeConfig: DeepPartialThemeConfig = {`
- Add `componentRegistry: [registryRef],` as first field
- Remove `name:` field (not in `DeepPartialThemeConfig`)
- Fix closing `})` → `};`

**Verification gate:**
```bash
npx tsx -e "
import { generateThemeConfigContent } from './packages/intake-system/src/theme-extraction/theme-generator';
const s = { colors: { brand: { primary: '#db0b0b', primaryHover: '#ba0909', secondary: '#b00909', accent: '#fbbf24' }, surface: { background: '#fff', foreground: '#111', muted: '#f5f5f5' } }, typography: { fontFamily: { sans: ['Inter'], heading: ['Inter'] } }, style: 'bold', confidence: 0.9, source: 'website' };
console.log(generateThemeConfigContent(s, 'test-site', 'orion'));
"
```
Confirm: `orionRegistry` import present, `componentRegistry: orionRegistry` present, no `defineTheme`, no `export default`.

---

### Step 2 — Update `generate-theme-from-reference.ts` to use new signature

**File:** `tools/generate-theme-from-reference.ts`

The `generateEnrichedThemeConfig()` function (lines 190–218) currently does regex string surgery to inject the registry. Now that `generateThemeConfigContent()` accepts `themeVariant` and emits complete output, replace the surgery with a direct call:

```typescript
function generateEnrichedThemeConfig(
  suggestion: ThemeSuggestion,
  layout: LayoutClassification,
  themeName: string
): string {
  // Pass themeVariant directly — no regex patching needed
  return generateThemeConfigContent(suggestion, themeName, layout.theme);
}
```

Delete the regex replacement blocks and the unused `registryImport`/`registryRef` variables.

**Verification gate:**
```bash
npx tsx tools/generate-theme-from-reference.ts \
  --url https://colorcode.events/ \
  --name test-run \
  --dry-run
```
Confirm output contains `componentRegistry`, correct registry import, no `defineTheme`.

---

### Step 3 — Add snapshot test for `generateThemeConfigContent()`

**File:** Create `packages/intake-system/src/theme-extraction/__tests__/theme-generator.test.ts`
(or add to existing test file if present)

```typescript
import { generateThemeConfigContent } from '../theme-generator';

const mockSuggestion = {
  colors: {
    brand: { primary: '#005A9E', primaryHover: '#004680', secondary: '#1A365D', accent: '#38A169' },
    surface: { background: '#ffffff', foreground: '#1A1A1A', muted: '#F5F5F5' },
  },
  typography: { fontFamily: { sans: ['Inter', 'system-ui'], heading: ['Inter', 'system-ui'] } },
  style: 'corporate' as const,
  confidence: 0.8,
  source: 'website' as const,
};

it('emits DeepPartialThemeConfig format (vega)', () => {
  const output = generateThemeConfigContent(mockSuggestion, 'test-site', 'vega');
  expect(output).toContain("import type { DeepPartialThemeConfig }");
  expect(output).toContain("import { vegaRegistry }");
  expect(output).toContain("export const themeConfig: DeepPartialThemeConfig = {");
  expect(output).toContain("componentRegistry: vegaRegistry");
  expect(output).not.toContain("defineTheme");
  expect(output).not.toContain("export default");
});

it('emits orionRegistry when themeVariant is orion', () => {
  const output = generateThemeConfigContent(mockSuggestion, 'test-site', 'orion');
  expect(output).toContain("import { orionRegistry }");
  expect(output).toContain("componentRegistry: orionRegistry");
  expect(output).not.toContain("vegaRegistry");
});

it('defaults to vega when themeVariant is omitted', () => {
  const output = generateThemeConfigContent(mockSuggestion, 'test-site');
  expect(output).toContain("vegaRegistry");
});
```

**Verification gate:**
```bash
pnpm --filter @platform/intake-system test
```
All three cases pass.

---

### Step 4 — Add `themeVariant` to `ProjectFileSchema`

**File:** `packages/intake-system/src/schemas/project-file.schema.ts`

Add to `ThemeSchema` after the `components` block, before `logoUrl`:
```typescript
themeVariant: z.enum(['orion', 'vega']).optional(),
```

Non-breaking: `optional()` means all existing project JSONs remain valid.

**Verification gate:**
```bash
npm run type-check  # from monorepo root — expect zero new errors
```

---

### Step 5 — Wire `themeVariant` into `create-site-from-project.ts`

**File:** `tools/create-site-from-project.ts` — `generateThemeConfig()` function (L624–743)

**5a.** At the top of the function, after `const theme = project.theme;`, add:
```typescript
const themeVariant = theme?.themeVariant ?? 'vega';
const registryImport = themeVariant === 'orion'
  ? `import { orionRegistry } from '@platform/themes/orion';`
  : `import { vegaRegistry } from '@platform/themes/vega';`;
const registryRef = themeVariant === 'orion' ? 'orionRegistry' : 'vegaRegistry';
```

**5b.** Update the template string at L683 to emit registry import and `componentRegistry` as first field:
```typescript
const config = `import type { DeepPartialThemeConfig } from '@platform/theme-system';
${registryImport}

/**
 * ${project.business.name} - Theme Configuration
 *
 * Generated from project file: ${project.metadata.projectId}
 * Generated at: ${new Date().toISOString()}
 */
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: ${registryRef},

  colors: {
    brand: {
```

The rest of the template string is unchanged.

**5c.** Add a log line after writing `theme.config.ts`:
```
✓ Theme variant: ${themeVariant} (${registryRef})
```

**Verification gate:**
```bash
npx tsx tools/create-site-from-project.ts \
  --project tools/examples/sample-project.json \
  --force
grep "vegaRegistry" sites/smiths-electrical/theme.config.ts
grep "componentRegistry" sites/smiths-electrical/theme.config.ts
grep "defineTheme" sites/smiths-electrical/theme.config.ts  # expect no match
cd sites/smiths-electrical && npx tsc --noEmit
```
Then repeat with `"themeVariant": "orion"` in the sample JSON to verify the orion path.

---

### Step 6 — Add style question to intake system prompt

**File:** `packages/intake-system/src/chat-intake/system-prompt.ts`

In the brand/theme section (near where colours are collected), add after the colour discussion:

```
After collecting brand colours, ask:

"Last question on design — would you prefer a bold, dramatic look with a dark header and
full-width image background (great for trades businesses like electricians and plumbers),
or a clean, professional look with a light header and structured layout (great for
contractors, scaffolding, or consulting businesses)?"

Map their answer to themeVariant:
- Bold / dramatic / dark header → themeVariant: "orion"
- Clean / professional / light header / unsure → themeVariant: "vega"

Always include theme.themeVariant in the ProjectFile JSON passed to generate_project_file.
```

**Verification:** Manual diff review. No compile step.

---

### Step 7 — Update `packages/intake-system/README.md`

Add a `themeVariant` entry to the ProjectFile field documentation:

```markdown
### `theme.themeVariant` (optional)

Controls which component registry the generated site uses:
- `"orion"` — Dark header, full-bleed image hero, circular icon cards. Best for trades businesses (electrical, plumbing, construction).
- `"vega"` — Light header, split hero, card grid. Best for professional services (scaffolding, consulting).
- Omitted — defaults to `"vega"`.

Set during intake via the style preference question, or manually in the project file.
```

---

### Step 8 — Rebuild package dist and end-to-end smoke test

**Rebuild intake-system** (changes to source files in the package):
```bash
pnpm --filter @platform/intake-system build
```

**End-to-end smoke test:**
```bash
# 1. Vega default (no themeVariant)
npx tsx tools/create-site-from-project.ts \
  --project tools/examples/sample-project.json --force
grep "vegaRegistry" sites/smiths-electrical/theme.config.ts
grep "componentRegistry: vegaRegistry" sites/smiths-electrical/theme.config.ts
cd sites/smiths-electrical && npx tsc --noEmit
cd ../..

# 2. Orion (add "themeVariant": "orion" to sample-project.json theme block, re-run)
grep "orionRegistry" sites/smiths-electrical/theme.config.ts
grep "componentRegistry: orionRegistry" sites/smiths-electrical/theme.config.ts
cd sites/smiths-electrical && npx tsc --noEmit
cd ../..

# 3. generate-theme-from-reference still works
npx tsx tools/generate-theme-from-reference.ts \
  --url https://colorcode.events/ --name test --dry-run
# Confirm: componentRegistry present, no defineTheme

# 4. Run tests
pnpm --filter @platform/intake-system test

# 5. Cleanup
rm -rf sites/smiths-electrical
# Restore sample-project.json if modified
```

If smoke test fails at schema validation, update `tools/examples/sample-project.json` to match current schema — do NOT relax the schema.

---

## Risks

| Risk | Mitigation |
|------|------------|
| `generateThemeConfigContent()` signature change breaks unknown callers | Only one real caller (`generate-theme-from-reference.ts`), updated in Step 2. The new param is optional so existing calls without it still work (default vega). |
| `overlay` colors not emitted | Pre-existing gap; `DeepPartialThemeConfig` makes it optional; sites fall back to theme defaults. Out of scope. |
| `intake-system` dist not rebuilt | Step 8 explicitly rebuilds. If CI fails after merge, check for stale dist. |
| Sample project JSON has schema drift | Fix the JSON, not the schema, if smoke test fails on validation. |
| Intake system prompt verbosity | Keep the style question short and deterministic; map to enum values explicitly in the prompt. |

---

## Files Changed

| File | Change |
|------|--------|
| `packages/intake-system/src/theme-extraction/theme-generator.ts` | Add `themeVariant` param to `generateThemeConfigContent()`, emit complete file with registry |
| `tools/generate-theme-from-reference.ts` | Simplify `generateEnrichedThemeConfig()` — drop regex surgery, pass `layout.theme` directly |
| `packages/intake-system/src/theme-extraction/__tests__/theme-generator.test.ts` | New: 3 snapshot-style tests for `generateThemeConfigContent()` |
| `packages/intake-system/src/schemas/project-file.schema.ts` | Add `themeVariant: z.enum(['orion','vega']).optional()` to `ThemeSchema` |
| `tools/create-site-from-project.ts` | Add registry resolution + `componentRegistry` to `generateThemeConfig()` |
| `packages/intake-system/src/chat-intake/system-prompt.ts` | Add style question → themeVariant mapping |
| `packages/intake-system/README.md` | Document `themeVariant` field |
