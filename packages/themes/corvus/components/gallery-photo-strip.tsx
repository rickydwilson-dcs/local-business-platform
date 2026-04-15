import React from "react";

/**
 * GalleryPhotoStrip
 *
 * Horizontal strip of event photos showcasing atmosphere and attendees
 * Layout: full-bleed horizontal scrolling or fixed multi-image strip
 * Category: Custom
 */

export interface GalleryPhotoStripProps {
  /** photos */
  photos?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
}

export function GalleryPhotoStrip(props: GalleryPhotoStripProps) {
  return (
    <section className="relative w-full">
      <div className="flex flex-col items-start w-full px-[10px] pt-[10px] pb-0">
        {props.photos && props.photos.length > 0 ? (
          <div className="flex flex-row overflow-x-auto gap-2 w-full">
            {props.photos.map((photo, index) => (
              <img
                key={index}
                src={photo.image}
                alt={photo.title ?? ""}
                loading="lazy"
                className="max-w-[150px] h-auto object-cover flex-shrink-0"
              />
            ))}
          </div>
        ) : (
          <img
            src="/images/placeholder.svg"
            alt="Gallery"
            loading="lazy"
            className="max-w-[150px] h-auto"
          />
        )}
      </div>
    </section>
  );
}
