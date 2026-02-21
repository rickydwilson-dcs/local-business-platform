import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { SELECTOR_STRATEGIES } from "../lib/computed-style-extractor";
import type { ElementRole } from "../lib/reference-analysis-types";

const extractorSource = fs.readFileSync(
  path.resolve(__dirname, "../lib/computed-style-extractor.ts"),
  "utf8",
);

describe("SELECTOR_STRATEGIES", () => {
  const allRoles: ElementRole[] = [
    "page-background", "header", "nav-link",
    "hero-section", "hero-heading", "hero-subheading",
    "primary-button", "secondary-button",
    "heading-h1", "heading-h2", "heading-h3", "heading-h4",
    "body-text", "card", "section", "footer", "link",
  ];

  it("covers all ElementRole values", () => {
    const coveredRoles = new Set(SELECTOR_STRATEGIES.map((s) => s.role));
    for (const role of allRoles) {
      expect(coveredRoles.has(role), `Missing strategy for role: ${role}`).toBe(true);
    }
  });

  it("page-background has at least 1 selector", () => {
    const strat = SELECTOR_STRATEGIES.find((s) => s.role === "page-background");
    expect(strat).toBeDefined();
    expect(strat!.selectors.length).toBeGreaterThanOrEqual(1);
  });

  it("header has at least 1 selector", () => {
    const strat = SELECTOR_STRATEGIES.find((s) => s.role === "header");
    expect(strat).toBeDefined();
    expect(strat!.selectors.length).toBeGreaterThanOrEqual(1);
  });

  it("hero-heading has at least 1 selector", () => {
    const strat = SELECTOR_STRATEGIES.find((s) => s.role === "hero-heading");
    expect(strat).toBeDefined();
    expect(strat!.selectors.length).toBeGreaterThanOrEqual(1);
  });

  it("primary-button has at least 1 selector", () => {
    const strat = SELECTOR_STRATEGIES.find((s) => s.role === "primary-button");
    expect(strat).toBeDefined();
    expect(strat!.selectors.length).toBeGreaterThanOrEqual(1);
  });

  it("footer has at least 1 selector", () => {
    const strat = SELECTOR_STRATEGIES.find((s) => s.role === "footer");
    expect(strat).toBeDefined();
    expect(strat!.selectors.length).toBeGreaterThanOrEqual(1);
  });

  it("all strategies have a non-empty properties array", () => {
    for (const strat of SELECTOR_STRATEGIES) {
      expect(strat.properties.length, `Empty properties for role: ${strat.role}`).toBeGreaterThan(0);
    }
  });
});

describe("extractComputedStyles function", () => {
  it("is exported from the module", () => {
    expect(extractorSource).toContain("export async function extractComputedStyles");
  });

  it("contains an RGB-to-hex conversion helper inside the evaluate payload", () => {
    expect(extractorSource).toContain("function rgbToHex");
  });
});
