/**
 * EventPhotoGallery
 *
 * Visual gallery of past event photos to build credibility and excitement
 * Layout: Full-width horizontal strip of multiple event photos in a mosaic/grid layout
 * Category: Social Proof
 */

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
    <section className="w-full py-12 bg-surface-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-surface-foreground mb-2">
            Moments From Our Events
          </h2>
          <p className="text-surface-muted-foreground text-lg">
            A glimpse into the experiences we create together
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
          {/* Photo 1 - Large featured */}
          <div className="col-span-2 row-span-2 md:col-span-2 md:row-span-2 relative overflow-hidden rounded-xl aspect-square md:aspect-auto md:h-72 lg:h-80 group">
            {props["photo-1"] ? (
              <img
                src={props["photo-1"]}
                alt="Event photo 1"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-surface-muted flex items-center justify-center min-h-48">
                <span className="text-surface-muted-foreground text-sm font-medium">
                  Event Photo
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-transparent group-hover:bg-surface-inverse opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
          </div>

          {/* Photo 2 */}
          <div className="col-span-1 relative overflow-hidden rounded-xl aspect-square group">
            {props["photo-2"] ? (
              <img
                src={props["photo-2"]}
                alt="Event photo 2"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-surface-foreground flex items-center justify-center min-h-32">
                <span className="text-surface-background text-sm font-medium">
                  Event Photo
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-transparent group-hover:bg-surface-inverse opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
          </div>

          {/* Photo 3 */}
          <div className="col-span-1 relative overflow-hidden rounded-xl aspect-square group">
            {props["photo-3"] ? (
              <img
                src={props["photo-3"]}
                alt="Event photo 3"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-brand-primary flex items-center justify-center min-h-32">
                <span className="text-on-brand-primary text-sm font-medium">
                  Event Photo
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-transparent group-hover:bg-surface-inverse opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
          </div>

          {/* Photo 4 */}
          <div className="col-span-1 relative overflow-hidden rounded-xl aspect-square group">
            {props["photo-4"] ? (
              <img
                src={props["photo-4"]}
                alt="Event photo 4"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-brand-secondary flex items-center justify-center min-h-32">
                <span className="text-on-brand-secondary text-sm font-medium">
                  Event Photo
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-transparent group-hover:bg-surface-inverse opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
          </div>

          {/* Photo 5 */}
          <div className="col-span-1 relative overflow-hidden rounded-xl aspect-square group">
            {props["photo-5"] ? (
              <img
                src={props["photo-5"]}
                alt="Event photo 5"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-brand-accent flex items-center justify-center min-h-32">
                <span className="text-surface-foreground text-sm font-medium">
                  Event Photo
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-transparent group-hover:bg-surface-inverse opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-surface-muted-foreground text-sm">
            Join us and be part of the next unforgettable experience
          </p>
        </div>
      </div>
    </section>
  );
}
