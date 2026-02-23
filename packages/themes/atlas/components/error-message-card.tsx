"use client";

/**
 * ErrorMessageCard
 *
 * Displays an error or empty state message indicating no purchase was made, with a link back home
 * Layout: Centered white card on dark background with heading, body text, and text link
 * Category: Custom
 */

import { useState } from "react";

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
      <div className="min-h-screen bg-surface-background flex items-center justify-center px-4 py-16">
        <RevealOnScroll variant="fade-up">
          <div className="bg-surface-foreground rounded-2xl shadow-lg max-w-md w-full mx-auto px-8 py-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-surface-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
            </div>
  
            <h1 className="text-2xl md:text-3xl font-bold text-surface-secondary-foreground mb-4">
              {props["error-heading"] ?? "No Purchase Found"}
            </h1>
  
            <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              {props["error-body-text"] ??
                "We couldn't find a completed purchase associated with your account. Please try again or return to the home page."}
            </p>
  
            <a
              href={props["back-home-link"] ?? "/"}
              className="inline-block text-brand-primary font-semibold underline underline-offset-4 hover:text-brand-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded"
            >
              &larr; Back to Home
            </a>
          </div>
        </RevealOnScroll>
      </div>
    );
}
