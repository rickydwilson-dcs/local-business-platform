"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";

/**
 * CallForVolunteersCTA
 *
 * Encourages community members to volunteer at the conference
 * Layout: Full-width green background block with heading and body copy left-aligned, CTA button below
 * Category: CTA
 */

import { useState } from "react";

export interface CallForVolunteersCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-copy */
  bodyCopy?: string;
  /** volunteer-cta-button */
  volunteerCtaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForVolunteersCTA(props: CallForVolunteersCTAProps) {
  return (
      <section className="bg-brand-primary w-full py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="max-w-2xl">
              {props['section-heading'] && (
                <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  {props['section-heading']}
                </h2>
              )}
  
              {props['body-copy'] && (
                <p className="text-on-brand-primary text-base md:text-lg leading-relaxed mb-8 opacity-90">
                  {props['body-copy']}
                </p>
              )}
  
              {props['volunteer-cta-button'] && (
                <div>
                  <a
                    href={props['volunteer-cta-button'].href ?? '#'}
                    className="inline-block border-2 border-surface-background text-on-brand-primary font-semibold px-8 py-3 rounded-md hover:bg-surface-background hover:text-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-surface-background"
                    aria-label={props['volunteer-cta-button'].label ?? 'Volunteer at the conference'}
                  >
                    {props['volunteer-cta-button'].label ?? 'Volunteer Now'}
                  </a>
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
