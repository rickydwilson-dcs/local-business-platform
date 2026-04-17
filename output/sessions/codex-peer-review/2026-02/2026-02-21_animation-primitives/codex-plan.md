# Codex Implementation Plan: Animation Primitives for the White-Label Platform

## 1. Decide architecture boundaries and dependency strategy first

1. Keep animation primitives in `packages/core-components` (not a new package) to minimize integration overhead with the existing generator and exports.
2. Create a dedicated animation namespace under core-components:

- `packages/core-components/src/components/animation/`
- keep UI components in `components/ui/` unchanged initially.

3. Add only one new runtime dependency: `embla-carousel-react` (lightweight, tree-shakable).
4. Explicitly keep SSR-first behavior: primitives are client components, composed by server components via `children`/props only.

Files to modify:

- `packages/core-components/package.json`
- `packages/core-components/src/index.ts`
- `packages/core-components/src/components/animation/*` (new)

Verification gate:

- `pnpm install` resolves dependency and monorepo type-check still passes before feature work.

Risks/trade-offs:

- Adding any client library increases bundle size; mitigated via lazy usage and no global import side effects.

## 2. Implement `RevealOnScroll` primitive (highest impact first)

1. Build `RevealOnScroll` as a client wrapper with IntersectionObserver and graceful SSR behavior:

- content visible by default before hydration (SEO-safe)
- on client, apply hidden -> revealed classes when intersecting
- support `once` behavior default true

2. API design:

- `variant`: `"fade-up" | "fade-in" | "slide-left" | "slide-right"`
- `delayMs`, `durationMs`, `threshold`, `rootMargin`, `as` (optional element tag), `className`

3. Implement without cloneElement to keep RSC compatibility (`<RevealOnScroll><ServerComponent /></RevealOnScroll>` works).

Files to create/modify:

- `packages/core-components/src/components/animation/reveal-on-scroll.tsx` (new)
- `packages/core-components/src/components/animation/index.ts` (new)
- `packages/core-components/src/index.ts` (export)

Verification gate:

- Render in a server page with server children compiles and hydrates.
- No runtime errors when IntersectionObserver unavailable (fallback to immediate visible).

Risks/trade-offs:

- Hydration mismatch risk if initial class handling is wrong; default-visible strategy reduces this.

## 3. Implement `Carousel` primitive with Embla

1. Build `Carousel` client primitive backed by `embla-carousel-react`.
2. Minimum feature set per acceptance:

- swipe/touch
- auto-advance (configurable interval, pause-on-hover)
- dots and arrow controls
- controlled/uncontrolled start index

3. Keep content composable:

- API allows `items` data mode and/or slot mode via `children` (prefer one clear mode for MVP, recommend `items + renderItem`).

Files to create/modify:

- `packages/core-components/src/components/animation/carousel.tsx` (new)
- `packages/core-components/src/components/animation/index.ts`
- optional helper: `packages/core-components/src/components/animation/types.ts` (new)
- `packages/core-components/src/index.ts`

Verification gate:

- Carousel supports keyboard/arrow clicks, dot navigation, swipe gestures in local story/test harness.

Risks/trade-offs:

- Auto-play can hurt accessibility; include pause-on-hover and reduced-motion guard.

## 4. Implement `useScrollParallax` hook

1. Add lightweight hook using passive scroll listener + `requestAnimationFrame` throttling.
2. Hook API:

- `factor` (speed multiplier)
- optional `axis` (`y` default)
- optional clamp
- returns transform style value or numeric offset.

3. Respect motion preferences:

- disable parallax when `prefers-reduced-motion: reduce`.

Files to create/modify:

- `packages/core-components/src/components/animation/use-scroll-parallax.ts` (new)
- `packages/core-components/src/components/animation/index.ts`
- `packages/core-components/src/index.ts`

Verification gate:

- No layout thrash in profiler (RAF updates only).
- Hook no-ops cleanly during SSR.

Risks/trade-offs:

- Scroll listeners can be expensive if overused; document “hero/background only” guidance.

## 5. Centralize shared keyframes and animation utility classes

1. Create a shared base animation CSS file imported by all theme globals.
2. Include at least 6 keyframes + utility classes:

- `fade-in`
- `fade-in-up`
- `slide-in-left`
- `slide-in-right`
- `scale-up`
- `float`

3. Keep compatible with current CSS import constraints:

- plain top-level selectors
- no `@layer`
- no `@tailwind` directives.

Files to create/modify:

- `packages/theme-system/src/animations.css` (new)
- `packages/themes/vega/globals.css` (import shared file, remove duplicate keyframes)
- `packages/themes/orion/globals.css` (import shared file, remove duplicate keyframes)
- optional: new generated themes scaffold should import same shared file (follow-up in pipeline tooling)

Verification gate:

- Both existing themes build with no CSS layer errors.
- Existing lightbox/menu animations still behave identically or better.

Risks/trade-offs:

- CSS import ordering can break if inserted incorrectly; enforce top-of-file import pattern.

## 6. Integrate primitives into pipeline prompt + templates

1. Update `buildComponentGenerationPrompt()` to explicitly list available primitives and usage heuristics:

- use `RevealOnScroll` for section-entry motion
- use `Carousel` for rotating hero/testimonial/blog cards
- use `useScrollParallax` sparingly for hero media/decorative backgrounds
- respect reduced motion and avoid over-animation

2. Update shell templates:

- `clientComponentShell` can import `useEffect`/`useRef`/`useState` as needed
- include conditional imports to avoid lint noise (or standardize imported set if accepted)

3. Improve client detection logic in generator:

- detect `IntersectionObserver`, `useEffect`, `useRef`, Embla usage, and parallax hook usage
- continue treating navigation/forms as stateful.

Files to modify:

- `tools/lib/theme-component-templates.ts`
- `tools/lib/theme-component-generator.ts`
- optional: `tools/lib/token-class-allowlist.ts` (ensure classes used by primitives remain allowed)

Verification gate:

- Sample generated component prompt outputs include primitive usage instructions.
- Generated client components compile when using `useEffect`/`useRef` without manual edits.

Risks/trade-offs:

- AI may overuse animation primitives; add prompt rule to cap motion and prioritize readability.

## 7. Testing plan (unit + integration)

1. Add unit tests for `RevealOnScroll`:

- mock IntersectionObserver
- verifies hidden/revealed class changes
- verifies `once`, `threshold`, `delayMs` behavior

2. Add unit tests for `Carousel`:

- renders slides
- arrow navigation updates index
- dot navigation works
- auto-advance toggles/pause-on-hover behavior

3. Add tests for `useScrollParallax`:

- reduced-motion short-circuit
- factor calculation and cleanup.

4. Add template/generator tests for client import detection:

- generated body containing `useEffect/useRef/IntersectionObserver` gets client shell.

Files to create/modify:

- `packages/core-components/src/components/animation/__tests__/reveal-on-scroll.test.tsx` (new)
- `packages/core-components/src/components/animation/__tests__/carousel.test.tsx` (new)
- `packages/core-components/src/components/animation/__tests__/use-scroll-parallax.test.ts` (new)
- `tools/lib/__tests__/theme-component-templates.test.ts` (new or extend existing)
- `tools/lib/__tests__/theme-component-generator.test.ts` (new or extend)

Verification gate:

- `pnpm --filter @platform/core-components test` passes.
- pipeline template tests pass without API calls.

Risks/trade-offs:

- DOM testing in Vitest needs jsdom + observer mocks; ensure test harness setup includes them.

## 8. Migration strategy for existing components

1. Do not retrofit all 57 components immediately (high churn, non-goal).
2. Introduce primitives and selectively adopt in high-impact components/examples:

- one hero section example wrapped with `RevealOnScroll`
- one testimonial/blog carousel example using `Carousel`

3. Make pipeline-generated components primary adopter path.

Files to modify (limited initial adoption):

- selected `packages/core-components/src/components/ui/*` examples (optional, minimal)
- docs/guidance for usage patterns

Verification gate:

- No regressions in existing sites due to non-breaking additive exports.

Risks/trade-offs:

- Without broader retrofit, existing sites remain mostly static until manually updated.

## 9. Documentation and bundle governance

1. Add concise usage docs and dos/don’ts for animation primitives.
2. Document performance rules:

- prefer reveal wrappers over continuous parallax
- avoid stacking multiple observers unnecessarily
- respect reduced-motion preferences.

3. Record bundle impact pre/post dependency add (core-components package and one sample site build).

Files to create/modify:

- `packages/core-components/README.md` or new `packages/core-components/src/components/animation/README.md`
- `tools/lib/theme-component-templates.ts` prompt comments

Verification gate:

- Measured delta acceptable and communicated (Embla only used where imported).

Risks/trade-offs:

- Bundle measurements may vary by site composition; use one baseline site for consistent comparison.

## 10. Delivery order and dependencies

1. Phase A: foundations

- Steps 1, 2, 5 (dependency + RevealOnScroll + shared keyframes).
- Gate: type-check/build green.

2. Phase B: advanced primitives

- Steps 3, 4 (Carousel + parallax hook).
- Gate: primitive tests green.

3. Phase C: pipeline integration

- Step 6 (prompt/template/generator updates).
- Gate: generated sample components compile and use primitives.

4. Phase D: hardening

- Steps 7, 9 (tests + docs + bundle check).
- Gate: `pnpm type-check` and `pnpm build` pass monorepo-wide.

## 11. Key design decisions to lock early

1. Primitives live in core-components, not theme packages.
2. Shared keyframes live in a single shared CSS file imported by theme globals.
3. Pipeline uses prompt-guided primitive adoption; no animation inference from screenshots.
4. Existing components are not broadly retrofitted in this scope.
