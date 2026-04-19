/**
 * Core Component Catalog
 *
 * Declarative metadata for each core component in packages/core-components.
 * Used by the component matcher to map section blueprints to existing components.
 */

import type { ComponentCategory } from "../../packages/theme-system/src/types";

// ============================================================================
// Types
// ============================================================================

export interface CatalogEntry {
  name: string;
  category: ComponentCategory;
  requiredSlots: string[];
  layoutCues: string[];
  interaction: "none" | "minimal" | "stateful";
  importPath: string;
  composable?: boolean;
}

// ============================================================================
// Catalog
// ============================================================================

export const CORE_COMPONENT_CATALOG: CatalogEntry[] = [
  {
    name: "HeroWithImage",
    category: "Hero",
    requiredSlots: ["heading", "imageSrc", "subheading", "ctaButtons"],
    layoutCues: ["full-bleed", "overlay", "background-image", "dark-full-bleed"],
    interaction: "minimal",
    importPath: "@platform/core-components",
  },
  {
    name: "HeroSection",
    category: "Hero",
    requiredSlots: ["heading", "subheading", "ctaButtons"],
    layoutCues: ["centered", "gradient", "split"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "PageHero",
    category: "Hero",
    requiredSlots: ["heading", "subheading"],
    layoutCues: ["centered", "minimal", "page-header"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "PageHeroImage",
    category: "Hero",
    requiredSlots: ["heading", "imageSrc"],
    layoutCues: ["background-image", "overlay", "page-header"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "CircularIconCard",
    category: "Cards",
    requiredSlots: ["icon", "title", "description"],
    layoutCues: ["icon-circle", "centered", "service-card"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "InfoCard",
    category: "Stats",
    requiredSlots: ["icon", "heading", "text"],
    layoutCues: ["stat-card", "icon", "compact", "shadow"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "ImageOverlayCard",
    category: "Cards",
    requiredSlots: ["imageSrc", "imageAlt", "title", "category"],
    layoutCues: ["image-overlay", "gradient", "hover-effect"],
    interaction: "minimal",
    importPath: "@platform/core-components",
  },
  {
    name: "ContentCard",
    category: "Cards",
    requiredSlots: ["title", "description", "href"],
    layoutCues: ["card", "link", "standard"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "CardGrid",
    category: "Cards",
    requiredSlots: ["cards"],
    layoutCues: ["grid", "responsive", "card-grid"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "CTASection",
    category: "CTA",
    requiredSlots: ["heading", "description", "ctaButton"],
    layoutCues: ["full-bleed", "dark-band", "centered", "brand-background"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "ServiceCTA",
    category: "CTA",
    requiredSlots: ["heading", "description", "ctaButton"],
    layoutCues: ["service-cta", "brand-background", "centered"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "FAQSection",
    category: "Content",
    requiredSlots: ["heading", "faqs"],
    layoutCues: ["accordion", "faq", "expandable"],
    interaction: "stateful",
    importPath: "@platform/core-components",
  },
  {
    name: "TestimonialCard",
    category: "Social Proof",
    requiredSlots: ["quote", "authorName", "rating"],
    layoutCues: ["testimonial", "review", "quote", "star-rating"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "StarRating",
    category: "Social Proof",
    requiredSlots: ["rating"],
    layoutCues: ["stars", "rating", "compact"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "NewsletterSignup",
    category: "CTA",
    requiredSlots: ["heading", "form"],
    layoutCues: ["newsletter", "email-signup", "form"],
    interaction: "stateful",
    importPath: "@platform/core-components",
  },
  {
    name: "Footer",
    category: "Footer",
    requiredSlots: ["links", "copyright", "logo"],
    layoutCues: ["footer", "multi-column", "dark"],
    interaction: "none",
    importPath: "@platform/core-components/src/components/ui/footer",
  },
  {
    name: "SiteHeader",
    category: "Navigation",
    requiredSlots: ["logo", "navLinks", "ctaButton"],
    layoutCues: ["header", "sticky", "navigation", "responsive"],
    interaction: "stateful",
    importPath: "@platform/core-components",
  },
  {
    name: "Breadcrumbs",
    category: "Navigation",
    requiredSlots: ["items"],
    layoutCues: ["breadcrumb", "horizontal", "compact"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "ServiceCards",
    category: "Cards",
    requiredSlots: ["services"],
    layoutCues: ["service-cards", "grid", "link-cards"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "BlogPostCard",
    category: "Blog",
    requiredSlots: ["title", "excerpt", "date", "href"],
    layoutCues: ["blog-card", "article", "image-top"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "DarkStatCard",
    category: "Stats",
    requiredSlots: ["heading", "text"],
    layoutCues: ["dark", "stat", "compact", "inverse"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "PricingPackages",
    category: "Cards",
    requiredSlots: ["packages"],
    layoutCues: ["pricing", "tiers", "comparison"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "PhotoStrip",
    category: "Content",
    requiredSlots: ["images"],
    layoutCues: ["photo-strip", "horizontal", "gallery"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "LargeFeatureCards",
    category: "Cards",
    requiredSlots: ["cards"],
    layoutCues: ["feature", "large", "image-card"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  {
    name: "CapabilityShowcase",
    category: "Content",
    requiredSlots: ["heading", "capabilities"],
    layoutCues: ["showcase", "features", "grid"],
    interaction: "none",
    importPath: "@platform/core-components",
  },
  // Composable section components
  {
    name: "HeroSection",
    category: "Hero",
    requiredSlots: ["heading", "heroImage", "primaryCtaText"],
    layoutCues: ["hero", "full-bleed", "split", "centered", "above-fold"],
    interaction: "none",
    importPath: "@platform/core-components",
    composable: true,
  },
  {
    name: "ServiceCards",
    category: "Cards",
    requiredSlots: ["heading", "services"],
    layoutCues: ["service", "cards", "grid", "icons"],
    interaction: "none",
    importPath: "@platform/core-components",
    composable: true,
  },
  {
    name: "FeatureGrid",
    category: "Cards",
    requiredSlots: ["heading", "features"],
    layoutCues: ["feature", "grid", "icon-cards", "benefits"],
    interaction: "none",
    importPath: "@platform/core-components",
    composable: true,
  },
  {
    name: "TestimonialGrid",
    category: "Social Proof",
    requiredSlots: ["testimonials", "heading"],
    layoutCues: ["testimonials", "reviews", "quotes", "social-proof"],
    interaction: "none",
    importPath: "@platform/core-components",
    composable: true,
  },
  {
    name: "StatsStrip",
    category: "Stats",
    requiredSlots: ["stats"],
    layoutCues: ["stats", "numbers", "strip", "horizontal", "achievements"],
    interaction: "none",
    importPath: "@platform/core-components",
    composable: true,
  },
  {
    name: "CTASection",
    category: "CTA",
    requiredSlots: ["heading", "primaryCtaText"],
    layoutCues: ["cta", "call-to-action", "band", "full-width", "conversion"],
    interaction: "none",
    importPath: "@platform/core-components",
    composable: true,
  },
  {
    name: "ContentSection",
    category: "Content",
    requiredSlots: ["heading", "body"],
    layoutCues: ["content", "text", "split", "prose", "about"],
    interaction: "none",
    importPath: "@platform/core-components",
    composable: true,
  },
];
