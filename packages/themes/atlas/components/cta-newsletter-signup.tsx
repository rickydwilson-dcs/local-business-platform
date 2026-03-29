"use client";

/**
 * NewsletterSignup
 *
 * Captures email addresses for newsletter subscription, appears site-wide above the footer
 * Layout: Full-width two-column band: heading and description left, email input and submit button right
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface NewsletterSignupProps {
  /** section-heading */
  sectionHeading?: string;
  /** section-subtext */
  sectionSubtext?: string;
  /** email-input */
  emailInput?: string;
  /** submit-button */
  submitButton?: Array<{ label?: string; href?: string }>;
}

export function NewsletterSignup(props: NewsletterSignupProps) {
  return (
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Left column: heading and description */}
              <div className="md:w-1/2 lg:w-5/12">
                <h2 className="text-2xl lg:text-3xl font-bold text-on-brand-primary mb-3">
                  {props.sectionHeading ?? "Stay in the loop"}
                </h2>
                <p className="text-on-brand-primary opacity-80 text-base lg:text-lg leading-relaxed">
                  {props.sectionSubtext ?? "Get the latest news, articles, and resources delivered straight to your inbox."}
                </p>
              </div>
  
              {/* Right column: email input and submit button */}
              <div className="md:w-1/2 lg:w-5/12">
                <form
                  className="flex flex-col sm:flex-row gap-3"
                  onSubmit={(e) => e.preventDefault()}
                  aria-label="Newsletter signup form"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    {props.emailInput ?? "Email address"}
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    required
                    placeholder={props.emailInput ?? "Enter your email address"}
                    className="flex-1 rounded-lg px-4 py-3 text-surface-foreground bg-surface-background border border-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-accent text-base placeholder:text-surface-muted-foreground"
                    aria-required="true"
                  />
                  <button
                    type="submit"
                    className="bg-brand-accent text-on-brand-secondary font-semibold rounded-lg px-6 py-3 text-base whitespace-nowrap hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                  >
                    {props.submitButton ?? "Subscribe"}
                  </button>
                </form>
                <p className="mt-3 text-sm text-on-brand-primary opacity-60">
                  No spam, ever. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
