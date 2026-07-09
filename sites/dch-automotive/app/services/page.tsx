/**
 * Services Listing Page
 * =====================
 *
 * Displays all available services.
 */

import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { ServicesPage } from '@/components/pages/services-page';
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

export default async function ServicesPageRoute() {
  const services = await getServices();

  return (
    <>
      <ServicesPage
        services={services.map((s) => ({
          slug: s.slug,
          title: s.title,
          description: s.description,
          image: s.image,
        }))}
      />

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
