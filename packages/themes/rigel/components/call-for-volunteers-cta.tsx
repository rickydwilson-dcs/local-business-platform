"use client";

/**
 * CallForVolunteersCTA
 *
 * Recruits volunteers to help support the conference event
 * Layout: Full-width green background block with heading, body text, and volunteer apply button
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CallForVolunteersCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-text */
  bodyText?: string;
  /** volunteer-button */
  volunteerButton?: Array<{ label?: string; href?: string }>;
}

export function CallForVolunteersCTA(props: CallForVolunteersCTAProps) {
  return (
      <section className="bg-brand-accent w-full py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll variant="fade-up">
            <h2 className="text-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {props.sectionHeading ?? "Call For Volunteers"}
            </h2>
            <p className="text-brand-primary text-base md:text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed opacity-90">
              {props.bodyText ??
                "We're looking for passionate individuals to help make our conference an unforgettable experience. Whether you're greeting attendees, supporting speakers, or managing logistics, your contribution matters. Join our volunteer team and be part of something special."}
            </p>
            <a
              href={props.volunteerButton ?? "#volunteer-apply"}
              className="inline-block border-2 border-brand-primary text-brand-primary font-semibold text-base md:text-lg px-8 py-4 rounded-lg hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-accent"
              aria-label="Apply to become a volunteer at the conference"
            >
              Apply to Volunteer
            </a>
          </RevealOnScroll>
        </div>
      </section>
    );
}
