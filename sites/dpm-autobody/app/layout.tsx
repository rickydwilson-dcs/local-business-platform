import type { Metadata, Viewport } from 'next';
import { Archivo, Fraunces, Newsreader } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL, ADDRESS } from '@/lib/contact-info';
import { PageShell } from '@platform/core-components';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ConsentManager } from '@platform/core-components/components/analytics/ConsentManager';
import { Analytics } from '@platform/core-components/components/analytics/Analytics';
import { AnalyticsDebugPanel } from '@platform/core-components/components/analytics/AnalyticsDebugPanel';

/**
 * Fonts — self-hosted via next/font/google (no external request to fonts.googleapis.com;
 * matches the precedent in sites/dcs and sites/dj-fox-electrical). Mirrors the approved
 * static prototype's `Archivo:wght@200..600&Fraunces:opsz,wght@9..144,300..600&
 * Newsreader:opsz,wght@6..72,200..500` Google Fonts request — see theme.config.ts's file
 * header comment for the full rationale and the sans/heading token remapping.
 */
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  weight: 'variable',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: 'variable',
  axes: ['opsz'],
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  weight: 'variable',
  axes: ['opsz'],
});

export const metadata: Metadata = {
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
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/logo.svg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${archivo.variable} ${fraunces.variable} ${newsreader.variable}`}
    >
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
              siteName={siteConfig.business.name}
              phoneDisplay={PHONE_DISPLAY}
              phoneTel={PHONE_TEL}
              showPhone={siteConfig.cta.phone.show}
              primaryCta={siteConfig.cta.primary}
              navigation={siteConfig.navigation.main}
              locations={[]}
            />
          }
          footer={
            <SiteFooter
              siteName={siteConfig.business.name}
              tagline={siteConfig.tagline}
              phoneDisplay={PHONE_DISPLAY}
              phoneTel={PHONE_TEL}
              email={BUSINESS_EMAIL}
              address={ADDRESS}
              certifications={siteConfig.credentials?.certifications ?? []}
              services={[]}
              locations={[]}
              totalServices={0}
              totalLocations={0}
              maxServices={0}
              maxLocations={0}
              showServices={false}
              showLocations={false}
              copyright={
                siteConfig.footer?.copyright ??
                `${new Date().getFullYear()} ${siteConfig.business.name}. All rights reserved.`
              }
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
