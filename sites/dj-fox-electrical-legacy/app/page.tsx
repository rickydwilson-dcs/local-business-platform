import type { Metadata } from 'next';
import type { SiteConfigSummary } from '@platform/core-components';
import { siteConfig } from '@/site.config';
import { getLocations } from '@/lib/content';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { getLocalBusinessSchema } from '@/lib/schema';
import { OrionHomePage } from '@platform/themes/orion/pages';

export const metadata: Metadata = {
  title: 'Professional Electrical Services in Eastbourne | D J Fox Electrical',
  description:
    'NICEIC approved electrical contractor in Eastbourne, East Sussex. 15+ years experience, 24/7 emergency service. Domestic and commercial electrical services.',
  openGraph: {
    title: 'Professional Electrical Services in Eastbourne | D J Fox Electrical',
    description:
      'NICEIC approved electrical contractor in Eastbourne, East Sussex. 15+ years experience, 24/7 emergency service.',
    url: absUrl('/'),
    siteName: siteConfig.name,
    images: [
      {
        url: absUrl('/logo.svg'),
        width: 1200,
        height: 630,
        alt: `${siteConfig.business.name} - Professional Electrical Services in Eastbourne`,
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Electrical Services in Eastbourne | D J Fox Electrical',
    description:
      'NICEIC approved electrical contractor in Eastbourne, East Sussex. 15+ years experience, 24/7 emergency service.',
    images: [absUrl('/logo.svg')],
  },
  alternates: {
    canonical: absUrl('/'),
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

const whyChooseUsItems = [
  {
    icon: 'Shield',
    title: 'NICEIC Approved',
    body: 'Fully certified and approved contractor, ensuring all work meets the highest safety standards and building regulations.',
    stat: 'Certified',
  },
  {
    icon: 'Award',
    title: '15+ years experience',
    body: 'Over 15 years of professional electrical experience serving homes and businesses across East Sussex.',
    stat: 'Est. 2010',
  },
  {
    icon: 'Clock',
    title: '24/7 emergency service',
    body: 'Round-the-clock emergency callout service for urgent electrical issues that cannot wait until morning.',
    stat: 'Always on',
  },
  {
    icon: 'Users',
    title: '1,000+ jobs completed',
    body: 'Customer-focused service with a commitment to quality workmanship and complete satisfaction on every job.',
    stat: '& counting',
  },
];

const categoryCards = [
  {
    imageSrc: 'djfoxelectrical/categories/installation-work.jpg',
    imageAlt: 'Electrical installation services',
    category: 'Installation',
    title: 'New Installations',
    href: '/services#installation',
  },
  {
    imageSrc: 'djfoxelectrical/categories/maintenance-work.jpg',
    imageAlt: 'Electrical maintenance services',
    category: 'Maintenance',
    title: 'Regular Maintenance',
    href: '/services#maintenance',
  },
  {
    imageSrc: 'djfoxelectrical/categories/repair-work.jpg',
    imageAlt: 'Electrical repair services',
    category: 'Repair',
    title: 'Expert Repairs',
    href: '/services#repair',
  },
];

export default async function HomePage() {
  const allLocations = await getLocations();

  const priorityLocationSlugs = [
    'eastbourne',
    'hastings',
    'bexhill-on-sea',
    'brighton',
    'lewes',
    'hailsham',
  ];

  const locations = allLocations
    .filter((loc) => priorityLocationSlugs.includes(loc.slug))
    .sort((a, b) => priorityLocationSlugs.indexOf(a.slug) - priorityLocationSlugs.indexOf(b.slug))
    .map((loc) => ({ slug: loc.slug, title: loc.title, description: loc.description }));

  const services = siteConfig.services.slice(0, 6).map((s) => ({
    slug: s.slug,
    title: s.title,
    description: s.description,
  }));

  const localBusinessSchema = getLocalBusinessSchema();
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absUrl('/#website'),
    name: siteConfig.business.name,
    url: absUrl('/'),
    description: siteConfig.tagline,
    publisher: { '@id': absUrl('/#organization') },
    inLanguage: 'en-GB',
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') }],
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
    <OrionHomePage
      siteConfig={siteSummary}
      services={services}
      locations={locations}
      heroImage="djfoxelectrical/hero/hero-electrician-work.jpg"
      heroHeadline="High Quality Electrical Services in Eastbourne"
      heroSubheading="NICEIC Approved Contractor | 15+ Years Experience | 24/7 Emergency Service"
      schemaNodes={schemaNodes}
      whyChooseUsItems={whyChooseUsItems}
      badge="NICEIC"
      categoryCards={categoryCards}
    />
  );
}
