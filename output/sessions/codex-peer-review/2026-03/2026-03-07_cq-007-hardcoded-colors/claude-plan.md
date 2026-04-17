# Claude's Plan: CQ-007 — Hardcoded Neutral Colors Fix + Defensive ESLint Rule

**Date:** 2026-03-07
**Author:** Claude (independent plan, pre-synthesis)

---

## Phase 1: Token Mapping

Before touching code, establish the exact mapping from hardcoded classes to theme tokens.

### Neutral Colors (straightforward replacements)

| Hardcoded Class   | Theme Token                             | Rationale                                                                         |
| ----------------- | --------------------------------------- | --------------------------------------------------------------------------------- |
| `text-gray-600`   | `text-surface-muted-foreground`         | Secondary/muted text                                                              |
| `text-gray-700`   | `text-surface-foreground`               | Body text (slightly muted) — `surface-foreground` is the standard body text token |
| `text-gray-900`   | `text-surface-foreground`               | Primary text color                                                                |
| `bg-gray-50`      | `bg-surface-muted`                      | Subtle background for table headers, info boxes                                   |
| `bg-gray-100`     | `bg-surface-muted`                      | Same token, slightly different shade — theme handles it                           |
| `border-gray-200` | `border-surface-border`                 | Standard border between elements                                                  |
| `border-gray-300` | `border-surface-border`                 | Heavier border — same token, theme defines one border color                       |
| `bg-white`        | `bg-surface` or `bg-surface-background` | Keep as `bg-white` — it's not a gray scale violation, but note for the lint rule  |

### Semantic Callout Boxes (design decision)

The policy pages use colored callout boxes for legal basis indicators:

- `bg-blue-50 border-blue-200 text-blue-900/800` — "Legitimate Interests"
- `bg-green-50 border-green-200 text-green-900/800` — "Consent" (analytics)
- `bg-purple-50 border-purple-200 text-purple-900/800` — "Consent" (marketing)
- `bg-orange-50 border-orange-200 text-orange-900/800` — "Legitimate Interests" (functional)

**Decision:** Replace with semantic theme tokens. The theme system provides `semantic-info`, `semantic-success`, `semantic-warning`, `semantic-error`. These callout boxes map naturally:

| Callout Purpose                  | Current Colors                                   | Replacement                                                                                  |
| -------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Legitimate Interests (necessary) | `bg-blue-50 border-blue-200 text-blue-900`       | `bg-semantic-info/10 border-semantic-info/30 text-semantic-info` — or create a utility class |
| Consent (analytics)              | `bg-green-50 border-green-200 text-green-900`    | `bg-semantic-success/10 border-semantic-success/30 text-semantic-success`                    |
| Consent (marketing)              | `bg-purple-50 border-purple-200 text-purple-900` | `bg-brand-accent/10 border-brand-accent/30 text-brand-accent` — or use `semantic-info`       |
| Functional                       | `bg-orange-50 border-orange-200 text-orange-900` | `bg-semantic-warning/10 border-semantic-warning/30 text-semantic-warning`                    |

**Risk:** The semantic token opacity modifier syntax (`bg-semantic-info/10`) depends on the token being defined as an RGB/HSL value that supports Tailwind's opacity modifier. Need to verify this works with the theme system's CSS custom properties. If it doesn't, use a simpler approach:

**Fallback approach for callout boxes:** Create utility classes in `globals.css`:

```css
.callout-info {
  @apply bg-surface-muted border border-surface-border text-surface-foreground;
}
.callout-success {
  @apply bg-surface-muted border border-surface-border text-surface-foreground;
}
```

This is simpler but loses the visual distinction between callout types. A better middle ground: keep the color callouts but use `eslint-disable-next-line` on each one and add a comment explaining why. This defers the design decision without blocking the fix.

**Final decision:** Replace callout boxes with `eslint-disable-next-line` comments for now. The colored callouts are a deliberate design pattern with 4 distinct purposes. Forcing them all to the same surface token loses important visual hierarchy. This should be a separate design task to create proper `callout-info`, `callout-success`, `callout-warning` utility classes that are theme-aware.

Actually, re-evaluating: the DJ Fox and base-template policy pages don't have these callout boxes at all. The colossus pages are the only ones. The simplest fix that follows the existing pattern (DJ Fox) is to remove the colored callout boxes entirely and use the same plain prose styling. But that removes useful information.

**Revised final decision:** Replace the colored box patterns with theme-aware alternatives:

- The background: `bg-surface-muted`
- The border: `border-surface-border`
- The text: `text-surface-foreground` for titles, `text-surface-muted-foreground` for body
- Add a small colored left-border accent using semantic tokens if they support it, otherwise just use `bg-surface-muted` uniformly

This is the cleanest approach — it uses only proven theme tokens, matches the rest of the page styling, and doesn't require verifying opacity modifier support on semantic tokens.

### Table Styling

| Hardcoded                                           | Replacement                               |
| --------------------------------------------------- | ----------------------------------------- |
| `border border-gray-300 rounded-lg` (table wrapper) | `border border-surface-border rounded-lg` |
| `bg-gray-50` (thead)                                | `bg-surface-muted`                        |
| `border-b border-gray-300` (th)                     | `border-b border-surface-border`          |
| `border-b border-gray-200` (td)                     | `border-b border-surface-border`          |

---

## Phase 2: Fix the Files

### Step 1: Fix `privacy-policy/page.tsx`

**Files modified:** `sites/colossus-scaffolding/app/privacy-policy/page.tsx`

Replacements:

1. `text-gray-600` → `text-surface-muted-foreground`
2. `text-gray-700` → `text-surface-foreground`
3. `text-gray-900` → `text-surface-foreground`
4. `bg-gray-50` → `bg-surface-muted`
5. `border-gray-200` → `border-surface-border`
6. `border-gray-300` → `border-surface-border`
7. Colored callout boxes: replace `bg-{color}-50 border-{color}-200` with `bg-surface-muted border-surface-border`, replace `text-{color}-900`/`text-{color}-800` with `text-surface-foreground`/`text-surface-muted-foreground`

**Verification gate:**

```bash
grep -c 'text-gray-\|bg-gray-\|border-gray-' sites/colossus-scaffolding/app/privacy-policy/page.tsx
# Expected: 0
grep -c 'text-blue-\|bg-blue-\|border-blue-\|text-green-\|bg-green-\|border-green-\|text-purple-\|bg-purple-\|border-purple-\|text-orange-\|bg-orange-\|border-orange-' sites/colossus-scaffolding/app/privacy-policy/page.tsx
# Expected: 0
```

### Step 2: Fix `cookie-policy/page.tsx`

**Files modified:** `sites/colossus-scaffolding/app/cookie-policy/page.tsx`

Same replacement patterns as Step 1.

**Verification gate:**

```bash
grep -c 'text-gray-\|bg-gray-\|border-gray-' sites/colossus-scaffolding/app/cookie-policy/page.tsx
# Expected: 0
```

### Step 3: Build verification

```bash
cd sites/colossus-scaffolding && npm run build
```

This catches any broken class names or JSX issues from the replacements.

---

## Phase 3: Defensive ESLint Rule

### Approach: `no-restricted-syntax` with JSX attribute pattern

Rather than writing a custom ESLint rule (which requires a plugin package, tests, etc.), use ESLint's built-in `no-restricted-syntax` to match JSX string literals containing banned Tailwind color patterns.

**However**, `no-restricted-syntax` works on AST nodes, not string content within attributes. Matching a regex inside a `className` string value would require a custom rule or a different approach.

### Revised approach: Custom ESLint rule (inline in config)

ESLint flat config allows defining rules inline. We can write a small rule object directly in the config file:

**Actually**, the cleanest approach for a monorepo is a shared ESLint plugin as a local package. But that's over-engineered for one rule.

### Final approach: `no-restricted-syntax` targeting string patterns

ESLint's `no-restricted-syntax` can't inspect inside string values. The pragmatic options:

1. **`eslint-plugin-tailwindcss`** — has a `no-custom-classname` rule, but it's about custom vs Tailwind classes, not about banning specific Tailwind classes.
2. **Custom local ESLint rule** — write it as a function in the config.
3. **Grep-based CI check** — a shell script that runs `grep` and fails if it finds banned patterns.

**Decision: Grep-based CI check as a lint script.**

This is the most pragmatic:

- No new dependencies
- Simple to understand and maintain
- Can be added to `package.json` as a script and included in CI
- Works immediately with the existing pipeline

**Implementation:**

Create `scripts/lint-theme-tokens.sh`:

```bash
#!/bin/bash
# Checks for hardcoded Tailwind color classes in site code
# Part of the CQ-007 defensive measure

BANNED_PATTERN='(text|bg|border|ring|outline|shadow|from|via|to)-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]'

# Only check site app directories (not node_modules, not packages, not showcase)
VIOLATIONS=$(grep -rn --include="*.tsx" --include="*.ts" -E "$BANNED_PATTERN" sites/*/app/ sites/*/components/ 2>/dev/null | grep -v 'node_modules' | grep -v 'sites/showcase/' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "ERROR: Hardcoded Tailwind color classes found in site code."
  echo "Use theme tokens instead (bg-brand-primary, text-surface-foreground, etc.)"
  echo ""
  echo "Violations:"
  echo "$VIOLATIONS"
  echo ""
  echo "See docs/standards/styling.md for the correct theme tokens."
  echo "If this is intentional, add the file to scripts/lint-theme-tokens.sh allowlist."
  exit 1
fi

echo "Theme token check passed - no hardcoded color classes found."
```

**Allowlist:** The `projects/page.tsx` star rating (`text-gray-200` / `text-yellow-400`) needs an allowlist. Add an exclusion pattern to the grep:

```bash
| grep -v 'text-yellow-400\|text-gray-200.*rating\|text-gray-200.*star'
```

Actually, a simpler allowlist: exclude specific files.

Add to `package.json` at root level:

```json
"scripts": {
  "lint:theme": "bash scripts/lint-theme-tokens.sh"
}
```

And update the Turborepo pipeline or CI to include `lint:theme` alongside `lint`.

**Wait — reconsider.** The user asked for this to integrate with `pnpm lint`. A shell script would be a separate command. To truly integrate:

### Revised final approach: Custom ESLint rule inline in flat config

ESLint flat config supports defining rules as plugin objects inline. Here's the approach:

```javascript
// In eslint.config.mjs
const noHardcodedTailwindColors = {
  meta: { type: "suggestion", messages: { noHardcodedColor: "..." } },
  create(context) {
    // Visit JSXAttribute nodes with name="className"
    // Check the string value against a banned pattern regex
  },
};
```

This keeps everything in ESLint, runs with `pnpm lint`, and requires no new dependencies.

**Files created/modified:**

- `eslint-rules/no-hardcoded-tailwind-colors.mjs` — the rule implementation
- `eslint.config.mjs` (root) — import and enable the rule
- Each site's `eslint.config.mjs` — inherit from root (they already do via extending)

Actually, the simpler structure: put the rule directly in the root `eslint.config.mjs` as an inline plugin. But that makes the config file complex.

**Cleanest approach:** Create `eslint-rules/no-hardcoded-tailwind-colors.mjs`, import it in the root eslint config as a local plugin.

### Step 4: Create the ESLint rule

**File created:** `eslint-rules/no-hardcoded-tailwind-colors.mjs`

The rule:

- Visits `JSXAttribute` nodes where `name.name === "className"`
- Extracts the string value (handles template literals too)
- Tests against a regex for banned Tailwind color scale classes
- Reports with a helpful message suggesting the theme token alternative
- Allowlisted patterns: `text-white`, `bg-white`, `text-black`, `bg-black` (these are design fundamentals, not color scale classes)

Banned pattern regex:

```
/\b(text|bg|border|ring|outline|shadow|from|via|to|divide|accent|caret|fill|stroke|decoration)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{1,3}\b/
```

**Scope:** Only apply to `sites/*/app/**` and `sites/*/components/**` — not to `packages/` (shared components may have legitimate reasons) and not to `sites/showcase/` (developer tool).

### Step 5: Integrate into ESLint config

**File modified:** `eslint.config.mjs` (root)

Add the custom rule as a local plugin:

```javascript
import noHardcodedTailwindColors from "./eslint-rules/no-hardcoded-tailwind-colors.mjs";

const eslintConfig = [
  // ... existing config
  {
    files: ["sites/*/app/**/*.{ts,tsx}", "sites/*/components/**/*.{ts,tsx}"],
    ignores: ["sites/showcase/**"],
    plugins: {
      platform: { rules: { "no-hardcoded-tailwind-colors": noHardcodedTailwindColors } },
    },
    rules: {
      "platform/no-hardcoded-tailwind-colors": "error",
    },
  },
];
```

### Step 6: Handle the star rating exception

**File modified:** `sites/*/app/projects/page.tsx` (all 3 sites)

Add `// eslint-disable-next-line platform/no-hardcoded-tailwind-colors` on the star rating line. Only 1 line per file, trivial.

### Verification gate:

```bash
pnpm lint  # Should pass with no errors
```

Then test the rule catches violations:

```bash
# Temporarily add a text-gray-500 to a file, run lint, confirm it fails, revert
```

---

## Phase 4: Verification and Cleanup

### Step 7: Full build + lint

```bash
pnpm lint && pnpm build
```

### Step 8: Update remediation audit

**File modified:** `output/sessions/2026-03-07_code-review/remediation-audit.md`

Move CQ-007 from "Still Open" to "Fixed" with evidence.

---

## Risks and Trade-offs

| Risk                                                                                           | Mitigation                                                                                                                                            |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Semantic callout boxes lose visual distinction when converted to `bg-surface-muted`            | Acceptable — DJ Fox policy pages work fine without colored callouts. Can be revisited as a design task to create theme-aware callout utility classes. |
| Custom ESLint rule maintenance burden                                                          | Rule is simple (~40 lines), regex-based, unlikely to need updates. If it becomes burdensome, replace with a shell script.                             |
| `text-white` / `bg-white` not banned but could be problematic on dark themes                   | Out of scope for CQ-007. `bg-white` is used deliberately (e.g., `bg-white` sections) and would need a broader theme audit.                            |
| ESLint rule doesn't catch `className` values constructed dynamically (template literals, cn()) | Acceptable — dynamic classes are rare in this codebase and harder to lint. The rule catches the 95% case (string literals).                           |
| Opacity modifier syntax on semantic tokens may not work                                        | Not using this approach — replaced callout boxes with `bg-surface-muted` instead.                                                                     |

## Summary

- **4 files modified** (2 policy pages, root eslint config, projects page eslint-disable)
- **1 file created** (custom ESLint rule)
- **~130 class replacements** across 2 policy pages
- **1 new lint rule** that prevents regression, scoped to site code only
- **Estimated phases:** Fix (30 min), ESLint rule (30 min), verification (15 min)
