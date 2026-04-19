# YOLO Implementation Brief: Composable Components — Visual Parity Pass

**Branch:** `feature/composable-components-redesign` (CONTINUE on existing branch, do NOT create a new one)
**Session spec:** `output/sessions/2026-04/2026-04-19_composable-components-redesign/yolo-brief-visual-parity.md`
**Sister doc (read first):** `output/sessions/2026-04/2026-04-19_composable-components-redesign/visual-delta.md` — the section-by-section reference that this brief implements. Every phase below refers back to delta-doc sections (S1, S2, ...) and cross-cutting findings (CC-1 ... CC-8). **Read the delta doc before starting — it has before/after class snippets and line-number references you will need.**
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The previous redesign pass (7 commits on this branch) made the composable sections look "polished" but drifted away from the production DJ Fox Electrical site the composition system was supposed to rebuild. The user compared side-by-side and confirmed: the test site doesn't look like production.

A delta audit (`visual-delta.md`) mapped every difference across 13 page types and 17 composable sections. The deltas cluster into three buckets:

1. **Cross-cutting drift (CC-1 to CC-8):** container widths (`max-w-5xl` → `max-w-4xl`), eyebrow typography (previous Phase 3 went the wrong direction on `tracking-widest`), button classes (production uses theme utility classes `btn-primary` / `btn-secondary` / `btn-tertiary`), section padding, missing `noise-overlay` on brand-bg CTAs.
2. **Additive Phase-4 ornaments that need to be rolled back:** hover `-translate-y-1` on cards, brand-tinted `shadow-brand-lg`, decorative quote glyph on testimonials, circle-icon rotate-on-hover on feature grid, grain overlay on default-variant hero, upsized `text-4xl/5xl` stats with decorative accent bar.
3. **Three structural rewrites** — CategoryCardsSection (text cards → `ImageOverlayCard`), CTASection (centered stack → side-by-side grid with phone-icon tertiary button), FeatureGrid (centered icon-above-text → horizontal icon-left card). Plus a smaller ContactSection restructure (wrap form in a dark card, restructure sidebar to production's icon-backed pattern).

The brief closes all three buckets in one branch so the test site visually matches production across every page type, while preserving the composition architecture (no prop/schema breakage, zero site pages change).

The previous redesign added genuine accessibility wins — `active:scale-[0.98]` press feedback and `focus-visible` rings — that are additive and don't contradict production. **These are kept.**

**User-approved decisions** (see delta-doc open questions):

1. `page-data.ts` edits are allowed — they add canonical image-card fields to the three home category cards.
2. Brand-bg CTA button styles will be extracted into `.btn-on-brand-primary` (new class in Orion globals) instead of inlined.
3. `ContactForm` already supports `darkMode={true}` (confirmed at `packages/core-components/src/components/ui/contact-form/index.tsx:21`).
4. `TestimonialGrid` will be refactored to call the exported `<TestimonialCard>` component (at `packages/core-components/src/components/ui/testimonial-card.tsx`) instead of re-implementing testimonial markup inline.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless clearly mechanical (→ haiku).

---

## Design Principles (apply to every phase)

Re-read these before touching any file.

1. **Production is the reference.** Every class decision in this brief came from reading `packages/themes/orion/pages/*.tsx`. When the delta doc and production disagree, production wins. When production and the brief disagree, the brief wins (explicit decisions are recorded in the delta doc).
2. **Token-only styling.** Never hardcode hex values. Use `bg-brand-primary`, `text-surface-foreground`, `var(--color-...)`. New utilities go in `packages/themes/orion/globals.css`, never inline hex.
3. **No prop or TypeScript schema changes to composable components.** Every existing `Props` interface, `slots` object, and data shape stays identical. EXCEPTION: the `CategoryItem` interface inside `category-cards-section.tsx` gains three **optional** fields (`imageSrc?`, `imageAlt?`, `category?`) — this is additive, backward-compatible, not a breaking change.
4. **React Server Components.** All composable sections are RSCs. Do not add `useState`, `useEffect`, `"use client"`, or event handlers. Motion/hover/focus is CSS-only.
5. **Keep the Phase-1 accessibility wins** from the previous redesign: `active:scale-[0.98]` and `focus-visible:ring-*`. Layer them on top of the new class lists.
6. **Drop the Phase-4 ornaments** that contradict production: `shadow-brand-lg` on cards, `hover:-translate-y-1` card lifts, `rounded-2xl` avatars (revert to `rounded-full`), decorative quote glyphs, `group-hover:scale-110 rotate-3` feature-icon animations, `grain-light` on hero no-image variant, the `h-[2px] w-8 bg-brand-primary` accent bar on stats.
7. **Container discipline.** Every composable's inner container goes to `max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24` — matches production `.container-narrow` + `.section`. Only CTASection's outer padding is driven by `section-dark-accent` (inverse) or inline `py-16 md:py-24` (brand).
8. **No emojis in source files.**
9. **Re-export patterns:** `TestimonialCard` is exported from `@platform/core-components` (see root `src/index.ts` barrel). Import it with `import { TestimonialCard } from "../ui/testimonial-card";` from within the composable folder — same relative pattern already used for `ContactForm` in `contact-section.tsx`.
10. **Lucide icons** already in dependency tree (`lucide-react`). Import icons per-file: `import { Phone, Mail, MapPin, Clock } from "lucide-react";`.

---

## Pre-flight

```bash
git checkout feature/composable-components-redesign
git pull origin feature/composable-components-redesign 2>/dev/null || true
git log --oneline -7   # confirm the 7 previous redesign commits are present
pnpm type-check   # must be clean before starting
```

If the branch doesn't exist locally (e.g. it was merged and deleted), STOP and ask — do not recreate from scratch.

---

## Phase 1 — Orion globals: add `.btn-on-brand-primary` + confirm existing utilities

**Goal:** Add the one new button utility (`.btn-on-brand-primary`) used by CTASection's brand-background primary CTA. Verify the existing `.btn-primary`, `.btn-secondary`, `.btn-tertiary`, `.section-dark-accent`, `.container-narrow`, `.noise-overlay` utilities (all already defined — see delta-doc CC-5).
**Model:** sonnet — small edit but CSS must be correct.

### File

`packages/themes/orion/globals.css`

### Changes

Locate the existing `.btn-tertiary` block (around line 47-53). After `.btn-ghost` (around line 60), insert:

```css
/* White background, brand-coloured text — for CTA sections with bg-brand-primary */
.btn-on-brand-primary {
  @apply inline-flex items-center justify-center px-8 py-3 rounded-lg;
  @apply bg-white text-brand-primary font-semibold;
  @apply hover:bg-surface-muted transition-colors duration-200;
  @apply focus:ring-2 focus:ring-white focus:ring-offset-2;
  @apply whitespace-nowrap;
}

/* Transparent background, white border + text — phone/secondary on bg-brand-primary */
.btn-on-brand-primary-outline {
  @apply inline-flex items-center justify-center px-8 py-3 rounded-lg;
  @apply border-2 border-white text-white font-semibold;
  @apply hover:bg-white/10 transition-colors duration-200;
  @apply focus:ring-2 focus:ring-white focus:ring-offset-2;
  @apply whitespace-nowrap;
}
```

### Constraints

- Must be inside the existing `@layer components` block (the file uses `@apply` extensively with no explicit layer declarations — the existing `.btn-*` pattern is implicitly inside the component layer; place these new rules next to them).
- Do NOT modify any existing utility class.
- Do NOT remove or touch the Phase-1 composable utilities (`.shadow-brand`, `.shadow-brand-lg`, `.grain-light`, `.card-lift`, `.press`) added in the previous redesign — other composable sections still reference them where valid (focus rings, active-press behaviour). They are not removed even though we're stopping using `shadow-brand-lg` on cards.

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/themes/orion/globals.css
git commit -m "$(cat <<'EOF'
feat(orion): add btn-on-brand-primary + outline utilities

Used by CTASection when rendered on bg-brand-primary. Centralises the
white-button-on-red pattern instead of inlining it in the composable.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Cross-cutting container + padding + eyebrow revert

**Goal:** Apply the three cross-cutting changes (CC-1, CC-2, CC-3 from delta doc) to every composable section. Container width `max-w-5xl` → `max-w-4xl`; inner container padding standardised to `py-16 md:py-24`; eyebrows revert to production's `text-sm font-semibold uppercase tracking-widest mb-3` (from the previous redesign's `text-xs ... tracking-[0.2em]`).
**Model:** sonnet — mostly mechanical but touches many files; needs care for the eyebrow color conditional (dark vs light background).

### Files (17 files)

All under `packages/core-components/src/components/composable/`:

1. `hero-section.tsx`
2. `stats-strip.tsx`
3. `service-cards.tsx`
4. `service-list-section.tsx`
5. `category-cards-section.tsx`
6. `location-pills-section.tsx`
7. `why-choose-us-section.tsx`
8. `cta-section.tsx` (container only — button changes are in later phase)
9. `feature-grid.tsx`
10. `testimonial-grid.tsx`
11. `project-grid.tsx`
12. `blog-grid.tsx`
13. `pricing-table.tsx`
14. `content-section.tsx`
15. `text-section.tsx`
16. `contact-section.tsx` (container only — sidebar rewrite is in later phase)
17. `faq-section.tsx` (already uses `max-w-4xl` — verify, no change)

### Changes per file

**A. Container width.** Find the inner container wrapper `<div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">` (pattern varies slightly; could be `py-16 lg:py-24` or `px-4 ${py} sm:px-6`). Replace `max-w-5xl` with `max-w-4xl`. Keep all other classes.

**B. Vertical padding.** Standardise vertical padding to `py-16 md:py-24`. The inner container is the target — do NOT move padding to the `<section>` element. Two exceptions: (1) `cta-section.tsx` inverse variant will use `.section-dark-accent` instead (Phase 6); leave `cta-section.tsx` alone for padding in this phase, only change its max-width. (2) `hero-section.tsx` image variant has `min-h-[500px] flex items-center` on the section itself — keep that; apply padding change to the inner container (`py-16` → `py-16 md:py-24`).

**C. Eyebrow revert (CC-3).** Find every eyebrow element. They have pattern `<p data-slot="eyebrow" className="...">` or inline eyebrow paragraphs (used in `hero-section`, `service-list-section`, `location-pills-section`, `why-choose-us-section`, `content-section`, `feature-grid`, `stats-strip` labels, `contact-section`).

Replace:

- `text-xs font-semibold uppercase tracking-[0.2em]` → `text-sm font-semibold uppercase tracking-widest`
- `text-[0.7rem] uppercase tracking-[0.18em] font-medium` (only in `stats-strip.tsx` — stat label) → `text-xs uppercase tracking-widest` (match production `text-xs`)
- Any `mb-4` on an eyebrow → `mb-3`

**Colour:**

- When eyebrow is on an inverse/dark section: use `text-white/70` OR `text-brand-primary` per the existing code (check each spot — keep the existing colour logic, only change size/tracking).
- When on light: keep `text-brand-primary` (already there).

### Parallel execution

This phase is ideal for parallel file edits since the changes are independent across files. Launch in parallel — see Parallel Execution Groups section. Spawn Task agents with `model: haiku` for pure class-swap work; keep the `sonnet` orchestrator for the post-verification.

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/core-components/src/components/composable/*.tsx
git commit -m "$(cat <<'EOF'
refactor(composable): match production container width + eyebrow typography

Cross-cutting sweep across all composable sections:
- max-w-5xl -> max-w-4xl (matches .container-narrow)
- inner padding py-16 md:py-24 (matches .section)
- eyebrow text-xs tracking-[0.2em] -> text-sm tracking-widest (revert Phase 3 drift)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — HeroSection (composable/hero-section.tsx) — S1

**Goal:** Match production hero heading scale, button class adoption, drop Phase-4 grain overlay on no-image variant.
**Model:** sonnet — several targeted swaps and class composition.

### File

`packages/core-components/src/components/composable/hero-section.tsx`

### Changes (all branches; image + no-image variants)

1. **Heading `<h1>` both variants:**
   - `text-h1 mb-6 text-white` → `text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white` (image variant)
   - `text-h1 mb-6` → `text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-surface-foreground` (no-image variant)

2. **Eyebrow (if not already caught by Phase 2):** ensure image-variant eyebrow is `text-sm font-semibold uppercase tracking-widest text-white/80 mb-3`; no-image variant `text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3`.

3. **Primary CTA — image variant:**
   - Current: `bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover rounded-lg px-6 py-3 font-semibold active:scale-[0.98] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-transparent`
   - Replace with: `btn-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-transparent`

4. **Secondary CTA — image variant:**
   - Keep the existing `rounded-lg border border-white px-6 py-3 font-semibold text-white hover:bg-white/10 ...` class list — production's dark-overlay hero uses this ghost style, not `.btn-tertiary`. Just ensure `active:scale-[0.98]` and focus-visible ring are present (should already be there from previous redesign).

5. **Primary CTA — no-image variant:**
   - Replace inlined brand-primary class with: `btn-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2`

6. **Secondary CTA — no-image variant:**
   - Replace inlined `border-brand-primary text-brand-primary hover:bg-brand-primary/10 ...` class with: `btn-secondary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2`

7. **Remove Phase-2 grain overlay on no-image variant.** Find and delete the `<div aria-hidden="true" className="pointer-events-none absolute inset-0 grain-light" />` block added in Phase 2 of the previous redesign. Also remove the `relative overflow-hidden` that was added to the section element at the same time — UNLESS that `<section>` still needs `relative` for another absolute child (scan — if nothing else absolute, remove).

8. **Remove Phase-2 `bg-black/75` tweak IF IT BROKE SOMETHING** — read the current code. The previous brief said change `bg-black/70` → `bg-black/75`. This matches production's `overlay="darker"`. **KEEP this change** — no revert.

### Constraints

- Respect the `layout?.align === "split"` branch for the no-image variant — keep its grid markup.
- The eyebrow colour conditional on inverse vs. surface backgrounds in the no-image variant must stay correct. On `inverse` bg use `text-white/70`; on `subtle` or default use `text-brand-primary`.
- Preserve breadcrumb markup exactly.

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/core-components/src/components/composable/hero-section.tsx
git commit -m "$(cat <<'EOF'
feat(hero): production-parity heading scale + btn-primary/secondary adoption

- Heading: text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight
- Primary CTA: btn-primary (both variants)
- Secondary CTA: btn-secondary (no-image variant); keep ghost on image variant
- Remove grain-light overlay on no-image variant (production has no grain on light heroes)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — StatsStrip (composable/stats-strip.tsx) — S2

**Goal:** Revert to production's left-flex data-column layout. Drop Phase-3 upsizing and decorative accent bar.
**Model:** sonnet — several small but intertwined changes.

### File

`packages/core-components/src/components/composable/stats-strip.tsx`

### Changes

1. **Stat cell wrapper:** change to `flex items-center gap-4 px-6 py-8`. Drop `text-center`. Drop the `border-r border-white/15` conditional — use `divide-x divide-surface-border` on the grid wrapper instead.

2. **Grid wrapper:** currently `<div className={\`grid ${gridCols}\`}>`. Change to `<div className={\`grid ${gridCols} divide-x divide-surface-border\`}>`. Drop `slots.showDividers`branching from the stat cell; the divider is now an inherent part of the grid. (Keep the`STATS_STRIP_DEFAULT_SLOTS.showDividers`constant and the`slots` interface to avoid breaking any caller; just don't branch on it. It becomes effectively always-on.)

3. **Stat value `<p>`:** revert to `text-xl font-bold tracking-tight stat-value text-white` (on inverse) or `text-xl font-bold tracking-tight stat-value text-brand-primary` (otherwise).
   - Current Phase-3 classes to drop: `text-4xl sm:text-5xl font-extrabold tabular-nums` → replaced by `text-xl font-bold` + the existing `.stat-value` class provides `tabular-nums`.

4. **Accent bar:** delete the `<div aria-hidden="true" className="mx-auto mb-3 h-[2px] w-8 bg-brand-primary" />` line entirely.

5. **Stat label:** revert to `mt-1 text-xs uppercase tracking-widest text-on-inverse-muted` (already partly corrected in Phase 2). Ensure colour is `text-on-inverse-muted` on inverse, `text-surface-muted-foreground` otherwise.

6. **Stat cell structure:** production wraps label + value inside a nested `<div>` so `flex items-center gap-4` aligns the whole group vertically. Update markup:

```tsx
<div key={i} className="flex items-center gap-4 px-6 py-8">
  <div>
    <p
      data-slot="statValue"
      className={`text-xl font-bold tracking-tight stat-value ${layout?.background === "inverse" ? "text-white" : "text-brand-primary"}`}
    >
      {stat.value}
    </p>
    {slots.showLabel && stat.label && (
      <p
        data-slot="statLabel"
        className={`mt-1 text-xs uppercase tracking-widest ${layout?.background === "inverse" ? "text-on-inverse-muted" : "text-surface-muted-foreground"}`}
      >
        {stat.label}
      </p>
    )}
    {slots.showDescription && stat.description && (
      <p
        className={`mt-1 text-sm ${layout?.background === "inverse" ? "text-on-inverse-muted" : "text-surface-muted-foreground"}`}
      >
        {stat.description}
      </p>
    )}
  </div>
</div>
```

7. **Section border:** add `border-b border-surface-border` when on inverse OR when on default white (matches production `reviews.tsx:68` + `home.tsx:53`). Specifically: append `border-b border-surface-border` to the section className unconditionally.

8. **Noise overlay (CC-6):** expand to cover brand bg too: `${layout?.background === "inverse" || layout?.background === "brand" ? "noise-overlay" : ""}`.

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/core-components/src/components/composable/stats-strip.tsx
git commit -m "$(cat <<'EOF'
refactor(stats-strip): restore production left-flex data-column layout

- Drop Phase-3 upsized text-4xl/5xl values + decorative accent bar
- flex items-center gap-4 cells with divide-x grid dividers
- text-xl font-bold value + text-xs tracking-widest label (production scale)
- noise-overlay now covers brand bg too

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — ServiceListSection + LocationPillsSection + WhyChooseUsSection — S3, S5, S6

**Goal:** Apply production-parity heading scales + `btn-secondary` adoption + rollback of Phase-6 ornaments (row `translate-x-1`, row hover tint, `py-10`).
**Model:** sonnet — independent edits, parallelisable (see Parallel Groups).

### 5a. service-list-section.tsx (S3)

1. **Left-column heading:** `text-h2 mb-6` → `text-4xl md:text-5xl font-bold tracking-tight text-surface-foreground mb-6`.

2. **Left-column CTA button:** replace inlined border-brand-primary class with:
   - `btn-secondary inline-flex items-center gap-2 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2`

3. **Row `<a>`:** drop `hover:translate-x-1` and the `transition-all duration-200 ease-out`. Keep `hover:bg-surface-muted` and focus-visible ring.
   - Current: `group -mx-4 flex items-start gap-4 rounded-xl px-4 py-6 transition-all duration-200 ease-out hover:bg-surface-muted hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2`
   - Target: `group -mx-4 flex items-start gap-4 rounded-xl px-4 py-6 transition-colors duration-200 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2`

4. **Row arrow:** verify it has `mt-1` (production has `mt-1` on the arrow — composable may not). Add if missing.

### 5b. location-pills-section.tsx (S5)

1. **Heading:** `text-h2` → `text-4xl md:text-5xl font-bold tracking-tight text-surface-foreground`.

2. **CTA button:** replace inlined class with: `btn-secondary text-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2`.

### 5c. why-choose-us-section.tsx (S6)

1. **Eyebrow:** already handled in Phase 2 (CC-3 revert).

2. **Heading `<h2>`:** `text-h2 mb-16` → `text-4xl md:text-5xl font-bold tracking-tight mb-16`. Keep the conditional text colour (white on dark).

3. **Row `<div>`:** drop Phase-6 additions.
   - Current: `grid items-center gap-6 border-b border-surface-border py-10 transition-colors duration-200 hover:bg-surface-muted/30`
   - Target: `grid items-center gap-6 border-b border-surface-border py-8`

4. **Stat `<p>`:** revert Phase-6 aggressive `text-sm font-semibold tracking-[0.15em] text-brand-primary` on non-dark back to production's `text-xs font-mono uppercase tracking-widest`. Build:
   - `font-mono text-xs uppercase tracking-widest md:text-right ${isDark ? "text-on-inverse-muted" : "text-surface-muted-foreground"}`

### Parallel execution

These three files are independent → launch as parallel Task agents in one message (see Parallel Groups).

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/core-components/src/components/composable/service-list-section.tsx \
        packages/core-components/src/components/composable/location-pills-section.tsx \
        packages/core-components/src/components/composable/why-choose-us-section.tsx
git commit -m "$(cat <<'EOF'
refactor(list-sections): production-parity heading scale + btn-secondary + drop Phase-6 ornaments

- service-list-section: text-4xl/5xl heading; btn-secondary CTA; drop hover:translate-x-1 row shift
- location-pills-section: text-4xl/5xl heading; btn-secondary CTA
- why-choose-us-section: text-4xl/5xl heading; py-10 -> py-8 rows; drop hover:bg-surface-muted/30 tint; font-mono text-xs stat (revert Phase 6 brand-primary stat)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6 — CTASection (composable/cta-section.tsx) — S7

**Goal:** Biggest structural change. Switch to side-by-side `grid md:grid-cols-[1fr_auto]` layout with phone-icon tertiary/outline button on dark/brand backgrounds. Use `.section-dark-accent` on inverse bg. Adopt `.btn-primary` / `.btn-on-brand-primary` / `.btn-tertiary` / `.btn-on-brand-primary-outline` instead of inlined classes.
**Model:** sonnet — careful class composition + new markup.

### File

`packages/core-components/src/components/composable/cta-section.tsx`

### Changes

Replace the entire return body of `ComposableCTASection` with the markup below. Keep props interface, slots defaults, and the `data` / `layout` / `slots` destructuring exactly as they are.

```tsx
import { Phone } from "lucide-react";

// ... (existing interface + defaults + destructuring unchanged)

export function ComposableCTASection({
  slots: slotOverrides,
  layout,
  data,
  className,
}: CTASectionProps) {
  const slots = { ...CTA_SECTION_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | undefined>;

  const isInverse = layout?.background === "inverse";
  const isBrand = layout?.background === "brand";
  const isDark = isInverse || isBrand;

  const sectionClass = isInverse
    ? "section-dark-accent noise-overlay"
    : isBrand
      ? "bg-brand-primary text-white py-16 md:py-24 noise-overlay"
      : layout?.background === "subtle"
        ? "bg-surface-subtle text-surface-foreground py-16 md:py-24"
        : "bg-surface-background text-surface-foreground py-16 md:py-24";

  // Production phone data — may be provided in data
  const phoneTel = typeof data.phoneTel === "string" ? data.phoneTel : undefined;
  const phoneDisplay = typeof data.phoneDisplay === "string" ? data.phoneDisplay : undefined;
  const showPhoneCta = Boolean(phoneTel || phoneDisplay);

  // Heading scale: inverse = text-4xl/5xl (home pattern); brand = text-3xl/4xl (about/reviews)
  const headingScale = isInverse
    ? "text-4xl md:text-5xl font-bold tracking-tight"
    : "text-3xl md:text-4xl font-bold tracking-tight";

  const subheadingClass = isBrand
    ? "text-lg mt-3 text-white/80 max-w-xl"
    : isInverse
      ? "text-xl mt-4 text-on-inverse-muted max-w-xl"
      : "text-lg mt-3 text-surface-muted-foreground max-w-xl";

  const ringOffset = isDark
    ? "focus-visible:ring-offset-surface-inverse"
    : "focus-visible:ring-offset-surface-background";

  return (
    <section className={`${sectionClass} ${className ?? ""}`} data-component="CTASection">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 data-slot="heading" className={headingScale}>
              {d.heading ?? ""}
            </h2>
            {slots.showSubheading && d.subheading && (
              <p data-slot="subheading" className={subheadingClass}>
                {d.subheading}
              </p>
            )}
          </div>
          <div className={isInverse ? "flex flex-col gap-3" : "flex flex-col sm:flex-row gap-3"}>
            {slots.showPrimaryCta && d.primaryCtaText && (
              <a
                href={d.primaryCtaHref ?? "#"}
                data-slot="primaryCta"
                className={
                  (isBrand ? "btn-on-brand-primary" : "btn-primary") +
                  " active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 " +
                  ringOffset
                }
              >
                {d.primaryCtaText}
              </a>
            )}
            {slots.showSecondaryCta && d.secondaryCtaText && (
              <a
                href={d.secondaryCtaHref ?? "#"}
                className={
                  (isBrand ? "btn-on-brand-primary-outline" : "btn-secondary") +
                  " active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 " +
                  ringOffset
                }
              >
                {d.secondaryCtaText}
              </a>
            )}
            {showPhoneCta && (
              <a
                href={phoneTel ? `tel:${phoneTel}` : `tel:${phoneDisplay}`}
                data-slot="phoneCta"
                className={
                  (isBrand
                    ? "btn-on-brand-primary-outline"
                    : isInverse
                      ? "btn-tertiary"
                      : "btn-secondary") +
                  " inline-flex items-center gap-2 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 " +
                  ringOffset
                }
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                {isInverse && phoneDisplay ? `Call ${phoneDisplay}` : phoneDisplay}
              </a>
            )}
          </div>
        </div>
        {slots.showTrustLine && d.trustLine && (
          <p
            className={`mt-8 text-xs uppercase tracking-widest font-medium ${isDark ? "text-white/70" : "text-surface-muted-foreground"}`}
          >
            {d.trustLine}
          </p>
        )}
      </div>
    </section>
  );
}

export { ComposableCTASection as CTASection };
```

### Notes

- This removes the old `text-center` / `isCenter` branch. That's intentional — production CTA is always side-by-side. The `layout.align` prop becomes effectively ignored for alignment (the grid handles it). Don't remove the prop from the interface — other callers may pass it harmlessly.
- `showPhoneCta` is gated on data, not a new slot. This keeps the `CTASectionSlots` interface unchanged.
- Trust line is preserved (data-driven — off when `data.trustLine` is absent).

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/core-components/src/components/composable/cta-section.tsx
git commit -m "$(cat <<'EOF'
refactor(cta-section): production-parity side-by-side layout + phone-icon CTA

- Grid md:grid-cols-[1fr_auto] gap-8 items-center (replaces text-center stack)
- section-dark-accent class on inverse bg (py-20 md:py-28)
- btn-primary/btn-on-brand-primary/btn-tertiary/btn-on-brand-primary-outline adoption
- Phone-icon CTA rendered when data.phoneTel or data.phoneDisplay provided
- noise-overlay now on both inverse and brand backgrounds
- Drop Phase-5 shadow-brand-lg + hover:-translate-y-0.5 (production has neither)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7 — Card grids: ServiceCards + FeatureGrid + TestimonialGrid + ProjectGrid + BlogGrid — S8, S9, S10, S11, S12

**Goal:** Drop Phase-4 brand-tinted shadows, translate-on-hover, decorative ornaments. Switch FeatureGrid to production's horizontal icon-left card layout. Switch TestimonialGrid to call exported `<TestimonialCard>`.
**Model:** sonnet — five files, independent, parallelisable.

### 7a. service-cards.tsx (S8)

1. **Card wrapper:**
   - Current: `group bg-surface-card border-surface-card-border rounded-2xl border p-6 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-brand-lg hover:border-brand-primary/40`
   - Target: `group bg-surface-card rounded-2xl shadow-lg border border-surface-border p-6 transition-shadow duration-200 hover:shadow-xl`

2. **"Learn more" link:**
   - Current: `inline-flex items-center gap-1.5 text-brand-primary font-semibold transition-all duration-200 ease-out hover:gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:rounded`
   - Target: `inline-flex items-center text-brand-primary font-medium group-hover:translate-x-1 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:rounded`

3. **Inner arrow span:** drop the `group-hover:translate-x-0.5` on the inner `<span>` — the parent link now has `group-hover:translate-x-1` doing the animation.

4. **Card title:** `text-h3 mb-2` → `text-xl font-semibold mb-3 group-hover:text-brand-primary transition-colors`.

5. **Section heading:** `text-h2 mb-4 text-center` → `text-3xl md:text-4xl font-bold tracking-tight mb-4 text-center`.

### 7b. feature-grid.tsx (S9)

**This is a full layout pivot — centred stack to horizontal icon-left card.**

Replace the feature-card render block:

```tsx
// BEFORE (pseudocode)
<div className="group text-center">
  {icon-circle}
  <h3 className="text-h3 mb-2 group-hover:text-brand-primary">...</h3>
  <p>...</p>
</div>

// AFTER
<div key={i} className="flex gap-5 p-6 bg-surface-card rounded-2xl border border-surface-card-border">
  {slots.showIcons && feature.icon && (
    <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 text-xl">
      {feature.icon}
    </div>
  )}
  <div>
    <h3 data-slot="featureTitle" className="text-base font-semibold text-surface-foreground mb-2">
      {feature.title}
    </h3>
    {slots.showDescriptions && feature.description && (
      <p className={`text-sm leading-relaxed ${layout?.background === "inverse" ? "text-white/80" : "text-surface-muted-foreground"}`}>
        {feature.description}
      </p>
    )}
  </div>
</div>
```

**Section heading:** `text-h2 mb-4 text-center` → `text-3xl md:text-4xl font-bold tracking-tight mb-12 text-surface-foreground`. Drop `text-center` (production left-aligns).

**Section intro:** `mb-12 text-center text-lg` → `text-surface-muted-foreground mb-12 max-w-xl text-lg leading-relaxed`. Drop `text-center`.

**Grid default:** unchanged (cols respected from layout param).

### 7c. testimonial-grid.tsx (S10) — extract TestimonialCard

Refactor to call the exported `<TestimonialCard>`:

```tsx
import { TestimonialCard } from "../ui/testimonial-card";
// Drop StarRating import if present — TestimonialCard handles it internally.

// Replace the entire <div className="grid gap-6 ..."> block:
<div className={`grid gap-6 ${gridCols}`}>
  {testimonials.map((t, i) => (
    <TestimonialCard
      key={i}
      name={t.name}
      rating={t.rating ?? 5}
      text={t.text}
      title={t.title}
      date={t.date}
      location={t.location}
      featured={(t as { featured?: boolean }).featured ?? false}
    />
  ))}
</div>;
```

- Remove the inline quote glyph, avatar, stars markup entirely.
- Keep the section heading + subheading render block at the top (apply CC-4 heading scale: `text-3xl md:text-4xl font-bold tracking-tight mb-4 text-center`).
- The `TestimonialGridSlots` interface stays the same even though some slots (`showStars`, `showAvatar`, `showAuthorName`, etc.) are now managed internally by `TestimonialCard`. TestimonialCard doesn't currently expose these as props — **that's acceptable**, the slots become no-ops on `TestimonialGrid` but stay in the interface to avoid breaking caller data. Document this as a no-op in a single-line comment above the interface: `// NOTE: after 2026-04-19 refactor, slot toggles are no-ops — TestimonialCard manages internal sections.`

### 7d. project-grid.tsx (S11)

1. **Card wrapper:**
   - Current: `bg-surface-card border-surface-border rounded-lg border p-6`
   - Target: `bg-surface-background rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group border border-surface-border`
   - Add a nested `<div className="p-6">` inside `<article>` (current code has padding directly on article; move the children into a padded inner div per production pattern).

2. **Title:**
   - Current: `mb-2 text-xl font-bold`
   - Target: `mb-3 text-xl font-bold text-surface-foreground group-hover:text-brand-primary transition-colors`

3. **Stats row wrapper:**
   - Current: `mb-12 flex flex-wrap gap-8`
   - Target: `flex flex-wrap justify-center gap-8 mb-8` (centred, tighter margin-bottom)

4. **Section heading:** apply CC-4 scale.

### 7e. blog-grid.tsx (S12)

1. **Card wrapper:**
   - Current: `bg-surface-card border-surface-border overflow-hidden rounded-lg border`
   - Target: `bg-surface-background rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group border border-surface-border`

2. **Title:** add `group-hover:text-brand-primary transition-colors` onto the existing `text-surface-foreground text-xl font-bold`.

3. **Section heading:** apply CC-4 scale.

### Parallel execution

Five files, independent → one Task-tool message with five parallel Task agents (model: sonnet). See Parallel Groups.

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/core-components/src/components/composable/service-cards.tsx \
        packages/core-components/src/components/composable/feature-grid.tsx \
        packages/core-components/src/components/composable/testimonial-grid.tsx \
        packages/core-components/src/components/composable/project-grid.tsx \
        packages/core-components/src/components/composable/blog-grid.tsx
git commit -m "$(cat <<'EOF'
refactor(grids): production-parity card styling across 5 grid sections

- service-cards: neutral shadow-lg hover:shadow-xl; drop brand-tinted shadow + translate
- feature-grid: horizontal icon-left card (production about/reviews pattern); drop rotate/scale
- testimonial-grid: delegate to exported <TestimonialCard>; drop inline quote glyph + squircle avatar
- project-grid: rounded-2xl shadow-lg + group-hover:text-brand-primary title
- blog-grid: rounded-2xl shadow-lg + group-hover:text-brand-primary title

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 8 — CategoryCardsSection (composable/category-cards-section.tsx) — S4

**Goal:** Add `ImageOverlayCard` rendering branch for cards with `imageSrc`. Widen `CategoryItem` interface optionally. Update data in `page-data.ts`.
**Model:** sonnet — mixed: component edit + data edit.

### File 1: `packages/core-components/src/components/composable/category-cards-section.tsx`

1. **Widen `CategoryItem` interface:**

```tsx
interface CategoryItem {
  title: string;
  description?: string;
  href: string;
  // Optional image-card fields — when present, renders ImageOverlayCard
  imageSrc?: string;
  imageAlt?: string;
  category?: string;
}
```

2. **Import `ImageOverlayCard`:** at top of file, `import { ImageOverlayCard } from "../ui/image-overlay-card";`.

3. **Flat-shape render branch** (`heading && cards.length > 0`):

```tsx
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {cards.map((card, j) =>
    card.imageSrc ? (
      <ImageOverlayCard
        key={j}
        imageSrc={card.imageSrc}
        imageAlt={card.imageAlt ?? card.title}
        category={card.category}
        title={card.title}
        href={card.href}
      />
    ) : (
      <a
        key={j}
        href={card.href}
        className="block rounded-lg bg-surface-card border border-surface-subtle p-6 transition-colors hover:border-brand-primary"
      >
        <h3 className="text-h4 mb-2">{card.title}</h3>
        {card.description && (
          <p className="text-surface-muted-foreground text-sm">{card.description}</p>
        )}
      </a>
    )
  )}
</div>
```

4. **Nested-shape render branch** (`categories.map`): apply the same pattern inside the inner `<div className="grid">`.

5. **Heading:** `text-h2 mb-2` → `text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-2`.

6. **Subheading:** `text-surface-muted-foreground mb-8` → `text-surface-muted-foreground mb-10 max-w-xl`.

### File 2: `sites/dj-fox-electrical-test/lib/page-data.ts`

Locate `home.categories` (or whatever `dataKey` maps to `"home.categories"` in `composition.json` — look at the file). Add the three image-card entries matching production `sites/dj-fox-electrical/app/page.tsx:80-130` (the `categoryCards` array there). Example:

```ts
// In page-data.ts, find the home.categories block (lines ~150-200). Adjust to:
home: {
  // ... other keys
  categories: {
    heading: "Check Your Needs",
    subheading: "From new installations to emergency repairs, we cover all your requirements",
    cards: [
      {
        imageSrc: "djfoxelectrical/categories/installation-work.jpg",
        imageAlt: "Electrical installation services",
        category: "Installation",
        title: "New Installations",
        href: "/services#installation",
      },
      {
        imageSrc: "djfoxelectrical/categories/maintenance-work.jpg",
        imageAlt: "Electrical maintenance services",
        category: "Maintenance",
        title: "Maintenance & Repair",
        href: "/services#maintenance",
      },
      {
        imageSrc: "djfoxelectrical/categories/emergency-work.jpg",
        imageAlt: "Emergency electrical services",
        category: "Emergency",
        title: "Emergency Callouts",
        href: "/services#emergency",
      },
    ],
  },
  // ...
},
```

**Read the existing `home.categories` block first.** If the shape is `{ heading, cards }` keep that. If it's `{ categories: [{ heading, cards }] }` (nested) add the image fields to each nested card in the same way.

If other dataKeys feed CategoryCardsSection (e.g. `services.categoryGroups`), leave them alone — they may not have image assets available.

### Verification gate — STOP if this fails

```bash
pnpm type-check
# Also ensure the dj-fox-electrical-test site builds — site data changes can break runtime typing
pnpm --filter dj-fox-electrical-test type-check || pnpm --filter dj-fox-electrical-test build 2>&1 | head -30
```

### Commit

```bash
git add packages/core-components/src/components/composable/category-cards-section.tsx \
        sites/dj-fox-electrical-test/lib/page-data.ts
git commit -m "$(cat <<'EOF'
feat(category-cards): render ImageOverlayCard when imageSrc provided

- Widen CategoryItem with optional imageSrc/imageAlt/category
- Branch on imageSrc presence: ImageOverlayCard vs existing text card
- page-data.ts: home categories now include production image/category fields
- Backward-compatible: other composition sites unaffected unless they pass imageSrc

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 9 — ContactSection + ContentSection + FAQSection + PricingTable + TextSection — S14, S15, S16

**Goal:** Last set of deltas. ContactSection gets the dark-form-card + restructured sidebar. ContentSection upgrades prose. FAQSection gets a heading-scale bump. PricingTable and TextSection unchanged (no production reference).
**Model:** sonnet — three independent files + leave two.

### 9a. content-section.tsx (S14)

1. **Prose wrapper:**
   - Current: `<div data-slot="content" className="prose prose-neutral max-w-none">{data.content as React.JSX.Element}</div>`
   - Target:

```tsx
<div data-slot="content" className="max-w-4xl mx-auto">
  <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4">
    {data.content as React.JSX.Element}
  </div>
</div>
```

2. **Subheading/eyebrow:** `tracking-wide` → `tracking-widest`. `text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3` is the target.

3. **Heading:** `text-h2 mb-6` → `text-3xl md:text-4xl font-bold tracking-tight mb-6`.

### 9b. contact-section.tsx (S15)

Major restructure — replace sidebar and wrap form in dark card. This is the largest change in Phase 9 by a significant margin.

Replace the main `return` body:

```tsx
return (
  <section className={`${bg} ${className ?? ""}`} data-component="ContactSection">
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {(heading || subheading) && (
        <div className="mb-12 text-center">
          {heading && (
            <h2 data-slot="heading" className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {heading}
            </h2>
          )}
          {subheading && (
            <p data-slot="subheading" className="text-surface-muted-foreground text-lg">
              {subheading}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 items-start">
        {/* Left: Contact Form in dark card */}
        <div data-slot="contactForm" className="bg-surface-inverse p-8 md:p-12 rounded-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">
            Get in touch
          </p>
          <h3 className="text-3xl font-bold tracking-tight text-white mb-2">
            Write to us for fast feedback
          </h3>
          <p className="text-surface-muted-foreground mb-8 text-sm leading-relaxed">
            Our team will get back to you as soon as possible with a tailored solution.
          </p>
          <ContactForm services={services} serviceAreas={serviceAreas} darkMode={true} />
        </div>

        {/* Right: sidebar */}
        <aside className="space-y-10 pt-2">
          {slots.showSidebarContact && (phoneDisplay || email || address) && (
            <div data-slot="sidebarContact">
              <p className="text-xs font-medium uppercase tracking-widest text-brand-primary mb-6">
                Direct contact
              </p>
              <div className="space-y-6">
                {phoneDisplay && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-brand-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-muted-foreground uppercase tracking-widest mb-1">
                        Phone
                      </p>
                      <a
                        href={phoneTel ? `tel:${phoneTel}` : `tel:${phoneDisplay}`}
                        className="text-lg font-semibold text-brand-primary hover:underline"
                      >
                        {phoneDisplay}
                      </a>
                    </div>
                  </div>
                )}
                {email && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-brand-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-muted-foreground uppercase tracking-widest mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${email}`}
                        className="text-brand-primary hover:underline break-all text-sm font-medium"
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                )}
                {address && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-brand-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-muted-foreground uppercase tracking-widest mb-1">
                        Address
                      </p>
                      <address className="not-italic text-surface-foreground text-sm leading-relaxed">
                        {address.street && (
                          <>
                            {address.street}
                            <br />
                          </>
                        )}
                        {address.locality}, {address.region}
                        {address.postalCode && (
                          <>
                            <br />
                            {address.postalCode}
                          </>
                        )}
                      </address>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {slots.showSidebarContact &&
            (phoneDisplay || email || address) &&
            slots.showHours &&
            hours && <div className="border-t border-surface-card-border" />}

          {slots.showHours && hours && (hours.weekdays || hours.saturday || hours.sunday) && (
            <div data-slot="hours">
              <p className="text-xs font-medium uppercase tracking-widest text-brand-primary mb-6">
                Business hours
              </p>
              <div className="space-y-3">
                {hours.weekdays && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-muted-foreground flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                      Mon&ndash;Fri
                    </span>
                    <span className="text-sm font-medium text-surface-foreground">
                      {hours.weekdays}
                    </span>
                  </div>
                )}
                {hours.saturday && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-muted-foreground flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                      Saturday
                    </span>
                    <span className="text-sm font-medium text-surface-foreground">
                      {hours.saturday}
                    </span>
                  </div>
                )}
                {hours.sunday && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-muted-foreground flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                      Sunday
                    </span>
                    <span className="text-sm font-medium text-surface-foreground">
                      {hours.sunday}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {((slots.showHours && hours) || slots.showSidebarContact) &&
            slots.showServiceLinks &&
            serviceLinks.length > 0 && <div className="border-t border-surface-card-border" />}

          {slots.showServiceLinks && serviceLinks.length > 0 && (
            <div data-slot="serviceLinks">
              <p className="text-xs font-medium uppercase tracking-widest text-brand-primary mb-4">
                Our services
              </p>
              <ul className="space-y-2">
                {serviceLinks.slice(0, 5).map((svc) => (
                  <li key={svc.slug}>
                    <Link
                      href={`/services/${svc.slug}`}
                      className="text-sm text-surface-foreground hover:text-brand-primary transition-colors font-medium"
                    >
                      {svc.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/services"
                className="text-sm text-brand-primary hover:underline font-semibold mt-4 inline-block"
              >
                View all services &rarr;
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  </section>
);
```

- `ArrowRight` import no longer needed — remove if it becomes unused after the sidebar rewrite.
- `ContactForm` now receives `darkMode={true}` — confirmed supported at `packages/core-components/src/components/ui/contact-form/index.tsx:21`.
- The new `<h3>` "Write to us for fast feedback" inside the dark form card is static text — acceptable per delta doc.

### 9c. faq-section.tsx (S16)

1. **Heading:** `text-h2 mb-10 text-center` → `text-3xl md:text-4xl font-bold tracking-tight mb-10 text-center`.
2. Everything else stays.

### 9d. pricing-table.tsx + text-section.tsx

No changes (no production reference per delta doc S13, S17). Verify unchanged.

### Parallel execution

`content-section.tsx`, `contact-section.tsx`, `faq-section.tsx` are all independent → parallel Task agents in one message (model: sonnet). See Parallel Groups.

### Verification gate — STOP if this fails

```bash
pnpm type-check
```

### Commit

```bash
git add packages/core-components/src/components/composable/content-section.tsx \
        packages/core-components/src/components/composable/contact-section.tsx \
        packages/core-components/src/components/composable/faq-section.tsx
git commit -m "$(cat <<'EOF'
refactor(misc-sections): content prose upgrade + contact dark form card + faq heading scale

- content-section: production prose class list (prose-headings/p/a/strong/li/h2/h3)
- contact-section: dark form card wrapper + restructured sidebar with icon-backed contact rows
- faq-section: text-3xl md:text-4xl heading scale

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 10 — Final verification

**Goal:** Full monorepo type-check, lint, and DJ Fox test site build pass.
**Model:** sonnet.

### Commands

```bash
pnpm type-check
pnpm lint
pnpm --filter dj-fox-electrical-test build
```

If `pnpm lint` surfaces warnings introduced by this pass (unused imports after phases 7, 8, 9), fix them in a follow-up commit `fix(redesign): lint cleanup from parity pass`. Unrelated pre-existing warnings (e.g. the `faq-item.tsx` `"use client"` warning we already noted) are NOT to be touched.

If the DJ Fox build fails because `sites/dj-fox-electrical-test/lib/page-data.ts` has a typing issue introduced by the Phase-8 data change, fix it there. Do NOT silence TypeScript errors elsewhere.

### Final commit (only if follow-up fixes were needed)

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix(redesign): lint + build cleanup from visual-parity pass

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase    | Items                                                                                                                                                       | File overlap | Model  | Rationale                                                                                                                     |
| ----- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| G1    | Phase 2  | 17 independent file edits: each composable section's `max-w-5xl` → `max-w-4xl` + padding + eyebrow revert                                                   | none         | haiku  | Mechanical class swaps per file. Batch 6-8 per Task message; launch two Task messages with haiku agents if more than 8 files. |
| G2    | Phase 5  | Task: edit `service-list-section.tsx`; Task: edit `location-pills-section.tsx`; Task: edit `why-choose-us-section.tsx`                                      | none         | sonnet | Three independent section edits with similar patterns.                                                                        |
| G3    | Phase 7  | Task: edit `service-cards.tsx`; Task: edit `feature-grid.tsx`; Task: edit `testimonial-grid.tsx`; Task: edit `project-grid.tsx`; Task: edit `blog-grid.tsx` | none         | sonnet | Five independent card sections — parallel saves significant wall-clock time.                                                  |
| G4    | Phase 9  | Task: edit `content-section.tsx`; Task: edit `contact-section.tsx`; Task: edit `faq-section.tsx`                                                            | none         | sonnet | Three independent sections.                                                                                                   |
| G5    | Phase 10 | Run `pnpm type-check`; Run `pnpm lint`                                                                                                                      | none         | n/a    | Read-only verification commands. `pnpm --filter dj-fox-electrical-test build` runs AFTER alone.                               |
| —     | Phase 1  | — no parallel work — (single file CSS edit)                                                                                                                 | —            | —      | Only one file edited.                                                                                                         |
| —     | Phase 3  | — no parallel work — (single file hero-section.tsx)                                                                                                         | —            | —      | Only one file edited.                                                                                                         |
| —     | Phase 4  | — no parallel work — (single file stats-strip.tsx)                                                                                                          | —            | —      | Only one file edited.                                                                                                         |
| —     | Phase 6  | — no parallel work — (single file cta-section.tsx)                                                                                                          | —            | —      | Only one file edited.                                                                                                         |
| —     | Phase 8  | — no parallel work — (category-cards-section.tsx + page-data.ts are sequential: the type widen must land before page-data types can validate)               | —            | sonnet | Same-phase ordering within two files — sequential is safer.                                                                   |

### Cross-phase groups

| Group  | Phases | Items | Rationale                                                                                                                                                                                             |
| ------ | ------ | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (none) |        |       | Phases must run in order. Each phase's verification gate (`pnpm type-check`) synchronises before the next. Phase 2 lands the cross-cutting container/eyebrow changes that all later phases depend on. |

### Sequential points — MUST NOT parallelise

| Item                                                                         | Reason                                                                                                                                      |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Verification gates (`pnpm type-check`, `pnpm lint`) between phases           | Each phase's output gates the next. Gates are the synchronisation barrier.                                                                  |
| `pnpm --filter dj-fox-electrical-test build` in Phase 10                     | Writes to `.next/`. Must run alone.                                                                                                         |
| Git commits                                                                  | One commit per phase, in order.                                                                                                             |
| Phase 1 → Phase 6                                                            | Phase 6 references `.btn-on-brand-primary` defined in Phase 1.                                                                              |
| Phase 2 → Phase 3–9                                                          | Phase 2 lands the container/eyebrow sweep; later phases layer on top of that. Running out of order causes merge-conflict-style class drift. |
| Within Phase 8: `category-cards-section.tsx` edit BEFORE `page-data.ts` edit | Type widening must land first so the data types validate.                                                                                   |

---

## Cost Estimate

| Phase                                         | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| --------------------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: globals.css (btn utilities)          | sonnet | ~4k               | ~0.5k              | $0.02      |
| Phase 2: cross-cutting sweep (17 files)       | haiku  | ~40k              | ~5k                | $0.07      |
| Phase 3: hero-section                         | sonnet | ~6k               | ~1.5k              | $0.04      |
| Phase 4: stats-strip                          | sonnet | ~4k               | ~1k                | $0.03      |
| Phase 5: list sections (3 parallel)           | sonnet | ~12k              | ~2k                | $0.07      |
| Phase 6: cta-section                          | sonnet | ~8k               | ~2.5k              | $0.06      |
| Phase 7: card grids (5 parallel)              | sonnet | ~20k              | ~4k                | $0.12      |
| Phase 8: category-cards + page-data           | sonnet | ~9k               | ~2k                | $0.06      |
| Phase 9: content + contact + faq (3 parallel) | sonnet | ~14k              | ~4k                | $0.10      |
| Phase 10: verification                        | sonnet | ~8k               | ~1k                | $0.04      |
| Orchestrator overhead                         | sonnet | ~20k              | ~4k                | $0.12      |
| **Total**                                     |        | **~145k**         | **~27.5k**         | **~$0.73** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $1/$5 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~5k) + delta-doc read (~8k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm --filter dj-fox-electrical-test build` passes
3. Deviations from the plan — for example if Phase 8's `home.categories` shape didn't match the assumed flat `{ heading, cards }` shape and a different edit was required
4. Any slot interfaces that became no-ops (Phase 7c's `TestimonialGridSlots`) — confirm a comment was added
5. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used in Phase 2]  |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Compare to pre-flight estimate above. Exact figures: console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-19_composable-components-redesign/yolo-brief-visual-parity.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises — especially the Phase 8 page-data structure and whether production category-card images were present at the expected R2 paths]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **Required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to the next phase.
- Read every file before editing it. **Especially** read `packages/core-components/src/components/composable/<target>.tsx` before each phase's edits — the previous redesign's changes mean class lists are longer than they were in the initial composable authoring.
- Never push. Leave all changes on the feature branch.
- **Consult the Parallel Execution Groups section before launching work.** Group items go in a single Task-tool message. Items not in a group run sequentially.
- **No prop/schema changes** to composable components with the single exception noted (Phase 8 widens `CategoryItem` with three optional fields — this is additive and documented).
- **Token-only styling.** Never hardcode hex in any edit.
- **No new client components.** Composable sections are RSC. If anything in ContactSection (Phase 9b) requires client behaviour, STOP and report — don't silently add `"use client"`.
- **Do NOT touch** `packages/themes/orion/pages/*.tsx` — these are production. Changes there are out of scope entirely.
- Use `model: haiku` for Task agents in Phase 2 (mechanical class swap). `model: sonnet` everywhere else.
- Co-Authored-By reflects the orchestrator: `Claude Sonnet 4.6 <noreply@anthropic.com>`.
- No `--additionalDirectories` needed — all edits within `/Users/rickywilson/Sites/local-business-platform`.
- If a phase's verification produces warnings not directly caused by your edits, log them and continue. If it produces errors caused by your edits, STOP.

## Completed

**Date:** 2026-04-19
**Status:** All phases executed successfully

All 10 phases implemented in sequence. The visual-parity pass closes the three delta buckets identified in the delta doc: cross-cutting drift (container width, eyebrow typography, button classes), Phase-4 ornament rollback (brand-tinted shadows, translate-on-hover, decorative glyphs, grain overlay, upsized stats), and three structural rewrites (CategoryCardsSection image-card branch, CTASection side-by-side grid with phone CTA, FeatureGrid horizontal icon-left layout). The page-data.ts already had imageSrc/imageAlt/category fields on the home and services category cards, so no data changes were needed. One additional fix was required: ImageOverlayCard's import of `@/lib/image` was changed to a relative path `../../lib/image` to prevent type-check failures in sites that don't have the `@/` alias. TestimonialGrid now delegates to the exported `<TestimonialCard>` component. ContactSection wraps the form in a dark card with `darkMode={true}`. All lint warnings are pre-existing (mad-graphics unused vars, faq-item.tsx "use client").

### Commits

- `f429b18` feat(orion): add btn-on-brand-primary + outline utilities
- `396b1f8` refactor(composable): match production container width + eyebrow typography
- `e6a208a` feat(hero): production-parity heading scale + btn-primary/secondary adoption
- `72dafa7` refactor(stats-strip): restore production left-flex data-column layout
- `a3db0a8` refactor(list-sections): production-parity heading scale + btn-secondary + drop Phase-6 ornaments
- `dc02522` refactor(cta-section): production-parity side-by-side layout + phone-icon CTA
- `2497680` refactor(grids): production-parity card styling across 5 grid sections
- `c90e39d` feat(category-cards): render ImageOverlayCard when imageSrc provided
- `0eb2c83` refactor(misc-sections): content prose upgrade + contact dark form card + faq heading scale
