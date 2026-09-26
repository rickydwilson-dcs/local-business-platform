import { describe, it, expect } from 'vitest';
import { getRaces } from '../races';
import { getTeamMembers } from '../team';
import { getSponsors } from '../sponsors';
import { listNewsSlugs } from '../news';
import { getTeamSchema } from '../schema';

describe('Delta T content integrity', () => {
  it('has nine sequential rounds in date order', async () => {
    const races = await getRaces();
    expect(races.map((r) => r.round)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let i = 1; i < races.length; i++) {
      expect(races[i].startDate > races[i - 1].endDate).toBe(true);
    }
  });

  it('links every race report to a real news article', async () => {
    const [races, slugs] = await Promise.all([getRaces(), listNewsSlugs()]);
    for (const race of races.filter((r) => r.report)) {
      expect(slugs).toContain(race.report);
    }
  });

  it('gives every rider a unique race number', async () => {
    const riders = await getTeamMembers();
    const numbers = riders.map((r) => r.raceNumber).filter(Boolean);
    expect(riders).toHaveLength(4);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('loads every sponsor with a logo', async () => {
    const sponsors = await getSponsors();
    expect(sponsors.length).toBeGreaterThan(0);
    sponsors.forEach((s) => expect(s.logo.src).toMatch(/^https:\/\//));
  });

  it('emits a SportsTeam schema with no invented address or geo', () => {
    const schema = getTeamSchema('https://example.com/logo.png', ['A Rider']);
    expect(schema['@type']).toBe('SportsTeam');
    expect(schema).not.toHaveProperty('geo');
    expect(schema).not.toHaveProperty('address');
    expect(schema.athlete).toEqual([{ '@type': 'Person', name: 'A Rider' }]);
  });
});
