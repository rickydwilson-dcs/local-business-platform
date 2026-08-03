/**
 * Team route
 *
 * Thin wrapper around `components/pages/team-page.tsx`, same shape as
 * `app/merch/page.tsx` — created here (rather than left to a later phase)
 * so the primary nav's `/team` link doesn't 404.
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { absUrl } from '@/lib/site';
import { TeamPage } from '@/components/pages/team-page';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Team',
  description: `Meet the full crew behind ${siteConfig.business.name} — riders, technicians, and everyone else who gets the team to the grid.`,
  alternates: {
    canonical: absUrl('/team'),
  },
};

export default function TeamRoute() {
  return <TeamPage />;
}
