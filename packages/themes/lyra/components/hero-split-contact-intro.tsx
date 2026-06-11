/**
 * ContactHero
 *
 * Introduces the contact page with a headline and subtext encouraging visitors to get in touch
 * Layout: Left-aligned text block on white background, no image
 * Category: Hero
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface ContactHeroProps {
  /** eyebrow-label */
  eyebrowLabel?: string;
  /** heading */
  heading?: string;
  /** subheading */
  subheading?: string;
}
export function ContactHero(props: ContactHeroProps) {
  return (
    <section className="bg-surface-background py-20 md:py-28 lg:py-36">
      <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-16">
        <RevealOnScroll variant="fade-up">
          {props.eyebrowLabel && (
            <p className="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-4">
              {props.eyebrowLabel}
            </p>
          )}
          <h1 className="text-surface-foreground text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {props.heading ?? "We'd love to hear from you"}
          </h1>
          {props.subheading && (
            <p className="text-surface-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl">
              {props.subheading}
            </p>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
