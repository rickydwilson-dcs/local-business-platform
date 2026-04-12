"use client";

/**
 * CallForVolunteersCTA
 *
 * Encourages volunteers to apply with a description and apply button on a green background
 * Layout: Full-width green background block with heading and body text left-aligned and CTA button
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/src/components/animation";

export interface CallForVolunteersCTAProps {
  /** heading */
  heading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForVolunteersCTA(props: CallForVolunteersCTAProps) {
  return (
    <section className="bg-brand-primary w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-on-brand-primary text-3xl md:text-4xl font-bold mb-4">
                {props.heading ?? "Join Our Volunteer Team"}
              </h2>
              <p className="text-on-brand-primary text-base md:text-lg leading-relaxed max-w-2xl">
                {props.bodyText ??
                  "We're looking for passionate individuals who want to make a difference in their community. Whether you have a few hours a week or a few days a month, your time and skills can create real impact. Apply today and become part of something meaningful."}
              </p>
            </div>
            <div className="flex-shrink-0">
              <a
                href={props.ctaButton?.url ?? "#apply"}
                className="inline-block border-2 border-surface-background text-on-brand-primary font-semibold text-base md:text-lg px-8 py-4 rounded-md hover:bg-surface-background hover:text-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-surface-background focus:ring-offset-2 focus:ring-offset-brand-primary"
                aria-label={props.ctaButton?.label ?? "Apply to volunteer"}
              >
                {props.ctaButton?.label ?? "Apply Now"}
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
