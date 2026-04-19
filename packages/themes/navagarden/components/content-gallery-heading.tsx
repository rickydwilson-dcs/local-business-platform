import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface ContentGalleryHeadingProps {
  sectionHeading?: string;
  images?: GalleryImage[];
}

const DEFAULT_IMAGES: GalleryImage[] = [
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    alt: "Vendégház kert",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    alt: "Vendégház nappali",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    alt: "Vendégház terasz",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    alt: "Vendégház hálószoba",
  },
  {
    src: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
    alt: "Vendégház medence",
  },
];

export function ContentGalleryHeading({
  sectionHeading = "Galéria",
  images = DEFAULT_IMAGES,
}: ContentGalleryHeadingProps) {
  return (
    <section className="section bg-surface-muted py-20 lg:py-28 overflow-hidden">
      <div className="container-standard mx-auto px-6 lg:px-12 mb-12">
        <RevealOnScroll>
          <div className="flex items-end justify-between gap-8">
            <h2
              className="text-h2 text-brand-secondary"
              style={{ fontFamily: "Audrey, Georgia, serif", fontWeight: 500 }}
            >
              {sectionHeading}
            </h2>
            <span className="hidden md:block flex-1 h-px bg-brand-primary opacity-30 mb-2" />
            <span
              className="hidden md:block text-small text-surface-muted-foreground mb-1"
              style={{ fontFamily: "Work Sans, system-ui, sans-serif", letterSpacing: "0.1em" }}
            >
              {images.length} kép
            </span>
          </div>
        </RevealOnScroll>
      </div>

      {/* Asymmetric masonry grid — first image spans 2 rows for drama */}
      <div className="container-standard mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 auto-rows-[200px] lg:auto-rows-[260px]">
          {images.map((image, index) => {
            let spanClass = "";
            if (index === 0) spanClass = "row-span-2";
            if (index === 2) spanClass = "md:col-span-2";

            return (
              <div
                key={index}
                className={`${spanClass} aspect-auto bg-surface-muted overflow-hidden group relative min-w-0`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Gold line accent on hover */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
