/**
 * Business configuration for Colossus Scaffolding
 * Used for generating LocalBusiness schema markup
 */

import type { BusinessConfig, LocalBusinessSchemaOptions } from "@platform/core-components";

/**
 * Schema.org business type for this site
 * @see https://schema.org/LocalBusiness for available subtypes
 *
 * Common types:
 * - LocalBusiness: Generic local business
 * - HomeAndConstructionBusiness: Construction, renovation, scaffolding
 * - ProfessionalService: Consulting, legal, accounting
 * - Plumber: Plumbing services
 * - Electrician: Electrical services
 * - RoofingContractor: Roofing services
 */
export const businessType: LocalBusinessSchemaOptions["businessType"] =
  "HomeAndConstructionBusiness";

export const colossusBusinessConfig: BusinessConfig = {
  name: "Colossus Scaffolding",
  legalName: "Colossus Scaffolding Ltd",
  description:
    "Professional scaffolding specialists serving the South East UK with TG20:21 compliant solutions, CISRS qualified teams, and comprehensive insurance coverage.",
  slogan: "Safe, compliant and fully insured scaffolding specialists serving the South East UK",
  foundingDate: "2009",
  numberOfEmployees: "10-50",
  priceRange: "££",
  email: "info@colossusscaffolding.com",
  telephone: "+441424466661",
  address: {
    streetAddress: "Office 7, 15-20 Gresley Road",
    addressLocality: "St Leonards On Sea",
    addressRegion: "East Sussex",
    postalCode: "TN38 9PL",
    addressCountry: "GB",
  },
  geo: {
    latitude: "50.8549",
    longitude: "0.5736",
  },
  openingHours: [
    {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  areaServed: ["East Sussex", "West Sussex", "Kent", "Surrey", "Essex", "London"],
  credentials: [
    {
      name: "CHAS Accreditation",
      description: "Health and safety assessment scheme approved contractor",
      category: "certification",
    },
    {
      name: "CISRS Qualified Teams",
      description: "Construction Industry Scaffolders Record Scheme certified scaffolders",
      category: "certification",
    },
    {
      name: "TG20:21 Compliance",
      description: "Latest technical guidance for scaffold design and installation compliance",
      category: "compliance",
    },
    {
      name: "Construction Line Gold",
      description: "Pre-qualification accreditation for construction contractors",
      category: "certification",
    },
    {
      name: "IASME Cyber Essentials",
      description: "Cyber security certification for business operations",
      category: "certification",
    },
  ],
  socialProfiles: [
    "https://www.facebook.com/colossusscaffolding",
    "https://www.linkedin.com/company/colossus-scaffolding",
  ],
  knowsAbout: [
    "Access Scaffolding",
    "Facade Scaffolding",
    "Industrial Scaffolding",
    "Edge Protection",
    "Scaffold Design",
    "TG20:21 Compliance",
    "Scaffold Inspections",
    "Temporary Roof Systems",
  ],
  offerCatalog: [
    {
      name: "Access Scaffolding",
      description: "Professional access scaffolding for residential and commercial projects",
      url: "/services/access-scaffolding",
    },
    {
      name: "Facade Scaffolding",
      description: "Specialist facade scaffolding for building maintenance and renovation",
      url: "/services/facade-scaffolding",
    },
    {
      name: "Edge Protection",
      description: "HSE compliant edge protection systems for construction sites",
      url: "/services/edge-protection",
    },
    {
      name: "Temporary Roof Systems",
      description: "Weather protection and temporary roofing solutions",
      url: "/services/temporary-roof-systems",
    },
  ],
};
