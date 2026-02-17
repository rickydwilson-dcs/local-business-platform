# Theming Guide

**Version:** 1.1.0
**Last Updated:** 2026-02-17
**Scope:** All sites in local-business-platform

---

## Overview

The Local Business Platform uses a centralized theme system (`@platform/theme-system`) to manage design tokens and generate CSS custom properties. This enables consistent branding across all sites while allowing each site to have its own unique look and feel.

## Architecture

```
packages/theme-system/     # Centralized theming package
├── src/
│   ├── types.ts          # ThemeConfig interface
│   ├── defaults.ts       # Default theme values
│   ├── tailwind-plugin.ts # Tailwind CSS plugin
│   ├── utils.ts          # CSS variable generation
│   └── validation.ts     # Zod schema validation
│
sites/[site-name]/
├── theme.config.ts       # Site-specific theme configuration
├── tailwind.config.ts    # Uses createThemePlugin(themeConfig)
└── site.config.ts        # Business information
```

## Quick Start

### For New Sites

When creating a new site with `create-site.ts`, the theme configuration is automatically set up. You just need to customize the colors:

1. Edit `theme.config.ts` with your brand colors
2. Run `pnpm dev` to see changes

### For Existing Sites

1. Add the theme-system dependency:

   ```json
   // package.json
   {
     "dependencies": {
       "@platform/theme-system": "workspace:*"
     }
   }
   ```

2. Create `theme.config.ts` (copy from base-template)
3. Update `tailwind.config.ts` to use the plugin

## Theme Configuration

### Basic Structure

```typescript
// theme.config.ts
import type { ThemeConfig } from "@platform/theme-system";

export const themeConfig: Partial<ThemeConfig> = {
  colors: {
    brand: {
      primary: "#3b82f6", // Main brand color
      primaryHover: "#2563eb", // Darker on hover
      secondary: "#1e40af", // Secondary elements
      accent: "#f59e0b", // Accent highlights
    },
    surface: {
      background: "#ffffff",
      foreground: "#1f2937",
      muted: "#f3f4f6",
      mutedForeground: "#6b7280",
      card: "#ffffff",
      cardBorder: "#e5e7eb",
    },
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    overlay: {
      dark: "rgba(0, 0, 0, 0.8)",
      light: "rgba(255, 255, 255, 0.8)",
      primary: "rgba(59, 130, 246, 0.8)", // Brand-tinted overlay
    },
  },

  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      heading: ["Inter", "system-ui", "sans-serif"],
    },
  },

  components: {
    button: {
      borderRadius: "0.5rem",
      fontWeight: 600,
    },
    card: {
      borderRadius: "1rem",
      shadow: "sm",
    },
    hero: {
      variant: "centered",
    },
    navigation: {
      style: "solid",
    },
  },
};
```

### Color System

#### Brand Colors

| Token          | Purpose            | Example Usage              |
| -------------- | ------------------ | -------------------------- |
| `primary`      | Main brand color   | Buttons, links, headings   |
| `primaryHover` | Hover state        | Button hover, link hover   |
| `secondary`    | Secondary elements | Secondary buttons, accents |
| `accent`       | Highlights         | Badges, alerts, CTAs       |

#### Surface Colors

| Token             | Purpose          | Example Usage          |
| ----------------- | ---------------- | ---------------------- |
| `background`      | Page background  | Body background        |
| `foreground`      | Main text color  | Body text              |
| `muted`           | Muted background | Cards, sections        |
| `mutedForeground` | Secondary text   | Descriptions, metadata |
| `card`            | Card background  | Card components        |
| `cardBorder`      | Card borders     | Card outlines          |

#### Semantic Colors

| Token     | Purpose        | Example Usage                |
| --------- | -------------- | ---------------------------- |
| `success` | Success states | Success messages, checkmarks |
| `warning` | Warning states | Warning alerts               |
| `error`   | Error states   | Error messages, validation   |
| `info`    | Info states    | Info alerts, tooltips        |

#### Overlay Colors

Overlay colors control the semi-transparent layers placed over background images in hero sections and image cards. They use `rgba()` values so the background image shows through at a controlled opacity.

| Token     | CSS Variable              | Purpose                                        |
| --------- | ------------------------- | ---------------------------------------------- |
| `dark`    | `--color-overlay-dark`    | Standard dark overlay for hero images          |
| `light`   | `--color-overlay-light`   | Light overlay for dark background images       |
| `primary` | `--color-overlay-primary` | Brand-tinted overlay for brand-forward designs |

See [Gradient Hero Overlays](#gradient-hero-overlays) below for full implementation details.

### Typography

```typescript
typography: {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    heading: ['Inter', 'system-ui', 'sans-serif'],
  },
  // Font sizes use defaults from theme-system
}
```

### Component Customization

```typescript
components: {
  button: {
    borderRadius: '0.5rem', // sm, md, lg, xl, or custom
    fontWeight: 600,        // 400, 500, 600, 700
  },
  card: {
    borderRadius: '1rem',
    shadow: 'sm',           // none, sm, md, lg
  },
  hero: {
    variant: 'centered',    // centered, split, fullscreen
  },
  navigation: {
    style: 'solid',         // solid, transparent, blur
  },
}
```

## Gradient Hero Overlays

Hero sections with background images need overlays to ensure text remains readable. The theme system provides three overlay color tokens that can be used in Tailwind gradient classes to create branded, consistent overlays across all pages.

### How Overlay Colors Work

Overlay colors are defined in `theme.config.ts` under `colors.overlay` using `rgba()` values. The theme system's Tailwind plugin converts these into CSS custom properties and registers them as Tailwind color utilities, so you can use them anywhere you would use a normal Tailwind color.

**Configuration in theme.config.ts:**

```typescript
colors: {
  overlay: {
    dark: 'rgba(0, 0, 0, 0.8)',          // Black at 80% opacity
    light: 'rgba(255, 255, 255, 0.8)',    // White at 80% opacity
    primary: 'rgba(219, 11, 11, 0.8)',    // Brand red at 80% (DJ Fox Electrical)
  }
}
```

**Generated CSS variables:**

```css
:root {
  --color-overlay-dark: rgba(0, 0, 0, 0.8);
  --color-overlay-light: rgba(255, 255, 255, 0.8);
  --color-overlay-primary: rgba(219, 11, 11, 0.8);
}
```

**Generated Tailwind utilities:**

```css
.bg-overlay-dark {
  background-color: var(--color-overlay-dark);
}
.bg-overlay-light {
  background-color: var(--color-overlay-light);
}
.bg-overlay-primary {
  background-color: var(--color-overlay-primary);
}
```

The overlay tokens are also registered in Tailwind's extended `colors` under the `overlay` key, which means Tailwind's opacity modifier syntax works out of the box: `bg-overlay-dark/50` applies the overlay color at 50% of its defined opacity.

### The Three Overlay Types

#### Dark Overlay

The most common choice. Places a black semi-transparent layer over the image so white text pops clearly against any photograph.

**When to use:** Most hero sections, service page headers, any image-backed section with white text.

```tsx
{
  /* Flat dark overlay */
}
<div className="absolute inset-0 bg-overlay-dark" aria-hidden="true" />;

{
  /* Gradient dark overlay (fades from bottom) */
}
<div
  className="absolute inset-0 bg-gradient-to-t from-overlay-dark via-overlay-dark/50 to-transparent"
  aria-hidden="true"
/>;
```

#### Light Overlay

Places a white semi-transparent layer over the image. Useful when the design calls for dark text on a lightened background image.

**When to use:** Sections with dark body text over images, testimonial backgrounds, subtle image sections where you want the image visible but muted.

```tsx
{
  /* Flat light overlay */
}
<div className="absolute inset-0 bg-overlay-light" aria-hidden="true" />;
```

#### Primary (Brand-Tinted) Overlay

Tints the image with the brand color. This creates a distinctive, branded look that ties hero imagery to the site identity. Particularly effective for hover states and accent sections.

**When to use:** Brand-forward hero sections, image card hover effects, accent landing pages, sections where you want the brand color to dominate the visual impression.

```tsx
{
  /* Brand-tinted overlay (e.g., red tint for DJ Fox Electrical) */
}
<div className="absolute inset-0 bg-overlay-primary" aria-hidden="true" />;
```

### Implementation Examples

#### Full-Width Hero with Gradient Overlay

This pattern uses a gradient that transitions from a solid overlay at the bottom (where text sits) to transparent at the top (where the image shows through). This is the recommended approach for most hero sections.

```tsx
<section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0 z-0">
    <Image
      src={getImageUrl(imageSrc)}
      alt={imageAlt}
      fill
      className="object-cover"
      priority
      sizes="100vw"
    />
  </div>

  {/* Gradient Overlay - dark at bottom, transparent at top */}
  <div
    className="absolute inset-0 z-10 bg-gradient-to-t from-overlay-dark via-overlay-dark/50 to-transparent"
    aria-hidden="true"
  />

  {/* Content sits above overlay */}
  <div className="relative z-20 container-standard py-16 text-center">
    <h1 className="text-5xl font-bold text-white">Page Title</h1>
    <p className="text-xl text-white/90 mt-4">Subtitle text here</p>
  </div>
</section>
```

#### Configurable Overlay Component

The `HeroWithImage` component in DJ Fox Electrical demonstrates a pattern for exposing overlay choice as a prop. The overlay classes map to combinations of the theme tokens and Tailwind opacity modifiers.

```tsx
// In the component
interface HeroWithImageProps {
  overlay?: "dark" | "darker" | "red";
  // ... other props
}

function HeroWithImage({ overlay = "dark", ...props }: HeroWithImageProps) {
  const overlayClasses = {
    dark: "bg-black/50", // 50% black - standard readability
    darker: "bg-black/70", // 70% black - high contrast for busy images
    red: "bg-brand-primary/30", // 30% brand color - subtle brand tint
  };

  return (
    <section className="relative min-h-[60vh] ...">
      {/* Background image */}
      <div className="absolute inset-0 z-0">...</div>

      {/* Overlay with configurable intensity */}
      <div className={`absolute inset-0 z-10 ${overlayClasses[overlay]}`} aria-hidden="true" />

      {/* Content above overlay */}
      <div className="relative z-20">...</div>
    </section>
  );
}
```

#### Image Card with Hover Overlay

Image cards often combine a persistent dark gradient overlay with a brand-colored hover overlay. This creates an interactive feel where the brand color reveals on mouse-over.

```tsx
<div className="group relative overflow-hidden rounded-xl">
  <Image src={...} alt={...} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />

  {/* Always-visible dark gradient (readable text at bottom) */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

  {/* Brand overlay revealed on hover */}
  <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-80 transition-opacity duration-300" />

  {/* Content stays above both overlays */}
  <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
    <h3 className="text-xl font-bold text-white">Card Title</h3>
  </div>
</div>
```

### Choosing Overlay Values

The `rgba()` opacity value in your theme config controls the baseline intensity. Here are recommended ranges:

| Overlay Use Case     | Recommended Opacity | Example                    |
| -------------------- | ------------------- | -------------------------- |
| Hero with large text | 0.5 - 0.7           | `rgba(0, 0, 0, 0.6)`       |
| Interior page hero   | 0.5 - 0.6           | `rgba(0, 0, 0, 0.6)`       |
| Image card gradient  | 0.7 - 0.9           | `rgba(0, 0, 0, 0.8)`       |
| Brand tint (subtle)  | 0.2 - 0.4           | `rgba(219, 11, 11, 0.3)`   |
| Brand tint (strong)  | 0.6 - 0.8           | `rgba(219, 11, 11, 0.8)`   |
| Light overlay        | 0.7 - 0.9           | `rgba(255, 255, 255, 0.8)` |

When creating the `primary` overlay value, use your brand's primary color converted to `rgba()` format. For DJ Fox Electrical with brand primary `#db0b0b`, the overlay becomes `rgba(219, 11, 11, 0.8)`.

### Z-Index Layering

Hero sections with overlays require careful z-index stacking so the image, overlay, and content layer correctly:

| Layer            | Z-Index | Purpose                           |
| ---------------- | ------- | --------------------------------- |
| Background image | `z-0`   | Base layer, fills the section     |
| Overlay          | `z-10`  | Semi-transparent layer over image |
| Content          | `z-20`  | Text, buttons, breadcrumbs on top |

Always include `aria-hidden="true"` on overlay divs since they are decorative and should be invisible to screen readers.

## Using Theme Tokens

### In Tailwind Classes

The theme system generates Tailwind utilities from CSS variables:

```jsx
// Brand colors
<button className="bg-brand-primary hover:bg-brand-primary-hover">
  Click me
</button>

// Surface colors
<div className="bg-surface-background text-surface-foreground">
  Content here
</div>

// Semantic colors
<span className="text-semantic-success">Success!</span>

// Overlay colors
<div className="bg-overlay-dark" aria-hidden="true" />
```

### Available Utility Classes

```css
/* Brand colors */
bg-brand-primary, text-brand-primary, border-brand-primary
bg-brand-primary-hover, text-brand-primary-hover
bg-brand-secondary, text-brand-secondary
bg-brand-accent, text-brand-accent

/* Surface colors */
bg-surface-background, bg-surface-muted, bg-surface-card
text-surface-foreground, text-surface-muted-foreground
border-surface-card-border

/* Semantic colors */
bg-semantic-success, text-semantic-success
bg-semantic-warning, text-semantic-warning
bg-semantic-error, text-semantic-error
bg-semantic-info, text-semantic-info

/* Overlay colors */
bg-overlay-dark, bg-overlay-light, bg-overlay-primary
```

## Tailwind Configuration

Your `tailwind.config.ts` should use the theme plugin:

```typescript
import type { Config } from "tailwindcss";
import { createThemePlugin } from "@platform/theme-system/plugin";
import { themeConfig } from "./theme.config";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
    "../../packages/core-components/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Additional customizations here
    },
  },
  plugins: [typography, createThemePlugin(themeConfig)],
};

export default config;
```

## Validation

### WCAG Contrast Checking

The theme system validates color contrast ratios for WCAG AA compliance:

```bash
# From packages/theme-system
pnpm validate --config ../../sites/[site-name]/theme.config.ts
```

### TypeScript Validation

Theme configs are validated at build time using Zod schemas:

```typescript
import { themeConfigSchema } from "@platform/theme-system";

// Will throw if invalid
const validated = themeConfigSchema.parse(themeConfig);
```

Note that overlay colors are validated with the regex pattern `/^rgba?\(/` -- they must be `rgb()` or `rgba()` values, not hex colors.

## Best Practices

### DO

- Use semantic color tokens (`brand-primary`, not `blue-500`)
- Define all four brand colors for consistency
- Define all three overlay colors matching your brand palette
- Test color contrast for accessibility
- Keep component customizations minimal
- Use `aria-hidden="true"` on overlay divs

### DON'T

- Don't use raw hex colors in components (use CSS variables)
- Don't override core-component styles directly
- Don't skip the theme.config.ts in new sites
- Don't use hardcoded colors that bypass the theme system
- Don't use hex colors for overlay values (use `rgba()` format)

### ESLint Enforcement

The platform includes ESLint rules to prevent raw hex colors:

```javascript
// Bad - will trigger ESLint warning
className = "bg-[#3b82f6]";

// Good - uses theme token
className = "bg-brand-primary";
```

## Troubleshooting

### Colors Not Applying

1. Verify `theme.config.ts` exports `themeConfig`
2. Check `tailwind.config.ts` uses `createThemePlugin(themeConfig)`
3. Restart dev server after config changes
4. Check browser devtools for CSS variable values

### Overlay Not Visible

1. Verify the overlay div has a z-index between the image and content (`z-10` is standard)
2. Check that the parent section has `position: relative` and `overflow: hidden`
3. Ensure the overlay div uses `absolute inset-0` to cover the full area
4. Inspect the CSS variable value in devtools -- the `rgba()` alpha channel controls visibility

### TypeScript Errors

Ensure path aliases are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@platform/theme-system": ["../../packages/theme-system/src/index.ts"],
      "@platform/theme-system/*": ["../../packages/theme-system/src/*"]
    }
  }
}
```

### Build Failures

Run the theme-system build first:

```bash
# From monorepo root
pnpm build --filter=@platform/theme-system
```

## Examples

### Colossus Scaffolding (Blue)

```typescript
colors: {
  brand: {
    primary: '#005A9E',
    primaryHover: '#004d87',
    secondary: '#0066b5',
    accent: '#f59e0b',
  },
  overlay: {
    dark: 'rgba(0, 0, 0, 0.8)',
    light: 'rgba(255, 255, 255, 0.8)',
    primary: 'rgba(0, 90, 158, 0.8)', // Blue brand tint
  },
}
```

### DJ Fox Electrical (Red)

```typescript
colors: {
  brand: {
    primary: '#db0b0b',
    primaryHover: '#ba0909',
    secondary: '#b00909',
    accent: '#fbbf24',
  },
  overlay: {
    dark: 'rgba(0, 0, 0, 0.8)',
    light: 'rgba(255, 255, 255, 0.8)',
    primary: 'rgba(219, 11, 11, 0.8)', // Red brand tint
  },
}
```

### Professional Services (Green)

```typescript
colors: {
  brand: {
    primary: '#059669',
    primaryHover: '#047857',
    secondary: '#10b981',
    accent: '#f59e0b',
  },
  overlay: {
    dark: 'rgba(0, 0, 0, 0.8)',
    light: 'rgba(255, 255, 255, 0.8)',
    primary: 'rgba(5, 150, 105, 0.8)', // Green brand tint
  },
}
```

### Creative Agency (Purple)

```typescript
colors: {
  brand: {
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
  },
  overlay: {
    dark: 'rgba(0, 0, 0, 0.8)',
    light: 'rgba(255, 255, 255, 0.8)',
    primary: 'rgba(124, 58, 237, 0.8)', // Purple brand tint
  },
}
```

## Related

- [Adding a New Site](./adding-new-site.md) - Site creation workflow
- [Component Standards](../standards/components.md) - Component guidelines
- [Styling Standards](../standards/styling.md) - CSS and Tailwind rules

---

**Maintained By:** Digital Consulting Services
