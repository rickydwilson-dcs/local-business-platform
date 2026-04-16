import React from "react";

/**
 * HeroHeadlineColoured
 *
 * Large typographic hero with inline coloured shape highlights in the heading
 * Layout: full-bleed dark background with oversized multi-line heading and inline SVG/span colour accents
 * Category: Hero
 */

export interface HeroHeadlineColouredProps {
  /** headingParts */
  headingParts?: string;
  /** inlineAccentShapes */
  inlineAccentShapes?: string;
  /** subheading */
  subheading?: string;
}

export function HeroHeadlineColoured(props: HeroHeadlineColouredProps) {
  return (
    <section className="relative bg-brand-primary bg-cover bg-center bg-no-repeat overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-brand-primary opacity-80 mix-blend-multiply" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div className="flex flex-col md:flex-row w-full gap-8">
          {/* Left column: logo */}
          <div className="flex flex-col items-center md:items-end justify-center text-right w-full md:w-1/2"></div>

          {/* Right column: event details */}
          <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left w-full md:w-1/2">
            <div className="flex flex-col gap-[10px] w-full">
              {props.headingParts && (
                <h3
                  className="text-brand-secondary font-normal text-3xl tracking-[2px] uppercase"
                  style={{ fontFamily: "Aeonik, sans-serif" }}
                >
                  {props.headingParts}
                </h3>
              )}

              {props.subheading && <p className="text-brand-secondary">{props.subheading}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
