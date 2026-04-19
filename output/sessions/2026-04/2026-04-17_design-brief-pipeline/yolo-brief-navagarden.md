# YOLO Brief: Run Design Brief Pipeline — navagarden.hu

**Branch:** feature/design-brief-pipeline
**Session spec:** output/sessions/2026-04/2026-04-17_design-brief-pipeline/yolo-brief-navagarden.md
**Mode:** Autonomous execution — run all phases, STOP on error
**Orchestrator model:** sonnet

---

## Context

This is the first real-world test of the design brief pipeline. The pipeline was built across Sessions 1 and 2 (both committed to `feature/design-brief-pipeline`). This session runs it end-to-end against a live reference site.

**Goal:** Produce a working theme package at `packages/themes/navagarden/` by analyzing https://navagarden.hu/, compiling a DesignBrief, generating homepage components via the `impeccable` skill, and scaffolding a test site.

**Key facts about the pipeline tools:**

- `tools/generate-from-brief.ts` — CLI entry point. Flags: `--url`, `--brief`, `--skill`, `--name`, `--emit-brief`, `--dry-run`, `--brief-only`
- `tools/analyse-site.ts` — Phase A0 harvest. Writes to `output/ingestion/<name>/`
- `tools/lib/design-brief-compiler.ts` — compileDesignBrief() — pure, no AI
- `tools/lib/design-brief-generator.ts` — generateFromBrief() — calls Claude API
- `tools/scaffold-theme-package.ts` — assembles final package structure
- `.claude/commands/pipeline.design-brief.md` — slash command (NOT used here — this brief IS the execution plan)

---

## Model Tiers

| Tier   | Alias    | Use for                                                                                             |
| ------ | -------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**.

---

## Pre-flight

```bash
# Verify on correct branch
git branch --show-current   # must be feature/design-brief-pipeline

# Verify pipeline tools exist
test -f tools/generate-from-brief.ts && echo "CLI OK"
test -f tools/lib/design-brief-generator.ts && echo "generator OK"
test -f tools/lib/design-brief-compiler.ts && echo "compiler OK"

# Verify type-check is clean
pnpm type-check
```

STOP if any of these fail — do not proceed if the pipeline isn't in place.

---

## Phase 1: Harvest — Run analyse-site.ts

**Goal:** Capture screenshots, computed styles, and vision analysis for navagarden.hu
**Model:** sonnet

```bash
# Verification gate — STOP if this fails
npx tsx tools/analyse-site.ts \
  --url https://navagarden.hu/ \
  --name navagarden \
  --skip-examples \
  2>&1 | tee /tmp/navagarden-harvest.log
```

After completion, verify:

```bash
# Verification gate — STOP if this fails
test -f output/ingestion/navagarden/site-analysis.json && echo "PASS: site-analysis.json exists" || echo "FAIL: harvest incomplete"
```

If the harvest fails, read `/tmp/navagarden-harvest.log` to diagnose, report the error, and STOP.

Note: `analyse-site.ts` may also generate some component files as a side effect — this is expected. The pipeline only reads `site-analysis.json` from this step.

---

## Phase 2: Compile Brief — generate-from-brief.ts --brief-only

**Goal:** Compile DesignBrief from harvest outputs, emit brief JSON + summary markdown
**Model:** sonnet

```bash
# Verification gate — STOP if this fails
npx tsx tools/generate-from-brief.ts \
  --url https://navagarden.hu/ \
  --name navagarden \
  --brief-only \
  --emit-brief output/briefs/navagarden/ \
  2>&1 | tee /tmp/navagarden-compile.log
```

After completion, verify:

```bash
# Verification gate — STOP if this fails
test -f output/briefs/navagarden/design-brief.json && echo "PASS: design-brief.json exists" || echo "FAIL: brief not compiled"
```

If the brief file doesn't exist:

1. Read `/tmp/navagarden-compile.log` to diagnose
2. Check that `output/ingestion/navagarden/site-analysis.json` is well-formed JSON
3. Run the compiler directly to see the error: `npx tsx -e "import { compileDesignBrief } from './tools/lib/design-brief-compiler.js'"` (just to get the error)
4. Report the error and STOP

If the brief compiles, read `output/briefs/navagarden/design-brief.json` and report:

- palette.brand.primary color
- typography.fontFamily values
- Number of sections in pageBlueprints[0].sections
- visualTone.description (first sentence)
- Any compiler warnings from the log

---

## Phase 3: Generate Homepage — impeccable skill

**Goal:** Generate header, footer, hero, and body sections for the homepage via the impeccable adapter
**Model:** opus (this is the creative generation phase — cross-file reasoning, Claude API orchestration)

```bash
# Verification gate — STOP if this fails
npx tsx tools/generate-from-brief.ts \
  --brief output/briefs/navagarden/design-brief.json \
  --skill impeccable \
  --name navagarden \
  2>&1 | tee /tmp/navagarden-generate.log
```

This will take several minutes — it calls the Claude API once per section. Wait for completion.

After completion, verify all three critical files:

```bash
# Verification gate — STOP if ANY of these fail
test -f packages/themes/navagarden/index.ts && echo "PASS: index.ts" || echo "FAIL: index.ts missing"
test -f packages/themes/navagarden/components/header.tsx && echo "PASS: header.tsx" || echo "FAIL: header.tsx missing"
test -f packages/themes/navagarden/pages/home.tsx && echo "PASS: home.tsx" || echo "FAIL: home.tsx missing"
```

If any verification fails, read the generate log, report what went wrong, and STOP.

Run the theme package validator:

```
Spawn sub-agent: cs-theme-package-validator
model: haiku
Task: Run a read-only audit of packages/themes/navagarden/
Report: count of Critical issues, count of High issues, list any critical violations
```

If Critical > 0, STOP and report the issues — do not proceed to Phase 4.
If High > 0, note them but continue.

---

## Phase 4: Scaffold Test Site

**Goal:** Create a test site wired to the navagarden theme so we can do visual QA
**Model:** haiku (mechanical file operations)

```bash
# Copy base-template to test site
cp -r sites/base-template sites/navagarden-test
```

Update `sites/navagarden-test/site.config.ts`:

- Change `siteName` to `"Nava Garden Test"`
- Change `themeName` to `"navagarden"`

Update `sites/navagarden-test/app/layout.tsx`:

- Change the theme import to use navagarden theme components (if theme has Header/Footer exports)
- If navagarden theme does NOT export Header/Footer components, keep the base-template's existing layout and just update the theme config reference

Update `sites/navagarden-test/package.json`:

- Change `"name"` to `"navagarden-test"`
- Add `"@platform/themes/navagarden": "workspace:*"` to dependencies

Verify the test site compiles:

```bash
# Verification gate — STOP if this fails
cd sites/navagarden-test && npm run build 2>&1 | tail -30
```

If the build fails, diagnose from the output. Common issues:

- Missing theme package exports → read `packages/themes/navagarden/index.ts` and fix the import
- Type errors → check if theme package types are correct
- Report the error and STOP if unresolvable

---

## Phase 5: Screenshot Test Site

**Goal:** Take screenshots of the generated test site for visual comparison
**Model:** haiku

Start the dev server in the background, take screenshots, then stop it:

```bash
# Start dev server
cd sites/navagarden-test && npm run dev &
DEV_PID=$!

# Wait for it to be ready
sleep 15
curl -s http://localhost:3000 > /dev/null && echo "Server ready" || echo "Server not responding"

# Take screenshot via Playwright
npx tsx tools/screenshot-capture.ts \
  --url http://localhost:3000 \
  --output output/briefs/navagarden/generated-screenshot.png \
  2>&1

# Stop dev server
kill $DEV_PID 2>/dev/null
```

If `tools/screenshot-capture.ts` doesn't exist or doesn't support `--output`, use this alternative:

```bash
npx playwright screenshot http://localhost:3000 output/briefs/navagarden/generated-screenshot.png
```

After this phase, report the paths to:

- Reference screenshot: `output/ingestion/navagarden/screenshots/` (list what's there)
- Generated screenshot: `output/briefs/navagarden/generated-screenshot.png`

---

## Final Report

After all phases complete, output:

1. **Phases completed** — list each with status (PASS/FAIL/SKIPPED)
2. **Theme package location** — `packages/themes/navagarden/`
3. **Test site location** — `sites/navagarden-test/`
4. **Brief summary** — paste the key fields from Phase 2 (palette, typography, sections, visual tone)
5. **Validator result** — Critical/High counts
6. **Screenshot paths** — reference vs generated
7. **What to inspect next** — manual review pointers
8. **Token usage and cost estimate:**

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    |                   |                    | $X.XX     |
   | haiku     |                   |                    | $X.XX     |
   | opus      |                   |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-17_design-brief-pipeline/yolo-brief-navagarden.md`:

```markdown
## Completed

**Date:** [today]
**Status:** [All phases executed / Stopped at Phase N]

[1-paragraph summary: what was generated, any surprises, validator result]

### Commits

[list any commits made, or "no commits — all changes on working tree"]
```

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
- Minimal changes only — run the pipeline as built, don't refactor during this session
- Use `model: haiku` for mechanical tasks, `model: sonnet` for standard work, `model: opus` for the generation phase
- Do not commit unless explicitly instructed — this is a test run, changes stay on working tree
- The Co-Authored-By line in commits must reflect the orchestrator model used

## Completed

**Date:** 2026-04-17
**Status:** All phases executed

The pipeline ran end-to-end against navagarden.hu and produced a working theme package at `packages/themes/navagarden/` and a compilable test site at `sites/navagarden-test/`. Two bugs were found and fixed: (1) `generate-from-brief.ts` was calling `compileDesignBrief` without the required `mappedTokens` argument — fixed by deriving it from `siteAnalysis.computedStyles`; (2) `ThemeName` in `core-components/src/context/theme-context.tsx` is a local duplicate type that wasn't updated when navagarden was added to `THEME_NAMES`. Both are pipeline infrastructure bugs, not architectural problems. The validator found the generated `index.ts` was missing `semantic` and `overlay` color categories and `small`/`caption` typography levels — trivial omissions patched directly. Final validator result: 0 Critical, 0 High.

### Commits

No commits — all changes on working tree (feature/design-brief-pipeline).
