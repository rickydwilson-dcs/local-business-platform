/**
 * `/blog/category/[slug]` — a topic page. THIS ROUTE DID NOT EXIST BEFORE
 * THIS PORT (Phase 3 of the inner-pages port brief). It ports
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/
 * blog-category.html` — see `components/blog/blog-category-page.tsx` for the
 * port's own notes on generalising beyond the one demoed topic (`local-seo`).
 *
 * SEVEN topics, not eight. An earlier brief/session.md said eight
 * `category` values exist in `content/blog/*.mdx` frontmatter; counting all
 * 21 files finds seven (`lib/blog-topics.ts`'s header has the full count).
 * `generateStaticParams` below returns exactly 7 params — a hard invariant
 * of this phase, not a coincidence of the current content.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Schema } from '@platform/core-components';
import { BlogCategoryPage } from '@/components/blog/blog-category-page';
import { getBlogPosts } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import {
  TOPIC_DESCRIPTIONS,
  TOPIC_HEADINGS,
  TOPIC_ORDER,
  categoryOf,
  type TopicSlug,
} from '@/lib/blog-topics';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { slug: string };

function isTopicSlug(slug: string): slug is TopicSlug {
  return (TOPIC_ORDER as readonly string[]).includes(slug);
}

export async function generateStaticParams() {
  // Exactly 7 — the real, counted category values (`lib/blog-topics.ts`'s
  // header), never derived from the frontmatter's inconsistent quoting.
  return TOPIC_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;

  if (!isTopicSlug(slug)) {
    return {
      title: 'Topic Not Found',
      description: 'The requested blog topic could not be found.',
      robots: { index: false },
    };
  }

  const posts = await getBlogPosts();
  const count = posts.filter((p) => categoryOf(p) === slug).length;
  const heading = TOPIC_HEADINGS[slug];
  const description = `${count} ${count === 1 ? 'guide' : 'guides'} on ${TOPIC_DESCRIPTIONS[slug].charAt(0).toLowerCase()}${TOPIC_DESCRIPTIONS[slug].slice(1)}`;

  return {
    title: `${heading} | Blog | ${siteConfig.business.name}`,
    description: description.length > 200 ? description.slice(0, 197) + '...' : description,
    openGraph: {
      title: heading,
      description,
      url: `/blog/category/${slug}`,
      type: 'website',
    },
    alternates: {
      canonical: absUrl(`/blog/category/${slug}`),
    },
  };
}

export default async function BlogCategoryRoute({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  if (!isTopicSlug(slug)) {
    notFound();
  }

  const allPosts = await getBlogPosts();
  const posts = allPosts.filter((p) => categoryOf(p) === slug);

  return (
    <>
      <BlogCategoryPage topic={slug} posts={posts} allPosts={allPosts} />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: TOPIC_HEADINGS[slug], url: `/blog/category/${slug}` },
        ]}
        webpage={{
          '@type': 'CollectionPage',
          '@id': absUrl(`/blog/category/${slug}#collection`),
          url: absUrl(`/blog/category/${slug}`),
          name: `${TOPIC_HEADINGS[slug]} | ${siteConfig.business.name} Blog`,
          description: `${posts.length} ${posts.length === 1 ? 'guide' : 'guides'} on ${TOPIC_HEADINGS[slug].toLowerCase()}.`,
        }}
      />
    </>
  );
}
