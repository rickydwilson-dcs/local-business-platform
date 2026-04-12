import type { Metadata, Viewport } from 'next';
import { Work_Sans, Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/site.config';
import { PageShell, ThemeProvider } from '@platform/core-components';
import { CorvusHeader, CorvusFooter } from '@platform/themes/corvus/components';
import { corvusRegistry } from '@platform/themes/corvus';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
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
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${workSans.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider theme="corvus" registry={corvusRegistry}>
          <PageShell
            header={
              <CorvusHeader
                ctaButton={[
                  {
                    label: 'Get Tickets',
                    href: 'https://www.eventbrite.co.uk/e/digital-marketing-weekend-2026',
                  },
                ]}
              />
            }
            footer={
              <CorvusFooter copyrightText="2026 Digital Marketing Weekend. All rights reserved." />
            }
          >
            {children}
          </PageShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
