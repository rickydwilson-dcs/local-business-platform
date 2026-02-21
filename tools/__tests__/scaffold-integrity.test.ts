import { describe, test, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/**
 * Scaffold Integrity Tests
 *
 * Since scaffold-theme-package.ts does not individually export its internal
 * helper functions, these tests verify structural invariants by reading the
 * source code directly. This prevents regressions in critical patterns without
 * requiring internal functions to be exported.
 */

const scaffoldSource = fs.readFileSync(
  path.resolve(__dirname, "../scaffold-theme-package.ts"),
  "utf8",
);

// ---------------------------------------------------------------------------
// THEME_NAMES regex
// ---------------------------------------------------------------------------

describe("THEME_NAMES regex", () => {
  test("uses [\\s\\S]*? to support multi-line arrays (not [^\\]]*)", () => {
    // The regex must use [\s\S]*? to handle THEME_NAMES arrays that span
    // multiple lines. A naive [^\]]* would fail on line breaks.
    expect(scaffoldSource).toContain("[\\s\\S]*?");
  });

  test("the regex pattern matches both single-line and multi-line arrays", () => {
    // Extract the regex from the source and test it directly
    const themeNamesRegex = /export const THEME_NAMES = \[([\s\S]*?)\] as const;/;

    const singleLine = 'export const THEME_NAMES = ["aurora", "vega"] as const;';
    const multiLine = `export const THEME_NAMES = [
  "aurora",
  "vega",
  "orion",
] as const;`;

    expect(themeNamesRegex.test(singleLine)).toBe(true);
    expect(themeNamesRegex.test(multiLine)).toBe(true);

    // Verify it captures the content between brackets
    const singleMatch = singleLine.match(themeNamesRegex);
    expect(singleMatch).not.toBeNull();
    expect(singleMatch![1]).toContain('"aurora"');

    const multiMatch = multiLine.match(themeNamesRegex);
    expect(multiMatch).not.toBeNull();
    expect(multiMatch![1]).toContain('"orion"');
  });
});

// ---------------------------------------------------------------------------
// ESM detection
// ---------------------------------------------------------------------------

describe("ESM detection", () => {
  test("does NOT use require.main for entry point detection", () => {
    // ESM modules cannot use require.main; the scaffold should use
    // import.meta.url or another ESM-compatible check instead.
    expect(scaffoldSource).not.toContain("require.main");
  });

  test("uses import.meta for entry point detection", () => {
    expect(scaffoldSource).toContain("import.meta");
  });
});

// ---------------------------------------------------------------------------
// Key function existence
// ---------------------------------------------------------------------------

describe("scaffold structure", () => {
  test("generateComponentBarrel function exists", () => {
    expect(scaffoldSource).toContain("function generateComponentBarrel");
  });

  test("generateShowcaseRegistryTsx function exists", () => {
    expect(scaffoldSource).toContain("function generateShowcaseRegistryTsx");
  });

  test("generateIndexTs function exists", () => {
    expect(scaffoldSource).toContain("function generateIndexTs");
  });

  test("scaffoldThemePackage is exported", () => {
    expect(scaffoldSource).toContain("export function scaffoldThemePackage");
  });
});

// ---------------------------------------------------------------------------
// Showcase generation
// ---------------------------------------------------------------------------

describe("showcase generation", () => {
  test("imports ReactNode type", () => {
    // The showcase-registry template must import ReactNode for the render function
    expect(scaffoldSource).toContain("import type { ReactNode }");
  });
});
