/**
 * Contact Page route
 *
 * Server Component: metadata, canonical URL and JSON-LD. The page body is the
 * Grid Box `ContactPage` client component, which owns the (deliberately
 * non-sending) enquiry form.
 *
 * The base-template's `ContactForm` from @platform/core-components is NOT used
 * here: it POSTs to /api/contact and tells the visitor their message was sent.
 * NPRacing has no confirmed enquiry inbox wired up for this build, so the page
 * must not make that claim. See components/pages/contact-page.tsx.
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { getBrandContent } from '@/lib/brand';
import { absUrl } from '@/lib/site';
import { Schema } from '@platform/core-components';
import { ContactPage } from '@/components/pages/contact-page';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with NPRacing about sponsorship, media, merchandise or team enquiries.',
  alternates: {
    canonical: absUrl('/contact'),
  },
};

export default async function ContactPageRoute() {
  const { frontmatter: brand } = await getBrandContent();

  return (
    <>
      <ContactPage brand={brand} />

      <Schema
        org={{
          name: brand.teamName,
          url: '/',
          logo: brand.logo.src,
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ]}
        webpage={{
          '@type': 'ContactPage',
          '@id': absUrl('/contact#contactpage'),
          url: absUrl('/contact'),
          name: `Contact ${brand.teamName}`,
          description: `Get in touch with ${brand.teamName} — ${siteConfig.racing.championship}.`,
        }}
      />
    </>
  );
}
