"use client";

/**
 * OrderErrorCard
 *
 * Displays an error message indicating no purchase was made, with a link back home
 * Layout: Centered white card on dark purple background with heading, body text, and text link
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface OrderErrorCardProps {
  /** error-heading */
  errorHeading?: string;
  /** error-message */
  errorMessage?: string;
  /** back-home-link */
  backHomeLink?: Array<{ label?: string; href?: string }>;
}

export function OrderErrorCard(props: OrderErrorCardProps) {
  return (
      <div className="min-h-screen bg-surface-inverse flex items-center justify-center px-4 py-16">
        <RevealOnScroll variant="fade-up">
          <div className="bg-surface-background rounded-2xl shadow-lg max-w-md w-full mx-auto px-8 py-12 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-muted mb-4">
                <svg
                  className="w-8 h-8 text-brand-accent"
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
              </div>
  
              <h1 className="text-2xl md:text-3xl font-bold text-surface-foreground mb-3">
                {props['error-heading'] ?? 'No Purchase Was Made'}
              </h1>
  
              <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                {props['error-message'] ??
                  'Unfortunately, your order could not be completed. No payment has been taken from your account. Please try again or contact support if the issue persists.'}
              </p>
            </div>
  
            <div className="mt-8 border-t border-surface-muted pt-6">
              <a
                href={props['back-home-link'] ?? '/'}
                className="text-brand-primary font-medium text-base hover:text-brand-secondary underline underline-offset-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded"
              >
                &larr; Return to Home
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    );
}
