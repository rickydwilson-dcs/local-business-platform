import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type {
  PageBlueprint,
  SectionBlueprint,
  ComponentMatch,
  PageSection,
} from "../lib/reference-analysis-types";

// ---------------------------------------------------------------------------
// Mock fs and path to prevent file-system writes during tests
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
import type { GeneratedPage } from "../lib/page-template-generator";

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

function makePageSection(blueprintId: string, order: number, matchedComponent?: ComponentMatch): PageSection {
  return {
    order,
    blueprintId,
    isShared: false,
    matchedComponent,
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
  it("generates TSX content with expected imports for matched components", () => {
    const heroBlueprint = makeSectionBlueprint({
      id: "hero-main",
      name: "HeroMain",
      category: "Hero",
      interactionNeeds: "none",
    });

    const ctaBlueprint = makeSectionBlueprint({
      id: "cta-bottom",
      name: "CtaBottom",
      category: "CTA",
      interactionNeeds: "none",
    });

    const heroMatch: ComponentMatch = {
      componentName: "HeroWithImage",
      importPath: "@platform/core-components",
      matchConfidence: "exact",
    };

    const ctaMatch: ComponentMatch = {
      componentName: "CTASection",
      importPath: "@platform/core-components",
      matchConfidence: "exact",
    };

    const componentMatches = new Map<string, ComponentMatch | null>([
      ["hero-main", heroMatch],
      ["cta-bottom", ctaMatch],
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

    expect(result.pages.length).toBeGreaterThanOrEqual(1);

    const homePage = result.pages.find((p) => p.pageType === "home");
    expect(homePage).toBeDefined();

    const content = homePage!.content;

    // Should contain import for matched core-components
    expect(content).toContain("import");
    expect(content).toContain("@platform/core-components");
    expect(content).toContain("HeroWithImage");
    expect(content).toContain("CTASection");
  });

  it("does not contain hardcoded hex colors in generated output", () => {
    const sectionBp = makeSectionBlueprint({
      id: "section-1",
      name: "Section1",
    });

    const componentMatches = new Map<string, ComponentMatch | null>([
      ["section-1", {
        componentName: "InfoCard",
        importPath: "@platform/core-components",
        matchConfidence: "exact",
      }],
    ]);

    const pageBlueprint = makePageBlueprint({
      pageType: "about",
      path: "/about",
      sections: [makePageSection("section-1", 0)],
    });

    const result = generateExamplePages(
      [pageBlueprint],
      [sectionBp],
      componentMatches,
      "test-theme",
      "/tmp/output",
    );

    const hexPattern = /#[0-9A-Fa-f]{3,8}/;

    for (const page of result.pages) {
      expect(page.content).not.toMatch(hexPattern);
    }
  });

  it("generates pages with correct structure: named function export and div wrapper", () => {
    const sectionBp = makeSectionBlueprint({
      id: "hero-1",
      name: "HeroOne",
      category: "Hero",
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

    // Should have a named function export (not default export)
    expect(content).toMatch(/export function \w+Page\(\)/);

    // Should have the div wrapper with min-h-screen
    expect(content).toContain('<div className="min-h-screen">');
  });

  it("skips page types handled by [slug] routes (service-detail, blog-post, location-detail)", () => {
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

  it("adds 'use client' directive when a section has stateful interaction", () => {
    const statefulBp = makeSectionBlueprint({
      id: "faq-section",
      name: "FaqSection",
      category: "Content",
      interactionNeeds: "stateful",
    });

    const componentMatches = new Map<string, ComponentMatch | null>([
      ["faq-section", {
        componentName: "FAQSection",
        importPath: "@platform/core-components",
        matchConfidence: "exact",
      }],
    ]);

    const pageBlueprint = makePageBlueprint({
      pageType: "about",
      path: "/about",
      sections: [makePageSection("faq-section", 0)],
    });

    const result = generateExamplePages(
      [pageBlueprint],
      [statefulBp],
      componentMatches,
      "test-theme",
      "/tmp/output",
    );

    const aboutPage = result.pages.find((p) => p.pageType === "about");
    expect(aboutPage).toBeDefined();
    expect(aboutPage!.content).toContain('"use client"');
  });

  it("does NOT add 'use client' directive when all sections are non-stateful", () => {
    const nonStatefulBp = makeSectionBlueprint({
      id: "hero-static",
      name: "HeroStatic",
      category: "Hero",
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
      [nonStatefulBp],
      componentMatches,
      "test-theme",
      "/tmp/output",
    );

    const homePage = result.pages.find((p) => p.pageType === "home");
    expect(homePage).toBeDefined();
    expect(homePage!.content).not.toContain('"use client"');
  });

  it("uses theme import path for unmatched blueprints", () => {
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
    // Should import from theme path, not core-components
    expect(content).toContain("@platform/themes/aurora/components/custom-widget");
    expect(content).toContain("CustomWidget");
  });

  it("generates correct output path for different page types", () => {
    const sectionBp = makeSectionBlueprint({ id: "s1", name: "S1" });

    const componentMatches = new Map<string, ComponentMatch | null>([
      ["s1", {
        componentName: "HeroSection",
        importPath: "@platform/core-components",
        matchConfidence: "exact",
      }],
    ]);

    const pageTypes = [
      { pageType: "home" as const, expectedPath: "app/page.tsx" },
      { pageType: "about" as const, expectedPath: "app/about/page.tsx" },
      { pageType: "contact" as const, expectedPath: "app/contact/page.tsx" },
      { pageType: "services-list" as const, expectedPath: "app/services/page.tsx" },
      { pageType: "blog-list" as const, expectedPath: "app/blog/page.tsx" },
      { pageType: "reviews" as const, expectedPath: "app/reviews/page.tsx" },
      { pageType: "pricing" as const, expectedPath: "app/pricing/page.tsx" },
      { pageType: "locations-list" as const, expectedPath: "app/locations/page.tsx" },
    ];

    const blueprints: PageBlueprint[] = pageTypes.map(({ pageType }) =>
      makePageBlueprint({
        pageType,
        path: `/${pageType}`,
        sections: [makePageSection("s1", 0)],
      }),
    );

    const result = generateExamplePages(
      blueprints,
      [sectionBp],
      componentMatches,
      "test-theme",
      "/tmp/output",
    );

    for (const { pageType, expectedPath } of pageTypes) {
      const page = result.pages.find((p) => p.pageType === pageType);
      expect(page, `Expected page for type "${pageType}" to be generated`).toBeDefined();
      expect(page!.outputPath).toBe(expectedPath);
    }
  });
});
