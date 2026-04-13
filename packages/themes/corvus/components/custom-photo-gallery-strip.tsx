/**
 * CustomPhotoGalleryStrip
 *
 * Horizontal scrolling or static strip of event photography images
 * Layout: full-bleed horizontal strip with equally-spaced photo tiles
 * Category: Custom
 */

export interface CustomPhotoGalleryStripProps {
  /** photos */
  photos?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
  }>;
}

export function CustomPhotoGalleryStrip(props: CustomPhotoGalleryStripProps) {
  return (
    <section className="relative w-full bg-cover bg-center">
      <div className="flex flex-col items-start text-left w-full mx-auto px-[10px] pt-[10px] pb-0">
        <img
          className="max-w-[150px]"
          src="https://colorcode.events/wp-content/uploads/2024/12/colorcode-events-logo.svg"
          alt="ColorCode Events"
          loading="lazy"
        />
      </div>
    </section>
  );
}
