# YOLO Implementation Brief: Animation Primitives for White-Label Platform

**Branch:** feature/animation-primitives (created from develop)
**Session spec:** output/sessions/2026-02-21_animation-primitives/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error

---

## Context

The platform has no animation primitives — every generated site feels static compared to its reference. The ingestion pipeline produces components from screenshots but has zero animation awareness. This plan adds composable animation primitives (RevealOnScroll, Carousel, ParallaxSection) to core-components, a shared CSS keyframes library, and pipeline integration so the AI generator knows about and uses these primitives.

The synthesis was reviewed and approved via dual-model peer review (Claude + Codex). Implement it exactly as specified below.

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/animation-primitives
pnpm type-check   # must be clean before starting
```

---

## Phase A: Foundations (Keyframes + RevealOnScroll)

**Goal:** Shared keyframes library, embla dependency, and the highest-impact animation primitive.

### Step A1: Add embla-carousel dependency

```bash
pnpm --filter @platform/core-components add embla-carousel-react
```

Verify `pnpm install` resolves cleanly and `pnpm type-check` still passes.

### Step A2: Create shared animation CSS

Create `packages/core-components/src/styles/animations.css` with:

- 8 `@keyframes`: `fade-in`, `fade-in-up`, `fade-in-down`, `slide-in-left`, `slide-in-right`, `scale-in`, `scale-up`, `float`
- 8 corresponding `.animate-*` utility classes using `animation-fill-mode: both`
- **No `@layer`, no `@tailwind` directives** — plain CSS only

Example keyframes:
```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.5s ease-out both; }
```

Include all 8 animations following this pattern. Duration guidelines:
- `fade-in`: 0.3s
- `fade-in-up`, `fade-in-down`, `slide-in-left`, `slide-in-right`: 0.5s
- `scale-in`: 0.2s
- `scale-up`: 0.4s
- `float`: 3s ease-in-out infinite

### Step A3: Import shared CSS from theme globals

Update **both** `packages/themes/orion/globals.css` and `packages/themes/vega/globals.css`:

1. Add `@import "../../core-components/src/styles/animations.css";` **at the top**, before any theme-specific CSS
2. **Remove** the duplicated `@keyframes fade-in`, `@keyframes scale-in`, `.animate-fade-in`, `.animate-scale-in` sections from each file
3. Add a comment at the import line: `/* Shared animation keyframes — do not move below theme-specific CSS */`

**IMPORTANT:** The import must come before theme-specific rules that reference these classes. Read each globals.css file first to identify the exact lines to remove.

### Step A4: Create RevealOnScroll component

Create `packages/core-components/src/components/animation/reveal-on-scroll.tsx`:

```tsx
"use client";
```

Interface:
```tsx
export type RevealVariant = "fade-up" | "fade-in" | "fade-down" | "slide-left" | "slide-right" | "scale-up";

export interface RevealOnScrollProps {
  children: React.ReactNode;
  variant?: RevealVariant;       // default "fade-up"
  delay?: number;                // ms, applied via animation-delay inline style
  duration?: number;             // ms, overrides CSS class default
  threshold?: number;            // 0-1, default 0.1
  rootMargin?: string;           // default "0px 0px -50px 0px"
  once?: boolean;                // default true
  className?: string;
  as?: "div" | "section" | "article";  // default "div"
}
```

**SSR strategy — start visible, hide on client:**
1. Server render: full opacity, no transform (content visible for SEO and no-JS users)
2. Client hydration: in `useEffect`, apply `opacity: 0` + starting transform (e.g., `translateY(16px)` for fade-up)
3. Intersection observed: apply the animation class (e.g., `animate-fade-in-up`) which transitions from hidden to visible
4. `prefers-reduced-motion: reduce` → skip the hide step entirely, content stays visible with no animation
5. `once: true` (default) → `observer.unobserve(el)` after first intersection
6. Uses native `IntersectionObserver` — no library dependency

Map variants to CSS classes:
- `fade-up` → initial: `opacity: 0; transform: translateY(16px)` → class: `animate-fade-in-up`
- `fade-in` → initial: `opacity: 0` → class: `animate-fade-in`
- `fade-down` → initial: `opacity: 0; transform: translateY(-16px)` → class: `animate-fade-in-down`
- `slide-left` → initial: `opacity: 0; transform: translateX(-24px)` → class: `animate-slide-in-left`
- `slide-right` → initial: `opacity: 0; transform: translateX(24px)` → class: `animate-slide-in-right`
- `scale-up` → initial: `opacity: 0; transform: scale(0.9)` → class: `animate-scale-up`

Use `suppressHydrationWarning` on the wrapper element to handle the server→client style difference.

### Step A5: Create animation barrel file

Create `packages/core-components/src/components/animation/index.ts`:
```tsx
export { RevealOnScroll } from "./reveal-on-scroll";
export type { RevealOnScrollProps, RevealVariant } from "./reveal-on-scroll";
```

### Phase A Commit

```bash
git add packages/core-components/src/styles/animations.css \
       packages/core-components/src/components/animation/ \
       packages/core-components/package.json \
       packages/themes/orion/globals.css \
       packages/themes/vega/globals.css \
       pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
feat(animation): add shared keyframes library and RevealOnScroll component

- Shared animations.css with 8 keyframes (fade-in, fade-in-up, slide-in-left, etc.)
- RevealOnScroll client component using native IntersectionObserver
- SSR-safe: content visible by default, animated on client intersection
- Respects prefers-reduced-motion
- Import shared CSS from theme globals, remove duplicated keyframes

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

### Phase A Verification Gate — STOP if this fails

```bash
pnpm type-check
pnpm build
```

Verify lightbox animation classes still resolve: grep for `animate-fade-in` and `animate-scale-in` usage in the certificate-lightbox component and confirm they're provided by the shared animations.css.

---

## Phase B: Advanced Primitives (Carousel + Parallax)

**Goal:** Carousel backed by embla and parallax scroll components.

### Step B1: Create Carousel component

Create `packages/core-components/src/components/animation/carousel.tsx`:

```tsx
"use client";
```

Interface:
```tsx
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
```

Implementation details:
- Use `embla-carousel-react` — `const [emblaRef, emblaApi] = useEmblaCarousel({ loop })`
- Each direct child wrapped in a slide container `<div className="flex-[0_0_100%] min-w-0">`
- Auto-play: `useEffect` + `setInterval` when `autoPlay && emblaApi`, clear on unmount
- Pause on hover: `onMouseEnter` → clear interval, `onMouseLeave` → restart
- Pause on focus within: `onFocusCapture` → clear interval
- `prefers-reduced-motion: reduce` → disable auto-play (check via `window.matchMedia`)
- Dots: map `emblaApi.scrollSnapList()`, active dot uses `bg-brand-primary`, inactive uses `bg-surface-muted`
- Arrows: `lucide-react` `ChevronLeft`/`ChevronRight`, use `emblaApi.scrollPrev()`/`scrollNext()`
- Keyboard: arrow keys on the container navigate slides (onKeyDown handler)
- Named export: `export function Carousel`

### Step B2: Create useScrollParallax hook

Create `packages/core-components/src/components/animation/use-scroll-parallax.ts`:

Interface:
```tsx
export interface UseScrollParallaxOptions {
  speed?: number;       // 0-1 range, default 0.3
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
}
```

Implementation:
- Returns a `React.RefObject<HTMLElement>` to attach to the parallax element
- `useEffect`: create `IntersectionObserver` on the ref element
- When element enters viewport: attach `requestAnimationFrame`-throttled scroll listener
- When element leaves viewport: remove scroll listener (save CPU)
- Scroll handler: calculate offset from element's position, apply `transform: translateY(offset * speed)` via `ref.current.style.transform`
- Set `will-change: transform` on the element for GPU acceleration
- `prefers-reduced-motion: reduce` → return ref but attach no observers or listeners
- Clean up everything on unmount

### Step B3: Create ParallaxSection wrapper

Create `packages/core-components/src/components/animation/parallax-section.tsx`:

```tsx
"use client";
```

Interface:
```tsx
export interface ParallaxSectionProps {
  children: React.ReactNode;
  backgroundImage?: string;
  speed?: number;          // default 0.3
  overlay?: boolean;       // dark overlay for text readability, default false
  overlayOpacity?: number; // 0-1, default 0.4
  className?: string;
  minHeight?: string;      // default "400px"
}
```

Implementation:
- Outer container: `position: relative`, `overflow: hidden`, `min-height`
- Background div: uses `useScrollParallax` hook, absolutely positioned, full cover, `background-image` via `style` prop, `bg-cover bg-center`
- If `overlay`: render `<div className="absolute inset-0 bg-surface-inverse" style={{ opacity: overlayOpacity }}>` between background and children
- Children rendered in a `relative z-10` container

### Step B4: Update animation barrel

Update `packages/core-components/src/components/animation/index.ts` to also export:
```tsx
export { Carousel } from "./carousel";
export type { CarouselProps } from "./carousel";
export { useScrollParallax } from "./use-scroll-parallax";
export type { UseScrollParallaxOptions } from "./use-scroll-parallax";
export { ParallaxSection } from "./parallax-section";
export type { ParallaxSectionProps } from "./parallax-section";
```

### Phase B Commit

```bash
git add packages/core-components/src/components/animation/
git commit -m "$(cat <<'EOF'
feat(animation): add Carousel, useScrollParallax, and ParallaxSection

- Carousel backed by embla-carousel-react with auto-play, dots, arrows, swipe
- useScrollParallax hook with IntersectionObserver-gated scroll listener
- ParallaxSection wrapper composing the hook for easy AI generator usage
- All respect prefers-reduced-motion, keyboard accessible

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

### Phase B Verification Gate — STOP if this fails

```bash
pnpm type-check
```

---

## Phase C: Pipeline Integration

**Goal:** Make the AI component generator aware of and use the animation primitives.

### Step C1: Update `clientComponentShell` imports

Read `tools/lib/theme-component-templates.ts` first.

Add a new function `detectReactImports(jsxBody: string): string[]`:
- Scan the JSX body for React hooks: `useEffect`, `useRef`, `useCallback`, `useMemo`
- Always include `useState` (existing behaviour)
- Return deduplicated, sorted array

Update `clientComponentShell` to use this function:
- Replace the hardcoded `import { useState } from "react";` with `import { ${detectReactImports(jsxBody).join(", ")} } from "react";`
- This means `clientComponentShell` now needs the `jsxBody` parameter — update its signature accordingly

### Step C2: Update `buildComponentGenerationPrompt`

Read `tools/lib/theme-component-templates.ts` first.

Add after the existing RULES section:

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
8. Do NOT animate every section. Use RevealOnScroll on 2-3 content sections max.
9. Carousels are for hero images, testimonials, and blog post grids ONLY when the layout says "slider" or "carousel".
10. ParallaxSection is for hero backgrounds or full-bleed image sections only.
11. Always respect prefers-reduced-motion (the primitives handle this internally).
```

### Step C3: Update `needsUseClient` detection

Read `tools/lib/theme-component-generator.ts` first.

Update the `CLIENT_PATTERNS` regex to include animation primitive names:

```ts
const CLIENT_PATTERNS = /\b(useState|useEffect|useRef|useCallback|useMemo|onClick|onChange|onSubmit|onKeyDown|onMouseEnter|onFocus|onBlur|RevealOnScroll|Carousel|ParallaxSection|useScrollParallax|IntersectionObserver)\b|<form\b/;
```

### Step C4: Verify allowlist

Read `tools/lib/token-class-allowlist.ts`. Confirm that the `animate-*` prefix at line 108 in `STANDARD_TAILWIND_PREFIXES` covers `animate-fade-in-up`, `animate-slide-in-left`, etc. It should — the prefix check uses `startsWith("animate-")`. If it does, no changes needed. Log confirmation.

### Step C5: Update callers of `clientComponentShell`

Since `clientComponentShell` now takes `jsxBody` as an additional parameter, update all callers in `tools/lib/theme-component-generator.ts` to pass it. Read the file and find all calls to `clientComponentShell(blueprint, jsxBody)` — this is likely already the call pattern, but verify the signature change doesn't break anything.

### Phase C Commit

```bash
git add tools/lib/theme-component-templates.ts \
       tools/lib/theme-component-generator.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): integrate animation primitives into component generator

- clientComponentShell dynamically detects needed React hook imports
- buildComponentGenerationPrompt includes animation primitive guidance
- needsUseClient detects RevealOnScroll, Carousel, ParallaxSection usage
- AI generator will now use animation primitives when layout warrants it

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

### Phase C Verification Gate — STOP if this fails

```bash
pnpm type-check
```

---

## Phase D: Testing + Hardening

**Goal:** Unit tests for all primitives and pipeline integration.

### Step D1: RevealOnScroll tests

Create `packages/core-components/src/components/animation/__tests__/reveal-on-scroll.test.tsx`:

Mock `IntersectionObserver` globally (class mock with `observe`/`unobserve`/`disconnect` methods + ability to trigger intersection callbacks).

Tests:
- Renders children content
- Content is visible by default on initial render (no `opacity-0` in initial HTML)
- Applies animation class when observer fires intersection
- `once: true` → calls `unobserve` after first intersection
- `once: false` → does not call `unobserve`
- Respects custom `delay` (check for `animation-delay` in style)
- `prefers-reduced-motion: reduce` → content stays visible, no animation class applied

### Step D2: Carousel tests

Create `packages/core-components/src/components/animation/__tests__/carousel.test.tsx`:

Tests:
- Renders correct number of slide containers from children
- Shows dots when `showDots` is true, dot count matches children count
- Shows arrows when `showArrows` is true
- Auto-play is disabled by default (no interval set)
- When `autoPlay: true`, slides advance after interval (use `vi.useFakeTimers()`)

### Step D3: useScrollParallax tests

Create `packages/core-components/src/components/animation/__tests__/use-scroll-parallax.test.ts`:

Tests:
- Returns a ref object
- No-op when `disabled: true` (no observer created)
- Cleans up on unmount (observer disconnected)

### Step D4: Pipeline template tests

Create `tools/__tests__/theme-component-templates.test.ts`:

Tests:
- `detectReactImports` returns `["useState"]` for body with no hooks
- `detectReactImports` returns `["useEffect", "useRef", "useState"]` for body containing `useEffect` and `useRef`
- `buildComponentGenerationPrompt` output contains "ANIMATION PRIMITIVES"
- `buildComponentGenerationPrompt` output contains "RevealOnScroll"

Create or extend `tools/__tests__/theme-component-generator.test.ts`:

Tests:
- `needsUseClient` returns `true` when JSX body contains `RevealOnScroll`
- `needsUseClient` returns `true` when JSX body contains `Carousel`

### Step D5: Bundle delta measurement

```bash
# Record baseline
cd sites/base-template && npm run build 2>&1 | grep "First Load JS"
# Record the output
cd ../..
```

Compare against post-implementation build. Expected delta: ~8-10KB gzipped. Record the actual numbers in the final report.

### Phase D Commit

```bash
git add packages/core-components/src/components/animation/__tests__/ \
       tools/__tests__/
git commit -m "$(cat <<'EOF'
test(animation): add unit tests for animation primitives and pipeline integration

- RevealOnScroll: IntersectionObserver mock, SSR visibility, reduced-motion
- Carousel: slide rendering, dots, arrows, auto-play with fake timers
- useScrollParallax: ref, disabled, cleanup
- Pipeline: detectReactImports, prompt content, needsUseClient detection

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

### Phase D Verification Gate — STOP if this fails

```bash
# Run all tests
cd packages/core-components && npm test -- --run
cd ../..
cd tools && npx vitest run --reporter=verbose
cd ..

# Full monorepo checks
pnpm type-check
pnpm build
```

---

## Final Report

After all phases complete, output:
1. Phases completed — list each with commit SHA
2. New files created (count and paths)
3. Bundle delta (First Load JS before vs after)
4. Test results — all pass counts
5. Build status — confirm `pnpm type-check && pnpm build` passes
6. Any exceptions or intentional deviations from the plan

## Update Session File

After completing all phases, append to `output/sessions/2026-02-21_animation-primitives/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, test counts, bundle delta, any surprises]

### Commits
[list each commit SHA and message]
```

Confirm this was done in the final report.

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on `feature/animation-primitives`
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Do NOT switch branches or create new branches after the initial checkout
- Do NOT retrofit animation into any of the 57 existing ui/ components
- Do NOT modify `tools/lib/token-class-allowlist.ts` — the `animate-*` prefix is already permitted

## Completed

**Date:** 2026-02-21
**Status:** All phases executed successfully

Implemented composable animation primitives (RevealOnScroll, Carousel, ParallaxSection) in core-components with a shared 8-keyframe CSS library, integrated them into the AI component generation pipeline with animation-aware prompting and client-detection, and added 21 unit tests across 6 test files (15 animation + 6 pipeline). All primitives respect prefers-reduced-motion and are SSR-safe. Lightbox `@apply animate-*` usage was replaced with direct `animation:` properties to resolve Tailwind compilation from imported CSS. Bundle delta is zero — primitives are tree-shakeable and only included when imported by page components. The `@vitejs/plugin-react` devDep was added for JSX transform in component tests.

### Commits
- `9d88aed` feat(animation): add shared keyframes library and RevealOnScroll component
- `39d07fa` feat(animation): add Carousel, useScrollParallax, and ParallaxSection
- `86162a1` feat(pipeline): integrate animation primitives into component generator
- `655f152` test(animation): add unit tests for animation primitives and pipeline integration
