"use client";

/**
 * ColorCodeEventsAbout
 *
 * Describes the ColorCode Events organisation, its history and mission with a learn more CTA on a dark background
 * Layout: Dark purple background, two-column layout: heading left, body text and CTA right
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ColorCodeEventsAboutProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
}

export function ColorCodeEventsAbout(props: ColorCodeEventsAboutProps) {
  return (
      <section className="bg-brand-primary py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left column: heading */}
            <div>
              <RevealOnScroll variant="fade-up">
                <h2 className="text-on-brand-primary text-4xl lg:text-5xl font-bold leading-tight">
                  {props['section-heading'] ?? 'About ColorCode Events'}
                </h2>
              </RevealOnScroll>
            </div>
  
            {/* Right column: body text and CTA */}
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col gap-8">
                <p className="text-surface-muted-foreground text-lg leading-relaxed">
                  {props['body-text'] ??
                    'ColorCode Events is a community-driven organisation dedicated to celebrating diversity in tech through vibrant, inclusive gatherings. Founded with a mission to break down barriers and amplify underrepresented voices, we have been bringing together developers, designers, and innovators from all walks of life since our inception. Our events are more than conferences — they are movements that inspire change, foster connection, and champion equity across the technology industry.'}
                </p>
  
                <div>
                  <a
                    href={props['cta-button']?.href ?? '#learn-more'}
                    className="inline-block bg-brand-accent text-on-brand-secondary font-semibold text-base px-8 py-4 rounded-lg transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
                    aria-label={props['cta-button']?.label ?? 'Learn more about ColorCode Events'}
                  >
                    {props['cta-button']?.label ?? 'Learn More'}
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    );
}
