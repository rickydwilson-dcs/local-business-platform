import { siteConfig } from '@/site.config';
import { absUrl } from './site';

/**
 * JSON-LD for the team as a schema.org SportsTeam.
 *
 * npracing-v1 used the shared createSchemaGenerators LocalBusiness generator;
 * that needs a street address and geo coordinates, which Delta T (a club team
 * with no public base) doesn't have, so this site emits a SportsTeam node from
 * site.config.ts instead of publishing invented coordinates.
 */
export function getTeamSchema(logoUrl: string, memberNames: string[] = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    '@id': absUrl('/#organization'),
    name: siteConfig.business.name,
    url: absUrl('/'),
    logo: logoUrl,
    description: siteConfig.schema.description,
    slogan: siteConfig.schema.slogan,
    sport: siteConfig.schema.sport,
    email: siteConfig.business.email,
    ...(memberNames.length > 0 && {
      athlete: memberNames.map((name) => ({ '@type': 'Person', name })),
    }),
    ...(siteConfig.schema.sameAs.length > 0 && { sameAs: siteConfig.schema.sameAs }),
  };
}
