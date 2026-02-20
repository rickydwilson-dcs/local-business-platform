/**
 * Content utility stub for showcase — satisfies @/lib/content imports from core components.
 */

export type ContentType = 'services' | 'locations' | 'blog' | 'projects';

export type ContentItem = {
  slug: string;
  title: string;
  description?: string;
  badge?: string;
  features?: string[];
  subtitle?: string[];
  image?: string;
  [key: string]: unknown;
};

export async function getContentItems(_contentType: ContentType): Promise<ContentItem[]> {
  return [];
}

export async function getContentItem(
  _contentType: ContentType,
  _slug: string
): Promise<{ frontmatter: ContentItem; content: string }> {
  return { frontmatter: { slug: '', title: '' }, content: '' };
}
