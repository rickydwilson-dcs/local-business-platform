/**
 * CenteredPageHero
 *
 * Centered page header introducing an interior page with eyebrow label, large heading and subheading
 * Layout: Centered text block with eyebrow label above heading and subtitle below, no media
 * Category: Hero
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface CenteredPageHeroProps {
  /** eyebrow-label */
  eyebrowLabel?: string;
  /** heading */
  heading?: string;
  /** subheading */
  subheading?: string;
}
export function CenteredPageHero(props: CenteredPageHeroProps) {
  return (
    <section className="bg-surface-background py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <RevealOnScroll variant="fade-up">
          {props.eyebrowLabel && (
            <span className="inline-block text-brand-accent text-sm font-semibold uppercase tracking-widest mb-4">
              {props.eyebrowLabel}
            </span>
          )}
          {props.heading && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-surface-foreground leading-tight mb-6">
              {props.heading}
            </h1>
          )}
          {props.subheading && (
            <p className="text-lg md:text-xl text-surface-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {props.subheading}
            </p>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
