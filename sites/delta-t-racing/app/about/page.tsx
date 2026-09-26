/**
 * About Page route
 *
 * Server Component: metadata, canonical URL and JSON-LD. The page renders the
 * real team story from content/brand/delta-t-racing.mdx — the previous version of
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
import { getTeamMembers } from '@/lib/team';
import { getRaces } from '@/lib/races';
import { absUrl } from '@/lib/site';
import { Schema } from '@platform/core-components';
import { PageHead } from '@/components/sections/page-head';
import { StatStrip } from '@/components/sections/stat-strip';
import { ArrowButton } from '@/components/sections/arrow-link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'The story of Delta T Racing — a UK motorcycle racing team built by people from the refrigeration industry, racing the 2026 Bemsee (BMCRC) championship.',
  alternates: {
    canonical: absUrl('/about'),
  },
};

export default async function AboutPageRoute() {
  const [{ frontmatter: brand, content: brandBody }, riders, races] = await Promise.all([
    getBrandContent(),
    getTeamMembers(),
    getRaces(),
  ]);

  const stats = [
    { value: String(riders.length), label: `Riders, ${brand.season}` },
    { value: String(brand.classes.length), label: 'Class championships' },
    { value: String(races.length), label: `${brand.championship} rounds` },
  ];

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <PageHead
        eyebrow="About"
        title={brand.teamName}
        lede={brand.tagline}
        note={`${brand.championship} · ${brand.season}`}
      />

      <StatStrip items={stats} ariaLabel={`${brand.teamName} at a glance`} className="py-4" />

      <section className="container-grid py-16">
        <div className="mx-auto max-w-[52rem]">
          <div className="prose-grid-box">{brandBody}</div>

          <div className="mt-10 flex flex-wrap gap-4">
            <ArrowButton href="/team">Meet the riders</ArrowButton>
            <ArrowButton href="/news" variant="secondary">
              Latest team news
            </ArrowButton>
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
