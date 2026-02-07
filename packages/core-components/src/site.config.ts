/**
 * Site Config - Stub for core-components type-checking
 *
 * At runtime, shared components resolve "@/site.config" to the consuming site's
 * own site.config.ts via the site's tsconfig path aliases.
 *
 * This stub only exists so core-components can type-check standalone.
 */

export interface SiteConfig {
  name: string;
  tagline: string;
  url: string;
  business: {
    name: string;
    legalName: string;
    type: string;
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      region: string;
      postalCode: string;
      country: string;
    };
    hours: Record<string, string>;
    socialMedia: Record<string, string | undefined>;
    geo?: { latitude: number; longitude: number };
  };
  navigation: {
    main: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  };
  cta: {
    primary: { label: string; href: string };
    phone: { show: boolean; label?: string };
  };
  footer: {
    showServices: boolean;
    showLocations: boolean;
    maxServices: number;
    maxLocations: number;
    copyright: string;
    builtBy?: { name: string; url: string };
  };
  credentials: {
    yearEstablished: string;
    stats: Array<{ value: string; label: string; description?: string }>;
    certifications: Array<{ name: string; description: string; icon?: string }>;
    insurance?: { amount: string; type: string };
  };
  serviceAreas: string[];
  serviceAreaRegions?: Array<{
    name: string;
    slug: string;
    towns: Array<{ name: string; slug: string }>;
  }>;
  services: Array<{ title: string; slug: string; description: string }>;
  features: {
    analytics: boolean;
    consentBanner: boolean;
    contactForm: boolean;
    rateLimit: boolean;
    testimonials: boolean;
    blog: boolean;
  };
}

export const siteConfig: SiteConfig = {
  name: "",
  tagline: "",
  url: "",
  business: {
    name: "",
    legalName: "",
    type: "LocalBusiness",
    phone: "",
    email: "",
    address: { street: "", city: "", region: "", postalCode: "", country: "" },
    hours: {},
    socialMedia: {},
  },
  navigation: { main: [] },
  cta: { primary: { label: "", href: "" }, phone: { show: false } },
  footer: {
    showServices: false,
    showLocations: false,
    maxServices: 0,
    maxLocations: 0,
    copyright: "",
  },
  credentials: {
    yearEstablished: "",
    stats: [],
    certifications: [],
  },
  serviceAreas: [],
  services: [],
  features: {
    analytics: false,
    consentBanner: false,
    contactForm: false,
    rateLimit: false,
    testimonials: false,
    blog: false,
  },
};
