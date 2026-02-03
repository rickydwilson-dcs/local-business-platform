/**
 * RSS Feed for Blog
 *
 * Generates RSS 2.0 feed for blog posts.
 * Only available if blog feature is enabled in site config.
 */

import { NextResponse } from 'next/server';
import { siteConfig } from '@/site.config';
import { getBlogPosts } from '@/lib/content';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  // Check if blog feature is enabled
  if (!siteConfig.features.blog) {
    return new NextResponse('Blog feature is not enabled', { status: 404 });
  }

  const posts = await getBlogPosts();
  const baseUrl = siteConfig.url;
  const buildDate = new Date().toUTCString();

  const rssItems = posts
    .slice(0, 20) // Limit to 20 most recent posts
    .map((post) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt || '')}</description>
      <author>${escapeXml(post.author?.name || siteConfig.business.name)}</author>
      <category>${escapeXml(post.category || 'General')}</category>
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.business.name)} Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Expert insights, tips, and guidance from the ${escapeXml(siteConfig.business.name)} team.</description>
    <language>en-gb</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
