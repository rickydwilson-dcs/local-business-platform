/**
 * Venue Page
 * ==========
 *
 * Venue information for Digital Marketing Weekend 2026.
 */

import type { Metadata } from "next";

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

export default function VenuePage() {
  return (
    <div className="min-h-screen bg-surface-background">
      {/* Header */}
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Winter Garden, Eastbourne
          </h1>
          <p className="text-lg text-white opacity-90">
            Our venue for Digital Marketing Weekend 2026
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Address + Map */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-bold text-surface-foreground mb-4">Address</h2>
            <address className="not-italic text-surface-foreground leading-relaxed">
              Winter Garden
              <br />
              Compton Street
              <br />
              Eastbourne
              <br />
              East Sussex
              <br />
              BN21 4BP
            </address>
            <p className="mt-4 text-surface-muted-foreground">17–18 October 2026</p>
          </div>

          {/* Map placeholder */}
          <a
            href="https://maps.google.com/?q=Winter+Garden+Compton+Street+Eastbourne"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-surface-subtle rounded-lg h-64 flex items-center justify-center text-brand-primary font-semibold hover:bg-surface-muted transition-colors border border-surface-muted"
          >
            View on Google Maps
          </a>
        </section>

        {/* Getting There */}
        <section>
          <h2 className="text-2xl font-bold text-surface-foreground mb-6">Getting There</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-subtle rounded-xl p-6">
              <h3 className="font-bold text-surface-foreground mb-2">By Train</h3>
              <p className="text-surface-muted-foreground text-sm leading-relaxed">
                Eastbourne station is a 10-minute walk along the seafront. The Winter Garden is
                clearly signposted from the station.
              </p>
            </div>
            <div className="bg-surface-subtle rounded-xl p-6">
              <h3 className="font-bold text-surface-foreground mb-2">By Car</h3>
              <p className="text-surface-muted-foreground text-sm leading-relaxed">
                Seafront car parks within 5 minutes — Wish Tower or Central car parks on King
                Edward&apos;s Parade are closest.
              </p>
            </div>
            <div className="bg-surface-subtle rounded-xl p-6">
              <h3 className="font-bold text-surface-foreground mb-2">By Bus</h3>
              <p className="text-surface-muted-foreground text-sm leading-relaxed">
                Regular services from Eastbourne town centre, with a stop on Grand Parade — a
                2-minute walk from the venue.
              </p>
            </div>
          </div>
        </section>

        {/* The Venue */}
        <section>
          <h2 className="text-2xl font-bold text-surface-foreground mb-4">The Venue</h2>
          <div className="bg-surface-subtle rounded-xl p-6">
            <ul className="space-y-3 text-surface-foreground">
              {[
                "Accessible entrance on Compton Street with step-free access throughout",
                "On-site café and bar open both days",
                "Terrace with sea views — perfect for networking breaks",
                "Flexible seating across Main Stage and Workshop Room",
                "Capacity 400 — plenty of room to connect with fellow attendees",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-brand-primary flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Nearby Hotels */}
        <section>
          <h2 className="text-2xl font-bold text-surface-foreground mb-2">Nearby Hotels</h2>
          <p className="text-surface-muted-foreground mb-6 text-sm">
            Suggestions only — please book directly with the hotels.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "The Grand Hotel Eastbourne",
                distance: "5 min walk",
                note: "Iconic seafront hotel on King Edward&apos;s Parade.",
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
            ].map((hotel, i) => (
              <div key={i} className="bg-surface-subtle rounded-xl p-6">
                <h3 className="font-bold text-surface-foreground mb-1">{hotel.name}</h3>
                <p className="text-brand-primary text-sm font-semibold mb-2">{hotel.distance}</p>
                <p
                  className="text-surface-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: hotel.note }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-4">
          <a
            href="https://www.eventbrite.co.uk/e/digital-marketing-weekend-2026"
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
