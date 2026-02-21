'use client';

/**
 * NewsletterSubscribeCTA
 *
 * Encourages visitors to subscribe to the newsletter with an inline email form
 * Layout: Full-width purple band with heading and subtext left, email input and submit button right
 * Category: CTA
 */

import { useState } from 'react';

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
    <section className="bg-brand-primary w-full">
      <div className="max-w-7xl mx-auto px-4 py-14 md:py-16 lg:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex flex-col gap-3 md:max-w-md lg:max-w-lg">
          <h2 className="text-on-brand-primary text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            {props["section-heading"] ?? "Stay in the loop"}
          </h2>
          <p className="text-on-brand-primary text-base md:text-lg opacity-90">
            {props["section-subtext"] ?? "Get the latest news, articles, and resources delivered straight to your inbox every week."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:min-w-[420px] lg:min-w-[480px]">
          <label htmlFor="newsletter-email" className="sr-only">
            {props["email-input"] ?? "Email address"}
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder={props["email-input"] ?? "Enter your email address"}
            className="flex-1 rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-accent"
            aria-label="Email address"
          />
          <button
            type="submit"
            className="bg-brand-accent text-on-brand-secondary font-semibold rounded-lg px-6 py-3 text-base whitespace-nowrap hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            {props["submit-button"] ?? "Subscribe"}
          </button>
        </div>
      </div>
    </section>
  );
}
