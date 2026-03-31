"use client";

/**
 * CallForSponsorsCTA
 *
 * Encourages businesses to sponsor the conference
 * Layout: Full-width blue background block with heading and body copy right-aligned, CTA button below
 * Category: CTA
 */

import { useState } from "react";

export interface CallForSponsorsCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-copy */
  bodyCopy?: string;
  /** sponsor-levels-cta-button */
  sponsorLevelsCtaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForSponsorsCTA(props: CallForSponsorsCTAProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto flex flex-col items-end gap-8">
          <RevealOnScroll variant="fade-up">
            <div className="w-full md:w-2/3 lg:w-1/2 text-right">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-on-brand-primary mb-4">
                {props['section-heading'] ?? 'Become a Conference Sponsor'}
              </h2>
              <p className="text-base md:text-lg text-on-brand-primary opacity-90 leading-relaxed">
                {props['body-copy'] ??
                  'Partner with us to connect your brand with thousands of industry leaders, innovators, and decision-makers. Sponsoring our conference gives you unparalleled visibility and the opportunity to shape the future of the industry alongside the brightest minds in the field.'}
              </p>
            </div>
          </RevealOnScroll>
  
          <div className="flex justify-end w-full">
            {props['sponsor-levels-cta-button'] ? (
              props['sponsor-levels-cta-button']
            ) : (
              <a
                href="#sponsor-levels"
                className="inline-block bg-brand-accent text-on-brand-secondary font-semibold text-base md:text-lg px-8 py-4 rounded-md hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
                aria-label="View sponsorship levels and packages"
              >
                View Sponsor Levels
              </a>
            )}
          </div>
        </div>
      </section>
    );
}
