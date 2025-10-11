import { siteConfig } from "../site.config";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {siteConfig.business.name}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {siteConfig.description}
          </p>
          <div className="flex justify-center gap-4">
            <a
              href={`tel:${siteConfig.business.phone}`}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Call Now: {siteConfig.business.phone}
            </a>
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Get a Quote
            </a>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {siteConfig.services.primary.map((service) => (
              <div
                key={service}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {service}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Service Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Areas We Serve
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {siteConfig.services.serviceArea.map((area) => (
              <span
                key={area}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Fully Certified & Insured
          </h2>
          <ul className="space-y-2">
            {siteConfig.business.certifications.map((cert) => (
              <li key={cert} className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">{cert}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <p className="mb-2">{siteConfig.business.hours.weekday}</p>
          <p className="mb-2">{siteConfig.business.hours.weekend}</p>
          <p className="font-semibold text-red-600">
            {siteConfig.business.hours.emergency}
          </p>
          <p className="mt-4 text-sm">
            © {new Date().getFullYear()} {siteConfig.business.legalName}. All
            rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
