# Implementation Plan: Scalable Theme-Specific Header Primitives

**Date:** 2026-04-07
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex (GPT-4.1) independent plans

## Key Differences Between Plans

| Aspect                      | Claude                                                    | Codex                                        | Synthesised Decision                                                                                                |
| --------------------------- | --------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| NavLink file location       | `components/ui/nav-link.tsx`                              | `components/primitives/nav-link.tsx`         | **`components/ui/nav-link.tsx`** — all existing components live in `ui/`, no `primitives/` dir exists               |
| NavLink API                 | `className + activeClassName + inactiveClassName + exact` | Same props + rest spread to anchor           | **Claude's API + rest spread** — rest spread is useful for `aria-*` attrs, `exact` handles home link edge case      |
| LocationsDropdown prop name | `buttonClassName`                                         | `triggerClassName`                           | **`buttonClassName`** — the element IS a `<button>`, name is more precise                                           |
| Active match logic          | `startsWith(href + "/")`                                  | Not specified in detail                      | **`startsWith(href + "/")`** — prevents `/services` matching `/services-overview`                                   |
| Documentation               | No docs changes                                           | Adds README section + migration guide        | **Skip docs for now** — match platform convention (docs updated via `/update.docs` before deploy)                   |
| Site creation tooling       | Not addressed                                             | Update `create-site.ts` and `apply-theme.ts` | **Skip for now** — these tools inherit from base-template (Vega), theme application is manual anyway. Non-blocking. |

## Blind Spots Caught

- **Codex:** Suggested rest spread (`...rest`) on NavLink for `aria-*` attributes and `data-*` props — good for accessibility. Claude missed this.
- **Claude:** Identified the `startsWith(href + "/")` guard to prevent false positives (e.g., `/services` matching `/services-overview`). Codex didn't specify match logic.
- **Claude:** Identified that LocationsDropdown's active state would be confusing UX on a dropdown trigger — it should always show inactive styling. Codex didn't address this.
- **Both agreed:** Layout shift prevention via `border-b-2 border-transparent` on inactive links.

---

## Implementation Plan

### Phase 1: Core-Components Primitives (2 files)

#### Step 1.1: Create `NavLink` client component

**New file:** `packages/core-components/src/components/ui/nav-link.tsx`

```tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export interface NavLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "className"> {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  exact?: boolean;
}

export function NavLink({
  href,
  children,
  className = "",
  activeClassName = "",
  inactiveClassName = "",
  exact = false,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? activeClassName : inactiveClassName}`.trim()}
      aria-current={isActive ? "page" : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
}
```

Notes:

- `aria-current="page"` set automatically when active (accessibility best practice, from Codex's hint about ARIA)
- Rest spread for theme-specific attrs (`data-*`, `aria-label`, etc.)
- `.trim()` prevents leading/trailing spaces in className

#### Step 1.2: Export NavLink from barrel

**File:** `packages/core-components/src/index.ts`

Add: `export { NavLink } from "./components/ui/nav-link";`
Add: `export type { NavLinkProps } from "./components/ui/nav-link";`

#### Step 1.3: Add `buttonClassName` to LocationsDropdown

**File:** `packages/core-components/src/components/ui/locations-dropdown.tsx`

- Add `buttonClassName?: string` to `LocationsDropdownProps` interface
- Line 141 (fallback link, no locations): `className={buttonClassName ?? \`${linkTextColor} hover:text-brand-primary transition-colors font-medium\`}`
- Line 156 (trigger button): `className={buttonClassName ?? \`flex items-center gap-1 ${buttonTextColor} hover:text-brand-primary transition-colors font-medium\`}`

**Verification gate:**

```bash
pnpm type-check
cd sites/base-template && npm run build  # Vega, doesn't use new props
cd sites/dj-fox-electrical && npm run build  # Orion, doesn't use new props
```

---

### Phase 2: Cygnus Header (1 file)

#### Step 2.1: Rewrite CygnusHeader as standalone Server Component

**File:** `packages/themes/cygnus/components/header.tsx`

Replace the SiteHeader wrapper with a standalone component. Structure:

```
<header> (Server Component — sticky, dark background)
  ├── Logo (Image + Link)
  ├── <nav> Desktop navigation
  │   ├── NavLink (client, from core-components) × N
  │   └── LocationsDropdown (client, from core-components, with buttonClassName)
  ├── Desktop actions (phone + CTA)
  └── MobileMenu (client, from core-components)
```

Cygnus nav classes:

- Base: `uppercase tracking-widest text-xs font-medium font-body transition-colors border-b-2 pb-1`
- Active: `text-brand-primary border-brand-primary`
- Inactive: `text-surface-foreground border-transparent hover:text-brand-primary`

`CygnusHeaderProps` interface stays identical — no consumer changes needed.

LocationsDropdown trigger gets `buttonClassName` with the inactive nav classes (dropdown trigger should never show "active" state — it opens a menu, not a page).

**Verification gate:**

```bash
pnpm type-check
cd sites/cygnus-test && npm run build && npm run dev  # Visual check
cd sites/mad-graphics && npm run build && npm run dev  # Visual check
```

Visual checks:

- [ ] Nav links are uppercase with wide tracking
- [ ] Active page has orange underline (border-b-2 in brand-primary)
- [ ] Inactive pages have no visible underline
- [ ] No layout shift when navigating
- [ ] LocationsDropdown trigger matches nav link style
- [ ] Mobile menu still works
- [ ] Logo, phone, CTA all render correctly

---

### Phase 3: Full Regression Check

```bash
pnpm build  # All workspaces
```

Spot-check that Orion and Vega sites render unchanged:

- `sites/dj-fox-electrical` — Orion header (dark, still uses SiteHeader wrapper)
- `sites/colossus-scaffolding` — Vega header (light, still uses SiteHeader wrapper)
- `sites/base-template` — Vega header (light)

---

## Files Changed Summary

| File                                                                | Change                                  | Lines              |
| ------------------------------------------------------------------- | --------------------------------------- | ------------------ |
| `packages/core-components/src/components/ui/nav-link.tsx`           | **New** — reusable active-aware NavLink | ~35                |
| `packages/core-components/src/index.ts`                             | Export NavLink + NavLinkProps           | +2                 |
| `packages/core-components/src/components/ui/locations-dropdown.tsx` | Add `buttonClassName` prop              | ~5 changed         |
| `packages/themes/cygnus/components/header.tsx`                      | Rewrite as standalone component         | ~70 (replaces ~15) |

## Pattern for Future Themes

Any new theme header follows this recipe:

```
Theme Header (Server Component)
  ├── Logo markup + theme-specific layout
  ├── NavLink (from core-components) × N — styled via className props
  ├── LocationsDropdown (from core-components) — styled via buttonClassName
  ├── CTA / phone / actions — theme-specific markup
  └── MobileMenu (from core-components)
```

The theme owns **layout and styling**. Core-components owns **interactive behavior**.

Orion and Vega can migrate to this pattern whenever they need header customization beyond `appearance="dark"|"light"`. No rush — their current wrappers continue to work.
