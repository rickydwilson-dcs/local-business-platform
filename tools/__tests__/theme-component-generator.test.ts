import { describe, test, expect } from "vitest";
import {
  needsUseClient,
  fixBracketNotationProps,
  hasResidualBracketProps,
  autoRepairHexLiterals,
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

// ---------------------------------------------------------------------------
// autoRepairHexLiterals
// ---------------------------------------------------------------------------

describe("autoRepairHexLiterals", () => {
  test("replaces SVG fill attribute", () => {
    const { content, replacements } = autoRepairHexLiterals('<path fill="#eb1d64" d="M0 0" />');
    expect(content).toBe('<path fill="currentColor" d="M0 0" />');
    expect(replacements).toBe(1);
  });

  test("replaces SVG stroke attribute", () => {
    const { content, replacements } = autoRepairHexLiterals('<circle stroke="#07ab55" />');
    expect(content).toBe('<circle stroke="currentColor" />');
    expect(replacements).toBe(1);
  });

  test("replaces fill in style object", () => {
    const { content, replacements } = autoRepairHexLiterals('style={{ fill: "#eb1d64" }}');
    expect(content).toBe('style={{ fill: "currentColor" }}');
    expect(replacements).toBe(1);
  });

  test("replaces stroke in style object", () => {
    const { content, replacements } = autoRepairHexLiterals('style={{ stroke: "#07ab55" }}');
    expect(content).toBe('style={{ stroke: "currentColor" }}');
    expect(replacements).toBe(1);
  });

  test("replaces Tailwind bg-[#xxx] arbitrary class", () => {
    const { content, replacements } = autoRepairHexLiterals('className="bg-[#fff] px-4"');
    expect(content).toBe('className="bg-brand-primary px-4"');
    expect(replacements).toBe(1);
  });

  test("replaces Tailwind text-[#xxx] arbitrary class", () => {
    const { content, replacements } = autoRepairHexLiterals('className="text-[#1a2b3c]"');
    expect(content).toBe('className="text-surface-foreground"');
    expect(replacements).toBe(1);
  });

  test("replaces Tailwind border-[#xxx] arbitrary class", () => {
    const { content, replacements } = autoRepairHexLiterals('className="border-[#aabbcc]"');
    expect(content).toBe('className="border-brand-primary"');
    expect(replacements).toBe(1);
  });

  test("handles 8-digit hex (alpha channel)", () => {
    const { content, replacements } = autoRepairHexLiterals('<path fill="#eb1d6480" />');
    expect(content).toBe('<path fill="currentColor" />');
    expect(replacements).toBe(1);
  });

  test("repairs multiple contexts in one pass", () => {
    const input = `
      <path fill="#eb1d64" />
      <div style={{ backgroundColor: "#1a2b3c" }} className="text-[#fff]" />
    `;
    const { content, replacements } = autoRepairHexLiterals(input);
    expect(content).not.toContain("#");
    expect(replacements).toBe(3);
  });

  test("does NOT repair CSS custom property hex (returns unchanged)", () => {
    const input = `style={{ '--nav-color': '#eb1d64' }}`;
    const { content, replacements } = autoRepairHexLiterals(input);
    expect(content).toContain("#eb1d64"); // not repaired
    expect(replacements).toBe(0);
  });
});
