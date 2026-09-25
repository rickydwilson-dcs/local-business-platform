#!/usr/bin/env npx tsx
/**
 * find-dead-code.ts — reachability audit for a site in this monorepo.
 *
 * WHY THIS EXISTS
 *
 * When a site is redesigned in place (DCS's solaris -> r9 migration is the
 * reference case), the old components stop being imported but are rarely
 * deleted: each port phase leaves them "out of scope", and nothing ever fails.
 * They are invisible to every gate we run — type-check passes (the files are
 * valid), lint passes (they are not errors), and the tests never import them.
 * The hand-written CSS that styled them keeps shipping to every visitor,
 * because Tailwind's purge only removes UTILITIES it generates, never authored
 * rules in globals.css. Dead runtime scripts in the root layout keep executing.
 *
 * DCS, September 2026: 8 orphaned page components (1,383 lines), ~25 dead CSS
 * classes, a dead IntersectionObserver running on every page, and a
 * cross-origin Google Fonts request for an icon font no live page used.
 *
 * WHAT IT DOES
 *
 * 1. Walks the import graph from the site's real entry points (everything
 *    Next.js routes: app/**\/page.tsx, layout.tsx, route.ts, not-found.tsx,
 *    sitemap.ts, plus test files) and reports every .ts/.tsx file under
 *    components/ and lib/ that nothing reaches.
 * 2. Reports every class selector authored in the site's own .css files that
 *    no source file references.
 *
 * WHAT IT DOES NOT DO
 *
 * It does not delete anything, and it is not a linter. Treat output as
 * CANDIDATES — a class can be constructed dynamically, and a component can be
 * loaded by a string path. Verify before removing. It deliberately reports
 * candidates rather than failing, because a false positive that blocks CI is
 * worse than one that prints a line.
 *
 * USAGE
 *   npx tsx tools/find-dead-code.ts --site sites/dcs
 *   npx tsx tools/find-dead-code.ts --all
 *   npx tsx tools/find-dead-code.ts --all --json
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

interface SiteReport {
  site: string;
  orphanFiles: { file: string; lines: number }[];
  deadClasses: { cls: string; file: string }[];
  dynamicClasses: { cls: string; file: string }[];
  totalOrphanLines: number;
}

function walk(dir: string, filter: (p: string) => boolean, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, filter, out);
    } else if (filter(full)) {
      out.push(full);
    }
  }
  return out;
}

/** Resolve an import specifier to a real file inside the site, or null. */
function resolveImport(spec: string, fromFile: string, siteDir: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = path.join(siteDir, spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(fromFile), spec);
  else return null; // bare package import

  const candidates = [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    path.join(base, "index.tsx"),
    path.join(base, "index.ts"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

const IMPORT_RE = /(?:from\s+|import\s*\(\s*)['"]([^'"]+)['"]/g;

function auditSite(siteDir: string): SiteReport {
  const rel = path.relative(ROOT, siteDir);
  const isSource = (p: string) => /\.(tsx|ts)$/.test(p) && !/\.d\.ts$/.test(p);

  // Entry points: anything Next.js itself routes, plus tests (a component kept
  // solely for a test is not dead, it is tested).
  const appFiles = walk(path.join(siteDir, "app"), isSource);
  // Any test file is an entry point, wherever it lives — a module kept solely
  // for a test is tested, not dead. This must include CO-LOCATED tests
  // (`lib/foo/bar.test.ts`), not just a `test/` directory: dch-automotive keeps
  // `lib/car-remaps/parsers.test.ts` beside its subject, and scanning only
  // `test/` reported both the test AND the 552-line module it covers as dead.
  const isTest = (p: string) => /\.(test|spec)\.(ts|tsx)$/.test(p);
  const testFiles = [
    ...walk(path.join(siteDir, "test"), isSource),
    ...walk(path.join(siteDir, "e2e"), isSource),
    ...walk(path.join(siteDir, "lib"), (f) => isSource(f) && isTest(f)),
    ...walk(path.join(siteDir, "components"), (f) => isSource(f) && isTest(f)),
    ...walk(path.join(siteDir, "app"), (f) => isSource(f) && isTest(f)),
  ];
  const entries = [...appFiles, ...testFiles];

  // Reachability from entries.
  const reached = new Set<string>();
  const queue = [...entries];
  while (queue.length) {
    const file = queue.pop()!;
    if (reached.has(file)) continue;
    reached.add(file);
    let src: string;
    try {
      src = fs.readFileSync(file, "utf-8");
    } catch {
      continue;
    }
    for (const m of src.matchAll(IMPORT_RE)) {
      const target = resolveImport(m[1], file, siteDir);
      if (target && !reached.has(target)) queue.push(target);
    }
  }

  // Candidate files: everything under components/ and lib/.
  const candidates = [
    ...walk(path.join(siteDir, "components"), isSource),
    ...walk(path.join(siteDir, "lib"), isSource),
  ].filter((f) => !f.includes("__tests__") && !/\.(test|spec)\.(ts|tsx)$/.test(f));

  const orphanFiles = candidates
    .filter((f) => !reached.has(f))
    .map((f) => ({
      file: path.relative(siteDir, f),
      lines: fs.readFileSync(f, "utf-8").split("\n").length,
    }))
    .sort((a, b) => b.lines - a.lines);

  // --- dead authored CSS classes -------------------------------------------
  // Only the site's OWN stylesheets, and only class selectors written at the
  // start of a line (a rule the author wrote), never Tailwind's generated
  // utilities.
  const cssFiles = [
    ...walk(path.join(siteDir, "app"), (p) => p.endsWith(".css")),
    ...walk(path.join(siteDir, "styles"), (p) => p.endsWith(".css")),
  ];

  // All source text that could reference a class.
  const sourceText = [
    ...walk(path.join(siteDir, "app"), isSource),
    ...walk(path.join(siteDir, "components"), isSource),
    ...walk(path.join(siteDir, "lib"), isSource),
    ...walk(path.join(siteDir, "content"), (p) => p.endsWith(".mdx")),
  ]
    .map((f) => {
      try {
        return fs.readFileSync(f, "utf-8");
      } catch {
        return "";
      }
    })
    .join("\n");

  // Class names the source BUILDS at runtime, e.g. `svccard svccard--${color}`
  // or `cf--${ground}`. The literal `svccard--magenta` never appears in any
  // file, so a naive scan reports every variant as dead — it is the single
  // biggest false-positive source in this kind of audit. Collect the prefixes
  // and treat any class starting with one as dynamic, not dead.
  const dynamicPrefixes = [...sourceText.matchAll(/([a-zA-Z][-a-zA-Z0-9_]*?)\$\{/g)]
    .map((m) => m[1])
    .filter(Boolean);

  const deadClasses: { cls: string; file: string }[] = [];
  const dynamicClasses: { cls: string; file: string }[] = [];
  for (const cssFile of cssFiles) {
    const css = fs.readFileSync(cssFile, "utf-8");
    const seen = new Set<string>();
    for (const m of css.matchAll(/^\.([a-zA-Z][-a-zA-Z0-9_]*)/gm)) {
      const cls = m[1];
      if (seen.has(cls)) continue;
      seen.add(cls);
      if (sourceText.includes(cls)) continue; // referenced literally
      const rel2 = path.relative(siteDir, cssFile);
      if (dynamicPrefixes.some((p) => p.length > 2 && cls.startsWith(p))) {
        dynamicClasses.push({ cls, file: rel2 });
      } else {
        deadClasses.push({ cls, file: rel2 });
      }
    }
  }

  return {
    site: rel,
    orphanFiles,
    deadClasses,
    dynamicClasses,
    totalOrphanLines: orphanFiles.reduce((n, o) => n + o.lines, 0),
  };
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  let siteDirs: string[] = [];

  if (args.includes("--all")) {
    const sitesRoot = path.join(ROOT, "sites");
    siteDirs = fs
      .readdirSync(sitesRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => path.join(sitesRoot, d.name));
  } else {
    const i = args.indexOf("--site");
    if (i === -1 || !args[i + 1]) {
      console.error("usage: find-dead-code.ts --site sites/<name> | --all [--json]");
      process.exit(2);
    }
    siteDirs = [path.resolve(ROOT, args[i + 1])];
  }

  const reports = siteDirs.map(auditSite);

  if (json) {
    console.log(JSON.stringify(reports, null, 2));
    return;
  }

  for (const r of reports) {
    const clean = r.orphanFiles.length === 0 && r.deadClasses.length === 0;
    console.log(`\n${"=".repeat(72)}\n${r.site}${clean ? "  — clean" : ""}\n${"=".repeat(72)}`);
    if (r.orphanFiles.length) {
      console.log(`\nUNREACHABLE FILES (${r.orphanFiles.length}, ${r.totalOrphanLines} lines)`);
      console.log("  nothing routed by Next.js, and no test, imports these:\n");
      for (const o of r.orphanFiles) console.log(`    ${String(o.lines).padStart(5)}  ${o.file}`);
    }
    if (r.deadClasses.length) {
      console.log(`\nAUTHORED CSS CLASSES WITH NO SOURCE REFERENCE (${r.deadClasses.length})`);
      console.log("  these ship to every visitor; Tailwind purge never removes them:\n");
      const byFile = new Map<string, string[]>();
      for (const d of r.deadClasses) {
        if (!byFile.has(d.file)) byFile.set(d.file, []);
        byFile.get(d.file)!.push(`.${d.cls}`);
      }
      for (const [f, cls] of byFile) console.log(`    ${f}\n      ${cls.join(" ")}`);
    }
    if (r.dynamicClasses.length) {
      console.log(
        `\nPROBABLY FINE — ${r.dynamicClasses.length} class(es) match a runtime-built name`
      );
      console.log(
        "  the source builds these with a template literal, so the literal never appears:\n"
      );
      console.log(`    ${r.dynamicClasses.map((d) => `.${d.cls}`).join(" ")}`);
    }
  }
  console.log("\nCandidates, not findings — verify before deleting. See this file’s header.\n");
}

main();
