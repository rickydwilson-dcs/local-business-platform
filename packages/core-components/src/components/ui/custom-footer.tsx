import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL, ADDRESS } from "@/lib/contact-info";

interface CustomFooterProps {
  townName: string;
  ctaText: string;
  ctaSubtext: string;
  ctaButtonText: string;
  ctaLink: string;
}

export function CustomFooter({
  townName,
  ctaText,
  ctaSubtext,
  ctaButtonText,
  ctaLink,
}: CustomFooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main CTA Section */}
      <section className="py-16 sm:py-20 bg-brand-blue">
        <div className="mx-auto w-full lg:w-[90%] px-6 text-center">
          <h2 className="heading-section text-white">{ctaText}</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">{ctaSubtext}</p>
          <Link
            href={ctaLink}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-blue font-semibold rounded-lg hover:bg-gray-200 transition-colors text-lg"
          >
            {ctaButtonText}
          </Link>
        </div>
      </section>

      {/* Main Footer Content */}
      <div className="py-16 sm:py-20">
        <div className="mx-auto w-full lg:w-[90%] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-6">Colossus Scaffolding</h3>
              <p className="text-gray-300 mb-6">
                Professional scaffolding services in {townName} and across the South East. TG20:21
                compliant, fully insured, CHAS accredited.
              </p>
              <div className="space-y-2">
                <p className="text-gray-300">{ADDRESS.street}</p>
                <p className="text-gray-300">
                  {ADDRESS.locality}, {ADDRESS.region}
                </p>
                <p className="text-gray-300">{ADDRESS.postalCode}</p>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xl font-bold mb-6">Our Services</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <Link
                    href="/services/access-scaffolding"
                    className="hover:text-white transition-colors"
                  >
                    Access Scaffolding
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/facade-scaffolding"
                    className="hover:text-white transition-colors"
                  >
                    Facade Scaffolding
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/edge-protection"
                    className="hover:text-white transition-colors"
                  >
                    Edge Protection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/temporary-roof-systems"
                    className="hover:text-white transition-colors"
                  >
                    Temporary Roofs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/scaffolding-design-drawings"
                    className="hover:text-white transition-colors"
                  >
                    Design & Drawings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/scaffolding-inspections-maintenance"
                    className="hover:text-white transition-colors"
                  >
                    Inspections
                  </Link>
                </li>
              </ul>
            </div>

            {/* Locations */}
            <div>
              <h3 className="text-xl font-bold mb-6">Service Areas</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <Link
                    href="/locations/east-sussex"
                    className="hover:text-white transition-colors"
                  >
                    East Sussex
                  </Link>
                </li>
                <li>
                  <Link
                    href="/locations/west-sussex"
                    className="hover:text-white transition-colors"
                  >
                    West Sussex
                  </Link>
                </li>
                <li>
                  <Link href="/locations/kent" className="hover:text-white transition-colors">
                    Kent
                  </Link>
                </li>
                <li>
                  <Link href="/locations/surrey" className="hover:text-white transition-colors">
                    Surrey
                  </Link>
                </li>
                <li>
                  <Link href="/locations/london" className="hover:text-white transition-colors">
                    London
                  </Link>
                </li>
                <li>
                  <Link href="/locations/essex" className="hover:text-white transition-colors">
                    Essex
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold mb-6">Contact Us</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <p className="font-semibold text-white mb-1">Phone</p>
                  <a href={`tel:${PHONE_TEL}`} className="hover:text-white transition-colors">
                    {PHONE_DISPLAY}
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">Email</p>
                  <a
                    href={`mailto:${BUSINESS_EMAIL}`}
                    className="hover:text-white transition-colors"
                  >
                    {BUSINESS_EMAIL}
                  </a>
                </div>
                <div>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-8 text-center">
            <div className="text-gray-300 text-sm">
              <p>
                &copy; 2025 Colossus Scaffolding. All rights reserved. | Built by Digital Consulting
                Services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
