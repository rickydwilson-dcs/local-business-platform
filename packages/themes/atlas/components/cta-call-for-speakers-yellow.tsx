"use client";

/**
 * CallForSpeakersCTA
 *
 * Encourages speakers to apply with a brief description and apply button
 * Layout: Full-width yellow background block with heading left, body copy left, CTA button bottom-left
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

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
      <section className="w-full bg-brand-primary py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-8">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col items-start gap-6 max-w-2xl">
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
  
              {props['apply-cta-button'] && (
                <button
                  type="button"
                  className="mt-2 inline-flex items-center justify-center bg-brand-secondary text-on-brand-secondary font-semibold text-base md:text-lg px-8 py-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-opacity duration-200"
                >
                  {props['apply-cta-button']}
                </button>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
