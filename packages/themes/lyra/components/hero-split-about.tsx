/**
 * AboutHero
 *
 * Introduces the About Us page with headline, tagline, CTA button and a bookshelf image
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
    <section className="bg-surface-background py-16 px-4 md:py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
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
                  className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                >
                  {props.ctaButton?.label}
                </a>
              </div>
            )}
          </div>
        </RevealOnScroll>

        {/* Image Column */}
        <div className="flex justify-center md:justify-end animate-slide-in-right">
          {props.heroImage ? (
            <img
              src={props.heroImage?.src}
              alt={props.heroImage?.alt ?? "A curated bookshelf"}
              className="w-full max-w-md lg:max-w-lg rounded-2xl object-cover shadow-lg"
            />
          ) : (
            <div className="w-full max-w-md lg:max-w-lg aspect-[4/3] bg-surface-muted rounded-2xl flex items-center justify-center">
              <span className="text-surface-muted-foreground text-sm">Bookshelf image</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
