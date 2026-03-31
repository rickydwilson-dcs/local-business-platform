"use client";

/**
 * EventPhotoGallery
 *
 * Visual gallery of past event photos to build credibility and excitement
 * Layout: Full-width horizontal strip of multiple event photos displayed side by side
 * Category: Social Proof
 */

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
  const photos = [props.photo1, props.photo2, props.photo3, props.photo4, props.photo5];
  const hasAnyPhoto = photos.some(Boolean);

  return (
    <section className="w-full bg-surface-inverse py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-surface-background mb-3">
              Moments From Our Events
            </h2>
            <p className="text-surface-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              A glimpse into the energy, community, and unforgettable experiences we create together.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
            {hasAnyPhoto ? (
              photos.map((photo, i) =>
                photo?.src ? (
                  <div
                    key={i}
                    className="flex-1 min-w-0 rounded-xl overflow-hidden aspect-[4/3] sm:aspect-auto sm:h-64 md:h-80 lg:h-96 relative group"
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt ?? `Event photo ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                ) : null
              )
            ) : (
              [1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-1 min-w-0 rounded-xl overflow-hidden h-64 md:h-80 lg:h-96 bg-surface-muted flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-surface-muted-foreground text-sm font-medium">Photo {i}</span>
                </div>
              ))
            )}
          </div>
        </RevealOnScroll>

        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-brand-accent" />
          <span className="inline-block w-2 h-2 rounded-full bg-surface-muted" />
          <span className="inline-block w-2 h-2 rounded-full bg-surface-muted" />
        </div>
      </div>
    </section>
  );
}
