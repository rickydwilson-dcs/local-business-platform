"use client";

/**
 * ColorCodeEventsAbout
 *
 * Describes the ColorCode Events organisation, its history and mission, with a learn more CTA
 * Layout: Dark purple background; heading top-left, body copy right column, learn more CTA button below copy
 * Category: Content
 */

import { useState } from "react";

export interface ColorCodeEventsAboutProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-copy */
  bodyCopy?: string;
  /** learn-more-cta */
  learnMoreCta?: Array<{ label?: string; href?: string }>;
}

export function ColorCodeEventsAbout(props: ColorCodeEventsAboutProps) {
  return (
      <section className="bg-brand-primary py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Heading — top-left */}
            <div className="md:sticky md:top-24">
              <RevealOnScroll variant="fade-up">
                <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {props['section-heading'] ?? 'About ColorCode Events'}
                </h2>
              </RevealOnScroll>
            </div>
  
            {/* Body copy + CTA — right column */}
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col gap-6">
                <p className="text-on-brand-primary text-base md:text-lg leading-relaxed opacity-90">
                  {props['body-copy'] ??
                    'ColorCode Events was founded with a singular mission: to create inclusive, vibrant experiences that celebrate diversity through the power of colour. From our humble beginnings as a small community gathering, we have grown into a nationally recognised organisation delivering unforgettable events that bring people together, spark creativity, and champion belonging for all.'}
                </p>
  
                <a
                  href="#learn-more"
                  className="inline-block self-start mt-2 bg-brand-accent text-on-brand-secondary font-semibold text-sm md:text-base px-6 py-3 rounded-full transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
                  aria-label="Learn more about ColorCode Events"
                >
                  {props['learn-more-cta'] ?? 'Learn More'}
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    );
}
