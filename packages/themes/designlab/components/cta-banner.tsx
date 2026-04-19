"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * CTABanner
 *
 * Full-width call-to-action banner encouraging visitors to enquire, appearing on every page above the footer
 * Layout: Single row with headline text left and outlined CTA button right on brand-colour background
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CTABannerProps {
  /** cta-heading */
  ctaHeading?: { label?: string; href?: string };
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
}

export function CTABanner(props: CTABannerProps) {
  return (
    <section className="bg-brand-primary w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
            <h2 className="text-on-brand-primary text-2xl md:text-3xl lg:text-4xl font-bold leading-tight max-w-2xl">
              {props.ctaHeading?.label ?? "Ready to get started? Enquire with us today."}
            </h2>
            <div className="flex-shrink-0">
              <a
                href={props.ctaButton?.href ?? "#contact"}
                className="inline-block border-2 border-surface-background text-on-brand-primary hover:bg-surface-background hover:text-brand-primary transition-colors duration-200 font-semibold text-base md:text-lg px-8 py-3 rounded-md whitespace-nowrap"
              >
                {props.ctaButton?.label ?? "Enquire Now"}
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
