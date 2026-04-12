"use client";

/**
 * ColorCodeEventsAbout
 *
 * Describes the ColorCode Events brand history and mission with a learn more CTA on a dark background
 * Layout: Dark purple background two-column layout: heading left, body text and CTA button right
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ColorCodeEventsAboutProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
}

export function ColorCodeEventsAbout(props: ColorCodeEventsAboutProps) {
  return (
    <section className="bg-brand-primary py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column: Heading */}
          <div className="md:sticky md:top-24">
            <RevealOnScroll variant="fade-up">
              <h2 className="text-on-brand-primary text-4xl lg:text-5xl font-bold leading-tight">
                {props.sectionHeading ?? "About ColorCode Events"}
              </h2>
              <div className="mt-6 w-16 h-1 bg-brand-accent rounded-full" />
            </RevealOnScroll>
          </div>

          {/* Right Column: Body Text and CTA */}
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-8">
              <p className="text-surface-muted-foreground text-lg leading-relaxed">
                {props.bodyText ??
                  "ColorCode Events was founded on the belief that every gathering deserves a splash of personality. From intimate celebrations to large-scale brand activations, we bring colour, creativity, and community together. Our mission is to craft unforgettable experiences that leave a lasting impression — vibrant, inclusive, and always on-brand."}
              </p>

              <div>
                <a
                  href={props.ctaButton?.url ?? "#"}
                  className="inline-block bg-brand-accent text-on-brand-secondary font-semibold text-base px-8 py-4 rounded-full transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
                  aria-label={props.ctaButton?.label ?? "Learn more about ColorCode Events"}
                >
                  {props.ctaButton?.label ?? "Learn More"}
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
