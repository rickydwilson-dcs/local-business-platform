"use client";

/**
 * OrderErrorMessage
 *
 * Displays an error message indicating no purchase was made, with a link back home
 * Layout: Single centered card with heading, body text, and inline link
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
          <div className="bg-surface-foreground rounded-2xl shadow-md max-w-md w-full mx-auto px-8 py-12 text-center border border-surface-muted">
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-muted">
                <svg
                  className="w-8 h-8 text-surface-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </span>
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
                className="text-brand-primary font-semibold underline underline-offset-2 hover:text-brand-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded"
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
