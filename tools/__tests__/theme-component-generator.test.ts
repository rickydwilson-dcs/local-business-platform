import { describe, test, expect } from "vitest";
import {
  needsUseClient,
  fixBracketNotationProps,
  hasResidualBracketProps,
} from "../lib/theme-component-generator";
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

// ---------------------------------------------------------------------------
// fixBracketNotationProps
// ---------------------------------------------------------------------------

describe("fixBracketNotationProps", () => {
  test("rewrites single-quote bracket notation to dot notation (camelCase)", () => {
    const { content, fixCount } = fixBracketNotationProps("props['event-info-cta']");
    expect(content).toBe("props.eventInfoCta");
    expect(fixCount).toBe(1);
  });

  test("rewrites double-quote bracket notation to dot notation (camelCase)", () => {
    const { content, fixCount } = fixBracketNotationProps('props["cta-button"]');
    expect(content).toBe("props.ctaButton");
    expect(fixCount).toBe(1);
  });

  test("rewrites bracket access but preserves subsequent array index", () => {
    const { content, fixCount } = fixBracketNotationProps("props['items'][0]");
    expect(content).toBe("props.items[0]");
    expect(fixCount).toBe(1);
  });

  test("does not modify dot notation — returns unchanged with fixCount 0", () => {
    const { content, fixCount } = fixBracketNotationProps("props.heading");
    expect(content).toBe("props.heading");
    expect(fixCount).toBe(0);
  });

  test("handles multiple occurrences", () => {
    const { content, fixCount } = fixBracketNotationProps(
      "props['background-image'] + props['cta-text']"
    );
    expect(content).toBe("props.backgroundImage + props.ctaText");
    expect(fixCount).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// hasResidualBracketProps
// ---------------------------------------------------------------------------

describe("hasResidualBracketProps", () => {
  test("returns false for dot notation", () => {
    expect(hasResidualBracketProps("props.heading")).toBe(false);
  });

  test("returns true when bracket notation remains", () => {
    expect(hasResidualBracketProps("props['still-here']")).toBe(true);
  });

  test("returns false for non-props bracket access", () => {
    expect(hasResidualBracketProps('items["key"]')).toBe(false);
  });
});
