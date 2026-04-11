/**
 * Venue Page — thin wrapper
 *
 * Static venue data lives here. Delegates rendering to RigelVenuePage.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import type { SiteConfigSummary } from "@platform/core-components";
import { RigelVenuePage } from "@platform/themes/rigel/pages";
import type { VenueDetails } from "@platform/themes/rigel/pages";

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

const venue: VenueDetails = {
  name: "Winter Garden",
  address: {
    street: "Compton Street",
    city: "Eastbourne",
    region: "East Sussex",
    postalCode: "BN21 4BP",
  },
  eventDates: "17–18 October 2026",
  mapUrl: "https://maps.google.com/?q=Winter+Garden+Compton+Street+Eastbourne",
  travelByTrain:
    "Eastbourne station is a 10-minute walk along the seafront. The Winter Garden is clearly signposted from the station.",
  travelByCar:
    "Seafront car parks within 5 minutes — Wish Tower or Central car parks on King Edward's Parade are closest.",
  travelByBus:
    "Regular services from Eastbourne town centre, with a stop on Grand Parade — a 2-minute walk from the venue.",
  facilities: [
    "Accessible entrance on Compton Street with step-free access throughout",
    "On-site café and bar open both days",
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
  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone ?? "",
    phoneDisplay: siteConfig.business.phone ?? "",
    address: {
      city: siteConfig.business.address.city,
      county: siteConfig.business.address.region,
    },
    cta: siteConfig.cta,
    stats: siteConfig.credentials.stats,
  };

  return (
    <RigelVenuePage
      siteConfig={siteSummary}
      venue={venue}
      ticketUrl={siteConfig.cta.primary.href}
    />
  );
}
