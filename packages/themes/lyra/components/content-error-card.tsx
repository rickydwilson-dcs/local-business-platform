"use client";

/**
 * ErrorMessageCard
 *
 * Displays an error/whoops message indicating no purchase was made, with a link back home
 * Layout: Centered white card on dark background with heading, body text, and inline link
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ErrorMessageCardProps {
  /** error-heading */
  errorHeading?: string;
  /** error-body */
  errorBody?: string;
  /** back-home-link */
  backHomeLink?: Array<{ label?: string; href?: string }>;
}

export function ErrorMessageCard(props: ErrorMessageCardProps) {
  return (
      <div className="min-h-screen bg-surface-inverse flex items-center justify-center px-4 py-16">
        <RevealOnScroll variant="fade-up">
          <div className="bg-surface-background rounded-2xl shadow-lg max-w-lg w-full mx-auto px-8 py-12 text-center">
            <div className="mb-6">
              <span className="text-5xl" role="img" aria-label="Whoops">
                😬
              </span>
            </div>
  
            <h1 className="text-2xl md:text-3xl font-bold text-surface-foreground mb-4">
              {props['error-heading'] ?? 'Whoops! No purchase was made.'}
            </h1>
  
            <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              {props['error-body'] ??
                'It looks like something went wrong and your purchase could not be completed. Please try again or return to the homepage.'}
            </p>
  
            <p className="text-surface-foreground text-sm md:text-base">
              Don&apos;t worry,{' '}
              <a
                href={props['back-home-link'] ?? '/'}
                className="text-brand-secondary underline underline-offset-2 hover:text-brand-primary transition-colors duration-200 font-medium"
              >
                go back home
              </a>{' '}
              and try again whenever you&apos;re ready.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    );
}
