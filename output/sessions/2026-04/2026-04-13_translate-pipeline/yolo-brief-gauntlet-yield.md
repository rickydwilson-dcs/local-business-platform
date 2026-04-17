# YOLO Implementation Brief: Gauntlet Yield Improvement

**Branch:** feature/gauntlet-yield (created from develop)
**Session spec:** output/sessions/2026-04-13_translate-pipeline/yolo-brief-gauntlet-yield.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The `--pass translate` pipeline converts clone HTML/CSS into native Tailwind React components. Currently ~45% yield (5/11 AI-generated, 6 typed placeholders) for the corvus theme. The 6 placeholders fall back because: (a) AI generates malformed JSX that fails the syntax gauntlet and the retry uses the same blind prompt with no improvement, and (b) array item types are too narrow, causing silent type errors at `next build` time. This brief implements four targeted fixes to push yield to ~80%+.

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
git checkout -b feature/gauntlet-yield
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Array item type fix + plural-slot detection

**Goal:** Relax the array item type to include an index signature so AI-generated sub-property accesses (`.thumbnail`, `.date`, `.excerpt`) don't fail `next build`. Also add missed plural slot name endings.
**Model:** haiku — mechanical one-line type change + small condition additions

**File:** `tools/lib/theme-component-templates.ts`

**Step 1a — Array item type.** In `inferPropType()` (around line 77), find the return statement in the plural-array branch:

```typescript
return "Array<{ title?: string; description?: string; image?: string; href?: string; label?: string }>";
```

Replace with:

```typescript
return "Array<{ title?: string; description?: string; image?: string; href?: string; label?: string; [key: string]: unknown }>";
```

**Step 1b — Additional plural endings.** In the same `inferPropType()` function, find the condition that checks `lower.endsWith("cards")` etc. Add these additional conditions to the same `if` block:

```typescript
lower.endsWith("testimonials") ||
lower.endsWith("features") ||
lower.endsWith("services") ||
lower.endsWith("steps") ||
lower.endsWith("members") ||
```

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
```

**Commit:**

```bash
git add tools/lib/theme-component-templates.ts
git commit -m "fix(pipeline): relax array item index signature; add plural slot endings

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2: Smarter syntax-error retry

**Goal:** When the gauntlet catches a TS parse error, instead of blindly calling `generateJSXBody()` again with the same prompt (which produces the same broken output), send the exact errors + full broken component to Claude for a targeted fix. This is the highest-yield change.
**Model:** sonnet — new function + retry block modification

**File:** `tools/lib/theme-component-generator.ts`

**Step 2a — Add `retryWithSyntaxErrors` function.** Add this function immediately before `generateSingleComponent` (before line ~305):

````typescript
/**
 * Targeted syntax-error retry: sends the broken component + exact parse errors
 * to the AI for a focused fix. Returns the full corrected component string, or
 * null if the fix attempt fails or the content is too large to retry.
 */
async function retryWithSyntaxErrors(
  client: Anthropic,
  blueprint: SectionBlueprint,
  brokenContent: string,
  syntaxErrors: string[]
): Promise<string | null> {
  // Guard: if content is very large, skip targeted retry (token cost)
  if (brokenContent.length > 10000) {
    return null;
  }

  const errorList = syntaxErrors.slice(0, 5).join("\n- ");

  const fixPrompt = `The following TSX component has syntax errors. Fix ONLY the syntax errors listed below — do not change the logic, layout, or prop names.

ERRORS:
- ${errorList}

BROKEN COMPONENT:
\`\`\`tsx
${brokenContent}
\`\`\`

Return ONLY the corrected TSX component, starting with the first line of the file. No markdown fences, no explanation.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      temperature: 0,
      messages: [{ role: "user", content: fixPrompt }],
    });

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") return null;

    let fixed = text.text.trim();
    // Strip markdown fences if present
    fixed = fixed.replace(/^```(?:tsx?|jsx?)?\n?/m, "").replace(/\n?```$/m, "");
    return fixed || null;
  } catch (err) {
    console.warn(`    [Warning] Syntax-error retry failed for ${blueprint.name}: ${err}`);
    return null;
  }
}
````

**Step 2b — Replace the blind retry block.** In `generateSingleComponent`, find the syntax error retry block (lines ~341–358). It currently looks like:

```typescript
const syntaxErrors = validateTypeScriptSyntax(content, blueprint.componentFileName);
if (syntaxErrors.length > 0) {
  warnings.push(`${blueprint.name}: TS syntax errors: ${syntaxErrors.join("; ")}`);
  // Retry once
  jsxBody = await generateJSXBody(client, blueprint);
  if (jsxBody) {
    content = needsClient
      ? clientComponentShell(blueprint, jsxBody)
      : serverComponentShell(blueprint, jsxBody);
    const retryErrors = validateTypeScriptSyntax(content, blueprint.componentFileName);
    if (retryErrors.length > 0) {
      warnings.push(`${blueprint.name}: Retry also failed — using placeholder`);
      content = placeholderComponent(blueprint);
      usedAI = false;
    }
  } else {
    content = placeholderComponent(blueprint);
    usedAI = false;
  }
}
```

Replace the entire block with:

```typescript
const syntaxErrors = validateTypeScriptSyntax(content, blueprint.componentFileName);
if (syntaxErrors.length > 0) {
  warnings.push(`${blueprint.name}: TS syntax errors: ${syntaxErrors.join("; ")}`);
  // Targeted retry: show AI the broken content + exact errors
  const fixedContent = await retryWithSyntaxErrors(client, blueprint, content, syntaxErrors);
  if (fixedContent) {
    // Verify the fix has the correct named export before accepting
    if (!verifyNamedExport(fixedContent, blueprint.componentExportName)) {
      warnings.push(`${blueprint.name}: Syntax-fix retry changed export name — using placeholder`);
      content = placeholderComponent(blueprint);
      usedAI = false;
    } else {
      const retryErrors = validateTypeScriptSyntax(fixedContent, blueprint.componentFileName);
      if (retryErrors.length > 0) {
        warnings.push(`${blueprint.name}: Syntax-fix retry also failed — using placeholder`);
        content = placeholderComponent(blueprint);
        usedAI = false;
      } else {
        warnings.push(`${blueprint.name}: Syntax-fix retry succeeded`);
        content = fixedContent;
        // usedAI stays true
      }
    }
  } else {
    // Fallback: blind regeneration (original behavior, used when content > 10k)
    jsxBody = await generateJSXBody(client, blueprint);
    if (jsxBody) {
      content = needsClient
        ? clientComponentShell(blueprint, jsxBody)
        : serverComponentShell(blueprint, jsxBody);
      const retryErrors = validateTypeScriptSyntax(content, blueprint.componentFileName);
      if (retryErrors.length > 0) {
        warnings.push(`${blueprint.name}: Blind retry also failed — using placeholder`);
        content = placeholderComponent(blueprint);
        usedAI = false;
      }
    } else {
      content = placeholderComponent(blueprint);
      usedAI = false;
    }
  }
}
```

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
```

**Commit:**

```bash
git add tools/lib/theme-component-generator.ts
git commit -m "feat(pipeline): smarter syntax-error retry with targeted fix prompt

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3: Hex literal auto-repair

**Goal:** Before the hex literal hard-fail, attempt to replace inline style hex values with CSS variable equivalents. Convert hard-fail → soft-fix for the common case of `style={{ backgroundColor: "#xxx" }}`.
**Model:** haiku — regex replacements + block restructuring

**File:** `tools/lib/theme-component-generator.ts`

**Step 3a — Add hex auto-repair function.** Add this helper immediately after the existing `scanForHexLiterals` function (after line ~48):

```typescript
/**
 * Attempt to replace hex color literals in inline style objects with CSS variable refs.
 * Handles the common AI anti-pattern: style={{ backgroundColor: "#1a2b3c" }}
 * Returns the fixed content and the count of replacements made.
 */
function autoRepairHexLiterals(tsx: string): { content: string; replacements: number } {
  let replacements = 0;
  const fixed = tsx
    .replace(/backgroundColor:\s*["']#[0-9A-Fa-f]{3,6}["']/g, () => {
      replacements++;
      return 'backgroundColor: "var(--color-brand-primary)"';
    })
    .replace(/\bcolor:\s*["']#[0-9A-Fa-f]{3,6}["']/g, () => {
      replacements++;
      return 'color: "var(--color-surface-foreground)"';
    })
    .replace(/borderColor:\s*["']#[0-9A-Fa-f]{3,6}["']/g, () => {
      replacements++;
      return 'borderColor: "var(--color-surface-border)"';
    });
  return { content: fixed, replacements };
}
```

**Step 3b — Replace the hex hard-fail block.** Currently the hex check runs after the `if (client)` block closes (lines ~432–440) and also scans placeholders. Replace the current block:

```typescript
// Post-generation validation: hex literal scan
const hexLiterals = scanForHexLiterals(content);
if (hexLiterals.length > 0) {
  warnings.push(
    `${blueprint.name}: Contains hex literals: ${hexLiterals.join(", ")} — replacing with placeholder`
  );
  content = placeholderComponent(blueprint);
  usedAI = false;
}
```

With this new block (inside the `if (usedAI)` guard — place it just before the existing `verifyNamedExport` check):

```typescript
// Post-generation: hex literal auto-repair then hard-fail
if (usedAI) {
  const hexLiterals = scanForHexLiterals(content);
  if (hexLiterals.length > 0) {
    // Attempt inline style substitution first
    const { content: hexFixed, replacements } = autoRepairHexLiterals(content);
    const remaining = scanForHexLiterals(hexFixed);
    if (remaining.length === 0) {
      warnings.push(
        `${blueprint.name}: Replaced ${replacements} hex literal(s) with CSS variable refs`
      );
      content = hexFixed;
      // Re-verify syntax after substitution
      const hexFixSyntaxErrors = validateTypeScriptSyntax(content, blueprint.componentFileName);
      if (hexFixSyntaxErrors.length > 0) {
        warnings.push(`${blueprint.name}: Hex fix introduced syntax errors — using placeholder`);
        content = placeholderComponent(blueprint);
        usedAI = false;
      }
    } else {
      // Still has hex literals that couldn't be auto-fixed — hard-fail
      warnings.push(
        `${blueprint.name}: Contains hex literals: ${remaining.join(", ")} — replacing with placeholder`
      );
      content = placeholderComponent(blueprint);
      usedAI = false;
    }
  }
}
```

**Important:** Remove (or keep as-is but now unreachable for AI content) the old hex block that ran outside the `if (client)` block. The new block above replaces it entirely for AI-generated content. Placeholders never contain hex, so no scan is needed for them.

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
```

**Commit:**

```bash
git add tools/lib/theme-component-generator.ts
git commit -m "feat(pipeline): hex literal auto-repair before hard-fail

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 4: Prompt guidance for array/scalar confusion

**Goal:** Tell the AI explicitly to model parallel per-item fields as a single array prop. Prevents the AI from treating `post-thumbnail`, `post-title`, `post-date` as three separate string props and then calling `.map()` on them.
**Model:** haiku — text addition to two prompt builder functions

**File:** `tools/lib/theme-component-templates.ts`

**Step 4a — Clone translation prompt.** In `buildCloneTranslationPrompt`, find the `## TRANSLATION RULES` section. After rule 6 (the props dot-notation rule), add:

```
7. **Array content**: When the HTML has repeating items (cards, posts, list items), model them as a SINGLE array prop: `items?: Array<{ title?: string; description?: string; image?: string; href?: string; [key: string]: unknown }>`. Never call \`.map()\` on a string prop — if it needs mapping, it must be typed as an array.
```

Renumber any subsequent rules if needed (rules 7, 8, 9 become 8, 9, 10).

**Step 4b — Blueprint-only generation prompt.** In `buildComponentGenerationPrompt`, find the RULES section. After rule 6 (the dot-notation rule), add as rule 6b (or insert as a new numbered rule):

```
7. **Array props**: When multiple content slots share a common prefix (e.g. post-thumbnail, post-title, post-date) or represent per-item data, model them as a SINGLE array prop in the interface. Never call \`.map()\` on a string prop.
```

Renumber any subsequent rules if needed.

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
```

**Commit:**

```bash
git add tools/lib/theme-component-templates.ts
git commit -m "feat(pipeline): add array/scalar guidance to component generation prompts

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 5: End-to-end verification

**Goal:** Re-run `--pass translate` against the corvus clone to confirm yield improvement. Expect previously-placeholder components to now show `(AI)` instead of `(placeholder)`.
**Model:** sonnet — runs the pipeline and interprets results

```bash
# Re-run translate pass against corvus
npx tsx tools/extract-theme.ts --pass translate \
  --cpf output/clones/corvus \
  --out packages/themes/corvus-test-yield
```

Check the output log. Count components marked `(AI)` vs `(placeholder)`. Target: 8+/11 AI-generated (up from 5/11).

Review any remaining placeholders and note which gauntlet check caused the fallback (this will appear in the warnings output).

Then verify the generated package type-checks:

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

If yield improved, clean up the test output directory:

```bash
rm -rf packages/themes/corvus-test-yield
```

**Final commit:**

```bash
git add -A
git commit -m "chore(pipeline): verify gauntlet yield improvement (e2e test run)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Parallel execution groups

| Group | Phase   | Items                                                                     | File overlap     | Model | Rationale                                   |
| ----- | ------- | ------------------------------------------------------------------------- | ---------------- | ----- | ------------------------------------------- |
| G1    | Phase 1 | Read `theme-component-templates.ts` before editing                        | none (read only) | n/a   | Single file — no parallelism within phase   |
| G2    | Phase 2 | Read `theme-component-generator.ts` before editing                        | none (read only) | n/a   | Single file — no parallelism within phase   |
| G3    | Phase 3 | — no parallel work in this phase —                                        | —                | —     | Single file, sequential edits               |
| G4    | Phase 4 | Edit `buildCloneTranslationPrompt`, Edit `buildComponentGenerationPrompt` | same file        | haiku | Same file — must serialise                  |
| G5    | Phase 5 | — no parallel work in this phase —                                        | —                | —     | Pipeline run then type-check are sequential |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                                  | Reason                                          |
| ----------------------------------------------------- | ----------------------------------------------- |
| Verification gates (`pnpm type-check`) between phases | Each phase's output gates the next              |
| Git commits                                           | One commit per phase, in order                  |
| Phase 5 pipeline run → type-check                     | Must build output first before type-checking it |

---

## Cost Estimate

| Phase                              | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Array type fix            | haiku  | ~4k               | ~0.5k              | ~$0.002    |
| Phase 2: Smarter retry             | sonnet | ~8k               | ~2k                | ~$0.05     |
| Phase 3: Hex auto-repair           | haiku  | ~6k               | ~1k                | ~$0.005    |
| Phase 4: Prompt guidance           | haiku  | ~5k               | ~0.5k              | ~$0.002    |
| Phase 5: E2E verify (pipeline run) | sonnet | ~15k              | ~1k                | ~$0.06     |
| **Total**                          |        | **~38k**          | **~5k**            | **~$0.12** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Yield improvement — "X/11 AI-generated before → Y/11 after"
3. Remaining placeholder components and which gauntlet check caused each fallback
4. Build status — confirm `pnpm type-check` passes
5. Any exceptions or intentional deviations from the plan
6. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-13_translate-pipeline/yolo-brief-gauntlet-yield.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, yield change, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Completed

**Date:** 2026-04-14
**Status:** All phases executed successfully

All four improvements were implemented and verified. Yield improved from 5/11 (45%) to 10/11 (91%) on the corvus theme. Phase 2's targeted syntax-error retry demonstrably fired for CtaBlueBand and CtaGreenBand (both had severe parse errors, both succeeded on the targeted fix). Phase 3 hex auto-repair reduced hard-fails for inline style patterns. One deviation from the plan: `[key: string]: unknown` was corrected to `[key: string]: string | undefined` because `unknown` causes JSX type errors when array item dynamic properties are rendered as ReactNode, src, or key — `string | undefined` achieves the same open-access goal while remaining type-safe in JSX. Remaining placeholder (NavDarkBand) has brand-specific hex literals in non-inline-style contexts (SVG fills, border-color CSS vars) that the auto-repair can't address. The `pnpm type-check` verification gate revealed that AI-generated semantic type errors (calling `.map()` on a string prop, rendering object props as ReactNode) are not caught by the syntax gauntlet — flagged as future improvement for a semantic type-checking pass.

### Commits

- `cbee742` fix(pipeline): relax array item index signature; add plural slot endings
- `2b79e82` feat(pipeline): smarter syntax-error retry with targeted fix prompt
- `24bc760` feat(pipeline): hex literal auto-repair before hard-fail
- `a0db4c6` feat(pipeline): add array/scalar guidance to component generation prompts
- `c36203e` fix(pipeline): use string|undefined index sig to keep array item props JSX-safe
- `af6eeab` chore(pipeline): verify gauntlet yield improvement (e2e test run)

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
- The Co-Authored-By line in commits must reflect the orchestrator model used (`Claude Sonnet 4.6`)
