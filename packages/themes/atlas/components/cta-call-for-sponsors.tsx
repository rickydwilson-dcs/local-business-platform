"use client";

/**
 * CallForSponsors
 *
 * Invites potential sponsors to support the event
 * Layout: Full-width blue background, heading and text right-aligned, CTA button
 * Category: CTA
 */

import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CallForSponsorsProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-text */
  bodyText?: string;
  /** sponsor-levels-cta-button */
  sponsorLevelsCtaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForSponsors(props: CallForSponsorsProps) {
  return (
    <section className="w-full bg-brand-secondary py-16 px-4 md:py-24">
      <div className="max-w-7xl mx-auto flex flex-col items-end text-right">
        <RevealOnScroll variant="fade-up">
          <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-2xl">
            {props.sectionHeading ?? 'Become a Sponsor'}
          </h2>
          <p className="text-on-brand-primary text-base md:text-lg lg:text-xl max-w-xl mb-10 opacity-90">
            {props.bodyText ??
              'Partner with us to reach thousands of passionate developers, designers, and innovators. Your support makes this event possible and puts your brand in front of the people who matter most.'}
          </p>
          <a
            href="#sponsor-levels"
            className="inline-block bg-brand-accent text-on-brand-secondary font-semibold text-base md:text-lg px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
            aria-label="View sponsor levels and packages"
          >
            {Array.isArray(props.sponsorLevelsCtaButton) ? props.sponsorLevelsCtaButton[0]?.label ?? 'View Sponsor Packages' : props.sponsorLevelsCtaButton ?? 'View Sponsor Packages'}
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
