/**
 * Individual Build Page — /builds/[slug]
 * =======================================
 *
 * Renders the "documented car" template (components/pages/build-detail-page.tsx) for a single
 * `content/builds/*.mdx` entry — but ONLY for builds whose frontmatter declares
 * `pageStatus: 'built'`. `generateStaticParams` reads that flag from the real MDX collection
 * (via lib/content.ts's `getBuilds()`, the same generic content loader every other content
 * type in this codebase uses) rather than hardcoding slugs, so a future build automatically
 * gets a page the moment its `pageStatus` flips from `pending` to `built` — see
 * lib/content-schemas.ts's file-header comment and
 * output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/yolo-brief.md's Phase 6.
 *
 * `dynamicParams = false` means Next 404s any slug outside that generated set on its own —
 * there is no route for a `pending` build to leak through, even if linked to directly.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBuilds, getBuild } from '@/lib/content';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { Schema } from '@platform/core-components';
import { BuildDetailPage } from '@/components/pages/build-detail-page';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams() {
  const builds = await getBuilds();
  return builds.filter((build) => build.pageStatus === 'built').map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;

  let frontmatter;
  try {
    ({ frontmatter } = await getBuild(slug));
  } catch {
    return {
      title: 'Build Not Found',
      description: 'The requested build could not be found.',
    };
  }

  const description =
    frontmatter.description ||
    frontmatter.scopeOfWork ||
    `${frontmatter.title} — a restoration documented in full by ${siteConfig.business.name}.`;

  return {
    title: frontmatter.seoTitle || `${frontmatter.title} | ${siteConfig.business.name}`,
    description,
    alternates: {
      canonical: absUrl(`/builds/${slug}`),
    },
    openGraph: {
      title: frontmatter.title,
      description,
      url: absUrl(`/builds/${slug}`),
      siteName: siteConfig.business.name,
      type: 'article',
      ...(frontmatter.heroImage
        ? {
            images: [
              {
                url: getImageUrl(frontmatter.heroImage),
                width: 1200,
                height: 630,
                alt: frontmatter.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description,
      ...(frontmatter.heroImage ? { images: [getImageUrl(frontmatter.heroImage)] } : {}),
    },
  };
}

export default async function BuildPageRoute({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  let frontmatter;
  let content;
  try {
    ({ frontmatter, content } = await getBuild(slug));
  } catch {
    notFound();
  }

  if (frontmatter.pageStatus !== 'built') {
    // Defence in depth — dynamicParams:false already prevents Next from routing here for a
    // 'pending' build, but never render one if this is somehow reached directly.
    notFound();
  }

  return (
    <>
      <BuildDetailPage frontmatter={frontmatter} mdxSource={content} />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Builds', url: '/library' },
          { name: frontmatter.title, url: `/builds/${slug}` },
        ]}
        webpage={{
          '@type': 'WebPage',
          '@id': absUrl(`/builds/${slug}#webpage`),
          url: absUrl(`/builds/${slug}`),
          name: frontmatter.title,
          description:
            frontmatter.description ||
            frontmatter.scopeOfWork ||
            `${frontmatter.title} — a restoration documented in full by ${siteConfig.business.name}.`,
        }}
      />
    </>
  );
}
