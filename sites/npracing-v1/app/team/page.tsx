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
import { absUrl } from '@/lib/site';
import { TeamPage } from '@/components/pages/team-page';

export const metadata: Metadata = {
  title: 'Team',
  description:
    'Meet the full crew behind NPRacing — riders, technicians, and everyone else who gets the team to the grid.',
  openGraph: {
    title: `Team | ${siteConfig.name}`,
    description:
      'Meet the full crew behind NPRacing — riders, technicians, and everyone else who gets the team to the grid.',
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
  const members = await getTeamMembers();

  return <TeamPage members={members} />;
}
