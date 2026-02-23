"use client";

/**
 * CallForSpeakersCTA
 *
 * Encourages speakers to apply with a brief description and apply button on a yellow background
 * Layout: Full-width yellow background block with heading and body text left-aligned and CTA button
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CallForSpeakersCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForSpeakersCTA(props: CallForSpeakersCTAProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-4 md:py-20">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="flex-1 max-w-2xl">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-inverse mb-4">
                  {props['section-heading'] ?? 'Call for Speakers'}
                </h2>
                <p className="text-base md:text-lg text-surface-inverse opacity-90 leading-relaxed">
                  {props['body-text'] ??
                    'Are you passionate about sharing your knowledge and inspiring others? We are looking for dynamic speakers to join our lineup. Submit your proposal today and be part of something extraordinary.'}
                </p>
              </div>
              <div className="flex-shrink-0">
                <a
                  href={props['cta-button']?.url ?? '#apply'}
                  className="inline-block bg-brand-secondary text-on-brand-secondary font-semibold text-base md:text-lg px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-4 focus:ring-brand-secondary focus:ring-offset-2"
                  aria-label={props['cta-button']?.label ?? 'Apply to speak at the event'}
                >
                  {props['cta-button']?.label ?? 'Apply to Speak'}
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
