"use client";

/**
 * HowItStartedSection
 *
 * Explains the origin story of ColorCode Events with descriptive text
 * Layout: Two-column layout: decorative arrow pattern left, body text right
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

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
      <section className="bg-surface-inverse py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
  
            {/* Left column: decorative arrow pattern */}
            <div className="flex flex-col items-center justify-center space-y-2" aria-hidden="true">
              {props['decorative-arrows'] ? (
                <div className="text-brand-accent text-6xl md:text-8xl font-bold leading-none select-none">
                  {props['decorative-arrows']}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {[...Array(9)].map((_, i) => (
                    <span
                      key={i}
                      className="text-brand-accent text-4xl md:text-5xl lg:text-6xl font-black leading-none select-none"
                      style={{ opacity: 1 - i * 0.08 }}
                    >
                      ↗
                    </span>
                  ))}
                </div>
              )}
            </div>
  
            {/* Right column: body text */}
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col space-y-6">
                {props['section-heading'] && (
                  <h2 className="text-surface-background text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    {props['section-heading']}
                  </h2>
                )}
  
                {props['body-text-paragraphs'] && props['body-text-paragraphs'].length > 0 ? (
                  <div className="space-y-4">
                    {props['body-text-paragraphs'].map((paragraph: string, index: number) => (
                      <p
                        key={index}
                        className="text-surface-muted-foreground text-base md:text-lg leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                      It all started with a simple idea: what if finding your people at an event was as easy as wearing a colour? ColorCode Events was born from years of attending networking events that felt impersonal and overwhelming.
                    </p>
                    <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                      We believed there had to be a better way — a system that made meaningful connections feel natural, fun, and effortless. So we built one.
                    </p>
                    <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                      Today, ColorCode Events brings together curious minds, creative professionals, and community builders through the power of colour-coded connection.
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
