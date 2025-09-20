import Link from "next/link";
import { Phone, Mail, MapPin, Shield, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-16">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Colossus Scaffolding</h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              Professional scaffolding services across the South East UK. TG20:21 compliant, CHAS
              accredited.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue" />
                <span>TG20:21</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue" />
                <span>CHAS</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li>
                <Link
                  href="/services/access-scaffolding"
                  className="hover:text-brand-blue transition-colors"
                >
                  Access Scaffolding
                </Link>
              </li>
              <li>
                <Link
                  href="/services/facade-scaffolding"
                  className="hover:text-brand-blue transition-colors"
                >
                  Facade Scaffolding
                </Link>
              </li>
              <li>
                <Link
                  href="/services/edge-protection"
                  className="hover:text-brand-blue transition-colors"
                >
                  Edge Protection
                </Link>
              </li>
              <li>
                <Link
                  href="/services/birdcage-scaffolds"
                  className="hover:text-brand-blue transition-colors"
                >
                  Birdcage Scaffolds
                </Link>
              </li>
              <li>
                <Link
                  href="/services/public-access-staircases"
                  className="hover:text-brand-blue transition-colors"
                >
                  Public Access Staircases
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-blue transition-colors">
                  View All Scaffolding Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Coverage Areas</h4>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li>
                <Link
                  href="/locations/east-sussex"
                  className="hover:text-brand-blue transition-colors"
                >
                  East Sussex
                </Link>
              </li>
              <li>
                <Link
                  href="/locations/west-sussex"
                  className="hover:text-brand-blue transition-colors"
                >
                  West Sussex
                </Link>
              </li>
              <li>
                <Link href="/locations/kent" className="hover:text-brand-blue transition-colors">
                  Kent
                </Link>
              </li>
              <li>
                <Link href="/locations/surrey" className="hover:text-brand-blue transition-colors">
                  Surrey
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-300 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue flex-shrink-0" />
                <Link href="tel:01424466661" className="hover:text-brand-blue transition-colors">
                  01424 466 661
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue flex-shrink-0" />
                <Link
                  href="mailto:info@colossusscaffolding.com"
                  className="hover:text-brand-blue transition-colors"
                >
                  info@colossusscaffolding.com
                </Link>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue flex-shrink-0 mt-1" />
                <div className="leading-relaxed">
                  <div>South East UK</div>
                  <div>Professional Scaffolding Services</div>
                </div>
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
              className="hover:text-brand-blue transition-colors"
            >
              Digital Consulting Services
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
