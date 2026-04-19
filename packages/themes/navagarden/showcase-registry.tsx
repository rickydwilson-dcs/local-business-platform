/**
 * Navagarden Theme — Showcase Registry
 *
 * Auto-generated ElementDefinition entries for the showcase site.
 */

import type { ReactNode } from "react";

import { NavigationLogoLinks } from "./components/navigation-logo-links";
import { HeroSplitImageText } from "./components/hero-split-image-text";
import { CardsThreeColumnFeatures } from "./components/cards-three-column-features";
import { ContentGalleryHeading } from "./components/content-gallery-heading";
import { SocialProofProviderCard } from "./components/social-proof-provider-card";
import { FooterContactInfo } from "./components/footer-contact-info";

export interface ShowcaseElementEntry {
  slug: string;
  name: string;
  category: string;
  description: string;
  themeName: string;
  render: () => ReactNode;
}

export const navagardenElements: ShowcaseElementEntry[] = [
  {
    slug: "navigation-logo-links",
    name: "NavigationLogoLinks",
    category: "Custom",
    description: "navigation-logo-links",
    themeName: "navagarden",
    render: () => <NavigationLogoLinks />,
  },
  {
    slug: "hero-split-image-text",
    name: "HeroSplitImageText",
    category: "Custom",
    description: "hero-split-image-text",
    themeName: "navagarden",
    render: () => <HeroSplitImageText />,
  },
  {
    slug: "cards-three-column-features",
    name: "CardsThreeColumnFeatures",
    category: "Custom",
    description: "cards-three-column-features",
    themeName: "navagarden",
    render: () => <CardsThreeColumnFeatures />,
  },
  {
    slug: "content-gallery-heading",
    name: "ContentGalleryHeading",
    category: "Custom",
    description: "content-gallery-heading",
    themeName: "navagarden",
    render: () => <ContentGalleryHeading />,
  },
  {
    slug: "social-proof-provider-card",
    name: "SocialProofProviderCard",
    category: "Custom",
    description: "social-proof-provider-card",
    themeName: "navagarden",
    render: () => <SocialProofProviderCard />,
  },
  {
    slug: "footer-contact-info",
    name: "FooterContactInfo",
    category: "Custom",
    description: "footer-contact-info",
    themeName: "navagarden",
    render: () => <FooterContactInfo />,
  },
];
