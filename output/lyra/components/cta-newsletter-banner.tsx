'use client';

/**
 * NewsletterSubscribeBanner
 *
 * Email newsletter subscription form with submit button
 * Layout: Full-width horizontal band with text left and email input + submit button right
 * Category: CTA
 */

import { useState } from 'react';

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
    <section className="bg-brand-primary w-full py-12 px-4 md:py-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex-1 max-w-xl">
          <h2 className="text-on-brand-primary text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            {props.headline ?? "Stay in the loop"}
          </h2>
          <p className="text-on-brand-primary opacity-80 text-base md:text-lg">
            {props.subtext ?? "Get the latest news and updates delivered straight to your inbox."}
          </p>
        </div>

        <form
          className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:min-w-[420px]"
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
            required
            placeholder={props["email-input"] ?? "Enter your email address"}
            className="flex-1 rounded-lg px-4 py-3 text-surface-foreground bg-surface-background border border-surface-muted placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent text-base"
            aria-label="Email address"
          />
          <button
            type="submit"
            className="bg-brand-accent text-on-brand-secondary font-semibold rounded-lg px-6 py-3 text-base whitespace-nowrap hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            {props["submit-button"] ?? "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
