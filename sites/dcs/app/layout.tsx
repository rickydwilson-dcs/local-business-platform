import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY, BUSINESS_EMAIL } from "@/lib/contact-info";
import { getContentItems } from "@/lib/content";
import { PageShell, ThemeProvider } from "@platform/core-components";
import { SolarisHeader, SolarisFooter } from "@platform/themes/solaris/components";
import { solarisRegistry } from "@platform/themes/solaris";
import { ConsentManager } from "@platform/core-components/components/analytics/ConsentManager";
import { Analytics } from "@platform/core-components/components/analytics/Analytics";
import { AnalyticsDebugPanel } from "@platform/core-components/components/analytics/AnalyticsDebugPanel";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
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
  const [allServices, allLocations] = await Promise.all([
    getContentItems("services"),
    getContentItems("locations"),
  ]);

  return (
    <html lang="en-GB" className={`${spaceGrotesk.variable} ${inter.variable}`}>
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
        <ThemeProvider theme="solaris" registry={solarisRegistry}>
          <PageShell
            header={
              <SolarisHeader
                logoText="DCS"
                navItems={siteConfig.navigation.main}
                ctaLabel={siteConfig.cta.primary.label}
                ctaHref={siteConfig.cta.primary.href}
                phone={PHONE_DISPLAY}
                showPhone={siteConfig.cta.phone.show}
              />
            }
            footer={
              <SolarisFooter
                logoText="DCS"
                tagline={siteConfig.tagline}
                copyright={siteConfig.footer.copyright}
                navColumns={[
                  {
                    heading: "Services",
                    links: siteConfig.services.map((s) => ({
                      label: s.title,
                      href: `/services/${s.slug}`,
                    })),
                  },
                  {
                    heading: "Locations",
                    links: ["Polegate", "Eastbourne", "Brighton", "Hove", "Lewes", "Seaford"].map(
                      (l) => ({
                        label: l,
                        href: `/locations/${l.toLowerCase()}`,
                      })
                    ),
                  },
                  {
                    heading: "Company",
                    links: [
                      { label: "About", href: "/about" },
                      { label: "Portfolio", href: "/projects" },
                      { label: "Pricing", href: "/pricing" },
                      { label: "Blog", href: "/blog" },
                      { label: "Contact", href: "/contact" },
                    ],
                  },
                ]}
                contact={{
                  phone: PHONE_DISPLAY,
                  email: BUSINESS_EMAIL,
                }}
                legal={{ privacyHref: "/privacy-policy" }}
              />
            }
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
