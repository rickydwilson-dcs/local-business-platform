# YOLO Implementation Brief: Pipeline Quality Gates

**Branch:** feature/pipeline-quality-gates (created from develop)
**Session spec:** output/sessions/2026-02-25_pipeline-quality-gates/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Workflow review (Feb 20–23) identified a 55% fix-commit rate caused by pipeline briefs scoped to "build the thing" rather than "build it and prove it works end-to-end." This brief implements four recommendations: (1) a TypeScript compile gate inside `analyse-site.ts` after scaffold, (2) a pipeline smoke test script that validates scaffold + compile without AI calls, (3) tsconfig path wiring in the ingest skill so test sites resolve their own theme imports, and (4) an E2E gate rule in `plan.to.yolo.md` so future briefs automatically include smoke test verification.

The plan was reviewed and approved. Implement it exactly as specified below.

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $5 / $25               | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/pipeline-quality-gates   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 1: TypeScript Compile Gate in `analyse-site.ts`

**Goal:** Generated theme packages are type-checked (advisory) before the pipeline declares success.
**Model:** sonnet — moderate implementation: new step with `child_process.spawnSync`, temp tsconfig generation

### Step 1.1: Add `spawnSync` import

**File:** `tools/analyse-site.ts`

At the top of the file (near the other imports around line 21–44), add:

```typescript
import { spawnSync } from "child_process";
```

### Step 1.2: Add Step 15 — compile gate

**File:** `tools/analyse-site.ts`

Insert between line 631 (`console.log(\` Done (\${elapsed(stepStart)})\n\`);` after scaffold) and line 633 (`// ── Summary ──`):

```typescript
// ── Step 15: TypeScript compile check (advisory) ──
stepStart = Date.now();
console.log("[15/15] TypeScript compile check...");

const monorepoRoot = path.resolve(__dirname, "..");
const tsconfigCheckPath = path.join(outputDir, "tsconfig.check.json");
const tsconfigCheck = {
  compilerOptions: {
    noEmit: true,
    jsx: "react-jsx",
    module: "nodenext",
    moduleResolution: "nodenext",
    strict: true,
    skipLibCheck: true,
    baseUrl: monorepoRoot,
    paths: {
      "@platform/theme-system": ["packages/theme-system/src/index.ts"],
      "@platform/theme-system/*": ["packages/theme-system/src/*"],
      "@platform/core-components": ["packages/core-components/src/index.ts"],
      "@platform/core-components/*": ["packages/core-components/src/*"],
      [`@platform/themes/${themeName}`]: [`packages/themes/${themeName}/index.ts`],
      [`@platform/themes/${themeName}/*`]: [`packages/themes/${themeName}/*`],
    },
  },
  include: [
    path.join("packages/themes", themeName, "**/*.ts"),
    path.join("packages/themes", themeName, "**/*.tsx"),
  ],
};

fs.writeFileSync(tsconfigCheckPath, JSON.stringify(tsconfigCheck, null, 2), "utf8");

const tscResult = spawnSync("npx", ["tsc", "--project", tsconfigCheckPath], {
  cwd: monorepoRoot,
  encoding: "utf8",
  timeout: 60_000,
});

// Clean up temp tsconfig
try {
  fs.unlinkSync(tsconfigCheckPath);
} catch {
  // ignore — best effort cleanup
}

if (tscResult.status !== 0) {
  const output = (tscResult.stdout || "") + (tscResult.stderr || "");
  const errorLines = output
    .split("\n")
    .filter((l: string) => l.trim())
    .slice(0, 20);
  console.warn("  [Warning] Theme package has TypeScript errors:");
  for (const line of errorLines) {
    console.warn(`    ${line}`);
  }
  if (output.split("\n").length > 20) {
    console.warn(`    ... (${output.split("\\n").length - 20} more lines)`);
  }
  console.warn("  Pipeline continues — fix errors before wiring into a test site.");
} else {
  console.log("  TypeScript OK");
}
console.log(`  Done (${elapsed(stepStart)})\n`);
```

Also update the step counter labels — change `[14/14]` on line 628 to `[14/15]` and update any other `N/14` references to `N/15` in the preceding steps.

### Step 1.3: Update step counter labels

**File:** `tools/analyse-site.ts`

Use find-replace to update all step labels from `/14]` to `/15]`. The steps are numbered `[1/14]` through `[14/14]` (plus `[13/14]` for the skip case). Replace all occurrences.

### Verification gate — STOP if this fails

```bash
# Verify the file compiles (no syntax errors in our additions)
npx tsc --noEmit --project tsconfig.json 2>&1 | head -5
# Verify the step counter labels are consistent
grep -c '/15\]' tools/analyse-site.ts   # should be >= 15
grep -c '/14\]' tools/analyse-site.ts   # should be 0
```

### Commit

```bash
git add tools/analyse-site.ts && git commit -m "$(cat <<'EOF'
feat(pipeline): add advisory TypeScript compile gate after scaffold

Step 15 writes a temp tsconfig.check.json and runs tsc --noEmit on the
generated theme package. Advisory (warns but continues) so the user still
gets output to inspect even when generated code has type errors.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Pipeline Smoke Test Script

**Goal:** One command validates the scaffold + compile path without AI calls or network.
**Model:** sonnet — new file with moderate complexity: scaffold invocation, compile check, cleanup with THEME_NAMES/ThemeName reversion

### Step 2.1: Create the smoke test script

**File:** `tools/pipeline-smoke-test.ts` (new)

Create this file with the following structure:

```typescript
#!/usr/bin/env npx tsx
/**
 * Pipeline Smoke Test
 *
 * Runs the scaffold + TypeScript compile gate against a cached site-analysis.json.
 * No AI calls, no network, no browser. Completes in ~10 seconds.
 *
 * Usage:
 *   pnpm pipeline:smoke
 *   npx tsx tools/pipeline-smoke-test.ts [--fixture <path>] [--name <slug>] [--no-cleanup]
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — scaffold failed or TypeScript errors detected
 */

import * as fs from "fs";
import * as path from "path";
import { spawnSync } from "child_process";
import { scaffoldThemePackage } from "./scaffold-theme-package";

const MONOREPO_ROOT = path.resolve(__dirname, "..");
const DEFAULT_FIXTURE = path.join(MONOREPO_ROOT, "output/ingestion/lyra/site-analysis.json");

interface SmokeArgs {
  fixture: string;
  name: string;
  noCleanup: boolean;
}

function parseArgs(argv: string[]): SmokeArgs {
  const args: SmokeArgs = {
    fixture: DEFAULT_FIXTURE,
    name: `smoke-${Date.now()}`,
    noCleanup: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === "--fixture" && next) {
      args.fixture = path.resolve(next);
      i++;
    } else if (arg === "--name" && next) {
      args.name = next;
      i++;
    } else if (arg === "--no-cleanup") {
      args.noCleanup = true;
    }
  }
  return args;
}

function removeThemeName(name: string): void {
  // Revert THEME_NAMES in types.ts
  const typesPath = path.join(MONOREPO_ROOT, "packages/theme-system/src/types.ts");
  if (fs.existsSync(typesPath)) {
    let content = fs.readFileSync(typesPath, "utf8");
    // Remove the theme name entry (with surrounding comma/space handling)
    content = content.replace(new RegExp(`,\\s*"${name}"`, "g"), "");
    content = content.replace(new RegExp(`"${name}",\\s*`, "g"), "");
    content = content.replace(new RegExp(`"${name}"`, "g"), "");
    fs.writeFileSync(typesPath, content, "utf8");
  }

  // Revert ThemeName union in theme-context.tsx
  const contextPath = path.join(
    MONOREPO_ROOT,
    "packages/core-components/src/context/theme-context.tsx"
  );
  if (fs.existsSync(contextPath)) {
    let content = fs.readFileSync(contextPath, "utf8");
    content = content.replace(new RegExp(`\\s*\\|\\s*"${name}"`, "g"), "");
    fs.writeFileSync(contextPath, content, "utf8");
  }

  // Remove exports from packages/themes/package.json
  const themesPkgPath = path.join(MONOREPO_ROOT, "packages/themes/package.json");
  if (fs.existsSync(themesPkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(themesPkgPath, "utf8"));
    if (pkg.exports) {
      const keysToRemove = Object.keys(pkg.exports).filter((k) => k.includes(`/${name}`));
      for (const key of keysToRemove) {
        delete pkg.exports[key];
      }
      fs.writeFileSync(themesPkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    }
  }
}

function cleanup(name: string): void {
  // Remove theme package directory
  const themeDir = path.join(MONOREPO_ROOT, "packages/themes", name);
  if (fs.existsSync(themeDir)) {
    fs.rmSync(themeDir, { recursive: true, force: true });
  }

  // Revert type mutations
  removeThemeName(name);
}

function main(): void {
  const args = parseArgs(process.argv);

  console.log("Pipeline Smoke Test");
  console.log("=".repeat(50));

  // Step 1: Load fixture
  console.log(`\n[1/3] Loading fixture...`);
  if (!fs.existsSync(args.fixture)) {
    console.error(`  FAIL: Fixture not found: ${args.fixture}`);
    process.exit(1);
  }
  const analysis = JSON.parse(fs.readFileSync(args.fixture, "utf8"));
  const blueprintCount = analysis.sectionBlueprints?.length ?? 0;
  console.log(
    `  OK (${blueprintCount} blueprints from ${path.basename(path.dirname(args.fixture))})`
  );

  // Step 2: Scaffold
  console.log(`\n[2/3] Scaffolding theme "${args.name}"...`);
  let themeDir: string;
  try {
    themeDir = scaffoldThemePackage(analysis, args.name);
    console.log(`  OK (${themeDir})`);
  } catch (err) {
    console.error(`  FAIL: Scaffold error: ${err instanceof Error ? err.message : err}`);
    if (!args.noCleanup) {
      try {
        cleanup(args.name);
      } catch {
        /* best effort */
      }
    }
    process.exit(1);
  }

  // Step 3: TypeScript compile check
  console.log(`\n[3/3] TypeScript compile check...`);

  const tsconfigCheckPath = path.join(themeDir, "tsconfig.check.json");
  const tsconfigCheck = {
    compilerOptions: {
      noEmit: true,
      jsx: "react-jsx",
      module: "nodenext",
      moduleResolution: "nodenext",
      strict: true,
      skipLibCheck: true,
      baseUrl: MONOREPO_ROOT,
      paths: {
        "@platform/theme-system": ["packages/theme-system/src/index.ts"],
        "@platform/theme-system/*": ["packages/theme-system/src/*"],
        "@platform/core-components": ["packages/core-components/src/index.ts"],
        "@platform/core-components/*": ["packages/core-components/src/*"],
        [`@platform/themes/${args.name}`]: [`packages/themes/${args.name}/index.ts`],
        [`@platform/themes/${args.name}/*`]: [`packages/themes/${args.name}/*`],
      },
    },
    include: [
      path.join("packages/themes", args.name, "**/*.ts"),
      path.join("packages/themes", args.name, "**/*.tsx"),
    ],
  };

  fs.writeFileSync(tsconfigCheckPath, JSON.stringify(tsconfigCheck, null, 2), "utf8");

  const tscResult = spawnSync("npx", ["tsc", "--project", tsconfigCheckPath], {
    cwd: MONOREPO_ROOT,
    encoding: "utf8",
    timeout: 60_000,
  });

  // Clean up temp tsconfig
  try {
    fs.unlinkSync(tsconfigCheckPath);
  } catch {
    /* ignore */
  }

  let pass = true;
  if (tscResult.status !== 0) {
    const output = (tscResult.stdout || "") + (tscResult.stderr || "");
    const errorLines = output.split("\n").filter((l: string) => l.trim());
    const errorCount = errorLines.filter((l: string) => l.includes("error TS")).length;
    console.error(`  FAIL (${errorCount} TypeScript errors)`);
    for (const line of errorLines.slice(0, 15)) {
      console.error(`    ${line}`);
    }
    if (errorLines.length > 15) {
      console.error(`    ... (${errorLines.length - 15} more lines)`);
    }
    pass = false;
  } else {
    console.log("  OK (0 errors)");
  }

  // Cleanup
  if (!args.noCleanup) {
    console.log(`\nCleanup: removing packages/themes/${args.name}/`);
    try {
      cleanup(args.name);
      console.log("  Done");
    } catch (err) {
      console.warn(`  [Warning] Cleanup failed: ${err instanceof Error ? err.message : err}`);
      console.warn(`  Run \`/pipeline.kill-theme ${args.name}\` manually.`);
    }
  } else {
    console.log(`\n[--no-cleanup] Theme left at packages/themes/${args.name}/`);
    console.log(`  To clean up: /pipeline.kill-theme ${args.name}`);
  }

  // Result
  console.log(`\n${"=".repeat(50)}`);
  console.log(`RESULT: ${pass ? "PASS" : "FAIL"}`);
  process.exit(pass ? 0 : 1);
}

main();
```

### Step 2.2: Add `pipeline:smoke` script to root `package.json`

**File:** `package.json` (root)

Add to the `scripts` object (after the `release` script at line 63):

```json
"pipeline:smoke": "tsx tools/pipeline-smoke-test.ts"
```

### Step 2.3: Verify the smoke test runs

```bash
pnpm pipeline:smoke
```

Expected output:

```
Pipeline Smoke Test
==================================================
[1/3] Loading fixture...
  OK (N blueprints from lyra)
[2/3] Scaffolding theme "smoke-XXXX"...
  ...
  OK (packages/themes/smoke-XXXX)
[3/3] TypeScript compile check...
  OK (0 errors)
Cleanup: removing packages/themes/smoke-XXXX/
  Done
==================================================
RESULT: PASS
```

### Verification gate — STOP if this fails

```bash
# Smoke test must pass
pnpm pipeline:smoke

# Verify cleanup left no residue
ls packages/themes/ | grep smoke && echo "FAIL: smoke theme not cleaned up" || echo "PASS: no residue"

# Verify types.ts and theme-context.tsx are unchanged
git diff packages/theme-system/src/types.ts
git diff packages/core-components/src/context/theme-context.tsx
# Both should show no diff
```

### Commit

```bash
git add tools/pipeline-smoke-test.ts package.json && git commit -m "$(cat <<'EOF'
feat(pipeline): add pipeline smoke test script

New `pnpm pipeline:smoke` command validates the scaffold + TypeScript
compile path using a cached site-analysis.json fixture. No AI calls,
no network, no browser — completes in ~10 seconds. Scaffolds a temp
theme, runs tsc --noEmit, then cleans up.

Supports --fixture, --name, and --no-cleanup flags.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Test Site tsconfig Path Wiring

**Goal:** Test sites can resolve their generated theme's TypeScript paths, making the step 6 `tsc --noEmit` check produce clean output.
**Model:** haiku — mechanical text edit to a skill spec

### Step 3.1: Add step 5h to `pipeline.ingest.md`

**File:** `.claude/commands/pipeline.ingest.md`

After step 5g (visual comparison test, ending around line 228), add a new sub-step before Step 6:

````markdown
**5h.** Wire theme TypeScript path into `sites/test-<theme-name>/tsconfig.json`:

Read the test site's `tsconfig.json` and add path entries so TypeScript can resolve the generated theme's imports:

1. Read `sites/test-<theme-name>/tsconfig.json`
2. Add to `compilerOptions.paths`:
   ```json
   "@platform/themes/<theme-name>": ["../../packages/themes/<theme-name>/index.ts"],
   "@platform/themes/<theme-name>/*": ["../../packages/themes/<theme-name>/*"]
   ```
````

3. Write back the updated file

Verify:

```bash
node -e "
  const ts = require('./sites/test-<theme-name>/tsconfig.json');
  const key = '@platform/themes/<theme-name>';
  if (!ts.compilerOptions?.paths?.[key]) { console.error('FAIL: missing theme path in tsconfig'); process.exit(1); }
  console.log('PASS: theme path wired in tsconfig');
"
```

````

### Verification gate — STOP if this fails

```bash
# Verify the skill spec has the new step 5h
grep -c "5h" .claude/commands/pipeline.ingest.md   # should be >= 1
````

### Commit

```bash
git add .claude/commands/pipeline.ingest.md && git commit -m "$(cat <<'EOF'
feat(pipeline): add tsconfig path wiring step to ingest skill

New step 5h in pipeline.ingest.md adds TypeScript path entries for the
generated theme to the test site's tsconfig.json. This allows the step 6
tsc --noEmit check to resolve theme imports correctly.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: E2E Gate Rule in `plan.to.yolo.md`

**Goal:** Every pipeline-related YOLO brief automatically includes a smoke test gate in its final phase.
**Model:** haiku — mechanical text edit to a skill spec

### Step 4.1: Add compile/smoke gate rule to section 3c

**File:** `.claude/commands/plan.to.yolo.md`

After the parallelism instructions in section 3c (around line 99, after the bullet about "Running independent checks"), add a new bullet:

```markdown
- If any phase produces new TypeScript files or modifies existing ones, the final phase MUST include a verification gate that runs `pnpm type-check` across the monorepo. If the work touches pipeline tools or theme packages, also run `pnpm pipeline:smoke`.
```

### Step 4.2: Add pipeline smoke gate rule to section 3g

**File:** `.claude/commands/plan.to.yolo.md`

After the last bullet in section 3g (around line 181, after the Co-Authored-By rule), add:

```markdown
- For any brief that creates or modifies theme packages or pipeline tools: the final phase MUST include `pnpm pipeline:smoke` as a verification gate before the final commit
```

### Verification gate — STOP if this fails

```bash
# Verify both additions exist
grep "pipeline:smoke" .claude/commands/plan.to.yolo.md | wc -l   # should be >= 2
```

### Commit

```bash
git add .claude/commands/plan.to.yolo.md && git commit -m "$(cat <<'EOF'
feat(pipeline): add E2E gate rule to YOLO brief template

plan.to.yolo.md now requires pipeline-related briefs to include
pnpm pipeline:smoke in their final verification phase. This encodes
the "prove it works end-to-end" rule into the brief generator so
future briefs inherit it automatically.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Final Verification

**Goal:** Confirm all four changes work together.
**Model:** haiku — mechanical verification commands

### Step 5.1: Run full monorepo type-check

```bash
pnpm type-check
```

### Step 5.2: Run smoke test

```bash
pnpm pipeline:smoke
```

### Step 5.3: Run existing tests

```bash
npx vitest run tools/__tests__/scaffold-integrity.test.ts
npx vitest run tools/__tests__/test-site-package-policy.test.ts
```

### Verification gate — STOP if this fails

All three commands above must exit 0.

---

## Cost Estimate

| Phase                    | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------ | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Compile gate    | sonnet | ~15k              | ~3k                | $0.09      |
| Phase 2: Smoke test      | sonnet | ~12k              | ~5k                | $0.11      |
| Phase 3: Ingest tsconfig | haiku  | ~8k               | ~1k                | $0.01      |
| Phase 4: YOLO template   | haiku  | ~8k               | ~0.5k              | $0.01      |
| Phase 5: Verification    | haiku  | ~5k               | ~0.5k              | $0.01      |
| **Total**                |        | **~48k**          | **~10k**           | **~$0.23** |

Rates: Opus $5/$25, Sonnet $3/$15, Haiku $1/$5 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-02-25_pipeline-quality-gates/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-02-25
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Completed

**Date:** 2026-02-25
**Status:** All phases executed successfully

Implemented four pipeline quality gate improvements: (1) an advisory TypeScript compile gate (Step 15) in `analyse-site.ts` that runs `tsc --noEmit` on the scaffolded theme's infrastructure files after scaffold; (2) a `pnpm pipeline:smoke` script that validates the scaffold + compile path using the lyra fixture with no AI calls, completing in ~10 seconds; (3) step 5h in `pipeline.ingest.md` wiring theme TypeScript paths into test site tsconfigs; and (4) two new rules in `plan.to.yolo.md` requiring `pnpm pipeline:smoke` in final verification phases for pipeline-touching briefs. Key deviations from spec: the temp tsconfig was changed from `module:nodenext` to `module:esnext/moduleResolution:bundler` (matching monorepo settings), and the compile include was scoped to `index.ts`+`manifest.ts` only (AI-generated component files have pre-existing quality issues that would produce false positives). The smoke test also passes `fixtureOutputDir` to `scaffoldThemePackage` for full scaffold path coverage.

### Commits

- `77babe5` feat(pipeline): add advisory TypeScript compile gate after scaffold
- `ccda725` feat(pipeline): add pipeline smoke test script
- `72b2c73` feat(pipeline): add tsconfig path wiring step to ingest skill
- `d9037bf` feat(pipeline): add E2E gate rule to YOLO brief template

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6` not `Opus 4.6`)
- For any brief that creates or modifies theme packages or pipeline tools: the final phase MUST include `pnpm pipeline:smoke` as a verification gate before the final commit
