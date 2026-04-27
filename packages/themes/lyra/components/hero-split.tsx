"use client";

/**
 * HeroSplit
 *
 * Primary two-column hero with headline, subtext, CTA buttons on the left and a supporting image or illustration on the right
 * Layout: Two-column split: text content left with eyebrow label, heading, body copy and CTA buttons; image or animated illustration right
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
  /** hero-image */
  heroImage?: { src?: string; alt?: string };
}

export function HeroSplit(props: HeroSplitProps) {
  return (
    <section className="bg-surface-background py-16 px-4 md:py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <div className="flex flex-col gap-6">
          {props.eyebrowLabel && (
            <span className="text-brand-accent text-sm font-semibold uppercase tracking-widest">
              {props.eyebrowLabel}
            </span>
          )}

          {props.heading && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-primary leading-tight">
              {props.heading}
            </h1>
          )}

          {props.bodyCopy && (
            <p className="text-surface-muted-foreground text-lg md:text-xl leading-relaxed max-w-lg">
              {props.bodyCopy}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            {props.primaryCtaButton?.label && (
              <a
                href={props.primaryCtaButton?.href ?? "#"}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-primary text-on-brand-primary font-semibold text-base transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              >
                {props.primaryCtaButton.label}
              </a>
            )}

            {props.secondaryCtaButton?.label && (
              <a
                href={props.secondaryCtaButton?.href ?? "#"}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-brand-primary text-brand-primary font-semibold text-base bg-surface-background transition-colors hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              >
                {props.secondaryCtaButton.label}
              </a>
            )}
          </div>
        </div>

        {/* Right: Image / Illustration */}
        <RevealOnScroll variant="fade-up">
          <div className="flex items-center justify-center">
            {props.heroImage?.src ? (
              <img
                src={props.heroImage.src}
                alt={props.heroImage.alt ?? "Hero illustration"}
                className="w-full max-w-lg rounded-2xl object-cover shadow-lg animate-fade-in-up"
              />
            ) : (
              <div className="w-full max-w-lg aspect-[4/3] rounded-2xl bg-surface-muted flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-surface-muted-foreground opacity-40"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
