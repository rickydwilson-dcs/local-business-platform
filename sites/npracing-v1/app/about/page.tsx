/**
 * About Page route
 *
 * Server Component: metadata, canonical URL and JSON-LD. The page renders the
 * real team story from content/brand/npracing.mdx — the previous version of
 * this file rendered 100% unrebuilt base-template placeholder content
 * (`siteConfig.about.story`, `siteConfig.credentials.stats`, an empty
 * `serviceAreas.join(', ')`, and a `logo: '/logo.svg'` that doesn't exist in
 * public/). None of that is NPRacing-specific, so the page is rebuilt here
 * against the same `getBrandContent()` pattern already used by
 * `app/page.tsx` and `app/contact/page.tsx`, styled with the Grid Box
 * design tokens (PageHead masthead, `prose-grid-box` body — same pattern as
 * `components/pages/news-detail-page.tsx`).
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { getBrandContent } from '@/lib/brand';
import { absUrl } from '@/lib/site';
import { Schema } from '@platform/core-components';
import { PageHead } from '@/components/sections/page-head';
import { StatStrip } from '@/components/sections/stat-strip';
import { ArrowButton } from '@/components/sections/arrow-link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'The story of NPRacing — an independent Honda-mounted team in the British Superbike Championship, run out of Taunton, Somerset since 2004.',
  alternates: {
    canonical: absUrl('/about'),
  },
};

export default async function AboutPageRoute() {
  const { frontmatter: brand, content: brandBody } = await getBrandContent();

  const stats = [
    ...(brand.foundedYear
      ? [{ value: String(brand.foundedYear), label: 'In the BSB paddock since' }]
      : []),
    { value: `#${brand.raceNumber}`, label: `${brand.riderName}, 2026` },
    { value: 'Honda', label: 'Fireblade machinery' },
  ];

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <PageHead
        eyebrow="About"
        title={brand.teamName}
        lede={brand.tagline}
        note={brand.championship}
      />

      <StatStrip items={stats} ariaLabel={`${brand.teamName} at a glance`} className="py-4" />

      <section className="container-grid py-16">
        <div className="mx-auto max-w-[52rem]">
          <div className="prose-grid-box">{brandBody}</div>

          <div className="mt-10 flex flex-wrap gap-4">
            <ArrowButton href="/news">Latest team news</ArrowButton>
            <ArrowButton href="/contact" variant="secondary">
              Get in touch
            </ArrowButton>
          </div>
        </div>
      </section>

      <Schema
        org={{
          name: brand.teamName,
          url: '/',
          logo: brand.logo.src,
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ]}
        webpage={{
          '@type': 'AboutPage',
          '@id': absUrl('/about#aboutpage'),
          url: absUrl('/about'),
          name: `About ${brand.teamName}`,
          description: `The story of ${brand.teamName} — ${siteConfig.racing.championship}.`,
        }}
      />
    </>
  );
}
