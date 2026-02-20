interface EventDetailsBandProps {
  /** URL or path to background image */
  backgroundImage: string;
  /** Alt text for background image */
  backgroundImageAlt?: string;
  /** Event name / title */
  eventName: string;
  /** Display date (e.g. "Saturday, July 25, 2026") */
  date: string;
  /** Time range (e.g. "8:00AM - 9:00PM") */
  timeRange: string;
  /** Venue name (e.g. "Seneca One Tower") */
  venue: string;
  /** CTA button text */
  ctaLabel: string;
  /** CTA button link */
  ctaHref: string;
  /** Overlay opacity 0-100, default 60 */
  overlayOpacity?: number;
}

export function EventDetailsBand({
  backgroundImage,
  backgroundImageAlt = "",
  eventName,
  date,
  timeRange,
  venue,
  ctaLabel,
  ctaHref,
  overlayOpacity = 60,
}: EventDetailsBandProps) {
  return (
    <section className="relative w-full overflow-hidden">
      <img
        src={backgroundImage}
        alt={backgroundImageAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 bg-brand-primary"
        style={{ opacity: overlayOpacity / 100 }}
      />
      <div className="relative z-10 container-standard py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">
          {eventName}
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-white/90 text-lg mb-8">
          <span>{date}</span>
          <span className="hidden md:inline" aria-hidden="true">·</span>
          <span>{timeRange}</span>
          <span className="hidden md:inline" aria-hidden="true">·</span>
          <span>{venue}</span>
        </div>
        <a
          href={ctaHref}
          className="inline-flex items-center justify-center px-8 py-4 bg-brand-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity mt-8"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}
