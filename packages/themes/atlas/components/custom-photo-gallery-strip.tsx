/**
 * PhotoGalleryStrip
 *
 * Visual photo strip showcasing past event atmosphere and attendees
 * Layout: Full-width horizontal row of equal-height photos
 * Category: Custom
 */

export interface PhotoGalleryStripProps {
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

export function PhotoGalleryStrip(props: PhotoGalleryStripProps) {
  return (
      <section className="w-full bg-surface-background overflow-hidden">
        <div className="flex flex-row h-48 md:h-64 lg:h-80">
          {props.photo1 && (
            <div className="flex-1 relative overflow-hidden group">
              <img
                src={props.photo1}
                alt="Event atmosphere photo 1"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-surface-inverse opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
          )}
          {props.photo2 && (
            <div className="flex-1 relative overflow-hidden group">
              <img
                src={props.photo2}
                alt="Event atmosphere photo 2"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-surface-inverse opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
          )}
          {props.photo3 && (
            <div className="flex-1 relative overflow-hidden group">
              <img
                src={props.photo3}
                alt="Event atmosphere photo 3"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-surface-inverse opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
          )}
          {props.photo4 && (
            <div className="hidden md:flex flex-1 relative overflow-hidden group">
              <img
                src={props.photo4}
                alt="Event atmosphere photo 4"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-surface-inverse opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
          )}
          {props.photo5 && (
            <div className="hidden lg:flex flex-1 relative overflow-hidden group">
              <img
                src={props.photo5}
                alt="Event atmosphere photo 5"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-surface-inverse opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
          )}
          {!props.photo1 && !props.photo2 && !props.photo3 && !props.photo4 && !props.photo5 && (
            <>
              <div className="flex-1 bg-surface-muted" aria-hidden="true" />
              <div className="flex-1 bg-surface-foreground opacity-80" aria-hidden="true" />
              <div className="flex-1 bg-surface-muted" aria-hidden="true" />
              <div className="hidden md:flex flex-1 bg-surface-foreground opacity-60" aria-hidden="true" />
              <div className="hidden lg:flex flex-1 bg-surface-muted" aria-hidden="true" />
            </>
          )}
        </div>
      </section>
    );
}
