/**
 * Services Listing Page
 *
 * Thin wrapper around OrionServicesPage template.
 */

import type { Metadata } from 'next';
import type { SiteConfigSummary } from '@platform/core-components';
import { Schema } from '@platform/core-components';
import { getServices } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY } from '@/lib/contact-info';
import { OrionServicesPage } from '@platform/themes/orion/pages';

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

const siteSummary: SiteConfigSummary = {
  name: siteConfig.business.name,
  tagline: siteConfig.tagline,
  phone: siteConfig.business.phone,
  phoneDisplay: PHONE_DISPLAY,
  address: { city: siteConfig.business.address.city },
  cta: siteConfig.cta,
  stats: siteConfig.credentials?.stats,
};

const featuredServices = [
  {
    title: 'Emergency Callout',
    description: '24/7 emergency electrical service. Rapid response for urgent issues that cannot wait — we arrive fast and fix it right.',
    href: '/services/emergency-electrical-callout',
  },
  {
    title: 'Safety Testing',
    description: 'EICR certificates and comprehensive electrical safety inspections. Complete peace of mind for landlords, homeowners, and businesses.',
    href: '/services/electrical-safety-certificate',
  },
  {
    title: 'Installations',
    description: 'Professional installation of electrical systems and appliances, from consumer units to EV chargers and solar panels.',
    href: '/services#installation',
  },
];

const categoryCards = [
  {
    imageSrc: 'djfoxelectrical/categories/installation-category.jpg',
    imageAlt: 'New electrical installations',
    category: 'Installation',
    title: 'Installation Services',
    href: '#installation-services',
  },
  {
    imageSrc: 'djfoxelectrical/categories/maintenance-category.jpg',
    imageAlt: 'Electrical maintenance and upgrades',
    category: 'Maintenance',
    title: 'Maintenance & Upgrades',
    href: '#maintenance-services',
  },
  {
    imageSrc: 'djfoxelectrical/categories/repair-category.jpg',
    imageAlt: 'Emergency electrical repairs',
    category: 'Repair',
    title: 'Repair & Emergency',
    href: '#repair-services',
  },
];

export default async function ServicesPageWrapper() {
  const services = await getServices();

  const installationServices = services.filter((s) => s.category === 'installation');
  const maintenanceServices = services.filter((s) => s.category === 'maintenance');
  const repairServices = services.filter((s) => s.category === 'repair');
  const uncategorizedServices = services.filter((s) => !s.category);

  const serviceCategories = [
    {
      id: 'installation-services',
      label: 'Installation',
      description: 'Professional installation of new electrical systems, equipment, and appliances',
      services: installationServices.map((s) => ({ slug: s.slug, title: s.title, description: s.description })),
      bgClass: 'bg-white',
    },
    {
      id: 'maintenance-services',
      label: 'Maintenance',
      description: 'Regular maintenance, safety inspections, and system upgrades',
      services: maintenanceServices.map((s) => ({ slug: s.slug, title: s.title, description: s.description })),
      bgClass: 'bg-surface-muted',
    },
    {
      id: 'repair-services',
      label: 'Repair & emergency',
      description: '24/7 emergency callouts, fault finding, and electrical repairs',
      services: repairServices.map((s) => ({ slug: s.slug, title: s.title, description: s.description })),
      bgClass: 'bg-white',
    },
    ...(uncategorizedServices.length > 0
      ? [
          {
            id: 'other-services',
            label: 'Other Services',
            description: 'Additional professional services',
            services: uncategorizedServices.map((s) => ({ slug: s.slug, title: s.title, description: s.description })),
            bgClass: 'bg-surface-muted',
          },
        ]
      : []),
  ];

  const serviceSummaries = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    description: s.description,
  }));

  return (
    <>
      <OrionServicesPage
        siteConfig={siteSummary}
        services={serviceSummaries}
        heroImage="djfoxelectrical/hero/services-hero.jpg"
        featuredServices={featuredServices}
        categoryCards={categoryCards}
        serviceCategories={serviceCategories}
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
