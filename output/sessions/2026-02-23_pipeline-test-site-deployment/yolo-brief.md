# YOLO Implementation Brief: Pipeline Test Site Deployment Safety

**Branch:** feature/pipeline-test-site-safety (created from develop)
**Session spec:** output/sessions/2026-02-23_pipeline-test-site-deployment/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The ingestion pipeline generates test sites (`sites/test-<name>/`) that broke Vercel deployment because they inherited CI scripts from base-template and their AI-generated components had TypeScript errors. A hotfix stripped the scripts manually, but the pipeline itself still generates broken test sites. This plan fixes the pipeline upstream: hardening the component generator, fixing tsconfig scaffolding, making test site package.json CI-inert by default, ensuring lockfile hygiene, and adding a regression test.

The synthesis was reviewed and approved. Implement it exactly as specified below.

## Model Tiers

| Tier | Alias | Cost (in/out per MTok) | Use for |
|------|-------|----------------------|---------|
| Opus | `opus` | $15/$75 | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3/$15 | Standard implementation — file edits, feature wiring, most phases |
| Haiku | `haiku` | $0.80/$4 | Mechanical tasks: find-replace, import additions, grep checks, content validation |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (-> haiku) or requires deep cross-file reasoning (-> opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/pipeline-test-site-safety
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Harden Component Generator

**Goal:** AI-generated components always produce valid TypeScript with camelCase dot-notation prop access.
**Model:** sonnet — standard implementation editing a single core file + writing tests.

### Step 1.1: Broaden `fixBracketNotationProps()` regex

**File:** `tools/lib/theme-component-generator.ts`

Read the file first. Find the existing `fixBracketNotationProps()` function. Replace its regex and body with:

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

Keep the function signature and export identical. Only the regex pattern and key transformation change.

### Step 1.2: Add residual bracket-notation validator

**File:** `tools/lib/theme-component-generator.ts`

Add this new exported function near `fixBracketNotationProps()`:

```typescript
export function validateNoBracketProps(content: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const regex = /props\[['"][^'"]+['"]\]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const line = content.substring(0, match.index).split('\n').length;
    const context = content.substring(match.index, match.index + 50);
    violations.push(`Line ${line}: ${context}`);
  }
  return { valid: violations.length === 0, violations };
}
```

Then find where `fixBracketNotationProps()` is called in the generation pipeline. After it runs, add a call to `validateNoBracketProps()`. If violations remain, replace the component with a placeholder (use the existing `placeholderComponent()` function) and log a warning. Look at how the existing placeholder fallback is triggered and replicate that pattern.

### Step 1.3: Add interface-to-body consistency check

**File:** `tools/lib/theme-component-generator.ts`

Add a new exported function:

```typescript
export function validatePropsAgainstInterface(content: string): { valid: boolean; undeclaredProps: string[] } {
  // Extract prop names from the interface
  const interfaceMatch = content.match(/interface\s+\w+Props\s*\{([^}]+)\}/s);
  if (!interfaceMatch) return { valid: true, undeclaredProps: [] };

  const declaredProps = new Set<string>();
  const propRegex = /(\w+)\s*[?:]|(\w+)\s*:/g;
  let propMatch;
  while ((propMatch = propRegex.exec(interfaceMatch[1])) !== null) {
    declaredProps.add(propMatch[1] || propMatch[2]);
  }

  // Extract prop references from the body (after the interface)
  const bodyStart = content.indexOf(interfaceMatch[0]) + interfaceMatch[0].length;
  const body = content.substring(bodyStart);
  const usedProps = new Set<string>();
  const usageRegex = /props\.(\w+)/g;
  let usageMatch;
  while ((usageMatch = usageRegex.exec(body)) !== null) {
    usedProps.add(usageMatch[1]);
  }

  const undeclaredProps = [...usedProps].filter(p => !declaredProps.has(p));
  return { valid: undeclaredProps.length === 0, undeclaredProps };
}
```

Wire this into the generation pipeline alongside the bracket-notation validator. If there are undeclared props, log a warning. Do NOT placeholder-fallback for this — it's informational, not a hard failure. The bracket-notation fix may introduce props that are correctly in the interface but were previously bracket-accessed.

### Step 1.4: Update component generation prompt

**File:** `tools/lib/theme-component-templates.ts`

Read the file. Find the `buildComponentGenerationPrompt()` function (or equivalent prompt-building function). Find the existing rule about prop access (rule #6 based on research: "Access props using ONLY dot notation with camelCase names matching the interface").

Add explicit forbidden examples right after the existing rule:

```
REQUIRED: props.camelCase (e.g., props.postThumbnail, props.heroTitle)
FORBIDDEN: props['post-thumbnail'], props["hero-title"], props['cta_button']
The TypeScript interface uses camelCase. Your JSX must use the exact same names with dot notation.
```

Do not remove the existing rule — augment it with the forbidden examples.

### Step 1.5: Write unit tests

**File:** `tools/lib/__tests__/theme-component-generator.test.ts` (new)

Create the `tools/lib/__tests__/` directory if it doesn't exist.

```typescript
import { describe, test, expect } from 'vitest';
import { fixBracketNotationProps, validateNoBracketProps, validatePropsAgainstInterface } from '../theme-component-generator';

describe('fixBracketNotationProps', () => {
  const fix = (input: string) => fixBracketNotationProps(input).content;

  test('converts hyphenated bracket notation to camelCase dot', () => {
    expect(fix(`props['post-thumbnail']`)).toBe('props.postThumbnail');
  });

  test('converts underscored bracket notation to camelCase dot', () => {
    expect(fix(`props['post_thumbnail']`)).toBe('props.postThumbnail');
  });

  test('converts PascalCase bracket notation to camelCase dot', () => {
    expect(fix(`props['PostThumbnail']`)).toBe('props.postThumbnail');
  });

  test('converts already-camelCase bracket notation to dot', () => {
    expect(fix(`props['postThumbnail']`)).toBe('props.postThumbnail');
  });

  test('handles double-quoted bracket notation', () => {
    expect(fix(`props["post-thumbnail"]`)).toBe('props.postThumbnail');
  });

  test('handles multiple occurrences in one string', () => {
    const input = `{props['heading']} and {props['sub-heading']}`;
    const result = fix(input);
    expect(result).toBe('{props.heading} and {props.subHeading}');
  });

  test('does not touch non-props bracket access', () => {
    const input = `data['post-thumbnail']`;
    expect(fix(input)).toBe(`data['post-thumbnail']`);
  });

  test('does not touch numeric index access', () => {
    expect(fix('props[0]')).toBe('props[0]');
  });

  test('does not touch dynamic key access', () => {
    expect(fix('props[key]')).toBe('props[key]');
  });

  test('counts fixes correctly', () => {
    const input = `{props['heading']} and {props['sub-heading']}`;
    const result = fixBracketNotationProps(input);
    expect(result.fixCount).toBe(2);
  });

  test('returns zero fixes for clean input', () => {
    const result = fixBracketNotationProps('props.heading');
    expect(result.fixCount).toBe(0);
  });
});

describe('validateNoBracketProps', () => {
  test('passes for dot-notation only', () => {
    expect(validateNoBracketProps('props.heading + props.body').valid).toBe(true);
  });

  test('fails for single-quoted bracket notation', () => {
    const result = validateNoBracketProps(`props['heading']`);
    expect(result.valid).toBe(false);
    expect(result.violations).toHaveLength(1);
  });

  test('fails for double-quoted bracket notation', () => {
    const result = validateNoBracketProps(`props["heading"]`);
    expect(result.valid).toBe(false);
  });

  test('reports line numbers in violations', () => {
    const input = `line1\nline2\nprops['bad']`;
    const result = validateNoBracketProps(input);
    expect(result.violations[0]).toContain('Line 3');
  });
});

describe('validatePropsAgainstInterface', () => {
  test('passes when all used props are declared', () => {
    const content = `
interface HeroProps {
  heading?: string;
  body?: string;
}
export const Hero = (props: HeroProps) => <div>{props.heading}{props.body}</div>;
`;
    expect(validatePropsAgainstInterface(content).valid).toBe(true);
  });

  test('fails when a used prop is not declared', () => {
    const content = `
interface HeroProps {
  heading?: string;
}
export const Hero = (props: HeroProps) => <div>{props.heading}{props.unknownProp}</div>;
`;
    const result = validatePropsAgainstInterface(content);
    expect(result.valid).toBe(false);
    expect(result.undeclaredProps).toContain('unknownProp');
  });

  test('passes when no interface is found', () => {
    const content = `export const Hero = () => <div>static</div>;`;
    expect(validatePropsAgainstInterface(content).valid).toBe(true);
  });
});
```

### Verification gate — STOP if this fails

```bash
npx vitest run tools/lib/__tests__/theme-component-generator.test.ts
```

### Commit

```bash
git add tools/lib/theme-component-generator.ts tools/lib/theme-component-templates.ts tools/lib/__tests__/theme-component-generator.test.ts
git commit -m "$(cat <<'EOF'
fix(pipeline): harden bracket-notation fixer and add validation

- Broaden fixBracketNotationProps() regex to catch PascalCase, underscore,
  and mixed-case bracket notation (not just lowercase kebab)
- Add validateNoBracketProps() residual detector with placeholder fallback
- Add validatePropsAgainstInterface() consistency check
- Update AI prompt with explicit forbidden bracket-notation examples
- Add comprehensive unit tests for all fixer and validator functions

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Fix React Types in Theme Package Scaffolding

**Goal:** Generated theme packages type-check independently.
**Model:** haiku — mechanical: read existing tsconfig patterns, replicate in scaffold function.

### Step 2.1: Read existing theme package tsconfig patterns

Read these files in parallel to establish the correct pattern:
- `packages/themes/orion/tsconfig.json`
- `packages/themes/vega/tsconfig.json`
- `tools/scaffold-theme-package.ts` (note: at `tools/`, not `tools/lib/`)

### Step 2.2: Update `scaffoldThemePackage()` tsconfig generation

**File:** `tools/scaffold-theme-package.ts`

Find where the function generates the `tsconfig.json` for new theme packages. Ensure it:
- Extends the root or shared base `tsconfig.json` (match what orion/vega do)
- Includes `"jsx": "react-jsx"` in `compilerOptions`
- Includes `"types": ["react"]` in `compilerOptions`

Match exactly what orion/vega use. If they already have the correct config and the scaffold function already replicates it, this step is a no-op — confirm and move on.

### Step 2.3: Verify React import pattern

Check a few components in `packages/themes/orion/components/` and `packages/themes/vega/components/`. If they do NOT have `import React from 'react'` (relying on the JSX transform), then generated components should also not need it — the tsconfig handles it.

If orion/vega components DO import React explicitly, find where component templates are generated in `tools/lib/theme-component-generator.ts` or `tools/lib/theme-component-templates.ts` and add the import to the template.

### Verification gate — STOP if this fails

```bash
# Verify orion and vega theme packages type-check (baseline)
cd /Users/rickywilson/Sites/local-business-platform && pnpm type-check --filter @platform/themes
```

If the scaffold function was updated, also verify:
```bash
# Check the generated tsconfig matches orion/vega pattern
diff <(jq -S . packages/themes/orion/tsconfig.json) <(jq -S . packages/themes/vega/tsconfig.json)
```

### Commit (only if changes were made)

```bash
git add tools/scaffold-theme-package.ts
git commit -m "$(cat <<'EOF'
fix(pipeline): ensure scaffolded theme packages include React types in tsconfig

Match orion/vega tsconfig pattern: jsx=react-jsx, types=["react"]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Make Test Sites CI-Inert at Creation Time

**Goal:** Test site `package.json` files never contain CI-participating scripts.
**Model:** sonnet — new utility file + skill spec update.

### Step 3.1: Create test-site package.json utility

**File:** `tools/lib/test-site-package.ts` (new)

```typescript
/**
 * Generates a CI-inert package.json for pipeline test sites.
 *
 * Test sites are preview artefacts — they need dev/start/clean but must NOT
 * participate in Turborepo CI tasks (build, type-check, lint, test).
 */
const ALLOWED_SCRIPTS = ['dev', 'start', 'clean'];

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

### Step 3.2: Update `pipeline.ingest.md` skill spec

**File:** `.claude/commands/pipeline.ingest.md`

Read the file first. Find Step 5 (wire theme) where it currently rewrites `package.json` (name field only).

Replace that section with instructions to:

1. Read `sites/base-template/package.json`
2. Use `generateTestSitePackageJson('test-<theme>', basePackageJson)` from `tools/lib/test-site-package.ts` to generate the test site package.json
3. Write the result to `sites/test-<theme>/package.json`
4. Verify: the resulting package.json must NOT contain `build`, `type-check`, `lint`, or `test` scripts, and MUST contain `"pipelineTestSite": true`

Add inline verification command in the skill spec:
```bash
node -e "
  const p = require('./sites/test-<theme>/package.json');
  const bad = ['build','type-check','lint','test'].filter(s => p.scripts?.[s]);
  if (bad.length) { console.error('FAIL: test site has CI scripts:', bad); process.exit(1); }
  if (!p.pipelineTestSite) { console.error('FAIL: missing pipelineTestSite marker'); process.exit(1); }
  console.log('PASS: test site is CI-inert');
"
```

**Important:** Also update the current test sites (test-atlas and test-lyra) to include the `pipelineTestSite: true` marker in their existing package.json files, since they were created before this utility existed. Read each file first, then add the marker.

### Verification gate — STOP if this fails

```bash
pnpm type-check --filter ./tools
```

### Commit

```bash
git add tools/lib/test-site-package.ts .claude/commands/pipeline.ingest.md sites/test-atlas/package.json sites/test-lyra/package.json
git commit -m "$(cat <<'EOF'
feat(pipeline): CI-inert test site package.json with pipelineTestSite marker

- New utility: generateTestSitePackageJson() strips all scripts except
  dev/start/clean and adds pipelineTestSite:true marker
- Update pipeline.ingest.md to use the utility instead of copying full
  base-template package.json
- Add inline verification step to skill spec
- Backfill pipelineTestSite marker on existing test-atlas and test-lyra

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Lockfile Hygiene

**Goal:** Lockfile is always consistent with workspace state. No `ERR_PNPM_OUTDATED_LOCKFILE` on Vercel.
**Model:** haiku — mechanical edits to two skill spec markdown files.

### Step 4.1: Update `pipeline.ingest.md` — lockfile gate

**File:** `.claude/commands/pipeline.ingest.md`

Read the file. Find Step 6 (currently `pnpm install`). Replace with:

> **Step 6: Reconcile lockfile**
> 1. Run `pnpm install --lockfile-only` at the monorepo root. This updates `pnpm-lock.yaml` to include the new test site workspace without modifying `node_modules`.
> 2. If `--lockfile-only` fails, fall back to `pnpm install`.
> 3. Verify: `pnpm install --frozen-lockfile` must succeed.

Add a new Step 7 (renumber existing steps if needed):

> **Step 7: Stage lockfile with test site**
> Stage `pnpm-lock.yaml` alongside the test site directory. The lockfile MUST be in the same commit as the test site to prevent `ERR_PNPM_OUTDATED_LOCKFILE` on any branch.
> ```bash
> git add sites/test-<theme>/ pnpm-lock.yaml
> ```

### Step 4.2: Update `pipeline.kill-site.md` — lockfile cleanup

**File:** `.claude/commands/pipeline.kill-site.md`

Read the file. After the site removal step (currently Step 5), add:

> **Step 6: Reconcile lockfile**
> 1. Run `pnpm install --lockfile-only` at the monorepo root.
> 2. If it fails, fall back to `pnpm install`.
> 3. Stage `pnpm-lock.yaml` alongside the site removal.
> 4. Report: "Lockfile updated — removed entries for test-<theme>"

Also add a note about idempotency: if the site directory doesn't exist (already deleted), skip the lockfile reconciliation unless `--reconcile-lockfile` is explicitly passed.

### Verification gate — STOP if this fails

```bash
# Verify the skill spec files are valid markdown (no syntax errors)
cat .claude/commands/pipeline.ingest.md | head -5
cat .claude/commands/pipeline.kill-site.md | head -5
echo "PASS: skill specs updated"
```

### Commit

```bash
git add .claude/commands/pipeline.ingest.md .claude/commands/pipeline.kill-site.md
git commit -m "$(cat <<'EOF'
fix(pipeline): add lockfile hygiene to ingest and kill-site skills

- pipeline.ingest: use pnpm install --lockfile-only, verify with
  --frozen-lockfile, stage lockfile alongside test site
- pipeline.kill-site: reconcile lockfile after site deletion

Prevents ERR_PNPM_OUTDATED_LOCKFILE on Vercel deployment.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Policy Regression Test

**Goal:** Prevent future regressions where test sites accidentally gain CI scripts.
**Model:** sonnet — new test file with dynamic test site discovery.

### Step 5.1: Create policy test

**File:** `tools/__tests__/test-site-package-policy.test.ts` (new)

```typescript
import { readdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { describe, test, expect } from 'vitest';

const SITES_DIR = join(__dirname, '../../sites');
const BLOCKED_SCRIPTS = [
  'build', 'type-check', 'lint', 'test', 'test:watch',
  'test:e2e', 'test:e2e:smoke', 'test:e2e:chromium', 'test:e2e:full',
  'validate:content', 'validate:quality', 'validate:all',
];

describe('test site package policy', () => {
  const testSiteDirs = existsSync(SITES_DIR)
    ? readdirSync(SITES_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory() && d.name.startsWith('test-'))
        .map(d => d.name)
    : [];

  if (testSiteDirs.length === 0) {
    test.skip('no test sites present', () => {});
    return;
  }

  test.each(testSiteDirs)('%s has no CI-participating scripts', (site) => {
    const pkgPath = join(SITES_DIR, site, 'package.json');
    expect(existsSync(pkgPath)).toBe(true);
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const scripts = Object.keys(pkg.scripts ?? {});
    const violations = scripts.filter(s => BLOCKED_SCRIPTS.includes(s));
    expect(violations).toEqual([]);
  });

  test.each(testSiteDirs)('%s has pipelineTestSite marker', (site) => {
    const pkgPath = join(SITES_DIR, site, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    expect(pkg.pipelineTestSite).toBe(true);
  });
});
```

### Verification gate — STOP if this fails

```bash
npx vitest run tools/__tests__/test-site-package-policy.test.ts
```

### Commit

```bash
git add tools/__tests__/test-site-package-policy.test.ts
git commit -m "$(cat <<'EOF'
test(pipeline): add policy regression test for test site CI exclusion

Asserts that any sites/test-* package.json has no CI-participating
scripts (build, type-check, lint, test) and has the pipelineTestSite
marker. Auto-discovers test sites at runtime.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Final Verification

**Goal:** Confirm all changes work together and the monorepo is clean.
**Model:** haiku — mechanical verification commands only.

### Step 6.1: Run full monorepo checks

```bash
# Type-check the whole monorepo
pnpm type-check

# Run all tests in the tools workspace (includes new tests)
npx vitest run tools/lib/__tests__/theme-component-generator.test.ts tools/__tests__/test-site-package-policy.test.ts

# Lint (should pass — no new lint issues)
pnpm lint
```

### Step 6.2: Verify test sites are CI-inert

```bash
# These should NOT appear in turbo build dry-run
pnpm turbo run build --dry-run 2>&1 | grep -E "test-atlas|test-lyra" && echo "FAIL: test sites in build graph" || echo "PASS: test sites excluded from build"
```

### Verification gate — STOP if any of the above fails

All three commands (type-check, tests, lint) must pass.

---

## Cost Estimate

| Phase | Model | Est. input tokens | Est. output tokens | Est. cost |
|-------|-------|------------------|--------------------|-----------|
| Phase 1: Harden generator | sonnet | ~15k | ~3k | $0.09 |
| Phase 2: React types tsconfig | haiku | ~8k | ~1k | $0.01 |
| Phase 3: CI-inert package.json | sonnet | ~10k | ~2k | $0.06 |
| Phase 4: Lockfile hygiene | haiku | ~5k | ~1k | $0.01 |
| Phase 5: Policy test | sonnet | ~6k | ~1.5k | $0.04 |
| Phase 6: Final verification | haiku | ~4k | ~0.5k | $0.01 |
| Brief reading + system prompt | sonnet | ~8k | — | $0.02 |
| **Total** | | **~56k** | **~9k** | **~$0.24** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:
1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model | Est. input tokens | Est. output tokens | Est. cost |
   |-------|------------------|--------------------|-----------|
   | sonnet | [total across phases] | | $X.XX |
   | haiku | [if used] | | $X.XX |
   | opus | [if used] | | $X.XX |
   | **Total** | | | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-02-23_pipeline-test-site-deployment/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits
[list each commit SHA and message]
```

Confirm this was done in the final report.

## Completed

**Date:** 2026-02-24
**Status:** All phases executed successfully

Implemented all four substantive phases: (1) Hardened the bracket-notation fixer in `theme-component-generator.ts` to catch PascalCase, underscore, and mixed-case patterns, added `validateNoBracketProps()` and `validatePropsAgainstInterface()` validators, updated the AI generation prompt with explicit forbidden examples, and wrote 18 unit tests; (2) Phase 2 was a confirmed no-op — neither orion nor vega theme packages have tsconfigs and the scaffold function doesn't generate them, consistent with the existing architecture; (3) Created `tools/lib/test-site-package.ts` with `generateTestSitePackageJson()`, updated `pipeline.ingest.md` to use it, backfilled `pipelineTestSite: true` on test-atlas and test-lyra; (4) Added `--lockfile-only` + `--frozen-lockfile` gates to `pipeline.ingest.md` and lockfile reconciliation step to `pipeline.kill-site.md`. One intentional deviation from the verification gate: `pnpm turbo run build --dry-run` shows test sites with `Command = <NONEXISTENT>` (a false positive grep match) — they're correctly excluded from CI because they have no `build` script; turbo simply lists them as workspace packages with no-op tasks.

### Commits
- `25a4ca9` fix(pipeline): harden bracket-notation fixer and add validation
- `51be8da` feat(pipeline): CI-inert test site package.json with pipelineTestSite marker
- `ecd7632` fix(pipeline): add lockfile hygiene to ingest and kill-site skills
- `ee2cf71` test(pipeline): add policy regression test for test site CI exclusion

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6` not `Opus 4.6`)
