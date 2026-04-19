"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * EnquireCTABanner
 *
 * Full-width call-to-action banner prompting users to enquire about services
 * Layout: Single row with headline text left and outlined CTA button right, brand-colour background
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface EnquireCTABannerProps {
  /** headline */
  headline?: string;
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
}

export function EnquireCTABanner(props: EnquireCTABannerProps) {
  return (
    <section className="bg-brand-primary w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
          <RevealOnScroll variant="fade-up">
            <h2 className="text-on-brand-primary text-2xl md:text-3xl lg:text-4xl font-bold leading-tight max-w-xl">
              {props.headline ?? "Ready to get started? Enquire about our services today."}
            </h2>
          </RevealOnScroll>

          <div className="flex-shrink-0">
            <a
              href={props.ctaButton?.href ?? "#enquire"}
              className="inline-block border-2 border-surface-background text-on-brand-primary hover:bg-surface-background hover:text-brand-primary transition-colors duration-200 font-semibold text-base md:text-lg px-8 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-surface-background"
              aria-label={props.ctaButton?.label ?? "Enquire now"}
            >
              {props.ctaButton?.label ?? "Enquire Now"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
