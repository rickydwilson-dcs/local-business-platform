# YOLO Implementation Brief: Two-Pass Theme Extraction (Componentize → Verify → Strip)

**Branch:** feature/extract-theme-verify-strip (created from develop)
**Session spec:** output/sessions/2026-04-13_extract-theme-verify-strip/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The clone pipeline produces high-fidelity HTML that looks nearly identical to the reference site (confirmed: even CSS animations survive). But `extract-theme.ts` throws away the clone's actual JSX and generates empty stub page layouts. The result: a theme that compiles but renders as a blank page.

The fix: split the extract step into two passes. Pass 1 (componentize) preserves the clone's actual markup as theme components — producing a renderable "clone of the clone" that can be visually verified. Pass 2 (strip) replaces content text with props to produce the reusable theme shell. A visual QA gate between the passes ensures fidelity is preserved.

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
git checkout -b feature/extract-theme-verify-strip
pnpm type-check   # must be clean before starting
```

**Also verify the clone exists:**

```bash
test -d output/clones/corvus/jsx/pages && echo "Clone ready" || echo "STOP: Run clone-site first"
```

---

## Phase 1: Add `--pass` flag to extract-theme CLI

**Goal:** Add a `--pass componentize|strip|both` argument to `tools/extract-theme.ts`. Default: `both` (current behavior). This is just the CLI plumbing — no logic changes yet.
**Model:** sonnet

### Step 1.1: Read the file

Read `tools/extract-theme.ts` in full to understand the current structure.

### Step 1.2: Modify argument parsing

In `parseArgs()`, add:

```typescript
function parseArgs(): { clone?: string; brief?: string; pass?: string } {
  // ... existing code ...
  // Add:
  else if (args[i] === "--pass" && args[i + 1]) result.pass = args[++i];
  // ...
}
```

Update the `main()` function to read the pass argument and validate it:

```typescript
const passArg = parsed.pass ?? "both";
if (!["componentize", "strip", "both"].includes(passArg)) {
  console.error("--pass must be 'componentize', 'strip', or 'both'");
  process.exit(1);
}
```

### Step 1.3: Update help text

Update the usage comment at the top of the file:

```
 * Usage:
 *   npx tsx tools/extract-theme.ts --clone corvus
 *   npx tsx tools/extract-theme.ts --clone corvus --pass componentize
 *   npx tsx tools/extract-theme.ts --clone corvus --pass strip
 *   npx tsx tools/extract-theme.ts --brief output/briefs/abc123.json
```

```bash
# Verification gate — STOP if this fails
npx tsx tools/extract-theme.ts 2>&1 | head -3
# Should show updated usage text with --pass flag
```

**Commit:**

```bash
git add tools/extract-theme.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): add --pass flag to extract-theme CLI

Accepts 'componentize', 'strip', or 'both' (default).
CLI plumbing only — no logic changes yet.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Implement componentize pass — use clone JSX as page bodies

**Goal:** Rewrite the page layout generation to preserve the clone's actual JSX markup instead of generating stubs. This is the core fix.
**Model:** opus — this is the highest-judgment phase, touching the main orchestrator logic across multiple interacting functions

### Step 2.1: Read current state

Read these files in parallel:

- `tools/extract-theme.ts` (full)
- `tools/lib/content-stripper.ts` (full)
- `output/clones/corvus/jsx/pages/HomePage.tsx` (first 100 lines — understand the clone JSX format)

### Step 2.2: Create CSS extraction helper

The clone JSX files start with a large CSS block as a comment. Create a helper to extract it:

Add to `extract-theme.ts` (or a new `tools/lib/clone-css-extractor.ts` if it's complex):

```typescript
function extractCssFromCloneJsx(jsx: string): { css: string; jsxBody: string } {
  // Clone JSX format:
  // Line 1-N: CSS comment block (starts with "// Extracted inline styles:")
  // Line N+1: empty line
  // Line N+2+: actual JSX (export function...)

  // Find where the JSX export starts
  const exportMatch = jsx.match(/^export function/m);
  if (!exportMatch || exportMatch.index === undefined) {
    return { css: "", jsxBody: jsx };
  }

  const cssBlock = jsx.slice(0, exportMatch.index);
  const jsxBody = jsx.slice(exportMatch.index);

  // Clean the CSS: remove comment markers, extract just the CSS rules
  const css = cssBlock
    .replace(/^\/\/\s?/gm, "") // Remove // comment markers
    .replace(/^\/\*.*?\*\/$/gm, "") // Remove /* */ comments
    .trim();

  return { css, jsxBody };
}
```

### Step 2.3: Create header/footer extraction helper

Add to `extract-theme.ts`:

```typescript
function extractHeaderFooter(jsx: string): {
  header: string | null;
  footer: string | null;
  bodyWithoutHeaderFooter: string;
} {
  // Find <header ...>...</header> block
  const headerMatch = jsx.match(/<header\b[\s\S]*?<\/header>/);
  const footerMatch = jsx.match(/<footer\b[\s\S]*?<\/footer>/);

  let body = jsx;
  if (headerMatch) body = body.replace(headerMatch[0], "{/* header extracted to component */}");
  if (footerMatch) body = body.replace(footerMatch[0], "{/* footer extracted to component */}");

  return {
    header: headerMatch?.[0] ?? null,
    footer: footerMatch?.[0] ?? null,
    bodyWithoutHeaderFooter: body,
  };
}
```

### Step 2.4: Rewrite generatePageLayout for componentize pass

Replace the current `generatePageLayout()` with a version that preserves the clone's JSX:

```typescript
function generatePageLayoutFromClone(
  themeName: string,
  pageName: string,
  cloneJsxBody: string
): string {
  const pascal = toPascalCase(themeName);
  const pagePascal = toPascalCase(pageName);

  // Extract the function body from the clone JSX
  // Clone format: export function homePage() { return (<>...</>); }
  const bodyMatch = cloneJsxBody.match(/return\s*\(\s*([\s\S]*)\s*\);\s*\}/);
  const body = bodyMatch ? bodyMatch[1] : cloneJsxBody;

  return `interface ${pagePascal}PageProps {
  [key: string]: unknown;
}

export function ${pascal}${pagePascal}Page(props: ${pagePascal}PageProps) {
  void props;
  return (
    ${body}
  );
}
`;
}
```

### Step 2.5: Rewrite header/footer generation for componentize pass

Replace `generateHeaderComponent()` and `generateFooterComponent()` to use extracted markup:

```typescript
function generateHeaderFromClone(themeName: string, headerMarkup: string): string {
  const pascal = toPascalCase(themeName);
  return `export function ${pascal}Header(props: Record<string, unknown>) {
  void props;
  return (
    ${headerMarkup}
  );
}
`;
}

function generateFooterFromClone(themeName: string, footerMarkup: string): string {
  const pascal = toPascalCase(themeName);
  return `export function ${pascal}Footer(props: Record<string, unknown>) {
  void props;
  return (
    ${footerMarkup}
  );
}
`;
}
```

### Step 2.6: Update the main flow for componentize pass

In `main()`, when `passArg === "componentize"` or `passArg === "both"`:

1. Read each clone JSX file from `output/clones/{name}/jsx/pages/`
2. For each file, call `extractCssFromCloneJsx()` to separate CSS from JSX
3. From the home page JSX, call `extractHeaderFooter()` to pull out header/footer
4. Call `generatePageLayoutFromClone()` for each page, using the JSX body (minus header/footer)
5. Call `generateHeaderFromClone()` / `generateFooterFromClone()` with the extracted markup
6. Collect all CSS blocks, deduplicate, write to `globals.css`
7. Generate the component barrel (`components/index.ts`) with named exports
8. Generate the pages barrel (`pages/index.ts`)
9. Generate `index.ts` with registry + config (using existing `generateIndexTs()`)
10. Write `package.json`

**Do NOT call `stripContent()`** in the componentize pass — keep all text in place.

### Step 2.7: Update the main flow for strip pass

When `passArg === "strip"`:

1. Read the theme package from `packages/themes/{name}/pages/`
2. For each page layout file, call `stripContent()` with business config
3. Replace the page layout file with the stripped version
4. Update the props interface
5. Also strip header/footer components

When `passArg === "both"`:

1. Run componentize pass
2. Run strip pass on the result

### Step 2.8: Verify componentize output

```bash
# Verification gate — STOP if this fails
# Run componentize pass on the corvus clone
npx tsx tools/extract-theme.ts --clone corvus --pass componentize 2>&1 | tail -10

# Check the output contains real markup, not stubs
grep -c "className" packages/themes/corvus/pages/HomePage.tsx
# Should be >> 5 (real markup has many className attributes)

grep -c "bde-" packages/themes/corvus/pages/HomePage.tsx || true
# Should find Breakdance CSS classes from colorcode.events

# Header should have real markup
grep -c "className" packages/themes/corvus/components/header.tsx
# Should be > 3

pnpm type-check 2>&1 | tail -5
echo "Phase 2 PASSED"
```

**Commit:**

```bash
git add tools/extract-theme.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): implement componentize pass — preserve clone JSX

extract-theme --pass componentize now preserves the clone's actual
HTML-to-JSX markup as theme page layouts instead of generating stubs.

- CSS extracted from clone JSX comment blocks → globals.css
- Header/footer extracted from home page markup → components/
- Page bodies preserved with all content/styles/animations intact
- Strip pass runs content-stripper on componentize output

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Wire corvus theme to test site and verify rendering

**Goal:** Update the corvus test site to use the componentized theme and verify it renders like colorcode.events.
**Model:** sonnet

### Step 3.1: Regenerate corvus theme with componentize pass

```bash
npx tsx tools/extract-theme.ts --clone corvus --pass componentize
```

### Step 3.2: Check the test site wiring

Read `sites/_corvus-digital-marketing-events/app/layout.tsx` to verify it imports from corvus theme. It should already be wired from our earlier fixes. If not, fix the imports.

Read `sites/_corvus-digital-marketing-events/theme.config.ts` — should import `corvusDefaultConfig` and `corvusRegistry`.

### Step 3.3: Update test site pages to use corvus page layouts

The test site's `app/page.tsx` should import `CorvusHomePage` from `@platform/themes/corvus/pages`. Check if this is already the case (from our earlier fix). If so, the page should now render the actual colorcode.events markup instead of a blank stub.

### Step 3.4: Start dev server and verify

```bash
# Kill any existing dev servers
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
rm -f sites/_corvus-digital-marketing-events/.next/dev/lock

# Start dev server
cd sites/_corvus-digital-marketing-events && npx next dev &
DEV_PID=$!
sleep 20

# Quick smoke test — check the page renders
curl -s http://localhost:3000 | head -50
kill $DEV_PID 2>/dev/null
```

### Step 3.5: Type check

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -10
echo "Phase 3 PASSED"
```

**Note:** The page may have TypeScript errors due to the clone JSX containing WordPress-specific patterns. If type-check fails on the corvus site specifically, document the errors but continue — the visual fidelity verification is the priority.

**Commit:**

```bash
git add packages/themes/corvus/ sites/_corvus-digital-marketing-events/
git commit -m "$(cat <<'EOF'
feat(corvus): regenerate theme with componentized clone markup

Theme page layouts now contain actual colorcode.events markup
instead of stubs. Visual fidelity should match the clone HTML.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Implement strip pass

**Goal:** Implement the strip pass that runs content-stripper on componentized page layouts to produce the reusable theme shell.
**Model:** sonnet

### Step 4.1: Verify content-stripper works on large JSX

Read `tools/lib/content-stripper.ts` to confirm it handles the larger clone JSX files (500-2000 lines). The stripping logic uses regex patterns — should work on any size input, but verify.

### Step 4.2: Test the strip pass

```bash
# Run strip pass on the componentized corvus theme
npx tsx tools/extract-theme.ts --clone corvus --pass strip 2>&1 | tail -10

# Verify props were generated
grep -c "props\." packages/themes/corvus/pages/HomePage.tsx
# Should find multiple prop references

# Verify text was replaced
grep -c "ColorCode" packages/themes/corvus/pages/HomePage.tsx || echo "0 — business name stripped"
# Should be 0 (business name replaced with props)
```

### Step 4.3: Test the "both" pass (end-to-end)

```bash
# Clean and run both passes
npx tsx tools/extract-theme.ts --clone corvus --pass both 2>&1 | tail -10
```

### Step 4.4: Type check

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -10
echo "Phase 4 PASSED"
```

**Commit:**

```bash
git add tools/extract-theme.ts tools/lib/content-stripper.ts packages/themes/corvus/
git commit -m "$(cat <<'EOF'
feat(pipeline): implement strip pass for content removal

extract-theme --pass strip runs content-stripper on componentized
page layouts, replacing business text/images with component props.
The 'both' pass chains componentize → strip automatically.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Final verification

**Goal:** Full type-check and build verification.
**Model:** haiku — mechanical verification

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -10
echo "==="
echo "Commits on this branch:"
git log --oneline develop..HEAD
echo "==="
echo "Corvus theme structure:"
ls packages/themes/corvus/
ls packages/themes/corvus/components/
ls packages/themes/corvus/pages/
echo "==="
echo "HomePage line count (should be >> 10, not a stub):"
wc -l packages/themes/corvus/pages/HomePage.tsx
echo "Phase 5 PASSED"
```

No commit needed.

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                                          | File overlap      | Model | Rationale                              |
| ----- | ------- | -------------------------------------------------------------- | ----------------- | ----- | -------------------------------------- |
| —     | Phase 1 | — no parallel work in this phase —                             |                   |       | Single file CLI modification           |
| G1    | Phase 2 | Read extract-theme.ts, content-stripper.ts, HomePage.tsx clone | none (reads only) | n/a   | Independent reads before editing       |
| —     | Phase 3 | — no parallel work in this phase —                             |                   |       | Sequential: regenerate → wire → verify |
| —     | Phase 4 | — no parallel work in this phase —                             |                   |       | Sequential: strip → test → verify      |
| —     | Phase 5 | — no parallel work in this phase —                             |                   |       | Single verification                    |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                              | Reason                                            |
| --------------------------------- | ------------------------------------------------- |
| Verification gates between phases | Each phase's output gates the next                |
| Git commits                       | One per phase, in order                           |
| Phase 2 depends on Phase 1        | --pass flag needed before implementing passes     |
| Phase 3 depends on Phase 2        | Componentize must work before wiring to test site |
| Phase 4 depends on Phase 2        | Strip pass runs on componentize output            |

---

## Cost Estimate

| Phase                      | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| -------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: CLI flag          | sonnet | ~8k               | ~1k                | $0.04      |
| Phase 2: Componentize pass | opus   | ~20k              | ~6k                | $0.75      |
| Phase 3: Wire + verify     | sonnet | ~10k              | ~2k                | $0.06      |
| Phase 4: Strip pass        | sonnet | ~12k              | ~3k                | $0.08      |
| Phase 5: Final verify      | haiku  | ~5k               | ~0.5k              | $0.002     |
| **Total**                  |        | **~55k**          | **~12.5k**         | **~$0.93** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Any exceptions or intentional deviations from the plan
4. Whether the componentized corvus theme renders actual markup (not stubs)
5. Whether the strip pass successfully replaces content with props
6. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | opus      | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-13_extract-theme-verify-strip/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

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
- **DO NOT touch** clone-site.ts, scaffold-client-site.ts, visual-qa-loop.ts, or cpf-validator.ts — those are working correctly
- **DO NOT modify live site themes** (orion, vega, cygnus, solaris) — only corvus
- The clone JSX files may contain WordPress/Breakdance-specific CSS classes — preserve them as-is in the componentize pass. They provide the visual fidelity.
- If type-check fails specifically on the corvus test site due to the large JSX bodies (e.g., implicit any in complex expressions), add targeted type annotations to fix — do NOT revert to stubs
