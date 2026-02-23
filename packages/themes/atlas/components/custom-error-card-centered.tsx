"use client";

/**
 * OrderErrorMessage
 *
 * Displays an error message indicating no purchase was made, with a link back home
 * Layout: Centered card on dark background with heading, body text, and inline link
 * Category: Custom
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface OrderErrorMessageProps {
  /** error-heading */
  errorHeading?: string;
  /** error-body */
  errorBody?: string;
  /** back-home-link */
  backHomeLink?: Array<{ label?: string; href?: string }>;
}

export function OrderErrorMessage(props: OrderErrorMessageProps) {
  return (
      <div className="min-h-screen bg-surface-background flex items-center justify-center px-4 py-16">
        <RevealOnScroll variant="fade-up">
          <div className="bg-surface-foreground rounded-2xl shadow-lg max-w-md w-full mx-auto px-8 py-12 text-center border border-surface-muted">
            <div className="mb-6 flex justify-center">
              <div className="bg-surface-muted rounded-full p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-brand-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
              </div>
            </div>
  
            <h1 className="text-2xl md:text-3xl font-bold text-surface-foreground mb-4">
              {props['error-heading'] ?? 'No Purchase Was Made'}
            </h1>
  
            <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              {props['error-body'] ??
                'Unfortunately, your order could not be completed. No payment has been taken from your account. Please try again or contact support if the issue persists.'}
            </p>
  
            <p className="text-surface-muted-foreground text-sm">
              Return to{' '}
              <a
                href={props['back-home-link'] ?? '/'}
                className="text-brand-secondary font-semibold underline underline-offset-2 hover:text-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded"
              >
                the homepage
              </a>{' '}
              and try again.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    );
}
