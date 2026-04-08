# Claude's Plan: Scalable Theme-Specific Header Primitives

**Date:** 2026-04-07
**Author:** Claude (independent plan, pre-synthesis)

## Design Philosophy

Core-components should provide **behavioral primitives** (active detection, dropdown, mobile menu) with styling controlled entirely by the consuming theme. Theme headers should be **standalone Server Components** that compose these primitives — not thin wrappers around a monolithic SiteHeader.

## Phase 1: Add `NavLink` Primitive to Core-Components

### Step 1.1: Create `NavLink` client component

**New file:** `packages/core-components/src/components/ui/nav-link.tsx`

A `"use client"` component that wraps Next.js `<Link>` with active page detection:

```tsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string; // always applied
  activeClassName?: string; // applied when route is active
  inactiveClassName?: string; // applied when route is not active
  exact?: boolean; // true = exact match only; false (default) = prefix match
}

export function NavLink({
  href,
  children,
  className = "",
  activeClassName = "",
  inactiveClassName = "",
  exact = false,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <Link href={href} className={`${className} ${isActive ? activeClassName : inactiveClassName}`}>
      {children}
    </Link>
  );
}
```

**Design decisions:**

- `startsWith(href + "/")` prevents `/services` from matching `/services-overview`. The trailing slash ensures only true sub-paths match.
- `exact` prop for edge cases (e.g., home link should only match `/`)
- Three class slots (`className`, `activeClassName`, `inactiveClassName`) give themes full control
- Minimal — no opinion on styling, just active detection + class application

**Export:** Add to `packages/core-components/src/index.ts`

### Step 1.2: Add `buttonClassName` prop to `LocationsDropdown`

**File:** `packages/core-components/src/components/ui/locations-dropdown.tsx`

Add `buttonClassName?: string` to the props interface. Apply it to:

- Line 141 (fallback `<Link>` when no locations): `className={buttonClassName ?? current default}`
- Line 156 (trigger `<button>`): `className={buttonClassName ?? current default}`

This is backwards-compatible — existing consumers don't pass it, get current behavior.

### Verification Gate

- `pnpm type-check` passes
- All existing sites build unchanged (no consumer passes `buttonClassName` yet)
- `NavLink` is importable: `import { NavLink } from "@platform/core-components"`

---

## Phase 2: Rewrite CygnusHeader as Standalone Component

### Step 2.1: Rewrite header component

**File:** `packages/themes/cygnus/components/header.tsx`

Replace the SiteHeader wrapper with a standalone Server Component that composes:

- `NavLink` from core-components (for active-aware desktop nav links)
- `LocationsDropdown` from core-components (with `buttonClassName` for matching style)
- `MobileMenu` from core-components (unchanged)

```tsx
import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { MobileMenu, LocationsDropdown, NavLink } from "@platform/core-components";

export interface CygnusHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
}

export function CygnusHeader({
  siteName,
  phoneDisplay,
  phoneTel,
  showPhone = true,
  primaryCta,
  navigation,
  locations,
}: CygnusHeaderProps) {
  // Cygnus nav link classes
  const navBase =
    "uppercase tracking-widest text-xs font-medium font-body transition-colors border-b-2 pb-1";
  const navActive = "text-brand-primary border-brand-primary";
  const navInactive = "text-surface-foreground border-transparent hover:text-brand-primary";

  return (
    <header className="sticky top-0 z-40 bg-surface-inverse border-b border-surface-subtle">
      <div className="mx-auto w-full lg:w-[90%] px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="relative flex-shrink-0" style={{ width: 160, height: 40 }}>
            <Image
              src="/logo.svg"
              alt={siteName}
              fill
              sizes="160px"
              priority
              className="object-contain object-left"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => {
              if (item.hasDropdown && locations.length > 0) {
                return (
                  <LocationsDropdown
                    key={item.href}
                    locations={locations}
                    label={item.label}
                    variant="dark"
                    buttonClassName={`flex items-center gap-1 ${navBase} ${navInactive}`}
                  />
                );
              }
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  className={navBase}
                  activeClassName={navActive}
                  inactiveClassName={navInactive}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {showPhone && phoneDisplay && phoneTel && (
              <Link
                href={`tel:${phoneTel}`}
                className="flex items-center gap-2 text-white hover:text-brand-primary transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span className="font-semibold">{phoneDisplay}</span>
              </Link>
            )}
            <Link
              href={primaryCta.href}
              className="bg-brand-primary text-on-brand-primary px-5 py-2.5 rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors"
            >
              {primaryCta.label}
            </Link>
          </div>

          {/* Mobile Menu */}
          <MobileMenu
            phoneDisplay={phoneDisplay ?? ""}
            phoneTel={phoneTel ?? ""}
            locations={locations}
            siteName={siteName}
            navigation={navigation}
            showPhone={showPhone}
            primaryCta={primaryCta}
            variant="dark"
          />
        </div>
      </div>
    </header>
  );
}
```

**Key design decisions:**

- `CygnusHeaderProps` is unchanged — no site layout changes needed
- `border-b-2 border-transparent pb-1` on inactive links prevents layout shift (same space reserved)
- LocationsDropdown gets matching classes via `buttonClassName`
- No SiteHeader import — CygnusHeader owns its markup

### Verification Gate

- `pnpm type-check` passes
- `cd sites/cygnus-test && npm run build` succeeds
- `cd sites/mad-graphics && npm run build` succeeds
- Dev server visual check: uppercase nav, orange underline on active page, no layout shift
- All other sites still build (they don't import from Cygnus)

---

## Phase 3: Verify No Regressions

### Step 3.1: Build all sites

```bash
pnpm build
```

### Step 3.2: Visual spot-check

- `sites/dj-fox-electrical` — Orion header unchanged (still uses SiteHeader via OrionHeader wrapper)
- `sites/colossus-scaffolding` — Vega header unchanged
- `sites/base-template` — Vega header unchanged

---

## Risks and Trade-offs

### Risk: NavLink is a client component in an otherwise-Server-Component header

**Mitigation:** NavLink is tiny (~15 lines). It's the minimum possible client boundary — just `usePathname()` + a `<Link>`. The header shell, logo, phone, CTA all remain server-rendered.

### Risk: LocationsDropdown active state

The `buttonClassName` prop styles the dropdown trigger, but doesn't make it aware of active state (it can't know if `/locations` is the current page). For Cygnus, the Locations dropdown trigger uses `navInactive` classes always. This is acceptable because:

- The dropdown is a menu trigger, not a page link
- Clicking it opens the dropdown, not navigates
- Active state would be confusing UX on a dropdown trigger

If a future theme wants active state on the dropdown trigger too, they'd need to wrap LocationsDropdown in their own client component that reads `usePathname()` and passes dynamic `buttonClassName`.

### Risk: Orion/Vega migration

Orion and Vega headers still wrap SiteHeader. They can be migrated to standalone components using NavLink whenever their designs diverge from the generic SiteHeader. This is opt-in, not forced.

### Trade-off: SiteHeader becomes less central

As themes adopt standalone headers, SiteHeader becomes the "default" header for themes without custom components (Atlas, Lyra, Nova, Rigel). This is fine — it serves as a reasonable baseline that works with `appearance` alone.

### Trade-off: LocationsDropdown buttonClassName is string-only

A more flexible API would accept a render function or a React component for the trigger. But string className is sufficient for styling differences and avoids over-engineering. If a theme needs a fundamentally different trigger (e.g., icon-only), that's when a render prop would be warranted.

---

## Future Pattern (for any new theme)

When creating a new theme header:

1. Create `packages/themes/{name}/components/header.tsx` as a **standalone Server Component**
2. Import `NavLink`, `LocationsDropdown`, `MobileMenu` from `@platform/core-components`
3. Define theme-specific nav classes and pass to NavLink's `className`/`activeClassName`/`inactiveClassName`
4. Define theme-specific layout (logo placement, action buttons, sticky behavior)
5. Export from `packages/themes/{name}/components/index.ts`

The theme owns: layout, spacing, typography, color classes, sticky behavior, logo sizing.
Core-components owns: active detection (NavLink), dropdown behavior (LocationsDropdown), mobile menu (MobileMenu).

---

## Files Changed Summary

| File                                                                | Change                                   |
| ------------------------------------------------------------------- | ---------------------------------------- |
| `packages/core-components/src/components/ui/nav-link.tsx`           | **New** — active-aware NavLink primitive |
| `packages/core-components/src/index.ts`                             | Export NavLink                           |
| `packages/core-components/src/components/ui/locations-dropdown.tsx` | Add `buttonClassName` prop               |
| `packages/themes/cygnus/components/header.tsx`                      | Rewrite as standalone component          |
