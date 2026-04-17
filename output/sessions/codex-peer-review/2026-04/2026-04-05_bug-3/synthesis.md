# Implementation Plan: Cygnus ImageOverlayHero — Wire heroVariant to Runtime

**Date:** 2026-04-05
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

## Key Differences Between Plans

| Aspect                               | Claude                                                                                                                 | Codex                                                                                                                           | Synthesised Decision                                                                                                                                                                                                                                                                                       |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Variant selection mechanism**      | Pure static import — page.tsx imports `ImageOverlayHero` directly, no conditional on registry value                    | Conditional render using `cygnusRegistry.heroVariant === "image-overlay"` in page.tsx with fallback to existing hero            | **Use Codex's conditional approach.** Reading the registry constant at the server level is zero-cost (it is a plain JS object, not context) and creates a visible link between the registry metadata and the rendered component. This makes the pattern extensible when `split`/`minimal` are added later. |
| **Fallback when no backgroundImage** | Renders a gradient div (`bg-gradient-to-br from-surface-background to-surface-muted`) as an alternate background layer | Expects the overlay + token background to remain readable without an image; no explicit fallback element                        | **Use Claude's explicit fallback gradient layer.** A dedicated fallback div ensures visual quality even when no image is configured, which is the expected state at initial launch.                                                                                                                        |
| **Legacy hero preservation**         | Removes old hero markup entirely from cygnus pages                                                                     | Keeps old centered hero JSX inline (or extracts to a local `LegacyCenteredHero` function) as the else-branch of the conditional | **Keep the legacy hero as fallback** inside the conditional. This matches the conditional-render approach and provides a safe rollback path per-site.                                                                                                                                                      |
| **backgroundImageAlt prop**          | Uses empty `alt=""` + `aria-hidden="true"` on decorative image; no explicit alt prop                                   | Adds `backgroundImageAlt?: string` prop for cases where the image is meaningful                                                 | **Include the `backgroundImageAlt` prop** from Codex. Costs nothing and improves accessibility for sites that use a meaningful hero image. Default to decorative treatment (`alt=""`, `aria-hidden`) when omitted.                                                                                         |
| **Stats bar typography**             | `text-5xl font-headline font-bold text-brand-primary italic`                                                           | Describes "3-column responsive bar" but does not specify exact classes                                                          | **Use Claude's explicit class list**, which matches the Stitch spec directly.                                                                                                                                                                                                                              |
| **Headline size classes**            | `text-6xl md:text-7xl lg:text-8xl` (three breakpoints)                                                                 | `text-7xl md:text-8xl` (two breakpoints)                                                                                        | **Use Claude's three-breakpoint version** for better mobile scaling. The Stitch spec starts large; a 6xl mobile floor prevents overflow on small viewports.                                                                                                                                                |
| **site.config.ts changes**           | Proposes adding `hero.backgroundImage` and `hero.badge` to site config (Phase 3)                                       | Does not propose config schema changes; uses local constants                                                                    | **Defer config schema changes.** Local constants in page.tsx are sufficient for this scoped fix. Add config schema in a follow-up when more hero fields stabilise.                                                                                                                                         |
| **Barrel export in root index.ts**   | Explicitly calls out updating `packages/core-components/src/index.ts` barrel                                           | Does not mention root barrel update                                                                                             | **Update the barrel export.** Both `hero/index.ts` and the root `packages/core-components/src/index.ts` must export `ImageOverlayHero` for the `@platform/core-components` import path to resolve.                                                                                                         |

## Blind Spots Caught

### What Codex caught that Claude missed

- **Conditional render on registry value, not just static import.** Claude's plan imports `ImageOverlayHero` unconditionally and discards the old hero. Codex correctly identified that branching on `cygnusRegistry.heroVariant` at the server level creates a visible, documented link between registry metadata and rendering — making the pattern self-documenting and extensible. This is the architecturally correct approach.
- **backgroundImageAlt prop for accessibility.** Claude assumed the image is always decorative. Codex added a prop to handle cases where it is not — a small addition with meaningful a11y value.
- **Explicit scope guardrail verification gate.** Codex included a verification gate (Gate A) to confirm no files outside the intended scope are modified. Claude's plan did not include this safeguard.

### What Claude caught that Codex missed

- **Theme token mapping table (Stitch hex to platform tokens).** Claude provided a complete mapping from Stitch's hardcoded hex values to the platform's design token classes. Codex stated "use tokens" but did not enumerate the specific mappings, leaving room for implementation error.
- **Risk: `btn-primary` / `btn-outline` class existence.** Claude flagged that these utility classes may not exist in all sites' `globals.css`. If they are missing, the CTA buttons will render unstyled. This must be verified before implementation.
- **Risk: `font-headline` / Newsreader font configuration.** Claude identified that the cygnus theme must configure `--font-headline` to `Newsreader` and that the Tailwind `fontFamily.headline` extension must exist. Without this, the italic serif headline styling will not render correctly.
- **Explicit fallback gradient for missing backgroundImage.** Claude designed a distinct visual fallback when no image is provided. Codex assumed token-based backgrounds would suffice, which could produce a flat, low-contrast hero.
- **`next/image` consideration.** Claude noted the `<img>` tag could be upgraded to `next/image` for optimisation in a follow-up. Codex did not address image optimisation.

---

## Implementation Plan

### Phase 1: Build ImageOverlayHero in core-components

**Step 1.1 — Create the component file**

File: `packages/core-components/src/components/hero/ImageOverlayHero.tsx`

Define the following TypeScript interfaces (named exports, no default exports):

```typescript
export interface ImageOverlayHeroCta {
  label: string;
  href: string;
}

export interface ImageOverlayHeroStat {
  value: string;
  label: string;
}

export interface ImageOverlayHeroProps {
  headline: string;
  headlineAccent?: string;
  subheadline: string;
  primaryCta: ImageOverlayHeroCta;
  secondaryCta?: ImageOverlayHeroCta;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  badge?: string;
  stats?: ImageOverlayHeroStat[];
}
```

Component structure (Server Component — no `'use client'` directive):

1. **Outer section:** `relative min-h-screen flex items-center pt-20 overflow-hidden`
2. **Background image layer** (conditional on `backgroundImage`): absolute positioned `<img>` with `w-full h-full object-cover opacity-40 grayscale-[50%]`, using `alt={backgroundImageAlt ?? ""}` and `aria-hidden={!backgroundImageAlt ? "true" : undefined}`
3. **Gradient overlay:** absolute div with `bg-gradient-to-t from-surface-background via-surface-background/60 to-transparent`
4. **Fallback gradient** (when no backgroundImage): absolute div with `bg-gradient-to-br from-surface-background to-surface-muted`
5. **Content container:** `relative z-10 max-w-7xl mx-auto px-8 w-full` with inner `max-w-3xl` (left-aligned, NOT centered)
6. **Badge pill** (conditional on `badge`): `inline-flex items-center gap-2 px-3 py-1 bg-surface-elevated rounded-full mb-6 border border-surface-border` with green dot and uppercase label text
7. **Headline:** `text-6xl md:text-7xl lg:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8 text-surface-foreground` with optional `headlineAccent` wrapped in `<span className="text-brand-primary">`
8. **Subheadline:** `text-xl font-body text-surface-muted-foreground max-w-xl mb-10 leading-relaxed`
9. **CTA buttons:** primary uses `btn-primary px-10 py-4 text-lg font-bold`; secondary uses `btn-outline px-10 py-4 text-lg font-bold`
10. **Stats bar** (conditional on `stats?.length`): separate `<section>` with `bg-surface-muted border-y border-surface-border py-16`, 3-column responsive grid, values in `text-5xl font-headline font-bold text-brand-primary italic`, labels in `text-xs font-label uppercase tracking-widest text-surface-muted-foreground`

**Token mapping reference (Stitch hex to platform tokens):**

| Stitch Hex                     | Platform Token Class                      |
| ------------------------------ | ----------------------------------------- |
| `#131313` (background)         | `bg-surface-background`                   |
| `#F7941D` (accent orange)      | `text-brand-primary` / `bg-brand-primary` |
| `#E5E2E1` (on-surface)         | `text-surface-foreground`                 |
| `#dac2af` (on-surface-variant) | `text-surface-muted-foreground`           |
| `#201f1f` (surface-container)  | `bg-surface-muted`                        |
| `#544435` (outline-variant)    | `border-surface-border`                   |

**Step 1.2 — Export from hero barrel**

File: `packages/core-components/src/components/hero/index.ts`

Add:

```typescript
export { ImageOverlayHero } from "./ImageOverlayHero";
export type {
  ImageOverlayHeroProps,
  ImageOverlayHeroCta,
  ImageOverlayHeroStat,
} from "./ImageOverlayHero";
```

**Step 1.3 — Export from core-components root barrel**

File: `packages/core-components/src/index.ts`

Add `ImageOverlayHero` and its type exports to the barrel so `@platform/core-components` resolves correctly.

**Verification Gate 1:**

- [ ] `npm run type-check` passes from `packages/core-components`
- [ ] `grep -r '#[0-9a-fA-F]\{3,6\}' packages/core-components/src/components/hero/ImageOverlayHero.tsx` returns no matches (no hardcoded hex)
- [ ] No `'use client'` directive in the file (it is a Server Component)
- [ ] No files outside `packages/core-components/src/components/hero/` and `packages/core-components/src/index.ts` are modified

---

### Phase 2: Pre-flight checks on cygnus theme infrastructure

Before wiring the component into sites, verify these prerequisites exist.

**Step 2.1 — Verify `btn-primary` and `btn-outline` classes**

Check `sites/cygnus-test/app/globals.css` and `packages/themes/cygnus/` for definitions of `btn-primary` and `btn-outline`. If missing, add them as `@apply` utility classes in the cygnus theme CSS.

**Step 2.2 — Verify `font-headline` Tailwind extension**

Check `packages/themes/cygnus/` for Tailwind config or CSS that sets `--font-headline` (expected: `Newsreader` or similar italic serif). Verify `fontFamily.headline` is configured in the Tailwind theme extension. If missing, configure it — the Stitch spec depends on this for the italic serif headline.

**Step 2.3 — Verify `font-label` Tailwind extension**

The badge and stats labels use `font-label`. Confirm this is defined.

**Verification Gate 2:**

- [ ] `btn-primary`, `btn-outline`, `font-headline`, and `font-label` all resolve to valid CSS when used in a cygnus site
- [ ] No new token definitions are needed (or they have been added)

---

### Phase 3: Wire hero selection in cygnus site homepages

**Step 3.1 — Update `sites/cygnus-test/app/page.tsx`**

1. Add import: `import { ImageOverlayHero } from '@platform/core-components';`
2. The file already imports `cygnusRegistry` (or accesses it via the theme package). Use the registry constant directly — this is a plain object accessible in Server Components.
3. Replace the hardcoded hero `<section>` with a conditional:

```tsx
{cygnusRegistry.heroVariant === "image-overlay" ? (
  <ImageOverlayHero
    headline="Your brand,"
    headlineAccent="made bold."
    subheadline={siteConfig.tagline}
    primaryCta={{ label: "Get a Quote", href: "/contact" }}
    secondaryCta={{ label: "View Our Work", href: "/projects" }}
    badge="847 projects completed"
    stats={[
      { value: "847", label: "Projects Delivered" },
      { value: "12", label: "Years of Craft" },
      { value: "5★", label: "Client Rated" },
    ]}
  />
) : (
  /* existing centered gradient hero markup preserved as fallback */
)}
```

Note: `backgroundImage` intentionally omitted at launch — component renders the fallback gradient. Add image path in a follow-up once R2 assets are staged.

**Step 3.2 — Update `sites/mad-graphics/app/page.tsx`**

Same pattern as Step 3.1, with mad-graphics-specific content values drawn from its `siteConfig`.

**Verification Gate 3:**

- [ ] `npm run dev` in `sites/cygnus-test` — homepage shows full-screen overlay hero (left-aligned, badge visible, two CTAs, gradient fallback background)
- [ ] `npm run dev` in `sites/mad-graphics` — same overlay hero structure with site-specific content
- [ ] Existing centered hero markup is preserved in the else-branch and would render if `heroVariant` were changed

---

### Phase 4: Regression verification on unaffected sites

**Step 4.1 — Verify base-template is unchanged**

`sites/base-template/app/page.tsx` must NOT be modified. Confirm it still renders the centered gradient hero.

**Step 4.2 — Verify dj-fox-electrical is unchanged**

`sites/dj-fox-electrical/app/page.tsx` must NOT be modified. Even though orionRegistry also declares `heroVariant: "image-overlay"`, this site is out of scope. Its page.tsx is not updated and continues to render the existing centered hero.

**Verification Gate 4 (Final):**

- [ ] `npm run type-check` passes at monorepo root (TypeScript strict)
- [ ] `npm run build` passes for all sites
- [ ] `sites/cygnus-test` homepage: full-screen image-overlay hero (not centered gradient)
- [ ] `sites/mad-graphics` homepage: full-screen image-overlay hero
- [ ] `sites/base-template` homepage: existing centered hero (unchanged)
- [ ] `sites/dj-fox-electrical` homepage: existing hero (unchanged)
- [ ] No hardcoded hex colors in `ImageOverlayHero.tsx`
- [ ] Diff is minimal and focused — no files outside scope are touched

---

## Risks

| Risk                                                                        | Source | Severity                                     | Mitigation                                                                                                                       |
| --------------------------------------------------------------------------- | ------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `btn-primary` / `btn-outline` CSS classes may not exist in cygnus sites     | Claude | **High** — CTAs render unstyled              | Phase 2 pre-flight check; add as `@apply` utilities if missing                                                                   |
| `font-headline` (Newsreader italic serif) may not be configured in Tailwind | Claude | **High** — headline loses its signature look | Phase 2 pre-flight check; configure in cygnus theme package                                                                      |
| Registry semantics inconsistency — only cygnus sites honor `heroVariant`    | Codex  | **Low** — accepted for scoped fix            | Document follow-up task for global variant resolver                                                                              |
| HeroV3 duplication — new component overlaps with existing HeroV3            | Claude | **Low** — intentional                        | `ImageOverlayHero` precisely matches Stitch spec; HeroV3 has different prop interface. Leave both; consider consolidation later. |
| Design token parity vs Stitch pixel-perfect                                 | Codex  | **Medium** — visual differences possible     | Use token mapping table from Phase 1; visual QA against Stitch HTML                                                              |
| `next/image` not used for hero background                                   | Claude | **Low** — optimisation concern only          | Use plain `<img>` now; upgrade to `next/image` in follow-up                                                                      |
| Stats/badge content hardcoded in page.tsx                                   | Both   | **Low** — acceptable for scoped fix          | Move to `site.config.ts` in follow-up when hero config schema stabilises                                                         |

---

## Files Summary

| File                                                                | Action                               | Phase |
| ------------------------------------------------------------------- | ------------------------------------ | ----- |
| `packages/core-components/src/components/hero/ImageOverlayHero.tsx` | **CREATE**                           | 1     |
| `packages/core-components/src/components/hero/index.ts`             | **MODIFY** — add export              | 1     |
| `packages/core-components/src/index.ts`                             | **MODIFY** — add barrel export       | 1     |
| `sites/cygnus-test/app/page.tsx`                                    | **MODIFY** — conditional hero render | 3     |
| `sites/mad-graphics/app/page.tsx`                                   | **MODIFY** — conditional hero render | 3     |
| Cygnus theme CSS (if `btn-primary`/`btn-outline` missing)           | **MODIFY** (conditional)             | 2     |
| Cygnus Tailwind config (if `font-headline`/`font-label` missing)    | **MODIFY** (conditional)             | 2     |
