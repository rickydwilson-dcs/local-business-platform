/**
 * Tailwind CSS Plugin
 * Integrates theme tokens with Tailwind CSS
 */

import plugin from "tailwindcss/plugin";
import type { ThemeConfig } from "./types";
import { generateCssVariables } from "./generate-css";
import { defaultTheme } from "./defaults";
import { deepMerge } from "./utils";
import type { DeepPartialThemeConfig } from "./types";

/**
 * Create a Tailwind plugin from theme config
 */
export function createThemePlugin(userConfig: DeepPartialThemeConfig = {}) {
  // Deep merge user config with defaults
  const config = deepMerge(
    defaultTheme as unknown as Record<string, unknown>,
    userConfig as Record<string, unknown>
  ) as unknown as ThemeConfig;

  return plugin(
    ({ addBase, addUtilities }) => {
      // Inject CSS variables into :root
      addBase({
        ":root": generateCssVariables(config),
      });

      // Add custom utilities that use CSS variables
      addUtilities({
        // Brand color utilities
        ".bg-brand-primary": {
          backgroundColor: "var(--color-brand-primary)",
        },
        ".bg-brand-primary-hover": {
          backgroundColor: "var(--color-brand-primary-hover)",
        },
        ".bg-brand-secondary": {
          backgroundColor: "var(--color-brand-secondary)",
        },
        ".bg-brand-accent": {
          backgroundColor: "var(--color-brand-accent)",
        },
        ".text-brand-primary": {
          color: "var(--color-brand-primary)",
        },
        ".text-brand-secondary": {
          color: "var(--color-brand-secondary)",
        },
        ".text-brand-accent": {
          color: "var(--color-brand-accent)",
        },
        ".border-brand-primary": {
          borderColor: "var(--color-brand-primary)",
        },
        ".border-brand-secondary": {
          borderColor: "var(--color-brand-secondary)",
        },

        // Surface color utilities
        ".bg-surface-background": {
          backgroundColor: "var(--color-surface-background)",
        },
        ".bg-surface-muted": {
          backgroundColor: "var(--color-surface-muted)",
        },
        ".bg-surface-card": {
          backgroundColor: "var(--color-surface-card)",
        },
        ".text-surface-foreground": {
          color: "var(--color-surface-foreground)",
        },
        ".text-surface-muted-foreground": {
          color: "var(--color-surface-muted-foreground)",
        },
        ".border-surface-card-border": {
          borderColor: "var(--color-surface-card-border)",
        },

        // Semantic color utilities
        ".bg-success": {
          backgroundColor: "var(--color-success)",
        },
        ".bg-warning": {
          backgroundColor: "var(--color-warning)",
        },
        ".bg-error": {
          backgroundColor: "var(--color-error)",
        },
        ".bg-info": {
          backgroundColor: "var(--color-info)",
        },
        ".text-success": {
          color: "var(--color-success)",
        },
        ".text-warning": {
          color: "var(--color-warning)",
        },
        ".text-error": {
          color: "var(--color-error)",
        },
        ".text-info": {
          color: "var(--color-info)",
        },

        // Transition utilities
        ".transition-fast": {
          transitionDuration: "150ms",
          transitionTimingFunction: "var(--timing-ease)",
        },
        ".transition-normal": {
          transitionDuration: "200ms",
          transitionTimingFunction: "var(--timing-ease)",
        },
        ".transition-slow": {
          transitionDuration: "300ms",
          transitionTimingFunction: "var(--timing-ease)",
        },

        // Typography utilities
        ".text-hero": {
          fontSize: "var(--text-hero-size)",
          lineHeight: "var(--text-hero-line-height)",
          letterSpacing: "var(--text-hero-letter-spacing)",
          fontWeight: "var(--text-hero-weight)",
        },
        ".text-h1": {
          fontSize: "var(--text-h1-size)",
          lineHeight: "var(--text-h1-line-height)",
          letterSpacing: "var(--text-h1-letter-spacing)",
          fontWeight: "var(--text-h1-weight)",
        },
        ".text-h2": {
          fontSize: "var(--text-h2-size)",
          lineHeight: "var(--text-h2-line-height)",
          letterSpacing: "var(--text-h2-letter-spacing)",
          fontWeight: "var(--text-h2-weight)",
        },
        ".text-h3": {
          fontSize: "var(--text-h3-size)",
          lineHeight: "var(--text-h3-line-height)",
          letterSpacing: "var(--text-h3-letter-spacing)",
          fontWeight: "var(--text-h3-weight)",
        },
        ".text-h4": {
          fontSize: "var(--text-h4-size)",
          lineHeight: "var(--text-h4-line-height)",
          letterSpacing: "var(--text-h4-letter-spacing)",
          fontWeight: "var(--text-h4-weight)",
        },
        ".text-body": {
          fontSize: "var(--text-body-size)",
          lineHeight: "var(--text-body-line-height)",
          letterSpacing: "var(--text-body-letter-spacing)",
          fontWeight: "var(--text-body-weight)",
        },
        ".text-small": {
          fontSize: "var(--text-small-size)",
          lineHeight: "var(--text-small-line-height)",
          letterSpacing: "var(--text-small-letter-spacing)",
          fontWeight: "var(--text-small-weight)",
        },
        ".text-caption": {
          fontSize: "var(--text-caption-size)",
          lineHeight: "var(--text-caption-line-height)",
          letterSpacing: "var(--text-caption-letter-spacing)",
          fontWeight: "var(--text-caption-weight)",
        },

        // Navigation height utility
        ".h-nav": {
          height: "var(--nav-height)",
        },
        ".pt-nav": {
          paddingTop: "var(--nav-height)",
        },
        ".mt-nav": {
          marginTop: "var(--nav-height)",
        },
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
              "muted-foreground": "var(--color-surface-muted-foreground)",
              card: "var(--color-surface-card)",
              "card-border": "var(--color-surface-card-border)",
            },
            semantic: {
              success: "var(--color-success)",
              warning: "var(--color-warning)",
              error: "var(--color-error)",
              info: "var(--color-info)",
            },
          },
          fontFamily: {
            sans: "var(--font-family-sans)",
            heading: "var(--font-family-heading)",
            mono: "var(--font-family-mono)",
          },
          spacing: {
            xs: "var(--spacing-xs)",
            sm: "var(--spacing-sm)",
            md: "var(--spacing-md)",
            lg: "var(--spacing-lg)",
            xl: "var(--spacing-xl)",
            "2xl": "var(--spacing-2xl)",
            "3xl": "var(--spacing-3xl)",
            "4xl": "var(--spacing-4xl)",
          },
          borderRadius: {
            none: "var(--radius-none)",
            sm: "var(--radius-sm)",
            md: "var(--radius-md)",
            lg: "var(--radius-lg)",
            xl: "var(--radius-xl)",
            full: "var(--radius-full)",
            button: "var(--button-radius)",
            card: "var(--card-radius)",
          },
          boxShadow: {
            none: "var(--shadow-none)",
            sm: "var(--shadow-sm)",
            md: "var(--shadow-md)",
            lg: "var(--shadow-lg)",
            xl: "var(--shadow-xl)",
            card: "var(--card-shadow)",
          },
          zIndex: {
            dropdown: "var(--z-dropdown)",
            sticky: "var(--z-sticky)",
            modal: "var(--z-modal)",
            popover: "var(--z-popover)",
            tooltip: "var(--z-tooltip)",
          },
          transitionDuration: {
            fast: "150ms",
            normal: "200ms",
            slow: "300ms",
          },
          opacity: {
            disabled: "var(--opacity-disabled)",
            muted: "var(--opacity-muted)",
            overlay: "var(--opacity-overlay)",
          },
        },
      },
    }
  );
}

// Re-export for convenience
export { generateCssVariables } from "./generate-css";
