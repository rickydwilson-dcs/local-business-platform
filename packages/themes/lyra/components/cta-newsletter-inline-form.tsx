"use client";

/**
 * NewsletterSubscribeCTA
 *
 * Email newsletter subscription section encouraging visitors to sign up for event news and articles
 * Layout: Full-width band with left-aligned heading and subtext, right-aligned email input and submit button
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

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
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <RevealOnScroll variant="fade-up">
            <div className="flex-1 max-w-xl">
              <h2 className="text-on-brand-primary text-3xl md:text-4xl font-bold mb-3">
                {props['section-heading'] ?? 'Stay in the Loop'}
              </h2>
              <p className="text-on-brand-primary text-base md:text-lg opacity-90">
                {props['section-subtext'] ?? 'Get the latest event news, articles, and updates delivered straight to your inbox. No spam, ever.'}
              </p>
            </div>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:max-w-lg">
              <label htmlFor="newsletter-email" className="sr-only">
                {props['email-input'] ?? 'Email address'}
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder={props['email-input'] ?? 'Enter your email address'}
                className="flex-1 px-4 py-3 rounded-lg border border-brand-primary bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent text-base"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="bg-brand-accent text-on-brand-secondary font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-200 whitespace-nowrap text-base focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
              >
                {props['submit-button'] ?? 'Subscribe Now'}
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
