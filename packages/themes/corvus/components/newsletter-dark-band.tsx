"use client";

/**
 * NewsletterDarkBand
 *
 * Email newsletter signup with heading, subtext, email input, and submit button
 * Layout: full-bleed dark band with heading left, email input and submit button right
 * Category: CTA
 */

import { useState } from "react";

export interface NewsletterDarkBandProps {
  /** heading */
  heading?: string;
  /** subtext */
  subtext?: string;
  /** emailInput */
  emailInput?: string;
  /** submitButton */
  submitButton?: { label?: string; href?: string };
}

export function NewsletterDarkBand(props: NewsletterDarkBandProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-surface-muted-foreground text-sm uppercase tracking-wider mb-2">CTA</p>
        <h2 className="text-h2 text-surface-foreground mb-4">NewsletterDarkBand</h2>
        <p className="text-body text-surface-secondary-foreground">
          Email newsletter signup with heading, subtext, email input, and submit button
        </p>
      </div>
    </section>
  );
}
