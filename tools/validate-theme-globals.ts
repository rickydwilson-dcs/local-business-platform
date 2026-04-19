#!/usr/bin/env tsx
/**
 * Theme Component Contract Validator
 *
 * Reads every packages/themes/<name>/globals.css and verifies it defines
 * every class in THEME_COMPONENT_CONTRACT. Exit 0 on success, 1 on missing.
 *
 * Usage:
 *   tsx tools/validate-theme-globals.ts               # validate all themes
 *   tsx tools/validate-theme-globals.ts --theme orion # validate single theme
 *   tsx tools/validate-theme-globals.ts --json        # machine-readable output
 *   tsx tools/validate-theme-globals.ts --warn-only   # exit 0 even on failure
 */

import { readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CONTRACT_CLASS_NAMES,
  THEME_COMPONENT_CONTRACT,
} from "../packages/theme-system/src/component-contract";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = join(__dirname, "..", "packages", "themes");

interface Args {
  theme?: string;
  json: boolean;
  warnOnly: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { json: false, warnOnly: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--theme") args.theme = argv[++i];
    else if (a === "--json") args.json = true;
    else if (a === "--warn-only") args.warnOnly = true;
  }
  return args;
}

/**
 * Strip CSS comments and the contents of url("...") / url('...') expressions
 * so data URIs containing literal strings like `.filter` don't false-positive.
 */
function stripNoise(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/url\(\s*(["'])[\s\S]*?\1\s*\)/g, "url()")
    .replace(/url\(\s*[^)"']*?\s*\)/g, "url()")
    .replace(/^[ \t]*@(import|tailwind|charset|namespace)\b[^;]*;/gm, "");
}

/**
 * Extract every class name that is defined as a CSS selector.
 * Handles nested braces and @-rules correctly.
 */
function extractDefinedClasses(css: string): Set<string> {
  const cleaned = stripNoise(css);
  const classNameRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g;
  const defined = new Set<string>();
  let depth = 0;
  let buffer = "";

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (ch === "{") {
      if (depth === 0) {
        const trimmed = buffer.trim();
        if (trimmed && !/^@/.test(trimmed)) {
          let m: RegExpExecArray | null;
          classNameRegex.lastIndex = 0;
          while ((m = classNameRegex.exec(buffer)) !== null) {
            defined.add(m[1]);
          }
        }
      }
      depth++;
      buffer = "";
    } else if (ch === "}") {
      depth = Math.max(0, depth - 1);
      buffer = "";
    } else if (depth === 0) {
      buffer += ch;
    }
  }
  return defined;
}

interface ThemeResult {
  theme: string;
  globalsCssPath: string;
  missing: string[];
  definedCount: number;
}

async function validateTheme(theme: string): Promise<ThemeResult> {
  const globalsPath = join(THEMES_DIR, theme, "globals.css");
  const css = await readFile(globalsPath, "utf-8");
  const defined = extractDefinedClasses(css);
  const missing = CONTRACT_CLASS_NAMES.filter((name) => !defined.has(name));
  return { theme, globalsCssPath: globalsPath, missing, definedCount: defined.size };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const themes = args.theme
    ? [args.theme]
    : (await readdir(THEMES_DIR, { withFileTypes: true }))
        .filter((d) => d.isDirectory() && d.name !== "node_modules")
        .map((d) => d.name);

  const results: ThemeResult[] = [];
  for (const t of themes) {
    try {
      results.push(await validateTheme(t));
    } catch (err) {
      console.error(
        `Failed to read globals.css for theme "${t}":`,
        err instanceof Error ? err.message : err
      );
      if (!args.warnOnly) process.exit(1);
    }
  }

  const failingThemes = results.filter((r) => r.missing.length > 0);

  if (args.json) {
    console.log(JSON.stringify({ results, failingCount: failingThemes.length }, null, 2));
  } else {
    for (const r of results) {
      if (r.missing.length === 0) {
        console.log(
          `✓ ${r.theme.padEnd(12)} — all ${CONTRACT_CLASS_NAMES.length} contract classes defined`
        );
      } else {
        console.log(
          `✗ ${r.theme.padEnd(12)} — missing ${r.missing.length}/${CONTRACT_CLASS_NAMES.length}:`
        );
        for (const name of r.missing) {
          const entry = THEME_COMPONENT_CONTRACT.find((c) => c.name === name)!;
          console.log(`    .${name}  (${entry.group}) — ${entry.purpose}`);
          console.log(`       consumers: ${entry.consumers.join(", ")}`);
        }
      }
    }
  }

  if (failingThemes.length > 0 && !args.warnOnly) {
    console.error(`\n${failingThemes.length} theme(s) failed contract validation.`);
    console.error(`Run with --warn-only to inspect without failing CI.`);
    process.exit(1);
  }
  if (failingThemes.length > 0 && args.warnOnly) {
    console.warn(
      `\n${failingThemes.length} theme(s) missing contract classes (warn-only mode — not failing).`
    );
  }
}

main().catch((err) => {
  console.error("validate-theme-globals crashed:", err);
  process.exit(1);
});
