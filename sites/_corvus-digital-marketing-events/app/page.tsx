import type { Metadata } from 'next';
import type { SiteConfigSummary } from '@platform/core-components';
import { VegaHomePage } from '@platform/themes/vega/pages';
import { siteConfig } from '@/site.config';
import { getLocations } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { getLocalBusinessSchema } from '@/lib/schema';
import { PHONE_DISPLAY } from '@/lib/contact-info';

export const metadata: Metadata = {
  title: `${siteConfig.business.name} | ${siteConfig.tagline}`,
  description:
    'Professional local services tailored to your needs. Quality workmanship, competitive pricing, and excellent customer service.',
  openGraph: {
    title: `${siteConfig.business.name} | ${siteConfig.tagline}`,
    description:
      'Professional local services tailored to your needs. Quality workmanship, competitive pricing, and excellent customer service.',
    url: absUrl('/'),
    siteName: siteConfig.name,
    images: [
      {
        url: absUrl('/logo.svg'),
        width: 1200,
        height: 630,
        alt: `${siteConfig.business.name} - ${siteConfig.tagline}`,
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.business.name} | ${siteConfig.tagline}`,
    description:
      'Professional local services tailored to your needs. Quality workmanship, competitive pricing, and excellent customer service.',
    images: [absUrl('/logo.svg')],
  },
  alternates: {
    canonical: absUrl('/'),
  },
};

export default async function HomePage() {
  const locations = await getLocations();

  const localBusinessSchema = getLocalBusinessSchema();

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absUrl('/#website'),
    name: siteConfig.business.name,
    url: absUrl('/'),
    description: siteConfig.tagline,
    publisher: {
      '@id': absUrl('/#organization'),
    },
    inLanguage: 'en-GB',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: absUrl('/'),
      },
    ],
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

  const schemaNodes = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );

  return (
    <VegaHomePage
      siteConfig={siteSummary}
      services={siteConfig.services.map((s) => ({
        slug: s.slug,
        title: s.title,
        description: s.description,
      }))}
      locations={locations.map((l) => ({
        slug: l.slug,
        title: l.title,
        description: l.description,
      }))}
      schemaNodes={schemaNodes}
    />
  );
}
