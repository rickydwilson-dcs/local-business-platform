"use client";

/**
 * HowItStartedSection
 *
 * Explains the origin story of ColorCode Events and its founding partners with decorative arrows
 * Layout: Two-column layout: decorative arrow row left, body text right on dark navy background
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
      <section className="bg-brand-primary py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
  
            {/* Left column: decorative arrows */}
            <div className="flex flex-col items-center justify-center gap-4">
              {props['decorative-arrows'] ? (
                <div className="flex flex-col items-center gap-4">
                  {props['decorative-arrows']}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6" aria-hidden="true">
                  <svg
                    className="w-16 h-16 text-brand-accent opacity-80"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M32 8 L56 32 L32 56 L8 32 Z"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M32 20 L44 32 L32 44"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  <svg
                    className="w-12 h-12 text-brand-secondary opacity-60"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M32 8 L56 32 L32 56 L8 32 Z"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M32 20 L44 32 L32 44"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  <svg
                    className="w-8 h-8 text-brand-accent opacity-40"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M32 8 L56 32 L32 56 L8 32 Z"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M32 20 L44 32 L32 44"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              )}
            </div>
  
            {/* Right column: heading and body text */}
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col gap-6">
                {props['section-heading'] ? (
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background leading-tight">
                    {props['section-heading']}
                  </h2>
                ) : (
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background leading-tight">
                    How It All Started
                  </h2>
                )}
  
                <div className="w-16 h-1 bg-brand-accent rounded-full" />
  
                {props['body-text'] ? (
                  <div className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                    {props['body-text']}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                    <p>
                      ColorCode Events was born from a shared vision between two founding partners who believed that every gathering deserved to be unforgettable. What started as a conversation over coffee quickly grew into a mission to transform the events industry.
                    </p>
                    <p>
                      Our founders combined decades of experience in event production, design, and hospitality to create a company that puts creativity and connection at the heart of everything we do.
                    </p>
                    <p>
                      Today, ColorCode Events continues to honour that original spirit — bringing colour, energy, and meaning to every occasion we touch.
                    </p>
                  </div>
                )}
              </div>
            </RevealOnScroll>
  
          </div>
        </div>
      </section>
    );
}
