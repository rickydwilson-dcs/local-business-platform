"use client";

/**
 * NewsletterSignupCTA
 *
 * Captures email addresses for newsletter subscription with headline, subtext, email input, and submit button
 * Layout: Full-width dark background band with heading and subtext left, email input and submit button right
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/src/components/animation";

export interface NewsletterSignupCTAProps {
  /** heading */
  heading?: string;
  /** subtext */
  subtext?: string;
  /** email-input */
  emailInput?: string;
  /** submit-button */
  submitButton?: Array<{ label?: string; href?: string }>;
}

export function NewsletterSignupCTA(props: NewsletterSignupCTAProps) {
  return (
    <section className="w-full bg-brand-primary py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left: Heading and Subtext */}
          <RevealOnScroll variant="fade-up">
            <div className="md:max-w-md lg:max-w-lg">
              <h2 className="text-on-brand-primary text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-3">
                {props.heading ?? "Stay in the loop. Subscribe to our newsletter."}
              </h2>
              <p className="text-on-brand-primary text-base md:text-lg opacity-80">
                {props.subtext ??
                  "Get the latest news, updates, and insights delivered straight to your inbox. No spam, ever."}
              </p>
            </div>
          </RevealOnScroll>

          {/* Right: Email Input and Submit Button */}
          <RevealOnScroll variant="fade-up">
            <div className="w-full md:w-auto">
              <form
                className="flex flex-col sm:flex-row gap-3 w-full"
                onSubmit={(e) => e.preventDefault()}
                aria-label="Newsletter signup form"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  required
                  placeholder={props.emailInput ?? "Enter your email address"}
                  className="
                      w-full sm:w-72 lg:w-80
                      px-4 py-3
                      rounded-md
                      bg-surface-background
                      text-surface-foreground
                      border border-surface-muted
                      placeholder:text-surface-muted-foreground
                      focus:outline-none focus:ring-2 focus:ring-brand-accent
                      text-sm md:text-base
                    "
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="
                      px-6 py-3
                      bg-brand-accent
                      text-on-brand-secondary
                      font-semibold
                      rounded-md
                      text-sm md:text-base
                      whitespace-nowrap
                      hover:opacity-90
                      focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2
                      transition-opacity duration-200
                    "
                >
                  {props.submitButton ?? "Subscribe Now"}
                </button>
              </form>
              <p className="mt-3 text-on-brand-primary text-xs opacity-60">
                By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
