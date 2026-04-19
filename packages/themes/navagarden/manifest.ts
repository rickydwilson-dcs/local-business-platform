/**
 * Navagarden Theme — Component Manifest
 *
 * Auto-generated from reference analysis.
 * Maps blueprint metadata for tooling and showcase integration.
 */

import type { ComponentCategory } from "../../theme-system/src/types";

export interface ThemeComponentEntry {
  slug: string;
  name: string;
  category: ComponentCategory;
  exportName: string;
  importPath: string;
}

export const manifest: ThemeComponentEntry[] = [
  {
    slug: "navigation-logo-links",
    name: "NavigationLogoLinks",
    category: "Custom",
    exportName: "NavigationLogoLinks",
    importPath: "./components/navigation-logo-links",
  },
  {
    slug: "hero-split-image-text",
    name: "HeroSplitImageText",
    category: "Custom",
    exportName: "HeroSplitImageText",
    importPath: "./components/hero-split-image-text",
  },
  {
    slug: "cards-three-column-features",
    name: "CardsThreeColumnFeatures",
    category: "Custom",
    exportName: "CardsThreeColumnFeatures",
    importPath: "./components/cards-three-column-features",
  },
  {
    slug: "content-gallery-heading",
    name: "ContentGalleryHeading",
    category: "Custom",
    exportName: "ContentGalleryHeading",
    importPath: "./components/content-gallery-heading",
  },
  {
    slug: "social-proof-provider-card",
    name: "SocialProofProviderCard",
    category: "Custom",
    exportName: "SocialProofProviderCard",
    importPath: "./components/social-proof-provider-card",
  },
  {
    slug: "footer-contact-info",
    name: "FooterContactInfo",
    category: "Custom",
    exportName: "FooterContactInfo",
    importPath: "./components/footer-contact-info",
  },
];
