"use client";

/**
 * ColorCodeEventsAbout
 *
 * Describes the ColorCode Events organisation and its mission with a CTA
 * Layout: Dark purple background, heading left, body text right, CTA button
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ColorCodeEventsAboutProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-text */
  bodyText?: string;
  /** learn-more-cta-button */
  learnMoreCtaButton?: Array<{ label?: string; href?: string }>;
}

export function ColorCodeEventsAbout(props: ColorCodeEventsAboutProps) {
  return (
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Heading */}
            <RevealOnScroll variant="fade-up">
              <div>
                <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {props.sectionHeading ?? "About ColorCode Events"}
                </h2>
              </div>
            </RevealOnScroll>
  
            {/* Right: Body text + CTA */}
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col gap-6">
                <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                  {props.bodyText ??
                    "ColorCode Events is a community-driven organisation dedicated to celebrating diversity, creativity, and connection through vibrant, inclusive events. Our mission is to bring people together through shared experiences that inspire, energise, and leave a lasting impact."}
                </p>
                {props.learnMoreCtaButton ? (
                  <div>{props.learnMoreCtaButton}</div>
                ) : (
                  <a
                    href="#"
                    className="inline-block self-start bg-brand-accent text-on-brand-secondary font-semibold text-sm md:text-base px-6 py-3 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                    aria-label="Learn more about ColorCode Events"
                  >
                    Learn More
                  </a>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    );
}
