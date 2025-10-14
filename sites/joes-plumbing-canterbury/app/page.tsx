import Link from "next/link";
import { siteConfig } from "../site.config";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-background to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 bg-white p-12 rounded-2xl shadow-xl border-4 border-brand-primary">
          <div className="text-6xl mb-4">💧🔧</div>
          <h1 className="text-6xl font-bold text-brand-primary mb-4">{siteConfig.business.name}</h1>
          <p className="text-2xl text-gray-700 mb-8 font-medium">{siteConfig.description}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${siteConfig.business.phone}`}
              className="bg-brand-primary text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-brand-secondary transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📞 Call Now: {siteConfig.business.phone}
            </a>
            <Link
              href="/services"
              className="bg-white text-brand-primary px-10 py-4 rounded-full text-xl font-bold border-4 border-brand-primary hover:bg-brand-light transition shadow-lg"
            >
              View Services →
            </Link>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-2 text-brand-primary">Our Services</h2>
          <p className="text-center text-gray-600 mb-8">
            Professional plumbing solutions for your home
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {siteConfig.services.primary.map((service) => (
              <div
                key={service}
                className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
              >
                <h3 className="font-bold text-lg mb-2">{service}</h3>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/services"
              className="text-brand-primary hover:text-brand-secondary font-bold text-xl underline"
            >
              View All Services →
            </Link>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mb-16 bg-white p-10 rounded-2xl shadow-xl">
          <h2 className="text-4xl font-bold text-center mb-2 text-brand-primary">Areas We Serve</h2>
          <p className="text-center text-gray-600 mb-8">Fast, reliable service across Kent</p>
          <div className="flex flex-wrap justify-center gap-4">
            {siteConfig.services.serviceArea.map((area) => (
              <span
                key={area}
                className="bg-brand-light text-brand-secondary px-6 py-3 rounded-full font-bold text-lg border-2 border-brand-primary"
              >
                📍 {area}
              </span>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/locations"
              className="text-brand-primary hover:text-brand-secondary font-bold text-xl underline"
            >
              View All Locations →
            </Link>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white p-10 rounded-2xl shadow-2xl">
          <h2 className="text-4xl font-bold text-center mb-6">✓ Fully Certified & Insured</h2>
          <ul className="space-y-4 max-w-2xl mx-auto">
            {siteConfig.business.certifications.map((cert) => (
              <li
                key={cert}
                className="flex items-center gap-3 bg-white/10 p-4 rounded-lg backdrop-blur"
              >
                <svg
                  className="w-8 h-8 text-brand-light flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white font-semibold text-lg">{cert}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <p className="mb-2">{siteConfig.business.hours.weekday}</p>
          <p className="mb-2">{siteConfig.business.hours.weekend}</p>
          <p className="font-semibold text-red-600">{siteConfig.business.hours.emergency}</p>
          <p className="mt-4 text-sm">
            © {new Date().getFullYear()} {siteConfig.business.legalName}. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
