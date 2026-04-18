#!/usr/bin/env tsx
/**
 * Checks that core-components don't use hardcoded neutral Tailwind color classes.
 * Allowlist: opacity modifier patterns (bg-black/60 etc.)
 * Run via: pnpm lint
 */
import { execSync } from "child_process";
import * as process from "process";

const SCOPE = "packages/core-components/src/components";
const PATTERN = "text-gray-|bg-white\\b|bg-gray-|bg-black\\b|border-gray-|border-black\\b";
const ALLOWLIST_PATTERN = /(bg|text|border)-(white|black|gray-\d+)\/([\d]+)/; // opacity modifiers OK
const ALLOWLIST_BG_OPACITY = /bg-(white|black)\s+bg-opacity-/; // bg-black bg-opacity-75 style
const ALLOWLIST_HOVER_WHITE = /hover:bg-white\b|hover:text-white\b|border-white\b|text-white\b/; // white on dark/brand bg

const raw = (() => {
  try {
    return execSync(`grep -rn "${PATTERN}" ${SCOPE} --include="*.tsx"`, { encoding: "utf8" });
  } catch {
    return ""; // grep exits 1 when no matches — that's success
  }
})();

const violations = raw
  .split("\n")
  .filter(Boolean)
  .filter((line) => !ALLOWLIST_PATTERN.test(line))
  .filter((line) => !ALLOWLIST_BG_OPACITY.test(line))
  .filter((line) => !ALLOWLIST_HOVER_WHITE.test(line))
  // Exclude gold-standard reference components
  .filter((line) => !/(location-hero|testimonial-card|faq-section)\.tsx/.test(line));

if (violations.length > 0) {
  console.error("\n❌ Hardcoded neutral color classes found in core-components:");
  violations.forEach((v) => console.error(" ", v));
  console.error("\nReplace with theme tokens. See docs/standards/styling.md\n");
  process.exit(1);
}

console.log("✅ No hardcoded neutral color classes found in core-components.");

// --- Composable component quality gates ---
const COMPOSABLE_SCOPE = "packages/core-components/src/components/composable";

function checkComposable(pattern: string, description: string, glob: string): string[] {
  try {
    const out = execSync(`grep -Ern "${pattern}" ${COMPOSABLE_SCOPE} --include="${glob}"`, {
      encoding: "utf8",
    });
    return out.split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

const hexViolations = checkComposable("#[0-9a-fA-F]{6}", "hardcoded hex colors", "*.tsx");
const useClientViolations = checkComposable('"use client"', '"use client" directive', "*.tsx");
const defaultExportViolations = checkComposable("^export default", "default exports", "*.tsx");
const styleAttrViolations = checkComposable("style=\\{", "inline styles", "*.tsx");

let composableOk = true;

if (hexViolations.length > 0) {
  console.error("\n❌ Hardcoded hex colors in composable components:");
  hexViolations.forEach((v) => console.error(" ", v));
  composableOk = false;
}
if (useClientViolations.length > 0) {
  console.error('\n❌ "use client" found in composable Server Components:');
  useClientViolations.forEach((v) => console.error(" ", v));
  composableOk = false;
}
if (defaultExportViolations.length > 0) {
  console.error("\n❌ Default exports found in composable components (use named exports):");
  defaultExportViolations.forEach((v) => console.error(" ", v));
  composableOk = false;
}
if (styleAttrViolations.length > 0) {
  console.error("\n❌ Inline styles found in composable components:");
  styleAttrViolations.forEach((v) => console.error(" ", v));
  composableOk = false;
}

if (composableOk) {
  console.log(
    "✅ Composable components pass quality gates (no hex, no use client, no default exports, no inline styles)."
  );
} else {
  process.exit(1);
}
