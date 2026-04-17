# YOLO Implementation Brief: Scalable Theme-Specific Header Primitives

**Branch:** feature/theme-header-primitives (created from develop)
**Session spec:** output/sessions/2026-04-07_theme-header-primitives/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Every theme header is currently a thin wrapper around the shared SiteHeader component, making them all look identical. The Cygnus theme (MAD Graphics, cygnus-test) needs uppercase nav links with an orange active-page underline, which SiteHeader cannot provide because active page detection requires `usePathname()` (client-only) and SiteHeader is a Server Component. This plan adds a reusable `NavLink` primitive to core-components and rewrites CygnusHeader as a standalone component that composes shared primitives with theme-specific styling.

The synthesis was reviewed and approved. Implement it exactly as specified below.

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15/$75                | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3/$15                 | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80/$4               | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/theme-header-primitives   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Core-Components Primitives

**Goal:** Add a reusable `NavLink` client component and a `buttonClassName` prop to `LocationsDropdown`
**Model:** sonnet — standard implementation across 3 files

### Step 1.1: Create `NavLink` client component

**New file:** `packages/core-components/src/components/ui/nav-link.tsx`

Create this file with the following content:

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

### Step 1.2: Export NavLink from barrel

**File:** `packages/core-components/src/index.ts`

Add these two lines alongside the other component exports:

```tsx
export { NavLink } from "./components/ui/nav-link";
export type { NavLinkProps } from "./components/ui/nav-link";
```

### Step 1.3: Add `buttonClassName` to LocationsDropdown

**File:** `packages/core-components/src/components/ui/locations-dropdown.tsx`

Read the file first. Then make these changes:

1. Add `buttonClassName?: string` to the `LocationsDropdownProps` interface (after `variant`)

2. Add `buttonClassName` to the destructured props in the function signature

3. On the fallback `<Link>` (when no locations exist, around line 141):
   Change from:

   ```tsx
   className={`${linkTextColor} hover:text-brand-primary transition-colors font-medium`}
   ```

   To:

   ```tsx
   className={buttonClassName ?? `${linkTextColor} hover:text-brand-primary transition-colors font-medium`}
   ```

4. On the trigger `<button>` (around line 156):
   Change from:
   ```tsx
   className={`flex items-center gap-1 ${buttonTextColor} hover:text-brand-primary transition-colors font-medium`}
   ```
   To:
   ```tsx
   className={buttonClassName ?? `flex items-center gap-1 ${buttonTextColor} hover:text-brand-primary transition-colors font-medium`}
   ```

### Step 1.4: Commit

```bash
git add packages/core-components/src/components/ui/nav-link.tsx packages/core-components/src/index.ts packages/core-components/src/components/ui/locations-dropdown.tsx
git commit -m "$(cat <<'EOF'
feat(core-components): add NavLink primitive and LocationsDropdown buttonClassName

NavLink is a 'use client' component that wraps Next.js Link with active
page detection via usePathname(). Themes compose it with their own class
strings for active/inactive states.

buttonClassName on LocationsDropdown allows themes to style the trigger
button to match their nav link design.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

### Verification gate — STOP if this fails

```bash
pnpm type-check
cd /Users/rickywilson/Sites/local-business-platform && cd sites/base-template && npm run build
cd /Users/rickywilson/Sites/local-business-platform && cd sites/dj-fox-electrical && npm run build
```

---

## Phase 2: Cygnus Header Rewrite

**Goal:** Replace CygnusHeader wrapper with a standalone Server Component that renders uppercase nav + active underline
**Model:** sonnet — single file rewrite composing known primitives

### Step 2.1: Rewrite CygnusHeader

**File:** `packages/themes/cygnus/components/header.tsx`

Read the file first. Then replace its entire contents with:

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
  // Cygnus nav link classes — uppercase with orange active underline
  const navBase =
    "uppercase tracking-widest text-xs font-medium font-body transition-colors border-b-2 pb-1";
  const navActive = "text-brand-primary border-brand-primary";
  const navInactive = "text-surface-foreground border-transparent hover:text-brand-primary";

  // LocationsDropdown trigger matches inactive nav style (never shows active — it opens a menu, not a page)
  const dropdownBtnClass = `flex items-center gap-1 ${navBase} ${navInactive}`;

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
                    buttonClassName={dropdownBtnClass}
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

**Key points:**

- `CygnusHeaderProps` is unchanged — no site layout changes needed
- `border-b-2 border-transparent pb-1` on inactive links prevents layout shift
- LocationsDropdown always gets inactive styling (dropdown trigger ≠ page link)
- No SiteHeader import — CygnusHeader owns its own markup
- `aria-current="page"` is set automatically by NavLink

### Step 2.2: Commit

```bash
git add packages/themes/cygnus/components/header.tsx
git commit -m "$(cat <<'EOF'
feat(cygnus): rewrite header as standalone with uppercase nav + active underline

CygnusHeader is now a standalone Server Component that composes NavLink,
LocationsDropdown, and MobileMenu from core-components. Nav links render
uppercase with wide tracking. Active page gets an orange (brand-primary)
bottom border. Layout shift prevented via transparent border on inactive links.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

### Verification gate — STOP if this fails

```bash
pnpm type-check
cd /Users/rickywilson/Sites/local-business-platform && cd sites/cygnus-test && npm run build
cd /Users/rickywilson/Sites/local-business-platform && cd sites/mad-graphics && npm run build
```

---

## Phase 3: Full Regression Check

**Goal:** Confirm all sites build and no regressions in Orion/Vega
**Model:** haiku — mechanical build verification

### Step 3.1: Build all workspaces

```bash
cd /Users/rickywilson/Sites/local-business-platform && pnpm build
```

This must pass cleanly. All sites (cygnus-test, mad-graphics, base-template, dj-fox-electrical, colossus-scaffolding) must build without errors.

### Step 3.2: Final lint and type-check

```bash
pnpm lint && pnpm type-check
```

### Verification gate — STOP if this fails

Both commands above must exit 0.

---

## Cost Estimate

| Phase                     | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Core primitives  | sonnet | ~15k              | ~3k                | $0.09      |
| Phase 2: Cygnus header    | sonnet | ~12k              | ~2k                | $0.07      |
| Phase 3: Regression check | haiku  | ~8k               | ~0.5k              | $0.01      |
| **Total**                 |        | **~35k**          | **~5.5k**          | **~$0.17** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | opus      | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-07_theme-header-primitives/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-04-07
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
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6` not `Opus 4.6`)

## Completed

**Date:** 2026-04-07
**Status:** All phases executed successfully

Phase 1 added a `NavLink` client component to core-components — a thin wrapper around Next.js `Link` that uses `usePathname()` to apply active/inactive class strings passed by the caller. `LocationsDropdown` gained a `buttonClassName` prop so themes can style its trigger button to match their nav design. Phase 2 rewrote `CygnusHeader` as a standalone Server Component that composes `NavLink`, `LocationsDropdown`, and `MobileMenu` — replacing the single-line `SiteHeader` wrapper. Nav links render uppercase with wide tracking; the active page gets an orange `border-brand-primary` bottom border; a transparent `border-b-2` on inactive links prevents layout shift. One minor surprise: a stale `.next/lock` file from a background build blocked `pnpm build` and required manual removal before Phase 3 could complete.

### Commits

- `9ff56e8` feat(core-components): add NavLink primitive and LocationsDropdown buttonClassName
- `f7761ab` feat(cygnus): rewrite header as standalone with uppercase nav + active underline
