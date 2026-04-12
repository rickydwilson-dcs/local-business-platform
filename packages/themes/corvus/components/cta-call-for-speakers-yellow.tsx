"use client";

/**
 * CallForSpeakersCTA
 *
 * Encourages speakers to apply with a description and apply button on a yellow background
 * Layout: Full-width yellow background block with heading and body text left-aligned and CTA button
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/src/components/animation";

export interface CallForSpeakersCTAProps {
  /** heading */
  heading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForSpeakersCTA(props: CallForSpeakersCTAProps) {
  return (
    <section className="w-full bg-brand-primary py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-4 md:max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-inverse leading-tight">
              {props.heading ?? "Call for Speakers"}
            </h2>
            <p className="text-base md:text-lg text-surface-inverse opacity-90 leading-relaxed">
              {props.bodyText ??
                "Are you passionate about sharing your knowledge and inspiring others? We're looking for dynamic speakers to join our lineup. Submit your proposal today and be part of something extraordinary."}
            </p>
          </div>
        </RevealOnScroll>

        <div className="flex-shrink-0">
          <button
            className="inline-block bg-surface-background text-brand-primary font-semibold text-base md:text-lg px-8 py-4 rounded-md border-2 border-surface-background hover:bg-transparent hover:text-surface-background transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-surface-background focus:ring-offset-2 focus:ring-offset-brand-primary"
            aria-label={props.ctaButton ?? "Apply to speak at the event"}
          >
            {props.ctaButton ?? "Apply to Speak"}
          </button>
        </div>
      </div>
    </section>
  );
}
