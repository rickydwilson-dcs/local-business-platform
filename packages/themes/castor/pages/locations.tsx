import type { LocationsPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs } from '@platform/core-components';

export function CastorLocationsPage({ locations }: LocationsPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Locations', href: '/locations', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Page Title */}
      <section className="section-standard lg:py-24 bg-surface-background">
        <div className="container-standard">
          <div className="text-center">
            <h1 className="font-headline heading-hero">Our Service Areas</h1>
            <p className="text-xl text-surface-muted-foreground mb-8 mx-auto max-w-3xl">
              Find our professional services in your area.
            </p>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="section-standard bg-surface-muted">
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
                  className="bg-surface-card border border-surface-cardBorder rounded-xl p-6 group hover:border-brand-primary hover:shadow-lg transition-all text-center"
                >
                  <h2 className="text-xl font-semibold group-hover:text-brand-primary transition-colors text-surface-foreground">
                    {location.title}
                  </h2>
                  {location.description && (
                    <p className="text-surface-muted-foreground mt-2 line-clamp-3">
                      {location.description}
                    </p>
                  )}
                  <span className="inline-block mt-4 text-brand-primary font-medium group-hover:translate-x-1 transition-transform">
                    View services &rarr;
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
