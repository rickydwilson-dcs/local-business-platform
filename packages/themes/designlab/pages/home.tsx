import React from "react";
import { NavigationLogoLinksCta } from "../components/navigation-logo-links-cta";
import { HeroSplitImageRight } from "../components/hero-split-image-right";
import { CardsIconGridDark } from "../components/cards-icon-grid-dark";
import { CardsServicesGrid } from "../components/cards-services-grid";
import { CustomPortfolioGallery } from "../components/custom-portfolio-gallery";
import { SocialProofReviews } from "../components/social-proof-reviews";
import { CtaBannerFullWidth } from "../components/cta-banner-full-width";
import { FooterMultiColumn } from "../components/footer-multi-column";

export interface HomePageProps {
  // Add content props as needed
}

export function HomePage(_props: HomePageProps) {
  return (
    <>
      <NavigationLogoLinksCta />
      <HeroSplitImageRight />
      <CardsIconGridDark />
      <CardsServicesGrid />
      <CustomPortfolioGallery />
      <SocialProofReviews />
      <CtaBannerFullWidth />
      <FooterMultiColumn />
    </>
  );
}
