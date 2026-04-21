#!/usr/bin/env tsx
/**
 * Preflight theme-token audit.
 *
 * Catches the DJ Fox `text-surface-inverse-foreground` invisible-text bug at
 * static-analysis time, before any screenshot is taken.
 *
 * Strategy:
 *   1. Parse `packages/theme-system/src/tailwind-plugin.ts` to extract the set
 *      of explicit utility classes registered via `addUtilities(...)`.
 *   2. Also extract the Tailwind `theme.extend` color/font/etc. keys, which
 *      let Tailwind generate classes like `bg-brand-primary` automatically.
 *   3. Scan the target directories (composition.json, composable components,
 *      site pages) for theme-token-shaped classes.
 *   4. For each discovered class, check it is either registered explicitly or
 *      generable from theme.extend. Anything else is flagged FAIL.
 *
 * Usage:
 *   tsx tools/visual-parity/preflight-tokens.ts --scan sites/colossus-scaffolding-test
 *   tsx tools/visual-parity/preflight-tokens.ts --scan sites/colossus-scaffolding --scan packages/core-components/src/components/composable
 */

import { parseArgs } from "node:util";
import * as fs from "fs";
import * as path from "path";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const PLUGIN_PATH = path.join(REPO_ROOT, "packages/theme-system/src/tailwind-plugin.ts");

interface TokenRegistry {
  explicitClasses: Set<string>;
  extendColorPaths: Set<string>;
  extendFontPaths: Set<string>;
  extendSpacingPaths: Set<string>;
  extendRadiusPaths: Set<string>;
  extendShadowPaths: Set<string>;
  extendOpacityPaths: Set<string>;
}

interface Finding {
  class: string;
  file: string;
  line: number;
  reason: string;
}

function loadRegistry(): TokenRegistry {
  const src = fs.readFileSync(PLUGIN_PATH, "utf8");

  const explicitClasses = new Set<string>();
  const addUtilitiesMatch = src.match(/addUtilities\(\{([\s\S]*?)\n\s*\}\);/);
  if (addUtilitiesMatch) {
    const body = addUtilitiesMatch[1];
    for (const m of body.matchAll(/^\s*"\.([a-z0-9\-]+)":/gm)) {
      explicitClasses.add(m[1]);
    }
  }

  const extendColorPaths = extractLeafKeys(src, /colors:\s*\{([\s\S]*?)\n\s{10}\},\s*fontFamily/);
  const extendFontPaths = extractLeafKeys(src, /fontFamily:\s*\{([\s\S]*?)\n\s{10}\},\s*spacing/);
  const extendSpacingPaths = extractLeafKeys(
    src,
    /spacing:\s*\{([\s\S]*?)\n\s{10}\},\s*borderRadius/
  );
  const extendRadiusPaths = extractLeafKeys(
    src,
    /borderRadius:\s*\{([\s\S]*?)\n\s{10}\},\s*boxShadow/
  );
  const extendShadowPaths = extractLeafKeys(src, /boxShadow:\s*\{([\s\S]*?)\n\s{10}\},\s*zIndex/);
  const extendOpacityPaths = extractLeafKeys(src, /opacity:\s*\{([\s\S]*?)\n\s{8}\},/);

  return {
    explicitClasses,
    extendColorPaths,
    extendFontPaths,
    extendSpacingPaths,
    extendRadiusPaths,
    extendShadowPaths,
    extendOpacityPaths,
  };
}

function extractLeafKeys(src: string, outerRe: RegExp): Set<string> {
  const m = src.match(outerRe);
  if (!m) return new Set();
  return parseLeafKeys(m[1]);
}

function parseLeafKeys(body: string): Set<string> {
  const out = new Set<string>();
  const lines = body.split("\n");
  const stack: string[] = [];
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("//")) continue;
    const openMatch = line.match(/^([a-zA-Z0-9"\-_]+)\s*:\s*\{$/);
    if (openMatch) {
      stack.push(stripQuotes(openMatch[1]));
      continue;
    }
    if (line.startsWith("}")) {
      stack.pop();
      continue;
    }
    const leafMatch = line.match(/^([a-zA-Z0-9"\-_]+)\s*:\s*["'].*["'],?\s*$/);
    if (leafMatch) {
      const key = stripQuotes(leafMatch[1]);
      const joined = [...stack, key].join(".");
      out.add(joined);
      if (key === "DEFAULT") {
        out.add(stack.join("."));
      }
    }
  }
  return out;
}

function stripQuotes(s: string): string {
  return s.replace(/^["']|["']$/g, "");
}

const TOKEN_PREFIXES = [
  "bg-brand-",
  "text-brand-",
  "border-brand-",
  "bg-surface-",
  "text-surface-",
  "border-surface-",
  "bg-overlay-",
  "text-on-",
  "bg-semantic-",
  "text-semantic-",
  "bg-success",
  "bg-warning",
  "bg-error",
  "bg-info",
  "text-success",
  "text-warning",
  "text-error",
  "text-info",
  "text-h",
  "text-hero",
  "text-body",
  "text-small",
  "text-caption",
  "opacity-disabled",
  "opacity-muted",
  "opacity-overlay",
  "transition-fast",
  "transition-normal",
  "transition-slow",
  "h-nav",
  "pt-nav",
  "mt-nav",
];

function isTokenClass(cls: string): boolean {
  return TOKEN_PREFIXES.some((p) => cls === p || cls.startsWith(p));
}

function isKnownClass(cls: string, reg: TokenRegistry): boolean {
  if (reg.explicitClasses.has(cls)) return true;
  for (const prefix of ["bg-", "text-", "border-"]) {
    if (cls.startsWith(prefix)) {
      const suffix = cls.slice(prefix.length);
      if (reg.extendColorPaths.has(suffix.replace(/-/g, "."))) return true;
      const parts = suffix.split("-");
      for (let i = 1; i < parts.length; i++) {
        const group = parts.slice(0, i).join(".");
        const leaf = parts.slice(i).join(".");
        if (reg.extendColorPaths.has(`${group}.${leaf}`)) return true;
        if (reg.extendColorPaths.has(`${group}.${parts.slice(i).join("-")}`)) return true;
      }
      if (reg.extendColorPaths.has(suffix)) return true;
    }
  }
  return false;
}

function scanDir(dir: string): Map<string, Array<{ file: string; line: number }>> {
  const hits = new Map<string, Array<{ file: string; line: number }>>();
  const exts = new Set([".tsx", ".ts", ".jsx", ".js", ".json", ".md", ".mdx", ".css"]);

  function walk(p: string) {
    if (!fs.existsSync(p)) return;
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      const base = path.basename(p);
      if (
        base === "node_modules" ||
        base === ".next" ||
        base === ".turbo" ||
        base === "dist" ||
        base === "__tests__"
      )
        return;
      for (const entry of fs.readdirSync(p)) {
        walk(path.join(p, entry));
      }
    } else if (stat.isFile()) {
      if (!exts.has(path.extname(p))) return;
      const content = fs.readFileSync(p, "utf8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        for (const m of lines[i].matchAll(/[a-z]{2,}(?:-[a-z0-9]+){2,}/g)) {
          const candidate = m[0];
          if (!isTokenClass(candidate)) continue;
          if (!hits.has(candidate)) hits.set(candidate, []);
          hits.get(candidate)!.push({ file: p, line: i + 1 });
        }
      }
    }
  }
  walk(dir);
  return hits;
}

async function main() {
  const { values } = parseArgs({
    options: {
      scan: { type: "string", multiple: true },
    },
  });

  const scanDirs = (values.scan as string[] | undefined) ?? [];
  if (scanDirs.length === 0) {
    console.error(
      "Usage: tsx tools/visual-parity/preflight-tokens.ts --scan <dir> [--scan <dir>...]"
    );
    process.exit(1);
  }

  const registry = loadRegistry();
  console.log(
    `[preflight-tokens] Registry: ${registry.explicitClasses.size} explicit utilities, ${registry.extendColorPaths.size} extend color paths`
  );

  const findings: Finding[] = [];
  for (const dir of scanDirs) {
    const absDir = path.resolve(dir);
    console.log(`[preflight-tokens] Scanning ${absDir}`);
    const hits = scanDir(absDir);
    for (const [cls, occurrences] of hits) {
      if (!isKnownClass(cls, registry)) {
        for (const occ of occurrences) {
          findings.push({
            class: cls,
            file: occ.file,
            line: occ.line,
            reason: "class is theme-token-shaped but not registered in tailwind-plugin",
          });
        }
      }
    }
  }

  if (findings.length === 0) {
    console.log(`[preflight-tokens] OK. All theme-token-shaped classes are registered.`);
    return;
  }

  const byClass = new Map<string, Finding[]>();
  for (const f of findings) {
    if (!byClass.has(f.class)) byClass.set(f.class, []);
    byClass.get(f.class)!.push(f);
  }
  console.error(
    `[preflight-tokens] FAIL: ${byClass.size} unregistered theme-token-shaped class(es):`
  );
  for (const [cls, fs] of byClass) {
    console.error(`  ${cls}  (${fs.length} occurrence${fs.length === 1 ? "" : "s"})`);
    for (const f of fs.slice(0, 3)) {
      console.error(`    ${path.relative(REPO_ROOT, f.file)}:${f.line}`);
    }
    if (fs.length > 3) console.error(`    ... and ${fs.length - 3} more`);
  }
  process.exit(6);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
