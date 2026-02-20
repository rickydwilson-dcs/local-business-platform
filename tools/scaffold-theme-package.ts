#!/usr/bin/env npx tsx
/**
 * Scaffold Theme Package
 *
 * Creates a new theme package under packages/themes/<name>/ from a
 * reference-analysis.json file produced by generate-theme-from-reference.ts --analyse.
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
  const reg = analysis.registryRecommendation;
  const tokens = analysis.themeTokenRecommendations;

  return `/**
 * ${pascal} Theme
 *
 * Generated from reference analysis of ${analysis.reference.url ?? "unknown"}.
 * Analysis date: ${analysis.reference.capturedAt}
 *
 * Component registry — consumed by tooling, not at runtime.
 * Actual component selection uses static imports from @platform/core-components.
 */

import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const ${camel}Registry: ComponentRegistry = {
  theme: "${name}",
  heroVariant: "${reg.heroVariant}",
  headerVariant: "${reg.headerVariant}",
  cardVariant: "${reg.cardVariant}",
  sectionVariant: "${reg.sectionVariant}",
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
  lines.push("");

  lines.push("## Registry Values");
  lines.push("");
  const reg = analysis.registryRecommendation;
  lines.push(`| Key | Value |`);
  lines.push(`|-----|-------|`);
  lines.push(`| heroVariant | ${reg.heroVariant} |`);
  lines.push(`| headerVariant | ${reg.headerVariant} |`);
  lines.push(`| cardVariant | ${reg.cardVariant} |`);
  lines.push(`| sectionVariant | ${reg.sectionVariant} |`);
  lines.push(`| confidence | ${reg.confidence} |`);
  lines.push("");
  lines.push(`**Reasoning:** ${reg.reasoning}`);
  lines.push("");

  lines.push("## Component Mapping");
  lines.push("");
  lines.push("| Section | Status | Existing Component | Notes |");
  lines.push("|---------|--------|-------------------|-------|");
  for (const m of analysis.componentMappings) {
    lines.push(`| ${m.section} | ${m.status} | ${m.existingComponent ?? "—"} | ${m.notes} |`);
  }
  lines.push("");

  if (analysis.newComponentBacklog.length > 0) {
    lines.push("## Gap Components");
    lines.push("");
    for (const comp of analysis.newComponentBacklog) {
      lines.push(`### ${comp.name}`);
      lines.push("");
      lines.push(comp.description);
      lines.push("");
      lines.push("```typescript");
      lines.push(comp.propsContract);
      lines.push("```");
      lines.push("");
      lines.push(`**Token constraints:** ${comp.tokenConstraints}`);
      lines.push("");
    }
  }

  lines.push("## Verification");
  lines.push("");
  lines.push("Colours in this theme were extracted from a screenshot and may not be pixel-perfect.");
  lines.push("Verify against the reference site and adjust hex values as needed.");
  lines.push("");

  return lines.join("\n");
}

function generateSetupMd(name: string): string {
  return `# Setup: ${toPascalCase(name)} Theme

Manual steps required after scaffolding:

1. \`pnpm install\`
2. Add path alias to each site's tsconfig.json that uses this theme:
   \`"@platform/themes/${name}": ["../../packages/themes/${name}/index.ts"]\`
3. Add same alias to tools/tsconfig.json if needed
4. If sites/showcase exists: import ${name} theme in sites/showcase/lib/register-all-themes.ts
5. \`pnpm type-check\`
`;
}

// ============================================================================
// Main
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
  const name = args.name;
  const pascal = toPascalCase(name);

  console.log(`\nScaffolding theme package: ${pascal} (${name})`);

  // Determine target directory
  const themesDir = path.resolve(__dirname, "../packages/themes");
  const themeDir = path.join(themesDir, name);

  if (fs.existsSync(themeDir)) {
    console.warn(`  [Warning] ${themeDir} already exists — overwriting files.`);
  }

  fs.mkdirSync(themeDir, { recursive: true });

  // Write files
  const files: Array<[string, string]> = [
    [path.join(themeDir, "index.ts"), generateIndexTs(name, analysis)],
    [path.join(themeDir, "globals.css"), generateGlobalsCss(name, analysis)],
    [path.join(themeDir, "README.md"), generateReadme(name, analysis)],
    [path.join(themeDir, "SETUP.md"), generateSetupMd(name)],
  ];

  for (const [filePath, content] of files) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`  ✓ ${path.relative(process.cwd(), filePath)}`);
  }

  // Update shared exports map in packages/themes/package.json
  const sharedPkgPath = path.join(themesDir, "package.json");
  if (fs.existsSync(sharedPkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(sharedPkgPath, "utf8"));
    const exportKey = `./${name}`;
    if (!pkg.exports?.[exportKey]) {
      pkg.exports = pkg.exports ?? {};
      pkg.exports[exportKey] = `./${name}/index.ts`;
      fs.writeFileSync(sharedPkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
      console.log(`  ✓ Updated exports map in packages/themes/package.json`);
    } else {
      console.log(`  ✓ Export "./${name}" already present in packages/themes/package.json`);
    }
  }

  // Print SETUP.md to stdout
  const setupContent = generateSetupMd(name);
  console.log(`\n${setupContent}`);
}

main();
