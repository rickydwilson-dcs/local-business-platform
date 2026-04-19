# YOLO Implementation Brief: Composable Components Design Upgrade

**Branch:** feature/composable-components-redesign (created from develop)
**Session spec:** output/sessions/2026-04/2026-04-19_composable-components-redesign/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The composable sections in `@platform/core-components` (used by every composition site — dj-fox-electrical-test, poc-composition-test, future sites) exhibit a cluster of generic "AI-default" design patterns: three-equal-column card grids everywhere, uniform `rounded-xl` cards with `hover:shadow-md` only, undersized stats, no active-press feedback, symmetrical centered layouts, and no depth/layering.

A `/redesign-existing-projects` audit identified 13 high-confidence issues. This brief applies targeted upgrades to the shared composable components and the Orion theme globals so all composition sites benefit, while preserving the theme token contract (no hardcoded colors). Scope is deliberately tight: no component rewrites, no new prop surfaces, no schema changes.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Design Principles (apply to every phase)

These are the operating rules that constrain every change. Before editing any file, re-read this section.

1. **Token-only styling.** Never hardcode hex values. Use `bg-brand-primary`, `text-surface-foreground`, `bg-surface-card`, `border-surface-card-border`, `text-surface-muted-foreground`, `text-brand-primary`, etc. New utilities go in the Orion theme globals (`packages/themes/orion/globals.css`) or the site globals (`sites/dj-fox-electrical-test/app/globals.css`) — never inline hex.
2. **No prop/schema changes.** Every `Props` interface, `slots` object, `data` shape, and layout parameter stays identical. Changes are visual only — class lists, internal markup tweaks, and theme CSS additions.
3. **No new files unless explicitly listed.** Edit existing files. Do not create new components, new slot types, or new registries.
4. **Active/press feedback via `active:` variants.** All buttons and interactive `<a>` elements get `active:scale-[0.98]` plus `transition-transform duration-150 ease-out`. Never animate `top/left/width/height` — use `transform` and `opacity` only.
5. **Spring-feel transitions.** Replace default `transition-colors` durations with `transition-all duration-200 ease-out`, except where the class is hover-color-only on a non-motion element (then keep `transition-colors`).
6. **Focus-visible rings.** Every interactive element gets `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background` (or `ring-offset-surface-inverse` on dark sections).
7. **Asymmetric layouts.** Where a section currently uses `text-center` by default, introduce a deliberate left-biased heading + right-biased supporting element where it makes semantic sense. Never break the `align` layout parameter — respect `isCenter`/`isSplit` when the caller specifies it.
8. **Don't delete features.** Every existing slot, variant, and layout branch must still render. This is upgrade-in-place, not rewrite.
9. **React Server Components.** These composable sections are RSCs. Do not add `useState`, `useEffect`, `"use client"`, or event handlers (`onClick`, `onMouseEnter`). All motion/hover/focus is CSS-only.
10. **No emojis in code output.** Do not add emoji characters to source files.

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/composable-components-redesign
pnpm type-check   # must be clean before starting
```

If `type-check` fails on develop, STOP and report — do not start the work.

---

## Phase 1 — Theme globals: add shared utilities

**Goal:** Add shared CSS utilities to the Orion theme and the DJ Fox site globals so later phases can reference them consistently (colored shadows, grain on light surfaces, spring easing variable, focus-ring helper).
**Model:** sonnet — small number of files but the CSS must be correct the first time.

### Files to edit

1. `packages/themes/orion/globals.css` — add:
   - A colored-shadow utility `.shadow-brand` using `color-mix(in srgb, var(--color-brand-primary) 20%, transparent)` as the shadow color, with an elevated variant `.shadow-brand-lg`. These must not use hardcoded rgb/hex.
   - A subtle light-surface grain utility `.grain-light` (mirrors `.noise-overlay` pattern but at 0.02 opacity) for use on `bg-surface-background` and `bg-surface-subtle` sections.
   - A card lift utility `.card-lift` that composes `transition: transform 200ms ease-out, box-shadow 200ms ease-out` with hover `transform: translateY(-2px)` and hover `box-shadow` using the brand-tinted shadow. Must not use `@apply` with `hover:` pseudo — write the hover state as standard CSS.
   - A `.press` utility with `active:scale-[0.98]` equivalent as standard CSS (`transition: transform 150ms ease-out; &:active { transform: scale(0.98) }`) for Server Component use where Tailwind arbitrary variants feel fragile.
2. `sites/dj-fox-electrical-test/app/globals.css` — no changes required in Phase 1. Leave for Phase 7.

### Constraints

- All new CSS must reference CSS custom properties (`var(--color-...)`) — no hex, no rgb literals.
- Utilities must be written inside `@layer components` so they can be overridden by Tailwind utilities if needed.
- Do not remove or modify any existing utility class.

### Verification gate — STOP if this fails

```bash
pnpm type-check
# Sanity: the CSS file should still parse — if the build step is available:
pnpm --filter dj-fox-electrical-test build 2>&1 | head -50 || true
```

The build command is optional for this phase (CSS-only changes) — if it fails due to unrelated pre-existing errors, log and continue. If it fails specifically on a CSS parse error in the new utilities, STOP.

### Commit

```bash
git add packages/themes/orion/globals.css
git commit -m "$(cat <<'EOF'
feat(orion): add shared utilities — brand-tinted shadow, light-surface grain, card-lift, press

Adds reusable CSS utilities consumed by upgraded composable sections.
All utilities reference theme CSS variables (no hardcoded colors).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Hero polish (composable/hero-section.tsx)

**Goal:** Upgrade the hero's stat-less presence — heading weight, button press feedback, focus rings, tighter trust-badge styling, and a grain overlay on image variant.
**Model:** sonnet — judgement calls on heading sizing and button polish.

### File

`packages/core-components/src/components/composable/hero-section.tsx`

### Changes (line references are approximate — search for the exact class lists)

1. **Both variants (image + default):**
   - On every `<a>` button (primary CTA, secondary CTA, breadcrumb links): add
     `active:scale-[0.98] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2`.
     For buttons inside the image variant add `focus-visible:ring-offset-transparent` instead of `ring-offset-2`.
     For buttons inside the default variant add `focus-visible:ring-offset-surface-background`.
   - Remove the existing `transition-colors` class on any button that now has `transition-all`.
2. **Image variant (`layout?.background === "image"`):**
   - Add `grain-light` class... **WAIT — read this carefully:** on the image variant, the section already has `noise-overlay`. Do not add another grain layer. Instead, tighten the dark overlay: change `bg-black/70` to `bg-black/75` for stronger heading contrast. Keep the `bg-brand-primary/75` branch unchanged.
   - Wrap the inner content `<div className="relative z-10 ...">` so it stays above the overlay (already done — verify, do not duplicate).
   - On the heading `<h1>`, add `font-bold tracking-tight` if not already present.
3. **Default variant (no image):**
   - Section element: add `relative overflow-hidden` so a grain utility can sit on top.
   - Add `<div aria-hidden="true" className="pointer-events-none absolute inset-0 grain-light" />` as the first child of the section, before the inner container.
   - Tighten eyebrow: change `text-sm font-semibold uppercase tracking-widest` → `text-xs font-semibold uppercase tracking-[0.2em]` (smaller, more spaced — editorial feel).
4. **Breadcrumbs (both variants):** add `active:scale-[0.98] transition-transform duration-150 ease-out` on the `<a>` elements.

### Do NOT

- Change any prop, slot, or layout parameter.
- Change the hero heading class from `text-h1` to anything else (the theme scale is deliberate).
- Add any client-side behaviour.

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/core-components/src/components/composable/hero-section.tsx
git commit -m "$(cat <<'EOF'
feat(hero): add press feedback, focus rings, grain on light variant, tighter eyebrow

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — StatsStrip upsize + alignment

**Goal:** Stats are currently `text-xl font-bold` — far too small. Upsize to hero-stat scale with tabular numerals and a colored accent rule.
**Model:** haiku — mechanical class swaps, no judgement.

### File

`packages/core-components/src/components/composable/stats-strip.tsx`

### Changes

1. Stat value `<p data-slot="statValue">` — change `text-xl font-bold` to `text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums stat-value`. The `stat-value` class is already defined in the site globals.
2. Stat label — change `text-xs ... uppercase tracking-widest` to `text-[0.7rem] uppercase tracking-[0.18em] font-medium`. Keep the existing color class (`text-on-inverse-muted` or theme default).
3. Divider logic: replace `border-r border-current/20` with `border-r border-white/15` when `layout?.background === "inverse"`, otherwise `border-r border-surface-card-border`. Keep the `slots.showDividers && i < stats.length - 1` guard intact.
4. Add top-of-stat accent: before the `<p data-slot="statValue">`, insert
   ```
   <div aria-hidden="true" className="mx-auto mb-3 h-[2px] w-8 bg-brand-primary" />
   ```
   Only render this when `slots.showDividers` is truthy (piggyback — this is a visual rhythm element, not a real divider toggle).

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/core-components/src/components/composable/stats-strip.tsx
git commit -m "$(cat <<'EOF'
feat(stats-strip): upsize values to hero scale, add brand accent rule, tighten label tracking

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Card components: lift, press, brand-tinted shadow, focus ring

**Goal:** Upgrade the three card-heavy sections — ServiceCards, FeatureGrid, TestimonialGrid — so cards lift on hover with a brand-tinted shadow, links/CTAs have press feedback, and focus rings are visible.
**Model:** sonnet — moderately mechanical but needs care with class composition.

### Files

1. `packages/core-components/src/components/composable/service-cards.tsx`
2. `packages/core-components/src/components/composable/feature-grid.tsx`
3. `packages/core-components/src/components/composable/testimonial-grid.tsx`

### Per-file changes

#### 4a. service-cards.tsx

1. Card wrapper `<div>` (currently `bg-surface-card border-surface-card-border rounded-xl border p-6 transition-shadow hover:shadow-md`):
   - Replace with `group bg-surface-card border-surface-card-border rounded-2xl border p-6 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-brand-lg hover:border-brand-primary/40`.
   - Note: `rounded-2xl` (softer, larger) and the group class enables child arrow motion below.
2. "Learn more" link `<a>`:
   - Replace `text-brand-primary font-semibold hover:underline` with `inline-flex items-center gap-1.5 text-brand-primary font-semibold transition-all duration-200 ease-out hover:gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:rounded`.
   - Change the inner arrow span `<span aria-hidden="true">→</span>` to `<span aria-hidden="true" className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">→</span>`.
3. Section heading alignment: keep `text-center` (it's a grid header — changing it here affects too many callers). No change.

#### 4b. feature-grid.tsx

1. Icon container — currently `bg-brand-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl`:
   - Replace with `bg-brand-primary/10 ring-1 ring-brand-primary/20 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3`.
   - Note: `rounded-2xl` replaces `rounded-full` — differentiates from testimonial avatars which stay round. Adds a subtle ring.
2. Feature wrapper `<div>` (currently `<div key={i} className="text-center">`):
   - Replace with `<div key={i} className="group text-center">` — adds the group class for the icon rotation above. Keep `text-center` — this section reads best centered.
3. Feature title `<h3>` — add `transition-colors duration-200 group-hover:text-brand-primary` appended to existing `text-h3 mb-2`.

#### 4c. testimonial-grid.tsx

1. Card wrapper `<div>` — currently `bg-surface-card border-surface-card-border rounded-xl border p-6`:
   - Replace with `group relative bg-surface-card border-surface-card-border rounded-2xl border p-6 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-brand hover:border-brand-primary/30`.
2. Add a large decorative quote glyph at the top of each card. Insert as the first child of the card wrapper, before the stars:
   ```
   <span
     aria-hidden="true"
     className="pointer-events-none absolute -top-2 left-4 select-none font-serif text-6xl leading-none text-brand-primary/20"
   >
     &ldquo;
   </span>
   ```
   This is visual-only. No font change needed — the browser default serif is adequate for a single glyph.
3. Avatar `<div>` — currently `bg-brand-primary text-brand-on-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold`:
   - Replace with `bg-brand-primary text-brand-on-primary flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold ring-2 ring-brand-primary/20`.
   - Note: squircle (`rounded-2xl`) differentiates from generic avatar circles per the audit.
4. Quote paragraph `<p data-slot="quote">` — keep `italic`. Add `relative z-10` so it sits above the decorative glyph.

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/core-components/src/components/composable/service-cards.tsx \
        packages/core-components/src/components/composable/feature-grid.tsx \
        packages/core-components/src/components/composable/testimonial-grid.tsx
git commit -m "$(cat <<'EOF'
feat(cards): lift on hover, brand-tinted shadows, press/focus polish, squircle avatars, quote glyph

Applies card-upgrade pattern to ServiceCards, FeatureGrid, TestimonialGrid.
Brand-tinted shadows, squircle treatment on icons/avatars, animated hover arrows,
decorative quote glyph on testimonials. Preserves all existing props and slots.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — CTASection polish

**Goal:** CTAs feel generic. Upsize buttons, add press feedback, add focus rings, upgrade trust-line typography, tighten headline tracking.
**Model:** haiku — mostly mechanical class swaps.

### File

`packages/core-components/src/components/composable/cta-section.tsx`

### Changes

1. Primary CTA `<a>` — replace `bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover rounded-lg px-8 py-4 font-semibold transition-colors` with:
   `inline-flex items-center justify-center bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover rounded-xl px-8 py-4 font-semibold shadow-brand-lg transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background`.
   - When `layout?.background === "inverse"` or `"brand"`, the ring offset needs to be `focus-visible:ring-offset-surface-inverse`. Handle this by appending a conditional: after building the base class, add `${layout?.background === "inverse" || layout?.background === "brand" ? " focus-visible:ring-offset-surface-inverse" : ""}`.
2. Secondary CTA `<a>` — replace existing class with:
   `inline-flex items-center justify-center border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-xl border px-8 py-4 font-semibold transition-all duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2`.
3. Heading `<h2>` — add `tracking-tight` to the existing `text-h2 mb-4` classes (result: `text-h2 mb-4 tracking-tight`).
4. Trust line `<p>` — change `text-surface-muted-foreground mt-6 text-sm` to `text-surface-muted-foreground mt-8 text-xs uppercase tracking-[0.18em] font-medium`.

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/core-components/src/components/composable/cta-section.tsx
git commit -m "$(cat <<'EOF'
feat(cta): press feedback, focus rings, shadow-brand on primary, tighter heading, editorial trust line

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6 — ServiceListSection + WhyChooseUsSection rhythm

**Goal:** Improve the two list-heavy sections — tighter hover affordance on ServiceListSection rows, bolder right-column stat on WhyChooseUsSection.
**Model:** sonnet — needs careful class composition.

### Files

1. `packages/core-components/src/components/composable/service-list-section.tsx`
2. `packages/core-components/src/components/composable/why-choose-us-section.tsx`

### 6a. service-list-section.tsx

1. CTA `<a>` (sticky left column) — append `active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2` to the existing class list.
2. List row `<a>` (inside `items.map`) — replace the existing class with:
   `group -mx-4 flex items-start gap-4 rounded-xl px-4 py-6 transition-all duration-200 ease-out hover:bg-surface-muted hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2`.
3. Row title `<h3>` — no change (already has `group-hover:text-brand-primary`).
4. Eyebrow `<p data-slot="eyebrow">` — change `text-sm font-medium uppercase tracking-widest` to `text-xs font-semibold uppercase tracking-[0.2em]` to match the new editorial eyebrow pattern.

### 6b. why-choose-us-section.tsx

1. Right-column stat `<p data-slot="stat">` — currently `font-mono text-xs uppercase tracking-widest md:text-right`. Replace with:
   `font-mono text-sm font-semibold uppercase tracking-[0.15em] md:text-right text-brand-primary` when `!isDark`, keep existing color when `isDark`. Implement this by computing the class:
   ```
   const statClass = `font-mono text-sm font-semibold uppercase tracking-[0.15em] md:text-right ${isDark ? "text-on-inverse-muted" : "text-brand-primary"}`;
   ```
   Then use `statClass` in place of the current inline template.
2. Eyebrow `<p data-slot="eyebrow">` — change `text-sm font-semibold uppercase tracking-widest` → `text-xs font-semibold uppercase tracking-[0.2em]`.
3. Row `<div>` — currently `grid items-center gap-6 border-b border-surface-border py-8`. Change `py-8` to `py-10` (more breathing room), and add `transition-colors duration-200 hover:bg-surface-muted/30` so rows subtly light up on hover.
4. Heading `<h2>` — add `tracking-tight` to the existing class list.

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/core-components/src/components/composable/service-list-section.tsx \
        packages/core-components/src/components/composable/why-choose-us-section.tsx
git commit -m "$(cat <<'EOF'
feat(list-sections): row slide-on-hover, brand-colored stats, editorial eyebrows, tighter rhythm

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7 — FAQ, ContactSection, and light-surface grain application

**Goal:** Finish the interactive states sweep (FAQ item focus/press, Contact form focus styles) and add the grain overlay to the DJ Fox site globals for propagation.
**Model:** sonnet.

### Files

1. `packages/core-components/src/components/composable/faq-item.tsx`
2. `packages/core-components/src/components/composable/contact-section.tsx`
3. `sites/dj-fox-electrical-test/app/globals.css`

### 7a. faq-item.tsx

Read the file first (only file in the set whose contents we haven't seen). Expected pattern is a client component with a button that toggles `max-h`. Apply:

1. The question `<button>` — add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-background rounded-lg` to its class list.
2. On the plus/close icon — ensure its transition uses `transition-transform duration-300 ease-out` (upgrade any shorter existing duration).
3. Active press: add `active:scale-[0.99]` to the button.
4. No structural changes — this component is already client-side; keep it that way.

### 7b. contact-section.tsx

Search for form inputs (`<input>`, `<textarea>`, `<select>` if present). For every one:

1. Ensure it has `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary transition-colors duration-200`. If the input already has a focus style, **append** these rings rather than replacing.
2. For the submit button inside ContactForm — if ContactForm is imported from core-components, add the press/focus treatment consistent with Phase 5 CTA. If ContactForm is a separate file we haven't touched, note this in the final report and skip the button change (do NOT edit files outside this brief's listed set).

If there are no inputs directly in `contact-section.tsx` (they may live in ContactForm), skip step 7b.1 and note it in the final report.

### 7c. dj-fox-electrical-test/app/globals.css

Append after the existing `.location-pill-arrow` block:

```css
/* Applied to light sections that currently feel flat — subtle grain over the entire section */
.grain-light-section {
  @apply relative;
}
.grain-light-section::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  z-index: 0;
}
.grain-light-section > * {
  position: relative;
  z-index: 1;
}
```

No other changes to site globals. Do not alter existing utilities.

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/core-components/src/components/composable/faq-item.tsx \
        packages/core-components/src/components/composable/contact-section.tsx \
        sites/dj-fox-electrical-test/app/globals.css
git commit -m "$(cat <<'EOF'
feat(interactive): FAQ + Contact focus rings, light-surface grain utility in site globals

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 8 — Final verification

**Goal:** Full monorepo type-check, lint, and build pass. Confirm DJ Fox test site still builds cleanly.
**Model:** sonnet — reads logs and diagnoses failures if any.

### Commands

```bash
# Verification gate — STOP if this fails
pnpm type-check
pnpm lint
pnpm --filter dj-fox-electrical-test build
```

If `pnpm lint` surfaces warnings related to our changes (unused imports, etc.) fix them in a follow-up commit named `fix(redesign): lint cleanup`. If the build fails due to unrelated pre-existing issues on develop, capture the error and continue to the final report — do NOT modify unrelated files.

### Final commit (only if follow-up fixes were needed)

```bash
git commit -m "$(cat <<'EOF'
fix(redesign): lint + type-check cleanup from redesign pass

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                          | File overlap       | Model  | Rationale                                                                                       |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------ | ----------------------------------------------------------------------------------------------- |
| G1    | Phase 4 | Task: edit `service-cards.tsx` per 4a; Task: edit `feature-grid.tsx` per 4b; Task: edit `testimonial-grid.tsx` per 4c                                          | none (three files) | sonnet | Three independent component edits with the same pattern — parallel saves wall-clock time.       |
| G2    | Phase 6 | Task: edit `service-list-section.tsx` per 6a; Task: edit `why-choose-us-section.tsx` per 6b                                                                    | none (two files)   | sonnet | Two independent component edits.                                                                |
| G3    | Phase 7 | Task: edit `faq-item.tsx` per 7a; Task: edit `contact-section.tsx` per 7b; Task: append grain utility to `sites/dj-fox-electrical-test/app/globals.css` per 7c | none (three files) | sonnet | Three independent files.                                                                        |
| G4    | Phase 8 | Run `pnpm type-check`; Run `pnpm lint`                                                                                                                         | none (read-only)   | n/a    | Independent verification commands. `pnpm build` must run alone AFTER these — it writes outputs. |
| —     | Phase 1 | — no parallel work in this phase — (single CSS file, single writer)                                                                                            | —                  | —      | Only one file edited.                                                                           |
| —     | Phase 2 | — no parallel work in this phase — (single file)                                                                                                               | —                  | —      | Only one file edited.                                                                           |
| —     | Phase 3 | — no parallel work in this phase — (single file)                                                                                                               | —                  | —      | Only one file edited.                                                                           |
| —     | Phase 5 | — no parallel work in this phase — (single file)                                                                                                               | —                  | —      | Only one file edited.                                                                           |

### Cross-phase groups

| Group  | Phases | Items | Rationale                                                                                                                            |
| ------ | ------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------ |
| (none) |        |       | Phases must run in order — each phase's changes flow into the next and each ends with `pnpm type-check`. No cross-phase parallelism. |

### Sequential points — MUST NOT parallelise

| Item                                                                             | Reason                                                                                                                     |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Verification gates (`pnpm type-check`, `pnpm lint`, `pnpm build`) between phases | Each phase's output gates the next. Gates are the synchronisation barrier.                                                 |
| `pnpm build` in Phase 8                                                          | Writes to `.next/` and `dist/`. Must run alone, not in parallel with lint.                                                 |
| Git commits                                                                      | One commit per phase, in order. Commits are never batched.                                                                 |
| Phase 1 → Phase 2+ ordering                                                      | Phases 2–7 reference utilities (`shadow-brand`, `grain-light`) defined in Phase 1. Running out of order breaks type-check. |

---

## Cost Estimate

| Phase                                            | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------------------------ | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: theme globals (css)                     | sonnet | ~5k               | ~1k                | $0.03      |
| Phase 2: hero polish                             | sonnet | ~6k               | ~1.5k              | $0.04      |
| Phase 3: stats-strip                             | haiku  | ~3k               | ~0.5k              | $0.005     |
| Phase 4: three cards (parallel agents)           | sonnet | ~12k              | ~3k                | $0.08      |
| Phase 5: cta polish                              | haiku  | ~3k               | ~0.8k              | $0.007     |
| Phase 6: list sections (parallel agents)         | sonnet | ~8k               | ~2k                | $0.05      |
| Phase 7: faq + contact + site globals (parallel) | sonnet | ~9k               | ~1.5k              | $0.05      |
| Phase 8: verification (type-check/lint/build)    | sonnet | ~6k               | ~0.5k              | $0.03      |
| Orchestrator overhead (brief + coordination)     | sonnet | ~15k              | ~3k                | $0.09      |
| **Total**                                        |        | **~67k**          | **~13.8k**         | **~$0.39** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $1/$5 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm --filter dj-fox-electrical-test build` passes
3. Any exceptions or intentional deviations from the plan (e.g. if Phase 7b skipped because ContactForm lives elsewhere)
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

After completing all phases, append to `output/sessions/2026-04/2026-04-19_composable-components-redesign/yolo-brief.md`:

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

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase.
- Read every file before editing it.
- Never push — leave all changes on the feature branch.
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more. No prop changes, no schema changes, no new files beyond what's listed.
- **Token-only styling.** Never hardcode hex values in any edit. Always use `bg-brand-primary`, `text-surface-foreground`, `var(--color-...)`, etc. If you find yourself wanting to add a hex value, stop and add a utility class to `packages/themes/orion/globals.css` instead.
- **Do not introduce client components.** The composable sections are React Server Components. All interactivity must be CSS-only. `faq-item.tsx` is the sole exception because it was already a client component before this brief.
- Use `model: haiku` for Task agents doing mechanical work (class swaps, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning.
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6`).
- This brief does not touch theme packages' type exports or the pipeline tools, so `pnpm pipeline:smoke` is NOT required. Standard `pnpm type-check && pnpm lint && pnpm --filter dj-fox-electrical-test build` is sufficient.
- No `--additionalDirectories` required — all edits are within `/Users/rickywilson/Sites/local-business-platform`.

## Completed

**Date:** 2026-04-19
**Status:** All phases executed successfully

All 8 phases implemented as specified. Added shared CSS utilities to Orion globals (brand-tinted shadows, grain overlay, card-lift, press feedback), then upgraded 9 composable components: hero-section (focus rings, press feedback, grain on light variant, tighter eyebrow), stats-strip (hero-scale values, brand accent rule), service-cards/feature-grid/testimonial-grid (card lift, brand shadows, squircle treatment, animated arrows, decorative quote glyph), cta-section (press feedback, focus rings, editorial trust line), service-list-section (row slide-on-hover, focus rings), why-choose-us-section (brand-colored stats, row hover, tighter rhythm), and faq-item (focus rings, press feedback). Phase 7b (contact-section inputs) was skipped as expected — form inputs live in the ContactForm component, not directly in contact-section.tsx. The pre-existing lint warning about faq-item.tsx using "use client" is not caused by our changes. No deviations from the plan.

### Commits

- `582b320` feat(orion): add shared utilities — brand-tinted shadow, light-surface grain, card-lift, press
- `7467c2a` feat(hero): add press feedback, focus rings, grain on light variant, tighter eyebrow
- `92d4c67` feat(stats-strip): upsize values to hero scale, add brand accent rule, tighten label tracking
- `5b8d0e2` feat(cards): lift on hover, brand-tinted shadows, press/focus polish, squircle avatars, quote glyph
- `70f1f57` feat(cta): press feedback, focus rings, shadow-brand on primary, tighter heading, editorial trust line
- `4494f23` feat(list-sections): row slide-on-hover, brand-colored stats, editorial eyebrows, tighter rhythm
- `cb8261f` feat(interactive): FAQ + Contact focus rings, light-surface grain utility in site globals
