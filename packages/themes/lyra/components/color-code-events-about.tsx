"use client";

/**
 * ColorCodeEventsAbout
 *
 * Describes the ColorCode Events organisation, its history and mission with a CTA
 * Layout: Two-column layout — heading left, body text and CTA right, white background
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
      <section className="bg-surface-background py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left column — heading */}
            <div className="md:sticky md:top-24">
              <RevealOnScroll variant="fade-up">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-primary leading-tight">
                  {props['section-heading'] ?? 'About ColorCode Events'}
                </h2>
              </RevealOnScroll>
            </div>
  
            {/* Right column — body text and CTA */}
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col gap-6">
                <div className="text-surface-muted-foreground text-base md:text-lg leading-relaxed space-y-4">
                  {props['body-text'] ? (
                    <p>{props['body-text']}</p>
                  ) : (
                    <>
                      <p>
                        ColorCode Events was founded with a single belief: that the best experiences
                        are built on bold ideas, vibrant creativity, and a deep commitment to community.
                        Since our founding, we have brought together people from all walks of life
                        through unforgettable events that celebrate colour, culture, and connection.
                      </p>
                      <p>
                        From intimate brand activations to large-scale festivals, our team combines
                        strategic thinking with imaginative execution. We partner closely with clients
                        to understand their vision and translate it into experiences that resonate long
                        after the last guest has left.
                      </p>
                      <p>
                        Our mission is simple: to make every event a landmark moment — one that
                        inspires, delights, and leaves a lasting impression on everyone who attends.
                      </p>
                    </>
                  )}
                </div>
  
                <div className="pt-4">
                  <a
                    href={props['cta-button']?.href ?? '/about'}
                    className="inline-block bg-brand-accent text-on-brand-secondary font-semibold text-sm md:text-base px-8 py-4 rounded-full hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                    aria-label={props['cta-button']?.label ?? 'Learn more about ColorCode Events'}
                  >
                    {props['cta-button']?.label ?? 'Discover Our Story'}
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    );
}
