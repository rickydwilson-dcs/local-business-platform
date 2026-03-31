"use client";

/**
 * AboutColorCodeEvents
 *
 * Describes the ColorCode Events organisation, its history and mission
 * Layout: Dark purple background with heading left, body copy right, learn more CTA button
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface AboutColorCodeEventsProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-copy */
  bodyCopy?: string;
  /** learn-more-cta */
  learnMoreCta?: Array<{ label?: string; href?: string }>;
}

export function AboutColorCodeEvents(props: AboutColorCodeEventsProps) {
  return (
      <section className="bg-brand-primary py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
  
            {/* Left: Heading */}
            <RevealOnScroll variant="fade-up">
              <div>
                <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {props['section-heading'] ?? 'About ColorCode Events'}
                </h2>
              </div>
            </RevealOnScroll>
  
            {/* Right: Body copy + CTA */}
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col gap-8">
                <p className="text-on-brand-primary text-base md:text-lg leading-relaxed opacity-90">
                  {props['body-copy'] ??
                    'ColorCode Events is a community-driven organisation dedicated to bringing people together through vibrant, inclusive, and unforgettable experiences. Founded with a passion for creativity and connection, we have spent years crafting events that celebrate diversity, culture, and the joy of shared moments. Our mission is simple: to create spaces where everyone belongs and every event leaves a lasting impression.'}
                </p>
  
                <div>
                  <a
                    href="#"
                    className="inline-block bg-brand-accent text-on-brand-secondary font-semibold text-sm md:text-base px-6 py-3 rounded-md transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
                    aria-label={props['learn-more-cta'] ?? 'Learn more about ColorCode Events'}
                  >
                    {props['learn-more-cta'] ?? 'Learn More'}
                  </a>
                </div>
              </div>
            </RevealOnScroll>
  
          </div>
        </div>
      </section>
    );
}
