# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04-07_theme-header-primitives/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-07_theme-header-primitives/
```

---

## Brief: Scalable Theme-Specific Header Primitives

**Date:** 2026-04-07
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

Every theme in this platform will have its own unique header and footer design — different nav link styling, different layout, different interactive behaviors. Currently, all three theme headers (Orion, Vega, Cygnus) are thin wrappers around a single shared `SiteHeader` component, passing only an `appearance="dark"|"light"` prop. This means they all look essentially the same.

The immediate trigger: the Cygnus theme (used by MAD Graphics and cygnus-test sites) requires **uppercase navigation links** with an **orange underline on the active page**. The generic SiteHeader cannot provide this because:

1. **Active page detection** requires `usePathname()` — a client-only hook — but SiteHeader is a Server Component
2. **Nav link styling** is hardcoded in SiteHeader with no customization surface
3. **LocationsDropdown** hardcodes its trigger button styling with no override prop

This has been attempted ~5 times without success. The fix must work for Cygnus now AND establish a pattern that scales to every future theme.

### Goals

- Cygnus header renders uppercase nav links with orange underline on active page (matching Stitch design)
- Establish reusable header primitives in core-components that any theme can compose
- Each theme owns its header layout and styling; core-components owns interactive behavior
- New themes can create unique headers without modifying core-components
- No breaking changes to existing sites (Orion, Vega consumers continue working)

### Non-Goals

- Refactoring the footer (acknowledged as duplicated, but separate concern)
- Changing Orion or Vega headers to use the new pattern (can be migrated later)
- Modifying MobileMenu behavior (it works, leave it alone)
- Adding active state to MobileMenu nav links (separate concern)

### Acceptance Criteria

1. `sites/cygnus-test` and `sites/mad-graphics` render headers with:
   - Uppercase nav text with wide letter spacing
   - Orange (brand-primary) underline on the currently active page's nav link
   - LocationsDropdown trigger button styled to match other nav links
   - No layout shift when navigating between pages
2. `pnpm type-check` passes across all workspaces
3. All sites build successfully: cygnus-test, mad-graphics, base-template, dj-fox-electrical, colossus-scaffolding
4. Existing Orion and Vega sites render identically to current behavior
5. The active-state primitive is importable from core-components for use by any future theme

### Constraints

- **Server Component architecture:** Headers are Server Components. Only extract the minimum interactive parts to client components.
- **Theme token styling:** All colors via CSS variable-based Tailwind classes (`text-brand-primary`, `bg-surface-inverse`). No hardcoded hex values.
- **Named exports only:** No default exports anywhere in the platform.
- **Import paths:** Core-components uses subpath imports for server-only code to avoid circular dependencies in vitest.
- **No modifications to site layout.tsx files:** `CygnusHeaderProps` interface must remain unchanged so consuming sites don't need updates.

### Relevant Architecture

**Monorepo structure:**

- `packages/core-components/` — shared components, exported as raw TypeScript (no build step)
- `packages/themes/{orion,vega,cygnus}/` — theme packages with CSS, registry config, and optional component adapters
- `sites/{site-name}/` — individual client websites

**Current header flow:**

```
Site layout.tsx
  → imports ThemeHeader (e.g. CygnusHeader) from @platform/themes/cygnus/components
  → ThemeHeader wraps SiteHeader with appearance="dark"|"light"
  → SiteHeader renders: logo, <nav> links, phone, CTA, MobileMenu, LocationsDropdown
```

**Key client components already in core-components:**

- `MobileMenu` — full-screen mobile nav, accepts `variant="dark"|"light"`
- `LocationsDropdown` — desktop dropdown, accepts `variant="dark"|"light"`, manages its own open/close/keyboard state

**Cygnus nav link design spec (from Stitch design and cygnus-test page specs):**

| State     | Classes                                                      |
| --------- | ------------------------------------------------------------ |
| All links | `uppercase tracking-widest text-xs font-medium font-body`    |
| Active    | `text-brand-primary border-b-2 border-brand-primary pb-1`    |
| Inactive  | `text-surface-foreground border-b-2 border-transparent pb-1` |
| Hover     | `hover:text-brand-primary`                                   |

### Codebase Snapshot

| File                                                                | Role                                                                                                                       |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `packages/core-components/src/components/ui/site-header.tsx`        | Shared header (Server Component, 179 lines). Renders logo, nav links, actions, delegates to MobileMenu + LocationsDropdown |
| `packages/core-components/src/components/ui/locations-dropdown.tsx` | Client component, 332 lines. Two modes: simple grid, mega-menu. Hardcoded button classes on lines 141 and 156              |
| `packages/core-components/src/components/ui/mobile-menu.tsx`        | Client component for responsive nav                                                                                        |
| `packages/core-components/src/index.ts`                             | Barrel exports                                                                                                             |
| `packages/themes/cygnus/components/header.tsx`                      | 15-line wrapper: `<SiteHeader appearance="dark" {...props} />`                                                             |
| `packages/themes/cygnus/components/index.ts`                        | Exports CygnusHeader, CygnusFooter                                                                                         |
| `packages/themes/cygnus/globals.css`                                | Cygnus CSS utilities including `.text-subtitle` with `uppercase tracking-widest`                                           |
| `packages/themes/orion/components/header.tsx`                       | Wrapper with counties/maxTownsPerCounty support                                                                            |
| `packages/themes/vega/components/header.tsx`                        | Wrapper with logoWidth/Height, sticky=false                                                                                |
| `sites/mad-graphics/app/layout.tsx`                                 | Uses CygnusHeader — props won't change                                                                                     |
| `sites/cygnus-test/app/layout.tsx`                                  | Uses CygnusHeader — props won't change                                                                                     |

### What a Good Plan Should Cover

1. Where should the active-page-aware nav link primitive live? (core-components? Each theme?)
2. Should it be a single `NavLink` component with className props, or a hook (`useIsActive`) that themes compose freely?
3. How should `LocationsDropdown` be extended to accept custom trigger styling without breaking existing consumers?
4. Should `CygnusHeader` be a standalone component (owns its own JSX) or remain a wrapper that passes customization to SiteHeader?
5. How do we prevent layout shift from the active underline appearing/disappearing?
6. What's the migration path for Orion and Vega to adopt the same primitives later?
7. How does this pattern flow through site creation tooling (`tools/create-site.ts`, `tools/apply-theme.ts`)?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04-07_theme-header-primitives/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-07_theme-header-primitives/`
