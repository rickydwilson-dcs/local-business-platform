"use client";

/**
 * EventPhotoGallery
 *
 * Visual gallery of past event photos to build credibility and excitement
 * Layout: Full-width horizontal strip of multiple event photos displayed side by side
 * Category: Social Proof
 */

import { useState } from "react";

export interface EventPhotoGalleryProps {
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
}

export function EventPhotoGallery(props: EventPhotoGalleryProps) {
  return (
      <section className="w-full bg-surface-background py-12 md:py-16 overflow-hidden">
        <RevealOnScroll variant="fade-up">
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-surface-foreground text-center">
              Moments From Our Events
            </h2>
            <p className="mt-2 text-center text-surface-muted-foreground text-sm md:text-base max-w-xl mx-auto">
              A glimpse into the energy, community, and experiences that make our events unforgettable.
            </p>
          </div>
        </RevealOnScroll>
  
        <RevealOnScroll variant="fade-up">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {[
                props["photo-1"],
                props["photo-2"],
                props["photo-3"],
                props["photo-4"],
                props["photo-5"],
              ]
                .filter(Boolean)
                .map((photo, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 w-full sm:w-64 md:w-72 lg:w-80 h-52 md:h-64 rounded-2xl overflow-hidden bg-surface-muted group"
                    aria-label={`Event photo ${index + 1}`}
                  >
                    <img
                      src={photo}
                      alt={`Event photo ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-surface-inverse opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
                  </div>
                ))}
  
              {[
                props["photo-1"],
                props["photo-2"],
                props["photo-3"],
                props["photo-4"],
                props["photo-5"],
              ].filter(Boolean).length === 0 && (
                <>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className="flex-shrink-0 w-full sm:w-64 md:w-72 lg:w-80 h-52 md:h-64 rounded-2xl bg-surface-muted flex items-center justify-center"
                      aria-label={`Event photo placeholder ${n}`}
                    >
                      <div className="flex flex-col items-center gap-2 text-surface-muted-foreground">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 h-10 opacity-40"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 7a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                          />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                        <span className="text-xs font-medium opacity-50">Photo {n}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </RevealOnScroll>
  
        <div className="mt-8 flex justify-center gap-2" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span
              key={dot}
              className={`inline-block rounded-full h-2 transition-all duration-300 ${
                dot === 0
                  ? "w-6 bg-brand-primary"
                  : "w-2 bg-surface-muted"
              }`}
            />
          ))}
        </div>
      </section>
    );
}
