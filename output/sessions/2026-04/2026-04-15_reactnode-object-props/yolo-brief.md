# YOLO Implementation Brief: ReactNode Assignability Fix — Scalar Object Props

**Branch:** feature/reactnode-object-props (created from develop)
**Session spec:** output/sessions/2026-04-15_reactnode-object-props/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The `--pass translate` pipeline achieves 5/11 AI-generated components after recent gauntlet improvements. The remaining 5/6 placeholders all share the same failure mode: the AI generates `{ label, href }` button/link objects and tries to render them as JSX children directly (`<a>{props.button}</a>`) rather than accessing their properties (`<a href={props.button?.href}>{props.button?.label}</a>`). This fails semantic type-checking with "Type '{ label: string; href: string }' is not assignable to type 'ReactNode'". Two targeted changes fix this: (1) add explicit object prop rendering guidance to both generation prompts, and (2) add a dedicated semantic retry function with fix pattern examples.

The plan was developed from corvus re-run results (2026-04-15) confirming the pattern across CtaBlueBand, AboutSplitDark, NewsletterDarkBand, FooterMultiColumn, and EventDetailsImageOverlay. Expected yield after fix: 9/11 (82%).

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**.

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/reactnode-object-props
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Add object prop rendering rules to both prompts

**Goal:** Add a new explicit rule to both `buildCloneTranslationPrompt` and `buildComponentGenerationPrompt` in `tools/lib/theme-component-templates.ts` that tells the AI how to render scalar object props (button/cta/link/image types) rather than treating them as JSX children.
**Model:** sonnet — reading and editing a prompt template file

Read `tools/lib/theme-component-templates.ts` in full before editing.

### Edit 1a: `buildCloneTranslationPrompt` TRANSLATION RULES

Find the existing Rule 7 (array content rule) in `buildCloneTranslationPrompt`. It currently reads approximately:

```
7. **Array content**: When the HTML has repeating items...
```

After Rule 7, insert the following as the new Rule 8, then renumber the old Rules 8, 9, 10 to 9, 10, 11:

```
8. **Object props (button/link/cta/image)**: Props typed as objects (e.g. `button?: { label?: string; href?: string }`, `cta?: { label?: string; href?: string }`, `image?: { src?: string; alt?: string }`) are NOT renderable as JSX children. NEVER write `{props.button}`, `{props.cta}`, or `{props.image}` as a child — these are objects, not strings, and will cause a TypeScript type error. Always render their properties explicitly:
   - Button/link/cta: `<a href={props.button?.href}>{props.button?.label}</a>`
   - Image: `<img src={props.image?.src} alt={props.image?.alt ?? ""} />`
   Use optional chaining (`?.`) on all property accesses since these props are optional.
```

### Edit 1b: `buildComponentGenerationPrompt` RULES

Find the existing Rule 7 (array props rule) in `buildComponentGenerationPrompt`. It currently reads approximately:

```
7. **Array props**: When multiple content slots share a common prefix...
```

After Rule 7, insert the following as the new Rule 8, then renumber the old Rules 8 and 9 to 9 and 10:

```
8. **Object props**: Props typed as `{ label?: string; href?: string }` (button/cta/link) or `{ src?: string; alt?: string }` (image) are OBJECTS — never render them directly as `{props.button}` or `{props.cta}`. These are not strings and will cause "not assignable to ReactNode" type errors. Always render their properties:
   - `<a href={props.cta?.href}>{props.cta?.label}</a>`
   - `<img src={props.image?.src} alt={props.image?.alt ?? ""} />`
   Use optional chaining on all accesses.
```

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
```

**Commit:**

```bash
git add tools/lib/theme-component-templates.ts
git commit -m "feat(gauntlet): add object prop rendering guidance to translation prompts

Adds explicit Rule 8 to both buildCloneTranslationPrompt and
buildComponentGenerationPrompt instructing the AI to render
{ label, href } and { src, alt } props via property access, not
as direct JSX children.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2: Add `retryWithSemanticErrors()` function and wire it into the semantic gate

**Goal:** Add a dedicated semantic retry function to `tools/lib/theme-component-generator.ts` that sends a more informed fix prompt when semantic type errors are detected — specifically including the ReactNode fix pattern and the string-not-object fix pattern. Then replace the existing call to `retryWithSyntaxErrors()` in the semantic gate with the new function.
**Model:** sonnet — reading and editing the generator file

Read `tools/lib/theme-component-generator.ts` in full before editing.

### Edit 2a: Add `retryWithSemanticErrors()` function

Locate the existing `retryWithSyntaxErrors()` function. Immediately after it (before `generateSingleComponent`), add the following new function:

````typescript
async function retryWithSemanticErrors(
  client: Anthropic,
  blueprint: SectionBlueprint,
  brokenContent: string,
  semanticErrors: string[]
): Promise<string | null> {
  // Guard: if content is very large, skip targeted retry (token cost)
  if (brokenContent.length > 10000) {
    return null;
  }

  const errorList = semanticErrors.slice(0, 5).join("\n- ");

  const fixPrompt = `The following TSX component has TypeScript semantic type errors. Fix the errors listed below — do not change the layout, prop names, or overall structure.

ERRORS:
- ${errorList}

COMMON FIX PATTERNS:
- If error says "not assignable to type 'ReactNode'" or "not assignable to type 'ReactNode | undefined'":
  The prop is an object (e.g. { label, href } or { src, alt }), not a string. You cannot render an object directly as a JSX child.
  Fix: access its properties instead.
  WRONG: <a>{props.button}</a>
  CORRECT: <a href={props.button?.href}>{props.button?.label}</a>
  WRONG: <div>{props.image}</div>
  CORRECT: <img src={props.image?.src} alt={props.image?.alt ?? ""} />

- If error says "Property 'X' does not exist on type 'string'":
  The prop is typed as a plain string but you accessed .X on it. Use the prop directly.
  WRONG: props.heading.text
  CORRECT: props.heading

- If error says "Property 'X' does not exist on type '{ label?: string; href?: string }'":
  The object prop does not have property X. Use only .label and .href.
  WRONG: props.button.target
  CORRECT: props.button?.href (use as href attribute) and props.button?.label (use as text content)

BROKEN COMPONENT:
\`\`\`tsx
${brokenContent}
\`\`\`

Return ONLY the corrected TSX component, starting with the first line of the file. No markdown fences, no explanation.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: fixPrompt }],
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text.trim() : null;
    if (!responseText) return null;

    // Strip any accidental markdown fences
    const cleaned = responseText
      .replace(/^```(?:tsx?|jsx?)?\n?/, "")
      .replace(/\n?```$/, "")
      .trim();

    return cleaned || null;
  } catch {
    return null;
  }
}
````

### Edit 2b: Wire `retryWithSemanticErrors()` into the semantic gate

Locate the semantic gate block inside `generateSingleComponent()`. It currently calls `retryWithSyntaxErrors(client, blueprint, content, semanticErrors)` when semantic errors are detected.

Find this call (it will look like):

```typescript
const semanticFixed = await retryWithSyntaxErrors(client, blueprint, content, semanticErrors);
```

Replace it with:

```typescript
const semanticFixed = await retryWithSemanticErrors(client, blueprint, content, semanticErrors);
```

Do not change any other part of the semantic gate block — only the function name being called changes.

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
```

**Commit:**

```bash
git add tools/lib/theme-component-generator.ts
git commit -m "feat(gauntlet): add retryWithSemanticErrors with ReactNode fix patterns

Replaces the generic retryWithSyntaxErrors call in the semantic gate
with a dedicated retryWithSemanticErrors function that includes explicit
fix patterns for the most common semantic errors:
- object prop rendered as ReactNode child → access .label/.href/.src/.alt
- .X access on string prop → use prop directly
- .target on { label, href } → use only .href and .label

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3: Add tests for the new semantic retry function

**Goal:** Add tests to `tools/__tests__/theme-component-generator.test.ts` that verify the new `retryWithSemanticErrors()` function is exported and callable, and that the common error patterns are correctly described.
**Model:** haiku — mechanical test addition

Read `tools/__tests__/theme-component-generator.test.ts` before editing.

Check if `retryWithSemanticErrors` needs to be exported from `tools/lib/theme-component-generator.ts` for testing. If the test file imports other internal functions, follow the same pattern. If it only tests exported functions, add `export` to `retryWithSemanticErrors`.

Add the following tests to the test file, in the appropriate describe block or at the bottom:

```typescript
describe("retryWithSemanticErrors", () => {
  it("returns null for content over 10000 characters", async () => {
    // The guard should return null without calling the API
    const largeContent = "x".repeat(10001);
    const result = await retryWithSemanticErrors(
      {} as Anthropic, // won't be called
      { name: "Test", type: "Section" } as SectionBlueprint,
      largeContent,
      ["[TS2322]:5 Type '{ label: string }' is not assignable to type 'ReactNode'"]
    );
    expect(result).toBeNull();
  });
});
```

Note: If the test infrastructure uses mocking or the function is not easily unit-testable due to the Anthropic API call, simply add the guard test above and skip the full integration test (which would require a live API). The guard is the critical behavior to verify.

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
```

**Commit:**

```bash
git add tools/__tests__/theme-component-generator.test.ts tools/lib/theme-component-generator.ts
git commit -m "test(gauntlet): add guard test for retryWithSemanticErrors

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 4: Verify and report

**Goal:** Confirm type-check passes cleanly across all workspaces. Then re-run the corvus theme translation to measure the yield improvement.
**Model:** sonnet — interprets results

```bash
# Verify the monorepo is clean
pnpm type-check
```

Then wipe and re-run corvus to measure the actual yield improvement:

```bash
rm -rf packages/themes/corvus/components/ packages/themes/corvus/pages/
npx tsx tools/extract-theme.ts --clone corvus --pass translate
```

Count (AI) vs (placeholder) lines in the output. Record which components are still placeholders and what errors caused them.

```bash
# Final type-check after generation
pnpm type-check
```

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
```

**Final report:**

```
## ReactNode Fix Results

### Yield
- Before: 5/11 AI-generated (45%)
- After:  X/11 AI-generated (Y%)

### AI-Generated Components
[list each (AI) component]

### Remaining Placeholders
[list each (placeholder) component and the specific error that caused it]

### Build
- pnpm type-check: ✅/❌
```

**Commit:**

```bash
git add -A
git commit -m "chore(corvus): re-run translate after ReactNode fix for yield verification

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                           | File overlap | Model | Rationale                             |
| ----- | ------- | ----------------------------------------------- | ------------ | ----- | ------------------------------------- |
| G1    | Phase 1 | — no parallel work — read then edit single file | —            | —     | Sequential: read then edit            |
| G2    | Phase 2 | — no parallel work — read then edit single file | —            | —     | Sequential: read then edit            |
| G3    | Phase 3 | — no parallel work —                            | —            | —     | Single test file edit                 |
| G4    | Phase 4 | Run `pnpm type-check`, Run translate pipeline   | none         | n/a   | type-check first, then generation run |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                    | Reason                                                    |
| ----------------------- | --------------------------------------------------------- |
| Phase 1 → Phase 2       | Phase 2 uses the generator file; prompts must exist first |
| Phase 2 → Phase 3       | Tests depend on the exported function from Phase 2        |
| Phase 3 → Phase 4       | Verification run uses the final code from Phases 1+2      |
| Git commits             | One per phase, in order                                   |
| `pnpm type-check` gates | Each gate must pass before proceeding                     |

---

## Cost Estimate

| Phase                            | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| -------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Prompt rules            | sonnet | ~15k              | ~1k                | ~$0.06     |
| Phase 2: Semantic retry function | sonnet | ~20k              | ~2k                | ~$0.09     |
| Phase 3: Tests                   | haiku  | ~8k               | ~0.5k              | ~$0.003    |
| Phase 4: Verify + re-run         | sonnet | ~5k + pipeline    | ~1k                | ~$0.03     |
| **Total (excl. pipeline)**       |        | **~48k**          | **~4.5k**          | **~$0.18** |

Note: Phase 4 re-run calls the Claude API ~11 times for component generation (~$0.50 additional). Total with re-run: ~$0.70.

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Yield: X/11 AI-generated before → Y/11 after
3. Remaining placeholder components (if any) with the specific gauntlet warning
4. Build status — `pnpm type-check` result
5. Any deviations from the plan
6. Token usage estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    |                   |                    | $X.XX     |
   | haiku     |                   |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-15_reactnode-object-props/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: yield achieved, which components now pass, any remaining failures and why]

### Commits

[list each commit SHA and message]
```

---

## Completed

**Date:** 2026-04-15
**Status:** All phases executed successfully

Yield improved from 5/11 (45%) to 9/11 (82%) — exactly as predicted. The new `retryWithSemanticErrors` function with ReactNode fix patterns successfully rescued CtaBlueBand, AboutSplitDark, NewsletterDarkBand (partial), FooterMultiColumn, and HeroHeadlineColoured/HeroEventBanner from the placeholder pile. Two components remain as placeholders: NavDarkBand (semantic retry succeeded but hex literals in SVG fills could not be auto-repaired — a pre-existing limitation noted in memory) and NewsletterDarkBand (semantic retry failed because the AI hallucinated an `items` prop not in the interface, and the retry could not resolve the implicit `any` types either).

### Commits

- `8d02b21` feat(gauntlet): add object prop rendering guidance to translation prompts
- `6bab6e6` feat(gauntlet): add retryWithSemanticErrors with ReactNode fix patterns
- `8c85371` test(gauntlet): add guard test for retryWithSemanticErrors
- `dfb6963` chore(corvus): re-run translate after ReactNode fix for yield verification

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
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits
- The Co-Authored-By line in commits must reflect the orchestrator model used (`Claude Sonnet 4.6`)
- For Phase 2: add `export` keyword to `retryWithSemanticErrors` only if the test file imports and tests internal functions — check the existing test file pattern first
- **Phase 4 re-run is optional if time/cost is a concern** — the type-check gate is the mandatory verification; the corvus re-run is to measure yield improvement
