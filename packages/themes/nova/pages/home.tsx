import type { HomePageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Phone } from 'lucide-react';

export function NovaHomePage({
  siteConfig,
  services,
  locations,
  heroHeadline,
  heroSubheading,
  schemaNodes,
}: HomePageTemplateProps) {
  return (
    <div className="min-h-screen">
      {schemaNodes}

      {/* Hero Section — bold full-bleed brand-primary */}
      <section className="relative overflow-hidden bg-brand-primary">
        <div className="absolute inset-0 bg-brand-accent/10" />
        <div className="relative container-narrow text-center py-24 md:py-32">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance text-white">
            {heroHeadline || `Professional Services in ${siteConfig.address.city}`}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 text-balance">
            {heroSubheading || siteConfig.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={siteConfig.cta.primary.href}
              className="bg-white text-brand-primary px-8 py-3 rounded-lg font-bold hover:bg-surface-subtle transition-colors"
            >
              {siteConfig.cta.primary.label}
            </Link>
            <Link
              href="/services"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Our Services
            </Link>
          </div>

          {/* Phone CTA */}
          {siteConfig.cta.phone.show && (
            <div className="mt-8">
              <Link
                href={`tel:${siteConfig.phone}`}
                className="inline-flex items-center gap-2 text-lg font-semibold text-white hover:text-white/80 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>Call us: {siteConfig.phoneDisplay}</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Strip */}
      {siteConfig.stats && siteConfig.stats.length > 0 && (
        <section className="py-8 bg-surface-subtle border-y border-surface-border">
          <div className="container-narrow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {siteConfig.stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl md:text-3xl font-bold text-brand-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-surface-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Overview — energetic card grid */}
      <section className="section bg-surface-background">
        <div className="container-narrow">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-surface-foreground">
            Our Services
          </h2>
          <p className="text-center text-surface-muted-foreground mb-12 max-w-2xl mx-auto">
            We offer a comprehensive range of professional services tailored to your needs.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="bg-surface-card border-l-4 border-brand-primary rounded-xl p-6 group hover:shadow-lg hover:border-brand-secondary transition-all"
              >
                <h3 className="text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors text-surface-foreground">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-surface-muted-foreground">{service.description}</p>
                )}
                <span className="inline-block mt-4 text-brand-primary font-semibold group-hover:translate-x-1 transition-transform">
                  Learn more &rarr;
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/services"
              className="border-2 border-brand-primary text-brand-primary px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary hover:text-white transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section bg-surface-subtle">
        <div className="container-narrow">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-surface-foreground">
            Service Areas
          </h2>
          <p className="text-center text-surface-muted-foreground mb-12 max-w-2xl mx-auto">
            We proudly serve customers across these locations and surrounding areas.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="bg-surface-card border border-surface-cardBorder rounded-xl p-6 group text-center hover:border-brand-primary hover:shadow-lg transition-all"
              >
                <p className="text-lg font-bold group-hover:text-brand-primary transition-colors text-surface-foreground">
                  {location.title}
                </p>
                {location.description && (
                  <p className="text-sm text-surface-muted-foreground mt-2 line-clamp-2">
                    {location.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/locations"
              className="border-2 border-brand-primary text-brand-primary px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary hover:text-white transition-colors"
            >
              View All Locations
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section — strong brand-primary background */}
      <section className="section bg-brand-primary">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Contact us today for a free consultation and quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-brand-primary px-8 py-3 rounded-lg font-bold hover:bg-surface-subtle transition-colors"
            >
              Get a Free Quote
            </Link>
            {siteConfig.cta.phone.show && (
              <Link
                href={`tel:${siteConfig.phone}`}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {siteConfig.phoneDisplay}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
