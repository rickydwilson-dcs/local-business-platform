import type { AboutPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs } from '@platform/core-components';
import { Phone } from 'lucide-react';

export function NovaAboutPage({ siteConfig }: AboutPageTemplateProps) {
  const breadcrumbItems = [{ name: 'About', href: '/about', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-surface-background">
        {/* Hero Section */}
        <section className="bg-brand-primary py-16 md:py-24">
          <div className="container-standard text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About {siteConfig.name}
            </h1>
            <p className="text-xl text-white/90 mx-auto max-w-3xl">{siteConfig.tagline}</p>
          </div>
        </section>

        {/* Stats */}
        {siteConfig.stats && siteConfig.stats.length > 0 && (
          <section className="py-12 bg-surface-subtle border-y border-surface-border">
            <div className="container-standard">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {siteConfig.stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-brand-primary">{stat.value}</div>
                    <div className="text-sm text-surface-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Info Cards */}
        <section className="section-standard bg-surface-background">
          <div className="container-standard">
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-surface-card border-l-4 border-brand-primary rounded-xl p-6 shadow-sm text-center">
                <h3 className="font-bold text-surface-foreground mb-2">Location</h3>
                <p className="text-surface-muted-foreground">{siteConfig.address.city}</p>
              </div>
              <div className="bg-surface-card border-l-4 border-brand-secondary rounded-xl p-6 shadow-sm text-center">
                <h3 className="font-bold text-surface-foreground mb-2">Phone</h3>
                <Link
                  href={`tel:${siteConfig.phone}`}
                  className="text-brand-primary font-semibold hover:underline"
                >
                  {siteConfig.phoneDisplay}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-standard bg-brand-primary">
          <div className="container-standard text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Work With Us?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact us today for a free consultation and quote. We look forward to helping you with
              your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-brand-primary px-8 py-3 rounded-lg font-bold hover:bg-surface-subtle transition-colors"
              >
                Get a Free Quote
              </Link>
              <Link
                href={`tel:${siteConfig.phone}`}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
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
