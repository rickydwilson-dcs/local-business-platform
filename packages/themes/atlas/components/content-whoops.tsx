"use client";

/**
 * ContentWhoops
 *
 * Content section: Whoops!
 * Layout: contained
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ContentWhoopsProps {
  /** heading */
  heading?: string;
  /** body */
  body?: string;
}

export function ContentWhoops(props: ContentWhoopsProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <RevealOnScroll variant="fade-up">
            <div className="mb-6">
              <span className="text-6xl" role="img" aria-label="Oops face">
                😬
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-surface-foreground mb-4">
              {props.heading ?? 'Whoops!'}
            </h1>
            <p className="text-lg md:text-xl text-surface-muted-foreground leading-relaxed">
              {props.body ??
                "Something went wrong on our end. We're sorry about that. Please try again or head back to the homepage."}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="inline-block bg-brand-primary text-on-brand-primary font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Go to Homepage
              </a>
              <button
                onClick={() => window.history.back()}
                className="inline-block border border-surface-muted text-surface-foreground font-semibold px-6 py-3 rounded-lg hover:bg-surface-muted transition-colors"
              >
                Go Back
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
