import type { LocationsPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs } from '@platform/core-components';

export function CygnusLocationsPage({ siteConfig, locations }: LocationsPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Locations', href: '/locations', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b border-surface-card-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-surface-background">
        {/* Hero Section */}
        <section className="section-standard bg-surface-inverse">
          <div className="container-standard">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-surface-foreground">
                Our Service Areas
              </h1>
              <p className="text-xl text-surface-secondary-foreground mb-8 mx-auto max-w-3xl">
                {siteConfig.name} proudly serves customers across {siteConfig.address.city} and
                surrounding areas. Find our professional services near you.
              </p>
            </div>
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
                    className="bg-surface-card border border-surface-card-border rounded-xl p-6 group text-center hover:border-brand-primary hover:shadow-lg transition-all"
                  >
                    <p className="text-lg font-semibold text-surface-foreground group-hover:text-brand-primary transition-colors">
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
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="section-standard bg-brand-primary">
          <div className="container-standard text-center">
            <h2 className="text-3xl font-bold mb-4 text-on-brand-primary">
              Don&apos;t See Your Area?
            </h2>
            <p className="text-on-brand-primary/90 mb-8 max-w-2xl mx-auto text-lg">
              Contact us to find out if we cover your location.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-surface-inverse text-surface-foreground font-semibold rounded-lg hover:bg-surface-card transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
