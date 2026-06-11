# How the Theme System Works

> **Scope note (April 2026):** The shared-theme model described in this document — where sites import `Header`, `Footer`, and page templates from `@platform/themes/[name]/*` — is currently in use only by `dj-fox-electrical` (orion) and `colossus-scaffolding` (vega). `base-template`, `dcs`, and `mad-graphics` have migrated to a **self-contained architecture**: each of those sites owns its own header, footer, page components, and theme CSS, with zero imports from `@platform/themes/*`. The `theme.config.ts` → CSS variables → Tailwind utility pipeline described below still applies to self-contained sites; only the shared component packages differ.

This document explains how a single `theme.config.ts` file re-brands an entire website. This is what makes the platform white-label.

## The Big Picture

Each site defines brand colors, typography, and component styles in one config file. The theme system transforms that config into CSS custom properties and Tailwind utility classes, so every component automatically uses the right colors without hardcoding anything.

```
theme.config.ts (your brand colors)
      | deep merge with defaults
Complete ThemeConfig object
      | generateCssVariables()
CSS custom properties (:root { --color-brand-primary: #3b82f6; })
      | Tailwind plugin (addBase + addUtilities + theme.extend)
Utility classes: bg-brand-primary -> var(--color-brand-primary)
      | Component usage
<button className="bg-brand-primary"> resolves to background-color: #3b82f6
```

## Step by Step

### 1. Site Defines a Partial Config

Each site only specifies what it wants to override. Everything else uses defaults.

```typescript
// sites/my-site/theme.config.ts
import type { DeepPartialThemeConfig } from "@platform/theme-system";

export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#3b82f6", // Only override what's different
      primaryHover: "#2563eb",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
    },
  },
  components: {
    button: { borderRadius: "0.5rem" },
  },
};
```

The full `ThemeConfig` type covers: brand colors, surface colors, semantic colors, overlay colors, spacing scale, border radii, shadows, z-index layers, transitions, opacity levels, typography (font families, weights, and a complete type scale with size/line-height/letter-spacing/weight for hero, h1-h4, body, small, caption), and component tokens (button, card, hero, navigation, section).

### 2. Deep Merge with Defaults

The theme system merges your partial config with `defaults.ts` so every token has a value:

```typescript
// Inside the plugin
const config = deepMerge(defaultTheme, userConfig);
// Result: complete ThemeConfig with your overrides applied
```

### 3. CSS Variable Generation

`generateCssVariables()` transforms the merged config into a flat map of CSS custom properties:

```typescript
// Input: config.colors.brand.primary = '#3b82f6'
// Output: { '--color-brand-primary': '#3b82f6' }

// Input: config.typography.fontFamily.sans = ['Inter', 'system-ui']
// Output: { '--font-family-sans': 'Inter, system-ui' }

// Input: config.typography.scale.h1 = { size: '2.25rem', lineHeight: '1.2', ... }
// Output: { '--text-h1-size': '2.25rem', '--text-h1-line-height': '1.2', ... }

// Input: config.colors.overlay.dark = 'rgba(0, 0, 0, 0.8)'
// Output: { '--color-overlay-dark': 'rgba(0, 0, 0, 0.8)' }

// Input: config.opacity.disabled = 0.5
// Output: { '--opacity-disabled': '0.5' }

// Input: config.components.button.borderRadius = '0.5rem'
// Output: { '--button-radius': '0.5rem' }
```

This generates ~100 CSS variables covering colors, overlays, opacity, spacing, typography, shadows, and component tokens.

### 4. Tailwind Plugin Injection

The plugin does three things:

**a) Injects variables into `:root`** via `addBase`:

```css
:root {
  --color-brand-primary: #3b82f6;
  --color-surface-foreground: #1f2937;
  --color-overlay-dark: rgba(0, 0, 0, 0.8);
  --color-overlay-light: rgba(255, 255, 255, 0.8);
  --color-overlay-primary: rgba(59, 130, 246, 0.8);
  --opacity-disabled: 0.5;
  --opacity-muted: 0.7;
  --opacity-overlay: 0.8;
  --font-family-sans: Inter, system-ui, sans-serif;
  --text-h1-size: 2.25rem;
  --button-radius: 0.5rem;
  /* ~100 more variables */
}
```

**b) Creates utility classes** via `addUtilities`:

```css
.bg-brand-primary {
  background-color: var(--color-brand-primary);
}
.text-surface-foreground {
  color: var(--color-surface-foreground);
}
.bg-overlay-dark {
  background-color: var(--color-overlay-dark);
}
.bg-overlay-light {
  background-color: var(--color-overlay-light);
}
.bg-overlay-primary {
  background-color: var(--color-overlay-primary);
}
.opacity-disabled {
  opacity: var(--opacity-disabled);
}
.opacity-muted {
  opacity: var(--opacity-muted);
}
.opacity-overlay {
  opacity: var(--opacity-overlay);
}
.text-h1 {
  font-size: var(--text-h1-size);
  line-height: var(--text-h1-line-height);
  letter-spacing: var(--text-h1-letter-spacing);
  font-weight: var(--text-h1-weight);
}
.transition-fast {
  transition-duration: 150ms;
}
.h-nav {
  height: var(--nav-height);
}
```

**c) Extends Tailwind's theme** so standard modifiers work:

```typescript
theme: {
  extend: {
    colors: {
      brand: { primary: 'var(--color-brand-primary)' },
      surface: { foreground: 'var(--color-surface-foreground)' },
      overlay: {
        dark: 'var(--color-overlay-dark)',
        light: 'var(--color-overlay-light)',
        primary: 'var(--color-overlay-primary)',
      },
    },
    opacity: {
      disabled: 'var(--opacity-disabled)',
      muted: 'var(--opacity-muted)',
      overlay: 'var(--opacity-overlay)',
    },
    borderRadius: { button: 'var(--button-radius)', card: 'var(--card-radius)' },
    fontFamily: { sans: 'var(--font-family-sans)', heading: 'var(--font-family-heading)' },
  },
}
```

This means `hover:bg-brand-primary`, `md:text-h1`, `rounded-button`, and `hover:bg-overlay-dark` all work out of the box.

### 5. Site Wires It Up

Each site's `tailwind.config.ts` imports the plugin and passes its config:

```typescript
// sites/my-site/tailwind.config.ts
import { createThemePlugin } from "@platform/theme-system/plugin";
import { themeConfig } from "./theme.config";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/core-components/src/**/*.{ts,tsx}", // Scan shared components too
  ],
  plugins: [createThemePlugin(themeConfig)],
};
```

## Available Utility Classes

### Colors

- **Brand:** `bg-brand-primary`, `bg-brand-secondary`, `bg-brand-accent`, `text-brand-primary`, `border-brand-primary`
- **Surface:** `bg-surface-background`, `bg-surface-muted`, `bg-surface-card`, `bg-surface-subtle`, `text-surface-foreground`, `text-surface-secondary-foreground`, `text-surface-tertiary-foreground`, `text-surface-muted-foreground`, `border-surface-card-border`, `border-surface-subtle-border`, `bg-surface-inverse`, `text-surface-inverse-muted-foreground`
- **Semantic:** `bg-success`, `bg-warning`, `bg-error`, `bg-info`, `text-success`, `text-error`, `text-info`

### Typography Scale

- `text-hero`, `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-body`, `text-small`, `text-caption`
- Each sets font-size, line-height, letter-spacing, and font-weight together

### Layout

- `rounded-button`, `rounded-card` -- component-specific border radii
- `shadow-card` -- component-specific shadow
- `h-nav`, `pt-nav`, `mt-nav` -- navigation height utilities
- `p-xs` through `p-4xl` -- theme spacing scale

### Transitions

- `transition-fast` (150ms), `transition-normal` (200ms), `transition-slow` (300ms)

## Opacity Utilities

The theme system provides three opacity utility classes for common UI patterns. Each maps to a CSS variable, so the values are configurable per site through `theme.config.ts`.

| Utility            | CSS Variable         | Default | Purpose                                                |
| ------------------ | -------------------- | ------- | ------------------------------------------------------ |
| `opacity-disabled` | `--opacity-disabled` | 0.5     | Disabled interactive elements (buttons, inputs, links) |
| `opacity-muted`    | `--opacity-muted`    | 0.7     | De-emphasized secondary content                        |
| `opacity-overlay`  | `--opacity-overlay`  | 0.8     | Darkening overlays on images and backgrounds           |

### How They Work

The utilities set the CSS `opacity` property using theme-controlled CSS variables:

```css
.opacity-disabled {
  opacity: var(--opacity-disabled);
} /* 0.5 */
.opacity-muted {
  opacity: var(--opacity-muted);
} /* 0.7 */
.opacity-overlay {
  opacity: var(--opacity-overlay);
} /* 0.8 */
```

Because the plugin also extends Tailwind's `opacity` theme key, you can use them with Tailwind's arbitrary property syntax and modifiers:

```html
<!-- Direct utility class -->
<button className="opacity-disabled cursor-not-allowed" disabled>Submit</button>

<!-- De-emphasize secondary text -->
<p className="opacity-muted text-body">Last updated 3 days ago</p>

<!-- Responsive and state modifiers work -->
<div className="opacity-muted hover:opacity-100 transition-fast">Hover to reveal</div>
```

### When to Use Each Level

**`opacity-disabled` (0.5)** -- Apply to elements that are visually present but not interactive. Buttons with a `disabled` attribute, form fields that are locked, or actions that require a prerequisite step.

**`opacity-muted` (0.7)** -- Apply to content that is secondary to the primary focus. Timestamps, helper text, metadata labels, or decorative elements that should recede without disappearing.

**`opacity-overlay` (0.8)** -- Apply to overlay layers that need to obscure background content while remaining semi-transparent. This is typically used on a positioned element sitting on top of an image or background, not on the content itself. See the Overlay Colors section below for the recommended approach to overlays.

### Overriding Defaults

Override any opacity value in your site's `theme.config.ts`:

```typescript
export const themeConfig: DeepPartialThemeConfig = {
  opacity: {
    disabled: 0.4, // More faded disabled state
    overlay: 0.85, // Slightly more opaque overlays
  },
};
```

## Overlay Colors

Overlays are semi-transparent color layers placed between background content (images, gradients, video) and foreground content (text, buttons). They solve a fundamental problem in web design: making text readable over unpredictable background images.

The theme system provides three overlay color tokens as `rgba()` values with built-in transparency, so you apply them as a `background-color` rather than layering opacity on top of a solid color.

### The Three Overlay Types

```typescript
// In ThemeConfig.colors.overlay
overlay: {
  /** Dark overlay -- black with 80% opacity */
  dark: "rgba(0, 0, 0, 0.8)",
  /** Light overlay -- white with 80% opacity */
  light: "rgba(255, 255, 255, 0.8)",
  /** Brand-tinted overlay -- brand primary color with 80% opacity */
  primary: "rgba(59, 130, 246, 0.8)",
}
```

**`dark`** -- A semi-transparent black layer. Use this when you need to place light-colored text over a bright or colorful background image. This is the most common overlay type, used on hero sections, banner images, and fullscreen backgrounds.

**`light`** -- A semi-transparent white layer. Use this when you need dark text readable over a dark background image, or to create a frosted-glass effect over content.

**`primary`** -- A semi-transparent brand color layer. Use this for brand-forward designs where overlays should carry the brand identity. Creates a tinted glass effect using the site's primary color.

### How Overlay Colors Differ from Opacity Utilities

Overlay colors and opacity utilities solve related but different problems:

- **Overlay colors** (`bg-overlay-dark`) set the `background-color` of an element to a semi-transparent `rgba()` value. The element itself remains fully opaque -- only its background is transparent. Child content (text, buttons) renders at full visibility.

- **Opacity utilities** (`opacity-overlay`) set the `opacity` of the entire element, including all its children. Everything inside becomes semi-transparent.

For overlays with readable content on top, always use overlay colors, not opacity utilities.

### Usage in Components

Overlays are typically applied to an absolutely-positioned element that sits between a background image and foreground text:

```tsx
{
  /* Hero section with dark overlay for text readability */
}
<section className="relative">
  {/* Background image */}
  <Image src={heroImage} alt="" fill className="object-cover" />

  {/* Dark overlay -- bg-overlay-dark is rgba(0,0,0,0.8) */}
  <div className="absolute inset-0 bg-overlay-dark" />

  {/* Content sits above the overlay, fully readable */}
  <div className="relative z-10 text-white text-hero">Professional Electrical Services</div>
</section>;
```

```tsx
{/* Modal backdrop */}
<div className="fixed inset-0 z-modal bg-overlay-dark" onClick={onClose} />
<div className="fixed inset-0 z-modal flex items-center justify-center pointer-events-none">
  <div className="bg-surface-card rounded-card p-lg pointer-events-auto">
    {/* Modal content */}
  </div>
</div>
```

```tsx
{
  /* Brand-tinted card hover effect */
}
<div className="group relative overflow-hidden rounded-card">
  <Image src={projectImage} alt="Project" fill className="object-cover" />
  <div className="absolute inset-0 bg-overlay-primary opacity-0 group-hover:opacity-100 transition-normal" />
  <div className="relative z-10 p-lg text-white">
    <h3 className="text-h3">View Project</h3>
  </div>
</div>;
```

### Configuring Overlay Colors Per Site

Each site customizes overlay colors in `theme.config.ts`. The `primary` overlay should use the site's brand color with an appropriate alpha channel:

```typescript
// sites/dj-fox-electrical/theme.config.ts
export const themeConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "#db0b0b", // Brand red
    },
    overlay: {
      dark: "rgba(0, 0, 0, 0.8)",
      light: "rgba(255, 255, 255, 0.8)",
      primary: "rgba(219, 11, 11, 0.8)", // Brand red with 80% opacity
    },
  },
};
```

The overlay values are validated by the Zod schema to ensure they are valid `rgb()` or `rgba()` color strings. Unlike brand and surface colors (which must be hex), overlay colors must be `rgba()` because they encode transparency directly in the color value.

### Using Overlays with Tailwind Modifiers

Because overlay colors are registered in Tailwind's `theme.extend.colors`, standard Tailwind modifiers work:

```html
<!-- Show overlay only on hover -->
<div className="bg-transparent hover:bg-overlay-dark transition-normal" />

<!-- Different overlay at different breakpoints -->
<div className="bg-overlay-light md:bg-overlay-dark" />

<!-- Combine with Tailwind's built-in opacity modifier -->
<div className="bg-overlay-dark/50" />
```

### Common Overlay Use Cases

| Use Case                   | Recommended Overlay  | Why                                                                                              |
| -------------------------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| Hero image with white text | `bg-overlay-dark`    | Darkens the image so light text is readable                                                      |
| Modal/dialog backdrop      | `bg-overlay-dark`    | Dims page content to focus attention on the modal                                                |
| Lightbox background        | `bg-overlay-dark`    | Near-black background for image viewing                                                          |
| Card hover reveal          | `bg-overlay-primary` | Brand-colored tint adds visual interest on interaction                                           |
| Frosted content panel      | `bg-overlay-light`   | Lightens content beneath while maintaining context                                               |
| Brand-forward hero         | `bg-overlay-primary` | Tints hero image with brand color identity                                                       |
| Flat CTA / stats sections  | `.noise-overlay`     | SVG grain texture breaks digital flatness on solid-colour backgrounds without adding real images |

## WCAG Contrast Validation

The theme system includes a CLI validator that checks color contrast ratios:

```bash
# From packages/theme-system
pnpm validate --config ../../sites/my-site/theme.config.ts
```

This checks:

- Brand primary against white (buttons must be readable)
- Surface foreground against background (body text)
- Muted foreground against background
- All semantic colors against their backgrounds

Contrast ratios must meet WCAG AA: 4.5:1 for normal text, 3:1 for large text.

## Named Themes

Beyond CSS variables, the platform has named visual identities — **cygnus**, **orion**, **solaris**, and **vega** — each packaged in `packages/themes/`.

### What a Named Theme Provides

- **CSS utilities** (`packages/themes/orion/globals.css`, `packages/themes/vega/globals.css`) — pre-written component classes (`btn-primary`, `card-interactive`, `mobile-menu-overlay`, `lightbox-content`, etc.) written as plain CSS with `@apply`. Each site's `globals.css` imports its theme's CSS before the `@tailwind` directives.
- **`ComponentRegistry`** — a TypeScript object exported from the theme package (`orionRegistry`, `vegaRegistry`, `cygnusRegistry`) that maps `heroVariant`, `headerVariant`, `cardVariant`, and `sectionVariant` slots to concrete component names. Sites include this in `theme.config.ts` under `componentRegistry`. For cygnus sites, `heroVariant: "image-overlay"` is now consumed at runtime — page components import `cygnusRegistry` directly and conditionally render `ImageOverlayHero` from `@platform/core-components` when the variant matches.
- **Structural components** (`packages/themes/[name]/components/`) — theme-specific `Header` and `Footer` React Server Components exported via a `/components` subpath. Sites import these directly into `app/layout.tsx` rather than using the generic `SiteHeader`/`Footer` from core-components. This is what gives each theme its distinct navigation and footer treatment — the visual identity is owned by the theme package, not by the consuming site. **orion**, **vega**, **cygnus**, and **solaris** all ship Header/Footer components via this pattern.

### Available Themes

| Theme       | Visual Identity                                                                      | Components      |
| ----------- | ------------------------------------------------------------------------------------ | --------------- |
| **orion**   | Dark header, full-bleed hero, red brand accent, circular icon cards, dark stat cards | Header + Footer |
| **vega**    | Light header, split hero, standard card grid, clean typography                       | Header + Footer |
| **cygnus**  | Dark mode, Press-Black background, Signal Orange + Craft Green, bold graphic-led     | Header + Footer |
| **solaris** | Soft blue-white background, sky blue + chartreuse accent, geometric hero shapes      | Header + Footer |

### Wiring It Up

```typescript
// sites/my-site/app/globals.css
@import "../../../packages/themes/orion/globals.css";
@tailwind base;
@tailwind components;
@tailwind utilities;

// sites/my-site/theme.config.ts
import { orionRegistry } from "@platform/themes/orion";
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: orionRegistry,
  colors: { ... },
};

// sites/my-site/app/layout.tsx
import { ThemeProvider, PageShell } from "@platform/core-components";
import { orionRegistry } from "@platform/themes/orion";
import { OrionHeader, OrionFooter } from "@platform/themes/orion/components";
// ...
<ThemeProvider theme="orion" registry={orionRegistry}>
  <PageShell
    header={<OrionHeader siteName={...} navigation={...} locations={...} />}
    footer={<OrionFooter siteName={...} services={...} locations={...} />}
  >
    {children}
  </PageShell>
</ThemeProvider>
```

The `Header` and `Footer` exports are props-based Server Components — `layout.tsx` fetches site-specific data (services, locations, contact info) and passes it as props. The theme package owns the visual treatment; the site owns the data.

### Page Templates

Themes that ship Header/Footer components also export **page layout templates** from `packages/themes/[name]/pages/`. These are props-based Server Components that own the visual layout of a full page — hero, content sections, sidebars, CTAs — without touching metadata, schema, or data fetching.

**What belongs where:**

| Concern                                                | Lives in                                         |
| ------------------------------------------------------ | ------------------------------------------------ |
| Visual layout (hero, sections, CTAs)                   | Theme template (`packages/themes/[name]/pages/`) |
| `generateMetadata()`                                   | Site `page.tsx` wrapper                          |
| `generateStaticParams()`                               | Site `page.tsx` wrapper                          |
| JSON-LD schema (`<script type="application/ld+json">`) | Site `page.tsx` wrapper                          |
| Data fetching (`getService()`, `getLocation()`)        | Site `page.tsx` wrapper                          |

**How thin wrappers work:** Each site's `page.tsx` imports the theme template, fetches content, builds a props object, and renders:

```typescript
// sites/my-site/app/services/[slug]/page.tsx
import { VegaServicePage } from '@platform/themes/vega/pages';

export default async function ServicePage({ params }) {
  const service = await getService(params.slug);
  const siteConfig = getSiteConfigSummary();
  return <VegaServicePage service={service} siteConfig={siteConfig} />;
}
```

**`SiteConfigSummary`** — a minimal type from `@platform/core-components` (defined in `packages/core-components/src/lib/page-template-types.ts`) that passes brand-relevant site config (name, phone, email, serviceAreas) to templates without exposing the full `SiteConfig` object. All `*PageTemplateProps` interfaces are defined in the same file.

The themes that currently export page templates: **vega**, **cygnus**, **orion**, and **solaris**.

### AI Theme Generation

`tools/generate-theme-from-reference.ts` generates a complete `theme.config.ts` from a URL or image — it extracts brand colors, classifies the layout pattern (orion vs vega) using Claude Haiku, and injects the appropriate `componentRegistry`. `tools/apply-theme.ts` switches a site between named themes (updates both `globals.css` import and `theme.config.ts` registry).

## Changing a Site's Theme

1. Edit `theme.config.ts` -- change colors, typography, or component tokens
2. Restart the dev server (Tailwind config changes aren't picked up by HMR)
3. Every component that uses theme tokens automatically reflects the new values

That's it. No component code changes. No CSS overrides. The entire site re-themes from one file.

## Why CSS Variables

CSS variables (not static Tailwind values) because:

- **Runtime themeable** -- variables can be overridden with JavaScript for dark mode, user preferences, etc.
- **Single source of truth** -- change the variable, every usage updates
- **DevTools friendly** -- inspect any element and see which variable controls its color
- **White-label ready** -- swap the entire brand identity by changing `:root` values

## Component Contract

Every theme's `globals.css` should define the CSS utility classes consumed by composable section components. This is the **Theme Component Contract** — an architectural convention that ensures composition sites render consistently across all themes.

The contract defines 10 classes across buttons (`btn-primary`, `btn-secondary`, `btn-tertiary`, `btn-on-brand-primary`, `btn-on-brand-primary-outline`), sections (`section-dark-accent`), overlays (`noise-overlay`), and utilities (`stat-value`, `location-pill`, `location-pill-arrow`). Each theme implements them with its own visual identity.

> **Note (April 2026):** The CI enforcement script (`pnpm validate:theme-contract`) was retired when the platform pivoted to self-contained sites. `packages/theme-system/src/component-contract.ts` is retained as a reference catalog only. Self-contained sites own their `globals.css` directly and are responsible for defining these classes.

See [Theme Component Contract](../standards/theme-component-contract.md) for the full spec, per-theme implementation notes, and templates for new themes.

## File Structure

```
packages/theme-system/src/
├── index.ts              # Main exports (types, defaults, utilities)
├── types.ts              # ThemeConfig interface + Zod schema
├── defaults.ts           # Default values for every token
├── generate-css.ts       # Config -> CSS variable map
├── tailwind-plugin.ts    # The Tailwind plugin (addBase + addUtilities + theme.extend)
├── theme-names.ts        # Constellation namespace — pool of approved theme names
├── theme-registry.ts     # Runtime registry for theme auto-discovery
├── component-contract.ts # Theme Component Contract — required CSS classes
├── utils.ts              # Deep merge, hex-to-RGB, contrast ratio, WCAG checks
└── cli/
    └── validate.ts       # CLI tool for contrast validation
```
