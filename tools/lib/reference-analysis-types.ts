/**
 * Reference Analysis Types
 *
 * Schema for the structured output of Claude vision analysis
 * of a reference website screenshot.
 */

export interface ReferenceAnalysis {
  analysisVersion: "1";
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
  componentMappings: Array<{
    section: string;
    status: "REUSE" | "ADAPT" | "NEW";
    existingComponent: string | null;
    notes: string;
    confidence: "high" | "medium" | "low";
  }>;
  newComponentBacklog: Array<{
    name: string;
    description: string;
    propsContract: string;
    tokenConstraints: string;
    acceptanceCriteria: string[];
    referenceSection: string;
  }>;
  registryRecommendation: {
    themeName: string;
    heroVariant: "image-overlay" | "split" | "minimal";
    headerVariant: "dark" | "light";
    cardVariant: "icon-circle" | "standard" | "overlay";
    sectionVariant: "dark-accent" | "gradient" | "standard" | "banded";
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
