# Theming Guide

**Version:** 1.0.0
**Last Updated:** 2025-12-21
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
    shadow: 'sm',           // none, sm, md, lg, xl
  },
  hero: {
    variant: 'centered',    // centered, split, image-bg
  },
  navigation: {
    style: 'solid',         // solid, transparent, gradient
  },
}
```

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
```

### Legacy Compatibility

For backward compatibility, these aliases are available:

```css
/* These map to brand-primary */
bg-brand-blue       → bg-brand-primary
text-brand-blue     → text-brand-primary
border-brand-blue   → border-brand-primary
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

## Best Practices

### DO

- Use semantic color tokens (`brand-primary`, not `blue-500`)
- Define all four brand colors for consistency
- Test color contrast for accessibility
- Keep component customizations minimal

### DON'T

- Don't use raw hex colors in components (use CSS variables)
- Don't override core-component styles directly
- Don't skip the theme.config.ts in new sites
- Don't use hardcoded colors that bypass the theme system

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
}
```

## Related

- [Adding a New Site](./adding-new-site.md) - Site creation workflow
- [Component Standards](../standards/components.md) - Component guidelines
- [Styling Standards](../standards/styling.md) - CSS and Tailwind rules

---

**Maintained By:** Digital Consulting Services
