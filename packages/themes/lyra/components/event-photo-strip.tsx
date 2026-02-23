"use client";

/**
 * EventPhotoStrip
 *
 * Displays a horizontal strip of event photos to build credibility and excitement
 * Layout: Full-width horizontal scrollable image strip with previous and next navigation arrows
 * Category: Social Proof
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface EventPhotoStripProps {
  /** photo-1 */
  photo1?: { src?: string; alt?: string };
  /** photo-2 */
  photo2?: { src?: string; alt?: string };
  /** photo-3 */
  photo3?: { src?: string; alt?: string };
  /** photo-4 */
  photo4?: { src?: string; alt?: string };
  /** photo-5 */
  photo5?: { src?: string; alt?: string };
  /** prev-arrow */
  prevArrow?: string;
  /** next-arrow */
  nextArrow?: string;
}

export function EventPhotoStrip(props: EventPhotoStripProps) {
  return (
      <section className="w-full bg-surface-inverse overflow-hidden py-8">
        <RevealOnScroll variant="fade-up">
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-surface-background text-center tracking-tight">
              Event Highlights
            </h2>
            <p className="text-surface-muted-foreground text-center mt-2 text-sm md:text-base">
              A glimpse into the experience that awaits you
            </p>
          </div>
        </RevealOnScroll>
  
        <div className="relative w-full">
          {/* Previous Arrow */}
          {props['prev-arrow'] && (
            <button
              aria-label="Previous photos"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-brand-primary text-on-brand-primary rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg hover:bg-brand-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              <img
                src={props['prev-arrow']}
                alt="Previous"
                className="w-5 h-5 md:w-6 md:h-6 object-contain"
              />
            </button>
          )}
  
          {!props['prev-arrow'] && (
            <button
              aria-label="Previous photos"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-brand-primary text-on-brand-primary rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg hover:bg-brand-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
  
          {/* Scrollable Photo Strip */}
          <div
            className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-14 md:px-20 pb-4 scrollbar-hide"
            role="list"
            aria-label="Event photos"
          >
            {[
              props['photo-1'],
              props['photo-2'],
              props['photo-3'],
              props['photo-4'],
              props['photo-5'],
            ]
              .filter(Boolean)
              .map((photo, index) => (
                <div
                  key={index}
                  role="listitem"
                  className="flex-none snap-center w-64 h-44 md:w-80 md:h-56 lg:w-96 lg:h-64 rounded-xl overflow-hidden border border-surface-muted shadow-md"
                >
                  <img
                    src={photo}
                    alt={`Event photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
  
            {/* Fallback placeholder photos if none provided */}
            {![
              props['photo-1'],
              props['photo-2'],
              props['photo-3'],
              props['photo-4'],
              props['photo-5'],
            ].some(Boolean) &&
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  role="listitem"
                  className="flex-none snap-center w-64 h-44 md:w-80 md:h-56 lg:w-96 lg:h-64 rounded-xl overflow-hidden bg-surface-muted border border-surface-muted shadow-md flex items-center justify-center"
                >
                  <span className="text-surface-muted-foreground text-sm">Photo {index + 1}</span>
                </div>
              ))}
          </div>
  
          {/* Next Arrow */}
          {props['next-arrow'] && (
            <button
              aria-label="Next photos"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-brand-primary text-on-brand-primary rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg hover:bg-brand-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              <img
                src={props['next-arrow']}
                alt="Next"
                className="w-5 h-5 md:w-6 md:h-6 object-contain"
              />
            </button>
          )}
  
          {!props['next-arrow'] && (
            <button
              aria-label="Next photos"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-brand-primary text-on-brand-primary rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg hover:bg-brand-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
  
        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-5" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span
              key={dot}
              className={`block rounded-full transition-all duration-200 ${
                dot === 0
                  ? 'w-4 h-2 bg-brand-accent'
                  : 'w-2 h-2 bg-surface-muted'
              }`}
            />
          ))}
        </div>
      </section>
    );
}
