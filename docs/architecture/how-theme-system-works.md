# How the Theme System Works

This document explains how a single `theme.config.ts` file re-brands an entire website. This is what makes the platform white-label.

## The Big Picture

Each site defines brand colors, typography, and component styles in one config file. The theme system transforms that config into CSS custom properties and Tailwind utility classes, so every component automatically uses the right colors without hardcoding anything.

```
theme.config.ts (your brand colors)
      ↓ deep merge with defaults
Complete ThemeConfig object
      ↓ generateCssVariables()
CSS custom properties (:root { --color-brand-primary: #3b82f6; })
      ↓ Tailwind plugin (addBase + addUtilities + theme.extend)
Utility classes: bg-brand-primary → var(--color-brand-primary)
      ↓ Component usage
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

The full `ThemeConfig` type covers: brand colors, surface colors, semantic colors, spacing scale, border radii, shadows, z-index layers, transitions, opacity levels, typography (font families, weights, and a complete type scale with size/line-height/letter-spacing/weight for hero, h1-h4, body, small, caption), and component tokens (button, card, hero, navigation, section).

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

// Input: config.components.button.borderRadius = '0.5rem'
// Output: { '--button-radius': '0.5rem' }
```

This generates ~100 CSS variables covering colors, spacing, typography, shadows, and component tokens.

### 4. Tailwind Plugin Injection

The plugin does three things:

**a) Injects variables into `:root`** via `addBase`:

```css
:root {
  --color-brand-primary: #3b82f6;
  --color-surface-foreground: #1f2937;
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
    },
    borderRadius: { button: 'var(--button-radius)', card: 'var(--card-radius)' },
    fontFamily: { sans: 'var(--font-family-sans)', heading: 'var(--font-family-heading)' },
  },
}
```

This means `hover:bg-brand-primary`, `md:text-h1`, and `rounded-button` all work out of the box.

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
- **Surface:** `bg-surface-background`, `bg-surface-muted`, `bg-surface-card`, `text-surface-foreground`, `text-surface-muted-foreground`
- **Semantic:** `bg-success`, `bg-warning`, `bg-error`, `text-success`, `text-error`

### Typography Scale

- `text-hero`, `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-body`, `text-small`, `text-caption`
- Each sets font-size, line-height, letter-spacing, and font-weight together

### Layout

- `rounded-button`, `rounded-card` — component-specific border radii
- `shadow-card` — component-specific shadow
- `h-nav`, `pt-nav` — navigation height utilities
- `p-xs` through `p-4xl` — theme spacing scale

### Transitions

- `transition-fast` (150ms), `transition-normal` (200ms), `transition-slow` (300ms)

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

## Changing a Site's Theme

1. Edit `theme.config.ts` — change colors, typography, or component tokens
2. Restart the dev server (Tailwind config changes aren't picked up by HMR)
3. Every component that uses theme tokens automatically reflects the new values

That's it. No component code changes. No CSS overrides. The entire site re-themes from one file.

## Why CSS Variables

CSS variables (not static Tailwind values) because:

- **Runtime themeable** — variables can be overridden with JavaScript for dark mode, user preferences, etc.
- **Single source of truth** — change the variable, every usage updates
- **DevTools friendly** — inspect any element and see which variable controls its color
- **White-label ready** — swap the entire brand identity by changing `:root` values

## File Structure

```
packages/theme-system/src/
├── index.ts              # Main exports (types, defaults, utilities)
├── types.ts              # ThemeConfig interface + Zod schema
├── defaults.ts           # Default values for every token
├── generate-css.ts       # Config → CSS variable map
├── tailwind-plugin.ts    # The Tailwind plugin (addBase + addUtilities + theme.extend)
├── utils.ts              # Deep merge, hex-to-RGB, contrast ratio, WCAG checks
└── cli/
    └── validate.ts       # CLI tool for contrast validation
```
