"use client";

/**
 * NewsletterSubscribeCTA
 *
 * Email newsletter subscription prompt with inline email input and submit button
 * Layout: Full-width band with left-aligned heading and subtext, right-aligned email input and submit button
 * Category: CTA
 */

import { useState } from "react";

export interface NewsletterSubscribeCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** section-subtext */
  sectionSubtext?: string;
  /** email-input */
  emailInput?: string;
  /** submit-button */
  submitButton?: Array<{ label?: string; href?: string }>;
}

export function NewsletterSubscribeCTA(props: NewsletterSubscribeCTAProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-2 md:max-w-md lg:max-w-lg">
              <h2 className="text-2xl font-bold text-on-brand-primary md:text-3xl">
                {props['section-heading'] ?? 'Stay in the loop'}
              </h2>
              <p className="text-base text-on-brand-primary opacity-80">
                {props['section-subtext'] ?? 'Get the latest news, updates, and insights delivered straight to your inbox. No spam, ever.'}
              </p>
            </div>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <form
              className="flex flex-col gap-3 w-full sm:flex-row sm:items-center md:w-auto"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter subscription form"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                {props['email-input']?.label ?? 'Email address'}
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                required
                placeholder={props['email-input']?.placeholder ?? 'Enter your email address'}
                className="w-full sm:w-72 lg:w-80 rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                aria-required="true"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-brand-accent text-on-brand-secondary font-semibold px-6 py-3 text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 transition-all whitespace-nowrap"
              >
                {props['submit-button']?.label ?? 'Subscribe'}
              </button>
            </form>
          </RevealOnScroll>
        </div>
      </section>
    );
}
