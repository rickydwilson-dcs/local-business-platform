# Component Catalog — Local Business Platform Composition System

**Version:** 1.0 — 2026-04-19  
**Status key:** ✓ Built | ◐ Documented (not built)

---

## Section 1: Overview

### Purpose

This catalog is the single source of truth for every section component in the config-driven site generation system. It is written for two audiences:

**AI prompt engineers** composing pages: use the component entries to understand what each component renders, what data fields it needs, and what layout params control its appearance. The example JSON payloads are copy-pasteable starting points.

**Developers building or extending components**: use the field tables, slot tables, and schema stubs as the specification. The TypeScript interface stubs in the appendices are draft contracts — verify field names against the final implementation.

### How to use

1. Choose a component by page type and use-case (see each component's "Use when" and "Page types" fields)
2. Provide all required fields; optional fields default to hidden via their slot default
3. Use `layout` params to control columns, background colour, alignment, and vertical rhythm
4. Override any slot to `false` to hide an element without removing its data

### Status key

| Symbol | Meaning                                                          |
| ------ | ---------------------------------------------------------------- |
| ✓      | Built — in `packages/core-components/src/components/composable/` |
| ◐      | Documented, not built — schema stubs in Appendix B               |

---

## Section 2: Conventions

### Naming

- **Component names:** PascalCase (`HeroSection`, `ServiceCards`)
- **Field names:** camelCase (`primaryCtaText`, `heroImage`)
- **Slot names:** camelCase with `show` prefix (`showEyebrow`, `showHeroImage`)
- **Layout params:** camelCase (`fullBleed`, `paddingY`)

### Slot semantics

All slots are boolean show/hide toggles.

- `true` — element is rendered (subject to the data field being present)
- `false` — element is never rendered, even if data is present
- A slot set to `true` with no corresponding data gracefully renders nothing

Slots have component-level defaults (see each component's "Slots" table). A config only needs to specify overrides.

### LayoutParams glossary

Defined once in `packages/component-composition/src/types.ts`:

| Param           | Type                                                       | Description                                                                                                                      |
| --------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `background`    | `"surface" \| "subtle" \| "inverse" \| "brand" \| "muted"` | Background colour tier. `surface` = default page bg; `subtle` = slightly off-white; `inverse` = dark; `brand` = brand-primary bg |
| `align`         | `"left" \| "center" \| "right" \| "split"`                 | Content alignment. `split` = text left, media right (two-column grid)                                                            |
| `columns`       | `1 \| 2 \| 3 \| 4`                                         | Column count for grid-based components                                                                                           |
| `fullBleed`     | `boolean`                                                  | When `true`, section has `min-height` applied to fill the viewport                                                               |
| `paddingY`      | `"compact" \| "standard" \| "spacious"`                    | Vertical padding. `compact` = py-8; `standard` = py-16; `spacious` = py-24                                                       |
| `mediaPosition` | `"left" \| "right" \| "top" \| "bottom"`                   | Media/image position relative to text (future use)                                                                               |
| `maxItems`      | `number`                                                   | Cap array rendering at N items (future use)                                                                                      |

### Default values

If a slot has a default value specified in the component, the config only needs to provide overrides. Defaults are listed in each component's Slots table.

---

## Section 3: Animation System

Global preset — future addition to `SiteCompositionConfig`:

```typescript
// Future addition to SiteCompositionConfig
animationPreset?: "none" | "subtle" | "energetic"
```

| Preset      | Behaviour                                               |
| ----------- | ------------------------------------------------------- |
| `none`      | Instant render, no entrance animation                   |
| `subtle`    | Fade-up, 300ms ease-out, 100ms stagger between sections |
| `energetic` | Slide-in + scale, 500ms, pronounced stagger             |

Per-section override — future `motionConfig` field on `BaseSectionConfig`:

```typescript
motionConfig?: {
  enter?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale" | "none";
  duration?: "fast" | "normal" | "slow";
  delay?: number;  // ms, 0–500
}
```

> **Note:** `motionConfig` is a separate field from `layout` — motion is behavioural, layout is structural. Both fields coexist on the same section config.

These fields are **not yet in the codebase**. Document them here so that when they are implemented, the field contracts are pre-agreed.

---

## Section 4: Interaction & Accessibility Baseline

These patterns are hardcoded in component implementations. They are not configurable via slots or layout params.

| Pattern                          | CSS / Behaviour                                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Hover (interactive elements)** | `transition-all duration-[var(--transition-normal)] hover:-translate-y-0.5 hover:shadow-md`                      |
| **Focus visible**                | `focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none`                               |
| **Active**                       | `active:scale-95`                                                                                                |
| **Reduced-motion**               | All transforms disabled when `prefers-reduced-motion: reduce`; opacity transitions only                          |
| **Keyboard**                     | All interactive elements reachable via Tab; dropdowns closeable via Escape; cards with `href` are `<a>` elements |

---

## Section 5: Components

---

### HeroSection ✓

**Status:** Built  
**Use when:** First section of any page — above-fold hero with heading, subheading, and CTA  
**Page types:** home, about, service-detail, location-detail, contact, any landing page

#### Data Fields

| Field              | Type       | Required | Default | Constraints         | Description                                   |
| ------------------ | ---------- | -------- | ------- | ------------------- | --------------------------------------------- |
| `heading`          | `string`   | yes      | —       | max 80 chars        | Main hero heading (renders as `<h1>`)         |
| `eyebrow`          | `string`   | no       | —       | max 60 chars        | Small label above heading                     |
| `subheading`       | `string`   | no       | —       | max 200 chars       | Intro paragraph below heading                 |
| `primaryCtaText`   | `string`   | no       | —       | max 40 chars        | Primary button label                          |
| `primaryCtaHref`   | `string`   | no       | `"#"`   | valid path/URL      | Primary button destination                    |
| `secondaryCtaText` | `string`   | no       | —       | max 40 chars        | Secondary (outline) button label              |
| `secondaryCtaHref` | `string`   | no       | `"#"`   | valid path/URL      | Secondary button destination                  |
| `heroImage`        | `string`   | no       | —       | URL, 16:9 preferred | Hero image URL (only shown in `split` layout) |
| `trustBadges`      | `string[]` | no       | `[]`    | 1–6 items           | Trust indicators (e.g. "Gas Safe Registered") |

#### Slots

| Slot               | Default | Controls                       | Notes                                                           |
| ------------------ | ------- | ------------------------------ | --------------------------------------------------------------- |
| `showEyebrow`      | `true`  | Eyebrow label above heading    | Set `false` on pages where eyebrow would be redundant           |
| `showSubheading`   | `true`  | Subheading paragraph           | Hide for minimal hero                                           |
| `showPrimaryCta`   | `true`  | Primary CTA button             |                                                                 |
| `showSecondaryCta` | `true`  | Secondary CTA button           | Default `true` but renders nothing if `secondaryCtaText` absent |
| `showHeroImage`    | `true`  | Hero image (split layout only) | Image is never shown in `center` layout regardless of this slot |
| `showTrustBadges`  | `false` | Trust badge pills              | Off by default — enable only when badges are populated          |

#### Layout Params

| Param        | Values                                          | Default     | Effect                                                                        |
| ------------ | ----------------------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| `align`      | `"left" \| "center" \| "split"`                 | `"left"`    | `split` = two-column grid with image right; `center` = centred text, no image |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"surface"` | Section background colour                                                     |
| `fullBleed`  | `boolean`                                       | `false`     | When `true`, applies `min-h-[60vh]`                                           |

#### Content Constraints

| Field           | Constraint                                   | Reason                                                 |
| --------------- | -------------------------------------------- | ------------------------------------------------------ |
| `heading`       | max 80 chars                                 | Wraps badly at small viewport above this length        |
| `trustBadges[]` | 1–6 items                                    | More than 6 creates overflow in single-row flex layout |
| `heroImage`     | Only visible when `layout.align === "split"` | Centered layout has no image slot by design            |

#### Interaction States

| Element             | Hover                          | Focus                                     | Active            |
| ------------------- | ------------------------------ | ----------------------------------------- | ----------------- |
| Primary CTA `<a>`   | `hover:bg-brand-primary-hover` | `focus-visible:ring-2 ring-brand-primary` | `active:scale-95` |
| Secondary CTA `<a>` | `hover:bg-brand-primary/10`    | `focus-visible:ring-2 ring-brand-primary` | `active:scale-95` |

#### Animation

Inherits `animationPreset` from site config. Override with `motionConfig` (future).  
Recommended preset: `energetic` — hero is the first impression, motion should be pronounced.

#### Example JSON payload

```json
{
  "heading": "Expert Plumbing & Heating in London",
  "eyebrow": "FastFlo Plumbing & Heating",
  "subheading": "From blocked drains to full boiler installations — 24/7 emergency cover across Greater London.",
  "primaryCtaText": "Get a Free Quote",
  "primaryCtaHref": "/contact",
  "secondaryCtaText": "Call Now",
  "secondaryCtaHref": "tel:02071234567",
  "heroImage": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  "trustBadges": ["Gas Safe Registered", "Which? Trusted Trader", "24/7 Emergency"]
}
```

---

### ServiceCards ✓

**Status:** Built  
**Use when:** Showcasing a business's main services, products, or offerings as a grid of cards  
**Page types:** home, services-list, about

#### Data Fields

| Field                    | Type            | Required | Default | Constraints          | Description                                             |
| ------------------------ | --------------- | -------- | ------- | -------------------- | ------------------------------------------------------- |
| `heading`                | `string`        | no       | —       | max 80 chars         | Section heading (`<h2>`)                                |
| `subheading`             | `string`        | no       | —       | max 160 chars        | Intro text below section heading                        |
| `services`               | `ServiceItem[]` | yes      | `[]`    | 2–8 items            | Array of service cards                                  |
| `services[].title`       | `string`        | yes      | —       | max 60 chars         | Card title (`<h3>`)                                     |
| `services[].description` | `string`        | no       | —       | max 200 chars        | Card description paragraph                              |
| `services[].icon`        | `string`        | no       | —       | single emoji or char | Icon displayed above card title                         |
| `services[].image`       | `string`        | no       | —       | URL, 16:9            | Card image (shown only when `showImage` slot is `true`) |
| `services[].href`        | `string`        | no       | —       | valid path           | Link destination for "Learn more" CTA                   |
| `services[].badge`       | `string`        | no       | —       | max 30 chars         | Small badge label (e.g. "New", "Popular")               |

#### Slots

| Slot              | Default | Controls                    | Notes                                    |
| ----------------- | ------- | --------------------------- | ---------------------------------------- |
| `showIcon`        | `true`  | Emoji/icon above card title |                                          |
| `showImage`       | `false` | Card image (aspect-video)   | Enable when service images are available |
| `showDescription` | `true`  | Description paragraph       |                                          |
| `showCta`         | `true`  | "Learn more →" link         | Only renders if `services[].href` is set |
| `showBadge`       | `false` | Badge pill on card          | Enable when badges are populated         |

#### Layout Params

| Param        | Values                                          | Default     | Effect             |
| ------------ | ----------------------------------------------- | ----------- | ------------------ |
| `columns`    | `2 \| 3 \| 4`                                   | `3`         | Grid column count  |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"surface"` | Section background |

#### Content Constraints

| Field                    | Constraint    | Reason                                            |
| ------------------------ | ------------- | ------------------------------------------------- |
| `services[]`             | 2–8 items     | Grid becomes too sparse at 1 or too dense above 8 |
| `services[].description` | max 200 chars | Card heights diverge badly above this length      |

#### Interaction States

| Element            | Hover             | Focus                                     | Active |
| ------------------ | ----------------- | ----------------------------------------- | ------ |
| Card container     | `hover:shadow-md` | —                                         | —      |
| "Learn more" `<a>` | `hover:underline` | `focus-visible:ring-2 ring-brand-primary` | —      |

#### Animation

Recommended preset: `subtle`. Cards benefit from a staggered fade-up entrance.

#### Example JSON payload

```json
{
  "heading": "Our Plumbing Services",
  "subheading": "Residential and commercial plumbing across Greater London.",
  "services": [
    {
      "title": "Boiler Installation",
      "description": "Gas Safe certified boiler fitting and commissioning.",
      "icon": "🔥",
      "href": "/services/boiler-installation"
    },
    {
      "title": "Emergency Callouts",
      "description": "24/7 emergency plumbing, 1-hour response time.",
      "icon": "⚡",
      "href": "/services/emergency"
    },
    {
      "title": "Drain Unblocking",
      "description": "High-pressure jetting and CCTV drain surveys.",
      "icon": "🔧",
      "href": "/services/drains"
    }
  ]
}
```

---

### FeatureGrid ✓

**Status:** Built  
**Use when:** Highlighting benefits, USPs, or differentiators as icon + title + description cards  
**Page types:** home, about, service-detail

#### Data Fields

| Field                    | Type            | Required | Default | Constraints          | Description                                                        |
| ------------------------ | --------------- | -------- | ------- | -------------------- | ------------------------------------------------------------------ |
| `heading`                | `string`        | no       | —       | max 80 chars         | Section heading (`<h2>`)                                           |
| `intro`                  | `string`        | no       | —       | max 200 chars        | Section intro paragraph (note: field is `intro`, not `subheading`) |
| `features`               | `FeatureItem[]` | yes      | `[]`    | 2–9 items            | Array of feature cards                                             |
| `features[].title`       | `string`        | yes      | —       | max 60 chars         | Feature title (`<h3>`)                                             |
| `features[].description` | `string`        | no       | —       | max 200 chars        | Feature description                                                |
| `features[].icon`        | `string`        | no       | —       | single emoji or char | Icon displayed in circle above title                               |

> **Note:** The intro/subheading field is named `intro`, not `subheading`. This is different from other components — use exactly `d.intro` not `d.subheading`.

#### Slots

| Slot                 | Default | Controls                        | Notes                                               |
| -------------------- | ------- | ------------------------------- | --------------------------------------------------- |
| `showSectionHeading` | `true`  | Section `<h2>` heading          | Slot name uses `SectionHeading`, not just `Heading` |
| `showSectionIntro`   | `true`  | Section intro paragraph         | Slot name uses `SectionIntro`, not `SubHeading`     |
| `showIcons`          | `true`  | Icon circle above feature title |                                                     |
| `showDescriptions`   | `true`  | Description paragraphs          |                                                     |

#### Layout Params

| Param        | Values                                          | Default     | Effect             |
| ------------ | ----------------------------------------------- | ----------- | ------------------ |
| `columns`    | `2 \| 3 \| 4`                                   | `3`         | Grid column count  |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"surface"` | Section background |

#### Content Constraints

| Field        | Constraint | Reason                                                               |
| ------------ | ---------- | -------------------------------------------------------------------- |
| `features[]` | 2–9 items  | Best when count is divisible by column count (2,3,4,6,8,9 for 3-col) |

#### Interaction States

All elements static (no links). No interactive states beyond accessibility baseline.

#### Animation

Recommended preset: `subtle`. Grid items stagger nicely.

#### Example JSON payload

```json
{
  "heading": "Why Choose FastFlo?",
  "intro": "Trusted by 4,000+ London homes and businesses since 2008.",
  "features": [
    {
      "title": "Gas Safe Registered",
      "description": "All engineers fully certified and accredited.",
      "icon": "🔒"
    },
    {
      "title": "Same-Day Service",
      "description": "Most jobs completed the day you call.",
      "icon": "⚡"
    },
    {
      "title": "Transparent Pricing",
      "description": "No hidden call-out fees — fixed quotes upfront.",
      "icon": "💷"
    }
  ]
}
```

---

### TestimonialGrid ✓

**Status:** Built  
**Use when:** Social proof — showing customer reviews, ratings, and quotes  
**Page types:** home, about, service-detail, location-detail

#### Data Fields

| Field                           | Type                | Required | Default | Constraints    | Description                     |
| ------------------------------- | ------------------- | -------- | ------- | -------------- | ------------------------------- |
| `heading`                       | `string`            | no       | —       | max 80 chars   | Section heading (`<h2>`)        |
| `subheading`                    | `string`            | no       | —       | max 160 chars  | Section intro paragraph         |
| `testimonials`                  | `TestimonialItem[]` | yes      | `[]`    | 2–9 items      | Array of testimonial cards      |
| `testimonials[].name`           | `string`            | yes      | —       | max 60 chars   | Reviewer name                   |
| `testimonials[].text`           | `string`            | yes      | —       | max 400 chars  | Review quote text               |
| `testimonials[].location`       | `string`            | no       | —       | max 60 chars   | Reviewer location               |
| `testimonials[].rating`         | `number`            | no       | —       | 1–5            | Star rating                     |
| `testimonials[].title`          | `string`            | no       | —       | max 80 chars   | Review headline                 |
| `testimonials[].date`           | `string`            | no       | —       | display string | Review date (e.g. "March 2025") |
| `testimonials[].avatarInitials` | `string`            | no       | —       | 1–2 chars      | Avatar initials (e.g. "JT")     |

#### Slots

| Slot             | Default | Controls               | Notes                                   |
| ---------------- | ------- | ---------------------- | --------------------------------------- |
| `showStars`      | `true`  | Star rating row        | Only renders if `rating` is set         |
| `showDate`       | `false` | Review date            | Off by default                          |
| `showAvatar`     | `true`  | Initials avatar circle | Only renders if `avatarInitials` is set |
| `showAuthorName` | `true`  | Author name            |                                         |
| `showLocation`   | `true`  | Author location        | Only renders if `location` is set       |
| `showTitle`      | `false` | Review headline        | Off by default                          |

#### Layout Params

| Param        | Values                                          | Default     | Effect             |
| ------------ | ----------------------------------------------- | ----------- | ------------------ |
| `columns`    | `1 \| 2 \| 3`                                   | `2`         | Grid column count  |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"surface"` | Section background |

#### Content Constraints

| Field                 | Constraint    | Reason                                                                                   |
| --------------------- | ------------- | ---------------------------------------------------------------------------------------- |
| `testimonials[].text` | max 400 chars | Card height divergence at longer quotes                                                  |
| `testimonials[]`      | 2–9 items     | Odd counts work in 2-col but look unbalanced in 3-col — prefer multiples of column count |

#### Interaction States

Cards are static. No interactive states.

#### Animation

Recommended preset: `subtle`.

#### Example JSON payload

```json
{
  "heading": "What Our Customers Say",
  "subheading": "4.9 stars across 200+ Google reviews.",
  "testimonials": [
    {
      "name": "James T.",
      "location": "Hackney",
      "rating": 5,
      "text": "FastFlo fixed our boiler on Christmas Eve. Incredible service, couldn't recommend more.",
      "avatarInitials": "JT"
    },
    {
      "name": "Sarah M.",
      "location": "Islington",
      "rating": 5,
      "text": "Same-day drain unblock. Engineer was professional, tidy, and explained everything.",
      "avatarInitials": "SM"
    }
  ]
}
```

---

### StatsStrip ✓

**Status:** Built  
**Use when:** Horizontal social proof strip — key metrics, achievements, or milestones  
**Page types:** home, about, service-detail

#### Data Fields

| Field                 | Type         | Required | Default | Constraints   | Description                                      |
| --------------------- | ------------ | -------- | ------- | ------------- | ------------------------------------------------ |
| `stats`               | `StatItem[]` | yes      | `[]`    | 2–6 items     | Array of stat entries                            |
| `stats[].value`       | `string`     | yes      | —       | max 12 chars  | The headline number/metric (e.g. "4.9★", "24/7") |
| `stats[].label`       | `string`     | no       | —       | max 40 chars  | Label below value (e.g. "Google Rating")         |
| `stats[].description` | `string`     | no       | —       | max 100 chars | Optional supporting text                         |

> **Note:** StatsStrip has no top-level `heading` or `subheading` field — it is a strip of numbers only. Use a CTASection or ContentSection above it if a heading is needed.

#### Slots

| Slot              | Default | Controls                        | Notes          |
| ----------------- | ------- | ------------------------------- | -------------- |
| `showLabel`       | `true`  | Label below stat value          |                |
| `showDescription` | `false` | Description below label         | Off by default |
| `showDividers`    | `true`  | Vertical dividers between stats |                |

#### Layout Params

| Param        | Values                                          | Default      | Effect                                              |
| ------------ | ----------------------------------------------- | ------------ | --------------------------------------------------- |
| `columns`    | `3 \| 4`                                        | `4`          | Grid column count. Use 3 for 3 stats, 4 for 4 stats |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"surface"`  | Section background                                  |
| `paddingY`   | `"compact" \| "standard" \| "spacious"`         | `"standard"` | Vertical padding                                    |

#### Content Constraints

| Field                             | Constraint                                             | Reason                                        |
| --------------------------------- | ------------------------------------------------------ | --------------------------------------------- |
| `stats[]`                         | 2–6 items                                              | More than 6 wraps to 2 rows at most viewports |
| `stats[].value`                   | max 12 chars                                           | Truncates in grid cell above this length      |
| Use `columns` to match stat count | Use `columns: 3` for 3 stats, `columns: 4` for 4 stats | Avoid empty grid cells                        |

#### Interaction States

Static — no interactive states.

#### Animation

Recommended preset: `subtle` or count-up animation (future).

#### Example JSON payload

```json
{
  "stats": [
    { "value": "15+", "label": "Years Experience" },
    { "value": "4,000+", "label": "Jobs Completed" },
    { "value": "4.9★", "label": "Google Rating" },
    { "value": "24/7", "label": "Emergency Cover" }
  ]
}
```

---

### CTASection ✓

**Status:** Built  
**Use when:** Full-width conversion band — typically before footer, between major sections, or after a service description  
**Page types:** home, service-detail, location-detail, about, contact

#### Data Fields

| Field              | Type     | Required | Default | Constraints   | Description                                                                          |
| ------------------ | -------- | -------- | ------- | ------------- | ------------------------------------------------------------------------------------ |
| `heading`          | `string` | yes      | —       | max 80 chars  | Main CTA heading (`<h2>`)                                                            |
| `subheading`       | `string` | no       | —       | max 200 chars | Supporting text below heading                                                        |
| `primaryCtaText`   | `string` | no       | —       | max 40 chars  | Primary button label                                                                 |
| `primaryCtaHref`   | `string` | no       | `"#"`   | valid path    | Primary button destination                                                           |
| `secondaryCtaText` | `string` | no       | —       | max 40 chars  | Secondary button label                                                               |
| `secondaryCtaHref` | `string` | no       | `"#"`   | valid path    | Secondary button destination                                                         |
| `trustLine`        | `string` | no       | —       | max 100 chars | Small reassurance text below buttons (e.g. "No obligation — free quote in 24 hours") |

#### Slots

| Slot               | Default | Controls               | Notes          |
| ------------------ | ------- | ---------------------- | -------------- |
| `showSubheading`   | `true`  | Subheading paragraph   |                |
| `showPrimaryCta`   | `true`  | Primary CTA button     |                |
| `showSecondaryCta` | `false` | Secondary CTA button   | Off by default |
| `showTrustLine`    | `false` | Trust reassurance text | Off by default |

#### Layout Params

| Param        | Values                                          | Default     | Effect                                                   |
| ------------ | ----------------------------------------------- | ----------- | -------------------------------------------------------- |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"surface"` | Section background                                       |
| `align`      | `"left" \| "center"`                            | `"center"`  | Content alignment (right not supported — would look odd) |

#### Content Constraints

| Field       | Constraint    | Reason                                               |
| ----------- | ------------- | ---------------------------------------------------- |
| `heading`   | max 80 chars  | CTAs should be punchy; wrapping loses impact         |
| `trustLine` | max 100 chars | Longer text undermines the terse reassurance purpose |

#### Interaction States

| Element             | Hover                          | Focus                  | Active            |
| ------------------- | ------------------------------ | ---------------------- | ----------------- |
| Primary CTA `<a>`   | `hover:bg-brand-primary-hover` | `focus-visible:ring-2` | `active:scale-95` |
| Secondary CTA `<a>` | `hover:bg-brand-primary/10`    | `focus-visible:ring-2` | `active:scale-95` |

#### Animation

Recommended preset: `energetic` — CTAs are conversion moments, motion should be assertive.

#### Example JSON payload

```json
{
  "heading": "Need a Plumber Today?",
  "subheading": "We cover all of Greater London — same-day appointments available.",
  "primaryCtaText": "Get a Free Quote",
  "primaryCtaHref": "/contact",
  "secondaryCtaText": "Call 020 7123 4567",
  "secondaryCtaHref": "tel:02071234567",
  "trustLine": "No call-out fee · Gas Safe registered · 1-hour response"
}
```

---

### ContentSection ✓

**Status:** Built  
**Use when:** Flexible prose + optional image block — "About Us" narrative, service description body, why-choose-us section  
**Page types:** home, about, service-detail, location-detail

#### Data Fields

| Field        | Type       | Required | Default | Constraints         | Description                                                                                       |
| ------------ | ---------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| `heading`    | `string`   | no       | —       | max 80 chars        | Section heading (`<h2>`)                                                                          |
| `subheading` | `string`   | no       | —       | max 60 chars        | Eyebrow/subheading above heading (note: this is the eyebrow-style label, not a paragraph subhead) |
| `body`       | `string`   | no       | —       | max 600 chars       | Main prose paragraph                                                                              |
| `image`      | `string`   | no       | —       | URL, 16:9 preferred | Image (only shown when `showImage` slot is `true`)                                                |
| `ctaText`    | `string`   | no       | —       | max 40 chars        | CTA button label                                                                                  |
| `ctaHref`    | `string`   | no       | `"#"`   | valid path          | CTA button destination                                                                            |
| `listItems`  | `string[]` | no       | `[]`    | 2–10 items          | Checkmark list items                                                                              |

> **Note:** `subheading` in ContentSection renders as an eyebrow label (small caps, brand colour) above the heading — not a paragraph subheading. If you need a paragraph below the heading, use the `body` field.

#### Slots

| Slot             | Default | Controls                    | Notes                                     |
| ---------------- | ------- | --------------------------- | ----------------------------------------- |
| `showSubheading` | `true`  | Eyebrow label above heading |                                           |
| `showImage`      | `false` | Image (split or below text) | Off by default — enable when image is set |
| `showCta`        | `false` | CTA button                  | Off by default                            |
| `showList`       | `false` | Checkmark list              | Off by default                            |

#### Layout Params

| Param        | Values                                          | Default     | Effect                                                                       |
| ------------ | ----------------------------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `align`      | `"left" \| "center" \| "split"`                 | `"left"`    | `split` = two-column grid, text left + image right; `center` = centred prose |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"surface"` | Section background                                                           |
| `fullBleed`  | `boolean`                                       | `false`     | When `true`, applies `min-h-[50vh]`                                          |

#### Content Constraints

| Field         | Constraint                                                       | Reason                                                                                                |
| ------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `body`        | max 600 chars                                                    | Longer prose suits TextSection (which has article wrapper + ToC)                                      |
| `listItems[]` | 2–10 items                                                       | More than 10 looks like a spec sheet — use ContentSection for structured lists, FAQ component for Q&A |
| `image`       | Only useful when `layout.align === "split"` or `showImage: true` | Image in `center` layout stacks below text — can look odd                                             |

#### Interaction States

| Element   | Hover                          | Focus                  | Active            |
| --------- | ------------------------------ | ---------------------- | ----------------- |
| CTA `<a>` | `hover:bg-brand-primary-hover` | `focus-visible:ring-2` | `active:scale-95` |

#### Animation

Recommended preset: `subtle`.

#### Example JSON payload

```json
{
  "heading": "Plumbing & Heating Since 2008",
  "subheading": "About FastFlo",
  "body": "FastFlo was founded in East London by two Gas Safe engineers who were tired of seeing customers overcharged by unaccountable firms. Today we're a team of 12, covering all 32 London boroughs with honest pricing and fast response times.",
  "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  "ctaText": "Meet the Team",
  "ctaHref": "/about",
  "listItems": [
    "All engineers Gas Safe registered",
    "Fixed pricing — no hidden call-out fees",
    "1-hour emergency response"
  ]
}
```

---

### PortfolioGrid ◐

**Status:** Documented, not built  
**Use when:** Showcasing completed projects, case studies, or work samples  
**Page types:** projects, home, about

#### Data Fields

| Field                      | Type            | Required | Default | Constraints    | Description                          |
| -------------------------- | --------------- | -------- | ------- | -------------- | ------------------------------------ |
| `heading`                  | `string`        | yes      | —       | max 80 chars   | Section heading                      |
| `subheading`               | `string`        | no       | —       | max 160 chars  | Section intro                        |
| `projects`                 | `ProjectItem[]` | yes      | —       | 3–12 items     | Array of project tiles               |
| `projects[].title`         | `string`        | yes      | —       | max 80 chars   | Project title                        |
| `projects[].description`   | `string`        | no       | —       | max 200 chars  | Project description                  |
| `projects[].image`         | `string`        | yes      | —       | URL, 16:9      | Project image                        |
| `projects[].category`      | `string`        | no       | —       | max 40 chars   | Project category (e.g. "Shop Front") |
| `projects[].href`          | `string`        | no       | —       | valid path     | Project detail page                  |
| `projects[].completedDate` | `string`        | no       | —       | display string | Completion date                      |

#### Slots

| Slot               | Default | Controls                         |
| ------------------ | ------- | -------------------------------- |
| `showDescription`  | `true`  | Description below title          |
| `showCategory`     | `true`  | Category badge                   |
| `showDate`         | `false` | Completion date                  |
| `showCta`          | `true`  | "View project" link              |
| `filterByCategory` | `false` | Client-side category filter tabs |

#### Layout Params

| Param        | Values                                          | Default     |
| ------------ | ----------------------------------------------- | ----------- |
| `columns`    | `2 \| 3 \| 4`                                   | `3`         |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"surface"` |

#### Content Constraints

- Images must be landscape 16:9
- 3–12 projects; fewer than 3 looks thin, more than 12 needs pagination

---

### ContactFormSection ◐

**Status:** Documented, not built  
**Use when:** Contact page or inline enquiry form  
**Page types:** contact, home (inline), service-detail

#### Data Fields

| Field                   | Type                                                   | Required | Default          | Constraints            | Description                            |
| ----------------------- | ------------------------------------------------------ | -------- | ---------------- | ---------------------- | -------------------------------------- |
| `heading`               | `string`                                               | yes      | —                | max 80 chars           | Section heading                        |
| `subheading`            | `string`                                               | no       | —                | max 160 chars          | Section intro                          |
| `formFields`            | `FormField[]`                                          | yes      | —                | 2–10 fields            | Form field definitions                 |
| `formFields[].label`    | `string`                                               | yes      | —                | max 60 chars           | Field label                            |
| `formFields[].type`     | `"text" \| "email" \| "tel" \| "textarea" \| "select"` | yes      | —                | —                      | Input type                             |
| `formFields[].required` | `boolean`                                              | yes      | —                | —                      | Whether field is required              |
| `formFields[].options`  | `string[]`                                             | no       | —                | Used for `select` type | Dropdown options                       |
| `submitLabel`           | `string`                                               | no       | `"Send Message"` | max 40 chars           | Submit button label                    |
| `mapEmbedUrl`           | `string`                                               | no       | —                | Google Maps embed URL  | Map embed (shown when `showMap: true`) |
| `address`               | `string`                                               | no       | —                | max 200 chars          | Business address                       |
| `phone`                 | `string`                                               | no       | —                | valid phone            | Click-to-call phone number             |
| `email`                 | `string`                                               | no       | —                | valid email            | Email address                          |
| `openingHours`          | `string[]`                                             | no       | —                | max 7 items            | Opening hours lines                    |

#### Slots

| Slot               | Default | Controls          |
| ------------------ | ------- | ----------------- |
| `showMap`          | `false` | Google Maps embed |
| `showAddress`      | `true`  | Address block     |
| `showPhone`        | `true`  | Phone number      |
| `showEmail`        | `true`  | Email address     |
| `showOpeningHours` | `true`  | Opening hours     |
| `showSubheading`   | `true`  | Section intro     |

#### Layout Params

| Param        | Values                                          | Default     |
| ------------ | ----------------------------------------------- | ----------- | ---------------------------------- |
| `align`      | `"split" \| "stacked"`                          | `"stacked"` | `split` = form left, details right |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"surface"` |

---

### BlogGrid ◐

**Status:** Documented, not built  
**Use when:** Blog index, recent articles list, or news section  
**Page types:** blog-list, home

#### Data Fields

| Field              | Type         | Required | Default | Constraints    | Description         |
| ------------------ | ------------ | -------- | ------- | -------------- | ------------------- |
| `heading`          | `string`     | yes      | —       | max 80 chars   | Section heading     |
| `subheading`       | `string`     | no       | —       | max 160 chars  | Section intro       |
| `posts`            | `PostItem[]` | yes      | —       | 3–12 items     | Array of post cards |
| `posts[].title`    | `string`     | yes      | —       | max 100 chars  | Post title          |
| `posts[].excerpt`  | `string`     | no       | —       | max 160 chars  | Post excerpt        |
| `posts[].image`    | `string`     | no       | —       | URL, 16:9      | Post image          |
| `posts[].author`   | `string`     | no       | —       | max 60 chars   | Author name         |
| `posts[].date`     | `string`     | no       | —       | display string | Publication date    |
| `posts[].category` | `string`     | no       | —       | max 40 chars   | Post category       |
| `posts[].href`     | `string`     | yes      | —       | valid path     | Link to post        |

#### Slots

| Slot           | Default | Controls         |
| -------------- | ------- | ---------------- |
| `showExcerpt`  | `true`  | Excerpt text     |
| `showAuthor`   | `false` | Author name      |
| `showDate`     | `true`  | Publication date |
| `showCategory` | `true`  | Category badge   |
| `showImage`    | `true`  | Post image       |

#### Layout Params

| Param        | Values                                          | Default     |
| ------------ | ----------------------------------------------- | ----------- |
| `columns`    | `2 \| 3`                                        | `3`         |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"surface"` |

#### Content Constraints

- excerpt max 160 chars (matches meta description length)
- 3–12 posts; more requires pagination

---

### AccordionSection ◐

**Status:** Documented, not built  
**Use when:** FAQ, expandable Q&A, or any list of questions with detailed answers  
**Page types:** service-detail, location-detail, home, about, contact

#### Data Fields

| Field              | Type              | Required | Default | Constraints   | Description                      |
| ------------------ | ----------------- | -------- | ------- | ------------- | -------------------------------- |
| `heading`          | `string`          | yes      | —       | max 80 chars  | Section heading                  |
| `subheading`       | `string`          | no       | —       | max 160 chars | Section intro                    |
| `items`            | `AccordionItem[]` | yes      | —       | 3–20 items    | Q&A pairs                        |
| `items[].question` | `string`          | yes      | —       | max 120 chars | Question / accordion trigger     |
| `items[].answer`   | `string`          | yes      | —       | max 800 chars | Answer / accordion panel content |

#### Slots

| Slot             | Default | Controls                                                          |
| ---------------- | ------- | ----------------------------------------------------------------- |
| `showSubheading` | `true`  | Section intro                                                     |
| `allowMultiOpen` | `false` | Allow multiple items open at once (default: close others on open) |

#### Layout Params

| Param        | Values                                          | Default     |
| ------------ | ----------------------------------------------- | ----------- | ----------------- |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"surface"` |
| `maxWidth`   | `"prose" \| "wide" \| "full"`                   | `"prose"`   | Content max-width |

#### Content Constraints

- 3–20 items; fewer than 3 is better as inline text; more than 20 is overwhelming
- `items[].question` max 120 chars — longer questions wrap badly in accordion trigger

---

### LogoStrip ◐

**Status:** Documented, not built  
**Use when:** Showing partner logos, client logos, certification badges, or accreditation marks  
**Page types:** home, about

#### Data Fields

| Field          | Type         | Required | Default | Constraints  | Description     |
| -------------- | ------------ | -------- | ------- | ------------ | --------------- |
| `heading`      | `string`     | no       | —       | max 60 chars | Section heading |
| `logos`        | `LogoItem[]` | yes      | —       | 4–12 items   | Logo entries    |
| `logos[].src`  | `string`     | yes      | —       | URL          | Logo image URL  |
| `logos[].alt`  | `string`     | yes      | —       | max 60 chars | Logo alt text   |
| `logos[].href` | `string`     | no       | —       | valid URL    | Optional link   |

#### Slots

| Slot          | Default | Controls                                                |
| ------------- | ------- | ------------------------------------------------------- |
| `showHeading` | `false` | Section heading                                         |
| `linkLogos`   | `false` | Wrap logos in `<a>` tags (requires `href` on each logo) |

#### Layout Params

| Param        | Values                                          | Default     |
| ------------ | ----------------------------------------------- | ----------- |
| `columns`    | `4 \| 6 \| 8`                                   | `6`         |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"subtle"`  |
| `paddingY`   | `"compact" \| "standard" \| "spacious"`         | `"compact"` |

#### Content Constraints

- 4–12 logos; all logos should be the same visual height
- SVG or PNG with transparent background preferred; avoid white-background PNGs on non-white surfaces

---

### PricingTable ◐

**Status:** Documented, not built  
**Use when:** Comparing service tiers, packages, or pricing options  
**Page types:** home, about, service-detail, contact

#### Data Fields

| Field                 | Type            | Required | Default | Constraints   | Description                            |
| --------------------- | --------------- | -------- | ------- | ------------- | -------------------------------------- |
| `heading`             | `string`        | yes      | —       | max 80 chars  | Section heading                        |
| `subheading`          | `string`        | no       | —       | max 160 chars | Section intro                          |
| `tiers`               | `PricingTier[]` | yes      | —       | 2–4 tiers     | Pricing tier cards                     |
| `tiers[].name`        | `string`        | yes      | —       | max 40 chars  | Tier name                              |
| `tiers[].price`       | `string`        | yes      | —       | max 20 chars  | Price (e.g. "£99", "From £299")        |
| `tiers[].period`      | `string`        | no       | —       | max 20 chars  | Billing period (e.g. "/month", "/job") |
| `tiers[].description` | `string`        | no       | —       | max 160 chars | Tier description                       |
| `tiers[].features`    | `string[]`      | yes      | —       | 2–8 items     | Feature list                           |
| `tiers[].ctaText`     | `string`        | yes      | —       | max 40 chars  | CTA button label                       |
| `tiers[].ctaHref`     | `string`        | yes      | —       | valid path    | CTA destination                        |
| `tiers[].highlighted` | `boolean`       | no       | `false` | —             | Highlights this tier as recommended    |

#### Slots

| Slot              | Default | Controls                   |
| ----------------- | ------- | -------------------------- |
| `showSubheading`  | `true`  | Section intro              |
| `showDescription` | `true`  | Tier description paragraph |
| `showPeriod`      | `true`  | Billing period text        |

#### Layout Params

| Param        | Values                                          | Default     |
| ------------ | ----------------------------------------------- | ----------- |
| `columns`    | `2 \| 3`                                        | `3`         |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"surface"` |

#### Content Constraints

- 2–4 tiers
- `features[]` max 8 items per tier; more creates excessive card height divergence

---

### HeaderSection ◐

**Status:** Documented, not built

> **Architecture note:** HeaderSection is NOT a page section. It is configured via `headerConfig` at the root of `SiteCompositionConfig` and rendered by `app/layout.tsx`. This keeps it DRY (one config for all pages) and out of the `ComponentName` union (prevents AI inserting it into per-page section lists).

**Use when:** Every site — site-wide navigation and branding

#### Config Fields

| Field                         | Type                                                  | Required | Default     | Description                                  |
| ----------------------------- | ----------------------------------------------------- | -------- | ----------- | -------------------------------------------- |
| `navStyle`                    | `"inline" \| "hamburger-only" \| "hamburger-desktop"` | no       | `"inline"`  | Nav link display strategy                    |
| `appearance`                  | `"light" \| "dark" \| "blur"`                         | no       | `"light"`   | Header surface colour                        |
| `sticky`                      | `boolean`                                             | no       | `true`      | Header stays at top on scroll                |
| `transparentOnScroll`         | `boolean`                                             | no       | `false`     | Transparent at page top, solid when scrolled |
| `mobileBehaviour`             | `"overlay" \| "drawer-left" \| "drawer-right"`        | no       | `"overlay"` | Mobile menu open mode                        |
| `megaMenu`                    | `boolean`                                             | no       | `false`     | Enables multi-column dropdown                |
| `logo.position`               | `"left" \| "center"`                                  | no       | `"left"`    | Logo alignment                               |
| `logo.src`                    | `string`                                              | yes      | —           | Logo image URL                               |
| `logo.alt`                    | `string`                                              | yes      | —           | Logo alt text                                |
| `logo.width`                  | `number`                                              | no       | `160`       | Logo width in px                             |
| `logo.height`                 | `number`                                              | no       | `48`        | Logo height in px                            |
| `cta.label`                   | `string`                                              | no       | —           | Header CTA button label                      |
| `cta.href`                    | `string`                                              | no       | —           | Header CTA button destination                |
| `phone.display`               | `string`                                              | no       | —           | Formatted phone number                       |
| `phone.tel`                   | `string`                                              | no       | —           | Click-to-call href                           |
| `announcementBar.text`        | `string`                                              | no       | —           | Banner text above header                     |
| `announcementBar.href`        | `string`                                              | no       | —           | Banner link                                  |
| `announcementBar.dismissible` | `boolean`                                             | no       | `true`      | Dismissible by user                          |
| `navItems`                    | `NavItem[]`                                           | no       | `[]`        | Navigation items                             |
| `navItems[].label`            | `string`                                              | yes      | —           | Nav link label                               |
| `navItems[].href`             | `string`                                              | yes      | —           | Nav link destination                         |
| `navItems[].children`         | `NavItem[]`                                           | no       | —           | Dropdown items                               |
| `navItems[].columns`          | `number`                                              | no       | —           | Mega-menu column count                       |
| `navItems[].megaImage`        | `string`                                              | no       | —           | Feature image URL for mega-menu              |

#### navStyle values

| Value               | Behaviour                                                    |
| ------------------- | ------------------------------------------------------------ |
| `inline`            | Nav links visible on desktop; hamburger menu on mobile       |
| `hamburger-only`    | Hamburger on all viewports                                   |
| `hamburger-desktop` | Hamburger even on desktop (rare — for creative/agency sites) |

#### States

| State                 | Trigger                                                      |
| --------------------- | ------------------------------------------------------------ |
| Default/solid         | On load, header is solid                                     |
| Transparent-at-top    | When `transparentOnScroll: true` and scroll position = 0     |
| Sticky-scrolled       | When `sticky: true` and user scrolls down                    |
| Mobile-closed         | Default on mobile                                            |
| Mobile-overlay-open   | After hamburger tap, `mobileBehaviour: "overlay"`            |
| Mobile-drawer-open    | After hamburger tap, `mobileBehaviour: "drawer-left\|right"` |
| Dropdown-open         | On nav item with `children` — mouse enter or tap             |
| Mega-menu-open        | On nav item with `megaMenu: true` — shows multi-column panel |
| With-announcement-bar | When `announcementBar` is set — header shifts down           |

---

### FooterSection ◐

**Status:** Documented, not built

> **Architecture note:** Same as HeaderSection — configured via `footerConfig` at root of `SiteCompositionConfig`, rendered by `app/layout.tsx`.

**Use when:** Every site — site-wide footer with navigation, contact, and legal

#### Config Fields

| Field                    | Type                          | Required | Description            |
| ------------------------ | ----------------------------- | -------- | ---------------------- |
| `logo.src`               | `string`                      | yes      | Footer logo URL        |
| `logo.alt`               | `string`                      | yes      | Logo alt text          |
| `tagline`                | `string`                      | no       | Strapline below logo   |
| `columns`                | `FooterColumn[]`              | no       | Link group columns     |
| `columns[].heading`      | `string`                      | yes      | Column heading         |
| `columns[].links`        | `Array<{label, href}>`        | yes      | Column links           |
| `contact.phone`          | `string`                      | no       | Phone (display)        |
| `contact.email`          | `string`                      | no       | Email address          |
| `contact.address`        | `string`                      | no       | Business address       |
| `contact.openingHours`   | `string[]`                    | no       | Hours lines            |
| `social`                 | `Array<{platform, href}>`     | no       | Social links           |
| `newsletter.heading`     | `string`                      | no       | Newsletter CTA heading |
| `newsletter.placeholder` | `string`                      | no       | Input placeholder      |
| `newsletter.buttonLabel` | `string`                      | no       | Submit label           |
| `legal.copyright`        | `string`                      | yes      | Copyright line         |
| `legal.links`            | `Array<{label, href}>`        | no       | Privacy, Terms, etc.   |
| `certifications`         | `Array<{name, icon?, href?}>` | no       | Accreditation marks    |
| `builtBy.name`           | `string`                      | no       | Agency/platform name   |
| `builtBy.url`            | `string`                      | no       | Agency URL             |

#### Slots

| Slot                 | Default | Controls                          |
| -------------------- | ------- | --------------------------------- |
| `showNewsletter`     | `false` | Newsletter signup form            |
| `showSocial`         | `true`  | Social media links                |
| `showCertifications` | `true`  | Certification/accreditation marks |
| `showAddress`        | `true`  | Business address                  |
| `showPhone`          | `true`  | Phone number                      |
| `showOpeningHours`   | `false` | Opening hours                     |
| `showBuiltBy`        | `true`  | "Built by" attribution            |

#### Layout Params

| Param        | Values                                          | Default     |
| ------------ | ----------------------------------------------- | ----------- | ---------------------------- |
| `columns`    | `2 \| 3 \| 4`                                   | `3`         | Number of link column groups |
| `background` | `"surface" \| "subtle" \| "inverse" \| "brand"` | `"inverse"` |

---

### TextSection ◐

**Status:** Documented, not built  
**Use when:** Long-form prose pages — privacy policy, terms and conditions, cookie policy, extended "About" narrative  
**Page types:** custom, about

> **Why not ContentSection?** TextSection needs a semantic `<article>` wrapper, a prose max-width constraint, a "last updated" metadata field, and an optional table of contents. ContentSection is for split content blocks with media, not long-form text.

#### Data Fields

| Field         | Type     | Required | Default | Constraints     | Description            |
| ------------- | -------- | -------- | ------- | --------------- | ---------------------- |
| `heading`     | `string` | yes      | —       | max 100 chars   | Article `<h1>`         |
| `subheading`  | `string` | no       | —       | max 200 chars   | Subtitle below heading |
| `body`        | `string` | yes      | —       | HTML/MDX prose  | Main article body      |
| `lastUpdated` | `string` | no       | —       | ISO date string | Last updated date      |

#### Slots

| Slot                  | Default | Controls            |
| --------------------- | ------- | ------------------- |
| `showHeading`         | `true`  | Article `<h1>`      |
| `showSubheading`      | `false` | Subtitle            |
| `showLastUpdated`     | `true`  | "Last updated" date |
| `showTableOfContents` | `false` | Auto-generated ToC  |

#### Layout Params

| Param      | Values                                  | Default      |
| ---------- | --------------------------------------- | ------------ | ------------------------------------------------------ |
| `align`    | `"left" \| "center"`                    | `"left"`     |                                                        |
| `maxWidth` | `"prose" \| "wide" \| "full"`           | `"prose"`    | `prose` = 65ch; `wide` = max-w-4xl; `full` = max-w-7xl |
| `paddingY` | `"compact" \| "standard" \| "spacious"` | `"standard"` |                                                        |

---

## Section 6: Appendix A — Header & Footer Config Schemas

> ⚠️ Proposed schema — not yet in codebase. Verify field names at implementation time.

```typescript
// PROPOSED — HeaderConfig
// Add to packages/component-composition/src/types.ts when Header is implemented

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  columns?: number;
  megaImage?: string;
}

interface AnnouncementBar {
  text: string;
  href?: string;
  dismissible?: boolean;
}

interface HeaderConfig {
  logo: {
    src: string;
    alt: string;
    position?: "left" | "center";
    width?: number;
    height?: number;
  };
  navStyle?: "inline" | "hamburger-only" | "hamburger-desktop";
  appearance?: "light" | "dark" | "blur";
  sticky?: boolean;
  transparentOnScroll?: boolean;
  mobileBehaviour?: "overlay" | "drawer-left" | "drawer-right";
  megaMenu?: boolean;
  cta?: { label: string; href: string };
  phone?: { display: string; tel: string };
  announcementBar?: AnnouncementBar;
  navItems?: NavItem[];
}

// PROPOSED — FooterConfig
interface FooterColumn {
  heading: string;
  links: Array<{ label: string; href: string }>;
}

interface FooterConfig {
  logo: { src: string; alt: string };
  tagline?: string;
  columns?: FooterColumn[];
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
    openingHours?: string[];
  };
  social?: Array<{ platform: string; href: string }>;
  newsletter?: {
    heading: string;
    placeholder?: string;
    buttonLabel?: string;
  };
  legal: {
    copyright: string;
    links?: Array<{ label: string; href: string }>;
  };
  certifications?: Array<{ name: string; icon?: string; href?: string }>;
  builtBy?: { name: string; url: string };
  slots?: {
    showNewsletter?: boolean;
    showSocial?: boolean;
    showCertifications?: boolean;
    showAddress?: boolean;
    showPhone?: boolean;
    showOpeningHours?: boolean;
    showBuiltBy?: boolean;
  };
  layout?: {
    columns?: 2 | 3 | 4;
    background?: "surface" | "subtle" | "inverse" | "brand";
  };
}

// PROPOSED — Extension to SiteCompositionConfig
// interface SiteCompositionConfig {
//   version: "1";
//   siteId: string;
//   headerConfig?: HeaderConfig;     // ADD
//   footerConfig?: FooterConfig;     // ADD
//   animationPreset?: "none" | "subtle" | "energetic";  // ADD
//   defaultSlots?: Record<string, Record<string, boolean>>;
//   pages: PageComposition[];
// }
```

---

## Section 7: Appendix B — Gap Component Schema Stubs

> ⚠️ Draft schema — verify field names against implementation before use.

### PortfolioGrid

```typescript
// DRAFT — PortfolioGrid
interface PortfolioGridData {
  heading: string;
  subheading?: string;
  projects: Array<{
    title: string;
    description?: string;
    image: string;
    category?: string;
    href?: string;
    completedDate?: string;
  }>;
}

// Zod (draft)
const PortfolioGridDataSchema = z.object({
  heading: z.string(),
  subheading: z.string().optional(),
  projects: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        image: z.string(),
        category: z.string().optional(),
        href: z.string().optional(),
        completedDate: z.string().optional(),
      })
    )
    .min(3)
    .max(12),
});
```

### ContactFormSection

```typescript
// DRAFT — ContactFormSection
interface FormField {
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required: boolean;
  options?: string[];
}

interface ContactFormSectionData {
  heading: string;
  subheading?: string;
  formFields: FormField[];
  submitLabel?: string;
  mapEmbedUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  openingHours?: string[];
}

// Zod (draft)
const ContactFormSectionDataSchema = z.object({
  heading: z.string(),
  subheading: z.string().optional(),
  formFields: z
    .array(
      z.object({
        label: z.string(),
        type: z.enum(["text", "email", "tel", "textarea", "select"]),
        required: z.boolean(),
        options: z.array(z.string()).optional(),
      })
    )
    .min(2)
    .max(10),
  submitLabel: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  openingHours: z.array(z.string()).max(7).optional(),
});
```

### BlogGrid

```typescript
// DRAFT — BlogGrid
interface BlogGridData {
  heading: string;
  subheading?: string;
  posts: Array<{
    title: string;
    excerpt?: string;
    image?: string;
    author?: string;
    date?: string;
    category?: string;
    href: string;
  }>;
}

// Zod (draft)
const BlogGridDataSchema = z.object({
  heading: z.string(),
  subheading: z.string().optional(),
  posts: z
    .array(
      z.object({
        title: z.string(),
        excerpt: z.string().max(160).optional(),
        image: z.string().optional(),
        author: z.string().optional(),
        date: z.string().optional(),
        category: z.string().optional(),
        href: z.string(),
      })
    )
    .min(3)
    .max(12),
});
```

### AccordionSection

```typescript
// DRAFT — AccordionSection
interface AccordionSectionData {
  heading: string;
  subheading?: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

// Zod (draft)
const AccordionSectionDataSchema = z.object({
  heading: z.string(),
  subheading: z.string().optional(),
  items: z
    .array(
      z.object({
        question: z.string().max(120),
        answer: z.string().max(800),
      })
    )
    .min(3)
    .max(20),
});
```

### LogoStrip

```typescript
// DRAFT — LogoStrip
interface LogoStripData {
  heading?: string;
  logos: Array<{
    src: string;
    alt: string;
    href?: string;
  }>;
}

// Zod (draft)
const LogoStripDataSchema = z.object({
  heading: z.string().optional(),
  logos: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
        href: z.string().optional(),
      })
    )
    .min(4)
    .max(12),
});
```

### PricingTable

```typescript
// DRAFT — PricingTable
interface PricingTableData {
  heading: string;
  subheading?: string;
  tiers: Array<{
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    ctaText: string;
    ctaHref: string;
    highlighted?: boolean;
  }>;
}

// Zod (draft)
const PricingTableDataSchema = z.object({
  heading: z.string(),
  subheading: z.string().optional(),
  tiers: z
    .array(
      z.object({
        name: z.string(),
        price: z.string(),
        period: z.string().optional(),
        description: z.string().optional(),
        features: z.array(z.string()).min(1).max(8),
        ctaText: z.string(),
        ctaHref: z.string(),
        highlighted: z.boolean().optional(),
      })
    )
    .min(2)
    .max(4),
});
```
