/**
 * About Page — thin wrapper around OrionAboutPage
 */

import type { Metadata } from 'next';
import type { SiteConfigSummary } from '@platform/core-components';
import { Schema } from '@platform/core-components';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { OrionAboutPage } from '@platform/themes/orion/pages';

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.business.name}`,
  description: `Learn about ${siteConfig.business.name} - established ${siteConfig.credentials.yearEstablished}. Professional services with qualified team and comprehensive insurance.`,
  alternates: {
    canonical: absUrl('/about'),
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

const statCards = [
  { value: '15+', label: 'Years Electrical Expertise' },
  { value: 'NICEIC', label: 'Approved Contractor' },
  { value: '1000+', label: 'Satisfied Customers' },
];

const highlights = [
  'Fully qualified and NICEIC approved electricians',
  'Comprehensive electrical services for all needs',
  '24/7 emergency callout service available',
  'Part P certified and fully insured with £5M cover',
];

const coreValues = [
  {
    title: 'Quality first',
    description:
      'We maintain the highest standards in everything we do, ensuring exceptional results for every project.',
  },
  {
    title: 'Professional excellence',
    description:
      'Our team is fully qualified and continuously trained to deliver professional service.',
  },
  {
    title: 'Reliable service',
    description:
      'We arrive on time, complete projects efficiently, and communicate clearly throughout.',
  },
  {
    title: 'Customer focus',
    description:
      'Your satisfaction is our priority. We listen to your needs and deliver tailored solutions.',
  },
];

const benefits = [
  'Fully insured and accredited',
  'Free quotes and consultations',
  'Competitive pricing',
  'Quality workmanship guaranteed',
  'Professional, uniformed team',
  'Clear communication throughout',
  'Flexible scheduling',
  'Comprehensive aftercare',
];

export default function AboutPageWrapper() {
  return (
    <>
      <OrionAboutPage
        siteConfig={siteSummary}
        heroImage="djfoxelectrical/hero/about-hero.jpg"
        heroTitle="About D J Fox Electrical"
        heroSubtitle="Serving Eastbourne & East Sussex since 2025"
        statCards={statCards}
        highlights={highlights}
        coreValues={coreValues}
        benefits={benefits}
        phoneTel={PHONE_TEL}
      />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ]}
        webpage={{
          '@type': 'AboutPage',
          '@id': absUrl('/about#aboutpage'),
          url: absUrl('/about'),
          name: `About ${siteConfig.business.name}`,
          description: `Learn about ${siteConfig.business.name} - professional services since ${siteConfig.credentials.yearEstablished}.`,
        }}
      />
    </>
  );
}
