import type { ServicesPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs } from '@platform/core-components';

export function CastorServicesPage({ services }: ServicesPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Services', href: '/services', current: true }];

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
            <h1 className="font-headline heading-hero">Our Services</h1>
            <p className="text-xl text-surface-muted-foreground mb-8 mx-auto max-w-3xl">
              Explore our range of professional services.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-standard bg-surface-muted">
        <div className="container-standard">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-surface-muted-foreground text-lg">
                No services available yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="bg-surface-card border border-surface-cardBorder rounded-xl p-6 group hover:border-brand-primary hover:shadow-lg transition-all"
                >
                  <h2 className="text-xl font-semibold mb-3 group-hover:text-brand-primary transition-colors text-surface-foreground">
                    {service.title}
                  </h2>
                  {service.description && (
                    <p className="text-surface-muted-foreground line-clamp-3">
                      {service.description}
                    </p>
                  )}
                  <span className="inline-block mt-4 text-brand-primary font-medium group-hover:translate-x-1 transition-transform">
                    Learn more &rarr;
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
