import { NavDarkBand } from "../components/nav-dark-band";
import { HeroHeadlineColoured } from "../components/hero-headline-coloured";
import { HeroEventBanner } from "../components/hero-event-banner";
import { CtaYellowBand } from "../components/cta-yellow-band";
import { CtaBlueBand } from "../components/cta-blue-band";
import { CtaGreenBand } from "../components/cta-green-band";
import { BlogCardGrid } from "../components/blog-card-grid";
import { AboutSplitDark } from "../components/about-split-dark";
import { GalleryPhotoStrip } from "../components/gallery-photo-strip";
import { NewsletterDarkBand } from "../components/newsletter-dark-band";
import { FooterMultiColumn } from "../components/footer-multi-column";

export interface CorvusHomePageProps {
  [key: string]: unknown;
}

export function CorvusHomePage(props: CorvusHomePageProps) {
  return (
    <main>
      <NavDarkBand />
      <HeroHeadlineColoured />
      <HeroEventBanner />
      <CtaYellowBand />
      <CtaBlueBand />
      <CtaGreenBand />
      <BlogCardGrid />
      <AboutSplitDark />
      <GalleryPhotoStrip />
      <NewsletterDarkBand />
      <FooterMultiColumn />
    </main>
  );
}
