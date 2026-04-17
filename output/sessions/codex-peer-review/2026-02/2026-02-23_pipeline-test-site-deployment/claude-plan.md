# Claude Plan: Pipeline Test Site Deployment Safety

**Date:** 2026-02-23
**Author:** Claude (independent plan — written before seeing Codex's plan)

---

## Phase 1: Test Site package.json Generation (CI Exclusion)

**Goal:** Test sites are never Turborepo CI participants.

### Step 1.1: Create a test-site package.json template utility

**File:** `tools/lib/test-site-package.ts` (new)

Create a function `generateTestSitePackageJson(name: string, basePackageJson: object)` that:

1. Takes the base-template `package.json` as input
2. Strips all scripts except `dev`, `start`, and `clean`
3. Sets the `name` field to the provided name
4. Returns the modified JSON object

This is better than a static template because test sites inherit dependency changes from base-template automatically — only the scripts are filtered.

```typescript
export function generateTestSitePackageJson(
  name: string,
  basePackageJson: Record<string, unknown>
): Record<string, unknown> {
  const ALLOWED_SCRIPTS = ["dev", "start", "clean"];
  const scripts = (basePackageJson.scripts as Record<string, string>) ?? {};
  const filtered = Object.fromEntries(
    Object.entries(scripts).filter(([key]) => ALLOWED_SCRIPTS.includes(key))
  );
  return {
    ...basePackageJson,
    name,
    scripts: filtered,
  };
}
```

### Step 1.2: Update `pipeline.ingest.md` to use the utility

**File:** `.claude/commands/pipeline.ingest.md`

In Step 5 (wire theme), replace the current approach of copying `package.json` and only rewriting the `name` field. Instead:

1. After `cp -r sites/base-template sites/test-<theme>`, immediately overwrite `package.json`:
   ```bash
   npx tsx -e "
     const base = require('../../sites/base-template/package.json');
     const { generateTestSitePackageJson } = require('../../tools/lib/test-site-package');
     const pkg = generateTestSitePackageJson('test-<theme>', base);
     require('fs').writeFileSync('sites/test-<theme>/package.json', JSON.stringify(pkg, null, 2) + '\n');
   "
   ```
2. Or, more practically since `pipeline.ingest.md` is a Claude skill spec (not a bash script), update the instructions to tell the executing Claude instance to read base-template's `package.json`, filter scripts to `dev`/`start`/`clean`, set the name, and write the result.

### Step 1.3: Verification gate

After Step 1.2, verify:

```bash
# Must NOT contain build, type-check, lint, test scripts
node -e "const p = require('./sites/test-<theme>/package.json'); const bad = ['build','type-check','lint','test'].filter(s => p.scripts?.[s]); if (bad.length) { console.error('FAIL: test site has CI scripts:', bad); process.exit(1); } else { console.log('PASS: test site has no CI scripts'); }"
```

---

## Phase 2: Lockfile Hygiene

**Goal:** The lockfile is always consistent with workspace state before any commit.

### Step 2.1: Add lockfile commit step to `pipeline.ingest.md`

**File:** `.claude/commands/pipeline.ingest.md`

After Step 6 (`pnpm install`), add a new step:

**Step 7: Commit lockfile alongside test site**

The skill spec should instruct the executing Claude instance to:

1. Run `pnpm install` at root (already happens in Step 6)
2. Stage `pnpm-lock.yaml` together with the test site directory
3. Commit them together: `git add sites/test-<theme>/ pnpm-lock.yaml && git commit -m "feat(pipeline): add test site test-<theme> with lockfile"`

This ensures the lockfile entry exists in the same commit as the workspace, so the lockfile is never stale on any branch.

### Step 2.2: Add lockfile cleanup to `pipeline.kill-site.md`

**File:** `.claude/commands/pipeline.kill-site.md`

After removing the site directory (Step 5), add:

1. Run `pnpm install` at root — this regenerates the lockfile without the removed workspace
2. Stage `pnpm-lock.yaml` alongside the site removal
3. Note in the report: "Lockfile updated — removed entries for test-<theme>"

**Trade-off:** `pnpm install` is slow (~10s). But it's the only correct way to clean up lockfile entries. There is no lighter alternative that is safe.

### Step 2.3: Verification gate

```bash
# After pnpm install, verify lockfile is in sync
pnpm install --frozen-lockfile  # Must succeed
```

---

## Phase 3: Component Generator — Fix Bracket Notation

**Goal:** AI-generated components always use camelCase dot notation for prop access.

### Step 3.1: Harden `fixBracketNotationProps()` regex

**File:** `tools/lib/theme-component-generator.ts`

The current regex:

```regex
/props\[['"]([a-z][a-z0-9]*(?:-[a-z0-9]+)*)['"]\]/g
```

This only matches lowercase hyphenated keys (`props['post-thumbnail']`). It misses:

- PascalCase keys: `props['PostThumbnail']`
- Underscore keys: `props['post_thumbnail']`
- Mixed case: `props['postThumbnail']` (already camelCase but in bracket notation)
- Keys with numbers: `props['item2Count']`

Replace with a broader regex that catches ANY string-literal bracket access on `props`:

```typescript
export function fixBracketNotationProps(content: string): { content: string; fixCount: number } {
  let fixCount = 0;
  const fixed = content.replace(
    /props\[['"]([a-zA-Z_$][a-zA-Z0-9_$-]*)['"]\]/g,
    (_match, key: string) => {
      // Convert any non-camelCase key to camelCase
      const camelKey = key
        .replace(/[-_]([a-zA-Z0-9])/g, (_: string, c: string) => c.toUpperCase())
        // Ensure first character is lowercase (for PascalCase input)
        .replace(/^[A-Z]/, (c) => c.toLowerCase());
      fixCount++;
      return `props.${camelKey}`;
    }
  );
  return { content: fixed, fixCount };
}
```

### Step 3.2: Add a validation pass after fixing

**File:** `tools/lib/theme-component-generator.ts`

After `fixBracketNotationProps()` runs, add a validator that scans for any remaining `props[` patterns:

```typescript
export function validateNoBracketProps(content: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const regex = /props\[/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const line = content.substring(0, match.index).split("\n").length;
    const context = content.substring(match.index, match.index + 40);
    violations.push(`Line ${line}: ${context}`);
  }
  return { valid: violations.length === 0, violations };
}
```

If violations remain after fixing, replace the component with a placeholder (this already happens, but the detection should be more robust).

### Step 3.3: Add a TypeScript interface consistency check

**File:** `tools/lib/theme-component-generator.ts`

After generating a component, extract the prop names from the interface and verify that the JSX body only accesses those exact names:

1. Parse the interface: extract prop names from `interface.*Props \{(.*?)\}` pattern
2. Parse the body: extract all `props.xxx` references
3. Compare: any `props.xxx` where `xxx` is not in the interface → error

This catches the case where `fixBracketNotationProps()` converts `props['headline-text']` to `props.headlineText` but the interface (generated by `sanitiseSlotName()`) declares the prop as `headlineText`. If there's a mismatch, regenerate or use placeholder.

### Step 3.4: Write unit tests for `fixBracketNotationProps()`

**File:** `tools/lib/__tests__/theme-component-generator.test.ts` (new or append)

Test cases:

```typescript
describe("fixBracketNotationProps", () => {
  test("converts hyphenated bracket notation to camelCase dot", () => {
    expect(fix(`props['post-thumbnail']`)).toBe("props.postThumbnail");
  });
  test("converts underscored bracket notation to camelCase dot", () => {
    expect(fix(`props['post_thumbnail']`)).toBe("props.postThumbnail");
  });
  test("converts PascalCase bracket notation to camelCase dot", () => {
    expect(fix(`props['PostThumbnail']`)).toBe("props.postThumbnail");
  });
  test("converts already-camelCase bracket notation to dot", () => {
    expect(fix(`props['postThumbnail']`)).toBe("props.postThumbnail");
  });
  test("handles double-quoted bracket notation", () => {
    expect(fix(`props["post-thumbnail"]`)).toBe("props.postThumbnail");
  });
  test("handles multiple occurrences in one string", () => {
    const input = `{props['heading']} and {props['sub-heading']}`;
    const result = fix(input);
    expect(result).toBe("{props.heading} and {props.subHeading}");
  });
  test("does not touch non-props bracket access", () => {
    expect(fix(`data['post-thumbnail']`)).toBe(`data['post-thumbnail']`);
  });
  test("does not touch numeric index access", () => {
    expect(fix(`props[0]`)).toBe("props[0]");
  });
});

describe("validateNoBracketProps", () => {
  test("passes for dot-notation only", () => {
    expect(validate("props.heading + props.body").valid).toBe(true);
  });
  test("fails for remaining bracket notation", () => {
    expect(validate(`props['heading']`).valid).toBe(false);
  });
});
```

### Step 3.5: Verification gate

```bash
# Run the new tests
npx vitest run tools/lib/__tests__/theme-component-generator.test.ts

# Verify no bracket notation in existing generated components
grep -r "props\[" packages/themes/atlas/components/ packages/themes/lyra/components/ && echo "FAIL: bracket notation found" || echo "PASS: no bracket notation"
```

---

## Phase 4: React Type Declarations

**Goal:** Generated components have proper React type imports/declarations.

### Step 4.1: Ensure generated components include React type reference

**File:** `tools/lib/theme-component-generator.ts` or `tools/lib/theme-component-templates.ts`

When writing a component `.tsx` file, ensure the file header includes:

```typescript
import React from "react";
```

Or, if using the JSX transform (Next.js 15 does), at minimum ensure the component template includes a `/// <reference types="react" />` pragma or that the theme package's `tsconfig.json` includes `"jsx": "react-jsx"` and `"types": ["react"]`.

Check what base-template and existing theme packages (orion, vega) do for React types and replicate.

### Step 4.2: Ensure theme package tsconfig.json is generated correctly

**File:** `tools/lib/scaffold-theme-package.ts`

When `scaffoldThemePackage()` creates `packages/themes/<name>/tsconfig.json`, ensure it:

- Extends the root `tsconfig.json` or a shared base config
- Includes `"jsx": "react-jsx"`
- Includes `"types": ["react"]` in `compilerOptions`

### Step 4.3: Verification gate

```bash
# Type-check the generated theme package in isolation
cd packages/themes/<theme> && npx tsc --noEmit
```

---

## Phase 5: End-to-End Pipeline Test

**Goal:** Verify the full pipeline produces a working, CI-safe test site.

### Step 5.1: Run the pipeline against a known URL

```bash
# On develop branch
/pipeline.ingest --url https://example.com --name test-canary
```

### Step 5.2: Verify all acceptance criteria

```bash
# 1. Test site has no CI scripts
node -e "const p = require('./sites/test-canary/package.json'); const bad = ['build','type-check','lint','test'].filter(s => p.scripts?.[s]); if (bad.length) process.exit(1);"

# 2. Lockfile is consistent
pnpm install --frozen-lockfile

# 3. Monorepo CI passes with test site present
pnpm build && pnpm type-check && pnpm lint

# 4. No bracket notation in generated components
! grep -r "props\[" packages/themes/test-canary/components/

# 5. Generated components type-check
cd packages/themes/test-canary && npx tsc --noEmit
```

### Step 5.3: Clean up

```bash
/pipeline.kill-site test-canary
/pipeline.kill-theme test-canary
pnpm install --frozen-lockfile  # Verify lockfile is clean after kill
```

---

## Risk Assessment

| Risk                                                                                                        | Likelihood | Impact | Mitigation                                                                                                     |
| ----------------------------------------------------------------------------------------------------------- | ---------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| AI still generates bracket notation despite prompt improvements                                             | High       | Low    | `fixBracketNotationProps()` + `validateNoBracketProps()` catch it post-generation; placeholder fallback exists |
| `pnpm install` in kill-site is slow                                                                         | Medium     | Low    | ~10s cost is acceptable for an infrequent operation                                                            |
| Changing the `fixBracketNotationProps()` regex breaks existing working fixes                                | Low        | Medium | Unit tests cover all known patterns; regex is broadened, not narrowed                                          |
| Test site `package.json` drift if base-template adds new required scripts                                   | Low        | Medium | The filter approach (copy all, strip CI scripts) means new non-CI scripts are inherited automatically          |
| Pipeline.ingest.md is a skill spec (natural language), not code — changes may be interpreted inconsistently | Medium     | Medium | Make instructions explicit and verifiable; add inline verification commands                                    |

---

## Files Modified (Summary)

| File                                                    | Change                                                                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `tools/lib/test-site-package.ts`                        | **New** — `generateTestSitePackageJson()` utility                                                         |
| `tools/lib/theme-component-generator.ts`                | Harden `fixBracketNotationProps()` regex, add `validateNoBracketProps()`, add interface consistency check |
| `tools/lib/theme-component-templates.ts`                | Possibly — ensure React imports in templates                                                              |
| `tools/lib/scaffold-theme-package.ts`                   | Ensure `tsconfig.json` includes React types                                                               |
| `tools/lib/__tests__/theme-component-generator.test.ts` | **New/append** — unit tests for bracket notation fixer and validator                                      |
| `.claude/commands/pipeline.ingest.md`                   | Add package.json trimming step, add lockfile commit step                                                  |
| `.claude/commands/pipeline.kill-site.md`                | Add `pnpm install` step for lockfile cleanup                                                              |
