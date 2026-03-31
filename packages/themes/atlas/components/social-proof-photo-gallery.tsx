"use client";

/**
 * EventPhotoGallery
 *
 * Visual gallery of past event photos to build credibility and excitement
 * Layout: Full-width horizontal strip of multiple event photos in a mosaic/grid layout
 * Category: Social Proof
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

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
      <section className="w-full bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-on-brand-primary mb-3">
                Moments From Our Events
              </h2>
              <p className="text-on-brand-primary opacity-80 text-lg max-w-2xl mx-auto">
                A glimpse into the energy, community, and experiences that make our events unforgettable.
              </p>
            </div>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {props['photo-1'] && (
                <div className="col-span-2 md:col-span-2 lg:col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-lg aspect-square md:aspect-auto">
                  <img
                    src={props['photo-1']}
                    alt="Event highlight 1"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
  
              {props['photo-2'] && (
                <div className="col-span-1 overflow-hidden rounded-2xl shadow-lg aspect-square">
                  <img
                    src={props['photo-2']}
                    alt="Event highlight 2"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
  
              {props['photo-3'] && (
                <div className="col-span-1 overflow-hidden rounded-2xl shadow-lg aspect-square">
                  <img
                    src={props['photo-3']}
                    alt="Event highlight 3"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
  
              {props['photo-4'] && (
                <div className="col-span-1 overflow-hidden rounded-2xl shadow-lg aspect-square">
                  <img
                    src={props['photo-4']}
                    alt="Event highlight 4"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
  
              {props['photo-5'] && (
                <div className="col-span-1 overflow-hidden rounded-2xl shadow-lg aspect-square">
                  <img
                    src={props['photo-5']}
                    alt="Event highlight 5"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
  
              {!props['photo-1'] && !props['photo-2'] && !props['photo-3'] && !props['photo-4'] && !props['photo-5'] && (
                <>
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className={`overflow-hidden rounded-2xl shadow-lg aspect-square bg-surface-muted flex items-center justify-center ${
                        index === 1 ? 'col-span-2 md:col-span-2 lg:col-span-2' : 'col-span-1'
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        className="w-10 h-10 text-surface-muted-foreground opacity-40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  ))}
                </>
              )}
            </div>
          </RevealOnScroll>
  
          <div className="mt-10 text-center">
            <p className="text-on-brand-primary opacity-70 text-sm tracking-wide uppercase font-medium">
              Join thousands of attendees who've experienced the difference
            </p>
          </div>
        </div>
      </section>
    );
}
