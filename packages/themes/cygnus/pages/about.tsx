import type { AboutPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs } from '@platform/core-components';
import { Phone } from 'lucide-react';

export function CygnusAboutPage({ siteConfig }: AboutPageTemplateProps) {
  const breadcrumbItems = [{ name: 'About', href: '/about', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b border-surface-card-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-surface-background">
        {/* Hero */}
        <section className="section-standard bg-surface-inverse">
          <div className="container-standard text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-surface-foreground">
              About {siteConfig.name}
            </h1>
            <p className="text-xl text-surface-secondary-foreground leading-relaxed mx-auto max-w-3xl">
              {siteConfig.tagline}
            </p>
          </div>
        </section>

        {/* Info Cards */}
        <section className="section-standard bg-surface-background">
          <div className="container-standard">
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-surface-card border border-surface-card-border rounded-xl p-6 text-center">
                <h3 className="font-semibold text-surface-foreground mb-2">Location</h3>
                <p className="text-surface-muted-foreground">{siteConfig.address.city}</p>
              </div>
              <div className="bg-surface-card border border-surface-card-border rounded-xl p-6 text-center">
                <h3 className="font-semibold text-surface-foreground mb-2">Phone</h3>
                <Link
                  href={`tel:${siteConfig.phone}`}
                  className="text-brand-primary hover:underline"
                >
                  {siteConfig.phoneDisplay}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        {siteConfig.stats && siteConfig.stats.length > 0 && (
          <section className="section-standard bg-surface-muted">
            <div className="container-standard">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {siteConfig.stats.map((stat, index) => (
                  <div key={index} className="bg-surface-card border border-surface-card-border rounded-xl p-6">
                    <div className="text-2xl md:text-3xl font-bold text-brand-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-surface-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section-standard bg-brand-primary">
          <div className="container-standard text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-on-brand-primary">
              Ready to Work With Us?
            </h2>
            <p className="text-xl mb-8 text-on-brand-primary/90 max-w-2xl mx-auto">
              Contact us today for a free consultation and quote. We look forward to helping you
              with your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-surface-inverse text-surface-foreground px-8 py-3 rounded-lg font-semibold hover:bg-surface-card transition-colors"
              >
                Get a Free Quote
              </Link>
              <Link
                href={`tel:${siteConfig.phone}`}
                className="border-2 border-on-brand-primary text-on-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-on-brand-primary/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {siteConfig.phoneDisplay}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
