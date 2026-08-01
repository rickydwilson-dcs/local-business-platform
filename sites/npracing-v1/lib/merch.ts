/**
 * Merch content loader for npracing-v1.
 *
 * Self-contained — does NOT go through `createMdxLoader` / `createContentUtils`
 * because `merch` is not part of the shared `ContentDir` / `ContentType` unions
 * defined in @platform/core-components (those are closed unions in a shared
 * package and not editable from this site). This module reimplements the same
 * read → gray-matter → validate pattern locally, scoped to `merch` only.
 *
 * Merch products are sold via an external retailer — cards render from
 * frontmatter only, so there is no MDX body to compile/render here.
 */
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { MerchFrontmatterSchema, type MerchFrontmatter } from './schemas/merch';

export type MerchProduct = MerchFrontmatter & { slug: string };

const MERCH_DIR = path.join(process.cwd(), 'content', 'merch');

async function readMerchSlugs(): Promise<string[]> {
  let files: string[];
  try {
    files = await fs.readdir(MERCH_DIR);
  } catch {
    return [];
  }
  return files.filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, ''));
}

async function readMerchProduct(slug: string): Promise<MerchProduct | null> {
  const filePath = path.join(MERCH_DIR, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
  const { data } = matter(raw);
  const frontmatter = MerchFrontmatterSchema.parse(data);
  return { ...frontmatter, slug };
}

/**
 * Returns all merch products, sorted by `sortOrder` ascending.
 */
export async function getMerchProducts(): Promise<MerchProduct[]> {
  const slugs = await readMerchSlugs();
  const products = await Promise.all(slugs.map((slug) => readMerchProduct(slug)));
  return products
    .filter((p): p is MerchProduct => p !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Returns a single merch product by slug, or null if not found.
 */
export async function getMerchProduct(slug: string): Promise<MerchProduct | null> {
  return readMerchProduct(slug);
}

/**
 * Returns only merch products marked `featured: true`, sorted by `sortOrder`.
 */
export async function getFeaturedMerchProducts(): Promise<MerchProduct[]> {
  const products = await getMerchProducts();
  return products.filter((p) => p.featured);
}

/**
 * Returns only merch products marked `available: true`, sorted by `sortOrder`.
 */
export async function getAvailableMerchProducts(): Promise<MerchProduct[]> {
  const products = await getMerchProducts();
  return products.filter((p) => p.available);
}

export type { MerchFrontmatter, MerchCategoryValue } from './schemas/merch';
export { MerchFrontmatterSchema, MerchCategory } from './schemas/merch';
