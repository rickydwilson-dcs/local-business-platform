# YOLO Implementation Brief: CQ-007 — Hardcoded Neutral Colors Fix + Defensive ESLint Rule

**Branch:** feature/cq-007-hardcoded-colors (created from develop)
**Session spec:** output/sessions/2026-03-07_cq-007-hardcoded-colors/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The colossus-scaffolding site's privacy-policy and cookie-policy pages use ~130 hardcoded Tailwind neutral color classes (`text-gray-600`, `bg-gray-50`, `border-gray-200`, etc.) instead of theme tokens, violating the platform's white-label styling standard. There is also no automated guard preventing future regressions.

This brief implements: (1) replacing all hardcoded neutral colors with theme tokens, (2) adding a custom ESLint rule that catches hardcoded Tailwind color classes in site code, integrated into `pnpm lint`.

The synthesis was reviewed and approved. Implement it exactly as specified below.

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80 / $4             | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (-> haiku) or requires deep cross-file reasoning (-> opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/cq-007-hardcoded-colors   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Fix privacy-policy/page.tsx

**Goal:** Replace all hardcoded neutral color classes with theme tokens in the colossus privacy-policy page. Keep semantic callout boxes (blue/green/purple/red/yellow) as-is with eslint-disable comments.
**Model:** haiku — mechanical find-replace with known mapping

### Token Mapping

Apply these replacements throughout the file:

| Find                                        | Replace                         |
| ------------------------------------------- | ------------------------------- |
| `bg-white` (in `section-standard bg-white`) | `bg-surface-background`         |
| `text-gray-900`                             | `text-surface-foreground`       |
| `text-gray-700`                             | `text-surface-foreground`       |
| `text-gray-600`                             | `text-surface-muted-foreground` |
| `bg-gray-50`                                | `bg-surface-muted`              |
| `bg-gray-100`                               | `bg-surface-muted`              |
| `border-gray-200`                           | `border-surface-border`         |
| `border-gray-300`                           | `border-surface-border`         |

### Semantic Callout Boxes — DO NOT replace colors

These use intentional colored backgrounds/borders/text for legal basis distinctions. For each line containing a hardcoded color class from a semantic callout (blue, green, purple, red, yellow, orange patterns like `bg-blue-50`, `border-blue-200`, `text-blue-900`, `border-l-4 border-blue-500`, etc.), add a JSX comment above the JSX element (the `<div>`, `<h3>`, `<p>`, etc.) that contains the class:

```tsx
{
  /* eslint-disable platform/no-hardcoded-tailwind-colors -- Intentional: semantic callout for legal basis distinction */
}
```

IMPORTANT: In JSX, ESLint disable comments must use the `{/* */}` syntax, not `//`. Place the disable comment on the line immediately before the JSX element that contains the hardcoded color class. Use the file-level `/* eslint-disable */` block comment at the top of each semantic callout `<div>` block if there are multiple lines within the same block that need disabling — this avoids excessive per-line comments. The most practical approach: add a single block disable/enable pair around each callout block:

```tsx
{
  /* eslint-disable platform/no-hardcoded-tailwind-colors -- Intentional: semantic legal basis callout */
}
<div className="border-l-4 border-blue-500 bg-blue-50 p-6">
  <h3 className="font-semibold text-blue-900 mb-2">Legitimate Interests</h3>
  <p className="text-blue-800 mb-2">...</p>
  <p className="text-sm text-blue-700">...</p>
</div>;
{
  /* eslint-enable platform/no-hardcoded-tailwind-colors */
}
```

Also apply the same pattern around:

- The `bg-blue-50 border border-blue-200` company details box in Section 1
- The `bg-yellow-50 border border-yellow-200` data protection note in Section 5
- The `bg-blue-50 border border-blue-200` notes in Sections 6, 8, 12
- The `bg-green-50 border border-green-200` "How to Exercise Your Rights" box in Section 7
- The `bg-red-50 border border-red-200` data breach note in Section 9

**File:** `sites/colossus-scaffolding/app/privacy-policy/page.tsx`

### Verification gate — STOP if this fails

```bash
grep -cE '(text|bg|border)-gray-' sites/colossus-scaffolding/app/privacy-policy/page.tsx
# Expected: 0
```

### Commit

```bash
git add sites/colossus-scaffolding/app/privacy-policy/page.tsx
git commit -m "$(cat <<'EOF'
fix(colossus): replace hardcoded gray classes with theme tokens in privacy-policy (CQ-007)

Replace ~73 hardcoded Tailwind neutral color classes (text-gray-*, bg-gray-*,
border-gray-*) with theme tokens (text-surface-foreground, bg-surface-muted, etc.).
Semantic callout boxes (blue/green/purple/red/yellow) kept with eslint-disable
comments as they serve distinct legal basis purposes.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Fix cookie-policy/page.tsx

**Goal:** Same token replacement for the cookie-policy page.
**Model:** haiku — identical mechanical find-replace

Apply the exact same token mapping as Phase 1. Apply the same eslint-disable/enable pattern around semantic callout blocks (the cookie-policy page has fewer callout boxes but still has colored category boxes for Necessary/Analytics/Marketing/Functional cookies).

**File:** `sites/colossus-scaffolding/app/cookie-policy/page.tsx`

### Verification gate — STOP if this fails

```bash
grep -cE '(text|bg|border)-gray-' sites/colossus-scaffolding/app/cookie-policy/page.tsx
# Expected: 0
```

### Commit

```bash
git add sites/colossus-scaffolding/app/cookie-policy/page.tsx
git commit -m "$(cat <<'EOF'
fix(colossus): replace hardcoded gray classes with theme tokens in cookie-policy (CQ-007)

Replace ~56 hardcoded Tailwind neutral color classes with theme tokens.
Semantic callout boxes kept with eslint-disable comments.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Build check

**Goal:** Confirm the token replacements don't break the build.
**Model:** n/a — verification only

### Verification gate — STOP if this fails

```bash
pnpm --filter colossus-scaffolding build
```

No commit — this is a verification-only phase.

---

## Phase 4: Create the ESLint rule

**Goal:** Create a custom ESLint rule that bans hardcoded Tailwind color-scale classes in JSX className attributes.
**Model:** sonnet — writing a new ESLint rule requires understanding the AST visitor pattern

**File created:** `tools/eslint/rules/no-hardcoded-tailwind-colors.mjs`

First, create the directory: `mkdir -p tools/eslint/rules`

Rule specification:

- Export a rule object with `meta` and `create` properties
- `meta.type`: `"suggestion"`
- `meta.messages.noHardcodedColor`: `"Hardcoded Tailwind color class '{{class}}' found. Use theme tokens instead (e.g., bg-brand-primary, text-surface-foreground). See docs/standards/styling.md."`
- `meta.schema`: empty array
- `create(context)` returns a visitor for:
  - `JSXAttribute[name.name="className"]` — check `value` if it's a `Literal` (string)
  - `TemplateLiteral` inside className — check each `TemplateElement` quasis value
- The banned pattern regex to test against each class in the string:
  ```
  /\b(text|bg|border|ring|outline|shadow|from|via|to|divide|accent|caret|fill|stroke|decoration)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{1,3}\b/g
  ```
- For each match, report with `messageId: "noHardcodedColor"` and `data: { class: matchedString }`
- Add a doc comment at the top noting: "Does not catch dynamically constructed className values (cn(), template literal expressions). Covers string literals and template literal static parts."

### Verification gate — STOP if this fails

```bash
# File exists and is valid JS
node -e "import('./tools/eslint/rules/no-hardcoded-tailwind-colors.mjs').then(m => { if (!m.default || !m.default.create) throw new Error('Invalid rule export'); console.log('Rule valid'); })"
```

### Commit

```bash
git add tools/eslint/rules/no-hardcoded-tailwind-colors.mjs
git commit -m "$(cat <<'EOF'
feat(tools): add ESLint rule to ban hardcoded Tailwind color classes (CQ-007)

Custom ESLint rule that checks JSX className attributes for hardcoded
Tailwind color-scale classes (text-gray-500, bg-blue-50, etc.) and
reports them with a suggestion to use theme tokens instead.

Scoped to string literals and template literal static parts.
Standard eslint-disable escape hatch available for intentional exceptions.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Integrate rule into site ESLint configs

**Goal:** Wire the custom rule into each client site's ESLint config so it runs with `pnpm lint`.
**Model:** haiku — mechanical import + config array addition to 3 files

Spawn three agents in parallel:

**Task 1: Update base-template ESLint config**
model: haiku
File: `sites/base-template/eslint.config.mjs`
Read the file first. Add an import at the top:

```javascript
import noHardcodedTailwindColors from "../../tools/eslint/rules/no-hardcoded-tailwind-colors.mjs";
```

Add a new config object to the eslintConfig array (before the ignores object):

```javascript
{
  files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  plugins: {
    platform: {
      rules: {
        "no-hardcoded-tailwind-colors": noHardcodedTailwindColors,
      },
    },
  },
  rules: {
    "platform/no-hardcoded-tailwind-colors": "error",
  },
},
```

**Task 2: Update dj-fox-electrical ESLint config**
model: haiku
File: `sites/dj-fox-electrical/eslint.config.mjs`
Same changes as Task 1.

**Task 3: Update colossus-scaffolding ESLint config**
model: haiku
File: `sites/colossus-scaffolding/eslint.config.mjs`
Same changes as Task 1.

DO NOT modify `sites/showcase/eslint.config.mjs` — showcase is a developer tool, not a client site.

### Verification gate — STOP if this fails

```bash
# Quick syntax check on all three configs
node -e "import('./sites/base-template/eslint.config.mjs').then(() => console.log('base-template OK'))"
node -e "import('./sites/dj-fox-electrical/eslint.config.mjs').then(() => console.log('dj-fox OK'))"
node -e "import('./sites/colossus-scaffolding/eslint.config.mjs').then(() => console.log('colossus OK'))"
```

### Commit

```bash
git add sites/base-template/eslint.config.mjs sites/dj-fox-electrical/eslint.config.mjs sites/colossus-scaffolding/eslint.config.mjs
git commit -m "$(cat <<'EOF'
feat(sites): integrate no-hardcoded-tailwind-colors ESLint rule (CQ-007)

Add custom platform/no-hardcoded-tailwind-colors rule to all client site
ESLint configs. Rule bans hardcoded Tailwind color-scale classes in JSX
className attributes. Runs as part of pnpm lint via Turborepo.

Showcase site excluded (developer tool, not a client site).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Add eslint-disable for known exceptions

**Goal:** Add eslint-disable comments for the star rating pattern in projects/page.tsx across all 3 client sites.
**Model:** haiku — mechanical single-line additions

For each of these files:

- `sites/base-template/app/projects/page.tsx`
- `sites/dj-fox-electrical/app/projects/page.tsx`
- `sites/colossus-scaffolding/app/projects/page.tsx`

Read each file, find the line with `text-gray-200` (star rating), and add a JSX comment immediately before the element containing it:

```tsx
{
  /* eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Star rating UI pattern */
}
```

Note: the `text-yellow-400` on the same line will also be caught by the rule, so the disable comment covers both.

### Verification gate — STOP if this fails

```bash
pnpm lint
# Expected: passes with no errors
```

If `pnpm lint` fails with violations in other files (not just projects/page.tsx), investigate and add eslint-disable comments ONLY for genuinely intentional patterns. Do NOT add blanket disables.

### Commit

```bash
git add sites/base-template/app/projects/page.tsx sites/dj-fox-electrical/app/projects/page.tsx sites/colossus-scaffolding/app/projects/page.tsx
git commit -m "$(cat <<'EOF'
chore(sites): add eslint-disable for star rating color exceptions (CQ-007)

Star rating UI uses text-gray-200 and text-yellow-400 intentionally.
Added eslint-disable-next-line comments to all 3 client site
projects/page.tsx files.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7: Prove the rule catches violations

**Goal:** Verify the ESLint rule actually catches new violations and that the escape hatch works.
**Model:** haiku — mechanical test

1. Add `<div className="text-gray-500">test</div>` to `sites/base-template/app/privacy-policy/page.tsx` (inside the return, before the closing `</>`).
2. Run `pnpm --filter base-template lint` — confirm it fails with `platform/no-hardcoded-tailwind-colors` error.
3. Add `{/* eslint-disable-next-line platform/no-hardcoded-tailwind-colors */}` above the test div.
4. Run `pnpm --filter base-template lint` — confirm it passes.
5. Revert the test changes (remove both the test div and the disable comment).
6. Run `pnpm --filter base-template lint` — confirm it still passes.

### Verification gate — STOP if this fails

```bash
# After reverting, lint must pass
pnpm --filter base-template lint
```

No commit — this is a verification-only phase.

---

## Phase 8: Full pipeline verification

**Goal:** Confirm everything passes across the entire monorepo.
**Model:** n/a — verification only

### Verification gate — STOP if this fails

```bash
pnpm lint && pnpm type-check && pnpm build
```

No commit — this is a verification-only phase.

---

## Phase 9: Update remediation audit

**Goal:** Mark CQ-007 as fixed in the code review remediation audit.
**Model:** haiku — mechanical doc update

File: `output/sessions/2026-03-07_code-review/remediation-audit.md`

Read the file. Find CQ-007 in the "Still Open" section. Move it to the "Fixed" section with evidence:

- `sites/colossus-scaffolding/app/privacy-policy/page.tsx` — 73 hardcoded gray classes replaced with theme tokens
- `sites/colossus-scaffolding/app/cookie-policy/page.tsx` — 56 hardcoded gray classes replaced with theme tokens
- `tools/eslint/rules/no-hardcoded-tailwind-colors.mjs` — new ESLint rule preventing regression
- Rule integrated into 3 site ESLint configs

Update the summary counts accordingly.

### Commit

```bash
git add output/sessions/2026-03-07_code-review/remediation-audit.md
git commit -m "$(cat <<'EOF'
docs: mark CQ-007 as fixed in remediation audit

Token replacements in 2 policy pages, new ESLint rule added,
rule integrated into 3 site ESLint configs.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Cost Estimate

| Phase                              | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Fix privacy-policy        | haiku  | ~8k               | ~5k                | $0.03      |
| Phase 2: Fix cookie-policy         | haiku  | ~6k               | ~4k                | $0.02      |
| Phase 3: Build check               | n/a    | ~1k               | ~0.5k              | $0.01      |
| Phase 4: Create ESLint rule        | sonnet | ~6k               | ~2k                | $0.05      |
| Phase 5: Integrate configs (3x)    | haiku  | ~6k               | ~2k                | $0.01      |
| Phase 6: eslint-disable exceptions | haiku  | ~5k               | ~1k                | $0.01      |
| Phase 7: Prove rule works          | haiku  | ~3k               | ~1k                | $0.01      |
| Phase 8: Full pipeline             | n/a    | ~1k               | ~0.5k              | $0.01      |
| Phase 9: Update audit doc          | haiku  | ~4k               | ~1k                | $0.01      |
| **Total**                          |        | **~40k**          | **~17k**           | **~$0.16** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

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

After completing all phases, append to `output/sessions/2026-03-07_cq-007-hardcoded-colors/yolo-brief.md`:

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

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6` not `Opus 4.6`)

---

## Completed

**Date:** 2026-03-08
**Status:** All phases executed successfully

Implemented Phase 1–9 as specified. The colossus-scaffolding privacy-policy (73 gray classes) and cookie-policy (56 gray classes) had all hardcoded neutrals replaced with theme tokens. Semantic callout boxes in both files, plus equivalents in base-template and dj-fox-electrical policy pages, were wrapped with eslint-disable/enable pairs. A custom ESLint rule (`tools/eslint/rules/no-hardcoded-tailwind-colors.mjs`) was written and integrated into all 3 site ESLint configs. The rule exposed additional intentional color patterns across the codebase (star ratings, form state feedback, accreditation badges, gradient decorations) — all received targeted eslint-disable comments. One deviation from the spec: `disable-next-line` comments were converted to block `disable/enable` pairs for multi-line JSX elements where the `className` attribute is not on the same line as the opening tag, and `//` line comments were used inside JavaScript expression contexts (`.map()` callbacks, `&&` expressions) where `{/* */}` JSX comments are syntactically invalid.

### Commits

- `11ab82b` fix(colossus): replace hardcoded gray classes with theme tokens in privacy-policy (CQ-007)
- `a5f9827` fix(colossus): replace hardcoded gray classes with theme tokens in cookie-policy (CQ-007)
- `697052e` feat(tools): add ESLint rule to ban hardcoded Tailwind color classes (CQ-007)
- `c866870` feat(sites): integrate no-hardcoded-tailwind-colors ESLint rule (CQ-007)
- `192d152` chore(sites): add eslint-disable for star rating color exceptions (CQ-007)
- `6366ee7` docs: mark CQ-007 as fixed in remediation audit
