# Claude's Plan: Migrate core-components to Theme System Tokens

**Date:** 2026-02-19
**Author:** Claude (independent plan, before Codex peer review)

---

## Summary

The migration has three distinct layers that must be sequenced correctly:

1. **Extend the token system** — add the 6 missing tokens that components currently hardcode around
2. **Fix the typography plugin** — ensure `.text-h1` etc. include `font-family`
3. **Migrate components** — replace 336+ hardcoded instances with token classes, highest-impact first
4. **Clean up theme CSS** — remove hardcoded `@apply text-gray-900` in vega/orion globals
5. **Add enforcement** — ESLint rule to prevent regression

These must be done in this order because: components can't use tokens that don't exist yet, and enforcement without migration would just fail CI immediately.

---

## Phase 1: Extend the Token System

**Goal:** Add the 6 missing token types that cover ~85% of hardcoded usage.

### Step 1.1 — Extend `ThemeConfig` types

**File:** `packages/theme-system/src/types.ts`

Add to `colors.surface`:
```typescript
surface: {
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  card: string
  cardBorder: string
  // NEW:
  secondary: string        // mid-tone text (replaces text-gray-700)
  tertiary: string         // lighter text (replaces text-gray-600)
  subtle: string           // very light background (replaces bg-gray-50)
  subtleBorder: string     // light border (replaces border-gray-200)
  dark: string             // dark background (replaces bg-black in dark sections)
}
```

Add to `colors.brand`:
```typescript
brand: {
  primary: string
  primaryHover: string
  secondary: string
  accent: string
  // NEW:
  onPrimary: string        // safe contrast text on brand-primary (replaces text-white on brand bg)
}
```

**Why these specific tokens:**
- `surface.secondary` + `surface.tertiary` eliminate the `text-gray-700`/`text-gray-600` pattern (~55 instances)
- `surface.subtle` + `surface.subtleBorder` eliminate `bg-gray-50`/`bg-gray-100`/`border-gray-200` (~35 instances)
- `surface.dark` + `brand.onPrimary` handle the remaining dark-section and contrast patterns (~20 instances)

### Step 1.2 — Update defaults

**File:** `packages/theme-system/src/defaults.ts`

Set sensible defaults that match current hardcoded values (so existing visual appearance doesn't change):
```typescript
surface: {
  // existing...
  secondary: '#374151',     // gray-700
  tertiary: '#4b5563',      // gray-600
  subtle: '#f9fafb',        // gray-50
  subtleBorder: '#e5e7eb',  // gray-200
  dark: '#111827',          // gray-900 (not black — softer default)
}
brand: {
  // existing...
  onPrimary: '#ffffff',     // white (works for any reasonably dark brand primary)
}
```

**Risk:** If defaults change the appearance of existing sites at all, builds will fail visual checks. Using the same values as the hardcoded classes mitigates this.

### Step 1.3 — Update generate-css.ts

**File:** `packages/theme-system/src/generate-css.ts`

Add CSS variable generation for the new tokens:
```
--color-surface-secondary
--color-surface-tertiary
--color-surface-subtle
--color-surface-subtle-border
--color-surface-dark
--color-brand-on-primary
```

### Step 1.4 — Update tailwind-plugin.ts

**File:** `packages/theme-system/src/tailwind-plugin.ts`

Add Tailwind utilities:
```css
/* Surface text variants */
.text-surface-secondary    { color: var(--color-surface-secondary); }
.text-surface-tertiary     { color: var(--color-surface-tertiary); }

/* Surface background variants */
.bg-surface-subtle         { background-color: var(--color-surface-subtle); }
.bg-surface-dark           { background-color: var(--color-surface-dark); }

/* Surface border variant */
.border-surface-subtle     { border-color: var(--color-surface-subtle-border); }

/* Brand contrast token */
.text-on-brand-primary     { color: var(--color-brand-on-primary); }
```

Also add matching `hover:`, `focus:`, and `dark:` variants as needed.

### Step 1.5 — Update named themes

**Files:** `packages/themes/vega/index.ts`, `packages/themes/orion/index.ts`

Both themes should explicitly override the new defaults if they need different values. Orion (dark header) in particular may want `surface.dark: '#000000'` (true black for its header). Vega keeps the defaults.

### Verification Gate 1

```bash
pnpm --filter @platform/theme-system build
pnpm type-check
```

Expected: TypeScript accepts the new ThemeConfig properties with no errors. Build succeeds.
Smoke test: Create a test component in base-template that uses each new token class and verify it renders correctly in dev server.

---

## Phase 2: Fix Typography Plugin

**Goal:** Ensure `.text-h1` through `.text-hero` set `font-family`, not just size/weight.

### Step 2.1 — Investigate current plugin behaviour

**File:** `packages/theme-system/src/tailwind-plugin.ts`

Current suspected output for `.text-h1`:
```css
.text-h1 {
  font-size: var(--text-h1-size);
  line-height: var(--text-h1-line-height);
  letter-spacing: var(--text-h1-letter-spacing);
  font-weight: var(--text-h1-weight);
  /* missing: font-family */
}
```

### Step 2.2 — Add font-family to typography utilities

Add `font-family: var(--font-family-heading)` to all heading-scale utilities: `.text-hero`, `.text-h1`, `.text-h2`, `.text-h3`, `.text-h4`.

Leave `.text-body`, `.text-small`, `.text-caption` using `var(--font-family-sans)`.

**Rationale:** Heading utilities should be complete — a developer who uses `.text-h1` should get the heading font automatically, not need to remember to add `font-heading` separately. This reduces a two-class requirement to one.

### Step 2.3 — Audit existing components for `font-heading` redundancy

After the plugin fix, any component using both `.text-h1 font-heading` has a redundant class. Flag but do not clean up in this phase — keep changes focused.

### Verification Gate 2

```bash
pnpm --filter @platform/theme-system build
```

Visual smoke test: A heading with `.text-h1` in dev server renders in the theme's heading font without needing `font-heading`.

---

## Phase 3: Migrate Components (Highest Impact First)

**Goal:** Replace hardcoded classes in the 10 highest-impact components. Full sweep follows.

### Priority Tier 1 (visible on every page)

These appear on every page render across all sites. Fix these first.

1. **`SiteHeader.tsx`** — Dark/light conditional uses `bg-black`, `text-white`, `bg-white`, `text-gray-700`, `border-gray-200`
   - Replace with: `bg-surface-dark`, `text-on-brand-primary`, `bg-surface-background`, `text-surface-secondary`, `border-surface-subtle`
   - Special case: The `isDark` conditional can remain but should use surface tokens

2. **`MobileMenu.tsx`** — Same dark/light logic as header
   - Dependent on SiteHeader fix — do together

3. **`ServiceHero.tsx`** — Service pages are high-traffic; uses `text-gray-800`, `bg-white`, `border-gray-300`

4. **`ContentCard.tsx`** — Used in listing pages (services, blog); `bg-white`, `text-gray-900`, `text-gray-800`

5. **`ArticleCallout.tsx`** — Blog content; `bg-blue-50`, `text-gray-700`, `text-yellow-400`
   - Note: `bg-blue-50` is semantic (info callout), not just a gray. May need `bg-info/10` pattern.

### Priority Tier 2 (section-level components)

6. **`CoverageMapSection.tsx`** / **`CoverageStatsSection.tsx`** — `text-gray-800`, `border-gray-200`, gradient grays
7. **`AuthorCard.tsx`** — `border-gray-100`, `text-gray-900`, `text-gray-600`
8. **`HeroV1.tsx`**, **`HeroV2.tsx`**, **`HeroV3.tsx`** — Hero backgrounds and text

### Priority Tier 3 (remaining sweep)

Remaining ~40 components. This is a high-volume mechanical change that is suitable for a scripted approach — but a script is risky (false positive replacements). Recommended approach: single large PR with all Tier 3 changes together, reviewed as a batch.

### Migration Rules (per component)

For each component:
- `text-gray-900` → `text-surface-foreground`
- `text-gray-800` → `text-surface-foreground` (same token — both are primary content text)
- `text-gray-700` → `text-surface-secondary`
- `text-gray-600` → `text-surface-tertiary`
- `text-gray-500` and below → `text-surface-muted-foreground`
- `bg-white` → `bg-surface-card` (inside cards/panels) or `bg-surface-background` (page background)
- `bg-gray-50`, `bg-gray-100` → `bg-surface-subtle`
- `border-gray-200`, `border-gray-300` → `border-surface-subtle`
- `border-gray-100` → `border-surface-subtle` (same)
- `text-white` on `bg-brand-primary` → `text-on-brand-primary`
- `bg-black` in dark sections → `bg-surface-dark`

### Verification Gate 3

After each tier:
```bash
pnpm build                      # Full build including affected sites
pnpm type-check                 # No TS errors from class changes
```

Optional but recommended: deploy preview to base-template on Vercel and visually compare before/after.

---

## Phase 4: Clean Up Theme CSS

**Goal:** Remove hardcoded classes from vega and orion `globals.css`.

**Files:**
- `packages/themes/vega/globals.css`
- `packages/themes/orion/globals.css`

Common patterns to fix:
```css
/* Before */
.heading-hero { @apply text-4xl text-gray-900 font-bold; }

/* After */
.heading-hero { @apply text-hero text-surface-foreground; }
```

Note: If Phase 2 made `.text-hero` set `font-family` and `font-weight` automatically, then `font-bold` becomes redundant here too.

**Special care:** Orion's dark header section utilities. Replace:
```css
/* Before */
.nav-dark { @apply bg-black text-white; }

/* After */
.nav-dark { @apply bg-surface-dark text-on-brand-primary; }
```

### Verification Gate 4

```bash
pnpm build
```

Visual check: dj-fox-electrical (orion) and base-template (vega) both render correctly in dev.

---

## Phase 5: Add Enforcement

**Goal:** Prevent regression — make it impossible to introduce hardcoded color classes without a CI failure.

### Option A: ESLint plugin

Use `eslint-plugin-tailwindcss` with `no-custom-classname` or a custom rule that flags `text-gray-*`, `bg-gray-*`, `border-gray-*` etc.

**Pros:** Catches at edit time in IDE, fails CI.
**Cons:** Requires configuring and maintaining a rule set. May have false positives.

### Option B: Token-only Tailwind safelist + allowlist

Configure `tailwind.config.ts` to disallow the gray utility classes using a custom `blocklist` plugin.

**Pros:** Purely CSS-level enforcement, no new ESLint dependency.
**Cons:** Tailwind's blocklist is experimental and may not be well-supported.

### Option C: Codegen check (lightweight)

Write a script `scripts/check-token-usage.ts` that greps component files for `text-gray-*`, `bg-gray-*`, `border-gray-*` and fails if any are found. Run as part of `pnpm lint`.

**Pros:** Simple, transparent, no external dependency.
**Cons:** Not real-time in IDE, only catches on lint run.

**Recommendation:** Option C for now (fast to implement, zero new deps), with Option A as a follow-up once migration is confirmed stable.

### Verification Gate 5

```bash
pnpm lint
```

Expected: The check script passes (no hardcoded grays remain) and fails immediately if any are reintroduced.

---

## Risks and Trade-offs

### Risk 1: Visual regression
**Likelihood:** Medium. Even when tokens are set to match hardcoded values, subtle differences in CSS variable rendering or specificity could cause visual shifts.
**Mitigation:** Phase-by-phase verification with dev server visual checks before each push. Start with one site before deploying all.

### Risk 2: `surface.dark` token collides with dark-mode concept
**Likelihood:** Medium. Naming `surface.dark` could cause confusion if dark-mode (system `prefers-color-scheme`) is added later — developers might expect `surface.dark` to mean "the background in dark mode", not "a dark section background".
**Mitigation:** Consider naming it `surface.inverse` or `surface.darkSection` to avoid ambiguity. Discuss in synthesis.

### Risk 3: `text-on-brand-primary` is naive
**Likelihood:** Low. For most dark brand colors, white text works. But if a theme uses a light brand primary (yellow, light blue), white text would fail contrast.
**Mitigation:** The token value is set per-theme (not hardcoded white in the plugin). Theme authors are responsible for setting a contrast-safe value. WCAG validation tool already exists in the theme-system package.

### Risk 4: Component migration scope creep
**Likelihood:** Medium. 56 files is a lot. Manual migration could drag across multiple PRs.
**Mitigation:** Tier 1 + Tier 2 (10 files) in one PR. Tier 3 (remaining 40+) as a single large batch PR — reviewable as a sweep.

### Risk 5: Typography fix breaks existing `font-heading` usage
**Likelihood:** Low. Adding `font-family` to `.text-h1` where `font-heading` was already explicit just becomes redundant, not broken. CSS specificity doesn't change.
**Mitigation:** Post-Phase-2 audit for redundant `font-heading` + `text-h1` combos — clean up as cosmetic follow-up.

---

## Sequencing Summary

```
Phase 1: Extend token system (types → defaults → generate-css → plugin → named themes)
  ↓ verify: pnpm build + pnpm type-check

Phase 2: Fix typography plugin (add font-family to heading utilities)
  ↓ verify: build + visual smoke test

Phase 3: Migrate components (Tier 1 → Tier 2 → Tier 3)
  ↓ verify: build + type-check + visual check per tier

Phase 4: Clean up theme CSS (vega/orion globals)
  ↓ verify: build + visual check both themes

Phase 5: Add enforcement script
  ↓ verify: pnpm lint passes; test that introducing a gray class fails lint
```

**Estimated scope:**
- Phase 1: ~4-6 files, small targeted additions
- Phase 2: 1 file (tailwind-plugin.ts)
- Phase 3: 56 component files (~336+ line changes)
- Phase 4: 2 files (vega/orion globals)
- Phase 5: 1 new script + lint config

**Commit strategy:** One commit per phase. Phase 3 can be split: Tier 1+2 as one commit, Tier 3 as a second. All under one PR.
