/**
 * HeroHeadline
 *
 * Large typographic hero statement introducing the conference brand and value proposition with inline coloured graphic accents
 * Layout: Full-width dark background with oversized multi-line heading containing inline coloured graphic elements
 * Category: Hero
 */

export interface HeroHeadlineProps {
  /** headline-text */
  headlineText?: string;
  /** inline-graphic-accents */
  inlineGraphicAccents?: string;
}

export function HeroHeadline(props: HeroHeadlineProps) {
  return (
    <section className="bg-surface-inverse w-full py-20 md:py-28 lg:py-36 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black leading-none tracking-tight uppercase">
          <span className="block text-surface-background">
            {props["headline-text"]?.line1 ?? "The Future"}
          </span>
          <span className="block flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 md:mt-4">
            <span className="text-surface-background">
              {props["headline-text"]?.line2prefix ?? "Is"}
            </span>
            {props["inline-graphic-accents"]?.showDot !== false && (
              <span
                className="inline-block w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-brand-accent align-middle"
                aria-hidden="true"
              />
            )}
            <span className="text-brand-accent">
              {props["headline-text"]?.line2highlight ?? "Built"}
            </span>
          </span>
          <span className="block flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 md:mt-4">
            <span className="text-surface-background">
              {props["headline-text"]?.line3prefix ?? "Here"}
            </span>
            {props["inline-graphic-accents"]?.showBar !== false && (
              <span
                className="inline-block w-24 md:w-40 lg:w-56 h-3 md:h-4 lg:h-5 bg-brand-secondary rounded-full align-middle"
                aria-hidden="true"
              />
            )}
            <span className="text-brand-secondary">
              {props["headline-text"]?.line3highlight ?? "Together"}
            </span>
          </span>
          <span className="block flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 md:mt-4">
            {props["inline-graphic-accents"]?.showSquare !== false && (
              <span
                className="inline-block w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-brand-primary rounded-md align-middle"
                aria-hidden="true"
              />
            )}
            <span className="text-surface-background">
              {props["headline-text"]?.line4 ?? "At Conference"}
            </span>
            <span className="text-brand-primary">
              {props["headline-text"]?.line4highlight ?? "2025"}
            </span>
          </span>
        </h1>

        <p className="mt-10 md:mt-14 text-surface-muted-foreground text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed">
          {props["headline-text"]?.subtext ??
            "Join thousands of innovators, creators, and leaders shaping what comes next."}
        </p>
      </div>
    </section>
  );
}
