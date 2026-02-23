"use client";

/**
 * NewsletterSubscribeBanner
 *
 * Email newsletter subscription form with submit button
 * Layout: Full-width horizontal band with text left and email input + button right
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface NewsletterSubscribeBannerProps {
  /** headline */
  headline?: string;
  /** subtext */
  subtext?: string;
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
  
            {/* Left: Text Content */}
            <RevealOnScroll variant="fade-up">
              <div className="flex-1 max-w-xl">
                {props.headline && (
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-on-brand-primary leading-tight mb-3">
                    {props.headline}
                  </h2>
                )}
                {props.subtext && (
                  <p className="text-base md:text-lg text-on-brand-secondary opacity-90">
                    {props.subtext}
                  </p>
                )}
              </div>
            </RevealOnScroll>
  
            {/* Right: Email Input + Button */}
            <RevealOnScroll variant="fade-up">
              <div className="flex-1 max-w-lg w-full">
                <form
                  className="flex flex-col sm:flex-row gap-3 w-full"
                  onSubmit={(e) => e.preventDefault()}
                  aria-label="Newsletter subscription form"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder={props['email-input']?.placeholder ?? 'Enter your email address'}
                    className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-surface-background text-surface-foreground border border-surface-muted placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm md:text-base"
                    aria-label="Email address"
                  />
                  <button
                    type="submit"
                    className="shrink-0 px-6 py-3 rounded-lg bg-brand-accent text-on-brand-secondary font-semibold text-sm md:text-base hover:opacity-90 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 whitespace-nowrap"
                    aria-label={props['submit-button']?.label ?? 'Subscribe to newsletter'}
                  >
                    {props['submit-button']?.label ?? 'Subscribe'}
                  </button>
                </form>
                <p className="mt-3 text-xs text-on-brand-primary opacity-70">
                  No spam, ever. Unsubscribe at any time.
                </p>
              </div>
            </RevealOnScroll>
  
          </div>
        </div>
      </section>
    );
}
