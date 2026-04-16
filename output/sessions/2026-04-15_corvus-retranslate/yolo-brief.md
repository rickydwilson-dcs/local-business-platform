# YOLO Implementation Brief: Re-translate Corvus Theme via Extract Pipeline

**Branch:** feature/corvus-retranslate (created from develop)
**Session spec:** output/sessions/2026-04-15_corvus-retranslate/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The corvus theme was ingested on April 12 using the old `analyse-site.ts` pipeline, which produced vision-only blueprint stubs — not real component implementations. The `extract-theme.ts --pass translate` pipeline (which converts clone HTML → React/Tailwind components via LLM) was implemented on April 13 but was never run against the corvus clone. The current corvus components are placeholders that render blank rectangles and placeholder text.

This brief re-runs the translate pipeline against the existing corvus clone, assesses the output quality, and fixes any pipeline issues that prevent faithful component generation. The goal is to determine whether the pipeline produces usable components, and if not, to identify and fix the specific failure points.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | /                      | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | /                      | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | /                      | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/corvus-retranslate   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Diagnostic — Extract Sections & Assess Clone Quality

**Goal:** Run the section extractor in isolation to verify the corvus clone HTML is properly structured for enrichment. Log every extracted section with its heading text, character count, and which blueprint it would correlate to.
**Model:** sonnet — requires reading pipeline code and writing a diagnostic script

### Steps

1. Read `tools/lib/clone-section-extractor.ts` and `tools/lib/html-structure-analyzer.ts` to understand the extraction API.

2. Write a diagnostic script at `tools/diagnose-clone-sections.ts`:

```typescript
/**
 * Diagnostic: Extract sections from a clone HTML file and report what enrichment would produce.
 * Usage: npx tsx tools/diagnose-clone-sections.ts --clone corvus
 */
```

The script should:

- Call `extractCloneSections()` on `output/clones/corvus/html/pages/home.html`
- For each section: print index, tag, heading text (or "[no heading]"), HTML char count, first 3 CSS classes
- Then simulate the correlation: create a set of mock blueprints (use names from the existing corvus components: NavDarkBand, HeroHeadlineColoured, HeroEventBanner, CtaYellowBand, CtaBlueBand, CtaGreenBand, BlogCardGrid, AboutSplitDark, GalleryPhotoStrip, NewsletterDarkBand, FooterMultiColumn) and run `correlateWithBlueprints()` to see which HTML section each blueprint gets matched to
- Print a summary: how many blueprints got enriched with HTML vs. left empty

3. Run the diagnostic:

```bash
npx tsx tools/diagnose-clone-sections.ts --clone corvus
```

4. Save the output to `output/sessions/2026-04-15_corvus-retranslate/phase1-section-diagnosis.txt`

```bash
# Verification gate — STOP if this fails
# The script must run without errors
npx tsx tools/diagnose-clone-sections.ts --clone corvus > /dev/null 2>&1
```

```bash
git add tools/diagnose-clone-sections.ts output/sessions/2026-04-15_corvus-retranslate/
git commit -m "$(cat <<'EOF'
chore: add clone section diagnostic script and corvus analysis

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Run Full Translate Pipeline to Temp Directory

**Goal:** Run `extract-theme.ts --pass translate --clone corvus --out /tmp/corvus-test` and capture the full output log. This tests the pipeline end-to-end without modifying the existing theme.
**Model:** sonnet — needs to interpret pipeline output and log analysis

### Steps

1. Run the translate pipeline, capturing all output:

```bash
npx tsx tools/extract-theme.ts --clone corvus --pass translate --out /tmp/corvus-test 2>&1 | tee output/sessions/2026-04-15_corvus-retranslate/phase2-translate-log.txt
```

This will take 2-5 minutes (LLM calls for vision analysis + per-component generation).

2. After completion, assess the output:

```bash
# Count generated files
ls -la /tmp/corvus-test/components/*.tsx | wc -l

# Check which used AI vs placeholder
grep -l "py-16 px-4" /tmp/corvus-test/components/*.tsx   # placeholder pattern
grep -l "placeholder" /tmp/corvus-test/components/*.tsx   # explicit placeholder text

# Check for hex literals that survived (gauntlet failures)
grep -rn "#[0-9a-fA-F]\{3,8\}" /tmp/corvus-test/components/*.tsx || echo "No hex literals — good"

# Check for hardcoded colorcode.events URLs
grep -rn "colorcode.events" /tmp/corvus-test/components/*.tsx || echo "No external URLs — good"
```

3. For each generated component, write a one-line quality assessment to `output/sessions/2026-04-15_corvus-retranslate/phase2-component-quality.md`:

Format:

```markdown
# Component Quality Assessment

| Component                  | AI/Placeholder | Lines | Has Layout | Uses Tokens | Props Wired | Quality |
| -------------------------- | -------------- | ----- | ---------- | ----------- | ----------- | ------- |
| nav-dark-band.tsx          | AI             | 45    | yes        | yes         | yes         | good    |
| hero-headline-coloured.tsx | placeholder    | 12    | no         | n/a         | no          | fail    |
| ...                        |                |       |            |             |             |         |
```

Quality ratings:

- **good**: Has real layout structure, uses theme tokens, props are meaningful
- **partial**: Has layout but missing key visual elements or props
- **fail**: Placeholder or structurally broken

4. Read and compare the generated `cta-yellow-band.tsx` against the existing one and the HTML prototype. Document the differences.

5. Read the generated `HomePage.tsx` — check if it still renders all components with zero props (known issue in `generateHomePage()`).

```bash
# Verification gate — STOP if this fails
test -d /tmp/corvus-test/components && echo "Output directory exists" || (echo "FAIL: no output" && exit 1)
test -f /tmp/corvus-test/components/index.ts && echo "Barrel exists" || (echo "FAIL: no barrel" && exit 1)
```

```bash
git add output/sessions/2026-04-15_corvus-retranslate/
git commit -m "$(cat <<'EOF'
chore: corvus translate pipeline output assessment

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Compare Generated vs Existing Components

**Goal:** Side-by-side diff of each generated component against the existing corvus theme components. Identify which components improved and which need pipeline fixes.
**Model:** sonnet — requires reading and comparing multiple files

### Steps

1. For each component file in `/tmp/corvus-test/components/`, diff against `packages/themes/corvus/components/`:

```bash
for f in /tmp/corvus-test/components/*.tsx; do
  name=$(basename "$f")
  existing="packages/themes/corvus/components/$name"
  if [ -f "$existing" ]; then
    echo "=== $name ==="
    diff --brief "$existing" "$f"
    echo "Old lines: $(wc -l < "$existing")"
    echo "New lines: $(wc -l < "$f")"
    echo ""
  else
    echo "=== $name === NEW (not in existing theme)"
  fi
done
```

2. Write `output/sessions/2026-04-15_corvus-retranslate/phase3-comparison.md` with:
   - A table: component name, old line count, new line count, key differences
   - For each component rated "good" in Phase 2: whether it's safe to replace the existing file
   - For each component rated "fail": what specifically went wrong (placeholder fallback? hex literal? gauntlet rejection?)
   - Overall assessment: what % of the homepage is now usable from the pipeline output

3. Read the translate log from Phase 2 and extract all warning lines:

```bash
grep -E "Warning|warning|⚠|placeholder|failed|retry" output/sessions/2026-04-15_corvus-retranslate/phase2-translate-log.txt
```

Document which components triggered gauntlet failures and why.

```bash
# Verification gate — comparison file must exist
test -f output/sessions/2026-04-15_corvus-retranslate/phase3-comparison.md
```

```bash
git add output/sessions/2026-04-15_corvus-retranslate/
git commit -m "$(cat <<'EOF'
chore: corvus component comparison — generated vs existing

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Fix Pipeline Issues (if needed)

**Goal:** Based on Phase 2-3 findings, apply targeted fixes to the extract-theme pipeline. Only fix issues that cause the most component failures.
**Model:** sonnet — standard implementation work on pipeline tools

### Decision Gate

Read `phase3-comparison.md`. If:

- **>70% of components rated "good"**: Skip to Phase 5 (copy good components to real theme). The pipeline is working well enough.
- **30-70% rated "good"**: Fix the top 2-3 failure causes (likely: section correlation mismatches, hex literal over-zealous rejection, or prompt quality). Then re-run the pipeline for just the failing components.
- **<30% rated "good"**: The pipeline has fundamental issues. Document them and STOP — don't try to fix everything in one session.

### Likely Fixes (based on prior analysis)

**Fix A: Token mapping accuracy**
File: `tools/lib/computed-style-token-mapper.ts`
The regex for extracting Breakdance brand colors from `global-settings.css` may produce wrong colors (e.g., `#3b82f6` instead of `#292661`). Check the actual `output/clones/corvus/assets/css/global-settings.css` to verify.

**Fix B: Section correlation quality**
File: `tools/lib/clone-section-extractor.ts`
The heading-text match is fragile. If vision says "CtaYellowBand" but the HTML heading says "Call For Speakers", matching fails. Consider adding CSS class pattern matching as a secondary correlation strategy.

**Fix C: Hex literal false positives**
File: `tools/lib/theme-component-generator.ts`
The gauntlet replaces ANY component with a placeholder if it contains hex literals that can't be auto-repaired. SVG fills (`fill="#xxx"`) and decorative shape colors may trigger this unnecessarily. Consider allowing hex in SVG path data or adding more repair patterns.

**Fix D: HomePage prop wiring**
File: `tools/extract-theme.ts` (function `generateHomePage`)
The `generateHomePage()` function always renders components with zero props (line 371-374). This is a known gap — the pipeline generates components that accept props but never wires any data to them.

### Steps

1. Read the Phase 3 comparison to determine which fixes are needed.
2. Apply the fixes to the pipeline files.
3. If fixes were applied, re-run the translate for failing components only (or full re-run if the fix is in early pipeline stages like token mapping).

```bash
# Verification gate — pipeline tools must still pass type-check
npx tsc --noEmit tools/extract-theme.ts tools/lib/theme-component-generator.ts tools/lib/clone-section-extractor.ts 2>&1 | head -20
# Looser gate: just confirm no new syntax errors in the tools
```

```bash
git add tools/ output/sessions/2026-04-15_corvus-retranslate/
git commit -m "$(cat <<'EOF'
fix: extract-theme pipeline improvements from corvus retranslate

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Apply Good Components to Real Theme

**Goal:** Copy pipeline-generated components that passed quality assessment into the real corvus theme package. Update theme.config.ts colors. Verify the site renders.
**Model:** sonnet — standard file edits

### Steps

1. For each component rated "good" in Phase 3:
   - Copy from `/tmp/corvus-test/components/` to `packages/themes/corvus/components/`
   - Verify the named export matches what `components/index.ts` expects

2. For components rated "partial":
   - Copy the generated version as a starting point
   - Apply targeted manual fixes (document each fix)

3. For components rated "fail":
   - Keep the existing file (even if it's a stub)
   - Document what the pipeline needs to fix for next time

4. Update `sites/_corvus-digital-marketing-events/theme.config.ts`:
   - Read the token mapping from the Phase 2 translate log
   - Fix brand colors to match what the pipeline extracted from computed-styles.json
   - Update font family if the pipeline detected Aeonik

5. Run the dev server and visually verify:

```bash
cd sites/_corvus-digital-marketing-events && npm run dev &
sleep 5
# Check that the server starts without errors
curl -s http://localhost:3000 | head -20
kill %1
```

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
```

```bash
git add packages/themes/corvus/ sites/_corvus-digital-marketing-events/theme.config.ts output/sessions/2026-04-15_corvus-retranslate/
git commit -m "$(cat <<'EOF'
feat(corvus): apply retranslated components from extract-theme pipeline

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message.

### Intra-phase groups

| Group | Phase   | Items                                                                | File overlap | Model  | Rationale                                   |
| ----- | ------- | -------------------------------------------------------------------- | ------------ | ------ | ------------------------------------------- |
| G1    | Phase 1 | Read `clone-section-extractor.ts`, Read `html-structure-analyzer.ts` | none (reads) | n/a    | Independent reads before writing script     |
| G2    | Phase 3 | Diff all component files, Extract warnings from translate log        | none         | sonnet | Independent analysis tasks                  |
| —     | Phase 2 | — no parallel work in this phase — (single pipeline run)             | n/a          | n/a    | Sequential: run pipeline, then assess       |
| —     | Phase 4 | — depends on findings — serialise all fixes                          | n/a          | sonnet | Fixes may overlap in pipeline files         |
| —     | Phase 5 | — no parallel work — (sequential copy + verify)                      | n/a          | sonnet | Components may share barrel, must serialise |

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                              | Reason                                                |
| --------------------------------- | ----------------------------------------------------- |
| Verification gates between phases | Each phase's output gates the next                    |
| Git commits                       | One commit per phase, in order                        |
| Phase 2 pipeline run              | Single process, makes LLM API calls sequentially      |
| Phase 4 pipeline fixes            | Fixes may touch the same files (generator, extractor) |
| Phase 5 component copies          | Must update barrel export after each copy             |

---

## Cost Estimate

| Phase                       | Model  | Est. input tokens                                      | Est. output tokens          | Est. cost                           |
| --------------------------- | ------ | ------------------------------------------------------ | --------------------------- | ----------------------------------- |
| Phase 1: Section diagnosis  | sonnet | ~15k                                                   | ~3k                         | $0.09                               |
| Phase 2: Run translate      | sonnet | ~8k (orchestration) + ~80k (LLM calls inside pipeline) | ~30k (generated components) | $0.45 (pipeline API calls dominate) |
| Phase 3: Compare components | sonnet | ~25k                                                   | ~3k                         | $0.12                               |
| Phase 4: Fix pipeline       | sonnet | ~20k                                                   | ~5k                         | $0.12                               |
| Phase 5: Apply to theme     | sonnet | ~15k                                                   | ~5k                         | $0.09                               |
| **Total**                   |        | **~163k**                                              | **~46k**                    | **~$0.87**                          |

Note: Phase 2's cost is dominated by the Anthropic API calls made _inside_ the extract-theme pipeline (vision analysis + per-component generation). These are billed separately from the YOLO session's own token usage. Expect ~$1-2 additional API cost from the pipeline's internal LLM calls.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Component quality summary: how many components were successfully generated by the pipeline vs. needed manual fixes vs. still stubs
4. Pipeline issues identified and fixed (if any)
5. Remaining work needed (components still at "fail" quality)
6. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | opus      | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-15_corvus-retranslate/yolo-brief.md`:

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
- The extract-theme pipeline makes its own Anthropic API calls internally — ensure `.env.local` has `ANTHROPIC_API_KEY` set before running Phase 2
- When copying generated components to the real theme in Phase 5, preserve the component export names and barrel structure in `components/index.ts`
- Do NOT modify the site's `app/page.tsx` or `app/layout.tsx` in this session — those are wiring changes for a follow-up session
