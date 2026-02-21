# Implementation Plan: Animation Primitives

**Date:** 2026-02-21
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect | Claude | Codex | Synthesised Decision |
|--------|--------|-------|----------------------|
| **Animation component location** | `components/ui/` (alongside all other components) | New `components/animation/` subdirectory | **Codex: `components/animation/`** — separates animation concerns from content components, clearer mental model, avoids bloating the 57-file `ui/` directory |
| **Shared keyframes CSS location** | `packages/core-components/src/styles/animations.css` | `packages/theme-system/src/animations.css` | **Claude: `core-components/src/styles/`** — core-components is the right home because the animations pair with the components that use them; theme-system is about token generation, not animation |
| **Carousel API** | `children`-based (each child = one slide) | Recommends `items + renderItem` pattern | **Claude: `children`-based** — simpler API, composes better with Server Component children, matches how the AI generator would use it (wrap JSX blocks), no need for render props |
| **Parallax hook location** | `src/hooks/use-scroll-parallax.ts` (separate hooks directory) | `src/components/animation/use-scroll-parallax.ts` (co-located with animation components) | **Codex: co-located in `animation/`** — keeps all animation primitives discoverable in one directory |
| **ParallaxSection component** | Creates a separate `parallax-section.tsx` wrapper | Not mentioned as a separate component | **Claude: include it** — the hook alone is too low-level for the AI generator to use reliably; a ready-made `<ParallaxSection>` is what the prompt should reference |
| **Delivery ordering** | Keyframes first → RevealOnScroll → Carousel → Parallax → Pipeline → Cleanup | Dependency + RevealOnScroll + Keyframes together → Carousel + Parallax → Pipeline → Tests + Docs | **Codex's grouping** — doing RevealOnScroll and keyframes together makes sense since RevealOnScroll depends on the keyframes; avoids a half-finished intermediate state |
| **Pipeline generator tests** | Not mentioned | Explicitly adds tests for `clientComponentShell` import detection and prompt output | **Codex: include generator tests** — important to verify the `useEffect`/`useRef` import detection actually works |
| **RevealOnScroll SSR strategy** | Start hidden (`opacity-0`), reveal on intersection, `<noscript>` fallback | Start visible, hide on client hydration, reveal on intersection | **Codex: start visible** — SEO-safe by default, no content invisible if JS fails, hydration mismatch risk is manageable with `suppressHydrationWarning` on the wrapper |
| **Bundle impact measurement** | Estimates ~10KB total | Explicitly recommends measuring pre/post delta on a baseline site | **Codex: measure it** — add a step to record actual bundle delta |

## Blind Spots Caught

**Codex caught that Claude missed:**
- **Accessibility: auto-play carousel must pause on hover/focus** and respect `prefers-reduced-motion` — Claude mentioned pause-on-hover but didn't call out reduced-motion for the carousel specifically
- **Generator template tests** — Claude's plan had no tests for the pipeline template/prompt changes
- **CSS import ordering risk** — shared keyframes must be imported before theme-specific CSS that might reference the classes; order matters
- **`@layer` avoidance** — the shared CSS file must not use `@layer` or `@tailwind` directives since it's imported raw by theme globals
- **Bundle governance** — actually measuring the delta, not just estimating

**Claude caught that Codex missed:**
- **ParallaxSection wrapper component** — Codex only proposed the hook; the AI generator needs a ready-made component to reference in prompts, not a hook
- **Concrete `needsUseClient` regex update** — Claude specified adding primitive component names to `CLIENT_PATTERNS`; Codex mentioned it generically
- **`noscript`/progressive enhancement detail** for RevealOnScroll — Claude had a specific fallback strategy
- **Phase 6 cleanup: removing duplicated keyframes from themes** — Claude explicitly planned this as a separate verification step; Codex mentioned it inline but didn't call out the lightbox regression risk

---

## Implementation Plan

### Phase A: Foundations (Keyframes + RevealOnScroll)

**Goal:** Shared keyframes library and the highest-impact animation primitive.

#### Step A1: Add embla-carousel dependency

```bash
pnpm --filter @platform/core-components add embla-carousel-react
```

Add now so the lockfile is settled before feature work. Verify `pnpm install` and `pnpm type-check` pass.

#### Step A2: Create shared animation CSS

Create `packages/core-components/src/styles/animations.css`:
- 8 `@keyframes`: `fade-in`, `fade-in-up`, `fade-in-down`, `slide-in-left`, `slide-in-right`, `scale-in`, `scale-up`, `float`
- 8 corresponding `.animate-*` utility classes with `animation: ... both;`
- **No `@layer`, no `@tailwind` directives** — plain CSS only
- Use `fill-mode: both` so animations hold their end state

#### Step A3: Import shared CSS from theme globals

Update `packages/themes/orion/globals.css` and `packages/themes/vega/globals.css`:
- Add `@import "../../core-components/src/styles/animations.css";` **before** any theme-specific animation overrides
- **Remove** the duplicated `@keyframes fade-in`, `@keyframes scale-in`, `.animate-fade-in`, `.animate-scale-in` from both files

#### Step A4: Create RevealOnScroll component

Create `packages/core-components/src/components/animation/reveal-on-scroll.tsx`:

```tsx
"use client";

export type RevealVariant = "fade-up" | "fade-in" | "fade-down" | "slide-left" | "slide-right" | "scale-up";

export interface RevealOnScrollProps {
  children: React.ReactNode;
  variant?: RevealVariant;       // default "fade-up"
  delay?: number;                // ms, applied via animation-delay
  duration?: number;             // ms, overrides default from CSS class
  threshold?: number;            // 0-1, default 0.1
  rootMargin?: string;           // default "0px 0px -50px 0px"
  once?: boolean;                // default true
  className?: string;
  as?: "div" | "section" | "article";  // default "div"
}

export function RevealOnScroll({ ... }: RevealOnScrollProps) { ... }
```

**SSR strategy: start visible, hide on client.**
- Server render: full opacity, no transform (content visible for SEO/no-JS)
- Client hydration: apply `opacity-0` + starting transform via `useEffect` (not initial render)
- Intersection: apply the animation class (e.g., `animate-fade-in-up`)
- `prefers-reduced-motion: reduce` → skip the hide step entirely, content stays visible
- `once: true` → `observer.unobserve()` after first trigger
- Uses native `IntersectionObserver` — no library

#### Step A5: Create animation barrel file

Create `packages/core-components/src/components/animation/index.ts` exporting `RevealOnScroll`.

**Verification gate:**
- `pnpm type-check` and `pnpm build` pass
- Lightbox in DJ Fox Electrical still shows `animate-fade-in` and `animate-scale-in` correctly
- Manual test: wrap a section in base-template with `<RevealOnScroll variant="fade-up">`, scroll to verify

---

### Phase B: Advanced Primitives (Carousel + Parallax)

**Goal:** Carousel and parallax components.

#### Step B1: Create Carousel component

Create `packages/core-components/src/components/animation/carousel.tsx`:

```tsx
"use client";

export interface CarouselProps {
  children: React.ReactNode;     // each direct child = one slide
  autoPlay?: boolean;            // default false
  autoPlayInterval?: number;     // ms, default 5000
  showDots?: boolean;            // default true
  showArrows?: boolean;          // default true
  loop?: boolean;                // default true
  pauseOnHover?: boolean;        // default true
  className?: string;
  slideClassName?: string;
}

export function Carousel({ ... }: CarouselProps) { ... }
```

- Backed by `embla-carousel-react`
- Each direct child is a slide (children-based API)
- Auto-play pauses on hover **and** on focus (accessibility)
- `prefers-reduced-motion: reduce` → disable auto-play
- Dots use `bg-brand-primary` (active) / `bg-surface-muted` (inactive)
- Arrows use `lucide-react` ChevronLeft/ChevronRight
- Keyboard accessible: left/right arrows navigate

#### Step B2: Create useScrollParallax hook

Create `packages/core-components/src/components/animation/use-scroll-parallax.ts`:

```tsx
export interface UseScrollParallaxOptions {
  speed?: number;       // 0-1 range, default 0.3
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
}

export function useScrollParallax(options?: UseScrollParallaxOptions): React.RefObject<HTMLElement>;
```

- Returns a ref to attach to the parallax element
- Uses `IntersectionObserver` to activate only when in viewport
- When active, attaches `requestAnimationFrame`-throttled scroll listener
- Applies `transform: translateY(offset * speed)` (will-change: transform for GPU)
- `prefers-reduced-motion: reduce` → no-op
- Cleans up observer and scroll listener on unmount

#### Step B3: Create ParallaxSection wrapper

Create `packages/core-components/src/components/animation/parallax-section.tsx`:

```tsx
"use client";

export interface ParallaxSectionProps {
  children: React.ReactNode;
  backgroundImage?: string;
  speed?: number;          // default 0.3
  overlay?: boolean;       // dark overlay for text readability
  overlayOpacity?: number; // 0-1, default 0.4
  className?: string;
  minHeight?: string;      // default "400px"
}

export function ParallaxSection({ ... }: ParallaxSectionProps) { ... }
```

- Composes `useScrollParallax` internally
- Renders a containing div with `overflow-hidden` and the background element inside
- If `overlay` is true, renders a `bg-surface-inverse/40` overlay div
- This is what the AI generator prompt will reference — not the raw hook

#### Step B4: Update animation barrel

Export `Carousel`, `useScrollParallax`, `ParallaxSection` from `animation/index.ts`.

**Verification gate:**
- `pnpm type-check` passes
- Manual test: 3-slide carousel in base-template with auto-advance, dots, arrows, swipe
- Manual test: parallax section with background image in base-template
- Performance: no layout thrashing visible in Chrome DevTools Performance tab

---

### Phase C: Pipeline Integration

**Goal:** Make the AI component generator aware of and use animation primitives.

#### Step C1: Update `clientComponentShell` imports

Modify `tools/lib/theme-component-templates.ts`:

Create a `detectReactImports(jsxBody: string): string[]` function:
- Scan the JSX body for `useEffect`, `useRef`, `useCallback`, `useMemo`
- Always include `useState` (existing behaviour)
- Return deduplicated sorted list
- Update the import line: `import { ${imports.join(", ")} } from "react";`

#### Step C2: Update `buildComponentGenerationPrompt`

Add to the prompt in `tools/lib/theme-component-templates.ts`:

```
ANIMATION PRIMITIVES (use these when the layout pattern suggests animation):
- Scroll-triggered reveals: wrap section content in <RevealOnScroll variant="fade-up">
  Import: import { RevealOnScroll } from '@platform/core-components/components/animation';
- Image carousels/sliders: use <Carousel autoPlay showDots loop>
  Import: import { Carousel } from '@platform/core-components/components/animation';
- Parallax backgrounds: use <ParallaxSection backgroundImage={props.backgroundImage} speed={0.3}>
  Import: import { ParallaxSection } from '@platform/core-components/components/animation';
- CSS animation classes: animate-fade-in-up, animate-slide-in-left, animate-slide-in-right, animate-scale-up

ANIMATION RULES:
- Do NOT animate every section. Use RevealOnScroll on 2-3 content sections max.
- Carousels are for hero images, testimonials, and blog post grids ONLY when the layout says "slider" or "carousel".
- ParallaxSection is for hero backgrounds or full-bleed image sections only.
- Always respect prefers-reduced-motion (the primitives handle this internally).
```

#### Step C3: Update `needsUseClient` detection

In `tools/lib/theme-component-generator.ts`, update `CLIENT_PATTERNS`:

```ts
const CLIENT_PATTERNS = /\b(useState|useEffect|useRef|useCallback|useMemo|onClick|onChange|onSubmit|onKeyDown|onMouseEnter|onFocus|onBlur|RevealOnScroll|Carousel|ParallaxSection|useScrollParallax|IntersectionObserver)\b|<form\b/;
```

#### Step C4: Verify allowlist

Confirm `tools/lib/token-class-allowlist.ts` passes the new animation class names. The `animate-*` prefix is already allowed at line 108, so `animate-fade-in-up`, `animate-slide-in-left`, etc. should pass. Run a quick grep to verify.

**Verification gate:**
- `pnpm type-check` passes
- Run pipeline against a test URL (or use existing lyra output as reference)
- Check that generated hero components reference `Carousel` when blueprint has carousel-like `layoutPattern`
- Check that content sections reference `RevealOnScroll`
- Generated components compile without missing import errors

---

### Phase D: Testing + Hardening

**Goal:** Unit tests for all primitives and pipeline integration verification.

#### Step D1: RevealOnScroll tests

Create `packages/core-components/src/components/animation/__tests__/reveal-on-scroll.test.tsx`:
- Mock `IntersectionObserver` globally (class mock with `observe`/`unobserve`/`disconnect`)
- Test: renders children
- Test: content is visible by default on server render (no `opacity-0` in initial HTML)
- Test: applies animation class when observer fires intersection
- Test: `once: true` — unobserves after first intersection
- Test: `once: false` — re-triggers on subsequent intersections
- Test: `prefers-reduced-motion` → no hiding, no animation classes applied
- Test: respects custom `delay` and `threshold`

#### Step D2: Carousel tests

Create `packages/core-components/src/components/animation/__tests__/carousel.test.tsx`:
- Test: renders correct number of slides from children
- Test: dots count matches slide count
- Test: clicking next arrow changes active slide
- Test: auto-play advances slides (fake timers)
- Test: pause-on-hover stops auto-advance
- Test: `prefers-reduced-motion` disables auto-play

#### Step D3: useScrollParallax tests

Create `packages/core-components/src/components/animation/__tests__/use-scroll-parallax.test.ts`:
- Test: returns a ref object
- Test: no-op when `disabled: true`
- Test: no-op when `prefers-reduced-motion: reduce`
- Test: cleans up listeners on unmount

#### Step D4: Pipeline template tests

Create or extend `tools/__tests__/theme-component-templates.test.ts`:
- Test: `detectReactImports` correctly detects `useEffect`, `useRef` in JSX body
- Test: `clientComponentShell` produces correct import line with multiple hooks
- Test: `buildComponentGenerationPrompt` output contains animation primitive references
- Test: `needsUseClient` returns true for JSX containing `RevealOnScroll`

#### Step D5: Bundle delta measurement

Build base-template before and after changes. Record:
- Total JS bundle size (First Load JS from `next build` output)
- CSS bundle size
- Expected delta: ~8-10KB gzipped (embla + animation primitives)

**Verification gate:**
- All tests pass: `pnpm --filter @platform/core-components test` and pipeline tests
- `pnpm type-check` and `pnpm build` pass monorepo-wide
- Bundle delta is within acceptable range (< 15KB gzipped total)

---

## File Summary

### New files

| File | Purpose |
|------|---------|
| `packages/core-components/src/styles/animations.css` | Shared keyframes + utility classes (8 animations) |
| `packages/core-components/src/components/animation/index.ts` | Animation primitives barrel export |
| `packages/core-components/src/components/animation/reveal-on-scroll.tsx` | Scroll-triggered reveal wrapper |
| `packages/core-components/src/components/animation/carousel.tsx` | Embla-backed carousel |
| `packages/core-components/src/components/animation/use-scroll-parallax.ts` | Parallax scroll hook |
| `packages/core-components/src/components/animation/parallax-section.tsx` | Parallax background section wrapper |
| `packages/core-components/src/components/animation/__tests__/reveal-on-scroll.test.tsx` | RevealOnScroll unit tests |
| `packages/core-components/src/components/animation/__tests__/carousel.test.tsx` | Carousel unit tests |
| `packages/core-components/src/components/animation/__tests__/use-scroll-parallax.test.ts` | Parallax hook unit tests |
| `tools/__tests__/theme-component-templates.test.ts` | Pipeline template/prompt tests |

### Modified files

| File | Change |
|------|--------|
| `packages/core-components/package.json` | Add `embla-carousel-react` dependency |
| `packages/themes/orion/globals.css` | Import shared animations CSS, remove duplicated `@keyframes` and `.animate-*` |
| `packages/themes/vega/globals.css` | Import shared animations CSS, remove duplicated `@keyframes` and `.animate-*` |
| `tools/lib/theme-component-templates.ts` | `clientComponentShell` dynamic imports, `buildComponentGenerationPrompt` animation section |
| `tools/lib/theme-component-generator.ts` | `CLIENT_PATTERNS` regex expanded with animation primitive names |

### NOT modified (deliberate)

| File | Reason |
|------|--------|
| 57 existing `ui/` components | Animation applied at page composition level, not baked into components |
| `tools/lib/token-class-allowlist.ts` | `animate-*` prefix already permitted — no change needed |
| `packages/theme-system/` | Keyframes are in core-components, not theme-system |

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| RevealOnScroll hydration mismatch | Medium | Low | Use `suppressHydrationWarning` on wrapper; start-visible strategy means worst case is a brief flash, not invisible content |
| AI over-uses animation in generated components | Medium | Medium | Prompt explicitly caps usage ("2-3 sections max"), temperature 0 helps consistency |
| embla-carousel bundle size | Low | Low | ~7KB gzipped, tree-shakeable, only included in sites that import Carousel |
| CSS import order breaks if theme globals restructured | Low | Medium | Document required import order; add a comment in theme globals marking the import position |
| IntersectionObserver not available (very old browsers) | Very Low | Low | Fallback: content stays visible (start-visible strategy); no polyfill needed |
| Parallax scroll listener causes jank | Low | Medium | RAF-throttled, IntersectionObserver gate, documented as "hero only" usage |
