'use client';

/**
 * NewsletterSignup
 *
 * Captures email addresses for newsletter subscription with heading, subtext, email input and submit button
 * Layout: Full-width horizontal band with heading and subtext left, email input field and submit button right
 * Category: CTA
 */

import { useState } from 'react';

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
    <section className="bg-brand-primary py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex-1">
          <h2 className="text-on-brand-primary text-3xl md:text-4xl font-bold mb-3">
            {props["section-heading"] ?? "Stay in the loop"}
          </h2>
          <p className="text-on-brand-primary text-base md:text-lg opacity-90">
            {props["subheading"] ?? "Get the latest news and updates delivered straight to your inbox."}
          </p>
        </div>
        <div className="flex-1 flex flex-col sm:flex-row gap-3 md:justify-end">
          <label htmlFor="newsletter-email" className="sr-only">
            {props["email-input"] ?? "Email address"}
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder={props["email-input"] ?? "Enter your email address"}
            className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-surface-background text-surface-foreground border border-surface-muted placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent text-base"
            aria-label={props["email-input"] ?? "Email address"}
          />
          <button
            type="submit"
            className="bg-brand-accent text-on-brand-secondary font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap text-base focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            {props["submit-button"] ?? "Subscribe"}
          </button>
        </div>
      </div>
    </section>
  );
}
