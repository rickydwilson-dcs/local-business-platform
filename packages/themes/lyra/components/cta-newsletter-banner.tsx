"use client";

/**
 * NewsletterSubscribeBanner
 *
 * Email newsletter subscription form with submit button
 * Layout: Full-width horizontal band with heading/subtext left and email input + submit button right
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface NewsletterSubscribeBannerProps {
  /** section-heading */
  sectionHeading?: string;
  /** section-subtext */
  sectionSubtext?: string;
  /** email-input */
  emailInput?: string;
  /** submit-button */
  submitButton?: Array<{ label?: string; href?: string }>;
}

export function NewsletterSubscribeBanner(props: NewsletterSubscribeBannerProps) {
  return (
      <section className="w-full bg-brand-primary py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Left: Heading and Subtext */}
            <RevealOnScroll variant="fade-up">
              <div className="flex-1 max-w-xl">
                {props['section-heading'] && (
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-on-brand-primary mb-3">
                    {props['section-heading']}
                  </h2>
                )}
                {props['section-subtext'] && (
                  <p className="text-base md:text-lg text-on-brand-primary opacity-90">
                    {props['section-subtext']}
                  </p>
                )}
              </div>
            </RevealOnScroll>
  
            {/* Right: Email Input + Submit Button */}
            <RevealOnScroll variant="fade-up">
              <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:max-w-lg">
                <label htmlFor="newsletter-email" className="sr-only">
                  {props['email-input']?.placeholder || 'Email address'}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder={props['email-input']?.placeholder || 'Enter your email address'}
                  className="flex-1 px-4 py-3 rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent text-base"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-brand-accent text-on-brand-secondary font-semibold text-base whitespace-nowrap hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                  aria-label={props['submit-button']?.label || 'Subscribe to newsletter'}
                >
                  {props['submit-button']?.label || 'Subscribe'}
                </button>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    );
}
