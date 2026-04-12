"use client";

/**
 * CallForSponsorsCTA
 *
 * Encourages sponsors to support the event with a description and view levels button on a blue background
 * Layout: Full-width blue background block with heading and body text right-aligned and CTA button
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CallForSponsorsCTAProps {
  /** heading */
  heading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForSponsorsCTA(props: CallForSponsorsCTAProps) {
  return (
    <section className="bg-brand-primary py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <RevealOnScroll variant="fade-up">
          <div className="md:max-w-xl lg:max-w-2xl md:ml-auto text-right">
            <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {props.heading ?? "Become a Sponsor"}
            </h2>
            <p className="text-on-brand-primary text-base md:text-lg opacity-90 leading-relaxed">
              {props.bodyText ??
                "Support our event and connect your brand with thousands of passionate attendees. Your sponsorship helps us create an unforgettable experience while giving your organisation unparalleled visibility."}
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up">
          <div className="flex md:flex-shrink-0 md:items-center justify-end md:justify-start">
            <a
              href={props.ctaButton?.[0]?.href ?? "#sponsorship-levels"}
              className="inline-block border-2 border-surface-background text-on-brand-primary font-semibold text-base md:text-lg px-8 py-4 rounded-lg hover:bg-surface-background hover:text-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-surface-background focus:ring-offset-2 focus:ring-offset-brand-primary"
              aria-label={props.ctaButton?.[0]?.label ?? "View sponsorship levels"}
            >
              {props.ctaButton?.[0]?.label ?? "View Sponsorship Levels"}
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
