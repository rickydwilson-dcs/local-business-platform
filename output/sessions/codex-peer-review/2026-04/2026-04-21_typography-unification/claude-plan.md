# Claude's Plan: Typography Unification

**Date:** 2026-04-21
**Author:** Claude (independent plan — written before seeing Codex output)

## Summary

Restore the composable component library to canonical sizes (with body bumped to 16px), then migrate composable components to use the same semantic utility classes already established in `ui/*` components. Two live sites (DJ Fox, Colossus) will visually change; both currently look wrong (H1 48px@lg vs canonical 60px; body 12px vs canonical 14–16px). End-state: one typography system across all shared components, one per-site override point (each site's `globals.css`).

## Target canonical scale (user-decided)

| Class                | Value                                             | Rendered (lg)                   |
| -------------------- | ------------------------------------------------- | ------------------------------- |
| `heading-hero`       | `text-4xl md:text-5xl lg:text-6xl font-bold`      | 60px                            |
| `heading-section`    | `text-2xl sm:text-3xl md:text-4xl font-bold`      | 36px @ md                       |
| `heading-subsection` | `text-3xl font-bold`                              | 30px                            |
| `heading-card`       | `text-xl sm:text-2xl font-bold`                   | 24px @ sm                       |
| `heading-card-sm`    | `text-lg font-bold`                               | 18px                            |
| `stat-number`        | `text-4xl font-extrabold tracking-tight`          | 36px                            |
| `text-subtitle`      | `text-lg sm:text-xl`                              | 20px @ sm                       |
| `text-body-lg`       | `text-lg leading-relaxed`                         | 18px                            |
| `text-body` (NEW)    | `text-base leading-relaxed`                       | 16px — **the new default body** |
| `text-body-sm` (NEW) | `text-sm leading-relaxed`                         | 14px                            |
| `text-caption` (NEW) | `text-xs`                                         | 12px                            |
| `text-eyebrow` (NEW) | `text-sm font-semibold uppercase tracking-widest` | 14px                            |

Rationale: the user explicitly asked for "body up to 16px" — so the new `text-body` class is the primary default. Existing `text-body-lg` is kept for emphasis (hero lede copy). `text-caption` and `text-eyebrow` emerge from composable-audit patterns.

## Phase 1 — Restore site globals.css + add new utility classes

**Files:**

- `sites/dj-fox-electrical/app/globals.css`
- `sites/colossus-scaffolding/app/globals.css`

**Changes:**

- Restore the 8 existing utility classes to canonical values (table above).
- Add 4 new classes: `text-body`, `text-body-sm`, `text-caption`, `text-eyebrow`.
- Keep site-specific colour tokens in the utilities (`text-surface-foreground` etc.) — these stay the way they are.

**Verification gate:**

- `pnpm --filter dj-fox-electrical dev` — spot-check MDX pages (which use `.heading-hero` etc.) at canonical sizes.
- Same for Colossus.
- `pnpm --filter dj-fox-electrical build` + `pnpm --filter colossus-scaffolding build` — clean builds.
- `pnpm lint` at repo root.

**Commit:** `fix(typography): restore site globals to canonical scale; add body/caption/eyebrow utilities`

## Phase 2 — Restore composable components' inline text-\* classes to canonical

Rather than jumping straight to utility-class migration, first reverse the April 20 + 21 scale-down in-place. This keeps the change mechanical and low-risk.

**Files (29):**
All `packages/core-components/src/components/composable/*.tsx` — specifically the font-size hunks from commits `1df7365` and `baecb6e`.

**Approach:**

- Apply inverse patches of the font-size hunks from `1df7365` and `baecb6e`.
- Additionally, bump body-paragraph occurrences (the ones semantically used as _body text_, not captions) from `text-sm` to `text-base` to match the 16px body default.
- The specific "what's body text vs caption" decision is made during Phase 2 — but using a conservative rule: paragraph elements inside grid/card items get `text-base`; metadata (dates, reading times, star-rating counts) stays at `text-sm`; badges/micro-labels stay at `text-xs`.

**Verification gate:**

- Start both dev servers on different ports.
- Navigate home page, services/[slug], locations/[slug], blog/[slug], about, contact on each site.
- Visually confirm H1 = 60px@lg, body paragraph in why-choose-us = 16px, hero subheading = 16px (standard) / 20px (image-bleed).
- Re-capture Colossus visual-parity baseline (`sites/colossus-scaffolding/tests/visual-baseline/`) — current baseline is from the scaled-down state and will fail.
- `pnpm type-check`, `pnpm lint`, both sites' `build`.

**Commit:** `fix(typography): restore composable components to canonical inline sizes; bump body paragraphs to 16px`

**Why this phase exists separately:** if Phase 3 (utility-class migration) hits an unforeseen issue, Phase 2 alone is sufficient to ship — the sites look right even if the architectural unification is deferred. This is cheap insurance.

## Phase 3 — Migrate composables to semantic utility classes

Replace inline `text-<size>` class stacks in composable components with the semantic utility classes from Phase 1.

**Audit script (build once, run repeatedly during migration):**

```bash
# Find all text-* class references in composable files, excluding colour and layout classes
rg '\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\b' \
  packages/core-components/src/components/composable/ \
  --type=tsx -n
```

**Mapping convention:**

| Inline pattern in source                                                         | Replace with utility class                                                                 |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `text-4xl md:text-5xl lg:text-6xl font-bold` (H1)                                | `heading-hero`                                                                             |
| `text-4xl sm:text-5xl lg:text-6xl font-bold` (H1 alt)                            | `heading-hero` (note: different breakpoint prefix, but semantically the same slot — unify) |
| `text-2xl md:text-3xl font-bold` / `text-3xl md:text-4xl font-bold` (section H2) | `heading-section`                                                                          |
| `text-3xl font-bold` (subsection)                                                | `heading-subsection`                                                                       |
| `text-xl sm:text-2xl font-bold` / `text-2xl font-bold` (card title)              | `heading-card`                                                                             |
| `text-lg font-bold` (small card title)                                           | `heading-card-sm`                                                                          |
| `text-4xl font-extrabold` (stat number)                                          | `stat-number`                                                                              |
| `text-xl leading-relaxed` (large subtitle / hero lede)                           | `text-subtitle`                                                                            |
| `text-lg leading-relaxed` / `text-lg` (large body)                               | `text-body-lg`                                                                             |
| `text-base leading-relaxed` / `text-base` (body paragraph)                       | `text-body`                                                                                |
| `text-sm` (metadata, dates, caption paragraph)                                   | `text-body-sm`                                                                             |
| `text-xs` (badges, breadcrumbs, disclaimers)                                     | `text-caption`                                                                             |
| `text-sm font-semibold uppercase tracking-widest` (eyebrow)                      | `text-eyebrow`                                                                             |

**Rule:** the utility class replaces ONLY the font-size + font-weight + text-transform portion. Colour classes (`text-white`, `text-surface-muted-foreground`, `text-brand-primary`), alignment (`text-center`, `text-right`), and utility modifiers (`mb-6`, `max-w-*`) stay on the element.

**Example transformation:**

```tsx
// Before (hero-section.tsx:97-102)
<h1
  data-slot="heading"
  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white"
>

// After
<h1
  data-slot="heading"
  className="heading-hero tracking-tight mb-6 text-white"
>
```

Note `tracking-tight` stays — the `heading-hero` utility is deliberately _not_ opinionated about letter-spacing, so sites can choose. (Canonical `.heading-hero` in globals.css has no tracking modifier; sites add it inline if wanted.)

**Execution strategy:**

- Group files by functional area to keep commits reviewable:
  1. Heroes: `hero-section.tsx` (composable)
  2. Content blocks: `content-section.tsx`, `text-section.tsx`, `why-choose-us-section.tsx`, `cta-section.tsx`, `emergency-banner.tsx`, `faq-section.tsx`, `faq-item.tsx`, `faq-item.client.tsx`
  3. Grids & cards: `service-cards.tsx`, `feature-grid.tsx`, `testimonial-grid.tsx`, `service-list-section.tsx`, `blog-grid.tsx`, `project-grid.tsx`, `category-cards-section.tsx`, `image-grid-section.tsx`
  4. Stats & pricing: `stats-strip.tsx`, `pricing-table.tsx`, `pricing-packages-section.tsx`, `rate-cards-section.tsx`
  5. Location/coverage: `location-pills-section.tsx`, `coverage-map-section.tsx`, `coverage-map-section.client.tsx`, `town-finder-section.tsx`, `town-finder-section.client.tsx`, `county-gateway-cards.tsx`, `local-authority-expertise.tsx`
  6. Contact: `contact-section.tsx`
- After each group, visual spot-check both sites.

**Verification after each group:**

- `pnpm type-check`
- `pnpm lint`
- Dev-server visual check on the affected section(s)

**Final verification (end of Phase 3):**

- `rg '\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b' packages/core-components/src/components/composable/ | grep -v 'text-center\|text-right\|text-left\|text-white\|text-black\|text-brand\|text-surface\|text-on-'` — should be **empty** (all remaining `text-*` matches should be colour/layout).
- Run `pnpm validate:theme-contract` if applicable.
- Both sites' `build` + `test:e2e:smoke`.
- Full visual sweep: home, all listing pages, at least one detail page per content type, contact form page.

**Commits:** 6 commits, one per group (e.g. `refactor(composable): migrate heroes to semantic typography utilities`).

## Phase 4 — Documentation

**File:** `docs/standards/styling.md`

Add a new section (near existing styling content — position after theme-token section if one exists, else near the top):

```markdown
## Typography

Shared components in `packages/core-components/` use **semantic utility classes**
for typography — never inline `text-<size>` Tailwind classes.

The classes are defined once per site in `app/globals.css`. This gives each site
a single place to tune its font sizes without touching shared components.

### Available classes

| Class                | Semantic meaning                             |
| -------------------- | -------------------------------------------- |
| `heading-hero`       | Page H1                                      |
| `heading-section`    | Section H2                                   |
| `heading-subsection` | Subsection H2/H3                             |
| `heading-card`       | Card/item title                              |
| `heading-card-sm`    | Small card title                             |
| `stat-number`        | Large stat/metric number                     |
| `text-subtitle`      | Hero/section lede paragraph                  |
| `text-body-lg`       | Large body text (lede for non-hero contexts) |
| `text-body`          | Default body paragraph (16px canonical)      |
| `text-body-sm`       | Metadata, dates, secondary copy              |
| `text-caption`       | Badges, breadcrumbs, micro-copy              |
| `text-eyebrow`       | Uppercase section labels above headings      |

### Rules

- **NEVER** put `text-<size>` Tailwind classes on heading or body elements inside shared components. Use the semantic utility class.
- **Per-site font tuning** lives in that site's `globals.css` — change the `@apply` line for the utility class.
- **NEVER** edit shared component source to change font sizing for a specific site.
- Colour classes (`text-white`, `text-surface-foreground`), alignment (`text-center`), and layout modifiers (`mb-4`, `max-w-*`) DO stay inline on elements — utility classes only cover font-size + font-weight + text-transform.
```

**Commit:** `docs(styling): document typography convention`

## Risks & trade-offs

1. **Visual regression slips past type-check.** Type-check only catches TS errors, not missing Tailwind classes. Mitigation: at end of each phase, run dev-server visual spot-check before commit. Alternative: add a Playwright visual test covering the home-page hero on both sites as part of Phase 3. Not doing this adds risk; doing it adds 30 min of test-writing.

2. **Colossus visual-parity gate fails.** The existing baseline is from the scaled-down state. After Phase 2, re-capture the baseline (noted in verification gate). Accept that the gate will fail until re-baselined.

3. **Theme contract rejection.** `docs/standards/theme-component-contract.md` constrains class names. Before introducing `text-body`, `text-body-sm`, `text-caption`, `text-eyebrow`, verify they're allowed or add them to the contract. Mitigation: grep the contract file first, add new entries if needed as part of Phase 1.

4. **Missed `text-*` occurrences during migration.** 189 occurrences is a lot; easy to miss one. Mitigation: the final grep check (empty result should be the success signal).

5. **Classname collision with existing Tailwind utilities.** `text-body` is not a Tailwind default class, but confirm before adopting. Running `@apply text-body` where `text-body` resolves to a Tailwind utility would cause silent wrong-rendering. Mitigation: test-build each site after Phase 1 additions.

6. **Storybook / visual-test tooling invisibility.** If any visual test asserts on class names (e.g. `expect(h1).toHaveClass('text-4xl')`), migration will break it. Mitigation: grep tests directory for literal class-name assertions before migrating.

7. **Over-aggressive replacement of non-typography `text-*`.** Classes like `text-center`, `text-right`, `text-white` must not be touched. The audit grep (above) explicitly excludes colour/layout patterns. During migration, when in doubt, leave the class alone — inline layout/colour classes are NOT the target of this refactor.

8. **`tracking-tight` and similar letter-spacing modifiers.** Several composables use `tracking-tight` with their text-size classes. Decision: leave `tracking-*` inline (it's layout, not font-size). `.heading-hero` etc. don't mandate tracking; callers choose.

## Commit count & ordering

1. `fix(typography): restore site globals to canonical; add body/eyebrow/caption utilities` — Phase 1
2. `fix(typography): restore composable components to canonical inline sizes` — Phase 2
3. `refactor(composable): migrate hero typography to semantic utilities` — Phase 3 group 1
4. `refactor(composable): migrate content blocks to semantic utilities` — group 2
5. `refactor(composable): migrate grids and cards to semantic utilities` — group 3
6. `refactor(composable): migrate stats and pricing to semantic utilities` — group 4
7. `refactor(composable): migrate location/coverage to semantic utilities` — group 5
8. `refactor(composable): migrate contact section to semantic utilities` — group 6
9. `docs(styling): document typography convention` — Phase 4

9 commits total. All land on `develop`. User runs `/deploy.changes` when ready.

## Non-composable audit (Goal 10 from brief)

During migration, watch for `ui/*.tsx` components referencing utility classes NOT defined in sites' globals.css. Quick check:

```bash
# List utility classes used in ui/*
rg -oh '\b(heading-\S+|text-subtitle|text-body\S*|text-caption|text-eyebrow|stat-\S+)\b' \
  packages/core-components/src/components/ui/ | sort -u

# List utility classes defined in each site
rg '^\s*\.(heading-\S+|text-subtitle|text-body\S*|text-caption|text-eyebrow|stat-\S+)' \
  sites/dj-fox-electrical/app/globals.css sites/colossus-scaffolding/app/globals.css
```

Any classes in the first list missing from the second list are silently-undefined — they render as no-ops today and need adding. Report findings in Phase 1 commit if any.

## End state

- 29 composable components use only semantic typography utilities.
- Both sites define 12 typography classes in `globals.css` at canonical sizes.
- `docs/standards/styling.md` documents the convention.
- Visual state: home-page H1 60px@lg, body 16px, hero subheading 16/20px.
- Changing any site's typography is one `@apply`-line edit in that site's globals.css. Zero shared-component edits.
