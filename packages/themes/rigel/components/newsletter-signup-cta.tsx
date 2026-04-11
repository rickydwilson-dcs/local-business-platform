"use client";

/**
 * NewsletterSignupCTA
 *
 * Captures email addresses for newsletter subscription with heading, subtext, email input, and submit button
 * Layout: Full-width dark background horizontal band: left side has heading and subtext, right side has email input and submit button
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface NewsletterSignupCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** subtext */
  subtext?: string;
  /** email-input */
  emailInput?: string;
  /** submit-button */
  submitButton?: Array<{ label?: string; href?: string }>;
}

export function NewsletterSignupCTA(props: NewsletterSignupCTAProps) {
  return (
    <section className="w-full bg-surface-inverse py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left side: heading and subtext */}
        <RevealOnScroll variant="fade-up">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-surface-background mb-4">
              {props.sectionHeading ?? "Stay in the Loop"}
            </h2>
            <p className="text-surface-muted-foreground text-base md:text-lg max-w-md">
              {props.subtext ??
                "Get the latest news, updates, and insights delivered straight to your inbox. No spam, ever."}
            </p>
          </div>
        </RevealOnScroll>

        {/* Right side: email input and submit button */}
        <RevealOnScroll variant="fade-up">
          <div className="flex-1 w-full max-w-lg">
            <form
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter signup form"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                {props.emailInput ?? "Email address"}
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder={props.emailInput ?? "Enter your email address"}
                className="flex-1 rounded-lg px-4 py-3 text-surface-foreground bg-surface-background border border-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-surface-muted-foreground text-sm md:text-base"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="bg-brand-accent text-on-brand-secondary font-semibold rounded-lg px-6 py-3 text-sm md:text-base hover:opacity-90 transition-opacity duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
              >
                {props.submitButton?.[0]?.label ?? "Subscribe Now"}
              </button>
            </form>
            <p className="mt-3 text-xs text-surface-muted-foreground text-center sm:text-left">
              By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
