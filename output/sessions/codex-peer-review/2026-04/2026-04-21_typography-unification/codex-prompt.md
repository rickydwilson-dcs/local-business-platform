# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04/2026-04-21_typography-unification/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04/2026-04-21_typography-unification/
```

---

## Brief: Typography unification across composable components and site globals.css

**Date:** 2026-04-21
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan. No clarified `brief.md` was produced for this topic — challenge assumptions accordingly and flag any scope gaps you identify.

---

### Problem Statement

On April 20, commit `1df7365` mechanically scaled every `text-*` Tailwind class one step down across 22 composable components in `packages/core-components/src/components/composable/`, plus the site-level typography utility classes (`.heading-hero`, `.text-body-lg` etc.) in `sites/dj-fox-electrical-test/app/globals.css`. The motivation was a user report that DJ Fox's fonts looked "too big" — which turned out to be browser zoom, not a real platform issue.

On April 21, commit `baecb6e` scaled Colossus's site-level utility classes down another step in the (then) `sites/colossus-scaffolding-test/app/globals.css`, and scaled 6 further composable components down to stay aligned with the already-scaled-down DJ Fox state.

Site renames then shipped the "test" directories to production names (`dj-fox-electrical-test` → `dj-fox-electrical`, `colossus-scaffolding-test` → `colossus-scaffolding`). Both sites are now live on Vercel.

Current symptoms:

- Home-page H1 on both sites: `text-3xl md:text-4xl lg:text-5xl` (48px@lg). Canonical was `text-4xl md:text-5xl lg:text-6xl` (60px@lg).
- Why-choose-us body paragraph (`packages/core-components/src/components/composable/why-choose-us-section.tsx:95`): `text-xs` (12px). Canonical was `text-sm` (14px). Way too small for paragraph copy.
- Hero subheading standard branch (`hero-section.tsx:191`): `text-sm` (14px). Canonical was `text-base` (16px).
- Both sites' globals.css typography utility classes (`.heading-hero`, `.text-body-lg`, etc.) are identically scaled down one step.

### Goals

1. Restore the composable component library to a sensible canonical type scale (headings at pre-April-20 values; body text at 16px — slightly larger than canonical 14px).
2. Establish and enforce a clear convention: **the component library ships one canonical type scale; per-site tuning lives in that site's `app/globals.css`**.
3. Unify typography handling in shared components — today `packages/core-components/src/components/ui/*.tsx` use semantic utility classes (`<h3 className="heading-card">`) but `packages/core-components/src/components/composable/*.tsx` use raw inline Tailwind (`<h1 className="text-3xl md:text-4xl lg:text-5xl ...">`). Migrate composables to match the utility-class pattern so there's one typography system.
4. Document the convention so future contributors don't re-introduce inline text sizes in shared components.

### Non-Goals

- Changing the actual type _scale_ beyond restoring canonical + bumping body to 16px (i.e. not a full re-design of the typography system).
- Altering theme tokens in `packages/theme-system/` (colour/spacing/radius stays as-is).
- Migrating the already-compliant `packages/core-components/src/components/ui/*.tsx` (25+ files already use utility classes correctly).
- Site-specific visual tuning for Colossus or DJ Fox beyond restoring canonical and letting each site's globals.css define its own `@apply` values (any future per-site divergence happens in separate PRs).
- Deploying through staging/main as part of this work — land commits on `develop`, user runs `/deploy.changes` when ready.

### Acceptance Criteria

1. All composable components in `packages/core-components/src/components/composable/` use semantic utility classes (`heading-hero`, `text-body`, etc.) for typography, **never inline `text-<size>` Tailwind classes** for headings/body/caption copy.
2. Both `sites/dj-fox-electrical/app/globals.css` and `sites/colossus-scaffolding/app/globals.css` define the utility classes at canonical sizes (headings restored, body bumped to 16px).
3. Every utility class referenced by shared components is defined in both sites' `globals.css` — no undefined-class breakage.
4. Visual verification: both home pages render at canonical scale (H1 = 60px@lg; body paragraph = 16px; hero subheading = 16px standard / 20px image-bleed).
5. `pnpm type-check` passes at repo root.
6. `pnpm lint` passes at repo root.
7. Each site's build passes: `pnpm --filter dj-fox-electrical build`, `pnpm --filter colossus-scaffolding build`.
8. `docs/standards/styling.md` has a typography section documenting the convention with the list of available utility classes and their intended use.
9. All commits land on the `develop` branch (NEVER staging or main).

### Constraints

**Architectural (non-negotiable):**

- `packages/core-components` is raw TypeScript source — no build step. Sites resolve imports via tsconfig path mapping.
- Composable components follow the Theme Component Contract (`docs/standards/theme-component-contract.md`) — validated in CI (`pnpm validate:theme-contract`). Any new utility class names MUST be safe against that contract.
- Site `globals.css` files use Tailwind's `@apply` directive inside `@layer components` (check current file structure).
- NEVER use Tailwind `theme()` function in plain CSS — causes parser panics (per CLAUDE.md).
- Tailwind content globs: `packages/themes/*/*.{ext}` and scoped subpaths only — `**` descends into node_modules.

**Workflow (non-negotiable, per CLAUDE.md):**

- Start on `develop`, never push directly to staging/main.
- Pre-push hook runs type-check.
- Every env var affecting build must be in `turbo.json` env array (irrelevant here but worth mentioning).

**Risk surface:**

- Both sites (DJ Fox, Colossus) are LIVE on Vercel. Visual regressions will be user-visible.
- Colossus has a visual-parity gate at `sites/colossus-scaffolding/tests/visual-baseline/` — screenshots will not match pre-change baseline; re-baseline expected.
- Over-aggressive classname replacement could break non-typography classes (colour modifiers like `text-white`, layout classes like `text-center`, `text-right`) — those must be left inline.
- Composable components use rich `data-slot="..."` vocabulary (eyebrow, heading, subheading, stat, body, etc.) — preserve these attributes; they're the per-site selector hook for CSS overrides that target composable internals.

### Relevant Architecture

**Two shared-component families:**

1. `packages/core-components/src/components/ui/*.tsx` — 25+ files, older style, **already use semantic utility classes** (`heading-card`, `text-body-lg`, `text-subtitle`). These are the reference for how the utility-class pattern should look.

2. `packages/core-components/src/components/composable/*.tsx` — 29 files, newer, used by composition-engine-driven sites (DJ Fox, Colossus). These currently embed raw Tailwind `text-*` classes inline. This is the outlier set that needs migrating.

**Site consumption:**

- `sites/dj-fox-electrical/` uses composition.json + composable components for every page.
- `sites/colossus-scaffolding/` uses both composable components (home page `HeroSection` etc. via `app/page.tsx`) and MDX-rendered content (which uses utility classes like `.heading-hero`).
- Both sites currently have identical scaled-down utility-class definitions in `globals.css` (lines ~278–308 for DJ Fox, ~142–172 for Colossus).

**Existing utility-class vocabulary** (defined in each site's globals.css today):

- `heading-hero`, `heading-section`, `heading-subsection`, `heading-card`, `heading-card-sm`
- `stat-number`, `text-subtitle`, `text-body-lg`

**New utility classes likely needed for composable migration** (not yet defined anywhere):

- Body paragraph at base size
- Caption/micro-copy (for badges, breadcrumbs, disclaimers — currently `text-xs`)
- Eyebrow text (the `text-sm font-semibold uppercase tracking-widest` stack that appears repeatedly)
- Body-small (between body and caption, e.g. testimonial attribution text)

**Canonical pre-April-20 sizes** (verified against `git show 1df7365^:...`):

| Class / location                       | Canonical                          |
| -------------------------------------- | ---------------------------------- |
| `HeroSection` H1 (image-bleed branch)  | `text-4xl md:text-5xl lg:text-6xl` |
| `HeroSection` H1 (standard branch)     | `text-4xl sm:text-5xl lg:text-6xl` |
| `HeroSection` subheading (image-bleed) | `text-xl leading-relaxed`          |
| `HeroSection` subheading (standard)    | `text-base leading-relaxed`        |
| `HeroSection` trust badge              | `text-sm`                          |
| `HeroSection` breadcrumb               | `text-sm`                          |
| `WhyChooseUsSection` item body         | `text-sm`                          |
| `WhyChooseUsSection` item title        | `text-sm font-semibold`            |

**Occurrence counts in composable files:**

```
76 × text-xs
35 × text-xl
24 × text-base
18 × text-lg
17 × text-2xl
 8 × text-sm
 7 × text-3xl
 2 × text-5xl
 2 × text-4xl
```

Total 189 `text-*` occurrences across 29 files that may need mapping to utility classes (not all — some are colour classes `text-white`, `text-surface-foreground`, or layout `text-center`).

### Codebase Snapshot

| Path                                                       | Purpose                                                                       |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `packages/core-components/src/components/composable/*.tsx` | 29 composition-driven components using inline Tailwind text classes           |
| `packages/core-components/src/components/ui/*.tsx`         | 25+ older components already using utility classes (reference implementation) |
| `packages/core-components/CLAUDE.md`                       | Package-level architecture doc                                                |
| `packages/theme-system/src/`                               | Theme tokens + Tailwind plugin                                                |
| `sites/dj-fox-electrical/app/globals.css`                  | Site CSS — typography utility classes at lines 274–308                        |
| `sites/colossus-scaffolding/app/globals.css`               | Site CSS — typography utility classes at lines 138–172                        |
| `sites/dj-fox-electrical/composition.json`                 | Composition schema driving DJ Fox's pages                                     |
| `sites/colossus-scaffolding/app/page.tsx`                  | Colossus home page — uses `HeroSection` from core-components directly         |
| `docs/standards/styling.md`                                | Current styling docs (needs typography section added)                         |
| `docs/standards/theme-component-contract.md`               | Validated in CI — constrains what classnames composables can reference        |

### What a Good Plan Should Cover

1. **Utility-class vocabulary**: what is the complete set of semantic classes needed to cover all typography in composable components? Reuse existing ones where possible; name new ones consistently with the existing ones. Address the open set: eyebrow, caption, body, body-small, and anything else the composable audit reveals.

2. **Audit strategy**: how do we confidently identify which of the 189 `text-*` occurrences need replacing vs. which should stay inline (colour classes, layout classes, size classes on non-typography elements like icon containers)? Concrete scripted approach, not "look through each file."

3. **Migration order**: Phase 1 (site globals.css restore) and Phase 2 (composable inline restore) vs. Phase 3 (utility-class migration) — what's the right sequencing? Can we do the migration in one pass or should it be incremental? What's the verification gate between phases?

4. **Risk mitigation for live sites**: what can go wrong (`@apply`-undefined class, classname collision, theme contract violation, missed occurrence, visual regression not caught by type-check)? How do we catch each before users see it?

5. **Visual parity with Colossus**: Colossus has a visual-baseline gate. We WILL diverge from its current baseline — how do we handle that? Accept-and-rebaseline? Block on specific pages?

6. **Theme contract implications**: will any new utility class names we introduce be rejected by `pnpm validate:theme-contract`? What's the safe-naming convention?

7. **Rollback plan**: if Phase 3 (the big migration) introduces a visual regression that isn't caught by automated checks, what's the cheapest way to revert just that phase while keeping Phase 1+2?

8. **Documentation placement**: where exactly in `docs/standards/styling.md` should the typography convention live? What's the minimum doc that prevents future contributors from re-introducing inline `text-*` classes?

9. **Commit strategy**: how many commits, what are they, in what order, with what verification in between? (Remember: pre-push runs type-check only; full build is in CI.)

10. **Non-composable affected files**: during the audit, watch for utility classes used in `packages/core-components/src/components/ui/*.tsx` that we don't currently define in sites (e.g. something old still referencing a class that's been dropped). Does the audit need to cover those too?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04/2026-04-21_typography-unification/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04/2026-04-21_typography-unification/`
