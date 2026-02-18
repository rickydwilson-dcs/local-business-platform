import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { getAllCounties } from '@/lib/locations';
import { SiteHeader, PageShell, ThemeProvider } from '@platform/core-components';
import { Footer } from '@platform/core-components/components/ui/footer';
import { orionRegistry } from '@platform/themes/orion';

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
  // Fetch county-grouped locations for desktop mega-menu
  const counties = await getAllCounties();

  // Flatten counties to simple location list for mobile menu
  const locationItems = counties.flatMap((county) =>
    county.towns.map((town) => ({
      name: town.name,
      slug: town.slug,
    }))
  );

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
        <ThemeProvider theme="orion" registry={orionRegistry}>
          <PageShell
            header={
              <SiteHeader
                appearance="dark"
                siteName={siteConfig.name}
                phoneDisplay={PHONE_DISPLAY}
                phoneTel={PHONE_TEL}
                showPhone={siteConfig.cta.phone.show}
                primaryCta={siteConfig.cta.primary}
                navigation={siteConfig.navigation.main}
                counties={counties}
                locations={locationItems}
                maxTownsPerCounty={10}
              />
            }
            footer={<Footer />}
          >
            {children}
          </PageShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
