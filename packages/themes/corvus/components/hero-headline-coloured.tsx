import React from "react";

/**
 * HeroHeadlineColoured
 *
 * Large typographic hero with inline coloured shape highlights in the heading
 * Layout: full-bleed dark background, oversized multi-line heading with coloured inline SVG/span decorators
 * Category: Hero
 */

export interface HeroHeadlineColouredProps {
  /** headingParts */
  headingParts?: string;
  /** inlineShapeDecorators */
  inlineShapeDecorators?: string;
  /** subheading */
  subheading?: string;
}

export function HeroHeadlineColoured(props: HeroHeadlineColouredProps) {
  return (
    <section className="relative bg-brand-primary bg-cover bg-center bg-no-repeat">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-brand-primary opacity-80 mix-blend-multiply" />

      {/* Section container */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[1200px] mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col w-full md:flex-row md:items-center md:justify-center gap-8 md:gap-16">
          {/* Left column: logo */}
          <div className="flex flex-col items-center md:items-end justify-center w-full md:w-1/2"></div>

          {/* Right column: event details */}
          <div className="flex flex-col items-center md:items-start justify-center w-full md:w-1/2 text-center md:text-left">
            <div className="flex flex-col gap-[10px] w-full">
              {/* Heading lines */}
              {props.headingParts && (
                <h3
                  className="text-brand-secondary font-normal text-2xl md:text-3xl tracking-[2px] uppercase"
                  style={{ fontFamily: "Aeonik, sans-serif" }}
                >
                  {props.headingParts}
                </h3>
              )}

              {/* CTA button row */}
              {props.subheading && (
                <div className="flex flex-row flex-nowrap gap-[15px] mt-2">
                  <span className="inline-flex items-center px-6 py-3 bg-brand-secondary text-on-brand-primary font-semibold text-sm uppercase tracking-wide rounded-tl-none rounded-bl-none rounded-tr-full rounded-br-full overflow-hidden transition-opacity hover:opacity-90">
                    {props.subheading}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
