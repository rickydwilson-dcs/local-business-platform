"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";

/**
 * OriginStorySection
 *
 * Explains how ColorCode Events was founded and its mission using a two-column layout with decorative elements
 * Layout: Two-column layout: left column has heading and decorative arrow row, right column has body text paragraphs
 * Category: Content
 */

import { useState } from "react";

export interface OriginStorySectionProps {
  /** section-heading */
  sectionHeading?: string;
  /** decorative-arrows */
  decorativeArrows?: string;
  /** body-text */
  bodyText?: string;
}

export function OriginStorySection(props: OriginStorySectionProps) {
  return (
      <section className="bg-brand-primary py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left Column: Heading and Decorative Arrows */}
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col gap-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-on-brand-primary leading-tight">
                  {props['section-heading'] ?? 'How ColorCode Events Came to Be'}
                </h2>
                <div className="flex items-center gap-3 mt-2" aria-hidden="true">
                  {(props['decorative-arrows'] ?? ['→', '→', '→']).map(
                    (arrow: string, index: number) => (
                      <span
                        key={index}
                        className="text-brand-accent text-2xl md:text-3xl font-bold select-none"
                      >
                        {arrow}
                      </span>
                    )
                  )}
                </div>
                <div className="w-16 h-1 bg-brand-accent rounded-full mt-2" aria-hidden="true" />
              </div>
            </RevealOnScroll>
  
            {/* Right Column: Body Text */}
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col gap-6">
                {(
                  props['body-text'] ?? [
                    'ColorCode Events was born from a simple belief: that every gathering should feel intentional, vibrant, and deeply human. Our founders saw a world of events that looked the same — and decided to change that.',
                    'We built a platform rooted in creativity and connection, helping organisers craft experiences that resonate long after the last guest leaves. Our mission is to make colour — in all its meaning — the language of unforgettable moments.',
                    'From intimate workshops to large-scale festivals, ColorCode Events exists to give every occasion its own identity, its own palette, its own story.',
                  ]
                ).map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="text-on-brand-primary text-base md:text-lg leading-relaxed opacity-90"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    );
}
