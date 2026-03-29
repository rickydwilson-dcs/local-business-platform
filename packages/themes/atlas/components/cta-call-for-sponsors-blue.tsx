"use client";

/**
 * CallForSponsorsCTA
 *
 * Invites potential sponsors to view sponsorship levels with a brief pitch
 * Layout: Full-width blue background block with heading and body copy right-aligned, CTA button below
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CallForSponsorsCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-copy */
  bodyCopy?: string;
  /** sponsor-levels-cta-button */
  sponsorLevelsCtaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForSponsorsCTA(props: CallForSponsorsCTAProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-end gap-8">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col items-end gap-4 text-right max-w-2xl">
              {props['section-heading'] && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-on-brand-primary">
                  {props['section-heading']}
                </h2>
              )}
              {props['body-copy'] && (
                <p className="text-base md:text-lg text-on-brand-primary opacity-90 leading-relaxed">
                  {props['body-copy']}
                </p>
              )}
            </div>
          </RevealOnScroll>
  
          {props['sponsor-levels-cta-button'] && (
            <div className="flex justify-end">
              <button className="bg-brand-accent text-on-brand-secondary font-semibold text-base md:text-lg px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent">
                {props['sponsor-levels-cta-button']}
              </button>
            </div>
          )}
        </div>
      </section>
    );
}
