/**
 * Blog Listing Page — mirrors colorcode.events/blog/
 */
import type { Metadata } from 'next';
import { BlogPreviewGrid, BlogPageBanner } from '@platform/themes/corvus/components';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Blog | Digital Marketing Weekend 2026',
  description: 'Articles, insights, and updates from Digital Marketing Weekend.',
};

export default function BlogPage() {
  return (
    <main>
      <BlogPageBanner />
      <BlogPreviewGrid />
    </main>
  );
}
