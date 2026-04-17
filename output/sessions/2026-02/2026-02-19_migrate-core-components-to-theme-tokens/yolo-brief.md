# YOLO Implementation Brief: Migrate core-components to Theme System Tokens

**Branch:** develop
**Session spec:** `output/sessions/2026-02-19_migrate-core-components-to-theme-tokens/session.md`
**Mode:** Autonomous execution — implement all phases, verify after each, stop on error

---

## Context

The theme system provides CSS-variable-backed tokens for colors and typography, but ~336 hardcoded Tailwind classes in `packages/core-components` bypass them (e.g. `text-gray-900` instead of `text-surface-foreground`). This breaks white-labeling.

The synthesis plan (session.md) was reviewed and approved. Implement it exactly as specified.

Three components are the gold standard — **do not modify them**: `LocationHero.tsx`, `TestimonialCard.tsx`, `FaqSection.tsx`.

---

## Pre-flight

```bash
git checkout develop
git pull
pnpm type-check   # confirm clean baseline
```

---

## Phase 0: Baseline Audit (no code changes)

1. Capture hardcoded-class count:

```bash
grep -rn "text-gray-\|bg-white\b\|bg-gray-\|bg-black\b\|border-gray-\|border-black\b" \
  packages/core-components/src/components/ --include="*.tsx" | wc -l
```

2. Confirm gold-standard components are clean (should return 0):

```bash
grep -n "text-gray-\|bg-white\b\|bg-gray-\|bg-black\b\|border-gray-" \
  packages/core-components/src/components/ui/location-hero.tsx \
  packages/core-components/src/components/ui/testimonial-card.tsx \
  packages/core-components/src/components/ui/faq-section.tsx
```

3. Save both counts to a note — you'll reference them in the final report.

---

## Phase 1: Extend the Token System

**Files to modify:**

- `packages/theme-system/src/types.ts`
- `packages/theme-system/src/defaults.ts`
- `packages/theme-system/src/generate-css.ts`
- `packages/theme-system/src/tailwind-plugin.ts`
- Any test files in `packages/theme-system/src/__tests__/` (update, don't skip)
- `packages/themes/vega/index.ts`
- `packages/themes/orion/index.ts`

### 1.1 — types.ts: Add new tokens to ThemeConfig

Add to `colors.surface`:

```typescript
secondaryForeground: string; // replaces text-gray-700
tertiaryForeground: string; // replaces text-gray-600
subtle: string; // replaces bg-gray-50 / bg-gray-100
subtleBorder: string; // replaces border-gray-200 / border-gray-300
inverse: string; // replaces bg-black in dark sections (named 'inverse' not 'dark' to avoid dark-mode collision)
```

Add to `colors.brand`:

```typescript
onPrimary: string; // replaces text-white on brand-primary backgrounds
```

### 1.2 — defaults.ts: Set values matching current hardcoded classes

```typescript
surface: {
  // ...existing...
  secondaryForeground: '#374151',  // = gray-700
  tertiaryForeground:  '#4b5563',  // = gray-600
  subtle:              '#f9fafb',  // = gray-50
  subtleBorder:        '#e5e7eb',  // = gray-200
  inverse:             '#111827',  // = gray-900 (softer default than pure black)
}
brand: {
  // ...existing...
  onPrimary: '#ffffff',
}
```

### 1.3 — generate-css.ts: Wire CSS variables

Add variable output for all 6 new tokens:

- `--color-surface-secondary-foreground`
- `--color-surface-tertiary-foreground`
- `--color-surface-subtle`
- `--color-surface-subtle-border`
- `--color-surface-inverse`
- `--color-brand-on-primary`

### 1.4 — tailwind-plugin.ts: Add utilities + backward-compat aliases

New primary utilities:

```css
.text-surface-secondary  → color: var(--color-surface-secondary-foreground)
.text-surface-tertiary   → color: var(--color-surface-tertiary-foreground)
.bg-surface-subtle       → background-color: var(--color-surface-subtle)
.bg-surface-inverse      → background-color: var(--color-surface-inverse)
.border-surface-subtle   → border-color: var(--color-surface-subtle-border)
.text-on-brand-primary   → color: var(--color-brand-on-primary)
```

Backward-compat aliases (some components already use these wrong names):

```css
.text-brand-on-primary   → color: var(--color-brand-on-primary)        /* alias */
.border-surface-border   → border-color: var(--color-surface-subtle-border) /* alias */
.text-surface-muted      → color: var(--color-surface-muted-foreground)     /* alias */
```

Also extend `theme.extend.colors` so new tokens work with `theme('colors...')` in `@apply` chains.

### 1.5 — Named themes: Set per-theme overrides

`vega/index.ts`: inherits all defaults (no overrides needed — defaults are already vega-appropriate)

`orion/index.ts`: override `surface.inverse` to true black:

```typescript
surface: {
  // ...existing...
  inverse: '#000000',   // Orion uses true black for its dark header
}
```

### 1.6 — Update tests

Read any test files in `packages/theme-system/src/__tests__/`. Update:

- `generate-css.test.ts`: assert new CSS variables are output
- Any Zod schema validation tests: accept new fields

**Verification gate — STOP if this fails:**

```bash
pnpm --filter @platform/theme-system test
pnpm --filter @platform/theme-system type-check
pnpm --filter @platform/theme-system build
pnpm type-check
```

**Commit A:**

```
git add packages/theme-system packages/themes
git commit -m "feat(theme-system): add surface secondary/tertiary/subtle/inverse and brand onPrimary tokens"
```

---

## Phase 2: Fix Typography Plugin

**File:** `packages/theme-system/src/tailwind-plugin.ts`

1. First, read the current plugin to confirm whether `.text-h1` etc. currently set `font-family`
2. If missing: add `fontFamily: 'var(--font-family-heading)'` to heading utilities: `text-hero`, `text-h1`, `text-h2`, `text-h3`, `text-h4`
3. Leave `text-body`, `text-small`, `text-caption` on `var(--font-family-sans)`
4. If `font-family` is already present, note it and skip this phase

**Verification gate — STOP if this fails:**

```bash
pnpm --filter @platform/theme-system build
pnpm type-check
```

**Commit B:**

```
git add packages/theme-system
git commit -m "fix(theme-system): include font-family in heading typography utilities"
```

(Skip commit B if Phase 2 was a no-op)

---

## Phase 3: Clean Up Theme CSS Globals

**Files:**

- `packages/themes/vega/globals.css`
- `packages/themes/orion/globals.css`

Read both files. Replace hardcoded neutral classes in `@apply` chains:

| Before                                    | After                                               |
| ----------------------------------------- | --------------------------------------------------- |
| `@apply ... text-gray-900 ...`            | `@apply ... text-surface-foreground ...`            |
| `@apply ... text-gray-700 ...`            | `@apply ... text-surface-secondary ...`             |
| `@apply ... bg-white ...`                 | `@apply ... bg-surface-card ...`                    |
| `@apply ... bg-gray-50 ...`               | `@apply ... bg-surface-subtle ...`                  |
| `@apply ... border-gray-200 ...`          | `@apply ... border-surface-subtle ...`              |
| `@apply ... bg-black ...`                 | `@apply ... bg-surface-inverse ...`                 |
| `@apply ... text-white ...` (on brand bg) | `@apply ... text-on-brand-primary ...`              |
| `@apply text-4xl ...` (heading scale)     | `@apply text-hero ...` (or appropriate scale token) |

Keep all existing utility class names (`.btn-primary`, `.heading-section`, `.card`, etc.) — only change the `@apply` contents.

**Verification gate — STOP if this fails:**

```bash
pnpm build
pnpm type-check
```

**Commit C:**

```
git add packages/themes
git commit -m "fix(themes): replace hardcoded gray classes with surface tokens in vega/orion globals"
```

---

## Phase 4: Migrate High-Impact Components (Tier 1 + Tier 2)

**Files (read each before editing):**

Tier 1:

- `packages/core-components/src/components/ui/site-header.tsx`
- `packages/core-components/src/components/ui/mobile-menu.tsx`
- `packages/core-components/src/components/ui/service-hero.tsx`
- `packages/core-components/src/components/ui/content-card.tsx`
- `packages/core-components/src/components/ui/article-callout.tsx` ⚠️ special case

Tier 2:

- `packages/core-components/src/components/ui/coverage-map-section.tsx`
- `packages/core-components/src/components/ui/coverage-stats-section.tsx`
- `packages/core-components/src/components/ui/author-card.tsx`
- Any hero variant components (HeroV1/V2/V3 or hero-section)
- `packages/core-components/src/components/ui/cta-section.tsx`

**Migration rules:**

| Hardcoded class                           | Replace with                    | Notes                              |
| ----------------------------------------- | ------------------------------- | ---------------------------------- |
| `text-gray-900`                           | `text-surface-foreground`       | Primary content text               |
| `text-gray-800`                           | `text-surface-foreground`       | Same token — both are primary text |
| `text-gray-700`                           | `text-surface-secondary`        | New token                          |
| `text-gray-600`                           | `text-surface-tertiary`         | New token                          |
| `text-gray-500` and below                 | `text-surface-muted-foreground` | Existing token                     |
| `bg-white` (inside card/panel)            | `bg-surface-card`               | Context-dependent                  |
| `bg-white` (page background)              | `bg-surface-background`         | Context-dependent                  |
| `bg-gray-50`, `bg-gray-100`               | `bg-surface-subtle`             | New token                          |
| `border-gray-200`, `border-gray-300`      | `border-surface-subtle`         | New token                          |
| `border-gray-100`                         | `border-surface-subtle`         | Same                               |
| `text-white` on `bg-brand-primary`        | `text-on-brand-primary`         | New token                          |
| `bg-black`, `bg-gray-900` (dark sections) | `bg-surface-inverse`            | New token                          |

**⚠️ ArticleCallout special case — semantic colours are NOT neutrals:**

Do NOT replace these with surface tokens:

- `bg-blue-50` → `bg-info/10` (opacity over semantic token)
- `bg-yellow-50` → `bg-warning/10`
- `bg-red-50` → `bg-error/10`
- `text-blue-700` → `text-info`
- `text-yellow-400` (star ratings) → leave as-is (or `text-brand-accent` if accent = yellow)

**Do NOT modify:** `LocationHero.tsx`, `TestimonialCard.tsx`, `FaqSection.tsx`

**Verification gate — STOP if this fails:**

```bash
pnpm lint
pnpm type-check
pnpm build
```

**Commit D:**

```
git add packages/core-components
git commit -m "fix(core-components): migrate tier 1+2 components to theme tokens"
```

---

## Phase 5: Full Sweep — Remaining Components

Sweep all remaining files in `packages/core-components/src/components/` (excluding the gold-standard trio).

Find all remaining violations:

```bash
grep -rn "text-gray-\|bg-white\b\|bg-gray-\|bg-black\b\|border-gray-" \
  packages/core-components/src/components/ --include="*.tsx" \
  | grep -v "location-hero\|testimonial-card\|faq-section"
```

Apply the same migration rules from Phase 4 to each file.

**Allowlisted exceptions — do NOT replace these:**

- Opacity modifier patterns: `bg-black/60`, `bg-black/80`, `bg-white/10` etc. (intentional overlays)
- Any third-party or inline-override classes

After the sweep, run the grep again — it should return only allowlisted opacity patterns.

**Verification gate — STOP if this fails:**

```bash
pnpm lint
pnpm type-check
pnpm build
```

**Commit E:**

```
git add packages/core-components
git commit -m "fix(core-components): full sweep — migrate remaining components to theme tokens"
```

---

## Phase 6: Enforcement Script

Create `scripts/check-token-usage.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Checks that core-components don't use hardcoded neutral Tailwind color classes.
 * Allowlist: opacity modifier patterns (bg-black/60 etc.)
 * Run via: pnpm lint
 */
import { execSync } from "child_process";
import * as process from "process";

const SCOPE = "packages/core-components/src/components";
const PATTERN = "text-gray-|bg-white\\b|bg-gray-|bg-black\\b|border-gray-|border-black\\b";
const ALLOWLIST_PATTERN = /(bg|text|border)-(white|black|gray-\d+)\/([\d]+)/; // opacity modifiers OK

const raw = (() => {
  try {
    return execSync(`grep -rn "${PATTERN}" ${SCOPE} --include="*.tsx"`, { encoding: "utf8" });
  } catch {
    return ""; // grep exits 1 when no matches — that's success
  }
})();

const violations = raw
  .split("\n")
  .filter(Boolean)
  .filter((line) => !ALLOWLIST_PATTERN.test(line))
  // Exclude gold-standard reference components
  .filter((line) => !/(location-hero|testimonial-card|faq-section)\.tsx/.test(line));

if (violations.length > 0) {
  console.error("\n❌ Hardcoded neutral color classes found in core-components:");
  violations.forEach((v) => console.error(" ", v));
  console.error("\nReplace with theme tokens. See docs/standards/styling.md\n");
  process.exit(1);
}

console.log("✅ No hardcoded neutral color classes found in core-components.");
```

Add to root `package.json` lint script (read the file first to see current lint command, then append):

```json
"lint": "<existing command> && tsx scripts/check-token-usage.ts"
```

**Verification gate:**

```bash
pnpm lint   # should pass
# Manual regression test: temporarily add text-gray-900 to a component, run pnpm lint, confirm it fails, revert
```

**Commit F:**

```
git add scripts/package.json
git commit -m "chore(ci): add enforcement script for theme token usage in core-components"
```

---

## Final Report

After all phases and commits, output a summary report containing:

1. **Baseline count** (from Phase 0)
2. **Final count** after sweep (should be ≤ allowlisted opacity patterns only)
3. **Phases completed** — confirm each phase committed successfully
4. **Any exceptions** — list files or instances that were intentionally left (with reason)
5. **Build status** — confirm `pnpm lint && pnpm type-check && pnpm build` passes green
6. **Typography fix** — was `font-family` missing from heading utilities? (yes/no, what was done)

---

## UPDATE SESSION FILE

After completing all phases, update `output/sessions/2026-02-19_migrate-core-components-to-theme-tokens/session.md`:

- Change `**Status:** Ready for implementation` → `**Status:** Completed`
- Add a final section:

```markdown
## What Was Done

**Completed:** YYYY-MM-DD

[1-paragraph summary of what was implemented, any surprises found, and the final hardcoded-class count reduction]

### Commits

- Commit A: feat(theme-system) — token model, plugin, aliases, tests
- Commit B: fix(theme-system) — typography utilities (or: skipped, already correct)
- Commit C: fix(themes) — vega/orion globals cleanup
- Commit D: fix(core-components) — Tier 1+2 components
- Commit E: fix(core-components) — Tier 3 full sweep
- Commit F: chore(ci) — enforcement script
```

Confirm this was done in your final report.
