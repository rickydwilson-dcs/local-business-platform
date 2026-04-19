"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * HeroSplit
 *
 * Introduces a page or service with a headline, eyebrow label, subtext, optional CTA button, and a product or team image on the right
 * Layout: Two-column split: text content left, framed image right on dark background
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface HeroSplitProps {
  /** eyebrow-label */
  eyebrowLabel?: string;
  /** heading */
  heading?: string;
  /** subheading */
  subheading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
  /** hero-image */
  heroImage?: { src?: string; alt?: string };
  /** trust-badge */
  trustBadge?: string;
}

export function HeroSplit(props: HeroSplitProps) {
  return (
    <section className="bg-surface-inverse min-h-screen flex items-center py-16 px-4">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Text Content */}
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-6">
            {props.eyebrowLabel && (
              <span className="inline-block text-brand-primary text-sm font-semibold uppercase tracking-widest">
                {props.eyebrowLabel}
              </span>
            )}

            {props.heading && (
              <h1 className="text-surface-background text-4xl lg:text-5xl font-bold leading-tight">
                {props.heading}
              </h1>
            )}

            {props.subheading && (
              <p className="text-surface-secondary-foreground text-xl font-medium">
                {props.subheading}
              </p>
            )}

            {props.bodyText && (
              <p className="text-surface-muted-foreground text-base leading-relaxed max-w-lg">
                {props.bodyText}
              </p>
            )}

            {props.ctaButton?.label && (
              <div className="flex items-center gap-4 mt-2">
                <a
                  href={props.ctaButton?.href ?? "#"}
                  className="inline-block bg-brand-primary text-on-brand-primary font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity duration-200"
                >
                  {props.ctaButton.label}
                </a>
              </div>
            )}

            {props.trustBadge && (
              <p className="text-surface-muted-foreground text-sm mt-2 flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded-full bg-brand-accent"
                  aria-hidden="true"
                />
                {props.trustBadge}
              </p>
            )}
          </div>
        </RevealOnScroll>

        {/* Right: Framed Image */}
        <RevealOnScroll variant="fade-up">
          <div className="relative flex justify-center items-center">
            {/* Decorative frame */}
            <div
              className="absolute inset-0 rounded-2xl border-2 border-brand-primary translate-x-4 translate-y-4 pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative rounded-2xl overflow-hidden border border-surface-muted bg-surface-foreground w-full aspect-[4/3] shadow-2xl">
              {props.heroImage?.src ? (
                <img
                  src={props.heroImage.src}
                  alt={props.heroImage.alt ?? "Hero image"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-muted">
                  <span className="text-surface-muted-foreground text-sm">Image coming soon</span>
                </div>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
