"use client";

/**
 * CallForSpeakersCTA
 *
 * Encourages speakers to apply to present at the conference
 * Layout: Full-width yellow background block with heading left, body copy left, and CTA button below copy
 * Category: CTA
 */

import { useState } from "react";

export interface CallForSpeakersCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-copy */
  bodyCopy?: string;
  /** apply-cta-button */
  applyCtaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForSpeakersCTA(props: CallForSpeakersCTAProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-4 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col items-start max-w-2xl">
              {props['section-heading'] && (
                <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  {props['section-heading']}
                </h2>
              )}
  
              {props['body-copy'] && (
                <p className="text-on-brand-primary text-base md:text-lg leading-relaxed mb-8">
                  {props['body-copy']}
                </p>
              )}
  
              {props['apply-cta-button'] && (
                <a
                  href={props['apply-cta-button'].href ?? '#'}
                  className="inline-block bg-brand-secondary text-on-brand-secondary font-semibold text-base md:text-lg px-8 py-4 rounded-md hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary"
                  aria-label={props['apply-cta-button'].label ?? 'Apply to speak'}
                >
                  {props['apply-cta-button'].label ?? 'Apply to Speak'}
                </a>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
