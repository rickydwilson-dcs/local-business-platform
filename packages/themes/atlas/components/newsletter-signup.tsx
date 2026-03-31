"use client";

/**
 * NewsletterSignup
 *
 * Site-wide email newsletter subscription form capturing user emails for event updates, present on every page
 * Layout: Full-width dark purple band with heading and subtext left, email input and submit button right
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
            {/* Left: Heading and Subtext */}
            <RevealOnScroll variant="fade-up">
              <div className="md:max-w-lg">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-on-brand-primary mb-3">
                  {props['section-heading'] ?? 'Stay in the Loop'}
                </h2>
                <p className="text-base md:text-lg text-on-brand-secondary">
                  {props['subheading'] ?? 'Get the latest event updates, announcements, and exclusive offers delivered straight to your inbox.'}
                </p>
              </div>
            </RevealOnScroll>
  
            {/* Right: Email Input and Submit Button */}
            <RevealOnScroll variant="fade-up">
              <form
                className="w-full md:w-auto flex flex-col sm:flex-row gap-3"
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
                  className="w-full sm:w-72 md:w-80 px-4 py-3 rounded-lg bg-surface-background text-surface-foreground border border-surface-muted placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm md:text-base"
                  aria-required="true"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-brand-accent text-on-brand-secondary font-semibold text-sm md:text-base whitespace-nowrap hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                >
                  {props['submit-button'] ?? 'Subscribe Now'}
                </button>
              </form>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    );
}
