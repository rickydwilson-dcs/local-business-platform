# Codex Implementation Plan: Migrate `core-components` to Theme Tokens

## 1. Baseline audit and migration map (no code changes yet)

1. Capture a hardcoded-color baseline and bucket by component priority.
   Files/commands:
   - `packages/core-components/src/components/ui/**`
   - `packages/themes/vega/globals.css`
   - `packages/themes/orion/globals.css`
   - `rg -n "text-(gray|slate|white)|bg-(white|gray|black|slate)|border-(gray|slate|white|black)" ...`
2. Produce a replacement matrix for recurring classes.
   Initial mapping:
   - `text-gray-900` -> `text-surface-foreground`
   - `text-gray-700` -> `text-surface-secondary` (new)
   - `text-gray-600` -> `text-surface-tertiary` (new)
   - `bg-white` -> `bg-surface-card` or `bg-surface-background` (context-based)
   - `bg-gray-50/bg-gray-100` -> `bg-surface-subtle` (new)
   - `border-gray-200/300` -> `border-surface-subtle` (new)
   - `text-white` on brand button/chip -> `text-on-brand-primary` (new)
   - `bg-black/bg-gray-900` (dark sections/header) -> `bg-surface-dark` (new)
3. Capture a “must-not-break” reference list (gold standard components).
   - `packages/core-components/src/components/ui/location-hero.tsx`
   - `packages/core-components/src/components/ui/testimonial-card.tsx`
   - `packages/core-components/src/components/ui/faq-section.tsx`

Verification gate:

- Baseline counts saved in the PR description (or a local note) so reduction is measurable phase-by-phase.

## 2. Fix token-system gaps first (theme-system package only)

1. Extend token types in `packages/theme-system/src/types.ts`.
   - Add new `colors.surface` entries:
     - `secondaryForeground`
     - `tertiaryForeground`
     - `subtle`
     - `subtleBorder`
     - `dark`
   - Add new `colors.brand` entry:
     - `onPrimary`
   - Keep all existing token names unchanged.
2. Add defaults in `packages/theme-system/src/defaults.ts`.
   Suggested default values (aligned to current palette intent):
   - `secondaryForeground: #374151`
   - `tertiaryForeground: #4b5563`
   - `subtle: #f3f4f6`
   - `subtleBorder: #d1d5db`
   - `dark: #111827`
   - `onPrimary: #ffffff`
3. Wire CSS variable generation in `packages/theme-system/src/generate-css.ts`.
   - Add:
     - `--color-surface-secondary-foreground`
     - `--color-surface-tertiary-foreground`
     - `--color-surface-subtle`
     - `--color-surface-subtle-border`
     - `--color-surface-dark`
     - `--color-brand-on-primary`
4. Extend Tailwind plugin utilities in `packages/theme-system/src/tailwind-plugin.ts`.
   - Add classes:
     - `text-surface-secondary`
     - `text-surface-tertiary`
     - `bg-surface-subtle`
     - `border-surface-subtle`
     - `bg-surface-dark`
     - `text-on-brand-primary`
   - Add compatibility aliases already used in repo to avoid breakage while migrating:
     - `text-brand-on-primary` -> `var(--color-brand-on-primary)`
     - `border-surface-border` -> `var(--color-surface-subtle-border)` (or card-border if chosen; pick one and document)
     - `text-surface-muted` -> `var(--color-surface-muted-foreground)`
5. Extend plugin `theme.extend.colors` with corresponding keys to support `theme('colors...')` usage in theme CSS.
6. Update zod schema in `packages/theme-system/src/types.ts` so validation covers new fields.
7. Update tests in:
   - `packages/theme-system/src/__tests__/generate-css.test.ts`
   - `packages/theme-system/src/__tests__/validate.test.ts`

Verification gate:

- `pnpm --filter @platform/theme-system test`
- `pnpm --filter @platform/theme-system type-check`
- `pnpm --filter @platform/theme-system build`

## 3. Typography utility decision and fix

1. Confirm behavior: current `.text-hero/.text-h1/.text-h2/.text-h3/.text-h4` do not set `font-family`.
2. Implement plugin-level fix in `packages/theme-system/src/tailwind-plugin.ts`:
   - Add `fontFamily: "var(--font-family-heading)"` to heading utilities (`text-hero`, `text-h1`..`text-h4`).
   - Keep `text-body/text-small/text-caption` on sans (explicit or inherited from body).
3. Do not require component-level `font-heading` additions everywhere; this creates drift and misses cases.

Verification gate:

- Build and type-check theme system (same commands as phase 2).
- Spot-check `heading-hero`/`heading-section` in theme CSS still render as expected.

## 4. Update named theme defaults and globals (themes package)

1. Add values for new tokens in:
   - `packages/themes/vega/index.ts`
   - `packages/themes/orion/index.ts`
2. Refactor hardcoded colors in:
   - `packages/themes/vega/globals.css`
   - `packages/themes/orion/globals.css`
     Replacements:
   - `text-white` on brand buttons/chips -> `text-on-brand-primary`
   - `bg-white`/`bg-gray-*`/`border-gray-*` -> surface token utilities
   - `bg-black`/`bg-gray-900` dark blocks -> `bg-surface-dark`
   - `text-gray-900/800/700/600` -> `text-surface-*`
3. Keep existing utility class names (`.btn-primary`, `.heading-section`, etc.) so call sites stay stable.

Verification gate:

- `pnpm --filter @platform/themes/vega type-check` and `pnpm --filter @platform/themes/orion type-check` (or root `pnpm type-check`).
- `pnpm build` from repo root to ensure plugin + globals integration is intact before component migration.

## 5. High-impact component migration first (targeted pass)

1. Migrate highest-visibility components first:
   - `packages/core-components/src/components/ui/site-header.tsx`
   - `packages/core-components/src/components/ui/mobile-menu.tsx`
   - `packages/core-components/src/components/ui/locations-dropdown.tsx`
   - `packages/core-components/src/components/ui/service-hero.tsx`
   - `packages/core-components/src/components/ui/content-card.tsx`
   - `packages/core-components/src/components/ui/hero-section.tsx`
   - `packages/core-components/src/components/ui/cta-section.tsx`
   - `packages/core-components/src/components/ui/pricing-packages.tsx`
2. Replace hardcoded grays/white/black with tokens using the phase-1 mapping.
3. Preserve component behavior and variants; no runtime theme logic, no client-side theme switching.

Verification gate:

- `pnpm lint`
- `pnpm type-check`
- `pnpm build`
- Manual smoke in package consumers (base-template + dj-fox) without editing site files.

## 6. Full core-components sweep (semi-automated + manual QA)

1. Use scripted replace for deterministic patterns, then manual review.
   - Scriptable examples: `text-gray-900`, `border-gray-200`, `bg-gray-100`.
   - Manual decisions for context-sensitive cases: `bg-white` (background vs card), `text-white` (brand-on-primary vs dark-surface text).
2. Sweep all remaining files in `packages/core-components/src/components/ui/`.
3. Keep `*.example.tsx` aligned if they are part of docs/examples.

Verification gate:

- Hardcoded class count reduced to zero for banned neutral classes in `core-components` (allowlist exceptions for opacity utilities like `bg-black/60` only if intentionally kept for overlays).
- `pnpm lint && pnpm type-check && pnpm build`.

## 7. Enforcement and regression guard

1. Add enforcement after migration is mostly complete (not before), to avoid blocking incremental refactors.
2. Preferred approach: custom ESLint rule (or lightweight repository script run in CI) forbidding hardcoded neutral color utilities in:
   - `packages/core-components/src/components/ui/**`
   - `packages/themes/*/globals.css`
3. Allowlist explicit exceptions:
   - Opacity overlays (`bg-black/..`, `text-white/..`) where tokenization is not yet expressible.
   - Third-party classnames if any.
4. Make enforcement initially warning-only for one PR cycle, then error-level.

Verification gate:

- Lint/report shows zero disallowed classes for migrated scope.
- CI fails on new violations after rule becomes error-level.

## 8. Rollout/commit strategy

1. Use separate commits (single PR is fine) for clean bisectability:
   - Commit A: token model + plugin + tests
   - Commit B: typography utility fix
   - Commit C: theme globals cleanup
   - Commit D: high-impact components
   - Commit E: full sweep
   - Commit F: enforcement rule
2. Keep each commit build-green (`pnpm type-check && pnpm build`) before proceeding.
3. Do not modify `sites/*` files until package-level migration is validated.

## 9. Risks and trade-offs

1. Token naming drift risk.
   - Mitigation: keep existing token names unchanged; add aliases for already-used mismatched classes (`text-brand-on-primary`, `border-surface-border`, `text-surface-muted`).
2. Semantic mismatch risk (`bg-white` can mean page background or card).
   - Mitigation: manual review for contextual replacements in high-impact components first.
3. Typography regression risk if headings change globally.
   - Mitigation: isolate change to heading utilities only and verify `heading-*` theme helpers in both vega/orion.
4. Migration scale risk (56 files).
   - Mitigation: two-pass strategy (targeted + full sweep), measurable count reduction, and phased verification gates.
5. Build stability risk in monorepo.
   - Mitigation: package-local tests first, then root `pnpm build` after each phase.

## 10. Completion criteria

1. Theme-system exposes all required token utilities and schemas.
2. Vega/Orion globals use token utilities instead of hardcoded neutral colors.
3. Core components no longer rely on hardcoded neutral Tailwind colors for themeable surfaces/text/borders.
4. Heading utilities correctly apply heading font family without requiring `font-heading` at call sites.
5. Lint/guard prevents reintroduction of hardcoded colors.
6. Root `pnpm lint`, `pnpm type-check`, and `pnpm build` all pass.
