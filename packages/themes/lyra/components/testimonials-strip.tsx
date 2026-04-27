"use client";

/**
 * TestimonialsStrip
 *
 * Displays customer testimonials with star ratings and reviewer names in a horizontal grid
 * Layout: Four-column horizontal grid of testimonial cards on a dark background
 * Category: Social Proof
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TestimonialsStripProps {
  /** reviewer-name-1 */
  reviewerName1?: string;
  /** stars-1 */
  stars1?: string;
  /** quote-1 */
  quote1?: string;
  /** reviewer-name-2 */
  reviewerName2?: string;
  /** stars-2 */
  stars2?: string;
  /** quote-2 */
  quote2?: string;
  /** reviewer-name-3 */
  reviewerName3?: string;
  /** stars-3 */
  stars3?: string;
  /** quote-3 */
  quote3?: string;
  /** reviewer-name-4 */
  reviewerName4?: string;
  /** stars-4 */
  stars4?: string;
  /** quote-4 */
  quote4?: string;
}

export function TestimonialsStrip(props: TestimonialsStripProps) {
  return (
    <section className="bg-surface-inverse py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-surface-foreground rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      props.stars1 && i < Number(props.stars1)
                        ? "text-brand-accent"
                        : "text-surface-muted"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-surface-background text-sm leading-relaxed flex-1">
                &ldquo;
                {props.quote1 ??
                  "An outstanding experience from start to finish. Highly recommended!"}
                &rdquo;
              </blockquote>
              <p className="text-surface-muted-foreground text-sm font-semibold">
                — {props.reviewerName1 ?? "Happy Customer"}
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-surface-foreground rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      props.stars2 && i < Number(props.stars2)
                        ? "text-brand-accent"
                        : "text-surface-muted"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-surface-background text-sm leading-relaxed flex-1">
                &ldquo;
                {props.quote2 ?? "Absolutely loved the quality and service. Will be back for sure!"}
                &rdquo;
              </blockquote>
              <p className="text-surface-muted-foreground text-sm font-semibold">
                — {props.reviewerName2 ?? "Satisfied Client"}
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-surface-foreground rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      props.stars3 && i < Number(props.stars3)
                        ? "text-brand-accent"
                        : "text-surface-muted"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-surface-background text-sm leading-relaxed flex-1">
                &ldquo;
                {props.quote3 ??
                  "Exceeded every expectation. The team was professional and attentive."}
                &rdquo;
              </blockquote>
              <p className="text-surface-muted-foreground text-sm font-semibold">
                — {props.reviewerName3 ?? "Loyal Customer"}
              </p>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-surface-foreground rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      props.stars4 && i < Number(props.stars4)
                        ? "text-brand-accent"
                        : "text-surface-muted"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-surface-background text-sm leading-relaxed flex-1">
                &ldquo;
                {props.quote4 ??
                  "Truly a five-star experience. I could not be happier with the results."}
                &rdquo;
              </blockquote>
              <p className="text-surface-muted-foreground text-sm font-semibold">
                — {props.reviewerName4 ?? "Returning Customer"}
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
