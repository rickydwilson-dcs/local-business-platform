# YOLO Implementation Brief: DJ Fox Visual Alignment — Test Site vs Production

**Branch:** `feature/dj-fox-composition-migration` (continue on existing branch)
**Session spec:** `output/sessions/2026-04/2026-04-19_dj-fox-visual-alignment/yolo-brief.md`
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

`sites/dj-fox-electrical-test/` renders all 15 routes but looks significantly different from djfoxelectrical.com. The composable components were built as generic theme-agnostic primitives and don't replicate the Orion theme's visual treatments: darker hero overlays, white stat values on dark sections, noise textures, custom service list layout, interactive location pills, and the "Why Choose Us" table-style grid. This brief runs a screenshot comparison first, then fixes config/component issues, then adds 3 new composables for the sections with no composable equivalent.

All work stays on `feature/dj-fox-composition-migration`. Do not create a new branch.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**.

---

## Pre-flight

```bash
git checkout feature/dj-fox-composition-migration
git pull
pnpm type-check   # must be clean before starting
```

Ensure the test site dev server is running on port 3001:

```bash
cd sites/dj-fox-electrical-test && npm run dev -- --port 3001
```

If `pnpm type-check` fails, STOP and report the errors.

---

## Phase 1: Screenshot visual comparison

**Goal:** Screenshot every page of both sites at 1280px and produce a structured findings report so Phase 5 fixes are driven by actual visual evidence, not assumptions.

**Model:** sonnet

Run `/pipeline.validate-site` comparing:

- Reference: `https://djfoxelectrical.com` (production)
- Test: `http://localhost:3001` (test site)

Pages to compare:
| Page | Reference URL | Test URL |
|------|--------------|---------|
| Home | `https://djfoxelectrical.com/` | `http://localhost:3001/` |
| About | `https://djfoxelectrical.com/about` | `http://localhost:3001/about` |
| Contact | `https://djfoxelectrical.com/contact` | `http://localhost:3001/contact` |
| Services | `https://djfoxelectrical.com/services` | `http://localhost:3001/services` |
| Service detail | `https://djfoxelectrical.com/services/emergency-callout` | `http://localhost:3001/services/emergency-callout` |
| Locations | `https://djfoxelectrical.com/locations` | `http://localhost:3001/locations` |
| Location detail | `https://djfoxelectrical.com/locations/eastbourne` | `http://localhost:3001/locations/eastbourne` |
| Reviews | `https://djfoxelectrical.com/reviews` | `http://localhost:3001/reviews` |
| Projects | `https://djfoxelectrical.com/projects` | `http://localhost:3001/projects` |
| Blog | `https://djfoxelectrical.com/blog` | `http://localhost:3001/blog` |
| Pricing | `https://djfoxelectrical.com/pricing` | `http://localhost:3001/pricing` |
| Privacy | `https://djfoxelectrical.com/privacy-policy` | `http://localhost:3001/privacy-policy` |

Write findings to `output/sessions/2026-04/2026-04-19_dj-fox-visual-alignment/visual-comparison-findings.md`.

For each page: section-by-section diff, severity (cosmetic/structural), and which file to fix.

**No commit at end of this phase** — it's research only.

---

## Phase 2: Config and component colour/texture fixes

**Goal:** Fix the quick wins — wrong colors, missing noise texture, wrong CTA background — all without new components.

**Model:** sonnet

Read these files in parallel before editing:

- `packages/core-components/src/components/composable/stats-strip.tsx`
- `packages/core-components/src/components/composable/hero-section.tsx`
- `packages/core-components/src/components/composable/cta-section.tsx`
- `packages/core-components/src/components/composable/feature-grid.tsx`
- `sites/dj-fox-electrical-test/composition.json`

Spawn 4 agents in parallel (no file overlap):

---

**Agent 1 — stats-strip.tsx: white values on dark background**
model: sonnet

Fix: When `layout?.background === "inverse"`, the stat value text must be white (`text-surface-inverse-foreground`), not red (`text-brand-primary`). On all other backgrounds, keep `text-brand-primary`.

Current line (approx): `className="text-brand-primary text-4xl font-bold"`

Change to:

```tsx
className={`text-4xl font-bold ${layout?.background === "inverse" ? "text-surface-inverse-foreground" : "text-brand-primary"}`}
```

Also add `noise-overlay` to the section wrapper's className when `background === "inverse"`. The `noise-overlay` class is defined in `orion/globals.css` and inherited by the test site — just add it as a string concatenation.

---

**Agent 2 — hero-section.tsx: darker overlay + noise**
model: sonnet

Two changes in the `background === "image"` branch:

1. Change the overlay div from `bg-surface-inverse/75` to `bg-black/70` (matches production "darker" overlay).

2. Add `noise-overlay` class to the outer section wrapper when `background === "image"`.

---

**Agent 3 — cta-section.tsx + feature-grid.tsx: noise and text contrast**
model: sonnet

In `cta-section.tsx`:

- Add `noise-overlay` to section wrapper when `layout?.background === "inverse"`.
- Check subheading text: when `background === "inverse"`, subheading should use `text-surface-inverse-foreground` with reduced opacity or a muted class, not `text-surface-muted-foreground` (dark gray, invisible on dark). Read the file first to identify exact line.

In `feature-grid.tsx`:

- When `layout?.background === "inverse"`, feature description text must be visible. Change description `className` to use `text-surface-inverse-foreground opacity-80` instead of `text-surface-muted-foreground` when on inverse background.
- Add `noise-overlay` to section wrapper when `background === "inverse"`.

---

**Agent 4 — composition.json: CTA background fix**
model: haiku

In `sites/dj-fox-electrical-test/composition.json`, find the home page CTA section. Change its `layout.background` from `"brand"` to `"inverse"`.

Production uses `section-dark-accent` (dark with noise), not solid red. The `"inverse"` background + `noise-overlay` class (added by Agent 3's cta-section.tsx fix) will match.

---

After all 4 agents complete:

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add packages/core-components/src/components/composable/stats-strip.tsx \
        packages/core-components/src/components/composable/hero-section.tsx \
        packages/core-components/src/components/composable/cta-section.tsx \
        packages/core-components/src/components/composable/feature-grid.tsx \
        sites/dj-fox-electrical-test/composition.json
git commit -m "$(cat <<'EOF'
fix(dj-fox-test): visual alignment fixes — dark section contrast, overlays, noise

- StatsStrip: white values on inverse background (not red)
- HeroSection: bg-black/70 overlay (production "darker" level)
- CTASection + FeatureGrid: noise-overlay on inverse, text contrast fix
- composition.json: home CTA uses inverse background not brand

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Hero breadcrumbs slot

**Goal:** Add breadcrumbs support to `ComposableHeroSection` so non-home pages match the production `PageHeroImage` component which shows breadcrumbs below the hero.

**Model:** sonnet

Read in parallel:

- `packages/core-components/src/components/composable/hero-section.tsx`
- `packages/core-components/src/components/composable/hero-section.slots.ts`
- `sites/dj-fox-electrical-test/lib/page-data.ts`
- `sites/dj-fox-electrical-test/composition.json`

**Changes:**

1. `hero-section.slots.ts` — add `showBreadcrumbs: boolean` to `HeroSectionSlots` with default `false`.

2. `hero-section.tsx` — when `slots.showBreadcrumbs` is true and `data.breadcrumbs` is an array, render a breadcrumb bar. Place it inside the content wrapper (below the CTA buttons). Style: small text, muted white on dark/image backgrounds. Pattern:

   ```tsx
   {
     slots.showBreadcrumbs && Array.isArray(data.breadcrumbs) && (
       <nav aria-label="Breadcrumb" className="mt-4">
         <ol className="flex items-center gap-2 text-sm text-white/60">
           {(data.breadcrumbs as Array<{ label: string; href: string }>).map((crumb, i, arr) => (
             <li key={i} className="flex items-center gap-2">
               {i < arr.length - 1 ? (
                 <>
                   <a href={crumb.href} className="hover:text-white transition-colors">
                     {crumb.label}
                   </a>
                   <span aria-hidden="true">/</span>
                 </>
               ) : (
                 <span className="text-white/80">{crumb.label}</span>
               )}
             </li>
           ))}
         </ol>
       </nav>
     );
   }
   ```

   Apply the same breadcrumb block to both the `background === "image"` branch and the standard branch (adjusting text color: white/60 on dark, `text-surface-muted-foreground` on light).

3. `sites/dj-fox-electrical-test/composition.json` — for every non-home page hero section, add `"slots": { "showBreadcrumbs": true }`.

4. `sites/dj-fox-electrical-test/lib/page-data.ts` — add `breadcrumbs` array to the hero data for each non-home page type:
   - `about.hero.breadcrumbs: [{ label: "Home", href: "/" }, { label: "About Us", href: "/about" }]`
   - `contact.hero.breadcrumbs: [{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]`
   - `services.hero.breadcrumbs: [{ label: "Home", href: "/" }, { label: "Services", href: "/services" }]`
   - `locations.hero.breadcrumbs: [{ label: "Home", href: "/" }, { label: "Locations", href: "/locations" }]`
   - `reviews.hero.breadcrumbs: [{ label: "Home", href: "/" }, { label: "Reviews", href: "/reviews" }]`
   - `projects.hero.breadcrumbs: [{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }]`
   - `blog.hero.breadcrumbs: [{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }]`
   - `pricing.hero.breadcrumbs: [{ label: "Home", href: "/" }, { label: "Pricing", href: "/pricing" }]`

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add packages/core-components/src/components/composable/hero-section.tsx \
        packages/core-components/src/components/composable/hero-section.slots.ts \
        sites/dj-fox-electrical-test/composition.json \
        sites/dj-fox-electrical-test/lib/page-data.ts
git commit -m "$(cat <<'EOF'
feat(dj-fox-test): hero breadcrumbs slot for non-home pages

Adds showBreadcrumbs slot to ComposableHeroSection. All non-home pages
now show breadcrumbs below the hero text, matching production PageHeroImage.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: New composables — ServiceListSection, LocationPillsSection, WhyChooseUsSection

**Goal:** Build 3 new composables that replace the generic composable placeholders on the home page with layout structures matching production.

**Model:** sonnet (all)

Read these in parallel before any implementation:

- `packages/themes/orion/pages/home.tsx` (lines 69–205 — the services, locations, and why-choose-us sections)
- `packages/core-components/src/components/composable/service-cards.tsx` (reference for pattern)
- `packages/core-components/src/components/composable/feature-grid.tsx` (reference for pattern)
- `packages/component-composition/src/schemas.ts`
- `packages/component-composition/src/index.ts`
- `packages/core-components/src/index.ts`
- `sites/dj-fox-electrical-test/app/globals.css` (confirm `.location-pill`, `.location-pill-arrow` are present)

Spawn 3 agents in parallel for the 3 new components:

---

**Agent A — ServiceListSection**
model: sonnet
File: `packages/core-components/src/components/composable/service-list-section.tsx` (create new)

Match the production services section on home: 2-column layout — left sticky header, right list of services.

Props:

```ts
interface ServiceListSectionProps {
  layout?: { background?: string };
  data: Record<string, unknown>;
  className?: string;
}
```

Data shape: `data.heading`, `data.subheading`, `data.ctaText`, `data.ctaHref`, `data.services: Array<{ title, description, href }>`.

Render:

```tsx
<section className={`${bg} section`}>
  <div className="container-narrow">
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
      {/* Left: sticky header */}
      <div className="md:sticky md:top-8 md:self-start">
        <p className="text-brand-primary mb-3 text-sm font-semibold uppercase tracking-widest">
          What We Do
        </p>
        <h2 className="text-h2 mb-4">{heading}</h2>
        {subheading && <p className="text-surface-muted-foreground mb-6 text-lg">{subheading}</p>}
        {ctaText && ctaHref && (
          <a href={ctaHref} className="btn-secondary inline-flex items-center gap-2">
            {ctaText}
          </a>
        )}
      </div>
      {/* Right: service list */}
      <div className="divide-y divide-surface-border">
        {services.map((svc, i) => (
          <a
            key={i}
            href={svc.href}
            className="group flex items-center justify-between py-5 transition-colors hover:text-brand-primary"
          >
            <div>
              <h3 className="font-semibold">{svc.title}</h3>
              {svc.description && (
                <p className="text-surface-muted-foreground mt-1 text-sm">{svc.description}</p>
              )}
            </div>
            <svg
              className="h-5 w-5 flex-shrink-0 translate-x-0 text-surface-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-brand-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  </div>
</section>
```

Use standard background classes for `bg` (surface/subtle/inverse/brand).

---

**Agent B — LocationPillsSection**
model: sonnet
File: `packages/core-components/src/components/composable/location-pills-section.tsx` (create new)

Match the production service areas section: grid of location pills with hover animations.

The `.location-pill` and `.location-pill-arrow` CSS classes are defined in `orion/globals.css` (and inherited by the test site globals.css) — use them directly.

Props/data shape: `data.heading`, `data.subheading`, `data.locations: Array<{ slug, title, href? }>`.

Render:

```tsx
<section className={`${bg} section`}>
  <div className="container-narrow">
    {heading && (
      <div className="section-header">
        <p className="text-brand-primary mb-3 text-sm font-semibold uppercase tracking-widest">
          Coverage
        </p>
        <h2 className="text-h2">{heading}</h2>
        {subheading && <p className="text-surface-muted-foreground mt-4 text-lg">{subheading}</p>}
      </div>
    )}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {locations.map((loc, i) => (
        <a key={i} href={loc.href ?? `/locations/${loc.slug}`} className="location-pill">
          <span className="font-medium">{loc.title}</span>
          <svg
            className="location-pill-arrow h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      ))}
    </div>
  </div>
</section>
```

---

**Agent C — WhyChooseUsSection**
model: sonnet
File: `packages/core-components/src/components/composable/why-choose-us-section.tsx` (create new)

Match the production "Why Choose Us" section: dark inverse background, table-style grid of rows with dividers.

Data shape: `data.heading`, `data.brandName` (for red accent in heading), `data.features: Array<{ title, description, stat? }>`.

Render on dark background with `noise-overlay`:

```tsx
<section className="section-dark-accent noise-overlay" data-component="WhyChooseUsSection">
  <div className="container-narrow">
    <h2 className="text-h2 mb-12 text-white">
      {brandName && <span className="text-brand-primary">{brandName} </span>}
      {headingRest}
    </h2>
    <div className="divide-y divide-white/10">
      {features.map((feature, i) => (
        <div
          key={i}
          className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[2fr_3fr_1fr] md:items-center"
        >
          <h3 className="text-lg font-bold text-white">{feature.title}</h3>
          <p className="text-white/70 leading-relaxed">{feature.description}</p>
          {feature.stat && (
            <div className="text-right">
              <span className="text-brand-primary stat-value text-2xl font-bold">
                {feature.stat}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>
```

Note: `section-dark-accent` and `noise-overlay` are Orion globals.css classes — don't recreate them.

---

After all 3 agents complete, perform registration steps sequentially:

**Step R1 — schemas.ts:** Add 3 new schemas to the discriminated union:

```ts
export const ServiceListSectionSchema = z.object({
  type: z.literal("ServiceListSection"),
  dataKey: z.string(),
  layout: LayoutParamsSchema.pick({ background: true }).optional(),
});
export const LocationPillsSectionSchema = z.object({
  type: z.literal("LocationPillsSection"),
  dataKey: z.string(),
  layout: LayoutParamsSchema.pick({ background: true }).optional(),
});
export const WhyChooseUsSectionSchema = z.object({
  type: z.literal("WhyChooseUsSection"),
  dataKey: z.string(),
  // No layout — always renders dark via section-dark-accent class
});
```

Add all 3 to `SectionConfigSchema` discriminated union array.

**Step R2 — composition/index.ts:** Add 3 new names to `COMPONENT_NAMES`, `ComponentName`, and `COMPONENT_REGISTRY`.

**Step R3 — core-components/index.ts:** Export all 3 new components.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add packages/core-components/src/components/composable/service-list-section.tsx \
        packages/core-components/src/components/composable/location-pills-section.tsx \
        packages/core-components/src/components/composable/why-choose-us-section.tsx \
        packages/core-components/src/index.ts \
        packages/component-composition/src/schemas.ts \
        packages/component-composition/src/index.ts
git commit -m "$(cat <<'EOF'
feat(composition): add ServiceListSection, LocationPillsSection, WhyChooseUsSection

Three new composables matching the production Orion home page sections:
- ServiceListSection: 2-col split sticky header + service list
- LocationPillsSection: location pill grid with hover animations
- WhyChooseUsSection: dark table-style feature rows with noise overlay

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Wire new composables into home page composition

**Goal:** Update `composition.json` and `page-data.ts` so the home page uses the 3 new components instead of their generic composable predecessors.

**Model:** sonnet

Read in parallel:

- `sites/dj-fox-electrical-test/composition.json`
- `sites/dj-fox-electrical-test/lib/page-data.ts`
- `packages/themes/orion/pages/home.tsx` (lines 69–200, the 3 sections being replaced)
- `sites/dj-fox-electrical/site.config.ts` (to confirm service + location data shapes)

**Changes:**

1. `sites/dj-fox-electrical-test/composition.json` — update the home page sections:
   - Replace `ServiceCards` with `ServiceListSection` (`dataKey: "home.serviceList"`)
   - Add `LocationPillsSection` after `ServiceListSection` (`dataKey: "home.locationPills"`)
   - Replace `FeatureGrid` with `WhyChooseUsSection` (`dataKey: "home.whyChooseUs"`)
   - Keep `StatsStrip`, `TestimonialGrid`, `CTASection` unchanged.

2. `sites/dj-fox-electrical-test/lib/page-data.ts` — add new data keys:
   - `home.serviceList`: heading, subheading, ctaText, ctaHref, services array (first 8 from siteConfig). Map each service to `{ title, description, href: /services/[slug] }`.
   - `home.locationPills`: heading ("Areas We Cover"), subheading (optional), locations array (all priority locations: eastbourne, hastings, bexhill-on-sea, brighton, lewes, hailsham + any others in siteConfig). Map to `{ slug, title }`.
   - `home.whyChooseUs`: heading, brandName (the brand-primary colored word — likely "D J Fox"), features array. Map from existing `whyChooseUsItems` in siteConfig or `page-data.ts`. Each feature needs `{ title, description, stat? }`.

```bash
# Verification gate — STOP if this fails
pnpm type-check
cd sites/dj-fox-electrical-test && npm run build 2>&1 | tail -20
```

**Commit:**

```bash
git add sites/dj-fox-electrical-test/composition.json \
        sites/dj-fox-electrical-test/lib/page-data.ts
git commit -m "$(cat <<'EOF'
feat(dj-fox-test): wire ServiceListSection, LocationPillsSection, WhyChooseUsSection on home

Replaces ServiceCards and FeatureGrid with production-matching composables.
Adds location pills section between services and why-choose-us.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Page-specific fixes from visual comparison

**Goal:** Implement the page-specific fixes identified in Phase 1's `visual-comparison-findings.md`.

**Model:** sonnet

Read `output/sessions/2026-04/2026-04-19_dj-fox-visual-alignment/visual-comparison-findings.md` first.

Prioritise and fix all Critical and High findings. For each fix:

- Read the relevant file before editing
- Make the minimal targeted change
- Note the fix in a running log

Known likely candidates (from source analysis — Phase 1 may add more or remove some):

- **Contact page:** Form area should have dark background (`bg-surface-inverse`). The `ContactSection` composable uses light background for the form panel. Check the component and either add a `darkMode` prop or pass a className.
- **About page:** Stats section uses `DarkStatCard` (dark cards with icons + large numbers). The test site's `StatsStrip` won't match this. May need a `DarkStatCardsSection` variant or composition override.
- **Reviews page:** Trust points strip (dark inverse, 4 columns: "Quality assured", "Expert team", etc.) is data-only — check if current StatsStrip with correct data matches.
- **Pricing page:** Was custom-implemented and has no Orion template. Evaluate whether the `PricingTable` composable renders close enough or needs fixes.

After all fixes, run:

```bash
# Verification gate — STOP if this fails
pnpm type-check
cd sites/dj-fox-electrical-test && npm run build 2>&1 | tail -20
```

**Commit:**

```bash
git add -A   # commit all changes from this phase
git commit -m "$(cat <<'EOF'
fix(dj-fox-test): page-specific visual alignment fixes from comparison review

[list the specific findings fixed here]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7: Final verification

**Goal:** Re-run visual comparison and confirm all pages pass.

**Model:** sonnet

Re-run `/pipeline.validate-site` on the same 12 pages. Target: 0 Critical/High visual fidelity findings.

Write updated findings to `output/sessions/2026-04/2026-04-19_dj-fox-visual-alignment/visual-comparison-findings-final.md`.

Then:

```bash
# Final verification gate
pnpm type-check
cd sites/dj-fox-electrical-test && npm run build
```

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                                                                                                              | File overlap      | Model        | Rationale                  |
| ----- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------ | -------------------------- |
| G1    | Phase 2 | Read: stats-strip.tsx, hero-section.tsx, cta-section.tsx, feature-grid.tsx, composition.json                                       | none (reads only) | n/a          | Independent reads          |
| G2    | Phase 2 | Agent 1 (stats-strip.tsx), Agent 2 (hero-section.tsx), Agent 3 (cta-section+feature-grid.tsx), Agent 4 (composition.json)          | none              | sonnet/haiku | All touch different files  |
| G3    | Phase 3 | Read: hero-section.tsx, hero-section.slots.ts, page-data.ts, composition.json                                                      | none (reads only) | n/a          | Independent reads          |
| G4    | Phase 4 | Read: orion/home.tsx, service-cards.tsx, feature-grid.tsx, schemas.ts, composition/index.ts, core-components/index.ts, globals.css | none (reads only) | n/a          | Independent reads          |
| G5    | Phase 4 | Agent A (service-list-section.tsx new), Agent B (location-pills-section.tsx new), Agent C (why-choose-us-section.tsx new)          | none              | sonnet       | All new files — no overlap |
| G6    | Phase 5 | Read: composition.json, page-data.ts, orion/home.tsx, site.config.ts                                                               | none (reads only) | n/a          | Independent reads          |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                                                 | Reason                                                              |
| -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Phase 4 registration steps (R1, R2, R3) after all 3 component agents | All 3 touch shared files (schemas.ts, index files) — must serialise |
| Phase 2 Agent 3 edits both cta-section.tsx AND feature-grid.tsx      | Same agent must handle both (no two agents on same agent-3 files)   |
| Phase 5 after Phase 4                                                | composition.json references component names from Phase 4            |
| Phase 6 after Phase 1                                                | Phase 6 fixes are derived from Phase 1 findings                     |
| Verification gates between phases                                    | Each gates the next phase                                           |
| Git commits                                                          | One per phase, in order                                             |
| `npm run build`                                                      | Writes to `.next/` — run alone                                      |

---

## Cost Estimate

| Phase                              | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Visual comparison         | sonnet | ~15k              | ~3k                | ~$0.09     |
| Phase 2: Colour/texture fixes (×4) | sonnet | ~20k              | ~4k                | ~$0.12     |
| Phase 3: Hero breadcrumbs          | sonnet | ~12k              | ~3k                | ~$0.08     |
| Phase 4: 3 new composables         | sonnet | ~25k              | ~6k                | ~$0.18     |
| Phase 5: Wire composition.json     | sonnet | ~12k              | ~3k                | ~$0.08     |
| Phase 6: Page-specific fixes       | sonnet | ~20k              | ~4k                | ~$0.12     |
| Phase 7: Final comparison          | sonnet | ~10k              | ~2k                | ~$0.06     |
| **Total**                          |        | **~114k**         | **~25k**           | **~$0.73** |

Rates: Sonnet $3/$15 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` and site build both pass
3. Visual comparison results — findings before vs after
4. Any exceptions or deviations

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-19_dj-fox-visual-alignment/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, key findings from visual comparison, any surprises]

### Commits

[list each commit SHA and message]
```

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

**This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on `feature/dj-fox-composition-migration`
- Consult the `## Parallel execution groups` section before launching any work
- If the groups table and phase prose disagree, the groups table wins
- Minimal changes only — implement what the plan says, nothing more
- CSS classes `section-dark-accent`, `noise-overlay`, `location-pill`, `location-pill-arrow`, `btn-primary`, `btn-secondary`, `btn-tertiary`, `container-narrow`, `section` are defined in `packages/themes/orion/globals.css` and available globally — use them directly, do not recreate them with Tailwind
- Co-Authored-By: `Claude Sonnet 4.6 <noreply@anthropic.com>`
