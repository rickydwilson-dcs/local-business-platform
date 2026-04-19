"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
export function CustomPortfolioGallery({
  heading = "Recent Work",
  images = [
    { src: "/images/portfolio-1.jpg", alt: "Vehicle wrap project" },
    { src: "/images/portfolio-2.jpg", alt: "Illuminated shop sign" },
    { src: "/images/portfolio-3.jpg", alt: "Banner installation" },
    { src: "/images/portfolio-4.jpg", alt: "Window vinyl graphics" },
    { src: "/images/portfolio-5.jpg", alt: "Exhibition stand design" },
    { src: "/images/portfolio-6.jpg", alt: "Fascia signage" },
    { src: "/images/portfolio-7.jpg", alt: "Wall mural" },
    { src: "/images/portfolio-8.jpg", alt: "Wayfinding signage" },
  ],
}) {
  // Define a repeating pattern of aspect ratios for visual variety
  const aspectPatterns = [
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[4/3]",
    "aspect-[3/4]",
    "aspect-[4/3]",
    "aspect-square",
    "aspect-[3/4]",
    "aspect-[4/3]",
  ];

  return (
    <section className="section bg-brand-secondary relative">
      <div className="container-standard mx-auto px-6">
        <RevealOnScroll>
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-h2 font-heading font-bold text-surface-foreground min-w-0">
              {heading}
            </h2>
            <a
              href="/portfolio"
              className="text-small font-sans uppercase tracking-widest text-brand-primary hover:underline hidden sm:block"
            >
              View All →
            </a>
          </div>
        </RevealOnScroll>

        {/* Masonry-esque columns approach */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {images.map((img: { src: string; alt: string }, i: number) => (
            <RevealOnScroll key={i}>
              <div
                className={`${aspectPatterns[i % aspectPatterns.length]} bg-surface-muted overflow-hidden break-inside-avoid group relative`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-surface-background opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-small font-sans text-surface-foreground">{img.alt}</span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
