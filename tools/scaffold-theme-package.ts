#!/usr/bin/env npx tsx
/**
 * Scaffold Theme Package (v2)
 *
 * Creates a new theme package under packages/themes/<name>/ from a
 * reference-analysis.json (v2) file produced by generate-theme-from-reference.ts.
 *
 * v2 output structure:
 *   packages/themes/<name>/
 *     index.ts              — registry + tokens + registerTheme()
 *     globals.css           — theme-specific utility classes (self-contained)
 *     manifest.ts           — component metadata array
 *     components/           — generated component files (one per blueprint)
 *     showcase-registry.tsx — ElementDefinition entries for showcase
 *     README.md             — generated inventory
 *
 * Usage:
 *   npx tsx tools/scaffold-theme-package.ts --analysis <path> --name <slug>
 */

import * as fs from "fs";
import * as path from "path";
import type { ReferenceAnalysis, SiteAnalysis } from "./lib/reference-analysis-types";

// ============================================================================
// CLI argument parsing
// ============================================================================

interface ScaffoldInput {
  analysisPath?: string;
  name?: string;
}

function parseArgs(argv: string[]): ScaffoldInput {
  const args: ScaffoldInput = {};

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--analysis" && next) {
      args.analysisPath = next;
      i++;
    } else if (arg === "--name" && next) {
      args.name = next;
      i++;
    }
  }

  return args;
}

// ============================================================================
// Helpers
// ============================================================================

function toPascalCase(slug: string): string {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function toCamelCase(slug: string): string {
  const pascal = toPascalCase(slug);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// ============================================================================
// Registry presets
// ============================================================================

/** Registry variant presets — one per base theme. Update when adding a new base theme. */
interface RegistryPreset {
  heroVariant: string;
  headerVariant: string;
  cardVariant: string;
  sectionVariant: string;
}

const REGISTRY_PRESETS: Record<string, RegistryPreset> = {
  vega: {
    heroVariant: "split",
    headerVariant: "light",
    cardVariant: "standard",
    sectionVariant: "standard",
  },
  orion: {
    heroVariant: "image-overlay",
    headerVariant: "dark",
    cardVariant: "icon-circle",
    sectionVariant: "dark-accent",
  },
};

// ============================================================================
// File generators
// ============================================================================

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const DEFAULT_TYPOGRAPHY_SCALE = {
  hero: { size: "4rem", lineHeight: "1.1", letterSpacing: "-0.02em", weight: 800 },
  h1: { size: "3rem", lineHeight: "1.15", letterSpacing: "-0.015em", weight: 700 },
  h2: { size: "2.25rem", lineHeight: "1.2", letterSpacing: "-0.01em", weight: 700 },
  h3: { size: "1.875rem", lineHeight: "1.25", letterSpacing: "-0.005em", weight: 600 },
  h4: { size: "1.5rem", lineHeight: "1.3", letterSpacing: "0", weight: 600 },
  body: { size: "1rem", lineHeight: "1.6", letterSpacing: "0", weight: 400 },
  small: { size: "0.875rem", lineHeight: "1.5", letterSpacing: "0", weight: 400 },
  caption: { size: "0.75rem", lineHeight: "1.5", letterSpacing: "0.01em", weight: 400 },
} as const;

function generateIndexTs(name: string, analysis: ReferenceAnalysis | SiteAnalysis): string {
  const pascal = toPascalCase(name);
  const camel = toCamelCase(name);
  const tokens = analysis.themeTokenRecommendations;

  const baseTheme = analysis.registryRecommendation?.themeName ?? "vega";
  const preset = REGISTRY_PRESETS[baseTheme] ?? REGISTRY_PRESETS.vega;

  // Build extended surface tokens
  const surfaceEntries: string[] = [
    `      background: "${tokens.surface.background}",`,
    `      foreground: "${tokens.surface.foreground}",`,
    `      muted: "${tokens.surface.muted}",`,
  ];
  surfaceEntries.push(`      card: "${tokens.surface.card ?? tokens.surface.background}",`);
  surfaceEntries.push(`      cardBorder: "${tokens.surface.cardBorder ?? "#e5e7eb"}",`);
  surfaceEntries.push(`      mutedForeground: "${tokens.surface.mutedForeground ?? "#6b7280"}",`);
  surfaceEntries.push(`      subtle: "${tokens.surface.subtle ?? tokens.surface.muted}",`);
  surfaceEntries.push(`      inverse: "${tokens.surface.inverse ?? tokens.surface.foreground}",`);
  if (tokens.surface.secondaryForeground) {
    surfaceEntries.push(`      secondaryForeground: "${tokens.surface.secondaryForeground}",`);
  }

  // Compute overlay.primary from brand color
  const overlayPrimary = /^#[0-9a-fA-F]{6}$/.test(tokens.brand.primary)
    ? hexToRgba(tokens.brand.primary, 0.8)
    : "rgba(0,0,0,0.6)";

  // Build typography scale — always emitted with DEFAULT_TYPOGRAPHY_SCALE fallback
  const resolvedScale = tokens.typography.scale ?? DEFAULT_TYPOGRAPHY_SCALE;
  const scaleEntries: string[] = [];
  for (const [key, entry] of Object.entries(resolvedScale)) {
    if (!entry) continue;
    const fields: string[] = [];
    if (entry.size) fields.push(`size: "${entry.size}"`);
    if (entry.lineHeight) fields.push(`lineHeight: "${entry.lineHeight}"`);
    if (entry.letterSpacing) fields.push(`letterSpacing: "${entry.letterSpacing}"`);
    if (entry.weight) fields.push(`weight: ${entry.weight}`);
    if (fields.length > 0) scaleEntries.push(`      ${key}: { ${fields.join(", ")} },`);
  }
  const scaleBlock = `\n    scale: {\n${scaleEntries.join("\n")}\n    },`;

  // Build components block if available
  let componentsBlock = "";
  if (tokens.components) {
    const compParts: string[] = [];
    if (tokens.components.button) {
      const b = tokens.components.button;
      const fields: string[] = [];
      if (b.borderRadius) fields.push(`borderRadius: "${b.borderRadius}"`);
      if (b.paddingX) fields.push(`paddingX: "${b.paddingX}"`);
      if (b.paddingY) fields.push(`paddingY: "${b.paddingY}"`);
      if (b.fontWeight) fields.push(`fontWeight: ${b.fontWeight}`);
      if (fields.length > 0) compParts.push(`    button: { ${fields.join(", ")} },`);
    }
    if (tokens.components.card) {
      const c = tokens.components.card;
      const fields: string[] = [];
      if (c.borderRadius) fields.push(`borderRadius: "${c.borderRadius}"`);
      if (c.padding) fields.push(`padding: "${c.padding}"`);
      if (c.shadow) fields.push(`shadow: "${c.shadow}"`);
      if (fields.length > 0) compParts.push(`    card: { ${fields.join(", ")} },`);
    }
    if (tokens.components.navigation) {
      const n = tokens.components.navigation;
      const fields: string[] = [];
      if (n.height) fields.push(`height: "${n.height}"`);
      if (n.appearance) fields.push(`appearance: "${n.appearance}"`);
      if (fields.length > 0) compParts.push(`    navigation: { ${fields.join(", ")} },`);
    }
    if (tokens.components.section) {
      const s = tokens.components.section;
      const fields: string[] = [];
      if (s.paddingY) fields.push(`paddingY: "${s.paddingY}"`);
      if (fields.length > 0) compParts.push(`    section: { ${fields.join(", ")} },`);
    }
    if (compParts.length > 0) {
      componentsBlock = `\n  components: {\n${compParts.join("\n")}\n  },`;
    }
  }

  return `/**
 * ${pascal} Theme
 *
 * Generated from reference analysis of ${analysis.reference.url ?? "unknown"}.
 * Analysis date: ${analysis.reference.capturedAt}
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const ${camel}Registry: ComponentRegistry = {
  theme: "${name}",
  heroVariant: "${preset.heroVariant}",
  headerVariant: "${preset.headerVariant}",
  cardVariant: "${preset.cardVariant}",
  sectionVariant: "${preset.sectionVariant}",
};

export const ${camel}DefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "${tokens.brand.primary}",
      primaryHover: "${tokens.brand.primaryHover}",
      secondary: "${tokens.brand.secondary}",
      accent: "${tokens.brand.accent}",
    },
    surface: {
${surfaceEntries.join("\n")}
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error:   '#ef4444',
      info:    '#3b82f6',
    },
    overlay: {
      dark:    'rgba(0,0,0,0.8)',
      light:   'rgba(255,255,255,0.8)',
      primary: '${overlayPrimary}',
    },
  },
  typography: {
    fontFamily: {
      sans: ${JSON.stringify(tokens.typography.fontFamilySans)},
      heading: ${JSON.stringify(tokens.typography.fontFamilyHeading)},
    },${scaleBlock}
  },${componentsBlock}
};

registerTheme({ name: "${name}", label: "${pascal}", config: ${camel}DefaultConfig });
`;
}

function generateManifestTs(name: string, analysis: ReferenceAnalysis | SiteAnalysis): string {
  const lines: string[] = [];
  const pascal = toPascalCase(name);

  lines.push(`/**`);
  lines.push(` * ${pascal} Theme — Component Manifest`);
  lines.push(` *`);
  lines.push(` * Auto-generated from reference analysis.`);
  lines.push(` * Maps blueprint metadata for tooling and showcase integration.`);
  lines.push(` */`);
  lines.push(``);
  lines.push(`import type { ComponentCategory } from '../../theme-system/src/types';`);
  lines.push(``);
  lines.push(`export interface ThemeComponentEntry {`);
  lines.push(`  slug: string;`);
  lines.push(`  name: string;`);
  lines.push(`  category: ComponentCategory;`);
  lines.push(`  exportName: string;`);
  lines.push(`  importPath: string;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export const manifest: ThemeComponentEntry[] = [`);

  for (const bp of analysis.sectionBlueprints) {
    lines.push(`  {`);
    lines.push(`    slug: "${bp.id}",`);
    lines.push(`    name: "${bp.name}",`);
    lines.push(`    category: "${bp.category}",`);
    lines.push(`    exportName: "${bp.componentExportName}",`);
    lines.push(`    importPath: "./components/${bp.componentFileName.replace(".tsx", "")}",`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);

  return lines.join("\n");
}

function generateShowcaseRegistryTsx(
  name: string,
  analysis: ReferenceAnalysis | SiteAnalysis,
  componentMatches?: Map<string, { matchConfidence: string }>
): string {
  const pascal = toPascalCase(name);
  const camel = toCamelCase(name);
  const lines: string[] = [];

  lines.push(`/**`);
  lines.push(` * ${pascal} Theme — Showcase Registry`);
  lines.push(` *`);
  lines.push(` * Auto-generated ElementDefinition entries for the showcase site.`);
  lines.push(` */`);
  lines.push(``);
  lines.push(`import type { ReactNode } from 'react';`);
  lines.push(``);

  // Filter blueprints: only import components that will actually exist as files
  // (skip those matched to core-components with "exact" or "close" confidence)
  const seenExports = new Set<string>();
  const importableBlueprints = analysis.sectionBlueprints.filter((bp) => {
    // Skip blueprints matched to core-components first (before dedup)
    if (componentMatches) {
      const match = componentMatches.get(bp.id);
      if (match && (match.matchConfidence === "exact" || match.matchConfidence === "close")) {
        return false;
      }
    }

    // Then skip duplicate export names
    if (seenExports.has(bp.componentExportName)) return false;
    seenExports.add(bp.componentExportName);

    return true;
  });

  // Import each component that exists
  for (const bp of importableBlueprints) {
    lines.push(
      `import { ${bp.componentExportName} } from './components/${bp.componentFileName.replace(".tsx", "")}';`
    );
  }

  lines.push(``);
  lines.push(`export interface ShowcaseElementEntry {`);
  lines.push(`  slug: string;`);
  lines.push(`  name: string;`);
  lines.push(`  category: string;`);
  lines.push(`  description: string;`);
  lines.push(`  themeName: string;`);
  lines.push(`  render: () => ReactNode;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export const ${camel}Elements: ShowcaseElementEntry[] = [`);

  for (const bp of importableBlueprints) {
    lines.push(`  {`);
    lines.push(`    slug: "${bp.id}",`);
    lines.push(`    name: "${bp.name}",`);
    lines.push(`    category: "${bp.category}",`);
    lines.push(`    description: "${bp.purpose.replace(/"/g, '\\"')}",`);
    lines.push(`    themeName: "${name}",`);
    lines.push(`    render: () => <${bp.componentExportName} />,`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);

  return lines.join("\n");
}

function generateComponentBarrel(
  analysis: ReferenceAnalysis | SiteAnalysis,
  options?: { themeName?: string },
  componentMatches?: Map<string, { matchConfidence: string }>
): string {
  const lines: string[] = [];
  const seenExports = new Set<string>();

  lines.push(`/**`);
  lines.push(` * Component barrel file — re-exports all theme components.`);
  lines.push(` */`);
  lines.push(``);

  for (const bp of analysis.sectionBlueprints) {
    // Skip blueprints matched to core-components first (before dedup)
    if (componentMatches) {
      const match = componentMatches.get(bp.id);
      if (match && (match.matchConfidence === "exact" || match.matchConfidence === "close")) {
        continue;
      }
    }

    // Then skip duplicate export names
    if (seenExports.has(bp.componentExportName)) continue;
    seenExports.add(bp.componentExportName);

    lines.push(
      `export { ${bp.componentExportName} } from './${bp.componentFileName.replace(".tsx", "")}';`
    );
  }

  if (options?.themeName) {
    const pascal = toPascalCase(options.themeName);

    let primaryNavBp: (typeof analysis.sectionBlueprints)[number] | undefined;
    let primaryFooterBp: (typeof analysis.sectionBlueprints)[number] | undefined;

    for (const bp of analysis.sectionBlueprints) {
      const conf = componentMatches?.get(bp.id)?.matchConfidence;
      const isMatched = conf === "exact" || conf === "close";
      if (!isMatched && bp.category === "Navigation") {
        const fn = bp.componentFileName.toLowerCase();
        const pur = bp.purpose.toLowerCase();
        const isMainNav =
          fn.includes("site-header") ||
          fn.includes("primary-nav") ||
          pur.includes("primary") ||
          pur.includes("sticky");
        if (isMainNav && !primaryNavBp) primaryNavBp = bp;
        else if (!primaryNavBp) primaryNavBp = bp;
      }
      if (!isMatched && bp.category === "Footer" && !primaryFooterBp) {
        primaryFooterBp = bp;
      }
    }

    if (primaryNavBp || primaryFooterBp) {
      lines.push("");
      lines.push("// Theme contract aliases (TPV-002)");
    }
    if (primaryNavBp) {
      const file = primaryNavBp.componentFileName.replace(".tsx", "");
      lines.push(
        `export { ${primaryNavBp.componentExportName} as ${pascal}Header } from './${file}';`
      );
      lines.push(
        `export type { ${primaryNavBp.componentExportName}Props as ${pascal}HeaderProps } from './${file}';`
      );
    }
    if (primaryFooterBp) {
      const file = primaryFooterBp.componentFileName.replace(".tsx", "");
      lines.push(
        `export { ${primaryFooterBp.componentExportName} as ${pascal}Footer } from './${file}';`
      );
      lines.push(
        `export type { ${primaryFooterBp.componentExportName}Props as ${pascal}FooterProps } from './${file}';`
      );
    }
  }

  lines.push(``);
  return lines.join("\n");
}

function generateGlobalsCss(name: string, analysis: ReferenceAnalysis | SiteAnalysis): string {
  const pascal = toPascalCase(name);
  return `/*
 * ${pascal} Theme — Global CSS Utilities
 *
 * Reference site: ${analysis.reference.url ?? "unknown"}
 * Capture date: ${analysis.reference.capturedAt}
 *
 * Theme-level utility classes shared by all ${pascal} sites.
 * Import this file at the top of your site's app/globals.css:
 *
 *   @import "../../packages/themes/${name}/globals.css";
 *   @tailwind base;
 *   @tailwind components;
 *   @tailwind utilities;
 *
 * Pattern: matches packages/themes/vega/globals.css
 * No @layer wrappers. No opacity modifiers in @apply. Only standard theme tokens.
 */

/* ==========================================
   BUTTONS
   ========================================== */

.btn-primary {
  @apply inline-flex items-center justify-center px-6 py-3 rounded-lg;
  @apply bg-brand-primary text-on-brand-primary font-semibold;
  @apply hover:bg-brand-primary-hover transition-all duration-200;
  @apply focus:ring-2 focus:ring-brand-primary focus:ring-offset-2;
}

.btn-secondary {
  @apply inline-flex items-center justify-center px-6 py-3 rounded-lg;
  @apply bg-surface-card text-brand-primary border border-brand-primary font-semibold;
  @apply hover:bg-surface-subtle transition-all duration-200;
  @apply focus:ring-2 focus:ring-brand-primary focus:ring-offset-2;
}

.btn-ghost {
  @apply inline-flex items-center justify-center px-6 py-3 rounded-lg;
  @apply bg-surface-subtle text-surface-foreground font-semibold;
  @apply hover:bg-surface-subtle transition-all duration-200;
  @apply focus:ring-2 focus:ring-surface-subtle-border focus:ring-offset-2;
}

/* ==========================================
   CARDS
   ========================================== */

.card {
  @apply bg-surface-card border border-surface-subtle rounded-xl p-6;
  @apply shadow-sm hover:shadow-md transition-shadow;
}

.card-interactive {
  @apply bg-surface-card border border-surface-subtle rounded-xl p-6 shadow-sm;
  @apply hover:shadow-md hover:-translate-y-1 transition-all duration-300;
}

/* ==========================================
   SECTIONS
   ========================================== */

.section {
  @apply py-16 md:py-24;
}

.section-compact {
  @apply py-8 md:py-12;
}

/* ==========================================
   CONTAINERS
   ========================================== */

.container-narrow {
  @apply max-w-4xl mx-auto px-4 sm:px-6 lg:px-8;
}

.container-standard {
  @apply mx-auto w-full lg:w-[90%] px-6;
}

/* ==========================================
   TYPOGRAPHY
   ========================================== */

.heading-hero {
  @apply text-4xl md:text-5xl lg:text-6xl font-bold text-surface-foreground mb-6;
}

.heading-section {
  @apply text-2xl sm:text-3xl md:text-4xl font-bold text-surface-foreground mb-4;
}

.heading-card {
  @apply text-xl sm:text-2xl font-bold text-surface-foreground mb-4;
}
`;
}

function generateReadme(name: string, analysis: ReferenceAnalysis | SiteAnalysis): string {
  const lines: string[] = [];
  const pascal = toPascalCase(name);

  lines.push(`# ${pascal} Theme`);
  lines.push("");
  lines.push(`**Reference site:** ${analysis.reference.url ?? "unknown"}`);
  lines.push(`**Analysis date:** ${analysis.reference.capturedAt}`);
  lines.push(`**Analysis version:** ${analysis.analysisVersion}`);
  lines.push("");

  lines.push("## Registry");
  lines.push("");
  const reg = analysis.registryRecommendation;
  lines.push(`- Theme: ${reg.themeName}`);
  lines.push(`- Confidence: ${reg.confidence}`);
  lines.push(`- Reasoning: ${reg.reasoning}`);
  lines.push("");

  lines.push("## Components");
  lines.push("");
  lines.push("| Component | Category | File |");
  lines.push("|-----------|----------|------|");
  for (const bp of analysis.sectionBlueprints) {
    lines.push(`| ${bp.name} | ${bp.category} | components/${bp.componentFileName} |`);
  }
  lines.push("");

  lines.push("## Wiring into a Site");
  lines.push("");
  lines.push("### 1. tsconfig.json");
  lines.push("");
  lines.push("```json");
  lines.push(`{`);
  lines.push(`  "compilerOptions": {`);
  lines.push(`    "paths": {`);
  lines.push(`      "@platform/themes/${name}/*": ["../../packages/themes/${name}/*"]`);
  lines.push(`    }`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push("```");
  lines.push("");
  lines.push("### 2. next.config.mjs");
  lines.push("");
  lines.push("```js");
  lines.push(`transpilePackages: ["@platform/themes"],`);
  lines.push("```");
  lines.push("");
  lines.push("### 3. app/globals.css");
  lines.push("");
  lines.push("```css");
  lines.push(`@import "../../packages/themes/${name}/globals.css";`);
  lines.push("```");
  lines.push("");
  lines.push("### 4. theme.config.ts");
  lines.push("");
  lines.push("```ts");
  lines.push(`import { ${toCamelCase(name)}DefaultConfig } from "@platform/themes/${name}";`);
  lines.push("");
  lines.push(`export const themeConfig = {`);
  lines.push(`  ...${toCamelCase(name)}DefaultConfig,`);
  lines.push(`  // Override colours as needed:`);
  lines.push(`  // colors: { brand: { primary: "#your-hex" } },`);
  lines.push(`};`);
  lines.push("```");
  lines.push("");
  lines.push("## Verification");
  lines.push("");
  lines.push(
    "Colours in this theme were extracted from a screenshot and may not be pixel-perfect."
  );
  lines.push("Verify against the reference site and adjust hex values as needed.");
  lines.push("");

  return lines.join("\n");
}

// ============================================================================
// THEME_NAMES auto-append
// ============================================================================

function appendThemeName(name: string): void {
  const typesPath = path.resolve(__dirname, "../packages/theme-system/src/types.ts");
  if (!fs.existsSync(typesPath)) {
    console.warn(`  [Warning] Could not find ${typesPath} — skipping THEME_NAMES update.`);
    return;
  }

  let content = fs.readFileSync(typesPath, "utf8");

  // Check if name already exists
  if (content.includes(`"${name}"`)) {
    console.log(`  ✓ "${name}" already in THEME_NAMES`);
    return;
  }

  // Find the THEME_NAMES array and append before the closing bracket (supports multi-line)
  const themeNamesRegex = /export const THEME_NAMES = \[([\s\S]*?)\] as const;/;
  const match = content.match(themeNamesRegex);
  if (!match) {
    console.warn("  [Warning] Could not find THEME_NAMES array — skipping update.");
    return;
  }

  const existingNames = match[1].trim();
  const newNames = existingNames.endsWith(",")
    ? `${existingNames} "${name}"`
    : `${existingNames}, "${name}"`;

  content = content.replace(themeNamesRegex, `export const THEME_NAMES = [${newNames}] as const;`);

  fs.writeFileSync(typesPath, content, "utf8");
  console.log(`  ✓ Appended "${name}" to THEME_NAMES`);

  // Also update ThemeName union in theme-context.tsx (structurally duplicated type)
  const contextPath = path.resolve(
    __dirname,
    "../packages/core-components/src/context/theme-context.tsx"
  );
  if (!fs.existsSync(contextPath)) {
    console.warn(`  [Warning] Could not find ${contextPath} — skipping ThemeName sync.`);
    return;
  }

  let contextContent = fs.readFileSync(contextPath, "utf8");
  if (contextContent.includes(`"${name}"`)) {
    console.log(`  ✓ "${name}" already in ThemeName union`);
    return;
  }

  const themeNameRegex = /export type ThemeName = ([^;]+);/;
  const themeNameMatch = contextContent.match(themeNameRegex);
  if (!themeNameMatch) {
    console.warn("  [Warning] Could not find ThemeName type — skipping sync.");
    return;
  }

  const updatedUnion = `${themeNameMatch[1]} | "${name}"`;
  contextContent = contextContent.replace(
    themeNameRegex,
    `export type ThemeName = ${updatedUnion};`
  );
  fs.writeFileSync(contextPath, contextContent, "utf8");
  console.log(`  ✓ Synced "${name}" to ThemeName union in theme-context.tsx`);
}

// ============================================================================
// Main
// ============================================================================

export function scaffoldThemePackage(
  analysis: ReferenceAnalysis | SiteAnalysis,
  name: string,
  outputDir?: string
): string {
  const pascal = toPascalCase(name);

  // Version gate
  if (analysis.analysisVersion === "1") {
    throw new Error(
      `Analysis version "1" is not supported by scaffold v2. ` +
        `Re-run the analysis pipeline to produce a v2 analysis with sectionBlueprints.`
    );
  }

  // For v3 SiteAnalysis, use its deduplicated sectionBlueprints directly.
  // The rest of the scaffold uses the same fields (sectionBlueprints, themeTokenRecommendations, etc.)
  // which exist on both ReferenceAnalysis and SiteAnalysis.

  console.log(`\nScaffolding theme package: ${pascal} (${name})`);

  // Determine target directory
  const themesDir = path.resolve(__dirname, "../packages/themes");
  const themeDir = path.join(themesDir, name);

  if (fs.existsSync(themeDir)) {
    console.warn(`  [Warning] ${themeDir} already exists — overwriting files.`);
  }

  fs.mkdirSync(themeDir, { recursive: true });
  fs.mkdirSync(path.join(themeDir, "components"), { recursive: true });

  // Build componentMatches map from v3 SiteAnalysis
  let componentMatchMap: Map<string, { matchConfidence: string }> | undefined;
  if ("componentMatches" in analysis && analysis.componentMatches) {
    componentMatchMap = new Map();
    for (const match of analysis.componentMatches) {
      if (match.blueprintId) {
        componentMatchMap.set(match.blueprintId, { matchConfidence: match.matchConfidence });
      }
      // No legacy fallback — the old name-match never worked anyway.
      // Old site-analysis.json files without blueprintId should be re-ingested.
    }
  }

  // Write files
  const files: Array<[string, string]> = [
    [path.join(themeDir, "index.ts"), generateIndexTs(name, analysis)],
    [path.join(themeDir, "globals.css"), generateGlobalsCss(name, analysis)],
    [path.join(themeDir, "manifest.ts"), generateManifestTs(name, analysis)],
    [
      path.join(themeDir, "showcase-registry.tsx"),
      generateShowcaseRegistryTsx(name, analysis, componentMatchMap),
    ],
    [
      path.join(themeDir, "components", "index.ts"),
      generateComponentBarrel(analysis, { themeName: name }, componentMatchMap),
    ],
    [path.join(themeDir, "README.md"), generateReadme(name, analysis)],
  ];

  for (const [filePath, content] of files) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`  ✓ ${path.relative(process.cwd(), filePath)}`);
  }

  // Copy generated component .tsx files from output directory to theme package
  if (outputDir) {
    const outputComponentsDir = path.join(outputDir, "components");
    if (fs.existsSync(outputComponentsDir)) {
      let copied = 0;
      for (const file of fs.readdirSync(outputComponentsDir)) {
        if (file.endsWith(".tsx")) {
          fs.copyFileSync(
            path.join(outputComponentsDir, file),
            path.join(themeDir, "components", file)
          );
          copied++;
        }
      }
      console.log(`  ✓ Copied ${copied} component files to theme package`);
    }
  }

  // Update shared exports map in packages/themes/package.json
  const sharedPkgPath = path.join(themesDir, "package.json");
  if (fs.existsSync(sharedPkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(sharedPkgPath, "utf8"));
    pkg.exports = pkg.exports ?? {};

    const newExports: Record<string, string> = {
      [`./${name}`]: `./${name}/index.ts`,
      [`./${name}/manifest`]: `./${name}/manifest.ts`,
      [`./${name}/showcase`]: `./${name}/showcase-registry.tsx`,
      [`./${name}/components`]: `./${name}/components/index.ts`,
    };

    for (const [key, value] of Object.entries(newExports)) {
      if (!pkg.exports[key]) {
        pkg.exports[key] = value;
        console.log(`  ✓ Added export "${key}" to packages/themes/package.json`);
      }
    }

    fs.writeFileSync(sharedPkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  }

  // Auto-append theme name to THEME_NAMES
  appendThemeName(name);

  return themeDir;
}

// ============================================================================
// CLI entry point
// ============================================================================

function main() {
  const args = parseArgs(process.argv);

  if (!args.analysisPath || !args.name) {
    console.error("Usage: npx tsx tools/scaffold-theme-package.ts --analysis <path> --name <slug>");
    process.exit(1);
  }

  // Validate name
  if (!/^[a-z][a-z0-9-]*$/.test(args.name)) {
    console.error(`Error: --name must match ^[a-z][a-z0-9-]*$ (got "${args.name}")`);
    process.exit(1);
  }

  // Read analysis
  const absAnalysisPath = path.isAbsolute(args.analysisPath)
    ? args.analysisPath
    : path.resolve(process.cwd(), args.analysisPath);

  if (!fs.existsSync(absAnalysisPath)) {
    console.error(`Error: Analysis file not found: ${absAnalysisPath}`);
    process.exit(1);
  }

  const analysis = JSON.parse(fs.readFileSync(absAnalysisPath, "utf8")) as ReferenceAnalysis;

  scaffoldThemePackage(analysis, args.name);
  console.log("\n✅ Scaffold complete.\n");
}

// Only run CLI when this file is the entry point (ESM-safe detection)
const isDirectRun =
  (typeof import.meta?.url === "string" &&
    process.argv[1] &&
    import.meta.url === `file://${process.argv[1]}`) ||
  process.argv[1]?.includes("scaffold-theme-package");
if (isDirectRun) {
  main();
}
