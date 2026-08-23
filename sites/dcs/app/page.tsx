import type { Metadata } from 'next';
import '@/styles/home-r9.css';
import { HomeBody } from '@/components/home/home-body';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';
import { getLocalBusinessSchema } from '@/lib/schema';

const HOME_TITLE = 'Digital Consulting Services — Websites as professional as you';
const HOME_DESCRIPTION =
  'Designed, written, built, hosted and looked after by me. Work that stands next to what London studios put out, for a fraction of the cost.';

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: absUrl('/'),
    siteName: siteConfig.name,
    images: [
      {
        url: absUrl('/logo.svg'),
        width: 1200,
        height: 630,
        alt: HOME_TITLE,
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [absUrl('/logo.svg')],
  },
  alternates: {
    canonical: absUrl('/'),
  },
};

export default function HomePage() {
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

  return (
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
      <HomeBody />
    </>
  );
}
