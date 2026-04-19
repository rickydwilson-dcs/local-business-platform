# YOLO Implementation Brief: Design Brief Pipeline — Prompt Constraints & Defensive Layout

**Branch:** feature/design-brief-pipeline (continue current branch)
**Session spec:** output/sessions/2026-04/2026-04-17_design-brief-pipeline/yolo-brief-constraints.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The first real pipeline run (navagarden.hu) confirmed the section parser fix works (6/6 real components). Two layout failures remained: the testimonial rendered in a narrow column because the skill made an unconstrained creative choice, and the hero image column collapsed to zero because the image container had no `aspect-ratio` fallback. Both failures share the same root cause: the `brief.constraints` field exists in the schema but is never populated by the compiler and never included in adapter prompts. This brief fixes that end-to-end.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15/$75                | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3/$15                 | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80/$4               | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git branch --show-current   # must be feature/design-brief-pipeline
pnpm type-check              # must be clean before starting
```

STOP if either fails.

---

## Phase 1: Add defensive constraint fields to DesignBrief schema

**Goal:** Make `imagePlaceholderStrategy`, `minTextContainerWidth`, `flexChildMinWidth`, and `testimonialMinWidth` first-class typed fields in `ConstraintsSchema` with `.default()` values so existing briefs parse without breaking.
**Model:** sonnet

Read both files in parallel (G1), then edit sequentially.

Read `tools/lib/design-brief-types.ts` — find the `ConstraintsSchema` definition. Add the four new fields with Zod defaults:

```typescript
imagePlaceholderStrategy: z.enum([
  "aspect-ratio-with-muted-bg",
  "fixed-height",
  "none"
]).default("aspect-ratio-with-muted-bg"),
minTextContainerWidth: z.string().default("max-w-sm"),
flexChildMinWidth: z.boolean().default(true),
testimonialMinWidth: z.string().default("60%"),
```

Also read `tools/__fixtures__/briefs/sample-brief.json` to understand current `constraints` shape.

After editing `design-brief-types.ts`, update `tools/__fixtures__/briefs/sample-brief.json` to add the new fields explicitly (so the fixture stays a full valid example, not relying on defaults):

```json
"imagePlaceholderStrategy": "aspect-ratio-with-muted-bg",
"minTextContainerWidth": "max-w-sm",
"flexChildMinWidth": true,
"testimonialMinWidth": "60%"
```

```bash
# Verification gate — STOP if this fails
npx tsx -e "
async function main() {
  const { DesignBriefSchema } = await import('./tools/lib/design-brief-types.js');
  const fs = await import('fs');
  const brief = JSON.parse(fs.readFileSync('tools/__fixtures__/briefs/sample-brief.json', 'utf-8'));
  const clone = JSON.parse(JSON.stringify(brief));
  delete clone.constraints.imagePlaceholderStrategy;
  delete clone.constraints.minTextContainerWidth;
  const parsed = DesignBriefSchema.parse(clone);
  console.log('imagePlaceholderStrategy:', parsed.constraints.imagePlaceholderStrategy);
  console.log('minTextContainerWidth:', parsed.constraints.minTextContainerWidth);
  console.log(parsed.constraints.imagePlaceholderStrategy === 'aspect-ratio-with-muted-bg' ? 'PASS: defaults work' : 'FAIL: defaults broken');
}
main().catch(console.error);
" 2>&1
```

```bash
git add tools/lib/design-brief-types.ts tools/__fixtures__/briefs/sample-brief.json
git commit -m "feat(schema): add defensive layout constraint fields to DesignBrief constraints

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2: Populate constraints in the compiler

**Goal:** `compileDesignBrief()` currently leaves the `constraints` block with only token/RSC flags. Populate the four new fields with their default values (compiler always outputs the safe defaults — users can override in a `--brief` JSON).
**Model:** sonnet

Read `tools/lib/design-brief-compiler.ts`. Find where the `constraints` field is assembled in the return value. Add the four new fields:

```typescript
constraints: {
  tokenOnlyStyling: true,
  rscByDefault: true,
  noThemeFunctionInCss: true,
  imagePlaceholderStrategy: "aspect-ratio-with-muted-bg" as const,
  minTextContainerWidth: "max-w-sm",
  flexChildMinWidth: true,
  testimonialMinWidth: "60%",
  // ... any existing fields
}
```

```bash
# Verification gate — STOP if this fails
npx tsx -e "
async function main() {
  const { compileDesignBrief } = await import('./tools/lib/design-brief-compiler.js');
  const { DesignBriefSchema } = await import('./tools/lib/design-brief-types.js');
  const fs = await import('fs');
  const siteAnalysis = JSON.parse(fs.readFileSync('tools/__fixtures__/analyses/bexhill-removals-site-analysis.json', 'utf-8'));
  const mappedTokens = { tokens: {}, confidence: 'low' as const, warnings: [] };
  const screenshotPaths = {};
  const { brief } = compileDesignBrief({ siteAnalysis, mappedTokens, screenshotPaths });
  console.log('imagePlaceholderStrategy:', brief.constraints.imagePlaceholderStrategy);
  console.log('testimonialMinWidth:', brief.constraints.testimonialMinWidth);
  console.log(brief.constraints.imagePlaceholderStrategy === 'aspect-ratio-with-muted-bg' ? 'PASS: compiler populates constraints' : 'FAIL');
}
main().catch(console.error);
" 2>&1
```

If `mappedTokens` shape is wrong, read the compiler to find the correct input type and adjust the test accordingly.

```bash
git add tools/lib/design-brief-compiler.ts
git commit -m "feat(pipeline): populate defensive layout constraints in compiled DesignBrief

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3: Add `buildLayoutConstraintsBlock()` to shared-constraints.ts

**Goal:** Create a reusable function that converts `brief.constraints` into a prompt section that every adapter can include.
**Model:** sonnet

Read `tools/lib/design-skills/shared-constraints.ts` first.

Add this export:

```typescript
import type { DesignBrief } from "../design-brief-types";

export function buildLayoutConstraintsBlock(constraints: DesignBrief["constraints"]): string {
  const lines = [
    "## Layout Constraints (REQUIRED — apply to every component)",
    "",
    "- **Image containers:** always include an `aspect-ratio` Tailwind class + `bg-surface-muted` as a fallback background.",
    "  Never let an image container collapse to zero height when `src` is empty or fails to load.",
    '  Example: `<div className="aspect-[4/3] bg-surface-muted overflow-hidden"><img ... className="w-full h-full object-cover" /></div>`',
    "",
    `- **Text containers:** no standalone text block narrower than \`${constraints.minTextContainerWidth}\`.`,
    `  Testimonial and quote blocks must span at least ${constraints.testimonialMinWidth} of their container`,
    "  (use `min-w-[60%]` or `max-w-2xl mx-auto` — never `max-w-xs` on a quote standing alone).",
    "",
  ];

  if (constraints.flexChildMinWidth) {
    lines.push(
      "- **Flex/grid children:** always include `min-w-0` on direct flex children to prevent text overflow breaking the layout."
    );
    lines.push("");
  }

  lines.push(
    "- **Split layouts:** both columns must have explicit `min-h` or `aspect-ratio` so neither side collapses when content or images are missing."
  );

  return lines.join("\n");
}
```

```bash
# Verification gate — STOP if this fails
npx tsx -e "
async function main() {
  const { buildLayoutConstraintsBlock } = await import('./tools/lib/design-skills/shared-constraints.js');
  const block = buildLayoutConstraintsBlock({
    tokenOnlyStyling: true,
    rscByDefault: true,
    noThemeFunctionInCss: true,
    imagePlaceholderStrategy: 'aspect-ratio-with-muted-bg',
    minTextContainerWidth: 'max-w-sm',
    flexChildMinWidth: true,
    testimonialMinWidth: '60%',
  });
  console.log(block.includes('Image containers') ? 'PASS: block generated' : 'FAIL');
  console.log(block.includes('min-w-0') ? 'PASS: flex constraint present' : 'FAIL');
}
main().catch(console.error);
" 2>&1
```

```bash
git add tools/lib/design-skills/shared-constraints.ts
git commit -m "feat(pipeline): add buildLayoutConstraintsBlock() to shared-constraints

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 4: Wire constraints block into adapter prompt builders

**Goal:** Both `generic-adapter.ts` and `impeccable-adapter.ts` must call `buildLayoutConstraintsBlock(brief.constraints)` and include its output in the `userPrompt` — before the Generation Instructions section so the model sees it as a hard rule, not a suggestion.
**Model:** sonnet

Read `tools/lib/design-skills/adapters/generic-adapter.ts` and `tools/lib/design-skills/adapters/impeccable-adapter.ts` in parallel (G2), then edit in parallel (G3).

**In `generic-adapter.ts`:**

- Import `buildLayoutConstraintsBlock` from `../shared-constraints`
- In `buildPagePrompt()`, add `buildLayoutConstraintsBlock(brief.constraints)` to the `userPrompt` array, immediately before `"## Generation Instructions"`

**In `impeccable-adapter.ts`:**

- Import `buildLayoutConstraintsBlock` from `../shared-constraints`
- In `buildPagePrompt()`, add `buildLayoutConstraintsBlock(brief.constraints)` to the `userPrompt` array, immediately before `"## Generation Instructions"`

```bash
# Verification gate — STOP if this fails
npx tsx -e "
async function main() {
  const { getAdapter } = await import('./tools/lib/design-skills/adapter-registry.js');
  const { DesignBriefSchema } = await import('./tools/lib/design-brief-types.js');
  const fs = await import('fs');
  const brief = DesignBriefSchema.parse(JSON.parse(fs.readFileSync('tools/__fixtures__/briefs/sample-brief.json', 'utf-8')));
  const adapter = getAdapter('impeccable');
  const page = brief.pageBlueprints[0];
  const { userPrompt } = adapter.buildPagePrompt(brief, page, { includeHeader: true, includeFooter: true });
  console.log(userPrompt.includes('Image containers') ? 'PASS: constraints in impeccable prompt' : 'FAIL: constraints missing from impeccable');
  const generic = getAdapter('high-end');
  const { userPrompt: gPrompt } = generic.buildPagePrompt(brief, page, { includeHeader: true, includeFooter: true });
  console.log(gPrompt.includes('Image containers') ? 'PASS: constraints in generic prompt' : 'FAIL: constraints missing from generic');
}
main().catch(console.error);
" 2>&1
```

```bash
git add tools/lib/design-skills/adapters/generic-adapter.ts tools/lib/design-skills/adapters/impeccable-adapter.ts
git commit -m "feat(pipeline): wire brief.constraints into adapter prompt builders

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 5: Final type-check

**Goal:** Confirm no TypeScript errors across the monorepo after all changes.
**Model:** haiku

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

If there are errors, read the failing files and fix them. Common issues:

- `constraints` type mismatch if compiler returns a narrower type than the schema expects — use `as const` on enum values
- Import path issues if `buildLayoutConstraintsBlock` import added incorrectly

```bash
git add -A
git commit -m "chore: type-check fixes after constraint field additions

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>" --allow-empty
```

(Use `--allow-empty` only if type-check passed with no additional fixes needed.)

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message.

### Intra-phase groups

| Group | Phase   | Items                                                   | File overlap      | Model  | Rationale                                     |
| ----- | ------- | ------------------------------------------------------- | ----------------- | ------ | --------------------------------------------- |
| G1    | Phase 1 | Read `design-brief-types.ts`, Read `sample-brief.json`  | none (reads only) | n/a    | Independent reads — batch in one message      |
| G2    | Phase 4 | Read `generic-adapter.ts`, Read `impeccable-adapter.ts` | none (reads only) | n/a    | Independent reads — batch in one message      |
| G3    | Phase 4 | Edit `generic-adapter.ts`, Edit `impeccable-adapter.ts` | none              | sonnet | Both add same import+call — independent files |
| G4    | Phase 5 | Run `pnpm lint`, Run `pnpm type-check`                  | none (read-only)  | n/a    | Independent verification commands             |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                              | Reason                                                           |
| --------------------------------- | ---------------------------------------------------------------- |
| Phase 1 before Phase 2            | Compiler uses schema types — schema must be updated first        |
| Phase 3 before Phase 4            | Adapters import `buildLayoutConstraintsBlock` — must exist first |
| Verification gates between phases | Each phase's output gates the next                               |
| Git commits                       | One commit per phase, in order                                   |

---

## Cost Estimate

| Phase                                | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------------ | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Schema fields + fixture     | sonnet | ~6k               | ~0.8k              | ~$0.03     |
| Phase 2: Compiler constraints        | sonnet | ~8k               | ~0.8k              | ~$0.03     |
| Phase 3: buildLayoutConstraintsBlock | sonnet | ~6k               | ~1k                | ~$0.03     |
| Phase 4: Wire into adapters          | sonnet | ~10k              | ~1.5k              | ~$0.05     |
| Phase 5: Type-check                  | haiku  | ~3k               | ~0.2k              | ~$0.01     |
| **Total**                            |        | **~33k**          | **~4.3k**          | **~$0.15** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation: ~5 tokens per line of code.

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

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-17_design-brief-pipeline/yolo-brief-constraints.md`:

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
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially.**
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used

## Completed

**Date:** 2026-04-17
**Status:** All phases executed successfully

The `brief.constraints` field was created end-to-end: a new `ConstraintsSchema` with 7 fields (3 token/RSC flags + 4 defensive layout fields) was added to `design-brief-types.ts`, with Zod `.default()` values so existing briefs parse without breaking. The compiler now populates all 7 fields with their safe defaults. A new `buildLayoutConstraintsBlock()` function in `shared-constraints.ts` converts the constraints into a prompt section covering image aspect-ratio fallbacks, minimum text/testimonial widths, flex child `min-w-0`, and split-layout collapse prevention. Both `generic-adapter.ts` and `impeccable-adapter.ts` now call this function and embed the resulting block in `userPrompt` immediately before `## Generation Instructions`. One minor surprise: the schema had no pre-existing `constraints` field at all, so `ConstraintsSchema` was created from scratch rather than extended. The `MappedTokens` type in the Phase 2 verification also required `{ config, provenance, unmappedColours }` rather than the `{ tokens, confidence, warnings }` shape in the brief — adjusted accordingly without changing any production code.

### Commits

- `b178b08` feat(schema): add defensive layout constraint fields to DesignBrief constraints
- `87dec43` feat(pipeline): populate defensive layout constraints in compiled DesignBrief
- `1006e21` feat(pipeline): add buildLayoutConstraintsBlock() to shared-constraints
- `8dc44d2` feat(pipeline): wire brief.constraints into adapter prompt builders
- `5aad15e` chore: type-check fixes after constraint field additions (empty — no fixes needed)
