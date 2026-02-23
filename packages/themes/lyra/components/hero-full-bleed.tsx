"use client";

/**
 * HeroFullBleed
 *
 * Primary hero with bold headline communicating conference value proposition using coloured inline decorative elements
 * Layout: Full-width dark background with large multi-line heading and inline coloured decorative elements
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface HeroFullBleedProps {
  /** headline */
  headline?: string;
  /** decorative-icons */
  decorativeIcons?: string;
}

export function HeroFullBleed(props: HeroFullBleedProps) {
  return (
      <section className="relative w-full bg-surface-inverse overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
          <RevealOnScroll variant="fade-up">
            <div className="max-w-5xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-surface-background">
                {props.headline ? (
                  props.headline
                ) : (
                  <>
                    The conference
                    <span className="inline-flex items-center mx-3 align-middle">
                      <span className="inline-block w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-accent" aria-hidden="true" />
                    </span>
                    where ideas
                    <br />
                    become{" "}
                    <span className="text-brand-accent">movements</span>
                    <span className="inline-flex items-center mx-3 align-middle">
                      <span className="inline-block w-6 h-6 md:w-8 md:h-8 rounded-sm bg-brand-secondary rotate-12" aria-hidden="true" />
                    </span>
                    <br />
                    and builders become{" "}
                    <span className="text-brand-primary">leaders</span>
                    <span className="inline-flex items-center ml-3 align-middle">
                      <span className="inline-block w-5 h-5 md:w-7 md:h-7 rounded-full bg-brand-primary" aria-hidden="true" />
                    </span>
                  </>
                )}
              </h1>
  
              <div className="mt-8 md:mt-12 flex flex-wrap gap-3" aria-hidden="true">
                {props["decorative-icons"] ? (
                  props["decorative-icons"]
                ) : (
                  <>
                    <span className="inline-block w-3 h-3 rounded-full bg-brand-accent" />
                    <span className="inline-block w-3 h-3 rounded-full bg-brand-primary" />
                    <span className="inline-block w-3 h-3 rounded-full bg-brand-secondary" />
                    <span className="inline-block w-3 h-3 rounded-full bg-surface-muted" />
                    <span className="inline-block w-3 h-3 rounded-full bg-brand-accent" />
                    <span className="inline-block w-3 h-3 rounded-full bg-brand-primary" />
                    <span className="inline-block w-3 h-3 rounded-full bg-brand-secondary" />
                    <span className="inline-block w-3 h-3 rounded-full bg-surface-muted" />
                    <span className="inline-block w-3 h-3 rounded-full bg-brand-accent" />
                    <span className="inline-block w-3 h-3 rounded-full bg-brand-primary" />
                    <span className="inline-block w-3 h-3 rounded-full bg-brand-secondary" />
                    <span className="inline-block w-3 h-3 rounded-full bg-surface-muted" />
                  </>
                )}
              </div>
            </div>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="mt-12 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="inline-block w-2 h-10 bg-brand-accent rounded-full" aria-hidden="true" />
                <p className="text-surface-muted-foreground text-base md:text-lg font-medium">
                  Annual gathering of the world's most ambitious builders, thinkers, and creators.
                </p>
              </div>
            </div>
  
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                className="px-8 py-4 bg-brand-primary text-on-brand-primary font-semibold text-base md:text-lg rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-surface-inverse"
                type="button"
              >
                Register Now
              </button>
              <button
                className="px-8 py-4 border border-surface-muted text-surface-background font-semibold text-base md:text-lg rounded-full hover:bg-surface-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-surface-muted focus:ring-offset-2 focus:ring-offset-surface-inverse"
                type="button"
              >
                View Programme
              </button>
            </div>
          </RevealOnScroll>
        </div>
  
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full bg-brand-primary opacity-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-72 md:h-72 rounded-full bg-brand-accent opacity-10 -translate-x-1/3 translate-y-1/3 pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-sm bg-brand-secondary opacity-10 rotate-45 pointer-events-none" aria-hidden="true" />
      </section>
    );
}
