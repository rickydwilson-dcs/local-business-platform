import "./globals.css";
import type { Metadata, Viewport } from "next";
import { PageShell } from "@platform/core-components";
import { ConsentManager } from "@platform/core-components/components/analytics/ConsentManager";
import { Analytics } from "@platform/core-components/components/analytics/Analytics";
import { AnalyticsDebugPanel } from "@platform/core-components/components/analytics/AnalyticsDebugPanel";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL, ADDRESS } from "@/lib/contact-info";
import { getContentItems } from "@/lib/content";
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
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: siteConfig.business.name,
    url: "/",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: siteConfig.business.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/logo.svg"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [allServices, allLocations] = await Promise.all([
    getContentItems("services"),
    getContentItems("locations"),
  ]);

  const locationItems = allLocations.map((loc) => ({ name: loc.title, slug: loc.slug }));

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
      <body className="min-h-screen flex flex-col bg-surface-background text-surface-foreground antialiased">
        <PageShell
          header={
            <SiteHeader
              siteName={siteConfig.business.name}
              phoneDisplay={PHONE_DISPLAY}
              phoneTel={PHONE_TEL}
              showPhone={siteConfig.cta.phone.show}
              primaryCta={siteConfig.cta.primary}
              navigation={siteConfig.navigation.main}
              locations={locationItems}
              logoWidth={150}
              logoHeight={40}
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
              services={allServices
                .map((s) => ({ slug: s.slug, title: s.title }))
                .slice(0, siteConfig.footer?.maxServices ?? 8)}
              locations={allLocations
                .map((l) => ({ slug: l.slug, title: l.title }))
                .slice(0, siteConfig.footer?.maxLocations ?? 8)}
              totalServices={allServices.length}
              totalLocations={allLocations.length}
              maxServices={siteConfig.footer?.maxServices ?? 8}
              maxLocations={siteConfig.footer?.maxLocations ?? 8}
              showServices={siteConfig.footer?.showServices ?? true}
              showLocations={siteConfig.footer?.showLocations ?? true}
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
