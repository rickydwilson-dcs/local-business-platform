import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/site.config';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL, ADDRESS } from '@/lib/contact-info';
import { getAllCounties } from '@/lib/locations';
import { getContentItems } from '@/lib/content';
import { PageShell, ThemeProvider } from '@platform/core-components';
import { OrionHeader, OrionFooter } from '@platform/themes/orion/components';
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
  const [allServices, counties] = await Promise.all([
    getContentItems('services'),
    getAllCounties(),
  ]);

  // Flatten counties to simple location list for mobile menu and footer
  const locationItems = counties.flatMap((county) =>
    county.towns.map((town) => ({
      name: town.name,
      slug: town.slug,
    }))
  );

  const totalLocations = locationItems.length;
  const footerLocations = locationItems
    .slice(0, siteConfig.footer?.maxLocations ?? 8)
    .map((t) => ({ slug: t.slug, title: t.name }));

  return (
    <html lang="en-GB" className={outfit.variable}>
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
              <OrionHeader
                siteName={siteConfig.business.name}
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
            footer={
              <OrionFooter
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
                locations={footerLocations}
                totalServices={allServices.length}
                totalLocations={totalLocations}
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
        </ThemeProvider>
      </body>
    </html>
  );
}
