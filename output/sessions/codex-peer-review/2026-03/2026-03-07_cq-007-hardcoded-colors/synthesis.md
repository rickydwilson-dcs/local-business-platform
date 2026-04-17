# Implementation Plan: CQ-007 — Hardcoded Neutral Colors Fix + Defensive ESLint Rule

**Date:** 2026-03-08
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

## Key Differences Between Plans

| Aspect                 | Claude                                           | Codex                                                 | Synthesised Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------- | ------------------------------------------------ | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bg-gray-50` mapping   | `bg-surface-muted`                               | `bg-surface-subtle`                                   | **`bg-surface-muted`** — this is used for table headers and info box backgrounds; DJ Fox reference uses `bg-surface-subtle` for breadcrumb bars and `bg-surface-muted` for content blocks. Both are valid; `bg-surface-muted` is more consistent with the DJ Fox policy page pattern.                                                                                                                                                                                                                       |
| `bg-white` handling    | Keep as `bg-white`                               | Replace with `bg-surface-background`                  | **`bg-surface-background`** — Codex is right that this is more theme-safe. On a dark theme, hardcoded `bg-white` creates a jarring white block. The DJ Fox reference uses `bg-surface-background` for its main content wrapper.                                                                                                                                                                                                                                                                             |
| Semantic callout boxes | Replace with `bg-surface-muted` (uniform)        | Keep with `eslint-disable-next-line`                  | **Keep with `eslint-disable-next-line`** — Codex's approach is better. The callout boxes serve 4 distinct semantic purposes (Legitimate Interests, Contract, Consent, Legal Obligation). Collapsing them into one surface token loses meaningful visual hierarchy. The DJ Fox pages don't have them, but that's a content difference, not a standard. Adding eslint-disable with a comment explaining the design intent is the right call. This also keeps the scope of changes smaller and more auditable. |
| ESLint rule location   | Root `eslint.config.mjs` with file glob patterns | Each site's `eslint.config.mjs` importing shared rule | **Each site's `eslint.config.mjs`** — Codex is right about config drift risk. More importantly, the root config's `files` glob patterns for `sites/*/app/**` may not resolve correctly from root context in a Turborepo setup where each workspace runs lint independently. Putting the rule import in each site's config ensures it runs in the right context. The rule file itself is shared.                                                                                                             |
| Rule file path         | `eslint-rules/no-hardcoded-tailwind-colors.mjs`  | `tools/eslint/rules/no-hardcoded-tailwind-colors.mjs` | **`tools/eslint/rules/no-hardcoded-tailwind-colors.mjs`** — `tools/` is already the home for platform tooling scripts. Keeps the root directory clean.                                                                                                                                                                                                                                                                                                                                                      |

## Blind Spots Caught

- **Codex caught**: `no-restricted-syntax` may already be disabled in colossus for `app/**/page.tsx` files. This means a solution built on `no-restricted-syntax` (which Claude initially considered) would silently fail. Using a custom namespaced rule (`platform/no-hardcoded-tailwind-colors`) avoids this entirely.
- **Codex caught**: Config drift across sites. If the rule only lives in the root config, a site that adds its own overrides could accidentally bypass it. Putting the import in each site's config makes enforcement explicit.
- **Claude caught**: Opacity modifier syntax (`bg-semantic-info/10`) likely won't work with CSS custom properties defined as hex values. This validates the decision to keep callout boxes as-is rather than attempting semantic token replacements.
- **Claude caught**: Dynamic `className` values (template literals, `cn()` calls) won't be caught by the JSX string literal rule. This is acceptable for 95% coverage but worth noting in the rule's doc comment.

---

## Implementation Plan

### Phase 1: Token Mapping (reference, no code changes)

Exact mapping to apply across both policy pages:

| Hardcoded Class   | Theme Token                     | Context                          |
| ----------------- | ------------------------------- | -------------------------------- |
| `bg-white`        | `bg-surface-background`         | Main content area background     |
| `text-gray-900`   | `text-surface-foreground`       | Primary heading/body text        |
| `text-gray-700`   | `text-surface-foreground`       | Body text in info sections       |
| `text-gray-600`   | `text-surface-muted-foreground` | Secondary/meta text              |
| `bg-gray-50`      | `bg-surface-muted`              | Table headers, info boxes        |
| `bg-gray-100`     | `bg-surface-muted`              | Alternate backgrounds            |
| `border-gray-200` | `border-surface-border`         | Table cell borders, card borders |
| `border-gray-300` | `border-surface-border`         | Table/section borders            |

**NOT replaced** (kept with `eslint-disable-next-line`):

- Semantic callout boxes: `bg-blue-50`, `border-blue-200`, `text-blue-900/800/700`, `border-blue-500` (and green/purple/orange/red/yellow equivalents)
- Star rating in `projects/page.tsx`: `text-gray-200`, `text-yellow-400`

---

### Phase 2: Fix colossus policy pages

**Step 1: Fix `privacy-policy/page.tsx`**

File: `sites/colossus-scaffolding/app/privacy-policy/page.tsx`

Apply the token mapping from Phase 1. For each semantic callout block (blue, green, purple, red, yellow info boxes), add `{/* eslint-disable-next-line platform/no-hardcoded-tailwind-colors */}` above the line with a brief comment like `{/* Intentional: semantic callout for legal basis distinction */}`.

Verification:

```bash
grep -cE '(text|bg|border)-gray-' sites/colossus-scaffolding/app/privacy-policy/page.tsx
# Expected: 0
```

**Step 2: Fix `cookie-policy/page.tsx`**

File: `sites/colossus-scaffolding/app/cookie-policy/page.tsx`

Same token mapping. Same eslint-disable pattern for semantic callout blocks.

Verification:

```bash
grep -cE '(text|bg|border)-gray-' sites/colossus-scaffolding/app/cookie-policy/page.tsx
# Expected: 0
```

**Step 3: Build check**

```bash
pnpm --filter colossus-scaffolding build
```

Confirms no broken class names or JSX syntax issues.

---

### Phase 3: Defensive ESLint rule

**Step 4: Create the rule file**

File created: `tools/eslint/rules/no-hardcoded-tailwind-colors.mjs`

Rule specification:

- Visits `JSXAttribute` nodes where `name.name === "className"`
- Extracts string value from `Literal` nodes (and `TemplateElement` quasis for template literals)
- Tests each class against the banned pattern regex:
  ```
  /\b(text|bg|border|ring|outline|shadow|from|via|to|divide|accent|caret|fill|stroke|decoration)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{1,3}\b/
  ```
- Reports with message: `"Hardcoded Tailwind color class '{{class}}' found. Use theme tokens instead (e.g., bg-brand-primary, text-surface-foreground). See docs/standards/styling.md."`
- Does NOT ban `text-white`, `bg-white`, `text-black`, `bg-black` (no numeric suffix = not matched by regex)
- Standard `// eslint-disable-next-line` escape hatch available

**Step 5: Integrate into each site's ESLint config**

Files modified:

- `sites/base-template/eslint.config.mjs`
- `sites/dj-fox-electrical/eslint.config.mjs`
- `sites/colossus-scaffolding/eslint.config.mjs`

Each site config gets:

```javascript
import noHardcodedTailwindColors from "../../tools/eslint/rules/no-hardcoded-tailwind-colors.mjs";

// Add to the config array:
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
}
```

**NOT added to** `sites/showcase/eslint.config.mjs` — showcase is a developer tool, not a client site.

**Step 6: Add eslint-disable for known exceptions**

Files modified:

- `sites/base-template/app/projects/page.tsx` — add `// eslint-disable-next-line platform/no-hardcoded-tailwind-colors` on star rating line
- `sites/dj-fox-electrical/app/projects/page.tsx` — same
- `sites/colossus-scaffolding/app/projects/page.tsx` — same

Verification:

```bash
pnpm lint  # Should pass with no errors
```

**Step 7: Prove the rule catches violations**

Temporarily add `className="text-gray-500"` to `sites/base-template/app/privacy-policy/page.tsx`, run `pnpm --filter base-template lint`, confirm it fails with the new rule, then revert.

---

### Phase 4: Final verification

**Step 8: Full pipeline**

```bash
pnpm lint && pnpm build
```

**Step 9: Visual spot-check**

Run `pnpm --filter colossus-scaffolding dev`, visit `/privacy-policy` and `/cookie-policy`. Confirm:

- Text is readable (no invisible text on backgrounds)
- Table borders are visible
- Semantic callout boxes retain their color distinction
- Overall page structure unchanged

**Step 10: Update remediation audit**

File modified: `output/sessions/2026-03-07_code-review/remediation-audit.md`

Move CQ-007 from "Still Open" to "Fixed" with evidence:

- Token replacements in 2 policy pages
- New ESLint rule in `tools/eslint/rules/`
- Rule integrated into 3 site ESLint configs

---

## Risks and Trade-offs

| Risk                                                                    | Severity | Mitigation                                                                                                                                                                   |
| ----------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Semantic callout boxes bypass the lint rule via eslint-disable          | Low      | Each disable has a comment explaining the intent. A future task can create theme-aware callout utility classes.                                                              |
| Config drift if new sites don't add the rule                            | Medium   | Document in `docs/guides/adding-new-site.md` that new site ESLint configs must import the rule. The base-template already has it, so copying the template includes the rule. |
| Dynamic className (cn(), template literals) not fully caught            | Low      | Covers 95% of cases (string literals). Dynamic construction is rare in this codebase.                                                                                        |
| `bg-surface-background` vs `bg-white` visual difference on light themes | Low      | Semantically correct — `surface-background` resolves to white on light themes. Only matters if someone inspects computed styles.                                             |
| Rule maintenance if Tailwind adds new color scales                      | Very Low | Regex covers all current Tailwind v4 color scales. New scales are added to Tailwind approximately never.                                                                     |

## Summary

- **Files modified:** 8 (2 policy pages, 3 site eslint configs, 3 projects pages for eslint-disable)
- **Files created:** 1 (`tools/eslint/rules/no-hardcoded-tailwind-colors.mjs`)
- **~130 class replacements** across 2 policy pages
- **~20 eslint-disable comments** for intentional semantic callout boxes
- **1 new lint rule** integrated into `pnpm lint` for all client sites
