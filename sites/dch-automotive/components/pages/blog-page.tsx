import Link from 'next/link';
import { BreadcrumbBar } from '@/components/breadcrumb-bar';
import { PageHero } from '@/components/page-hero';
import { getImageUrl } from '@/lib/image';

const categoryLabels: Record<string, string> = {
  'industry-tips': 'Industry Tips',
  'how-to-guide': 'How-To Guide',
  'case-study': 'Case Study',
  seasonal: 'Seasonal',
  news: 'News',
};

interface BlogCard {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  heroImage?: string;
  readingTime?: number;
  author?: { name: string };
}

export function BlogPage({ posts }: { posts: BlogCard[] }) {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog', current: true },
  ];

  return (
    <>
      <BreadcrumbBar items={breadcrumbItems} />

      <PageHero
        title="Industry Insights & Expert Tips"
        description="Professional guidance, tips, and industry news from our experienced team."
      />

      <section className="py-16 sm:py-24 bg-[#080807] border-y border-white/5">
        <div className="container mx-auto px-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">
                No blog posts yet. Check back soon for industry insights and expert tips.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-surface-card border border-surface-card-border hover:border-brand-primary transition-all"
                >
                  {post.heroImage && (
                    <div className="h-48 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element -- static Stitch design review asset, not next/image */}
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={post.title}
                        src={getImageUrl(post.heroImage)}
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                      <span className="bg-brand-primary/10 text-brand-primary font-bold uppercase tracking-wide px-3 py-1">
                        {categoryLabels[post.category] || post.category}
                      </span>
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                    <h2 className="text-xl font-heading font-bold uppercase mb-2">{post.title}</h2>
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      {post.author && (
                        <span className="text-xs text-white/40">{post.author.name}</span>
                      )}
                      <span className="text-brand-primary font-bold uppercase tracking-wide text-sm group-hover:translate-x-1 transition-transform">
                        Read more &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
