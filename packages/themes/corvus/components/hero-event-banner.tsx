import React from "react";

/**
 * HeroEventBanner
 *
 * Full-bleed event photo with overlaid event date, time, venue, and CTA
 * Layout: full-bleed background image with dark overlay, event metadata and CTA button overlaid bottom-left
 * Category: Hero
 */

export interface HeroEventBannerProps {
  /** backgroundImage */
  backgroundImage?: { src?: string; alt?: string };
  /** eventLogo */
  eventLogo?: string;
  /** eventDate */
  eventDate?: string;
  /** eventTime */
  eventTime?: string;
  /** eventVenue */
  eventVenue?: string;
  /** ctaButton */
  ctaButton?: { label?: string; href?: string };
}

export function HeroEventBanner(props: HeroEventBannerProps) {
  return (
    <section className="relative w-full bg-brand-primary overflow-hidden">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        {props.backgroundImage && (
          <img
            src={props.backgroundImage.src}
            alt={props.backgroundImage.alt ?? ""}
            className="w-full h-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-brand-primary opacity-80 mix-blend-multiply" />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col justify-end min-h-[480px] md:min-h-[600px] lg:min-h-[720px] px-8 md:px-16 lg:px-24 py-12 md:py-16">
        <div className="flex flex-col items-start gap-4 max-w-xl">
          {/* Event logo */}
          {props.eventLogo && (
            <div className="mb-2">
              <img
                src={props.eventLogo}
                alt="Event logo"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </div>
          )}

          {/* Event metadata */}
          <div className="flex flex-col gap-2">
            {props.eventDate && (
              <p className="text-on-brand-primary text-xl md:text-2xl font-normal tracking-widest uppercase">
                {props.eventDate}
              </p>
            )}
            {props.eventTime && (
              <p className="text-on-brand-primary text-xl md:text-2xl font-normal tracking-widest uppercase">
                {props.eventTime}
              </p>
            )}
            {props.eventVenue && (
              <p className="text-on-brand-primary text-xl md:text-2xl font-normal tracking-widest uppercase">
                {props.eventVenue}
              </p>
            )}
          </div>

          {/* CTA Button */}
          {props.ctaButton && (
            <div className="mt-4">
              <a
                href={props.ctaButton?.href ?? "#"}
                className="inline-block bg-brand-secondary text-on-brand-primary text-base font-semibold tracking-wide uppercase px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                {props.ctaButton?.label}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
