"use client";

/**
 * CallForVolunteersCTA
 *
 * Encourages volunteers to apply with a brief description and apply button on a green background
 * Layout: Full-width green background block with heading and body text left-aligned and CTA button
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CallForVolunteersCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForVolunteersCTA(props: CallForVolunteersCTAProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="flex-1 max-w-2xl">
                {props['section-heading'] && (
                  <h2 className="text-on-brand-primary text-3xl md:text-4xl font-bold mb-4">
                    {props['section-heading']}
                  </h2>
                )}
                {props['body-text'] && (
                  <p className="text-on-brand-primary text-base md:text-lg leading-relaxed opacity-90">
                    {props['body-text']}
                  </p>
                )}
              </div>
              {props['cta-button'] && (
                <div className="flex-shrink-0">
                  <a
                    href={props['cta-button'].href ?? '#'}
                    className="inline-block bg-surface-background text-brand-primary font-semibold text-base md:text-lg px-8 py-4 rounded-md hover:bg-surface-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-surface-background"
                    aria-label={props['cta-button'].label ?? 'Apply to volunteer'}
                  >
                    {props['cta-button'].label ?? 'Apply Now'}
                  </a>
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
