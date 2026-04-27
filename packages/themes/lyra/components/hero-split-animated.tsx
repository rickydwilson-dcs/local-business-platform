"use client";

/**
 * HeroSplit
 *
 * Primary hero introducing the agency as multi-award winning with headline, subtext and CTAs
 * Layout: Two-column split: text left with headline, body copy and two buttons; animated UI mockup right with avatar
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface HeroSplitProps {
  /** eyebrow-label */
  eyebrowLabel?: string;
  /** heading */
  heading?: string;
  /** body-copy */
  bodyCopy?: string;
  /** primary-cta-button */
  primaryCtaButton?: { label?: string; href?: string };
  /** secondary-cta-button */
  secondaryCtaButton?: { label?: string; href?: string };
  /** hero-illustration */
  heroIllustration?: string;
  /** avatar-image */
  avatarImage?: { src?: string; alt?: string };
}

export function HeroSplit(props: HeroSplitProps) {
  return (
    <section className="bg-surface-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text Content */}
          <div className="flex flex-col gap-6 animate-slide-in-left">
            {props.eyebrowLabel && (
              <span className="inline-block text-brand-accent text-sm font-semibold uppercase tracking-widest">
                {props.eyebrowLabel}
              </span>
            )}

            {props.heading && (
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-foreground leading-tight">
                {props.heading}
              </h1>
            )}

            {props.bodyCopy && (
              <p className="text-lg text-surface-muted-foreground leading-relaxed max-w-xl">
                {props.bodyCopy}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              {props.primaryCtaButton?.href && (
                <a
                  href={props.primaryCtaButton.href}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-brand-primary text-on-brand-primary font-semibold text-base hover:opacity-90 transition-opacity duration-200 shadow-md"
                >
                  {props.primaryCtaButton.label ?? "Get Started"}
                </a>
              )}
              {props.secondaryCtaButton?.href && (
                <a
                  href={props.secondaryCtaButton.href}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-brand-primary text-brand-primary font-semibold text-base hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200"
                >
                  {props.secondaryCtaButton.label ?? "Learn More"}
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Animated UI Mockup */}
          <RevealOnScroll variant="fade-up">
            <div className="relative flex items-center justify-center">
              {/* Decorative background blob */}
              <div className="absolute inset-0 rounded-3xl bg-brand-secondary opacity-10 blur-3xl scale-110 pointer-events-none" />

              {/* Mockup card */}
              <div className="relative w-full max-w-md bg-surface-foreground rounded-3xl shadow-2xl overflow-hidden border border-surface-muted">
                {/* Mockup top bar */}
                <div className="flex items-center gap-2 px-5 py-4 bg-surface-muted border-b border-surface-muted">
                  <span className="w-3 h-3 rounded-full bg-brand-accent" />
                  <span className="w-3 h-3 rounded-full bg-brand-secondary" />
                  <span className="w-3 h-3 rounded-full bg-brand-primary" />
                  <div className="ml-4 flex-1 h-3 rounded-full bg-surface-background opacity-40" />
                </div>

                {/* Mockup body */}
                <div className="p-6 flex flex-col gap-5">
                  {/* Hero illustration */}
                  {props.heroIllustration ? (
                    <div className="w-full rounded-2xl overflow-hidden aspect-video bg-surface-muted">
                      <img
                        src={props.heroIllustration}
                        alt="Hero illustration"
                        className="w-full h-full object-cover animate-scale-up"
                      />
                    </div>
                  ) : (
                    <div className="w-full rounded-2xl aspect-video bg-surface-muted flex items-center justify-center">
                      <div className="flex flex-col gap-2 w-3/4">
                        <div className="h-3 rounded-full bg-surface-background opacity-60 w-full" />
                        <div className="h-3 rounded-full bg-surface-background opacity-40 w-4/5" />
                        <div className="h-3 rounded-full bg-surface-background opacity-30 w-2/3" />
                      </div>
                    </div>
                  )}

                  {/* Avatar row */}
                  <div className="flex items-center gap-4 px-2">
                    {props.avatarImage?.src ? (
                      <img
                        src={props.avatarImage.src}
                        alt={props.avatarImage.alt ?? "Team member avatar"}
                        className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-on-brand-primary font-bold text-lg shadow-md">
                        A
                      </div>
                    )}
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="h-3 rounded-full bg-surface-muted w-2/3" />
                      <div className="h-2 rounded-full bg-surface-muted w-1/2 opacity-60" />
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-4 h-4 text-brand-accent"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Stat pills */}
                  <div className="flex gap-3 flex-wrap">
                    <span className="px-4 py-2 rounded-full bg-brand-primary text-on-brand-primary text-xs font-semibold shadow-sm">
                      🏆 Multi-Award Winning
                    </span>
                    <span className="px-4 py-2 rounded-full bg-surface-muted text-surface-foreground text-xs font-semibold">
                      500+ Projects
                    </span>
                    <span className="px-4 py-2 rounded-full bg-surface-muted text-surface-foreground text-xs font-semibold">
                      98% Satisfaction
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
