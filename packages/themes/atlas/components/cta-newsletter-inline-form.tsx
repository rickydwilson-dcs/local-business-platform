"use client";

/**
 * NewsletterSubscribeCTA
 *
 * Encourages visitors to subscribe to the newsletter with an inline email form
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
                {props.sectionHeading ?? "Stay in the loop"}
              </h2>
              <p className="text-on-brand-primary opacity-80 text-base md:text-lg">
                {props.sectionSubtext ?? "Get the latest news, articles, and resources delivered straight to your inbox."}
              </p>
            </div>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:max-w-lg">
              <label htmlFor="newsletter-email" className="sr-only">
                {props.emailInput ?? "Email address"}
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder={props.emailInput ?? "Enter your email address"}
                className="flex-1 rounded-lg px-4 py-3 text-surface-foreground bg-surface-background border border-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-accent text-base"
                aria-label={props.emailInput ?? "Email address"}
              />
              <button
                type="submit"
                className="bg-brand-accent text-on-brand-secondary font-semibold rounded-lg px-6 py-3 text-base hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 whitespace-nowrap"
              >
                {props.submitButton ?? "Subscribe"}
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
