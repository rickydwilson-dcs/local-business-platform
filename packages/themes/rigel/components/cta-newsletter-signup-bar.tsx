"use client";

/**
 * NewsletterSignupBar
 *
 * Email newsletter subscription section with headline, description, email input, and submit button
 * Layout: Full-width horizontal band with text left and email form right
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface NewsletterSignupBarProps {
  /** section-heading */
  sectionHeading?: string;
  /** section-subtext */
  sectionSubtext?: string;
  /** email-input */
  emailInput?: string;
  /** submit-button */
  submitButton?: Array<{ label?: string; href?: string }>;
}

export function NewsletterSignupBar(props: NewsletterSignupBarProps) {
  return (
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <RevealOnScroll variant="fade-up">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-on-brand-primary text-3xl md:text-4xl font-bold mb-4">
                {props.sectionHeading ?? "Stay in the loop"}
              </h2>
              <p className="text-on-brand-primary text-base md:text-lg opacity-90 max-w-md">
                {props.sectionSubtext ?? "Get the latest news, updates, and exclusive offers delivered straight to your inbox."}
              </p>
            </div>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="flex-1 w-full max-w-lg">
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
                  required
                  placeholder={props.emailInput ?? "Enter your email address"}
                  className="flex-1 rounded-lg px-5 py-3 text-surface-foreground bg-surface-background border border-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-accent text-base placeholder:text-surface-muted-foreground"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="bg-brand-accent text-on-brand-secondary font-semibold rounded-lg px-7 py-3 text-base hover:opacity-90 transition-opacity duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  {props.submitButton ?? "Subscribe"}
                </button>
              </form>
              <p className="mt-3 text-on-brand-primary text-sm opacity-75 text-center sm:text-left">
                No spam, ever. Unsubscribe at any time.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
