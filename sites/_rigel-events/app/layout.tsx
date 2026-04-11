import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact-info";
import { PageShell, ThemeProvider } from "@platform/core-components";
import { RigelHeader, SiteFooter } from "@platform/themes/rigel/components";
import { rigelRegistry } from "@platform/themes/rigel";
import { ConsentManager } from "@platform/core-components/components/analytics/ConsentManager";
import { Analytics } from "@platform/core-components/components/analytics/Analytics";
import { AnalyticsDebugPanel } from "@platform/core-components/components/analytics/AnalyticsDebugPanel";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Digital Marketing Weekend is a free two-day conference for small business owners and marketers, held at the Winter Garden, Eastbourne on 17–18 October 2026.",
  keywords: [
    "digital marketing conference",
    "small business marketing",
    "Eastbourne",
    "free marketing event",
    "SEO workshop",
    "social media marketing",
    "AI marketing tools",
  ],
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/logo.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Event site: no services or locations — navigation is event-specific
  const locationItems: Array<{ name: string; slug: string }> = [];

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
        <ThemeProvider theme="rigel" registry={rigelRegistry}>
          <PageShell
            header={
              <RigelHeader
                siteName={siteConfig.business.name}
                phoneDisplay={PHONE_DISPLAY}
                phoneTel={PHONE_TEL}
                showPhone={siteConfig.cta.phone.show}
                primaryCta={siteConfig.cta.primary}
                navigation={siteConfig.navigation.main}
                locations={locationItems}
              />
            }
            footer={<SiteFooter />}
          >
            {children}
          </PageShell>
        </ThemeProvider>

        <ConsentManager
          enabled={process.env.NEXT_PUBLIC_FEATURE_CONSENT_BANNER === "true"}
          config={{
            title: "We value your privacy",
            description:
              "We use cookies to provide a better service and understand how you use our site.",
            privacyPolicyUrl: "/privacy-policy",
            cookiePolicyUrl: "/cookie-policy",
          }}
          reloadOnConsent={false}
        />
        <Analytics
          gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          facebookPixelId={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}
          googleAdsId={process.env.NEXT_PUBLIC_GOOGLE_ADS_CUSTOMER_ID}
          debugMode={process.env.NODE_ENV === "development"}
        />
        <AnalyticsDebugPanel enabled={process.env.NODE_ENV === "development"} />
      </body>
    </html>
  );
}
