# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04-05_bug-3/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-05_bug-3/
```

---

## Brief: Cygnus Hero Variant — Wire heroVariant to Runtime Component Selection

**Date:** 2026-04-05
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The platform's `ComponentRegistry` declares a `heroVariant` field (`"image-overlay" | "split" | "minimal"`) and the cygnus theme sets `heroVariant: "image-overlay"`. However, this value has **no runtime effect**. Every site renders the same hardcoded centered gradient hero, regardless of their registry declaration.

Three `HeroV1 / HeroV2 / HeroV3` components exist in `packages/core-components/src/components/hero/` and are exported but **never imported anywhere in the codebase**. The `ThemeProvider` passes the registry into React context (accessible via `useTheme()`), but no component reads it to select a hero variant.

The goal: build the `image-overlay` hero layout — exactly as designed by Google Stitch — and wire `heroVariant: "image-overlay"` to select it in the cygnus theme sites (`sites/cygnus-test` and `sites/mad-graphics`).

The Stitch HTML design spec is at: `output/ingestion/cygnus-stitch/html/home.html`

### Goals

1. Build a proper `ImageOverlayHero` page component that matches the Stitch HTML design spec
2. Wire `heroVariant` from `ComponentRegistry` to select the right hero implementation in page.tsx files
3. Both `sites/cygnus-test` and `sites/mad-graphics` render the `image-overlay` hero after the change
4. The existing centered hero (currently hardcoded) continues to work for vega/orion sites unchanged
5. Hero components use theme tokens (`bg-brand-primary`, `text-surface-foreground`, etc.) — not hardcoded colors

### Non-Goals

- Fixing `split` or `minimal` heroVariant — only `image-overlay` is in scope
- Changing the `ComponentRegistry` type definition
- Touching the `SiteHeader`, footer, or any non-hero layout components
- Building a dynamic/runtime component loader — static conditional rendering at the page level is fine
- Adding new MDX content fields

### Acceptance Criteria

1. `sites/cygnus-test` homepage renders a full-screen image-overlay hero (not the centered gradient)
2. `sites/mad-graphics` homepage renders a full-screen image-overlay hero
3. `sites/base-template` homepage still renders its existing centered hero (unaffected)
4. `sites/dj-fox-electrical` homepage still renders correctly (orion theme — unaffected)
5. `ImageOverlayHero` component uses only theme tokens, not hardcoded hex colors
6. TypeScript strict mode passes (`npm run type-check`)
7. Build succeeds (`npm run build`) in all affected sites

### Constraints

**Hard architectural constraints:**
- `ThemeProvider` and `useTheme()` are `'use client'` — they run in the browser only
- `page.tsx` files are **Server Components** — they cannot call `useTheme()` directly
- This is the critical constraint: the current registry IS available in context, but page.tsx cannot read context
- Hero components that need registry values must either: (a) be Client Components, or (b) receive variant as a prop passed down from a Server Component that reads it some other way
- Theme tokens must be used (`bg-brand-primary`, `text-surface-foreground`, etc.) — no hardcoded hex
- No inline styles, no CSS-in-JS — Tailwind only
- Named exports only, TypeScript interfaces for all props

**Architecture facts:**
- `packages/core-components/src/context/theme-context.tsx` — comment explicitly states: "component selection is via static imports at build time — this context is for client-only atoms only"
- The registry is metadata; actual variant selection was always intended to be via static imports
- Each site has its own `page.tsx` — they don't share a homepage template
- Sites import from theme packages: `import { cygnusRegistry } from '@platform/themes/cygnus'`

### Relevant Architecture

**ComponentRegistry type** (`packages/theme-system/src/types.ts`, lines 280-291):
```typescript
export interface ComponentRegistry {
  theme: ThemeName;
  heroVariant: "image-overlay" | "split" | "minimal";
  headerVariant: "dark" | "light";
  cardVariant: "icon-circle" | "standard" | "overlay";
  sectionVariant: "dark-accent" | "gradient" | "standard" | "banded";
}
```

**cygnusRegistry** (`packages/themes/cygnus/index.ts`):
```typescript
export const cygnusRegistry: ComponentRegistry = {
  theme: "cygnus",
  heroVariant: "image-overlay",
  headerVariant: "dark",
  cardVariant: "standard",
  sectionVariant: "dark-accent",
};
```

**ThemeProvider / useTheme** (`packages/core-components/src/context/theme-context.tsx`):
- Marked `'use client'`
- Provides `registry: ComponentRegistry | null` via `useTheme()` hook
- Pages pass registry in: `<ThemeProvider theme="cygnus" registry={cygnusRegistry}>`
- Context comment: "component selection is via static imports at build time — this context is for client-only atoms only"

**Hero components** (`packages/core-components/src/components/hero/`):
- `HeroV1` — centered gradient hero (51 lines)
- `HeroV2` — split layout, content left / image right (96 lines)
- `HeroV3` — full-screen video/image hero with overlay (82 lines)
- All exported from `packages/core-components/src/components/hero/index.ts`
- None are imported anywhere in the codebase

**Current page.tsx hero section** (identical in all sites):
```tsx
{/* Hero Section */}
<section className="section bg-gradient-to-b from-brand-primary/5 to-surface-background">
  <div className="container-narrow text-center">
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance text-surface-foreground">
      Professional Local Services in {siteConfig.business.address.city}
    </h1>
    ...
  </div>
</section>
```

### Stitch Design Spec (key structural elements from `output/ingestion/cygnus-stitch/html/home.html`)

The cygnus image-overlay hero must implement:

1. **Full-screen section**: `min-h-screen flex items-center pt-20 overflow-hidden` (accounts for fixed header)
2. **Background image layer**: absolute positioned, `w-full h-full object-cover`, with `opacity-40 grayscale-[0.5]` treatment
3. **Gradient overlay**: `bg-gradient-to-t from-background via-background/60 to-transparent` over the image
4. **Content block**: left-aligned, `max-w-3xl`, NOT centered
5. **Status badge**: small pill above headline (`"847 projects completed"` style — configurable)
6. **Headline**: large italic serif (`text-7xl md:text-8xl font-headline font-bold italic`) with a colored accent span
7. **Subheadline**: muted body text, `max-w-xl`
8. **Two CTAs**: primary (filled gradient) and secondary (outlined)
9. **Stats bar** (optional section below hero): 3 large italic numbers with labels

### What a Good Plan Should Cover

1. **Where does variant selection happen?** Server Component page.tsx cannot call `useTheme()`. How do cygnus sites conditionally render the image-overlay hero without runtime context access? Options include: (a) static import in page.tsx directly, (b) a wrapper Client Component that reads the registry, (c) something else.

2. **Where does `ImageOverlayHero` live?** In `core-components` (shared), or in each site's `components/` (site-specific)? What are the trade-offs?

3. **What props does `ImageOverlayHero` accept?** How does it get content (headline, subheadline, backgroundImage, CTAs) from site config? The site config object is available in page.tsx — how is it threaded through?

4. **Do HeroV1/V2/V3 get used, or does a new component get built?** HeroV3 is closest to image-overlay — is it worth adapting, or does the Stitch spec warrant a dedicated `ImageOverlayHero`?

5. **Background image handling**: The Stitch HTML uses a Google-hosted URL. For production, the platform uses Cloudflare R2. What placeholder/fallback does the component use? Should it accept an optional `backgroundImage` prop?

6. **Theme tokens for the overlay hero**: The Stitch uses hardcoded hex colors. What are the equivalent theme token mappings for the cygnus dark-mode overlay design?

7. **Do other sites need guard-railing?** `sites/dj-fox-electrical` uses orion with `heroVariant: "image-overlay"` — should that site's page.tsx also be updated, or is the scope limited to cygnus sites?

---

## Deliverable

Produce a numbered implementation plan with:
- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04-05_bug-3/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-05_bug-3/`
