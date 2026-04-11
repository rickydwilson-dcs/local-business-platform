"use client";

/**
 * HeroHeadline
 *
 * Large typographic hero statement introducing the conference brand and value proposition with inline coloured graphic accents
 * Layout: Full-width dark background with oversized multi-line heading containing inline coloured graphic elements
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface HeroHeadlineProps {
  /** headline-text */
  headlineText?: string;
  /** inline-graphic-accents */
  inlineGraphicAccents?: string[];
}

export function HeroHeadline(props: HeroHeadlineProps) {
  return (
    <section className="bg-surface-inverse min-h-screen flex items-center py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Eyebrow label */}
            <div className="flex items-center gap-3">
              <span className="block w-10 h-0.5 bg-brand-accent" />
              <span className="text-brand-accent text-sm font-semibold uppercase tracking-widest">
                Annual Conference 2025
              </span>
            </div>

            {/* Main oversized headline */}
            <h1 className="text-surface-foreground font-extrabold leading-none tracking-tight text-5xl md:text-7xl lg:text-9xl">
              {props.headlineText ? (
                <span>{props.headlineText}</span>
              ) : (
                <>
                  {/* Line 1 */}
                  <span className="block">
                    Build the{" "}
                    <span className="relative inline-block">
                      <span className="text-surface-foreground">Future</span>
                      {/* Inline graphic accent — underline squiggle */}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-2 left-0 w-full h-2 bg-brand-secondary rounded-full opacity-60"
                      />
                    </span>
                  </span>

                  {/* Line 2 */}
                  <span className="block mt-2 md:mt-4">
                    Together{" "}
                    <span className="inline-flex items-center gap-3 md:gap-5">
                      {/* Inline coloured pill accent */}
                      <span
                        aria-hidden="true"
                        className="inline-block w-16 h-10 md:w-28 md:h-14 lg:w-40 lg:h-20 bg-brand-secondary rounded-full align-middle"
                      />
                      <span className="text-brand-secondary">We</span>
                    </span>
                  </span>

                  {/* Line 3 */}
                  <span className="block mt-2 md:mt-4">
                    <span className="text-surface-foreground">Innovate</span>{" "}
                    <span className="relative inline-block">
                      <span className="text-brand-accent">Boldly</span>
                      {/* Inline graphic accent — dot cluster */}
                      <span aria-hidden="true" className="absolute -top-3 -right-4 flex gap-1">
                        <span className="block w-2 h-2 rounded-full bg-brand-accent opacity-80" />
                        <span className="block w-2 h-2 rounded-full bg-brand-primary opacity-60" />
                        <span className="block w-2 h-2 rounded-full bg-brand-secondary opacity-40" />
                      </span>
                    </span>
                  </span>
                </>
              )}
            </h1>

            {/* Inline graphic accents row */}
            {props.inlineGraphicAccents && (
              <div className="flex flex-wrap gap-3 mt-4" aria-hidden="true">
                {props.inlineGraphicAccents.map((accent: string, i: number) => (
                  <span
                    key={i}
                    className="inline-block px-4 py-2 rounded-full bg-brand-primary text-on-brand-primary text-xs font-bold uppercase tracking-widest"
                  >
                    {accent}
                  </span>
                ))}
              </div>
            )}

            {/* Decorative graphic accents (default) */}
            {!props.inlineGraphicAccents && (
              <div className="flex flex-wrap items-center gap-3 mt-6" aria-hidden="true">
                <span className="inline-block w-6 h-6 rounded-full bg-surface-foreground opacity-30" />
                <span className="inline-block w-4 h-4 rounded-full bg-brand-secondary" />
                <span className="inline-block w-8 h-1 rounded-full bg-brand-accent" />
                <span className="inline-block w-4 h-4 rounded-full bg-surface-foreground opacity-20" />
                <span className="inline-block w-6 h-1 rounded-full bg-brand-secondary opacity-40" />
              </div>
            )}

            {/* Sub-value proposition */}
            <p className="text-surface-muted-foreground text-lg md:text-xl lg:text-2xl max-w-2xl mt-6 leading-relaxed font-light">
              The premier gathering for visionaries, builders, and leaders shaping tomorrow's
              technology landscape.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a
                href="#register"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-secondary text-brand-primary font-bold text-base rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2 focus:ring-offset-surface-inverse"
              >
                Register Now
              </a>
              <a
                href="#programme"
                className="inline-flex items-center justify-center px-8 py-4 border border-surface-foreground text-surface-foreground font-semibold text-base rounded-full hover:bg-surface-foreground hover:text-surface-inverse transition-colors focus:outline-none focus:ring-2 focus:ring-surface-foreground focus:ring-offset-2 focus:ring-offset-surface-inverse"
              >
                View Programme
              </a>
            </div>
          </div>
        </RevealOnScroll>

        {/* Bottom decorative bar */}
        <div className="mt-20 flex gap-1" aria-hidden="true">
          <span className="flex-1 h-0.5 bg-brand-primary opacity-80" />
          <span className="flex-1 h-0.5 bg-brand-secondary opacity-60" />
          <span className="flex-1 h-0.5 bg-brand-accent opacity-40" />
          <span className="flex-1 h-0.5 bg-surface-muted opacity-20" />
        </div>
      </div>
    </section>
  );
}
