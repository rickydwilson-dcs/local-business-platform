"use client";

/**
 * NewsletterSignup
 *
 * Email newsletter subscription form with heading, description, email input, and submit button
 * Layout: Two-column layout: left side has heading and description text, right side has email input field and submit button
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface NewsletterSignupProps {
  /** section-heading */
  sectionHeading?: string;
  /** section-description */
  sectionDescription?: string;
  /** email-input */
  emailInput?: string;
  /** submit-button */
  submitButton?: Array<{ label?: string; href?: string }>;
}

export function NewsletterSignup(props: NewsletterSignupProps) {
  return (
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left Column: Heading and Description */}
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col gap-4">
                <h2 className="text-on-brand-primary text-3xl md:text-4xl font-bold leading-tight">
                  {props.sectionHeading ?? "Stay in the loop"}
                </h2>
                <p className="text-on-brand-primary text-base md:text-lg opacity-90">
                  {props.sectionDescription ??
                    "Subscribe to our newsletter and get the latest news, updates, and exclusive offers delivered straight to your inbox."}
                </p>
              </div>
            </RevealOnScroll>
  
            {/* Right Column: Email Input and Submit Button */}
            <RevealOnScroll variant="fade-up">
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
                  className="flex-1 bg-surface-background text-surface-foreground border border-surface-muted rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-accent placeholder:text-surface-muted-foreground"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="bg-brand-accent text-on-brand-secondary font-semibold rounded-lg px-6 py-3 text-base whitespace-nowrap hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                >
                  {props.submitButton ?? "Subscribe"}
                </button>
              </form>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    );
}
