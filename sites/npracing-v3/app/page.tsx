import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/home-page';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';
import { getLocalBusinessSchema } from '@/lib/schema';

/**
 * Homepage description — the team's own facts, not the base-template's
 * local-service boilerplate.
 */
const HOME_DESCRIPTION = `${siteConfig.business.name} is an independent British Superbike team based in ${siteConfig.racing.base}, running Honda machinery for #${siteConfig.racing.raceNumber} ${siteConfig.racing.rider.name} in the ${siteConfig.racing.championship}.`;

export const metadata: Metadata = {
  title: `${siteConfig.business.name} | ${siteConfig.tagline}`,
  description: HOME_DESCRIPTION,
  openGraph: {
    title: `${siteConfig.business.name} | ${siteConfig.tagline}`,
    description: HOME_DESCRIPTION,
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
    description: HOME_DESCRIPTION,
    images: [absUrl('/logo.svg')],
  },
  alternates: {
    canonical: absUrl('/'),
  },
};

export default function HomePageRoute() {
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

  return <HomePage schemaNodes={schemaNodes} />;
}
