import type { ReactElement } from 'react';
import { loadMdx } from '@/lib/mdx';
import { BrandFrontmatterSchema, type BrandFrontmatter } from '@/lib/schemas/brand';

/**
 * Brand record accessor — server-only.
 *
 * `content/brand/npracing.mdx` is a schema-validated singleton holding the
 * team's identity facts (frontmatter) and its narrative history (MDX body).
 * Every component that needs team copy reads it through here, so there is
 * exactly one source and no hand-read of the raw file anywhere else.
 */
const BRAND_SLUG = 'npracing';

/** Structured team facts only — the common case. */
export async function getBrand(): Promise<BrandFrontmatter> {
  const { frontmatter } = await loadMdx({ baseDir: 'brand', slug: BRAND_SLUG });
  return BrandFrontmatterSchema.parse(frontmatter);
}

/** Team facts plus the rendered narrative body, for editorial blocks. */
export async function getBrandRecord(): Promise<{
  frontmatter: BrandFrontmatter;
  content: ReactElement;
}> {
  const { frontmatter, content } = await loadMdx({ baseDir: 'brand', slug: BRAND_SLUG });
  return { frontmatter: BrandFrontmatterSchema.parse(frontmatter), content };
}

export type { BrandFrontmatter };
