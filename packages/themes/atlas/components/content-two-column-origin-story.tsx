"use client";

/**
 * HowItStartedSection
 *
 * Explains the origin story of ColorCode Events with decorative arrow row and body text
 * Layout: Two-column layout: left column has heading and decorative arrow row, right column has multi-paragraph body text
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface HowItStartedSectionProps {
  /** section-heading */
  sectionHeading?: string;
  /** decorative-arrows */
  decorativeArrows?: string;
  /** body-text */
  bodyText?: string;
}

export function HowItStartedSection(props: HowItStartedSectionProps) {
  return (
      <section className="bg-surface-inverse py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left Column: Heading and Decorative Arrow Row */}
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col gap-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background leading-tight">
                  {props.sectionHeading ?? "How It All Started"}
                </h2>
  
                {/* Decorative Arrow Row */}
                <div className="flex items-center gap-2" aria-hidden="true">
                  {props.decorativeArrows ? (
                    <span className="text-brand-accent text-2xl tracking-widest">
                      {props.decorativeArrows}
                    </span>
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 text-brand-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                      <svg
                        className="w-8 h-8 text-brand-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                      <svg
                        className="w-8 h-8 text-brand-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </>
                  )}
                </div>
  
                {/* Decorative divider line */}
                <div className="w-16 h-1 bg-brand-accent rounded-full" />
              </div>
            </RevealOnScroll>
  
            {/* Right Column: Body Text */}
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col gap-6">
                {props.bodyText ? (
                  <p className="text-surface-background text-base md:text-lg leading-relaxed">
                    {props.bodyText}
                  </p>
                ) : (
                  <>
                    <p className="text-surface-background text-base md:text-lg leading-relaxed">
                      ColorCode Events was born out of a simple frustration: why
                      does finding the right event feel so overwhelming? Our
                      founders experienced firsthand the chaos of sifting through
                      endless listings, only to miss the moments that truly
                      mattered.
                    </p>
                    <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                      In 2019, a small team of event enthusiasts and technologists
                      came together with a shared vision — to bring colour and
                      clarity to the world of live experiences. We believed that
                      every event deserves to be discovered, and every person
                      deserves to find their perfect match.
                    </p>
                    <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                      What started as a weekend project quickly grew into a
                      platform trusted by thousands of organisers and attendees
                      alike. Today, ColorCode Events continues to evolve, driven
                      by the same passion that sparked it all — connecting people
                      through unforgettable experiences.
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
