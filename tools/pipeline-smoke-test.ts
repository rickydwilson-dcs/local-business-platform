#!/usr/bin/env npx tsx
/**
 * Pipeline Smoke Test
 *
 * Runs the scaffold + TypeScript compile gate against a cached site-analysis.json.
 * No AI calls, no network, no browser. Completes in ~10 seconds.
 *
 * Usage:
 *   pnpm pipeline:smoke
 *   npx tsx tools/pipeline-smoke-test.ts [--fixture <path>] [--name <slug>] [--no-cleanup]
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — scaffold failed or TypeScript errors detected
 */

import * as fs from "fs";
import * as path from "path";
import { spawnSync } from "child_process";
import { scaffoldThemePackage } from "./scaffold-theme-package";

const MONOREPO_ROOT = path.resolve(__dirname, "..");
const DEFAULT_FIXTURE = path.join(MONOREPO_ROOT, "output/ingestion/lyra/site-analysis.json");

interface SmokeArgs {
  fixture: string;
  name: string;
  noCleanup: boolean;
}

function parseArgs(argv: string[]): SmokeArgs {
  const args: SmokeArgs = {
    fixture: DEFAULT_FIXTURE,
    name: `smoke-${Date.now()}`,
    noCleanup: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === "--fixture" && next) { args.fixture = path.resolve(next); i++; }
    else if (arg === "--name" && next) { args.name = next; i++; }
    else if (arg === "--no-cleanup") { args.noCleanup = true; }
  }
  return args;
}

function removeThemeName(name: string): void {
  // Revert THEME_NAMES in types.ts
  const typesPath = path.join(MONOREPO_ROOT, "packages/theme-system/src/types.ts");
  if (fs.existsSync(typesPath)) {
    let content = fs.readFileSync(typesPath, "utf8");
    // Remove the theme name entry (with surrounding comma/space handling)
    content = content.replace(new RegExp(`,\\s*"${name}"`, "g"), "");
    content = content.replace(new RegExp(`"${name}",\\s*`, "g"), "");
    content = content.replace(new RegExp(`"${name}"`, "g"), "");
    fs.writeFileSync(typesPath, content, "utf8");
  }

  // Revert ThemeName union in theme-context.tsx
  const contextPath = path.join(MONOREPO_ROOT, "packages/core-components/src/context/theme-context.tsx");
  if (fs.existsSync(contextPath)) {
    let content = fs.readFileSync(contextPath, "utf8");
    content = content.replace(new RegExp(`\\s*\\|\\s*"${name}"`, "g"), "");
    fs.writeFileSync(contextPath, content, "utf8");
  }

  // Remove exports from packages/themes/package.json
  const themesPkgPath = path.join(MONOREPO_ROOT, "packages/themes/package.json");
  if (fs.existsSync(themesPkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(themesPkgPath, "utf8"));
    if (pkg.exports) {
      const keysToRemove = Object.keys(pkg.exports).filter(k => k.includes(`/${name}`));
      for (const key of keysToRemove) {
        delete pkg.exports[key];
      }
      fs.writeFileSync(themesPkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    }
  }
}

function cleanup(name: string): void {
  // Remove theme package directory
  const themeDir = path.join(MONOREPO_ROOT, "packages/themes", name);
  if (fs.existsSync(themeDir)) {
    fs.rmSync(themeDir, { recursive: true, force: true });
  }

  // Revert type mutations
  removeThemeName(name);
}

function main(): void {
  const args = parseArgs(process.argv);

  console.log("Pipeline Smoke Test");
  console.log("=".repeat(50));

  // Step 1: Load fixture
  console.log(`\n[1/3] Loading fixture...`);
  if (!fs.existsSync(args.fixture)) {
    console.error(`  FAIL: Fixture not found: ${args.fixture}`);
    process.exit(1);
  }
  const analysis = JSON.parse(fs.readFileSync(args.fixture, "utf8"));
  const blueprintCount = analysis.sectionBlueprints?.length ?? 0;
  console.log(`  OK (${blueprintCount} blueprints from ${path.basename(path.dirname(args.fixture))})`);

  // Step 2: Scaffold
  console.log(`\n[2/3] Scaffolding theme "${args.name}"...`);
  const fixtureOutputDir = path.dirname(args.fixture);
  let themeDir: string;
  try {
    themeDir = scaffoldThemePackage(analysis, args.name, fixtureOutputDir);
    console.log(`  OK (${themeDir})`);
  } catch (err) {
    console.error(`  FAIL: Scaffold error: ${err instanceof Error ? err.message : err}`);
    if (!args.noCleanup) {
      try { cleanup(args.name); } catch { /* best effort */ }
    }
    process.exit(1);
  }

  // Step 3: TypeScript compile check
  console.log(`\n[3/3] TypeScript compile check...`);

  const tsconfigCheckPath = path.join(themeDir, "tsconfig.check.json");
  const tsconfigCheck = {
    compilerOptions: {
      noEmit: true,
      jsx: "react-jsx",
      module: "esnext",
      moduleResolution: "bundler",
      strict: true,
      skipLibCheck: true,
      baseUrl: MONOREPO_ROOT,
      paths: {
        "@platform/theme-system": ["packages/theme-system/src/index.ts"],
        "@platform/theme-system/*": ["packages/theme-system/src/*"],
        "@platform/core-components": ["packages/core-components/src/index.ts"],
        "@platform/core-components/*": ["packages/core-components/src/*"],
        [`@platform/themes/${args.name}`]: [`packages/themes/${args.name}/index.ts`],
        [`@platform/themes/${args.name}/*`]: [`packages/themes/${args.name}/*`],
      },
    },
    // Only check scaffold-generated infrastructure files, not AI-generated component implementations
    include: ["index.ts", "manifest.ts"],
  };

  fs.writeFileSync(tsconfigCheckPath, JSON.stringify(tsconfigCheck, null, 2), "utf8");

  const tscResult = spawnSync("npx", ["tsc", "--project", tsconfigCheckPath], {
    cwd: MONOREPO_ROOT,
    encoding: "utf8",
    timeout: 60_000,
  });

  // Clean up temp tsconfig
  try { fs.unlinkSync(tsconfigCheckPath); } catch { /* ignore */ }

  let pass = true;
  if (tscResult.status !== 0) {
    const output = (tscResult.stdout || "") + (tscResult.stderr || "");
    const errorLines = output.split("\n").filter((l: string) => l.trim());
    const errorCount = errorLines.filter((l: string) => l.includes("error TS")).length;
    console.error(`  FAIL (${errorCount} TypeScript errors)`);
    for (const line of errorLines.slice(0, 15)) {
      console.error(`    ${line}`);
    }
    if (errorLines.length > 15) {
      console.error(`    ... (${errorLines.length - 15} more lines)`);
    }
    pass = false;
  } else {
    console.log("  OK (0 errors)");
  }

  // Cleanup
  if (!args.noCleanup) {
    console.log(`\nCleanup: removing packages/themes/${args.name}/`);
    try {
      cleanup(args.name);
      console.log("  Done");
    } catch (err) {
      console.warn(`  [Warning] Cleanup failed: ${err instanceof Error ? err.message : err}`);
      console.warn(`  Run \`/pipeline.kill-theme ${args.name}\` manually.`);
    }
  } else {
    console.log(`\n[--no-cleanup] Theme left at packages/themes/${args.name}/`);
    console.log(`  To clean up: /pipeline.kill-theme ${args.name}`);
  }

  // Result
  console.log(`\n${"=".repeat(50)}`);
  console.log(`RESULT: ${pass ? "PASS" : "FAIL"}`);
  process.exit(pass ? 0 : 1);
}

main();
