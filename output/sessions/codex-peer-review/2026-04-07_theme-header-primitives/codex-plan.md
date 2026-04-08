```markdown
# Implementation Plan: Scalable Theme-Specific Header Primitives

_Reviewer: Codex  
Date: 2026-04-07_

---

## Overview

This plan will deliver:

- Cygnus-specific header with uppercase, orange-underlined active nav links per design spec.
- Reusable, theme-agnostic header/nav primitives in core-components.
- Patterns enabling all current/future themes to own header layout and styling while sharing interactive logic.
- Zero breaking changes for existing Orion and Vega sites.

---

## 1. Create a Theme-agnostic Active Nav Link Primitive in Core-components

### 1.1. Add a `<NavLink>` Component (Client)

- **Location:** `packages/core-components/src/components/primitives/nav-link.tsx`
- **Description:**
  - React client component.
  - Accepts:
    - `href: string`
    - `className?: string`
    - `activeClassName?: string`
    - `inactiveClassName?: string`
    - `children`
    - ...rest (spread to `<a>`)
  - Uses Next.js `usePathname()` to detect active state.
  - Applies classes per active/inactive state.
  - **Export:** Named export from core-components.

#### Why component, not hook?

- Simpler for design consistency ("always an anchor")
- Encourages composition and className props for theme customizations.
- Removes repeated href/pathname compare logic from themes.

#### 1.2. Export NavLink

- Update `packages/core-components/src/index.ts` with a named export.

#### Verification:

- Unit test NavLink for correct class assignment and ARIA handling.

---

## 2. Refactor LocationsDropdown for Customizable Trigger Styling

### 2.1. Add `triggerClassName` Prop

- **File:** `packages/core-components/src/components/ui/locations-dropdown.tsx`
- **Action:**
  - Add optional prop: `triggerClassName?: string`
  - Pass through to the dropdown trigger `<button>`.
  - Retain existing default styling for backward compatibility.
  - If `triggerClassName` provided, merge with base focus/disabled state classes as needed.
  - **No breaking changes:** Old consumers stay unchanged by default.

### 2.2. Export Prop Update

- Update types and docs for LocationsDropdown.
- Update index/barrel if type exported.

#### Verification:

- Cygnus can customize.
- Orion and Vega headers still render unstyled trigger, unchanged.

---

## 3. Create Cygnus-specific Header as a Standalone Component

### 3.1. Replace Wrapper with Full JSX in CygnusHeader

- **File:** `packages/themes/cygnus/components/header.tsx`
- **Action:**
  - No longer wrap SiteHeader—create full server component, bring in own logo, nav, call-to-actions per existing SiteHeader API/signature.
  - Use new `<NavLink>` primitive for each navigation item.
  - Pass required triggerClassName to LocationsDropdown.
  - Render nav according to design:
    - All: `uppercase tracking-widest text-xs font-medium font-body`
    - Inactive: `text-surface-foreground border-b-2 border-transparent pb-1 hover:text-brand-primary`
    - Active: `text-brand-primary border-b-2 border-brand-primary pb-1`
  - CTA, phone links, MobileMenu: use existing primitives as-is.
  - Preserve header props interface for drop-in replacement in cygnus-test, mad-graphics.

#### Layout Shift (Underline)

- Prevent shift by always rendering a border with either transparent or orange color.

#### Verification:

- Visually inspect cygnus-test and mad-graphics header for:
  - Correct typography, underline color, no layout shift.
  - LocationsDropdown trigger matches nav style.
- Confirm Orion and Vega headers unchanged.

---

## 4. Documentation & Barrel Exports

### 4.1. Document Primitive Usage for Themes

- Add JSDoc and README section in `core-components` on usage of `<NavLink>` and `triggerClassName` for LocationsDropdown.

### 4.2. Ensure Barrel Consistency

- Confirm named exports for all new/updated primitives.

---

## 5. Verification and Regression Checks

### 5.1. Type and Build Checks

- Run `pnpm type-check` across all workspaces.

### 5.2. Confirm All Sites Build & Render

- Build and smoke-test:
  - cygnus-test
  - mad-graphics
  - base-template
  - dj-fox-electrical
  - colossus-scaffolding
- Check Orion/Vega header unaffected visually and functionally.

### 5.3. Verify Non-breaking/No Layout Change

- Confirm no layout.tsx or prop interface changes required for consumers.

---

## 6. Migration Path for Other Themes

### 6.1. Communicate New Pattern

- Write migration guide for Orion/Vega in core-components or themes/README:
  - How to use NavLink/triggerClassName
  - Benefits: ownership of header layout, easier theme differentiation

### 6.2. No Immediate Migration Required

- Orion/Vega consume existing SiteHeader untouched.
- Opt-in path: Theme teams can migrate on their schedule.

---

## 7. Site Creation Tooling

### 7.1. Update Boilerplates

- Ensure `tools/create-site.ts`, `tools/apply-theme.ts` reference the pattern for header import (theme owns header, not core-components).
- (Optional) Ship example header in each theme referencing NavLink.

### 7.2. Verification:

- Create a test site using tools. Confirm that theme header instantiates with new primitives.

---

## Risks & Tradeoffs

- **Server/Client split:** NavLink must be a client component, so must be rendered only inside client boundary. Themes need to be aware of this (documented).
- **Future migrations:** Orion/Vega may require partial duplication of header JSX for full control, but this unlocks differentiation.
- **Shared logic:** Any truly shared logic (e.g., nav config, links array) may be shared via utility exports or theme configs.
- **No build step in core-components:** Ensure new files are importable as raw TypeScript, no .js-only node API, for current build setup.

---

# Summary of File Changes

**Created:**

- packages/core-components/src/components/primitives/nav-link.tsx

**Modified:**

- packages/core-components/src/components/ui/locations-dropdown.tsx
- packages/core-components/src/index.ts
- packages/themes/cygnus/components/header.tsx
- core-components and cygnus/theme documentation as appropriate

---

# Verification Gates

1. NavLink works as expected (unit tested).
2. Cygnus headers render per design, support underline and uppercase.
3. LocationsDropdown trigger can be custom styled in Cygnus, unstyled in existing themes.
4. No regressions in Orion/Vega; all sites type-check and build.
5. Barrels and documentation up to date; migration guide provided.

---
```

**Copy and paste this command into Claude Code:**

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-07_theme-header-primitives/
```
