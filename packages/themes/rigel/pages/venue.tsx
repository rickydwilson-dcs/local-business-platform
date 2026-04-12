/**
 * RigelVenuePage — Venue information template
 *
 * Displays venue address, travel info, facilities, and nearby hotels.
 * All content passed as props — no hardcoded venue details.
 */

import type { RigelVenuePageTemplateProps } from "@platform/core-components";

export interface VenueDetails {
  name: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
  };
  description?: string;
  mapUrl?: string;
  eventDates?: string;
  facilities?: string[];
  travelByTrain?: string;
  travelByCar?: string;
  travelByBus?: string;
  nearbyHotels?: Array<{
    name: string;
    distance: string;
    note: string;
  }>;
}

export interface RigelVenuePageProps extends RigelVenuePageTemplateProps {
  venue?: VenueDetails;
  ticketUrl?: string;
}

export function RigelVenuePage({ siteConfig, venue, ticketUrl }: RigelVenuePageProps) {
  const ctaHref = ticketUrl ?? siteConfig.cta.primary.href;

  const venueName = venue?.name ?? "The Venue";
  const mapUrl =
    venue?.mapUrl ??
    `https://maps.google.com/?q=${encodeURIComponent(venue?.name ?? siteConfig.address.city)}`;

  return (
    <div className="min-h-screen bg-surface-background">
      {/* Header */}
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{venueName}</h1>
          <p className="text-lg text-white opacity-90">
            Our venue for {siteConfig.name}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Address + Map */}
        {venue && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl font-bold text-surface-foreground mb-4">Address</h2>
              <address className="not-italic text-surface-foreground leading-relaxed">
                {venue.name}
                <br />
                {venue.address.street}
                <br />
                {venue.address.city}
                <br />
                {venue.address.region}
                <br />
                {venue.address.postalCode}
              </address>
              {venue.eventDates && (
                <p className="mt-4 text-surface-muted-foreground">{venue.eventDates}</p>
              )}
            </div>

            {/* Map link */}
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-surface-subtle rounded-lg h-64 flex items-center justify-center text-brand-primary font-semibold hover:bg-surface-muted transition-colors border border-surface-muted"
            >
              View on Google Maps
            </a>
          </section>
        )}

        {/* Getting There */}
        {venue && (venue.travelByTrain || venue.travelByCar || venue.travelByBus) && (
          <section>
            <h2 className="text-2xl font-bold text-surface-foreground mb-6">Getting There</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {venue.travelByTrain && (
                <div className="bg-surface-subtle rounded-xl p-6">
                  <h3 className="font-bold text-surface-foreground mb-2">By Train</h3>
                  <p className="text-surface-muted-foreground text-sm leading-relaxed">
                    {venue.travelByTrain}
                  </p>
                </div>
              )}
              {venue.travelByCar && (
                <div className="bg-surface-subtle rounded-xl p-6">
                  <h3 className="font-bold text-surface-foreground mb-2">By Car</h3>
                  <p className="text-surface-muted-foreground text-sm leading-relaxed">
                    {venue.travelByCar}
                  </p>
                </div>
              )}
              {venue.travelByBus && (
                <div className="bg-surface-subtle rounded-xl p-6">
                  <h3 className="font-bold text-surface-foreground mb-2">By Bus</h3>
                  <p className="text-surface-muted-foreground text-sm leading-relaxed">
                    {venue.travelByBus}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Facilities */}
        {venue?.facilities && venue.facilities.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-surface-foreground mb-4">The Venue</h2>
            <div className="bg-surface-subtle rounded-xl p-6">
              <ul className="space-y-3 text-surface-foreground">
                {venue.facilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-brand-primary flex-shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Nearby Hotels */}
        {venue?.nearbyHotels && venue.nearbyHotels.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-surface-foreground mb-2">Nearby Hotels</h2>
            <p className="text-surface-muted-foreground mb-6 text-sm">
              Suggestions only — please book directly with the hotels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {venue.nearbyHotels.map((hotel, i) => (
                <div key={i} className="bg-surface-subtle rounded-xl p-6">
                  <h3 className="font-bold text-surface-foreground mb-1">{hotel.name}</h3>
                  <p className="text-brand-primary text-sm font-semibold mb-2">{hotel.distance}</p>
                  <p className="text-surface-muted-foreground text-sm">{hotel.note}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center pt-4">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
          >
            Get Tickets — Free
          </a>
        </section>
      </div>
    </div>
  );
}
