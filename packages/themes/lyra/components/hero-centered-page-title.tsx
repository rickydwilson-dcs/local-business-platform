"use client";

/**
 * PageHero
 *
 * Page title and subtitle introducing the Logo Design Questionnaire
 * Layout: Centered text block with eyebrow label, large heading, and subtitle
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface PageHeroProps {
  /** eyebrow-label */
  eyebrowLabel?: string;
  /** page-title */
  pageTitle?: string;
  /** subtitle */
  subtitle?: string;
}

export function PageHero(props: PageHeroProps) {
  return (
    <section className="bg-surface-background py-16 px-4 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <RevealOnScroll variant="fade-up">
          {props.eyebrowLabel && (
            <span className="inline-block text-brand-primary text-sm font-semibold uppercase tracking-widest mb-4">
              {props.eyebrowLabel}
            </span>
          )}
          {props.pageTitle && (
            <h1 className="text-surface-foreground text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {props.pageTitle}
            </h1>
          )}
          {props.subtitle && (
            <p className="text-surface-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              {props.subtitle}
            </p>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
