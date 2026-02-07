/**
 * Footer Component
 *
 * Site-wide footer with dynamic services, locations, and contact info.
 * All content is config-driven from site.config.ts.
 *
 * Uses @/ path aliases that resolve to the consuming site's modules
 * since core-components has no build step.
 */

import Link from "next/link";
import { Phone, Mail, MapPin, Shield, Award } from "lucide-react";
import { getContentItems } from "@/lib/content";
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL, ADDRESS } from "@/lib/contact-info";
import { siteConfig } from "@/site.config";

export async function Footer() {
  // Fetch services and locations from content
  const [allServices, allLocations] = await Promise.all([
    getContentItems("services"),
    getContentItems("locations"),
  ]);

  // Sort alphabetically and limit to configured max
  const sortedServices = [...allServices]
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, siteConfig.footer.maxServices);

  const sortedLocations = [...allLocations]
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, siteConfig.footer.maxLocations);

  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-16">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Column 1: About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">{siteConfig.business.name}</h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">{siteConfig.tagline}</p>
            {siteConfig.credentials.certifications.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {siteConfig.credentials.certifications
                  .slice(0, 3)
                  .map(
                    (cert: { name: string; description: string; icon?: string }, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                        {index === 0 ? (
                          <Award className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
                        ) : (
                          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                        )}
                        <span>{cert.name}</span>
                      </div>
                    )
                  )}
              </div>
            )}
          </div>

          {/* Column 2: Services */}
          {siteConfig.footer.showServices && sortedServices.length > 0 && (
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                {sortedServices.map((service: { slug: string; title: string }) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="hover:text-brand-primary transition-colors"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
                {allServices.length > siteConfig.footer.maxServices && (
                  <li>
                    <Link
                      href="/services"
                      className="hover:text-brand-primary transition-colors font-semibold"
                    >
                      View All Services &rarr;
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Column 3: Locations */}
          {siteConfig.footer.showLocations && sortedLocations.length > 0 && (
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4">Service Areas</h4>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                {sortedLocations.map((location: { slug: string; title: string }) => (
                  <li key={location.slug}>
                    <Link
                      href={`/locations/${location.slug}`}
                      className="hover:text-brand-primary transition-colors"
                    >
                      {location.title}
                    </Link>
                  </li>
                ))}
                {allLocations.length > siteConfig.footer.maxLocations && (
                  <li>
                    <Link
                      href="/locations"
                      className="hover:text-brand-primary transition-colors font-semibold"
                    >
                      View All Locations &rarr;
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-300 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-brand-primary flex-shrink-0" />
                <Link
                  href={`tel:${PHONE_TEL}`}
                  className="hover:text-brand-primary transition-colors"
                >
                  {PHONE_DISPLAY}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-brand-primary flex-shrink-0" />
                <Link
                  href={`mailto:${BUSINESS_EMAIL}`}
                  className="hover:text-brand-primary transition-colors"
                >
                  {BUSINESS_EMAIL}
                </Link>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-brand-primary flex-shrink-0 mt-1" />
                <div className="leading-relaxed">
                  <div>{ADDRESS.locality}</div>
                  <div>{ADDRESS.region}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 text-xs sm:text-sm">
                <Link href="/privacy-policy" className="hover:text-brand-primary transition-colors">
                  Privacy Policy
                </Link>
                <span className="mx-2 text-gray-500">|</span>
                <Link href="/cookie-policy" className="hover:text-brand-primary transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-gray-300 text-xs sm:text-sm">
          <p>
            &copy; {siteConfig.footer.copyright}
            {siteConfig.footer.builtBy && (
              <>
                {" "}
                | Built by{" "}
                <a
                  href={siteConfig.footer.builtBy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-brand-primary transition-colors underline"
                >
                  {siteConfig.footer.builtBy.name}
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
