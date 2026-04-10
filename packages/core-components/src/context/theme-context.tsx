"use client";

/**
 * ThemeProvider — Client-side theme context
 *
 * Provides the active theme name and component registry to any client
 * component in the tree. Structural layout decisions (which hero variant,
 * which header style) are made via static imports at build time — this
 * context is for client-only atoms only (mobile menu state, consent
 * manager tokens, etc.).
 *
 * Usage in site layout.tsx:
 *   import { ThemeProvider } from "@platform/core-components";
 *   import { orionRegistry } from "@platform/themes/orion";
 *
 *   <ThemeProvider theme="orion" registry={orionRegistry}>
 *     <PageShell ...>{children}</PageShell>
 *   </ThemeProvider>
 */

import { createContext, useContext } from "react";

// ============================================================
// Local type definitions (structurally compatible with @platform/theme-system)
// Defined locally so core-components doesn't need a tsconfig cross-package
// path to theme-system (which would violate the composite rootDir constraint).
// ============================================================

/** Identifies which named visual theme is active. */
export type ThemeName =
  | "atlas"
  | "castor"
  | "cygnus"
  | "lyra"
  | "nova"
  | "orion"
  | "polaris"
  | "rigel"
  | "sirius"
  | "vega";

/** Metadata describing which component variants a theme uses. */
export interface ComponentRegistry {
  theme: ThemeName;
  heroVariant: string;
  headerVariant: string;
  cardVariant: string;
  sectionVariant: string;
}

// ============================================================
// Context value type
// ============================================================

export interface ThemeContextValue {
  /** Named theme identifier — "orion" | "vega" | "nova" */
  theme: ThemeName;
  /** Component registry for the active theme (build-time metadata) */
  registry: ComponentRegistry | null;
}

// Default to vega so the context is always safe to read without a provider
const ThemeContext = createContext<ThemeContextValue>({
  theme: "vega",
  registry: null,
});

// ============================================================
// Provider
// ============================================================

export interface ThemeProviderProps {
  children: React.ReactNode;
  theme: ThemeName;
  registry?: ComponentRegistry | null;
}

export function ThemeProvider({ children, theme, registry = null }: ThemeProviderProps) {
  return <ThemeContext.Provider value={{ theme, registry }}>{children}</ThemeContext.Provider>;
}

// ============================================================
// Hook
// ============================================================

/**
 * Returns the active theme context.
 * Safe to call without a provider — defaults to { theme: "vega", registry: null }.
 */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
