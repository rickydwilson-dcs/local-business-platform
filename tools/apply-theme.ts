#!/usr/bin/env npx tsx
/**
 * Apply Theme to Site
 *
 * Applies a generated theme.config.ts to an existing site. Can also
 * switch a site between Orion and Vega themes by updating the
 * componentRegistry reference in theme.config.ts and the @import
 * in globals.css.
 *
 * Usage:
 *   npx tsx tools/apply-theme.ts --site sites/my-site --config ./theme.config.ts
 *   npx tsx tools/apply-theme.ts --site sites/my-site --theme orion
 *   npx tsx tools/apply-theme.ts --site sites/my-site --theme vega
 *   npx tsx tools/apply-theme.ts --site sites/my-site --config ./theme.config.ts --dry-run
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Types
// ============================================================================

type ThemeName = "orion" | "vega";

interface ApplyThemeInput {
  sitePath?: string;
  configPath?: string;
  theme?: ThemeName;
  dryRun?: boolean;
}

// ============================================================================
// CLI argument parsing
// ============================================================================

function parseArgs(argv: string[]): ApplyThemeInput {
  const args: ApplyThemeInput = {};

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--site" && next) {
      args.sitePath = next;
      i++;
    } else if (arg === "--config" && next) {
      args.configPath = next;
      i++;
    } else if (arg === "--theme" && next) {
      args.theme = next as ThemeName;
      i++;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    }
  }

  return args;
}

// ============================================================================
// File operations
// ============================================================================

function readFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function writeFile(filePath: string, content: string, dryRun: boolean): void {
  if (dryRun) {
    console.log(`  [dry-run] Would write ${filePath}`);
    console.log("  ─── Content preview (first 8 lines) ───");
    console.log(
      content
        .split("\n")
        .slice(0, 8)
        .map((l) => "  " + l)
        .join("\n")
    );
    console.log("  ────────────────────────────────────────");
    return;
  }
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`  ✓ Updated: ${filePath}`);
}

// ============================================================================
// Switch theme in theme.config.ts
// ============================================================================

function switchThemeInConfig(configContent: string, toTheme: ThemeName): string {
  const fromTheme: ThemeName = toTheme === "orion" ? "vega" : "orion";
  const fromRegistry = `${fromTheme}Registry`;
  const toRegistry = `${toTheme}Registry`;
  const fromImport = `@platform/themes/${fromTheme}`;
  const toImport = `@platform/themes/${toTheme}`;

  return configContent
    .replace(new RegExp(fromImport, "g"), toImport)
    .replace(new RegExp(fromRegistry, "g"), toRegistry);
}

// ============================================================================
// Switch theme import in globals.css
// ============================================================================

function switchThemeInCss(cssContent: string, toTheme: ThemeName): string {
  const fromTheme: ThemeName = toTheme === "orion" ? "vega" : "orion";

  return cssContent.replace(
    new RegExp(`@import.*packages/themes/${fromTheme}/globals\\.css.*;`, "g"),
    `@import "../../../packages/themes/${toTheme}/globals.css";`
  );
}

// ============================================================================
// Validate site directory
// ============================================================================

function validateSite(sitePath: string): string {
  const absPath = path.isAbsolute(sitePath)
    ? sitePath
    : path.resolve(process.cwd(), sitePath);

  if (!fs.existsSync(absPath)) {
    throw new Error(`Site directory not found: ${absPath}`);
  }

  const themeConfigPath = path.join(absPath, "theme.config.ts");
  if (!fs.existsSync(themeConfigPath)) {
    throw new Error(`No theme.config.ts found in: ${absPath}`);
  }

  return absPath;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const args = parseArgs(process.argv);

  if (!args.sitePath) {
    console.error("Error: --site <path> is required\n");
    console.error(
      "Usage: npx tsx tools/apply-theme.ts --site sites/my-site --config ./theme.config.ts"
    );
    process.exit(1);
  }

  if (!args.configPath && !args.theme) {
    console.error("Error: Provide --config <theme.config.ts> or --theme <orion|vega>\n");
    process.exit(1);
  }

  const absitePath = validateSite(args.sitePath);
  const themeConfigPath = path.join(absitePath, "theme.config.ts");
  const globalsCssPath = path.join(absitePath, "app", "globals.css");

  console.log(`\n🎨 Applying theme to: ${absitePath}`);

  // ── Mode 1: Replace theme.config.ts wholesale ────────────────────────────

  if (args.configPath) {
    const absConfigPath = path.isAbsolute(args.configPath)
      ? args.configPath
      : path.resolve(process.cwd(), args.configPath);

    console.log(`  Reading config from: ${absConfigPath}`);
    const newConfig = readFile(absConfigPath);

    writeFile(themeConfigPath, newConfig, args.dryRun ?? false);
    console.log("  ✓ theme.config.ts replaced.");

    // Also update globals.css @import if the new config specifies a theme
    if (newConfig.includes("orionRegistry") && fs.existsSync(globalsCssPath)) {
      const cssContent = readFile(globalsCssPath);
      const updatedCss = switchThemeInCss(cssContent, "orion");
      writeFile(globalsCssPath, updatedCss, args.dryRun ?? false);
    } else if (newConfig.includes("vegaRegistry") && fs.existsSync(globalsCssPath)) {
      const cssContent = readFile(globalsCssPath);
      const updatedCss = switchThemeInCss(cssContent, "vega");
      writeFile(globalsCssPath, updatedCss, args.dryRun ?? false);
    }
  }

  // ── Mode 2: Switch theme variant only ────────────────────────────────────

  if (args.theme) {
    const toTheme = args.theme;
    console.log(`  Switching to theme: ${toTheme}`);

    // Update theme.config.ts
    const configContent = readFile(themeConfigPath);
    const updatedConfig = switchThemeInConfig(configContent, toTheme);
    writeFile(themeConfigPath, updatedConfig, args.dryRun ?? false);

    // Update globals.css @import
    if (fs.existsSync(globalsCssPath)) {
      const cssContent = readFile(globalsCssPath);
      const updatedCss = switchThemeInCss(cssContent, toTheme);
      writeFile(globalsCssPath, updatedCss, args.dryRun ?? false);
    } else {
      console.warn(`  [Warning] globals.css not found at: ${globalsCssPath}`);
    }
  }

  if (!args.dryRun) {
    console.log("\n✅ Theme applied. Run `npm run dev` in the site directory to see changes.\n");
  } else {
    console.log("\n✅ Dry run complete — no files modified.\n");
  }
}

main().catch((err) => {
  console.error("[Fatal]", err);
  process.exit(1);
});
