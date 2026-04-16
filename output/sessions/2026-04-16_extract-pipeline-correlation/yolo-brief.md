# YOLO Implementation Brief: Source-Agnostic Section Correlation for Extract-Theme Pipeline

**Branch:** feature/extract-pipeline-correlation (created from develop)
**Session spec:** output/sessions/2026-04-16_extract-pipeline-correlation/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The extract-theme pipeline's section correlator matches vision-analysis blueprints to clone HTML sections using only heading text matching and index fallback — both fragile and source-specific. In the corvus retranslate (April 16), 2 of 11 components were misassembled because the correlator matched them to the wrong HTML fragment. The pipeline already has a content-signal classifier (`classifySection()` in html-structure-analyzer.ts) that produces `ComponentCategory` from source-agnostic signals, but the correlator doesn't use it.

This brief implements multi-signal scored correlation using category matching, keyword overlap, content shape, and semantic tag matching — all source-agnostic. The synthesis was reviewed and approved via dual-model peer review (Claude + Codex). Implement it exactly as specified below.

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
git checkout -b feature/extract-pipeline-correlation   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Extend CloneSection with Content Signals

**Goal:** Enrich each extracted HTML section with source-agnostic classification signals by integrating the existing `classifySection()` from html-structure-analyzer.ts.
**Model:** sonnet — reads 2 files, edits 1-2 files

### Steps

1. Read these files in parallel:
   - `tools/lib/clone-section-extractor.ts` (~139 lines)
   - `tools/lib/html-structure-analyzer.ts` (~565 lines) — specifically `classifySection()`, `countImages()`, `extractFirstHeading()`, `hasStatContent()`, `hasBlogContent()`, `hasTestimonialContent()`

2. Add optional fields to the `CloneSection` interface in `clone-section-extractor.ts`:

```typescript
export interface CloneSection {
  index: number;
  tag: string;
  headingText?: string;
  html: string;
  cssClasses: string[];
  // New content-signal fields:
  estimatedCategory?: ComponentCategory;
  hasForm?: boolean;
  hasImages?: boolean;
  imageCount?: number;
  charCount: number;
  headingCandidates?: string[]; // all h1-h6 texts, not just first
  isSpacerLike?: boolean;
}
```

3. In `extractCloneSections()`, after building each `CloneSection`, populate the new fields:
   - Import `classifySection` and helper functions from `html-structure-analyzer.ts` (export them if not already exported — check which are currently private)
   - Call `classifySection(tag, innerHtml, headingText, hasImages, hasForm, isFirstSection, cssClasses)` → `estimatedCategory`
   - Extract all headings (not just first) via a regex scan for `<h[1-6]>` → `headingCandidates`
   - Count images via `countImages()` → `imageCount`
   - Check for `<form>` presence → `hasForm`
   - Compute `charCount = html.length`
   - Compute `isSpacerLike = charCount < 300 && !hasForm && (imageCount ?? 0) <= 1 && (headingCandidates?.length ?? 0) === 0`

4. If any helper functions in `html-structure-analyzer.ts` need to be exported (they may be module-private), add the `export` keyword. Do NOT restructure the file — just widen visibility.

```bash
# Verification gate — STOP if this fails
pnpm type-check
npx tsx tools/diagnose-clone-sections.ts --clone corvus 2>&1 | head -5
# Should run without errors (output format unchanged at this point)
```

```bash
git add tools/lib/clone-section-extractor.ts tools/lib/html-structure-analyzer.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): enrich CloneSection with source-agnostic content signals

Adds estimatedCategory, hasForm, hasImages, imageCount, charCount,
headingCandidates, and isSpacerLike to CloneSection by integrating
the existing classifySection() from html-structure-analyzer.ts.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Multi-Signal Scored Correlation

**Goal:** Replace the heading-match + index-fallback correlation with a scored multi-signal algorithm.
**Model:** sonnet — core algorithm implementation in one file

### Steps

1. Read `tools/lib/clone-section-extractor.ts` (now enriched from Phase 1) and `tools/lib/reference-analysis-types.ts` (for `SectionBlueprint` type).

2. Add a `scoreMatch()` function to `clone-section-extractor.ts`:

```typescript
interface MatchScore {
  total: number;
  breakdown: string; // human-readable: "heading:+50, category:+30, keywords:+10"
}

function scoreMatch(blueprint: SectionBlueprint, section: CloneSection): MatchScore;
```

Scoring rules (integer points):

| Signal             | Points            | Condition                                                                                                |
| ------------------ | ----------------- | -------------------------------------------------------------------------------------------------------- |
| Heading text match | +50               | Any word from blueprint keywords appears as substring in any section headingCandidate (case-insensitive) |
| Category match     | +30               | `blueprint.category === section.estimatedCategory`                                                       |
| Keyword overlap    | +10 each, max +30 | Blueprint keywords ∩ section visible-text keywords                                                       |
| Form shape match   | +15               | Blueprint has form-related contentSlots AND section.hasForm === true                                     |
| Image shape match  | +15               | Blueprint has image-related contentSlots AND section.hasImages === true                                  |
| Semantic tag match | +10               | Navigation↔header tag, Footer↔footer tag                                                               |
| Spacer penalty     | -50               | section.isSpacerLike === true                                                                            |

3. Blueprint keyword extraction (source-agnostic — from the blueprint, not the HTML):
   - Tokenise `blueprint.name` from PascalCase → lowercase words (e.g. "CtaYellowBand" → ["cta", "yellow", "band"])
   - Tokenise `blueprint.purpose` → lowercase words, filter common stop words (the, a, an, and, or, with, for, of, in, to, on, is, are, has, from, that, this, its, by, as, at)
   - Tokenise `blueprint.contentSlots` names from camelCase → lowercase words
   - Combine into a unique Set

4. Section keyword extraction:
   - Strip HTML tags from `section.html` to get visible text
   - Lowercase, split on whitespace/punctuation
   - Combine with `section.headingCandidates` (lowercased)
   - Store as a Set for O(1) lookup

5. Replace `correlateWithBlueprints()` body with:
   - For each blueprint in order:
     - Score all unclaimed sections
     - Select the highest-scoring section above the weak threshold (20)
     - Claim it (add to `usedSectionIndices`)
   - Dual threshold for confidence:
     - `>= 50`: high confidence
     - `>= 30`: medium confidence
     - `>= 20`: low confidence (accept with warning log)
     - `< 20`: no match — leave blueprint un-enriched
   - Add optional fields to the returned blueprint: `matchScore`, `matchConfidenceLevel`, `matchBreakdown`

6. Log each match:

```
[extract] CtaYellowBand → section 3 (score: 70, heading:+50 keywords:+20) [high]
[extract] CtaGreenBand → UNMATCHED (best: section 6 score: 15, below threshold 20)
```

```bash
# Verification gate — STOP if this fails
pnpm type-check
npx tsx tools/diagnose-clone-sections.ts --clone corvus 2>&1 | grep -E "CtaGreenBand|CtaBlueBand|AboutSplitDark"
# CtaGreenBand should NOT match section 6 (the newsletter/footer section)
```

```bash
git add tools/lib/clone-section-extractor.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): multi-signal scored section correlation

Replaces heading-match + index-fallback with scored algorithm using
category matching, keyword overlap, content shape, and semantic tags.
All signals are source-agnostic — no CMS-specific class patterns.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Mega-Section Handling

**Goal:** Prevent mega-sections from being incorrectly reused by multiple blueprints.
**Model:** sonnet — small addition to the assignment loop

### Steps

1. In `correlateWithBlueprints()`, after the scoring loop, add mega-section detection:
   - A section is a mega-section if: `charCount > 5000 AND (headingCandidates?.length ?? 0) >= 3`

2. When a mega-section is claimed by one blueprint, it's already removed from the pool (existing `usedSectionIndices` logic handles this). The only addition:
   - When a blueprint's best-scoring section was already claimed AND that section was a mega-section, log: `[extract] [ComponentName] → UNMATCHED (best candidate section N consumed as mega-section by [OtherComponent])`

3. This requires tracking which sections are mega-sections and which blueprint claimed them. Add a `Map<number, string>` tracking `sectionIndex → claimingBlueprintName`.

```bash
# Verification gate — STOP if this fails
pnpm type-check
npx tsx tools/diagnose-clone-sections.ts --clone corvus 2>&1 | grep "mega"
# Should show mega-section detection for section 3 (14414 chars, 3+ headings)
```

```bash
git add tools/lib/clone-section-extractor.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): mega-section detection and safe single-assignment

Detects large sections with multiple headings and prevents them from
being incorrectly reused by multiple blueprints. Logs explicit reason
when a blueprint is left unmatched due to mega-section consumption.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Update Diagnostic Tool

**Goal:** Show all new signals and scoring in the diagnostic output.
**Model:** sonnet — updates to one file

### Steps

1. Read `tools/diagnose-clone-sections.ts` (~104 lines).

2. Update the section table to show new fields:

```
Idx  | Tag     | Category    | Heading              | Chars | Spacer | Form | Imgs | Headings
-----|---------|-------------|----------------------|-------|--------|------|------|--------
0    | header  | Navigation  | [none]               |  1900 | no     | no   | 1    | 0
1    | section | Hero        | [none]               |   814 | no     | no   | 0    | 0
3    | section | CTA         | Call For Speakers    | 14414 | no     | no   | 8    | 6 (MEGA)
...
```

3. Update the correlation table to show score and breakdown:

```
Blueprint            | Match | Idx | Score | Breakdown                              | Confidence
---------------------|-------|-----|-------|----------------------------------------|----------
NavDarkBand          | YES   |   0 |    40 | tag:+10 category:+30                   | medium
HeroHeadlineColoured | YES   |   1 |    30 | category:+30                           | medium
CtaYellowBand        | YES   |   3 |    70 | heading:+50 keywords:+20               | high
CtaGreenBand         | NO    |   — |     — | best: section 6 (15, below threshold)  | —
...
```

4. Add `--verbose` flag support: when set, show top-3 candidate sections per blueprint with scores.

5. Add summary section: matched count, unmatched count (with reasons), average confidence, mega-section warnings.

```bash
# Verification gate — STOP if this fails
pnpm type-check
npx tsx tools/diagnose-clone-sections.ts --clone corvus
# Output should be readable with all new columns
```

```bash
git add tools/diagnose-clone-sections.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): diagnostic tool shows correlation signals and scores

Updates diagnose-clone-sections.ts to display category, charCount,
spacer status, score breakdowns, confidence levels, and mega-section
warnings. Adds --verbose flag for top-3 candidate details.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Integration & Final Verification

**Goal:** Confirm the pipeline works end-to-end with the new correlation. Run a full translate to verify component quality improves.
**Model:** sonnet — integration testing and logging

### Steps

1. Add correlation score logging to `tools/extract-theme.ts` after `enrichBlueprintsForPage()`:
   - Log enrichment rate and any unmatched blueprints with reasons
   - Use the `matchBreakdown` field from the enriched blueprints
   - Only emit detailed logging when `EXTRACT_VERBOSE=1` env var is set

2. Run the full translate pipeline on corvus to verify:

```bash
EXTRACT_VERBOSE=1 npx tsx tools/extract-theme.ts --clone corvus --pass translate --out /tmp/corvus-correlation-test 2>&1 | tee output/sessions/2026-04-16_extract-pipeline-correlation/phase5-translate-log.txt
```

3. Compare results: check whether previously misassembled components (CtaGreenBand, ContentSplitAbout) are now either:
   - Correctly matched to the right HTML section, OR
   - Left unmatched (generating from blueprint-only, which is better than misassembly)

4. Save the diagnostic output:

```bash
npx tsx tools/diagnose-clone-sections.ts --clone corvus > output/sessions/2026-04-16_extract-pipeline-correlation/phase5-diagnostic.txt
```

5. Write a brief summary to `output/sessions/2026-04-16_extract-pipeline-correlation/phase5-results.md`:
   - Enrichment rate (old vs new)
   - Which components changed match targets
   - Whether any new misassemblies appeared

```bash
# Verification gate — STOP if this fails
pnpm type-check
test -f output/sessions/2026-04-16_extract-pipeline-correlation/phase5-diagnostic.txt
```

```bash
git add tools/extract-theme.ts output/sessions/2026-04-16_extract-pipeline-correlation/
git commit -m "$(cat <<'EOF'
feat(pipeline): integrate scored correlation into translate pass

Adds correlation score logging to extract-theme.ts. Includes corvus
verification showing improved match accuracy with the new algorithm.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message.

### Intra-phase groups

| Group | Phase   | Items                                                                             | File overlap      | Model  | Rationale                               |
| ----- | ------- | --------------------------------------------------------------------------------- | ----------------- | ------ | --------------------------------------- |
| G1    | Phase 1 | Read `clone-section-extractor.ts`, Read `html-structure-analyzer.ts`              | none (reads only) | n/a    | Independent reads before editing        |
| G2    | Phase 2 | Read `clone-section-extractor.ts` (updated), Read `reference-analysis-types.ts`   | none (reads only) | n/a    | Independent reads before algorithm work |
| —     | Phase 3 | — no parallel work in this phase — (single small edit to correlateWithBlueprints) | n/a               | sonnet | Single file edit                        |
| —     | Phase 4 | — no parallel work in this phase — (single file edit to diagnostic tool)          | n/a               | sonnet | Single file edit                        |
| G3    | Phase 5 | Run `pnpm type-check`, Run diagnostic tool                                        | none (read-only)  | n/a    | Independent verification commands       |

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                                            | Reason                                                                      |
| --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Verification gates (`pnpm type-check`) between phases           | Each phase's output gates the next                                          |
| Git commits                                                     | One commit per phase, in order                                              |
| Phase 1 → Phase 2 (CloneSection enrichment → scoring algorithm) | Phase 2 reads the enriched CloneSection fields added in Phase 1             |
| Phase 2 → Phase 3 (scoring → mega-section handling)             | Phase 3 adds to the assignment loop written in Phase 2                      |
| Phase 5 translate run                                           | Single pipeline process with LLM API calls, must complete before assessment |

---

## Cost Estimate

| Phase                          | Model  | Est. input tokens | Est. output tokens | Est. cost                   |
| ------------------------------ | ------ | ----------------- | ------------------ | --------------------------- |
| Phase 1: Content signals       | sonnet | ~12k              | ~3k                | $0.07                       |
| Phase 2: Scoring algorithm     | sonnet | ~15k              | ~5k                | $0.10                       |
| Phase 3: Mega-section handling | sonnet | ~10k              | ~1k                | $0.04                       |
| Phase 4: Diagnostic update     | sonnet | ~10k              | ~3k                | $0.06                       |
| Phase 5: Integration           | sonnet | ~12k              | ~2k + pipeline API | $0.06 + ~$1-2 pipeline      |
| **Total**                      |        | **~59k**          | **~14k**           | **~$0.33 + ~$1-2 pipeline** |

Note: Phase 5 runs the full extract-theme translate pipeline which makes its own Anthropic API calls internally (vision analysis + per-component generation). Those are billed separately (~$1-2).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Correlation improvement: old enrichment rate vs new, which components changed match targets
4. Any exceptions or intentional deviations from the plan
5. Token usage and cost estimate:

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

After completing all phases, append to `output/sessions/2026-04-16_extract-pipeline-correlation/yolo-brief.md`:

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
- The extract-theme pipeline makes its own Anthropic API calls internally — ensure `.env.local` has `ANTHROPIC_API_KEY` set before running Phase 5
- **Source-agnostic constraint is paramount.** Do NOT add any CMS-specific logic (Breakdance class patterns, WordPress assumptions, Shopify-specific selectors). All correlation signals must work on any HTML source.
- The `classifySection()` function in html-structure-analyzer.ts is the primary category classifier. Reuse it — do not duplicate classification logic.
