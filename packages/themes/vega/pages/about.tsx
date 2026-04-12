import type { AboutPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs } from '@platform/core-components';
import { Phone } from 'lucide-react';

export function VegaAboutPage({ siteConfig }: AboutPageTemplateProps) {
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
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <div className="text-center">
              <h1 className="heading-hero mb-6">About {siteConfig.name}</h1>
              <p className="text-xl text-surface-muted-foreground leading-relaxed mx-auto max-w-3xl">
                {siteConfig.tagline}
              </p>
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="section-standard bg-surface-background">
          <div className="container-standard">
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-surface-subtle rounded-2xl p-6 shadow-lg border border-surface-border text-center">
                <h3 className="font-semibold text-surface-foreground mb-2">Location</h3>
                <p className="text-surface-muted-foreground">{siteConfig.address.city}</p>
              </div>
              <div className="bg-surface-subtle rounded-2xl p-6 shadow-lg border border-surface-border text-center">
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

        {/* CTA Section */}
        <section className="section-standard bg-brand-primary text-white">
          <div className="container-standard text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Work With Us?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Contact us today for a free consultation and quote. We look forward to helping you
              with your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-surface-subtle transition-colors"
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
