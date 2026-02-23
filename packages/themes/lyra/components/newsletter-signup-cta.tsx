"use client";

/**
 * NewsletterSignupCTA
 *
 * Captures email addresses for newsletter subscription with inline email form
 * Layout: Full-width dark or purple background band with heading and subtext left, email input and submit button right
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

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
      <section className="w-full bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Heading and Subtext */}
          <RevealOnScroll variant="fade-up">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-on-brand-primary mb-3">
                {props.heading ?? "Stay in the loop"}
              </h2>
              <p className="text-base md:text-lg text-surface-muted-foreground max-w-md">
                {props.subtext ?? "Get the latest news, updates, and insights delivered straight to your inbox. No spam, ever."}
              </p>
            </div>
          </RevealOnScroll>
  
          {/* Right: Email Form */}
          <RevealOnScroll variant="fade-up">
            <div className="flex-1 w-full max-w-lg">
              <form
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full"
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
                  placeholder={props["email-input"] ?? "Enter your email address"}
                  className="flex-1 rounded-lg px-4 py-3 text-surface-foreground bg-surface-background border border-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-accent placeholder:text-surface-muted-foreground text-sm md:text-base"
                  aria-label="Email address"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="bg-brand-accent text-on-brand-secondary font-semibold rounded-lg px-6 py-3 text-sm md:text-base whitespace-nowrap hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                  aria-label="Subscribe to newsletter"
                >
                  {props["submit-button"] ?? "Subscribe"}
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
