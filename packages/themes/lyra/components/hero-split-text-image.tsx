/**
 * AboutHero
 *
 * Introduces the About Us page with headline, subtext, CTA button and a supporting image of portfolio/books on shelves
 * Layout: Two-column split: text left, image right
 * Category: Hero
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface AboutHeroProps {
  /** eyebrow-label */
  eyebrowLabel?: string;
  /** heading */
  heading?: string;
  /** subheading */
  subheading?: string;
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
  /** hero-image */
  heroImage?: { src?: string; alt?: string };
}
export function AboutHero(props: AboutHeroProps) {
  return (
    <section className="bg-surface-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Column */}
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6">
              {props.eyebrowLabel && (
                <span className="text-brand-accent text-sm font-semibold uppercase tracking-widest">
                  {props.eyebrowLabel}
                </span>
              )}

              {props.heading && (
                <h1 className="text-brand-primary text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {props.heading}
                </h1>
              )}

              {props.subheading && (
                <p className="text-surface-muted-foreground text-lg md:text-xl leading-relaxed max-w-lg">
                  {props.subheading}
                </p>
              )}

              {props.ctaButton && (
                <div className="mt-2">
                  <a
                    href={props.ctaButton?.href}
                    className="inline-block bg-brand-primary text-on-brand-primary font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                  >
                    {props.ctaButton?.label}
                  </a>
                </div>
              )}
            </div>
          </RevealOnScroll>

          {/* Image Column */}
          <RevealOnScroll variant="fade-up">
            <div className="relative w-full h-80 md:h-[480px] lg:h-[560px] rounded-2xl overflow-hidden shadow-xl">
              {props.heroImage?.src ? (
                <img
                  src={props.heroImage?.src}
                  alt={props.heroImage?.alt ?? "Portfolio and books on shelves"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface-muted flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-24 h-24 text-surface-muted-foreground opacity-40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              {/* Decorative accent overlay */}
              <div className="absolute inset-0 bg-brand-primary opacity-5 pointer-events-none rounded-2xl" />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
