/**
 * Designlab Theme — Showcase Registry
 *
 * Auto-generated ElementDefinition entries for the showcase site.
 */

import type { ReactNode } from "react";

import { NavigationLogoLinksCta } from "./components/navigation-logo-links-cta";
import { HeroSplitImageRight } from "./components/hero-split-image-right";
import { CardsIconGridDark } from "./components/cards-icon-grid-dark";
import { CardsServicesGrid } from "./components/cards-services-grid";
import { CustomPortfolioGallery } from "./components/custom-portfolio-gallery";
import { SocialProofReviews } from "./components/social-proof-reviews";
import { CtaBannerFullWidth } from "./components/cta-banner-full-width";
import { FooterMultiColumn } from "./components/footer-multi-column";

export interface ShowcaseElementEntry {
  slug: string;
  name: string;
  category: string;
  description: string;
  themeName: string;
  render: () => ReactNode;
}

export const designlabElements: ShowcaseElementEntry[] = [
  {
    slug: "navigation-logo-links-cta",
    name: "NavigationLogoLinksCta",
    category: "Custom",
    description: "navigation-logo-links-cta",
    themeName: "designlab",
    render: () => <NavigationLogoLinksCta />,
  },
  {
    slug: "hero-split-image-right",
    name: "HeroSplitImageRight",
    category: "Custom",
    description: "hero-split-image-right",
    themeName: "designlab",
    render: () => <HeroSplitImageRight />,
  },
  {
    slug: "cards-icon-grid-dark",
    name: "CardsIconGridDark",
    category: "Custom",
    description: "cards-icon-grid-dark",
    themeName: "designlab",
    render: () => <CardsIconGridDark />,
  },
  {
    slug: "cards-services-grid",
    name: "CardsServicesGrid",
    category: "Custom",
    description: "cards-services-grid",
    themeName: "designlab",
    render: () => <CardsServicesGrid />,
  },
  {
    slug: "custom-portfolio-gallery",
    name: "CustomPortfolioGallery",
    category: "Custom",
    description: "custom-portfolio-gallery",
    themeName: "designlab",
    render: () => <CustomPortfolioGallery />,
  },
  {
    slug: "social-proof-reviews",
    name: "SocialProofReviews",
    category: "Custom",
    description: "social-proof-reviews",
    themeName: "designlab",
    render: () => <SocialProofReviews />,
  },
  {
    slug: "cta-banner-full-width",
    name: "CtaBannerFullWidth",
    category: "Custom",
    description: "cta-banner-full-width",
    themeName: "designlab",
    render: () => <CtaBannerFullWidth />,
  },
  {
    slug: "footer-multi-column",
    name: "FooterMultiColumn",
    category: "Custom",
    description: "footer-multi-column",
    themeName: "designlab",
    render: () => <FooterMultiColumn />,
  },
];
