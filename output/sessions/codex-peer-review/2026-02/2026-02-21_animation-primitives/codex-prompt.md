# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-02-21_animation-primitives/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise
```

---

## Brief: Animation Primitives for the White-Label Platform

**Date:** 2026-02-21
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The ingestion pipeline (`tools/analyse-site.ts`) analyses reference websites via Playwright screenshots and generates theme packages with brand colours, typography, and React components. Many reference sites have animated elements — image carousels, parallax scroll effects, scroll-triggered reveals, and animated imagery. The platform currently has **no animation primitives** and **no animation libraries**. All animation is limited to:

- 2 CSS `@keyframes` (`fade-in`, `scale-in`) used only for a lightbox overlay
- Tailwind `transition-*` classes for hover effects (card lift, image zoom, shadow escalation)
- A mobile menu slide animation via state-driven `translate-x`

When the pipeline generates components from a reference site that has a hero carousel or scroll-triggered section reveals, it produces static components with no animation. The AI component generator's prompt has zero guidance about animation patterns, and the `clientComponentShell` only imports `useState` — it cannot produce components that use `useEffect` or `useRef` (needed for any observer-based animation).

The result: every generated site feels static and flat compared to the reference site it was modelled from. This is the single biggest visual quality gap between generated output and the target.

### Goals

1. Build a library of **composable animation primitives** in `packages/core-components/` that both hand-built and pipeline-generated components can use
2. **RevealOnScroll** — a wrapper component for scroll-triggered fade/slide animations (highest impact, most common pattern on reference sites)
3. **Carousel/Slider** — a reusable carousel primitive backed by a lightweight library, replacing hand-rolled AI-generated slide logic
4. **Parallax** — a hook or component for basic scroll-speed parallax effects
5. **Expanded CSS keyframes** — a standard library of animation keyframes (fade-in-up, slide-in-left, slide-in-right, scale-up, float, etc.) available to all themes
6. **Pipeline integration** — update the component generation prompt and templates so the AI knows about and uses these primitives

### Non-Goals

- Lottie/bodymovin animation support (requires designer-provided JSON files, not extractable from screenshots)
- SVG path animation (case-by-case, not systematic)
- Replacing the existing hover transition patterns (they work well already)
- Detecting animation type from screenshots (the pipeline analyses static images — animation is a post-pipeline concern)
- Building a full motion design system with spring physics (premature for trade service business sites)

### Acceptance Criteria

1. A `<RevealOnScroll>` component exists in `packages/core-components/` that wraps children and animates them into view on scroll using `IntersectionObserver`
2. RevealOnScroll supports at minimum: `fade-up`, `fade-in`, `slide-left`, `slide-right` animation variants, configurable threshold and delay
3. A `<Carousel>` component exists backed by `embla-carousel-react` (or equivalent lightweight library) with: auto-advance, dot navigation, arrow navigation, touch/swipe support
4. A `useScrollParallax` hook exists that applies a parallax transform factor to an element based on scroll position
5. Theme globals.css files include at least 6 reusable `@keyframes` animations with corresponding `.animate-*` utility classes
6. The pipeline's `buildComponentGenerationPrompt` mentions available animation primitives and when to use them
7. The pipeline's `clientComponentShell` can import `useEffect` and `useRef` when needed (not just `useState`)
8. All components are RSC-compatible — animation wrappers are `"use client"` but the content they wrap can be Server Components
9. `pnpm type-check` and `pnpm build` pass after all changes
10. Unit tests exist for RevealOnScroll (intersection observer mock) and Carousel (render, navigation)

### Constraints

1. **No heavy animation libraries.** No Framer Motion (30KB+), no GSAP (40KB+). The platform targets SEO-optimised static sites for tradespeople — bundle size matters. Acceptable: `embla-carousel-react` (~7KB gzipped), native `IntersectionObserver`, CSS-only animations.

2. **Server Components are the default.** The platform uses Next.js 15 with App Router. Layout components are Server Components. Animation wrappers must be `"use client"` but must compose cleanly with Server Component children — no `React.Children.map` or cloneElement patterns that break RSC.

3. **Theme system tokens must be used.** Animation components must use theme tokens (`bg-brand-primary`, `text-surface-foreground`, etc.) and not hardcode colours. The Tailwind plugin generates CSS custom properties from `theme.config.ts`.

4. **The component generation pipeline is AI-driven.** Generated components use a template + AI hybrid approach. The AI produces only the JSX `return (...)` body. The `clientComponentShell` wraps it with imports and exports. Currently only `useState` is imported — adding `useEffect`/`useRef` requires updating the shell template, and the `needsUseClient` detection regex.

5. **Named exports only, TypeScript interfaces for all props.** This is a platform-wide rule. No default exports.

6. **The `@keyframes` library must work across themes.** Keyframes should be defined in a shared location (core-components or theme-system), not duplicated per theme. Individual themes may extend but not override the base set.

7. **`packages/core-components/package.json` currently has no animation deps.** Adding `embla-carousel-react` (or similar) is an explicit dependency addition that needs justifying.

8. **The `buildComponentGenerationPrompt` is the only interface to AI generation.** To make the AI use animation primitives, the prompt must mention them by name and give usage examples. The AI cannot read the codebase — it only sees what's in the prompt.

### Relevant Architecture

**Theme System:**

- `packages/theme-system/` — Tailwind plugin that converts `ThemeConfig` → CSS custom properties → utility classes
- `packages/themes/orion/globals.css` and `packages/themes/vega/globals.css` — theme-specific CSS, each currently defines 2 `@keyframes` animations and transition utilities for lightbox/menu
- Sites import theme CSS: `@import "../../../packages/themes/vega/globals.css";` in their `app/globals.css`
- Theme system defines `transition.fast` (150ms), `transition.normal` (200ms), `transition.slow` (300ms) tokens — but no component uses them (all use raw Tailwind `duration-*` instead)

**Core Components:**

- `packages/core-components/src/components/ui/` — 57 shared components (cards, heroes, CTAs, etc.)
- All hover animations use Tailwind: `hover:-translate-y-1 transition-all duration-300`, `group-hover:scale-105`
- Zero `IntersectionObserver` usage anywhere in the codebase
- No animation libraries installed

**Ingestion Pipeline:**

- `tools/analyse-site.ts` — 14-step pipeline: discover pages → screenshot → analyse → generate components → scaffold theme
- `tools/lib/theme-component-generator.ts` — generates .tsx files per section blueprint
  - `needsUseClient()` checks `interactionNeeds === "stateful"`, category Navigation, purpose includes "form"/"newsletter", or JSX contains `CLIENT_PATTERNS` regex (includes `useEffect`/`useRef` but not `IntersectionObserver` directly)
  - `clientComponentShell()` only imports `{ useState }` from React
- `tools/lib/theme-component-templates.ts` — `buildComponentGenerationPrompt()` gives AI no animation guidance at all
- `tools/lib/token-class-allowlist.ts` — already permits `animate-*`, `transition`, `duration-*`, `scale-*`, `translate-*` classes

**Key constraint: screenshots are static.** The vision model sees a carousel's current slide, not transitions. It sees positioned elements, not scroll behaviour. Animation must be applied as a post-analysis enrichment, not detected from screenshots.

### Codebase Snapshot

| File                                           | Lines    | Purpose                                                                                         |
| ---------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `packages/core-components/package.json`        | ~40      | Deps: react 19, next 16, leaflet, lucide-react, mdx, zod — no animation libs                    |
| `packages/core-components/src/components/ui/`  | 57 files | All shared UI components — cards, heroes, CTAs, etc.                                            |
| `packages/themes/orion/globals.css`            | ~560     | Orion theme CSS — `@keyframes fade-in/scale-in` at lines 525-539, `animate-*` utils at 541-547  |
| `packages/themes/vega/globals.css`             | ~390     | Vega theme CSS — `@keyframes fade-in/scale-in` at lines 354-368, `animate-*` utils at 370-376   |
| `packages/theme-system/src/tailwind-plugin.ts` | ~200     | Generates Tailwind utilities from theme tokens, defines `transition-fast/normal/slow`           |
| `packages/theme-system/src/generate-css.ts`    | ~120     | Generates CSS custom properties from ThemeConfig                                                |
| `tools/lib/theme-component-generator.ts`       | ~389     | Component generation: `needsUseClient()` at line 148, `clientComponentShell` usage at line 222  |
| `tools/lib/theme-component-templates.ts`       | ~210     | Templates: `buildComponentGenerationPrompt()` at line 173, `clientComponentShell()` at line 120 |
| `tools/lib/token-class-allowlist.ts`           | ~189     | Validates generated classes — `animate-*` already permitted at line 108                         |

### What a Good Plan Should Cover

1. **Where do animation primitives live?** New files in `packages/core-components/src/components/ui/`? A new `packages/core-components/src/components/animation/` directory? Or a separate `packages/animation/` package?

2. **RevealOnScroll design:** How does it compose with Server Components? Does it use `IntersectionObserver` directly or `react-intersection-observer`? How does it handle SSR (elements must be visible without JS for SEO)? What's the API — `<RevealOnScroll variant="fade-up" delay={200}>`?

3. **Carousel design:** `embla-carousel-react` vs `swiper/react` vs hand-rolled? How does it integrate with the component generation pipeline — is it a core-component that generated hero/testimonial components import, or does the AI generate carousel logic inline?

4. **Parallax design:** Pure CSS `bg-fixed` vs JS scroll listener vs `IntersectionObserver` with transform? How to keep it performant (no layout thrashing)?

5. **Keyframes library location:** Where do shared `@keyframes` definitions live so all themes inherit them without duplication? In `packages/theme-system/`? In a new shared CSS file?

6. **Pipeline integration:** How does `buildComponentGenerationPrompt` change? What specific instructions does the AI need? How does `clientComponentShell` get updated — always import `useEffect`/`useRef`, or conditionally based on blueprint metadata?

7. **Bundle impact:** What's the total added weight? Is tree-shaking effective for unused animation primitives?

8. **Testing strategy:** How do you test IntersectionObserver-based components in Vitest? Mock the observer? Use `@testing-library/react`?

9. **Migration path for existing components:** Do we retrofit RevealOnScroll into the 57 existing core-components, or only use it in newly generated themes?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-02-21_animation-primitives/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise`
