"use client";

/**
 * HeroFullBleedText
 *
 * Primary hero with large typographic headline introducing the conference brand using coloured inline highlights and decorative shapes
 * Layout: Full-width dark background with large multi-line heading using coloured inline highlights and decorative shapes
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface HeroFullBleedTextProps {
  /** headline */
  headline?: string;
  /** decorative-shapes */
  decorativeShapes?: string;
}

export function HeroFullBleedText(props: HeroFullBleedTextProps) {
  return (
    <section className="relative min-h-screen bg-surface-inverse overflow-hidden flex items-center">
      {/* Decorative background shapes */}
      {props.decorativeShapes !== "false" && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-brand-primary opacity-20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-brand-secondary opacity-15 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-brand-accent opacity-10 rotate-45 pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border-2 border-brand-primary opacity-30 rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-brand-secondary opacity-40 rounded-full pointer-events-none" />
        </>
      )}

      <div className="relative z-10 w-full px-6 py-24 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Eyebrow label */}
            <div className="flex items-center gap-3">
              <span className="block w-10 h-px bg-brand-primary" />
              <span className="text-brand-primary text-sm md:text-base font-semibold uppercase tracking-widest">
                Annual Conference
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-surface-background text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-none tracking-tight">
              {props.headline ? (
                <span>{props.headline}</span>
              ) : (
                <>
                  <span className="block">The Future</span>
                  <span className="block">
                    of{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10 text-on-brand-primary px-3 py-1 bg-brand-primary rounded-md">
                        Design
                      </span>
                    </span>
                  </span>
                  <span className="block">
                    &amp;{" "}
                    <span className="text-brand-secondary underline decoration-wavy decoration-brand-accent underline-offset-8">
                      Innovation
                    </span>
                  </span>
                  <span className="block">
                    Starts{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10 text-on-brand-secondary px-3 py-1 bg-brand-secondary rounded-md">
                        Here
                      </span>
                      <span className="absolute -bottom-2 -right-2 w-full h-full border-2 border-brand-accent rounded-md pointer-events-none" />
                    </span>
                  </span>
                </>
              )}
            </h1>

            {/* Decorative divider */}
            <div className="flex items-center gap-4 mt-4">
              <span className="block w-20 h-1 bg-brand-primary rounded-full" />
              <span className="block w-6 h-6 bg-brand-accent rotate-45 rounded-sm" />
              <span className="block w-12 h-1 bg-brand-secondary rounded-full" />
            </div>

            {/* Subtext */}
            <p className="text-surface-muted-foreground text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed">
              Join thousands of creators, builders, and visionaries for three days of talks,
              workshops, and unforgettable moments.
            </p>

            {/* Meta info row */}
            <div className="flex flex-wrap items-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="text-surface-background text-sm md:text-base font-medium">
                  October 14–16, 2025
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-secondary" />
                <span className="text-surface-background text-sm md:text-base font-medium">
                  San Francisco, CA
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-accent" />
                <span className="text-surface-background text-sm md:text-base font-medium">
                  3,000+ Attendees
                </span>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Bottom decorative bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
          <span className="flex-1 bg-brand-primary" />
          <span className="flex-1 bg-brand-secondary" />
          <span className="flex-1 bg-brand-accent" />
        </div>
      </div>
    </section>
  );
}
