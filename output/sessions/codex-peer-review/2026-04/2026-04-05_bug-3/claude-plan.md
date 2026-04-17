# Claude's Plan: Cygnus Hero Variant — Wire heroVariant to Runtime Component Selection

**Date:** 2026-04-05
**Author:** Claude (independent plan, written before seeing Codex output)

---

## Key Architectural Decision First

The critical constraint: `page.tsx` files are Server Components and **cannot call `useTheme()`**. The registry comment even says "component selection is via static imports at build time."

**My recommended approach:** Static import at the page level — not runtime context. Each site's `page.tsx` imports and uses the correct hero component directly. This is consistent with the platform's stated intent and avoids the Server/Client boundary problem entirely.

The `heroVariant` in the registry remains metadata (used by tooling, e.g. the ingest pipeline to know what layout was intended). The actual selection is a simple static import in each site's `page.tsx`.

This means no "hero switcher" wrapper component. Each cygnus page.tsx explicitly imports `ImageOverlayHero`. Vega/orion pages remain unchanged.

---

## Phase 1: Build ImageOverlayHero in core-components

### Step 1.1 — Define the props interface

`packages/core-components/src/components/hero/ImageOverlayHero.tsx`

```typescript
export interface ImageOverlayHeroProps {
  headline: string;
  headlineAccent?: string; // colored word/phrase in headline
  subheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  backgroundImage?: string; // URL or path; falls back to pure gradient if omitted
  badge?: string; // small status pill above headline, e.g. "847 projects completed"
  stats?: Array<{ value: string; label: string }>; // optional stats bar below hero
}
```

### Step 1.2 — Build the component

Key structural decisions from the Stitch HTML:

```tsx
'use client'  // needed for hover states / CSS transitions only? Actually no — pure CSS/Tailwind handles hover. This is a Server Component.

export function ImageOverlayHero({ ... }: ImageOverlayHeroProps) {
  return (
    <>
      {/* Full-screen hero */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background image layer */}
        {backgroundImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={backgroundImage}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-background via-surface-background/60 to-transparent" />
          </div>
        )}
        {/* Fallback gradient when no image */}
        {!backgroundImage && (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-surface-background to-surface-muted" />
        )}

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-3xl">
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-elevated rounded-full mb-6 border border-surface-border">
                <span className="flex h-2 w-2 rounded-full bg-brand-primary" />
                <span className="text-xs font-label uppercase tracking-[0.2em] font-semibold text-surface-foreground">{badge}</span>
              </div>
            )}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8 text-surface-foreground">
              {headline}
              {headlineAccent && (
                <><br /><span className="text-brand-primary">{headlineAccent}</span></>
              )}
            </h1>
            <p className="text-xl font-body text-surface-muted-foreground max-w-xl mb-10 leading-relaxed">
              {subheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={primaryCta.href} className="btn-primary px-10 py-4 text-lg font-bold">
                {primaryCta.label}
              </a>
              {secondaryCta && (
                <a href={secondaryCta.href} className="btn-outline px-10 py-4 text-lg font-bold">
                  {secondaryCta.label}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Optional stats bar */}
      {stats && stats.length > 0 && (
        <section className="bg-surface-muted border-y border-surface-border py-16">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {stats.map(({ value, label }) => (
              <div key={label} className="space-y-2">
                <div className="text-5xl font-headline font-bold text-brand-primary italic">{value}</div>
                <div className="text-xs font-label uppercase tracking-widest text-surface-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
```

**Token mapping from Stitch hex → platform tokens:**

- `#131313` (background) → `bg-surface-background`
- `#F7941D` (primary-container / accent orange) → `text-brand-primary`
- `#E5E2E1` (on-surface) → `text-surface-foreground`
- `#dac2af` (on-surface-variant) → `text-surface-muted-foreground`
- `#201f1f` (surface-container) → `bg-surface-muted`
- `#544435` (outline-variant) → `border-surface-border`

### Step 1.3 — Export from core-components

Update `packages/core-components/src/components/hero/index.ts`:

```typescript
export { ImageOverlayHero } from "./ImageOverlayHero";
export type { ImageOverlayHeroProps } from "./ImageOverlayHero";
// existing HeroV1/V2/V3 exports remain
```

Update barrel `packages/core-components/src/index.ts` — add `ImageOverlayHero` and its type.

**Verification gate 1:** `npm run type-check` from `packages/core-components` passes.

---

## Phase 2: Update cygnus sites to use ImageOverlayHero

### Step 2.1 — Update `sites/cygnus-test/app/page.tsx`

Replace the hardcoded hero section:

```typescript
import { ImageOverlayHero } from '@platform/core-components';

// In the JSX, replace the <section className="section bg-gradient-to-b..."> block with:
<ImageOverlayHero
  headline="Your brand,"
  headlineAccent="made bold."
  subheadline={siteConfig.tagline}
  primaryCta={{ label: "Get a Quote", href: "/contact" }}
  secondaryCta={{ label: "View Our Work", href: "/projects" }}
  stats={[
    { value: "847", label: "Projects Delivered" },
    { value: "12", label: "Years of Craft" },
    { value: "5★", label: "Client Rated" },
  ]}
/>
```

Note: `backgroundImage` is intentionally omitted for now — a placeholder image from the R2 bucket (or a local image) can be wired in a follow-up. The component gracefully falls back to a gradient.

### Step 2.2 — Update `sites/mad-graphics/app/page.tsx`

Same change as Step 2.1, with mad-graphics specific content props drawn from `siteConfig`.

**Verification gate 2:** `npm run dev` in `sites/cygnus-test` — homepage shows the full-screen overlay hero (with gradient fallback if no image). `npm run dev` in `sites/mad-graphics` — same result.

---

## Phase 3: Wire background image (optional but recommended)

Each site's `site.config.ts` can add a `heroImage` field:

```typescript
// sites/cygnus-test/site.config.ts
hero: {
  backgroundImage: "/images/hero-bg.jpg",  // R2-hosted or local
  badge: "847 projects completed",
}
```

`page.tsx` reads `siteConfig.hero?.backgroundImage` and passes it to `ImageOverlayHero`.

This is the correct pattern — site-specific content stays in site.config.ts, not hardcoded in the component.

**Note:** If `site.config.ts` schema (in `packages/core-components/src/lib/content-schemas.ts`) doesn't include `hero`, add it as an optional field.

---

## Phase 4: Verify orion/vega sites are unaffected

- `sites/dj-fox-electrical` uses `heroVariant: "image-overlay"` in orionRegistry — but its `page.tsx` is NOT updated in this plan. orion sites are out of scope. It will continue rendering the centered gradient hero.
- `sites/base-template` and `sites/colossus-scaffolding` use vegaRegistry — unchanged.

**Verification gate 3:** Run `pnpm build` from root. All sites build. TypeScript passes everywhere.

---

## Risks and Trade-offs

### Risk 1: HeroV3 overlap

HeroV3 in core-components already approximates an image-overlay hero. There's a risk of duplication. My recommendation: build `ImageOverlayHero` as a new component that precisely matches the Stitch spec, and leave HeroV1/V2/V3 as-is (they may get used for `split` and `minimal` variants in future). Don't try to retrofit HeroV3 — its prop interface likely doesn't match what we need.

### Risk 2: Server Component / 'use client' boundary

`ImageOverlayHero` as designed above is a pure Server Component (no hooks, no state). The `<img>` tag could be upgraded to `next/image` for optimisation — but that's a follow-up. Keep it simple for now.

### Risk 3: Theme token coverage

Not all cygnus-specific tokens may exist in the theme system yet (e.g. `font-headline` for the italic serif). The Stitch design uses `Newsreader` as the headline font. The cygnus theme config needs to set `--font-headline` to `Newsreader` and `Tailwind fontFamily.headline`. Check `packages/themes/cygnus/` for existing font config before assuming this works.

### Risk 4: Stats content is hardcoded

The stat numbers (847 projects, 12 years) are business-specific. They should come from `site.config.ts`, not be hardcoded in the component. The `stats` prop array handles this correctly.

### Risk 5: `btn-primary` / `btn-outline` classes

These Tailwind utility classes must be defined in `globals.css` for each site, or in the shared theme CSS. Verify they exist before using them in the component.

---

## Files Modified

| File                                                                | Change                                           |
| ------------------------------------------------------------------- | ------------------------------------------------ |
| `packages/core-components/src/components/hero/ImageOverlayHero.tsx` | **NEW** — image-overlay hero component           |
| `packages/core-components/src/components/hero/index.ts`             | Add ImageOverlayHero export                      |
| `packages/core-components/src/index.ts`                             | Add ImageOverlayHero to barrel                   |
| `sites/cygnus-test/app/page.tsx`                                    | Replace hardcoded hero with `<ImageOverlayHero>` |
| `sites/mad-graphics/app/page.tsx`                                   | Replace hardcoded hero with `<ImageOverlayHero>` |
| `sites/cygnus-test/site.config.ts`                                  | Add optional `hero.backgroundImage` (Phase 3)    |
| `sites/mad-graphics/site.config.ts`                                 | Add optional `hero.backgroundImage` (Phase 3)    |
