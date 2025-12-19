import Link from "next/link";
import { Phone, Mail, MapPin, Shield, Award } from "lucide-react";
import { getContentItems } from "@/lib/content";
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL } from "@/lib/contact-info";
import { getServiceAnchorText, getLocationAnchorText } from "@/lib/anchor-text";

// Priority services to show first (most important for SEO)
const PRIORITY_SERVICES = [
  "residential-scaffolding",
  "commercial-scaffolding",
  "access-scaffolding",
  "facade-scaffolding",
  "industrial-scaffolding",
  "edge-protection",
  "temporary-roof-systems",
  "birdcage-scaffolds",
  "scaffolding-inspections-maintenance",
  "scaffold-towers-mast-systems",
];

// Priority locations (counties first, then major towns)
const PRIORITY_LOCATIONS = [
  "east-sussex",
  "west-sussex",
  "kent",
  "surrey",
  "brighton",
  "hastings",
  "eastbourne",
  "canterbury",
  "maidstone",
  "crawley",
  "guildford",
  "worthing",
];

export async function Footer() {
  // Fetch all services and locations
  const [allServices, allLocations] = await Promise.all([
    getContentItems("services"),
    getContentItems("locations"),
  ]);

  // Sort services by priority, then alphabetically
  const sortedServices = [...allServices].sort((a, b) => {
    const aIndex = PRIORITY_SERVICES.indexOf(a.slug);
    const bIndex = PRIORITY_SERVICES.indexOf(b.slug);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.title.localeCompare(b.title);
  });

  // Sort locations by priority, then alphabetically
  const sortedLocations = [...allLocations].sort((a, b) => {
    const aIndex = PRIORITY_LOCATIONS.indexOf(a.slug);
    const bIndex = PRIORITY_LOCATIONS.indexOf(b.slug);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.title.localeCompare(b.title);
  });

  // Take top items for footer display
  const featuredServices = sortedServices.slice(0, 10);
  const featuredLocations = sortedLocations.slice(0, 12);

  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-16">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Column 1: About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Colossus Scaffolding</h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              Professional scaffolding services across the South East UK. Construction Line Gold
              approved, CHAS accredited, TG20:21 compliant.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
                <span>Construction Line Gold</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                <span>CHAS</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue" />
                <span>TG20:21</span>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              {featuredServices.map((service, index) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-brand-blue transition-colors"
                  >
                    {getServiceAnchorText(
                      service.title,
                      service.slug,
                      index,
                      featuredServices.length
                    )}
                  </Link>
                </li>
              ))}
              {allServices.length > 10 && (
                <li>
                  <Link
                    href="/services"
                    className="hover:text-brand-blue transition-colors font-semibold"
                  >
                    View All Services →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Locations */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Service Areas</h4>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              {featuredLocations.map((location, index) => (
                <li key={location.slug}>
                  <Link
                    href={`/locations/${location.slug}`}
                    className="hover:text-brand-blue transition-colors"
                  >
                    {getLocationAnchorText(
                      location.title,
                      location.slug,
                      index,
                      featuredLocations.length
                    )}
                  </Link>
                </li>
              ))}
              {allLocations.length > 12 && (
                <li>
                  <Link
                    href="/locations"
                    className="hover:text-brand-blue transition-colors font-semibold"
                  >
                    View All Locations →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-300 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue flex-shrink-0" />
                <Link href={`tel:${PHONE_TEL}`} className="hover:text-brand-blue transition-colors">
                  {PHONE_DISPLAY}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue flex-shrink-0" />
                <Link
                  href={`mailto:${BUSINESS_EMAIL}`}
                  className="hover:text-brand-blue transition-colors"
                >
                  {BUSINESS_EMAIL}
                </Link>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue flex-shrink-0 mt-1" />
                <div className="leading-relaxed">
                  <div>South East UK</div>
                  <div>Professional Scaffolding Services</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 text-xs sm:text-sm">
                <Link href="/privacy-policy" className="hover:text-brand-blue transition-colors">
                  Privacy Policy
                </Link>
                <span className="mx-2 text-gray-500">|</span>
                <Link href="/cookie-policy" className="hover:text-brand-blue transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-gray-300 text-xs sm:text-sm">
          <p>
            &copy; 2025 Colossus Scaffolding. All rights reserved. | Built by{" "}
            <a
              href="https://www.digitalconsultingservices.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-brand-blue transition-colors underline"
            >
              Digital Consulting Services
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
