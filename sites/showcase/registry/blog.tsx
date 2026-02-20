import { BlogPostCard } from '@platform/core-components';
import type { ElementDefinition } from './index';

const renderBlogCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-surface-background">
    {[1, 2, 3].map((i) => (
      <BlogPostCard
        key={i}
        title={`How to Choose the Right Contractor for Your Project ${i}`}
        excerpt="What to look for when hiring a local tradesperson — certifications, reviews, and red flags to avoid."
        date="2026-02-01"
        slug={`blog-post-${i}`}
        heroImage="https://placehold.co/800x450/e5e7eb/6b7280?text=Article+Image"
      />
    ))}
  </div>
);

export const blogElements: ElementDefinition[] = [
  {
    slug: 'blog-post-card',
    name: 'Blog Post Card',
    category: 'Blog',
    description: 'Article card with image, date, excerpt, and read-more link',
    renders: {
      orion: renderBlogCards,
      vega: renderBlogCards,
    },
  },
];
