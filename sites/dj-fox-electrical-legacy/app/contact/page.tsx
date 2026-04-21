/**
 * Contact Page — thin wrapper around OrionContactPage
 */

import type { Metadata } from 'next';
import type { SiteConfigSummary } from '@platform/core-components';
import { Schema } from '@platform/core-components';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL, ADDRESS } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { OrionContactPage } from '@platform/themes/orion/pages';

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.business.name}`,
  description: `Get in touch with ${siteConfig.business.name} for a free quote or to discuss your requirements. Professional services across ${siteConfig.serviceAreas.slice(0, 3).join(', ')} and surrounding areas.`,
  alternates: {
    canonical: absUrl('/contact'),
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

const locationNames = (siteConfig.serviceAreaRegions?.[0]?.towns || []).map(
  (t: { name: string }) => t.name
);

export default function ContactPageWrapper() {
  return (
    <>
      <OrionContactPage
        siteConfig={siteSummary}
        heroImage="djfoxelectrical/hero/contact-hero.jpg"
        serviceAreaNames={locationNames}
        email={BUSINESS_EMAIL}
        phoneTel={PHONE_TEL}
        address={{
          street: ADDRESS.street,
          locality: ADDRESS.locality,
          region: ADDRESS.region,
          postalCode: ADDRESS.postalCode,
        }}
        businessHours={{
          weekdays: siteConfig.business.hours.monday,
          saturday: siteConfig.business.hours.saturday,
          sunday: siteConfig.business.hours.sunday,
        }}
        serviceLinks={siteConfig.services
          .slice(0, 5)
          .map((s) => ({ slug: s.slug, title: s.title }))}
      />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ]}
        webpage={{
          '@type': 'ContactPage',
          '@id': absUrl('/contact#contactpage'),
          url: absUrl('/contact'),
          name: `Contact ${siteConfig.business.name}`,
          description: `Get in touch with ${siteConfig.business.name} for a free quote or to discuss your requirements.`,
        }}
      />
    </>
  );
}
