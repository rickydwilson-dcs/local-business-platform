import { siteConfig } from '@/site.config';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-blue-50 to-white">
        <div className="container-narrow text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            {siteConfig.name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 text-balance">
            {siteConfig.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn-primary">
              Get Started
            </a>
            <a href="/services" className="btn-secondary">
              Our Services
            </a>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section">
        <div className="container-narrow">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.services.map((service) => (
              <a key={service.slug} href={`/services/${service.slug}`} className="card group">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section bg-gray-50">
        <div className="container-narrow">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Service Areas</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {siteConfig.serviceAreas.map((area) => (
              <div key={area} className="card">
                <p className="text-lg font-semibold">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today for a free consultation and quote
          </p>
          <a href="/contact" className="btn-primary">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
