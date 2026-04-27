"use client";

/**
 * SupportCTABanner
 *
 * Encourages users who have broken their website to contact the team for help
 * Layout: Dark full-width band with headline and body text left, contact button below text, illustrated avatars right
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface SupportCTABannerProps {
  /** heading */
  heading?: string;
  /** body-copy */
  bodyCopy?: string;
  /** contact-cta-button */
  contactCtaButton?: { label?: string; href?: string };
  /** avatar-illustration-group */
  avatarIllustrationGroup?: string;
}

export function SupportCTABanner(props: SupportCTABannerProps) {
  return (
    <section className="bg-surface-inverse w-full py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left: Text content */}
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col items-start max-w-xl">
            {props.heading && (
              <h2 className="text-surface-background text-3xl md:text-4xl font-bold leading-tight mb-4">
                {props.heading}
              </h2>
            )}
            {props.bodyCopy && (
              <p className="text-surface-muted-foreground text-base md:text-lg mb-8">
                {props.bodyCopy}
              </p>
            )}
            {props.contactCtaButton && (
              <a
                href={props.contactCtaButton?.href}
                className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-base px-6 py-3 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                {props.contactCtaButton?.label}
              </a>
            )}
          </div>
        </RevealOnScroll>

        {/* Right: Avatar illustration group */}
        {props.avatarIllustrationGroup && (
          <RevealOnScroll variant="fade-up">
            <div className="flex-shrink-0 flex items-center justify-center w-full md:w-auto">
              <img
                src={props.avatarIllustrationGroup}
                alt="Support team avatars"
                className="w-64 md:w-80 lg:w-96 object-contain"
              />
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
