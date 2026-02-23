"use client";

/**
 * OrderErrorCard
 *
 * Displays an error message indicating no purchase was made, with a link back home
 * Layout: Centered white card on dark background with heading, body text, and text link
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
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-surface-muted-foreground"
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
              {props['error-message'] ??
                'Something went wrong and your order could not be completed. You have not been charged. Please try again or contact support if the issue persists.'}
            </p>
  
            <a
              href={props['back-home-link'] ?? '/'}
              className="inline-block text-brand-primary font-semibold underline underline-offset-4 hover:text-brand-secondary transition-colors duration-200 text-base"
              aria-label="Return to the home page"
            >
              &larr; Back to Home
            </a>
          </div>
        </RevealOnScroll>
      </div>
    );
}
