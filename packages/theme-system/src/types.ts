/**
 * Theme System Type Definitions
 * Comprehensive design token interface for white-label platform theming
 */

import { z } from "zod";

/**
 * Typography scale entry with size, lineHeight, letterSpacing, and weight
 */
export interface TypographyScaleEntry {
  size: string;
  lineHeight: string;
  letterSpacing: string;
  weight: number;
}

/**
 * Font preload configuration
 */
export interface FontPreload {
  family: string;
  src: string;
  weight: number;
  style: "normal" | "italic";
  display: "swap" | "block" | "fallback" | "optional";
}

/**
 * Comprehensive theme configuration interface
 */
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
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
  };

  /**
   * Border radius scale
   */
  radii: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
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
    dropdown: number;
    sticky: number;
    modal: number;
    popover: number;
    tooltip: number;
  };

  /**
   * Transition/animation tokens
   */
  transitions: {
    fast: string;
    normal: string;
    slow: string;
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
    disabled: number;
    muted: number;
    overlay: number;
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
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    /** Type scale - each includes size, lineHeight, letterSpacing */
    scale: {
      hero: TypographyScaleEntry;
      h1: TypographyScaleEntry;
      h2: TypographyScaleEntry;
      h3: TypographyScaleEntry;
      h4: TypographyScaleEntry;
      body: TypographyScaleEntry;
      small: TypographyScaleEntry;
      caption: TypographyScaleEntry;
    };
  };

  /**
   * Font configuration for self-hosted fonts
   */
  fonts: {
    /** Font files to preload */
    preload: FontPreload[];
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
      /** Font weight */
      fontWeight?: number;
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

/**
 * Partial theme config for user overrides
 */
export type PartialThemeConfig = {
  [K in keyof ThemeConfig]?: ThemeConfig[K] extends object
    ? Partial<ThemeConfig[K]>
    : ThemeConfig[K];
};

/**
 * Deep partial type for theme config
 */
export type DeepPartialThemeConfig = {
  colors?: {
    brand?: Partial<ThemeConfig["colors"]["brand"]>;
    surface?: Partial<ThemeConfig["colors"]["surface"]>;
    semantic?: Partial<ThemeConfig["colors"]["semantic"]>;
  };
  spacing?: Partial<ThemeConfig["spacing"]>;
  radii?: Partial<ThemeConfig["radii"]>;
  shadows?: Partial<ThemeConfig["shadows"]>;
  zIndex?: Partial<ThemeConfig["zIndex"]>;
  transitions?: {
    fast?: string;
    normal?: string;
    slow?: string;
    timing?: Partial<ThemeConfig["transitions"]["timing"]>;
  };
  opacity?: Partial<ThemeConfig["opacity"]>;
  typography?: {
    fontFamily?: Partial<ThemeConfig["typography"]["fontFamily"]>;
    fontWeight?: Partial<ThemeConfig["typography"]["fontWeight"]>;
    scale?: Partial<ThemeConfig["typography"]["scale"]>;
  };
  fonts?: {
    preload?: FontPreload[];
  };
  components?: {
    button?: Partial<ThemeConfig["components"]["button"]>;
    card?: Partial<ThemeConfig["components"]["card"]>;
    hero?: Partial<ThemeConfig["components"]["hero"]>;
    navigation?: Partial<ThemeConfig["components"]["navigation"]>;
    section?: Partial<ThemeConfig["components"]["section"]>;
  };
};

// Zod Schemas for validation

const typographyScaleEntrySchema = z.object({
  size: z.string(),
  lineHeight: z.string(),
  letterSpacing: z.string(),
  weight: z.number().int().min(100).max(900),
});

const fontPreloadSchema = z.object({
  family: z.string(),
  src: z.string(),
  weight: z.number().int().min(100).max(900),
  style: z.enum(["normal", "italic"]),
  display: z.enum(["swap", "block", "fallback", "optional"]),
});

export const ThemeConfigSchema = z.object({
  colors: z.object({
    brand: z.object({
      primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
      primaryHover: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
      secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
      accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
    }),
    surface: z.object({
      background: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
      foreground: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
      muted: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
      mutedForeground: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
      card: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
      cardBorder: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
    }),
    semantic: z.object({
      success: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
      warning: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
      error: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
      info: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
    }),
  }),
  spacing: z.object({
    xs: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    "2xl": z.string(),
    "3xl": z.string(),
    "4xl": z.string(),
  }),
  radii: z.object({
    none: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    full: z.string(),
  }),
  shadows: z.object({
    none: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
  }),
  zIndex: z.object({
    dropdown: z.number().int(),
    sticky: z.number().int(),
    modal: z.number().int(),
    popover: z.number().int(),
    tooltip: z.number().int(),
  }),
  transitions: z.object({
    fast: z.string(),
    normal: z.string(),
    slow: z.string(),
    timing: z.object({
      ease: z.string(),
      easeIn: z.string(),
      easeOut: z.string(),
      easeInOut: z.string(),
    }),
  }),
  opacity: z.object({
    disabled: z.number().min(0).max(1),
    muted: z.number().min(0).max(1),
    overlay: z.number().min(0).max(1),
  }),
  typography: z.object({
    fontFamily: z.object({
      sans: z.array(z.string()).min(1),
      heading: z.array(z.string()).optional(),
      mono: z.array(z.string()).optional(),
    }),
    fontWeight: z.object({
      normal: z.number().int().min(100).max(900),
      medium: z.number().int().min(100).max(900),
      semibold: z.number().int().min(100).max(900),
      bold: z.number().int().min(100).max(900),
    }),
    scale: z.object({
      hero: typographyScaleEntrySchema,
      h1: typographyScaleEntrySchema,
      h2: typographyScaleEntrySchema,
      h3: typographyScaleEntrySchema,
      h4: typographyScaleEntrySchema,
      body: typographyScaleEntrySchema,
      small: typographyScaleEntrySchema,
      caption: typographyScaleEntrySchema,
    }),
  }),
  fonts: z.object({
    preload: z.array(fontPreloadSchema),
  }),
  components: z.object({
    button: z.object({
      borderRadius: z.string(),
      paddingX: z.string(),
      paddingY: z.string(),
      fontWeight: z.number().int().min(100).max(900).optional(),
    }),
    card: z.object({
      borderRadius: z.string(),
      shadow: z.enum(["none", "sm", "md", "lg"]),
      padding: z.string(),
    }),
    hero: z.object({
      variant: z.enum(["centered", "split", "fullscreen"]),
      minHeight: z.string(),
    }),
    navigation: z.object({
      style: z.enum(["transparent", "solid", "blur"]),
      height: z.string(),
    }),
    section: z.object({
      paddingY: z.string(),
      paddingYCompact: z.string(),
    }),
  }),
});

export type ValidatedThemeConfig = z.infer<typeof ThemeConfigSchema>;
