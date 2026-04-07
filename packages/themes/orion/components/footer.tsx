import Link from 'next/link';
import { Phone, Mail, MapPin, Shield, Award } from 'lucide-react';

export interface OrionFooterProps {
  siteName: string;
  tagline: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  address: { locality: string; region: string };
  certifications: Array<{ name: string; description: string; icon?: string }>;
  services: Array<{ slug: string; title: string }>;
  locations: Array<{ slug: string; title: string }>;
  totalServices: number;
  totalLocations: number;
  maxServices: number;
  maxLocations: number;
  showServices: boolean;
  showLocations: boolean;
  copyright: string;
  builtBy?: { name: string; url: string };
}

export function OrionFooter({
  siteName,
  tagline,
  phoneDisplay,
  phoneTel,
  email,
  address,
  certifications,
  services,
  locations,
  totalServices,
  totalLocations,
  maxServices,
  maxLocations,
  showServices,
  showLocations,
  copyright,
  builtBy,
}: OrionFooterProps) {
  return (
    <footer className="bg-surface-inverse text-white py-12 sm:py-16">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Column 1: About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
              {siteName}
            </h2>
            <p className="text-surface-muted-foreground mb-4 text-sm sm:text-base">{tagline}</p>
            {certifications.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {certifications.slice(0, 3).map((cert, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                    {index === 0 ? (
                      <Award className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" aria-hidden="true" />
                    ) : (
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" aria-hidden="true" />
                    )}
                    <span>{cert.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Services */}
          {showServices && services.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-white">Our Services</h3>
              <ul className="space-y-2 text-surface-muted-foreground text-sm sm:text-base">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="hover:text-brand-primary transition-colors"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
                {totalServices > maxServices && (
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
          {showLocations && locations.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-white">Service Areas</h3>
              <ul className="space-y-2 text-surface-muted-foreground text-sm sm:text-base">
                {locations.map((location) => (
                  <li key={location.slug}>
                    <Link
                      href={`/locations/${location.slug}`}
                      className="hover:text-brand-primary transition-colors"
                    >
                      {location.title}
                    </Link>
                  </li>
                ))}
                {totalLocations > maxLocations && (
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
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-white">Contact Info</h3>
            <div className="space-y-3 text-surface-muted-foreground text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-brand-primary flex-shrink-0" aria-hidden="true" />
                <Link
                  href={`tel:${phoneTel}`}
                  className="hover:text-brand-primary transition-colors"
                >
                  {phoneDisplay}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-brand-primary flex-shrink-0" aria-hidden="true" />
                <Link
                  href={`mailto:${email}`}
                  className="hover:text-brand-primary transition-colors"
                >
                  {email}
                </Link>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-brand-primary flex-shrink-0 mt-1" aria-hidden="true" />
                <div className="leading-relaxed">
                  <div>{address.locality}</div>
                  <div>{address.region}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-subtle text-xs sm:text-sm">
                <Link href="/privacy-policy" className="hover:text-brand-primary transition-colors">
                  Privacy Policy
                </Link>
                <span className="mx-2 text-surface-muted-foreground">|</span>
                <Link href="/cookie-policy" className="hover:text-brand-primary transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-subtle pt-6 sm:pt-8 text-center text-surface-muted-foreground text-xs sm:text-sm">
          <p>
            &copy; {copyright}
            {builtBy && (
              <>
                {' '}
                | Built by{' '}
                <a
                  href={builtBy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-brand-primary transition-colors underline"
                >
                  {builtBy.name}
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
