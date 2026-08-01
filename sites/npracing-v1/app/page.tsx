import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/home-page';
import { siteConfig } from '@/site.config';
import { getBrandContent } from '@/lib/brand';
import { absUrl } from '@/lib/site';
import { getLocalBusinessSchema } from '@/lib/schema';

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

export default async function HomePageRoute() {
  // The homepage is rendered entirely from content/brand/npracing.mdx —
  // frontmatter for the factual claims, the MDX body for the team story.
  const { frontmatter: brand, content: brandBody } = await getBrandContent();

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

  return <HomePage brand={brand} brandBody={brandBody} schemaNodes={schemaNodes} />;
}
