/**
 * HeroCentered
 *
 * Centered page-header hero introducing a section with an eyebrow label, large heading and subheading
 * Layout: Centered text block with eyebrow label above heading and descriptor subheading below
 * Category: Hero
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface HeroCenteredProps {
  /** eyebrow-label */
  eyebrowLabel?: string;
  /** heading */
  heading?: string;
  /** subheading */
  subheading?: string;
}
export function HeroCentered(props: HeroCenteredProps) {
  return (
    <section className="bg-surface-background py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <RevealOnScroll variant="fade-up">
          {props.eyebrowLabel && (
            <span className="inline-block text-brand-primary text-sm font-semibold uppercase tracking-widest mb-4">
              {props.eyebrowLabel}
            </span>
          )}
          {props.heading && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-surface-foreground leading-tight mb-6">
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
