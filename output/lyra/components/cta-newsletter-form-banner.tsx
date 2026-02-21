'use client';

/**
 * NewsletterSubscribeBanner
 *
 * Encourages users to subscribe to the newsletter with an email input and submit button
 * Layout: Full-width horizontal band with text left and email form right
 * Category: CTA
 */

import { useState } from 'react';

export interface NewsletterSubscribeBannerProps {
  /** section-heading */
  sectionHeading?: string;
  /** section-subheading */
  sectionSubheading?: string;
  /** email-input */
  emailInput?: string;
  /** submit-button */
  submitButton?: Array<{ label?: string; href?: string }>;
}

export function NewsletterSubscribeBanner(props: NewsletterSubscribeBannerProps) {
  return (
    <section className="w-full bg-brand-primary py-12 px-4 md:py-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex-1 max-w-xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-on-brand-primary mb-3">
            {props["section-heading"] ?? "Stay in the loop"}
          </h2>
          <p className="text-base md:text-lg text-on-brand-primary opacity-90">
            {props["section-subheading"] ?? "Get the latest news, updates, and exclusive offers delivered straight to your inbox."}
          </p>
        </div>

        <div className="flex-1 max-w-lg w-full">
          <form
            className="flex flex-col sm:flex-row gap-3 w-full"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter subscription form"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              {props["email-input"] ?? "Email address"}
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              placeholder={props["email-input"] ?? "Enter your email address"}
              className="flex-1 rounded-lg px-4 py-3 text-surface-foreground bg-surface-background border border-surface-muted placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent text-base"
              aria-required="true"
            />
            <button
              type="submit"
              className="bg-brand-accent text-on-brand-secondary font-semibold rounded-lg px-6 py-3 text-base whitespace-nowrap hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
            >
              {props["submit-button"] ?? "Subscribe"}
            </button>
          </form>
          <p className="mt-3 text-sm text-on-brand-primary opacity-75">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
