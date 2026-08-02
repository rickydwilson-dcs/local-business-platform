/**
 * Contact Page route
 *
 * Thin wrapper: metadata plus ContactPage schema. The layout, contact
 * channels, and the (deliberately non-sending) enquiry form all live in
 * `components/pages/contact-page.tsx`.
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';
import { Schema } from '@platform/core-components';
import { ContactPage as ContactPageView } from '@/components/pages/contact-page';

const CONTACT_DESCRIPTION = `Sponsorship enquiries, media requests, or a message for the ${siteConfig.business.name} crew — reach the ${siteConfig.racing.championship} team by email or Instagram.`;

export const metadata: Metadata = {
  title: 'Contact',
  description: CONTACT_DESCRIPTION,
  alternates: {
    canonical: absUrl('/contact'),
  },
};

export default function ContactRoute() {
  return (
    <>
      <ContactPageView />

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
          description: CONTACT_DESCRIPTION,
        }}
      />
    </>
  );
}
