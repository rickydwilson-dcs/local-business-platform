import type { HomePageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Phone } from 'lucide-react';

export function LyraHomePage({
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

      {/* Hero Section — sage green gradient, editorial serif heading */}
      <section className="relative overflow-hidden bg-brand-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-brand-primary opacity-90" />
        <div className="relative container-narrow text-center py-24 md:py-32">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance text-white leading-tight">
            {heroHeadline || `Professional Services in ${siteConfig.address.city}`}
          </h1>
          <p className="text-xl md:text-2xl text-brand-light mb-10 text-balance">
            {heroSubheading || siteConfig.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={siteConfig.cta.primary.href}
              className="bg-brand-accent text-surface-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {siteConfig.cta.primary.label}
            </Link>
            <Link
              href="/services"
              className="border-2 border-white/60 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Our Services
            </Link>
          </div>

          {/* Phone CTA */}
          {siteConfig.cta.phone.show && (
            <div className="mt-10">
              <Link
                href={`tel:${siteConfig.phone}`}
                className="inline-flex items-center gap-2 text-lg font-semibold text-brand-light hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>Call us: {siteConfig.phoneDisplay}</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Strip — warm cream background */}
      {siteConfig.stats && siteConfig.stats.length > 0 && (
        <section className="py-10 bg-surface-muted border-y border-surface-cardBorder">
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

      {/* Services Overview */}
      <section className="py-20 md:py-24 bg-surface-background">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
              Our Services
            </h2>
            <p className="text-surface-muted-foreground max-w-2xl mx-auto text-lg">
              We offer a comprehensive range of professional services tailored to your needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="bg-surface-card border border-surface-cardBorder rounded-xl p-6 group hover:border-brand-primary hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-semibold mb-3 group-hover:text-brand-primary transition-colors text-surface-foreground">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-surface-muted-foreground line-clamp-3">{service.description}</p>
                )}
                <span className="inline-block mt-4 text-brand-primary font-medium group-hover:translate-x-1 transition-transform">
                  Learn more &rarr;
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/services"
              className="border border-brand-primary text-brand-primary px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary hover:text-white transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Service Areas — muted surface */}
      <section className="py-20 md:py-24 bg-surface-muted">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
              Service Areas
            </h2>
            <p className="text-surface-muted-foreground max-w-2xl mx-auto text-lg">
              We proudly serve customers across these locations and surrounding areas.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="bg-surface-card border border-surface-cardBorder rounded-xl p-6 group text-center hover:border-brand-primary hover:shadow-lg transition-all"
              >
                <p className="text-lg font-semibold group-hover:text-brand-primary transition-colors text-surface-foreground">
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
          <div className="text-center mt-10">
            <Link
              href="/locations"
              className="border border-brand-primary text-brand-primary px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary hover:text-white transition-colors"
            >
              View All Locations
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section — brand primary */}
      <section className="py-20 md:py-24 bg-brand-primary text-white">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-10 text-brand-light">
            Contact us today for a free consultation and quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-brand-accent text-surface-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Get a Free Quote
            </Link>
            {siteConfig.cta.phone.show && (
              <Link
                href={`tel:${siteConfig.phone}`}
                className="border-2 border-white/60 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
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
