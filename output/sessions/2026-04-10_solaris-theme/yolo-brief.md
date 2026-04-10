# YOLO Implementation Brief: Solaris Theme Package

**Branch:** feature/solaris-theme (created from develop)
**Session spec:** output/sessions/2026-04-10_solaris-theme/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The winning design from a 24-run design experiment is `r2-f-sky-geometric` with the soft blue-white background variant (`bg-b-soft-blue-white.html`). It needs to be promoted from a standalone HTML prototype into a proper platform theme package at `packages/themes/solaris`. The theme follows the same patterns as existing themes (vega, orion, castor). Once complete it will be used to build the DCS site — that is a separate subsequent task.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/solaris-theme
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Read reference files

**Goal:** Understand existing patterns before writing any code.
**Model:** haiku — read-only exploration

Read these files in parallel (single message, all reads at once):

- `packages/themes/vega/index.ts` — token/registry pattern
- `packages/themes/vega/globals.css` — CSS pattern
- `packages/themes/vega/components/header.tsx` — header component pattern
- `packages/themes/vega/components/footer.tsx` — footer component pattern
- `packages/themes/vega/components/index.ts` — barrel export pattern
- `packages/theme-system/src/types.ts` lines 270–300 — THEME_NAMES array + ThemeName union
- `packages/core-components/src/components/SiteHeader.tsx` (or wherever SiteHeader is defined) — understand what props it accepts so we know whether to wrap it or write a custom header
- `output/sessions/2026-04-10_dcs-site-redesign/outputs/2026-04-10_204434/r2-f-bg-variants/bg-b-soft-blue-white.html` lines 1–200 — exact CSS tokens, header, hero styles from prototype
- `output/sessions/2026-04-10_dcs-site-redesign/outputs/2026-04-10_204434/r2-f-bg-variants/bg-b-soft-blue-white.html` lines 200–560 — remaining CSS (sections, cards, animations, footer)

No commit for this phase — read only.

---

## Phase 2: Create theme package files

**Goal:** Create all files for `packages/themes/solaris/`.
**Model:** sonnet

### 2a. `packages/themes/solaris/index.ts`

```typescript
/**
 * Solaris Theme
 *
 * Soft blue-white background, sky blue primary, chartreuse accent, sage support.
 * Geometric hero with animated floating shapes. Bouncy ease-out entrances.
 * Designed for approachable, modern service businesses.
 *
 * Sites using Solaris: dcs (Digital Consulting Services)
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const solarisRegistry: ComponentRegistry = {
  theme: "solaris",
  heroVariant: "split-geometric",
  headerVariant: "light",
  cardVariant: "elevated",
  sectionVariant: "skewed",
};

export const solarisDefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#61A3BA",
      primaryHover: "#4a8fa8",
      secondary: "#61A3BA",
      accent: "#D2DE32",
      accentHover: "#bdc82b",
      onPrimary: "#ffffff",
      onAccent: "#2a2e20",
    },
    surface: {
      background: "#F0F7FA",
      foreground: "#2a2e20",
      card: "#ffffff",
      cardBorder: "#d4e8f0",
      muted: "#e4f0f5",
      mutedForeground: "#3d4235",
    },
    semantic: {
      success: "#A2C579",
      info: "#61A3BA",
    },
    overlay: {
      dark: "rgba(42,46,32,0.7)",
      light: "rgba(240,247,250,0.85)",
      primary: "rgba(97,163,186,0.15)",
    },
  },
  typography: {
    fontFamily: {
      sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      heading: ["var(--font-space-grotesk)", "Space Grotesk", "system-ui", "sans-serif"],
    },
  },
};

registerTheme({ name: "solaris", label: "Solaris", config: solarisDefaultConfig });
```

### 2b. `packages/themes/solaris/globals.css`

```css
/* Solaris Theme — Global Styles */

/* Fonts */
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap");

/* Custom properties */
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --solaris-radius-card: 20px;
  --solaris-radius-card-lg: 24px;
  --solaris-radius-btn: 10px;
  --solaris-radius-pill: 100px;
}

/* Base */
html {
  scroll-behavior: smooth;
}
body {
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* === ENTRANCE ANIMATIONS === */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes drawUnderline {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* === GEOMETRIC SHAPE IDLE FLOATS === */
@keyframes solarisFloatA {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-12px) rotate(1.5deg);
  }
}
@keyframes solarisFloatB {
  0%,
  100% {
    transform: rotate(14deg) translateY(0px);
  }
  50% {
    transform: rotate(16deg) translateY(-8px);
  }
}
@keyframes solarisFloatC {
  0%,
  100% {
    transform: rotate(-9deg) translateY(0px);
  }
  50% {
    transform: rotate(-11deg) translateY(-10px);
  }
}
@keyframes solarisFloatD {
  0%,
  100% {
    transform: rotate(22deg) translateY(0px);
  }
  50% {
    transform: rotate(20deg) translateY(-6px);
  }
}

/* === SCROLL REVEAL UTILITIES === */
.solaris-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.7s var(--ease-out),
    transform 0.7s var(--ease-out);
}
.solaris-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays for child elements */
.solaris-stagger-1 {
  transition-delay: 0.05s;
}
.solaris-stagger-2 {
  transition-delay: 0.12s;
}
.solaris-stagger-3 {
  transition-delay: 0.19s;
}
.solaris-stagger-4 {
  transition-delay: 0.26s;
}
.solaris-stagger-5 {
  transition-delay: 0.33s;
}
.solaris-stagger-6 {
  transition-delay: 0.4s;
}

/* Section heading reveal */
.solaris-heading {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out);
}
.solaris-heading.visible {
  opacity: 1;
  transform: translateY(0);
}
.solaris-heading-delay-1 {
  transition-delay: 0.1s;
}
.solaris-heading-delay-2 {
  transition-delay: 0.2s;
}

/* === CARD HOVER UTILITIES === */
.solaris-card-hover {
  transition:
    transform 0.4s var(--ease-out),
    box-shadow 0.4s ease;
}
.solaris-card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(42, 46, 32, 0.12);
}

/* Bottom accent bar (scales in from left on hover) */
.solaris-card-accent {
  position: relative;
  overflow: hidden;
}
.solaris-card-accent::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-brand-primary, #61a3ba);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s var(--ease-out);
}
.solaris-card-accent:hover::after {
  transform: scaleX(1);
}

/* === NAV LINK UNDERLINE === */
.solaris-nav-link {
  position: relative;
}
.solaris-nav-link::after {
  content: "";
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-brand-primary, #61a3ba);
  transition: width 0.3s var(--ease-out);
  border-radius: 2px;
}
.solaris-nav-link:hover::after {
  width: 100%;
}

/* === GEOMETRIC HERO SHAPES === */
.solaris-geo-shape {
  position: absolute;
  border-radius: 6px;
}
.solaris-geo-1 {
  width: 270px;
  height: 270px;
  background: var(--color-brand-primary, #61a3ba);
  opacity: 0.35;
  top: 8%;
  left: 5%;
  animation:
    fadeSlideUp 0.7s var(--ease-out) 0.6s both,
    solarisFloatA 6s ease-in-out 1.4s infinite;
}
.solaris-geo-2 {
  width: 170px;
  height: 170px;
  background: var(--color-brand-accent, #d2de32);
  opacity: 0.7;
  top: 0;
  right: 8%;
  transform: rotate(14deg);
  animation:
    fadeSlideUp 0.7s var(--ease-out) 0.75s both,
    solarisFloatB 7s ease-in-out 1.55s infinite;
}
.solaris-geo-3 {
  width: 130px;
  height: 130px;
  background: #a2c579;
  opacity: 0.5;
  bottom: 12%;
  left: 22%;
  transform: rotate(-9deg);
  animation:
    fadeSlideUp 0.7s var(--ease-out) 0.9s both,
    solarisFloatC 8s ease-in-out 1.7s infinite;
}
.solaris-geo-4 {
  width: 75px;
  height: 75px;
  border: 3px solid var(--color-brand-accent, #d2de32);
  background: transparent;
  bottom: 26%;
  right: 6%;
  transform: rotate(22deg);
  animation:
    fadeSlideUp 0.7s var(--ease-out) 1.05s both,
    solarisFloatD 5.5s ease-in-out 1.85s infinite;
}
```

### 2c. `packages/themes/solaris/components/header.tsx`

Write a custom SolarisHeader Server Component (do NOT use `'use client'`). Study VegaHeader first — if it simply wraps core-components SiteHeader, do the same. If SiteHeader doesn't support the solaris nav style (draw-in underline, backdrop blur, sky blue), write a thin custom component using semantic HTML and Tailwind/CSS vars.

Props interface:

```typescript
export interface SolarisHeaderProps {
  logoText?: string; // default 'DCS'
  navItems: { label: string; href: string }[];
  ctaLabel?: string; // default 'Get in touch'
  ctaHref?: string; // default '#contact'
  phone?: string;
  showPhone?: boolean;
}
```

Header structure:

- Sticky, `background: rgba(240,247,250,0.85)`, `backdrop-filter: blur(16px)`, `z-index: 100`
- On scroll (handled by inline `<script>` tag, same pattern as existing themes), add `scrolled` class → `box-shadow: 0 2px 20px rgba(42,46,32,0.08)`
- Logo: logoText in Space Grotesk 700, `--color-brand-primary-deep` or `#4a8fa8`
- Nav links: apply `solaris-nav-link` class for hover underline, `color: #3d4235`
- CTA button: `background: #61A3BA`, `color: #ffffff`, `border-radius: 10px`, hover → `#4a8fa8`
- Mobile: hamburger (3 lines), full-screen overlay menu with same links

### 2d. `packages/themes/solaris/components/footer.tsx`

Write SolarisFooter Server Component following vega/footer.tsx pattern.

Props interface:

```typescript
export interface SolarisFooterProps {
  logoText?: string;
  tagline?: string;
  navColumns?: { heading: string; links: { label: string; href: string }[] }[];
  contact?: { email?: string; phone?: string };
  legal?: { privacyHref?: string; termsHref?: string; cookiesHref?: string };
  copyright?: string;
}
```

Footer structure:

- Dark background: `#2a2e20`
- Logo + tagline, nav columns, contact details
- Bottom bar: copyright left, legal links right
- All text: white/muted white

### 2e. `packages/themes/solaris/components/index.ts`

```typescript
export { SolarisHeader } from "./header";
export type { SolarisHeaderProps } from "./header";
export { SolarisFooter } from "./footer";
export type { SolarisFooterProps } from "./footer";
```

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
```

```bash
git add packages/themes/solaris/
git commit -m "$(cat <<'EOF'
feat(solaris): add Solaris theme package — sky blue/chartreuse geometric design

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Register solaris in theme-system

**Goal:** Add `'solaris'` to the `THEME_NAMES` array in `packages/theme-system/src/types.ts` so the ThemeName union type includes it.
**Model:** haiku — single line addition

Read `packages/theme-system/src/types.ts` first. Find the `THEME_NAMES` array (currently contains atlas, castor, cygnus, lyra, nova, orion, polaris, rigel, sirius, vega). Add `"solaris"` in alphabetical order (between `"rigel"` and `"vega"`).

Also check `packages/core-components/src/` for any other files referencing `ThemeName` or `THEME_NAMES` that may need updating — grep for them and update if required.

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
```

```bash
git add packages/theme-system/src/types.ts
git commit -m "$(cat <<'EOF'
feat(theme-system): register solaris in THEME_NAMES union

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Final verification

**Goal:** Confirm the full monorepo type-checks and pipeline smoke passes.
**Model:** haiku — verification only

Run in parallel:

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
pnpm pipeline:smoke
```

If `pnpm pipeline:smoke` does not exist or errors, run `pnpm lint` instead and note it in the final report.

No commit needed for this phase — it is verification only.

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                                                                                                              | File overlap      | Model | Rationale                                    |
| ----- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----- | -------------------------------------------- |
| G1    | Phase 1 | Read vega/index.ts, vega/globals.css, vega/components/header.tsx, vega/components/footer.tsx, types.ts, prototype HTML (two reads) | none (reads only) | n/a   | All independent reads — batch in one message |
| G2    | Phase 4 | Run `pnpm type-check`, run `pnpm pipeline:smoke` (or `pnpm lint`)                                                                  | none (read-only)  | n/a   | Independent verification commands            |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                              | Reason                                                      |
| ------------------------------------------------- | ----------------------------------------------------------- |
| Phase 2 → Phase 3                                 | Phase 3 adds solaris to ThemeName; Phase 2 must exist first |
| Verification gates between phases                 | Each phase's output gates the next                          |
| Git commits                                       | One commit per phase, in order                              |
| Phase 2 files (index.ts, globals.css, components) | All new files — write sequentially to avoid partial state   |

---

## Cost Estimate

| Phase                        | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Read references     | haiku  | ~18k              | ~0                 | ~$0.005    |
| Phase 2: Create theme files  | sonnet | ~25k              | ~8k                | ~$0.20     |
| Phase 3: Register theme name | haiku  | ~8k               | ~0.5k              | ~$0.003    |
| Phase 4: Final verification  | haiku  | ~4k               | ~0.5k              | ~$0.001    |
| **Total**                    |        | **~55k**          | **~9k**            | **~$0.21** |

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes (and pipeline:smoke if available)
3. Files created — list all files under `packages/themes/solaris/`
4. Any exceptions or intentional deviations from the plan
5. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-10_solaris-theme/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially.**
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (`Claude Sonnet 4.6`)
- The final phase MUST include `pnpm pipeline:smoke` as a verification gate (fall back to `pnpm lint` if the command doesn't exist)

## Completed

**Date:** 2026-04-10
**Status:** All phases executed successfully

Implemented the Solaris theme package at `packages/themes/solaris/` with registry, globals.css (entrance animations, geometric float keyframes, scroll reveal utilities, card hover effects, nav underline, hero shapes), custom SolarisHeader (sticky with backdrop blur, scroll shadow via inline script, mobile menu overlay) and SolarisFooter (dark background, nav columns, contact, legal links) Server Components. Extended ComponentRegistry with three new variants (`split-geometric`, `elevated`, `skewed`) in both the TypeScript interface and Zod schema. Registered `"solaris"` in `THEME_NAMES` and the core-components `ThemeName` union. One deviation from the plan: the brief's registry values weren't in the existing union types, so the type definitions were extended in Phase 2 rather than Phase 3.

### Commits

- `77b65aa` — feat(solaris): add Solaris theme package — sky blue/chartreuse geometric design
- `45c0005` — feat(theme-system): register solaris in THEME_NAMES union
