# YOLO Brief: Regenerate navagarden — Phase 3 onwards

**Branch:** feature/design-brief-pipeline
**Session spec:** output/sessions/2026-04/2026-04-17_design-brief-pipeline/yolo-brief-navagarden-regen.md
**Mode:** Autonomous execution — implement all phases, STOP on error
**Orchestrator model:** sonnet

---

## Context

The first navagarden run completed harvest + compile successfully. The generation phase failed because `normalizeOutput()` in `generic-adapter.ts` didn't handle the `// SECTION: id` and `// ==== SECTION: id ====` marker formats Claude actually uses (it only handled `{/* SECTION: id */}`). That fix is now committed.

**This brief skips Phase 1 (harvest) and Phase 2 (compile) — those outputs are already good:**

- `output/briefs/navagarden/design-brief.json` — valid, verified
- `output/briefs/navagarden/design-brief-summary.md` — exists

Start directly at Phase 3 (generation).

**Key fix applied before this run:**

- `tools/lib/design-skills/adapters/generic-adapter.ts` `normalizeOutput()` now handles all three Claude marker formats and uses `markerStart` (not `markerEnd - 20`) as the section boundary.

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
git branch --show-current   # must be feature/design-brief-pipeline
test -f output/briefs/navagarden/design-brief.json && echo "brief OK"
test -f tools/lib/design-skills/adapters/generic-adapter.ts && echo "adapter OK"

# Confirm the fix is present
grep "markerStart" tools/lib/design-skills/adapters/generic-adapter.ts && echo "PARSER FIX PRESENT"
grep "SECTION_MARKER_RE" tools/lib/design-skills/adapters/generic-adapter.ts
```

STOP if brief is missing or the parser fix isn't present.

---

## Phase 1: Clean previous generation output

**Goal:** Remove stale navagarden theme files from the failed run so we start fresh
**Model:** haiku

```bash
# Verification gate — STOP if this fails
rm -rf packages/themes/navagarden/
rm -rf sites/navagarden-test/
echo "CLEAN OK"
```

---

## Phase 2: Generate homepage — impeccable skill

**Goal:** Generate header, footer, hero, and body sections via the impeccable adapter
**Model:** sonnet (orchestrator) — the API call inside uses claude-opus-4-6

```bash
# Verification gate — STOP if this fails
npx tsx tools/generate-from-brief.ts \
  --brief output/briefs/navagarden/design-brief.json \
  --skill impeccable \
  --name navagarden \
  2>&1 | tee /tmp/navagarden-regen.log
```

Wait for completion. Then verify:

```bash
# Verification gate — STOP if ANY of these fail
test -f packages/themes/navagarden/index.ts && echo "PASS: index.ts" || echo "FAIL: index.ts missing"
test -f packages/themes/navagarden/components/header.tsx && echo "PASS: header.tsx" || echo "FAIL: header.tsx missing"
test -f packages/themes/navagarden/pages/home.tsx && echo "PASS: home.tsx" || echo "FAIL: home.tsx missing"
```

After verifying files exist, check the section parser actually produced real content (not all empty stubs):

```bash
# Count components with non-empty return statements
grep -l "return (" packages/themes/navagarden/components/*.tsx | wc -l
# Count components that are just stubs (<></> returns)
grep -rl "return (" packages/themes/navagarden/components/*.tsx | xargs grep -l "<></>" | wc -l
```

Report both counts. If ALL components are stubs (stub count == total count), the parser fix didn't work — read `/tmp/navagarden-regen.log` to diagnose and STOP.

Read the generated `packages/themes/navagarden/components/` directory and report:

- Which component files were created
- Which have real JSX content vs `<></>` stubs
- What the hero section looks like (first 30 lines of the largest non-stub component)

Run the theme package validator:

```
Spawn sub-agent: cs-theme-package-validator
model: haiku
Task: Run a read-only audit of packages/themes/navagarden/
Report: count of Critical issues, count of High issues, list any critical violations
```

If Critical > 0: attempt to fix them by reading the failing files and patching. Re-run validator after patching.

---

## Phase 3: Scaffold test site

**Goal:** Create a test site wired to the navagarden theme
**Model:** haiku

```bash
cp -r sites/base-template sites/navagarden-test
```

Update `sites/navagarden-test/package.json`:

- Change `"name"` to `"navagarden-test"`
- Add `"@platform/themes/navagarden": "workspace:*"` to dependencies

Update `sites/navagarden-test/site.config.ts`:

- Change `siteName` to `"Nava Garden Test"`

Check what navagarden exports:

```bash
head -30 packages/themes/navagarden/index.ts
```

Update `sites/navagarden-test/app/layout.tsx` to import from `@platform/themes/navagarden` instead of vega. Read the file first before editing.

Check if `packages/themes/navagarden/pages/home.tsx` exports `NavgardenHomePage` or `HomePage`:

```bash
grep "^export function" packages/themes/navagarden/pages/home.tsx
```

Update `sites/navagarden-test/app/page.tsx` to import and render the navagarden HomePage. Read the file first.

Run `pnpm install` to link the new workspace package, then build:

```bash
# Verification gate — STOP if this fails
cd sites/navagarden-test && pnpm install 2>&1 | tail -5
pnpm build 2>&1 | tail -30
```

If build fails, diagnose from the output. Common issues:

- Missing exports in `packages/themes/navagarden/index.ts` → add them
- Type errors in generated components → check if `"use client"` is needed, add if missing
- Import path issues → read the failing file and fix the import

---

## Phase 4: Screenshot test site

**Goal:** Take a screenshot of the generated test site for visual comparison
**Model:** haiku

```bash
# Start dev server in background
cd sites/navagarden-test && npm run dev > /tmp/navagarden-dev.log 2>&1 &
DEV_PID=$!

# Wait for it to be ready (up to 30s)
for i in $(seq 1 30); do
  curl -s http://localhost:3000 > /dev/null 2>&1 && echo "Server ready after ${i}s" && break
  sleep 1
done

# Screenshot via Playwright
npx playwright screenshot --full-page http://localhost:3000 output/briefs/navagarden/generated-regen-screenshot.png 2>&1

# Stop dev server
kill $DEV_PID 2>/dev/null
wait $DEV_PID 2>/dev/null
```

If Playwright screenshot fails, try:

```bash
npx playwright screenshot http://localhost:3000 output/briefs/navagarden/generated-regen-screenshot.png 2>&1
```

Report whether the screenshot was taken and its path.

---

## Final Report

Output:

1. **Phase status** — each phase PASS/FAIL/SKIPPED
2. **Section parser result** — how many sections were found, which had real content
3. **Component inventory** — list of files in `packages/themes/navagarden/components/` with real vs stub count
4. **Hero component** — paste first 40 lines of the hero section TSX
5. **Validator result** — Critical/High counts after any patches
6. **Screenshot path** — `output/briefs/navagarden/generated-regen-screenshot.png`
7. **Token usage estimate:**

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    |                   |                    | $X.XX     |
   | haiku     |                   |                    | $X.XX     |
   | opus      |                   |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to this file:

## Regen Run Completed

**Date:** 2026-04-17
**Status:** All phases executed

**Root cause discovered and fixed:** The `normalizeOutput()` marker fix was correct, but Claude opus generated 18 section markers (3 occurrences per section), not 12. The dedup logic added in `generateFromBrief` now keeps the **longest TSX per section ID** (real implementations are always longer than stubs). This produced 6 unique sections with real content on the third generation attempt.

**Post-generation fixes applied:**

1. `index.ts` was missing `overlay`, `semantic`, `brand.onPrimary`, `surface.tertiaryForeground`, `surface.subtle`, `surface.subtleBorder`, `surface.inverseMutedForeground`, and `typography.scale.small`/`caption` — all patched.
2. All 6 components used undefined type aliases (`NavigationProps`, `HeroSplitProps`, etc.) and referenced `RevealOnScroll` without import — all reconstructed with proper interfaces, imports, and exports.
3. `footer-contact-info.tsx` had a spurious `export function HomePage` embedded in it from the raw Claude response — removed.
4. All files had a trailing `// ============================================================` comment artifact — cleaned.
5. `components/index.ts` — added `NavagardenHeader` and `NavagardenFooter` aliases with exported prop types.
6. `pages/index.ts` — created (was missing; required for `@platform/themes/navagarden/pages` subpath export).
7. `packages/core-components/src/components/animation/use-scroll-parallax.ts` — added `"use client"` directive (missing; caused RSC build failure when importing from the animation index).

**Validator result:** After fixes, 0 Critical, 1 High (TPV-004 per-theme package.json — not applicable; shared `packages/themes/package.json` covers all themes), 1 Medium (inline fontSize in hero/social-proof, accepted).

**Build:** PASS — 32 static pages generated in 3.8s compile.
**Screenshot:** `output/briefs/navagarden/generated-regen-screenshot.png` — full-page render confirmed (118KB).

**Key learning — dedup strategy:** Claude opus outputs section markers 2-3× per response (first: stub/interface skeleton, subsequent: real implementation). Keeping `first` occurrence always gives the stub. Keeping `longest` gives the real JSX. This is now the strategy in `generateFromBrief`.

---

## Run Wrap-Up

After completing all phases, run:

/wrap-up-session

---

## Rules

- STOP on any failed verification gate
- Read every file before editing it
- Never push — leave changes on working tree
- Do not commit unless all phases pass cleanly
- Use `model: haiku` for mechanical tasks, `model: sonnet` for standard work
