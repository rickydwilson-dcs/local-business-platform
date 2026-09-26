/**
 * Contact Page route
 *
 * Server Component: metadata, canonical URL and JSON-LD. The page body is the
 * Grid Box `ContactPage` client component. Its enquiry form only renders when
 * `siteConfig.features.contactForm` is on (it needs Resend + CSRF env vars on
 * the Vercel project); until then the page leads with the team's email.
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { getBrandContent } from '@/lib/brand';
import { absUrl } from '@/lib/site';
import { Schema } from '@platform/core-components';
import { ContactPage } from '@/components/pages/contact-page';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Delta T Racing about sponsorship, media or team enquiries.',
  alternates: {
    canonical: absUrl('/contact'),
  },
};

export default async function ContactPageRoute() {
  const { frontmatter: brand } = await getBrandContent();

  return (
    <>
      <ContactPage brand={brand} formEnabled={siteConfig.features.contactForm} />

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
