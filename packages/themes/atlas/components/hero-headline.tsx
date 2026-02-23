"use client";

/**
 * HeroHeadline
 *
 * Large typographic hero statement introducing the conference brand and value proposition with inline coloured graphic accents
 * Layout: Full-width dark background with oversized multi-line heading containing inline coloured graphic elements
 * Category: Hero
 */

import { useState } from "react";

export interface HeroHeadlineProps {
  /** headline-text */
  headlineText?: string;
  /** inline-graphic-accents */
  inlineGraphicAccents?: string;
}

export function HeroHeadline(props: HeroHeadlineProps) {
  return (
      <section className="bg-surface-inverse min-h-screen flex items-center justify-center px-6 py-24 md:py-32 lg:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Pre-label */}
              <div className="flex items-center gap-3">
                <span className="inline-block w-8 h-px bg-brand-primary" aria-hidden="true" />
                <span className="text-surface-muted-foreground text-sm md:text-base uppercase tracking-widest font-medium">
                  Annual Conference 2025
                </span>
              </div>
  
              {/* Main headline */}
              <h1 className="text-surface-background text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold leading-none tracking-tight">
                {props['headline-text'] ? (
                  <span>{props['headline-text']}</span>
                ) : (
                  <>
                    {/* Line 1 */}
                    <span className="block">
                      The Future{' '}
                      <span
                        className="inline-flex items-center justify-center bg-brand-primary text-on-brand-primary px-4 py-1 rounded-md mx-1 align-middle text-4xl md:text-6xl lg:text-7xl xl:text-8xl"
                        aria-hidden="true"
                      >
                        {props['inline-graphic-accents']?.[0] ?? '✦'}
                      </span>{' '}
                      Is
                    </span>
  
                    {/* Line 2 */}
                    <span className="block">
                      Built{' '}
                      <span className="text-brand-accent italic">Together</span>
                      <span
                        className="inline-flex items-center justify-center bg-brand-secondary text-on-brand-secondary px-4 py-1 rounded-full mx-3 align-middle text-3xl md:text-5xl lg:text-6xl xl:text-7xl"
                        aria-hidden="true"
                      >
                        {props['inline-graphic-accents']?.[1] ?? '◆'}
                      </span>
                    </span>
  
                    {/* Line 3 */}
                    <span className="block">
                      <span className="relative inline-block">
                        <span className="relative z-10">Here.</span>
                        <span
                          className="absolute bottom-2 left-0 w-full h-3 md:h-4 lg:h-5 bg-brand-accent opacity-40 -z-0 rounded"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </>
                )}
              </h1>
  
              {/* Supporting value proposition */}
              <p className="mt-6 md:mt-10 text-surface-muted-foreground text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed">
                Three days of bold ideas, world-class speakers, and the connections
                that define the next decade of innovation.
              </p>
  
              {/* Inline graphic accent strip */}
              <div
                className="flex items-center gap-4 mt-8 md:mt-12"
                aria-hidden="true"
              >
                <span className="w-3 h-3 rounded-full bg-brand-primary" />
                <span className="w-3 h-3 rounded-full bg-brand-secondary" />
                <span className="w-3 h-3 rounded-full bg-brand-accent" />
                <span className="flex-1 max-w-xs h-px bg-surface-muted" />
                {props['inline-graphic-accents']?.[2] && (
                  <span className="text-surface-muted-foreground text-2xl">
                    {props['inline-graphic-accents'][2]}
                  </span>
                )}
              </div>
            </div>
          </RevealOnScroll>
  
          {/* Bottom decorative rule */}
          <div
            className="mt-20 md:mt-28 border-t border-surface-muted opacity-30"
            aria-hidden="true"
          />
        </div>
      </section>
    );
}
