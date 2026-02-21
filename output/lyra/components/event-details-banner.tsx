/**
 * EventDetailsBanner
 *
 * Displays key event logistics — date, time, venue — alongside a speaker photo with a CTA button
 * Layout: Full-width image background with overlay text block on right side showing event metadata and CTA button
 * Category: Hero
 */

export interface EventDetailsBannerProps {
  /** event-logo */
  eventLogo?: string;
  /** event-date */
  eventDate?: string;
  /** event-time */
  eventTime?: string;
  /** event-venue */
  eventVenue?: string;
  /** event-info-cta */
  eventInfoCta?: Array<{ label?: string; href?: string }>;
  /** background-image */
  backgroundImage?: { src?: string; alt?: string };
}

export function EventDetailsBanner(props: EventDetailsBannerProps) {
  return (
    <section className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {props["background-image"] ? (
          <img
            src={props["background-image"]}
            alt="Event background"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-surface-inverse" />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center md:items-stretch justify-end min-h-[500px] md:min-h-[600px]">
        {/* Right-side metadata block */}
        <div className="w-full md:w-auto md:max-w-md bg-surface-foreground/90 backdrop-blur-sm rounded-2xl p-8 flex flex-col gap-6 shadow-xl">
          {/* Event Logo */}
          {props["event-logo"] && (
            <div className="flex justify-center md:justify-start">
              <img
                src={props["event-logo"]}
                alt="Event logo"
                className="h-16 w-auto object-contain"
              />
            </div>
          )}

          {/* Event Metadata */}
          <div className="flex flex-col gap-4">
            {props["event-date"] && (
              <div className="flex items-center gap-3">
                <span className="text-brand-accent" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <span className="text-surface-background text-base font-medium">
                  {props["event-date"]}
                </span>
              </div>
            )}

            {props["event-time"] && (
              <div className="flex items-center gap-3">
                <span className="text-brand-accent" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                <span className="text-surface-background text-base font-medium">
                  {props["event-time"]}
                </span>
              </div>
            )}

            {props["event-venue"] && (
              <div className="flex items-start gap-3">
                <span className="text-brand-accent mt-0.5" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                <span className="text-surface-background text-base font-medium leading-snug">
                  {props["event-venue"]}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <hr className="border-surface-muted" />

          {/* CTA Button */}
          {props["event-info-cta"] && (
            <a
              href={props["event-info-cta"]}
              className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-on-brand-primary font-semibold text-base px-6 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
              aria-label="Register for this event"
            >
              Register Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
