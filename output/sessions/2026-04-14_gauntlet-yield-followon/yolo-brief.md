# YOLO Implementation Brief: Gauntlet Yield Follow-On (3 Improvements)

**Branch:** feature/gauntlet-yield-followon (created from develop)
**Session spec:** output/sessions/2026-04-14_gauntlet-yield-followon/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

After the April 2026 gauntlet yield improvement (45%→91%), three follow-on tasks were identified:

1. **`--out` flag for `extract-theme.ts`** — test runs currently overwrite the real theme package; `--out /tmp/corvus-test` would isolate them
2. **Semantic type-checking pass** — the gauntlet only catches parse errors; `.map()` on a string prop, object-as-ReactNode etc. slip through silently and fail `next build`
3. **Extended hex auto-repair** — SVG `fill`/`stroke` attributes and Tailwind arbitrary-value classes (`bg-[#xxx]`) bypass the current auto-repair and cause hard-fails

These are independent and implemented in sequence below.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless clearly mechanical (→ haiku) or deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/gauntlet-yield-followon
pnpm type-check   # must be clean before starting
```

---

## Phase 1: `--out` flag for `extract-theme.ts`

**Goal:** Add an optional `--out <dir>` CLI flag that redirects all theme package output to the specified directory instead of `packages/themes/<name>/`. Enables isolated test runs without overwriting the committed theme.
**Model:** haiku — 8-line mechanical change to arg parsing + themeDir assignment

**File:** `tools/extract-theme.ts`

**Step 1a — Extend `parseArgs()` return type and loop.** Currently at line 30:

```typescript
function parseArgs(): { clone?: string; brief?: string; pass?: string; verify?: boolean } {
```

And the loop body (lines 34–38) handles `--clone`, `--brief`, `--pass`, `--verify`.

Add `out?: string` to the return type and one `else if` branch in the loop:

```typescript
function parseArgs(): {
  clone?: string;
  brief?: string;
  pass?: string;
  verify?: boolean;
  out?: string;
} {
  const args = process.argv.slice(2);
  const result: { clone?: string; brief?: string; pass?: string; verify?: boolean; out?: string } =
    {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--clone" && args[i + 1]) result.clone = args[++i];
    else if (args[i] === "--brief" && args[i + 1]) result.brief = args[++i];
    else if (args[i] === "--pass" && args[i + 1]) result.pass = args[++i];
    else if (args[i] === "--out" && args[i + 1]) result.out = args[++i];
    else if (args[i] === "--verify") result.verify = true;
  }
  return result;
}
```

**Step 1b — Override `themeDir` after line 424.** Currently:

```typescript
const themeDir = path.resolve(`packages/themes/${themeName}`);
```

Replace with:

```typescript
const defaultThemeDir = path.resolve(`packages/themes/${themeName}`);
const themeDir = args.out ? path.resolve(args.out) : defaultThemeDir;

if (args.out) {
  fs.mkdirSync(themeDir, { recursive: true });
}
```

The `console.log(` Theme: ${themeDir}`)` line at ~443 already references `themeDir` and will automatically print the overridden path. No change needed there.

**Step 1c — Update the file-level usage comment** at the top of the file (lines 8–10). Add the new flag:

```
*   npx tsx tools/extract-theme.ts --clone corvus --pass translate --out /tmp/corvus-test
```

**Verification gate — STOP if this fails:**

```bash
# Dry-run: check the flag parses without error
npx tsx tools/extract-theme.ts --help 2>&1 || true
pnpm type-check
```

**Commit:**

```bash
git add tools/extract-theme.ts
git commit -m "feat(pipeline): add --out flag to extract-theme.ts for isolated test runs

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2: Semantic TypeScript type-checking pass

**Goal:** After the existing parse-only syntax check passes, run a full semantic type check (using `ts.createProgram` + `ts.getPreEmitDiagnostics`) that catches errors like `.map()` on a string prop and object-as-ReactNode. Route semantic errors through the existing `retryWithSyntaxErrors` repair path.
**Model:** sonnet — new module-level constants + new function + new gauntlet block

**File:** `tools/lib/theme-component-generator.ts`

**Step 2a — Add module-level constants.** After the import block (before the first function definition), add:

```typescript
// ============================================================================
// Semantic type-checking constants
// ============================================================================

/** Error codes to suppress from semantic diagnostics (import-resolution and JSX noise). */
const SEMANTIC_SKIP_CODES = new Set<number>([
  2307, // Cannot find module 'x'
  2304, // Cannot find name (cascades from unresolved imports)
  7016, // Could not find declaration file for module
  2792, // Cannot find module or its type declarations
  7026, // JSX element implicitly 'any' (without @types/react)
  17004, // Cannot use JSX unless '--jsx' flag is provided
]);

/** Compiler options for semantic validation. noEmit + skipLibCheck for speed. */
const SEMANTIC_COMPILER_OPTIONS: ts.CompilerOptions = {
  jsx: ts.JsxEmit.React,
  strict: true,
  skipLibCheck: true,
  noEmit: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.CommonJS,
  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
  typeRoots: [path.resolve(process.cwd(), "packages/core-components/node_modules/@types")],
  types: ["react"],
};
```

**Step 2b — Add `validateTypeScriptSemantic` function.** Add it directly below the existing `validateTypeScriptSyntax` function (after line ~80):

```typescript
/**
 * Run a full TypeScript semantic type check on generated component content.
 * Catches errors that the parse-only check misses: .map() on string props,
 * objects rendered as ReactNode, required prop mismatches, etc.
 * Returns an array of error strings, filtered to suppress import-resolution noise.
 */
function validateTypeScriptSemantic(content: string, fileName: string): string[] {
  const sourceFile = ts.createSourceFile(
    fileName,
    content,
    ts.ScriptTarget.ES2022,
    true,
    ts.ScriptKind.TSX
  );

  const defaultHost = ts.createCompilerHost(SEMANTIC_COMPILER_OPTIONS);
  const customHost: ts.CompilerHost = {
    ...defaultHost,
    getSourceFile: (name, lang) =>
      name === fileName ? sourceFile : defaultHost.getSourceFile(name, lang),
    fileExists: (f) => f === fileName || defaultHost.fileExists(f),
    readFile: (f) => (f === fileName ? content : defaultHost.readFile(f)),
  };

  const program = ts.createProgram([fileName], SEMANTIC_COMPILER_OPTIONS, customHost);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  return Array.from(diagnostics)
    .filter((d) => !SEMANTIC_SKIP_CODES.has(d.code))
    .map((d) => {
      const line = d.file ? `:${d.file.getLineAndCharacterOfPosition(d.start ?? 0).line + 1}` : "";
      return `[TS${d.code}]${line} ${ts.flattenDiagnosticMessageText(d.messageText, " ")}`;
    });
}
```

**Step 2c — Add semantic check block to gauntlet.** In `generateSingleComponent`, find the point immediately after the syntax check block finishes (after the block handling `syntaxErrors.length > 0`) and immediately before the `// Post-generation: Token class validation with auto-replace` comment. Both are inside the outer `if (jsxBody)` / `if (usedAI)` guards.

Add this new block:

```typescript
// Post-generation: Semantic type check
if (usedAI) {
  const semanticErrors = validateTypeScriptSemantic(content, blueprint.componentFileName);
  if (semanticErrors.length > 0) {
    warnings.push(`${blueprint.name}: TS semantic errors: ${semanticErrors.join("; ")}`);
    // Targeted repair: show AI the broken content + exact semantic errors
    const fixedContent = await retryWithSyntaxErrors(client, blueprint, content, semanticErrors);
    if (fixedContent) {
      if (!verifyNamedExport(fixedContent, blueprint.componentExportName)) {
        warnings.push(
          `${blueprint.name}: Semantic-fix retry changed export name — using placeholder`
        );
        content = placeholderComponent(blueprint);
        usedAI = false;
      } else {
        const retryErrors = validateTypeScriptSemantic(fixedContent, blueprint.componentFileName);
        if (retryErrors.length > 0) {
          warnings.push(`${blueprint.name}: Semantic-fix retry also failed — using placeholder`);
          content = placeholderComponent(blueprint);
          usedAI = false;
        } else {
          warnings.push(`${blueprint.name}: Semantic-fix retry succeeded`);
          content = fixedContent;
        }
      }
    } else {
      // retryWithSyntaxErrors returned null (content > 10k or API error)
      warnings.push(
        `${blueprint.name}: Semantic errors, content too large to retry — using placeholder`
      );
      content = placeholderComponent(blueprint);
      usedAI = false;
    }
  }
}
```

**Note:** No blind-regeneration fallback here (unlike the syntax retry path). Semantic errors are specific; blind regeneration is unlikely to help and wastes tokens. Placeholder is the right outcome if the targeted fix fails.

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
# Run unit tests
npx vitest run tools/__tests__/theme-component-generator.test.ts
```

**Commit:**

```bash
git add tools/lib/theme-component-generator.ts
git commit -m "feat(pipeline): add semantic TypeScript type-checking pass to gauntlet

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3: Extended hex literal auto-repair

**Goal:** Extend `autoRepairHexLiterals()` to cover SVG `fill`/`stroke` JSX attributes, additional inline-style camelCase properties (`background`, `fill`, `stroke`), and Tailwind arbitrary-value color classes (`bg-[#xxx]`). Also widen all hex patterns from `{3,6}` to `{3,8}` to catch 8-digit hex (with alpha channel).
**Model:** haiku — mechanical regex additions + test file additions

**File:** `tools/lib/theme-component-generator.ts`

**Step 3a — Hoist `TOKEN_MAP` to module level.** Before the `autoRepairHexLiterals` function (after `autoRepairHexLiterals` is defined, or just before it), add as a module-level const:

```typescript
/** Maps Tailwind color utility prefixes to nearest named theme token class. */
const ARBITRARY_COLOR_TOKEN_MAP: Record<string, string> = {
  bg: "bg-brand-primary",
  text: "text-surface-foreground",
  border: "border-brand-primary",
  ring: "ring-brand-primary",
  fill: "fill-none",
  stroke: "stroke-1",
  from: "from-brand-primary",
  via: "via-brand-primary",
  to: "to-brand-primary",
  outline: "outline-none",
  shadow: "shadow",
  accent: "accent-brand-primary",
  caret: "caret-brand-primary",
  decoration: "decoration-brand-primary",
};
```

**Step 3b — Rewrite `autoRepairHexLiterals()`.** The full replacement:

```typescript
function autoRepairHexLiterals(tsx: string): { content: string; replacements: number } {
  let replacements = 0;

  const fixed = tsx
    // Inline style: camelCase backgroundColor / color / borderColor (existing)
    .replace(/backgroundColor:\s*["']#[0-9A-Fa-f]{3,8}["']/g, () => {
      replacements++;
      return 'backgroundColor: "var(--color-brand-primary)"';
    })
    .replace(/\bcolor:\s*["']#[0-9A-Fa-f]{3,8}["']/g, () => {
      replacements++;
      return 'color: "var(--color-surface-foreground)"';
    })
    .replace(/borderColor:\s*["']#[0-9A-Fa-f]{3,8}["']/g, () => {
      replacements++;
      return 'borderColor: "var(--color-surface-border)"';
    })
    // Inline style: background (longhand)
    .replace(/\bbackground:\s*["']#[0-9A-Fa-f]{3,8}["']/g, () => {
      replacements++;
      return 'background: "var(--color-brand-primary)"';
    })
    // Inline style: fill / stroke (SVG in style object)
    .replace(/\bfill:\s*["']#[0-9A-Fa-f]{3,8}["']/g, () => {
      replacements++;
      return 'fill: "currentColor"';
    })
    .replace(/\bstroke:\s*["']#[0-9A-Fa-f]{3,8}["']/g, () => {
      replacements++;
      return 'stroke: "currentColor"';
    })
    // SVG JSX attributes: fill="#xxx" stroke="#xxx"
    .replace(/\bfill="#[0-9A-Fa-f]{3,8}"/g, () => {
      replacements++;
      return 'fill="currentColor"';
    })
    .replace(/\bstroke="#[0-9A-Fa-f]{3,8}"/g, () => {
      replacements++;
      return 'stroke="currentColor"';
    })
    // Tailwind arbitrary-value color classes: bg-[#xxx], text-[#xxx], etc.
    .replace(
      /\b(bg|text|border|ring|fill|stroke|from|via|to|outline|shadow|accent|caret|decoration)-\[#[0-9A-Fa-f]{3,8}\]/g,
      (_match, prefix: string) => {
        replacements++;
        return ARBITRARY_COLOR_TOKEN_MAP[prefix] ?? `${prefix}-brand-primary`;
      }
    );

  return { content: fixed, replacements };
}
```

**Step 3c — Export `autoRepairHexLiterals`.** Add the `export` keyword to the function declaration so it can be unit tested:

```typescript
export function autoRepairHexLiterals(tsx: string): { content: string; replacements: number } {
```

**File:** `tools/__tests__/theme-component-generator.test.ts`

**Step 3d — Add unit tests.** Import `autoRepairHexLiterals` at the top of the test file alongside existing imports, then add a new `describe` block:

```typescript
import { autoRepairHexLiterals /* existing imports */ } from "../lib/theme-component-generator";

describe("autoRepairHexLiterals", () => {
  it("replaces SVG fill attribute", () => {
    const { content, replacements } = autoRepairHexLiterals('<path fill="#eb1d64" d="M0 0" />');
    expect(content).toBe('<path fill="currentColor" d="M0 0" />');
    expect(replacements).toBe(1);
  });

  it("replaces SVG stroke attribute", () => {
    const { content, replacements } = autoRepairHexLiterals('<circle stroke="#07ab55" />');
    expect(content).toBe('<circle stroke="currentColor" />');
    expect(replacements).toBe(1);
  });

  it("replaces fill in style object", () => {
    const { content, replacements } = autoRepairHexLiterals('style={{ fill: "#eb1d64" }}');
    expect(content).toBe('style={{ fill: "currentColor" }}');
    expect(replacements).toBe(1);
  });

  it("replaces stroke in style object", () => {
    const { content, replacements } = autoRepairHexLiterals('style={{ stroke: "#07ab55" }}');
    expect(content).toBe('style={{ stroke: "currentColor" }}');
    expect(replacements).toBe(1);
  });

  it("replaces Tailwind bg-[#xxx] arbitrary class", () => {
    const { content, replacements } = autoRepairHexLiterals('className="bg-[#fff] px-4"');
    expect(content).toBe('className="bg-brand-primary px-4"');
    expect(replacements).toBe(1);
  });

  it("replaces Tailwind text-[#xxx] arbitrary class", () => {
    const { content, replacements } = autoRepairHexLiterals('className="text-[#1a2b3c]"');
    expect(content).toBe('className="text-surface-foreground"');
    expect(replacements).toBe(1);
  });

  it("replaces Tailwind border-[#xxx] arbitrary class", () => {
    const { content, replacements } = autoRepairHexLiterals('className="border-[#aabbcc]"');
    expect(content).toBe('className="border-brand-primary"');
    expect(replacements).toBe(1);
  });

  it("handles 8-digit hex (alpha channel)", () => {
    const { content, replacements } = autoRepairHexLiterals('<path fill="#eb1d6480" />');
    expect(content).toBe('<path fill="currentColor" />');
    expect(replacements).toBe(1);
  });

  it("repairs multiple contexts in one pass", () => {
    const input = `
      <path fill="#eb1d64" />
      <div style={{ backgroundColor: "#1a2b3c" }} className="text-[#fff]" />
    `;
    const { content, replacements } = autoRepairHexLiterals(input);
    expect(content).not.toContain("#");
    expect(replacements).toBe(3);
  });

  it("does NOT repair CSS custom property hex (returns unchanged)", () => {
    const input = `style={{ '--nav-color': '#eb1d64' }}`;
    const { content, replacements } = autoRepairHexLiterals(input);
    expect(content).toContain("#eb1d64"); // not repaired
    expect(replacements).toBe(0);
  });
});
```

**Verification gate — STOP if any fail:**

```bash
pnpm type-check
npx vitest run tools/__tests__/theme-component-generator.test.ts
```

**Commit:**

```bash
git add tools/lib/theme-component-generator.ts tools/__tests__/theme-component-generator.test.ts
git commit -m "feat(pipeline): extend hex auto-repair to SVG attributes and Tailwind arbitrary classes

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 4: End-to-end smoke test

**Goal:** Re-run `--pass translate` against the corvus clone using the new `--out` flag. Confirm the test writes to an isolated dir, that the yield is maintained or improved (NavDarkBar may now pass), and that `pnpm type-check` is clean.
**Model:** sonnet — runs the pipeline and interprets results

```bash
npx tsx tools/extract-theme.ts --clone corvus --pass translate --out /tmp/corvus-test-yield
```

Check: files written to `/tmp/corvus-test-yield/` only, NOT to `packages/themes/corvus/`. Count `(AI)` vs `(placeholder)` in the output. Expected: 10/11 maintained, possibly 11/11 if NavDarkBar's SVG fills were the only blocker.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

Clean up:

```bash
rm -rf /tmp/corvus-test-yield
```

**Commit:**

```bash
git add -A
git commit -m "chore(pipeline): e2e smoke test of gauntlet follow-on improvements

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                                                         | File overlap     | Model | Rationale                                  |
| ----- | ------- | ----------------------------------------------------------------------------- | ---------------- | ----- | ------------------------------------------ |
| G1    | Phase 1 | — no parallel work in this phase —                                            | —                | —     | Single file, 8-line change                 |
| G2    | Phase 2 | Read `theme-component-generator.ts` before editing                            | none (read only) | n/a   | Read before edit; single file              |
| G3    | Phase 3 | Edit `theme-component-generator.ts`, Edit `theme-component-generator.test.ts` | different files  | haiku | Different files — can parallel Task agents |
| G4    | Phase 3 | Run `pnpm type-check`, Run `npx vitest run ...test.ts`                        | none (read-only) | n/a   | Independent verification commands          |
| G5    | Phase 4 | — no parallel work in this phase —                                            | —                | —     | Sequential: pipeline run → type-check      |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                   | Reason                                                      |
| -------------------------------------- | ----------------------------------------------------------- |
| Verification gates between phases      | Each phase gates the next                                   |
| Git commits                            | One commit per phase, in order                              |
| Phase 4 pipeline run → type-check      | Must write output before type-checking it                   |
| Phase 2 semantic check block placement | Must read existing gauntlet flow before inserting new block |

---

## Cost Estimate

| Phase                        | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: --out flag          | haiku  | ~5k               | ~0.3k              | ~$0.002    |
| Phase 2: Semantic type check | sonnet | ~10k              | ~2k                | ~$0.06     |
| Phase 3: Extended hex repair | haiku  | ~8k               | ~2k                | ~$0.007    |
| Phase 4: E2E smoke test      | sonnet | ~15k              | ~1k                | ~$0.06     |
| **Total**                    |        | **~38k**          | **~5.3k**          | **~$0.13** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. `--out` flag verified — confirm `/tmp/corvus-test-yield/` received files, `packages/themes/corvus/` unchanged
3. Yield after smoke test — X/11 AI-generated
4. NavDarkBar outcome — did SVG fill repair resolve it?
5. Build status — confirm `pnpm type-check` and `vitest run` pass
6. Any deviations from the plan
7. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    |                   |                    | $X.XX     |
   | haiku     |                   |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-14_gauntlet-yield-followon/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, NavDarkBar outcome, any surprises]

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

## Completed

**Date:** 2026-04-15
**Status:** All phases executed successfully

All three improvements were implemented cleanly. Phase 1 added the `--out` flag to `extract-theme.ts` with a 1-line mkdirSync guard. Phase 2 added `validateTypeScriptSemantic` (using `ts.createProgram` + `getPreEmitDiagnostics`) with import-resolution noise suppressed via `SEMANTIC_SKIP_CODES`, wired into the gauntlet after the syntax check block using the existing `retryWithSyntaxErrors` repair path. Phase 3 rewrote `autoRepairHexLiterals` to cover SVG JSX attributes (`fill`/`stroke`), inline-style longhand properties, Tailwind arbitrary-value classes, and 8-digit hex (alpha channel), plus exported it and added 10 unit tests (all passing). The E2E smoke test confirmed isolation: files wrote to `/tmp/corvus-test-yield/` only and `packages/themes/corvus/` had no git-tracked changes. NavDarkBar could not be tested because `ANTHROPIC_API_KEY` is not set in this environment — all components ran as placeholders. The SVG fill repair logic is in place and will benefit future runs with a live API key.

### Commits

- `ffe5ba9` feat(pipeline): add --out flag to extract-theme.ts for isolated test runs
- `842bc40` Merge branch 'feature/gauntlet-yield' into feature/gauntlet-yield-followon
- `8271415` feat(pipeline): add semantic TypeScript type-checking pass to gauntlet
- `a076392` feat(pipeline): extend hex auto-repair to SVG attributes and Tailwind arbitrary classes
- `498c026` chore(pipeline): e2e smoke test of gauntlet follow-on improvements

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially.**
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (`Claude Sonnet 4.6`)
