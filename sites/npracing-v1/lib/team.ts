/**
 * Team content loader for npracing-v1.
 *
 * Self-contained — does NOT go through `createMdxLoader` / `createContentUtils`
 * because `team` is not part of the shared `ContentDir` / `ContentType` unions
 * defined in @platform/core-components (those are closed unions in a shared
 * package and not editable from this site). This module reimplements the same
 * read → gray-matter → validate pattern locally, scoped to `team` only —
 * mirrors `lib/merch.ts`.
 *
 * Team members render as a card grid only — no MDX body to compile/render.
 */
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { TeamFrontmatterSchema, type TeamFrontmatter } from './schemas/team';

export type TeamMember = TeamFrontmatter & { slug: string };

const TEAM_DIR = path.join(process.cwd(), 'content', 'team');

async function readTeamSlugs(): Promise<string[]> {
  let files: string[];
  try {
    files = await fs.readdir(TEAM_DIR);
  } catch {
    return [];
  }
  return files.filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, ''));
}

async function readTeamMember(slug: string): Promise<TeamMember | null> {
  const filePath = path.join(TEAM_DIR, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
  const { data } = matter(raw);
  const frontmatter = TeamFrontmatterSchema.parse(data);
  return { ...frontmatter, slug };
}

/**
 * Returns all team members, sorted by `sortOrder` ascending.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const slugs = await readTeamSlugs();
  const members = await Promise.all(slugs.map((slug) => readTeamMember(slug)));
  return members
    .filter((m): m is TeamMember => m !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export type { TeamFrontmatter } from './schemas/team';
export { TeamFrontmatterSchema } from './schemas/team';
