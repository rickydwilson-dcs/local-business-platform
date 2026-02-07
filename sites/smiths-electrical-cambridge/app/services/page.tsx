/**
 * Services Listing Page
 * =====================
 *
 * Displays all available services.
 */

import type { Metadata } from 'next';
import { Schema, ContentGrid, Breadcrumbs } from '@platform/core-components';
import { getServices } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Our Services | ${siteConfig.business.name}`,
  description: `Professional services offered by ${siteConfig.business.name}. Quality work, competitive prices, and excellent customer service.`,
  keywords: ['services', 'professional services', 'local business'],
  openGraph: {
    title: `Our Services | ${siteConfig.business.name}`,
    description: `Professional services offered by ${siteConfig.business.name}.`,
    url: '/services',
    type: 'website',
  },
};

export default async function ServicesPage() {
  const services = await getServices();

  const breadcrumbItems = [{ name: 'Services', href: '/services', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-b from-surface-subtle to-surface-background">
        {/* Hero Section */}
        <section className="section-standard lg:py-24 bg-surface-background">
          <div className="container-standard">
            <div className="text-center">
              <h1 className="heading-hero">Our Services</h1>
              <p className="text-xl text-surface-foreground mb-8 mx-auto max-w-3xl">
                Explore our range of professional services. {siteConfig.business.name} is committed
                to delivering quality work and exceptional customer service.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <ContentGrid
              items={services}
              basePath="/services"
              contentType="services"
              emptyMessage="No services available yet. Check back soon."
              fallbackDescription={(title) =>
                `Learn more about our ${title.toLowerCase()} services.`
              }
            />
          </div>
        </section>
      </main>

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ]}
        webpage={{
          '@type': 'CollectionPage',
          '@id': absUrl('/services#collection'),
          url: absUrl('/services'),
          name: `${siteConfig.business.name} Services`,
          description: `Professional services offered by ${siteConfig.business.name}.`,
        }}
      />
    </>
  );
}
