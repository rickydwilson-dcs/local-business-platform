"use client";

/**
 * NewsletterSignup
 *
 * Full-width newsletter subscription band capturing email addresses for event updates, present on every page
 * Layout: Full-width horizontal band with heading and subtext left, email input and submit button right
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface NewsletterSignupProps {
  /** section-heading */
  sectionHeading?: string;
  /** subtext */
  subtext?: string;
  /** email-input */
  emailInput?: string;
  /** submit-button */
  submitButton?: Array<{ label?: string; href?: string }>;
}

export function NewsletterSignup(props: NewsletterSignupProps) {
  return (
      <section className="w-full bg-brand-primary py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Left: Heading and Subtext */}
              <div className="flex-1 max-w-xl">
                <h2 className="text-2xl md:text-3xl font-bold text-on-brand-primary mb-3">
                  {props['section-heading'] ?? 'Stay in the Loop'}
                </h2>
                <p className="text-on-brand-primary opacity-80 text-base md:text-lg leading-relaxed">
                  {props['subtext'] ?? 'Get the latest event updates, announcements, and exclusive offers delivered straight to your inbox.'}
                </p>
              </div>
  
              {/* Right: Email Input and Submit Button */}
              <div className="flex-1 max-w-lg w-full">
                <form
                  className="flex flex-col sm:flex-row gap-3 w-full"
                  onSubmit={(e) => e.preventDefault()}
                  aria-label="Newsletter signup form"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    {props['email-input'] ?? 'Email address'}
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    required
                    placeholder={props['email-input'] ?? 'Enter your email address'}
                    className="flex-1 px-4 py-3 rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm md:text-base"
                    aria-required="true"
                  />
                  <button
                    type="submit"
                    className="bg-brand-accent text-on-brand-secondary font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-200 whitespace-nowrap text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                  >
                    {props['submit-button'] ?? 'Subscribe Now'}
                  </button>
                </form>
                <p className="mt-3 text-xs text-on-brand-primary opacity-60">
                  No spam, ever. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
