"use client";

/**
 * CallForVolunteersCTA
 *
 * Recruits volunteers with a brief description and apply button
 * Layout: Full-width green background block with heading and body copy left, CTA button below
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

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
      <section className="w-full bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="flex flex-col gap-4 max-w-2xl">
                {props['section-heading'] && (
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-on-brand-primary leading-tight">
                    {props['section-heading']}
                  </h2>
                )}
                {props['body-copy'] && (
                  <p className="text-base md:text-lg text-on-brand-primary opacity-90 leading-relaxed">
                    {props['body-copy']}
                  </p>
                )}
              </div>
              {props['volunteer-cta-button'] && (
                <div className="flex-shrink-0">
                  <a
                    href={props['volunteer-cta-button'].href ?? '#'}
                    className="inline-block bg-surface-background text-brand-primary font-semibold text-base md:text-lg px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-4 focus:ring-surface-background focus:ring-offset-2 focus:ring-offset-brand-primary"
                    aria-label={props['volunteer-cta-button'].label ?? 'Apply to volunteer'}
                  >
                    {props['volunteer-cta-button'].label ?? 'Apply to Volunteer'}
                  </a>
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
