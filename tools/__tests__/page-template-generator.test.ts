import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import type {
  PageBlueprint,
  SectionBlueprint,
  ComponentMatch,
  PageSection,
} from "../lib/reference-analysis-types";

// ---------------------------------------------------------------------------
// Mock fs to prevent file-system writes during tests
// ---------------------------------------------------------------------------

vi.mock("fs", () => ({
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock("path", async () => {
  const actual = await vi.importActual<typeof import("path")>("path");
  return {
    ...actual,
    join: (...args: string[]) => args.join("/"),
    dirname: (p: string) => p.split("/").slice(0, -1).join("/"),
  };
});

// Import after mocking so fs writes are intercepted
import { generateExamplePages } from "../lib/page-template-generator";

// Suppress console.log from the generator
beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSectionBlueprint(overrides: Partial<SectionBlueprint> & { id: string }): SectionBlueprint {
  return {
    name: overrides.name ?? overrides.id,
    category: "Content",
    purpose: "test section",
    layoutPattern: "standard",
    contentSlots: ["heading"],
    interactionNeeds: "none",
    componentFileName: `${overrides.id}.tsx`,
    componentExportName: overrides.name ?? overrides.id,
    tokenUsageHints: [],
    confidence: "high",
    referenceSection: "test",
    ...overrides,
  };
}

function makePageSection(blueprintId: string, order: number): PageSection {
  return {
    order,
    blueprintId,
    isShared: false,
  };
}

function makePageBlueprint(overrides: Partial<PageBlueprint>): PageBlueprint {
  return {
    pageType: "home",
    path: "/",
    title: "Home Page",
    sections: [],
    sharedSections: [],
    analysisSource: "html-only",
    confidence: "high",
    routePattern: "/",
    isContentBacked: false,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("generateExamplePages", () => {
  test("uses 'export default function Page()' as the function signature", () => {
    const sectionBp = makeSectionBlueprint({
      id: "hero-1",
      name: "HeroOne",
      componentExportName: "HeroOne",
    });

    const componentMatches = new Map<string, ComponentMatch | null>([
      ["hero-1", {
        componentName: "HeroSection",
        importPath: "@platform/core-components",
        matchConfidence: "exact",
      }],
    ]);

    const pageBlueprint = makePageBlueprint({
      pageType: "home",
      path: "/",
      sections: [makePageSection("hero-1", 0)],
    });

    const result = generateExamplePages(
      [pageBlueprint],
      [sectionBp],
      componentMatches,
      "test-theme",
      "/tmp/output",
    );

    const homePage = result.pages.find((p) => p.pageType === "home");
    expect(homePage).toBeDefined();

    const content = homePage!.content;

    // Must be a default export named Page, not e.g. export function HomePage()
    expect(content).toContain("export default function Page()");
  });

  test("does NOT contain blanket 'use client' directive", () => {
    const sectionBp = makeSectionBlueprint({
      id: "hero-static",
      name: "HeroStatic",
      componentExportName: "HeroStatic",
      interactionNeeds: "none",
    });

    const componentMatches = new Map<string, ComponentMatch | null>([
      ["hero-static", {
        componentName: "HeroSection",
        importPath: "@platform/core-components",
        matchConfidence: "exact",
      }],
    ]);

    const pageBlueprint = makePageBlueprint({
      pageType: "home",
      path: "/",
      sections: [makePageSection("hero-static", 0)],
    });

    const result = generateExamplePages(
      [pageBlueprint],
      [sectionBp],
      componentMatches,
      "test-theme",
      "/tmp/output",
    );

    const homePage = result.pages.find((p) => p.pageType === "home");
    expect(homePage).toBeDefined();

    // Page generator should not add a blanket "use client" directive
    expect(homePage!.content).not.toContain("'use client'");
    expect(homePage!.content).not.toContain('"use client"');
  });

  test("uses barrel import path @platform/themes/<name>/components for unmatched blueprints", () => {
    const unmatchedBp = makeSectionBlueprint({
      id: "custom-widget",
      name: "CustomWidget",
      componentFileName: "custom-widget.tsx",
      componentExportName: "CustomWidget",
    });

    const componentMatches = new Map<string, ComponentMatch | null>([
      ["custom-widget", null],
    ]);

    const pageBlueprint = makePageBlueprint({
      pageType: "home",
      path: "/",
      sections: [makePageSection("custom-widget", 0)],
    });

    const result = generateExamplePages(
      [pageBlueprint],
      [unmatchedBp],
      componentMatches,
      "aurora",
      "/tmp/output",
    );

    const homePage = result.pages.find((p) => p.pageType === "home");
    expect(homePage).toBeDefined();

    const content = homePage!.content;

    // Should use the barrel import path, not individual file paths
    expect(content).toContain('@platform/themes/aurora/components"');
    expect(content).toContain("CustomWidget");
    // Should NOT include individual file path like /custom-widget
    expect(content).not.toContain("@platform/themes/aurora/components/custom-widget");
  });

  test("skips service-detail, blog-post, and location-detail page types", () => {
    const sectionBp = makeSectionBlueprint({ id: "section-1", name: "Section1" });

    const componentMatches = new Map<string, ComponentMatch | null>([
      ["section-1", null],
    ]);

    const skippedTypes = ["service-detail", "blog-post", "location-detail"] as const;
    const blueprints: PageBlueprint[] = skippedTypes.map((pageType) =>
      makePageBlueprint({
        pageType,
        path: `/${pageType}`,
        sections: [makePageSection("section-1", 0)],
      }),
    );

    const result = generateExamplePages(
      blueprints,
      [sectionBp],
      componentMatches,
      "test-theme",
      "/tmp/output",
    );

    // None of the skipped page types should be generated
    expect(result.pages.length).toBe(0);
  });

  test("generates pages that include matched core-component imports", () => {
    const heroBlueprint = makeSectionBlueprint({
      id: "hero-main",
      name: "HeroMain",
      componentExportName: "HeroMain",
      category: "Hero",
    });

    const ctaBlueprint = makeSectionBlueprint({
      id: "cta-bottom",
      name: "CtaBottom",
      componentExportName: "CtaBottom",
      category: "CTA",
    });

    const componentMatches = new Map<string, ComponentMatch | null>([
      ["hero-main", {
        componentName: "HeroWithImage",
        importPath: "@platform/core-components",
        matchConfidence: "exact",
      }],
      ["cta-bottom", {
        componentName: "CTASection",
        importPath: "@platform/core-components",
        matchConfidence: "exact",
      }],
    ]);

    const pageBlueprint = makePageBlueprint({
      pageType: "home",
      path: "/",
      sections: [
        makePageSection("hero-main", 0),
        makePageSection("cta-bottom", 1),
      ],
    });

    const result = generateExamplePages(
      [pageBlueprint],
      [heroBlueprint, ctaBlueprint],
      componentMatches,
      "test-theme",
      "/tmp/output",
    );

    const homePage = result.pages.find((p) => p.pageType === "home");
    expect(homePage).toBeDefined();

    const content = homePage!.content;
    expect(content).toContain("@platform/core-components");
    expect(content).toContain("HeroWithImage");
    expect(content).toContain("CTASection");
  });

  test("wraps page content in a min-h-screen div", () => {
    const sectionBp = makeSectionBlueprint({
      id: "hero-1",
      name: "HeroOne",
      componentExportName: "HeroOne",
    });

    const componentMatches = new Map<string, ComponentMatch | null>([
      ["hero-1", {
        componentName: "HeroSection",
        importPath: "@platform/core-components",
        matchConfidence: "exact",
      }],
    ]);

    const pageBlueprint = makePageBlueprint({
      pageType: "about",
      path: "/about",
      sections: [makePageSection("hero-1", 0)],
    });

    const result = generateExamplePages(
      [pageBlueprint],
      [sectionBp],
      componentMatches,
      "test-theme",
      "/tmp/output",
    );

    const aboutPage = result.pages.find((p) => p.pageType === "about");
    expect(aboutPage).toBeDefined();
    expect(aboutPage!.content).toContain('<div className="min-h-screen">');
  });
});
