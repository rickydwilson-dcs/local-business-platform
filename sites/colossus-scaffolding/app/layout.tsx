import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SiteHeader, PageShell, ThemeProvider } from "@platform/core-components";
import { Footer } from "@platform/core-components/components/ui/footer";
import { vegaRegistry } from "@platform/themes/vega";
import { ConsentManager } from "@platform/core-components/components/analytics/ConsentManager";
import { Analytics } from "@platform/core-components/components/analytics/Analytics";
import { AnalyticsDebugPanel } from "@platform/core-components/components/analytics/AnalyticsDebugPanel";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact-info";
import { getContentItems } from "@/lib/content";
import { getAllCounties } from "@/lib/locations";
import { siteConfig } from "@/site.config";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  title: {
    default: siteConfig.business.name,
    template: `%s | ${siteConfig.business.name}`,
  },
  description:
    "Professional scaffolding services across South East England. TG20:21 compliant, CISRS qualified teams with over 15 years experience. Free quotes available.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch locations for navigation
  const allLocations = await getContentItems("locations");
  const locationItems = allLocations.map((loc) => ({
    name: loc.title,
    slug: loc.slug,
  }));
  const counties = await getAllCounties();

  return (
    <html lang="en-GB">
      <head>
        {/* Resource hints for faster external resource loading */}
        <link rel="preconnect" href="https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {/* Geo meta tags for local SEO targeting */}
        <meta name="geo.region" content="GB-ESX" />
        <meta name="geo.placename" content="East Sussex" />
        <meta name="geo.position" content="50.8570;0.5750" />
        <meta name="ICBM" content="50.8570, 0.5750" />
      </head>
      {/* eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Intentional: fallback text color in layout */}
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <ThemeProvider theme="vega" registry={vegaRegistry}>
          <PageShell
            header={
              <SiteHeader
                appearance="light"
                sticky={false}
                siteName={siteConfig.business.name}
                phoneDisplay={PHONE_DISPLAY}
                phoneTel={PHONE_TEL}
                showPhone={siteConfig.cta.phone.show}
                primaryCta={siteConfig.cta.primary}
                navigation={siteConfig.navigation.main}
                counties={counties}
                locations={locationItems}
                logoWidth={180}
                logoHeight={48}
              />
            }
            footer={<Footer />}
          >
            {children}
          </PageShell>
        </ThemeProvider>

        {/* Analytics System - ConsentManager will handle page detection internally */}
        <ConsentManager
          enabled={process.env.NEXT_PUBLIC_FEATURE_CONSENT_BANNER === "true"}
          config={{
            title: "We value your privacy",
            description:
              "We use cookies to provide better services and improve your experience. Choose which cookies to accept.",
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
