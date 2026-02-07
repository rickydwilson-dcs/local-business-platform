/**
 * Locations Listing Page
 * ======================
 *
 * Displays all service area locations.
 */

import type { Metadata } from 'next';
import { Schema, ContentGrid, Breadcrumbs } from '@platform/core-components';
import { getLocations } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Service Areas | Locations | ${siteConfig.business.name}`,
  description: `${siteConfig.business.name} serves customers across ${siteConfig.serviceAreas.join(', ')}. Find our services in your area.`,
  keywords: ['locations', 'service areas', 'local services', ...siteConfig.serviceAreas],
  openGraph: {
    title: `Service Areas | ${siteConfig.business.name}`,
    description: `${siteConfig.business.name} serves customers across multiple locations.`,
    url: '/locations',
    type: 'website',
  },
};

export default async function LocationsPage() {
  const locations = await getLocations();

  const breadcrumbItems = [{ name: 'Locations', href: '/locations', current: true }];

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
              <h1 className="heading-hero">Our Service Areas</h1>
              <p className="text-xl text-surface-foreground mb-8 mx-auto max-w-3xl">
                {siteConfig.business.name} proudly serves customers across{' '}
                {siteConfig.serviceAreas.join(', ')}. Find our professional services in your area.
              </p>
            </div>
          </div>
        </section>

        {/* Locations Grid */}
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <ContentGrid
              items={locations}
              basePath="/locations"
              contentType="locations"
              emptyMessage="No locations available yet. Check back soon."
              fallbackDescription={(title) =>
                `Professional services in ${title}. Contact us for local expertise.`
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
          { name: 'Locations', url: '/locations' },
        ]}
        webpage={{
          '@type': 'CollectionPage',
          '@id': absUrl('/locations#collection'),
          url: absUrl('/locations'),
          name: `${siteConfig.business.name} Service Areas`,
          description: `${siteConfig.business.name} serves customers across multiple locations.`,
        }}
      />
    </>
  );
}
