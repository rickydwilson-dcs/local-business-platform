import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { getLocations } from '@/lib/content';
import { absUrl, slugify } from '@/lib/site';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { getLocalBusinessSchema, getWebSiteSchema, getBreadcrumbSchema } from '@/lib/schema';
import { Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description:
    'Professional electrical services in Cambridge and Cambridgeshire. NICEIC approved, Part P registered electricians for domestic, commercial, and emergency work.',
  keywords: [
    'electrician Cambridge',
    'electrical services Cambridgeshire',
    'NICEIC approved electrician',
    'Part P registered',
    'domestic electrician Cambridge',
    'EICR testing Cambridge',
    'EV charger installation Cambridge',
    'emergency electrician Cambridge',
  ],
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description:
      'Professional electrical services in Cambridge and Cambridgeshire. NICEIC approved, Part P registered electricians.',
    url: absUrl('/'),
    siteName: siteConfig.name,
    images: [
      {
        url: absUrl('/static/logo.png'),
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.tagline}`,
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description:
      'Professional electrical services in Cambridge and Cambridgeshire. NICEIC approved, Part P registered electricians.',
    images: [absUrl('/static/logo.png')],
  },
  alternates: {
    canonical: absUrl('/'),
  },
};

export default async function HomePage() {
  // Fetch actual locations from content
  const locations = await getLocations();

  // Generate JSON-LD structured data
  const localBusinessSchema = getLocalBusinessSchema();
  const webSiteSchema = getWebSiteSchema();
  const breadcrumbSchema = getBreadcrumbSchema([{ name: 'Home', url: '/' }]);

  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-brand-primary/5 to-white">
        <div className="container-narrow text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance text-surface-foreground">
            {siteConfig.name}
          </h1>
          <p className="text-xl md:text-2xl text-surface-muted-foreground mb-8 text-balance">
            {siteConfig.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              {siteConfig.cta.primary.label}
            </Link>
            <Link href="/services" className="btn-secondary">
              Our Services
            </Link>
          </div>

          {/* Phone CTA */}
          {siteConfig.cta.phone.show && (
            <div className="mt-8">
              <Link
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center gap-2 text-lg font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>Call us: {PHONE_DISPLAY}</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      {siteConfig.credentials.stats.length > 0 && (
        <section className="py-8 bg-surface-subtle border-y border-surface-border">
          <div className="container-narrow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {siteConfig.credentials.stats.map((stat, index) => (
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
      <section className="section">
        <div className="container-narrow">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-surface-foreground">
            Our Services
          </h2>
          <p className="text-center text-surface-muted-foreground mb-12 max-w-2xl mx-auto">
            We offer a comprehensive range of professional services tailored to your needs.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="card group hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3 group-hover:text-brand-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-surface-muted-foreground">{service.description}</p>
                <span className="inline-block mt-4 text-brand-primary font-medium group-hover:translate-x-1 transition-transform">
                  Learn more &rarr;
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services" className="btn-secondary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Service Areas - Now with clickable links */}
      <section className="section bg-surface-subtle">
        <div className="container-narrow">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-surface-foreground">
            Service Areas
          </h2>
          <p className="text-center text-surface-muted-foreground mb-12 max-w-2xl mx-auto">
            We proudly serve customers across these locations and surrounding areas.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* If we have content-based locations, use those */}
            {locations.length > 0
              ? locations.map((location) => (
                  <Link
                    key={location.slug}
                    href={`/locations/${location.slug}`}
                    className="card group text-center hover:shadow-lg transition-shadow hover:border-brand-primary"
                  >
                    <p className="text-lg font-semibold group-hover:text-brand-primary transition-colors">
                      {location.title}
                    </p>
                    {location.description && (
                      <p className="text-sm text-surface-muted-foreground mt-2 line-clamp-2">
                        {location.description}
                      </p>
                    )}
                  </Link>
                ))
              : // Fallback to config-based service areas (also clickable)
                siteConfig.serviceAreas.map((area) => (
                  <Link
                    key={area}
                    href={`/locations/${slugify(area)}`}
                    className="card group text-center hover:shadow-lg transition-shadow hover:border-brand-primary"
                  >
                    <p className="text-lg font-semibold group-hover:text-brand-primary transition-colors">
                      {area}
                    </p>
                  </Link>
                ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/locations" className="btn-secondary">
              View All Locations
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-brand-primary text-white">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contact us today for a free consultation and quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get a Free Quote
            </Link>
            {siteConfig.cta.phone.show && (
              <Link
                href={`tel:${PHONE_TEL}`}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {PHONE_DISPLAY}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
