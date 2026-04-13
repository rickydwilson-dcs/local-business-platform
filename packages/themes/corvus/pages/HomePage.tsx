import { NavDarkBar } from "../components/nav-dark-bar";
import { HeroHeadlineColoured } from "../components/hero-headline-coloured";
import { HeroEventDetailsOverlay } from "../components/hero-event-details-overlay";
import { CtaYellowBand } from "../components/cta-yellow-band";
import { CtaBlueBand } from "../components/cta-blue-band";
import { CtaGreenBand } from "../components/cta-green-band";
import { BlogCardGrid } from "../components/blog-card-grid";
import { ContentAboutSplit } from "../components/content-about-split";
import { CustomPhotoGalleryStrip } from "../components/custom-photo-gallery-strip";
import { NewsletterSignupBand } from "../components/newsletter-signup-band";
import { FooterMultiColumn } from "../components/footer-multi-column";

export interface CorvusHomePageProps {
  [key: string]: unknown;
}

export function CorvusHomePage(props: CorvusHomePageProps) {
  void props;
  return (
    <main>
      <NavDarkBar />
      <HeroHeadlineColoured />
      <HeroEventDetailsOverlay />
      <CtaYellowBand />
      <CtaBlueBand />
      <CtaGreenBand />
      <BlogCardGrid />
      <ContentAboutSplit />
      <CustomPhotoGalleryStrip />
      <NewsletterSignupBand />
      <FooterMultiColumn />
    </main>
  );
}
