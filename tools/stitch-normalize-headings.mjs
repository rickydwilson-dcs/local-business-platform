#!/usr/bin/env node
// CLI args: --dir <path> --h1 "<classes>" --h2 "<classes>" [--enforce]
//
// Report mode (default):
//   - Parse all *.html files in --dir
//   - For each <h1> and <h2>, check class attribute against --h1 / --h2
//   - Print a table:
//     Page         | H1 consistent? | H2 consistent?
//     home.html    | ✓              | ✓
//     about.html   | ✓              | DRIFT: "font-bold" vs "font-extrabold"
//   - Exit 0 if no drift, exit 1 if any drift found
//
// Enforce mode (--enforce):
//   - Same as above, but rewrite drifted class attributes to canonical string
//   - Write modified HTML back to the same file
//   - Log each change: "about.html <h2> line 47: rewrote classes"
//   - Exit 0 always

import fs from 'fs';
import path from 'path';
import process from 'process';

// Typography-relevant class prefixes and exact tokens to extract from class strings
const TYPO_PREFIXES = [
  'font-',
  'text-',
  'tracking-',
  'leading-',
];
const TYPO_EXACT = new Set([
  'uppercase',
  'lowercase',
  'capitalize',
  'normal-case',
]);

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dir') args.dir = argv[++i];
    else if (argv[i] === '--h1') args.h1 = argv[++i] ?? '';
    else if (argv[i] === '--h2') args.h2 = argv[++i] ?? '';
    else if (argv[i] === '--enforce') args.enforce = true;
  }
  return args;
}

function extractTypoClasses(classStr) {
  if (!classStr) return new Set();
  const tokens = classStr.split(/\s+/).filter(Boolean);
  return new Set(
    tokens.filter(t =>
      TYPO_EXACT.has(t) || TYPO_PREFIXES.some(p => t.startsWith(p))
    )
  );
}

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

function diffSummary(elementClasses, canonicalClasses) {
  const missing = [...canonicalClasses].filter(c => !elementClasses.has(c));
  const extra = [...elementClasses].filter(c => !canonicalClasses.has(c));
  const parts = [];
  if (missing.length) parts.push(`missing: ${missing.join(' ')}`);
  if (extra.length) parts.push(`extra: ${extra.join(' ')}`);
  return parts.join(', ');
}

// Replace typography-relevant classes in a full class string with canonical set,
// preserving all other (non-typography) classes.
function replaceTypoClasses(existingClassStr, canonicalClassStr) {
  const existing = existingClassStr.split(/\s+/).filter(Boolean);
  const nonTypo = existing.filter(
    t => !TYPO_EXACT.has(t) && !TYPO_PREFIXES.some(p => t.startsWith(p))
  );
  const canonical = canonicalClassStr.split(/\s+/).filter(Boolean);
  return [...nonTypo, ...canonical].join(' ');
}

// Find all class attributes of a given tag in html, returning array of
// { index, tagStart, classStart, classEnd, classValue, lineNumber }
function findTagClasses(html, tagName) {
  const results = [];
  // Matches <h1 ... class="..." ...> or <h1 class="...">
  const tagRe = new RegExp(`<${tagName}(\\s[^>]*)?>`, 'gi');
  const classRe = /class="([^"]*)"/i;
  let tagMatch;
  while ((tagMatch = tagRe.exec(html)) !== null) {
    const attrStr = tagMatch[1] ?? '';
    const classMatch = classRe.exec(attrStr);
    if (!classMatch) {
      results.push({ tagStart: tagMatch.index, classValue: null, attrOffset: null, attrLen: null });
      continue;
    }
    // Position of class="..." within the full html string
    // attrStr starts at tagMatch.index + 1 + tagName.length (after the '<tagName')
    const attrStrOffset = tagMatch.index + 1 + tagName.length;
    const classAttrStart = attrStrOffset + classMatch.index;
    const classAttrEnd = classAttrStart + classMatch[0].length;
    // Line number (1-based)
    const lineNumber = html.slice(0, tagMatch.index).split('\n').length;
    results.push({
      tagStart: tagMatch.index,
      classAttrStart,
      classAttrEnd,
      classValue: classMatch[1],
      lineNumber,
    });
  }
  return results;
}

// For each heading level, find the modal (most common) class string across a file
function modalClasses(tagMatches) {
  const freq = {};
  for (const m of tagMatches) {
    if (m.classValue === null) continue;
    freq[m.classValue] = (freq[m.classValue] ?? 0) + 1;
  }
  let best = null, bestCount = 0;
  for (const [cls, count] of Object.entries(freq)) {
    if (count > bestCount) { best = cls; bestCount = count; }
  }
  return best;
}

function processFile(filePath, canonH1, canonH2, enforce) {
  let html = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);

  const h1Matches = findTagClasses(html, 'h1');
  const h2Matches = findTagClasses(html, 'h2');

  const canonH1Set = extractTypoClasses(canonH1);
  const canonH2Set = extractTypoClasses(canonH2);

  let h1Status = 'N/A';
  let h2Status = 'N/A';
  let drifted = false;

  // Analyse H1
  if (canonH1 && h1Matches.length > 0) {
    const firstH1 = h1Matches[0];
    if (firstH1.classValue === null) {
      h1Status = 'DRIFT: no class attr';
      drifted = true;
    } else {
      const elemSet = extractTypoClasses(firstH1.classValue);
      if (setsEqual(elemSet, canonH1Set)) {
        h1Status = '✓';
      } else {
        h1Status = `DRIFT: ${diffSummary(elemSet, canonH1Set)}`;
        drifted = true;
        if (enforce && firstH1.classAttrStart != null) {
          const newClassAttr = `class="${replaceTypoClasses(firstH1.classValue, canonH1)}"`;
          html = html.slice(0, firstH1.classAttrStart) + newClassAttr + html.slice(firstH1.classAttrEnd);
          console.log(`  ${filename} <h1> line ${firstH1.lineNumber}: rewrote classes`);
          // Re-parse after rewrite for subsequent operations
        }
      }
    }
  }

  // Analyse H2 (check all, report modal drift)
  if (canonH2 && h2Matches.length > 0) {
    // Re-parse h2 from (possibly modified) html in enforce mode
    const currentH2Matches = enforce ? findTagClasses(html, 'h2') : h2Matches;
    let h2DriftCount = 0;
    let h2DriftDetails = [];
    const rewrites = [];
    for (const m of currentH2Matches) {
      if (m.classValue === null) {
        h2DriftCount++;
        h2DriftDetails.push('no class attr');
        continue;
      }
      const elemSet = extractTypoClasses(m.classValue);
      if (!setsEqual(elemSet, canonH2Set)) {
        h2DriftCount++;
        h2DriftDetails.push(diffSummary(elemSet, canonH2Set));
        if (enforce && m.classAttrStart != null) {
          rewrites.push(m);
        }
      }
    }
    if (h2DriftCount === 0) {
      h2Status = '✓';
    } else {
      h2Status = `DRIFT (${h2DriftCount}/${currentH2Matches.length}): ${h2DriftDetails[0]}`;
      drifted = true;
      if (enforce && rewrites.length > 0) {
        // Rewrite in reverse order to preserve offsets
        const sortedRewrites = [...rewrites].sort((a, b) => b.classAttrStart - a.classAttrStart);
        for (const m of sortedRewrites) {
          const newClassAttr = `class="${replaceTypoClasses(m.classValue, canonH2)}"`;
          html = html.slice(0, m.classAttrStart) + newClassAttr + html.slice(m.classAttrEnd);
          console.log(`  ${filename} <h2> line ${m.lineNumber}: rewrote classes`);
        }
      }
    }
  }

  if (enforce) {
    fs.writeFileSync(filePath, html, 'utf8');
  }

  return { filename, h1Status, h2Status, drifted };
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.dir) {
    console.error('Error: --dir <path> is required');
    process.exit(2);
  }

  if (!fs.existsSync(args.dir)) {
    console.error(`Error: directory not found: ${args.dir}`);
    process.exit(2);
  }

  const canonH1 = args.h1 ?? '';
  const canonH2 = args.h2 ?? '';
  const enforce = args.enforce ?? false;

  const htmlFiles = fs.readdirSync(args.dir)
    .filter(f => f.endsWith('.html'))
    .sort()
    .map(f => path.join(args.dir, f));

  if (htmlFiles.length === 0) {
    console.error(`Error: no .html files found in ${args.dir}`);
    process.exit(2);
  }

  const results = htmlFiles.map(f => processFile(f, canonH1, canonH2, enforce));

  // Print table
  const col0 = Math.max(12, ...results.map(r => r.filename.length)) + 2;
  const col1 = Math.max(16, ...results.map(r => r.h1Status.length)) + 2;
  const col2 = Math.max(16, ...results.map(r => r.h2Status.length)) + 2;

  const header = `${'Page'.padEnd(col0)}| ${'H1 consistent?'.padEnd(col1)}| ${'H2 consistent?'.padEnd(col2)}`;
  const divider = '-'.repeat(header.length);
  console.log('\n' + header);
  console.log(divider);
  for (const r of results) {
    console.log(`${r.filename.padEnd(col0)}| ${r.h1Status.padEnd(col1)}| ${r.h2Status.padEnd(col2)}`);
  }
  console.log('');

  const anyDrift = results.some(r => r.drifted);
  if (anyDrift && !enforce) {
    console.log('Heading drift detected. Run with --enforce to rewrite drifted classes.');
    process.exit(1);
  } else if (!anyDrift) {
    console.log('No drift detected.');
  } else {
    console.log('Enforce complete — drifted classes rewritten.');
  }
  process.exit(0);
}

main();
