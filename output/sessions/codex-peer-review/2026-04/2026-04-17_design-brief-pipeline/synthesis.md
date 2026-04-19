# Implementation Plan: Design Brief Pipeline — Prompt Constraints & Defensive Layout

**Date:** 2026-04-17
**Status:** Ready for implementation — derived from first real pipeline run against navagarden.hu
**Source:** Direct analysis of navagarden generation output (no dual-model review — findings are concrete and unambiguous)

## What We Learned from the navagarden Run

The pipeline worked end-to-end. The parser fix (multi-format section markers) resolved the empty-stub problem — 6/6 sections had real JSX. Two visual failures remained:

1. **Testimonial rendered in an extremely narrow column** — the skill chose a constrained layout without knowing the content would break at that width
2. **Hero image column collapsed to zero** — `<img>` with no `aspect-ratio` or `min-h` on the container collapses when the image fails to load

Both failures are the **same class of problem**: the prompt describes _what_ to build but not _defensive layout constraints_. The skill makes creative choices that look good in a design tool but break under real conditions (no images, variable content length).

The `constraints` field exists in `DesignBrief` schema but the adapters don't use it. The fix is:

1. Populate `brief.constraints` in the compiler with defensive layout rules
2. Expose `brief.constraints` in every adapter's prompt
3. Add image container and text container defensive rules as first-class brief fields

---

## Implementation Plan

### Phase 1: Add `constraints` section to compiler output

**Goal:** The `compileDesignBrief()` function currently leaves `constraints` empty. Populate it with defensive layout rules derived from the analysis inputs.

**Files:**

- `tools/lib/design-brief-types.ts` — verify `constraints` field shape; add `imagePlaceholderStrategy` and `minTextContainerWidth` if not present
- `tools/lib/design-brief-compiler.ts` — populate `constraints` block in the compiled output
- `tools/lib/design-brief-mappers/` — no mapper needed; constraints are universal defaults, not site-specific

**Constraints to always include in compiled output:**

```typescript
constraints: {
  tokenOnlyStyling: true,          // already enforced
  rscByDefault: true,              // already enforced
  noThemeFunctionInCss: true,      // already enforced
  imagePlaceholderStrategy: "aspect-ratio-with-muted-bg",
  // ↑ NEW: image containers must always have aspect-ratio + bg-surface-muted fallback
  minTextContainerWidth: "max-w-sm",
  // ↑ NEW: no text block narrower than max-w-sm in isolation
  flexChildMinWidth: true,
  // ↑ NEW: flex/grid children must have min-w-0 to prevent overflow
  testimonialMinWidth: "60%",
  // ↑ NEW: testimonial/quote blocks must span at least 60% of their container
}
```

**Verification gate:**

```bash
# Compile a brief and check constraints block is populated
npx tsx tools/generate-from-brief.ts \
  --url https://navagarden.hu/ \
  --name navagarden-test \
  --brief-only \
  --emit-brief /tmp/constraint-test/
cat /tmp/constraint-test/design-brief.json | python3 -m json.tool | grep -A 20 '"constraints"'
# Must show imagePlaceholderStrategy and minTextContainerWidth
```

**Commit:** `feat(pipeline): populate defensive layout constraints in compiled DesignBrief`

---

### Phase 2: Expose `brief.constraints` in adapter prompt builders

**Goal:** Every adapter's `buildPagePrompt()` must include the constraints block in the prompt so the skill knows the defensive rules before writing any JSX.

**Files:**

- `tools/lib/design-skills/shared-constraints.ts` — add `buildLayoutConstraintsBlock(constraints: DesignBrief['constraints']): string`
- `tools/lib/design-skills/adapters/generic-adapter.ts` — call `buildLayoutConstraintsBlock()` in `buildPagePrompt()` userPrompt
- `tools/lib/design-skills/adapters/impeccable-adapter.ts` — call `buildLayoutConstraintsBlock()` in `buildPagePrompt()` userPrompt (Impeccable has its own override)

**`buildLayoutConstraintsBlock()` output format:**

```
## Layout Constraints (REQUIRED — apply to every component)

- Image containers: always include `aspect-ratio` class + `bg-surface-muted` fallback. Never let an image container collapse to zero height when src is empty or fails.
  Example: `<div className="aspect-[4/3] bg-surface-muted overflow-hidden"><img ... className="w-full h-full object-cover" /></div>`

- Text containers: no text block narrower than `max-w-sm` when standing alone. Testimonial/quote blocks must span at least 60% of their container width (`min-w-[60%]` or `max-w-2xl mx-auto`).

- Flex/grid children: always include `min-w-0` on flex children to prevent text overflow breaking layouts.

- Split layouts: both columns must have explicit `min-h` or `aspect-ratio` so neither collapses when content is missing.
```

**Verification gate:**

```bash
# Build the prompt and check constraints appear
npx tsx -e "
const { getAdapter } = await import('./tools/lib/design-skills/adapter-registry.js');
const { DesignBriefSchema } = await import('./tools/lib/design-brief-types.js');
const fs = await import('fs');
const brief = DesignBriefSchema.parse(JSON.parse(fs.readFileSync('output/briefs/navagarden/design-brief.json', 'utf-8')));
const adapter = getAdapter('impeccable');
const page = brief.pageBlueprints[0];
const { userPrompt } = adapter.buildPagePrompt(brief, page, { includeHeader: true, includeFooter: true });
console.log(userPrompt.includes('Image containers') ? 'PASS: constraints in prompt' : 'FAIL: constraints missing');
" 2>&1
```

Note: wrap in `async function main() {}` to avoid top-level await issues.

**Commit:** `feat(pipeline): expose brief.constraints as Layout Constraints block in adapter prompts`

---

### Phase 3: Add `imagePlaceholderStrategy` to DesignBrief schema

**Goal:** Make `imagePlaceholderStrategy` and `minTextContainerWidth` first-class typed fields in the schema so the TypeScript compiler enforces their presence.

**Files:**

- `tools/lib/design-brief-types.ts` — add to `ConstraintsSchema`:
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

**Verification gate:**

```bash
# Schema test — valid brief with new fields passes, missing field gets default
npx tsx -e "
async function main() {
  const { DesignBriefSchema } = await import('./tools/lib/design-brief-types.js');
  const fs = await import('fs');
  const brief = JSON.parse(fs.readFileSync('tools/__fixtures__/briefs/sample-brief.json', 'utf-8'));
  // Remove new fields to test defaults
  delete brief.constraints?.imagePlaceholderStrategy;
  delete brief.constraints?.minTextContainerWidth;
  const parsed = DesignBriefSchema.parse(brief);
  console.log('imagePlaceholderStrategy:', parsed.constraints.imagePlaceholderStrategy);
  console.log('minTextContainerWidth:', parsed.constraints.minTextContainerWidth);
  console.log(parsed.constraints.imagePlaceholderStrategy === 'aspect-ratio-with-muted-bg' ? 'PASS' : 'FAIL');
}
main().catch(console.error);
" 2>&1
```

**Commit:** `feat(schema): add defensive layout constraint fields to DesignBrief constraints`

---

### Phase 4: Update `sample-brief.json` fixture + type-check

**Goal:** Add the new constraint fields to the test fixture so it stays valid. Run full type-check.

**Files:**

- `tools/__fixtures__/briefs/sample-brief.json` — add `imagePlaceholderStrategy`, `minTextContainerWidth`, `flexChildMinWidth`, `testimonialMinWidth` to `constraints`

**Verification gate:**

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:** `chore(fixtures): update sample-brief.json with defensive layout constraint fields`

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message.

### Intra-phase groups

| Group | Phase   | Items                                                                                 | File overlap      | Model  | Rationale                                           |
| ----- | ------- | ------------------------------------------------------------------------------------- | ----------------- | ------ | --------------------------------------------------- |
| G1    | Phase 1 | Read `design-brief-types.ts`, Read `design-brief-compiler.ts`                         | none (reads only) | n/a    | Independent reads — batch in one message            |
| G2    | Phase 2 | Read `shared-constraints.ts`, Read `generic-adapter.ts`, Read `impeccable-adapter.ts` | none (reads only) | n/a    | Independent reads — batch in one message            |
| G3    | Phase 2 | Edit `generic-adapter.ts`, Edit `impeccable-adapter.ts`                               | none              | sonnet | Both call buildLayoutConstraintsBlock — independent |
| G4    | Phase 4 | Run `pnpm lint`, Run `pnpm type-check`                                                | none (read-only)  | n/a    | Independent verification commands                   |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                              | Reason                                                         |
| --------------------------------- | -------------------------------------------------------------- |
| Phase 3 before Phase 4            | Schema changes must be in place before fixture update          |
| Phase 1 before Phase 2            | Compiler must populate constraints before adapter can use them |
| Verification gates between phases | Each phase's output gates the next                             |
| Git commits                       | One commit per phase, in order                                 |

---

## Cost Estimate

| Phase                            | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| -------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Compiler constraints    | sonnet | ~8k               | ~1k                | ~$0.04     |
| Phase 2: Adapter prompt builders | sonnet | ~10k              | ~2k                | ~$0.06     |
| Phase 3: Schema fields           | sonnet | ~6k               | ~0.5k              | ~$0.02     |
| Phase 4: Fixture + type-check    | haiku  | ~4k               | ~0.3k              | ~$0.01     |
| **Total**                        |        | **~28k**          | **~3.8k**          | **~$0.13** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
