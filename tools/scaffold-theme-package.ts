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
import type { ReferenceAnalysis } from "./lib/reference-analysis-types";

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
// File generators
// ============================================================================

function generateIndexTs(name: string, analysis: ReferenceAnalysis): string {
  const pascal = toPascalCase(name);
  const camel = toCamelCase(name);
  const tokens = analysis.themeTokenRecommendations;

  return `/**
 * ${pascal} Theme
 *
 * Generated from reference analysis of ${analysis.reference.url ?? "unknown"}.
 * Analysis date: ${analysis.reference.capturedAt}
 */

import type { DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const ${camel}DefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: {
      primary: "${tokens.brand.primary}",
      primaryHover: "${tokens.brand.primaryHover}",
      secondary: "${tokens.brand.secondary}",
      accent: "${tokens.brand.accent}",
    },
    surface: {
      background: "${tokens.surface.background}",
      foreground: "${tokens.surface.foreground}",
      muted: "${tokens.surface.muted}",
    },
  },
  typography: {
    fontFamily: {
      sans: ${JSON.stringify(tokens.typography.fontFamilySans)},
      heading: ${JSON.stringify(tokens.typography.fontFamilyHeading)},
    },
  },
};

registerTheme({ name: "${name}", label: "${pascal}", config: ${camel}DefaultConfig });
`;
}

function generateManifestTs(name: string, analysis: ReferenceAnalysis): string {
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

function generateShowcaseRegistryTsx(name: string, analysis: ReferenceAnalysis): string {
  const pascal = toPascalCase(name);
  const camel = toCamelCase(name);
  const lines: string[] = [];

  lines.push(`/**`);
  lines.push(` * ${pascal} Theme — Showcase Registry`);
  lines.push(` *`);
  lines.push(` * Auto-generated ElementDefinition entries for the showcase site.`);
  lines.push(` */`);
  lines.push(``);

  // Import each component
  for (const bp of analysis.sectionBlueprints) {
    lines.push(`import { ${bp.componentExportName} } from './components/${bp.componentFileName.replace(".tsx", "")}';`);
  }

  lines.push(``);
  lines.push(`export interface ShowcaseElementEntry {`);
  lines.push(`  slug: string;`);
  lines.push(`  name: string;`);
  lines.push(`  category: string;`);
  lines.push(`  description: string;`);
  lines.push(`  themeName: string;`);
  lines.push(`  render: () => React.ReactNode;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export const ${camel}Elements: ShowcaseElementEntry[] = [`);

  for (const bp of analysis.sectionBlueprints) {
    lines.push(`  {`);
    lines.push(`    slug: "${bp.id}",`);
    lines.push(`    name: "${bp.name}",`);
    lines.push(`    category: "${bp.category}",`);
    lines.push(`    description: "${bp.purpose}",`);
    lines.push(`    themeName: "${name}",`);
    lines.push(`    render: () => <${bp.componentExportName} />,`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);

  return lines.join("\n");
}

function generateGlobalsCss(name: string, analysis: ReferenceAnalysis): string {
  return `/*
 * ${toPascalCase(name)} Theme — Global CSS Utilities
 *
 * Reference site: ${analysis.reference.url ?? "unknown"}
 * Capture date: ${analysis.reference.capturedAt}
 *
 * This file is intentionally minimal. Theme tokens are defined in index.ts
 * and consumed via Tailwind utility classes. Add theme-specific utility
 * classes here only when needed.
 *
 * Import this file at the top of your site's app/globals.css:
 *
 *   @import "../../packages/themes/${name}/globals.css";
 *   @tailwind base;
 *   @tailwind components;
 *   @tailwind utilities;
 */
`;
}

function generateReadme(name: string, analysis: ReferenceAnalysis): string {
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

  lines.push("## Verification");
  lines.push("");
  lines.push("Colours in this theme were extracted from a screenshot and may not be pixel-perfect.");
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

  // Find the THEME_NAMES array and append before the closing bracket
  const themeNamesRegex = /export const THEME_NAMES = \[([^\]]*)\] as const;/;
  const match = content.match(themeNamesRegex);
  if (!match) {
    console.warn("  [Warning] Could not find THEME_NAMES array — skipping update.");
    return;
  }

  const existingNames = match[1].trim();
  const newNames = existingNames.endsWith(",")
    ? `${existingNames} "${name}"`
    : `${existingNames}, "${name}"`;

  content = content.replace(
    themeNamesRegex,
    `export const THEME_NAMES = [${newNames}] as const;`
  );

  fs.writeFileSync(typesPath, content, "utf8");
  console.log(`  ✓ Appended "${name}" to THEME_NAMES`);
}

// ============================================================================
// Main
// ============================================================================

export function scaffoldThemePackage(analysis: ReferenceAnalysis, name: string): string {
  const pascal = toPascalCase(name);

  // Version gate
  if (analysis.analysisVersion === "1") {
    throw new Error(
      `Analysis version "1" is not supported by scaffold v2. ` +
      `Re-run the analysis pipeline to produce a v2 analysis with sectionBlueprints.`
    );
  }

  console.log(`\nScaffolding theme package: ${pascal} (${name})`);

  // Determine target directory
  const themesDir = path.resolve(__dirname, "../packages/themes");
  const themeDir = path.join(themesDir, name);

  if (fs.existsSync(themeDir)) {
    console.warn(`  [Warning] ${themeDir} already exists — overwriting files.`);
  }

  fs.mkdirSync(themeDir, { recursive: true });
  fs.mkdirSync(path.join(themeDir, "components"), { recursive: true });

  // Write files
  const files: Array<[string, string]> = [
    [path.join(themeDir, "index.ts"), generateIndexTs(name, analysis)],
    [path.join(themeDir, "globals.css"), generateGlobalsCss(name, analysis)],
    [path.join(themeDir, "manifest.ts"), generateManifestTs(name, analysis)],
    [path.join(themeDir, "showcase-registry.tsx"), generateShowcaseRegistryTsx(name, analysis)],
    [path.join(themeDir, "README.md"), generateReadme(name, analysis)],
  ];

  for (const [filePath, content] of files) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`  ✓ ${path.relative(process.cwd(), filePath)}`);
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

main();
