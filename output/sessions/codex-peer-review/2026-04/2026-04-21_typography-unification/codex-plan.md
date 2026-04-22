I’ll draft the peer-review implementation plan and save it to the requested `codex-plan.md` path, then provide the exact synth command.Preparing and writing `codex-plan.md` now.

I’m unable to directly write files in your workspace from here.

Please copy the following into:

`output/sessions/codex-peer-review/2026-04/2026-04-21_typography-unification/codex-plan.md`

```md
# Codex Peer Review Plan — Typography Unification (2026-04-21)

## 0) Scope framing and assumptions to validate first

1. **Branch discipline:** start from `develop`; no commits to `staging`/`main`.
2. **Out-of-scope reconfirmation:** no theme-token edits in `packages/theme-system`; no redesign beyond restoring canonical headings and setting body to 16px.
3. **Important scope gap:** brief asks for “all composable components” and “every utility class referenced by shared components defined in both sites.” That implies we should audit **both `composable/` and existing `ui/` usage** to prevent undefined utility classes in sites.
4. **Contract sensitivity:** new class names referenced from composables must pass `pnpm validate:theme-contract` (explicitly run even though not listed in acceptance criteria).
5. **Live-site risk:** ensure rollout is reversible by phase (globals restore vs. large class migration separated in commits).

---

## 1) Define canonical utility-class vocabulary (before touching components)

### Objective

Establish one semantic typography vocabulary that can express all heading/body/caption/eyebrow usage currently done with inline `text-*` in composables.

### Files to modify

- `sites/dj-fox-electrical/app/globals.css`
- `sites/colossus-scaffolding/app/globals.css`

### Proposed vocabulary

Reuse existing classes and add only what composable audit requires:

- Existing (keep):  
  `heading-hero`, `heading-section`, `heading-subsection`, `heading-card`, `heading-card-sm`, `stat-number`, `text-subtitle`, `text-body-lg`
- New (expected minimum):  
  `text-body` (default paragraph, **16px**)  
  `text-body-sm` (secondary/supporting copy)  
  `text-caption` (micro/caption/disclaimer)  
  `text-eyebrow` (uppercase/tracked small label)  
  `text-label` (small semibold labels like trust badge/title-like microcopy)  
  _(final set confirmed by scripted audit in step 2)_

### Canonical sizing targets

- Restore heading scales to pre-2026-04-20 canonical.
- Body text baseline: 16px (`text-body`), even where old canonical was 14px.
- Hero subheading:
  - standard branch: 16px
  - image-bleed branch: 20px

### Verification gate

- Both site `globals.css` define **identical class names** (values can be same now; divergence later is per-site).
- No `theme()` usage in CSS.
- Temporary grep check to ensure definitions exist in both files for all class names:
  - `rg "^\s*\.heading-|^\s*\.text-|^\s*\.stat-number" sites/*/app/globals.css`

---

## 2) Scripted audit to map all inline typography classes safely

### Objective

Avoid risky bulk replacement by class string; distinguish typography size classes vs color/alignment/other `text-*`.

### Audit method (repeatable)

1. Extract all `className`/`cn()` tokens from composables:
   - `rg -n "text-[^\"'`\s)]+" packages/core-components/src/components/composable`
2. Classify tokens into:
   - **Typography size/leading/tracking/weight stacks** to migrate to semantic classes.
   - **Non-typography keep-inline**: color (`text-white`, `text-surface-foreground`, etc.), alignment (`text-center/right/left`), wrapping/overflow modifiers.
3. Build a mapping table:  
   `file:line`, `data-slot` (if present), current class stack, target semantic class.
4. Run same audit across `packages/core-components/src/components/ui` to detect utility classes already referenced there; ensure both site globals define them (acceptance criterion #3).
5. Produce a one-time checklist artifact in PR description (not necessarily committed) to prove 100% coverage of typography-size occurrences.

### Verification gate

- Every migratable composable `text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)` occurrence is mapped.
- Explicit allowlist of inline `text-*` that remain (colors/alignment/etc.) to prevent false positives.

---

## 3) Phase 1 implementation — restore and normalize site utility definitions

### Objective

Fix canonical scale centrally first so existing utility-based UI components and MDX typography are correct immediately.

### Files to modify

- `sites/dj-fox-electrical/app/globals.css`
- `sites/colossus-scaffolding/app/globals.css`

### Changes

1. Restore existing utility classes to canonical pre-downscale values (headings/stat/subtitle/body-lg).
2. Add new utility classes from step 1 (`text-body`, `text-body-sm`, `text-caption`, `text-eyebrow`, `text-label`, etc.) in `@layer components`.
3. Keep naming stable and semantic (no component-specific utility names).

### Verification gate

- Local build per site:
  - `pnpm --filter dj-fox-electrical build`
  - `pnpm --filter colossus-scaffolding build`
- Quick manual smoke in dev for both homepages: confirm utility-rendered text is no longer globally downscaled.
- If this phase alone causes regressions, can revert safely without touching shared components.

---

## 4) Phase 2 implementation — migrate composables from inline text sizes to semantic utility classes

### Objective

Enforce “shared library ships canonical semantic typography; site globals own actual scale.”

### Files to modify

- `packages/core-components/src/components/composable/*.tsx` (all affected files)

### Migration rules

1. Replace inline size stacks for headings/body/caption/eyebrow with utility classes.
   - Example:
     - `text-4xl md:text-5xl lg:text-6xl` → `heading-hero`
     - `text-base leading-relaxed` → `text-body` (+ keep `leading-relaxed` only if not already embedded in utility definition strategy)
2. Preserve:
   - `data-slot` attributes exactly (non-negotiable selector hook).
   - Non-typography classes (`text-white`, `text-center`, layout/spacing/display).
3. Prefer **single semantic class + structural classes** over mixed semantic+size.
4. Normalize repeated patterns:
   - Eyebrow stacks (`text-sm font-semibold uppercase tracking-widest`) → `text-eyebrow`
   - Small titles/labels (`text-sm font-semibold`) → `text-label`
   - Paragraph copy too small (`text-xs`/`text-sm`) → `text-body` or `text-body-sm` based on role
   - Disclaimers/microcopy → `text-caption`

### Specific correctness checks called out in brief

- `HeroSection` H1 returns to canonical (60px at lg via utility class).
- `hero-section.tsx` standard subheading = 16px (`text-body` equivalent).
- `WhyChooseUsSection` item body no longer `text-xs`; becomes body-level readable (16px target per goal).

### Verification gate

- `rg` guardrail in composables:
  - No inline typography size tokens remain for copy roles.
  - Practical check: `rg -n "text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)" packages/core-components/src/components/composable`
  - Review remaining hits; only keep justified non-copy or intentionally exempt cases.
- `pnpm type-check`
- `pnpm lint`
- `pnpm validate:theme-contract`

---

## 5) Phase 3 consistency audit — shared components utility usage vs site definitions

### Objective

Prevent undefined utility classes at runtime across both families (`ui` + `composable`).

### Files to inspect/modify

- Inspect:
  - `packages/core-components/src/components/composable/*.tsx`
  - `packages/core-components/src/components/ui/*.tsx`
- Modify if needed:
  - `sites/dj-fox-electrical/app/globals.css`
  - `sites/colossus-scaffolding/app/globals.css`

### Process

1. Extract semantic typography class references from shared components (e.g., `heading-*`, `text-*`, `stat-number`).
2. Diff against classes defined in each site `globals.css`.
3. Add missing definitions (or replace stray class references with approved vocabulary).

### Verification gate

- Zero undefined semantic typography classes used by shared components.
- Site builds succeed again (both filters).

---

## 6) Visual verification and Colossus baseline handling

### Objective

Catch live-site visible regressions not caught by type/lint/build.

### Checks

1. Manual visual QA on both home pages:
   - H1 at lg ≈ 60px
   - body paragraph = 16px
   - hero subheading standard = 16px; image-bleed = 20px
2. Colossus visual tests:
   - Run the visual baseline workflow for `sites/colossus-scaffolding/tests/visual-baseline/`.
   - Expected diffs are intentional due to restored typography scale.
   - Rebaseline in same PR with explicit note: “typography unification canonicalization.”

### Verification gate

- Visual diffs are typography-only (no layout collapse, overflow, clipping).
- Rebaseline committed only after human confirmation of intended changes.

---

## 7) Documentation update (prevent regression by future contributors)

### File to modify

- `docs/standards/styling.md`

### Placement and content

Add a dedicated section, e.g. `## Typography in Shared Components`, covering:

1. **Rule:** shared components (`packages/core-components/src/components/{ui,composable}`) must use semantic typography utility classes, not inline Tailwind text size classes.
2. **Ownership model:** canonical class names in shared components; per-site scaling in each site’s `app/globals.css`.
3. **Approved class list + intended usage** (heading tiers, body tiers, eyebrow/caption/label/stat).
4. **Explicit exceptions:** inline text color/alignment utilities are allowed.
5. **PR checklist snippet:** “If you added/renamed typography utility classes in shared components, define them in every consuming site globals.css.”
6. **Anti-pattern examples:** raw `text-3xl ...` in composables.

### Verification gate

- Doc includes complete vocabulary used after migration.
- Cross-links to `theme-component-contract` constraints.

---

## 8) Commit strategy (incremental, reversible)

1. **Commit A — Globals canonical restore + new vocabulary**
   - Both site `globals.css`
   - Build checks for both sites.
2. **Commit B — Composable migration to semantic classes**
   - `packages/core-components/src/components/composable/*.tsx`
   - `type-check`, `lint`, `validate:theme-contract`, both site builds.
3. **Commit C — Coverage fixes from shared-component class diff**
   - Any missing class definitions and minor mapping corrections.
4. **Commit D — Documentation**
   - `docs/standards/styling.md`
5. **Commit E (if needed) — Colossus visual rebaseline artifacts**

This sequencing allows rollback of B/E independently while retaining A (safe canonical utility restoration).

---

## 9) Rollback plan

- If regressions appear after Phase 2:
  1. Revert **Commit B** only (composable class migration).
  2. Keep **Commit A** (site-level canonical utilities still correct and low-risk).
  3. Re-open migration with narrower batches (e.g., hero + why-choose-us first).
- If visual baseline churn is problematic:
  - Revert only rebaseline commit; keep code changes and regenerate baseline after fixes.

---

## 10) Final verification checklist before merge

1. `pnpm type-check`
2. `pnpm lint`
3. `pnpm validate:theme-contract`
4. `pnpm --filter dj-fox-electrical build`
5. `pnpm --filter colossus-scaffolding build`
6. Manual homepage spot-check on both sites for H1/body/subheading target sizes
7. Colossus visual baseline updated and reviewed
8. Confirm branch is `develop`
9. Confirm no inline typography size classes left in composables except documented exceptions
10. Confirm all referenced semantic typography classes are defined in both site globals
```

/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04/2026-04-21_typography-unification/
