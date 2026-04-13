/**
 * Clone CSS Rule Extractor
 *
 * Extracts CSS rules relevant to a specific HTML section from
 * the clone's CSS files. Used as read-only reference context for
 * AI-based Tailwind translation — the CSS is never loaded at runtime.
 */

import * as fs from "fs";
import * as path from "path";

/**
 * Parse all class names from an HTML fragment.
 */
export function extractClassNamesFromHtml(html: string): string[] {
  // Match class="..." and className="..." attributes
  const classRe = /(?:class|className)="([^"]*)"/gi;
  const classes = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = classRe.exec(html)) !== null) {
    for (const cls of m[1].split(/\s+/).filter(Boolean)) {
      classes.add(cls);
    }
  }
  return [...classes];
}

/**
 * Extract CSS rules from a CSS string that match any of the given class names.
 * Returns the matching rules as a string.
 */
export function extractRulesForClasses(css: string, classNames: string[]): string {
  // Split CSS into individual rules (handle minified CSS)
  // Split on } but keep the } with the rule
  const rules = css
    .split(/\}\s*/)
    .filter(Boolean)
    .map((r) => r.trim() + "}");

  const matching: string[] = [];
  for (const rule of rules) {
    // Check if any class name appears in the selector part (before {)
    const selectorPart = rule.split("{")[0] ?? "";
    for (const cls of classNames) {
      if (selectorPart.includes(`.${cls}`) || selectorPart.includes(cls)) {
        matching.push(rule);
        break;
      }
    }
  }
  return matching.join("\n\n");
}

/**
 * Extract CSS rules relevant to an HTML section from the clone's CSS directory.
 * Returns a focused CSS string suitable for AI context.
 */
export function extractRelevantCssForSection(sectionHtml: string, cssDir: string): string {
  // 1. Parse all class names from the section HTML
  const classNames = extractClassNamesFromHtml(sectionHtml);
  if (classNames.length === 0) return "";

  // 2. Identify which CSS files to read based on Breakdance naming convention
  // bde-{type}-{postId}-{nodeId} → read post-{postId}.css and post-{postId}-defaults.css
  const postIds = new Set<string>();
  for (const cls of classNames) {
    const m = cls.match(/^bde-\w+-(\d+)-\d+$/);
    if (m) postIds.add(m[1]);
  }

  // Build file list: per-post files + always include globals
  const filesToRead: string[] = [];
  for (const id of postIds) {
    filesToRead.push(`post-${id}.css`, `post-${id}-defaults.css`);
  }
  // Always include shared layout/preset files
  filesToRead.push(
    "global-settings.css",
    "presets.css",
    "common-full.css",
    "common-responsive.css"
  );

  // 3. Read each file and extract matching rules
  const allRules: string[] = [];
  for (const filename of filesToRead) {
    const filePath = path.join(cssDir, filename);
    if (!fs.existsSync(filePath)) continue;
    const css = fs.readFileSync(filePath, "utf-8");
    const rules = extractRulesForClasses(css, classNames);
    if (rules.trim()) {
      allRules.push(`/* --- ${filename} --- */\n${rules}`);
    }
  }

  // 4. Truncate if too large (keep under 8KB for AI context)
  let result = allRules.join("\n\n");
  if (result.length > 8000) {
    result = result.slice(0, 8000) + "\n/* ... truncated ... */";
  }

  return result;
}
