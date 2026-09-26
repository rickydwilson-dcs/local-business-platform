import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/home-page';
import { siteConfig } from '@/site.config';
import { getBrandContent } from '@/lib/brand';
import { getTeamMembers } from '@/lib/team';
import { getSponsors } from '@/lib/sponsors';
import { getRaces } from '@/lib/races';
import { getAllNewsArticles } from '@/lib/news';
import { absUrl } from '@/lib/site';
import { getTeamSchema } from '@/lib/schema';

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter: brand } = await getBrandContent();

  const title = `${brand.teamName} | UK motorcycle racing team`;
  const description = `${brand.tagline}. Four riders racing the ${brand.season} ${brand.championship} championship across ${brand.classes.join(', ')}.`;

  return {
    // Absolute: the layout's `%s | Delta T Racing` template would double the name.
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url: absUrl('/'),
      siteName: siteConfig.name,
      images: [
        {
          url: brand.ogImage,
          width: 1200,
          height: 630,
          alt: brand.teamName,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [brand.ogImage],
    },
    alternates: {
      canonical: absUrl('/'),
    },
  };
}

export default async function HomePageRoute() {
  const [{ frontmatter: brand }, riders, races, sponsors, news] = await Promise.all([
    getBrandContent(),
    getTeamMembers(),
    getRaces(),
    getSponsors(),
    getAllNewsArticles(),
  ]);

  const teamSchema = getTeamSchema(
    brand.logo.src,
    riders.map((rider) => rider.name)
  );

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absUrl('/#website'),
    name: siteConfig.business.name,
    url: absUrl('/'),
    description: siteConfig.tagline,
    publisher: {
      '@id': absUrl('/#organization'),
    },
    inLanguage: 'en-GB',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: absUrl('/'),
      },
    ],
  };

  const schemaNodes = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );

  return (
    <HomePage
      brand={brand}
      riders={riders}
      races={races}
      sponsors={sponsors}
      latestNews={news[0]}
      schemaNodes={schemaNodes}
    />
  );
}
