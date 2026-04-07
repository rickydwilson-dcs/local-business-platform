# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04-06_theme-structural-components/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-06_theme-structural-components/
```

---

## Brief: Theme Packages Should Own Their Header and Footer

**Date:** 2026-04-06
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

Theme packages in this monorepo currently export only color tokens, CSS utilities, and a ComponentRegistry. Headers and footers are not part of any theme — they live in `packages/core-components` as a single generic `SiteHeader` (with a `dark`/`light` appearance toggle) and a generic `Footer`. Every site that uses a theme still imports and renders the same generic components, regardless of the theme's visual identity.

The Stitch-designed visual identity for each theme — the bold cygnus logo treatment, the orion dark navigation style, the vega light header — exists only as hardcoded HTML inside reference test site page files and has never been promoted into the theme packages themselves.

The goal: each theme package should own and export its own `Header` and `Footer` components, so that `layout.tsx` on any site using that theme can simply import and render them without knowing about theme-specific styling logic.

### Goals

1. Each theme package (`cygnus`, `orion`, `vega`) exports a typed `Header` and `Footer` component
2. `layout.tsx` for any site using a theme imports header/footer from the theme package, not from core-components
3. The components are proper React Server Components (no `'use client'` unless strictly necessary for mobile menu interactivity)
4. The pipeline's `applyThemePageOverrides()` copies `app/layout.tsx` from the theme's reference site to new sites, so new sites get the correct header/footer wired up automatically
5. The generic `SiteHeader` in core-components is NOT deleted — it may still be needed as an internal building block or for themes that don't yet have custom components
6. `mad-graphics` (the live cygnus site) is updated to use the new `CygnusHeader`/`CygnusFooter`

### Non-Goals

- Implementing header/footer for lyra, nova, atlas, rigel themes (no production sites yet)
- Redesigning the visual appearance of any header or footer — extract what exists, don't redesign
- Changing the MDX content system or routing
- Moving `ThemeProvider` out of layout.tsx
- Changing how theme tokens (CSS variables) work

### Acceptance Criteria

1. `packages/themes/cygnus/` exports `CygnusHeader` and `CygnusFooter`
2. `packages/themes/orion/` exports `OrionHeader` and `OrionFooter`
3. `packages/themes/vega/` exports `VegaHeader` and `VegaFooter`
4. `sites/mad-graphics/app/layout.tsx` uses `CygnusHeader` and `CygnusFooter` (no SiteHeader import)
5. `sites/cygnus-test/app/layout.tsx` uses `CygnusHeader` and `CygnusFooter`
6. `sites/dj-fox-electrical/app/layout.tsx` uses `OrionHeader` and `OrionFooter`
7. `sites/colossus-scaffolding/app/layout.tsx` uses `VegaHeader` and `VegaFooter`
8. `sites/base-template/app/layout.tsx` uses `VegaHeader` and `VegaFooter`
9. `tools/create-site-from-project.ts` copies `app/layout.tsx` when applying theme page overrides
10. All sites build without TypeScript errors
11. The theme packages' `package.json` exports map includes the new component paths

### Constraints

**Hard architecture constraints (from CLAUDE.md and codebase research):**

1. **Server Components only**: `packages/core-components` uses no `'use client'` for layout components. The Footer is an async Server Component that calls `getContentItems()` — this requires `@/lib/content` (site-specific). Theme footer components face the same constraint: they need site-specific data (services list, locations list, contact info) but cannot use React context or props passed from a client boundary.

2. **Site-specific data problem**: The current `Footer` in core-components imports from `@/lib/content`, `@/lib/contact-info`, and `@/site.config` — all of which are path aliases that resolve to site-specific files at build time. If footer components move into theme packages, they lose access to these `@/` aliases. This is the hardest constraint to resolve.

3. **No barrel import for subpath exports**: Theme packages use subpath exports. Components must be exported via a dedicated subpath (e.g., `@platform/themes/cygnus/components`) to avoid circular dependency issues in vitest. Barrel imports from `@platform/core-components` caused circular dependency bugs — the same issue could occur here.

4. **ThemeProvider is client-only**: `ThemeProvider` (for mobile menu token access) is a client component. Layout.tsx wraps everything in `ThemeProvider`. This is fine — the constraint is that header/footer components themselves should not require `ThemeProvider` for styling (they should use CSS variables directly).

5. **MobileMenu is already 'use client'**: The mobile hamburger menu in `SiteHeader` is handled by a `MobileMenu` client component. Theme-specific headers can follow the same pattern: Server Component shell + `MobileMenu` client component.

6. **Package dependency direction**: Theme packages (`@platform/themes/cygnus`) can import from `@platform/core-components`. Core-components should NOT import from theme packages (would create circular dependency). Headers in theme packages can therefore reuse primitives from core-components (e.g., `MobileMenu`, `LocationsDropdown`).

7. **Tailwind CSS classes only**: No inline styles, no CSS-in-JS. All styling via theme tokens (`bg-brand-primary`, `text-surface-foreground`) or Tailwind utilities.

8. **pnpm workspaces**: Adding `components` subpath export to a theme package requires updating `packages/themes/package.json` exports map AND verifying the TypeScript path resolution in tsconfig.

### Relevant Architecture

**Current theme package structure (cygnus as example):**
```
packages/themes/cygnus/
  index.ts          ← exports cygnusRegistry, cygnusDefaultConfig; calls registerTheme()
  globals.css       ← CSS variables for cygnus design tokens
  (no components/)
```

**Theme package exports (packages/themes/package.json):**
```json
{
  "exports": {
    "./cygnus": "./cygnus/index.ts",
    "./orion": "./orion/index.ts",
    "./vega": "./vega/index.ts",
    "./atlas/components": "./atlas/components/index.ts",
    "./rigel/components": "./rigel/components/index.ts"
  }
}
```
Atlas and Rigel already have `components/` subpath exports — this is the pattern to follow.

**Current SiteHeader (core-components):**
- Props: `appearance` (dark|light), `siteName`, `phoneDisplay`, `phoneTel`, `primaryCta`, `navigation`, `counties`, `locations`
- Server Component
- Used by: cygnus-test, dj-fox-electrical, colossus-scaffolding, base-template

**Current Footer (core-components):**
- No props — reads everything from `@/lib/content`, `@/lib/contact-info`, `@/site.config`
- Async Server Component
- Used by: cygnus-test, dj-fox-electrical, colossus-scaffolding, base-template

**mad-graphics layout.tsx (current):**
- Uses `theme="vega"` and `vegaRegistry` (apparent mismatch — comment says "Cygnus Design")
- Has custom header/footer, NOT using SiteHeader/Footer from core-components
- The pipeline rebuilt this site but didn't fix the vega/cygnus mismatch

**Pipeline — applyThemePageOverrides() in tools/create-site-from-project.ts:**
```typescript
const THEME_REFERENCE_SITE_MAP = {
  cygnus: 'cygnus-test',
  orion:  'dj-fox-electrical',
  // vega: uses base-template directly
};

const THEMED_PAGE_FILES = [
  'app/page.tsx',
  'app/services/page.tsx',
  'app/about/page.tsx',
  'app/locations/page.tsx',
];
```
Currently copies 4 page files but NOT `app/layout.tsx`.

**The data dependency problem (key challenge):**
The current `Footer` in core-components uses `@/` path aliases:
```typescript
import { getContentItems } from '@/lib/content';
import { PHONE_DISPLAY, BUSINESS_EMAIL, ADDRESS } from '@/lib/contact-info';
import { siteConfig } from '@/site.config';
```
If Footer moves into a theme package, these imports break because `@/` doesn't resolve in `packages/`.

**Factory pattern precedent (how this was solved for other shared utilities):**
The March 2026 architecture dedup solved exactly this problem for `content.ts`, `schema.ts`, and `contact-info.ts`: factory functions in `core-components/src/lib/` accept site-specific config as parameters and return configured utilities. Sites call the factory from their `lib/` shim.

The same pattern could apply to footer: a `createFooter(config)` factory that returns a footer configured with site-specific data — but this has a constraint: the footer needs live MDX content (dynamic data), not just static config.

### Codebase Snapshot

Key files (all in `/Users/rickywilson/Sites/local-business-platform/`):

| File | Purpose |
|------|---------|
| `packages/themes/cygnus/index.ts` | Cygnus theme — currently only registry + config |
| `packages/themes/orion/index.ts` | Orion theme — same |
| `packages/themes/vega/index.ts` | Vega theme — same |
| `packages/themes/package.json` | Exports map for all themes |
| `packages/core-components/src/components/site-header.tsx` | Generic header with appearance prop |
| `packages/core-components/src/components/footer.tsx` | Generic async footer reading from @/ aliases |
| `packages/core-components/src/components/page-shell.tsx` | PageShell wrapper |
| `packages/core-components/src/components/mobile-menu.tsx` | Client component for hamburger |
| `packages/themes/atlas/components/index.ts` | Reference: how atlas/rigel export components |
| `sites/cygnus-test/app/layout.tsx` | Reference site for cygnus theme |
| `sites/mad-graphics/app/layout.tsx` | Live cygnus site — has custom header/footer |
| `sites/dj-fox-electrical/app/layout.tsx` | Reference site for orion theme |
| `sites/colossus-scaffolding/app/layout.tsx` | Reference site for vega theme |
| `sites/base-template/app/layout.tsx` | Gold-standard base template |
| `tools/create-site-from-project.ts` | Pipeline — applyThemePageOverrides() lives here |

### What a Good Plan Should Cover

1. **How does the Footer data problem get solved?** The footer needs `services`, `locations`, `contact info`, and `siteConfig` — all site-specific. If it moves to a theme package, how does it get this data without `@/` imports?

2. **Props-based vs. factory-based approach**: Should theme footers accept props (caller passes data in), use a factory pattern (returns a pre-configured component), or something else? What are the tradeoffs for Server Components?

3. **Where does the mobile menu client boundary live?** Currently `MobileMenu` is 'use client' inside core-components. If `CygnusHeader` is a Server Component in a theme package, how does it compose with the mobile menu without creating a client boundary in the theme package itself?

4. **How should layout.tsx look after the change?** Sketch the before/after for at least one site.

5. **What happens to the generic SiteHeader?** Is it deprecated, kept as internal primitive, or actively used by themes as a building block?

6. **Pipeline change**: Exactly which lines in `applyThemePageOverrides()` need to change? What is the risk of copying `layout.tsx` to a new site (it contains fonts, ThemeProvider setup, etc.)?

7. **Phasing**: Cygnus first (mad-graphics is live), then orion and vega? Or all three in one PR? What's the minimum viable first step?

8. **TypeScript / tsconfig**: What changes are needed to resolve `@platform/themes/cygnus/components` in consuming sites?

---

## Deliverable

Produce a numbered implementation plan with:
- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04-06_theme-structural-components/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-06_theme-structural-components/`
