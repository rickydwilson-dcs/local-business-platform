"use client";

/**
 * NewsletterSignup
 *
 * Captures email addresses for newsletter subscription
 * Layout: Dark purple full-width bar with heading left, email input and submit button right
 * Category: CTA
 */

import { useState } from "react";

export interface NewsletterSignupProps {
  /** section-heading */
  sectionHeading?: string;
  /** subheading */
  subheading?: string;
  /** email-input */
  emailInput?: string;
  /** submit-button */
  submitButton?: Array<{ label?: string; href?: string }>;
}

export function NewsletterSignup(props: NewsletterSignupProps) {
  return (
      <section className="w-full bg-brand-primary py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Left: Headings */}
            <div className="flex-1 max-w-xl">
              {props['section-heading'] && (
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-on-brand-primary leading-tight">
                  {props['section-heading']}
                </h2>
              )}
              {props['subheading'] && (
                <p className="mt-3 text-base md:text-lg text-surface-muted-foreground">
                  {props['subheading']}
                </p>
              )}
            </div>
  
            {/* Right: Email input + Submit */}
            <div className="flex-1 max-w-lg w-full">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row gap-3 w-full"
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
                  className="flex-1 min-w-0 rounded-lg px-4 py-3 text-surface-foreground bg-surface-background border border-surface-muted placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm md:text-base"
                  aria-required="true"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg px-6 py-3 bg-brand-accent text-on-brand-secondary font-semibold text-sm md:text-base hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
                >
                  {props['submit-button'] ?? 'Subscribe'}
                </button>
              </form>
              <p className="mt-3 text-xs text-surface-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
}
