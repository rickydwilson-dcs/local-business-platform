import type { Metadata } from 'next';
import { HomePage as DesignlabHomePage } from '@platform/themes/designlab/pages';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';

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

export default function HomePage() {
  return <DesignlabHomePage />;
}
