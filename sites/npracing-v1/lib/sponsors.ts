/**
 * Sponsors content loader for npracing-v1.
 *
 * Self-contained — does NOT go through `createMdxLoader` / `createContentUtils`
 * because `sponsors` is not part of the shared `ContentDir` / `ContentType`
 * unions defined in @platform/core-components (those are closed unions in a
 * shared package and not editable from this site). This module reimplements
 * the same read → gray-matter → validate pattern locally, scoped to
 * `sponsors` only — mirrors `lib/team.ts`.
 *
 * Sponsors render as a spotlight list only — no MDX body to compile/render.
 */
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { SponsorFrontmatterSchema, type SponsorFrontmatter } from './schemas/sponsors';

export type Sponsor = SponsorFrontmatter & { slug: string };

const SPONSORS_DIR = path.join(process.cwd(), 'content', 'sponsors');

async function readSponsorSlugs(): Promise<string[]> {
  let files: string[];
  try {
    files = await fs.readdir(SPONSORS_DIR);
  } catch {
    return [];
  }
  return files.filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, ''));
}

async function readSponsor(slug: string): Promise<Sponsor | null> {
  const filePath = path.join(SPONSORS_DIR, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
  const { data } = matter(raw);
  const frontmatter = SponsorFrontmatterSchema.parse(data);
  return { ...frontmatter, slug };
}

/**
 * Returns all sponsors, sorted by `sortOrder` ascending.
 */
export async function getSponsors(): Promise<Sponsor[]> {
  const slugs = await readSponsorSlugs();
  const sponsors = await Promise.all(slugs.map((slug) => readSponsor(slug)));
  return sponsors.filter((s): s is Sponsor => s !== null).sort((a, b) => a.sortOrder - b.sortOrder);
}

export type { SponsorFrontmatter } from './schemas/sponsors';
export { SponsorFrontmatterSchema } from './schemas/sponsors';
