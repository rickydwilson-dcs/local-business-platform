# Claude's Implementation Plan: Animation Primitives

**Date:** 2026-02-21
**Author:** Claude (independent plan — written before seeing Codex's plan)

---

## Phase 1: Shared Keyframes Library

**Goal:** Establish a shared CSS keyframes library that all themes inherit, eliminating duplication.

### Step 1.1: Create shared animation CSS

Create `packages/core-components/src/styles/animations.css`:

```css
/* ── Shared Animation Keyframes ────────────────────────────── */

/* Fade variants */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide variants */
@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Scale */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes scale-up {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Decorative / looping */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* ── Utility Classes ───────────────────────────────────────── */

.animate-fade-in {
  animation: fade-in 0.3s ease-out both;
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out both;
}
.animate-fade-in-down {
  animation: fade-in-down 0.5s ease-out both;
}
.animate-slide-in-left {
  animation: slide-in-left 0.5s ease-out both;
}
.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-out both;
}
.animate-scale-in {
  animation: scale-in 0.2s ease-out both;
}
.animate-scale-up {
  animation: scale-up 0.4s ease-out both;
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

### Step 1.2: Import from theme globals

Update both `packages/themes/orion/globals.css` and `packages/themes/vega/globals.css`:

- Remove the duplicated `@keyframes fade-in`, `@keyframes scale-in`, and their `.animate-*` utilities
- Add `@import "../../core-components/src/styles/animations.css";` at the top

### Step 1.3: Export from core-components package

Update `packages/core-components/package.json` exports to include the CSS file so sites can import it directly if needed.

**Verification gate:** `pnpm build` passes. The lightbox in both themes still uses `animate-fade-in` and `animate-scale-in` correctly (visual check in dev server).

---

## Phase 2: RevealOnScroll Component

**Goal:** Build the highest-impact animation primitive — scroll-triggered reveal.

### Step 2.1: Create the component

Create `packages/core-components/src/components/ui/reveal-on-scroll.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export type RevealVariant = "fade-up" | "fade-in" | "fade-down" | "slide-left" | "slide-right" | "scale-up";

export interface RevealOnScrollProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;        // ms delay before animation starts
  duration?: number;     // ms animation duration
  threshold?: number;    // 0-1 IntersectionObserver threshold
  once?: boolean;        // animate only on first intersection (default true)
  className?: string;    // additional classes on wrapper
  as?: "div" | "section" | "article";  // wrapper element
}

export function RevealOnScroll({ ... }: RevealOnScrollProps) { ... }
```

**Design decisions:**

- Uses native `IntersectionObserver` directly — no `react-intersection-observer` dependency (saves ~3KB, simple enough to not need a library)
- SSR-safe: renders children immediately with `opacity: 0` and the starting transform, then applies the animation class on intersection. If JS is disabled, a `<noscript>` fallback or CSS `@media (prefers-reduced-motion)` shows content without animation
- `once: true` by default — most scroll reveals should only fire once
- The `as` prop lets it render as `<section>` when wrapping page sections (semantic HTML)
- Uses the shared keyframe classes from Phase 1 — no inline keyframes
- `prefers-reduced-motion: reduce` → skip animation entirely, show content immediately

**Implementation approach:**

1. `useRef` on the wrapper element
2. `useEffect` sets up `IntersectionObserver` with `threshold` and `rootMargin: "0px 0px -50px 0px"` (triggers slightly before element enters viewport)
3. On intersection, add the animation class (e.g., `animate-fade-in-up`) and set `animation-delay` via inline style
4. When `once` is true, `observer.unobserve()` after first trigger
5. Initial state: `opacity-0` + starting transform (e.g., `translate-y-4` for fade-up)

### Step 2.2: Export from core-components barrel

Add export to `packages/core-components/src/components/ui/index.ts` (or wherever the barrel file is).

### Step 2.3: Write tests

Create `packages/core-components/src/__tests__/reveal-on-scroll.test.tsx`:

- Mock `IntersectionObserver` globally in test setup
- Test: renders children
- Test: starts with opacity-0
- Test: applies animation class when intersection fires
- Test: does not re-animate when `once: true` and element re-enters viewport
- Test: respects `prefers-reduced-motion`

**Verification gate:** `pnpm type-check` passes. Tests pass. Manual test: add `<RevealOnScroll variant="fade-up">` around a section in base-template, run dev server, scroll to verify animation fires.

---

## Phase 3: Carousel Component

**Goal:** Reusable carousel backed by a lightweight library.

### Step 3.1: Add embla-carousel dependency

```bash
pnpm --filter @platform/core-components add embla-carousel-react
```

**Why embla:** ~7KB gzipped, zero dependencies, headless (no imposed styling), SSR-compatible, touch/swipe built-in, active maintenance. Compared to Swiper (40KB+) or hand-rolling (unreliable AI output).

### Step 3.2: Create the component

Create `packages/core-components/src/components/ui/carousel.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

export interface CarouselProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;  // ms, default 5000
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  className?: string;
  slideClassName?: string;
}

export function Carousel({ ... }: CarouselProps) { ... }
```

**Design decisions:**

- Headless approach: embla handles the scroll mechanics, we provide the UI (dots, arrows)
- Each direct child is a slide — no `<CarouselSlide>` wrapper needed
- Auto-play via `useEffect` + `setInterval`, pauses on hover/focus
- Dots and arrows use theme tokens (`bg-brand-primary` for active dot, `text-surface-foreground` for arrows)
- Touch/swipe is built into embla
- `loop: true` by default for hero carousels
- Arrow buttons use `lucide-react` ChevronLeft/ChevronRight (already a dependency)

### Step 3.3: Write tests

Create `packages/core-components/src/__tests__/carousel.test.tsx`:

- Test: renders children as slides
- Test: dot count matches slide count
- Test: clicking next arrow advances slide
- Test: auto-play advances slides (use fake timers)

**Verification gate:** `pnpm type-check` passes. Tests pass. Manual test: create a 3-image carousel in base-template, verify swipe, dots, arrows, auto-advance work.

---

## Phase 4: Parallax Hook

**Goal:** Lightweight scroll-speed parallax for background elements.

### Step 4.1: Create the hook

Create `packages/core-components/src/hooks/use-scroll-parallax.ts`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export interface UseScrollParallaxOptions {
  speed?: number;   // 0-1 range: 0 = no movement, 0.5 = half speed, 1 = fixed
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
}

export function useScrollParallax(options?: UseScrollParallaxOptions): React.RefObject<HTMLElement> { ... }
```

**Design decisions:**

- Returns a ref to attach to the target element
- Uses `IntersectionObserver` to only activate when element is in viewport (no scroll listener running globally)
- When in viewport, applies `transform: translateY(offset * speed)` via `requestAnimationFrame`-throttled scroll listener
- `prefers-reduced-motion: reduce` → disable entirely
- For the simple case (fixed background), recommend using Tailwind `bg-fixed` class instead

### Step 4.2: Create a ParallaxSection wrapper component

Create `packages/core-components/src/components/ui/parallax-section.tsx`:

```tsx
export interface ParallaxSectionProps {
  children: React.ReactNode;
  backgroundImage?: string;
  speed?: number;
  className?: string;
  overlay?: boolean;  // dark overlay for text readability
}

export function ParallaxSection({ ... }: ParallaxSectionProps) { ... }
```

This composes `useScrollParallax` into a ready-to-use section with a parallax background.

### Step 4.3: Write tests

- Test: hook returns a ref
- Test: no scroll listener when `disabled: true`
- Test: no scroll listener when `prefers-reduced-motion: reduce`

**Verification gate:** `pnpm type-check` passes. Tests pass. Manual test in base-template with a background image.

---

## Phase 5: Pipeline Integration

**Goal:** Make the AI component generator aware of animation primitives.

### Step 5.1: Update `clientComponentShell` to support additional imports

Modify `tools/lib/theme-component-templates.ts`:

Currently `clientComponentShell` hardcodes `import { useState } from "react";`. Change to dynamically determine needed React hooks based on the blueprint and generated JSX body.

Add a `detectNeededImports(blueprint, jsxBody)` function that returns the set of React hooks to import:

- Always: `useState` (existing behaviour)
- If blueprint `interactionNeeds === "stateful"` and category suggests animation (Hero with carousel hints, testimonial slider): add `useEffect`, `useCallback`
- If jsxBody contains `useEffect`, `useRef`, `useCallback`: add them

Update the import line to: `import { ${hooks.join(", ")} } from "react";`

### Step 5.2: Update `buildComponentGenerationPrompt`

Add an animation section to the prompt in `tools/lib/theme-component-templates.ts`:

```
ANIMATION PRIMITIVES (use these when the section purpose suggests animation):
- For scroll-triggered reveals: wrap sections in <RevealOnScroll variant="fade-up">
  Import: import { RevealOnScroll } from '@platform/core-components/ui/reveal-on-scroll';
- For image carousels/sliders: use <Carousel autoPlay showDots>
  Import: import { Carousel } from '@platform/core-components/ui/carousel';
- For parallax backgrounds: use <ParallaxSection backgroundImage={...} speed={0.5}>
  Import: import { ParallaxSection } from '@platform/core-components/ui/parallax-section';
- For simple CSS animations: use classes animate-fade-in-up, animate-slide-in-left, etc.
- Only add animation when the section purpose clearly warrants it (hero carousels, testimonial sliders, reveal effects).
  Do NOT animate every section.
```

### Step 5.3: Update `needsUseClient` detection

In `tools/lib/theme-component-generator.ts`, add `RevealOnScroll`, `Carousel`, `ParallaxSection`, `useScrollParallax` to the `CLIENT_PATTERNS` regex so components importing them are correctly flagged as client components.

### Step 5.4: Add animation imports to the generated component validation

Update `tools/lib/token-class-allowlist.ts` if needed — the `animate-*` prefix is already permitted, but verify the new keyframe class names (`animate-fade-in-up`, `animate-slide-in-left`, etc.) pass validation.

**Verification gate:** Run the pipeline against a test URL. Verify that:

1. Hero sections with carousel-like blueprints generate components that import `Carousel`
2. Content sections generate components wrapped in `RevealOnScroll`
3. Generated components pass TypeScript check
4. `pnpm type-check` passes across the monorepo

---

## Phase 6: Remove Duplicated Keyframes from Themes

**Goal:** Clean up now that shared keyframes exist.

### Step 6.1: Remove duplicated `@keyframes` from theme globals

In both `packages/themes/orion/globals.css` and `packages/themes/vega/globals.css`:

- Remove the `/* ANIMATIONS */` section with `@keyframes fade-in`, `@keyframes scale-in`, `.animate-fade-in`, `.animate-scale-in`
- These are now provided by the shared `animations.css` imported in Phase 1

### Step 6.2: Verify lightbox still works

The certificate lightbox components reference `animate-fade-in` and `animate-scale-in`. Verify these still resolve after the import change.

**Verification gate:** `pnpm build` passes. Dev server shows lightbox animations working on DJ Fox Electrical.

---

## Risks and Trade-offs

### Bundle size

- `embla-carousel-react`: ~7KB gzipped. Acceptable for the carousel capability it provides. Tree-shakeable — sites without carousels won't include it.
- `RevealOnScroll` + `useScrollParallax`: ~2KB total, no external deps.
- Shared keyframes CSS: ~1KB.
- **Total added weight: ~10KB gzipped** for sites using all primitives.

### IntersectionObserver browser support

- Supported in all modern browsers since 2019. No polyfill needed for our target audience (Chrome 80+, Safari 14+, Firefox 75+).

### SSR and hydration

- `RevealOnScroll` renders children with `opacity: 0` initially. If JS fails to load, content is invisible. **Mitigation:** Add a `<noscript><style>.reveal-target { opacity: 1 !important; transform: none !important; }</style></noscript>` in the component, or use CSS `:has()` / progressive enhancement.
- Alternative: render fully visible on server, add animation class on client hydration. This causes a brief flash of content → animation, but guarantees content is always visible.

### AI generation reliability

- The AI may not reliably use the animation primitives even when told to. The prompt gives guidance, but at temperature 0 with a focused instruction set, adoption should be reasonable.
- Fallback: hand-wrap generated components in `RevealOnScroll` during the preview/customisation step.

### Migration of existing components

- The 57 existing core-components are NOT retrofitted with RevealOnScroll. This is deliberate — animation should be applied at the page composition level (wrapping sections), not baked into individual card/hero components. Components stay pure; pages decide animation.

---

## File Summary

### New files

| File                                                               | Purpose                            |
| ------------------------------------------------------------------ | ---------------------------------- |
| `packages/core-components/src/styles/animations.css`               | Shared keyframes + utility classes |
| `packages/core-components/src/components/ui/reveal-on-scroll.tsx`  | Scroll-triggered reveal wrapper    |
| `packages/core-components/src/components/ui/carousel.tsx`          | Embla-backed carousel              |
| `packages/core-components/src/hooks/use-scroll-parallax.ts`        | Parallax scroll hook               |
| `packages/core-components/src/components/ui/parallax-section.tsx`  | Parallax background section        |
| `packages/core-components/src/__tests__/reveal-on-scroll.test.tsx` | RevealOnScroll tests               |
| `packages/core-components/src/__tests__/carousel.test.tsx`         | Carousel tests                     |

### Modified files

| File                                     | Change                                                |
| ---------------------------------------- | ----------------------------------------------------- |
| `packages/core-components/package.json`  | Add `embla-carousel-react` dependency                 |
| `packages/themes/orion/globals.css`      | Import shared animations, remove duplicated keyframes |
| `packages/themes/vega/globals.css`       | Import shared animations, remove duplicated keyframes |
| `tools/lib/theme-component-templates.ts` | Update prompt + `clientComponentShell` imports        |
| `tools/lib/theme-component-generator.ts` | Update `needsUseClient` detection patterns            |
