"use client";

/**
 * NewsletterDarkBand
 *
 * Email newsletter subscription with input and submit button
 * Layout: full-bleed dark band with heading left, email input and submit button right
 * Category: CTA
 */

import React, { useState } from "react";

export interface NewsletterDarkBandProps {
  /** heading */
  heading?: string;
  /** subheading */
  subheading?: string;
  /** emailInput */
  emailInput?: string;
  /** submitButton */
  submitButton?: { label?: string; href?: string };
}

export function NewsletterDarkBand(props: NewsletterDarkBandProps) {
  return (
    <section className="w-full bg-brand-primary py-10">
      <div className="flex flex-col items-center text-center px-4 w-full">
        <div className="w-full max-w-2xl flex flex-col">
          {/* Left column content */}
          <div className="w-full mb-6">
            <h2 className="text-5xl font-medium tracking-widest text-on-brand-primary mb-4 font-sans">
              {props.heading ?? "Stay in the Loop"}
            </h2>

            {/* Fancy divider */}
            <div className="mt-1 mb-4 w-20 border-t-[6px] border-brand-secondary" />

            {/* Subheading / rich text */}
            <p className="text-sm text-on-brand-primary w-full">
              {props.subheading ?? (
                <>
                  <a
                    href="/privacy-policy/"
                    className="text-brand-secondary no-underline hover:text-on-brand-primary transition-colors"
                  >
                    Privacy
                  </a>
                  {" | "}
                  <a
                    href="/code-of-conduct/"
                    className="text-brand-secondary no-underline hover:text-on-brand-primary transition-colors"
                  >
                    Code of Conduct
                  </a>
                </>
              )}
            </p>
          </div>

          {/* Right column content — email input + submit */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3 mt-2">
            <input
              type="email"
              placeholder={props.emailInput ?? "Enter your email address"}
              className="flex-1 w-full sm:w-auto px-5 py-3 rounded-full bg-white text-brand-primary placeholder-brand-primary/50 text-base font-medium outline-none border-2 border-transparent focus:border-brand-secondary transition-colors"
            />
            <button
              type="submit"
              className="rounded-r-full rounded-l-none px-8 py-3 bg-brand-secondary text-on-brand-primary text-base font-medium tracking-widest uppercase transition-colors hover:bg-brand-primary hover:text-on-brand-primary border-2 border-brand-secondary whitespace-nowrap"
            >
              {props.submitButton?.label ?? "Subscribe"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
