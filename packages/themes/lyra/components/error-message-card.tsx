"use client";

/**
 * ErrorMessageCard
 *
 * Displays an error or empty state message indicating no purchase was made, with a link back to home
 * Layout: Centered white card on dark background with heading, body text, and inline back-home link
 * Category: Custom
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ErrorMessageCardProps {
  /** error-heading */
  errorHeading?: string;
  /** error-body-text */
  errorBodyText?: string;
  /** back-home-link */
  backHomeLink?: Array<{ label?: string; href?: string }>;
}

export function ErrorMessageCard(props: ErrorMessageCardProps) {
  return (
      <div className="min-h-screen bg-surface-inverse flex items-center justify-center px-4 py-16">
        <RevealOnScroll variant="fade-up">
          <div className="bg-surface-background rounded-2xl shadow-lg max-w-md w-full mx-auto px-8 py-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center">
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
              </div>
            </div>
  
            <h1 className="text-2xl md:text-3xl font-bold text-surface-foreground mb-4">
              {props['error-heading'] ?? 'No Purchase Found'}
            </h1>
  
            <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              {props['error-body-text'] ??
                'It looks like no purchase was made or your session has expired. Please try again or return to the home page.'}
            </p>
  
            <a
              href={props['back-home-link'] ?? '/'}
              className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded transition-colors"
              aria-label="Go back to the home page"
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              Back to Home
            </a>
          </div>
        </RevealOnScroll>
      </div>
    );
}
