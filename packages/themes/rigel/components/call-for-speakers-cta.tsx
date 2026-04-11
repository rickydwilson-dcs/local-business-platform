"use client";

/**
 * CallForSpeakersCTA
 *
 * Encourages designers, developers, and marketers to apply as conference speakers
 * Layout: Full-width yellow background block with heading, body text, and apply button on left side
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CallForSpeakersCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-text */
  bodyText?: string;
  /** apply-button */
  applyButton?: Array<{ label?: string; href?: string }>;
}

export function CallForSpeakersCTA(props: CallForSpeakersCTAProps) {
  return (
    <section className="w-full bg-brand-secondary py-16 px-4 md:py-20 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <RevealOnScroll variant="fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-primary mb-6 leading-tight">
              {props.sectionHeading ?? "Call For Speakers"}
            </h2>
            <p className="text-base md:text-lg text-brand-primary opacity-90 mb-8 leading-relaxed">
              {props.bodyText ??
                "Are you a designer, developer, or marketer with insights worth sharing? We're looking for passionate speakers to inspire and educate our community. Submit your proposal and take the stage at one of the most exciting events of the year."}
            </p>
            <a
              href={props.applyButton?.[0]?.href ?? "#apply"}
              className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-base md:text-lg px-8 py-4 rounded-md hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
              aria-label="Apply to become a conference speaker"
            >
              {props.applyButton?.[0]?.label ?? "Apply to Speak"}
            </a>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
