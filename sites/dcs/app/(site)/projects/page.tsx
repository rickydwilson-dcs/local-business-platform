/**
 * `/projects` — the portfolio list, ported to the r9 design.
 * See `components/projects/projects-list-page.tsx` for the port's own notes.
 */

import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { ProjectsListPage } from '@/components/projects/projects-list-page';
import { getProjects, getTestimonials } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Our Portfolio | Case Studies | ${siteConfig.business.name}`,
  description: `View our portfolio of completed websites. See how we've helped tradespeople across ${siteConfig.serviceAreas.join(', ')} get more jobs online.`,
  keywords: ['portfolio', 'case studies', 'web design examples', 'tradesperson websites'],
  openGraph: {
    title: `Our Portfolio | Case Studies | ${siteConfig.business.name}`,
    description: `View our portfolio of completed websites for local tradespeople.`,
    url: '/projects',
    type: 'website',
  },
};

export default async function ProjectsPage() {
  const [projects, testimonials] = await Promise.all([getProjects(), getTestimonials()]);

  return (
    <>
      <ProjectsListPage projects={projects} testimonials={testimonials} />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          // "Work" matches the rendered breadcrumb and primary nav label
          // (`components/site/site-chrome-data.ts`'s `PRIMARY_LINKS`) — the
          // r9 design labels this route "Work" throughout, though the path
          // stays `/projects`.
          { name: 'Work', url: '/projects' },
        ]}
        webpage={{
          '@type': 'CollectionPage',
          '@id': absUrl('/projects#collection'),
          url: absUrl('/projects'),
          name: `${siteConfig.business.name} Portfolio`,
          description: `Portfolio of completed websites for local tradespeople.`,
        }}
      />
    </>
  );
}
