import React from "react";

/**
 * GalleryPhotoStrip
 *
 * Horizontal strip of event photos showcasing atmosphere and attendees
 * Layout: full-bleed horizontal strip with equal-width photo tiles side by side
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
      <div className="flex flex-col items-start text-left w-full mx-auto px-[10px] pt-[10px] pb-0">
        {props.photos && props.photos.length > 0 ? (
          <div className="flex flex-row w-full overflow-x-auto">
            {props.photos.map((photo, index) => (
              <div key={index} className="flex-1 min-w-0">
                <img
                  src={photo.image}
                  alt={photo.title ?? ""}
                  loading="lazy"
                  className="w-full h-full object-cover block"
                />
              </div>
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
