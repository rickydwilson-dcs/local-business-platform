# YOLO Implementation Brief: Test Pipeline Fixes & Interactive Preview

**Branch:** feature/ingestion-v2 (ALREADY checked out — do NOT create a new branch)
**Session spec:** output/sessions/2026-02-21_pipeline-test-preview/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error

---

## Context

The ingestion pipeline v2 was fixed in 5 commits on `feature/ingestion-v2`, addressing 10 categories of defects (invalid TypeScript, wrong CSS classes, broken JSON synthesis, missing "use client", showcase import errors, etc.). But the existing output (`output/atlas/`, `packages/themes/atlas/`, `packages/themes/lyra/`) is from the pre-fix pipeline run and still has all the bugs. We need to clean the old output, re-run the pipeline with the fixed code, validate the generated output against acceptance criteria, then wire it into base-template for interactive browser preview.

**IMPORTANT:** You are already on `feature/ingestion-v2`. Do NOT switch to develop. Do NOT create a new branch. Just continue working on this branch.

## Pre-flight

```bash
git branch --show-current  # confirm on feature/ingestion-v2
git status                 # confirm working tree status
pnpm type-check            # must be clean before starting
```

---

## Phase A: Clean Old Output

**Goal:** Remove stale pre-fix pipeline output so the re-run produces fresh results.

### Step A1: Delete old directories

```bash
rm -rf output/atlas packages/themes/atlas packages/themes/lyra
```

### Step A2: Fix packages/themes/package.json

Read `packages/themes/package.json`. Remove lyra exports — restore to just orion + vega:

```json
{
  "name": "@platform/themes",
  "version": "0.1.0",
  "private": true,
  "description": "Named visual theme packages for the Local Business Platform",
  "exports": {
    "./orion": "./orion/index.ts",
    "./vega": "./vega/index.ts"
  }
}
```

### Phase A Verification Gate — STOP if this fails

```bash
pnpm type-check
```

### Phase A Commit

```bash
git add packages/themes/package.json
git commit -m "$(cat <<'EOF'
chore: clean stale atlas/lyra output from pre-fix pipeline run

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase B: Re-run Pipeline

**Goal:** Run the fixed pipeline against colorcode.events to produce fresh, correct output.

### Step B1: Verify API key is available

```bash
# Check ANTHROPIC_API_KEY is set
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "ERROR: ANTHROPIC_API_KEY not set. Export it before running."
  exit 1
fi
echo "API key is set (${#ANTHROPIC_API_KEY} chars)"
```

### Step B2: Run the pipeline

```bash
npx tsx tools/analyse-site.ts --url https://colorcode.events/
```

This takes ~5-10 minutes. Wait for it to complete. Note the auto-assigned theme name from the output (it will pick the next constellation name — likely "lyra" since atlas/lyra were cleaned).

### Step B3: Identify output location

After the pipeline completes, find the output:

```bash
# Find the theme name from the most recent output
ls -dt output/*/ | head -1
ls -dt packages/themes/*/ | grep -v -E '(orion|vega)' | head -1
```

Store the theme name (e.g. "lyra") — all subsequent steps reference it as `<THEME>`.

### Phase B Verification Gate — STOP if this fails

1. The pipeline completed without crashes
2. `output/<THEME>/site-analysis.json` exists
3. `packages/themes/<THEME>/index.ts` exists
4. `packages/themes/<THEME>/components/` has files

```bash
# Verify output exists
THEME=$(ls -dt packages/themes/*/ | grep -v -E '(orion|vega)' | head -1 | xargs basename)
echo "Theme name: $THEME"
test -f "output/$THEME/site-analysis.json" && echo "✓ site-analysis.json" || echo "✗ MISSING site-analysis.json"
test -f "packages/themes/$THEME/index.ts" && echo "✓ index.ts" || echo "✗ MISSING index.ts"
ls packages/themes/$THEME/components/ | wc -l | xargs -I{} echo "✓ {} component files"
```

---

## Phase C: Validate Fresh Output

**Goal:** Automated checks confirming the pipeline fixes actually worked.

### Step C1: Colour check

Read `packages/themes/<THEME>/index.ts`. Verify that `brand.primary` is NOT `#000000`. Report the actual colour values.

### Step C2: TypeScript interface check

Scan all component files for hyphenated interface properties:

```bash
grep -rn '[a-zA-Z]-[0-9]\+\?:' packages/themes/$THEME/components/*.tsx || echo "✓ No hyphenated interface properties"
```

### Step C3: Showcase registry check

Read `packages/themes/<THEME>/showcase-registry.tsx`. Verify:

- No duplicate import names (same identifier imported from two files)
- Every imported file actually exists in `packages/themes/<THEME>/components/`

```bash
# Check for duplicate imports
grep "^import" packages/themes/$THEME/showcase-registry.tsx | awk '{print $3}' | sort | uniq -d
# Check all imported files exist
grep "from '\./components/" packages/themes/$THEME/showcase-registry.tsx | sed "s/.*from '\.\//packages\/themes\/$THEME\//" | sed "s/'.*/.tsx/" | while read f; do test -f "$f" && echo "✓ $f" || echo "✗ MISSING $f"; done
```

### Step C4: "use client" check

Verify:

- Navigation components HAVE `"use client"`
- Static content/hero/card components do NOT have `"use client"` (unless they contain interactive patterns)

```bash
# Components WITH "use client"
echo "=== Components with 'use client' ==="
grep -l '"use client"' packages/themes/$THEME/components/*.tsx | xargs -I{} basename {}
echo "=== Components WITHOUT 'use client' ==="
grep -rL '"use client"' packages/themes/$THEME/components/*.tsx | xargs -I{} basename {}
```

### Step C5: Example page check

Read the generated example home page. Verify:

- Uses `export default function Page()` (not `export function HomePage()`)
- Does NOT have blanket `"use client"` (unless it genuinely needs client state)

```bash
head -5 output/$THEME/example-pages/app/page.tsx
grep "export default function" output/$THEME/example-pages/app/page.tsx && echo "✓ Default export" || echo "✗ MISSING default export"
```

### Step C6: Type-check

```bash
pnpm type-check
```

### Phase C Verification Gate — STOP if this fails

All of C1-C6 must pass. If any check fails, report the specific failure and STOP. Do not proceed to the preview wiring.

---

## Phase D: Wire Into Base-Template for Preview

**Goal:** Get the generated theme rendering in a browser at localhost:3000.

**IMPORTANT:** The previous attempt to import .tsx components from `packages/themes/atlas/components/` failed because Turbopack can't parse .tsx files from external packages. Working themes (vega, orion) contain NO component .tsx files — only config + CSS. The solution: copy generated components into the site's own directory where Next.js compiles them normally.

### Step D1: Copy components into site directory

```bash
mkdir -p sites/base-template/components/generated
cp packages/themes/$THEME/components/*.tsx sites/base-template/components/generated/
```

### Step D2: Create barrel file

Create `sites/base-template/components/generated/index.ts` that re-exports all components:

```bash
# Generate barrel file from component files
for f in sites/base-template/components/generated/*.tsx; do
  basename=$(basename "$f" .tsx)
  # Extract the named export from the file
  export_name=$(grep "^export function\|^export const" "$f" | head -1 | sed 's/export function \([A-Za-z]*\).*/\1/' | sed 's/export const \([A-Za-z]*\).*/\1/')
  if [ -n "$export_name" ]; then
    echo "export { $export_name } from './$basename';"
  fi
done > sites/base-template/components/generated/index.ts
```

Verify the barrel file was generated correctly by reading it.

### Step D3: Create the preview home page

Read the generated example page at `output/<THEME>/example-pages/app/page.tsx`.

Create a modified version with rewritten imports. Replace every import like:

```ts
import { ComponentName } from "@platform/themes/<THEME>/components/component-slug";
```

with:

```ts
import { ComponentName } from "@/components/generated/component-slug";
```

**Back up the original page first:**

```bash
cp sites/base-template/app/page.tsx sites/base-template/app/page.tsx.bak
```

Write the modified page to `sites/base-template/app/page.tsx`.

### Step D4: Wire theme CSS

Read `sites/base-template/app/globals.css`. Back it up:

```bash
cp sites/base-template/app/globals.css sites/base-template/app/globals.css.bak
```

Replace the vega CSS import with the generated theme's CSS:

```css
@import "../../../packages/themes/<THEME>/globals.css";
```

Keep everything else the same (`@tailwind` directives, `@layer base` block).

### Step D5: Wire theme colours

Read `sites/base-template/theme.config.ts`. Back it up:

```bash
cp sites/base-template/theme.config.ts sites/base-template/theme.config.ts.bak
```

Read `packages/themes/<THEME>/index.ts` to get the colour values from `<THEME>DefaultConfig`.

Update `sites/base-template/theme.config.ts`:

- Keep the existing structure but replace colour values with the generated theme's colours
- Keep `componentRegistry: vegaRegistry` (we're not changing the registry, just colours and CSS)
- Update font families if the generated theme specifies different ones

### Step D6: Start dev server

```bash
cd sites/base-template && npm run dev &
DEV_PID=$!
sleep 10  # wait for compilation

# Quick smoke test
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
```

If the curl returns 200, the page is rendering. Report this.

**IMPORTANT:** After starting the dev server, output a clear message:

```
=== PREVIEW READY ===
Dev server running at http://localhost:3000/
Open this URL in your browser to visually inspect the generated theme.

The page should show the colorcode.events layout with:
- Navigation bar at top
- Hero section with headline
- CTA sections (speakers, sponsors, volunteers)
- Blog post grid
- Newsletter signup
- Footer

Press Ctrl+C in the terminal to stop the dev server when done.
=== END PREVIEW ===
```

Then STOP the dev server:

```bash
kill $DEV_PID 2>/dev/null
```

### Phase D Verification Gate

The dev server started and curl returned 200. Report any compilation errors or warnings from the dev server output.

---

## Phase E: Revert Base-Template

**Goal:** Restore base-template to its original state after preview.

### Step E1: Restore backed-up files

```bash
mv sites/base-template/app/page.tsx.bak sites/base-template/app/page.tsx
mv sites/base-template/app/globals.css.bak sites/base-template/app/globals.css
mv sites/base-template/theme.config.ts.bak sites/base-template/theme.config.ts
rm -rf sites/base-template/components/generated/
```

### Step E2: Verify clean restore

```bash
git diff sites/base-template/  # should show no changes
pnpm type-check
```

### Phase E Verification Gate — STOP if this fails

base-template is back to its original state with no diff.

---

## Phase F: Commit Fresh Pipeline Output

**Goal:** Preserve the fresh pipeline output on the branch for reference.

```bash
git add output/$THEME/ packages/themes/$THEME/ packages/themes/package.json
git commit -m "$(cat <<'EOF'
test(pipeline): re-run pipeline with fixed code against colorcode.events

Fresh output from the fixed ingestion pipeline v2. Generated theme package
with corrected colours, valid TypeScript interfaces, proper "use client"
directives, and working showcase registry.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Theme name auto-assigned by pipeline
3. Colour values in generated index.ts (brand.primary, secondary, accent)
4. Component count generated
5. Validation results (all C1-C6 checks)
6. Dev server result — did curl return 200?
7. Build status — confirm `pnpm type-check` passes
8. Any exceptions or intentional deviations from the plan

## Update Session File

After completing all phases, append to `output/sessions/2026-02-21_pipeline-test-preview/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was tested, validation results, preview outcome, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on `feature/ingestion-v2`
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Do NOT switch branches or create new branches
- The dev server preview is for the human to inspect — start it, report the URL, then stop it

## Completed

**Date:** 2026-02-21
**Status:** All phases executed successfully

All 6 phases completed. Phase A cleaned stale atlas/lyra output and restored package.json to orion+vega only. Phase B re-ran the fixed pipeline against colorcode.events with the Anthropic API key — TOKEN_SOURCE was "synthesis" (not defaults), yielding brand colours #2d2a6e/#f5c800/#00b140 and 31 AI-generated components. Phase C validated all output: no hyphenated interface properties, no duplicate showcase imports, Navigation and newsletter components correctly have "use client", example pages use `export default function Page()` without blanket "use client", type-check passes. Phase D wired the lyra theme into base-template for preview — required fixing 2 globals.css issues (opacity modifier `bg-brand-primary/90` incompatible with CSS custom properties, and non-existent `text-on-brand-secondary` class). Dev server returned HTTP 200 with 209KB response. Phase E successfully reverted base-template to original state. Phase F committed all output.

### Commits

- `c923503` chore: clean stale atlas/lyra output from pre-fix pipeline run
- `4ef4f21` test(pipeline): re-run pipeline with fixed code against colorcode.events
