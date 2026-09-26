/**
 * Race calendar loader for delta-t-racing.
 *
 * Self-contained — mirrors `lib/team.ts` / `lib/sponsors.ts` (`races` is not
 * part of the shared ContentDir union in @platform/core-components). One
 * content/races/*.mdx file per round; frontmatter only.
 */
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { RaceFrontmatterSchema, type Race } from './schemas/races';

const RACES_DIR = path.join(process.cwd(), 'content', 'races');

/**
 * Returns every round, sorted by round number ascending.
 */
export async function getRaces(): Promise<Race[]> {
  let files: string[];
  try {
    files = await fs.readdir(RACES_DIR);
  } catch {
    return [];
  }

  const races = await Promise.all(
    files
      .filter((f) => f.endsWith('.mdx'))
      .map(async (file): Promise<Race> => {
        const raw = await fs.readFile(path.join(RACES_DIR, file), 'utf8');
        const { data } = matter(raw);
        return { ...RaceFrontmatterSchema.parse(data), slug: file.replace(/\.mdx$/, '') };
      })
  );

  return races.sort((a, b) => a.round - b.round);
}

export type { Race, RaceFrontmatter } from './schemas/races';
