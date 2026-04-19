"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * PortfolioGallery
 *
 * Displays a grid of portfolio or work images to showcase completed projects
 * Layout: Heading above a masonry-style or fixed grid of photo thumbnails on dark background
 * Category: Custom
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface PortfolioGalleryProps {
  /** section-heading */
  sectionHeading?: string;
  /** gallery-images */
  galleryImages?: { src?: string; alt?: string }[];
}

export function PortfolioGallery(props: PortfolioGalleryProps) {
  return (
    <section className="bg-surface-inverse py-16 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background mb-4">
              {props.sectionHeading ?? "Our Portfolio"}
            </h2>
            <div className="w-16 h-1 bg-brand-accent mx-auto rounded-full" />
          </div>
        </RevealOnScroll>

        {/* Gallery Grid */}
        {props.galleryImages && props.galleryImages.length > 0 ? (
          <RevealOnScroll variant="fade-up">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {props.galleryImages.map((image: { src?: string; alt?: string }, index: number) => (
                <div
                  key={index}
                  className="break-inside-avoid overflow-hidden rounded-lg group relative cursor-pointer"
                >
                  <img
                    src={image?.src}
                    alt={image?.alt ?? `Portfolio project ${index + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-lg" />
                  {image?.alt && (
                    <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-on-brand-primary text-sm font-medium">{image.alt}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </RevealOnScroll>
        ) : (
          /* Fallback placeholder grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-surface-foreground rounded-lg overflow-hidden aspect-square flex items-center justify-center"
              >
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-surface-muted rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-surface-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-surface-muted-foreground text-sm">Project {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
