"use client";

/**
 * HeroFullBleed
 *
 * Primary hero with large typographic headline introducing the conference brand and value proposition
 * Layout: Full-width dark background with oversized multi-line heading and decorative inline colour shapes
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface HeroFullBleedProps {
  /** headline */
  headline?: string;
  /** decorative-shapes */
  decorativeShapes?: string;
}

export function HeroFullBleed(props: HeroFullBleedProps) {
  return (
      <section className="relative w-full min-h-screen bg-brand-primary overflow-hidden flex items-center">
        {/* Decorative background blobs */}
        {props.decorativeShapes !== false && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <span className="absolute top-12 left-8 w-24 h-24 md:w-40 md:h-40 rounded-full bg-brand-accent opacity-20 blur-2xl" />
            <span className="absolute bottom-16 right-12 w-32 h-32 md:w-56 md:h-56 rounded-full bg-brand-secondary opacity-20 blur-3xl" />
            <span className="absolute top-1/2 left-1/3 w-16 h-16 md:w-28 md:h-28 rounded-full bg-brand-accent opacity-10 blur-xl" />
          </div>
        )}
  
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-36 lg:py-48">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-8 md:gap-12">
              {/* Eyebrow label */}
              <div className="flex items-center gap-3">
                <span className="inline-block w-8 h-1 bg-brand-accent rounded-full" />
                <span className="text-brand-accent text-sm md:text-base font-semibold uppercase tracking-widest">
                  Annual Conference
                </span>
              </div>
  
              {/* Main headline */}
              <h1 className="text-on-brand-primary text-5xl md:text-7xl lg:text-9xl font-black leading-none tracking-tight max-w-5xl">
                {props.headline ? (
                  props.headline
                ) : (
                  <>
                    The Future{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10 text-on-brand-primary">Starts</span>
                      <span
                        className="absolute -bottom-2 left-0 w-full h-4 md:h-6 bg-brand-accent opacity-60 rounded-sm -z-0"
                        aria-hidden="true"
                      />
                    </span>{" "}
                    <br className="hidden md:block" />
                    <span className="text-brand-accent">Here.</span>
                  </>
                )}
              </h1>
  
              {/* Decorative inline colour shapes row */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4" aria-hidden="true">
                <span className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-brand-accent animate-scale-up" />
                <span className="w-10 h-3 md:w-16 md:h-4 rounded-full bg-brand-secondary animate-scale-up" style={{ animationDelay: "0.1s" }} />
                <span className="w-10 h-10 md:w-14 md:h-14 rounded-sm bg-surface-foreground opacity-30 animate-scale-up" style={{ animationDelay: "0.2s" }} />
                <span className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-brand-primary border-2 border-brand-accent animate-scale-up" style={{ animationDelay: "0.3s" }} />
                <span className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-brand-secondary opacity-70 animate-scale-up" style={{ animationDelay: "0.4s" }} />
              </div>
  
              {/* Value proposition subtext */}
              <p className="text-surface-muted-foreground text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed">
                Three days of bold ideas, world-class speakers, and transformative conversations shaping the next decade of innovation.
              </p>
  
              {/* CTA row */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="#register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-brand-accent text-on-brand-primary font-bold text-base md:text-lg rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
                >
                  Register Now
                </a>
                <a
                  href="#programme"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-surface-muted text-on-brand-primary font-semibold text-base md:text-lg rounded-full hover:border-brand-accent hover:text-brand-accent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
                >
                  View Programme
                </a>
              </div>
            </div>
          </RevealOnScroll>
  
          {/* Bottom meta strip */}
          <RevealOnScroll variant="fade-up">
            <div className="mt-20 md:mt-28 pt-8 border-t border-surface-muted flex flex-col sm:flex-row gap-6 sm:gap-12 text-surface-muted-foreground text-sm md:text-base">
              <div className="flex flex-col gap-1">
                <span className="text-on-brand-primary font-semibold text-base md:text-lg">12–14 September 2025</span>
                <span>Conference Dates</span>
              </div>
              <div className="hidden sm:block w-px bg-surface-muted" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <span className="text-on-brand-primary font-semibold text-base md:text-lg">San Francisco, CA</span>
                <span>Location</span>
              </div>
              <div className="hidden sm:block w-px bg-surface-muted" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <span className="text-on-brand-primary font-semibold text-base md:text-lg">4,000+ Attendees</span>
                <span>Expected Audience</span>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
