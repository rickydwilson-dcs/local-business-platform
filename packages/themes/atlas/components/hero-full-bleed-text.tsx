"use client";

/**
 * HeroHeadline
 *
 * Large typographic hero statement introducing the conference brand and value proposition
 * Layout: Full-width dark background with oversized multi-line heading containing inline coloured graphic elements
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface HeroHeadlineProps {
  /** headline-text */
  headlineText?: string;
  /** inline-graphic-accents */
  inlineGraphicAccents?: string;
}

export function HeroHeadline(props: HeroHeadlineProps) {
  return (
      <section className="bg-surface-inverse w-full min-h-screen flex items-center justify-center px-6 py-24 md:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto w-full">
          <RevealOnScroll variant="fade-up">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black leading-none tracking-tighter text-surface-background uppercase">
              {props["headline-text"] ? (
                <span>{props["headline-text"]}</span>
              ) : (
                <>
                  <span className="block text-surface-background">
                    The future
                  </span>
                  <span className="block">
                    <span className="text-surface-background">of </span>
                    <span className="relative inline-block">
                      <span className="text-brand-accent">technology</span>
                      {props["inline-graphic-accents"] && (
                        <span
                          className="absolute -bottom-2 left-0 w-full h-2 bg-brand-accent rounded-full"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </span>
                  <span className="block">
                    <span className="text-brand-primary">starts </span>
                    <span className="text-surface-muted-foreground">here.</span>
                  </span>
                </>
              )}
            </h1>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="mt-12 md:mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <p className="text-surface-muted-foreground text-lg md:text-xl lg:text-2xl max-w-xl leading-relaxed font-light">
                Three days. Hundreds of speakers. One unmissable conference
                bringing together the brightest minds shaping tomorrow.
              </p>
  
              <div className="flex items-center gap-6">
                {props["inline-graphic-accents"] && (
                  <>
                    <span
                      className="block w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-primary animate-scale-up"
                      aria-hidden="true"
                    />
                    <span
                      className="block w-10 h-10 md:w-14 md:h-14 rounded-full bg-brand-secondary animate-scale-up"
                      aria-hidden="true"
                      style={{ animationDelay: "100ms" }}
                    />
                    <span
                      className="block w-6 h-6 md:w-8 md:h-8 rounded-full bg-brand-accent animate-scale-up"
                      aria-hidden="true"
                      style={{ animationDelay: "200ms" }}
                    />
                  </>
                )}
              </div>
            </div>
          </RevealOnScroll>
  
          <div
            className="mt-16 md:mt-24 border-t border-surface-muted pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            aria-label="Conference details"
          >
            <dl className="flex flex-wrap gap-8 md:gap-16">
              <div>
                <dt className="text-surface-muted-foreground text-xs uppercase tracking-widest font-semibold mb-1">
                  Date
                </dt>
                <dd className="text-surface-background text-base md:text-lg font-medium">
                  Sept 12–14, 2025
                </dd>
              </div>
              <div>
                <dt className="text-surface-muted-foreground text-xs uppercase tracking-widest font-semibold mb-1">
                  Location
                </dt>
                <dd className="text-surface-background text-base md:text-lg font-medium">
                  San Francisco, CA
                </dd>
              </div>
              <div>
                <dt className="text-surface-muted-foreground text-xs uppercase tracking-widest font-semibold mb-1">
                  Attendees
                </dt>
                <dd className="text-surface-background text-base md:text-lg font-medium">
                  10,000+
                </dd>
              </div>
            </dl>
  
            <span className="text-brand-accent text-sm font-semibold uppercase tracking-widest">
              #TechConf2025
            </span>
          </div>
        </div>
      </section>
    );
}
