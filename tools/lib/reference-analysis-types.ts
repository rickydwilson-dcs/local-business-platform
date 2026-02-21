/**
 * Reference Analysis Types
 *
 * Schema for the structured output of Claude vision analysis
 * of a reference website screenshot.
 */

export type ComponentCategory =
  | "Hero" | "Navigation" | "Cards" | "CTA" | "Content"
  | "Social Proof" | "Blog" | "Stats" | "Footer" | "Custom";

export interface SectionBlueprint {
  id: string;                    // unique slug, e.g. "hero-full-bleed"
  name: string;                  // PascalCase component name, e.g. "HeroFullBleed"
  category: ComponentCategory;
  purpose: string;               // what this section does
  layoutPattern: string;         // structural description: "full-bleed with overlay" / "2-col grid" / etc.
  contentSlots: string[];        // named content areas: ["heading", "subheading", "ctaButtons", "backgroundImage"]
  interactionNeeds: "none" | "minimal" | "stateful";  // drives Server vs Client Component decision
  componentFileName: string;     // kebab-case: "hero-full-bleed.tsx"
  componentExportName: string;   // PascalCase: "HeroFullBleed"
  tokenUsageHints: string[];     // ["bg-brand-primary", "text-surface-foreground", ...]
  confidence: "high" | "medium" | "low";
  referenceSection: string;      // which detectedSection this maps to
}

export interface ReferenceAnalysis {
  analysisVersion: "1" | "2";
  reference: {
    url?: string;
    screenshotPath?: string;
    capturedAt: string;
  };
  visualLanguage: {
    palette: {
      background: string;
      foreground: string;
      primary: string;
      secondary: string;
      accent: string;
      additional: string[];
      confidence: "high" | "medium" | "low";
    };
    typography: {
      headingWeight: "bold" | "extrabold" | "black";
      bodyWeight: "normal" | "medium";
      headingStyle: "sans" | "serif" | "display";
      usesInlineColourHighlights: boolean;
    };
    heroPattern: {
      type: "dark-full-bleed" | "split" | "centered" | "light";
      hasBackgroundImage: boolean;
      headerDark: boolean;
    };
    spacingDensity: "compact" | "standard" | "spacious";
  };
  detectedSections: Array<{
    name: string;
    background: string;
    layoutType: "full-bleed-band" | "contained" | "split" | "grid" | "strip";
    purpose: "cta" | "info" | "blog" | "about" | "testimonial" | "nav" | "footer" | "sponsor" | "newsletter" | "hero" | "custom";
    notes: string;
  }>;
  sectionBlueprints: SectionBlueprint[];
  registryRecommendation: {
    themeName: string;
    confidence: "high" | "medium" | "low";
    reasoning: string;
  };
  themeTokenRecommendations: {
    brand: {
      primary: string;
      primaryHover: string;
      secondary: string;
      accent: string;
    };
    surface: {
      background: string;
      foreground: string;
      muted: string;
    };
    typography: {
      fontFamilySans: string[];
      fontFamilyHeading: string[];
    };
  };
}

// ── Page Discovery Types ────────────────────────────────────────────────

export type PageType =
  | "home" | "about" | "services-list" | "service-detail"
  | "blog-list" | "blog-post" | "contact" | "locations-list"
  | "location-detail" | "reviews" | "projects" | "pricing" | "custom";

export interface DiscoveredPage {
  url: string;
  path: string;
  source: "sitemap" | "nav" | "probe";
  pageType: PageType;
  title?: string;
  depth: number;
}

// ── Component Matching Types ────────────────────────────────────────────

export interface ComponentMatch {
  componentName: string;
  importPath: string;
  matchConfidence: "exact" | "close" | "partial";
  adaptationNotes?: string;
}

// ── Page Blueprint Types ────────────────────────────────────────────────

export interface PageSection {
  order: number;
  blueprintId: string;
  isShared: boolean;
  matchedComponent?: ComponentMatch;
}

export interface PageBlueprint {
  pageType: PageType;
  path: string;
  title: string;
  sections: PageSection[];
  sharedSections: string[];
  analysisSource: "vision" | "html-only" | "hybrid";
  confidence: "high" | "medium" | "low";
  routePattern: string;
  isContentBacked: boolean;
}

// ── Site Analysis (v3) ──────────────────────────────────────────────────

export interface SiteAnalysis {
  analysisVersion: "3";
  reference: {
    url: string;
    capturedAt: string;
    pagesAnalysed: number;
  };
  discoveredPages: DiscoveredPage[];
  pageBlueprints: PageBlueprint[];
  visualLanguage: ReferenceAnalysis["visualLanguage"];
  sectionBlueprints: SectionBlueprint[];
  componentMatches: ComponentMatch[];
  themeTokenRecommendations: ReferenceAnalysis["themeTokenRecommendations"];
  registryRecommendation: ReferenceAnalysis["registryRecommendation"];
}
