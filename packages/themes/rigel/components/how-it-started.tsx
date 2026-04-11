"use client";

/**
 * HowItStarted
 *
 * Describes the founding story of ColorCode Events with decorative arrow elements
 * Layout: Two-column layout: left column has heading and decorative arrow row, right column has body text paragraphs
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface HowItStartedProps {
  /** section-heading */
  sectionHeading?: string;
  /** decorative-arrows */
  decorativeArrows?: string[];
  /** body-text */
  bodyText?: string[];
}

export function HowItStarted(props: HowItStartedProps) {
  return (
    <section className="bg-surface-background py-16 px-4 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column: Heading + Decorative Arrows */}
          <div className="flex flex-col gap-8">
            <RevealOnScroll variant="fade-up">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-primary leading-tight">
                {props.sectionHeading ?? "How It All Started"}
              </h2>
            </RevealOnScroll>

            {/* Decorative Arrow Row */}
            <div className="flex items-center gap-3 mt-2">
              {props.decorativeArrows ? (
                props.decorativeArrows.map((arrow: string, index: number) => (
                  <span
                    key={index}
                    className="text-brand-accent text-3xl md:text-4xl font-bold leading-none"
                    aria-hidden="true"
                  >
                    {arrow}
                  </span>
                ))
              ) : (
                <>
                  <span
                    className="text-brand-accent text-3xl md:text-4xl font-bold leading-none"
                    aria-hidden="true"
                  >
                    →
                  </span>
                  <span
                    className="text-brand-secondary text-3xl md:text-4xl font-bold leading-none opacity-70"
                    aria-hidden="true"
                  >
                    →
                  </span>
                  <span
                    className="text-brand-primary text-3xl md:text-4xl font-bold leading-none opacity-40"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </>
              )}
            </div>

            {/* Decorative accent line */}
            <div className="w-16 h-1 bg-brand-accent rounded-full" aria-hidden="true" />
          </div>

          {/* Right Column: Body Text */}
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6">
              {props.bodyText ? (
                props.bodyText.map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="text-surface-muted-foreground text-base md:text-lg leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                    ColorCode Events was born out of a simple frustration: planning a memorable
                    event shouldn't feel like navigating a maze. Our founders, a pair of lifelong
                    creatives and event enthusiasts, found themselves overwhelmed by the chaos of
                    coordinating vendors, themes, and timelines.
                  </p>
                  <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                    In 2018, they decided to build something different — a platform where colour,
                    creativity, and community come together to make every event feel effortless and
                    extraordinary. What started as a small passion project quickly grew into a
                    full-service events company trusted by hundreds of clients.
                  </p>
                  <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                    Today, ColorCode Events continues to be driven by that same founding spirit:
                    bringing bold ideas to life with precision, care, and a whole lot of colour.
                  </p>
                </>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
