"use client";

/**
 * RegistrationErrorCard
 *
 * Displays an error or whoops message indicating no purchase was made, with a link back home
 * Layout: Centered white card on dark navy background with heading, body text, and text link
 * Category: Custom
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface RegistrationErrorCardProps {
  /** error-heading */
  errorHeading?: string;
  /** error-body-text */
  errorBodyText?: string;
  /** back-home-link */
  backHomeLink?: Array<{ label?: string; href?: string }>;
}

export function RegistrationErrorCard(props: RegistrationErrorCardProps) {
  return (
    <div className="min-h-screen bg-surface-inverse flex items-center justify-center px-4 py-16">
      <RevealOnScroll variant="fade-up">
        <div className="bg-surface-background rounded-2xl shadow-xl max-w-lg w-full mx-auto px-8 py-12 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-muted mb-4">
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

            <h1 className="text-2xl md:text-3xl font-bold text-surface-foreground mb-4">
              {props.errorHeading ?? "Whoops! Something went wrong."}
            </h1>

            <p className="text-base md:text-lg text-surface-muted-foreground leading-relaxed mb-8">
              {props.errorBodyText ??
                "No purchase was made. Please try again or contact support if the issue persists."}
            </p>
          </div>

          <a
            href={props.backHomeLink?.[0]?.href ?? "/"}
            className="inline-block text-brand-primary underline underline-offset-4 hover:text-brand-secondary font-medium text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded"
          >
            &larr; Back to Home
          </a>
        </div>
      </RevealOnScroll>
    </div>
  );
}
