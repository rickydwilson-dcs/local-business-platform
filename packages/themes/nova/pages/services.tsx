import type { ServicesPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs } from '@platform/core-components';

export function NovaServicesPage({ siteConfig, services }: ServicesPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Services', href: '/services', current: true }];

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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-xl text-white/90 mx-auto max-w-3xl">
            Explore our range of professional services. {siteConfig.name} is committed to delivering
            quality work and exceptional customer service.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-standard bg-surface-background">
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
                  className="bg-surface-card border-l-4 border-brand-primary rounded-xl p-6 group hover:shadow-lg hover:border-brand-secondary transition-all"
                >
                  <h2 className="text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors text-surface-foreground">
                    {service.title}
                  </h2>
                  {service.description && (
                    <p className="text-surface-muted-foreground line-clamp-3">
                      {service.description}
                    </p>
                  )}
                  <span className="inline-block mt-4 text-brand-primary font-semibold group-hover:translate-x-1 transition-transform">
                    Learn more &rarr;
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
            Need a quote? We&apos;d love to help.
          </h2>
          <Link
            href="/contact"
            className="inline-block bg-white text-brand-primary px-8 py-3 rounded-lg font-bold hover:bg-surface-subtle transition-colors"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>
    </>
  );
}
