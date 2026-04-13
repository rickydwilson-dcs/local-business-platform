import { NavDarkBar } from "../components/nav-dark-bar";
import { HeroHeadlineColoured } from "../components/hero-headline-coloured";
import { HeroEventBanner } from "../components/hero-event-banner";
import { CtaSpeakersBand } from "../components/cta-speakers-band";
import { CtaSponsorsBand } from "../components/cta-sponsors-band";
import { CtaVolunteersBand } from "../components/cta-volunteers-band";
import { BlogCardGrid } from "../components/blog-card-grid";
import { AboutSplitDark } from "../components/about-split-dark";
import { GalleryPhotoStrip } from "../components/gallery-photo-strip";
import { NewsletterSignupBand } from "../components/newsletter-signup-band";
import { FooterMultiColumn } from "../components/footer-multi-column";

export interface CorvusHomePageProps {
  [key: string]: unknown;
}

export function CorvusHomePage(props: CorvusHomePageProps) {
  return (
    <main>
      <NavDarkBar
        logo={props.logo}
        eventInfoButton={props.eventInfoButton}
        mobileMenuToggle={props.mobileMenuToggle}
        navLinks={[]}
      />
      <HeroHeadlineColoured
        headingParts={props.headingParts}
        inlineAccentShapes={props.inlineAccentShapes}
        subheading={props.subheading}
      />
      <HeroEventBanner
        backgroundImage={{ src: "", alt: "" }}
        eventLogo={props.eventLogo}
        eventDate={props.eventDate}
        eventTime={props.eventTime}
      />
      <CtaSpeakersBand
        heading={props.heading}
        bodyText={props.bodyText}
        ctaButton={props.ctaButton}
      />
      <CtaSponsorsBand
        heading={props.heading}
        bodyText={props.bodyText}
        ctaButton={props.ctaButton}
      />
      <CtaVolunteersBand
        heading={props.heading}
        bodyText={props.bodyText}
        ctaButton={props.ctaButton}
      />
      <BlogCardGrid
        sectionHeading={props.sectionHeading}
        blogCards={[]}
        cardThumbnail={props.cardThumbnail}
        cardTitle={props.cardTitle}
      />
      <AboutSplitDark
        heading={props.heading}
        bodyText={props.bodyText}
        ctaButton={props.ctaButton}
      />
      <GalleryPhotoStrip photos={{ src: "", alt: "" }} />
      <NewsletterSignupBand
        heading={props.heading}
        subtext={props.subtext}
        emailInput={props.emailInput}
        submitButton={props.submitButton}
      />
      <FooterMultiColumn
        logo={props.logo}
        linkColumns={props.linkColumns}
        columnHeadings={props.columnHeadings}
        columnLinks={[]}
      />
    </main>
  );
}
