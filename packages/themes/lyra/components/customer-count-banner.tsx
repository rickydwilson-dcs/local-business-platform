"use client";

/**
 * CustomerCountBanner
 *
 * Highlights the number of satisfied customers to build social proof with a reviews CTA
 * Layout: Full-width row with large stat number and label left, reviews CTA button right
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CustomerCountBannerProps {
  /** stat-number */
  statNumber?: number;
  /** stat-label */
  statLabel?: string;
  /** reviews-cta-button */
  reviewsCtaButton?: { label?: string; href?: string };
}

export function CustomerCountBanner(props: CustomerCountBannerProps) {
  return (
    <section className="bg-surface-foreground py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-1">
            <span className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-brand-primary leading-none">
              {props.statNumber ?? "10,000+"}
            </span>
            <span className="text-lg md:text-xl font-medium text-surface-secondary-foreground">
              {props.statLabel ?? "Satisfied Customers"}
            </span>
          </div>
        </RevealOnScroll>

        <div className="flex-shrink-0">
          <a
            href={props.reviewsCtaButton?.href ?? "#reviews"}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-brand-primary text-on-brand-primary font-semibold text-base md:text-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          >
            {props.reviewsCtaButton?.label ?? "Read Our Reviews"}
          </a>
        </div>
      </div>
    </section>
  );
}
