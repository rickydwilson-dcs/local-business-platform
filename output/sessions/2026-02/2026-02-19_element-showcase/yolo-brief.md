# YOLO Implementation Brief: Showcase — Theme-Aware Components, UX Improvements, Token Migration

**Branch:** develop
**Session spec:** output/sessions/2026-02-19_element-showcase/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error

---

## Context

The element showcase (`sites/showcase`, localhost:3002) has three outstanding issues:

1. **Themes look identical** — the registry's `render()` functions use the same components for both Orion and Vega. Orion should show its distinctive dark header, full-bleed hero, and circular icon cards.
2. **Brand injector UX is confusing** — it's a panel below each component with no clear base theme indicator. Needs replacing with a modal triggered by a "Customise" button, and a new per-theme scrollable style guide page.
3. **Registry uses hardcoded Tailwind grays** — the token migration (completed 2026-02-19) added new token utilities; the showcase registry must use them so it demonstrates correct practice.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Pre-flight

```bash
# Verification gate — STOP if this fails
git checkout develop && git pull
pnpm --filter showcase type-check
```

---

## Phase 1: Theme-Aware Component Registry

**Goal:** Make `render()` theme-aware so Orion and Vega render structurally different components.

### Step 1a: Update `ElementDefinition` interface

Read `sites/showcase/registry/index.ts`. Change the render signature:

```ts
// Before
render: () => React.ReactNode;

// After
render: (theme: string) => React.ReactNode;
```

### Step 1b: Update all render() call sites

Grep for `element.render()` with no argument across the showcase. Update each call site to pass the theme name. Files to check (read each before editing):

- `sites/showcase/components/ElementCard.tsx` — use `element.render(theme)` or `element.render(t.name)`
- `sites/showcase/app/elements/[slug]/page.tsx` — use `element.render(t.name)` per theme row
- `sites/showcase/app/compare/page.tsx` — use `element.render(t.name)` per column cell
- `sites/showcase/app/page.tsx` — if it renders element previews

Do these file edits in parallel (they are independent).

### Step 1c: Rewrite registry files with theme-specific components

**Pre-checks (run in parallel before editing):**

```bash
grep -n "export" packages/core-components/src/components/ui/dark-stat-card.tsx
grep -n "export" packages/core-components/src/components/ui/blog-post-card.tsx
grep -n "export" packages/core-components/src/components/ui/hero-with-image.tsx
grep -n "export" packages/core-components/src/components/ui/circular-icon-card.tsx
```

Note the exact export names — use them in imports below.

**`sites/showcase/registry/hero.tsx`** — Orion: `HeroWithImage` (full-bleed), Vega: `HeroSection` (split):

- For `HeroWithImage.imageSrc`, first check how `getImageUrl()` works in `packages/core-components/src/lib/image.ts`. If it prepends an R2 base URL, use a full placeholder: `"https://placehold.co/1200x600/1a1a1a/ffffff?text=Hero+Image"` instead of a relative path.
- Check if `AccentUnderline` is exported from `@platform/core-components` before using it; if not, use a plain `<h1>`.

```tsx
render: (theme) => theme === 'orion'
  ? <HeroWithImage
      imageSrc="https://placehold.co/1200x600/1a1a1a/ffffff?text=Hero+Image"
      imageAlt="Professional electrician at work"
      heading={<h1 className="text-5xl font-bold text-white">Expert Electrical Services</h1>}
      subheading="NICEIC Approved Contractor — Covering the South East"
      ctaPrimary={{ label: 'Get Free Quote', href: '/contact' }}
      ctaSecondary={{ label: 'Our Services', href: '/services' }}
      overlay="dark"
    />
  : <HeroSection
      title="Professional Services You Can Trust"
      description="Award-winning local services with over 20 years of experience."
      trustBadges={['Industry Certified', 'Fully Insured', 'Free Quotes']}
      ctaText="Get Free Quote"
      ctaUrl="/contact"
      phone="020 1234 5678"
    />,
```

**`sites/showcase/registry/cards.tsx`** — Orion: `CircularIconCard` grid, Vega: `ServiceCards`:

```tsx
import { Zap, Shield, Clock } from 'lucide-react';

render: (theme) => theme === 'orion'
  ? (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-surface-background">
      <CircularIconCard icon={Zap} title="Emergency Callout" description="Fast response 24/7 when you need it most." linkText="Learn More" linkHref="/services/emergency" />
      <CircularIconCard icon={Shield} title="Full Installation" description="Complete installation from planning to handover." linkText="Learn More" linkHref="/services/installation" />
      <CircularIconCard icon={Clock} title="Maintenance Plans" description="Regular inspection and maintenance contracts." linkText="Learn More" linkHref="/services/maintenance" />
    </div>
  )
  : <ServiceCards
      title="Our Core Services"
      description="Professional solutions tailored to your needs"
      cards={[
        { title: 'Scaffolding', description: 'Residential and commercial scaffold erection.', href: '/services/scaffolding', icon: 'scaffold' },
        { title: 'Propping', description: 'Structural propping for safe demolition and renovation.', href: '/services/propping', icon: 'prop' },
        { title: 'Hoarding', description: 'Secure site hoarding for public safety.', href: '/services/hoarding', icon: 'hoarding' },
      ]}
    />,
```

**`sites/showcase/registry/navigation.tsx`** — add `SiteHeader`:

```tsx
render: (theme) => (
  <SiteHeader
    appearance={theme === 'orion' ? 'dark' : 'light'}
    siteName={theme === 'orion' ? 'DJ Fox Electrical' : 'Colossus Scaffolding'}
    phoneDisplay="020 1234 5678"
    phoneTel="02012345678"
    primaryCta={{ label: 'Get Free Quote', href: '/contact' }}
    navigation={[
      { label: 'Services', href: '/services' },
      { label: 'Locations', href: '/locations' },
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
    ]}
    sticky={false}
  />
),
```

**`sites/showcase/registry/stats.tsx`** — populate with `DarkStatCard` (use the exact export name from your pre-check grep):

```tsx
render: () => (
  <div className="grid grid-cols-3 gap-4 p-4 bg-surface-inverse">
    <DarkStatCard value="500+" label="Projects Completed" />
    <DarkStatCard value="20yr" label="Industry Experience" />
    <DarkStatCard value="4.9★" label="Average Rating" />
  </div>
),
```

**`sites/showcase/registry/blog.tsx`** — populate with `BlogPostCard` (use the exact export name from your pre-check grep):

```tsx
render: () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-surface-background">
    {[1, 2, 3].map(i => (
      <BlogPostCard
        key={i}
        title={`How to Choose the Right Contractor for Your Project ${i}`}
        excerpt="What to look for when hiring a local tradesperson — certifications, reviews, and red flags to avoid."
        date="2026-02-01"
        slug={`blog-post-${i}`}
        imageSrc="https://placehold.co/800x450/e5e7eb/6b7280?text=Article+Image"
      />
    ))}
  </div>
),
```

Read each registry file before editing. The stats and blog edits can be done in parallel with hero and cards edits since they are independent files.

```bash
# Verification gate — STOP if this fails
pnpm --filter showcase type-check
```

---

## Phase 2: UX Improvements

**Goal:** Replace the confusing brand injector panel with a modal + add per-theme scrollable style guide pages.

### Step 2a: Update `app/layout.tsx`

Read the file first. It is a Server Component.

Add imports at top:

```ts
import "@/lib/register-all-themes";
import { getRegisteredThemes } from "@platform/theme-system";
```

Add a "Themes" section to the sidebar `<ul>` below the existing Browse/Compare links:

```tsx
<li className="mt-4">
  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Themes</p>
  <ul className="space-y-1">
    {getRegisteredThemes().map((t) => (
      <li key={t.name}>
        <a
          href={`/themes/${t.name}`}
          className="block py-1 text-gray-700 hover:text-brand-primary font-medium"
        >
          {t.label}
        </a>
      </li>
    ))}
  </ul>
</li>
```

### Step 2b: New route `app/themes/[name]/page.tsx`

Create this file. It renders all registered elements stacked vertically inside a single `ThemeFrame` — looks like a real rendered site.

Order of elements to render (use `elementsBySlug.get(slug)` for each, skip if not found):
`site-header` → `hero-homepage` → `service-cards` → `social-proof` → `cta-section` → `dark-stat-card` → `blog-post-card` → `color-tokens`

```tsx
import "@/lib/register-all-themes";
import { getRegisteredThemes } from "@platform/theme-system";
import { elementsBySlug } from "@/registry";
import { ThemeFrame } from "@/components/ThemeFrame";
import { notFound } from "next/navigation";

const ORDERED_SLUGS = [
  "site-header",
  "hero-homepage",
  "service-cards",
  "social-proof",
  "cta-section",
  "dark-stat-card",
  "blog-post-card",
  "color-tokens",
];

export function generateStaticParams() {
  return getRegisteredThemes().map((t) => ({ name: t.name }));
}

interface ThemePageProps {
  params: Promise<{ name: string }>;
}

export default async function ThemePage({ params }: ThemePageProps) {
  const { name } = await params;
  const themes = getRegisteredThemes();
  const theme = themes.find((t) => t.name === name);
  if (!theme) notFound();

  return (
    <ThemeFrame theme={name} className="min-h-screen">
      {ORDERED_SLUGS.map((slug) => {
        const element = elementsBySlug.get(slug);
        if (!element) return null;
        return (
          <section key={slug} className="relative">
            <p className="absolute top-1 left-2 z-10 text-xs text-surface-muted-foreground opacity-60 hover:opacity-100 transition-opacity pointer-events-none">
              {element.name}
            </p>
            {element.render(name)}
          </section>
        );
      })}
    </ThemeFrame>
  );
}
```

Note: `ThemeFrame` may need a `className` prop — read `sites/showcase/components/ThemeFrame.tsx` first; add the prop if missing.

### Step 2c: Update `lib/brand-vars.ts`

Read the file first. Add `buildCustomVarsFromBase`:

```ts
export function buildCustomVarsFromBase(
  baseThemeName: string,
  overrides: DeepPartialThemeConfig
): Record<string, string> {
  const themes = getRegisteredThemes();
  const base = themes.find((t) => t.name === baseThemeName)?.config ?? {};
  const merged = deepMerge(
    deepMerge(defaultTheme as unknown as Record<string, unknown>, base as Record<string, unknown>),
    overrides as Record<string, unknown>
  ) as unknown as ThemeConfig;
  return generateCssVariables(merged);
}
```

Import `getRegisteredThemes` from `@platform/theme-system`. Import `deepMerge` from `@platform/theme-system` or its existing import path. Import `defaultTheme` from `@platform/theme-system`.

### Step 2d: New file `components/BrandInjectorModal.tsx`

This is a `'use client'` component. It is a modal overlay with:

- State: `isOpen` (boolean), `baseTheme` (string, default first registered theme name), `primary` (string), `secondary` (string), `accent` (string), `fontFamily` (string)
- On mount: read `useSearchParams()` to pre-fill fields (`base_theme`, `brand_primary`, `brand_secondary`, `brand_accent`, `font_family` — no `#` prefix in URL params)
- "Customise" trigger button: renders inline as a button the parent places wherever needed
- When open: fixed overlay (`z-50 fixed inset-0 bg-black/50`) + centered card (`max-w-md`)
- Inputs: `<input type="color">` for primary/secondary/accent; `<input type="text">` for font
- Base theme: `<fieldset>` with radio buttons, one per `getRegisteredThemes()` entry
- "Apply" button: strips `#` from colour values, calls `router.replace()` with updated search params (`base_theme`, `brand_primary`, `brand_secondary`, `brand_accent`, `font_family`), sets `isOpen = false`
- "Reset" button: calls `router.replace()` removing all those params, clears local state

Export: `export function BrandInjectorModal({ children }: { children?: React.ReactNode })`

The component exposes a trigger — the parent renders `<BrandInjectorModal />` and the button is internal to the modal component. Or expose `isOpen`/`setIsOpen` as props. Read how the existing `BrandInjectorPanel` was used in `app/elements/[slug]/page.tsx` to decide the cleanest API.

### Step 2e: Update `app/elements/[slug]/page.tsx`

Read the file first.

- Remove the `BrandInjectorPanel` import and its JSX below the theme rows
- Add `BrandInjectorModal` to the page header area (top-right, as a flex sibling to the back link / title)
- Read URL search params (`base_theme`, `brand_primary`, `brand_secondary`, `brand_accent`, `font_family`) — since this is a Server Component, read from `searchParams` prop (Next.js 15 pattern: `const { base_theme, brand_primary, ... } = await searchParams`)
- If any custom params are present, render an additional row after the named theme rows:
  ```tsx
  {
    hasCustomParams && (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            {baseThemeLabel} + Custom
          </h2>
        </div>
        <CustomBrandProvider
          baseTheme={base_theme}
          overrides={{
            primary: brand_primary,
            secondary: brand_secondary,
            accent: brand_accent,
            fontFamily: font_family,
          }}
        >
          {element.render(base_theme ?? themes[0].name)}
        </CustomBrandProvider>
      </div>
    );
  }
  ```

Read `sites/showcase/components/CustomBrandProvider.tsx` — update it to accept `baseTheme` and `overrides` props, using `buildCustomVarsFromBase` from `lib/brand-vars.ts` to compute the inline CSS vars.

```bash
# Verification gate — STOP if this fails
pnpm --filter showcase type-check
```

---

## Phase 3: Token Migration — Fix Showcase Registry

**Goal:** Replace all hardcoded Tailwind gray classes in registry files with theme token utilities.

### Step 3a: Scan for hardcoded grays

```bash
grep -rn "text-gray-\|border-gray-\|bg-gray-50\|bg-gray-100\|bg-gray-900\|bg-white" sites/showcase/registry/
```

Note every file and line. Read each file before editing.

### Step 3b: Apply replacement table

| Hardcoded class                              | Replace with                    |
| -------------------------------------------- | ------------------------------- |
| `text-gray-900`                              | `text-surface-foreground`       |
| `text-gray-700`                              | `text-surface-foreground`       |
| `text-gray-600`                              | `text-surface-secondary`        |
| `text-gray-500`                              | `text-surface-muted-foreground` |
| `border-gray-200`                            | `border-surface-card-border`    |
| `bg-gray-50`                                 | `bg-surface-muted`              |
| `bg-gray-100`                                | `bg-surface-muted`              |
| `bg-white` (component card backgrounds only) | `bg-surface-card`               |
| `bg-gray-900` (dark stat section wrapper)    | `bg-surface-inverse`            |

**Exception:** Do NOT replace gray classes in showcase chrome (sidebar, page wrapper, back links) — only replace them inside the `render()` function bodies of registry entries.

Edit all affected registry files. Independent files can be edited in parallel.

### Step 3c: Expand `registry/tokens.tsx` with new token groups

Read `sites/showcase/registry/tokens.tsx` first. After the existing "Buttons" group, add two new groups inside the same outer `<div className="space-y-6 p-6">`:

**Surface Extended group:**

```tsx
<div>
  <p className="text-sm font-semibold text-surface-muted-foreground mb-2">Surface Extended</p>
  <div className="flex gap-3">
    <div
      className="w-12 h-12 rounded-lg bg-surface-subtle border border-surface-card-border"
      title="surface-subtle"
    />
    <div className="w-12 h-12 rounded-lg bg-surface-inverse" title="surface-inverse" />
    <div
      className="w-12 h-12 rounded-lg bg-surface-card border border-surface-card-border"
      title="surface-card"
    />
  </div>
  <div className="flex gap-4 mt-2">
    <span className="text-surface-foreground text-sm">foreground</span>
    <span className="text-surface-secondary text-sm">secondary</span>
    <span className="text-surface-tertiary text-sm">tertiary</span>
    <span className="text-surface-muted-foreground text-sm">muted</span>
  </div>
</div>
```

**Text on Brand group:**

```tsx
<div>
  <p className="text-sm font-semibold text-surface-muted-foreground mb-2">Text on Brand</p>
  <div className="flex gap-3">
    <div className="flex items-center justify-center w-24 h-12 rounded-lg bg-brand-primary">
      <span className="text-on-brand-primary text-sm font-medium">on-primary</span>
    </div>
    <div className="flex items-center justify-center w-24 h-12 rounded-lg bg-surface-inverse">
      <span className="text-on-brand-primary text-sm font-medium">on-inverse</span>
    </div>
  </div>
</div>
```

```bash
# Verification gate — STOP if this fails
grep -rn "text-gray-\|border-gray-\|bg-gray-50\|bg-gray-100\|bg-gray-900\|bg-white" sites/showcase/registry/
# Expected: zero results (or only bg-gray-900 if used intentionally as a fallback — document why)
pnpm --filter showcase type-check
```

---

## Final Verification

```bash
pnpm --filter showcase type-check
```

Then start dev server and manually verify:

- `/themes/orion` — scrollable page: dark header, red brand, full-bleed hero, circular icon cards, dark stat section
- `/themes/vega` — scrollable page: white header, blue brand, split hero, standard card grid
- `/elements/hero-homepage` — two rows: Orion (dark full-bleed), Vega (split layout). "Customise" button top-right.
- `/elements/service-cards` — Orion: circular icon badges. Vega: standard card grid.
- `/elements/site-header` — Orion: black header. Vega: white header.
- Customise button → modal opens → radio buttons for Orion/Vega → change primary colour → Apply → "Orion + Custom" row appears with new colour
- Reload URL with params → state restored
- `/color-tokens` — Surface Extended and Text on Brand groups visible, token labels use `text-surface-muted-foreground` (not gray-500)

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with a brief summary of files changed
2. Hardcoded gray grep result — confirm zero remaining in registry render() bodies
3. Type-check status — confirm `pnpm --filter showcase type-check` passes
4. Any intentional deviations from the plan (e.g. export names that differed, props that didn't exist)

---

## Update Session File

After completing all phases, append to `output/sessions/2026-02-19_element-showcase/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-02-20
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises, component export names that differed from plan]

### Changes by phase

- Phase 1 (Theme-aware registry): [files changed]
- Phase 2 (UX improvements): [files created/modified]
- Phase 3 (Token migration): [files updated, count of gray class replacements]
```

Confirm this was done in the final report.

---

## Rules

- STOP on any failed verification gate — do not continue to the next phase
- Read every file before editing it
- Never push — leave all changes on `develop`
- Read multiple independent files in parallel; edit independent files in parallel
- Minimal changes only — implement what the plan says, nothing more
- If a component prop doesn't exist (e.g. `sticky`, `appearance`), grep the component source to find the correct prop name before writing the JSX

---

## Completed

**Date:** 2026-02-20
**Status:** All phases executed successfully

All three phases implemented as specified. The theme-aware registry now renders structurally different components for Orion (dark header, full-bleed hero, circular icon cards) vs Vega (light header, split hero, standard card grid). The BrandInjectorPanel was replaced with a modal triggered by a "Customise" button, and new per-theme scrollable style guide pages were added at `/themes/[name]`. Key deviations from plan: `BlogPostCard` uses `heroImage` prop (not `imageSrc`); `DarkStatCard` requires an `icon` prop (LucideIcon) which the plan omitted — added Award/Briefcase/Star icons; `ServiceCards` Vega variant needed `subtitle`, `features`, and `ctaText` fields which the plan's simplified data didn't include; `lucide-react` had to be added as a showcase dependency.

### Changes by phase

- Phase 1 (Theme-aware registry): `registry/index.ts` (render signature), `registry/hero.tsx`, `registry/cards.tsx`, `registry/navigation.tsx`, `registry/stats.tsx`, `registry/blog.tsx` (theme-specific components), `registry/social-proof.tsx`, `registry/cta.tsx`, `registry/content.tsx`, `registry/typography.tsx`, `registry/tokens.tsx` (added theme param), `components/ElementCard.tsx`, `app/elements/[slug]/page.tsx`, `app/compare/page.tsx` (updated call sites), `package.json` (added lucide-react)
- Phase 2 (UX improvements): `app/layout.tsx` (sidebar theme links), `app/themes/[name]/page.tsx` (new route), `components/BrandInjectorModal.tsx` (new modal), `components/CustomBrandProvider.tsx` (rewritten for baseTheme+overrides), `components/BrandInjectorPanel.tsx` (updated for new interface), `lib/brand-vars.ts` (added buildCustomVarsFromBase), `app/elements/[slug]/page.tsx` (modal + custom brand row)
- Phase 3 (Token migration): `registry/social-proof.tsx` (3 gray→token), `registry/tokens.tsx` (4 gray→token text, 3 gray→token borders, 2 new token groups added). Zero hardcoded grays remaining in registry render() bodies.
