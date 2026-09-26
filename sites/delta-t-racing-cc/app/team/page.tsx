/**
 * Team route
 *
 * Server Component: metadata and canonical URL only. The page body is the
 * card-grid `TeamPage` component, which renders one card per
 * content/team/*.mdx record.
 */
import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { getTeamMembers } from '@/lib/team';
import { getBrandContent } from '@/lib/brand';
import { absUrl } from '@/lib/site';
import { TeamPage } from '@/components/pages/team-page';

export const metadata: Metadata = {
  title: 'Riders',
  description:
    'Meet the four Delta T Racing riders — Gene Goodrum, Jared Oakley, Lance Jordan and Dylan Jordan — racing the 2026 Bemsee (BMCRC) championship.',
  openGraph: {
    title: `Riders | ${siteConfig.name}`,
    description: 'Meet the four Delta T Racing riders racing the 2026 Bemsee (BMCRC) championship.',
    url: absUrl('/team'),
    siteName: siteConfig.name,
    locale: 'en_GB',
    type: 'website',
  },
  alternates: {
    canonical: absUrl('/team'),
  },
};

export default async function TeamPageRoute() {
  const [members, { frontmatter: brand }] = await Promise.all([
    getTeamMembers(),
    getBrandContent(),
  ]);

  return <TeamPage members={members} classes={brand.classes} season={brand.season} />;
}
