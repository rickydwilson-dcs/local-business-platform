export type PageType =
  | "home"
  | "about"
  | "services-list"
  | "service-detail"
  | "location-detail"
  | "blog-list"
  | "blog-post"
  | "contact"
  | "projects"
  | "custom";

export const COMPONENT_NAMES = [
  "HeroSection",
  "ServiceCards",
  "FeatureGrid",
  "TestimonialGrid",
  "StatsStrip",
  "CTASection",
  "ContentSection",
  "FAQSection",
  "ContactSection",
  "ImageGridSection",
  "BlogGrid",
  "ProjectGrid",
  "PricingTable",
  "TextSection",
  "CategoryCardsSection",
  "ServiceListSection",
  "LocationPillsSection",
  "WhyChooseUsSection",
  "EmergencyBanner",
  "RateCardsSection",
  "CountyGatewayCards",
  "TownFinderSection",
  "LocalAuthorityExpertise",
  "CoverageMapSection",
  "PricingPackagesSection",
] as const;

export type ComponentName = (typeof COMPONENT_NAMES)[number];

export interface ConditionConfig {
  type: "always" | "flag" | "data-present";
  key?: string;
  equals?: string | boolean | number;
}

export interface RenderDiagnostic {
  sectionIndex: number;
  component: string;
  error: string;
  severity: "warning" | "error";
}

export interface RenderResult {
  elements: React.ReactElement[];
  diagnostics: RenderDiagnostic[];
}

export interface LayoutParams {
  columns?: 1 | 2 | 3 | 4;
  background?: "surface" | "subtle" | "inverse" | "brand" | "muted" | "image";
  paddingY?: "compact" | "standard" | "spacious";
  align?: "left" | "center" | "right" | "split";
  maxItems?: number;
  fullBleed?: boolean;
  mediaPosition?: "left" | "right" | "top" | "bottom";
}

export interface BaseSectionConfig {
  id?: string;
  component: ComponentName;
  slots?: Record<string, boolean>;
  layout?: LayoutParams;
  condition?: ConditionConfig;
  /** Key into the top-level data object whose value is merged over the base data for this section */
  dataKey?: string;
}

export interface PageComposition {
  pageType: PageType | string;
  sections: BaseSectionConfig[];
}

export type LayoutComponentName = "OrionHeader" | "OrionFooter" | string;
// string union allows sites to register custom names; LayoutComponentName
// documents the known built-in names for IDE autocomplete.

export interface LayoutBlockConfig {
  component: LayoutComponentName;
  slots?: Record<string, boolean>;
  dataKey?: string; // key in siteData whose value is spread as props
}

export interface SiteCompositionConfig {
  version: "1";
  siteId: string;
  defaultSlots?: Record<string, Record<string, boolean>>;
  headerConfig?: LayoutBlockConfig;
  footerConfig?: LayoutBlockConfig;
  pages: PageComposition[];
}
