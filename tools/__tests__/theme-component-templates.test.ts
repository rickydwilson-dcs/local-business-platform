import { describe, test, expect } from "vitest";
import {
  generatePropsInterface,
  placeholderComponent,
  serverComponentShell,
  clientComponentShell,
  detectReactImports,
  buildComponentGenerationPrompt,
} from "../lib/theme-component-templates";
import type { SectionBlueprint } from "../lib/reference-analysis-types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// generatePropsInterface
// ---------------------------------------------------------------------------

describe("generatePropsInterface", () => {
  test("produces valid TypeScript for a blueprint with contentSlots", () => {
    const bp = makeBlueprint({
      componentExportName: "HeroSection",
      contentSlots: ["heading", "subheading", "ctaButtons"],
    });

    const result = generatePropsInterface(bp);

    expect(result).toContain("export interface HeroSectionProps {");
    expect(result).toContain("heading?: string;");
    expect(result).toContain("subheading?: string;");
    expect(result).toContain("}");
  });

  test("converts hyphenated slot names to camelCase", () => {
    const bp = makeBlueprint({
      componentExportName: "MediaBlock",
      contentSlots: ["background-image", "hero-title"],
    });

    const result = generatePropsInterface(bp);

    expect(result).toContain("backgroundImage?:");
    expect(result).toContain("heroTitle?:");
    // Should NOT contain the raw hyphenated names as prop identifiers
    expect(result).not.toMatch(/^\s+background-image\?:/m);
    expect(result).not.toMatch(/^\s+hero-title\?:/m);
  });

  test("prefixes slot names starting with digits", () => {
    const bp = makeBlueprint({
      componentExportName: "ModelViewer",
      contentSlots: ["3dModel", "2ndTitle"],
    });

    const result = generatePropsInterface(bp);

    // Digit-leading identifiers must be prefixed with underscore
    expect(result).toContain("_3dModel?:");
    expect(result).toContain("_2ndTitle?:");
  });

  test("infers Array<{ title, description, image, href }> for *Card* slots", () => {
    const bp = makeBlueprint({
      componentExportName: "ServiceGrid",
      contentSlots: ["serviceCards"],
    });

    const result = generatePropsInterface(bp);

    expect(result).toContain("serviceCards?: Array<{ title?:");
    expect(result).toContain("description?:");
    expect(result).toContain("image?:");
    expect(result).toContain("href?:");
  });

  test("infers { src, alt } for *Image* slots", () => {
    const bp = makeBlueprint({
      componentExportName: "HeroImage",
      contentSlots: ["backgroundImage"],
    });

    const result = generatePropsInterface(bp);

    expect(result).toContain("backgroundImage?: { src?: string; alt?: string }");
  });
});

// ---------------------------------------------------------------------------
// placeholderComponent
// ---------------------------------------------------------------------------

describe("placeholderComponent", () => {
  test("returns 'use client' for Navigation category", () => {
    const bp = makeBlueprint({
      category: "Navigation",
      interactionNeeds: "none",
    });

    const result = placeholderComponent(bp);

    expect(result).toContain('"use client"');
  });

  test("returns 'use client' for form-related purposes", () => {
    const bp = makeBlueprint({
      purpose: "Contact form with email validation",
      interactionNeeds: "none",
    });

    const result = placeholderComponent(bp);

    expect(result).toContain('"use client"');
  });

  test("returns 'use client' for newsletter-related purposes", () => {
    const bp = makeBlueprint({
      purpose: "Newsletter signup with email input",
      interactionNeeds: "none",
    });

    const result = placeholderComponent(bp);

    expect(result).toContain('"use client"');
  });

  test("returns 'use client' for stateful interactionNeeds", () => {
    const bp = makeBlueprint({
      interactionNeeds: "stateful",
    });

    const result = placeholderComponent(bp);

    expect(result).toContain('"use client"');
  });

  test("does NOT return 'use client' for non-interactive server content", () => {
    const bp = makeBlueprint({
      category: "Content",
      purpose: "Display team member bios",
      interactionNeeds: "none",
    });

    const result = placeholderComponent(bp);

    expect(result).not.toContain('"use client"');
  });
});

// ---------------------------------------------------------------------------
// serverComponentShell / clientComponentShell
// ---------------------------------------------------------------------------

describe("serverComponentShell", () => {
  test("does NOT include 'use client' directive", () => {
    const bp = makeBlueprint({
      componentExportName: "InfoBlock",
      contentSlots: ["heading", "body"],
    });

    const result = serverComponentShell(bp, "  return <div>hello</div>;");

    expect(result).not.toContain('"use client"');
    expect(result).not.toContain('"use client"');
    expect(result).toContain("export function InfoBlock(");
    expect(result).toContain("InfoBlockProps");
  });
});

describe("clientComponentShell", () => {
  test("includes 'use client' directive and useState import", () => {
    const bp = makeBlueprint({
      componentExportName: "InteractiveWidget",
      contentSlots: ["heading"],
    });

    const result = clientComponentShell(bp, "  return <div>hello</div>;");

    expect(result).toContain('"use client"');
    expect(result).toContain('import { useState } from "react"');
    expect(result).toContain("export function InteractiveWidget(");
    expect(result).toContain("InteractiveWidgetProps");
  });
});

// ---------------------------------------------------------------------------
// detectReactImports
// ---------------------------------------------------------------------------

describe("detectReactImports", () => {
  test('returns ["useState"] for body with no hooks', () => {
    const result = detectReactImports("  return <div>hello</div>;");
    expect(result).toEqual(["useState"]);
  });

  test('returns ["useEffect", "useRef", "useState"] for body containing useEffect and useRef', () => {
    const body = `  useEffect(() => { ref.current?.focus(); }, []);
  const ref = useRef(null);
  return <div ref={ref}>hello</div>;`;
    const result = detectReactImports(body);
    expect(result).toEqual(["useEffect", "useRef", "useState"]);
  });
});

// ---------------------------------------------------------------------------
// buildComponentGenerationPrompt — animation primitives
// ---------------------------------------------------------------------------

describe("buildComponentGenerationPrompt", () => {
  test('output contains "ANIMATION PRIMITIVES"', () => {
    const bp = makeBlueprint({ componentExportName: "HeroSection" });
    const result = buildComponentGenerationPrompt(bp, "HeroSectionProps");
    expect(result).toContain("ANIMATION PRIMITIVES");
  });

  test('output contains "RevealOnScroll"', () => {
    const bp = makeBlueprint({ componentExportName: "HeroSection" });
    const result = buildComponentGenerationPrompt(bp, "HeroSectionProps");
    expect(result).toContain("RevealOnScroll");
  });
});
