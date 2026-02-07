import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import './globals.css';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { getContentItems } from '@/lib/content';
import { Footer } from '@/components/ui/footer';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { LocationsDropdown } from '@/components/ui/locations-dropdown';

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
    <html lang="en">
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-primary focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="mx-auto w-full lg:w-[90%] px-4 lg:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="relative h-10 w-40 flex-shrink-0">
                <Image
                  src="/logo.svg"
                  alt={siteConfig.name}
                  fill
                  sizes="160px"
                  priority
                  className="object-contain object-left"
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                {siteConfig.navigation.main.map((item) => {
                  if (item.hasDropdown && locationItems.length > 0) {
                    return (
                      <LocationsDropdown
                        key={item.href}
                        locations={locationItems}
                        label={item.label}
                      />
                    );
                  }
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-gray-700 hover:text-brand-primary transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-4">
                {siteConfig.cta.phone.show && (
                  <Link
                    href={`tel:${PHONE_TEL}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-brand-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-semibold">{PHONE_DISPLAY}</span>
                  </Link>
                )}
                <Link
                  href={siteConfig.cta.primary.href}
                  className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors"
                >
                  {siteConfig.cta.primary.label}
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <MobileMenu
                phoneDisplay={PHONE_DISPLAY}
                phoneTel={PHONE_TEL}
                locations={locationItems}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
