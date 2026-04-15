import React from "react";

/**
 * HeroEventBanner
 *
 * Full-width event photo with overlaid event date, time, venue, and CTA button
 * Layout: full-bleed image with dark overlay, text and button overlaid bottom-left
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
            src={props.backgroundImage?.src}
            alt={props.backgroundImage?.alt ?? "Event background"}
            className="w-full h-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-brand-primary opacity-80 mix-blend-multiply" />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col justify-end min-h-[480px] md:min-h-[600px] lg:min-h-[700px] px-8 md:px-16 lg:px-24 pb-12 md:pb-16 lg:pb-20 pt-12 md:pt-16">
        <div className="flex flex-col items-start gap-4 max-w-2xl">
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

          {/* Event date */}
          {props.eventDate && (
            <p className="text-2xl md:text-3xl font-normal tracking-widest uppercase text-on-brand-primary">
              {props.eventDate}
            </p>
          )}

          {/* Event time */}
          {props.eventTime && (
            <p className="text-xl md:text-2xl font-normal tracking-widest uppercase text-on-brand-primary">
              {props.eventTime}
            </p>
          )}

          {/* Event venue */}
          {props.eventVenue && (
            <p className="text-xl md:text-2xl font-normal tracking-widest uppercase text-on-brand-primary">
              {props.eventVenue}
            </p>
          )}

          {/* CTA Button */}
          {props.ctaButton && (
            <div className="mt-4">
              <a
                href={props.ctaButton?.href ?? "#"}
                className="inline-flex items-center px-8 py-3 rounded-none rounded-r-full bg-brand-secondary text-on-brand-primary text-base font-semibold tracking-wide uppercase transition-opacity hover:opacity-90"
              >
                {props.ctaButton?.label ?? "Learn More"}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
