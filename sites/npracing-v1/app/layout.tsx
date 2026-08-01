import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/site.config';
import { getBrandContent } from '@/lib/brand';
import { PageShell } from '@platform/core-components';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ConsentManager } from '@platform/core-components/components/analytics/ConsentManager';
import { Analytics } from '@platform/core-components/components/analytics/Analytics';
import { AnalyticsDebugPanel } from '@platform/core-components/components/analytics/AnalyticsDebugPanel';

export async function generateMetadata(): Promise<Metadata> {
  // `/logo.svg` does not exist in public/ (confirmed — no .svg files there).
  // Reuse the same placehold.co placeholder content/brand/npracing.mdx already
  // uses for logo.src (no R2 credentials available yet, see Phase 4) so there
  // is only one broken-vs-working image source decision across the site.
  const { frontmatter: brand } = await getBrandContent();

  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.tagline,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      siteName: siteConfig.name,
      url: siteConfig.url,
      images: [
        {
          url: brand.logo.src,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [brand.logo.src],
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Team identity (logo, email, Instagram, championship) comes from
  // content/brand/npracing.mdx — the header and footer never hardcode it.
  const { frontmatter: brand } = await getBrandContent();

  // Config-driven, not hardcoded: the footer's link column mirrors the same
  // navigation array the header renders.
  const footerColumns = [
    {
      title: 'Explore',
      links: siteConfig.navigation.main.map((item) => ({
        label: item.label,
        href: item.href,
      })),
    },
  ];

  return (
    <html lang="en-GB">
      <head>
        {/* Geo meta tags for local SEO */}
        {siteConfig.business.geo && (
          <>
            <meta name="geo.region" content="GB" />
            <meta
              name="geo.position"
              content={`${siteConfig.business.geo.latitude};${siteConfig.business.geo.longitude}`}
            />
            <meta
              name="ICBM"
              content={`${siteConfig.business.geo.latitude}, ${siteConfig.business.geo.longitude}`}
            />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <PageShell
          header={
            <SiteHeader
              siteName={brand.teamName}
              logo={brand.logo}
              navigation={siteConfig.navigation.main}
              primaryCta={siteConfig.cta.primary}
              instagramUrl={brand.instagramUrl}
              instagramHandle={brand.instagramHandle}
              announcement={brand.championship}
            />
          }
          footer={
            <SiteFooter
              siteName={brand.teamName}
              logo={brand.logo}
              columns={footerColumns}
              email={brand.email}
              instagramUrl={brand.instagramUrl}
              instagramHandle={brand.instagramHandle}
              copyright={`${new Date().getFullYear()} ${brand.teamName}. All rights reserved.`}
              builtBy={siteConfig.footer?.builtBy}
            />
          }
        >
          {children}
        </PageShell>

        <ConsentManager
          enabled={process.env.NEXT_PUBLIC_FEATURE_CONSENT_BANNER === 'true'}
          config={{
            title: 'We value your privacy',
            description:
              'We use cookies to provide a better service and understand how you use our site.',
            privacyPolicyUrl: '/privacy-policy',
            cookiePolicyUrl: '/cookie-policy',
          }}
          reloadOnConsent={false}
        />
        <Analytics
          gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          facebookPixelId={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}
          googleAdsId={process.env.NEXT_PUBLIC_GOOGLE_ADS_CUSTOMER_ID}
          debugMode={process.env.NODE_ENV === 'development'}
        />
        <AnalyticsDebugPanel enabled={process.env.NODE_ENV === 'development'} />
      </body>
    </html>
  );
}
