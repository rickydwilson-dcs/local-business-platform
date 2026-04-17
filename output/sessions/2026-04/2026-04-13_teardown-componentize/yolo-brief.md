# YOLO Implementation Brief: Tear Down Componentize Pass

**Branch:** feature/teardown-componentize (created from develop)
**Session spec:** output/sessions/2026-04-13_teardown-componentize/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The `--pass componentize` in `extract-theme.ts` copies clone CSS verbatim into theme components and loads it at runtime via a `<link>` tag bypass, with Tailwind Preflight disabled. This approach is fundamentally broken — it fights the Next.js/Tailwind pipeline instead of working with it. It's being replaced by a `--pass translate` that uses AI to generate native Tailwind components from clone HTML/CSS/screenshots as reference (Session B, separate brief).

This session removes the broken componentize path and all its supporting infrastructure. Pure deletion/cleanup — no new features.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/teardown-componentize
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Delete dead files

**Goal:** Remove files that only exist to support the componentize/clone-CSS-loading approach.
**Model:** haiku — mechanical deletions

### Step 1.1: Delete files

```bash
# CSS preprocessor — the entire clone CSS sanitisation module
rm tools/lib/clone-css-preprocessor.ts

# Architecture doc for the <link> tag bypass pattern
rm docs/architecture/how-clone-css-works.md
```

### Step 1.2: Verification gate

```bash
# Verification gate — STOP if this fails
test ! -f tools/lib/clone-css-preprocessor.ts && echo "preprocessor deleted — OK"
test ! -f docs/architecture/how-clone-css-works.md && echo "doc deleted — OK"
pnpm type-check 2>&1 | tail -10
# type-check WILL fail here because extract-theme.ts imports clone-css-preprocessor
# That's expected — we fix it in Phase 2
echo "Phase 1 PASSED (type errors expected until Phase 2)"
```

**Commit:**

```bash
git add -u tools/lib/clone-css-preprocessor.ts docs/architecture/how-clone-css-works.md
git commit -m "$(cat <<'EOF'
chore(pipeline): delete clone CSS preprocessor and bypass docs

Remove tools/lib/clone-css-preprocessor.ts (383 lines of CSS
sanitisation for loading clone CSS at runtime) and the architecture
doc that described the <link> tag bypass pattern.

The clone-to-theme pipeline is being replaced with AI-generated
native Tailwind components — clone CSS is no longer loaded at runtime.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Strip extract-theme.ts of componentize code

**Goal:** Remove the `--pass componentize` code path and all supporting functions from `extract-theme.ts`. Keep: strip pass, argument parsing, brief discovery, CPF validation, computed style reading, stub page generation, package generation helpers.
**Model:** sonnet — needs judgment about what to keep vs remove

### Step 2.1: Read the file

Read `tools/extract-theme.ts` in full to understand the current structure.

### Step 2.2: Remove the preprocessor import

Remove this line:

```typescript
import { preprocessCloneCss } from "./lib/clone-css-preprocessor";
```

### Step 2.3: Remove componentize-only functions

Delete these functions entirely:

- `generateThemeGlobalsCss()` — the 3-line stub globals generator (~line 109-116)
- `generateHeaderFromClone()` — clone-verbatim header generator (~line 429-443)
- `generateFooterFromClone()` — clone-verbatim footer generator (~line 448-462)
- `generatePageLayoutFromClone()` — clone-verbatim page generator (~line 391-424)
- `extractCssFromCloneJsx()` — splits clone JSX into CSS block + JSX body (~line 340-357)
- `extractHeaderFooter()` — regex extraction of `<header>`/`<footer>` from JSX (~line 363-386)
- `sanitizeForJsx()` — strips JSON-valued HTML attributes (~line 275-326)
- `stripPopupNav()` — removes Breakdance popup/mobile-nav from page JSX (find this function and remove it)
- `formatCustomPropertiesBlock()` — formats computed CSS variables as `:root {}` block (~line 121-127)

**Keep these functions** (still needed for strip pass, stub generation, and future translate pass):

- `parseArgs()`, `discoverBrief()`, `toPascalCase()`
- `generateIndexTs()`, `generatePackageJson()`
- `generateComponentsBarrel()`, `generatePagesBarrel()`
- `generateStubPage()`, `findRequiredThemePageExports()`
- `generateHeaderComponent()`, `generateFooterComponent()` — fallback stub generators
- `generatePageLayout()` — fallback stub page generator

### Step 2.4: Remove the componentize pass block in main()

In `main()`, find and remove the entire `if (passArg === "componentize" || passArg === "both")` block. This is the largest deletion — approximately lines 519-931. It includes:

- CPF validation call
- Computed styles reading
- Clone JSX page reading + CSS extraction
- Header/footer extraction
- Theme package assembly (components, pages, barrel files)
- CSS preprocessor call
- Image/font copying
- Image path rewriting
- Test site deployment (clone CSS, images, fonts, icons)
- Site globals.css generation (without `@tailwind base`)
- Layout.tsx `<link>` tag injection
- Tailwind config `preflight: false` injection
- Visual QA gate

### Step 2.5: Update pass validation

Change the pass validation to only accept `translate`, `strip`, and `both`:

```typescript
const passArg = parsed.pass ?? "translate";
if (!["translate", "strip", "both"].includes(passArg)) {
  console.error("--pass must be 'translate', 'strip', or 'both'");
  process.exit(1);
}
```

### Step 2.6: Add placeholder for translate pass

Add a placeholder block so the file is structurally complete:

```typescript
// ── Translate pass ────────────────────────────────────────────────────────
if (passArg === "translate" || passArg === "both") {
  console.log("[extract] === Translate Pass ===");
  console.log("[extract] TODO: Translate pass not yet implemented.");
  console.log("[extract] This pass will use AI to generate native Tailwind components");
  console.log("[extract] from clone HTML/CSS/screenshots as reference material.");
  console.log(
    "[extract] See: output/sessions/2026-04-13_translate-pipeline/ for implementation brief."
  );
  // Future: vision analysis → section extraction → AI translation → page assembly → theme scaffold
}
```

### Step 2.7: Update the strip pass

The strip pass currently checks for `@ts-nocheck` to identify componentize-generated files. Since the translate pass will produce properly typed files, update the strip pass to process ALL `.tsx` files in the pages directory (not just `@ts-nocheck` ones). The content-stripper handles the actual replacement logic regardless.

Actually — the strip pass is fine as-is for now. It will be updated when the translate pass is implemented. Leave it unchanged.

### Step 2.8: Update usage comment at top of file

Update the usage comment to reflect the new pass options:

```typescript
/**
 * Extract Theme CLI
 *
 * Reads a validated CPF clone directory and produces a theme package.
 *
 * Usage:
 *   npx tsx tools/extract-theme.ts --clone corvus
 *   npx tsx tools/extract-theme.ts --clone corvus --pass translate
 *   npx tsx tools/extract-theme.ts --clone corvus --pass strip
 *   npx tsx tools/extract-theme.ts --brief output/briefs/abc123.json
 */
```

### Step 2.9: Verification gate

```bash
# Verification gate — STOP if this fails

# File should be significantly shorter (was ~997 lines, should be ~200-300)
LINES=$(wc -l < tools/extract-theme.ts)
echo "extract-theme.ts: $LINES lines"
[ "$LINES" -lt 500 ] && echo "Significantly reduced — OK" || echo "WARN: still $LINES lines"

# No references to deleted preprocessor
grep -c "clone-css-preprocessor\|preprocessCloneCss" tools/extract-theme.ts && { echo "FAIL: still references preprocessor"; exit 1; } || echo "No preprocessor references — OK"

# No componentize references
grep -c "componentize" tools/extract-theme.ts && { echo "FAIL: still references componentize"; exit 1; } || echo "No componentize references — OK"

# No clone-assets deployment
grep -c "clone-assets\|clone-styles\|preflight.*false" tools/extract-theme.ts && echo "WARN: may still have clone-asset references" || echo "No clone-asset references — OK"

# translate pass placeholder exists
grep -c "Translate Pass" tools/extract-theme.ts | grep -q "[1-9]" && echo "Translate placeholder exists — OK"

# strip pass still exists
grep -c "Strip Pass" tools/extract-theme.ts | grep -q "[1-9]" && echo "Strip pass preserved — OK"

pnpm type-check 2>&1 | tail -10
echo "Phase 2 PASSED"
```

**Commit:**

```bash
git add tools/extract-theme.ts
git commit -m "$(cat <<'EOF'
refactor(pipeline): remove --pass componentize from extract-theme

Remove the entire componentize code path (~700 lines):
- Clone JSX parsing (extractCssFromCloneJsx, extractHeaderFooter,
  sanitizeForJsx, stripPopupNav)
- Clone-verbatim generators (generatePageLayoutFromClone,
  generateHeaderFromClone, generateFooterFromClone)
- CSS preprocessor integration
- Clone CSS deployment (<link> tag injection, Preflight disable,
  clone-assets/ path, image path rewriting)

Replace with --pass translate (placeholder — implementation in
separate session). Default pass is now 'translate'.
Strip pass preserved unchanged.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Clean up corvus test site

**Goal:** Remove all clone-CSS-loading workarounds from the corvus test site and restore standard Tailwind wiring.
**Model:** sonnet

### Step 3.1: Read current site files

Read these in parallel:

- `sites/_corvus-digital-marketing-events/app/globals.css`
- `sites/_corvus-digital-marketing-events/app/layout.tsx`
- `sites/_corvus-digital-marketing-events/tailwind.config.ts`

### Step 3.2: Remove clone-assets public directory

```bash
rm -rf sites/_corvus-digital-marketing-events/public/clone-assets/
```

### Step 3.3: Restore standard globals.css

Replace the site's `app/globals.css` with the standard Tailwind pattern:

```css
@import "../../../packages/themes/corvus/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 3.4: Remove clone CSS link from layout.tsx

Read `sites/_corvus-digital-marketing-events/app/layout.tsx` and remove the `<link rel="stylesheet" href="/clone-assets/corvus/styles/clone.css" />` line.

### Step 3.5: Remove preflight disable from tailwind.config.ts

Read `sites/_corvus-digital-marketing-events/tailwind.config.ts` and remove the `corePlugins: { preflight: false }` block.

### Step 3.6: Verification gate

```bash
# Verification gate — STOP if this fails
test ! -d sites/_corvus-digital-marketing-events/public/clone-assets && echo "clone-assets removed — OK"
grep -c "@tailwind base" sites/_corvus-digital-marketing-events/app/globals.css | grep -q "1" && echo "Has @tailwind base — OK"
grep -c "clone-assets" sites/_corvus-digital-marketing-events/app/layout.tsx && { echo "FAIL: layout still has clone-assets link"; exit 1; } || echo "No clone-assets link — OK"
grep -c "preflight" sites/_corvus-digital-marketing-events/tailwind.config.ts && { echo "FAIL: still has preflight config"; exit 1; } || echo "No preflight config — OK"
echo "Phase 3 PASSED"
```

**Commit:**

```bash
git add sites/_corvus-digital-marketing-events/
git commit -m "$(cat <<'EOF'
chore(corvus): remove clone CSS loading workarounds from test site

- Delete public/clone-assets/ directory
- Restore standard globals.css with @tailwind base/components/utilities
- Remove <link> for clone-styles.css from layout.tsx
- Remove corePlugins: { preflight: false } from tailwind.config.ts

Site now uses standard Tailwind wiring (matching orion/vega sites).
Theme pages will be regenerated as native Tailwind by --pass translate.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Clean up corvus theme package

**Goal:** Remove clone CSS artifacts from the corvus theme package. Leave the theme functional enough that type-check passes (globals.css must exist, components must export, pages must export).
**Model:** sonnet

### Step 4.1: Remove clone CSS artifacts

```bash
rm -f packages/themes/corvus/clone-styles.css
rm -f packages/themes/corvus/clone-assets.manifest.json
rm -rf packages/themes/corvus/assets/
```

### Step 4.2: Replace globals.css with proper Tailwind globals

Read `packages/themes/orion/globals.css` (first 50 lines) to get the pattern.

Replace `packages/themes/corvus/globals.css` with a minimal but correctly structured file:

```css
@import "../../core-components/src/styles/animations.css";

/* Corvus theme — placeholder globals
   Will be fully generated by --pass translate.
   These minimal classes prevent build errors. */

.btn-primary {
  @apply px-6 py-3 rounded-lg bg-brand-primary text-on-brand-primary font-semibold;
}

.btn-secondary {
  @apply px-6 py-3 rounded-lg bg-surface-card text-brand-primary border border-brand-primary font-semibold;
}

.card {
  @apply bg-surface-card border border-surface-subtle rounded-xl p-6 shadow-sm;
}

.section {
  @apply py-16;
}

.container-standard {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

### Step 4.3: Replace page components with clean stubs

The current page components are 500-1100 line clone JSX files with `@ts-nocheck`. Replace them all with clean, typed stubs that will be regenerated by `--pass translate`.

For each page file in `packages/themes/corvus/pages/` (HomePage.tsx, AboutPage.tsx, BlogListPage.tsx, BlogPostPage.tsx, CustomPage.tsx, StubPages.tsx):

Replace with a clean stub like:

```tsx
interface HomePageProps {
  [key: string]: unknown;
}

export function CorvusHomePage(props: HomePageProps) {
  return (
    <main className="section container-standard">
      <p className="text-surface-foreground">
        Corvus home page — awaiting generation by extract-theme --pass translate.
      </p>
    </main>
  );
}
```

Use the correct component names: `CorvusHomePage`, `CorvusAboutPage`, `CorvusCustomPage`, `CorvusBlogListPage`, `CorvusBlogPostPage`. Check the current barrel export to get the exact names.

For StubPages.tsx, keep the existing stub structure (it's already clean).

### Step 4.4: Replace header/footer with clean stubs

Replace `packages/themes/corvus/components/header.tsx`:

```tsx
export function CorvusHeader(props: Record<string, unknown>) {
  return (
    <header className="bg-surface-inverse text-on-brand-primary py-4">
      <div className="container-standard flex items-center justify-between">
        <a href="/" className="text-xl font-bold">
          {String(props.siteName ?? "")}
        </a>
        <nav className="hidden md:flex gap-6">
          {/* Navigation will be generated by --pass translate */}
        </nav>
      </div>
    </header>
  );
}
```

Replace `packages/themes/corvus/components/footer.tsx`:

```tsx
export function CorvusFooter(props: Record<string, unknown>) {
  return (
    <footer className="bg-surface-inverse text-on-brand-primary py-12">
      <div className="container-standard">
        <p>
          &copy; {new Date().getFullYear()} {String(props.siteName ?? "")}
        </p>
      </div>
    </footer>
  );
}
```

### Step 4.5: Verification gate

```bash
# Verification gate — STOP if this fails
test ! -f packages/themes/corvus/clone-styles.css && echo "clone-styles.css deleted — OK"
test ! -f packages/themes/corvus/clone-assets.manifest.json && echo "manifest deleted — OK"
test ! -d packages/themes/corvus/assets && echo "assets dir deleted — OK"

# No @ts-nocheck in any corvus file
grep -r "@ts-nocheck" packages/themes/corvus/ && { echo "FAIL: still has @ts-nocheck"; exit 1; } || echo "No @ts-nocheck — OK"

# No bde- classes (Breakdance) in any corvus file
grep -r "bde-" packages/themes/corvus/ && { echo "FAIL: still has Breakdance classes"; exit 1; } || echo "No Breakdance classes — OK"

# No colorcode.events references
grep -r "colorcode" packages/themes/corvus/ && { echo "FAIL: still has colorcode references"; exit 1; } || echo "No colorcode references — OK"

# globals.css has @apply (proper Tailwind pattern)
grep -c "@apply" packages/themes/corvus/globals.css | grep -q "[1-9]" && echo "Has @apply classes — OK"

# globals.css imports animations
grep -c "animations.css" packages/themes/corvus/globals.css | grep -q "1" && echo "Imports animations — OK"

pnpm type-check 2>&1 | tail -10
echo "Phase 4 PASSED"
```

**Commit:**

```bash
git add packages/themes/corvus/
git commit -m "$(cat <<'EOF'
chore(corvus): replace clone JSX with clean Tailwind stubs

- Delete clone-styles.css, manifest, and assets directory
- Replace 1000+ line clone JSX pages with typed stub components
- Replace clone-verbatim header/footer with Tailwind stubs
- Replace globals.css with proper @apply-based component classes

All components use theme tokens (bg-brand-primary, etc.) and are
properly typed (no @ts-nocheck). Ready for --pass translate to
generate full implementations from clone reference material.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Final verification

**Goal:** Confirm everything is clean — type-check passes, no dead references, extract-theme runs without errors.
**Model:** haiku — mechanical verification

```bash
# Verification gate — STOP if this fails

# Type check
pnpm type-check 2>&1 | tail -10

# Run extract-theme to verify it parses (translate pass is a placeholder)
npx tsx tools/extract-theme.ts --clone corvus --pass translate 2>&1 | tail -10

# Run strip pass to verify it still works
npx tsx tools/extract-theme.ts --clone corvus --pass strip 2>&1 | tail -10

# No references to deleted preprocessor anywhere
grep -r "clone-css-preprocessor" tools/ --include="*.ts" && { echo "FAIL: preprocessor still referenced"; exit 1; } || echo "No preprocessor references — OK"

# No clone-assets references in tools
grep -r "clone-assets" tools/extract-theme.ts && { echo "FAIL: extract-theme still has clone-assets"; exit 1; } || echo "No clone-assets in extract-theme — OK"

echo "==="
echo "Commits on this branch:"
git log --oneline develop..HEAD
echo "==="
echo "Lines removed:"
git diff --stat develop..HEAD | tail -1
echo "Phase 5 PASSED"
```

No commit needed.

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                                  | File overlap      | Model  | Rationale                              |
| ----- | ------- | ------------------------------------------------------ | ----------------- | ------ | -------------------------------------- |
| —     | Phase 1 | — no parallel work in this phase —                     |                   | haiku  | Two file deletions, sequential         |
| —     | Phase 2 | — no parallel work in this phase —                     |                   | sonnet | Single file, large edit                |
| G1    | Phase 3 | Read `globals.css`, `layout.tsx`, `tailwind.config.ts` | none (reads only) | n/a    | Independent reads before editing       |
| —     | Phase 4 | — no parallel work in this phase —                     |                   | sonnet | Multiple files but edits are dependent |
| —     | Phase 5 | — no parallel work in this phase —                     |                   | haiku  | Single verification block              |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                              | Reason                                                  |
| --------------------------------- | ------------------------------------------------------- |
| Verification gates between phases | Each phase's output gates the next                      |
| Git commits                       | One per phase, in order                                 |
| Phase 2 depends on Phase 1        | Preprocessor must be deleted before removing its import |
| Phase 3 depends on Phase 2        | extract-theme must be clean before cleaning test site   |
| Phase 4 depends on Phase 3        | Test site must be clean before cleaning theme package   |

---

## Cost Estimate

| Phase                        | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Delete files        | haiku  | ~3k               | ~0.5k              | $0.002     |
| Phase 2: Strip extract-theme | sonnet | ~25k              | ~5k                | $0.15      |
| Phase 3: Clean test site     | sonnet | ~10k              | ~2k                | $0.06      |
| Phase 4: Clean theme package | sonnet | ~15k              | ~4k                | $0.11      |
| Phase 5: Final verification  | haiku  | ~5k               | ~0.5k              | $0.002     |
| **Total**                    |        | **~58k**          | **~12k**           | **~$0.32** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Lines removed (from `git diff --stat`)
4. Any exceptions or intentional deviations from the plan
5. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-13_teardown-componentize/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was removed, final line count of extract-theme.ts]

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

**Date:** 2026-04-13
**Status:** All phases executed successfully

The entire `--pass componentize` code path was removed from the pipeline. Deleted `tools/lib/clone-css-preprocessor.ts` (383 lines of CSS sanitisation) and `docs/architecture/how-clone-css-works.md`. Stripped `tools/extract-theme.ts` from 997 lines to 369 lines by removing all componentize-specific functions (`sanitizeForJsx`, `stripPopupNav`, `extractCssFromCloneJsx`, `extractHeaderFooter`, `generatePageLayoutFromClone`, `generateHeaderFromClone`, `generateFooterFromClone`, `generateThemeGlobalsCss`, `formatCustomPropertiesBlock`) and the entire componentize pass block from `main()`. The corvus test site had its `public/clone-assets/` directory removed, `globals.css` restored to standard Tailwind, the `<link>` tag removed from `layout.tsx`, and `corePlugins: { preflight: false }` removed from `tailwind.config.ts`. The corvus theme package had its 1000+ line clone JSX page files and clone-verbatim header/footer replaced with clean typed stubs using theme tokens, and `globals.css` replaced with proper `@apply`-based component classes. All 10 type-check tasks pass. Net: 7,411 lines removed, 80 added.

### Commits

- `dec3891` chore(pipeline): delete clone CSS preprocessor and bypass docs
- `46732e4` refactor(pipeline): remove --pass componentize from extract-theme
- `79df235` chore(corvus): remove clone CSS loading workarounds from test site
- `317c8bd` chore(corvus): replace clone JSX with clean Tailwind stubs

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.** The groups block is the authoritative execution plan.
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6` not `Opus 4.6`)
- **DO NOT touch** clone-site.ts, scaffold-client-site.ts, visual-qa-loop.ts, or cpf-validator.ts
- **DO NOT modify live site themes** (orion, vega, cygnus, solaris, lyra, nova, sirius, atlas, castor, polaris) — only corvus
- **DO NOT delete** content-stripper.ts — it's still needed by the strip pass
- **DO NOT delete** the strip pass code in extract-theme.ts — it still works and is needed
- Keep `generateStubPage()`, `findRequiredThemePageExports()`, `generateIndexTs()`, `generatePackageJson()`, `generateComponentsBarrel()`, `generatePagesBarrel()`, `generateHeaderComponent()`, `generateFooterComponent()`, `generatePageLayout()` — these are all still used
