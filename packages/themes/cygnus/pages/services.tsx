import type { ServicesPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs } from '@platform/core-components';

export function CygnusServicesPage({ siteConfig, services }: ServicesPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Services', href: '/services', current: true }];

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
                Our Services
              </h1>
              <p className="text-xl text-surface-secondary-foreground mb-8 mx-auto max-w-3xl">
                Explore our range of professional services. {siteConfig.name} is committed to
                delivering quality work and exceptional customer service.
              </p>
            </div>
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
                    className="bg-surface-card border border-surface-card-border rounded-xl p-6 group hover:border-brand-primary hover:shadow-lg transition-all"
                  >
                    <h2 className="text-xl font-semibold mb-3 text-surface-foreground group-hover:text-brand-primary transition-colors">
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

        {/* CTA Section */}
        <section className="section-standard bg-brand-primary">
          <div className="container-standard text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-on-brand-primary">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-on-brand-primary/90 mb-8 max-w-2xl mx-auto">
              Contact us today for a free quote on any of our services.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-surface-inverse text-surface-foreground font-semibold rounded-lg hover:bg-surface-card transition-colors"
            >
              Get a Free Quote
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
