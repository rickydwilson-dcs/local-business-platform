/**
 * CSS Variable Generator
 * Converts ThemeConfig to CSS custom properties
 */

import type { ThemeConfig } from "./types";

/**
 * Generate CSS custom properties from theme config
 */
export function generateCssVariables(config: ThemeConfig): Record<string, string> {
  const vars: Record<string, string> = {};

  // Brand Colors
  vars["--color-brand-primary"] = config.colors.brand.primary;
  vars["--color-brand-primary-hover"] = config.colors.brand.primaryHover;
  vars["--color-brand-secondary"] = config.colors.brand.secondary;
  vars["--color-brand-accent"] = config.colors.brand.accent;

  // Surface Colors
  vars["--color-surface-background"] = config.colors.surface.background;
  vars["--color-surface-foreground"] = config.colors.surface.foreground;
  vars["--color-surface-muted"] = config.colors.surface.muted;
  vars["--color-surface-muted-foreground"] = config.colors.surface.mutedForeground;
  vars["--color-surface-card"] = config.colors.surface.card;
  vars["--color-surface-card-border"] = config.colors.surface.cardBorder;

  // Semantic Colors
  vars["--color-success"] = config.colors.semantic.success;
  vars["--color-warning"] = config.colors.semantic.warning;
  vars["--color-error"] = config.colors.semantic.error;
  vars["--color-info"] = config.colors.semantic.info;

  // Spacing
  vars["--spacing-xs"] = config.spacing.xs;
  vars["--spacing-sm"] = config.spacing.sm;
  vars["--spacing-md"] = config.spacing.md;
  vars["--spacing-lg"] = config.spacing.lg;
  vars["--spacing-xl"] = config.spacing.xl;
  vars["--spacing-2xl"] = config.spacing["2xl"];
  vars["--spacing-3xl"] = config.spacing["3xl"];
  vars["--spacing-4xl"] = config.spacing["4xl"];

  // Radii
  vars["--radius-none"] = config.radii.none;
  vars["--radius-sm"] = config.radii.sm;
  vars["--radius-md"] = config.radii.md;
  vars["--radius-lg"] = config.radii.lg;
  vars["--radius-xl"] = config.radii.xl;
  vars["--radius-full"] = config.radii.full;

  // Shadows
  vars["--shadow-none"] = config.shadows.none;
  vars["--shadow-sm"] = config.shadows.sm;
  vars["--shadow-md"] = config.shadows.md;
  vars["--shadow-lg"] = config.shadows.lg;
  vars["--shadow-xl"] = config.shadows.xl;

  // Z-Index
  vars["--z-dropdown"] = String(config.zIndex.dropdown);
  vars["--z-sticky"] = String(config.zIndex.sticky);
  vars["--z-modal"] = String(config.zIndex.modal);
  vars["--z-popover"] = String(config.zIndex.popover);
  vars["--z-tooltip"] = String(config.zIndex.tooltip);

  // Transitions
  vars["--transition-fast"] = config.transitions.fast;
  vars["--transition-normal"] = config.transitions.normal;
  vars["--transition-slow"] = config.transitions.slow;
  vars["--timing-ease"] = config.transitions.timing.ease;
  vars["--timing-ease-in"] = config.transitions.timing.easeIn;
  vars["--timing-ease-out"] = config.transitions.timing.easeOut;
  vars["--timing-ease-in-out"] = config.transitions.timing.easeInOut;

  // Opacity
  vars["--opacity-disabled"] = String(config.opacity.disabled);
  vars["--opacity-muted"] = String(config.opacity.muted);
  vars["--opacity-overlay"] = String(config.opacity.overlay);

  // Typography - Font Families
  vars["--font-family-sans"] = config.typography.fontFamily.sans
    .map((f) => (f.includes(" ") ? `"${f}"` : f))
    .join(", ");

  if (config.typography.fontFamily.heading) {
    vars["--font-family-heading"] = config.typography.fontFamily.heading
      .map((f) => (f.includes(" ") ? `"${f}"` : f))
      .join(", ");
  } else {
    vars["--font-family-heading"] = vars["--font-family-sans"];
  }

  if (config.typography.fontFamily.mono) {
    vars["--font-family-mono"] = config.typography.fontFamily.mono
      .map((f) => (f.includes(" ") ? `"${f}"` : f))
      .join(", ");
  }

  // Typography - Font Weights
  vars["--font-weight-normal"] = String(config.typography.fontWeight.normal);
  vars["--font-weight-medium"] = String(config.typography.fontWeight.medium);
  vars["--font-weight-semibold"] = String(config.typography.fontWeight.semibold);
  vars["--font-weight-bold"] = String(config.typography.fontWeight.bold);

  // Typography - Scale
  const scaleKeys = ["hero", "h1", "h2", "h3", "h4", "body", "small", "caption"] as const;
  for (const key of scaleKeys) {
    const entry = config.typography.scale[key];
    vars[`--text-${key}-size`] = entry.size;
    vars[`--text-${key}-line-height`] = entry.lineHeight;
    vars[`--text-${key}-letter-spacing`] = entry.letterSpacing;
    vars[`--text-${key}-weight`] = String(entry.weight);
  }

  // Component Tokens - Button
  vars["--button-radius"] = config.components.button.borderRadius;
  vars["--button-padding-x"] = config.components.button.paddingX;
  vars["--button-padding-y"] = config.components.button.paddingY;

  // Component Tokens - Card
  vars["--card-radius"] = config.components.card.borderRadius;
  vars["--card-padding"] = config.components.card.padding;
  vars["--card-shadow"] = config.shadows[config.components.card.shadow];

  // Component Tokens - Hero
  vars["--hero-variant"] = config.components.hero.variant;
  vars["--hero-min-height"] = config.components.hero.minHeight;

  // Component Tokens - Navigation
  vars["--nav-style"] = config.components.navigation.style;
  vars["--nav-height"] = config.components.navigation.height;

  // Component Tokens - Section
  vars["--section-padding-y"] = config.components.section.paddingY;
  vars["--section-padding-y-compact"] = config.components.section.paddingYCompact;

  return vars;
}

/**
 * Generate CSS string from theme config
 */
export function generateCssString(config: ThemeConfig): string {
  const vars = generateCssVariables(config);
  const entries = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  return `:root {\n${entries}\n}`;
}

/**
 * Generate font preload link tags
 */
export function generateFontPreloadLinks(config: ThemeConfig): string[] {
  return config.fonts.preload.map((font) => {
    const type = font.src.endsWith(".woff2")
      ? "font/woff2"
      : font.src.endsWith(".woff")
        ? "font/woff"
        : font.src.endsWith(".ttf")
          ? "font/ttf"
          : font.src.endsWith(".otf")
            ? "font/otf"
            : "font";
    return `<link rel="preload" href="${font.src}" as="font" type="${type}" crossorigin="anonymous">`;
  });
}

/**
 * Generate @font-face declarations
 */
export function generateFontFaceDeclarations(config: ThemeConfig): string {
  return config.fonts.preload
    .map((font) => {
      const format = font.src.endsWith(".woff2")
        ? "woff2"
        : font.src.endsWith(".woff")
          ? "woff"
          : font.src.endsWith(".ttf")
            ? "truetype"
            : font.src.endsWith(".otf")
              ? "opentype"
              : "truetype";
      return `@font-face {
  font-family: "${font.family}";
  src: url("${font.src}") format("${format}");
  font-weight: ${font.weight};
  font-style: ${font.style};
  font-display: ${font.display};
}`;
    })
    .join("\n\n");
}
