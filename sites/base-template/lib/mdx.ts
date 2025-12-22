import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get all MDX files from a directory
 */
export function getMdxFiles(dir: string): string[] {
  const fullPath = path.join(contentDirectory, dir);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  const files = fs.readdirSync(fullPath, { recursive: true });
  return files
    .filter((file): file is string => typeof file === 'string' && file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Get MDX content and frontmatter
 */
export function getMdxContent(dir: string, slug: string) {
  const filePath = path.join(contentDirectory, dir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data,
    content,
  };
}

/**
 * Get all service slugs
 */
export function getAllServices(): string[] {
  return getMdxFiles('services');
}

/**
 * Get all location slugs
 */
export function getAllLocations(): string[] {
  return getMdxFiles('locations');
}
