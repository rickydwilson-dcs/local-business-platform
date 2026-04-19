import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/site.config';
import { ThemeProvider } from '@platform/core-components';
import { navagardenRegistry } from '@platform/themes/navagarden';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  metadataBase: new URL(siteConfig.url),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-background text-surface-foreground">
        <ThemeProvider theme="navagarden" registry={navagardenRegistry}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
