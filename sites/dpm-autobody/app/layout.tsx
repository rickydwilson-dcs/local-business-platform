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
 * matches the precedent in sites/dcs and sites/dj-fox-electrical).
 *
 * `weight` is a discrete list, not `'variable'` — changed 2026-09-12 after a Lighthouse audit
 * found fonts were the single largest asset category on the homepage (229 KB across 3 files,
 * more than JS or images combined). `weight: 'variable'` downloads the *entire* default weight
 * axis for each family (next/font/google has no way to request a bounded range like the
 * prototype's own `wght@200..600` Google Fonts URL — confirmed against
 * `next/dist/compiled/@next/font/dist/google/index.d.ts`, which only accepts `'variable'` or a
 * discrete weight/array of weights, nothing in between). A discrete list produces one small
 * static-weight file per value instead, at Google's default optical size for that weight —
 * `axes: ['opsz']` cannot be combined with a discrete `weight` (next/font throws "Axes can only
 * be defined for variable fonts when the weight property is nonexistent or set to `variable`",
 * confirmed by a failed production build), so this trades away opsz interpolation for the size
 * win. No visible regression found on inspection of Fraunces/Newsreader usage on this site.
 *
 * The weight lists below are the *exact* set actually used, verified by grepping every
 * `font-heading`/`font-prose` occurrence and its weight class across every `.tsx`/`.mdx` file in
 * this site, then cross-checking the platform-wide weight-class tally against those two counts to
 * find what's left over for Archivo (the default `font-sans`, used everywhere neither of the
 * other two is). Re-run that same grep before adding a new weight anywhere — a missing weight
 * here doesn't error, it silently falls back to a synthetic (browser-faked) bold/thin, which reads
 * as an obviously wrong weight rather than the true drawn one:
 *   grep -rhoE "font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b" \
 *     --include="*.tsx" --include="*.mdx" . | sort | uniq -c
 */
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  weight: ['200', '400', '500', '600', '700'],
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['300'],
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  weight: ['200', '300', '400'],
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
