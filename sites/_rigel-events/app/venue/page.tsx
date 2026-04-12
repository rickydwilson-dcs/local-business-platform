/**
 * Venue Page
 *
 * Static venue data rendered with corvus theme components.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { PageTitleBanner, StatsVenue } from "@platform/themes/corvus/components";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Venue | Digital Marketing Weekend 2026",
  description:
    "The Winter Garden, Eastbourne — venue for Digital Marketing Weekend 2026. Address, travel information, and nearby hotels.",
  openGraph: {
    title: "Venue | Digital Marketing Weekend 2026",
    description: "The Winter Garden, Compton Street, Eastbourne, BN21 4BP.",
    url: "/venue",
    type: "website",
  },
};

const venue = {
  name: "Winter Garden",
  address: "Compton Street, Eastbourne, East Sussex, BN21 4BP",
  eventDates: "17–18 October 2026",
  mapUrl: "https://maps.google.com/?q=Winter+Garden+Compton+Street+Eastbourne",
  travel: {
    train:
      "Eastbourne station is a 10-minute walk along the seafront. The Winter Garden is clearly signposted from the station.",
    car: "Seafront car parks within 5 minutes — Wish Tower or Central car parks on King Edward's Parade are closest.",
    bus: "Regular services from Eastbourne town centre, with a stop on Grand Parade — a 2-minute walk from the venue.",
  },
  facilities: [
    "Accessible entrance on Compton Street with step-free access throughout",
    "On-site cafe and bar open both days",
    "Terrace with sea views — perfect for networking breaks",
    "Flexible seating across Main Stage and Workshop Room",
    "Capacity 400 — plenty of room to connect with fellow attendees",
  ],
  nearbyHotels: [
    {
      name: "The Grand Hotel Eastbourne",
      distance: "5 min walk",
      note: "Iconic seafront hotel on King Edward's Parade.",
    },
    {
      name: "The Best Western Lansdowne",
      distance: "8 min walk",
      note: "Comfortable seafront hotel with easy access to the venue.",
    },
    {
      name: "Hydro Hotel",
      distance: "12 min walk",
      note: "Elegant hotel on the seafront with sea views.",
    },
  ],
};

export default function VenuePage() {
  return (
    <>
      <PageTitleBanner pageTitle="Venue" />

      <StatsVenue
        heading={venue.name}
        statItems={[
          { title: venue.eventDates, description: "Event Dates" },
          { title: "400", description: "Capacity" },
          { title: "2", description: "Stages" },
          { title: "Seafront", description: "Location" },
        ]}
      />

      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Address and map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-surface-foreground mb-4">Location</h2>
              <p className="text-surface-muted-foreground text-lg mb-4">{venue.address}</p>
              <a
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary font-semibold hover:text-brand-primary-hover transition-colors"
              >
                View on Google Maps &rarr;
              </a>
            </div>

            {/* Travel info */}
            <div>
              <h2 className="text-2xl font-bold text-surface-foreground mb-4">Getting There</h2>
              <div className="space-y-4">
                <div className="bg-surface-card border border-surface-border rounded-lg p-4">
                  <h3 className="font-semibold text-surface-foreground mb-1">By Train</h3>
                  <p className="text-surface-muted-foreground text-sm">{venue.travel.train}</p>
                </div>
                <div className="bg-surface-card border border-surface-border rounded-lg p-4">
                  <h3 className="font-semibold text-surface-foreground mb-1">By Car</h3>
                  <p className="text-surface-muted-foreground text-sm">{venue.travel.car}</p>
                </div>
                <div className="bg-surface-card border border-surface-border rounded-lg p-4">
                  <h3 className="font-semibold text-surface-foreground mb-1">By Bus</h3>
                  <p className="text-surface-muted-foreground text-sm">{venue.travel.bus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-surface-foreground mb-6">Facilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {venue.facilities.map((facility) => (
                <div
                  key={facility}
                  className="flex items-start gap-3 bg-surface-card border border-surface-border rounded-lg p-4"
                >
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-surface-background"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-surface-foreground text-sm">{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Hotels */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-surface-foreground mb-6">Nearby Hotels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {venue.nearbyHotels.map((hotel) => (
                <div
                  key={hotel.name}
                  className="bg-surface-card border border-surface-border rounded-xl p-6"
                >
                  <h3 className="font-bold text-surface-foreground mb-1">{hotel.name}</h3>
                  <p className="text-brand-primary text-sm font-semibold mb-2">{hotel.distance}</p>
                  <p className="text-surface-muted-foreground text-sm">{hotel.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href={siteConfig.cta.primary.href}
              className="inline-block bg-brand-primary text-on-brand-primary font-bold px-8 py-3 rounded-lg hover:bg-brand-primary-hover transition-colors"
            >
              Get Your Free Ticket
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
