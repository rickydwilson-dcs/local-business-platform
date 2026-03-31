"use client";

/**
 * RegistrationErrorState
 *
 * Displays an error or empty state message with a link back to home
 * Layout: Centered card on dark background with heading, body text, and text link
 * Category: Custom
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface RegistrationErrorStateProps {
  /** error-heading */
  errorHeading?: string;
  /** error-body-text */
  errorBodyText?: string;
  /** back-home-link */
  backHomeLink?: Array<{ label?: string; href?: string }>;
}

export function RegistrationErrorState(props: RegistrationErrorStateProps) {
  return (
      <div className="min-h-screen bg-surface-background flex items-center justify-center px-4 py-16">
        <div className="bg-surface-foreground rounded-2xl shadow-lg max-w-md w-full px-8 py-12 text-center">
          <RevealOnScroll variant="fade-up">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-muted mb-6">
                <svg
                  className="w-8 h-8 text-surface-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
              </div>
  
              <h1 className="text-2xl md:text-3xl font-bold text-surface-secondary-foreground mb-4 leading-tight">
                {props.errorHeading ?? "Something went wrong"}
              </h1>
  
              <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                {props.errorBodyText ??
                  "We were unable to complete your registration. Please try again or return to the home page for assistance."}
              </p>
  
              <a
                href={props.backHomeLink ?? "/"}
                className="inline-block text-brand-secondary font-semibold text-base underline underline-offset-4 hover:text-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded"
              >
                ← Back to Home
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    );
}
