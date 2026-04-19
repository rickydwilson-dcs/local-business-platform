# Visual Parity Delta — dj-fox-electrical-test vs. dj-fox-electrical (Production)

**Date:** 2026-04-19
**Status:** Draft — pending user review before YOLO brief is written
**Branch:** `feature/composable-components-redesign` (delta will be applied as additional commits on top of the 7 already landed)

## How to read this doc

- **Production reference** is always `packages/themes/orion/pages/*.tsx` — the gold-standard template rendering the live site. DO NOT edit.
- **Composable target** is always `packages/core-components/src/components/composable/*.tsx` — what the test site renders. This is where the YOLO brief will make edits.
- **Delta shape** in every section: `Where used → Production evidence → Current composable → Gaps → Proposed fix`.
- **Scope discipline.** No prop/schema changes, no theme registry changes, no reverting to theme-page templates. Only:
  - class changes on existing elements
  - new markup wrapping existing elements
  - reuse of already-exported components (`ImageOverlayCard`, `AccentUnderline`, lucide icons)
  - new CSS utilities in `packages/themes/orion/globals.css` when they'd be reused by more than one section

---

## Page-to-section map

| Page type            | Production template                               | Composable sections rendered (from composition.json)                                                                           |
| -------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `home`               | `packages/themes/orion/pages/home.tsx`            | HeroSection(image), StatsStrip, ServiceListSection, CategoryCardsSection, LocationPillsSection, WhyChooseUsSection, CTASection |
| `about`              | `packages/themes/orion/pages/about.tsx`           | HeroSection, ContentSection, FeatureGrid, StatsStrip, CTASection                                                               |
| `contact`            | `packages/themes/orion/pages/contact.tsx`         | HeroSection, ContactSection(inverse), FAQSection(subtle)                                                                       |
| `services`           | `packages/themes/orion/pages/services.tsx`        | HeroSection, ServiceCards, CategoryCardsSection(surface), CTASection(brand)                                                    |
| `service-detail`     | `packages/themes/orion/pages/service-detail.tsx`  | HeroSection(image), ContentSection, FAQSection, CTASection(brand)                                                              |
| `locations`          | `packages/themes/orion/pages/locations.tsx`       | HeroSection, FeatureGrid, CTASection(brand)                                                                                    |
| `location-detail`    | `packages/themes/orion/pages/location-detail.tsx` | HeroSection, ContentSection, ServiceCards, CTASection(brand)                                                                   |
| `reviews`            | `packages/themes/orion/pages/reviews.tsx`         | HeroSection, StatsStrip(subtle), TestimonialGrid, CTASection(brand)                                                            |
| `projects`           | `packages/themes/orion/pages/projects.tsx`        | HeroSection, ProjectGrid(showStats=true), CTASection(brand)                                                                    |
| `project-detail`     | `packages/themes/orion/pages/project-detail.tsx`  | HeroSection, ContentSection, CTASection(brand)                                                                                 |
| `blog`               | `packages/themes/orion/pages/blog.tsx`            | HeroSection, BlogGrid                                                                                                          |
| `blog-post`          | `packages/themes/orion/pages/blog-post.tsx`       | HeroSection, ContentSection, CTASection(brand)                                                                                 |
| `pricing`            | (no dedicated template — extension)               | HeroSection, PricingTable(cols=4), FeatureGrid, FAQSection, CTASection(brand)                                                  |
| `privacy` / `cookie` | (no dedicated template — extension)               | TextSection                                                                                                                    |

---

## Cross-cutting findings (apply to nearly every section)

These are repeated in every composable. Fix once by adjusting every composable section together, not piecemeal.

### CC-1 — Container width divergence

- **Production** uses `.container-narrow` (`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8`) or `.container-standard` (`mx-auto w-full lg:w-[90%] px-6`) depending on page.
- **Composables** all hard-code `mx-auto max-w-5xl px-4 sm:px-6 lg:px-8`.
- **Impact:** composables are visually wider than production (5xl = 1024px vs 4xl = 896px), stretching hero copy, card rows, stats, CTA side-by-side layouts.
- **Fix:** change `max-w-5xl` → `max-w-4xl` in every composable's inner container so it matches `.container-narrow`. Faster than migrating to the class because utility classes inside `@layer components` can be overridden by Tailwind utilities unpredictably in nested contexts; matching pixel width directly is safer. Apply to: hero-section, stats-strip, service-cards, service-list-section, category-cards-section, location-pills-section, why-choose-us-section, cta-section, feature-grid, testimonial-grid, project-grid, blog-grid, pricing-table, content-section, contact-section, faq-section, text-section.
- **Keep:** `max-w-4xl` only on CTASection (already is) — it's the heading-copy-centric layout.

### CC-2 — Section padding divergence

- **Production** uses `.section` = `py-16 md:py-24` or `.section-standard` = `py-16 sm:py-20`.
- **Composables** use `py-16 sm:px-6 lg:px-8` (first half of the call) — no responsive-up vertical padding. Several sections have `py-16 lg:py-24` (closer but not quite). Several use only `py-16`.
- **Impact:** sections feel shorter than production on desktop.
- **Fix:** standardize all composable inner-container vertical padding to `py-16 md:py-24` (matches `.section`).

### CC-3 — Eyebrow typography divergence

- **Production eyebrow pattern** (used 20+ times across templates): `text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3` (sometimes `font-medium`). This is the signature "category label above heading."
- **Composables** post-redesign use a tighter editorial `text-xs font-semibold uppercase tracking-[0.2em]` with `mb-3` or `mb-4`.
- **Impact:** eyebrows are smaller and more spaced than production, breaking visual rhythm with live site.
- **Fix:** revert every composable eyebrow to `text-sm font-semibold uppercase tracking-widest mb-3 text-brand-primary` (exceptions: when rendered on dark bg use `text-white/70` or `text-brand-primary` depending on production analogue).
- **Affected files:** hero-section (both variants), service-list-section, location-pills-section, why-choose-us-section, content-section, contact-section, (and sprinkled inside stats-strip label).

### CC-4 — Section heading typography divergence

- **Production** uses explicit scale `text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground` (section headings) or `text-4xl md:text-5xl font-bold tracking-tight` (page-level hero-equivalents within a section, e.g. home "Our Services" left column, reviews `h1`).
- **Composables** use `text-h2` (theme-token) everywhere — resolves through theme-system and may render smaller/lighter than production.
- **Impact:** section headings don't feel as present; tracking is lost.
- **Fix:** add `text-3xl md:text-4xl font-bold tracking-tight` alongside existing `text-h2` (so token still drives color/line-height, but scale is explicit). Specifically set this in: stats-strip (when no heading — n/a), service-cards, category-cards-section, location-pills-section, why-choose-us-section, feature-grid, testimonial-grid, project-grid, blog-grid, pricing-table, content-section, contact-section, faq-section. For service-list-section, a grade up to `text-4xl md:text-5xl font-bold tracking-tight` matches production exactly.

### CC-5 — Button class divergence

- **Production** uses the theme utility classes `.btn-primary`, `.btn-secondary`, `.btn-tertiary`, `.btn-primary-lg` which already encode padding, radii, ring-focus, and hover states. These classes also include `shadow-sm hover:shadow-md`.
- **Composables** inline everything: `bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover rounded-xl px-8 py-4 font-semibold shadow-brand-lg hover:-translate-y-0.5 active:scale-[0.98] focus-visible:...`.
- **Impact:** buttons are visibly different sizes (composable px-8 py-4 vs production px-6 py-3 baseline), and the brand-tinted shadow we added goes further than production's neutral shadow.
- **Fix:** in CTASection and HeroSection, switch button `<a>` class lists to `btn-primary` + `btn-secondary` + (on dark backgrounds) `btn-tertiary`. Keep the focus-ring augmentation we added in the previous redesign as extra utility classes layered on top: `btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2`. Drop the `shadow-brand-lg` and `hover:-translate-y-0.5` — production doesn't have them.
- **Keep:** the `active:scale-[0.98]` micro-press — it's purely additive (no visible difference at rest).
- **Composable → class mapping:**
  - Light-bg primary CTA: `.btn-primary`
  - Light-bg secondary CTA: `.btn-secondary`
  - Dark-bg primary CTA (on brand-background CTA sections): `bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-surface-muted` (verbatim from `about.tsx:190-193`) — not a class yet.
  - Dark-bg phone CTA: `border-2 border-white text-white px-8 py-3 rounded-lg ... inline-flex items-center gap-2` — not a class yet.
  - Dark-bg subtle CTA (inverse section): `.btn-tertiary`

### CC-6 — `noise-overlay` missing on several composable dark / brand sections

- **Production** applies `.noise-overlay` to every dark CTA (`home.tsx:208`, `about.tsx:176`, `reviews.tsx:138`).
- **Composables** already apply `noise-overlay` to inverse CTA + stats sections (Phase 3 of previous redesign), but NOT to `brand`-background CTAs.
- **Fix:** in CTASection, add `noise-overlay` when `layout?.background === "brand"` in addition to the existing inverse case. Same for StatsStrip brand variant (rarely used but covers it).

### CC-7 — Text-on-white sections lack grain treatment

- **Composables** added `.grain-light` utility in `packages/themes/orion/globals.css` (Phase 1 previous redesign), but it's never actually applied to any light section by the composables.
- **Production** light sections (white + `bg-surface-muted`) are flat — same as composable. No change needed. Only apply `grain-light` selectively if sections feel sterile; the visual-delta target is production, and production is also flat on light sections. **Recommendation: remove `grain-light` usage from HeroSection's no-image variant** where the previous redesign added it (one of Phase 2 changes we need to partially revert).

### CC-8 — Focus rings kept, press-scale kept

- Focus-visible rings + `active:scale-[0.98]` added in the previous redesign are accessibility/polish wins that production doesn't have, but they don't visually contradict production at rest. **Keep them.**

---

## Section-level deltas

### S1 — HeroSection (composable/hero-section.tsx)

**Where used:** every page type. Image variant on `home` + `service-detail`. No-image variant on all other pages with a breadcrumb.

**Production evidence (image variant):** `packages/themes/orion/pages/home.tsx:33-49`. Uses `<HeroWithImage>` from core-components — not directly expressible as raw markup here, but key visual contract:

- Heading explicitly `text-4xl md:text-5xl lg:text-6xl font-bold text-white`
- Overlay `darker` (→ `bg-black/75` or brand-primary/75 per overlay)
- Container width: standard (~1024px but with `lg:w-[90%]`)
- CTAs use `ctaPrimary={siteConfig.cta.primary}` which renders `.btn-primary` — white on red.

**Production evidence (no-image variant):** `packages/themes/orion/pages/about.tsx:57-63` uses `<PageHeroImage>` with breadcrumbs. Also `reviews.tsx:37-65` shows an alternative hero-in-section pattern with left-aligned heading + side-by-side rating card.

**Current composable:** `packages/core-components/src/components/composable/hero-section.tsx` — two full branches (image and no-image), plus a split layout that's not used.

**Gaps:**

1. **Heading scale:** currently `text-h1` only. Production hardcodes `text-4xl md:text-5xl lg:text-6xl font-bold`. `text-h1` likely resolves to a smaller number in theme-system.
2. **Eyebrow tightening was wrong direction:** we changed `text-sm ... tracking-widest` → `text-xs ... tracking-[0.2em]`. Revert to production shape (`text-sm font-semibold uppercase tracking-widest text-white/80 mb-3`).
3. **Buttons use custom inlined classes**, not `.btn-primary` / `.btn-secondary`. On the image variant production would render `.btn-primary` white-bg. Composable image variant renders `bg-brand-primary text-brand-on-primary rounded-lg px-6 py-3` — the colours flip (red-on-white in production actually — `btn-primary` has `bg-brand-primary text-on-brand-primary`, so this is actually matching. Keep but use the class name for consistency.)
4. **`grain-light` was added to the no-image variant** in Phase 2 previous redesign (`<div aria-hidden="true" className="pointer-events-none absolute inset-0 grain-light" />`). Production no-image hero has no grain. **Remove it.**
5. **Trust-badge pill sizing:** `rounded-full bg-white/20 px-3 py-1 text-sm` — production doesn't use trust badges in `HeroWithImage`, but matching composable pill style to production `bg-brand-primary/10 text-brand-primary text-xs font-semibold px-3 py-1 rounded-full` (from blog.tsx:116) would be more consistent. **Keep composable shape as-is** — it's trust-badge-on-image, production doesn't have this, but not a regression.
6. **Overlay tightening to `bg-black/75`** (Phase 2 change) is correct — matches production `darker` overlay. Keep.

**Proposed fix:**

```
// Image variant heading — h1
// BEFORE
<h1 data-slot="heading" className="text-h1 mb-6 text-white">
// AFTER
<h1 data-slot="heading" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">

// No-image variant heading
// BEFORE
<h1 data-slot="heading" className="text-h1 mb-6">
// AFTER
<h1 data-slot="heading" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-surface-foreground">

// Eyebrow (both variants)
// BEFORE
className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/80"
// AFTER
className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/80"
// (For no-image variant use text-brand-primary, not text-white/80)

// Remove grain-light wrapper on no-image variant. Delete the entire <div aria-hidden="true" ... grain-light /> block.

// Primary CTA (image variant) — swap to btn-primary class but keep focus/press additions
// BEFORE
className="bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover rounded-lg px-6 py-3 font-semibold active:scale-[0.98] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-transparent"
// AFTER
className="btn-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-transparent"

// Secondary CTA (image variant)
// BEFORE
className="rounded-lg border border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-transparent"
// AFTER (keep since production HeroWithImage uses a "light on dark" ghost that differs from .btn-tertiary)
// no change

// Primary CTA (no-image variant)
// BEFORE: long inlined brand-primary class
// AFTER
className="btn-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"

// Secondary CTA (no-image variant)
// AFTER
className="btn-secondary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"

// Container width — change in both variants
// BEFORE: container mx-auto px-4 sm:px-6 lg:px-8 py-16  (image variant)
//         mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8  (no-image variant)
// AFTER: mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24
```

---

### S2 — StatsStrip (composable/stats-strip.tsx)

**Where used:** `home` (inverse), `about` (inverse), `reviews` (subtle). Composition layout overrides background per page.

**Production evidence (home):** `packages/themes/orion/pages/home.tsx:53-67`.

```
<section className="bg-surface-inverse border-b border-surface-border noise-overlay">
  <div className="container-narrow">
    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-surface-border">
      {siteConfig.stats.map(({ value, label }) => (
        <div key={label} className="flex items-center gap-4 px-6 py-8">
          <div>
            <p className="text-xl font-bold text-white tracking-tight stat-value">{value}</p>
            <p className="text-xs text-on-inverse-muted uppercase tracking-widest">{label}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Production evidence (reviews trust-points):** `reviews.tsx:68-79` — same `grid-cols-2 md:grid-cols-4 divide-x divide-surface-border` structure with `px-6 py-7`, but label is `font-semibold text-white text-sm` and sub is smaller `text-surface-muted-foreground text-xs mt-0.5`.

**Current composable:**

```
// From the last pass (Phase 3 previous redesign):
<div className="mx-auto mb-3 h-[2px] w-8 bg-brand-primary" />  // decorative accent bar
<p className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums stat-value ...">
<p className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] font-medium">
```

Stat cells: `px-6 text-center` — centered, not left-flex.
Divider: `border-r border-white/15` (inverse) or `border-r border-surface-card-border`.

**Gaps:**

1. **Layout:** production uses `flex items-center gap-4 px-6 py-8` (left-flex, vertical center). Composable uses `px-6 text-center`. Production looks like data columns; composable looks like a card grid.
2. **Stat value size:** production `text-xl font-bold`. Composable upsized to `text-4xl sm:text-5xl font-extrabold`. **Production is modest; composable is dramatic.** Composable upsize was explicitly chosen during Phase 3 as an "editorial stat" treatment — but for visual parity with production, roll back.
3. **Decorative accent bar (`h-[2px] w-8 bg-brand-primary`):** production has no such bar. Remove.
4. **Label tracking:** production `text-xs ... tracking-widest`. Composable `text-[0.7rem] tracking-[0.18em]`. Revert.
5. **Container width:** `max-w-5xl` → `max-w-4xl`.
6. **Vertical padding inside inner container** currently driven by `py-16 / py-8 / py-24` via slots; production is `py-0` at section level with `py-8` per cell. **Leave slot behavior, but change default stat-cell padding to `py-8` to match.** (Production has no section-level py, it's inherited from `.section` on some pages but not the home stats strip — stats strip is section-level flat with cell padding creating the height.)
7. **Divider classes:** `divide-x divide-surface-border` (production) vs per-cell `border-r border-white/15` (composable). Both look similar, but `divide-x` is cleaner. Not a visible delta — leave composable's `border-r` approach.

**Proposed fix:**

```
// Section
// BEFORE
className={`${bg} ${layout?.background === "inverse" ? "noise-overlay" : ""} ${className ?? ""}`}
// AFTER
className={`${bg} ${layout?.background === "inverse" || layout?.background === "brand" ? "noise-overlay" : ""} border-b border-surface-border ${className ?? ""}`}

// Inner container
// BEFORE
<div className={`mx-auto max-w-5xl px-4 ${py} sm:px-6 lg:px-8`}>
  <div className={`grid ${gridCols}`}>
// AFTER
<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
  <div className={`grid ${gridCols} divide-x divide-surface-border`}>

// Stat cell
// BEFORE
<div className={`px-6 text-center ${slots.showDividers && i < stats.length - 1 ? "border-r border-white/15" : ""}`}>
  <div aria-hidden="true" className="mx-auto mb-3 h-[2px] w-8 bg-brand-primary" />
  <p data-slot="statValue" className={`text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums stat-value ${...}`}>
// AFTER
<div className="flex items-center gap-4 px-6 py-8">
  <div>
    <p data-slot="statValue" className="text-xl font-bold tracking-tight stat-value text-white">
      {stat.value}
    </p>
    <p data-slot="statLabel" className="mt-1 text-xs uppercase tracking-widest text-on-inverse-muted">
      {stat.label}
    </p>
  </div>
</div>

// Colour logic: when background is NOT inverse, use text-surface-foreground for value and text-surface-muted-foreground for label (reviews.tsx pattern is inverse-only; subtle variant currently just uses brand-primary for value — match production trust-strip on subtle by keeping brand-primary for value color but dropping the decorative bar).

// Remove the decorative accent bar entirely.
// Remove the slots.showDividers guard around the divider decoration (still keep as conditional on the grid wrapper).
```

---

### S3 — ServiceListSection (composable/service-list-section.tsx)

**Where used:** `home` only.

**Production evidence:** `packages/themes/orion/pages/home.tsx:70-114` — two-column `grid md:grid-cols-[1fr_1fr]` with sticky left column.

**Current composable:** matches production closely — both use `md:sticky md:top-24`, `divide-y divide-surface-card-border`, `group flex items-start gap-4 py-6`.

**Gaps:**

1. **Left-column heading:** production uses `text-4xl md:text-5xl font-bold tracking-tight text-surface-foreground`. Composable uses `text-h2`. Scale likely smaller.
2. **Left-column eyebrow:** production `text-sm font-medium uppercase tracking-widest text-brand-primary mb-3`. Composable post-redesign: `text-xs font-semibold uppercase tracking-[0.2em]`. Revert per CC-3.
3. **Left-column CTA button:** production uses `btn-secondary inline-flex items-center gap-2`. Composable uses custom inlined `rounded-lg border border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-brand-on-primary`. These are visually similar but not identical — `btn-secondary` is `px-6 py-3` (bigger) with `border-2` (thicker).
4. **Row hover translate:** `hover:translate-x-1` added in Phase 6 previous redesign. Production has NO translate on the whole row — only `group-hover:translate-x-1` on the arrow icon. **Remove `hover:translate-x-1` from the row `<a>` class.** Keep `hover:bg-surface-muted`.
5. **Arrow slot position:** production has `flex-shrink-0 mt-1 hidden md:block`. Composable matches except `mt-1` missing.

**Proposed fix:**

```
// Eyebrow
// BEFORE: mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary
// AFTER:  mb-3 text-sm font-medium uppercase tracking-widest text-brand-primary

// Heading
// BEFORE: <h2 ... className="text-h2 mb-6">
// AFTER:  <h2 ... className="text-4xl md:text-5xl font-bold tracking-tight text-surface-foreground mb-6">

// CTA button
// BEFORE: inline-flex items-center gap-2 rounded-lg border border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-brand-on-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
// AFTER:  btn-secondary inline-flex items-center gap-2 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2

// Row <a>
// BEFORE: group -mx-4 flex items-start gap-4 rounded-xl px-4 py-6 transition-all duration-200 ease-out hover:bg-surface-muted hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
// AFTER:  group -mx-4 flex items-start gap-4 rounded-xl px-4 py-6 transition-colors duration-200 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2

// Container width — max-w-5xl → max-w-4xl
```

---

### S4 — CategoryCardsSection (composable/category-cards-section.tsx)

**Where used:** `home` (subtle bg, three image cards), `services` (surface bg, image cards same).

**Production evidence (home):** `packages/themes/orion/pages/home.tsx:117-140` — uses `<ImageOverlayCard>` from core-components.

```
<section className="section bg-surface-muted">
  <div className="container-narrow">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-2">
      Check Your Needs
    </h2>
    <p className="text-surface-muted-foreground mb-10 max-w-xl">
      From new installations to emergency repairs, we cover all your requirements
    </p>
    <div className="grid md:grid-cols-3 gap-6">
      {categoryCards.map((card) => (
        <ImageOverlayCard
          key={card.title}
          imageSrc={card.imageSrc}
          imageAlt={card.imageAlt}
          category={card.category}
          title={card.title}
          href={card.href}
        />
      ))}
    </div>
  </div>
</section>
```

**Current composable:** `packages/core-components/src/components/composable/category-cards-section.tsx` — renders plain `<a>` cards with `bg-surface-card border ... rounded-lg p-6`, showing title + description.

**Gaps — THIS IS THE BIGGEST SINGLE DELTA:**

1. **Component type:** production uses `<ImageOverlayCard>` (already exists at `packages/core-components/src/components/ui/image-overlay-card.tsx` — image with dark gradient, brand-colour hover overlay, category badge, "View More →" link, `group-hover:scale-110` image zoom, `group-hover:translate-x-2` title slide). Composable has none of this.
2. **Data shape:** composable expects `cards: [{ title, description, href }]`. Production uses `[{ imageSrc, imageAlt, category, title, href }]`. Different fields entirely.
3. **Heading scale:** production `text-3xl md:text-4xl`. Composable `text-h2`.
4. **Description `max-w-xl`:** production constrains subheading width. Composable doesn't.

**Proposed fix — DATA-SHAPE-COMPATIBLE ENHANCEMENT:**

The composable must stay backward-compatible with the current data shape (the DJ Fox test site's `page-data.ts` currently feeds text cards). But it should render image cards when `imageSrc` is present:

```
import { ImageOverlayCard } from "../ui/image-overlay-card";

interface CategoryItem {
  title: string;
  description?: string;
  href: string;
  // Optional image-card fields
  imageSrc?: string;
  imageAlt?: string;
  category?: string;
}

// Inside the flat-shape renderer (and nested):
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

// Heading
// BEFORE: text-h2 mb-2
// AFTER:  text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-2

// Subheading
// BEFORE: text-surface-muted-foreground mb-8
// AFTER:  text-surface-muted-foreground mb-10 max-w-xl
```

**Data follow-up (NOT in YOLO — flagged for user):** the test site's `lib/page-data.ts` currently feeds `home.categories` as `{ heading, cards: [{ title, description, href }] }` — no images. To get visual parity on the home page's category section, the YOLO brief should also add `imageSrc`/`imageAlt`/`category` fields to the 3 home category cards in `sites/dj-fox-electrical-test/lib/page-data.ts` using the same image paths the production site uses (`/djfoxelectrical/categories/...`). Production data at `sites/dj-fox-electrical/app/page.tsx` has the canonical list.

---

### S5 — LocationPillsSection (composable/location-pills-section.tsx)

**Where used:** `home` only.

**Production evidence:** `packages/themes/orion/pages/home.tsx:143-174`.

```
<section className="section bg-white">
  <div className="container-narrow">
    <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">Coverage</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-surface-foreground">
          Areas We Serve
        </h2>
      </div>
      <Link href="/locations" className="btn-secondary text-sm">View All Locations</Link>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {locations.slice(0, 6).map(...)}
    </div>
  </div>
</section>
```

**Current composable:** essentially matches — same `.location-pill` class, same grid, same flex header. Small deltas only.

**Gaps:**

1. **Heading scale:** production `text-4xl md:text-5xl`. Composable `text-h2`.
2. **Eyebrow:** production `text-sm font-semibold tracking-widest`. Composable `text-sm font-semibold tracking-widest` — actually matches (this was not changed in previous redesign). Keep as-is.
3. **CTA button:** production uses `btn-secondary text-sm` (smaller version). Composable uses inlined `rounded-lg border border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary ... hover:bg-brand-primary hover:text-brand-on-primary`. Swap to class.
4. **Container width:** `max-w-5xl` → `max-w-4xl`.

**Proposed fix:**

```
// Heading
// BEFORE: text-h2
// AFTER:  text-4xl md:text-5xl font-bold tracking-tight text-surface-foreground

// CTA
// BEFORE: rounded-lg border border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-brand-on-primary
// AFTER:  btn-secondary text-sm
```

---

### S6 — WhyChooseUsSection (composable/why-choose-us-section.tsx)

**Where used:** `home` only.

**Production evidence:** `packages/themes/orion/pages/home.tsx:177-205`.

```
<section className="section bg-surface-inverse">
  <div className="container-narrow">
    <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">Why Us</p>
    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-16">
      Why Choose <span className="text-brand-primary">{siteConfig.name}</span>
    </h2>

    <div className="border-t border-surface-border">
      {whyChooseUsItems.map(...) /* grid md:grid-cols-[2fr_3fr_1fr] gap-6 items-center py-8 border-b border-surface-border */}
    </div>
  </div>
</section>
```

**Current composable:** structurally matches (same `md:grid-cols-[2fr_3fr_1fr]`, same `border-t`, same `border-b` rows). Small deltas from previous redesign.

**Gaps:**

1. **Eyebrow:** production `text-sm font-semibold tracking-widest`. Composable post-redesign: `text-xs font-semibold tracking-[0.2em]`. Revert per CC-3.
2. **Heading scale:** production `text-4xl md:text-5xl`. Composable `text-h2`.
3. **Heading margin-bottom:** production `mb-16` (big gap before border-t). Composable `mb-16` (already matches — keep).
4. **Row vertical padding:** production `py-8`. Composable was changed to `py-10` in Phase 6. Revert.
5. **Row hover background tint:** production has no hover state. Composable added `hover:bg-surface-muted/30`. Revert (doesn't break anything visually-at-rest but is additive and not in production).
6. **Stat colour in non-dark variant:** composable in Phase 6 set `text-brand-primary` for non-dark. Production is dark-only for this section (always `bg-surface-inverse`), so this conditional just dead code. Leave as-is.
7. **Border-t on wrapper:** both have it. Keep.
8. **Border-t class colour:** production `border-surface-border`. Composable `border-surface-border` — match.

**Proposed fix:**

```
// Eyebrow
// BEFORE: mb-3 text-xs font-semibold uppercase tracking-[0.2em] ...
// AFTER:  mb-3 text-sm font-semibold uppercase tracking-widest ...

// Heading
// BEFORE: text-h2 mb-16
// AFTER:  text-4xl md:text-5xl font-bold tracking-tight mb-16

// Row wrapper
// BEFORE: grid items-center gap-6 border-b border-surface-border py-10 transition-colors duration-200 hover:bg-surface-muted/30
// AFTER:  grid items-center gap-6 border-b border-surface-border py-8

// Container width — max-w-5xl → max-w-4xl
```

---

### S7 — CTASection (composable/cta-section.tsx)

**Where used:** `home` (inverse), `services` (brand), `service-detail` (brand), `locations` (brand), `location-detail` (brand), `reviews` (brand), `project-detail` (brand), `blog-post` (brand), `pricing` (brand), `about` (inverse).

**Production evidence (home — inverse + section-dark-accent):** `packages/themes/orion/pages/home.tsx:208-235`.

```
<section className="section-dark-accent noise-overlay">
  <div className="container-narrow">
    <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
      <div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to Get Started?</h2>
        <p className="text-xl mt-4 text-on-inverse-muted">Available across ... and surrounding areas</p>
      </div>
      <div className="flex flex-col gap-3">
        <Link href={...} className="btn-primary whitespace-nowrap">{primary}</Link>
        <Link href={`tel:${phone}`} className="btn-tertiary inline-flex items-center gap-2 whitespace-nowrap justify-center">
          <Phone className="w-5 h-5" /> Call {phoneDisplay}
        </Link>
      </div>
    </div>
  </div>
</section>
```

**Production evidence (brand bg):** `about.tsx:175-206`, `reviews.tsx:138-157`.

```
<section className="section bg-brand-primary text-white py-16 md:py-24 noise-overlay">
  <div className="container-narrow">
    <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to work with us?</h2>
        <p className="text-lg mt-3 text-white/80 max-w-xl">...</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/contact" className="bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-surface-muted transition-colors whitespace-nowrap block text-center">Get a free quote</Link>
        <Link href={`tel:...`} className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap">
          <Phone className="w-5 h-5" aria-hidden="true" />
          {siteConfig.phoneDisplay}
        </Link>
      </div>
    </div>
  </div>
</section>
```

**Current composable:** layout uses `max-w-4xl` (good, already matches) and flex+justify-center buttons, with `text-center` default. No phone/icon tertiary button anywhere. Buttons inlined with `shadow-brand-lg hover:-translate-y-0.5 rounded-xl px-8 py-4`.

**Gaps — SECOND-BIGGEST SINGLE DELTA:**

1. **Layout:** production uses side-by-side `grid md:grid-cols-[1fr_auto] gap-8 items-center`. Composable centers everything stacked.
2. **Buttons stack vertical on desktop** (`flex flex-col gap-3`) in home CTA; brand-bg CTA uses `flex flex-col sm:flex-row gap-3`. Composable uses `flex flex-wrap gap-4 justify-center`.
3. **Phone-icon tertiary button missing:** both home (`.btn-tertiary`) and brand-bg variants have an explicit phone link with Lucide `<Phone />` icon. Composable has no slot or markup for this.
4. **Heading scale:** home `text-4xl md:text-5xl`; brand-bg `text-3xl md:text-4xl`. Composable `text-h2`.
5. **Subheading width:** `max-w-xl` on brand-bg. Composable has no width clamp.
6. **Subheading tracking/colour:** production uses `text-white/80` (brand) or `text-on-inverse-muted` (inverse). Composable uses conditional `text-brand-on-primary`/`text-white opacity-80`/`text-surface-muted-foreground`. Similar but not identical.
7. **Button classes:** production uses `.btn-primary` (inverse) or inlined white-bg pattern (brand). Composable uses `shadow-brand-lg hover:-translate-y-0.5 rounded-xl px-8 py-4 bg-brand-primary ...`. Different.
8. **Noise overlay:** composable applies only on `inverse`. Production brand-bg has `noise-overlay` too. Already covered in CC-6.
9. **Trust line below buttons:** composable has an `mt-8 text-xs uppercase tracking-[0.18em] font-medium` trust line (Phase 5). Production has NO trust line. If data doesn't provide `trustLine`, slot is off by default; but it's worth knowing this is additive, not a parity item.
10. **Section padding:** `section-dark-accent` is `py-20 md:py-28` (larger than default). Brand-bg CTAs use `section ... py-16 md:py-24`. Composable uses default `py-16 sm:px-6 lg:px-8` (via inner container). Match `py-16 md:py-24` default; on inverse, switch the whole section wrapper to `.section-dark-accent` class (which gives `py-20 md:py-28`).

**Proposed fix (bigger refactor — still zero prop changes):**

Introduce a `phoneCta` optional data field (not a new slot, just a data field that's already plausible to exist at runtime — nothing in the composable's Props or TypeScript cares about extra runtime data fields since it's `data: Record<string, unknown>`). Read `phoneDisplay` / `phoneTel` from data.

```
// Section wrapper
// BEFORE
<section className={`${bg} ${layout?.background === "inverse" ? "noise-overlay" : ""} ${className ?? ""}`}>
// AFTER — section-dark-accent on inverse; noise on both inverse and brand
<section
  className={`${layout?.background === "inverse" ? "section-dark-accent" : bg + " py-16 md:py-24"} ${
    layout?.background === "inverse" || layout?.background === "brand" ? "noise-overlay" : ""
  } ${className ?? ""}`}
  data-component="CTASection"
>

// Inner container
// BEFORE
<div className={`mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 ${isCenter ? "text-center" : ""}`}>
// AFTER
<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
  <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
    <div>
      <h2 ...>...</h2>
      <p ...>...</p>
    </div>
    <div className={layout?.background === "inverse" ? "flex flex-col gap-3" : "flex flex-col sm:flex-row gap-3"}>
      ...CTAs...
    </div>
  </div>
</div>

// Heading
// BEFORE: text-h2 mb-4 tracking-tight
// AFTER:  text-4xl md:text-5xl font-bold tracking-tight  (for inverse)
//      OR text-3xl md:text-4xl font-bold tracking-tight  (for brand)
// Pick via ternary on layout.background.

// Subheading
// BEFORE: mb-8 text-xl ...
// AFTER:  text-xl mt-4 text-on-inverse-muted max-w-xl    (inverse)
//         text-lg mt-3 text-white/80 max-w-xl            (brand)

// Primary CTA
// BEFORE: inline-flex ... rounded-xl px-8 py-4 ... shadow-brand-lg hover:-translate-y-0.5 active:scale-[0.98] ...
// AFTER (inverse): btn-primary whitespace-nowrap active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-surface-inverse
// AFTER (brand):   bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-surface-muted transition-colors whitespace-nowrap active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2

// Secondary CTA (light variant) → .btn-secondary
// Phone CTA (only when d.phoneTel || d.phoneDisplay) → new element:
//   (inverse): btn-tertiary inline-flex items-center gap-2 whitespace-nowrap justify-center <Phone className="w-5 h-5" /> Call {d.phoneDisplay}
//   (brand):   border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap <Phone className="w-5 h-5" /> {d.phoneDisplay}

// Drop trust-line slot rendering (keep code but it won't render when there's no trustLine in data — acceptable; removing the feature is out of scope).

// Add import:
// import { Phone } from "lucide-react";
```

---

### S8 — ServiceCards (composable/service-cards.tsx)

**Where used:** `services` (cols=3), `location-detail` (cols=3).

**Production evidence (services flat fallback):** `services.tsx:172-202` — `bg-surface-background rounded-2xl shadow-lg border border-surface-border p-6 group hover:shadow-xl transition-shadow`. No coloured shadow. No translate.

**Production evidence (services featured):** `services.tsx:74-97` — list rows, not cards. This is a separate pattern that the composable doesn't attempt.

**Current composable:** `rounded-2xl`, `hover:-translate-y-1`, `hover:shadow-brand-lg hover:border-brand-primary/40`, animated arrow, focus rings (Phase 4 previous redesign).

**Gaps:**

1. **Shadow:** production uses neutral `shadow-lg hover:shadow-xl`. Composable uses brand-tinted `shadow-brand-lg`. Brand-tint was a Phase-4 design choice; production is neutral.
2. **Translate-on-hover:** production none. Composable `-translate-y-1`.
3. **Card padding:** both `p-6` — matches.
4. **Radius:** both `rounded-2xl` — matches. (Previous redesign correctly moved to 2xl.)
5. **Learn-more link:** production `text-brand-primary font-medium group-hover:translate-x-1`. Composable `text-brand-primary font-semibold inline-flex items-center gap-1.5 hover:gap-2.5 ... group-hover:translate-x-0.5 (on inner arrow)`. Production uses span inline with `&rarr;` and translate on container. Composable's `hover:gap-2.5` is similar but more exaggerated.
6. **Heading scale:** production `text-xl font-semibold`. Composable `text-h3`.

**Proposed fix:**

```
// Card wrapper
// BEFORE: group bg-surface-card border-surface-card-border rounded-2xl border p-6 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-brand-lg hover:border-brand-primary/40
// AFTER:  group bg-surface-card rounded-2xl shadow-lg border border-surface-border p-6 transition-shadow duration-200 hover:shadow-xl

// Learn more
// BEFORE: inline-flex items-center gap-1.5 text-brand-primary font-semibold transition-all duration-200 ease-out hover:gap-2.5 focus-visible:...
// AFTER:  inline-flex items-center text-brand-primary font-medium group-hover:translate-x-1 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:rounded

// Inner arrow span
// BEFORE: transition-transform duration-200 ease-out group-hover:translate-x-0.5
// AFTER (merge into parent's group-hover:translate-x-1): remove per-span translate, keep plain <span>→</span>

// Title
// BEFORE: text-h3 mb-2
// AFTER:  text-xl font-semibold mb-3 group-hover:text-brand-primary transition-colors

// Section heading — keep text-h2 augmented with CC-4 scale:
// BEFORE: text-h2 mb-4 text-center
// AFTER:  text-3xl md:text-4xl font-bold tracking-tight mb-4 text-center

// Container max-w-5xl → max-w-4xl
```

---

### S9 — FeatureGrid (composable/feature-grid.tsx)

**Where used:** `about` (cols=3 — core values), `locations` (cols=3 — location cards), `pricing` (cols=3 — benefits).

**Production evidence (about core values):** `about.tsx:112-144`.

```
<p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">What Drives Us</p>
<h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-12">Our Core Values</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {coreValues.map((value, index) => (
    <div className="flex gap-5 p-6 bg-white rounded-2xl border border-surface-card-border">
      <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-brand-primary" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-surface-foreground mb-2">{value.title}</h3>
        <p className="text-sm text-surface-muted-foreground leading-relaxed">{value.description}</p>
      </div>
    </div>
  ))}
</div>
```

Production is `grid-cols-1 md:grid-cols-2` (NOT 3), rendered as **horizontal cards** (icon-left, text-right), lucide Icon component in a **rounded-xl** (not circle) tinted background. Values are short text blocks in a row layout.

**Current composable:** centered text items with `rounded-2xl` circle icons (Phase 4 added rotate-on-hover and scale-110). Wrong layout shape entirely for this use case.

**Gaps — THIRD-BIGGEST DELTA:**

1. **Layout:** centered vs. horizontal icon-left. Completely different visual.
2. **Grid columns:** production uses md:2 for values; locations.tsx uses md:2 lg:3; pricing benefits not shown in production (hypothetical). Composable gives 3 by default everywhere.
3. **Icon container:** production `rounded-xl` not `rounded-full`; production `bg-brand-primary/10` with `Icon className="w-5 h-5 text-brand-primary"` (lucide); composable uses emoji string + `rounded-2xl` (after Phase 4 from `rounded-full`) with `text-2xl`.
4. **Hover animation:** composable has `group-hover:scale-110 group-hover:rotate-3`. Production has no animation on these cards.
5. **Title scale:** production `text-base font-semibold`. Composable `text-h3`.

**Proposed fix — LAYOUT PIVOT:**

Composable should render an "icon-left, text-right" horizontal card pattern when each `feature` has description and icon, matching production. The current centered-stack is vestigial (from Phase 4 redesign). Change the whole card to production's shape:

```
// Section heading
// BEFORE: text-h2 mb-4 text-center
// AFTER:  text-3xl md:text-4xl font-bold tracking-tight mb-12 text-surface-foreground
// (Remove text-center — production is left-aligned.)

// Section intro
// BEFORE: text-lg text-center mb-12
// AFTER:  text-surface-muted-foreground mb-12 max-w-xl  (left-aligned, width-clamped)
// Move the eyebrow to text-sm font-semibold tracking-widest text-brand-primary mb-3 (per CC-3).

// Grid columns default
// BEFORE: cols=3 default → grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
// AFTER:  keep layout.columns respected, but default cols=2 (matches about) — no breaking change since layout is explicitly set in composition.json where cols=3 is wanted.
//   Actually leave default as 3 to respect composition.json; production's about.tsx uses cols=2, locations uses cols=3. The cols param is explicit from composition.json.

// Feature card
// BEFORE
<div key={i} className="group text-center">
  {slots.showIcons && feature.icon && (
    <div className="bg-brand-primary/10 ring-1 ring-brand-primary/20 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3">
      {feature.icon}
    </div>
  )}
  <h3 data-slot="featureTitle" className="text-h3 mb-2 transition-colors duration-200 group-hover:text-brand-primary">
    {feature.title}
  </h3>
  {slots.showDescriptions && feature.description && (
    <p className={...}>{feature.description}</p>
  )}
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
      <p className="text-sm text-surface-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    )}
  </div>
</div>

// Remove group-* animations — production has none.
```

**Note:** this changes the `locations` page look too (FeatureGrid renders location cards there). Production's `locations.tsx` actually doesn't use this FeatureGrid pattern at all — it renders its own plain text cards in `locations.tsx:41-61`. So the new horizontal-card-with-icon pattern on location cards is a lift — acceptable tradeoff, since FeatureGrid is used for "value/icon/desc" semantics.

---

### S10 — TestimonialGrid (composable/testimonial-grid.tsx)

**Where used:** `reviews`.

**Production evidence:** `reviews.tsx:81-135` — uses `<TestimonialCard>` from core-components (featured + regular variants). Featured are `md:grid-cols-2` with `featured={true}` styling; all reviews are `md:grid-cols-2 lg:grid-cols-3`. Production does NOT render its own custom testimonial card; it relies on the exported `TestimonialCard` component.

**Current composable:** inline card with `rounded-2xl border bg-surface-card hover:-translate-y-1 hover:shadow-brand`, stars, optional title, quote `italic`, avatar `rounded-2xl` squircle (Phase 4), decorative quote glyph (Phase 4).

**Gaps:**

1. **Component:** production uses `TestimonialCard` (exported component). Composable reimplements in-place. Visually this means production and composable look different by default — the `TestimonialCard` has a specific visual contract we haven't inspected. **Priority: medium — consult `TestimonialCard` source before changing.**
2. **Quote glyph addition** in Phase 4 is additive — production doesn't have it, but it doesn't break parity at rest.
3. **Squircle avatar** — production `TestimonialCard` avatar style unknown; likely rounded-full. Composable changed to rounded-2xl in Phase 4.
4. **Hover translate** — production `TestimonialCard` hover unknown. Composable has `hover:-translate-y-1 hover:shadow-brand`.

**Proposed fix (conservative):**

Without redoing TestimonialGrid as a wrapper of `TestimonialCard` (which would change markup semantically), soften the Phase-4 additions:

```
// Card wrapper
// BEFORE: group relative bg-surface-card border-surface-card-border rounded-2xl border p-6 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-brand hover:border-brand-primary/30
// AFTER:  bg-surface-card rounded-2xl shadow-lg border border-surface-border p-6 transition-shadow duration-200 hover:shadow-xl

// Quote glyph
// Remove the absolutely-positioned font-serif 6xl "" glyph (Phase 4). Production has no such decoration.

// Avatar
// BEFORE: rounded-2xl ring-2 ring-brand-primary/20
// AFTER:  rounded-full  (match production default)

// Quote
// Keep italic. Drop "relative z-10" since the glyph's gone.

// Section heading — CC-4 scale as elsewhere.
// Container max-w-5xl → max-w-4xl (actually reviews production uses container-standard w-[90%] — acceptable to stay at max-w-4xl since we're not migrating to class).
```

---

### S11 — ProjectGrid (composable/project-grid.tsx)

**Where used:** `projects`.

**Production evidence:** `projects.tsx:58-97`.

```
<article className="bg-surface-background rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group border border-surface-border">
  <div className="p-6">
    {tags && <div className="flex flex-wrap gap-2 mb-3">{tags.map(tag => <span className="bg-brand-primary/10 text-brand-primary text-xs font-semibold px-2 py-1 rounded">...</span>)}</div>}
    <h3 className="text-xl font-bold text-surface-foreground mb-3 group-hover:text-brand-primary transition-colors">
      <Link href={...}>{title}</Link>
    </h3>
    {description && <p className="text-surface-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>}
    {date && <p className="text-sm text-surface-muted-foreground mb-4">{date}</p>}
    <Link href={...} className="text-brand-primary font-medium text-sm hover:underline">View Project &rarr;</Link>
  </div>
</article>
```

Also: a **stats row above the grid** (`flex flex-wrap justify-center gap-8 mb-8`) with `text-3xl font-bold text-brand-primary` numbers (`projects.tsx:29-42`). Composable's `showStats` renders stats as `mb-12 flex flex-wrap gap-8` — close but centered in production.

**Current composable:** card is `bg-surface-card rounded-lg border p-6`. Missing `shadow-lg hover:shadow-xl`, missing `overflow-hidden`, missing `rounded-2xl`.

**Gaps:**

1. **Card:** `rounded-lg` → `rounded-2xl`; add `shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-surface-border`.
2. **Title:** `text-xl font-bold mb-2` → `text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors`.
3. **Stats row:** `flex flex-wrap gap-8` → `flex flex-wrap justify-center gap-8 mb-8` (centered in production).
4. **Section heading:** `text-h2 mb-4 text-center` → keep center alignment since production heading is in a `text-center` wrapper; apply CC-4 scale.

---

### S12 — BlogGrid (composable/blog-grid.tsx)

**Where used:** `blog`.

**Production evidence:** `blog.tsx:108-146` — identical card pattern to ProjectGrid but with category badge as `rounded-full`, `bg-brand-primary/10 text-brand-primary`, date as `<time>`, author with avatar circle.

**Current composable:** card is `rounded-lg border`, no shadow, no `hover:shadow-xl`, no `group-hover:text-brand-primary` on title.

**Gaps:** same shape as ProjectGrid.

1. **Card:** `rounded-lg` → `rounded-2xl`; add `shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-surface-border`.
2. **Title:** add `group-hover:text-brand-primary transition-colors`.
3. **Category badge:** already correct `rounded-full bg-brand-primary/10 text-brand-primary`.

---

### S13 — PricingTable (composable/pricing-table.tsx)

**Where used:** `pricing`.

**Production evidence:** none. No `packages/themes/orion/pages/pricing.tsx` exists. This is a composition-only page. **Defer — no reference to match against.** Leave as-is.

---

### S14 — ContentSection (composable/content-section.tsx)

**Where used:** `about`, `service-detail`, `location-detail`, `project-detail`, `blog-post`.

**Production evidence:** MDX rendering pattern used by all detail pages: `section-standard bg-surface-background` with `container-standard`, `max-w-4xl mx-auto`, and `prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4`.

**Current composable:** `prose prose-neutral max-w-none`. Missing all the specific prose-\* overrides.

**Gaps:**

1. **Prose classes:** composable uses `prose prose-neutral max-w-none` — much less specific than production. Headings and links render with default prose styling, not production's.
2. **Outer wrapper:** production wraps MDX in `<div className="max-w-4xl mx-auto">` inside section container. Composable doesn't add this inner wrapper.
3. **Subheading "eyebrow":** composable uses `text-brand-primary ... text-sm font-semibold uppercase tracking-wide` — close but production uses `tracking-widest`.

**Proposed fix:**

```
// Prose wrapper
// BEFORE
<div data-slot="content" className="prose prose-neutral max-w-none">
  {data.content as React.JSX.Element}
</div>
// AFTER
<div data-slot="content" className="max-w-4xl mx-auto">
  <div className="prose prose-lg max-w-none prose-headings:text-surface-foreground prose-p:text-surface-muted-foreground prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-foreground prose-li:text-surface-muted-foreground prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4">
    {data.content as React.JSX.Element}
  </div>
</div>

// Subheading
// BEFORE: tracking-wide
// AFTER:  tracking-widest
```

---

### S15 — ContactSection (composable/contact-section.tsx)

**Where used:** `contact` (inverse).

**Production evidence:** `contact.tsx:59-203` — rich two-column layout with a dark form card (`bg-surface-inverse p-8 md:p-12 rounded-2xl` containing the ContactForm with `darkMode={true}`) on the left and a sidebar with icon-backed contact rows on the right.

**Current composable:** already renders a 3fr/2fr split with ContactForm + sidebar; but the form isn't in a dark card, and sidebar cards use `bg-surface-card border` uniformly.

**Gaps:**

1. **Form card:** production wraps ContactForm in `<div className="bg-surface-inverse p-8 md:p-12 rounded-2xl">` with eyebrow + heading + subheading ABOVE the form, then uses `<ContactForm darkMode={true}>`. Composable just renders ContactForm standalone.
2. **Eyebrow inside form:** production has `text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3` (Get in Touch), then `text-3xl font-bold tracking-tight text-white mb-2` heading, then short subheading. Composable has nothing above form.
3. **Sidebar contact icons:** production uses `w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0` with Lucide icon inside. Composable renders icon inline without the tinted rounded-xl wrapper.
4. **Sidebar pattern:** production uses a simpler vertical stack (`space-y-10`) with subtle dividers, no card borders. Composable uses three distinct card-bordered blocks.

**Proposed fix:**

Major restructure — production uses a visually different sidebar treatment. Keep composable's slot structure, but rewire inner markup:

```
// Outer grid
// BEFORE: grid grid-cols-1 gap-8 md:grid-cols-[3fr_2fr]
// AFTER:  grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 items-start

// Form column
// BEFORE: <div data-slot="contactForm"><ContactForm ... /></div>
// AFTER:
<div data-slot="contactForm" className="bg-surface-inverse p-8 md:p-12 rounded-2xl">
  <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">Get in Touch</p>
  <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Write to us for fast feedback</h2>
  <p className="text-surface-muted-foreground mb-8 text-sm leading-relaxed">Our team will get back to you as soon as possible with a tailored solution.</p>
  <ContactForm services={services} serviceAreas={serviceAreas} darkMode={true} />
</div>

// Sidebar wrapper
// BEFORE: aside className="flex flex-col gap-6" with three .card blocks
// AFTER:  aside className="space-y-10 pt-2"

// Sidebar block 1 — Direct contact
// Wrap in section with eyebrow "Direct contact" (text-xs font-medium uppercase tracking-widest text-brand-primary mb-6)
// Each contact row:
<div className="flex items-start gap-4">
  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
    <Phone className="w-5 h-5 text-brand-primary" />  {/* or Mail, MapPin */}
  </div>
  <div>
    <p className="text-xs text-surface-muted-foreground uppercase tracking-widest mb-1">Phone</p>  {/* or Email, Address */}
    <a href={...} className="text-lg font-semibold text-brand-primary hover:underline">{...}</a>
  </div>
</div>

// Divider between sections
<div className="border-t border-surface-card-border" />

// Sidebar block 2 — Business hours (similar pattern with Clock icon per row, flex justify-between)
// Sidebar block 3 — Service links (plain list)

// ContactForm needs darkMode=true — verify the existing ContactForm exported from core-components/ui/ supports this prop.
```

**Data follow-up:** `page-data.ts` feeds `contact.phoneTel`, `phoneDisplay`, `email`, `address`, `hours`, `services` — already in shape. Eyebrow/heading text would be static strings in the composable (not data). Acceptable since these are nearly universal.

---

### S16 — FAQSection (composable/faq-section.tsx)

**Where used:** `contact` (subtle bg, showPhonePrompt), `service-detail` (showPhonePrompt), `pricing` (showPhonePrompt).

**Production evidence:** service-detail and project-detail use exported `<FAQSection>` from core-components/ui. Composable's FAQSection has a similar shape.

**Gaps:** small. Possibly the heading scale + container width (CC-1 / CC-4). Phone prompt link — production unknown without looking at the core-components FAQSection; assume similar.

**Proposed fix:**

```
// Heading
// BEFORE: text-h2 mb-10 text-center
// AFTER:  text-3xl md:text-4xl font-bold tracking-tight mb-10 text-center

// Container max-w-4xl — already correct.
```

---

### S17 — TextSection (composable/text-section.tsx)

**Where used:** `privacy`, `cookie`.

**Production evidence:** none. Defer. Leave as-is.

---

## Summary of changes by composable file

| File                       | Change complexity | Notes                                                                                                          |
| -------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| hero-section.tsx           | Medium            | Heading scale, eyebrow revert, button-class swap, remove grain-light                                           |
| stats-strip.tsx            | Medium            | Whole layout revert — left-flex cells, downsize values, remove accent bar                                      |
| service-cards.tsx          | Small             | Neutral shadow swap, drop translate, heading + arrow pattern                                                   |
| service-list-section.tsx   | Small             | Eyebrow revert, heading scale, btn-secondary swap, drop hover:translate-x                                      |
| category-cards-section.tsx | Large             | Add ImageOverlayCard branch when imageSrc present; data-shape additions                                        |
| location-pills-section.tsx | Small             | Heading scale, btn-secondary swap                                                                              |
| why-choose-us-section.tsx  | Small             | Eyebrow revert, heading scale, row py-10→py-8, drop hover tint                                                 |
| cta-section.tsx            | Large             | Full layout rewire — side-by-side grid, phone-icon CTA, brand-variant button styles, section-dark-accent class |
| feature-grid.tsx           | Medium            | Layout pivot — centered → horizontal icon-left; drop rotate/scale                                              |
| testimonial-grid.tsx       | Small             | Neutral shadow swap, drop quote glyph, rounded-full avatar                                                     |
| project-grid.tsx           | Small             | rounded-2xl + shadow-lg + group hover                                                                          |
| blog-grid.tsx              | Small             | rounded-2xl + shadow-lg + group hover                                                                          |
| pricing-table.tsx          | None              | Defer — no production reference                                                                                |
| content-section.tsx        | Small             | Upgrade prose class list                                                                                       |
| contact-section.tsx        | Large             | Dark form card wrapper + sidebar restructure                                                                   |
| faq-section.tsx            | Tiny              | Heading scale                                                                                                  |
| text-section.tsx           | None              | Defer — no production reference                                                                                |

Plus **all files**: change `max-w-5xl` → `max-w-4xl`, standardize `py-16 md:py-24`.

## Data changes

- **Home categories:** `sites/dj-fox-electrical-test/lib/page-data.ts` needs `imageSrc`, `imageAlt`, `category` on the 3 home category cards. Copy from production `sites/dj-fox-electrical/app/page.tsx`.
- **Services categoryCards:** same fix for the `services.categoryGroups` or wherever services page feeds CategoryCardsSection.
- **Contact:** already has all fields needed.

## What NOT to revert from the previous redesign

Keep:

- **Active-press scale** on every interactive (`active:scale-[0.98]`) — additive, invisible at rest.
- **Focus-visible rings** — accessibility, additive.
- **`tabular-nums` on stat values** (`.stat-value` class) — matches production intent.
- **`rounded-2xl` on cards** where production already uses `rounded-2xl`.

## Open questions for user (before YOLO brief is written)

1. **Page-data changes:** Am I permitted to edit `sites/dj-fox-electrical-test/lib/page-data.ts` to add `imageSrc`/`imageAlt`/`category` fields to the home and services category cards? Without it, CategoryCardsSection has no images to render and the `ImageOverlayCard` branch is dead code.
2. **Brand-bg CTA primary button styling:** Production uses an inlined `bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-surface-muted` — not a named class. OK to inline this in CTASection, or would you prefer I add a `.btn-on-brand-primary` class to `packages/themes/orion/globals.css` first?
3. **ContactSection dark form card:** Adding the dark `bg-surface-inverse` wrapper changes the ContactForm's visual context — needs `darkMode={true}` prop on ContactForm. I need to confirm ContactForm (at `packages/core-components/src/components/ui/contact-form`) supports that prop. If it doesn't, there's a larger change needed and I'll flag it.
4. **TestimonialGrid TestimonialCard reuse:** should I leave as-is (inline reimplementation) or swap to call the exported `<TestimonialCard>` component? Swapping is cleaner but changes the DOM shape — may break any existing CSS overrides. Recommend: leave inline for this pass, just soften the Phase-4 visual additions.

---

## Once approved

Write `yolo-brief-visual-parity.md` in the same session folder, structured phase-by-phase. Target cost ~$0.55 (14 files, medium complexity, some parallelisable).
