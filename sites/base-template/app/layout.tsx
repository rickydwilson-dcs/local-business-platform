import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { getContentItems } from '@/lib/content';
import { SiteHeader, PageShell } from '@platform/core-components';
import { Footer } from '@platform/core-components/components/ui/footer';
import { ConsentManager } from "@platform/core-components/components/analytics/ConsentManager";
import { Analytics } from "@platform/core-components/components/analytics/Analytics";
import { AnalyticsDebugPanel } from "@platform/core-components/components/analytics/AnalyticsDebugPanel";

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
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch locations for navigation
  const allLocations = await getContentItems('locations');
  const locationItems = allLocations.map((loc) => ({
    name: loc.title,
    slug: loc.slug,
  }));

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
              appearance="light"
              siteName={siteConfig.name}
              phoneDisplay={PHONE_DISPLAY}
              phoneTel={PHONE_TEL}
              showPhone={siteConfig.cta.phone.show}
              primaryCta={siteConfig.cta.primary}
              navigation={siteConfig.navigation.main}
              locations={locationItems}
            />
          }
          footer={<Footer />}
        >
          {children}
        </PageShell>

        <ConsentManager
          enabled={process.env.NEXT_PUBLIC_FEATURE_CONSENT_BANNER === 'true'}
          config={{
            title: 'We value your privacy',
            description: 'We use cookies to provide a better service and understand how you use our site.',
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
