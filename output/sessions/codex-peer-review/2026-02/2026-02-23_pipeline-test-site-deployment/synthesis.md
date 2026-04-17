# Implementation Plan: Pipeline Test Site Deployment Safety

**Date:** 2026-02-23
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect                         | Claude                                                                                               | Codex                                                                                             | Synthesised Decision                                                                                                                                                                                                                                                            |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Package.json trimming approach | New utility function (`tools/lib/test-site-package.ts`) called from skill spec                       | Inline in skill spec instructions only                                                            | **Claude's utility function** — testable, deterministic, reusable. But keep it simple: a function the skill spec tells the executor to call, not a separate CLI.                                                                                                                |
| Lockfile update command        | `pnpm install` (full)                                                                                | `pnpm install --lockfile-only` with fallback to full install                                      | **Codex's `--lockfile-only`** — significantly faster (~2s vs ~10s), only updates the lockfile without touching `node_modules`. Fallback to full install if it fails.                                                                                                            |
| Policy regression test         | Not included                                                                                         | New `test-site-package-policy.test.ts` that asserts no `sites/test-*/package.json` has CI scripts | **Include (Codex)** — this is the enforceable backstop. Skill specs are natural language; a test catches manual edits or future regressions.                                                                                                                                    |
| Package.json metadata marker   | Not included                                                                                         | `"pipelineTestSite": true` field                                                                  | **Include (Codex)** — low cost, enables deterministic detection by future tooling and the policy test.                                                                                                                                                                          |
| Prompt improvements            | Mentioned in passing                                                                                 | Explicit step: update prompt with forbidden examples                                              | **Include (Codex)** — defense in depth. Prompt improvement reduces fixer workload even though the fixer is the real safety net.                                                                                                                                                 |
| Validation approach            | Regex-based interface consistency check (extract props from interface, compare to body)              | AST-level `ElementAccessExpression` detection                                                     | **Claude's regex approach** — pragmatic given we're post-processing string output from AI, not working with a compiled module. AST parsing adds a `ts-morph` or TypeScript compiler API dependency for marginal gain. The regex validator + placeholder fallback is sufficient. |
| React types / tsconfig         | Full phase: ensure `tsconfig.json` in theme packages has `"jsx": "react-jsx"` + `"types": ["react"]` | Not addressed                                                                                     | **Include (Claude)** — this is a real bug. Generated theme packages need proper `tsconfig.json` or components fail `tsc --noEmit`. Codex missed this.                                                                                                                           |
| Implementation order           | package.json → lockfile → generator → React types → E2E test                                         | Generator hardening first → prompt → package.json → lockfile → policy test → E2E                  | **Codex's order** — generator hardening has the highest correctness impact and is the most self-contained change. Start there.                                                                                                                                                  |

## Blind Spots Caught

**What Codex caught that Claude missed:**

- **Policy regression test.** Skill specs are natural language interpreted by an LLM — there's no guarantee a future change won't reintroduce CI scripts in test sites. A fast unit test that scans `sites/test-*/package.json` is the real guardrail.
- **`pnpm install --lockfile-only`.** Faster, more targeted command. Claude defaulted to the heavier full install.
- **`"pipelineTestSite": true` metadata marker.** Enables the policy test to distinguish pipeline test sites from real sites deterministically, rather than pattern-matching on directory names.
- **`--no-install` escape hatch for kill-site.** Some workflows may not want automatic lockfile reconciliation.

**What Claude caught that Codex missed:**

- **React type declarations in generated theme packages.** The `tsconfig.json` generated by `scaffoldThemePackage()` may lack `"jsx": "react-jsx"` and `"types": ["react"]`, causing `tsc --noEmit` failures independent of the bracket-notation issue. This is a separate bug that would persist even after all bracket notation is fixed.
- **Interface-to-body consistency check.** Beyond catching bracket notation, Claude proposed verifying that `props.xxx` references match the declared interface properties. This catches a broader class of AI generation errors (misspelled props, props that exist in the interface but not the body, etc.).

---

## Implementation Plan

### Phase 1: Harden Component Generator (highest correctness impact)

**Goal:** AI-generated components always produce valid TypeScript with camelCase dot-notation prop access.

#### Step 1.1: Broaden `fixBracketNotationProps()` regex

**File:** `tools/lib/theme-component-generator.ts`

Replace the current regex (lowercase kebab-only) with one that catches any string-literal bracket access on `props`:

```typescript
export function fixBracketNotationProps(content: string): { content: string; fixCount: number } {
  let fixCount = 0;
  const fixed = content.replace(
    /props\[['"]([a-zA-Z_$][a-zA-Z0-9_$-]*)['"]\]/g,
    (_match, key: string) => {
      const camelKey = key
        .replace(/[-_]([a-zA-Z0-9])/g, (_: string, c: string) => c.toUpperCase())
        .replace(/^[A-Z]/, (c) => c.toLowerCase());
      fixCount++;
      return `props.${camelKey}`;
    }
  );
  return { content: fixed, fixCount };
}
```

Covers: lowercase kebab (`post-thumbnail`), underscore (`post_thumbnail`), PascalCase (`PostThumbnail`), already-camelCase in brackets (`postThumbnail`), mixed with numbers (`item2Count`), single and double quotes.

Does NOT touch: dynamic access (`props[key]`), numeric indexing (`props[0]`), non-props objects (`data['key']`).

#### Step 1.2: Add residual bracket-notation validator

**File:** `tools/lib/theme-component-generator.ts`

```typescript
export function validateNoBracketProps(content: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const regex = /props\[['"][^'"]+['"]\]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const line = content.substring(0, match.index).split("\n").length;
    const context = content.substring(match.index, match.index + 50);
    violations.push(`Line ${line}: ${context}`);
  }
  return { valid: violations.length === 0, violations };
}
```

Wire into the generation pipeline: after `fixBracketNotationProps()`, run `validateNoBracketProps()`. If violations remain → replace component with placeholder + log warning. This already happens for some cases but the detection regex was too narrow.

#### Step 1.3: Add interface-to-body consistency check

**File:** `tools/lib/theme-component-generator.ts`

After generation + bracket fix, extract declared prop names from the TypeScript interface and compare against actual `props.xxx` references in the body. Any `props.xxx` where `xxx` is not in the interface → warning + placeholder fallback.

Implementation: simple regex extraction (not AST) — parse `interface \w+Props \{` block for property names, scan body for `/props\.(\w+)/g`, diff the sets.

#### Step 1.4: Update component generation prompt

**File:** `tools/lib/theme-component-templates.ts` (in `buildComponentGenerationPrompt()`)

Add explicit forbidden examples to the prompt:

```
REQUIRED: props.camelCase (e.g., props.postThumbnail, props.heroTitle)
FORBIDDEN: props['post-thumbnail'], props["hero-title"], props['cta_button']
The TypeScript interface uses camelCase. Your JSX must match exactly.
```

This is defense-in-depth — the post-processor is the real safety net.

#### Step 1.5: Write unit tests

**File:** `tools/lib/__tests__/theme-component-generator.test.ts` (new or append)

Test cases for `fixBracketNotationProps()`:

- Lowercase kebab: `props['post-thumbnail']` → `props.postThumbnail`
- Underscore: `props['post_thumbnail']` → `props.postThumbnail`
- PascalCase: `props['PostThumbnail']` → `props.postThumbnail`
- Already camelCase in brackets: `props['postThumbnail']` → `props.postThumbnail`
- Double quotes: `props["post-thumbnail"]` → `props.postThumbnail`
- Multiple occurrences in one string
- Does NOT touch `data['key']` (non-props object)
- Does NOT touch `props[0]` (numeric index)
- Does NOT touch `props[key]` (dynamic access)

Test cases for `validateNoBracketProps()`:

- Passes for dot-notation only
- Fails for any remaining `props['...']` or `props["..."]`

**Verification gate:**

```bash
npx vitest run tools/lib/__tests__/theme-component-generator.test.ts
```

---

### Phase 2: Fix React Types in Theme Package Scaffolding

**Goal:** Generated theme packages type-check independently.

#### Step 2.1: Verify existing theme package tsconfig patterns

Read `packages/themes/orion/tsconfig.json` and `packages/themes/vega/tsconfig.json` to establish the correct pattern.

#### Step 2.2: Update `scaffoldThemePackage()` tsconfig generation

**File:** `tools/lib/scaffold-theme-package.ts`

Ensure the generated `packages/themes/<name>/tsconfig.json`:

- Extends the root or shared base `tsconfig.json`
- Includes `"jsx": "react-jsx"` in `compilerOptions`
- Includes `"types": ["react"]` in `compilerOptions`

Match whatever orion/vega use — replicate, don't innovate.

#### Step 2.3: Ensure component templates don't need explicit React import

If the tsconfig is configured correctly with `"jsx": "react-jsx"`, no `import React from 'react'` is needed (React 17+ JSX transform). Verify this is the case for orion/vega components. If they do import React explicitly, add it to the generation template.

**Verification gate:**

```bash
# After scaffolding a theme package, it should type-check cleanly
cd packages/themes/<theme> && npx tsc --noEmit
```

---

### Phase 3: Make Test Sites CI-Inert at Creation Time

**Goal:** Test site `package.json` files never contain CI-participating scripts.

#### Step 3.1: Create test-site package.json utility

**File:** `tools/lib/test-site-package.ts` (new)

```typescript
const ALLOWED_SCRIPTS = ["dev", "start", "clean"];

export function generateTestSitePackageJson(
  name: string,
  basePackageJson: Record<string, unknown>
): Record<string, unknown> {
  const scripts = (basePackageJson.scripts as Record<string, string>) ?? {};
  const filtered = Object.fromEntries(
    Object.entries(scripts).filter(([key]) => ALLOWED_SCRIPTS.includes(key))
  );
  return {
    ...basePackageJson,
    name,
    scripts: filtered,
    pipelineTestSite: true,
  };
}
```

Key design decisions:

- **Allowlist, not blocklist** — only `dev`/`start`/`clean` survive. If base-template adds new scripts, they are excluded by default. Safe.
- **Inherits deps from base-template** — keeps package.json in sync for `pnpm install` linking.
- **`pipelineTestSite: true` marker** — enables deterministic detection by the policy test and future tooling.

#### Step 3.2: Update `pipeline.ingest.md` skill spec

**File:** `.claude/commands/pipeline.ingest.md`

In Step 5 (wire theme), after `cp -r sites/base-template sites/test-<theme>`, replace the current "rewrite name field only" instruction with:

> Read `sites/base-template/package.json`. Using the `generateTestSitePackageJson()` function from `tools/lib/test-site-package.ts`, generate the test site's `package.json` with name `test-<theme>`. Write the result to `sites/test-<theme>/package.json`.
>
> Verify: the resulting `package.json` must NOT contain `build`, `type-check`, `lint`, or `test` scripts. It MUST contain `"pipelineTestSite": true`.

#### Step 3.3: Add inline verification to skill spec

Add after the package.json write:

```bash
node -e "
  const p = require('./sites/test-<theme>/package.json');
  const bad = ['build','type-check','lint','test'].filter(s => p.scripts?.[s]);
  if (bad.length) { console.error('FAIL: test site has CI scripts:', bad); process.exit(1); }
  if (!p.pipelineTestSite) { console.error('FAIL: missing pipelineTestSite marker'); process.exit(1); }
  console.log('PASS: test site is CI-inert');
"
```

**Verification gate:**

```bash
# Test site must not participate in turbo build/type-check/lint
pnpm turbo run build --dry-run | grep -v "test-<theme>"
```

---

### Phase 4: Lockfile Hygiene

**Goal:** Lockfile is always consistent with workspace state. No `ERR_PNPM_OUTDATED_LOCKFILE` on Vercel.

#### Step 4.1: Update `pipeline.ingest.md` — lockfile gate

**File:** `.claude/commands/pipeline.ingest.md`

Replace the current Step 6 (`pnpm install`) with:

> **Step 6: Reconcile lockfile**
>
> 1. Run `pnpm install --lockfile-only` at the monorepo root. This updates `pnpm-lock.yaml` to include the new test site workspace without modifying `node_modules`.
> 2. If `--lockfile-only` fails, fall back to `pnpm install`.
> 3. Verify: `pnpm install --frozen-lockfile` must succeed.

Add a new Step 7:

> **Step 7: Stage lockfile with test site**
> Stage `pnpm-lock.yaml` alongside the test site directory. The lockfile MUST be in the same commit as the test site to prevent `ERR_PNPM_OUTDATED_LOCKFILE` on any branch.
>
> ```bash
> git add sites/test-<theme>/ pnpm-lock.yaml
> ```

#### Step 4.2: Update `pipeline.kill-site.md` — lockfile cleanup

**File:** `.claude/commands/pipeline.kill-site.md`

After removing the site directory (current Step 5), add:

> **Step 6: Reconcile lockfile**
>
> 1. Run `pnpm install --lockfile-only` at the monorepo root.
> 2. If it fails, fall back to `pnpm install`.
> 3. Stage `pnpm-lock.yaml` alongside the site removal.
> 4. Report: "Lockfile updated — removed entries for test-<theme>"

Keep kill-site idempotent: if the site directory doesn't exist (already deleted), skip the lockfile reconciliation unless `--reconcile-lockfile` is explicitly passed.

**Verification gate:**

```bash
pnpm install --frozen-lockfile  # Must succeed after both ingest and kill-site
```

---

### Phase 5: Policy Regression Test

**Goal:** Prevent future regressions where test sites accidentally gain CI scripts.

#### Step 5.1: Create policy test

**File:** `tools/__tests__/test-site-package-policy.test.ts` (new)

```typescript
import { readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { describe, test, expect } from "vitest";

const SITES_DIR = join(__dirname, "../../sites");
const BLOCKED_SCRIPTS = [
  "build",
  "type-check",
  "lint",
  "test",
  "test:watch",
  "test:e2e",
  "test:e2e:smoke",
  "validate:content",
  "validate:quality",
  "validate:all",
];

describe("test site package policy", () => {
  const testSites = existsSync(SITES_DIR)
    ? readdirSync(SITES_DIR).filter((d) => d.startsWith("test-"))
    : [];

  if (testSites.length === 0) {
    test.skip("no test sites present", () => {});
    return;
  }

  test.each(testSites)("%s has no CI-participating scripts", (site) => {
    const pkgPath = join(SITES_DIR, site, "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    const scripts = Object.keys(pkg.scripts ?? {});
    const violations = scripts.filter((s) => BLOCKED_SCRIPTS.includes(s));
    expect(violations).toEqual([]);
  });

  test.each(testSites)("%s has pipelineTestSite marker", (site) => {
    const pkgPath = join(SITES_DIR, site, "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    expect(pkg.pipelineTestSite).toBe(true);
  });
});
```

This test runs as part of `pnpm test` in the `tools` workspace. It auto-discovers any `sites/test-*` directories and verifies they conform to the policy. If someone manually reintroduces a `build` script, the test catches it.

**Verification gate:**

```bash
npx vitest run tools/__tests__/test-site-package-policy.test.ts
```

---

### Phase 6: End-to-End Validation

**Goal:** Verify the full pipeline produces a CI-safe test site from scratch.

#### Step 6.1: Run pipeline against a known URL

```bash
# On develop branch
/pipeline.ingest --url <test-url> --name test-canary
```

#### Step 6.2: Verify all acceptance criteria

```bash
# 1. Test site is CI-inert
node -e "const p = require('./sites/test-canary/package.json'); const bad = ['build','type-check','lint','test'].filter(s => p.scripts?.[s]); if (bad.length) process.exit(1); console.log('PASS');"

# 2. Lockfile is consistent
pnpm install --frozen-lockfile

# 3. Monorepo CI passes
pnpm build && pnpm type-check && pnpm lint

# 4. No bracket notation in generated components
! grep -rP "props\['" packages/themes/test-canary/components/

# 5. Theme package type-checks
cd packages/themes/test-canary && npx tsc --noEmit

# 6. Policy test passes
npx vitest run tools/__tests__/test-site-package-policy.test.ts
```

#### Step 6.3: Test kill-site cleanup

```bash
/pipeline.kill-site test-canary
/pipeline.kill-theme test-canary
pnpm install --frozen-lockfile  # Must succeed after cleanup
```

---

## Implementation Order (Summary)

| #   | Phase                           | Files                                                                                                                                       | Est. Complexity                           |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1   | Harden component generator      | `tools/lib/theme-component-generator.ts`, `tools/lib/theme-component-templates.ts`, `tools/lib/__tests__/theme-component-generator.test.ts` | Medium                                    |
| 2   | Fix React types in scaffolding  | `tools/lib/scaffold-theme-package.ts`                                                                                                       | Low                                       |
| 3   | Test site CI-inert package.json | `tools/lib/test-site-package.ts` (new), `.claude/commands/pipeline.ingest.md`                                                               | Low                                       |
| 4   | Lockfile hygiene                | `.claude/commands/pipeline.ingest.md`, `.claude/commands/pipeline.kill-site.md`                                                             | Low                                       |
| 5   | Policy regression test          | `tools/__tests__/test-site-package-policy.test.ts` (new)                                                                                    | Low                                       |
| 6   | E2E validation                  | Manual pipeline run                                                                                                                         | Low (but requires time for AI generation) |

---

## Risk Assessment

| Risk                                                                | Likelihood        | Impact                                | Mitigation                                                                          |
| ------------------------------------------------------------------- | ----------------- | ------------------------------------- | ----------------------------------------------------------------------------------- |
| AI still generates bracket notation despite prompt improvements     | High              | **None** — fixer + validator catch it | Post-processor is the real safety net; prompt is defense-in-depth                   |
| Broadened regex catches legitimate bracket access                   | Low               | Medium                                | Regex is constrained to `props['string-literal']` only; unit tests cover edge cases |
| `pnpm install --lockfile-only` fails in some environments           | Low               | Low                                   | Explicit fallback to full `pnpm install` in skill spec                              |
| Base-template adds new scripts that test sites should have          | Low               | Low                                   | Allowlist approach means new scripts are excluded by default — safe direction       |
| Skill spec instructions interpreted inconsistently by executing LLM | Medium            | Medium                                | Inline verification commands catch misexecution; policy test catches drift          |
| Generated theme package tsconfig missing React types                | Already happening | Medium                                | Phase 2 fixes this by replicating orion/vega tsconfig pattern                       |

---

## Files Modified (Complete Summary)

| File                                                    | Change                                                                                                     |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `tools/lib/theme-component-generator.ts`                | Broaden `fixBracketNotationProps()` regex, add `validateNoBracketProps()`, add interface consistency check |
| `tools/lib/theme-component-templates.ts`                | Update AI prompt with explicit forbidden bracket-notation examples                                         |
| `tools/lib/__tests__/theme-component-generator.test.ts` | New/append — unit tests for fixer, validator                                                               |
| `tools/lib/scaffold-theme-package.ts`                   | Ensure generated `tsconfig.json` has `"jsx": "react-jsx"` + `"types": ["react"]`                           |
| `tools/lib/test-site-package.ts`                        | **New** — `generateTestSitePackageJson()` utility with script allowlist + marker                           |
| `.claude/commands/pipeline.ingest.md`                   | Use package.json utility, add lockfile gate, add commit instruction                                        |
| `.claude/commands/pipeline.kill-site.md`                | Add `pnpm install --lockfile-only` lockfile reconciliation step                                            |
| `tools/__tests__/test-site-package-policy.test.ts`      | **New** — regression test: no CI scripts in `sites/test-*/package.json`                                    |
