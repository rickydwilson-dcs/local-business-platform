"use client";

/**
 * HeroHeadline
 *
 * Large typographic hero statement introducing the conference brand and value proposition with inline colour highlights and decorative shapes
 * Layout: Full-width dark background with oversized multi-line heading using inline colour highlights and decorative shapes
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface HeroHeadlineProps {
  /** headline-text */
  headlineText?: string;
  /** decorative-icons */
  decorativeIcons?: string;
}

export function HeroHeadline(props: HeroHeadlineProps) {
  return (
      <section className="relative bg-surface-inverse overflow-hidden py-24 md:py-36 lg:py-48 px-6 md:px-12 lg:px-20">
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary opacity-20 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-secondary opacity-10 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/2 right-12 w-16 h-16 border-2 border-brand-primary opacity-30 rotate-45 pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-brand-accent opacity-40 rounded-full pointer-events-none" aria-hidden="true" />
  
        <div className="relative max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6 md:gap-8">
              {/* Eyebrow label */}
              <div className="flex items-center gap-3">
                <span className="block w-10 h-px bg-brand-primary" aria-hidden="true" />
                <span className="text-brand-primary text-sm md:text-base font-semibold uppercase tracking-widest">
                  Annual Conference 2025
                </span>
              </div>
  
              {/* Main headline */}
              <h1 className="text-surface-background text-5xl md:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight">
                {props['headline-text'] ? (
                  <span>{props['headline-text']}</span>
                ) : (
                  <>
                    <span className="block">Where bold</span>
                    <span className="block">
                      ideas{' '}
                      <span className="relative inline-block">
                        <span className="text-brand-accent">collide</span>
                        <span
                          className="absolute -bottom-2 left-0 w-full h-1 bg-brand-accent opacity-60 rounded-full"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                    <span className="block">
                      and{' '}
                      <span className="text-brand-primary">futures</span>
                    </span>
                    <span className="block">
                      are{' '}
                      <span className="relative inline-block text-brand-secondary">
                        built.
                        <span
                          className="absolute -top-3 -right-6 w-5 h-5 bg-brand-secondary opacity-50 rounded-full"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </>
                )}
              </h1>
  
              {/* Subheadline / value proposition */}
              <p className="text-surface-muted-foreground text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed mt-4">
                Three days of visionary talks, hands-on workshops, and meaningful connections — designed for the builders, thinkers, and makers shaping tomorrow.
              </p>
  
              {/* Decorative icon row */}
              <div className="flex items-center gap-4 mt-6" aria-hidden="true">
                {props['decorative-icons'] ? (
                  <span className="text-surface-muted-foreground text-sm">{props['decorative-icons']}</span>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-brand-primary" />
                    <span className="w-3 h-3 rounded-full bg-brand-secondary" />
                    <span className="w-3 h-3 rounded-full bg-brand-accent" />
                    <span className="w-16 h-px bg-surface-muted" />
                    <span className="text-surface-muted-foreground text-xs uppercase tracking-widest font-medium">
                      Est. 2019
                    </span>
                  </>
                )}
              </div>
            </div>
          </RevealOnScroll>
  
          {/* Bottom decorative rule */}
          <RevealOnScroll variant="fade-up">
            <div className="mt-20 md:mt-28 flex items-center gap-4">
              <span className="flex-1 h-px bg-surface-muted opacity-30" aria-hidden="true" />
              <span className="text-surface-muted-foreground text-xs uppercase tracking-widest font-medium">
                Scroll to explore
              </span>
              <span className="flex-1 h-px bg-surface-muted opacity-30" aria-hidden="true" />
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
