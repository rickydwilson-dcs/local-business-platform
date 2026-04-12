"use client";

/**
 * EventPhotoGallery
 *
 * Visual gallery of past event photos to build credibility and excitement
 * Layout: Full-width horizontal strip of multiple event photos side by side
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
    <section className="w-full bg-brand-primary py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-on-brand-primary mb-3">
              Moments From Our Events
            </h2>
            <p className="text-on-brand-primary opacity-80 text-base md:text-lg max-w-2xl mx-auto">
              A glimpse into the energy, community, and experiences that make our events
              unforgettable.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">
            {props.photo1 && (
              <div className="relative flex-1 min-h-48 md:min-h-64 lg:min-h-80 rounded-xl overflow-hidden group">
                <img
                  src={props.photo1?.src}
                  alt={props.photo1?.alt ?? "Event photo 1"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
            )}

            {props.photo2 && (
              <div className="relative flex-1 min-h-48 md:min-h-64 lg:min-h-80 rounded-xl overflow-hidden group">
                <img
                  src={props.photo2?.src}
                  alt={props.photo2?.alt ?? "Event photo 2"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
            )}

            {props.photo3 && (
              <div className="relative flex-1 min-h-48 md:min-h-64 lg:min-h-80 rounded-xl overflow-hidden group">
                <img
                  src={props.photo3?.src}
                  alt={props.photo3?.alt ?? "Event photo 3"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
            )}

            {props.photo4 && (
              <div className="relative flex-1 min-h-48 md:min-h-64 lg:min-h-80 rounded-xl overflow-hidden group">
                <img
                  src={props.photo4?.src}
                  alt={props.photo4?.alt ?? "Event photo 4"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
            )}

            {props.photo5 && (
              <div className="relative flex-1 min-h-48 md:min-h-64 lg:min-h-80 rounded-xl overflow-hidden group">
                <img
                  src={props.photo5?.src}
                  alt={props.photo5?.alt ?? "Event photo 5"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
            )}

            {!props.photo1 && !props.photo2 && !props.photo3 && !props.photo4 && !props.photo5 && (
              <>
                <div className="relative flex-1 min-h-48 md:min-h-64 lg:min-h-80 rounded-xl overflow-hidden bg-surface-muted flex items-center justify-center">
                  <span className="text-surface-muted-foreground text-sm">Photo 1</span>
                </div>
                <div className="relative flex-1 min-h-48 md:min-h-64 lg:min-h-80 rounded-xl overflow-hidden bg-surface-foreground flex items-center justify-center">
                  <span className="text-surface-muted-foreground text-sm">Photo 2</span>
                </div>
                <div className="relative flex-1 min-h-48 md:min-h-64 lg:min-h-80 rounded-xl overflow-hidden bg-surface-muted flex items-center justify-center">
                  <span className="text-surface-muted-foreground text-sm">Photo 3</span>
                </div>
                <div className="relative flex-1 min-h-48 md:min-h-64 lg:min-h-80 rounded-xl overflow-hidden bg-surface-foreground flex items-center justify-center">
                  <span className="text-surface-muted-foreground text-sm">Photo 4</span>
                </div>
                <div className="relative flex-1 min-h-48 md:min-h-64 lg:min-h-80 rounded-xl overflow-hidden bg-surface-muted flex items-center justify-center">
                  <span className="text-surface-muted-foreground text-sm">Photo 5</span>
                </div>
              </>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
