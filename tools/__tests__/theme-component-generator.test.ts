import { describe, test, expect } from "vitest";
import { needsUseClient } from "../lib/theme-component-generator";
import type { SectionBlueprint } from "../lib/reference-analysis-types";

function makeBlueprint(overrides: Partial<SectionBlueprint>): SectionBlueprint {
  return {
    id: "test-section",
    name: "TestSection",
    category: "Content",
    purpose: "test section for unit tests",
    layoutPattern: "standard",
    contentSlots: ["heading"],
    interactionNeeds: "none",
    componentFileName: "test-section.tsx",
    componentExportName: "TestSection",
    tokenUsageHints: [],
    confidence: "high",
    referenceSection: "test",
    ...overrides,
  };
}

describe("needsUseClient", () => {
  test("returns true when JSX body contains RevealOnScroll", () => {
    const bp = makeBlueprint({});
    const jsxBody = '  return <RevealOnScroll variant="fade-up"><div>Hello</div></RevealOnScroll>;';
    expect(needsUseClient(bp, jsxBody)).toBe(true);
  });

  test("returns true when JSX body contains Carousel", () => {
    const bp = makeBlueprint({});
    const jsxBody = "  return <Carousel autoPlay><div>Slide</div></Carousel>;";
    expect(needsUseClient(bp, jsxBody)).toBe(true);
  });
});
