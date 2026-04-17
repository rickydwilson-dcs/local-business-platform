# YOLO Implementation Brief: Extract-Theme Improvements + Pipeline Reset

**Branch:** feature/extract-improvements-and-reset (created from feature/extract-theme-verify-strip)
**Session spec:** output/sessions/2026-04-13_extract-improvements-and-reset/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The two-pass extraction (componentize → strip) is working — page layouts now preserve clone markup instead of generating stubs. Three improvements are needed before re-running the full pipeline:

1. **Image stripping** — strip pass only matches `assets/images/` paths but clones use `images/` paths. Alt attributes containing the business name are not replaced.
2. **Brief auto-discovery** — running `--clone corvus` without `--brief` defaults to empty business name, so the stripper can't find text to replace. Should auto-detect the matching brief from `output/briefs/`.
3. **Visual QA gate** — the componentize pass should optionally run a Playwright screenshot diff against reference screenshots before proceeding to strip.

After these improvements, clean up all pipeline artifacts (clone, theme, scaffolded site) so the user can re-run the full pipeline from scratch to validate the improvements end-to-end.

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
git checkout feature/extract-theme-verify-strip && git pull origin develop
git checkout -b feature/extract-improvements-and-reset
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Extend image stripping in content-stripper

**Goal:** Make the strip pass replace image `src` paths and `alt` attributes that contain business-specific content, not just `assets/images/` paths.
**Model:** sonnet

### Step 1.1: Read current image stripping logic

Read `tools/lib/content-stripper.ts` in full. The current image regex on line 175 only matches `src="...assets/images/..."`. Clone JSX uses paths like `src="images/colorcode-events-logo.svg"` (no `assets/` prefix).

### Step 1.2: Broaden image src matching

Replace the `assets/images/` pattern with a broader match that catches any `images/` path:

Change the regex from:

```typescript
const imgRe = /(<img(?:\s[^>]*)?\ssrc=")([^"]*assets\/images\/[^"]*)(")/gi;
```

To:

```typescript
const imgRe = /(<img(?:\s[^>]*)?\ssrc=")([^"]*\/images\/[^"]*)(")/gi;
```

Also update the simpler rewrite pattern on line 185:

```typescript
// From:
result = result.replace(/src="[^"]*assets\/images\/[^"]*"/gi, ...)
// To:
result = result.replace(/src="[^"]*\/images\/[^"]*"/gi, ...)
```

Also match `src="images/..."` (without leading slash):

```typescript
result = result.replace(/src="(images\/[^"]*)"/gi, ...)
```

### Step 1.3: Add alt attribute stripping

After the image src replacement, add a new step that replaces `alt` attributes containing the business name:

```typescript
// 8. Alt attributes containing business name
if (config.businessName) {
  const altRe = new RegExp(`(alt=")([^"]*${escapeRegex(config.businessName)}[^"]*)(")`, "gi");
  result = result.replace(altRe, (match, pre, _altText, post) => {
    const propName = nameGen.get("imageAlt");
    props.push({ name: propName, type: "string" });
    return `${pre}{props.${propName}}${post}`;
  });
}
```

Wait — that won't work because JSX attributes with `{props.x}` need to drop the quotes. Fix:

```typescript
result = result.replace(altRe, () => {
  const propName = nameGen.get("imageAlt");
  props.push({ name: propName, type: "string" });
  return `alt={props.${propName}}`;
});
```

Add `imageAlt` to the `SEMANTIC_NAMES` map:

```typescript
imageAlt: ["heroImageAlt", "logoAlt", "cardImageAlt", "sectionImageAlt"],
```

### Step 1.4: Verify

```bash
# Verification gate — STOP if this fails
npx tsx -e "
const { stripContent } = require('./tools/lib/content-stripper');
const result = stripContent(
  '<img src=\"images/colorcode-logo.svg\" alt=\"ColorCode Events Logo\" /><img src=\"/images/hero.jpg\" alt=\"Hero\" /><p>ColorCode Events is great.</p>',
  { businessName: 'ColorCode Events', address: { city: 'Eastbourne', postcode: 'BN21' } }
);
const hasImageProp = result.tsx.includes('props.imageSrc');
const hasAltProp = result.tsx.includes('props.imageAlt') || result.tsx.includes('props.logoAlt');
const hasBodyProp = result.tsx.includes('props.body');
if (!hasImageProp) throw new Error('Image src not stripped');
if (!hasAltProp) throw new Error('Alt attribute not stripped');
console.log('Image stripping: OK (' + result.propCount + ' props)');
" && echo "Phase 1 PASSED"
```

**Commit:**

```bash
git add tools/lib/content-stripper.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): extend content stripper for image paths and alt attrs

- Broaden image src matching: assets/images/ → any images/ path
- Strip alt attributes containing the business name
- Add imageAlt semantic name alternatives

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Brief auto-discovery

**Goal:** When running `extract-theme.ts --clone corvus` without `--brief`, auto-detect the matching brief from `output/briefs/` by matching `theme.name` to the clone name.
**Model:** sonnet

### Step 2.1: Read extract-theme.ts

Read the brief loading section in `tools/extract-theme.ts` — find where it reads the brief and falls back to empty defaults.

### Step 2.2: Add auto-discovery function

Add a function that scans `output/briefs/` for a matching brief:

```typescript
function discoverBrief(cloneName: string): JobBrief | null {
  const briefsDir = path.resolve(__dirname, "..", "output", "briefs");
  if (!fs.existsSync(briefsDir)) return null;

  for (const file of fs.readdirSync(briefsDir)) {
    if (!file.endsWith(".json")) continue;
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(briefsDir, file), "utf-8"));
      const brief = JobBriefSchema.parse(raw);
      if (brief.theme?.name === cloneName) {
        console.log(`[extract] Auto-discovered brief: output/briefs/${file}`);
        return brief;
      }
    } catch {
      // Skip invalid briefs
    }
  }
  return null;
}
```

### Step 2.3: Wire into main flow

In the `main()` function, after determining `cloneName`, if no `--brief` was provided:

```typescript
let brief: JobBrief | undefined;
if (parsed.brief) {
  // existing brief loading code
} else {
  const discovered = discoverBrief(cloneName);
  if (discovered) {
    brief = discovered;
  } else {
    console.log("[extract] No brief found — strip pass will use limited defaults");
  }
}
```

### Step 2.4: Verify

```bash
# Verification gate — STOP if this fails
# Run extract with --clone corvus (no --brief) and check it discovers the brief
npx tsx tools/extract-theme.ts --clone corvus --pass strip 2>&1 | grep -i "auto-discovered\|brief"
echo "Phase 2 PASSED"
```

**Commit:**

```bash
git add tools/extract-theme.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): auto-discover brief when using --clone without --brief

Scans output/briefs/ for a JSON file with matching theme.name.
Enables strip pass to find business name, phone, email etc.
without requiring explicit --brief flag.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Add --verify flag for visual QA gate

**Goal:** Add a `--verify` flag to extract-theme that runs a Playwright screenshot diff between the componentized theme and reference screenshots after the componentize pass, before proceeding to strip.
**Model:** sonnet

### Step 3.1: Read visual-qa-loop.ts

Read `tools/lib/visual-qa-loop.ts` to understand the interface — `runVisualQALoop(config)` expects `clonePath`, `maxIterations`, `thresholds`, `mode`.

### Step 3.2: Add --verify flag to CLI

In `parseArgs()`, add:

```typescript
else if (args[i] === "--verify") result.verify = true;
```

### Step 3.3: Wire visual QA after componentize pass

In `main()`, after the componentize pass completes and before the strip pass:

```typescript
if (verify) {
  console.log("[extract] Running visual QA gate...");

  // The componentize pass wrote theme components to packages/themes/{name}/
  // Wire them to the test site and capture screenshots
  const testSitePath = path.resolve(
    __dirname,
    "..",
    `sites/_${themeName}-${brief?.business?.trade ?? "test"}`
  );
  const referencePath = path.resolve(cloneDir, "reference-screenshots");

  if (fs.existsSync(testSitePath) && fs.existsSync(referencePath)) {
    const { runVisualQALoop } = await import("./lib/visual-qa-loop");
    const qaResult = await runVisualQALoop({
      clonePath: testSitePath,
      maxIterations: 1, // Single comparison, no auto-fix
      thresholds: { home: 0.1, about: 0.1, default: 0.15 },
      mode: "pixel",
    });

    if (qaResult.passed) {
      console.log("[extract] Visual QA PASSED — proceeding to strip");
    } else {
      console.log("[extract] Visual QA FAILED — diffs:");
      for (const d of qaResult.finalDiffs) {
        console.log(
          `  ${d.page}: ${(d.diffPercent * 100).toFixed(1)}% (threshold: ${d.pass ? "PASS" : "FAIL"})`
        );
      }
      console.log("[extract] Continuing to strip despite failures (visual QA is advisory in v1)");
    }
  } else {
    console.log("[extract] Skipping visual QA — test site or reference screenshots not found");
  }
}
```

**Note:** The visual QA is advisory in v1 — it logs results but doesn't block the strip pass. This is because the test site may not be properly wired yet, and blocking would prevent the pipeline from completing. Future versions can make it a hard gate.

### Step 3.4: Verify

```bash
# Verification gate — STOP if this fails
npx tsx tools/extract-theme.ts --help 2>&1 | head -5
# Should mention --verify flag
pnpm type-check 2>&1 | tail -5
echo "Phase 3 PASSED"
```

**Commit:**

```bash
git add tools/extract-theme.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): add --verify flag for visual QA gate

When --verify is passed, runs Playwright screenshot diff between
componentized theme and reference screenshots after componentize
and before strip. Advisory in v1 (logs results, doesn't block).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Clean up pipeline artifacts for fresh re-run

**Goal:** Remove the corvus clone, theme output, and scaffolded test site so the pipeline can be re-run from scratch with the improvements.
**Model:** haiku — mechanical deletion

### Step 4.1: Remove clone output

```bash
rm -rf output/clones/corvus
echo "Clone removed"
```

### Step 4.2: Reset corvus theme to minimal state

The corvus theme package needs to stay (showcase imports it) but should be reset to a clean state that the pipeline will overwrite. Reset it to the minimal working state — registry + config + stub components:

Read the current `packages/themes/corvus/index.ts` to preserve the registry and config. Then remove the pipeline-generated pages and reset components to stubs.

```bash
# Remove pipeline-generated pages (keep the typed stubs)
# The pipeline will regenerate these
rm -f packages/themes/corvus/pages/HomePage.tsx
rm -f packages/themes/corvus/pages/AboutPage.tsx
rm -f packages/themes/corvus/pages/BlogListPage.tsx
rm -f packages/themes/corvus/pages/BlogPostPage.tsx
rm -f packages/themes/corvus/pages/CustomPage.tsx
```

Wait — we can't remove pages that the test site imports. The test site is also being removed. So we can strip the theme back to minimal stubs safely.

Actually, the simplest approach: just delete the scaffolded test site and remove the pipeline-generated page content. Keep the theme package with its stubs (the showcase site needs it to import and register).

### Step 4.3: Remove scaffolded test site

```bash
rm -rf sites/_corvus-digital-marketing-events
echo "Test site removed"
```

### Step 4.4: Reset corvus theme pages to typed stubs

For each page that was overwritten by the componentize+strip pass (the ones with `@ts-nocheck`), restore them to the typed stub versions. The easiest way: regenerate the stubs.

Write each stub file back. The stubs use `[key: string]: unknown` props and render an empty `<main>`.

For the 5 pages that were componentized (HomePage, AboutPage, BlogListPage, BlogPostPage, CustomPage), write stubs:

```typescript
// Template for each:
interface {PageName}PageProps {
  [key: string]: unknown;
}

export function Corvus{PageName}Page(props: {PageName}PageProps) {
  void props;
  return (
    <main className="page-{pagename}">
      {/* corvus {pagename} layout — stub, to be regenerated by pipeline */}
    </main>
  );
}
```

The other 8 pages (Services, ServiceDetail, Locations, LocationDetail, Projects, ProjectDetail, Reviews, Contact) should already be typed stubs — verify they are.

### Step 4.5: Reset corvus components to stubs

Reset `components/header.tsx` and `components/footer.tsx` to the minimal stubs (the componentize pass overwrote them with clone markup).

### Step 4.6: Update lockfile

```bash
pnpm install
```

### Step 4.7: Verify clean state

```bash
# Verification gate — STOP if this fails
test ! -d output/clones/corvus && echo "Clone: removed" || echo "FAIL: clone still exists"
test ! -d sites/_corvus-digital-marketing-events && echo "Test site: removed" || echo "FAIL: test site still exists"
test -d packages/themes/corvus && echo "Theme package: exists (for showcase)" || echo "FAIL: theme missing"

# Verify theme stubs are clean (no @ts-nocheck)
grep -l "@ts-nocheck" packages/themes/corvus/pages/*.tsx 2>/dev/null && echo "FAIL: componentized pages still present" || echo "Pages: clean stubs"
grep -l "@ts-nocheck" packages/themes/corvus/components/*.tsx 2>/dev/null && echo "FAIL: componentized components still present" || echo "Components: clean stubs"

pnpm type-check 2>&1 | tail -5
echo "Phase 4 PASSED"
```

**Commit:**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: reset pipeline artifacts for fresh end-to-end re-run

Remove clone output, scaffolded test site, and componentized
theme pages. Corvus theme reset to minimal stubs (showcase needs
the package to exist). Ready for full pipeline re-run.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Merge to develop

**Goal:** Merge both feature branches to develop so the improvements are on the main development branch.
**Model:** haiku — mechanical git operations

```bash
git checkout develop
git merge feature/extract-theme-verify-strip --no-edit
git merge feature/extract-improvements-and-reset --no-edit
```

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -10
echo "==="
echo "Pipeline tools updated:"
grep -c "pass" tools/extract-theme.ts | xargs echo "  --pass references:"
grep -c "discoverBrief" tools/extract-theme.ts | xargs echo "  auto-discovery:"
grep -c "verify" tools/extract-theme.ts | xargs echo "  --verify references:"
echo "==="
echo "Content stripper image support:"
grep -c "images/" tools/lib/content-stripper.ts | xargs echo "  image path matches:"
grep -c "imageAlt" tools/lib/content-stripper.ts | xargs echo "  alt attr matches:"
echo "==="
echo "Clean state:"
test ! -d output/clones/corvus && echo "  No clone" || echo "  CLONE EXISTS"
test ! -d sites/_corvus-digital-marketing-events && echo "  No test site" || echo "  TEST SITE EXISTS"
echo "Phase 5 PASSED"
```

**Commit (if merge produced changes):**

```bash
git status --porcelain | head -5
# If clean, no commit needed (fast-forward merges)
# If conflicts were resolved, commit the merge
```

---

## Phase 6: Final verification

**Goal:** Confirm develop is clean and ready for a fresh pipeline run.
**Model:** haiku

```bash
# Verification gate — STOP if this fails
git branch --show-current  # should be develop
pnpm type-check 2>&1 | tail -5
echo "==="
echo "Ready for fresh pipeline run:"
echo "  1. npx tsx tools/clone-site.ts --url https://colorcode.events --name corvus"
echo "  2. npx tsx tools/extract-theme.ts --clone corvus --pass componentize --verify"
echo "  3. npx tsx tools/extract-theme.ts --clone corvus --pass strip"
echo "  4. npx tsx tools/scaffold-client-site.ts --theme corvus --trade digital-marketing-events --brief output/briefs/entry-a-corvus-events.json"
echo "Phase 6 PASSED"
```

No commit needed.

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                              | File overlap | Model | Rationale                |
| ----- | ------- | ---------------------------------- | ------------ | ----- | ------------------------ |
| —     | Phase 1 | — no parallel work in this phase — |              |       | Single file modification |
| —     | Phase 2 | — no parallel work in this phase — |              |       | Single file modification |
| —     | Phase 3 | — no parallel work in this phase — |              |       | Single file modification |
| —     | Phase 4 | — no parallel work in this phase — |              |       | Sequential cleanup       |
| —     | Phase 5 | — no parallel work in this phase — |              |       | Sequential merge         |
| —     | Phase 6 | — no parallel work in this phase — |              |       | Verification only        |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                           | Reason                            |
| ------------------------------ | --------------------------------- |
| All phases are sequential      | Each builds on the previous       |
| Phase 4 must follow Phases 1-3 | Improvements applied before reset |
| Phase 5 must follow Phase 4    | Merge after all changes complete  |

---

## Cost Estimate

| Phase                         | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ----------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Image stripping      | sonnet | ~10k              | ~2k                | $0.06      |
| Phase 2: Brief auto-discovery | sonnet | ~10k              | ~2k                | $0.06      |
| Phase 3: Visual QA flag       | sonnet | ~12k              | ~2k                | $0.07      |
| Phase 4: Pipeline reset       | haiku  | ~8k               | ~3k                | $0.006     |
| Phase 5: Merge to develop     | haiku  | ~5k               | ~0.5k              | $0.002     |
| Phase 6: Final verify         | haiku  | ~3k               | ~0.5k              | $0.001     |
| **Total**                     |        | **~48k**          | **~10k**           | **~$0.20** |

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Whether image stripping now catches `images/` paths and alt attributes
4. Whether brief auto-discovery found `entry-a-corvus-events.json`
5. Whether --verify flag is wired (even if visual QA is advisory)
6. Whether pipeline artifacts are cleaned up and develop is ready for re-run
7. The exact commands for the user to re-run the pipeline

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-13_extract-improvements-and-reset/yolo-brief.md`:

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
- Never push — leave all changes on the feature branch (except Phase 5 merge to develop)
- **Consult the `## Parallel execution groups` section before launching any work.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for mechanical work, `model: sonnet` for standard edits
- The Co-Authored-By line in commits must reflect the orchestrator model used
- **DO NOT touch** clone-site.ts, scaffold-client-site.ts, visual-qa-loop.ts, or cpf-validator.ts
- **DO NOT modify live site themes** (orion, vega, cygnus, solaris)
- **DO NOT push** — the user will deploy after reviewing
- The content-stripper image regex must work for ANY source site (not just WordPress/colorcode.events) — match generic `images/` paths, not site-specific patterns
- When resetting corvus theme stubs, keep the component barrel using lowercase filenames and named exports (the jiti fix from earlier today)

## Completed

**Date:** 2026-04-13
**Status:** All phases executed successfully

All 6 phases implemented without errors. Phase 1 extended the content stripper: broadened image src matching from `assets/images/` to any `images/` path (with and without leading slash), and added alt attribute stripping — critically, alt stripping was moved to run before the businessName global replacement to prevent partial replacement that would produce invalid JSX. Phase 2 added `discoverBrief()` auto-scan of `output/briefs/` by `theme.name`, verified against the corvus brief. Phase 3 added `--verify` flag wired to `runVisualQALoop` after the componentize pass (advisory in v1 — skips if test site or reference screenshots missing). Phase 4 cleaned up all pipeline artifacts: removed the clone, the scaffolded test site, reset 5 componentized pages and the header component to typed stubs, and removed 34 pipeline-generated component files from `packages/themes/corvus/components/`. Phase 5 merged both feature branches into develop via fast-forward. Phase 6 confirmed develop is clean on 9 passing type-check tasks and ready for a full pipeline re-run.

### Commits

- `1ee9565` feat(pipeline): extend content stripper for image paths and alt attrs
- `3cc4081` feat(pipeline): auto-discover brief when using --clone without --brief
- `78e5e82` feat(pipeline): add --verify flag for visual QA gate
- `2b762cf` chore: reset pipeline artifacts for fresh end-to-end re-run
