# Implementation Plan: Migrate core-components to Theme System Tokens

**Date:** 2026-02-19
**Status:** Completed
**Source:** Synthesised from Claude and Codex independent plans
**Session folder:** `output/sessions/codex-peer-review/2026-02-19_migrate-core-components-to-theme-tokens/`

---

## Key Differences Between Plans

| Aspect                                           | Claude                                                                                        | Codex                                                                                                                    | Synthesised Decision                                                                                                                                                                                                                              |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Token naming for secondary/tertiary text         | `surface.secondary`, `surface.tertiary` → `--color-surface-secondary`                         | `surface.secondaryForeground`, `surface.tertiaryForeground` → `--color-surface-secondary-foreground`                     | **Codex wins.** The `*Foreground` suffix matches the existing convention (`surface.mutedForeground` → `--color-surface-muted-foreground`). Consistency is more important than brevity.                                                            |
| Sequence: theme CSS globals vs components        | Claude: components first (Phase 3), globals after (Phase 4)                                   | Codex: globals first (Phase 4), then components (Phase 5)                                                                | **Codex wins.** Theme CSS globals should be cleaned up before components — once the globals stop emitting hardcoded classes, components that inherit from them get "free" fixes, reducing component-level changes needed.                         |
| Baseline audit step                              | Not included — jumps straight to types                                                        | Explicit Phase 1: capture baseline counts, produce replacement matrix                                                    | **Codex wins.** A baseline count document makes progress measurable per phase and eliminates ambiguity about what "done" means. Takes 30 min, saves confusion later.                                                                              |
| Existing token aliases                           | Not addressed                                                                                 | Explicit: add aliases for already-misused names (`text-brand-on-primary`, `border-surface-border`, `text-surface-muted`) | **Codex wins.** Without aliases, migrating components that already use the wrong token names would require two changes per instance instead of one.                                                                                               |
| Tests and Zod schema                             | Not mentioned                                                                                 | Explicit: update `generate-css.test.ts`, `validate.test.ts`, Zod schema                                                  | **Codex wins.** Tests must be updated when the schema changes or they'll fail on CI. Omitting this would break the build gate.                                                                                                                    |
| Enforcement approach                             | Grep script (Option C), simpler                                                               | ESLint rule, warning-first then error                                                                                    | **Synthesis:** Start with grep script (zero deps, ships immediately); document ESLint upgrade as follow-up. Codex's warning-first ramp-up is sensible even for the grep approach — first pass as advisory output, second pass as CI hard failure. |
| `bg-white` context split                         | Explicit: `bg-surface-card` inside cards/panels, `bg-surface-background` for page backgrounds | Noted as "context-based" but not detailed                                                                                | **Claude wins.** This distinction matters for correctness. Must be documented in migration rules.                                                                                                                                                 |
| `ArticleCallout` semantic colours (`bg-blue-50`) | Flagged as special case needing `bg-info/10` pattern                                          | Not specifically addressed                                                                                               | **Claude wins.** Semantic callout colours are not gray neutrals — they must be handled separately from the bulk migration.                                                                                                                        |
| `surface.dark` naming ambiguity                  | Flagged: could collide with future dark-mode concept                                          | Uses `surface.dark` without comment                                                                                      | **Synthesis:** Name it `surface.inverse` instead. This clearly means "inverted/dark section" rather than "dark mode variant", avoiding future confusion.                                                                                          |
| Commit strategy                                  | One commit per phase                                                                          | One commit per phase (same)                                                                                              | Agreement — use this strategy.                                                                                                                                                                                                                    |

---

## Blind Spots Caught

**What Codex caught that Claude missed:**

1. **Existing misused aliases** — Components already in the wild use `text-brand-on-primary` and `border-surface-border` (non-standard names). Without adding aliases for these in the plugin, migrating those components breaks their styling mid-migration. This is a real build stability risk.
2. **Tests and Zod schema** — The theme-system package has tests for `generate-css.ts` and a Zod validation schema. Adding new token fields without updating these would fail CI immediately. Claude's plan would have caused a test failure on the first green gate.
3. **Baseline audit** — Skipping this means we can't measure progress or declare "done" with confidence. Codex's explicit Phase 1 is the correct professional approach.
4. **Gradual enforcement ramp** — Warning-only first, then hard CI failure, is more pragmatic than Claude's immediate-fail approach, especially given 56 files being migrated in waves.

**What Claude caught that Codex missed:**

1. **`bg-white` context split** — Not all `bg-white` maps to the same token. In a card it should be `bg-surface-card`; as a page background it should be `bg-surface-background`. Treating these identically would produce subtle visual regressions.
2. **`ArticleCallout` semantic colours** — `bg-blue-50` is an info-callout pattern, not a neutral gray. It needs `bg-info/10` (or similar opacity utility), not a surface token. This would be silently wrong under Codex's sweep.
3. **`surface.dark` naming risk** — Without the rename to `surface.inverse`, future dark-mode work will face ambiguity that's painful to untangle after it's in production.

---

## Implementation Plan

### Phase 0: Baseline Audit (no code changes)

**Goal:** Capture hardcoded-class counts per component before any changes. Sets measurable progress targets.

**Steps:**

1. Run: `grep -rn "text-\(gray\|slate\|white\)\|bg-\(white\|gray\|black\|slate\)\|border-\(gray\|slate\)" packages/core-components/src/components/ --include="*.tsx" | wc -l`
2. Save the count to a note in this session folder or the PR description
3. Confirm the gold-standard list: `LocationHero.tsx`, `TestimonialCard.tsx`, `FaqSection.tsx` — grep them to confirm zero violations (baseline for what correct looks like)
4. Produce the replacement matrix (documented below in Migration Rules section)

**Verification gate:** Count captured. Gold standard components confirmed clean.

---

### Phase 1: Extend the Token System

**Goal:** Add the 6 missing token types to cover ~85% of hardcoded usage. No component changes yet.

**Files modified:**

- `packages/theme-system/src/types.ts`
- `packages/theme-system/src/defaults.ts`
- `packages/theme-system/src/generate-css.ts`
- `packages/theme-system/src/tailwind-plugin.ts`
- `packages/theme-system/src/__tests__/generate-css.test.ts`
- `packages/theme-system/src/__tests__/validate.test.ts` (if Zod schema is present)
- `packages/themes/vega/index.ts`
- `packages/themes/orion/index.ts`

**Step 1.1 — Extend ThemeConfig types (`types.ts`)**

Add to `colors.surface`:

```typescript
secondaryForeground: string; // mid-tone text; replaces text-gray-700
tertiaryForeground: string; // lighter text; replaces text-gray-600
subtle: string; // very light background; replaces bg-gray-50/100
subtleBorder: string; // light border; replaces border-gray-200/300
inverse: string; // dark section background; replaces bg-black
```

Add to `colors.brand`:

```typescript
onPrimary: string; // contrast-safe text on brand-primary; replaces text-white on brand bg
```

**Step 1.2 — Update defaults (`defaults.ts`)**

Values chosen to exactly match current hardcoded classes to prevent visual regression:

```typescript
surface: {
  secondaryForeground: '#374151',  // gray-700
  tertiaryForeground:  '#4b5563',  // gray-600
  subtle:              '#f9fafb',  // gray-50 (slightly lighter than gray-100 for default)
  subtleBorder:        '#e5e7eb',  // gray-200
  inverse:             '#111827',  // gray-900 (not pure black — softer default, Orion can override)
}
brand: {
  onPrimary: '#ffffff',
}
```

**Step 1.3 — Wire CSS variables (`generate-css.ts`)**

Add to variable output:

```
--color-surface-secondary-foreground
--color-surface-tertiary-foreground
--color-surface-subtle
--color-surface-subtle-border
--color-surface-inverse
--color-brand-on-primary
```

**Step 1.4 — Add Tailwind utilities + aliases (`tailwind-plugin.ts`)**

New primary utilities:

```css
.text-surface-secondary {
  color: var(--color-surface-secondary-foreground);
}
.text-surface-tertiary {
  color: var(--color-surface-tertiary-foreground);
}
.bg-surface-subtle {
  background-color: var(--color-surface-subtle);
}
.bg-surface-inverse {
  background-color: var(--color-surface-inverse);
}
.border-surface-subtle {
  border-color: var(--color-surface-subtle-border);
}
.text-on-brand-primary {
  color: var(--color-brand-on-primary);
}
```

Backward-compatibility aliases (for tokens already misused in existing components):

```css
/* Some components already use these non-standard names */
.text-brand-on-primary {
  color: var(--color-brand-on-primary);
} /* alias for text-on-brand-primary */
.border-surface-border {
  border-color: var(--color-surface-subtle-border);
} /* alias for border-surface-subtle */
.text-surface-muted {
  color: var(--color-surface-muted-foreground);
} /* alias (was misnamed) */
```

Also extend `theme.extend.colors` to make these usable with `theme('colors...')` in `globals.css` `@apply` chains.

**Step 1.5 — Update named themes**

- `vega/index.ts` — inherits all defaults (no overrides needed)
- `orion/index.ts` — set `surface.inverse: '#000000'` (true black for dark header; matches current `bg-black` usage)

**Step 1.6 — Update tests**

- Update `generate-css.test.ts` to assert new CSS variables are output
- Update Zod schema validation tests to accept new fields (if schema validation exists)

**Verification gate:**

```bash
pnpm --filter @platform/theme-system test
pnpm --filter @platform/theme-system type-check
pnpm --filter @platform/theme-system build
pnpm type-check   # Full monorepo — named themes must still typecheck
```

Commit: `feat(theme-system): add surface secondary/tertiary/subtle/inverse and brand onPrimary tokens`

---

### Phase 2: Fix Typography Plugin

**Goal:** Make `.text-h1` through `.text-hero` set `font-family` automatically. Currently they omit it, forcing developers to add `font-heading` separately (easy to forget, inconsistently applied).

**Files modified:**

- `packages/theme-system/src/tailwind-plugin.ts`

**Changes:**

- Add `fontFamily: 'var(--font-family-heading)'` to the output of heading utilities: `text-hero`, `text-h1`, `text-h2`, `text-h3`, `text-h4`
- Leave `text-body`, `text-small`, `text-caption` on `var(--font-family-sans)`

**Note:** Any existing component using `text-h1 font-heading` together gets `font-heading` redundantly — harmless, CSS specificity is unchanged. A post-migration pass can remove the redundant `font-heading` class.

**Verification gate:**

```bash
pnpm --filter @platform/theme-system build
```

Visual smoke test: Render a heading with only `.text-h1` (no `font-heading`) in `sites/base-template` dev server. Confirm it renders in the heading font.

Commit: `fix(theme-system): include font-family in heading typography utilities`

---

### Phase 3: Clean Up Theme CSS Globals

**Goal:** Fix vega and orion `globals.css` so their utility classes no longer hardcode grays. These files are the upstream source — fixing them first means some component-level changes become automatic.

**Files modified:**

- `packages/themes/vega/globals.css`
- `packages/themes/orion/globals.css`

**Patterns to fix:**

```css
/* BEFORE */
.heading-hero {
  @apply text-4xl text-gray-900 font-bold leading-tight;
}
.heading-section {
  @apply text-2xl text-gray-900 font-semibold;
}
.nav-link {
  @apply text-gray-700 hover:text-gray-900;
}
.card {
  @apply bg-white border border-gray-200 rounded-lg;
}

/* AFTER */
.heading-hero {
  @apply text-hero text-surface-foreground;
}
/* text-hero now includes font-weight from Phase 2 */
.heading-section {
  @apply text-h2 text-surface-foreground;
}
.nav-link {
  @apply text-surface-secondary hover:text-surface-foreground;
}
.card {
  @apply bg-surface-card border border-surface-subtle rounded-card;
}
```

**Orion-specific (dark header section utilities):**

```css
/* BEFORE */
.nav-dark {
  @apply bg-black text-white border-b border-gray-800;
}

/* AFTER */
.nav-dark {
  @apply bg-surface-inverse text-on-brand-primary border-b border-surface-subtle;
}
```

**Keep:** All existing utility class names (`.btn-primary`, `.heading-section`, `.card`, etc.) must remain — only the `@apply` contents change. Call sites are not modified.

**Verification gate:**

```bash
pnpm build
```

Visual check: `sites/base-template` (vega) and `sites/dj-fox-electrical` (orion) both render correctly in dev server. Run both in parallel and compare.

Commit: `fix(themes): replace hardcoded gray classes with surface tokens in vega/orion globals`

---

### Phase 4: Migrate High-Impact Components (Tier 1 + Tier 2)

**Goal:** Fix the 10 highest-visibility components. These account for the majority of user-facing impact.

**Tier 1 — Every-page components** (fix together, single commit):

1. `packages/core-components/src/components/ui/site-header.tsx`
2. `packages/core-components/src/components/ui/mobile-menu.tsx`
3. `packages/core-components/src/components/ui/service-hero.tsx`
4. `packages/core-components/src/components/ui/content-card.tsx`
5. `packages/core-components/src/components/ui/article-callout.tsx` ⚠️ (special case — see below)

**Tier 2 — Section components** (same commit or second commit): 6. `packages/core-components/src/components/ui/coverage-map-section.tsx` 7. `packages/core-components/src/components/ui/coverage-stats-section.tsx` 8. `packages/core-components/src/components/ui/author-card.tsx` 9. `packages/core-components/src/components/ui/hero-section.tsx` (or HeroV1/V2/V3) 10. `packages/core-components/src/components/ui/cta-section.tsx`

**Migration rules (apply per component):**

| Hardcoded class                      | Token replacement               | Notes                         |
| ------------------------------------ | ------------------------------- | ----------------------------- |
| `text-gray-900`                      | `text-surface-foreground`       | Primary content text          |
| `text-gray-800`                      | `text-surface-foreground`       | Same — primary content text   |
| `text-gray-700`                      | `text-surface-secondary`        | New token                     |
| `text-gray-600`                      | `text-surface-tertiary`         | New token                     |
| `text-gray-500` and below            | `text-surface-muted-foreground` | Existing token                |
| `bg-white` (inside card/panel)       | `bg-surface-card`               | Context judgement required    |
| `bg-white` (page background)         | `bg-surface-background`         | Context judgement required    |
| `bg-gray-50`, `bg-gray-100`          | `bg-surface-subtle`             | New token                     |
| `border-gray-200`, `border-gray-300` | `border-surface-subtle`         | New token                     |
| `border-gray-100`                    | `border-surface-subtle`         | Same                          |
| `text-white` on `bg-brand-primary`   | `text-on-brand-primary`         | New token                     |
| `bg-black`, `bg-gray-900`            | `bg-surface-inverse`            | New token (renamed from dark) |

**Special case: `ArticleCallout.tsx`**

Semantic callout colours are NOT neutral grays — they're info/warning/success indicators. These must NOT be replaced with surface tokens:

- `bg-blue-50` (info callout) → `bg-info/10` (opacity utility over semantic token)
- `bg-yellow-50` (warning callout) → `bg-warning/10`
- `bg-red-50` (error callout) → `bg-error/10`
- `text-blue-700` (info text) → `text-info` (existing semantic token)
- `text-yellow-400` (star ratings) → leave as-is or introduce `text-accent` if accent colour is set to yellow in theme

These use opacity shorthand with existing semantic tokens (`bg-info`, `bg-warning`, etc.) rather than new tokens.

**Verification gate:**

```bash
pnpm lint && pnpm type-check && pnpm build
```

Visual check: Deploy preview of base-template (vega) and confirm no visual regressions.

Commit: `fix(core-components): migrate tier 1+2 components to theme tokens`

---

### Phase 5: Full Sweep — Remaining Components (Tier 3)

**Goal:** Migrate the remaining ~40+ components in a single batch.

**Approach:** Semi-automated.

- Deterministic replacements (`text-gray-900` → `text-surface-foreground`, `border-gray-200` → `border-surface-subtle`) can be done with scripted find-replace across all remaining component files
- Context-sensitive replacements (`bg-white` → card vs background) require manual review per instance

**Suggested process:**

1. Run scripted replacement for the deterministic patterns
2. Manually review all `bg-white` instances in the changed files (comment decision in PR)
3. Leave allowlisted exceptions inline (opacity overlays like `bg-black/60` for overlay elements are intentional — do not replace these)

**Allowlist exceptions:**

- `bg-black/60`, `bg-black/80` etc. (opacity overlays on images/modals) — these are intentional and have no token equivalent
- Third-party component classnames (if any)

**Verification gate:**

```bash
pnpm lint && pnpm type-check && pnpm build
# Hardcoded class count should be ≤ allowlisted exceptions only
grep -rn "text-gray-\|bg-white\|bg-gray-\|border-gray-" packages/core-components/src/components/ --include="*.tsx"
```

Commit: `fix(core-components): full sweep — migrate remaining components to theme tokens`

---

### Phase 6: Enforcement

**Goal:** Prevent regression. New components must not introduce hardcoded grays.

**Approach:** Grep script first, ESLint upgrade as follow-up.

**Step 6.1 — Create enforcement script**

File: `scripts/check-token-usage.ts`

```typescript
// Greps core-components for banned neutral classes
// Allowlists opacity-modifier patterns (bg-black/60 etc.)
// Exits with code 1 if any violations found
```

**Step 6.2 — Wire into lint**

Add to root `package.json` lint script:

```json
"lint": "eslint ... && tsx scripts/check-token-usage.ts"
```

**Step 6.3 — Initial run: advisory output**

First CI pass: script outputs violations as warnings (non-blocking). Let one PR cycle complete to confirm the script has no false positives.

**Step 6.4 — Promote to hard failure**

Second CI pass: script exits non-zero on any violation. This becomes a required CI check.

**Verification gate:**

```bash
pnpm lint   # passes with zero violations
# Manual test: temporarily introduce text-gray-900 into a component → confirm lint fails
```

Commit: `chore(ci): add enforcement script for theme token usage`

---

## Sequencing Summary

```
Phase 0: Baseline audit (count + replacement matrix, no code)
  ↓ verify: counts captured

Phase 1: Extend token system (types → defaults → generate-css → plugin + aliases → themes → tests)
  ↓ verify: pnpm test (theme-system) + pnpm type-check + pnpm build

Phase 2: Fix typography plugin (font-family in heading utilities)
  ↓ verify: build + visual smoke test

Phase 3: Clean up theme CSS globals (vega/orion)
  ↓ verify: pnpm build + visual check both themes

Phase 4: Migrate Tier 1+2 components (10 high-impact)
  ↓ verify: lint + type-check + build + visual preview

Phase 5: Full sweep — Tier 3 (remaining ~40 components)
  ↓ verify: lint + type-check + build + grep count = 0

Phase 6: Add enforcement script
  ↓ verify: lint passes, manual violation test confirms failure
```

---

## Commit Strategy

| Commit | Contents                                                   |
| ------ | ---------------------------------------------------------- |
| A      | `feat(theme-system)` — token model, plugin, aliases, tests |
| B      | `fix(theme-system)` — typography utility font-family       |
| C      | `fix(themes)` — vega/orion globals cleanup                 |
| D      | `fix(core-components)` — Tier 1+2 components               |
| E      | `fix(core-components)` — Tier 3 full sweep                 |
| F      | `chore(ci)` — enforcement script                           |

All in one PR. Each commit must be independently build-green before the next starts. No `sites/` changes until Commits A–C are verified.

---

## Risks and Final Notes

| Risk                                            | Likelihood         | Mitigation                                                                      |
| ----------------------------------------------- | ------------------ | ------------------------------------------------------------------------------- |
| Visual regression from CSS variable specificity | Medium             | Phase-by-phase visual checks; defaults match hardcoded values exactly           |
| `bg-white` context split (card vs background)   | Medium             | Manual review required — document decision per component in PR comments         |
| ArticleCallout semantic colours mishandled      | Medium             | Separate treatment with `bg-info/10` pattern — NOT a surface token              |
| Migration scope at 56 files                     | Medium             | Two-phase (Tier 1+2, then Tier 3) with batch commit strategy                    |
| `surface.inverse` naming future-proofing        | Addressed          | `inverse` vs `dark` — `inverse` chosen to avoid dark-mode collision             |
| Tests failing on CI after token additions       | High (without fix) | Explicitly update `generate-css.test.ts` and Zod schema in Phase 1              |
| Aliases for existing misused token names        | High (without fix) | Add backward-compat aliases in plugin (`text-brand-on-primary` etc.) in Phase 1 |

---

## What Was Done

**Completed:** 2026-02-20

Migrated 318 hardcoded neutral Tailwind color classes across 49 files in `packages/core-components/` to CSS-variable-backed theme tokens. Added 6 new tokens to the theme system (surface secondaryForeground, tertiaryForeground, subtle, subtleBorder, inverse; brand onPrimary), wired them through types/defaults/generate-css/tailwind-plugin/tests/named themes. Fixed typography utilities to include `font-family`. Cleaned up vega and orion globals.css. All remaining matches are legitimate exceptions (opacity overlays, white-on-brand, white-on-inverse). Final count: 0 violations (down from 318). Added enforcement script to prevent regression.

### Commits

- Commit A: `feat(theme-system)` — token model, plugin, aliases, tests
- Commit B: `fix(theme-system)` — typography utilities font-family (was missing)
- Commit C: `fix(themes)` — vega/orion globals cleanup
- Commit D: `fix(core-components)` — Tier 1+2 components (10 high-impact)
- Commit E: `fix(core-components)` — Tier 3 full sweep (36 remaining files)
- Commit F: `chore(ci)` — enforcement script
