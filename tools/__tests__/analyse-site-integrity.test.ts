import { describe, test, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/**
 * Analyse-site.ts Integrity Tests
 *
 * Verify structural patterns in the pipeline entry point.
 */

const analyseSiteSource = fs.readFileSync(
  path.resolve(__dirname, "../analyse-site.ts"),
  "utf8",
);

// ---------------------------------------------------------------------------
// dotenv loading (Finding 1)
// ---------------------------------------------------------------------------

describe("dotenv configuration", () => {
  test("does NOT use bare import 'dotenv/config' (misses .env.local)", () => {
    // The bare ESM import only loads .env, not .env.local
    expect(analyseSiteSource).not.toContain('import "dotenv/config"');
    expect(analyseSiteSource).not.toContain("import 'dotenv/config'");
  });

  test("loads .env.local explicitly", () => {
    expect(analyseSiteSource).toContain(".env.local");
  });
});

// ---------------------------------------------------------------------------
// API key handling (Finding 9)
// ---------------------------------------------------------------------------

describe("API key handling", () => {
  test("exits with error when API key is missing (not just a warning)", () => {
    // Should call process.exit(1) when key is missing and --html-only is not set
    expect(analyseSiteSource).toContain("process.exit(1)");
  });

  test("supports --html-only flag for degraded mode", () => {
    expect(analyseSiteSource).toContain("--html-only");
    expect(analyseSiteSource).toContain("htmlOnly");
  });

  test("htmlOnly is in the CliArgs interface", () => {
    // The CliArgs interface must include the htmlOnly boolean
    expect(analyseSiteSource).toMatch(/interface CliArgs[\s\S]*?htmlOnly:\s*boolean/);
  });
});
