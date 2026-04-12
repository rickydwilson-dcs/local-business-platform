"use client";

/**
 * HowItStartedSection
 *
 * Explains the origin story of ColorCode Events with a large heading, decorative arrows, and multi-paragraph body text
 * Layout: Two-column layout: large heading with decorative arrow row on left, multi-paragraph body text on right on dark background
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/src/components/animation";

export interface HowItStartedSectionProps {
  /** section-heading */
  sectionHeading?: string;
  /** decorative-arrows */
  decorativeArrows?: string;
  /** body-text-paragraphs */
  bodyTextParagraphs?: string;
}

export function HowItStartedSection(props: HowItStartedSectionProps) {
  return (
    <section className="bg-brand-primary py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left Column: Large Heading + Decorative Arrows */}
        <div className="flex flex-col gap-8">
          <RevealOnScroll variant="fade-up">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-on-brand-primary leading-tight tracking-tight">
              {props.sectionHeading ?? "How It All Started"}
            </h2>
          </RevealOnScroll>

          {/* Decorative Arrow Row */}
          <div className="flex items-center gap-3 mt-2">
            {(props.decorativeArrows ?? ["→", "→", "→"]).map((arrow: string, index: number) => (
              <span
                key={index}
                className="text-brand-accent text-3xl md:text-4xl font-bold animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
                aria-hidden="true"
              >
                {arrow}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Multi-paragraph Body Text */}
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-6">
            {(
              props.bodyTextParagraphs ?? [
                "ColorCode Events was born out of a simple frustration: why do so many events feel the same? We believed that colour could transform the way people connect, celebrate, and create memories together.",
                "What started as a small gathering of friends experimenting with themed colour palettes quickly grew into something far bigger. Word spread, communities formed, and ColorCode became a movement.",
                "Today, we bring that same founding energy to every event we produce — bold, vibrant, and unapologetically alive with colour. Every detail is intentional, every palette tells a story.",
              ]
            ).map((paragraph: string, index: number) => (
              <p
                key={index}
                className="text-surface-secondary-foreground text-base md:text-lg leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
