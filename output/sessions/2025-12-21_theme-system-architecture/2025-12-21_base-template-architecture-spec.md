# Base Template & Theme System Architecture Specification

**Version:** 1.1
**Date:** 2025-12-21
**Status:** Draft - Updated with Codex Feedback
**Author:** Architecture Planning Session

---

## Changelog

| Version | Date       | Changes                                                                                                                                                             |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1     | 2025-12-21 | Addressed Codex feedback: expanded token system, font handling, validation CLI, component override pattern, content ownership, security baseline, fallback handling |
| 1.0     | 2025-12-21 | Initial draft                                                                                                                                                       |

---

## 1. Executive Summary

### Problem Statement

The Local Business Platform monorepo currently uses `colossus-reference` as both a **live production website** AND the **template for creating new sites**. This creates several issues:

1. **Role conflict**: Production site changes risk breaking template patterns
2. **No theming abstraction**: Colors/fonts hardcoded in Tailwind config and CSS
3. **Component duplication**: Sites copy components instead of importing shared ones
4. **Scattered configuration**: Business metadata spread across 3+ files per site

### Solution

Create a **base-template site** that:

- Is NOT deployed publicly (internal gold standard only)
- Contains all platform standards and functionality
- Uses a **design token system** for visual customization
- Serves as the CI canary (breaks first if core changes have issues)
- Acts as the source for creating new sites

---

## 2. Requirements

### Functional Requirements

| ID    | Requirement                                                                             | Priority |
| ----- | --------------------------------------------------------------------------------------- | -------- |
| FR-1  | Base template must be a fully buildable, testable Next.js site                          | Must     |
| FR-2  | Each site must define its visual identity in a single `theme.config.ts` file            | Must     |
| FR-3  | Changing theme config must update all component appearances without code changes        | Must     |
| FR-4  | Updates to core-components must automatically propagate to all sites                    | Must     |
| FR-5  | Base template must contain generic content (not business-specific)                      | Must     |
| FR-6  | Sites must be able to override individual components if needed                          | Should   |
| FR-7  | Theme config must support component-level styling variants                              | Should   |
| FR-8  | Sites must be able to shadow/override core components via local `components/` directory | Should   |
| FR-9  | Theme system must validate tokens and warn on missing values                            | Should   |
| FR-10 | Contact form must ship with rate-limiting and spam protection by default                | Must     |

### Non-Functional Requirements

| ID    | Requirement                                                             | Priority |
| ----- | ----------------------------------------------------------------------- | -------- |
| NFR-1 | Base template CI build must complete in < 3 minutes                     | Should   |
| NFR-2 | New site creation from template must take < 30 minutes                  | Should   |
| NFR-3 | No visual regression on colossus-reference after migration              | Must     |
| NFR-4 | CSS custom properties must have 95%+ browser support                    | Must     |
| NFR-5 | Self-hosted fonts must use `font-display: swap` and preload hints       | Should   |
| NFR-6 | WCAG AA contrast ratios must be validated for brand/surface color pairs | Should   |

---

## 2.1 Scope and Deferrals

### In Scope (Phase 1)

- Light mode theming only
- Comprehensive token system (colors, spacing, typography, shadows, radii, transitions, z-index)
- Self-hosted font pipeline with preload
- Component override/shadowing pattern
- Theme validation CLI
- Security baseline for contact form

### Deferred to Phase 2

- Dark mode / multi-mode theming (schema designed to be extendable)
- Multi-brand support (out of scope, but schema allows extension)
- Visual Regression Testing in CI (manual review for now)

---

## 3. Architecture Design

### 3.1 Package Structure

```
local-business-platform/
├── packages/
│   ├── core-components/        # Shared React components
│   │   └── src/
│   │       ├── components/     # UI components (theme-agnostic)
│   │       └── lib/            # Shared utilities
│   │
│   └── theme-system/           # NEW PACKAGE
│       └── src/
│           ├── index.ts        # Main exports
│           ├── types.ts        # ThemeConfig interface
│           ├── generate-css.ts # Config → CSS variables
│           ├── tailwind-plugin.ts # Tailwind integration
│           └── defaults.ts     # Default theme values
│
├── sites/
│   ├── base-template/          # NEW SITE (internal only)
│   │   ├── app/                # Next.js app directory
│   │   ├── content/            # Generic MDX content
│   │   ├── theme.config.ts     # Design tokens
│   │   └── site.config.ts      # Business configuration
│   │
│   ├── colossus-reference/     # Production site (migrated)
│   └── joes-plumbing-canterbury/
```

### 3.2 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        BUILD TIME                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  theme.config.ts ──► theme-system ──► CSS Custom Properties     │
│       │                   │                    │                 │
│       │                   ▼                    ▼                 │
│       │           Tailwind Plugin        :root { ... }          │
│       │                   │                    │                 │
│       ▼                   ▼                    ▼                 │
│  TypeScript Types   Utility Classes      globals.css            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        RUNTIME                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  React Component                                                 │
│       │                                                          │
│       ▼                                                          │
│  className="bg-brand-primary"                                    │
│       │                                                          │
│       ▼                                                          │
│  Tailwind resolves to: background-color: var(--color-brand-primary)
│       │                                                          │
│       ▼                                                          │
│  Browser reads CSS variable from :root                           │
│       │                                                          │
│       ▼                                                          │
│  Rendered with site's brand color                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Theme System Specification

### 4.1 ThemeConfig Interface (Comprehensive)

```typescript
// packages/theme-system/src/types.ts

export interface ThemeConfig {
  /**
   * Brand and surface colors
   */
  colors: {
    brand: {
      /** Primary brand color (buttons, links, accents) */
      primary: string;
      /** Hover state for primary color */
      primaryHover: string;
      /** Secondary brand color */
      secondary: string;
      /** Accent color for highlights */
      accent: string;
    };
    surface: {
      /** Page background color */
      background: string;
      /** Primary text color */
      foreground: string;
      /** Muted/secondary backgrounds */
      muted: string;
      /** Muted text color */
      mutedForeground: string;
      /** Card background */
      card: string;
      /** Card border */
      cardBorder: string;
    };
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };

  /**
   * Spacing scale (used for padding, margin, gap)
   * Values in rem units
   */
  spacing: {
    xs: string; // 0.25rem (4px)
    sm: string; // 0.5rem (8px)
    md: string; // 1rem (16px)
    lg: string; // 1.5rem (24px)
    xl: string; // 2rem (32px)
    "2xl": string; // 3rem (48px)
    "3xl": string; // 4rem (64px)
    "4xl": string; // 6rem (96px)
  };

  /**
   * Border radius scale
   */
  radii: {
    none: string; // 0
    sm: string; // 0.25rem
    md: string; // 0.5rem
    lg: string; // 1rem
    xl: string; // 1.5rem
    full: string; // 9999px
  };

  /**
   * Shadow scale
   */
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  /**
   * Z-index scale
   */
  zIndex: {
    dropdown: number; // 1000
    sticky: number; // 1100
    modal: number; // 1200
    popover: number; // 1300
    tooltip: number; // 1400
  };

  /**
   * Transition/animation tokens
   */
  transitions: {
    fast: string; // 150ms ease
    normal: string; // 200ms ease
    slow: string; // 300ms ease
    timing: {
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };

  /**
   * Opacity scale
   */
  opacity: {
    disabled: number; // 0.5
    muted: number; // 0.7
    overlay: number; // 0.8
  };

  /**
   * Typography settings (comprehensive)
   */
  typography: {
    /** Font families */
    fontFamily: {
      /** Body text font stack */
      sans: string[];
      /** Heading font stack (optional, defaults to sans) */
      heading?: string[];
      /** Monospace font stack */
      mono?: string[];
    };
    /** Font weights */
    fontWeight: {
      normal: number; // 400
      medium: number; // 500
      semibold: number; // 600
      bold: number; // 700
    };
    /** Type scale - each includes size, lineHeight, letterSpacing */
    scale: {
      hero: { size: string; lineHeight: string; letterSpacing: string; weight: number };
      h1: { size: string; lineHeight: string; letterSpacing: string; weight: number };
      h2: { size: string; lineHeight: string; letterSpacing: string; weight: number };
      h3: { size: string; lineHeight: string; letterSpacing: string; weight: number };
      h4: { size: string; lineHeight: string; letterSpacing: string; weight: number };
      body: { size: string; lineHeight: string; letterSpacing: string; weight: number };
      small: { size: string; lineHeight: string; letterSpacing: string; weight: number };
      caption: { size: string; lineHeight: string; letterSpacing: string; weight: number };
    };
  };

  /**
   * Font configuration for self-hosted fonts
   */
  fonts: {
    /** Font files to preload */
    preload: Array<{
      family: string;
      src: string; // Path to font file
      weight: number;
      style: "normal" | "italic";
      display: "swap" | "block" | "fallback" | "optional";
    }>;
  };

  /**
   * Component-specific styling
   */
  components: {
    button: {
      /** Border radius for buttons */
      borderRadius: string;
      /** Padding x */
      paddingX: string;
      /** Padding y */
      paddingY: string;
    };
    card: {
      /** Border radius for cards */
      borderRadius: string;
      /** Shadow intensity */
      shadow: "none" | "sm" | "md" | "lg";
      /** Padding */
      padding: string;
    };
    hero: {
      /** Hero layout variant */
      variant: "centered" | "split" | "fullscreen";
      /** Minimum height */
      minHeight: string;
    };
    navigation: {
      /** Header style */
      style: "transparent" | "solid" | "blur";
      /** Header height */
      height: string;
    };
    section: {
      /** Standard section padding y */
      paddingY: string;
      /** Compact section padding y */
      paddingYCompact: string;
    };
  };
}
```

### 4.1.1 Default Values and Fallbacks

The theme system must merge user config with defaults and warn on missing tokens:

```typescript
// packages/theme-system/src/defaults.ts
export const defaultTheme: ThemeConfig = {
  colors: {
    brand: {
      primary: "#3b82f6",
      primaryHover: "#2563eb",
      secondary: "#1e40af",
      accent: "#f59e0b",
    },
    surface: {
      background: "#ffffff",
      foreground: "#111827",
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
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "6rem",
  },
  radii: {
    none: "0",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400,
  },
  transitions: {
    fast: "150ms ease",
    normal: "200ms ease",
    slow: "300ms ease",
    timing: {
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
    },
  },
  opacity: {
    disabled: 0.5,
    muted: 0.7,
    overlay: 0.8,
  },
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      heading: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "Consolas", "monospace"],
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    scale: {
      hero: { size: "3.75rem", lineHeight: "1.1", letterSpacing: "-0.02em", weight: 700 },
      h1: { size: "2.25rem", lineHeight: "1.2", letterSpacing: "-0.01em", weight: 700 },
      h2: { size: "1.875rem", lineHeight: "1.3", letterSpacing: "-0.01em", weight: 600 },
      h3: { size: "1.5rem", lineHeight: "1.4", letterSpacing: "0", weight: 600 },
      h4: { size: "1.25rem", lineHeight: "1.4", letterSpacing: "0", weight: 600 },
      body: { size: "1rem", lineHeight: "1.6", letterSpacing: "0", weight: 400 },
      small: { size: "0.875rem", lineHeight: "1.5", letterSpacing: "0", weight: 400 },
      caption: { size: "0.75rem", lineHeight: "1.4", letterSpacing: "0.01em", weight: 400 },
    },
  },
  fonts: {
    preload: [],
  },
  components: {
    button: { borderRadius: "0.5rem", paddingX: "1.5rem", paddingY: "0.75rem" },
    card: { borderRadius: "1rem", shadow: "sm", padding: "1.5rem" },
    hero: { variant: "centered", minHeight: "80vh" },
    navigation: { style: "solid", height: "4rem" },
    section: { paddingY: "5rem", paddingYCompact: "3rem" },
  },
};
```

### 4.2 CSS Variable Mapping (Complete)

#### Colors

| Theme Config Path                | CSS Variable                       | Tailwind Class                                                   |
| -------------------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| `colors.brand.primary`           | `--color-brand-primary`            | `bg-brand-primary`, `text-brand-primary`, `border-brand-primary` |
| `colors.brand.primaryHover`      | `--color-brand-primary-hover`      | `hover:bg-brand-primary-hover`                                   |
| `colors.brand.secondary`         | `--color-brand-secondary`          | `bg-brand-secondary`, `text-brand-secondary`                     |
| `colors.brand.accent`            | `--color-brand-accent`             | `bg-brand-accent`, `text-brand-accent`                           |
| `colors.surface.background`      | `--color-surface-background`       | `bg-surface-background`                                          |
| `colors.surface.foreground`      | `--color-surface-foreground`       | `text-surface-foreground`                                        |
| `colors.surface.muted`           | `--color-surface-muted`            | `bg-surface-muted`                                               |
| `colors.surface.mutedForeground` | `--color-surface-muted-foreground` | `text-surface-muted-foreground`                                  |
| `colors.surface.card`            | `--color-surface-card`             | `bg-surface-card`                                                |
| `colors.surface.cardBorder`      | `--color-surface-card-border`      | `border-surface-card-border`                                     |
| `colors.semantic.success`        | `--color-success`                  | `bg-success`, `text-success`                                     |
| `colors.semantic.warning`        | `--color-warning`                  | `bg-warning`, `text-warning`                                     |
| `colors.semantic.error`          | `--color-error`                    | `bg-error`, `text-error`                                         |
| `colors.semantic.info`           | `--color-info`                     | `bg-info`, `text-info`                                           |

#### Spacing

| Theme Config Path | CSS Variable    | Tailwind Class              |
| ----------------- | --------------- | --------------------------- |
| `spacing.xs`      | `--spacing-xs`  | `p-xs`, `m-xs`, `gap-xs`    |
| `spacing.sm`      | `--spacing-sm`  | `p-sm`, `m-sm`, `gap-sm`    |
| `spacing.md`      | `--spacing-md`  | `p-md`, `m-md`, `gap-md`    |
| `spacing.lg`      | `--spacing-lg`  | `p-lg`, `m-lg`, `gap-lg`    |
| `spacing.xl`      | `--spacing-xl`  | `p-xl`, `m-xl`, `gap-xl`    |
| `spacing.2xl`     | `--spacing-2xl` | `p-2xl`, `m-2xl`, `gap-2xl` |
| `spacing.3xl`     | `--spacing-3xl` | `p-3xl`, `m-3xl`, `gap-3xl` |
| `spacing.4xl`     | `--spacing-4xl` | `p-4xl`, `m-4xl`, `gap-4xl` |

#### Radii, Shadows, Transitions

| Theme Config Path    | CSS Variable          | Tailwind Class      |
| -------------------- | --------------------- | ------------------- |
| `radii.sm`           | `--radius-sm`         | `rounded-sm`        |
| `radii.md`           | `--radius-md`         | `rounded-md`        |
| `radii.lg`           | `--radius-lg`         | `rounded-lg`        |
| `radii.xl`           | `--radius-xl`         | `rounded-xl`        |
| `radii.full`         | `--radius-full`       | `rounded-full`      |
| `shadows.sm`         | `--shadow-sm`         | `shadow-sm`         |
| `shadows.md`         | `--shadow-md`         | `shadow-md`         |
| `shadows.lg`         | `--shadow-lg`         | `shadow-lg`         |
| `shadows.xl`         | `--shadow-xl`         | `shadow-xl`         |
| `transitions.fast`   | `--transition-fast`   | `transition-fast`   |
| `transitions.normal` | `--transition-normal` | `transition-normal` |
| `transitions.slow`   | `--transition-slow`   | `transition-slow`   |

#### Typography

| Theme Config Path               | CSS Variable            | Tailwind Class |
| ------------------------------- | ----------------------- | -------------- |
| `typography.fontFamily.sans`    | `--font-family-sans`    | `font-sans`    |
| `typography.fontFamily.heading` | `--font-family-heading` | `font-heading` |
| `typography.fontFamily.mono`    | `--font-family-mono`    | `font-mono`    |
| `typography.scale.hero.size`    | `--text-hero-size`      | `text-hero`    |
| `typography.scale.h1.size`      | `--text-h1-size`        | `text-h1`      |
| `typography.scale.h2.size`      | `--text-h2-size`        | `text-h2`      |
| `typography.scale.body.size`    | `--text-body-size`      | `text-body`    |

#### Component Tokens

| Theme Config Path                | CSS Variable          | Tailwind Class               |
| -------------------------------- | --------------------- | ---------------------------- |
| `components.button.borderRadius` | `--button-radius`     | Used in `.btn-*` classes     |
| `components.button.paddingX`     | `--button-padding-x`  | Used in `.btn-*` classes     |
| `components.button.paddingY`     | `--button-padding-y`  | Used in `.btn-*` classes     |
| `components.card.borderRadius`   | `--card-radius`       | Used in `.card-*` classes    |
| `components.card.padding`        | `--card-padding`      | Used in `.card-*` classes    |
| `components.navigation.height`   | `--nav-height`        | `h-nav`                      |
| `components.section.paddingY`    | `--section-padding-y` | Used in `.section-*` classes |

### 4.2.1 ESLint Rule: No Raw Hex Colors

To prevent regression, add an ESLint rule that forbids raw hex colors in core-components:

```javascript
// packages/core-components/.eslintrc.js
module.exports = {
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
        message:
          "Raw hex colors are forbidden. Use CSS variables via Tailwind classes (e.g., bg-brand-primary) or theme tokens.",
      },
      {
        selector: "TemplateElement[value.raw=/^#[0-9a-fA-F]{3,8}$/]",
        message: "Raw hex colors are forbidden in template literals.",
      },
    ],
  },
};
```

This rule catches:

- `color: '#005A9E'` ❌
- `className="text-[#005A9E]"` ❌ (arbitrary Tailwind values)
- `className="bg-brand-primary"` ✓

### 4.3 Generated CSS Output

```css
/* Generated from theme.config.ts */
:root {
  /* Brand Colors */
  --color-brand-primary: #005a9e;
  --color-brand-primary-hover: #004d87;
  --color-brand-secondary: #1e3a5f;
  --color-brand-accent: #f59e0b;

  /* Surface Colors */
  --color-surface-background: #ffffff;
  --color-surface-foreground: #111827;
  --color-surface-muted: #f3f4f6;
  --color-surface-muted-foreground: #6b7280;

  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Typography */
  --font-family-sans: "GeistSans", "Arial", "Helvetica", sans-serif;
  --font-family-heading: var(--font-family-sans);

  /* Component Tokens */
  --button-radius: 0.5rem;
  --card-radius: 1rem;
  --card-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

### 4.4 Tailwind Plugin Implementation

```typescript
// packages/theme-system/src/tailwind-plugin.ts
import plugin from "tailwindcss/plugin";
import type { ThemeConfig } from "./types";

export function createThemePlugin(config: ThemeConfig) {
  return plugin(
    ({ addBase, addUtilities }) => {
      // Inject CSS variables into :root
      addBase({
        ":root": generateCssVariables(config),
      });

      // Add semantic color utilities that reference CSS vars
      addUtilities({
        ".bg-brand-primary": {
          backgroundColor: "var(--color-brand-primary)",
        },
        ".bg-brand-primary-hover": {
          backgroundColor: "var(--color-brand-primary-hover)",
        },
        ".text-brand-primary": {
          color: "var(--color-brand-primary)",
        },
        // ... more utilities
      });
    },
    {
      // Extend Tailwind theme with CSS variable references
      theme: {
        extend: {
          colors: {
            brand: {
              primary: "var(--color-brand-primary)",
              "primary-hover": "var(--color-brand-primary-hover)",
              secondary: "var(--color-brand-secondary)",
              accent: "var(--color-brand-accent)",
            },
            surface: {
              background: "var(--color-surface-background)",
              foreground: "var(--color-surface-foreground)",
              muted: "var(--color-surface-muted)",
            },
          },
          fontFamily: {
            sans: "var(--font-family-sans)",
            heading: "var(--font-family-heading)",
          },
          borderRadius: {
            button: "var(--button-radius)",
            card: "var(--card-radius)",
          },
        },
      },
    }
  );
}
```

---

## 4.5 Theme Validation CLI

A CLI tool to validate theme configurations:

```typescript
// packages/theme-system/src/cli/validate.ts

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateTheme(config: ThemeConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Type validation (via Zod schema)
  const parseResult = ThemeConfigSchema.safeParse(config);
  if (!parseResult.success) {
    errors.push(...parseResult.error.errors.map((e) => e.message));
  }

  // 2. WCAG AA contrast checks for key color pairs
  const contrastPairs = [
    ["colors.brand.primary", "white", 4.5], // Text on primary button
    ["colors.surface.foreground", "colors.surface.background", 4.5], // Body text
    ["colors.surface.mutedForeground", "colors.surface.background", 4.5], // Muted text
    ["colors.surface.mutedForeground", "colors.surface.muted", 4.5], // Muted text on muted bg
  ];

  for (const [fg, bg, minRatio] of contrastPairs) {
    const ratio = calculateContrastRatio(getColor(config, fg), getColor(config, bg));
    if (ratio < minRatio) {
      warnings.push(
        `Contrast ratio ${fg}/${bg} is ${ratio.toFixed(2)}, minimum ${minRatio} required for WCAG AA`
      );
    }
  }

  // 3. Missing token warnings (compared to defaults)
  const missingTokens = findMissingTokens(config, defaultTheme);
  for (const token of missingTokens) {
    warnings.push(`Missing token: ${token} - using default value`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
```

**CLI Usage:**

```bash
# Validate a theme config
pnpm theme-system validate ./theme.config.ts

# Output:
# ✓ Theme configuration is valid
# ⚠ Warning: Contrast ratio colors.brand.primary/white is 3.8, minimum 4.5 required
# ⚠ Warning: Missing token: typography.fontFamily.mono - using default value
```

---

## 4.6 Component Override/Shadowing Pattern

Sites can override core components by placing files in their local `components/` directory. The import alias resolution order is:

```
1. sites/[site]/components/ui/[component].tsx  (site-specific override)
2. @platform/core-components/src/components/ui/[component].tsx  (core)
```

**Implementation via tsconfig.json paths:**

```json
// sites/[site]/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/components/*": ["./components/*"],
      "@platform/core-components": ["../../packages/core-components/src/index.ts"],
      "@platform/core-components/*": ["../../packages/core-components/src/*"]
    }
  }
}
```

**Override Example:**

To override the `Footer` component for a specific site:

```typescript
// sites/colossus-reference/components/ui/footer.tsx
// This file shadows @platform/core-components/src/components/ui/footer.tsx

import { Footer as CoreFooter, FooterProps } from '@platform/core-components';

export function Footer(props: FooterProps) {
  // Extend or completely replace the core footer
  return (
    <CoreFooter
      {...props}
      // Add site-specific customizations
      showCertifications={true}
      customLinks={[...]}
    />
  );
}
```

**Rules:**

1. Override files must export the same interface as the core component
2. Overrides should extend, not duplicate (import core and wrap)
3. Document all overrides in site README
4. Lint rule warns when override diverges significantly from core

---

## 4.7 Content Ownership Rules

**Principle: MDX frontmatter is the source of truth for page-specific data.**

| Data Type                               | Location          | Rationale                 |
| --------------------------------------- | ----------------- | ------------------------- |
| Page title, description, keywords       | MDX frontmatter   | Page-specific SEO         |
| Hero content (heading, subheading, CTA) | MDX frontmatter   | Page-specific             |
| FAQs                                    | MDX frontmatter   | Page-specific content     |
| Business name, phone, email             | `site.config.ts`  | Global, used across pages |
| Opening hours, address                  | `site.config.ts`  | Global business info      |
| Service areas                           | `site.config.ts`  | Used in multiple places   |
| Theme/styling                           | `theme.config.ts` | Visual configuration      |

**site.config.ts provides:**

- Global defaults that MDX can reference via `{{business.phone}}`
- Schema.org structured data generation
- Navigation/footer business info

**MDX frontmatter provides:**

- All page-specific SEO (title, description, keywords)
- All page-specific content (hero, FAQs, body)
- No duplication of business info (reference site.config instead)

**Anti-drift rule:**

- Never put page-specific SEO in site.config.ts
- Never hardcode business info in MDX (use template variables)

---

## 4.8 Security Baseline

### Contact Form Requirements

All contact forms must ship with these security measures by default:

```typescript
// lib/contact-form.ts

interface ContactFormConfig {
  // Rate limiting (required)
  rateLimit: {
    enabled: boolean; // Default: true
    maxRequests: number; // Default: 5
    windowMs: number; // Default: 60000 (1 minute)
    provider: "upstash" | "memory";
  };

  // Spam protection (required)
  spam: {
    honeypot: boolean; // Default: true (hidden field)
    turnstile?: {
      // Optional Cloudflare Turnstile
      siteKey: string;
      secretKey: string;
    };
  };

  // Consent (required for GDPR)
  consent: {
    required: boolean; // Default: true
    text: string; // Checkbox label text
    privacyPolicyUrl: string;
  };
}
```

### Required Environment Variables

```bash
# Contact form (required if contactForm feature enabled)
RESEND_API_KEY=             # Email sending
KV_REST_API_URL=            # Upstash Redis for rate limiting
KV_REST_API_TOKEN=          # Upstash Redis token

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=
NEXT_PUBLIC_GOOGLE_ADS_CUSTOMER_ID=

# Feature flags
NEXT_PUBLIC_FEATURE_CONSENT_BANNER=true
NEXT_PUBLIC_FEATURE_ANALYTICS_ENABLED=false  # Default off for base-template
```

### Validation Checklist

The theme validation CLI should also check:

- [ ] Rate limit config present if contact form enabled
- [ ] RESEND_API_KEY env var documented
- [ ] Consent checkbox enabled by default
- [ ] Honeypot field present in form

---

## 5. Base Template Specification

### 5.1 Directory Structure

```
sites/base-template/
├── app/
│   ├── layout.tsx              # Root layout with analytics, header, footer
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Imports theme CSS, minimal overrides
│   ├── services/
│   │   ├── page.tsx            # Services listing
│   │   └── [slug]/
│   │       └── page.tsx        # Dynamic service page
│   ├── locations/
│   │   ├── page.tsx            # Locations listing
│   │   └── [slug]/
│   │       └── page.tsx        # Dynamic location page
│   ├── contact/
│   │   └── page.tsx            # Contact form
│   ├── about/
│   │   └── page.tsx            # About page
│   └── (legal)/
│       ├── privacy-policy/page.tsx
│       └── cookie-policy/page.tsx
│
├── content/
│   ├── services/               # 5 generic service MDX files
│   │   ├── primary-service.mdx
│   │   ├── secondary-service.mdx
│   │   ├── service-three.mdx
│   │   ├── service-four.mdx
│   │   └── service-five.mdx
│   └── locations/              # 3 generic location MDX files
│       ├── main-area.mdx
│       ├── north-region.mdx
│       └── south-region.mdx
│
├── components/                 # Site-specific overrides (minimal)
│   └── .gitkeep
│
├── lib/
│   ├── content.ts              # MDX utilities (re-export from core)
│   └── schema.ts               # Schema generation
│
├── public/
│   └── images/                 # Generic placeholder images
│
├── theme.config.ts             # Default/neutral design tokens
├── site.config.ts              # Generic business configuration
├── tailwind.config.ts          # Imports theme-system plugin
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### 5.2 Default Theme Configuration

```typescript
// sites/base-template/theme.config.ts
import type { ThemeConfig } from "@platform/theme-system";

export const themeConfig: ThemeConfig = {
  colors: {
    brand: {
      primary: "#3b82f6", // Neutral blue
      primaryHover: "#2563eb",
      secondary: "#1e40af",
      accent: "#f59e0b", // Amber accent
    },
    surface: {
      background: "#ffffff",
      foreground: "#111827",
      muted: "#f3f4f6",
      mutedForeground: "#6b7280",
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
    },
  },
  components: {
    button: {
      borderRadius: "0.5rem",
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

### 5.3 Site Configuration

```typescript
// sites/base-template/site.config.ts
export interface SiteConfig {
  // Site identity
  name: string;
  tagline: string;
  url: string;

  // Business information
  business: {
    name: string;
    legalName: string;
    type: string; // Schema.org type
    phone: string;
    email: string;
    address: {
      street: string;
      locality: string;
      region: string;
      postalCode: string;
      country: string;
    };
    geo?: {
      latitude: string;
      longitude: string;
    };
    openingHours: Array<{
      days: string[];
      opens: string;
      closes: string;
    }>;
  };

  // Services
  services: {
    primary: string[];
    serviceArea: string[];
  };

  // Social links
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };

  // Feature flags
  features: {
    analytics: boolean;
    consentBanner: boolean;
    contactForm: boolean;
    rateLimit: boolean;
  };

  // Analytics IDs (from env vars)
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    googleAdsId?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Base Template Site",
  tagline: "Professional Local Services",
  url: "http://localhost:3000",

  business: {
    name: "Your Business Name",
    legalName: "Your Business Ltd",
    type: "LocalBusiness",
    phone: "+44 1234 567890",
    email: "info@example.com",
    address: {
      street: "123 Main Street",
      locality: "City Center",
      region: "County",
      postalCode: "AB1 2CD",
      country: "GB",
    },
    openingHours: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
  },

  services: {
    primary: ["Primary Service", "Secondary Service", "Service Three"],
    serviceArea: ["Main Area", "North Region", "South Region"],
  },

  features: {
    analytics: false, // Disabled for base template
    consentBanner: false,
    contactForm: true,
    rateLimit: false,
  },
};
```

### 5.4 Generic Content Examples

**Service MDX** (`content/services/primary-service.mdx`):

```yaml
---
title: "Primary Service"
seoTitle: "Primary Service | Your Business Name"
description: "Professional primary service solutions for residential and commercial clients. Quality workmanship with competitive pricing."
keywords:
  - primary service
  - professional service
  - local business
hero:
  heading: "Professional Primary Service"
  subheading: "Expert solutions tailored to your needs"
  image: "/images/services/primary-service-hero.jpg"
  cta:
    label: "Get a Quote"
    href: "/contact"
about:
  whatIs: "Our primary service provides comprehensive solutions for your needs. We use industry-leading techniques and equipment to deliver exceptional results."
  whenNeeded:
    - "When you need professional assistance"
    - "For scheduled maintenance"
    - "Emergency situations"
  whatAchieve:
    - "High-quality results"
    - "Cost-effective solutions"
    - "Peace of mind"
faqs:
  - question: "What areas do you serve?"
    answer: "We serve the Main Area and surrounding regions including North Region and South Region."
  - question: "Do you offer free quotes?"
    answer: "Yes, we provide free no-obligation quotes for all our services."
  - question: "Are you fully insured?"
    answer: "Yes, we carry comprehensive public liability insurance for your protection."
---
## About Our Primary Service

We are committed to delivering exceptional primary service solutions...
```

---

## 6. Component Migration Specification

### 6.1 Before/After Examples

**Button Component - Before:**

```tsx
// Uses hardcoded Tailwind color
<button className="bg-brand-blue hover:bg-brand-blue-hover text-white rounded-lg px-6 py-3">
  {children}
</button>
```

**Button Component - After:**

```tsx
// Uses CSS variable via Tailwind
<button className="bg-brand-primary hover:bg-brand-primary-hover text-white rounded-button px-6 py-3">
  {children}
</button>
```

**Hero Section - Before:**

```tsx
<section className="bg-gradient-to-r from-brand-blue to-brand-blue-light">
  <h1 className="text-white">{title}</h1>
</section>
```

**Hero Section - After:**

```tsx
<section className="bg-gradient-to-r from-brand-primary to-brand-secondary">
  <h1 className="text-white">{title}</h1>
</section>
```

### 6.2 globals.css Migration

**Before:**

```css
.btn-primary {
  @apply inline-flex items-center justify-center px-6 py-3
    bg-brand-blue text-white font-semibold rounded-lg
    transition-all duration-200 hover:bg-brand-blue-hover;
}
```

**After:**

```css
.btn-primary {
  @apply inline-flex items-center justify-center px-6 py-3
    bg-brand-primary text-white font-semibold rounded-button
    transition-all duration-200 hover:bg-brand-primary-hover;
}
```

### 6.3 Components to Migrate

| Component    | File Path                                             | Changes Required                       |
| ------------ | ----------------------------------------------------- | -------------------------------------- |
| HeroSection  | `core-components/src/components/ui/hero-section.tsx`  | Replace `brand-blue` → `brand-primary` |
| CTASection   | `core-components/src/components/ui/cta-section.tsx`   | Replace color classes                  |
| Footer       | `core-components/src/components/ui/footer.tsx`        | Replace color classes                  |
| ServiceCards | `core-components/src/components/ui/service-cards.tsx` | Replace color classes                  |
| HeroV1       | `core-components/src/components/hero/HeroV1.tsx`      | Replace color classes                  |
| HeroV2       | `core-components/src/components/hero/HeroV2.tsx`      | Replace color classes                  |
| HeroV3       | `core-components/src/components/hero/HeroV3.tsx`      | Replace color classes                  |

---

## 7. CI/CD Integration

### 7.1 Build Order

```yaml
# turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    }
  },
  "pipeline": {
    "@platform/theme-system#build": {},
    "@platform/core-components#build": {
      "dependsOn": ["@platform/theme-system#build"]
    },
    "base-template#build": {
      "dependsOn": ["@platform/core-components#build"]
    },
    "colossus-reference#build": {
      "dependsOn": ["base-template#build"]  // Canary must pass first
    }
  }
}
```

### 7.2 Test Strategy

```yaml
# CI Pipeline
jobs:
  build-and-test:
    steps:
      - name: Build theme-system
        run: pnpm --filter @platform/theme-system build

      - name: Build core-components
        run: pnpm --filter @platform/core-components build

      - name: Build base-template (CANARY)
        run: pnpm --filter base-template build

      - name: Test base-template (CANARY)
        run: pnpm --filter base-template test

      - name: E2E base-template (CANARY)
        run: pnpm --filter base-template test:e2e

      # Only runs if canary passes
      - name: Build all sites
        run: pnpm build

      - name: Smoke test all sites
        run: pnpm test:e2e:smoke
```

---

## 8. Migration Plan

### Phase 1: Foundation (Days 1-3)

1. Create `packages/theme-system/` with types and plugin
2. Add unit tests for CSS variable generation
3. Update `pnpm-workspace.yaml` to include new package

### Phase 2: Base Template (Days 4-6)

1. Create `sites/base-template/` directory structure
2. Copy app structure from colossus-reference
3. Replace content with generic placeholders
4. Create theme.config.ts and site.config.ts
5. Add full test suite

### Phase 3: Component Migration (Days 7-10)

1. Update core-components to use CSS variables
2. Update globals.css patterns
3. Verify no visual regression in base-template

### Phase 4: Colossus Migration (Days 11-14)

1. Add theme.config.ts to colossus-reference
2. Update tailwind.config.ts to use plugin
3. Deploy to staging, run visual regression tests
4. Deploy to production

### Phase 5: Tooling & Documentation (Days 15-17)

1. Update tools/create-site.ts to use base-template
2. Write theming documentation
3. Update architecture docs

---

## 9. Validation Checklist

Before implementation is considered complete:

- [ ] `packages/theme-system` builds without errors
- [ ] Theme plugin generates correct CSS variables
- [ ] `sites/base-template` builds and starts dev server
- [ ] All 5 service pages render correctly
- [ ] All 3 location pages render correctly
- [ ] Contact form works
- [ ] Changing theme.config.ts colors updates all components
- [ ] `colossus-reference` looks identical after migration
- [ ] CI pipeline runs base-template as canary
- [ ] `tools/create-site.ts` copies from base-template
- [ ] Documentation is updated

---

## 10. Appendix: File Inventory

### New Files to Create

| File                                           | Lines (Est.) | Purpose                |
| ---------------------------------------------- | ------------ | ---------------------- |
| `packages/theme-system/package.json`           | 25           | Package manifest       |
| `packages/theme-system/tsconfig.json`          | 15           | TypeScript config      |
| `packages/theme-system/src/index.ts`           | 10           | Main exports           |
| `packages/theme-system/src/types.ts`           | 80           | ThemeConfig interface  |
| `packages/theme-system/src/generate-css.ts`    | 100          | CSS variable generator |
| `packages/theme-system/src/tailwind-plugin.ts` | 150          | Tailwind plugin        |
| `packages/theme-system/src/defaults.ts`        | 50           | Default values         |
| `sites/base-template/theme.config.ts`          | 60           | Default theme          |
| `sites/base-template/site.config.ts`           | 80           | Business config        |
| `sites/base-template/content/services/*.mdx`   | 5×100        | Generic services       |
| `sites/base-template/content/locations/*.mdx`  | 3×80         | Generic locations      |

### Files to Modify

| File                                               | Changes                   |
| -------------------------------------------------- | ------------------------- |
| `pnpm-workspace.yaml`                              | Add theme-system package  |
| `turbo.json`                                       | Update build dependencies |
| `packages/core-components/src/components/ui/*.tsx` | CSS variable colors       |
| `sites/colossus-reference/tailwind.config.ts`      | Use theme plugin          |
| `sites/colossus-reference/app/globals.css`         | CSS variable references   |
| `tools/create-site.ts`                             | Copy from base-template   |

---

## IMPLEMENTATION PLAN

### Pre-Implementation: Git Setup

```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/architecture-update
```

All work happens on `feature/architecture-update`, then follows standard flow: `develop → staging → main`

---

### Execution Strategy: Parallel Sub-Agents

This plan will be executed using **parallel background sub-agents** where tasks are independent. Each agent operates with its own context.

#### Agent Assignment

| Phase | Agent Type              | Task                                             | Can Parallel?       |
| ----- | ----------------------- | ------------------------------------------------ | ------------------- |
| 1     | `cs-fullstack-engineer` | Create `packages/theme-system/`                  | Yes                 |
| 2     | `cs-fullstack-engineer` | Create `sites/base-template/` structure          | Yes (after Phase 1) |
| 3     | `cs-frontend-engineer`  | Update core-components to CSS vars               | Yes (after Phase 1) |
| 4     | `cs-frontend-engineer`  | Migrate colossus-reference theme                 | After 2,3           |
| 5     | `cs-devops-engineer`    | Update CI/CD (turbo.json, build order)           | Yes                 |
| 6     | `cs-qa-engineer`        | Add ESLint rule + validation tests               | Yes (after Phase 1) |
| 7     | `cs-technical-writer`   | Documentation (theming guide, content ownership) | After all           |

#### Parallel Execution Windows

**Window 1** (can run simultaneously):

- `cs-fullstack-engineer`: theme-system package
- `cs-devops-engineer`: CI/CD updates

**Window 2** (after theme-system exists):

- `cs-fullstack-engineer`: base-template site
- `cs-frontend-engineer`: core-components CSS vars
- `cs-qa-engineer`: ESLint + validation

**Window 3** (after Window 2):

- `cs-frontend-engineer`: colossus-reference migration
- Middleware cleanup

**Window 4** (final):

- `cs-technical-writer`: Documentation
- Integration testing

---

### Implementation Order (Parallelized)

#### Step 0: Git Setup

```bash
git checkout develop && git pull origin develop
git checkout -b feature/architecture-update
```

#### Window 1 (Parallel)

Launch simultaneously:

- **Agent 1** (`cs-fullstack-engineer`): Create `packages/theme-system/` (types, defaults, plugin, validation CLI)
- **Agent 2** (`cs-devops-engineer`): Update CI/CD (turbo.json build order, pnpm-workspace.yaml)

#### Window 2 (Parallel, after Window 1)

Launch simultaneously:

- **Agent 3** (`cs-fullstack-engineer`): Create `sites/base-template/` (copy colossus, genericize, theme.config, middleware.ts)
- **Agent 4** (`cs-frontend-engineer`): Update core-components to use CSS variables
- **Agent 5** (`cs-qa-engineer`): Add ESLint rule (no raw hex), validation tests

#### Window 3 (Sequential, after Window 2)

- **Agent 6** (`cs-frontend-engineer`): Migrate colossus-reference (theme.config, consolidated site.config)
- **Middleware cleanup**: Delete root middleware.ts, rename proxy.ts → middleware.ts

#### Window 4 (Final)

- **Agent 7** (`cs-fullstack-engineer`): Update `tools/create-site.ts` to copy from base-template
- **Agent 8** (`cs-technical-writer`): Documentation (theming guide, content ownership, middleware pattern)

#### Final Steps

```bash
# After all agents complete
npm run type-check
npm run build
npm run test
git add -A && git commit -m "feat(architecture): add base-template and theme-system"
git push -u origin feature/architecture-update
# Create PR to develop
```

---

### Success Criteria

- [ ] `packages/theme-system` builds with validation CLI working
- [ ] `sites/base-template` builds and passes all tests
- [ ] Theme validation CLI catches WCAG contrast issues
- [ ] ESLint rule prevents raw hex colors in core-components
- [ ] Changing `theme.config.ts` updates entire site appearance
- [ ] `colossus-reference` looks identical after migration
- [ ] New sites created from base-template in < 30 minutes
- [ ] Contact form has rate-limiting and consent by default

---

### Risks & Mitigations

| Risk                         | Mitigation                                         |
| ---------------------------- | -------------------------------------------------- |
| Breaking colossus production | Migrate incrementally, staging first, feature flag |
| CSS var browser support      | 95%+ support, fallbacks in Tailwind plugin         |
| Token system complexity      | Good defaults, progressive disclosure              |
| Build time increase          | Turborepo caching, parallel builds                 |
| Content/config drift         | Clear ownership rules, MDX as source of truth      |

---

**End of Specification**
