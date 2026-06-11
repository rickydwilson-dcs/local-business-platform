/**
 * HeroSplit
 *
 * Primary hero section introducing the page with headline, body text, CTAs and a right-side media element (illustration or image)
 * Layout: Two-column split: left text block with eyebrow label, heading, body and CTA buttons; right decorative illustration or image
 * Category: Hero
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface HeroSplitProps {
  /** eyebrow-label */
  eyebrowLabel?: string;
  /** heading */
  heading?: string;
  /** body-text */
  bodyText?: string;
  /** primary-cta */
  primaryCta?: { label?: string; href?: string };
  /** secondary-cta */
  secondaryCta?: { label?: string; href?: string };
  /** media */
  media?: { src?: string; alt?: string };
}
export function HeroSplit(props: HeroSplitProps) {
  return (
    <section className="bg-surface-background py-16 px-4 md:py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text Block */}
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-6">
            {props.eyebrowLabel && (
              <span className="text-brand-accent text-sm font-semibold uppercase tracking-widest">
                {props.eyebrowLabel}
              </span>
            )}

            {props.heading && (
              <h1 className="text-surface-foreground text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {props.heading}
              </h1>
            )}

            {props.bodyText && (
              <p className="text-surface-muted-foreground text-lg md:text-xl leading-relaxed max-w-lg">
                {props.bodyText}
              </p>
            )}

            {(props.primaryCta || props.secondaryCta) && (
              <div className="flex flex-wrap gap-4 mt-2">
                {props.primaryCta?.href && (
                  <a
                    href={props.primaryCta.href}
                    className="inline-flex items-center justify-center bg-brand-primary text-on-brand-primary font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                  >
                    {props.primaryCta.label}
                  </a>
                )}
                {props.secondaryCta?.href && (
                  <a
                    href={props.secondaryCta.href}
                    className="inline-flex items-center justify-center border border-brand-primary text-brand-primary font-semibold px-6 py-3 rounded-lg hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                  >
                    {props.secondaryCta.label}
                  </a>
                )}
              </div>
            )}
          </div>
        </RevealOnScroll>

        {/* Right: Media Element */}
        <div className="flex items-center justify-center animate-slide-in-right">
          {props.media?.src ? (
            <img
              src={props.media.src}
              alt={props.media.alt ?? "Hero illustration"}
              className="w-full max-w-md lg:max-w-lg object-contain rounded-2xl"
            />
          ) : (
            <div className="w-full max-w-md lg:max-w-lg aspect-square bg-surface-muted rounded-2xl flex items-center justify-center">
              <svg
                className="w-24 h-24 text-surface-muted-foreground opacity-40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
