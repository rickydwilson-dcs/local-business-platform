import React from "react";
import { NavigationLogoLinks } from "../components/navigation-logo-links";
import { HeroSplitImageText } from "../components/hero-split-image-text";
import { CardsThreeColumnFeatures } from "../components/cards-three-column-features";
import { ContentGalleryHeading } from "../components/content-gallery-heading";
import { SocialProofProviderCard } from "../components/social-proof-provider-card";
import { FooterContactInfo } from "../components/footer-contact-info";

export interface HomePageProps {
  // Add content props as needed
}

export function HomePage(_props: HomePageProps) {
  return (
    <>
      <NavigationLogoLinks />
      <HeroSplitImageText />
      <CardsThreeColumnFeatures />
      <ContentGalleryHeading />
      <SocialProofProviderCard />
      <FooterContactInfo />
    </>
  );
}
