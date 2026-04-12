import type { LocationsPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs } from '@platform/core-components';

export function NovaLocationsPage({ siteConfig, locations }: LocationsPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Locations', href: '/locations', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-brand-primary py-16 md:py-24">
        <div className="container-standard text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Service Areas</h1>
          <p className="text-xl text-white/90 mx-auto max-w-3xl">
            {siteConfig.name} proudly serves customers across {siteConfig.address.city} and
            surrounding areas. Find our professional services near you.
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="section-standard bg-surface-background">
        <div className="container-standard">
          {locations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-surface-muted-foreground text-lg">
                No locations available yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <span className="inline-block mt-4 text-brand-primary font-semibold group-hover:translate-x-1 transition-transform text-sm">
                    View services &rarr;
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-12 bg-brand-primary">
        <div className="container-standard text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Can&apos;t find your area? Get in touch.
          </h2>
          <Link
            href="/contact"
            className="inline-block bg-white text-brand-primary px-8 py-3 rounded-lg font-bold hover:bg-surface-subtle transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
