# Styling Standards

**Version:** 1.2.0
**Last Updated:** 2026-02-17
**Scope:** All sites in local-business-platform

---

## Overview

All styling in the Local Business Platform uses Tailwind CSS with a centralized theme system (`@platform/theme-system`). This ensures consistency across all sites while allowing per-site brand customization through CSS variables.

## Core Principles

### 1. Tailwind CSS Only

- ALL styling via Tailwind utility classes
- NO inline styles (`style={{}}` properties)
- NO styled-components or CSS-in-JS
- NO custom CSS files unless absolutely necessary

### 2. Theme System Integration

Use theme tokens instead of hardcoded colors:

```css
/* CORRECT - Using theme tokens */
.btn-primary {
  @apply inline-flex items-center px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors;
}

/* WRONG - Hardcoded hex colors */
.btn-primary {
  @apply inline-flex items-center px-6 py-3 bg-[#005A9E] text-white font-semibold rounded-lg hover:bg-[#004a85] transition-colors;
}
```

### 3. Maintainable Class System

Repeated styling patterns MUST be extracted to maintainable classes in `globals.css`:

```css
/* globals.css - Approved maintainable classes */
.btn-primary {
  @apply inline-flex items-center px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors;
}

.card-interactive {
  @apply group relative bg-surface-card rounded-2xl shadow-sm border border-surface-card-border p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300;
}

.section-standard {
  @apply py-16 lg:py-20;
}
```

### 4. File Structure

```
/app/globals.css          - Maintainable classes with @apply
/theme.config.ts          - Site-specific theme configuration
/tailwind.config.ts       - Uses createThemePlugin(themeConfig)
/components/ui/           - All reusable UI components
```

## Implementation

### Correct Usage

```tsx
// CORRECT - Theme tokens
<button className="bg-brand-primary hover:bg-brand-primary-hover text-white">Click me</button>
<div className="bg-surface-background text-surface-foreground">Content</div>

// CORRECT - Maintainable classes
<button className="btn-primary">Click me</button>
<div className="card-interactive">Content</div>

// CORRECT - Tailwind utilities for unique styling
<div className="p-4 rounded-lg shadow-md">
```

### Wrong Usage

```tsx
// WRONG - Hardcoded hex colors (use theme tokens)
<button className="bg-[#005A9E] hover:bg-[#004a85]">

// WRONG - Repeated custom patterns (should be a class)
<button className="inline-flex items-center px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors">
<button className="inline-flex items-center px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors">

// WRONG - Inline styles
<div style={{ backgroundColor: '#005A9E', color: 'white', padding: '16px' }}>

// WRONG - CSS-in-JS
const StyledDiv = styled.div`background: blue;`
```

## Never Hardcode These

This is the most common source of white-label breakage. The theme system exists so that changing `theme.config.ts` re-brands an entire site. Hardcoded color values bypass this system and create sites that cannot be re-themed.

**Banned patterns and their replacements:**

| Hardcoded Pattern                                     | Why It Breaks                                                                    | Theme-Aware Replacement                                |
| ----------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `bg-[#3b82f6]`, `text-[#db0b0b]`                      | Hex colors baked into markup ignore the theme entirely                           | `bg-brand-primary`, `text-brand-primary`               |
| `bg-[rgba(0,0,0,0.8)]`                                | RGBA values bypass overlay tokens that each site configures                      | `bg-overlay-dark`                                      |
| `bg-[hsla(220,80%,50%,0.5)]`                          | HSL/HSLA is still a hardcoded color value                                        | Use theme tokens or Tailwind opacity modifiers on them |
| `:root { --color-brand-primary: #xxx; }` in CSS files | Overriding CSS variables outside `theme.config.ts` fragments the source of truth | Define all colors in `theme.config.ts`                 |
| `style={{ color: '#374151' }}`                        | Inline styles bypass Tailwind and the theme system completely                    | `className="text-surface-foreground"`                  |
| `border-[#e5e7eb]`                                    | Hardcoded borders will not match the site's configured card border color         | `border-surface-card-border`                           |

**The rule is simple:** if it contains a literal color value (`#`, `rgb`, `rgba`, `hsl`, `hsla`) anywhere except `theme.config.ts` or `defaults.ts`, it is wrong.

### The One Exception: Email Templates

HTML email does not support CSS custom properties. Email templates in `app/api/contact/route.ts` must use inline styles with literal color values. The correct approach is to read colors from `theme.config.ts` at runtime so the values still come from the theme:

```typescript
// CORRECT - Colors flow from theme.config.ts into email HTML
import { themeConfig } from "@/theme.config";

function getEmailColors() {
  return {
    brandPrimary: themeConfig.colors?.brand?.primary ?? "#3b82f6",
    textPrimary: themeConfig.colors?.surface?.foreground ?? "#374151",
    background: themeConfig.colors?.surface?.muted ?? "#f9fafb",
    textMuted: themeConfig.colors?.surface?.mutedForeground ?? "#6b7280",
  };
}

// Then in the email template:
const colors = getEmailColors();
const html = `
  <h1 style="color: ${colors.brandPrimary};">New Submission</h1>
  <p style="color: ${colors.textPrimary};">...</p>
`;
```

```typescript
// WRONG - Hardcoded colors in email template
const html = `
  <h1 style="color: #3b82f6;">New Submission</h1>
  <p style="color: #374151;">...</p>
`;
```

The fallback values after `??` are acceptable because they only activate if the theme config has no value at all, and they match the platform defaults.

## Advanced Patterns

### Overlay Colors

The theme system provides three overlay tokens configured per-site in `theme.config.ts`. Each site's overlay colors are tuned to its brand. For example, a red-branded electrical company has `overlay.primary` set to `rgba(219, 11, 11, 0.8)`, while a blue scaffolding company has `rgba(0, 90, 158, 0.8)`.

**Available overlay utilities:**

| Utility              | Purpose                                               | Default Value              |
| -------------------- | ----------------------------------------------------- | -------------------------- |
| `bg-overlay-dark`    | Dark overlay on images/content with light text on top | `rgba(0, 0, 0, 0.8)`       |
| `bg-overlay-light`   | Light overlay on content with dark text on top        | `rgba(255, 255, 255, 0.8)` |
| `bg-overlay-primary` | Brand-tinted overlay for branded hover effects        | `rgba(brand-primary, 0.8)` |

**Gradient overlays on images:**

```tsx
// CORRECT - Theme-aware gradient using Tailwind opacity modifier on black
<div className="relative">
  <Image src={heroImage} alt="..." fill className="object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
  <div className="relative z-10 text-white">Content over image</div>
</div>
```

```tsx
// WRONG - Hardcoded RGBA in arbitrary value
<div className="absolute inset-0 bg-[rgba(0,0,0,0.8)]" />
// WRONG - Hardcoded hex with arbitrary opacity
<div className="absolute inset-0 bg-[#00000080]" />
```

**Brand-tinted hover overlay:**

This pattern is used for interactive image cards where hovering reveals a brand-colored overlay. The color automatically matches the site's brand because it uses the `bg-brand-primary` token:

```tsx
// CORRECT - Brand overlay using theme token with Tailwind opacity
<div className="group relative overflow-hidden">
  <Image src={cardImage} alt="..." fill className="object-cover" />
  {/* Dark gradient base (always visible) */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
  {/* Brand overlay (visible on hover) */}
  <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
  <div className="relative z-10 text-white">Card content</div>
</div>
```

```tsx
// WRONG - Hardcoded brand color in overlay
<div className="absolute inset-0 bg-[rgba(219,11,11,0.8)] opacity-0 group-hover:opacity-100" />
// WRONG - Site-specific hex that only works for one brand
<div className="absolute inset-0 bg-[#db0b0b]/80 opacity-0 group-hover:opacity-100" />
```

**Using the overlay tokens directly:**

For cases where you need a solid overlay (not a gradient), use the pre-configured overlay utilities:

```tsx
// CORRECT - Modal backdrop using theme overlay
<div className="fixed inset-0 bg-overlay-dark z-modal" />

// CORRECT - Light overlay for content readability
<div className="absolute inset-0 bg-overlay-light" />

// CORRECT - Brand overlay for branded sections
<div className="absolute inset-0 bg-overlay-primary" />
```

### Opacity Utilities

The theme system defines semantic opacity values so that disabled states, muted elements, and overlays look consistent across all sites. These are configured in `theme.config.ts` under `opacity` and have sensible defaults.

**Available opacity utilities:**

| Utility            | Purpose                                  | Default Value |
| ------------------ | ---------------------------------------- | ------------- |
| `opacity-disabled` | Disabled buttons, inactive form elements | `0.5`         |
| `opacity-muted`    | De-emphasized secondary content          | `0.7`         |
| `opacity-overlay`  | Overlay backgrounds, backdrop filters    | `0.8`         |

```tsx
// CORRECT - Semantic opacity tokens
<button disabled className="btn-primary opacity-disabled cursor-not-allowed">
  Unavailable
</button>

<p className="text-surface-foreground opacity-muted">
  Secondary information the user does not need to focus on.
</p>

<div className="absolute inset-0 bg-black opacity-overlay">
  {/* Full-screen overlay at 0.8 opacity */}
</div>
```

```tsx
// WRONG - Arbitrary opacity values
<button disabled className="btn-primary opacity-50 cursor-not-allowed">
<p className="text-surface-foreground opacity-[0.7]">
<div className="absolute inset-0 bg-black opacity-[0.8]">
```

Using the semantic tokens means that if the design team later decides disabled elements should be at 0.4 opacity instead of 0.5, a single change in the theme defaults updates every site.

### Gradient Patterns with Theme Colors

Tailwind's opacity modifier syntax (`/5`, `/10`, etc.) works with theme color tokens. This is the correct way to create subtle tinted backgrounds:

```tsx
// CORRECT - Brand-tinted gradient section
<section className="section-standard bg-gradient-to-b from-brand-primary/5 to-white">
  <h2 className="text-h2">Our Services</h2>
</section>

// CORRECT - Brand gradient for CTA sections
<section className="section-standard bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
  <h2 className="text-h2">Get a Free Quote</h2>
</section>
```

```tsx
// WRONG - Hardcoded gradient colors
<section className="bg-gradient-to-b from-[#3b82f6]/5 to-white">
<section className="bg-gradient-to-br from-[#db0b0b] to-[#b00909] text-white">
```

## Styling Workflow

When adding new styling:

1. **Check existing classes** - Search `globals.css` for similar patterns
2. **Propose new class** - If pattern will be reused, propose maintainable class name
3. **Add to globals.css** - Create the class with `@apply` Tailwind utilities
4. **Use consistently** - Apply the class across all relevant components
5. **Document** - Add to this standards document if it establishes a new pattern

## What NOT to Do

| Anti-Pattern                            | Why It Breaks White-Labeling        | Correct Approach                                           |
| --------------------------------------- | ----------------------------------- | ---------------------------------------------------------- |
| Hardcoded hex colors (`bg-[#005A9E]`)   | Not themeable, ignores theme config | Use theme tokens (`bg-brand-primary`)                      |
| Hardcoded Tailwind color scales (`text-gray-600`, `bg-blue-50`) | Bypass theme tokens, break re-theming | Use `text-surface-muted-foreground`, `bg-surface-muted`, etc. — caught by ESLint |
| Hardcoded RGBA (`bg-[rgba(0,0,0,0.8)]`) | Bypasses overlay tokens             | Use `bg-overlay-dark` or `bg-black/80`                     |
| Hardcoded HSL/HSLA values               | Still a literal color               | Use theme tokens                                           |
| `style={{}}` inline styles              | Bypasses Tailwind and theme system  | Use Tailwind utilities                                     |
| Duplicated utility strings              | Hard to maintain, inconsistent      | Extract to maintainable class                              |
| Custom CSS files per component          | Fragmented styling                  | Use `globals.css`                                          |
| styled-components / CSS-in-JS           | Different paradigm entirely         | Tailwind only                                              |
| `:root` overrides in CSS files          | Fragments the source of truth       | Define all values in `theme.config.ts`                     |
| Arbitrary opacity (`opacity-[0.7]`)     | Bypasses semantic opacity system    | Use `opacity-muted`, `opacity-disabled`, `opacity-overlay` |

## Automated Enforcement

The no-hardcoded-color rule is enforced automatically by a custom ESLint rule that runs as part of `pnpm lint`:

**Rule:** `platform/no-hardcoded-tailwind-colors`
**Location:** `tools/eslint/rules/no-hardcoded-tailwind-colors.mjs`
**Scope:** All `app/**/*.{ts,tsx}` and `components/**/*.{ts,tsx}` files in every client site

The rule catches hardcoded Tailwind color-scale classes in JSX `className` attributes — patterns like `text-gray-600`, `bg-blue-50`, `border-red-200` — and reports them as errors with a message directing to this document.

```tsx
// ESLint ERROR — will fail pnpm lint
<div className="text-gray-700">Hardcoded neutral</div>

// CORRECT — theme token
<div className="text-surface-foreground">Themed text</div>
```

**Intentional exceptions** (semantic callout colors, star ratings, form state feedback) use the standard ESLint escape hatch:

```tsx
{/* eslint-disable platform/no-hardcoded-tailwind-colors -- Intentional: semantic status callout */}
<div className="bg-green-50 border border-green-200">
  Success message
</div>
{/* eslint-enable platform/no-hardcoded-tailwind-colors */}
```

The rule covers string literals and template literal static parts. It does not flag dynamic template expressions like `` `${condition ? 'text-yellow-400' : ''}` `` (those are invisible to static analysis). Keep semantic coloring intentional, documented with a comment, and minimal.

## Verification Checklist

Before completing any styling work:

- [ ] No hardcoded hex colors (use `bg-brand-primary`, etc.)
- [ ] No hardcoded Tailwind color-scale classes (`text-gray-*`, `bg-blue-*`, etc.) — caught by ESLint
- [ ] No hardcoded RGBA/HSLA values (use overlay tokens or Tailwind opacity modifiers)
- [ ] No inline styles (`style={{}}`) anywhere except email templates
- [ ] No duplicated utility class strings (3+ uses = extract to class)
- [ ] New patterns added to globals.css with `@apply`
- [ ] All components in `/components/ui/`
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Email templates read colors from `themeConfig`, not hardcoded literals
- [ ] Overlay patterns use `bg-overlay-*` tokens or `bg-brand-primary` with Tailwind opacity
- [ ] Disabled/muted states use semantic opacity tokens (`opacity-disabled`, `opacity-muted`)

## Available Theme Tokens

| Category   | Tokens                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Brand      | `brand-primary`, `brand-primary-hover`, `brand-secondary`, `brand-accent`                                                      |
| Surface    | `surface-background`, `surface-foreground`, `surface-muted`, `surface-muted-foreground`, `surface-card`, `surface-card-border` |
| Semantic   | `semantic-success`, `semantic-warning`, `semantic-error`, `semantic-info`                                                      |
| Overlay    | `overlay-dark`, `overlay-light`, `overlay-primary`                                                                             |
| Opacity    | `opacity-disabled` (0.5), `opacity-muted` (0.7), `opacity-overlay` (0.8)                                                       |
| Typography | `text-hero`, `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-body`, `text-small`, `text-caption`                             |
| Transition | `transition-fast` (150ms), `transition-normal` (200ms), `transition-slow` (300ms)                                              |
| Navigation | `h-nav`, `pt-nav`, `mt-nav`                                                                                                    |

### Site-specific utility classes

Sites may define additional utility classes in their `globals.css` for patterns not covered by the shared theme. These follow the same `@apply` convention and must use theme tokens (no hardcoded values). Examples from DJ Fox Electrical:

| Class | Purpose |
|---|---|
| `.noise-overlay` | Adds a subtle SVG grain texture over flat/solid-colour sections to break digital flatness. Applied to dark CTA sections and stats strips. |
| `.stat-value` | Enables `font-variant-numeric: tabular-nums` for data values (stats, counts) so numbers align consistently. |
| `.location-pill` / `.location-pill-arrow` | Styled link pill for location grids — handles hover border, background tint, and arrow translation without inline JSX classes. |

See [Theming Guide](../guides/theming.md) for full token reference and configuration details.

## Related Standards

- [Theming Guide](../guides/theming.md) - Theme system configuration
- [Components](./components.md) - Component structure and organization
- [Quality](./quality.md) - Quality gates including styling checks

---

**Maintained By:** Digital Consulting Services
