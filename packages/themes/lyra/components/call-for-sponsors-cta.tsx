"use client";

/**
 * CallForSponsorsCTA
 *
 * Encourages sponsors to support the event with a brief description and view sponsor levels button on a blue background
 * Layout: Full-width blue background block with heading and body text right-aligned and CTA button
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CallForSponsorsCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForSponsorsCTA(props: CallForSponsorsCTAProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-end gap-6 md:flex-row md:items-center md:justify-between">
          <RevealOnScroll variant="fade-up">
            <div className="text-right md:max-w-2xl">
              <h2 className="text-3xl font-bold text-on-brand-primary mb-4 md:text-4xl">
                {props['section-heading'] ?? 'Become a Sponsor'}
              </h2>
              <p className="text-on-brand-primary text-base md:text-lg leading-relaxed opacity-90">
                {props['body-text'] ??
                  'Support our event and connect your brand with thousands of passionate attendees. Your sponsorship helps us create an unforgettable experience while giving your organisation unparalleled visibility.'}
              </p>
            </div>
          </RevealOnScroll>
  
          <div className="flex-shrink-0 mt-4 md:mt-0">
            <a
              href={props['cta-button']?.href ?? '#sponsor-levels'}
              className="inline-block bg-brand-accent text-on-brand-secondary font-semibold text-base px-8 py-4 rounded-lg transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
              aria-label={props['cta-button']?.label ?? 'View Sponsor Levels'}
            >
              {props['cta-button']?.label ?? 'View Sponsor Levels'}
            </a>
          </div>
        </div>
      </section>
    );
}
